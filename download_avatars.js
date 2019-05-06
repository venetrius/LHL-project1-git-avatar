var request = require('request');

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  console.log("Result:", result);
});

console.log('Welcome to the GitHub Avatar Downloader!');