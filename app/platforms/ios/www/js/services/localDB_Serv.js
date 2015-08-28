(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('BauVoiceApp')
    .factory('localDB', localDBFactory);

  function localDBFactory($webSql, $q) {

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
          "orderId": { // order_id
            "type": "INTEGER",
            "null": "NOT NULL"
          },
          "orderDate": { // order_date
            "type": "INTEGER",
            "null": "NOT NULL"
          },
          "currCityId": {//TODO delete
            "type": "INTEGER",
            "null": "NOT NULL"
          },
          "currCityName": { // customer_city
            "type": "TEXT",
            "null": "NOT NULL"
          },
          "currRegionName": { // customer_region
            "type": "TEXT",
            "null": "NOT NULL"
          },
          "currCountryName": {// customer_country
            "type": "TEXT",
            "null": "NOT NULL"
          },
          "currClimaticZone": { // climatic_zone
            "type": "INTEGER",
            "null": "NOT NULL"
          },
          "currHeatTransfer": { //TODO ?????
            "type": "INTEGER",
            "null": "NOT NULL"
          },
          "currFullLocation": { // full_location
            "type": "TEXT",
              "null": "NOT NULL"
          },
          "orderType": { //TODO delete
            "type": "TEXT",
            "null": "NULL"
          },
          "orderStyle": {// order_style
            "type": "TEXT",
            "null": "NULL"
          },
          "productsQty": { // products_qty
            "type": "INTEGER",
            "null": "NULL"
          },
          "productsPriceTOTAL": { //products_price_total
            "type": "INTEGER",
            "null": "NULL"
          },
          "deliveryDate": { //delivery_date
            "type": "INTEGER",
            "null": "NULL"
          },
          "newDeliveryDate": { // new_delivery_date
            "type": "INTEGER",
            "null": "NULL"
          },
          "deliveryPrice": { // delivery_price
            "type": "INTEGER",
            "null": "NULL"
          },
          "isDatePriceLess": { //is_date_price_less
            "type": "INTEGER",
            "null": "NOT NULL"
          },
          "isDatePriceMore": { //is_date_price_more
            "type": "INTEGER",
            "null": "NOT NULL"
          },
          "selectedFloor": { // floor_id
            "type": "INTEGER",
            "null": "NULL"
          },
          "selectedFloorPrice": { //TODO delete
            "type": "INTEGER",
            "null": "NULL"
          },
          "selectedAssembling": { // mounting_id
            "type": "TEXT",
            "null": "NULL"
          },
          "selectedAssemblingPrice": {//TODO delete
            "type": "INTEGER",
            "null": "NULL"
          },
          "isInstalment": { //is_instalment
            "type": "INTEGER",
            "null": "NULL"
          },
          "selectedInstalmentPeriod": { //instalment_id
            "type": "INTEGER",
            "null": "NULL"
          },
          "selectedInstalmentPercent": {
            "type": "INTEGER",
            "null": "NULL"
          },
          "isOldPrice": { // is_old_price
            "type": "INTEGER",
            "null": "NOT NULL"
          },
          "paymentFirst": { //payment_first
            "type": "INTEGER",
            "null": "NULL"
          },
          "paymentMonthly": { // payment_monthly
            "type": "INTEGER",
            "null": "NULL"
          },
          "paymentFirstPrimary": { // payment_first_primary
            "type": "INTEGER",
            "null": "NULL"
          },
          "paymentMonthlyPrimary": { // payment_monthly_primary
            "type": "INTEGER",
            "null": "NULL"
          },
          "orderPriceTOTAL": { // order_price_total
            "type": "INTEGER",
            "null": "NULL"
          },
          "orderPriceTOTALPrimary": { // order_price_total_primary
            "type": "INTEGER",
            "null": "NULL"
          },
          "currDiscount": { // discount_construct
            "type": "INTEGER",
            "null": "NULL"
          },
          "currDiscountAddElem": { // discount_addelem
            "type": "INTEGER",
            "null": "NULL"
          },
          "name": { // customer_name
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
          "mail": { // customer_mail
            "type": "TEXT",
            "null": "NULL"
          },
          "phone": { // customer_phone
            "type": "TEXT",
            "null": "NULL"
          },
          "phone2": { // customer_phone2 ??????
            "type": "TEXT",
            "null": "NULL"
          },
          "itn": { // customer_itn
            "type": "INTEGER",
            "null": "NULL"
          },
          "starttime": { // customer_starttime
            "type": "TEXT",
            "null": "NULL"
          },
          "endtime": { // customer_endtime
            "type": "TEXT",
            "null": "NULL"
          },
          "target": { // customer_target
            "type": "TEXT",
            "null": "NULL"
          },
          "sex": { // customer_sex
            "type": "TEXT",
            "null": "NULL"
          },
          "age": { // customer_age
            "type": "TEXT",
            "null": "NULL"
          },
          "education": { // customer_education
            "type": "TEXT",
            "null": "NULL"
          },
          "occupation": { // customer_occupation
            "type": "TEXT",
            "null": "NULL"
          },
          "infoSource": { // customer_infoSource
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

    function selectDB(tableName, options) {
      var deferred = $q.defer(),
          handler = [];
      db.select(tableName, options).then(function (result) {
        var resultQty = result.rows.length,
            i = 0;
        if (resultQty) {
          for (; i < resultQty; i++) {
            handler.push(result.rows.item(i));
          }
          deferred.resolve(handler);
        } else {
          deferred.resolve();
        }
      });
      return deferred.promise;
    }


    function selectAllDB(tableName) {
      var deferred = $q.defer(),
          handler = [];
      db.selectAll(tableName).then(function (result) {
        var resultQty = result.rows.length,
            i = 0;
        if(resultQty) {
          for(;i < resultQty; i++) {
            handler.push(result.rows.item(i));
          }
          deferred.resolve(handler);
        } else {
          deferred.resolve();
        }
      });
      return deferred.promise;
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