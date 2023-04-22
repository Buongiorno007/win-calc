(function () {
  'use strict';
  /**@ngInject*/
  angular
    .module('BauVoiceApp')
    .factory('AnalyticsServ',

      function (localDB,
                UserStor,
                GlobalStor) {
        /*jshint validthis:true */
        var thisFactory = this;

        thisFactory.analyticsObjSource = {
          user_id: 0,
          order_id: 0,
          element_id: 0,
          element_type: 0
        };


        /**============ METHODS ================*/
        /*
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
         localDB.insertServer(
         UserStor.userInfo.phone, UserStor.userInfo.device_code, tableName, analytics[analytQty]
         );
         }
         //---- clear Analytics Table in localDB
         localDB.deleteRowLocalDB(localDB.tablesLocalDB.analytics.tableName);
         }
         });
         }
         */
        function sendAnalyticsData(userId, orderId, templateId, elementId, elementType) {
          var analyticsObj = {
              user_id: userId,
              order_id: orderId,
              calculation_id: templateId,
              element_id: elementId,
              date: new Date()
            },
            tableName = '';
          switch (elementType) {
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
            case 5: //----- doors profiles
              tableName = 'doors_analytics';
              break;
          }
          //----- send Analytics Data to Server
          if (GlobalStor.global.onlineMode && navigator.onLine){
            localDB.insertServer(UserStor.userInfo.phone, UserStor.userInfo.device_code, tableName, analyticsObj);
          }else {
            var analitics = {
              userPhone: UserStor.userInfo.phone,
              deviceCode: UserStor.userInfo.device_code,
              tableName: tableName,
              analyticsObj: analyticsObj
            };
            GlobalStor.global.analitics_storage.push(analitics);
            // localforage.setItem("analitics", GlobalStor.global.analitics_storage, function (err, value) { });
            //console.log("analitics",GlobalStor.global.analitics_storage);

          }

        }


        /**========== FINISH ==========*/

        thisFactory.publicObj = {
          sendAnalyticsData: sendAnalyticsData//,
          //      saveAnalyticDB: insertAnalyticsDB,
          //      sendAnalyticsDB: sendAnalyticsDB
        };

        return thisFactory.publicObj;

      });
})();
