import http from 'http';
import https from 'https';
import fs from 'fs';
import URL from 'url';
import ProgressBar from 'progress';
import mkdirp from 'mkdirp';
// import moment from 'moment';
import Logger from './logger';
import { DOWNLOAD_DIR, LOG_MODE } from '../config';

const log = new Logger({
  mode: LOG_MODE,
});

const getFileNameFromUrl = (url) => {
  let fileName;
  const pathName = URL.parse(url).pathname;
  if (pathName.indexOf('/') !== -1 && pathName.split('/')
    && pathName.split('/').length >= 2) {
    const arr = pathName.split('/');
    const endPart = arr[arr.length - 1];
    if (endPart.indexOf('.') !== -1) {
      fileName = endPart;
    }
  }

  return fileName;
};

const getFileNameWithRes = (res) => {
  const arr = res.headers['content-type'].split('/');
  const ext = arr[arr.length - 1];
  return `${(new Date()).getTime()}.${ext}`;
};

const checkDir = (dir) => {
  const exists = fs.existsSync(dir);
  if (!exists) {
    mkdirp.sync(dir);
  }
};

exports.downloadFromUrl = (url) => {
  let fileName = getFileNameFromUrl(url);
  const preStr = url.slice(0, 5);
  const client = preStr === 'https' ?
    https
    :
    http;
  const pm = new Promise((resolve, reject) => {
    const reqOptions = {
      host: URL.parse(url).host,
      path: URL.parse(url).path,
    };

    const clientReq = client.get(reqOptions, (res) => {
      if (!fileName) {
        fileName = getFileNameWithRes(res);
      }
      // const now = moment((new Date())).format('YYYYMMDDHHmmss');
      // const dir = `${DOWNLOAD_DIR}${now}/`;
      const dir = `${DOWNLOAD_DIR}`;
      checkDir(dir);
      const dst = dir + fileName;
      const totalLength = parseInt(res.headers['content-length'], 10);
      if (totalLength > 0) {
        const ws = fs.createWriteStream(dst);
        // progress bar
        const barStyle = '[:bar] :current/:total :percent '
          + ':rate/bps :elapsed';
        log.debug(`dowloading ${dst}`);
        console.log();
        const bar = new ProgressBar(barStyle, {
          complete: '=',
          incomplete: '-',
          width: 60,
          total: totalLength,
        });
        // listening receive data event
        res.on('data', (chunk) => {
          ws.write(chunk);
          bar.tick(chunk.length);
        });
        // listening finished event
        res.on('end', () => {
          console.log('\n');
          log.ok(`${dst} downloaded!`);
          ws.end();
          resolve(true);
        });
      } else {
        log.warn(`skip empty file of url: ${url}`);
      }
    });

    clientReq.on('error', (err) => {
      log.warn('Throw an error! Download next one!');
      log.error(err.message);
      // reject(err);
      resolve(true);
    });
  });

  return pm;
};
