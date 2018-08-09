![](https://img.shields.io/badge/version-0.3.1-green.svg)
![](https://img.shields.io/badge/status-beta-red.svg)
# IBM Watson connector for Algolia InstantSearch.js
IBM Watson connector for Algolia InstantSearch.js allows you to easily add Speech to Text (STT) as a widget to your Algolia search.

![Algolia and watson = love](https://content.lext.so/github/IBM-watson-algolia-connector-instantsearch.js/assets/algolia-waston-love.png)

This repo is initially develop by [Lextenso](https://www.lextenso.fr), open to the community :hearts: and isn't affiliate or support by IBM or Algolia.

__PLEASE NOTE__ : This current version `0.3.1` still be in beta, please use carefully.

## Built with IBM Watson Speech Services
This is a middleware between _Algolia InstantSearch.js_ and _IBM Watson_.
This Algolia connector is bundle with the NPM package `watson-speech/speech-to-text/recognize-microphone` and `instantsearch.js/es/connectors`.

The connector handle :
* Microphone browser authorization
* Stream voice to Watson (via WebSocket)
* Output text results in search input
* Refine Algolia search with new values in realtime

#### Requirements
This connector doesn't inject any templates, you need to develop your own HTML element to trigger Watson with the connector.

You also need [Algolia](https://www.algolia.com/users/sign_up) and [IBM Watson](https://www.ibm.com/watson/services/speech-to-text/) credentials. (_Elementary, my dear Watson_)

## Dependencies

* [`instantsearch.js`](https://github.com/algolia/instantsearch.js/) => 2.10.0
* [`watson-speech`](https://github.com/watson-developer-cloud/speech-javascript-sdk/) => 0.34.2

## Installation

### Standalone
Pre-compiled bundle is available on our CDN (powered by Cloudflare) :

```html
<script type="text/javascript" href="https://content.lext.so/github/IBM-watson-algolia-connector-instantsearch.js/0.3.1/dist/IBMWatsonAlgoliaConnector.js"></script>
```

Or directly by building the connector with Webpack
```console
sher-lock:MyProject$ npm run build
```

### ES Module with Webpack
Pre-compiled bundle is available directly in the /dist directory.

```js
import IBMWatsonAlgoliaConnector from './IBMWatsonAlgoliaConnector';
```

## Configuration
Some configurations are required to the connector to work properly.
Every configuration attributes are details in the [next section](#specifications).

#### Standalone - CDN
```html
<script type="text/javascript" href="https://content.lext.so/github/IBM-watson-algolia-connector-instantsearch.js/0.3.1/dist/IBMWatsonAlgoliaConnector.js"></script>
<script type="text/javascript">
const search = instantsearch(config);

// [...]

search.addWidget(
    IBMWatsonAlgoliaConnector.default({
        container: {
            searchInput: [string],
            voiceButton: [string],
        },
        template: {
            onActiveClass: [string],
            onInactiveClass: [string],
            // OR
            onStateChange: [function (state => 'active' || 'inactive')]
        },
        watsonConfig: {
            tokenURL: [string],
            model: [string],
            continuous: [boolean]
        }
    })
);

// [...]

search.start();
</script>
```

#### NPM - Webpack
```js
import InstantSearch from 'instantsearch.js/es/';
import IBMWatsonAlgoliaConnector from './IBMWatsonAlgoliaConnector';

const search = InstantSearch(config);

// [...]

search.addWidget(
    IBMWatsonAlgoliaConnector({
        container: {
            searchInput: [string],
            voiceButton: [string],
        },
        template: {
            onActiveClass: [string],
            onInactiveClass: [string],
            // OR
            onStateChange: [function (state => 'active' || 'inactive')]
        },
        watsonConfig: {
            tokenURL: [string],
            model: [string],
            continuous: [boolean]
        }
    })
);

// [...]

search.start();
```
## Build examples

Two examples are available : standalone and ES Module.
Each example require an API endpoint to fetch the Watson's token, you can find examples [here](https://github.com/watson-developer-cloud/speech-javascript-sdk/tree/master/examples)

### Standalone

Change the API endpoint to fetch the Watson's token in the `example/standalone/app.js` file.
```js
search.addWidget(
    IBMWatsonAlgoliaConnector.default({
        // [...]
        watsonConfig: {
            tokenURL: 'https://local.example.dev/api/watson/get-token',
            // [...]
        }
    })
);
```
Then
```console
sher-lock:IBM-watson-algolia-connector-instantsearch.js$ npm run build-example
```
That's it.

### ES Module with Webpack
Change the API endpoint to fetch the Watson's token in the `example/es/src/main.js` file.
```js
search.addWidget(
    IBMWatsonAlgoliaConnector({
        // [...]
        watsonConfig: {
            tokenURL: 'https://local.example.dev/api/watson/get-token',
            // [...]
        }
    })
);
```
Then
```console
sher-lock:IBM-watson-algolia-connector-instantsearch.js$ npm run build-example
```
That's it.

## Specifications
<table>
    <tr>
        <th>Attributes</th>
        <th></th>
        <th></th>
        <th>required ?</th>
        <th>Comment</th>
    </tr>
    <tr>
        <td>container</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td></td>
        <td>searchInput</td>
        <td>[string]</td>
        <td>True</td>
        <td>document.querySelector is use in the connector. The value must be a selector.</td>
    </tr>
    <tr>
        <td></td>
        <td>voiceButton</td>
        <td>[string]</td>
        <td>True</td>
        <td>document.querySelector is use in the connector. The value must be a selector.</td>
    </tr>
    <tr>
        <td>template</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td></td>
        <td>onActiveClass</td>
        <td>[string]</td>
        <td>True (if NOT `onStateChange`)</td>
        <td></td>
    </tr>
    <tr>
        <td></td>
        <td>onInactiveClass</td>
        <td>[string]</td>
        <td>True (if NOT `onStateChange`)</td>
        <td></td>
    </tr>
    <tr>
        <td></td>
        <td>onStateChange</td>
        <td>[function (state =&gt; active &vert;&vert;&nbsp;inactive)]</td>
        <td>True (Only if `onInactiveClass` and `onActiveClass` are not enouth for your needs)</td>
        <td>This callback back function is trigger each time the state of Watson change.<br/>
        Possible values: `active|inactive`<br>_NOTE_ : The callback function override `onInactiveClass` and `onActiveClass`</td>
    </tr>
    <tr>
        <td>watsonConfig</td>
        <td></td>
        <td></td>
        <td></td>
        <td>Object configuration of Watson (see [here](http://watson-developer-cloud.github.io/speech-javascript-sdk/master/module-watson-speech_speech-to-text_recognize-microphone.html))<br>_NOTE_ : `token` and `outputElement` are override</td>
    </tr>
    <tr>
        <td></td>
        <td>tokenURL</td>
        <td>[string&vert;URL]</td>
        <td>True</td>
        <td>Must be an URL to a back-end service.</td>
    </tr>
    <tr>
        <td></td>
        <td>model</td>
        <td>[string]</td>
        <td>False</td>
        <td>Check possible values [here](https://www.ibm.com/watson/developercloud/speech-to-text/api/v1/node.html?node#get-model)</td>
    </tr>
    <tr>
        <td></td>
        <td>continuous</td>
        <td>[boolean]</td>
        <td>False</td>
        <td>Watson stop listening when it detect final sentence</td>
    </tr>
</table>

## Todo

* NPM publish
* On start state (default state in case of unsupported browsers)
* Advanced fetch Watson token function (REST API, Auth, etc ...)
* Better cross-browser testing
* Improve documentation

## Author
* Julien Madiot ([@Madi-Ji](https://github.com/Madi-Ji))

---
IBM®, IBM Watson® and Watson™ are United States trademarks owned by International Business Machines Corporation ("IBM") and might also be trademarks or registered trademarks in other countries. ([Copyright and trademark information](https://www.ibm.com/legal/us/en/copytrade.shtml))

Algolia and all other trademarks, service marks, graphics and logos used are trademarks or registered trademarks of Algolia or Algolia’s licensors. ([Acceptable use policy](https://www.algolia.com/policies/acceptable-use))
