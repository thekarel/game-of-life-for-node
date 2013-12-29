/**
 * Cell class, representing a cell on the plane
 * @param {Boolean} initial The initial state if the cell
 */
var Cell = function Cell(options) {

  options = options || {};

  var Cell = {
    initial: false,
    row: null,
    col: null,
  };

  /**
   * Only allow true or false as initial status
   */
  if (typeof options.initial !== 'boolean') {
    initial = false;
  };
  Cell.initial = options.initial;

  /**
   * Row and col must be specified as an integer in options
   */
  if (parseInt(options.row) !== options.row || parseInt(options.col) !== options.col ) {
    throw 'You must specify an integer as row and col of the new Cell';
  };
  Cell.row = options.row;
  Cell.col = options.col;

  /**
   * Get the coordinates of all the neighburs
   * @return {Array} The list of neighbur coordinates
   *
   * A B C
   * D # E
   * F G H
   *
   * We have to find the coordinates of A,B,C,D,E,F,G and H
   *
   * The way we do it here will result in coordinates for non existent
   * cells, but that's not a problem, since we can treat these cases as
   * no neighbour at that coordinate.
   */
  Cell.getNeighbourCoords = function() {
    var neighbours = [];

    // A
    neighbours.push([Cell.row-1, Cell.col-1]);
    // B
    neighbours.push([Cell.row-1, Cell.col]);
    // C
    neighbours.push([Cell.row-1, Cell.col+1]);
    // D
    neighbours.push([Cell.row, Cell.col+1]);
    // E
    neighbours.push([Cell.row, Cell.col+1]);
    // F
    neighbours.push([Cell.row+1, Cell.col-1]);
    // G
    neighbours.push([Cell.row+1, Cell.col]);
    // H
    neighbours.push([Cell.row+1, Cell.col+1]);

    return neighbours;

  }

  return Cell;
}

module.exports = Cell;