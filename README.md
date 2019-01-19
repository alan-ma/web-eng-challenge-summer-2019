# web-eng-challenge-summer-2019
A web app to search for waste items using the Toronto Waste Wizard database. Created for Shopify's Summer 2019 Web Engineer Challenge.

Here, I highlight the steps I took to complete the challenge and some of the things I encountered along the way.

[Link to challenge](https://cdn.shopify.com/static/web-eng-challenge-summer-2019/index.md)

[Link to live application](https://alan-ma.github.io/web-eng-challenge-summer-2019/)

## Framework Choice – Vue.js
Since this is a fairly small application, I was looking for a lightweight framework that would still allow for dynamic elements and templates. [Vue.js](https://vuejs.org) was easy and fun to work with; I was able to build the application quickly and without much overhead in settings, modules, etc.

The end result ended up having a lot of code in very few files – I could have used the Vue CLI and its Single File Components to split up the application. However, in the interest of speed and simplicity, I settled for this drawback and had [index.html](index.html) and [app.js](scripts/app.js) housing most of the code.

## Using Local Data
The first step was to download the [Toronto Waste Wizard database](https://www.toronto.ca/city-government/data-research-maps/open-data/open-data-catalogue/#5ed40494-a290-7807-d5da-09ab6a56fca2) as a JSON file, then start working with that as a local file.

I started with the Excel file and converted it manually to a JSON file, but I later realized that the JSON API actually returned a different dataset. I chose to move ahead with the data from the JSON API, since that would ultimately be the source of data for the live application. [Here's more about the way I used the API.](#p.s.-api-usage)

After getting an idea of what the data was, I had a pretty easy process setting up a barebones Vue application. I added basic functionality one at a time, starting with searching and filtering the elements.

## Searching and Filtering
Retrieving a search string and displaying filtered results was really easy thanks to Vue. I decided to take the search string and split it into keywords, so `'cardboard box'` would become an array of `['cardboard', 'box']`.

The filter algorithm I used was just a really simple loop over the elements, checking if the title or description contained all of the keywords used in the keywords array. This wouldn't scale well for thousands of results, but since the number of items in the database was pretty limited (a few hundred) and isn't expected to change significantly, the filter was adequate.

## Displaying Data
The description data retrieved from the API was actually encoded HTML which had to be parsed. The good part about this was that lists and bolded elements already existed. The annoying part was needing to parse all the descriptions twice (once from ampersand characters to ASCII, then another from ASCII to HTML). Vue could help me with the second step, since its `v-bind` template binding automatically renders raw HTML.

The first step of parsing took a while to figure out, since I couldn't see a way to let Vue parse the descriptions twice. I found [an answer](https://stackoverflow.com/questions/1912501/unescape-html-entities-in-javascript) that used the browser to render the descriptions. This is potentially dangerous if the data is untrusted (since it is literally running code in the browser), but I decided to use it since the data was coming from a trusted API.

## Favourite Elements
This was fairly simple to implement since it was essentially another filtered list. I decided to track the titles of the favourited posts (which lacked IDs), and stored those in Local Storage.

At this point I basically had repeat code in the HTML, since the list of results and list of favourites was essentially the same. Thus, I converted that portion into a component [waste-result.js](scripts/waste-result.js) and it made things a lot cleaner.

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

## P.S. API Usage
I was talking to my classmate Rushi (he's a brilliant guy, [check him out!](https://github.com/rushigandhi)) who was also working on this project, and our conversations made me reflect on how I used the Open Data API.

When I first saw the Waste Wizard Lookup Table, I looked at both the Excel and JSON formats. I didn't see any documentation on the API, so I assumed that I was only able to retrieve the entire data set. This led to the design choice of retrieving the data upon loading the page and conducting local searches/filtering later.

However, Rushi noticed a parameter in the JSON call of the database – `?limit=1000` – which could be altered to return different amounts of data. He had suspicions that the server could conduct search queries using some sort of additional parameter. This piqued my interest since I was aware that searching for "takeout" on my application returned different results from the [design document](http://cdn.shopify.com/static/web-eng-challenge-summer-2019/design.png) (my query had an additional item).

After trying many parameters like `?limit=1000&keywords=takeout`, I had no success (`search=`, `query=`, adding quotes, etc.). I managed to deduce that the server would return some default set of 30 items if the parameters had errors (or if no parameters were entered at all). I was out of ideas.

This was when Rushi's genius came into play – he thought of inspecting the network while using the official [Waste Wizard app](https://www.toronto.ca/services-payments/recycling-organics-garbage/waste-wizard/) to see what kind of API calls it was making; unfortunately, he didn't find anything significant. After a lot more digging around, I managed to find a file that the app received every time it was loaded: `swm_waste_wizard_APR` – this was the entire database from the JSON API. Coupled with another script I found called `search.js` that seemed to be filtering results locally, I concluded that the Waste Wizard app was doing its own searches on the data set and that the server didn't support searches.

TLDR; the method that I used to retrieve data and return search results was probably the only way to use the Waste Wizard Lookup Table. However, what happens if the server was able to conduct searches and return filtered results? Another option would've been to make an API call every time a search was needed, which wouldn't require loading the entire JSON object at the start.

After some thinking, I decided that given the size of the database (less than 200 elements and about 200KB in size), it would be more user-friendly to download all the data upon the initial page load. This means that searches and filtering wouldn't require a reliable Internet connection, so in cases where a user walks into an area without WiFi (say a garage with waste bins), the app would still be able to perform searches.
