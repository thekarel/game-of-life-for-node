/**
 * GAME OF LIFE IN JAVASCRIPT FOR NODE.JS
 * (c) 2013 Charles Szilagyi http://linkd.in/1dNtFS5 <k@isr.hu>
 *
 * Repo: https://bitbucket.org/thekarel/game-of-life-for-node/overview
 */

var fs = require('fs');
var Grid = require('./Grid');
var Console = require('./Grid.Console');

/**
 * CONFIGURATION
 *
 * Speed: Miliseconds between ticks
 * Seed:  A multi line string with . and O notation, see seed/ directory
 *        It's easier to pass the .txt file path to index.js
 *        If empty, a random seed will be used
 * Size:  If no seed given, the random Grid will be this wide and tall
 */
var SPEED = 200;
var SEED = '';
var SIZE = 10;

/**
 * Check if a seed file is supplied and try to read it
 */
if (typeof process.argv[2] !== 'undefined') {
  SEED = fs.readFileSync(process.argv[2], 'utf8');
};

/**
 * Initialise the Grid
 */
var g = new Grid({size: SIZE, seed: SEED, output: new Console});
g.init();

/**
 * Run the animation forever by printing and ticking forward
 */
function doIt() {
  g.print();
  g.step();
  setTimeout(function() {
    doIt();
  }, SPEED);
}

doIt();