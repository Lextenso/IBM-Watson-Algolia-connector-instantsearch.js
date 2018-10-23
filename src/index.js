import connectSearchBox from 'instantsearch.js/es/connectors/search-box/connectSearchBox';
import IBMWatsonAlgoliaConnectorFactory from './IBMWatsonAlgoliaConnector';
import version from './version';

let IBMWatsonAlgoliaConnector = connectSearchBox(IBMWatsonAlgoliaConnectorFactory);
IBMWatsonAlgoliaConnector.version = version;
IBMWatsonAlgoliaConnector.isAvailable = IBMWatsonAlgoliaConnectorFactory.prototype.isAvailable;

module.exports = IBMWatsonAlgoliaConnector;
