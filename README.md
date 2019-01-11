# web-eng-challenge-summer-2019
A web app to search for waste items using the Toronto Waste Wizard database. Created for Shopify's Summer 2019 Web Engineer Challenge.

Here, I highlight the steps I took to complete the challenge and some of the things I encountered along the way.

[Link to challenge](https://cdn.shopify.com/static/web-eng-challenge-summer-2019/index.md)

[Link to live application](https://alan-ma.github.io/web-eng-challenge-summer-2019/)

## Framework Choice – Vue.js
Since this is a fairly small application, I was looking for a lightweight framework that would still allow for dynamic elements and templates. [Vue.js](https://vuejs.org) was easy and fun to work with; I was able to build the application quickly and without much overhead in settings, modules, etc.

The end result ended up having a lot of code in very few files – I could have used the Vue CLI and its Single File Components to split up the application. However, in the interest of speed and simplicity, I settled for this drawback and had [index.html](index.html) and [app.js](app.js) housing most of the code.

## Using Local Data
The first step was to download the [Toronto Waste Wizard database](https://www.toronto.ca/city-government/data-research-maps/open-data/open-data-catalogue/#5ed40494-a290-7807-d5da-09ab6a56fca2) as a JSON file, then start working with that as a local file.

I started with the Excel file and converted it manually to a JSON file, but I later realized that the JSON API actually returned a different dataset. I chose to move ahead with the data from the JSON API, since that would ultimately be the source of data for the live application.

After getting an idea of what the data was, I had a pretty easy process setting up a barebones Vue application. I added basic functionality one at a time, starting with searching and filtering the elements.

## Searching and Filtering
Retrieving a search string and displaying filtered results was really easy thanks to Vue. I decided to take the search string and split it into keywords, so `'cardboard box'` would become an array of `['cardboard', 'box']`.

The filter algorithm I used was just a really simple loop over the elements, checking if the title or description contained all of the keywords used in the keywords array. This wouldn't scale well for thousands of results, but since the number of items in the database was pretty limited (a few hundred) and isn't expected to change significantly, the filter was adequate.

## Displaying Data
The description data retrieved from the API was actually encoded HTML which had to be parsed. The good part about this was that lists and bolded elements already existed. The annoying part was needing to parse all the descriptions twice (once from ampersand characters to ASCII, then another from ASCII to HTML). Vue could help me with the second step, since its `v-bind` template binding automatically renders raw HTML.

The first step of parsing took a while to figure out, since I couldn't see a way to let Vue parse the descriptions twice. I found [an answer](https://stackoverflow.com/questions/1912501/unescape-html-entities-in-javascript) that used the browser to render the descriptions. This is potentially dangerous if the data is untrusted (since it is literally running code in the browser), but I decided to use it since the data was coming from a trusted API.

## Favourite Elements
This was fairly simple to implement since it was essentially another filtered list. I decided to track the titles of the favourited posts (which lacked IDs), and stored those in Local Storage.

At this point I basically had repeat code in the HTML, since the list of results and list of favourites was essentially the same. Thus, I converted that portion into a component [waste-result.js](waste-result.js) and it made things a lot cleaner.

## SVGs and Font
At this point I could start worrying about the looks of the page. At first, I wanted to use [Font Awesome](https://fontawesome.com) for the icons, but then realized I didn't want to load the entire library for one or two icons. The next best solution was to take the SVGs directly and include them into the HTML.

Note: I actually found a magnifying glass and modified it to look more like the one in the [design screenshot](http://cdn.shopify.com/static/web-eng-challenge-summer-2019/design.png).

For the font choice, I had a difficult time choosing one, especially since the 'G' character in the screenshot was fairly unique. I thought that San Francisco was pretty close, and since it isn't open source, I used an adaptation called [Yosemite San Francisco](https://github.com/supermarin/YosemiteSanFranciscoFont).

## CSS
The CSS basically all lives in one file and is fairly messy. Splitting it into different files was definitely an option, but I decided that doing so was just making it more disorganized. For real organization, I would have used separate template files (like Single File Components), keeping things compartmentalized.

The CSS is also not mobile-first, since it uses `max-width` media queries. This came as a result of trying to copy the desktop design first and fixing for responsive design later.

The HTML inside the descriptions came back to haunt me at this stage. Some elements had styles baked into the database, and the CSS took those styles as a higher priority. To overcome these issues, I had to add overrides for them (with the dreaded `!important` tag).

## Conclusion
The Waste Lookup application was a pretty fun project that took me about a day of working on and off. I realized how wonderful it was to tackle a project that had clear guidelines and not getting sidetracked by scope creep.

Thanks for reading!
