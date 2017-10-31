const getStrBySecs = (secs) => {
  let str = '0 sec';
  if (secs > 0) {
    const mins = parseInt(secs / 60);
    const modSecs = secs % 60;
    const hours = parseInt(mins / 60);
    const modMins = mins % 60;
    const days = parseInt(hours / 24);
    const modHours = hours % 24;

    if (days) {
      str = `${days} day(s) ${modHours} hour(s)`
        + ` ${modMins} min(s) ${modSecs} sec(s)`;
    } else if (hours) {
      str = `${hours} hour(s) ${modMins} min(s) ${modSecs} sec(s)`;
    } else if (mins) {
      str = `${mins} min(s) ${modSecs} sec(s)`;
    } else {
      str = `${modSecs} sec(s)`;
    }
  }

  return str;
};

const getRoundNum = (num, len=2) => {
  return Math.round(num * Math.pow(10, len)) / Math.pow(10, len);
}

const getSpeedByBytes = (bytes) => {
  let str = '0 bytes/sec';
  if (bytes > 0) {
    const kbs = getRoundNum(bytes / 1024);
    const mbs = getRoundNum(bytes / (1024 * 1024));
    const gbs = getRoundNum(bytes / (1024 * 1024 * 1024));
    
    if (parseFloat(gbs) >= 1) {
      str = `${gbs} Gb/sec`;
    } else if (parseFloat(mbs) >= 1) {
      str = `${mbs} Mb/sec`;
    } else if (parseFloat(kbs) >= 1) {
      str = `${kbs} Kb/sec`;
    } else {
      str = `${bytes} bytes/sec`;
    }
  }

  return str;
};

module.exports = {
  getStrBySecs,
  getSpeedByBytes
};
