var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers.js');
var fs = require('fs');
// Sol vid:
var urlParser = require('url');

exports.handleRequest = function (req, res) {

  var statusCode = statusCode || 200;
  var publicFolder = archive.paths.siteAssets;
  var archivesSitesFolder = archive.paths.archivedSites;
  
  if (req.method === 'GET') {
    var parts = urlParser.parse(req.url);
    var urlPath = parts.pathname === '/' ? '/index.html' : parts.pathname;
    httpHelpers.serveAssets(res, urlPath);
  }
  if (req.method === 'POST') {
    httpHelpers.collectData(req, function(data) {
      var url = data.split('=')[1];
      archive.isUrlInList(url, function(found) {
        if (found) {
          archive.isUrlArchived(url, function(found) {
            if (found) {
              httpHelpers.sendRedirect(res, '/' + url);
            } else {
              httpHelpers.sendRedirect(res, '/loading.html');
            }
          });
        } else {
          archive.addUrlToList(url, function() {
            httpHelpers.sendRedirect(res, '/loading.html');
          });
        }
      });
    });
  }





//http.get goolge.com
//write google.com to archives
  //most likely need fs.writeFile
  //fs.open and fs.close
//fetch from archives with fs.readfile
//return it to client


  // console.log(res.code, res.headers, res.buffer.toString());
  
};