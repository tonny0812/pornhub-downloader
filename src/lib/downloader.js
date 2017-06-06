import http from 'http';
import https from 'https';
import fs from 'fs';
import URL from 'url';
import ProgressBar from 'progress';
import mkdirp from 'mkdirp';
import moment from 'moment';
import Logger from './logger';
import { DOWNLOAD_DIR, LOG_MODE, TIMEOUT } from '../config';

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

  if (!fileName) {
    fileName = `${moment((new Date())).format('YYYYMMDDHHmmss')}.mp4`;
  }
  return fileName;
};

const checkDir = (dir) => {
  const exists = fs.existsSync(dir);
  if (!exists) {
    mkdirp.sync(dir);
  }
};

exports.downloadFromUrl = (url) => {
  const fileName = getFileNameFromUrl(url);
  const preStr = url.slice(0, 5);
  const client = preStr === 'https' ?
    https
    :
    http;
  const pm = new Promise((resolve, reject) => {
    checkDir(DOWNLOAD_DIR);
    const dst = `${DOWNLOAD_DIR}${fileName}`;
    if (fs.existsSync(dst)) {
      log.debug('file has been downloaded, download next one!');
      resolve(true);
    }
    const reqOptions = {
      host: URL.parse(url).host,
      path: URL.parse(url).path,
    };
    const clientReq = client.get(reqOptions, (res) => {
      if (TIMEOUT > 0) {
        res.socket.setTimeout(TIMEOUT);
      }
      const totalLength = parseInt(res.headers['content-length'], 10);
      if (totalLength > 0) {
        res.socket.once('timeout', () => {
          console.log('\n');
          log.warn('timeout!!! download next one!');
          fs.unlinkSync(dst); /* remove unfinished file */
          resolve(true);
        });
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
        console.log('\n');
        log.warn(`skip empty file: ${fileName}`);
        resolve(true);
      }
    });

    clientReq.on('error', (err) => {
      console.log('\n');
      log.warn('timeout!!! download next one!');
      log.error(err.message);
      if (fs.existsSync(dst)) {
        fs.unlinkSync(dst); /* remove unfinished file */
      }
      resolve(true);
    });
  });

  return pm;
};
