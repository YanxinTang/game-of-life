import { Table, Pattern } from './table';

interface GameOptions {
  row?: number;
  col?: number;
  width?: number;
  height?: number;
  frequency?: number;
}

const defaultOptions: GameOptions = {
  row: 25,
  col: 25,
  width: 500,
  height: 500,
  frequency: 1000,
}

class Game {
  public ctx: CanvasRenderingContext2D;
  public table: Table;
  public error: boolean;
  public width: GameOptions['width'];
  public height: GameOptions['height'];
  public cellWidth: number;
  public cellHeight: number;
  public row: number;
  public col: number;
  public offsetTop: number;
  public offsetLeft: number;
  public frequency: number;
  private tick: NodeJS.Timeout;

  constructor(selector: string, options: GameOptions = defaultOptions) {
    const o = {...defaultOptions, ...options};

    const canvas: HTMLCanvasElement = document.body.querySelector(selector);
    if (canvas === null) {
      this.error = true;
      console.error(`There's no element matches selector '${selector}'`);
      return;
    }
  
    canvas.width = o.width;
    canvas.height = o.height;

    this.cellWidth = Math.floor(o.width / o.col);
    this.cellHeight = Math.floor(o.height / o.row);

    this.width = o.width;
    this.height = o.height;

    this.row = o.row;
    this.col = o.col;

    this.offsetTop = Math.floor((this.height - this.cellHeight * this.row) / 2);
    this.offsetLeft = Math.floor((this.width - this.cellWidth * this.col) / 2);

    this.table = new Table({ game: this, row: o.row, col: o.col });
    this.ctx = canvas.getContext('2d');
    this.frequency = o.frequency;
  }

  setPattern(pattern: Pattern): boolean {
    return this.table.setPattern(pattern);
  }

  render(): Game {
    this.table.render();
    return this;
  }

  public update(): Game {
    this.table.update();
    return this;
  }

  public start(): Game {
    if (this.error) { return this; }
    this.update();
    this.render();
    this.tick = setTimeout(() => {
      this.start();
    }, this.frequency);
    return this;
  }

  public stop(): Game {
    clearTimeout(this.tick);
    return this;
  }
}

export { Game, defaultOptions };