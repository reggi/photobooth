console.log('start')

var _ = require('lodash')
var imgur = require('imgur')
var path = require('path')
var moment = require('moment')
var child_process = require('child_process')
var exec = child_process.exec
var Gpio = require('onoff').Gpio
var button = new Gpio(4, 'in', 'both')

imgur.setCredentials(process.env.EMAIL, process.env.PWORD, process.env.IMGUR_KEY)

console.log(process.env.EMAIL)
console.log(process.env.PWORD)
console.log(process.env.IMGUR_KEY)
console.log(process.env.ALBUM)

function sendToImgur(photoPath, callback) {
 return imgur.uploadFile(photoPath, process.env.ALBUM)
    .then(function (json) {
        return callback(null, json.data.link)
    })
    .catch(function (err) {
        return callback(err)
    })
}

function takePicture (callback) {
  var timeStamp = moment().format('x')
  var photoPath = path.join(__dirname, '../photos/photo-'+timeStamp+'.jpg')
  var command = 'fswebcam --no-banner --no-timestamp --no-overlay -r 1600x1200 --jpeg 85 -D 1 ' + photoPath
  return exec(command, function (err) {
    if (err) return callback(err)
    return callback(null, photoPath)
  })
}

function buttonPressed (callback) {
  var cb = function(err, value) {
    if (err) return callback(err)
    return callback(err, value)
  }
  return button.watch(_.throttle(cb, 100))
}

// YAY calback "hell"
buttonPressed(function (err, value) {
  if (err) throw err
  if (value === 1) {
    console.log('button pressed')
    return takePicture(function (err, photoPath) {
      if (err) throw err
      console.log(photoPath, 'picture taken')
      return sendToImgur(photoPath, function (err, photoURL) {
        if (err) throw err
        console.log(photoURL, 'uploaded to imgur')
      })
    })
  }
})
