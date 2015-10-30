var moment = require('moment')

var child_process = require('child_process')
var exec = child_process.exec

var Gpio = require('onoff').Gpio
var button = new Gpio(4, 'in', 'both')

function takePicture () {
 var timeStamp = moment().format('x')
 var command = 'fswebcam -r 640x480 --jpeg 85 -D 1 photo-'+timeStamp+'.jpg'
 return exec(command, function (err) {
  console.log('ran')
 }) 
}

button.watch(function(err, value) {
  if (value === 1) takePicture()
});
