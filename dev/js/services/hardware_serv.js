(function () {
  'use strict';
  /**@ngInject*/
  angular
    .module('HistoryModule')
    .factory('HardwareServ',

      function ($location,
                $filter,
                $q,
                ProductStor,
                MainServ,
                DesignStor,
                AnalyticsServ,
                UserStor,
                OrderStor,
                GlobalStor) {
        /*jshint validthis:true */
        var thisFactory = this;


        /**============ METHODS ================*/

        /**----------- Select hardware -------- */
        function selectHardware(newId) {
          if (ProductStor.product.currentSet) {
            ProductStor.product.currentSet = 0;
          }
          GlobalStor.global.isChangedTemplate = 1;
          if (ProductStor.product.hardware.id !== newId) {

            /** check sizes of all hardware in sashes */
            MainServ.checkHardwareSizes(ProductStor.product.template, newId);

            if (DesignStor.design.extraHardware.length) {
              /** there are incorrect sashes
               * expose Alert */
              DesignStor.design.isHardwareExtra = 1;
            } else {
              //-------- set current Hardware
              MainServ.setCurrentHardware(ProductStor.product, newId);
                //------ calculate price
                MainServ.preparePrice(
                  ProductStor.product.template,
                  ProductStor.product.profile.id,
                  ProductStor.product.glass,
                  ProductStor.product.hardware.id,
                  ProductStor.product.lamination.lamination_in_id
                );
              //------ save analytics data
//AnalyticsServ.saveAnalyticDB(UserStor.userInfo.id, OrderStor.order.id, ProductStor.product.template_id, newId, 3);
              /** send analytics data to Server*/
              AnalyticsServ.sendAnalyticsData(
                UserStor.userInfo.id,
                OrderStor.order.id,
                ProductStor.product.template_id,
                newId,
                3
              );
            }
          }
        }

        /**========== FINISH ==========*/
        //------ clicking
        selectHardware:selectHardware;

        thisFactory.publicObj = {
          selectHardware: selectHardware
        };

        return thisFactory.publicObj;


      });
})();
