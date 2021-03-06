'use strict';
var mysql = require("mysql");
var Q = require("q");
var moment = require('moment');

var options = {
  "host": process.env.MYSQL_HOST,
  "port": process.env.MYSQL_PORT,
  "user": process.env.MYSQL_USER,
  "password": process.env.MYSQL_PASSWORD,
  "database": process.env.MYSQL_DATABASE,
  "multipleStatements": true
};

function Adapter() {
  if (this instanceof Adapter) {
     this.db = mysql.createPool(options);
  } else {
    return new Adapter();
  }
}


Adapter.prototype.GetVideoUrlByAssetId = function(asset_ids) {

  const query = "SELECT * FROM soundbites WHERE asset_id IN (" + this.db.escape(asset_ids) + ")";
  console.log(query)
  var deferred = Q.defer();
  this.db.getConnection(function(err, connection) {
    if (err) {
      console.log(err)
      deferred.reject(err);
    } else {
      connection.query(query, [], function(err, results) {
        connection.release();
        if (err) {
          console.log(err)
          deferred.reject(err);
        } else {
          deferred.resolve(results);
        }
      });
    }
  });
  console.log("GetVideoUrlByAssetId function finished")
  return deferred.promise;
}

Adapter.prototype.InsertNewSlackUser = function(id, team_id, channel_id) {
  var deferred = Q.defer();
  const query = "INSERT INTO slack_users(user_id,team_id,channel_id) VALUES(" +
    this.db.escape(id) + "," + this.db.escape(team_id) + "," + this.db.escape(channel_id) + ")";

  this.db.getConnection(function(err, connection) {
    if (err) {
      deferred.reject(err);
    } else {
      connection.query(query, [], function(err, results) {
        connection.release();
        if (err) {
          deferred.reject(err);
        } else {
          deferred.resolve(results);
        }
      });
    }
  });

  console.log("InsertNewSlackUser function finished")
  return deferred.promise;
}

module.exports = Adapter;

