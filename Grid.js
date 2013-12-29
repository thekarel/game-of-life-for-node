/**
 * Grid class, representing a grid plane in the Game of Life
 */

// Required for object cloning
// var Utils = require('./Utils');

module.exports = function(options) {

  options = options || {};
  options.size = options.size || 10;

  // if (typeof options.Cell == 'undefined') {
  //   throw 'You must pass the Cell class as Cell in options'
  // }

  /**
   * The Grid class to be returned
   * @type {Object}
   */
  var Grid = {
    height: options.size,
    width: options.size,
    // Cell: options.Cell,

    /**
     * An array of Cells indexed by rows then columns
     * @type {Array}
     * @example
     * [[row1col1, row1col2],[row2col1, row2col2]]
     */
    cells: [],

    /**
     * Console output related logic
     * @type {Object}
     */
    Console: {},
  };

  /**
   * Initialise the grid
   * @return {Array} the array of cells
   */
  Grid.init = function() {
    var initial;
    for(var i = 0; i < Grid.height; i++) {
      Grid.cells[i] = [];
      for(var ii = 0; ii < Grid.width; ii++) {
        if (Math.random() > 0.5) {
          Grid.cells[i].push(ii);
        };
      }
    }

    return Grid.cells;
  };

  /**
   * Step forward in time (tick), update the Cells on the Grid
   * @return {Void}
   */
  Grid.step = function() {
    /**
     * Neighbours for 1 cell
     * @type {Array}
     */
    var neighbours = [];
    /**
     * An empty array which will hold the cloned cells and will be copied to
     * Grid.cells once we have the status for all cells for the next step.
     * This is required since we have to create the full status of the next
     * step before we can overwrite the old/previous step with it.
     * @type {Array}
     */
    var cellsClone = [];

    // Count rows
    var rowCount = 0;
    // Count columns
    // var colCount = 0;
    // Iterate over rows
    Grid.cells.map(function(row) {
      // colCount = 0;
      // Create an empty row in cellsClone
      cellsClone[rowCount] = [];
      // Iterate over cells
      row.map(function(cell) {
        var aliveCount = 0;
        /**
         * Make a copy of the current cell since we have to apply the rules
         * to all the cells at the same time - so if we would apply the rule
         * to the "real" cell, we would change the fate of it's neighbours in
         * this very step
         */
        // var clone;
        /**
         * Get the coordinates for all the neighbours of this Cell
         * @type {Array}
         */
        neighbours = Grid.getNeighboursFor(rowCount, cell);

        /**
         * Iterate over all the neighbours and count the live Cells
         * @param  {Array} n The neighbour coordinates as [row,col]
         */
        neighbours.map(function(n) {
          // No such row on the Grid
          if(typeof Grid.cells[n[0]] == 'undefined') {
            return;
          }

          // No such column (cell) in the Row
          if(Grid.cells[n[0]].indexOf(n[1]) < 0) {
            return;
          }

          aliveCount++;
        }) // end neighbour.map

        // clone = Utils.clone(cell);

        /**
         * Now it's time to apply the rules of the game
         *
         * Rule 1 and 2: live cell dies -- so we simply don't add it to the
         * next step
         *
         * @todo Make sure to create new cells if they have more than 3
         * neighbours
         */
        if(aliveCount < 2 || aliveCount > 3) {
          return;
        }

        /**
         * Cell survived, so let's push it into the next step
         */
        cellsClone[rowCount].push(cell)

      }) // end column iteration (1 cell)

      rowCount++;
    }) // End row iteration

    /**
     * Done with the iteration, overwrite the Grid.cells with the cellsClone
     */
    Grid.cells = cellsClone.concat();
    // delete cellsClone;

  } // end Grid.step

  /**
   * Get the coordinates neighburs of the cell at given row and column
   * @param  {Integer} row
   * @param  {Integer} col
   * @return {Array}     The list of neighbour coordinates
   *
   * The # marks the coordinate that was passed:
   *
   * A B C
   * D # E
   * F G H
   *
   * We have to find the coordinates of A,B,C,D,E,F,G and H
   *
   * The way we do it here will result in coordinates for non existent
   * cells, but that's not a problem, since we can treat these cases as
   * no neighbour at that coordinate. Plus we can actually create these cells
   * if they should become alive.
   */
  Grid.getNeighboursFor = function(row, col) {
    /**
     * Hold the neighbours of the cell
     * @type {Array}
     */
    var neighbours = [];

    // A
    neighbours.push([row-1, col-1]);
    // B
    neighbours.push([row-1, col]);
    // C
    neighbours.push([row-1, col+1]);
    // D
    neighbours.push([row, col-1]);
    // E
    neighbours.push([row, col+1]);
    // F
    neighbours.push([row+1, col-1]);
    // G
    neighbours.push([row+1, col]);
    // H
    neighbours.push([row+1, col+1]);

    return neighbours;
  }

  /**
   * Print the board to the console
   * @return {Void}
   */
  Grid.Console.print = function() {
    /**
     * Holding the visible representation of each row
     * @type {Array}
     */
    var display = [];
    /**
     * Find the longest (widest) row
     */
    var longest = Grid.height;
    Grid.cells.map(function(row) {
      if(row.length > longest) longest = row.length;
    })
    // console.log("longest", longest);

    /**
     * Prepare the display of each row
     */
    Grid.cells.map(function(row) {
      var thisRow = [];
      for(var i = 0; i < longest; i++) {
        thisRow.push((row.indexOf(i) > -1) ? '()' : '..');
      }
      display.push(thisRow.join(''));
    })

    console.log(' ');
    console.log(display.join('\n'));

    // var row = '';
    // var cell;
    // for(var i = 0; i < Grid.height; i++) {
    //   for(var ii = 0; ii < Grid.width; ii++) {
    //     cell = Grid.cells[i][ii];
    //     row = row + ((cell.status) ? '1 ' : '0 ');
    //   }
    //   console.log(row);
    //   row = '';
    // }

    // console.log(' ');
  }

  // Return the new object
  return Grid;

}