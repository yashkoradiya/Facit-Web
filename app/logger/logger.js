export default class Logger {
  static info(message, params) {
    console.log(`%c${message}`, 'color: blue; font-size: 18px');
    if (params) console.log(params);
  }

  static error(message, params) {
    console.log(`%c${message}`, 'color: red; font-size: 18px');
    if (params) console.log(params);
  }
}
