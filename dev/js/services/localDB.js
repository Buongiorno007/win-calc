"use strict";

BauVoiceApp.factory('localDB', ['$webSql', function ($webSql) {

  var dbName = 'localDB',
      tableProducts = 'products',
      tableOrders = 'orders',
      //tableConstructionParts = 'construction_parts',
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
    "addElementsOnly":{
      "type": "BOOLEAN",
      "null": "NOT NULL"
    },
    "roomId":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "heatCoeff":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "airCoeff":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "templateIndex":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "templateName":{
      "type": "TEXT",
      "null": "NOT NULL"
    },
    "templateWidth":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "templateHeight":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "templateSource":{
      "type": "TEXT",
      "null": "NOT NULL"
    },
    "profileTypeIndex":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "profileIndex":{
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
    "profileHeatCoeff":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "profileAirCoeff":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "glassTypeIndex":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "glassIndex":{
      "type": "INTEGER",
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
    "glassHeatCoeff":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "glassAirCoeff":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "hardwareTypeIndex":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "hardwareIndex":{
      "type": "INTEGER",
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
    "hardwareHeatCoeff":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "hardwareAirCoeff":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "laminationOutIndex":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "laminationOutName":{
      "type": "TEXT",
      "null": "NOT NULL"
    },
    "laminationOutPrice":{
      "type": "FLOAT",
      "null": "NOT NULL"
    },
    "laminationInIndex":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "laminationInName":{
      "type": "TEXT",
      "null": "NOT NULL"
    },
    "laminationInPrice":{
      "type": "FLOAT",
      "null": "NOT NULL"
    },
    "templatePrice":{
      "type": "FLOAT",
      "null": "NOT NULL"
    },
    "hardwarePrice":{
      "type": "FLOAT",
      "null": "NOT NULL"
    },
    "laminationPrice":{
      "type": "FLOAT",
      "null": "NOT NULL"
    },
    "addElementsPrice":{
      "type": "FLOAT",
      "null": "NULL"
    },
    "productPriceTOTAL":{
      "type": "FLOAT",
      "null": "NOT NULL"
    },
    "productQty":{
      "type": "INTEGER",
      "null": "NOT NULL"
    }

  });
/*
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
    "template":{
      "type": "TEXT",
      "null": "NOT NULL"
    }
  });
*/
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
      "null": "NULL"
    },
    "orderStyle": {
      "type": "TEXT",
      "null": "NULL"
    },
    "productsQty": {
      "type": "INTEGER",
      "null": "NULL"
    },
    "floor":{
      "type": "TEXT",
      "null": "NULL"
    },
    "floorPrice":{
      "type": "INTEGER",
      "null": "NULL"
    },
    "assembling":{
      "type": "TEXT",
      "null": "NULL"
    },
    "assemblingPrice":{
      "type": "INTEGER",
      "null": "NULL"
    },
    "deliveryDatePrimary":{
      "type": "TEXT",
      "null": "NULL"
    },
    "deliveryDate":{
      "type": "TEXT",
      "null": "NULL"
    },
    "instalmentPeriod":{
      "type": "TEXT",
      "null": "NULL"
    },
    "instalmentPercent": {
      "type": "INTEGER",
      "null": "NULL"
    },
    "totalPrice":{
      "type": "INTEGER",
      "null": "NULL"
    },
    "totalPricePrimary":{
      "type": "INTEGER",
      "null": "NULL"
    },
    "totalPriceFirst":{
      "type": "INTEGER",
      "null": "NULL"
    },
    "totalPriceMonthly":{
      "type": "INTEGER",
      "null": "NULL"
    },
    "totalPriceFirstPrimary":{
      "type": "INTEGER",
      "null": "NULL"
    },
    "totalPriceMonthlyPrimary":{
      "type": "INTEGER",
      "null": "NULL"
    },
    "name":{
      "type": "TEXT",
      "null": "NULL"
    },
    "location":{
      "type": "TEXT",
      "null": "NULL"
    },
    "address":{
      "type": "TEXT",
      "null": "NULL"
    },
    "mail": {
      "type": "TEXT",
      "null": "NULL"
    },
    "phone":{
      "type": "TEXT",
      "null": "NULL"
    },
    "phone2": {
      "type": "TEXT",
      "null": "NULL"
    },
    "itn": {
      "type": "INTEGER",
      "null": "NULL"
    },
    "starttime": {
      "type": "TEXT",
      "null": "NULL"
    },
    "endtime": {
      "type": "TEXT",
      "null": "NULL"
    },
    "target": {
      "type": "TEXT",
      "null": "NULL"
    }
  });

  db.createTable(tableGrids, {

    "id":{
      "type": "INTEGER",
      "null": "NULL",
      "primary": true,
      "auto_increment": true
    },
    "orderId":{
      "type": "INTEGER",
      "null": "NULL"
    },
    "productId":{
      "type": "INTEGER",
      "null": "NULL"
    },
    "elementId":{
      "type": "INTEGER",
      "null": "NULL"
    },
    "elementType":{
      "type": "TEXT",
      "null": "NULL"
    },
    "elementName":{
      "type": "TEXT",
      "null": "NULL"
    },
    "elementPrice":{
      "type": "INTEGER",
      "null": "NULL"
    },
    "elementQty":{
      "type": "INTEGER",
      "null": "NULL"
    }

  });

  db.createTable(tableVisors, {

    "id":{
      "type": "INTEGER",
      "null": "NULL",
      "primary": true,
      "auto_increment": true
    },
    "orderId":{
      "type": "INTEGER",
      "null": "NULL"
    },
    "productId":{
      "type": "INTEGER",
      "null": "NULL"
    },
    "elementId":{
      "type": "INTEGER",
      "null": "NULL"
    },
    "elementType":{
      "type": "TEXT",
      "null": "NULL"
    },
    "elementName":{
      "type": "TEXT",
      "null": "NULL"
    },
    "elementWidth":{
      "type": "INTEGER",
      "null": "NULL"
    },
    "elementPrice":{
      "type": "INTEGER",
      "null": "NULL"
    },
    "elementQty":{
      "type": "INTEGER",
      "null": "NULL"
    }

  });


  db.createTable(tableSpillways, {

    "id":{
      "type": "INTEGER",
      //"null": "NOT NULL",
      "primary": true,
      "auto_increment": true
    },
    "orderId":{
      "type": "INTEGER"
      //"null": "NOT NULL"
    },
    "productId":{
      "type": "INTEGER"
      //"null": "NOT NULL"
    },
    "elementId":{
      "type": "INTEGER"
      //"null": "NOT NULL"
    },
    "elementType":{
      "type": "TEXT"
      //"null": "NOT NULL"
    },
    "elementName":{
      "type": "TEXT"
      //"null": "NOT NULL"
    },
    "elementWidth":{
      "type": "INTEGER"
      //"null": "NOT NULL"
    },
    "elementPrice":{
      "type": "INTEGER"
      //"null": "NOT NULL"
    },
    "elementQty":{
      "type": "INTEGER"
      //"null": "NOT NULL"
    }

  });


  db.createTable(tableOutsideSlopes, {

    "id":{
      "type": "INTEGER",
      //"null": "NOT NULL",
      "primary": true,
      "auto_increment": true
    },
    "orderId":{
      "type": "INTEGER"
      //"null": "NOT NULL"
    },
    "productId":{
      "type": "INTEGER"
      //"null": "NOT NULL"
    },
    "elementId":{
      "type": "INTEGER"
      //"null": "NOT NULL"
    },
    "elementType":{
      "type": "TEXT"
      //"null": "NOT NULL"
    },
    "elementName":{
      "type": "TEXT"
      //"null": "NOT NULL"
    },
    "elementWidth":{
      "type": "INTEGER"
      //"null": "NOT NULL"
    },
    "elementPrice":{
      "type": "INTEGER"
      //"null": "NOT NULL"
    },
    "elementQty":{
      "type": "INTEGER"
      //"null": "NOT NULL"
    }

  });

  db.createTable(tableInsideSlopes, {

    "id":{
      "type": "INTEGER",
      //"null": "NOT NULL",
      "primary": true,
      "auto_increment": true
    },
    "orderId":{
      "type": "INTEGER"
      //"null": "NOT NULL"
    },
    "productId":{
      "type": "INTEGER"
      //"null": "NOT NULL"
    },
    "elementId":{
      "type": "INTEGER"
      //"null": "NOT NULL"
    },
    "elementType":{
      "type": "TEXT"
      //"null": "NOT NULL"
    },
    "elementName":{
      "type": "TEXT"
      //"null": "NOT NULL"
    },
    "elementWidth":{
      "type": "INTEGER"
      //"null": "NOT NULL"
    },
    "elementPrice":{
      "type": "INTEGER"
      //"null": "NOT NULL"
    },
    "elementQty":{
      "type": "INTEGER"
      //"null": "NOT NULL"
    }

  });


  db.createTable(tableLouvers, {

    "id":{
      "type": "INTEGER",
      //"null": "NOT NULL",
      "primary": true,
      "auto_increment": true
    },
    "orderId":{
      "type": "INTEGER"
      //"null": "NOT NULL"
    },
    "productId":{
      "type": "INTEGER"
      //"null": "NOT NULL"
    },
    "elementId":{
      "type": "INTEGER"
      //"null": "NOT NULL"
    },
    "elementType":{
      "type": "TEXT"
      //"null": "NOT NULL"
    },
    "elementName":{
      "type": "TEXT"
      //"null": "NOT NULL"
    },
    "elementWidth":{
      "type": "INTEGER"
      //"null": "NOT NULL"
    },
    "elementHeight":{
      "type": "INTEGER"
      //"null": "NOT NULL"
    },
    "elementPrice":{
      "type": "INTEGER"
      //"null": "NOT NULL"
    },
    "elementQty":{
      "type": "INTEGER"
      //"null": "NOT NULL"
    }

  });


  db.createTable(tableConnectors, {

    "id":{
      "type": "INTEGER",
      //"null": "NOT NULL",
      "primary": true,
      "auto_increment": true
    },
    "orderId":{
      "type": "INTEGER"
      //"null": "NOT NULL"
    },
    "productId":{
      "type": "INTEGER"
      //"null": "NOT NULL"
    },
    "elementId":{
      "type": "INTEGER"
      //"null": "NOT NULL"
    },
    "elementType":{
      "type": "TEXT"
      //"null": "NOT NULL"
    },
    "elementName":{
      "type": "TEXT"
      //"null": "NOT NULL"
    },
    "elementWidth":{
      "type": "INTEGER"
      //"null": "NOT NULL"
    },
    "elementPrice":{
      "type": "INTEGER"
      //"null": "NOT NULL"
    },
    "elementQty":{
      "type": "INTEGER"
      //"null": "NOT NULL"
    }

  });

  db.createTable(tableFans, {

    "id":{
      "type": "INTEGER",
      //"null": "NOT NULL",
      "primary": true,
      "auto_increment": true
    },
    "orderId":{
      "type": "INTEGER"
      //"null": "NOT NULL"
    },
    "productId":{
      "type": "INTEGER"
      //"null": "NOT NULL"
    },
    "elementId":{
      "type": "INTEGER"
      //"null": "NOT NULL"
    },
    "elementType":{
      "type": "TEXT"
      //"null": "NOT NULL"
    },
    "elementName":{
      "type": "TEXT"
      //"null": "NOT NULL"
    },
    "elementPrice":{
      "type": "INTEGER"
      //"null": "NOT NULL"
    },
    "elementQty":{
      "type": "INTEGER"
      //"null": "NOT NULL"
    }

  });


  db.createTable(tableWindowSills, {

    "id":{
      "type": "INTEGER",
      //"null": "NOT NULL",
      "primary": true,
      "auto_increment": true
    },
    "orderId":{
      "type": "INTEGER"
      //"null": "NOT NULL"
    },
    "productId":{
      "type": "INTEGER"
      //"null": "NOT NULL"
    },
    "elementId":{
      "type": "INTEGER"
      //"null": "NOT NULL"
    },
    "elementType":{
      "type": "TEXT"
      //"null": "NOT NULL"
    },
    "elementName":{
      "type": "TEXT"
      //"null": "NOT NULL"
    },
    "elementWidth":{
      "type": "INTEGER"
      //"null": "NOT NULL"
    },
    "elementColor":{
      "type": "TEXT"
      //"null": "NOT NULL"
    },
    "elementPrice":{
      "type": "INTEGER"
      //"null": "NOT NULL"
    },
    "elementQty":{
      "type": "INTEGER"
      //"null": "NOT NULL"
    }

  });

  db.createTable(tableHandles, {

    "id":{
      "type": "INTEGER",
      //"null": "NOT NULL",
      "primary": true,
      "auto_increment": true
    },
    "orderId":{
      "type": "INTEGER"
      //"null": "NOT NULL"
    },
    "productId":{
      "type": "INTEGER"
      //"null": "NOT NULL"
    },
    "elementId":{
      "type": "INTEGER"
      //"null": "NOT NULL"
    },
    "elementType":{
      "type": "TEXT"
      //"null": "NOT NULL"
    },
    "elementName":{
      "type": "TEXT"
      //"null": "NOT NULL"
    },
    "elementPrice":{
      "type": "INTEGER"
      //"null": "NOT NULL"
    },
    "elementQty":{
      "type": "INTEGER"
      //"null": "NOT NULL"
    }

  });

  db.createTable(tableOthers, {

    "id":{
      "type": "INTEGER",
      //"null": "NOT NULL",
      "primary": true,
      "auto_increment": true
    },
    "orderId":{
      "type": "INTEGER"
      //"null": "NOT NULL"
    },
    "productId":{
      "type": "INTEGER"
      //"null": "NOT NULL"
    },
    "elementId":{
      "type": "INTEGER"
      //"null": "NOT NULL"
    },
    "elementType":{
      "type": "TEXT"
      //"null": "NOT NULL"
    },
    "elementName":{
      "type": "TEXT"
      //"null": "NOT NULL"
    },
    "elementPrice":{
      "type": "INTEGER"
      //"null": "NOT NULL"
    },
    "elementQty":{
      "type": "INTEGER"
      //"null": "NOT NULL"
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
    },

    updateDBGlobal: function(tableName, elem, options) {
      dbGlobal.update(tableName, elem, options);
    }

  }

}]);

