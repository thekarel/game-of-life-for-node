/**
 * Game of life in JavaScript for Node.js
 * (c) 2013 Charles Szilagyi <k@isr.hu>
 */

var Grid = require('./Grid');
var Cell = require('./Cell');

var gridOptions = {
  size: 3,
  Cell: Cell, // we inject the Cell class
}

var g = new Grid(gridOptions);
var gCells = g.init();
// g.Console.print();

g.step();