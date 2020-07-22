babel src -d js
browserify js\index.js -o js\index.js
browserify js\maps.js -o js\maps.js
browserify js\postcode.js -o js\postcode.js

