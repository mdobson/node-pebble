var Pebble = require('./');
var serialPort = '/dev/tty.PebbleE8EA-SerialPortSe';
var opts = {
  serialPort: serialPort,
  appUuid: "53214973-072e-4828-837a-1382ad61cbc5"
};

var p = new Pebble(opts);
var nodeUuid = require('node-uuid');

p.on('data', function(d) {
  //You can also receive generic data events
});

p.on('open', function() {
  console.log('connection to pebble opened.');
  
  //Receive data events from the watch.
  /*p.on('event', function(e, size, data) {
    if(e === 2000) {
      var time = data.readUInt32BE(0);
      var level = parseInt(data[5], 16);
      var msgSize = parseInt(data[6], 16);
      var line = data.readUInt16BE(7);
      var file = data.slice(8, 23).toString('utf-8');
      var msg = data.slice(24, 24 + msgSize - 1).toString('utf-8');
      console.log(msg);
    }
  });*/

  /*p.on('event', function(e, size, data) {
    console.log(arguments);
  });*/
  /*p._createIntTuplePacket(1, 42, function(){
    console.log(arguments);
  });*/
  p.once('application_message', function(size, data, full) {
    var tid = data[1];
    p.ack(tid, function() {
      console.log('Ack');
      console.log(arguments);
    });
    console.log('Tuple (KEY): ', data.slice(19,22));
    console.log('Tuple (TYPE): ', data[23]);
 
    //console.log(data.toString('hex'));
    //console.log(full);
    //p._createIntTuplePacket(1, 42);
    /*console.log(buf.toString('hex'));
    console.log('Command id: ',data[0]);
    console.log('Trans id: ', data[1]);
    var uuid = nodeUuid.unparse(data.slice(2,18));
    console.log('UUID: ', uuid);
    //console.log('Amount of tuples: ', data[19]);
    console.log('Tuple:', data.slice(19));
    console.log('Tuple (KEY): ', data.slice(19,22));
    console.log('Tuple (TYPE): ', data[23]);
    console.log('Tuple (LENGTH): ', data.slice(24,25));
    console.log('Tuple (DATA): ', data.readInt32LE(26));*/
  });
  

  //Send an email notification via bluetooth.
  /*p.email('libpebble', 'Hello, Pebble!', 'I love you.', function(){
    console.log('Wrote data to the pebble!');
  });*/

  //Get the current phone timestamp
  /*p.getTime(function(){
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
  });*/

  /*p.getVersions(function(){});*/

  
});

