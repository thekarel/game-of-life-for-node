/**
 * Output component for Grid.js, enables writing Grid to the console
 */

var Console = function() {

  this.cell = {
    DEAD: ' ',
    LIVE: 'o'
  };


  /**
   * Set the Grid size so Grid.print knows how large the matrix is
   * Trying to set it up so point 0:0 is in the middle of the screen
   */
  this.setSize = function() {

    /**
     * Check if stdout is available
     */
    if (typeof process.stdout === 'undefined'
         || typeof process.stdout.columns !== 'number') {
       throw 'Console output not available';
    };

    /**
     * Read rows and cols of the console and create a matrix
     * so 0:0 is in the middle of the screen
     * @return {Void}
     */
    var columns = process.stdout.columns;
    columns = Math.floor(columns/2); // we use 2 chars for 1 cell
    if(columns % 2 > 0) columns = columns - 1;

    var rows = process.stdout.rows;
    if(rows % 2 > 0) rows = rows - 1;

    this.minCol = (columns/2) * -1;
    this.maxCol = (columns/2);
    this.minRow = (rows/2) * -1;
    this.maxRow = (rows/2);

  }; // end Grid.setSize

  /**
   * Run the setSize function on object creation
   */
  this.setSize();


  /**
  * Print the board to the console
  * @return {Void}
  */
  this.print = function(cells) {
    /**
    * Holding the visible representation of each row
    * @type {Array}
    */
    var display = [];

    /**
    * Prepare the display of each row
    */
    for(var i = this.minRow; i <= this.maxRow; i++) {
      var thisRow = [];

      for(var ii = this.minCol; ii <= this.maxCol; ii++) {
        if(typeof cells[i] === 'undefined') {
          thisRow.push(this.cell.DEAD);
        } else if(cells[i].indexOf(ii) > -1) {
          thisRow.push(this.cell.LIVE);
        } else {
          thisRow.push(this.cell.DEAD);
        }
      }

      display.push(thisRow.join(' '));
    }

    /**
     * Add an empty screen worth of linebreaks (clear screen)
     */
    var lines = process.stdout.rows;
    for(var ic = 0; ic < lines; ic++) {
        console.log('\r\n');
    }

    /**
     * Push display of one step
     */
    console.log(display.join('\n'));

  }; // end Grid.print

}; // end Console

module.exports = Console;