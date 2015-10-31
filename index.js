var Gpio = require('onoff').Gpio
var imgur = require('imgur')
var path = require('path')
var moment = require('moment')
var Promise = require('bluebird')
var child_process = require('child_process')
var exec = child_process.exec
var execAsync = Promise.promisify(exec)
var button = new Gpio(4, 'in', 'both')
var buttonWatchAsync = Promise.promisify(button.watch)

console.log('camera initiated')
console.log(process.env.EMAIL)
console.log(process.env.PWORD)
console.log(process.env.IMGUR_KEY)
console.log(process.env.ALBUM)

imgur.setCredentials(process.env.EMAIL, process.env.PWORD, process.env.IMGUR_KEY)

buttonWatchAsync()
  .then(function (value) {
    var timeStamp = moment().format('x')
    var photoPath = path.join(__dirname, '../photos/photo-' + timeStamp + '.jpg')
    if (value === 1) {
      console.log('button pressed')
      return photoPath
    }
  })
  .then(function (photoPath) {
    var command = 'fswebcam --no-banner --no-timestamp --no-overlay -r 1600x1200 --jpeg 85 -D 1 ' + photoPath
    return execAsync(command).then(function () {
      console.log('picture taken (' + photoPath + ')')
      return photoPath
    })
  })
  .then(function (photoPath) {
    return imgur.uploadFile(photoPath, process.env.ALBUM).then(function (json) {
      console.log(json.data.link)
    })
  })
