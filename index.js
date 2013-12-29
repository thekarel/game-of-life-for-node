/**
 * GAME OF LIFE IN JAVASCRIPT FOR NODE.JS
 * (c) 2013 Charles Szilagyi <k@isr.hu>
 *
 * For rules and background, see
 * http://conwaylife.com/wiki/Conway%27s_Game_of_Life
 *
 * Summary:
 *
 * The universe of the Game of Life is an infinite two-dimensional orthogonal
 * grid of square cells, each of which is in one of two possible states, live
 * or dead. Every cell interacts with its eight neighbours, which are the
 * cells that are directly horizontally, vertically, or diagonally adjacent.
 * At each step in time, the following transitions occur:
 *
 *   Any live cell with fewer than two live neighbours dies, as if by needs
 *   caused by underpopulation.
 *
 *   Any live cell with more than three live neighbours dies, as if by
 *   overcrowding.
 *
 *   Any live cell with two or three live neighbours lives, unchanged, to the
 *   next generation.
 *
 *   Any dead cell with exactly three live neighbours cells will come to life.
 */

var Grid = require('./Grid');

/**
 * Initialise the Grid
 * @type {Grid}
 */
var g = new Grid({size: 6});

var cells = g.init();

function doIt() {
  g.step();
  g.Console.print();
  // console.log("g.cells", g.cells);
  setTimeout(function() {
    doIt();
  }, 600);
}

doIt();