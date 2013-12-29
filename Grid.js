/**
 * Grid class, representing a grid plane in the Game of Life
 */

// Required for object cloning
var Utils = require('./Utils');

var Grid = function Grid(options) {

  options = options || {};

  options.size = options.size || 10;

  if (typeof options.Cell == 'undefined') {
    throw 'You must pass the Cell class as Cell in options'
  }

  /**
   * The Grid class to be returned
   * @type {Object}
   */
  var Grid = {
    height: options.size,
    width: options.size,
    Cell: options.Cell,

    /**
     * An array of Cells indexed by coordinates
     * @type {Array}
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
        // Set random initial state for now
        initial = (Math.random() > 0.5) ? true : false;
        Grid.cells[i][ii] = new Grid.Cell({
          initial: initial,
          row: i,
          col: ii,
        });
      }
    }

    return Grid.cells;
  };

  /**
   * Step forward in time (1 tick), update the Cells on the Grid
   * @return {Void}
   */
  Grid.step = function() {
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
    var colCount = 0;
    // Iterate over rows
    Grid.cells.map(function(row) {
      colCount = 0;
      cellsClone[rowCount] = [];
      // Iterate over cells
      row.map(function(cell) {
        var aliveCount = 0;
        /**
         * See below
         */
        var clone;
        /**
         * Get the coordinates for all the neighbours of this Cell
         * @type {Array}
         */
        neighbours = cell.getNeighbourCoords();

        /**
         * Iterate over all the neighbours and count the live Cells
         * @param  {Array} n The neighbour coordinates
         */
        neighbours.map(function(n) {
          var status;

          if(typeof Grid.cells[n[0]] == 'undefined') {
            return;
          }

          if(typeof Grid.cells[n[0]][n[1]] == 'undefined') {
            return;
          }

          if (Grid.cells[n[0]][n[1]].status) {
            aliveCount++;
          }
        }) // end neighbour.map

        /**
         * Make a copy of the current cell since we have to apply the rules
         * to all the cells at the same time - so if we would apply the rule
         * to the existing cell, we would change the fate of it's neighbours
         */
        clone = Utils.clone(cell);

        /**
         * Now it's time to apply the rules of the game
         */
        // Rule 1 and 2: live cell dies
        if(cell.status && (aliveCount < 2 || aliveCount > 3)) {
          clone.status = false;
        }

        // Rule 4: new cell is born
        if(!cell.status && aliveCount === 3) {
          clone.status = true;
        }

        /**
         * Now push the clone into the cell map of the next step
         */
        cellsClone[rowCount][colCount] = clone;

        colCount++;
      }) // end column iteration (1 cell)

      rowCount++;
    }) // End row iteration

    /**
     * Done with the iteration, overwrite the Grid.cells with the cellsClone
     */
    Grid.cells = cellsClone.concat();
    delete cellsClone;

  } // end Grid.step

  /**
   * Print the board to the console
   * @return {Void}
   */
  Grid.Console.print = function() {
    var row = '';
    var cell;
    for(var i = 0; i < Grid.height; i++) {
      for(var ii = 0; ii < Grid.width; ii++) {
        cell = Grid.cells[i][ii];
        row = row + ((cell.status) ? '1 ' : '0 ');
      }
      console.log(row);
      row = '';
    }

    console.log(' ');
  }

  // Return the new object
  return Grid;

}

module.exports = Grid;