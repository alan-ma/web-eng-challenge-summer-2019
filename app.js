

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
    searchString: '', // Search bar input
    keywords: [], // Search string split into keywords
    wasteData: WASTE_DATA_JSON, // Waste lookup data
    filteredResults: [], // Results filtered by keywords
    favourites: [], // Array of favourite results (title strings)
    favouriteResults: [] // Results filtered by favourites
  },

  // Mounted handles loading values from local storage
  mounted() {
    if (localStorage.getItem('favourites')) {
      // Attempt parsing values with JSON
      try {
        this.favourites = JSON.parse(localStorage.getItem('favourites'));
        // If successful, filter favourites
        this.favouriteResults = this.filterFavouriteResults();
      } catch (e) {
        // If there was an error, remove the stored array
        localStorage.removeItem('favourites');
      }
    }
  },

  // Methods accessible in the app
  methods: {
    // Called on submission of the search form
    // Creates the keywords array and filters results
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
      // Empty array if search is empty
      if (this.searchString === '') {
        return [];
      }

      const keywords = this.keywords; // define keys in this scope

      // Otherwise filter based on keywords
      return this.wasteData.filter(function (wasteElement) {
        // Loop through keywords
        for (const keyword of keywords) {
          // Return false if a keyword is not found in title or keywords array
          if (!wasteElement.keywords.toLowerCase().includes(keyword) &&
              !wasteElement.title.toLowerCase().includes(keyword)) {
            return false;
          }
        }

        // All keywords are present
        return wasteElement;
      });
    },

    // Determines if element is a favourite
    isFavourite: function (wasteTitle) {
      return this.favourites.includes(wasteTitle);
    },

    // Toggles the element as a favourite
    toggleFavourite: function (wasteTitle) {
      if (this.isFavourite(wasteTitle)) {
        this.removeFromFavourites(wasteTitle);
      } else {
        this.addToFavourites(wasteTitle);
      }

      // Save favourites to local storage
      this.saveFavourites();
    },

    // Saves the favourite elements in local storage
    saveFavourites: function () {
      // Parse the array into a JSON string
      const parsed = JSON.stringify(this.favourites);
      localStorage.setItem('favourites', parsed);
    },

    // Adds the clicked element to favourites and filters favourites
    addToFavourites: function (wasteTitle) {
      this.favourites.push(wasteTitle);
      // Filter favourites
      this.favouriteResults = this.filterFavouriteResults();
    },

    // Removes the clicked element from favourites and filters favourites
    removeFromFavourites: function (wasteTitle) {
      // Loops over favourites and removes the correct element
      for (var i = 0; i < this.favourites.length; i++) {
        if (wasteTitle === this.favourites[i]) {
          // Use splice to remove element at i-th index
          this.favourites.splice(i, 1);
          // Filter favourites
          this.favouriteResults = this.filterFavouriteResults();
        }
      }
    },

    // Called after favourites changes
    // Filters the favourited results based on the favourites
    filterFavouriteResults: function () {
      // Empty array if favourites is empty
      if (this.favourites.length === 0) {
        return [];
      }

      const favourites = this.favourites; // define keys in this scope

      // Otherwise filter based on favourites
      return this.wasteData.filter(function (wasteElement) {
        // Loop through favourites
        for (const favourite of favourites) {
          // Return element if it matches the favourite
          if (wasteElement.title === favourite) {
            return wasteElement;
          }
        }
      });
    }
  }
});
