

// Decodes the encoded data from the API using the browser's engine
// Referenced from:
// https://stackoverflow.com/questions/1912501/unescape-html-entities-in-javascript
var decodeHTML = function (input) {
  var newElement = document.createElement('div');
  newElement.innerHTML = input;

  // handle case of empty input
  if (newElement.childNodes.length === 0) {
    return '';
  } else {
    return newElement.childNodes[0].nodeValue;
  }
};

// Decode all descriptions of data
for (var wasteElement of WASTE_DATA_JSON) {
  wasteElement.body = decodeHTML(wasteElement.body);
}

// Define the main Vue application
var lookupApp = new Vue({
  // Find the element this app is connected to
  el: '#lookup-app',

  // Variables accessible in the app
  data: {
    searchString: '',
    keywords: [],
    wasteData: WASTE_DATA_JSON,
    filteredResults: []
  },

  // Methods accessible in the app
  methods: {
    // Called on submission of the search form
    // Creates the keywords list and filters results
    searchWaste: function () {
      if (this.searchString === '') {
        // Empty search resets keywords
        this.keywords = [];
      } else {
        // Keywords are space-separated words in the search string
        this.keywords = this.searchString.toLowerCase().split(' ');
        this.numKeys = this.keywords.length;
      }

      this.filteredResults = this.filterResults();
    },

    // Called on change of the search input
    // If the search bar is empty, clear the results
    checkEmpty: function () {
      if (this.searchString === '') {
        // Empty search bar resets keywords and filtered results
        this.keywords = [];
        this.filteredResults = [];
      }
    },

    // Called after keywords changes
    // Filters the results based on the keywords
    filterResults: function () {
      // Empty list if search is empty
      if (this.searchString === '') {
        return [];
      }

      // Otherwise filter based on keywords
      return this.wasteData.filter(function (wasteElement) {
        // Loop through keywords
        for (const keyword of lookupApp.keywords) {
          // Return false if a keyword is not found in title or keywords list
          if (!wasteElement.keywords.toLowerCase().includes(keyword) &&
            !wasteElement.title.toLowerCase().includes(keyword)) {
            return false;
          }
        }

        // All keywords are present
        return wasteElement;
      });
    }
  }
});
