var serialPort = '/dev/tty.PebbleE8EA-SerialPortSe';
var p = new Pebble(serialPort);
p.on('open', function() {
  console.log('connection to pebble opened.');
  p.email('libpebble', 'Hello, Pebble!', 'I hate you.', function(){
    console.log(arguments);
  });
});
