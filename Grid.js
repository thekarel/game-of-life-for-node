/**
 * Grid class, representing a grid plane in the Game of Life
 */

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
    var nextStep;
    var neighbours = [];

    // Iterate over rows
    Grid.cells.map(function(row) {
      // Iterate over cells
      row.map(function(cell) {
        var aliveCount = 0;
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
         * Now it's time to apply the rules of the game
         */
        console.log(cell);

      }) // end row.map


    })

  }

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
  }

  // Return the new object
  return Grid;

}

module.exports = Grid;