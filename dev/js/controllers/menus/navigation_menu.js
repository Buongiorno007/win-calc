(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('NavMenuCtrl',

  function(
    $location,
    $window,
    $filter,
    globalConstants,
    GeneralServ,
    NavMenuServ,
    GlobalStor,
    OrderStor,
    ProductStor,
    UserStor
  ) {
    /*jshint validthis:true */
    var thisCtrl = this;
    thisCtrl.G = GlobalStor;
    thisCtrl.O = OrderStor;
    thisCtrl.P = ProductStor;

    thisCtrl.activeMenuItem = 0;

    //------- translate
    thisCtrl.NAVMENU_GEOLOCATION = $filter('translate')('mainpage.NAVMENU_GEOLOCATION');
    thisCtrl.NAVMENU_CURRENT_GEOLOCATION = $filter('translate')('mainpage.NAVMENU_CURRENT_GEOLOCATION');
    thisCtrl.NAVMENU_CALCULATIONS = $filter('translate')('mainpage.NAVMENU_CALCULATIONS');
    thisCtrl.NAVMENU_CURRENT_CALCULATION = $filter('translate')('mainpage.NAVMENU_CURRENT_CALCULATION');
    thisCtrl.NAVMENU_CART = $filter('translate')('mainpage.NAVMENU_CART');
    thisCtrl.NAVMENU_ADD_ELEMENTS = $filter('translate')('mainpage.NAVMENU_ADD_ELEMENTS');
    thisCtrl.NAVMENU_ALL_CALCULATIONS = $filter('translate')('mainpage.NAVMENU_ALL_CALCULATIONS');
    thisCtrl.NAVMENU_APPENDIX = $filter('translate')('mainpage.NAVMENU_APPENDIX');
    thisCtrl.NAVMENU_SETTINGS = $filter('translate')('mainpage.NAVMENU_SETTINGS');
    thisCtrl.NAVMENU_MORE_INFO = $filter('translate')('mainpage.NAVMENU_MORE_INFO');
    thisCtrl.NAVMENU_VOICE_HELPER = $filter('translate')('mainpage.NAVMENU_VOICE_HELPER');
    thisCtrl.NAVMENU_NEW_CALC = $filter('translate')('mainpage.NAVMENU_NEW_CALC');



    /**============ METHODS ================*/

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
          if(UserStor.userInfo.factoryLink) {
            if (UserStor.userInfo.factoryLink.length) {
              GeneralServ.goToLink(UserStor.userInfo.factoryLink);
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




    /**========== FINISH ==========*/

    //------ clicking
    thisCtrl.selectMenuItem = selectMenuItem;
    thisCtrl.clickNewProject = clickNewProject;


  });
})();