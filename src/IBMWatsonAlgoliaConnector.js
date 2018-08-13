import {connectSearchBox} from "instantsearch.js/es/connectors";
import watsonSpeechMicrophone from 'watson-speech/speech-to-text/recognize-microphone';
/**
 * @module lextenso/IBM-watson-algolia-connector-instantsearch.js
 */

var IBMWatsonAlgoliaConnector = connectSearchBox((connectorRenderingOptions, isFirstRendering) => {
    if (!isFirstRendering) return;
    if (!window.MediaRecorder && !watsonSpeechMicrophone.isSupported) return;

    // Config
    let config = connectorRenderingOptions.widgetParams;
    let configWaston = config.watsonConfig;

    configWaston.token =  '';
    configWaston.outputElement = config.container.searchInput;

    var stream;
    let watsonListening = false;

    if (!config || !configWaston || !configWaston.tokenURL) {
        throw new Error('WatsonAlgoliaConnectorInstantsearch.js: missing required connector config');
    }

    let switchBtnClassByState = (state='active') => {
        if(state === 'inactive') {
            document.querySelector(config.container.voiceButton).classList.replace(config.template.onActiveClass, config.template.onInactiveClass);
        } else if (state === 'active') {
            document.querySelector(config.container.voiceButton).classList.replace(config.template.onInactiveClass, config.template.onActiveClass);
        }
        return true;
    };

    if(typeof config.template.onStateChange === 'function'){
        switchBtnClassByState = config.template.onStateChange;
    }

    const watsonSSToken = () => {
        return fetch(configWaston.tokenURL)
        .then((res) => {
            return res.text();
        });
    }

    watsonSSToken().then((token) => {
        if(typeof token !== 'string'){
            throw new Error('WatsonAlgoliaConnectorInstantsearch.js: incorrect token format');
        }
        configWaston.token = token;
        document.querySelector(config.container.voiceButton).onclick = () => {
            if(typeof watsonListening === 'boolean' && !watsonListening){
                watsonListening = true;
                switchBtnClassByState('active');
                stream = watsonSpeechMicrophone(configWaston);
                stream.on('data', (data) => {
                    var query = document.querySelector(config.container.searchInput).value || '';
                    query = query.trim();
                    connectorRenderingOptions.refine(query);

                    if(typeof configWaston.continuous === 'boolean' && !configWaston.continuous && typeof data.results[0].final === 'boolean' && data.results[0].final){
                        stream.stop();
                        watsonListening = false;
                        switchBtnClassByState('inactive');
                    }
                });
                stream.on('error', function(err) {
                    throw new Error(err);
                    stream.stop();
                    watsonListening = false;
                    switchBtnClassByState('inactive');
                });

            } else if (typeof watsonListening === 'boolean' && watsonListening) {
                watsonListening = false;
                stream.stop();
                switchBtnClassByState('inactive');
            } else {
                throw new Error('WatsonAlgoliaConnectorInstantsearch.js: something went wrong');
            }
        };
    });
});

export default IBMWatsonAlgoliaConnector;
