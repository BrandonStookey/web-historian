var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var httpRequest = require('http-request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback){
  fs.readFile(exports.paths.list, function(err, sites){
    //Added from sol video:
    sites = sites.toString().split('\n');
    if (callback) {
      callback(sites);
    }
  });
};

exports.isUrlInList = function(url, callback){
  // Added for sol video:
  exports.readListOfUrls(function(sites) {
    var found = _.any(sites, function(site, i) {
      return site.match(url);
    });
    callback(found);
  });
};
//fs.writeFile("file.txt", 'Text', "UTF-8",{'flags': 'a+'});

//fs.appendFileSync("file.txt", 'My Text \n', "UTF-8",{'flags': 'a+'})
exports.addUrlToList = function(link){
  fs.writeFile(exports.paths.list, link + '\n', "utf8",{'flags': 'a+'});
};

exports.isUrlArchived = function(url, callback){
  // use fs.readFile, pass in directory and urlPath
  fs.readFile(exports.paths.archivedSites + url, function(err, sites) {
    var found = true;
    if (err) {
      found = false;
    }
    callback(found);
  });
};

exports.downloadUrls = function(urlArray){
  for(var i = 0; i < urlArray.length; i++){

      httpRequest.get({
        url: 'http://' + urlArray[i],
        progress: function (current, total) {
          //console.log('downloaded %d bytes from %d', current, total);
        }
      }, './archives/sites/' + urlArray[i], function (err, res) {
        if (err) {
          console.log('Got an error on http.get: ', err);
          return;
      }
      console.log(res.code, res.headers, res.file);
    });
  }
};
