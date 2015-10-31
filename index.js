var imgur = require('imgur-node-api')
var path = require('path')
var moment = require('moment')

var child_process = require('child_process')
var exec = child_process.exec

var Gpio = require('onoff').Gpio
var button = new Gpio(4, 'in', 'both')

console.log('running')

function sendToImgur(imagePath) {
 imgur.setClientID(process.env.IMGUR_KEY);
 imgur.upload(imagePath, function (err, res) {
  if (err) throw err
  console.log(res.data.link)
 })
}

function takePicture () {
 var timeStamp = moment().format('x')
 var photoPath = '../photos/photo-'+timeStamp+'.jpg'
 var command = 'fswebcam -r 1600x1200 --jpeg 85 -D 1 ' + photoPath + ' --no-overlay'
 return exec(command, function (err) {
  if (err) throw err
  console.log('ran')
  return sendToImgur(photoPath)
 }) 
}

button.watch(function(err, value) {
  if (value === 1) takePicture()
});
