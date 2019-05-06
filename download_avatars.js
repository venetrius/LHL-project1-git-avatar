var request = require('request');
var secrets = require('./secrets');
var fs = require('fs');

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization' :  secrets.GITHUB_TOKEN
    }
  };
  request(options, function(err, res, body) {
    cb(err, JSON.parse(body));
  });
}

getRepoContributors("jquery", "jquery",
  function (err, body){
    body.map(a => a.avatar_url).forEach(a => downloadImageByURL(a, getAvatarLocalPath()));
  }
);

function downloadImageByURL(url, filePath) {
  var req = request.get(url)
          .on('error', function(err){throw err;})
          .on('response', function(response){
            console.log('Downloading image...');
            console.log('Response status code:', response.statusCode);
          })
          .pipe(
            fs.createWriteStream(filePath).on("finish",function() {console.log(filePath, "downloaded")}) // another way to call a callback
          );
}

function createGetAvatarLocalPath(){
  var id = 0;
  var path = './avatars/';
  var func = function(){
    return path + (id++) + ".jpg";
  };
  return func;
}

var getAvatarLocalPath = createGetAvatarLocalPath();


console.log('Welcome to the GitHub Avatar Downloader!');
downloadImageByURL("https://avatars2.githubusercontent.com/u/414129?v=4", "./this.jpg");
