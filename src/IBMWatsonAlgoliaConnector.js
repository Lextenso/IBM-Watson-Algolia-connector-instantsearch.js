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
    if (!window.MediaRecorder && !watsonSpeechMicrophone.isSupported) return;
    this.renderingOptions = connectorRenderingOptions;
    this.config = this.renderingOptions.widgetParams;
    this.configWaston = this.config.watsonConfig;
    delete this.config.watsonConfig;

    this.configWaston.token =  '';
    this.configWaston.outputElement = this.config.container.searchInput;

    this.watsonListening = false;
    this.selfCheck();

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
                    this.stream.stop();
                    this.watsonListening = false;
                    this.switchBtnClassByState('inactive');
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
  }

  switchBtnClassByState(state='active') {
    if(typeof this.config.template.onStateChange === 'function'){
        return this.config.template.onStateChange(state);
    }
    if(state === 'inactive') {
        document.querySelector(this.config.container.voiceButton)
            .classList
            .replace(this.config.template.onActiveClass, this.config.template.onInactiveClass);
    } else if (state === 'active') {
        document.querySelector(this.config.container.voiceButton)
            .classList
            .replace(this.config.template.onInactiveClass, this.config.template.onActiveClass);
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
