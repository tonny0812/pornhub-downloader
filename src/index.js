import downloader from './lib/downloader.js';
import pornhub from './lib/pornhub.js';
import { START_PAGE, PAGES, SEARCH, DOWNLOAD_DIR } from './config';

const task = async function () {
  try {
    let firstPage = START_PAGE;
    for (let i = firstPage; i <= (firstPage + PAGES); i++) {
      const query = {
        page: i,
        word: SEARCH,
      };
      /* get current page key info */
      const keyInfos = await pornhub.getInfos(query);
      for (const info of keyInfos) {
        const videoUrl = await pornhub.getDownloadUrlFromKey(info.key);
        const ok = await downloader.downloadFromUrl(videoUrl);
        if (ok !== true) {
          continue;
        }
      }
    }
  } catch (error) {
    console.log(erro);
  }
};

task();