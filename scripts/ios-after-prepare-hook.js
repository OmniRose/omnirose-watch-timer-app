#!/usr/bin/env node

// based on http://stackoverflow.com/a/33343120

var fs    = require('fs');
var plist = require('plist');

var FILEPATH = 'platforms/ios/OmniRose watch timer/OmniRose watch timer-Info.plist';

module.exports = function(context) {

  var xml = fs.readFileSync(FILEPATH, 'utf8');
  var obj = plist.parse(xml);

  // console.log(obj);

  obj.UIBackgroundModes = ['audio'];

  xml = plist.build(obj);
  fs.writeFileSync(FILEPATH, xml, { encoding: 'utf8' });

};

// module.exports();
