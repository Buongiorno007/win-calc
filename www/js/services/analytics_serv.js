
// services/analytics_serv.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('BauVoiceApp')
    .factory('AnalyticsServ', analyticsFactory);

  function analyticsFactory(localDB, UserStor) {

    var thisFactory = this;

    thisFactory.analyticsObjSource = {
      user_id: 0,
      order_id: 0,
      element_id: 0,
      element_type: 0
    };

    thisFactory.publicObj = {
      saveAnalyticDB: insertAnalyticsDB,
      sendAnalyticsDB: sendAnalyticsDB
    };

    return thisFactory.publicObj;


    //============ methods ================//

    function insertAnalyticsDB(userId, orderId, templateId, elementId, elementType) {
      var analyticsObj = angular.copy(thisFactory.analyticsObjSource);
      analyticsObj.user_id = userId;
      analyticsObj.order_id = orderId;
      analyticsObj.calculation_id = templateId;
      analyticsObj.element_id = elementId;
      analyticsObj.element_type = elementType;
      localDB.insertRowLocalDB(analyticsObj, localDB.tablesLocalDB.analytics.tableName);
    }


    function sendAnalyticsDB() {
      //----- get Analytics Data from localDB
      localDB.selectLocalDB(localDB.tablesLocalDB.analytics.tableName).then(function(data) {
        var analytics = angular.copy(data),
            analytQty = analytics.length;
        if (analytics && analytQty) {
          while(--analytQty > -1) {
            var tableName = '';
            switch(analytics[analytQty].element_type) {
              case 1: //----- profiles
                tableName = 'profile_analytics';
                break;
              case 2: //----- glass
                break;
              case 3: //----- hardware
                tableName = 'hardware_analytics';
                break;
              case 4: //----- lamination
                break;
            }
            analytics[analytQty].date = new Date();
            delete analytics[analytQty].element_type;
            delete analytics[analytQty].id;
            delete analytics[analytQty].modified;
            //----- send Analytics Data to Server
            localDB.insertServer(UserStor.userInfo.phone, UserStor.userInfo.device_code, tableName, analytics[analytQty]);
          }
          //---- clear Analytics Table in localDB
          localDB.deleteRowLocalDB(localDB.tablesLocalDB.analytics.tableName);
        }
      });
    }

  }
})();

