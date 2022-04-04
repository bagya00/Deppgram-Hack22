var bodyParser = require('body-parser');
var Adapter = require("../database/Adapter");
var db = new Adapter()


var request = require('request');
var Q = require("q");
var deepgram = require("./deepgram-api");



module.exports = {
  configure: (app) => {
    app.get('/', function (req, res) { res.status(200).send('Hello world!'); });


    app.post('/search', function (req, res, next) {
      return deepgram.search(req, res);
    });

  }
}