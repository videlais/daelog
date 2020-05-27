// Require the 'fs' package
import fs from 'fs';

// Read the "story.json" file using 'utf8' encoding
const storyFile = fs.readFileSync('src/story.json', 'utf8');
// Parse the string into an object
const story = JSON.parse(storyFile);

// Read the "index.html" file using 'utf8' encoding
let indexFile = fs.readFileSync('build/index.ejs', 'utf8');
const cssFile = fs.readFileSync('build/story.css', 'utf8');
const jsFile = fs.readFileSync('build/index.js', 'utf8');

// Swap in the CSS file
indexFile = indexFile.replace(new RegExp(/{{STORY_CSS}}/gi), cssFile);
// Swap in the Babelified JS
indexFile = indexFile.replace(new RegExp(/{{STORY_FORMAT}}/gi), jsFile);

// Add the contents of "index.html" as the 'source'
story.source = indexFile;

// Build a "format.js" file contents
// Convert the 'story' back into a string
const format = 'window.storyFormat(' + JSON.stringify(story) + ');';
// Write the "dist/format.js" file
fs.writeFileSync('dist/format.js', format);

// Write the "docs/format.js" file
fs.writeFileSync('docs/format.js', format);
