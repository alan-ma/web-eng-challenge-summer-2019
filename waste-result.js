// Define a new component called waste-result
Vue.component('waste-result', {
  props: ['result', 'isfavourite'],
  template: `
  <div class="result-container">
    <div class="result-favourite">
      <!-- Button toggles favourite by emitting event to parent -->
      <button v-on:click="$emit('toggle-favourite')">
        <!-- Star SVG from FontAwesome -->
        <svg v-bind:class="{ favourite: isfavourite }" class="star" aria-hidden="true" data-prefix="fas" data-icon="star" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"></path></svg>
      </button>
    </div>

    <div class="result-title">
      <p>{{ result.title }}</p>
    </div>

    <p class="result-body" v-html="result.body">
      <!-- v-html displays the raw HTML -->
    </p>
  </div>
  `
});

