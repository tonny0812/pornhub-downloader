const scrapy = require('../lib/scrapy');

const test = async () => {
  try {
    const items = await scrapy.scrapListPage();
    console.log(items);
  } catch (error) {
    console.log(error);
  }
};

test();