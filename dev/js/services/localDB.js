"use strict";

BauVoiceApp.factory('localDB', ['$webSql', function ($webSql) {

  var dbName = 'localDB',
      tableProducts = 'products',
      tableOrders = 'orders',
      tableConstructionParts = 'construction_parts',
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
      dbGlobal, db;

  dbGlobal = $webSql.openDatabase('bauvoice', '1.0', 'bauvoice', 65536);
  db = $webSql.openDatabase(dbName, '1.0', 'Test DB', 65536);
  db.createTable(tableProducts, {
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
    "orderId":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "productId":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "productName":{
      "type": "TEXT",
      "null": "NOT NULL"
    },
    "productIcon":{
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
    "profileId":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "profileName":{
      "type": "TEXT",
      "null": "NOT NULL"
    },
    "glassId":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "glassName":{
      "type": "TEXT",
      "null": "NOT NULL"
    },
    "hardwareId":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "hardwareName":{
      "type": "TEXT",
      "null": "NOT NULL"
    },
    "laminationOutId":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "laminationOutName":{
      "type": "TEXT",
      "null": "NOT NULL"
    },
    "laminationInId":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "laminationInName":{
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

  db.createTable(tableConstructionParts, {
    "id":{
      "type": "INTEGER",
      "null": "NOT NULL",
      "primary": true,
      "auto_increment": true
    },
    "orderId":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "productId":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "componentsId":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "property":{
      "type": "TEXT",
      "null": "NOT NULL"
    }
  });

  db.createTable(tableOrders, {
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
    "orderId":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "orderType": {
      "type": "TEXT",
      "null": "NOT NULL"
    },
    "orderStyle": {
      "type": "TEXT",
      "null": "NOT NULL"
    },
    "productsQty": {
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "floor":{
      "type": "TEXT",
      "null": "NOT NULL"
    },
    "floorPrice":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "assembling":{
      "type": "TEXT",
      "null": "NOT NULL"
    },
    "assemblingPrice":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "deliveryDatePrimary":{
      "type": "TEXT",
      "null": "NOT NULL"
    },
    "deliveryDate":{
      "type": "TEXT",
      "null": "NOT NULL"
    },
    "instalmentPeriod":{
      "type": "TEXT",
        "null": "NOT NULL"
    },
    "instalmentPercent": {
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "totalPrice":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "totalPricePrimary":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "totalPriceFirst":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "totalPriceMonthly":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "totalPriceFirstPrimary":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "totalPriceMonthlyPrimary":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "name":{
      "type": "TEXT",
      "null": "NOT NULL"
    },
    "location":{
      "type": "TEXT",
      "null": "NOT NULL"
    },
    "address":{
      "type": "TEXT",
      "null": "NOT NULL"
    },
    "mail": {
      "type": "TEXT",
      "null": "NOT NULL"
    },
    "phone":{
      "type": "TEXT",
      "null": "NOT NULL"
    },
    "phone2": {
      "type": "TEXT",
      "null": "NOT NULL"
    },
    "itn": {
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "starttime": {
      "type": "TEXT",
      "null": "NOT NULL"
    },
    "endtime": {
      "type": "TEXT",
      "null": "NOT NULL"
    },
    "target": {
      "type": "TEXT",
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
    "orderId":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "productId":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "elementId":{
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
    "orderId":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "productId":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "elementId":{
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
      db.update(tableName, elem, options);
      /*
      db.update(tableName, elem, options).then(function(results) {
        console.log(results);
      });
      */
    },




    // Global DataBase

    selectDBGlobal: function(tableName, options, callback) {
      var handler = [];
      dbGlobal.select(tableName, options).then(function(results) {
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

    selectAllDBGlobal: function(tableName, callback) {
      var handler = [];
      dbGlobal.selectAll(tableName).then(function(results) {
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

