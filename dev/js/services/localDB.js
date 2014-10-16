"use strict";

BauVoiceApp.factory('localDB', ['$webSql', function ($webSql) {

  var dbName = 'localDB',
      tableOrder = 'order',
      tableGrids = 'grids',
      tableVisors = 'visors',
      tableSpillways = 'spillways',
      tableOutsideSlopes = 'outside_slopes',
      tableLouvers = 'louvers',
      tableInsideSlopes = 'inside_slopes',
      tableConnectors = 'connectors',
      tableFans = 'fans',
      tableWindowSills = 'windowsills',
      tableHandles = 'handles',
      tableOthers = 'other_elements',
      db;

  db = $webSql.openDatabase(dbName, '1.0', 'Test DB', 65536);
  db.createTable(tableOrder, {

    "id":{
      "type": "INTEGER",
      "null": "NOT NULL",
      "primary": true,
      "auto_increment": true
    },
    "created":{
      "type": "TIMESTAMP",
      "null": "NOT NULL",
      "default": "CURRENT_TIMESTAMP"
    },
    "productId":{
      "type": "INTEGER",
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
    "productPrice":{
      "type": "FLOAT",
      "null": "NOT NULL"
    },
    "productQty":{
      "type": "INTEGER",
      "null": "NOT NULL"
    }

  });

  db.createTable(tableVisors, {

    "id":{
      "type": "INTEGER",
      "null": "NOT NULL",
      "primary": true,
      "auto_increment": true
    },
    "created":{
      "type": "TIMESTAMP",
      "null": "NOT NULL",
      "default": "CURRENT_TIMESTAMP"
    },
    "productId":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "elementType":{
      "type": "TEXT",
      "null": "NOT NULL"
    },
    "elementName":{
      "type": "TEXT",
      "null": "NOT NULL"
    },
    "elementWidth":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "elementPrice":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "elementQty":{
      "type": "INTEGER",
      "null": "NOT NULL"
    }

  });

  db.createTable(tableWindowSills, {

    "id":{
      "type": "INTEGER",
      "null": "NOT NULL",
      "primary": true,
      "auto_increment": true
    },
    "created":{
      "type": "TIMESTAMP",
      "null": "NOT NULL",
      "default": "CURRENT_TIMESTAMP"
    },
    "productId":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "elementType":{
      "type": "TEXT",
      "null": "NOT NULL"
    },
    "elementName":{
      "type": "TEXT",
      "null": "NOT NULL"
    },
    "elementWidth":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "elementColor":{
      "type": "TEXT",
      "null": "NOT NULL"
    },
    "elementPrice":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "elementQty":{
      "type": "INTEGER",
      "null": "NOT NULL"
    }

  });

  return {

    deleteTable: function(tableName) {
      db.dropTable(tableName).then(function(results) {
        console.log(results);
      });
    },

    insertDB: function(tableName, elem) {
      db.insert(tableName, elem).then(function(results) {
        //console.log(results.insertId);
      });
    },

    selectDB: function(tableName, options, callback) {
      var handler = [];
      db.select(tableName, options).then(function(results) {
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

    selectAllDB: function(tableName, callback) {
      var handler = [];
      db.selectAll(tableName).then(function(results) {
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

    deleteDB: function(tableName, options) {
      db.del(tableName, options).then(function(results) {
        console.log(results);
      });
    },

    updateDB: function(tableName, elem, options) {
      db.update(tableName, elem, options).then(function(results) {
        console.log(results);
      });
    }

  }

}]);

