
// services/analytics_Serv.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('BauVoiceApp')
    .factory('analyticsServ', analyticsFactory);

  function analyticsFactory(globalDB, localDB, localStorage, UserStor) {

    var thisFactory = this;

    thisFactory.analyticsObjSource = {
      "userId": '',
      "orderId": '',
      "elementId": '',
      "elementType": ''
    };

    thisFactory.publicObj = {
      saveAnalyticDB: insertAnalyticsDB,
      saveGlassAnalyticDB: insertGlassAnalyticDB,
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


    //--------- save Analytics Data by Glass according to Construction (lightbox)
    function insertGlassAnalyticDB(userId, orderId, elementId, elementType) {
      var lightBlockArr = [],
          templateLength = localStorage.storage.product.templateSource.objects.length,
          glassIndex = templateLength,
          sashIndex = templateLength;

      while(--glassIndex > -1) {
        if(localStorage.storage.product.templateSource.objects[glassIndex].type === 'glass_paсkage') {
          var lightBlock = {
            'blockId': localStorage.storage.product.templateSource.objects[glassIndex].id.replace(/\D+/g,""),
            'openDir': ''
          };
          lightBlockArr.push(lightBlock);
        }
      }

      var lightsLength = lightBlockArr.length;
      while(--sashIndex > -1) {
        if(localStorage.storage.product.templateSource.objects[sashIndex].type === 'sash_block') {
          var sashId = localStorage.storage.product.templateSource.objects[sashIndex].id.replace(/\D+/g,"");
          for(var i = 0; i < lightsLength; i++) {
            if(sashId === lightBlockArr[i].blockId) {
              lightBlockArr[i].openDir = localStorage.storage.product.templateSource.objects[sashIndex].openDir.join(',');
            }
          }
        }
      }

      while(--lightsLength > -1) {
        insertAnalyticsDB(userId, orderId, elementId, lightBlockArr[lightsLength].openDir);
      }

    }


    function sendAnalyticsDB(order) {
      //----- get Analytics Data from localDB
      localDB.selectAllDB(localDB.analyticsTableBD, function (results) {
        if (results.status) {
          var analData = {
            'order': JSON.stringify(order),
            'analytics': JSON.stringify(results.data)
          };
          //----- send Analytics Data to globalDB
          globalDB.sendOrder(UserStor.userInfo.phone, UserStor.userInfo.device_code, analData, function(result){});
          //---- clear Analytics Table in localDB
          localDB.deleteDB(localDB.analyticsTableBD);
        }
      });
    }

  }
})();

