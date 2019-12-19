import Game from './game';
import { Cell, Status } from './cell';

interface TableOptions {
  game: Game,
  row: number,
  col: number,
}

type Pattern = number[][];

class Table {
  public game: TableOptions['game'];
  public row: TableOptions['row'];
  public col: TableOptions['col'];
  public grid: Cell[][];

  constructor(options: TableOptions) {

    this.game = options.game;
    this.row = options.row;
    this.col = options.col;
    this.grid = Array.from(
      new Array(options.row),
      (row, i) => Array.from(new Array(options.col), (cell, j) => new Cell(this.game, Status.Dead, i, j))
    );
  }

  render() {
    this.grid.forEach(row => {
      row.forEach(cell => cell.render());
    });
  }

  update() {
    this.grid.forEach(row => {
      row.forEach(cell => cell.update());
    });
  }

  resetGrid(): void {
    this.grid.forEach(row => row.forEach(col => col.init(Status.Dead)))
  }

  public setPattern(pattern: Pattern): boolean {
    this.resetGrid();
    
    // init pattern
    if (!pattern || pattern.length <= 0 || pattern[0].length < 0) {
      return false;
    }
    const m = pattern.length;
    const n = pattern[0].length;
    if (m > this.row || n > this.col) {
      return false;
    }

    const rowStartIndex = Math.floor((this.row - m) / 2);
    const colStartIndex = Math.floor((this.col - n) / 2);

    pattern.forEach((row, i) => {
      row.forEach((col, j) => {
        if (col > 0) {
          this.grid[rowStartIndex + i][colStartIndex + j].init(Status.Live);
        }
      });
    });
    return true;
  }
}

export {
  Table,
  Pattern,
};