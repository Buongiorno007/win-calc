"use strict";

BauVoiceApp.factory('localDB', ['$webSql', function ($webSql) {

  var dbName = 'localDB',
      dbTableName = 'order',
      db;

  db = $webSql.openDatabase(dbName, '1.0', 'Test DB', 65536);
  db.createTable(dbTableName, {

    "id":{
      "type": "INTEGER",
      "null": "NOT NULL", // default is "NULL" (if not defined)
      "primary": true, // primary
      "auto_increment": true // auto increment
    },
    "created":{
      "type": "TIMESTAMP",
      "null": "NOT NULL",
      "default": "CURRENT_TIMESTAMP" // default value
    },
    "productName":{
      "type": "TEXT",
      "null": "NOT NULL"
    },
    "productQty":{
      "type": "INTEGER",
      "null": "NOT NULL"
    }

  });

  return {
    insert: function(elem, callback) {
      db.insert(dbTableName, elem, callback).then(function(results) {
        console.log(results.insertId);
      });
    },

    select: function(options, callback) {
      var handler = [];
      db.select(dbTableName, options, callback).then(function(results) {

        for(var i = 0; i < results.rows.length; i++) {
          handler.push(results.rows.item(i));
        }

      });
      return handler;
    },

    selectAll: function(){
      var handler = [];
      db.selectAll(dbTableName).then(function(results) {

        for(var i = 0; i < results.rows.length; i++) {
          handler.push(results.rows.item(i));
        }

      });
      return handler;
    }

    /*
    selectAll: function(handler, callback){
      db.selectAll(dbTableName, function(results) {
        for(var i = 0; i < results.rows.length; i++) {
          //handler(results.rows.item(i));
          handler.push(results.rows.item(i));
        }
        callback();
      });
    }
    */
  }

}]);

