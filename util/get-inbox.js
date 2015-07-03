var api = require('./api')
var fs = require('fs')
var path = __dirname + '/../cache.json'

try {
  var cache = require(path)
} catch (e) {
  var cache = {}
}

module.exports = function getInbox (cb) {
  if (cache.inbox) {
    return cb(cache.inbox)
  }

  api('/lists', function (err, res, body) {
    if (err || body.error || ! body || body.length < 1) {
      console.log(err || body.error)
      process.exit(1)
    }

    var lists = body.filter(function (item) {
      return item.list_type === 'inbox'
    })

    var inbox = lists[0]

    cache.inbox = inbox

    fs.writeFile(path, JSON.stringify(cache), function (err) {
      if (err) {
        //
      }
      cb(inbox)
    })
  })
}
