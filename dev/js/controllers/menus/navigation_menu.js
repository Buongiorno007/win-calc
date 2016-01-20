(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('NavMenuCtrl', navigationMenuCtrl);

  function navigationMenuCtrl($location, $window, globalConstants, GeneralServ, NavMenuServ, GlobalStor, OrderStor, ProductStor, UserStor) {

    var thisCtrl = this;
    thisCtrl.G = GlobalStor;
    thisCtrl.O = OrderStor;
    thisCtrl.P = ProductStor;


    thisCtrl.config = {
      DELAY_SHOW_STEP: 0.2,
      DELAY_SHOW_NAV_LIST: 5 * globalConstants.STEP,
      DELAY_SHOW_NAVICON: 10 * globalConstants.STEP,
      DELAY_TYPE_NAVTITLE: 10 * globalConstants.STEP,
      DELAY_TYPE_DIVIDER: 10 * globalConstants.STEP,
      DELAY_SHOW_ORDERS: 35 * globalConstants.STEP,
      DELAY_SHOW_NEWCALC_BTN: 35 * globalConstants.STEP,
      typing: 'on'
    };

    thisCtrl.activeMenuItem = 0;

    //------ clicking
    thisCtrl.selectMenuItem = selectMenuItem;
    thisCtrl.clickNewProject = clickNewProject;


    //============ methods ================//

    //------- Select menu item
    function selectMenuItem(id) {
      thisCtrl.activeMenuItem = (thisCtrl.activeMenuItem === id) ? 0 : id;
      //-------- go to...
      switch(id) {
        case 1:
          GeneralServ.stopStartProg();
          $location.path('/location');
          break;
        case 2:
          NavMenuServ.getCurrentGeolocation();
          //------- switch off navMenuItem
          thisCtrl.activeMenuItem = 0;
          break;
        case 3:
          //------- set previos Page
          GeneralServ.setPreviosPage();
          $location.path('/main');
          break;
        case 4:
          $location.path('/cart');
          break;
        case 5:
          NavMenuServ.createAddElementsProduct();
          break;
        case 6:
          GeneralServ.stopStartProg();
          NavMenuServ.gotoHistoryPage();
          break;
        case 7:
          //------- set previos Page
          GeneralServ.setPreviosPage();
          $location.path('/settings');
          break;
        case 8:
          //------- switch off navMenuItem
          thisCtrl.activeMenuItem = 0;
          if(UserStor.userInfo.factoryLink.length) {
            if (GlobalStor.global.isDevice) {
              var ref = window.open(UserStor.userInfo.factoryLink);
              ref.close();
            } else {
              $window.open(UserStor.userInfo.factoryLink);
            }
          }
          break;
        case 9:
          NavMenuServ.switchVoiceHelper();
          break;
      }
    }


    function clickNewProject() {
      thisCtrl.activeMenuItem = 0;
      NavMenuServ.clickNewProject();
    }

  }
})();