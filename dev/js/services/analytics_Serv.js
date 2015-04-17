(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('BauVoiceApp')
    .factory('analyticsServ', analyticsFactory);

  function analyticsFactory(globalDB, localDB, localStorage) {

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
          templateLength = localStorage.product.templateSource.objects.length,
          glassIndex = templateLength,
          sashIndex = templateLength;

      while(--glassIndex > -1) {
        if(localStorage.product.templateSource.objects[glassIndex].type === 'glass_paсkage') {
          var lightBlock = {
            'blockId': localStorage.product.templateSource.objects[glassIndex].id.replace(/\D+/g,""),
            'openDir': ''
          };
          lightBlockArr.push(lightBlock);
        }
      }

      var lightsLength = lightBlockArr.length;
      while(--sashIndex > -1) {
        if(localStorage.product.templateSource.objects[sashIndex].type === 'sash_block') {
          var sashId = localStorage.product.templateSource.objects[sashIndex].id.replace(/\D+/g,"");
          for(var i = 0; i < lightsLength; i++) {
            if(sashId === lightBlockArr[i].blockId) {
              lightBlockArr[i].openDir = localStorage.product.templateSource.objects[sashIndex].openDir.join(',');
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
          //globalDB.sendOrder(localStorage.userInfo.phone, localStorage.userInfo.device_code, analData, function(result){});
          //---- clear Analytics Table in localDB
          localDB.deleteDB(localDB.analyticsTableBD);
        }
      });
    }

  }
})();
