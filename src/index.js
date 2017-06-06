import downloader from './lib/downloader.js';
import pornhub from './lib/pornhub.js';
import { START_PAGE, PAGES, SEARCH, LOG_MODE } from './config';
import Logger from './lib/logger';

const log = new Logger({
  mode: LOG_MODE,
});

const task = async function () {
  try {
    const firstPage = START_PAGE;
    for (let i = firstPage; i <= (firstPage + PAGES); i++) {
      const query = {
        page: i,
        word: SEARCH,
      };
      /* get current page key info */
      const keyInfos = await pornhub.getInfos(query);
      if (keyInfos.length > 0) {
        for (const info of keyInfos) {
          const videoUrl = await pornhub.getDownloadUrlFromKey(info.key);
          if (videoUrl.length > 0) {
            await downloader.downloadFromUrl(videoUrl);
          }
        }
      }
    }
  } catch (err) {
    log.error(err);
  }
};

task();
