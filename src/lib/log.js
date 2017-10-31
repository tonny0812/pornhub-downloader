const colors = require('colors/safe');

// set theme 
colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red'
});

const debug = (msg) => {
  console.log(colors.debug(msg));
};

const error = (msg) => {
  console.log(colors.error(msg));
};

const warn = (msg) => {
  console.log(colors.warn(msg));
};

const info = (msg) => {
  console.log(colors.info(msg));
};

const verbose = (msg) => {
  console.log(colors.verbose(msg));
};

const silly = (msg) => {
  console.log(colors.silly(msg));
};

module.exports = {
  debug,
  error,
  warn,
  info,
  verbose,
  silly
};
