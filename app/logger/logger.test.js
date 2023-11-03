import Logger from './logger';

describe('Logger', () => {
  let consoleLogSpy;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  it('should mock console log with info style', () => {
    Logger.info('This is an info message with params', 'param-1');
    expect(consoleLogSpy).toHaveBeenCalledWith('%cThis is an info message with params', 'color: blue; font-size: 18px');
    expect(consoleLogSpy).toHaveBeenCalledWith('param-1');
  });

  it('should mock console log with error style', () => {
    Logger.error('This is an error message with params', 'param-1');
    expect(consoleLogSpy).toHaveBeenCalledWith('%cThis is an error message with params', 'color: red; font-size: 18px');
    expect(consoleLogSpy).toHaveBeenCalledWith('param-1');
  });
});
