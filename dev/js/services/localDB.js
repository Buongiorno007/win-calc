"use strict";

BauVoiceApp.factory('localDB', ['$webSql', function ($webSql) {

  var dbName = 'localDB',
      tableProducts = 'products',
      tableOrders = 'orders',
      tableAddElements = 'add_elements',
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
    "isAddElementsONLY":{
      "type": "BOOLEAN",
      "null": "NOT NULL"
    },
    "selectedRoomId":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "constructionType": {
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "templateIndex":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "templateSource":{
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
    "beadId":{
      "type": "INTEGER",
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
    "doorShapeId":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "doorSashShapeId":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "doorHandleShapeId":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "doorLockShapeId":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "heatTransferMin":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "heatTransferTOTAL":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "airCirculationTOTAL":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "templatePriceSELECT":{
      "type": "FLOAT",
      "null": "NOT NULL"
    },
    "laminationPriceSELECT":{
      "type": "FLOAT",
      "null": "NOT NULL"
    },
    "addElementsPriceSELECT":{
      "type": "FLOAT",
      "null": "NULL"
    },
    "productPriceTOTAL":{
      "type": "FLOAT",
      "null": "NOT NULL"
    },
    "comment":{
      "type": "TEXT",
      "null": "NULL"
    },
    "productQty":{
      "type": "INTEGER",
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
    "productsPriceTOTAL": {
      "type": "INTEGER",
      "null": "NULL"
    },
    "deliveryDate":{
      "type": "TEXT",
      "null": "NULL"
    },
    "newDeliveryDate":{
      "type": "TEXT",
      "null": "NULL"
    },
    "deliveryPrice": {
      "type": "INTEGER",
      "null": "NULL"
    },
    "isDatePriceLess":{
      "type": "BOOLEAN",
      "null": "NOT NULL"
    },
    "isDatePriceMore":{
      "type": "BOOLEAN",
      "null": "NOT NULL"
    },
    "selectedFloor":{
      "type": "INTEGER",
      "null": "NULL"
    },
    "selectedFloorPrice":{
      "type": "INTEGER",
      "null": "NULL"
    },
    "selectedAssembling":{
      "type": "TEXT",
      "null": "NULL"
    },
    "selectedAssemblingPrice":{
      "type": "INTEGER",
      "null": "NULL"
    },
    "isInstalment":{
      "type": "INTEGER",
      "null": "NULL"
    },
    "selectedInstalmentPeriod":{
      "type": "INTEGER",
      "null": "NULL"
    },
    "selectedInstalmentPercent": {
      "type": "INTEGER",
      "null": "NULL"
    },
    "isOldPrice":{
      "type": "BOOLEAN",
      "null": "NOT NULL"
    },
    "paymentFirst":{
      "type": "INTEGER",
      "null": "NULL"
    },
    "paymentMonthly":{
      "type": "INTEGER",
      "null": "NULL"
    },
    "paymentFirstPrimary":{
      "type": "INTEGER",
      "null": "NULL"
    },
    "paymentMonthlyPrimary":{
      "type": "INTEGER",
      "null": "NULL"
    },
    "orderPriceTOTAL":{
      "type": "INTEGER",
      "null": "NULL"
    },
    "orderPriceTOTALPrimary":{
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
    },
    "sex": {
      "type": "TEXT",
      "null": "NULL"
    },
    "age": {
      "type": "TEXT",
      "null": "NULL"
    },
    "education": {
      "type": "TEXT",
      "null": "NULL"
    },
    "occupation": {
      "type": "TEXT",
      "null": "NULL"
    },
    "infoSource": {
      "type": "TEXT",
      "null": "NULL"
    }
  });

  db.createTable(tableAddElements, {

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
      "type": "INTEGER",
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
    "elementHeight":{
      "type": "INTEGER",
      "null": "NULL"
    },
    "elementColor":{
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

