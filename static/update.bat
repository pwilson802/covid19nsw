babel src -d js
browserify js\index.js -o js\index.js
browserify js\maps.js -o js\maps.js
browserify js\postcode.js -o js\postcode.js


active and recent explanation
try a react polyfill
move maps to a sub template folder

get it working on the server
	schedule scripts to rename data file and run data import and map file
minify the js (job on server?)
move all_nsw to postcode page (rename postcode??)
fix that react key error
make more graphs
	race bar chart
	combo charts
add proptypes in components
maps in react
