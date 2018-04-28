'use strict';

var gutil           = require('gulp-util');
var through         = require('through2');

/**
 * [在html中为 script 和  link 添加静态版本号]
 * @param {[type]} arg [description]
 */
function VersionPlugin(arg){

  var ASSET_REG = {
      "SCRIPT": /(<script[^>]+src=)['"]([^'"]+)["']/ig,
      "STYLESHEET": /(<link[^>]+href=)['"]([^'"]+)["']/ig,
      //"IMAGE": /(<img[^>]+src=)['"]([^'"]+)["']/ig,
      //"BACKGROUND": /(url\()(?!data:|about:)([^)]*)/ig
  };

  return through.obj(function(file, enc, cb){
    if (file.isNull()) {
      cb(null, file);
      return;
    }

    if (file.isStream()) {
      cb(new gutil.PluginError('VersionPlugin', 'Streaming not supported'));
      return;
    }

    var content = file.contents.toString();

    // add or replace version string
    for(var type in ASSET_REG){
      content = content.replace(ASSET_REG[type], function (str, tag, src) {
        //console.log(str, tag, src);
        src = src.replace(/\?.*$/, '');
        var param = []
        for(var key in arg){
          param.push(key + '=' + arg[key]);
        }
        return tag + '"' + src + '?' + param.join('&') + '"';
      });
    }

    file.contents = new Buffer(content);
    this.push(file);
    cb();
  });
}

module.exports = VersionPlugin;