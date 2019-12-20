import { Game, defaultOptions } from '../src/game';
import { Table } from '../src/table';

// append a canvas to document body
const canvas = document.createElement('canvas');
canvas.id = 'canvas';
document.body.appendChild(canvas);

// mock
HTMLCanvasElement.prototype.getContext = jest.fn();
jest.mock('../src/table');

test('constructor without options', () => {
  const game = new Game('#canvas');
  expect(game.row).toBe(defaultOptions.row);
  expect(game.col).toBe(defaultOptions.col);
  expect(game.width).toBe(defaultOptions.width);
  expect(game.height).toBe(defaultOptions.height);
  expect(game.frequency).toBe(defaultOptions.frequency);
  expect(Table).toHaveBeenCalled();
});

test('constructor with empty options object', () => {
  const game = new Game('#canvas', {});
  expect(game.row).toBe(defaultOptions.row);
  expect(game.col).toBe(defaultOptions.col);
  expect(game.width).toBe(defaultOptions.width);
  expect(game.height).toBe(defaultOptions.height);
  expect(game.frequency).toBe(defaultOptions.frequency);
  expect(Table).toHaveBeenCalled();
});

test('set option', () => {
  const row = 3;
  const col = 3;
  const width = 30;
  const height = 30;
  const frequency = 1000;

  const game = new Game('#canvas', {row, col, width, height, frequency });
  expect(game.row).toBe(row);
  expect(game.col).toBe(col);
  expect(game.width).toBe(width);
  expect(game.height).toBe(height);
  expect(game.frequency).toBe(frequency);
});

describe('test methods', () => {
  let game: Game = null;
  beforeEach(() => {
    game = new Game('#canvas', {});
    jest.useFakeTimers();
  });

  test('setPattern', () => {
    game.setPattern([]);
    expect(game.table.setPattern).toHaveBeenCalled();
  });
  
  test('render', () => {
    const result = game.render();
    expect(game.table.render).toHaveBeenCalled();
    expect(result).toBe(game);
  });

  test('update', () => {
    const result = game.update();
    expect(game.table.update).toHaveBeenCalled();
    expect(result).toBe(game);
  });

  test('start', () => {
    const result = game.start();
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), game.frequency);
    expect(result).toBe(game);
  });

  test('stop', () => {
    game.start();
    const result = game.stop();
    jest.advanceTimersByTime(game.frequency);
    expect(clearTimeout).toHaveBeenCalled();
    expect(result).toBe(game);
  });
});