import colors from 'colors/safe';

colors.setTheme({
  ok: ['green'],
  warn: ['yellow'],
  debug: ['blue'],
  error: ['red'],
});

class Logger {
  constructor(opts) {
    this.opts = opts || { mode: 'dev' };
  }

  debug(obj) {
    if (this.opts.mode === 'dev') {
      console.log(colors.debug(obj));
    }
  }

  ok(obj) {
    if (this.opts.mode === 'dev') {
      console.log(colors.ok(obj));
    }
  }
  warn(obj) {
    if (this.opts.mode === 'dev') {
      console.log(colors.warn(obj));
    }
  }
  error(obj) {
    if (this.opts.mode === 'dev') {
      console.log(colors.error(obj));
    }
  }
}

export default Logger;
