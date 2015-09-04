
// services/analytics_Serv.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('BauVoiceApp')
    .factory('analyticsServ', analyticsFactory);

  function analyticsFactory(localDB, ProductStor) {

    var thisFactory = this;

    thisFactory.analyticsObjSource = {
      user_id: 0,
      order_number: 0,
      element_id: 0,
      element_type: 0,
      created: 0
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
      analyticsObj.user_id = userId;
      analyticsObj.order_number = orderId;
      analyticsObj.element_id = elementId;
      analyticsObj.element_type = elementType;
      analyticsObj.created = new Date();
      localDB.insertRowLocalDB(analyticsObj, localDB.tablesLocalDB.analytics.tableName);
    }


    //--------- save Analytics Data by Glass according to Construction (lightbox)
    function insertGlassAnalyticDB(userId, orderId, elementId, elementType) {
      var lightBlockArr = [],
          templateLength = ProductStor.product.template_source.details.length,
          glassIndex = templateLength,
          sashIndex = templateLength;

      while(--glassIndex > -1) {
        if(ProductStor.product.template_source.details[glassIndex].type === 'glass_paсkage') {
          var lightBlock = {
            'blockId': ProductStor.product.template_source.objects[glassIndex].id.replace(/\D+/g,""),
            'openDir': ''
          };
          lightBlockArr.push(lightBlock);
        }
      }

      var lightsLength = lightBlockArr.length;
      while(--sashIndex > -1) {
        if(ProductStor.product.template_source.objects[sashIndex].type === 'sash_block') {
          var sashId = ProductStor.product.template_source.objects[sashIndex].id.replace(/\D+/g,"");
          for(var i = 0; i < lightsLength; i++) {
            if(sashId === lightBlockArr[i].blockId) {
              lightBlockArr[i].openDir = ProductStor.product.template_source.objects[sashIndex].openDir.join(',');
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
      localDB.selectLocalDB(localDB.tablesLocalDB.analytics.tableName).then(function(data) {
        if (data.length) {
          var analData = {
            'order': JSON.stringify(order),
            'analytics': JSON.stringify(data)
          };
          //----- send Analytics Data to globalDB
          //TODO globalDB.sendOrder(UserStor.userInfo.phone, UserStor.userInfo.device_code, analData, function(result){});
          //---- clear Analytics Table in localDB
          localDB.cleanLocalDB({analytics: 1});
        }
      });
    }

  }
})();

