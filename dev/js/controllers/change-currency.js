(function(){
    'use strict';
    /**@ngInject*/
    angular
      .module('SettingsModule')
      .controller('ChangeCurrencyCtrl',
  
    function(
      $location,
      $translate,
      $timeout,
      globalConstants,
      GlobalStor,
      UserStor,
      NavMenuServ,
      loginServ
    ) {
      /*jshint validthis:true */
      var thisCtrl = this;
      thisCtrl.constants = globalConstants;
      thisCtrl.U = UserStor;
  
      thisCtrl.config = {
        DELAY_START: globalConstants.STEP,
        typing: 'on'
      };
  
  
  
  
      /**============ METHODS ================*/

      function switchCurrency(currencyId) {
        var defer = $q.defer();
        /** download All Currencies */
        localDB
          .selectLocalDB(
            localDB.tablesLocalDB.currencies.tableName,
            null,
            "id, is_base, name, value"
          )


     
        UserStor.userInfo.currencyLabel = globalConstants.currencies[currencyId].label;
        UserStor.userInfo.currencyName = globalConstants.currencies[currencyId].name;
        $timeout(function() {
          $location.path("/"+GlobalStor.global.currOpenPage);
        }, 500);
        let currencyDoll = localDB.tablesLocalDB.currencies.name.usd;
        console.log(currencyDoll);
      }

  
      function gotoSettingsPage() {
        $location.path("/"+GlobalStor.global.prevOpenPage);
      }
  
  
  
      /**========== FINISH ==========*/
  
      //------ clicking
      thisCtrl.gotoSettingsPage = gotoSettingsPage;
      thisCtrl.switchCurrency = switchCurrency;
      thisCtrl.gotDeviceCurrency = loginServ.gotDeviceCurrency;
  
        $("#main-frame").addClass("main-frame-mobView");
        $("#app-container").addClass("app-container-mobView");
        let obj = $("#main-frame");
        obj.css({
            "transform": "scale(1)",
            "left": "0px",
            "top": "0px",
        });
    });
  })();
  