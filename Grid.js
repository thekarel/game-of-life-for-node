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
    cells: {},

    /**
     * Console output related logic
     * @type {Object}
     */
    Console: {},
  };


  /**
   * Set the Grid size so Grid.print know how large the matrix is
   * @todo add logic
   */
  Grid.setSize = function() {
    Grid.minRow = 0;
    Grid.maxRow = Grid.height;
    Grid.minCol = 0;
    Grid.maxCol = Grid.width;
  }


  /**
   * Initialise the grid
   * @return {Array} the array of cells
   */
  Grid.init = function() {

    /**
     * Set the grid size for display
     */
    Grid.setSize();

    var initial;
    for(var i = 0; i < Grid.height; i++) {
      Grid.cells[i] = [];
      for(var ii = 0; ii < Grid.width; ii++) {
        // if (ii >= Grid.width/2) {
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
    var living = Grid.stepLiving();
    var newBorns = Grid.stepNewborns();
    var nextStep = {};


    /**
     * Merge the two result sets
     */
    for(var row in living) {
      nextStep[row] = living[row].concat();
    }
    for(var row in newBorns) {
      if(typeof living[row] !== 'undefined') {
        nextStep[row] = newBorns[row].concat(nextStep[row]);
      } else {
        nextStep[row] = newBorns[row].concat();
      }
    }

// console.log('========');
// console.log("living", living);
// console.log("newBorns", newBorns);
// console.log("nextStep", nextStep);

    /**
     * Reset and rebuild the min/max for rows and columns
     */
    // Grid.minRow = 0;
    // Grid.maxRow = Grid.height;
    // Grid.minCol = 0;
    // Grid.maxCol = Grid.width;
    // for(var row in nextStep) {
    //   // console.log("row", row);
    //   if(row < Grid.minRow) Grid.minRow = row;
    //   if(row > Grid.maxRow) Grid.maxRow = row;
    //   nextStep[row].map(function(col) {
    //     if(col < Grid.minCol) Grid.minCol = col;
    //     if(col > Grid.maxCol) Grid.maxCol = col;
    //   });
    // }

    // console.log("Grid", Grid);

    Grid.setSize();

    Grid.cells = nextStep;
  }


  /**
   * Process the living cells and create the next step for them
   * @return {Void} [description]
   */
  Grid.stepLiving = function() {
    /**
     * An empty array which will hold the living cells and will be copied to
     * Grid.cells once we have the status for all cells for the next step.
     * This is required since we have to create the full status of the next
     * step before we can overwrite the old/previous step with it.
     * @type {Array}
     */
    var cellsClone = {};

    // Count rows
    // var rowCount = 0;
    // Iterate over rows
    for(var row in Grid.cells) {
      // Create an empty row in cellsClone
      cellsClone[row] = [];
      // Iterate over cells
      Grid.cells[row].map(function(cell) {

        var neighboursAlive = Grid.getLiveNeighbourCountFor(row, cell);

        /**
         * Now it's time to apply the rules of the game
         *
         * Rule 1 and 2: live cell dies -- so we simply don't add it to the
         * next step
         * Rule 3: Cell kept alive
         */
        if(neighboursAlive < 2 || neighboursAlive > 3) {
          return;
        }

        /**
         * Cell survived, so let's push it into the next step
         */
        cellsClone[row].push(cell)

      }) // end column iteration (1 cell)

      // rowCount++;
    } // End row iteration

    /**
     * Done with the iteration, overwrite the Grid.cells with the cellsClone
     */
// console.log("cellsClone", cellsClone);
    return cellsClone;

  } // end Grid.stepLiving


  /**
   * Process the non living neighbours of living cells to discover newborns
   * @return {Array}  The collection of newborn cells grouped in rows
   */
  Grid.stepNewborns = function() {
    /**
     * Holds the newborns to be returned
     * @type {Array}
     */
    var newBorns = {};
    // Iterate rows
    for (var row in Grid.cells) {

      // Iterate existing cells
      Grid.cells[row].map(function(cell) {

        // Get neighbours of the cell
        var neighbours = Grid.getNeighboursFor(row, cell);

        // Iterate over neighbours
        neighbours.map(function(n) {

          // Skip if this cell is present already in the current step
          // We take care of it in Grid.stepLiving()
          if(typeof Grid.cells[n[0]] !== 'undefined' &&  Grid.cells[n[0]].indexOf(n[1]) > -1) {
            return;
          }

          /**
           * Count the alive neighbours of the cell
           * @type {Integer}
           */
          var neighboursAlive = Grid.getLiveNeighbourCountFor(n[0], n[1]);

          /**
           * Yay! This cell has 3 neighbours (Rule 4), so it turns alive
           */
          if(neighboursAlive === 3) {
            var key = n[0]+''; // make it a string
            if(typeof newBorns[key] === 'undefined') newBorns[key] = [];
            if(newBorns[key].indexOf(n[1]) < 0) {
              newBorns[key].push(n[1])
            }
          }
        });
      });
    };

    return newBorns;

  } // end Grid.stepNewborns

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

    row = parseInt(row);
    col = parseInt(col);


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


  Grid.getLiveNeighbourCountFor = function(row, col) {
    /**
     * Number of neighbours that are alive
     * @type {Number}
     */
    var aliveCount = 0;

    /**
     * Get the coordinates for all the neighbours of this Cell
     * @type {Array}
     */
    neighbours = Grid.getNeighboursFor(row, col);

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

    return aliveCount;

  } // end getLiveNeighbourCountFor


  /**
   * Print the board to the console
   * @return {Void}
   */
  Grid.Console.print = function() {
// console.log("Grid.cells", Grid.cells);
    /**
     * Holding the visible representation of each row
     * @type {Array}
     */
    var display = [];

    /**
     * Prepare the display of each row
     */
    for(var i = Grid.minRow; i <= Grid.maxRow; i++) {
      var thisRow = [];

      // thisRow.push('Row '+i+' >');

      for(var ii = Grid.minCol; ii <= Grid.maxCol; ii++) {
        if(typeof Grid.cells[i] === 'undefined') {
          thisRow.push('.');
        } else if(Grid.cells[i].indexOf(ii) > -1) {
          thisRow.push('X');
        } else {
          thisRow.push('.');
        }
      }

      display.push(thisRow.join(' '));
    }

    console.log(' ');
    console.log(display.join('\n'));
    // console.log(Grid.cells);
  }

  // Return the new object
  return Grid;

}