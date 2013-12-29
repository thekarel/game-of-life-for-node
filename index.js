/**
 * GAME OF LIFE IN JAVASCRIPT FOR NODE.JS
 * (c) 2013 Charles Szilagyi http://linkd.in/1dNtFS5 <k@isr.hu>
 *
 * Repo: https://bitbucket.org/thekarel/game-of-life-for-node/overview
 */

/* Configuration this way: */
var SIZE = 15;
var SPEED = 600;
/* Configuration ends. You can't set the seed - yet */


var Grid = require('./Grid');

/**
 * Initialise the Grid
 */
var g = new Grid({size: SIZE});
var cells = g.init();

/**
 * Run the animation forever by printing and ticking forward
 */
function doIt() {
  g.Console.print();
  g.step();
  setTimeout(function() {
    doIt();
  }, SPEED);
}

doIt();