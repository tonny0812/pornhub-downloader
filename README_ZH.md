# pornhub-downloader
[View In English](./README.md)  
自动从 [pornhub](https://www.pornhub.com) 一个一个地下载视频.  
![progress](./readme/downloading.png)  
**PS**: 如上图所示， 下载的时候会跳过空文件， 会忽略错误，然后下载下一个视频。 你也可以配置一个比较短的超时时间。 所有这些的处理是为了能下载更多有效的视频。 

![downloads](./readme/files.png)   

**PS**: 下载好的视频直接双击就能播放了! 哈哈哈~~

## 用法
1. 克隆本仓库  
2. 切换到仓库目录  
3. 执行 `nmp install`  
4. 执行 `npm start`  
5. 抽根烟慢慢等吧!(所有视频会下载在 `downloads/` 文件夹)  

PS: 这是用node.js写的程序, 所以在跑程序之前，你需要从node.js的 [官网](https://nodejs.org/en/) 下载并安装好node环境才能运行上述命令。

## 配置
可以修改 `src/config.js` 来改变一些配置参数  
`START_PAGE`: 开始爬取的页数, 默认是 1  
`PAGES`: 你想要爬多少页的数据(每页有20个视频)， 默认是 100  
`SEARCH`: 搜索关键字   
`DOWNLOAD_DIR`: 下载视频的目录。 默认是 'downloads/'  
`TIMEOUT`: 超时时间, 默认是 3 分钟

## 下载速度
1. 下载速度取决于你的网络。
2. 在天朝可能要翻一下（你懂的）。

## TODO
1. <del>关键字搜索</del>  
2. 同时异步下载多个视频

## 为什么
可能有人会问我为什么要写这个东西。 我的回答是： 我喜欢撸代码，我觉得我能从pornhub爬到数据，然后下载视频。所以我就做了。 这可能就是撸代码的一点乐趣吧。

## LICENCE
MIT