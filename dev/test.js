var packet = require('packet');
var SerialPort = require('serialport');
var serializer = packet.createSerializer();

serializer.serialize('l8z|str(\'ascii\')', 'blah\0');
var buf = new Buffer(5);
var cmp = new Buffer('blah\0');
serializer.write(buf);
console.log(buf.toString('utf-8'));
console.log(cmp.toString('utf-8'));

/*var sender = 'libpebble';
var subject = 'Hello, Pebble!';
var body = 'I hate you.';
var ts = Date.now().toString();

var data = [ sender, subject, ts, body ];

var packetLength = sender.length + subject.length + body.length + ts.length + 5
var serialPort = '/dev/tty.PebbleE8EA-SerialPortSe';
var serial = new SerialPort.SerialPort(serialPort, {
  baudrate: 19200
});

serial.on('open', function() {
  console.log('opened connection to pebble');
  var buf = createPacket(data);
  console.log(buf.toString('hex'));
  serial.write(buf, function(err, results) {
    console.log(arguments);
  });
});

function createPacket(data) {
  var packetLength = 5;
  var totalLength = data.reduce(function(prev, next) { return prev + next.length } , packetLength);
  
  var buffer = new Buffer(totalLength);

  buffer[0] = 0x00;
  var idx = 1;

  data.forEach(function(field) {
    var fieldBuf = new Buffer(field.length + 1);
    fieldBuf[0] = field.length;
    var tmp = new Buffer(field);
    tmp.copy(fieldBuf, 1);
    fieldBuf.copy(buffer, idx);
    idx += fieldBuf.length;
  });

  var packetSize = new Buffer(2);
  var packetCode = new Buffer(2);
  serializer.serialize('b16', buffer.length);
  serializer.write(packetSize);
  serializer.serialize('b16', 3000);
  serializer.write(packetCode);
  var pack = new Buffer(buffer.length + 4);

  packetSize.copy(pack, 0);
  packetCode.copy(pack, 2);
  buffer.copy(pack,4);
  return pack;
}
*/
