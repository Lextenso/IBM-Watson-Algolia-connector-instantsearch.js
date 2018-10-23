import toFactory from 'to-factory';
import watsonSpeechMicrophone from 'watson-speech/speech-to-text/recognize-microphone';

class IBMWatsonAlgoliaConnectorClass {
    constructor(connectorRenderingOptions, isFirstRendering) {
        if (!isFirstRendering) return;

        this.name = 'WatsonAlgoliaConnectorInstantsearch.js';
        this.renderingOptions = connectorRenderingOptions;
        this.config = this.renderingOptions.widgetParams;

        if(!this.isAvailable()){
            return;
        }

        this.initialize();

        if(!this.configWaston.tokenURL && !this.config.getWatsonToken){
            throw new Error(this.name + ': Missing Watson token config');
        }

        this.watsonSSToken().then((token) => {
            if(typeof token !== 'string'){
                throw new Error(this.name + ': Incorrect token format');
            }
            this.configWaston.token =  token;
            var triggerButton = document.querySelector(this.config.container.voiceButton);
            triggerButton.addEventListener('click', this.startWatson.bind(this));
        });

        return this;
    }

    isAvailable() {
        var isAvailable = (typeof window.MediaRecorder === 'function' && watsonSpeechMicrophone.isSupported);
        if (!isAvailable && typeof this.config !== 'undefined') {
            if(typeof this.config.autoHideContainer === 'boolean' && this.config.autoHideContainer){
                document.querySelector(this.config.container.voiceButton).style.display = 'none';
            } else if (typeof this.config.autoHideContainer === 'string'){
                document.querySelector(this.config.autoHideContainer).style.display = 'none';
            } else {
                this.switchBtnClassByState('error');
            }
        }
        return isAvailable;
    }

    initialize() {
        if (!this.renderingOptions || !this.renderingOptions.widgetParams.watsonConfig || !this.renderingOptions.widgetParams.template || !this.renderingOptions.widgetParams.container) {
            throw new Error(this.name + ': Missing required connector config.');
        }

        this.configWaston = this.config.watsonConfig;
        delete this.config.watsonConfig;

        if(typeof this.configWaston.getWatsonToken === 'function'){
            this.config.getWatsonToken = this.configWaston.getWatsonToken;
        } else if (!this.configWaston.getWatsonToken && !this.configWaston.tokenURL){
            throw new Error(this.name + ': Missing required watson config.');
        }
        if(!this.config.container.searchInput || !this.config.container.voiceButton){
            throw new Error(this.name + ': Missing required container config.');
        }

        this.configWaston.token =  '';
        this.configWaston.outputElement = this.config.container.searchInput;

        this.watsonListening = false;

        return this;
    }

    watsonSSToken() {
        if(typeof this.config.getWatsonToken === 'function'){
            return Promise.resolve(this.config.getWatsonToken());
        }
        return fetch(this.configWaston.tokenURL)
        .then((res) => {
            return res.text();
        }).catch((err) => {
            this.switchBtnClassByState('error');
            return false;
        });
    }

    startWatson() {
        if(typeof this.watsonListening === 'boolean' && !this.watsonListening){
            this.onWatsonStart();
            this.stream = watsonSpeechMicrophone(this.configWaston);

            this.stream.on('data', this.onWatsonData.bind(this));
            this.stream.on('error', this.onWatsonError.bind(this));

        } else if (typeof this.watsonListening === 'boolean' && this.watsonListening) {
            this.onWatsonStop();
        } else {
            throw new Error(this.name + ': Something went wrong.');
        }
    }

    onWatsonStart(){
        this.watsonListening = true;
        this.switchBtnClassByState('active');
    }

    onWatsonData(data) {
        var query = document.querySelector(this.config.container.searchInput).value || '';
        query = query.trim();
        if(query !== ''){
            this.renderingOptions.refine(query);
        }

        if(typeof data.results[0] !== 'undefined' && typeof data.results[0].final === 'boolean' && data.results[0].final){
            if(typeof this.configWaston.continuous === 'boolean' && !this.configWaston.continuous){
                this.onWatsonStop();
            }
        }
    }

    onWatsonStop(){
        this.watsonListening = false;
        this.stream.stop();
        this.switchBtnClassByState('inactive');
    }

    onWatsonError(err){
        this.stream.stop();
        this.watsonListening = false;
        this.switchBtnClassByState('error');
        throw new Error(err);
    }

    switchBtnClassByState(state='active') {
        if(typeof this.config.template.onStateChange === 'function'){
            return this.config.template.onStateChange(state);
        }
        const containerClassList = document.querySelector(this.config.container.voiceButton).classList;
        if(typeof this.config.template.onErrorClass !== 'undefined' && containerClassList.contains(this.config.template.onErrorClass)){
            containerClassList.remove(this.config.template.onErrorClass)
        }
        if(state === 'inactive' || (state === 'error' && typeof this.config.template.onErrorClass === 'undefined')) {
            if(containerClassList.contains(this.config.template.onActiveClass)){
                containerClassList.replace(this.config.template.onActiveClass, this.config.template.onInactiveClass);
            } else {
                containerClassList.add(this.config.template.onInactiveClass);
            }
        } else if (state === 'active') {
            if(containerClassList.contains(this.config.template.onInactiveClass)){
                containerClassList.replace(this.config.template.onInactiveClass, this.config.template.onActiveClass);
            } else {
                containerClassList.add(this.config.template.onActiveClass);
            }
        } else if(state === 'error' && typeof this.config.template.onErrorClass === 'string'){
            if(containerClassList.contains(this.config.template.onActiveClass)){
                containerClassList.remove(this.config.template.onActiveClass)
            }
            if(containerClassList.contains(this.config.template.onInactiveClass)){
                containerClassList.remove(this.config.template.onInactiveClass)
            }
            containerClassList.add(this.config.template.onErrorClass);
        }
        return true;
    }

}

export default toFactory(IBMWatsonAlgoliaConnectorClass);
