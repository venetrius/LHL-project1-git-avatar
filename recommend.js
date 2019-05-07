var request = require('request');
var fs = require('fs');
require('dotenv').config();

function getTopFiveStaredRepoByConstributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization' : "token " +  process.env.GITHUB_TOKEN
    }
  };
  request(options, function(err, res, body) {
    cb(err, JSON.parse(body));
  });
}


function processJSON (err, body){
  if(body.message == "Not Found"){
    console.log("unsuccessful request with repoOwner: " + repoOwner + " and repoName " + repoName);
    return;
  }else if(body.message && body.message.includes("exceeded") && body.message.includes("limit")){
    console.log("error with authentication");
    return;
  }
  countContributors = body.length;
  body.map(a => a.starred_url.replace("{/owner}{/repo}", "")).forEach(a => collectStaredRepos(a, finalizeOnFinish));
//
}

function collectStaredRepos(URL, cb){
  var options = {
    url: URL,
    headers: {
      'User-Agent': 'request',
      'Authorization' : "token " +  process.env.GITHUB_TOKEN
    }
  };
  request(options, function(err, res, body) {
    JSON.parse(body).forEach(a => staredURLs.push((a.full_name).split("/").pop()));
    processedContributors.push("");
    cb();
  });
}

function finalizeOnFinish(){
  var staredRepos = {};
  if(processedContributors.length === countContributors){
    staredURLs.forEach(
      function(staredURL){
        staredRepos[staredURL] = staredRepos[staredURL] ? (staredRepos[staredURL] + 1) : 1;
      }
    );
    var topFivePoints = [0,0,0,0,0,0];
    // storing the repo names as array of string could help to store more repo name with a same number of stars
    var topFiveNames = [[],[],[],[],[]];
    for (let repo in staredRepos){
      index = 5;
      while(index > 0 && staredRepos[repo] >= topFivePoints[index-1]){
        index --;
      }
      if(index < 4){
        /*if(topFivePoints[index] === staredRepos[repo]){
          topFiveNames[index].push(repo);
        }else{*/
          topFivePoints.splice(index, 0, staredRepos[repo]);
          topFiveNames.splice(index, 0, [repo]);
        /*}*/
      }
    //  console.log(repo, staredRepos[repo]);
    }
    console.log("top five most stared repos by the constributors of " + repoName + " :");
    for( let i = 0; i < 5; i++){
      console.log(topFiveNames[i][0], topFivePoints[i]);
    }
  }
}

var repoOwner = process.argv[2];
var repoName = process.argv[3];
var countContributors;
var processedContributors= [];
var staredURLs = [];

// TEST call getTopFiveStaredRepoByConstributors("jquery", "jquery", processJSON);

var repoOwner = process.argv[2];
var repoName = process.argv[3];


if(!(repoOwner && repoName)){
  console.log("repoOwner ", repoOwner, " or repoName: ", repoName, " is not valid");
}else if(! process.env.GITHUB_TOKEN){
  console.log(".env file is required with a GITHUB_TOKEN entry");
}else{
  getTopFiveStaredRepoByConstributors(repoOwner, repoName, processJSON);
}