(function(){
  'use strict';

  angular
    .module('BauVoiceApp')
    .factory('analyticsServ', analyticsFactory);

  analyticsFactory.$inject = ['localDB'];

  function analyticsFactory(localDB) {

    var thisFactory = this;

    thisFactory.analyticsObjSource = {
      "userId": '',
      "orderId": '',
      "elementId": '',
      "elementType": ''
    };

    thisFactory.publicObj = {
      saveAnalyticDB: insertAnalyticsDB,
      collectAnalytic: collectAnalyticData
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

    function collectAnalyticData() {
      localDB.selectAllDB(localDB.analyticsTableBD, function (results) {
        if (results.status) {
          return angular.copy(results.data[0]);
        }
      });
    }

  }
})();
