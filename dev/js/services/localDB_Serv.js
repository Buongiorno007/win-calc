(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('BauVoiceApp')
    .factory('localDB', localDBFactory);

  function localDBFactory($webSql) {

    var thisFactory = this,
        dbName = 'localDB',
        //dbGlobal = $webSql.openDatabase('bauvoice', '1.0', 'bauvoice', 65536),
        db = $webSql.openDatabase(dbName, '1.0', 'Test DB', 65536),

        productTableFields = {
          "id": {
            "type": "INTEGER",
            "null": "NOT NULL",
            "primary": true,
            "auto_increment": true
          },
          "created": {
            "type": "TIMESTAMP",
            "null": "NOT NULL",
            "default": "CURRENT_TIMESTAMP"
          },
          "orderId": {
            "type": "INTEGER",
            "null": "NOT NULL"
          },
          "productId": {
            "type": "INTEGER",
            "null": "NOT NULL"
          },
          "isAddElementsONLY": {
            "type": "BOOLEAN",
            "null": "NOT NULL"
          },
          "selectedRoomId": {
            "type": "INTEGER",
            "null": "NOT NULL"
          },
          "constructionType": {
            "type": "INTEGER",
            "null": "NOT NULL"
          },
          "templateIndex": {
            "type": "INTEGER",
            "null": "NOT NULL"
          },
          "templateSource": {
            "type": "TEXT",
            "null": "NOT NULL"
          },
          "templateWidth": {
            "type": "INTEGER",
            "null": "NOT NULL"
          },
          "templateHeight": {
            "type": "INTEGER",
            "null": "NOT NULL"
          },
          "profileTypeIndex": {
            "type": "INTEGER",
            "null": "NOT NULL"
          },
          "profileIndex": {
            "type": "INTEGER",
            "null": "NOT NULL"
          },
          "profileId": {
            "type": "INTEGER",
            "null": "NOT NULL"
          },
          "profileName": {
            "type": "TEXT",
            "null": "NOT NULL"
          },
          "profileHeatCoeff": {
            "type": "INTEGER",
            "null": "NOT NULL"
          },
          "profileAirCoeff": {
            "type": "INTEGER",
            "null": "NOT NULL"
          },
          "glassTypeIndex": {
            "type": "INTEGER",
            "null": "NOT NULL"
          },
          "glassIndex": {
            "type": "INTEGER",
            "null": "NOT NULL"
          },
          "glassId": {
            "type": "INTEGER",
            "null": "NOT NULL"
          },
          "glassName": {
            "type": "TEXT",
            "null": "NOT NULL"
          },
          "glassHeatCoeff": {
            "type": "INTEGER",
            "null": "NOT NULL"
          },
          "glassAirCoeff": {
            "type": "INTEGER",
            "null": "NOT NULL"
          },
          "hardwareTypeIndex": {
            "type": "INTEGER",
            "null": "NOT NULL"
          },
          "hardwareIndex": {
            "type": "INTEGER",
            "null": "NOT NULL"
          },
          "hardwareId": {
            "type": "INTEGER",
            "null": "NOT NULL"
          },
          "hardwareName": {
            "type": "TEXT",
            "null": "NOT NULL"
          },
          "hardwareHeatCoeff": {
            "type": "INTEGER",
            "null": "NOT NULL"
          },
          "hardwareAirCoeff": {
            "type": "INTEGER",
            "null": "NOT NULL"
          },
          "laminationOutId": {
            "type": "INTEGER",
            "null": "NOT NULL"
          },
          "laminationOutName": {
            "type": "TEXT",
            "null": "NOT NULL"
          },
          "laminationOutPrice": {
            "type": "FLOAT",
            "null": "NOT NULL"
          },
          "laminationInId": {
            "type": "INTEGER",
            "null": "NOT NULL"
          },
          "laminationInName": {
            "type": "TEXT",
            "null": "NOT NULL"
          },
          "laminationInPrice": {
            "type": "FLOAT",
            "null": "NOT NULL"
          },
          "doorShapeId": {
            "type": "INTEGER",
            "null": "NOT NULL"
          },
          "doorSashShapeId": {
            "type": "INTEGER",
            "null": "NOT NULL"
          },
          "doorHandleShapeId": {
            "type": "INTEGER",
            "null": "NOT NULL"
          },
          "doorLockShapeId": {
            "type": "INTEGER",
            "null": "NOT NULL"
          },
          "heatTransferMin": {
            "type": "INTEGER",
            "null": "NOT NULL"
          },
          "heatTransferTOTAL": {
            "type": "INTEGER",
            "null": "NOT NULL"
          },
          "airCirculationTOTAL": {
            "type": "INTEGER",
            "null": "NOT NULL"
          },
          "templatePriceSELECT": {
            "type": "FLOAT",
            "null": "NOT NULL"
          },
          "laminationPriceSELECT": {
            "type": "FLOAT",
            "null": "NOT NULL"
          },
          "addElementsPriceSELECT": {
            "type": "FLOAT",
            "null": "NULL"
          },
          "productPriceTOTAL": {
            "type": "FLOAT",
            "null": "NOT NULL"
          },
          "comment": {
            "type": "TEXT",
            "null": "NULL"
          },
          "productQty": {
            "type": "INTEGER",
            "null": "NOT NULL"
          }

        },


        orderTableFields = {
          "id": {
            "type": "INTEGER",
            "null": "NOT NULL",
            "primary": true,
            "auto_increment": true
          },
          "created": {
            "type": "TIMESTAMP",
            "null": "NOT NULL",
            "default": "CURRENT_TIMESTAMP"
          },
          "orderId": {
            "type": "INTEGER",
            "null": "NOT NULL"
          },
          "orderDate": {
            "type": "TEXT",
            "null": "NOT NULL"
          },
          "currCityId": {
            "type": "INTEGER",
            "null": "NOT NULL"
          },
          "currCityName": {
            "type": "TEXT",
            "null": "NOT NULL"
          },
          "currRegionName": {
            "type": "TEXT",
            "null": "NOT NULL"
          },
          "currCountryName": {
            "type": "TEXT",
            "null": "NOT NULL"
          },
          "currClimaticZone": {
            "type": "INTEGER",
            "null": "NOT NULL"
          },
          "currHeatTransfer": {
            "type": "INTEGER",
            "null": "NOT NULL"
          },
          "currFullLocation": {
            "type": "TEXT",
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
          "deliveryDate": {
            "type": "TEXT",
            "null": "NULL"
          },
          "newDeliveryDate": {
            "type": "TEXT",
            "null": "NULL"
          },
          "deliveryPrice": {
            "type": "INTEGER",
            "null": "NULL"
          },
          "isDatePriceLess": {
            "type": "BOOLEAN",
            "null": "NOT NULL"
          },
          "isDatePriceMore": {
            "type": "BOOLEAN",
            "null": "NOT NULL"
          },
          "selectedFloor": {
            "type": "INTEGER",
            "null": "NULL"
          },
          "selectedFloorPrice": {
            "type": "INTEGER",
            "null": "NULL"
          },
          "selectedAssembling": {
            "type": "TEXT",
            "null": "NULL"
          },
          "selectedAssemblingPrice": {
            "type": "INTEGER",
            "null": "NULL"
          },
          "isInstalment": {
            "type": "INTEGER",
            "null": "NULL"
          },
          "selectedInstalmentPeriod": {
            "type": "INTEGER",
            "null": "NULL"
          },
          "selectedInstalmentPercent": {
            "type": "INTEGER",
            "null": "NULL"
          },
          "isOldPrice": {
            "type": "BOOLEAN",
            "null": "NOT NULL"
          },
          "paymentFirst": {
            "type": "INTEGER",
            "null": "NULL"
          },
          "paymentMonthly": {
            "type": "INTEGER",
            "null": "NULL"
          },
          "paymentFirstPrimary": {
            "type": "INTEGER",
            "null": "NULL"
          },
          "paymentMonthlyPrimary": {
            "type": "INTEGER",
            "null": "NULL"
          },
          "orderPriceTOTAL": {
            "type": "INTEGER",
            "null": "NULL"
          },
          "orderPriceTOTALPrimary": {
            "type": "INTEGER",
            "null": "NULL"
          },
          "name": {
            "type": "TEXT",
            "null": "NULL"
          },
          "location": {
            "type": "TEXT",
            "null": "NULL"
          },
          "address": {
            "type": "TEXT",
            "null": "NULL"
          },
          "mail": {
            "type": "TEXT",
            "null": "NULL"
          },
          "phone": {
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
        },

        addElementTableFields = {

          "id": {
            "type": "INTEGER",
            "null": "NULL",
            "primary": true,
            "auto_increment": true
          },
          "orderId": {
            "type": "INTEGER",
            "null": "NULL"
          },
          "productId": {
            "type": "INTEGER",
            "null": "NULL"
          },
          "elementId": {
            "type": "INTEGER",
            "null": "NULL"
          },
          "elementType": {
            "type": "INTEGER",
            "null": "NULL"
          },
          "elementName": {
            "type": "TEXT",
            "null": "NULL"
          },
          "elementWidth": {
            "type": "INTEGER",
            "null": "NULL"
          },
          "elementHeight": {
            "type": "INTEGER",
            "null": "NULL"
          },
          "elementColor": {
            "type": "TEXT",
            "null": "NULL"
          },
          "elementPrice": {
            "type": "INTEGER",
            "null": "NULL"
          },
          "elementQty": {
            "type": "INTEGER",
            "null": "NULL"
          }

        },


        analyticsTableFields = {
          "id": {
            "type": "INTEGER",
            "null": "NOT NULL",
            "primary": true,
            "auto_increment": true
          },
          "created": {
            "type": "TIMESTAMP",
            "null": "NOT NULL",
            "default": "CURRENT_TIMESTAMP"
          },
          "userId": {
            "type": "INTEGER",
            "null": "NOT NULL"
          },
          "orderId": {
            "type": "INTEGER",
            "null": "NOT NULL"
          },
          "elementId": {
            "type": "INTEGER",
            "null": "NULL"
          },
          "elementType": {
            "type": "INTEGER",
            "null": "NULL"
          }
        };


    thisFactory.publicObj = {
      productsTableBD: 'products',
      ordersTableBD: 'orders',
      addElementsTableBD: 'add_elements',
      analyticsTableBD: 'analytics',
      sqliteTableBD: 'sqlite_sequence',

      insertDB: insertDB,
      selectDB: selectDB,
      selectAllDB: selectAllDB,
      updateDB: updateDB,
      deleteTable: deleteTable,
      deleteDB: deleteDB

    };

    //======= creating tables in localDB =========//
    db.createTable(thisFactory.publicObj.productsTableBD, productTableFields);
    db.createTable(thisFactory.publicObj.ordersTableBD, orderTableFields);
    db.createTable(thisFactory.publicObj.addElementsTableBD, addElementTableFields);
    db.createTable(thisFactory.publicObj.analyticsTableBD, analyticsTableFields);

    return thisFactory.publicObj;



//============ methods ================//

    function insertDB(tableName, elem) {
      db.insert(tableName, elem);/*.then(function (results) {
        //console.log(results.insertId);
      });*/
    }

    function selectDB(tableName, options, callback) {
      var handler = [];
      db.select(tableName, options).then(function (results) {
        if (results.rows.length) {
          for (var i = 0; i < results.rows.length; i++) {
            handler.push(results.rows.item(i));
          }
          callback(new OkResult(handler));
        } else {
          callback(new ErrorResult(1, 'No in database!'));
        }
      });
    }

    function selectAllDB(tableName, callback) {
      var handler = [];
      db.selectAll(tableName).then(function (results) {
        if (results.rows.length) {
          for (var i = 0; i < results.rows.length; i++) {
            handler.push(results.rows.item(i));
          }
          callback(new OkResult(handler));
        } else {
          callback(new ErrorResult(1, 'No in database!'));
        }
      });
    }

    function updateDB(tableName, elem, options) {
      db.update(tableName, elem, options);
    }

    function deleteTable(tableName) {
      db.dropTable(tableName);
    }

    function deleteDB(tableName, options) {
      db.del(tableName, options);
    }

  }

})();