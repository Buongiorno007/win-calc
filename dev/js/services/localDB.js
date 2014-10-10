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
    "productWidth":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "productHeight":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "profileName":{
      "type": "TEXT",
      "null": "NOT NULL"
    },
    "glassName":{
      "type": "TEXT",
      "null": "NOT NULL"
    },
    "hardwareName":{
      "type": "TEXT",
      "null": "NOT NULL"
    },
    "laminationNameOut":{
      "type": "TEXT",
      "null": "NOT NULL"
    },
    "laminationNameIn":{
      "type": "TEXT",
      "null": "NOT NULL"
    },
    "productQty":{
      "type": "INTEGER",
      "null": "NOT NULL"
    }

  });

  return {

    deleteTable: function() {
      db.dropTable(dbTableName).then(function(results) {
        console.log(results);
      });
    },

    insert: function(elem) {
      db.insert(dbTableName, elem).then(function(results) {
        //console.log(results.insertId);
      });
    },

    select: function(options, callback) {
      var handler = [];
      db.select(dbTableName, options).then(function(results) {
        if (results.rows.length) {
          for(var i = 0; i < results.rows.length; i++) {
            handler.push(results.rows.item(i));
          }
          callback(new OkResult(handler));
        } else {
          callback(new ErrorResult(1, 'No in database!'));
        }
      });
    },

    selectAll: function(callback) {
      var handler = [];
      db.selectAll(dbTableName).then(function(results) {
        if (results.rows.length) {
          for(var i = 0; i < results.rows.length; i++) {
            handler.push(results.rows.item(i));
          }
          callback(new OkResult(handler));
        } else {
          callback(new ErrorResult(1, 'No in database!'));
        }
      });
    }

  }

}]);

