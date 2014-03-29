var Pebble = require('./');
var serialPort = '/dev/tty.PebbleE8EA-SerialPortSe';
var p = new Pebble(serialPort);

p.on('data', function(d) {
  //You can also receive generic data events
});

p.on('open', function() {
  console.log('connection to pebble opened.');
  
  //Receive data events from the watch.
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

  //Send an email notification via bluetooth.
  p.email('libpebble', 'Hello, Pebble!', 'I love you.', function(){
    console.log('Wrote data to the pebble!');
  });

  //Get the current phone timestamp
  p.getTime(function(){
    //Time Parsing
    p.on('time', function(size, d) {
      var size = d.readUInt16BE(0);
      var endpoint = d.readUInt16BE(2);
      if(endpoint === 11) {
        var data = d.slice(4, 4 + size);
        var date = data.readUIntBE(1);
        console.log('Ts:', date);
      }
    });
  });

  p.getVersions(function(){});

  
});

