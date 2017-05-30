import http from 'http';
import https from 'https';
import fs from 'fs';
import urlModule from 'url';
import ProgressBar from 'progress';
import mkdirp from 'mkdirp';
import moment from 'moment';
import { DOWNLOAD_DIR } from '../config';

const URL = urlModule.URL;

const getFileNameFromUrl = (url) => {
  let fileName;
  let myUrl = new URL(url);
  let pathName = myUrl.pathname;
  if (pathName.indexOf('/') !== -1 && pathName.split('/')
    && pathName.split('/').length >= 2) {
    let arr = pathName.split('/');
    let endPart = arr[arr.length - 1];
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

exports.downloadFromUrl = (url, options) => {
  let fileName = getFileNameFromUrl(url);
  const preStr = url.slice(0, 5);
  const client = preStr === 'https' ?
    https
    :
    http;
  const pm = new Promise((resolve, reject) => {
    const clientReq = client.get(url, (res) => {
      if (!fileName) {
        fileName = getFileNameWithRes(res);
      }
      const now = moment((new Date())).format('YYYYMMDDHHmmss');
      const dir = `${DOWNLOAD_DIR}${now}/`;
      checkDir(dir);
      const dst = dir + fileName;
      const ws = fs.createWriteStream(dst);
      const totalLength = parseInt(res.headers['content-length'], 10);
      let downloadedLength = 0;
      // progress bar
      const barStyle = 'downloading [:bar] :current/:total :percent '
        + ':rate/bps :elapsed';
      console.log();
      var bar = new ProgressBar(barStyle, {
        complete: '=',
        incomplete: '-',
        width: 60,
        total: totalLength
      });
      // listening receive data event
      res.on('data', (chunk) => {
        downloadedLength += chunk.length;
        ws.write(chunk);
        bar.tick(chunk.length);
      });
      // listening finished event
      res.on('end', () => {
        console.log('\n');
        console.log('Downloaded file: ' + dst);
        ws.end();
        resolve(true);
      });
    });

    clientReq.on('error', (err) => {
      reject(err);
    });
  });

  return pm;
};
