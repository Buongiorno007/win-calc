(function () {
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('NavMenuCtrl',

      function ($location,
                $window,
                $filter,
                $timeout,
                globalConstants,
                GeneralServ,
                NavMenuServ,
                MainServ,
                UserStor,
                GlobalStor,
                OrderStor,
                DesignStor,
                ProductStor,
                localDB,
                AuxStor,
                HistoryStor) {
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

        thisCtrl.NAVMENU_STANDART_VERSION = $filter('translate')('mainpage.NAVMENU_STANDART_VERSION');
        thisCtrl.NAVMENU_LIGHT_VER = $filter('translate')('mainpage.NAVMENU_LIGHT_VER');
        thisCtrl.LOGOUT = $filter('translate')('settings.LOGOUT');


        /**============ METHODS ================*/
        //------- Select menu item
        function selectMenuItem(id) {
          thisCtrl.activeMenuItem = (thisCtrl.activeMenuItem === id) ? 0 : id;
          //-------- go to...
          switch (id) {
            case 1:
              GeneralServ.stopStartProg();
              $location.path("/location");
              break;
            case 2:
              NavMenuServ.getCurrentGeolocation();
              //------- switch off navMenuItem
              thisCtrl.activeMenuItem = 0;
              break;
            case 3:
              //------- set previos Page
              GeneralServ.setPreviosPage();
              $location.path("main");
              GlobalStor.global.currOpenPage = 'main';
              break;
            case 4:
              $location.path("/cart");
              GlobalStor.global.currOpenPage = 'cart';
              break;
            case 5:
              GlobalStor.global.showKarkas = 0;
              GlobalStor.global.showConfiguration = 1;
              GlobalStor.global.showCart = 0;
              NavMenuServ.createAddElementsProduct();
              break;
            case 6:
              GeneralServ.stopStartProg();
              NavMenuServ.gotoHistoryPage();
              break;
            case 7:
              //------- set previos Page
              GeneralServ.setPreviosPage();
              $location.path("/settings");
              break;
            case 8:
              //------- switch off navMenuItem
              thisCtrl.activeMenuItem = 0;
              if (location.href.includes('steko')) {
                GeneralServ.goToLink('http://www.steko.com.ua/help/dealer/index.php');
              } else if (UserStor.userInfo.factoryLink) {
                if (UserStor.userInfo.factoryLink.length) {
                  GeneralServ.goToLink(UserStor.userInfo.factoryLink);
                }
              }
              break;
            case 9:
              NavMenuServ.switchVoiceHelper();
              break;
            case 10: {
              if (!GlobalStor.global.isLightVersion) {
                GlobalStor.global.showKarkas = 1;
                GlobalStor.global.showConfiguration = 0;
                GlobalStor.global.showCart = 0;
                GlobalStor.global.isLightVersion = 1;

                if ($location.path() === "/cart") {
                  ProductStor.product = ProductStor.setDefaultProduct();
                  GlobalStor.global.isCreatedNewProduct = 1;
                  GlobalStor.global.isChangedTemplate = 0;
                  //------- set new templates
                  MainServ.setCurrTemplate();
                  MainServ.prepareTemplates(ProductStor.product.construction_type).then(function () {
                    /** start lamination filtering */
                    MainServ.cleanLamFilter();
                    MainServ.laminatFiltering();
                    $location.path("/light");
                  });
                } else {

                  $location.path("/light");
                }
                GlobalStor.global.startProgramm = 0;
                GlobalStor.global.currOpenPage = 'light';
              }
              else {
                $location.path("/main");
                GlobalStor.global.isLightVersion = 0;
                GlobalStor.global.isNavMenu = !GlobalStor.global.isNavMenu;
                GlobalStor.global.isConfigMenu = !GlobalStor.global.isConfigMenu;
              }
              break;
            }
              case 11: {
                $location.path("/mobile");
              }
          }
        }

        function clickNewProject() {
          thisCtrl.activeMenuItem = 0;
          NavMenuServ.clickNewProject();
        }

        function logOut() {
          localStorage.clear();
          localDB.db.clear().then(function () {
            // Run this code once the database has been entirely deleted.
            console.log('Database is now empty.');
          }).catch(function (err) {
            // This code runs if there were any errors
            console.log(err);
          });
          // $location.path("/");
          location.reload();
        }

        /**========== FINISH ==========*/

        //------ clicking
        thisCtrl.logOut = logOut;
        thisCtrl.selectMenuItem = selectMenuItem;
        thisCtrl.clickNewProject = clickNewProject;


      });
})();
