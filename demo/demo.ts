import Game from '../src/game';
import { Pattern } from '../src/table';

const blinker: Pattern = [
  [1, 1, 1]
];

const toad: Pattern = [
  [0, 1, 1, 1],
  [1, 1, 1, 0]
];

const patterns: {[key: string]: Pattern} = {
  blinker,
  toad,
}

const gameEl = document.body.querySelector('.game');
const width = gameEl.clientWidth;
const height = gameEl.clientHeight;

const cellWidth = 20;
const cellHeight = 20;

const row = Math.floor(height / cellHeight);
const col = Math.floor(width / cellWidth);

const game = new Game('#game-canvas', {
  width,
  height,
  col,
  row,
  frequency: 100,
});

game.setPattern(patterns.blinker);
game.render();

const startBtn = <HTMLButtonElement>document.querySelector('#start');
const randomBtn = <HTMLButtonElement>document.querySelector('#random');
const patternSelector = <HTMLSelectElement>document.querySelector('#pattern');
const frequencyInput = <HTMLInputElement>document.querySelector('#frequency');

const disabledList = [randomBtn, frequencyInput, patternSelector];

startBtn.addEventListener('click', (() => {
  let pause = true;       // game pause status
  return function() {
    if (pause) {
      game.start();
    } else {
      game.resume();
    }
    pause = !pause; 
    this.innerText = pause ? 'START' : 'PAUSE';
    disabledList.forEach(el => el.disabled = !pause);
  }
})());

randomBtn.addEventListener('click', () => {
  game.setPattern(randomPattern());
  game.render();
});

frequencyInput.addEventListener('input', function() {
  game.frequency = parseInt(this.value);
});

patternSelector.addEventListener('change', function() {
  if (this.value === 'random') {
    randomBtn.style.display = 'inline-block';
    game.setPattern(randomPattern());
    game.render();
  } else if (patterns.hasOwnProperty(this.value)) {
    randomBtn.style.display = 'none';
    game.setPattern(patterns[this.value]);
    game.render();
  };
});

function randomPattern(): Pattern {
  const i = Math.floor(Math.random() * row);
  const j = Math.floor(Math.random() * col);
  const threshold = Math.floor(Math.random() * 100) / 100;
  const pattern = Array.from(
    new Array(i),
    () => Array.from(new Array(j), () => Math.random() < threshold ? 0 : 1)
  );
  return pattern;
}