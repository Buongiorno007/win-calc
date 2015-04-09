
// services/analytics_Serv.js

(function(){
  'use strict';

  angular
    .module('BauVoiceApp')
    .factory('analyticsServ', analyticsFactory);

  analyticsFactory.$inject = ['globalDB', 'localDB'];

  function analyticsFactory(globalDB, localDB) {

    var thisFactory = this;

    thisFactory.analyticsObjSource = {
      "userId": '',
      "orderId": '',
      "elementId": '',
      "elementType": ''
    };

    thisFactory.publicObj = {
      saveAnalyticDB: insertAnalyticsDB,
      sendAnalyticsGlobalDB: sendAnalyticsDB
    };

    return thisFactory.publicObj;


    //============ methods ================//

    function insertAnalyticsDB(userId, orderId, elementId, elementType) {
      var analyticsObj = angular.copy(thisFactory.analyticsObjSource);
      analyticsObj.userId = userId;
      analyticsObj.orderId = orderId;
      analyticsObj.elementId = elementId;
      analyticsObj.elementType = elementType;

      localDB.insertDB(localDB.analyticsTableBD, analyticsObj);
    }

    function sendAnalyticsDB(order) {
      //----- get Analytics Data from localDB
      localDB.selectAllDB(localDB.analyticsTableBD, function (results) {
        if (results.status) {
          var analData = {
            'order': JSON.stringify(order),
            'analytics': JSON.stringify(results.data)
          };
          //console.log('analData !!!!!', analData);
          //----- send Analytics Data to globalDB
          //globalDB.sendOrder(analData, function(result){});
          //---- clear Analytics Table in localDB
          localDB.deleteDB(localDB.analyticsTableBD);
        }
      });
    }

  }
})();

