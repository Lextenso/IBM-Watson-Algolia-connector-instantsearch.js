/* global instantsearch */

app({
  appId: 'latency',
  apiKey: '6be0576ff61c053d5f9a3225e2a90f76',
  indexName: 'instant_search',
  searchParameters: {
    hitsPerPage: 10,
  },
});

function app(opts) {
  const search = instantsearch({
    appId: opts.appId,
    apiKey: opts.apiKey,
    indexName: opts.indexName,
    urlSync: true,
    searchFunction: opts.searchFunction,
  });

  search.addWidget(
    instantsearch.widgets.searchBox({
      container: '#search-input',
      placeholder: 'Search for products',
    })
  );

  search.addWidget(
    instantsearch.widgets.hits({
      container: '#hits',
      templates: {
        item: getTemplate('hit'),
        empty: getTemplate('no-results'),
      },
    })
  );

  search.addWidget(
    instantsearch.widgets.stats({
      container: '#stats',
    })
  );

  search.addWidget(
    instantsearch.widgets.sortBySelector({
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
    instantsearch.widgets.pagination({
      container: '#pagination',
      scrollTo: '#search-input',
    })
  );

  search.addWidget(
    instantsearch.widgets.refinementList({
      container: '#category',
      attributeName: 'categories',
      operator: 'or',
      templates: {
        header: getHeader('Category'),
      },
    })
  );

  search.addWidget(
    instantsearch.widgets.refinementList({
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
    instantsearch.widgets.rangeSlider({
      container: '#price',
      attributeName: 'price',
      templates: {
        header: getHeader('Price'),
      },
    })
  );

  search.addWidget(
    instantsearch.widgets.refinementList({
      container: '#type',
      attributeName: 'type',
      operator: 'and',
      templates: {
        header: getHeader('Type'),
      },
    })
  );

  search.addWidget(
      IBMWatsonAlgoliaConnector.default({
          container: {
              searchInput: '#search-input input',
              voiceButton: 'button#mic-watson'
          },
          template: {
              onActiveClass: 'recording',
              onInactiveClass: 'primary',
              onErrorClass: 'error'
          },
          watsonConfig: {
              tokenURL: 'https://local.example.dev/api/watson/get-token',
              model: 'en-US_BroadbandModel',
              continuous: false,
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
