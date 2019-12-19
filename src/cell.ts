import Game from './game';

enum Status {
  Dead = 0,
  Live,
}

class Cell {
  public game: Game;
  public width: number;
  public height: number;
  public borderWidth: number;
  public status: Status;
  public oldStatus: Status;
  public i: number;
  public j: number;

  constructor(game: Game, status: number, i: number, j: number) {
    this.game = game;
    this.width = this.game.cellWidth;
    this.height = this.game.cellHeight;
    this.borderWidth = Math.max(Math.floor(Math.max(this.width, this.height) / 10), 1);
    this.status = status;
    this.oldStatus = status;
    this.i = i;
    this.j = j;
  }

  render() {
    const ctx = this.game.ctx;
    ctx.save();    
    if (this.status === Status.Live) {
      ctx.fillStyle = '#333333';
    } else {
      ctx.fillStyle = '#cccccc';
    }
    ctx.fillRect(
      this.j * this.width + this.borderWidth + this.game.offsetLeft,
      this.i * this.height + this.borderWidth + this.game.offsetTop,
      this.width - this.borderWidth * 2,
      this.height - this.borderWidth * 2);
    ctx.restore();
    this.oldStatus = this.status;
  }

  update() {
    const grid = this.game.table.grid;
    const arroundLive = this.arroundStats();
    
    if (this.status === Status.Live) {
      if (arroundLive < 2 || arroundLive > 3) {
        this.dead();
      }
    } else {
      if (arroundLive === 3) {
        this.live();
      }
    }
  }

  arroundStats(): number {
    const grid = this.game.table.grid;
    const row = this.game.table.row;
    const col = this.game.table.col;
    let live: number = 0;

    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        if (i === 0 && j === 0) { continue }
        const nextI = this.i + i;
        const nextJ = this.j + j;
        if (nextI >= 0 && nextJ >= 0 && nextI < row && nextJ < col) {
          const cell = grid[nextI][nextJ];
          if (cell.oldStatus === Status.Live) {
            live++
          }
        }
      }
    }
    return live;
  }

  dead() {
    this.status = Status.Dead;
  }

  live() {
    this.status = Status.Live;
  }

  init(status: Status) {
    this.status = status;
    this.oldStatus = status;
  }
}

export {
  Cell,
  Status,
};