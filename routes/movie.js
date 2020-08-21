var express = require('express');
var router = express.Router();
const request = require('superagent')
var HOST = 'http://api.douban.com/v2'
const apiKey = '0b2bdeda43b5688921839c8ecb20399b'
// 0df993c66c0c636e29ecbb5344252a4a
// 0b2bdeda43b5688921839c8ecb20399b
/* GET users listing. */
router.get('/', function (req, res, next) {
  // res.send('respond with a resource');
  console.log(req.originalUrl)
  // var sreq = request.get(HOST + req.originalUrl)
  // var sreq = request.get(HOST + req.originalUrl + '/search?apikey=' + apiKey)
  var sreq = request.get('https://api.apiopen.top/musicRankings')

  sreq.pipe(res);
  sreq.on('end', function (error, res) {
    console.log(error)
    console.log(res)
    console.log('end');
  });
});

module.exports = router;
