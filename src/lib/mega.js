var fs = require('fs');
var path = require('path');
var mega = require('mega');
var ProgressBar = require('progress');

var session = {
    email: "992658560@qq.com",
    password: "guo123456",
    keepalive: false
};


function mkdir(name, target) {
    var storage = mega(session);
    storage.mkdir(name, function(err, file) {
        if (err) throw err
        console.log('\nCreated', file.name)
    })
}

function upload(filepath, target) {
    var pm = new Promise(function(resolve, reject) {
        var storage = mega(session);
        var up = storage.upload({
            name: path.basename(filepath),
            // target: target,
            size: fs.statSync(filepath).size // removing this causes data buffering.
        },
          // fs.readFileSync(filepath),
        function(err, file) {
            if (err) {
              deleteFile(filepath);
              return resolve('error');
            }
            console.log('\nUploaded', file.name, file.size + 'B')
            
            file.link(function(err, link) {
              if (err) {
                deleteFile(filepath);
                return resolve('error');
              }
              console.log('Download from:', link)
            })
        })
        
        fs.createReadStream(filepath).pipe(up)
        
        var bar
        up.on('progress', function (stats) {
          if (!bar) bar = new ProgressBar('Uploading [:bar] :percent :etas', {
            total: stats.bytesTotal,
            width: 50
          })
          bar.tick(stats.bytesLoaded - bar.curr)
        })
        up.on('complete', function() {
          bar.tick();
          deleteFile(filepath);
          return resolve('done');
        })
    });
    return pm;
}

function deleteFile(filepath) {
  fs.unlink(filepath,function (err) {
      if(err) {
        console.log(err);
      } else {
        console.log('delete ##--'+ filepath + '--## success!')
      }
    
  })
}
// upload('/usr/local/src/novnc-noVNC-v0.6.1-424-gedb7879.tar.gz');

module.exports = {
  upload
}