var request = require('request');
var fs = require('fs');
require('dotenv').config();

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization' : process.env.GITHUB_TOKEN
    }
  };
  request(options, function(err, res, body) {
    cb(err, JSON.parse(body));
  });
}

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
  var func = function(){
    return path + (id++) + ".jpg";
  };
  return func;
}

function processJSON (err, body){
  if(body.message == "Not Found"){
    console.log("unsuccessful request with repoOwner: " + repoOwner + " and repoName " + repoName);
    return;
  }else if(body.message && body.message.contains("exceeded") && body.message.contains("limit")){
    console.log("error with authentication");
    return;
  }
  body.map(a => a.avatar_url).forEach(a => downloadImageByURL(a, getAvatarLocalPath()));
}

function isDirectoryOK(){
  try {
    var stats = fs.statSync(path);
    return stats.isDirectory();
  }catch(e){
    return false;
  }
}

var getAvatarLocalPath = createGetAvatarLocalPath();
var path = './avatars/';
console.log('Welcome to the GitHub Avatar Downloader!');
if(process.argv.length > 4){
  console.log("number of arguments: ", process.argv.length - 2, " only the first two will be used");
}

var repoOwner = process.argv[2];
var repoName = process.argv[3];

if(!(repoOwner && repoName)){
  console.log("repoOwner ", repoOwner, " or repoName: ", repoName, " is not valid");
}else if(! process.env.GITHUB_TOKEN){
  console.log(".env file is required with a GITHUB_TOKEN entry");
else if(! isDirectoryOK()){
  console.log('directory',path , " is not present");
}else{
  getRepoContributors(repoOwner, repoName, processJSON);
}

module.export = getRepoContributors;