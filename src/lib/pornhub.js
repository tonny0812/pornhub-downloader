import superagent from 'superagent';
import cheerio from 'cheerio';
import _ from 'lodash';

exports.getInfos = function (query) {
  const baseUrl = 'https://www.pornhub.com/video';
  const page = (query !== undefined && query.page > 0) ?
    query.page
    :
    1;
  const word = (query !== undefined && query.word !== undefined
    && query.word.length > 0) ?
    query.word
    :
    '';
  let url = baseUrl;
  if (word.length > 0) {
    url += `/search?search=${word}&page=${page}`;
  } else {
    url += `?page=${page}`;
  }
  url = encodeURI(url);
  const pm = new Promise((resolve, reject) => {
    superagent.get(url).end((err, res) => {
      if (err) {
        reject(err);
      }
      const $ = cheerio.load(res.text);
      let infos = [];
      $('.videoblock.videoBox').each((idx, element) => {
        const $element = $(element);
        const info = {
          title: $element.find('.img.videoPreviewBg').find('.img').attr('title'),
          imgUrl: $element.find('.img.videoPreviewBg').find('.img').find('img').attr('src'),
          key: element.attribs['_vkey'],
        };
        infos.push(info)
      });
      resolve(infos);
    });
  });
  return pm;
};

const getBestQuality = (infoArr) => {
  let qs = [];
  let ins = [];
  for (const info of infoArr) {
    if (info.videoUrl.length > 0) {
      qs.push(info);
      ins.push(parseInt(info.quality, 10));
    }
  }
  const m = _.max(ins);
  if (m) {
    for (const info of infoArr) {
      if (m === parseInt(info.quality, 10)) {
        return info.videoUrl;
      }
    }
  } else {
    return '';
  }
};

exports.getDownloadUrlFromKey = function (key) {
  const pm = new Promise((resolve, reject) => {
    const pageUrl = `https://www.pornhub.com/view_video.php?viewkey=${key}`;
    superagent.get(pageUrl).end((err, res) => {
      const startIndex = res.text.indexOf('mediaDefinitions');
      const endIndex = res.text.indexOf('video_unavailable_country');
      let str = res.text.substring(startIndex, endIndex);
      str = str.substring(18, str.length - 2);
      try {
        const infoArr = JSON.parse(str);
        resolve(getBestQuality(infoArr));
      } catch (error) {
        reject(error);
      }
    });
  });
  return pm;
};