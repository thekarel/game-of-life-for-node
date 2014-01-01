/**
 * GAME OF LIFE IN JAVASCRIPT FOR NODE.JS
 * (c) 2013 Charles Szilagyi http://linkd.in/1dNtFS5 <k@isr.hu>
 *
 * Repo: https://bitbucket.org/thekarel/game-of-life-for-node/overview
 *
 * Grid class, representing the grid plane in the Game of Life
 */

module.exports = function(options) {

  options = options || {};
  options.size = options.size || 10;
  options.seed = options.seed || '';
  options.output = options.output || 'Console';

  /**
   * The Grid class to be returned
   * @type {Object}
   */
  var Grid = {
    height: options.size,
    width: options.size,
    minRow: 0,
    maxRow: 3,
    minCol: 0,
    maxCol: 3,
    output: options.output,

    seed: options.seed,

    /**
     * An array of Cells indexed by rows then columns
     * @type {Object}
     * @example
     * { '0': [ 4, 5]}
     */
    cells: {},
  };


  /**
   * Initialise the grid by calling the apropriate init function
   */
  Grid.init = function() {

    /**
     * Init from the options.seed or with random
     */
    if (Grid.seed !== '') {
      Grid.initFromSeed(options.seed);
    } else {
      Grid.initRandom();
    }
  }; // end Grid.init


  /**
   * Initialise the Grid with random seed
   * @return {Void}
   */
  Grid.initRandom = function() {
    var initial;
    for(var i = 0; i < Grid.height; i++) {
      Grid.cells[i] = [];
      for(var ii = 0; ii < Grid.width; ii++) {
        if (Math.random() > 0.5) {
          Grid.cells[i].push(ii);
        }
      }
    }
  }; // end Grid.initRandom


  /**
   * Initialise the Grid by mapping the seed string to Grid cells
   * @param  {String} seed The seed string
   * @return {Void}
   * @example
   * An example seed for a glider:
   * ...
   * .O.
   * ..O
   * OOO
   * ...
   */
  Grid.initFromSeed = function(seed) {
    seed = seed.split("\n");

    /**
     * Walk over the lines
     */
    for (var i = 0; i < seed.length; i++) {

      Grid.cells[i] = [];

      /**
       * Skip lines with exclamation marks! -- can be used as comments
       */
      if(/!/.test(seed[i])) {
        continue;
      }

      var line = seed[i].split('');

      /**
       * Process the dots
       */
      for (var ii = 0; ii < line.length; ii++) {
        if (line[ii] === 'O') {
          Grid.cells[i].push(ii);
        };
      };
    }

  } // end Grid.processSeed


  /**
   * Step forward in time (tick), update the Cells on the Grid
   * @return {Void}
   */
  Grid.step = function() {

    if (Object.keys(Grid.cells).length === 0) {
      throw "Can't step without cells - please initialise the Grid!";
    };

    var living = Grid.stepLiving();
    var newBorns = Grid.stepNewborns();
    var nextStep = {};


    /**
     * Merge the two result sets
     */
    for(var row in living) {
      nextStep[row] = living[row].concat();
    }
    for(var rowB in newBorns) {
      if(typeof living[rowB] !== 'undefined') {
        nextStep[rowB] = newBorns[rowB].concat(nextStep[rowB]);
      } else {
        nextStep[rowB] = newBorns[rowB].concat();
      }
    }

    /**
     * Update the cells attached to the Grid
     */
    Grid.cells = nextStep;

  }; // end Grid.step


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

    // Iterate over rows
    for(var row in Grid.cells) {
      // Create an empty row in cellsClone
      cellsClone[row] = [];
      // Iterate over cells
      Grid.cells[row].map(function(cell) {

        // Get the number of living cells next to the cell
        var neighboursAlive = Grid.getLiveNeighbourCountFor(row, cell);

        /**
         * Now it's time to apply the rules of the game
         *
         * Rule 1 and 2: live cell dies -- so we simply don't add it to the
         * next step
         * Rule 3: Cell kept alive
         *
         * (Newborn cells are created in Grid.stepNewborns)
         */
        if(neighboursAlive < 2 || neighboursAlive > 3) {
          return;
        }

        /**
         * Cell survived, so let's push it into the next step
         */
        cellsClone[row].push(cell);

      }); // end column iteration (1 cell)

    } // End row iteration

    /**
     * Done with the iteration, return the array of survived cells
     */
    return cellsClone;

  }; // end Grid.stepLiving


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
              newBorns[key].push(n[1]);
            }
          }
        });
      });
    }

    /**
     * Return the array of newborn cells
     */
    return newBorns;

  }; // end Grid.stepNewborns


  /**
   * Get the coordinates of all neighburs of the cell at given row and column
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

    row = parseInt(row, 10);
    col = parseInt(col, 10);

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

  }; // end Grid.getNeighboursFor


  /**
   * Count the living cells that are neighours of the specified cell
   * @param  {Integer} row
   * @param  {Integer} col
   * @return {Integer}     The number of living neighbours
   */
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
    }); // end neighbour.map

    return aliveCount;

  }; // end Grid.getLiveNeighbourCountFor


  /**
   * Print the current Grid, using Grid.output
   * The output class should have a method named print, accepting the current
   * array of cells
   * @return {Void}
   */
  Grid.print = function() {
    this.output.print(this.cells);
  }; // end Grid.print


  // Return the new object
  return Grid;
};