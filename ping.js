var Pebble = require('./');
var serialPort = '/dev/tty.PebbleE8EA-SerialPortSe';
var p = new Pebble(serialPort);
var buf = new Buffer(0);
var cnt = 0;
var packet = require('packet');
var parser = packet.createParser();
var moment = require('moment');
var momentTimezone = require('moment-timezone');

parser.extract('b16');

p.on('data', function(d) {
  if(cnt === 2) {
    buf = Buffer.concat([buf, d]);
  } else {
    cnt++;
  }
});

p.on('open', function() {
  console.log('connection to pebble opened.');
  /*p.email('libpebble', 'Hello, Pebble!', 'I love you.', function(){
    console.log(arguments);
  });*/

  p.getTime(function(){
    // Time Parsing
    /*p.on('data', function(d) {
      var size = d.readUInt16BE(0);
      var endpoint = d.readUInt16BE(2);
      if(endpoint === 11) {
        var data = d.slice(4, 4 + size);
        console.log(data.readInt8(0));
        var date = new Date(data.readUInt32BE(1));
        
      }
    });*/
  });

  p.getVersions(function(){});

  p.on('event', function() {
    console.log(arguments);
  });
});

