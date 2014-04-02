var SerialPort = require('serialport');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var packet = require('packet');
var uuid = require('node-uuid');

var Pebble = module.exports = function(opts) {
  EventEmitter.call(this);
  opts = opts || {};

  this.serialPort = opts.serialPort;
  this.appUuid = opts.appUuid;
  this.appUuidBytes = new Buffer(uuid.parse(this.appUuid));
  this.serial = new SerialPort.SerialPort(this.serialPort, {
    baudrate: 19200
  });

  var self = this;

  this.serial.on('data', this.emit.bind(this, 'data'));
  this.serial.on('open', this.emit.bind(this, 'open'));
  this.serial.on('close', this.emit.bind(this, 'close'));

  this.serial.on('data', function(d){
    var size = d.readUInt16BE(0);
    var endpoint = d.readUInt16BE(2);
    var data = d.slice(4, 4+size);

    for( var key in self.endpoints) {
      if(self.endpoints[key] === endpoint) {
        var data = d.slice(4, 4+size);
        self.emit('event', endpoint, key.toLowerCase(), size, data, d);
        self.emit(key.toLowerCase(), size, data, d);
      }
    }
  });
  
  this.endpoints = {
    'TIME': 11,
    'VERSION': 16,
    'PHONE_VERSION': 17,
    'SYSTEM_MESSAGE': 18,
    'MUSIC_CONTROL': 32,
    'PHONE_CONTROL': 33,
    'LOGS': 2000,
    'PING': 2001,
    'LOG_DUMP': 2002,
    'RESET': 2003,
    'APP': 2004,
    'NOTIFICATION': 3000,
    'RESOURCE': 4000,
    'APP_MANAGER': 6000,
    'PUTBYTES': 48879,
    'APPLICATION_MESSAGE':48
  };

  this.tupleTypes = {
    'BYTE_ARRAY': 0x00,
    'CSTRING': 0x01,
    'UINT': 0x02,
    'INT': 0x03
  };

  this.messageTypes = {
    'PUSH': 0x01,
    'REQUEST': 0x02,
    'ACK': 0xFF,
    'NACK': 0x7F
  };
};
util.inherits(Pebble, EventEmitter);

//Send message down serial port
Pebble.prototype._sendMessage = function(endpoint, data, cb) {
  var msg = this._buildMessage(this.endpoints[endpoint], data);
  this.serial.write(msg, cb);
};

//Build buffer message here.
Pebble.prototype._buildMessage = function(endpoint, buffer) {
  var packetSize = new Buffer(2);
  var packetCode = new Buffer(2);
  var serializer = packet.createSerializer();
  serializer.serialize('b16', buffer.length);
  serializer.write(packetSize);
  serializer.serialize('b16', endpoint);
  serializer.write(packetCode);
  var pack = new Buffer(buffer.length + 4);

  packetSize.copy(pack, 0);
  packetCode.copy(pack, 2);
  buffer.copy(pack,4);
  return pack;
};

Pebble.prototype._createPacket = function(data, firstByte) {
  var packetLength = 1;
  var totalLength = data.reduce(function(prev, next) { return prev + (next.length + 1) } , packetLength);

  var buffer = new Buffer(totalLength);

  if(firstByte) {
    buffer[0] = firstByte;
  } else {
    buffer[0] = 0x00;
  }
  var idx = 1;

  data.forEach(function(field) {
    var fieldBuf = new Buffer(field.length + 1);
    fieldBuf[0] = field.length;
    var tmp = new Buffer(field);
    tmp.copy(fieldBuf, 1);
    fieldBuf.copy(buffer, idx);
    idx += fieldBuf.length;
  });

  return buffer;
};

Pebble.prototype.sms = function(sender, body, cb) {
  var timeStamp = Date.now().toString();
  var parts = [sender, body, timeStamp];
  var data = this._createPacket(parts, 0x01);
  this._sendMessage('NOTIFICATION', data, cb);
};

Pebble.prototype.email = function(sender, subject, body, cb) {
  var timeStamp = Date.now().toString();
  var parts = [ sender, subject, timeStamp, body ];
  var data = this._createPacket(parts);
  this._sendMessage('NOTIFICATION', data, cb);
};

Pebble.prototype.getVersions = function(cb) {
  this._sendMessage('VERSION', new Buffer([0x00]), cb);
};

Pebble.prototype.getTime = function(cb) {
  this._sendMessage('TIME', new Buffer([0x00]), cb);
};

Pebble.prototype.ack = function(tid, cb) {
  var ackCommandBuf = new Buffer(2);
  ackCommandBuf[0] = 0xFF;
  ackCommandBuf.writeUInt8(tid, 1);
  this._sendMessage('APPLICATION_MESSAGE', ackCommandBuf, cb);
};

Pebble.prototype._createStringTuplePacket = function(command, key, string, cb) {
  //var buf = new Buffer(24 + string.length + 1);
  var cmd = new Buffer([this.messageTypes['PUSH']]);
  var tid = new Buffer([0x01]);
  var key = new Buffer([0x00, 0x00, 0x00, 0x00]);
  var type = new Buffer([0x01]);
  var size = new Buffer(1).writeUInt8(string.length,0);
  var data = new Buffer(string + '\0');
  var buf = Buffer.concat([cmd, tid, key, type, size, data]);
};

Pebble.prototype._createIntTuplePacket = function(key, val, cb) {
  //var buf = new Buffer(24 + string.length + 1);
  var cmd = new Buffer([this.messageTypes['PUSH']]);
  var tid = new Buffer([0x01]);
  var keyBuf = new Buffer(4);
  keyBuf.writeInt32LE(key,0);
  var type = new Buffer([0x03]);
  var tupleAmt = new Buffer([0x01]);
  var size = new Buffer(2)
  size.writeUInt16LE(4,0);
  var data = new Buffer(4)
  data.writeInt32LE(val, 0);
  var buf = Buffer.concat([cmd, tid, this.appUuidBytes, tupleAmt, keyBuf, type, size, data]);
  this._sendMessage('APPLICATION_MESSAGE', buf, cb);
};



Pebble.prototype.sendIntTuple = function(key, int, cb) {

};


