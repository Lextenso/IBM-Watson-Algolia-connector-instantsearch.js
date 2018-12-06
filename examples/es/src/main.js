require('file-loader?name=[name].[ext]!./index.html');
import InstantSearch from 'instantsearch.js/es/';
import {
    hits,
    searchBox,
    stats,
    sortBySelector,
    pagination,
    refinementList,
    rangeSlider
} from "instantsearch.js/es/widgets";
import IBMWatsonAlgoliaConnector from '../../../src/index';


app({
  appId: 'latency',
  apiKey: '6be0576ff61c053d5f9a3225e2a90f76',
  indexName: 'instant_search',
  searchParameters: {
    hitsPerPage: 10,
  },
});

function app(opts) {
  const search = InstantSearch({
    appId: opts.appId,
    apiKey: opts.apiKey,
    indexName: opts.indexName,
    routing: true,
    searchFunction: opts.searchFunction,
  });

  search.addWidget(
    searchBox({
      container: '#search-input',
      placeholder: 'Search for products',
    })
  );

  search.addWidget(
    hits({
      container: '#hits',
      templates: {
        item: getTemplate('hit'),
        empty: getTemplate('no-results'),
      },
    })
  );

  search.addWidget(
    stats({
      container: '#stats',
    })
  );

  search.addWidget(
    sortBySelector({
      container: '#sort-by',
      autoHideContainer: true,
      indices: [
        {
          name: opts.indexName,
          label: 'Most relevant',
        },
        {
          name: `${opts.indexName}_price_asc`,
          label: 'Lowest price',
        },
        {
          name: `${opts.indexName}_price_desc`,
          label: 'Highest price',
        },
      ],
    })
  );

  search.addWidget(
    pagination({
      container: '#pagination',
      scrollTo: '#search-input',
    })
  );

  search.addWidget(
    refinementList({
      container: '#category',
      attributeName: 'categories',
      operator: 'or',
      templates: {
        header: getHeader('Category'),
      },
    })
  );

  search.addWidget(
    refinementList({
      container: '#brand',
      attributeName: 'brand',
      operator: 'or',
      searchForFacetValues: {
        placeholder: 'Search for brands',
        templates: {
          noResults: '<div class="sffv_no-results">No matching brands.</div>',
        },
      },
      templates: {
        header: getHeader('Brand'),
      },
    })
  );

  search.addWidget(
    rangeSlider({
      container: '#price',
      attributeName: 'price',
      templates: {
        header: getHeader('Price'),
      },
    })
  );

  search.addWidget(
    refinementList({
      container: '#type',
      attributeName: 'type',
      operator: 'and',
      templates: {
        header: getHeader('Type'),
      },
    })
  );


  search.addWidget(
      IBMWatsonAlgoliaConnector({
          container: {
              searchInput: '#search-input input',
              voiceButton: 'button#mic-watson'
          },
          template: {
              onActiveClass: 'recording',
              onInactiveClass: 'primary',
              onErrorClass: 'error'
          },
          autoHideContainer: '.cta-watson',
          watsonConfig: {
              tokenURL: 'https://local.example.dev/api/watson/get-token',
              model: 'en-US_BroadbandModel'
          }
      })
  );

  search.start();
}

function getTemplate(templateName) {
  return document.querySelector(`#${templateName}-template`).innerHTML;
}

function getHeader(title) {
  return `<h5>${title}</h5>`;
}
