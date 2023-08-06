(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('AlertCtrl',

  function($filter, GlobalStor, DesignStor, ProductStor, OrderStor, LightServ, GeneralServ, ConfigMenuServ) {
    /*jshint validthis:true */
    var thisCtrl = this;
    thisCtrl.G = GlobalStor;
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

    function saveProduct() {
      LightServ.designSaved();
    }

    function checkForAddElem() {
      GlobalStor.global.isAlertInfo = 0;
      if (!GlobalStor.global.isChangedTemplate) {
        GlobalStor.global.isChangedTemplate = DesignStor.design.designSteps.length ? 1 : 0;
      }
      if (!GlobalStor.global.isZeroPriceList.length) {
        if (!ProductStor.product.is_addelem_only) {
          if (GlobalStor.global.dangerAlert < 1) {
            if (ProductStor.product.beadsData.length > 0) {
              if (OrderStor.order.products.length === 0) {
                saveProduct();
              } else if (GlobalStor.global.isNewTemplate === 1) {
                saveProduct();
              } else if (GlobalStor.global.isChangedTemplate === 0) {
                //  ALERT
                GlobalStor.global.isNoChangedProduct = 1;
              } else {
                saveProduct();
              }
            } else {
              GeneralServ.isErrorProd(
                $filter("translate")("common_words.ERROR_PROD_BEADS")
              );
            }
          }
        } else {
          saveAddElems();
        }
      } else {
        var msg = thisCtrl.ATENTION_MSG1; //+" "+GlobalStor.global.isZeroPriceList+" "+thisCtrl.ATENTION_MSG2;
        GlobalStor.global.isZeroPriceList.forEach(function (ZeroElem) {
          msg += " " + ZeroElem + "\n";
        });
        msg += " \n" + thisCtrl.ATENTION_MSG2;
        GeneralServ.infoAlert(thisCtrl.ATENTION, msg);
      }
    }

    function setTabFromAlert(newTab) {
      if (GlobalStor.global.MobileTabActive === newTab) {
          GlobalStor.global.MobileTabActive = 0;
      } else {
          GlobalStor.global.MobileTabActive = newTab;
      }
    };

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
    /**========== FINISH ==========*/
    thisCtrl.isAlert = isAlert;
    thisCtrl.clickYes = clickYes;
    thisCtrl.clickNo = clickNo;
    thisCtrl.clickCopy = clickCopy;
    thisCtrl.syncNow = syncNow;
    thisCtrl.noSync = noSync;
    thisCtrl.setTabFromAlert = setTabFromAlert;
    thisCtrl.checkForAddElem = checkForAddElem;
  });
})();
