(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('AlertCtrl',

  function($filter, GlobalStor, UserStor, OrderStor, CartMenuServ, GlassesServ) {
    /*jshint validthis:true */
    var thisCtrl = this;
    thisCtrl.G = GlobalStor;
    thisCtrl.U = UserStor;
    thisCtrl.BUTTON_N = $filter('translate')('common_words.BUTTON_N');
    thisCtrl.BUTTON_Y = $filter('translate')('common_words.BUTTON_Y');
    thisCtrl.BUTTON_C = $filter('translate')('common_words.BUTTON_C');
    thisCtrl.BUTTON_E = $filter('translate')('common_words.BUTTON_E');
    thisCtrl.OK       = $filter('translate')('common_words.OK');
    thisCtrl.SAVED_KONSTRUCTION  = $filter('translate')('common_words.SAVED_KONSTRUCTION');


    /**============ METHODS ================*/

    function clickYes() {
      GlobalStor.global.isAlert = 0;
      GlobalStor.global.isSyncAlert = 0;
      GlobalStor.global.isSavingAlert = 0;
      console.log('page loading completed');
      if(GlobalStor.global.glasses.length) {
        GlobalStor.global.glasses = GlobalStor.global.glasses.map((item) => {
          return item.map((elem) => {
            elem.apprPrice = GlassesServ.selectGlass(elem.id, elem.sku, elem.glass_color, elem)
            return elem;
          })
        });
        GlassesServ.selectGlass(GlobalStor.global.glasses[0][0].id, GlobalStor.global.glasses[0][0].sku, GlobalStor.global.glasses[0][0].glass_color, GlobalStor.global.glasses[0][0])
      }
      GlobalStor.global.confirmAction();
      
    }
    function clickNo() {
      GlobalStor.global.isAlert = 0;
      GlobalStor.global.isSyncAlert = 0;
      GlobalStor.global.isSavingAlert = 0;
      GlobalStor.global.confirmInActivity();
    }
    function clickCopy() {
      GlobalStor.global.isAlert = 0;
      GlobalStor.global.isSyncAlert = 0;
      GlobalStor.global.confirmInActivity();
    }
    function isAlert() {
      GlobalStor.global.isAlert = 0;
      GlobalStor.global.isBox = 0;
    }

    function syncNow() {
      $("#updateDBcheck").prop("checked", true);
      GlobalStor.global.isAlert = 0;
      GlobalStor.global.isSyncAlert = 0;
      GlobalStor.global.confirmAction();
    }

    function noSync() {
      GlobalStor.global.isAlert = 0;
      GlobalStor.global.isSyncAlert = 0;
      GlobalStor.global.confirmAction();
      $("#updateDBcheck").prop("checked", false);
    }

    function goToCart() {
      if (OrderStor.order.products.length) {
          GlobalStor.global.showKarkas = 0;
          GlobalStor.global.showConfiguration = 0;
          GlobalStor.global.showCart = 1;
          GlobalStor.global.activePanel = 0;
          CartMenuServ.calculateOrderPrice();
          CartMenuServ.joinAllAddElements();
      }
      else {
          GeneralServ.infoAlert(
              $filter('translate')('natification.ATENTION'),
              $filter('translate')('common_words.SAVED_KONSTRUCTION_ATTENTION')
          );
      }
      //  ALERT
      GlobalStor.global.isNoChangedProduct = 0;
    }
    /**========== FINISH ==========*/
    thisCtrl.isAlert = isAlert;
    thisCtrl.goToCart = goToCart;
    thisCtrl.clickYes = clickYes;
    thisCtrl.clickNo = clickNo;
    thisCtrl.clickCopy = clickCopy;
    thisCtrl.syncNow = syncNow;
    thisCtrl.noSync = noSync;
  });
})();
