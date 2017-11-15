const scrapy = require('./lib/scrapy');
const config = require('./config.json');
const log = require('./lib/log');
const mega = require('./lib/mega')

let page = config.page || 1;
let search = config.search;

const scrapyTaskRun = async () => {
  try {
    while (true) {
      const items = await scrapy.fetchListPage({
        page,
        search
      });
      page++;
      if (items.length > 0) {
        for (const item of items) {
          const ditem = await scrapy.fetchDownloadInfo(item.key);
          if (ditem) {
            ditem.title = item.title;
            const result = await scrapy.downloadVideo(ditem);
            log.info(result);
            await mega.upload(result)
            console.log('\n');
          } else {
            continue;
          }
        }
      } else {
        log.error('can\'t get anything from the web page!');
        process.exit(0);
      }
    }
  } catch (error) {
    log.error(error.message);
    process.exit(0);
  }
};

scrapyTaskRun();
