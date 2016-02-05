// As you progress, keep thinking about what helper functions you can put here!
var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

//From sol vid:
exports.sendResponse = function(response, obj, status) {
  status = status || 200;
  response.writeHead(status, headers);
  response.end(obj);
};

exports.collectData = function(request, callback) {
  var data = '';
  request.on('data', function(chunk) {
    data += chunk;
  });
  request.on('end', function() {
    callback(data);
  });
};

exports.send404 = function(response) {
  exports.sendResponse(response, '404: Page not found', 404);
};

exports.sendRedirect = function(response, location, status) {
  status = status || 302;
  response.writeHead(status, { Location: location } );
  response.end();
};



// Sol vid:
exports.serveAssets = function(res, asset, callback) {
  
  var encoding = {encoding: 'utf8'};
  
  // Check public folder
  fs.readFile( archive.paths.siteAssets + asset, encoding, function(err, data) {
    if (err) {
      // Check archive folder
      fs.readFile( archive.paths.archivedSites + asset, encoding, function(err, data) {
        if (err) {
          // If file doesn't exist in either folder, execute a call back or send 404 page
          callback ? callback() : exports.send404(res);
        } else {
          // If file exists in archive folder, serve it
          exports.sendResponse(res, data);
        }
      });
      // If file exists in public folder, serve it
    } else {
      exports.sendResponse(res, data);
    }
  });
};









