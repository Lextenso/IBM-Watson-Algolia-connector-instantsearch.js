import toFactory from 'to-factory';
import connectSearchBox from "instantsearch.js/es/connectors/search-box/connectSearchBox";
import watsonSpeechMicrophone from 'watson-speech/speech-to-text/recognize-microphone';
/**
 * @module lextenso/IBM-watson-algolia-connector-instantsearch.js
 */

 class IBMWatsonAlgoliaConnectorClass {
  constructor(connectorRenderingOptions, isFirstRendering) {
    // Config
    if (!isFirstRendering) return;
    if (!window.MediaRecorder && !watsonSpeechMicrophone.isSupported) {
        this.switchBtnClassByState('error');
        return;
    };
    this.renderingOptions = connectorRenderingOptions;
    this.initConfig().selfCheck();

    this.watsonSSToken().then((token) => {
        if(typeof token !== 'string'){
            throw new Error('WatsonAlgoliaConnectorInstantsearch.js: incorrect token format');
        }
        this.configWaston.token =  token;
        document.querySelector(this.config.container.voiceButton).onclick = () => {
            if(typeof this.watsonListening === 'boolean' && !this.watsonListening){
                this.watsonListening = true;
                this.switchBtnClassByState('active');
                this.stream = watsonSpeechMicrophone(this.configWaston);

                this.stream.on('data', (data) => {
                    var query = document.querySelector(this.config.container.searchInput).value || '';
                    query = query.trim();
                  if(query !== ''){
                      this.renderingOptions.refine(query);
                  }

                  if(typeof this.configWaston.continuous === 'boolean' && !this.configWaston.continuous && typeof data.results[0] !== 'undefined' && typeof data.results[0].final === 'boolean' && data.results[0].final){
                      this.stream.stop();
                      this.watsonListening = false;
                      this.switchBtnClassByState('inactive');
                    }
                });

                this.stream.on('error', (err) => {
                    console.log('error is detected');
                    this.stream.stop();
                    this.watsonListening = false;
                    this.switchBtnClassByState('error');
                    throw new Error(err);
                });

            } else if (typeof this.watsonListening === 'boolean' && this.watsonListening) {
                this.watsonListening = false;
                this.stream.stop();
                this.switchBtnClassByState('inactive');
            } else {
                throw new Error('WatsonAlgoliaConnectorInstantsearch.js: something went wrong.');
            }
        };
    });

    return this;
  }

  selfCheck() {
    if (!this.config || !this.configWaston || !this.configWaston.tokenURL) {
        throw new Error('WatsonAlgoliaConnectorInstantsearch.js: missing required connector config');
    }
     return this;
  }

  initConfig() {
      this.config = this.renderingOptions.widgetParams;
      this.configWaston = this.config.watsonConfig;
      delete this.config.watsonConfig;
      if(typeof this.configWaston.getWatsonToken === 'function'){
          this.config.getWatsonToken = this.configWaston.getWatsonToken ;
      }

      this.configWaston.token =  '';
      this.configWaston.outputElement = this.config.container.searchInput;

      this.watsonListening = false;

      return this;
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
  };

  watsonSSToken() {
    return fetch(this.configWaston.tokenURL)
        .then((res) => {
            return res.text();
      });
  }

};

var IBMWatsonAlgoliaConnector = connectSearchBox(toFactory(IBMWatsonAlgoliaConnectorClass));

export default IBMWatsonAlgoliaConnector;
