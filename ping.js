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
  p.on('event', function(e, size, data) {
    if(e === 'logs') {
      var time = data.readUInt32BE(0);
      var level = parseInt(data[5], 16);
      var msgSize = parseInt(data[6], 16);
      var line = data.readUInt16BE(7);
      var file = data.slice(8, 23).toString('utf-8');
      var msg = data.slice(24, 24 + msgSize - 1).toString('utf-8');
      [time, level, msgSize, line, file, msg].forEach(function(item) {
        console.log(item);
      });


    }
  });
  p.email('libpebble', 'Hello, Pebble!', 'I love you.', function(){
    console.log(arguments);
  });

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

  
});

