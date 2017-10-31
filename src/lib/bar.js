const utils = require('./utils');
const config = require('../config.json');

/* bar with: min-20, max-120, default-60 */
const width = (config.width > 20 && config.width < 120) ?
  config.barWidth
  :
  60;
const fullChar = config.barFullChar || '=';
const emptyChar = config.barEmptyChar || '-';

const show = (percent, speed) => {
  process.stderr.clearLine(-1);
  process.stderr.write('\r');
  const doneCount = parseInt(width * percent);
  let progressBar = '[';

  for (let i = 0; i < doneCount; i++) {
    progressBar += fullChar;
  }
  for (let i = 0; i < width - doneCount; i++) {
    progressBar += emptyChar;
  }

  const speedStr = utils.getSpeedByBytes(speed);
  progressBar += `]  ${parseInt(percent * 100)}%  ${speedStr}`;
  process.stderr.write(progressBar);
};

const done = () => {
  process.stderr.clearLine(-1);
  process.stderr.write('\r');
  let progressBar = '[';
  for (let i = 0; i < width; i++) {
    progressBar += fullChar;
  }
  progressBar += ']  100%';
  process.stderr.write(progressBar);
  console.log('\n');
};

module.exports = {
  show,
  done
};