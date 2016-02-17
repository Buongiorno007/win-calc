
// index.js

'use strict';
/** global variable defined Browser or Device */
/** check first device */
var isDevice = ( /(Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone)/i.test(window.navigator.userAgent) ) ? 1 : 0;

(function(){

  /**------- defined system ------ */
//  console.log('USER: navigator++', window.navigator);
//  console.log('USER: userAgent+++', window.navigator.userAgent);
//  console.log('USER: platform', window.navigator.platform);
  /** check browser */
  if(/(chrome|Chromium|safari|firefox|Opera|Yandex|internet explorer|Seamonkey)/i.test(window.navigator.userAgent)) {
    isDevice = 0;
  }
  console.log('isDevice===', isDevice);


  if(isDevice) {
    window.PhonegapApp = {
      initialize: function() {
        this.bindEvents();
      },
      bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
      },
      onDeviceReady: function() {
        //      alert('onDeviceReady');
        doInit();
        angular.element(document).ready(function() {
          angular.bootstrap(document, ['BauVoiceApp', 'LoginModule']);

          //$(document).bind('touchmove', false);
          //$cordovaDialogs
          //      $cordovaInAppBrowser.open('http://ngcordova.com', '_blank', options).then(function () {
          //        console.log("InAppBrowser opened http://ngcordova.com successfully");
          //      }, function (error) {
          //        console.log("Error: " + error);
          //      });

        });

      }
    };

    PhonegapApp.initialize();
  }


  angular.module('BauVoiceApp', [
    'ngRoute',
    'pascalprecht.translate',
    'ngTouch',
    'ngCordova',
    'swipe',

    'LoginModule',
    'MainModule',
    'DesignModule',
    'CartModule',
    'HistoryModule',
    'SettingsModule'
  ]).config(/*@ngInject*/ configurationApp);

  //============== Modules ============//
  angular
    .module('LoginModule', []);
  angular
    .module('MainModule', []);
  angular
    .module('DesignModule', []);
  angular
    .module('CartModule', []);
  angular
    .module('HistoryModule', []);
  angular
    .module('SettingsModule', []);


  function configurationApp($routeProvider, $locationProvider, $translateProvider, ukrainianDictionary, russianDictionary, englishDictionary, germanDictionary, romanianDictionary, italianDictionary) {

    //-------- delete # !!!
    //$locationProvider.html5Mode({
    //  enabled: true,
    //  requireBase: false
    //});
    $routeProvider
      .when('/', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl as loginPage',
        title: 'Login'
      })
      .when('/main', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl as mainPage',
        title: 'Main'
      })
      .when('/settings', {
        templateUrl: 'views/settings.html',
        controller: 'SettingsCtrl as settingsPage',
        title: 'Settings'
      })
      .when('/change-pass', {
        templateUrl: 'views/change-pass.html',
        controller: 'ChangePassCtrl as passwordPage',
        title: 'Change Pass'
      })
      .when('/change-lang', {
        templateUrl: 'views/change-lang.html',
        controller: 'ChangeLangCtrl as languagePage',
        title: 'Change Language'
      })
      .when('/location', {
        templateUrl: 'views/location.html',
        controller: 'LocationCtrl as locationPage',
        title: 'Location'
      })
      .when('/history', {
        templateUrl: 'views/history.html',
        controller: 'HistoryCtrl as historyPage',
        title: 'History'
      })
      .when('/cart', {
        templateUrl: 'views/cart.html',
        controller: 'CartCtrl as cartPage',
        title: 'Cart'
      })
      .when('/design', {
        templateUrl: 'views/design.html',
        controller: 'DesignCtrl as designPage',
        title: 'Design'
      })
      .when('/designMain', {
        templateUrl: 'views/design.html',
        controller: 'DesignCtrl as designPageMain',
        title: 'Design'
      })
      .otherwise({
        redirectTo: '/'
      });

    $translateProvider.translations('ru', russianDictionary);
    $translateProvider.translations('uk', ukrainianDictionary);
    $translateProvider.translations('en', englishDictionary);
    $translateProvider.translations('de', germanDictionary);
    $translateProvider.translations('ro', romanianDictionary);
    $translateProvider.translations('it', italianDictionary);

    $translateProvider.preferredLanguage('en').fallbackLanguage('en');

  }

})();


// controllers/cart.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('CartModule')
    .controller('CartCtrl', cartPageCtrl);

  function cartPageCtrl($filter, globalConstants, GlobalStor, OrderStor, ProductStor, UserStor, CartStor, CartServ, CartMenuServ) {

    var thisCtrl = this;
    thisCtrl.constants = globalConstants;
    thisCtrl.G = GlobalStor;
    thisCtrl.O = OrderStor;
    thisCtrl.U = UserStor;
    thisCtrl.C = CartStor;

    thisCtrl.config = {
      currDisConstr: 0,
      isAddElementDetail: 0,
      isCartLightView: 0,
      detailProductIndex: 0,
      isShowDiscInput: 0,
      isShowDiscInputAdd: 0,
      isProductComment: 0,

      element: $filter('translate')('add_elements.ELEMENT'),
      elementa: $filter('translate')('add_elements.ELEMENTA'),
      elements: $filter('translate')('add_elements.ELEMENTS'),
      DELAY_START: globalConstants.STEP,
      typing: 'on'
    };
    //------- set current Page
    GlobalStor.global.currOpenPage = 'cart';
    GlobalStor.global.productEditNumber = 0;
    //------- collect all AddElements of Order
    CartMenuServ.joinAllAddElements();
    //----------- start order price total calculation
    CartMenuServ.calculateOrderPrice();

    //console.log('cart +++++', JSON.stringify(OrderStor.order));

    //-------- return from Main Page
    if(GlobalStor.global.prevOpenPage === 'main') {
      //----- cleaning product
      ProductStor.product = ProductStor.setDefaultProduct();
    }
    //------- set customer data per order dialogs
    if(!GlobalStor.global.orderEditNumber) {
      CartStor.cart.customer.customer_location = OrderStor.order.customer_location;
    }



    //------ clicking
    thisCtrl.decreaseProductQty = CartServ.decreaseProductQty;
    thisCtrl.increaseProductQty = CartServ.increaseProductQty;
    thisCtrl.addNewProductInOrder = CartServ.addNewProductInOrder;
    thisCtrl.clickDeleteProduct = CartServ.clickDeleteProduct;
    thisCtrl.editProduct = CartServ.editProduct;
    thisCtrl.showAddElementDetail = showAddElementDetail;
    thisCtrl.closeAddElementDetail = closeAddElementDetail;
    thisCtrl.viewSwitching = viewSwitching;
    thisCtrl.switchProductComment = switchProductComment;

    thisCtrl.showAllAddElements = CartServ.showAllAddElements;

    thisCtrl.openDiscountBlock = CartMenuServ.openDiscountBlock;
    thisCtrl.closeDiscountBlock = CartMenuServ.closeDiscountBlock;
    thisCtrl.openDiscInput = openDiscInput;
    thisCtrl.approveNewDisc = CartMenuServ.approveNewDisc;



    //============ methods ================//


    //============= AddElements detail block
    //------- Show AddElements detail block for product
    function showAddElementDetail(productIndex) {
      if(CartStor.cart.allAddElements[productIndex].length > 0) {
        //playSound('switching');
        thisCtrl.config.detailProductIndex = productIndex;
        thisCtrl.config.isAddElementDetail = true;
      }
    }

    //--------- Close AddElements detail block
    function closeAddElementDetail() {
      thisCtrl.config.isAddElementDetail = false;
    }

    //--------- Full/Light View switcher
    function viewSwitching() {
      //playSound('swip');
      thisCtrl.config.isCartLightView = !thisCtrl.config.isCartLightView;
    }


    function switchProductComment(index) {
      var commId = index+1;
      thisCtrl.config.isProductComment = (thisCtrl.config.isProductComment === commId) ? 0 : commId;
    }



    function openDiscInput(type) {
      //------- discount x add element
      if(type) {
        thisCtrl.config.isShowDiscInput = 0;
        thisCtrl.config.isShowDiscInputAdd = 1;
      } else {
        //------- discount x construction
        thisCtrl.config.isShowDiscInput = 1;
        thisCtrl.config.isShowDiscInputAdd = 0;
      }
    }


  }
})();


// controllers/change_lang.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('SettingsModule')
    .controller('ChangeLangCtrl', changeLangCtrl);

  function changeLangCtrl($location, $translate, $timeout, globalConstants, GlobalStor, UserStor, NavMenuServ) {

    var thisCtrl = this;
    thisCtrl.constants = globalConstants;
    thisCtrl.U = UserStor;

    thisCtrl.config = {
      DELAY_START: globalConstants.STEP,
      typing: 'on'
    };

    //------ clicking
    thisCtrl.switchLang = switchLang;
    thisCtrl.gotoSettingsPage = gotoSettingsPage;


    //============ methods ================//

    function switchLang(languageId) {
      $translate.use(globalConstants.languages[languageId].label);
      UserStor.userInfo.langLabel = globalConstants.languages[languageId].label;
      UserStor.userInfo.langName = globalConstants.languages[languageId].name;
      //----- if Voice Helper switch on
      if(GlobalStor.global.isVoiceHelper) {
        GlobalStor.global.voiceHelperLanguage = NavMenuServ.setLanguageVoiceHelper();
      }
      $timeout(function() {
        $location.path('/main');
      }, 200);
    }

    function gotoSettingsPage() {
      $location.path('/settings');
    }
  }
})();


// controllers/change_pass.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('SettingsModule')
    .controller('ChangePassCtrl', changePassCtrl);

  function changePassCtrl(globalConstants, SettingServ, UserStor, localDB) {

    var thisCtrl = this;
    thisCtrl.U = UserStor;

    thisCtrl.config = {
      DELAY_START: globalConstants.STEP,
      oldPassword: 0,
      newPassword: 0,
      confirmPassword: 0,
      isErrorPassword: 0,
      isErrorOldPassword: 0,
      typing: 'on'
    };

    //------ clicking
    thisCtrl.saveNewPassword = saveNewPassword;
    thisCtrl.gotoSettingsPage = SettingServ.gotoSettingsPage;
    thisCtrl.checkError = checkError;
    thisCtrl.checkErrorOld = checkErrorOld;


    //============ methods ================//



    function saveNewPassword() {
      if( thisCtrl.config.oldPassword && UserStor.userInfo.password == localDB.md5(thisCtrl.config.oldPassword) && thisCtrl.config.newPassword && thisCtrl.config.confirmPassword && thisCtrl.config.newPassword === thisCtrl.config.confirmPassword) {
        thisCtrl.config.isErrorPassword = 0;
        UserStor.userInfo.password = localDB.md5(thisCtrl.config.newPassword);
        console.log('CHENGE PASSWORD++++', UserStor.userInfo.password);
        //----- update password in LocalDB & Server
        localDB.updateLocalServerDBs(localDB.tablesLocalDB.users.tableName, UserStor.userInfo.id, {'password': UserStor.userInfo.password}).then(function() {
          //---- clean fields
          thisCtrl.config.newPassword = thisCtrl.config.confirmPassword = '';
          SettingServ.gotoSettingsPage();
        });
      } else {
        if (!thisCtrl.config.oldPassword || (UserStor.userInfo.password != localDB.md5(thisCtrl.config.oldPassword)) ) {
          thisCtrl.config.isErrorOldPassword = 1;
        } else {
          thisCtrl.config.isErrorPassword = 1;
        }
      }

    }

    function checkError() {
      thisCtrl.config.isErrorPassword = 0;
    }

    function checkErrorOld() {
      thisCtrl.config.isErrorOldPassword = 0;
    }

  }
})();



// controllers/design.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('DesignModule')
    .controller('DesignCtrl', designPageCtrl);

  function designPageCtrl($timeout, globalConstants, DesignServ, GlobalStor, ProductStor, DesignStor) {

    var thisCtrl = this,
        delaySubMenu1 = 300,
        delaySubMenu2 = 600,
        delaySubMenu3 = 900,
        delaySubMenu4 = 1200;

    thisCtrl.constants = globalConstants;
    thisCtrl.G = GlobalStor;
    thisCtrl.P = ProductStor;
    thisCtrl.D = DesignStor;

    //------- set current Page
    GlobalStor.global.currOpenPage = 'design';

    thisCtrl.config = {
      //---- design menu
      isDesignError: 0,

      //----- door
      isDoorConfig: 0,
      selectedStep1: 0,
      selectedStep2: 0,
      selectedStep3: 0,
      selectedStep4: 0,

      DELAY_SHOW_FIGURE_ITEM: 1000,
      typing: 'on'
    };

    //--------- set template from ProductStor
    DesignServ.setDefaultTemplate();

    //============ if Door Construction
    if(ProductStor.product.construction_type === 4) {
//      DesignServ.downloadDoorConfig();
      DesignServ.setIndexDoorConfig();
    }



    //=========== clicking ============//

    thisCtrl.designSaved = DesignServ.designSaved;
    thisCtrl.designCancel = DesignServ.designCancel;
    thisCtrl.selectMenuItem = selectMenuItem;
    thisCtrl.setDefaultConstruction = DesignServ.setDefaultConstruction;

    //----- door config
    thisCtrl.toggleDoorConfig = toggleDoorConfig;
    thisCtrl.selectDoor = selectDoor;
    thisCtrl.selectSash = selectSash;
    thisCtrl.selectHandle = selectHandle;
    thisCtrl.selectLock = selectLock;
    thisCtrl.closeDoorConfig = closeDoorConfig;
    thisCtrl.saveDoorConfig = saveDoorConfig;

    //------ edit design
    thisCtrl.insertSash = insertSash;
    thisCtrl.insertCorner = insertCorner;
    thisCtrl.insertImpost = insertImpost;
    thisCtrl.insertArc = insertArc;   
    thisCtrl.initMirror = initMirror;
    thisCtrl.positionAxis = positionAxis;
    thisCtrl.positionGlass = positionGlass;

    thisCtrl.stepBack = DesignServ.stepBack;

    //------- close Report
    GlobalStor.global.isReport = 0;


    //============ methods  ================//


    //--------Select menu item
    function selectMenuItem(id) {
      if(DesignStor.design.tempSize.length) {
        //----- finish size culculation
        DesignServ.closeSizeCaclulator();
      } else {
        DesignStor.design.activeMenuItem = (DesignStor.design.activeMenuItem === id) ? 0 : id;
        DesignStor.design.isDropSubMenu = 0;
        DesignServ.hideCornerMarks();
        DesignServ.deselectAllImpost();
        if (id !== 4) {
          DesignServ.deselectAllArc();
        }
        //----- hide culculator
        DesignServ.hideSizeTools();
        if (DesignStor.design.activeMenuItem) {
          switch (DesignStor.design.activeMenuItem) {
            case 1:
              showAllAvailableGlass(id);
              //------ drop submenu items
              $timeout(function(){
                DesignStor.design.isDropSubMenu = 2;
              }, delaySubMenu1);
              $timeout(function(){
                DesignStor.design.isDropSubMenu = 6;
              }, delaySubMenu2);
              $timeout(function(){
                DesignStor.design.isDropSubMenu = 8;
              }, delaySubMenu3);
              $timeout(function(){
                DesignStor.design.isDropSubMenu = 0;
              }, delaySubMenu4);
              break;
            case 2:
              DesignServ.deselectAllGlass();
              showAllAvailableCorner(id);
              break;
            case 3:
              showAllAvailableGlass(id);
              //------ drop submenu items
              $timeout(function(){
                DesignStor.design.isDropSubMenu = 4;
              }, delaySubMenu1);
              $timeout(function(){
                DesignStor.design.isDropSubMenu = 8;
              }, delaySubMenu2);
              $timeout(function(){
                DesignStor.design.isDropSubMenu = 12;
              }, delaySubMenu3);
              $timeout(function(){
                DesignStor.design.isDropSubMenu = 0;
              }, delaySubMenu4);
              break;
            case 4:
              DesignServ.deselectAllGlass();
              showAllAvailableArc(id);
              break;
            case 5:
              //DesignServ.deselectAllGlass();
              DesignStor.design.activeSubMenuItem = id;
              break;
          }
        } else {
          //------ if we close menu
          DesignStor.design.activeSubMenuItem = 0;
          //-------- delete selected glasses
          DesignServ.deselectAllGlass();
          DesignServ.deselectAllArc();
          $timeout(function () {
            DesignStor.design.isImpostDelete = 0;
          }, 300);
        }
      }
    }


    function deactivMenu() {
      DesignStor.design.activeMenuItem = 0;
      DesignStor.design.activeSubMenuItem = 0;
      DesignStor.design.isDropSubMenu = 0;
    }

    function showDesignError() {
      thisCtrl.config.isDesignError = 1;
      DesignStor.design.activeMenuItem = 0;
      DesignStor.design.activeSubMenuItem = 0;
      $timeout(function(){
        thisCtrl.config.isDesignError = 0;
      }, 800);
    }


    //++++++++++ Edit Sash ++++++++++//

    function showAllAvailableGlass(menuId) {
      DesignStor.design.activeSubMenuItem = menuId;
      if(!DesignStor.design.selectedGlass.length) {
        //----- show all glasses
        var glasses = d3.selectAll('#tamlateSVG .glass');
        DesignStor.design.selectedGlass = glasses[0];
        glasses.classed('glass-active', false);
      }
    }



    function insertSash(sashType, event) {
//      console.log('INSER SASH ===', event, DesignStor.design.activeSubMenuItem);
      event.preventDefault();
//      event.srcEvent.stopPropagation();

      var isPermit = 1,
          glassQty = DesignStor.design.selectedGlass.length,
          i = 0;

      if(sashType === 1) {
        deactivMenu();
        //----- delete sash
        for(; i < glassQty; i++) {
          DesignServ.deleteSash(DesignStor.design.selectedGlass[i]);
        }
      } else {
        if(sashType === 2 || sashType === 6 || sashType === 8) {
          if(DesignStor.design.isDropSubMenu === sashType) {
            DesignStor.design.isDropSubMenu = 0;
          } else {
            DesignStor.design.isDropSubMenu = sashType;
            isPermit = 0;
          }
        }

        if(isPermit) {
          deactivMenu();
          //----- insert sash
          for (; i < glassQty; i++) { //TODO download hardare types and create submenu
            DesignServ.createSash(sashType, DesignStor.design.selectedGlass[i]);
          }
        }
      }
    }



    //++++++++++ Edit Corner ++++++++//

    //-------- show all Corner Marks
    function showAllAvailableCorner(menuId) {
      var corners = d3.selectAll('#tamlateSVG .corner_mark');
      if(corners[0].length) {
        //---- show submenu
        DesignStor.design.activeSubMenuItem = menuId;
        corners.transition().duration(300).ease("linear").attr('r', 50);
        DesignStor.design.selectedCorner = corners[0];
//        corners.on('touchstart', function () {
        corners.on('click', function () {
          //----- hide all cornerMark
          DesignServ.hideCornerMarks();

          //----- show selected cornerMark
          var corner = d3.select(this).transition().duration(300).ease("linear").attr('r', 50);
          DesignStor.design.selectedCorner.push(corner[0][0]);

        });
      } else {
        showDesignError();
      }
    }

    function insertCorner(conerType, event) {
      event.preventDefault();
      //event.srcEvent.stopPropagation();
      //------ hide menu
      deactivMenu();
      var cornerQty = DesignStor.design.selectedCorner.length,
          i = 0;
      switch(conerType) {
        //----- delete
        case 1:
          for(; i < cornerQty; i++) {
            DesignServ.deleteCornerPoints(DesignStor.design.selectedCorner[i]);
          }
          break;
        //----- line angel
        case 2:
          for(; i < cornerQty; i++) {
            DesignServ.setCornerPoints(DesignStor.design.selectedCorner[i]);
          }
          break;
        //----- curv angel
        case 3:
          for(; i < cornerQty; i++) {
            DesignServ.setCurvCornerPoints(DesignStor.design.selectedCorner[i]);
          }
          break;
      }
    }





    //++++++++++ Edit Arc ++++++++//

    function showAllAvailableArc(menuId) {
      var arcs = d3.selectAll('#tamlateSVG .frame')[0].filter(function (item) {
        if (item.__data__.type === 'frame' || item.__data__.type === 'arc') {
          return true;
        }
      });
      //----- if not corners
      if(arcs.length) {
        DesignStor.design.activeSubMenuItem = menuId;
//        console.log('Arcs++++++', DesignStor.design.selectedArc);
        if(!DesignStor.design.selectedArc.length) {
          //----- show all frames and arc
          var arcsD3 = d3.selectAll(arcs);
          DesignStor.design.selectedArc = arcsD3[0];
          arcsD3.classed('active_svg', true);
        }
      } else {
        showDesignError();
      }
    }



    function insertArc(arcType, event) {
      event.preventDefault();
      //event.srcEvent.stopPropagation();
      deactivMenu();
      //---- get quantity of arcs
      var arcQty = DesignStor.design.selectedArc.length;

      //======= delete arc
      if(arcType === 1) {
        //------ delete all arcs
        if (arcQty > 1) {
          DesignServ.workingWithAllArcs(0);
        } else {
          //------ delete one selected arc
          DesignServ.deleteArc(DesignStor.design.selectedArc[0]);
          DesignStor.design.selectedArc.length = 0;
        }

      //======= insert arc
      } else {
        //------ insert all arcs
        if(arcQty > 1) {
          DesignServ.workingWithAllArcs(1);
        } else {
          //------ insert one selected arc
          DesignServ.createArc(DesignStor.design.selectedArc[0]);
          DesignStor.design.selectedArc.length = 0;
        }
      }
    }




    //++++++++++ Edit Impost ++++++++//


    function insertImpost(impostType, event) {
      event.preventDefault();
      //event.srcEvent.stopPropagation();
      var isPermit = 1,
          impostsQty = DesignStor.design.selectedImpost.length,
          i = 0;

      if(impostType === 1) {
        deactivMenu();
        //----- delete imposts
        if (impostsQty) {
          for (; i < impostsQty; i++) {
            DesignServ.deleteImpost(DesignStor.design.selectedImpost[i]);
          }
          $timeout(function(){
            DesignStor.design.isImpostDelete = 0;
          }, 300);
        }
      } else {
        //----- show drop submenu
        if(impostType === 4 || impostType === 8 || impostType === 12) {
          if(DesignStor.design.isDropSubMenu === impostType) {
            DesignStor.design.isDropSubMenu = 0;
          } else {
            DesignStor.design.isDropSubMenu = impostType;
            isPermit = 0;
          }
        }

        if(isPermit) {
          deactivMenu();
          if (!impostsQty) {
            var glassQty = DesignStor.design.selectedGlass.length;
            if (glassQty) {
              //------- insert imposts
              for (; i < glassQty; i++) {
                DesignServ.createImpost(impostType, DesignStor.design.selectedGlass[i]);
              }
            }
          } else {
            DesignServ.deselectAllImpost();
          }
        }
      }
    }


    /**++++++++++ create Mirror ++++++++*/

    function initMirror(event) {
      event.preventDefault();
      deactivMenu();
      DesignServ.initMirror();
    }


    /**++++++++++ position by Axises ++++++++*/

    function positionAxis(event) {
      event.preventDefault();
      deactivMenu();
      DesignServ.positionAxises();
    }


    /**++++++++++ position by Glasses ++++++++*/

    function positionGlass(event) {
      event.preventDefault();
      deactivMenu();
      DesignServ.positionGlasses();
    }






    /**============= DOOR ===============*/

    //---------- Show Door Configuration
    function toggleDoorConfig() {
      thisCtrl.config.isDoorConfig = 1;
      DesignServ.closeSizeCaclulator();
      //----- set emplty index values
//      DesignStor.design.doorConfig.doorShapeIndex = '';
//      DesignStor.design.doorConfig.sashShapeIndex = '';
//      DesignStor.design.doorConfig.handleShapeIndex = '';
//      DesignStor.design.doorConfig.lockShapeIndex = '';
    }

    //---------- Select door shape
    function selectDoor(id) {
      if(!thisCtrl.config.selectedStep2) {
        if(DesignStor.design.doorConfig.doorShapeIndex === id) {
          DesignStor.design.doorConfig.doorShapeIndex = '';
          thisCtrl.config.selectedStep1 = 0;
        } else {
          DesignStor.design.doorConfig.doorShapeIndex = id;
          thisCtrl.config.selectedStep1 = 1;
        }
      }
    }
    //---------- Select sash shape
    function selectSash(id) {
      if(!thisCtrl.config.selectedStep3) {
        if(DesignStor.design.doorConfig.sashShapeIndex === id) {
          DesignStor.design.doorConfig.sashShapeIndex = '';
          thisCtrl.config.selectedStep2 = 0;
        } else {
          DesignStor.design.doorConfig.sashShapeIndex = id;
          thisCtrl.config.selectedStep2 = 1;
        }
      }
    }
    //-------- Select handle shape
    function selectHandle(id) {
      if(!thisCtrl.config.selectedStep4) {
        if(DesignStor.design.doorConfig.handleShapeIndex === id) {
          DesignStor.design.doorConfig.handleShapeIndex = '';
          thisCtrl.config.selectedStep3 = 0;
        } else {
          DesignStor.design.doorConfig.handleShapeIndex = id;
          thisCtrl.config.selectedStep3 = 1;
        }
      }
    }
    //--------- Select lock shape
    function selectLock(id) {
      if(DesignStor.design.doorConfig.lockShapeIndex === id) {
        DesignStor.design.doorConfig.lockShapeIndex = '';
        thisCtrl.config.selectedStep4 = 0;
      } else {
        DesignStor.design.doorConfig.lockShapeIndex = id;
        thisCtrl.config.selectedStep4 = 1;
      }
    }

    //--------- Close Door Configuration
    function closeDoorConfig() {
      if(thisCtrl.config.selectedStep3) {
        thisCtrl.config.selectedStep3 = 0;
        thisCtrl.config.selectedStep4 = 0;
        DesignStor.design.doorConfig.lockShapeIndex = '';
        DesignStor.design.doorConfig.handleShapeIndex = '';
      } else if(thisCtrl.config.selectedStep2) {
        thisCtrl.config.selectedStep2 = 0;
        DesignStor.design.doorConfig.sashShapeIndex = '';
      } else if(thisCtrl.config.selectedStep1) {
        thisCtrl.config.selectedStep1 = 0;
        DesignStor.design.doorConfig.doorShapeIndex = '';
      } else {
        //------ close door config
        thisCtrl.config.isDoorConfig = 0;
        //------ set Default indexes
        DesignStor.design.doorConfig = DesignStor.setDefaultDoor();
      }
    }

    //--------- Save Door Configuration
    function saveDoorConfig() {
      DesignServ.rebuildSVGTemplate();
      thisCtrl.config.isDoorConfig = 0;
    }

    //=============== End Door ==================//



  }
})();



// controllers/history.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('HistoryModule')
    .controller('HistoryCtrl', historyCtrl);

  function historyCtrl(GlobalStor, UserStor, HistoryStor, HistoryServ) {


    var thisCtrl = this;
    thisCtrl.G = GlobalStor;
    thisCtrl.H = HistoryStor;
    thisCtrl.U = UserStor;


    //------- set current Page
    GlobalStor.global.currOpenPage = 'history';

    //----- variables for drafts sorting
    thisCtrl.createdDate = 'created';

    HistoryServ.downloadOrders();


    //------ clicking
    thisCtrl.toCurrentCalculation = HistoryServ.toCurrentCalculation;
    thisCtrl.sendOrderToFactory = HistoryServ.sendOrderToFactory;
    thisCtrl.makeOrderCopy = HistoryServ.makeOrderCopy;
    thisCtrl.clickDeleteOrder = HistoryServ.clickDeleteOrder;
    thisCtrl.editOrder = HistoryServ.editOrder;
    thisCtrl.viewSwitching = HistoryServ.viewSwitching;

    thisCtrl.orderSearching = HistoryServ.orderSearching;
    thisCtrl.orderDateSelecting = HistoryServ.orderDateSelecting;
    thisCtrl.openCalendarScroll = HistoryServ.openCalendarScroll;
    thisCtrl.orderSorting = HistoryServ.orderSorting;
    thisCtrl.sortingInit = HistoryServ.sortingInit;


  }
})();


// controllers/location.js

(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('SettingsModule')
    .controller('LocationCtrl', locationCtrl);

  function locationCtrl(localDB, loginServ, SettingServ, GlobalStor, OrderStor, UserStor) {

    var thisCtrl = this;

    //----- current user location
    thisCtrl.userNewLocation = angular.copy(OrderStor.order.customer_location);


    //SettingServ.downloadLocations().then(function(data) {
    //  thisCtrl.locations = data;
    //});
    /** база городов и регионов долны быть только одной страны завода */
    thisCtrl.locations = GlobalStor.global.locations.cities.filter(function(item) {
      return item.countryId === UserStor.userInfo.countryId;
    });

    //------ clicking
    thisCtrl.closeLocationPage = SettingServ.closeLocationPage;
    thisCtrl.selectCity = selectCity;


    //============ methods ================//

    //-------- Select City
    function selectCity(location) {
      thisCtrl.userNewLocation = location.fullLocation;

      //----- if user settings changing
      if(GlobalStor.global.currOpenPage === 'settings') {
        UserStor.userInfo.city_id = location.cityId;
        UserStor.userInfo.cityName = location.cityName;
        UserStor.userInfo.countryId = location.countryId;
        //UserStor.userInfo.countryName = location.countryName;
        UserStor.userInfo.fullLocation = location.fullLocation;
        UserStor.userInfo.climaticZone = location.climaticZone;
        UserStor.userInfo.heatTransfer = location.heatTransfer;
        //----- save new City Id in LocalDB & Server
        //----- update password in LocalDB & Server
        localDB.updateLocalServerDBs(localDB.tablesLocalDB.users.tableName, UserStor.userInfo.id, {'city_id': location.cityId});

        //-------- if current geolocation changing
      } else if(GlobalStor.global.currOpenPage === 'main'){
        //----- build new currentGeoLocation
        loginServ.setUserGeoLocation(location.cityId, location.cityName, location.climaticZone, location.heatTransfer, location.fullLocation);
      }
      GlobalStor.global.startProgramm = false;
      SettingServ.closeLocationPage();
    }


  }
})();


// controllers/login.js

(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('LoginModule')
    .controller('LoginCtrl', loginPageCtrl);

  function loginPageCtrl($location, $cordovaNetwork, $filter, globalConstants, localDB, loginServ, GlobalStor, UserStor) {

    var thisCtrl = this;
    thisCtrl.G = GlobalStor;

    //TODO thisCtrl.isOnline = $cordovaNetwork.isOnline();
    thisCtrl.isOnline = 1;
    thisCtrl.isOffline = 0;
    thisCtrl.isLocalDB = 0;
    thisCtrl.isRegistration = 0;
    thisCtrl.submitted = 0;
    thisCtrl.isUserExist = 0;
    thisCtrl.isUserNotExist = 0;
    thisCtrl.isUserPasswordError = 0;
    thisCtrl.isSendEmail = 0;
    thisCtrl.isUserNotActive = 0;
    thisCtrl.isFactoryId = 0;
    thisCtrl.isFactoryNotSelect = 0;
    thisCtrl.isStartImport = 0;
    thisCtrl.user = {};
    thisCtrl.factories = 0;
    thisCtrl.regPhone = globalConstants.REG_PHONE;
    thisCtrl.regName = globalConstants.REG_NAME;
    thisCtrl.regMail = globalConstants.REG_MAIL;

    //------- translate
    thisCtrl.OFFLINE = $filter('translate')('login.OFFLINE');
    thisCtrl.OK = $filter('translate')('common_words.OK');
    thisCtrl.USER_CHECK_EMAIL = $filter('translate')('login.USER_CHECK_EMAIL');
    thisCtrl.USER_NOT_EXIST = $filter('translate')('login.USER_NOT_EXIST');
    thisCtrl.USER_NOT_ACTIVE = $filter('translate')('login.USER_NOT_ACTIVE');
    thisCtrl.USER_PASSWORD_ERROR = $filter('translate')('login.USER_PASSWORD_ERROR');
    thisCtrl.IMPORT_DB = $filter('translate')('login.IMPORT_DB');
    thisCtrl.MOBILE = $filter('translate')('login.MOBILE');
    thisCtrl.EMPTY_FIELD = $filter('translate')('login.EMPTY_FIELD');
    thisCtrl.WRONG_NUMBER = $filter('translate')('login.WRONG_NUMBER');
    thisCtrl.SHORT_PHONE = $filter('translate')('login.SHORT_PHONE');
    thisCtrl.PASSWORD = $filter('translate')('login.PASSWORD');
    thisCtrl.SHORT_PASSWORD = $filter('translate')('login.SHORT_PASSWORD');
    thisCtrl.ENTER = $filter('translate')('login.ENTER');
    thisCtrl.REGISTRATION = $filter('translate')('login.REGISTRATION');
    thisCtrl.SELECT_FACTORY = $filter('translate')('login.SELECT_FACTORY');
    thisCtrl.SELECT_PRODUCER = $filter('translate')('login.SELECT_PRODUCER');
    thisCtrl.SELECT = $filter('translate')('common_words.SELECT');
    thisCtrl.USER_EXIST = $filter('translate')('login.USER_EXIST');
    thisCtrl.CLIENT_NAME = $filter('translate')('cart.CLIENT_NAME');
    thisCtrl.WRONG_NAME = $filter('translate')('login.WRONG_NAME');
    thisCtrl.SHORT_NAME = $filter('translate')('login.SHORT_NAME');
    thisCtrl.SELECT_COUNTRY = $filter('translate')('login.SELECT_COUNTRY');
    thisCtrl.SELECT_REGION = $filter('translate')('login.SELECT_REGION');
    thisCtrl.SELECT_CITY = $filter('translate')('login.SELECT_CITY');
    thisCtrl.CLIENT_EMAIL = $filter('translate')('cart.CLIENT_EMAIL');
    thisCtrl.WRONG_EMAIL = $filter('translate')('cart.WRONG_EMAIL');

    //------ clicking
    thisCtrl.switchRegistration = switchRegistration;
    thisCtrl.closeRegistration = closeRegistration;
    thisCtrl.enterForm = enterForm;
    thisCtrl.registrForm = registrForm;
    thisCtrl.selectLocation = selectLocation;
    thisCtrl.selectFactory = selectFactory;
    thisCtrl.closeFactoryDialog = closeFactoryDialog;
    thisCtrl.closeOfflineAlert = closeOfflineAlert;



    //------- defined system language
    loginServ.getDeviceLanguage();


    //------- export data
    if(thisCtrl.isOnline) {
      loginServ.initExport();

      entriyWithoutLogin();
    }


    //============ methods ================//


    function entriyWithoutLogin() {
      var url = $location.search(),
          accessArr = [
            '7d537b6746f925b1703aefa9b8a9a4bc',
            '3f5f0c7d46d318e026f9ba60dceffc65',
            '799e078b084c6d57cea0b0d53a7e3008',
            '9aefeef9c7e53f9de9bb36f32649dc3f',
            'a2da6d85764368b24392740020efbc92',
            'ceb60bfed037baaa484bd7b88d274c98',

            '04fc711301f3c784d66955d98d399afb',
            '768c1c687efe184ae6dd2420710b8799',
            'f7a5c99c58103f6b65c451efd0f81826',
            '27701bd8dd141b953b94a5c9a44697c0',
            '7f7d5f9f3a660f2b09e3aae62a15e29b',
            '23ff17389acbfd020043268fb49e7048',
            'cd714cc33cfd23e74f414cbb8b9787fe',
            '2959f1aea8db0f7fbba61f0f8474d0ef',
            'a28a19e19b283845c851b4876b97cef4',
            '661e67f8ce5eaf9d63c1b5be6fce1afb',
            '0653e359db756493450c3fb1fc6790b2',
            'ec5fefce8d1d81849b47923d6d1b52c0',
            'd4ccb0f347163d9ee1cd5a106e1ec48b',
            'c500ea6c5baf3deb447be25b90cf5f1c',
            '59a6670111970ede6a77e9b43a5c4787',
            '266021e24dd0bfaaa96f2b5e21d7c800',
            'b8c4b7f74db12fadbe2d979ed93f392b',
            '2482b711a07d1da3efa733aa7014f947',
            '573b8926f015aa477cb6604901b92aea',
            'b54d11c86eb7c8955a50d20f6b3be2f2',
            '3a55b7218a5ca395ac71b3ec9904b6ed',
            '3615d9213b1b3d5fe760901f43a8405f',
            'e50137601a90943ce98b03e90d73272e',
            'd4651afb4e1c749f0bacc7ff5d101982',
            '988a8fa4855bf7ea54057717655d3fc9'
          ],
          phoneArr = [
            '0950604425',
            '0500505500',
            '78124541170',
            '22274313',
            '9201922876',
            '903528981',

            '000001',
            '000002',
            '000003',
            '000007',
            '000008',
            '000009',
            '000010',
            '000011',
            '000012',
            '000013',
            '000014',
            '000015',
            '000016',
            '000017',
            '000018',
            '000019',
            '000020',
            '000021',
            '000022',
            '000023',
            '000024',
            '000025',
            '000026',
            '000027',
            '000028'
          ],
          passwordArr = [
            '0950604425',
            '0500505500',
            '78124541170',
            '22274313',
            '9201922876',
            '903528981',

            '000001',
            '000002',
            '000003',
            '000007',
            '000008',
            '000009',
            '000010',
            '000011',
            '000012',
            '000013',
            '000014',
            '000015',
            '000016',
            '000017',
            '000018',
            '000019',
            '000020',
            '000021',
            '000022',
            '000023',
            '000024',
            '000025',
            '000026',
            '000027',
            '000028'
          ],
          accessQty = accessArr.length,
          isCustomer = 0;


      if(url.access) {

        while(--accessQty > -1) {
          if(accessArr[accessQty] === url.access) {
            thisCtrl.user.phone = phoneArr[accessQty];
            thisCtrl.user.password = passwordArr[accessQty];
            isCustomer = 1;
          }
        }

        if(isCustomer) {
          if(thisCtrl.user.phone && thisCtrl.user.password) {
            GlobalStor.global.isLoader = 1;
            checkingUser();
          }
        } else {
          localDB.importUser(url.access, 1).then(function(result) {
            var userTemp = angular.copy(result.user);
            GlobalStor.global.isLoader = 1;
            userTemp.therm_coeff_id = angular.copy(result.thermCoeffId);
            //-------- check factory Link
            if(result.factoryLink !== null) {
              userTemp.factoryLink = angular.copy(result.factoryLink);
            }
            importDBProsses(userTemp);
          });
        }

      }
    }




    function closeOfflineAlert() {
      thisCtrl.isOffline = false;
    }



    /** =========== SIGN IN ======== */

    function enterForm(form) {
//      console.log('@@@@@@@@@@@@=', typethisCtrl.user.phone, thisCtrl.user.password);
      //------ Trigger validation flag.
      thisCtrl.submitted = 1;
      if (form.$valid) {
        GlobalStor.global.isLoader = 1;
        //------ check Internet
        //TODO thisCtrl.isOnline = $cordovaNetwork.isOnline();
        if(thisCtrl.isOnline) {
          //------- check available Local DB
          loginServ.isLocalDBExist().then(function(data){
            thisCtrl.isLocalDB = data;
            if(thisCtrl.isLocalDB) {

              //======== SYNC
              console.log('SYNC');
              //---- checking user in LocalDB
              localDB.selectLocalDB(localDB.tablesLocalDB.users.tableName, {'phone': thisCtrl.user.phone}).then(function(data) {
                //---- user exists
                if(data.length) {
                  //---------- check user password
                  var newUserPassword = localDB.md5(thisCtrl.user.password);
                  if(newUserPassword === data[0].password) {
                    //----- checking user activation
                    if(data[0].locked) {
                      angular.extend(UserStor.userInfo, data[0]);
                      //------- set User Location
                      loginServ.prepareLocationToUse().then(function() {
                        checkingFactory();
                      });

                    } else {
                      GlobalStor.global.isLoader = 0;
                      //---- show attantion
                      thisCtrl.isUserNotActive = 1;
                    }
                  } else {
                    GlobalStor.global.isLoader = 0;
                    //---- user not exists
                    thisCtrl.isUserPasswordError = 1;
                  }
                } else {
                  //======== IMPORT
                  console.log('Sync IMPORT');
                  checkingUser();
                }

              });


            } else {
              //======== IMPORT
              console.log('IMPORT');
              checkingUser();
            }
          });
        //-------- check LocalDB
        } else if(thisCtrl.isLocalDB) {
          console.log('OFFLINE');
          //---- checking user in LocalDB
          localDB.selectLocalDB(localDB.tablesLocalDB.users.tableName, {'phone': thisCtrl.user.phone}).then(function(data) {
            //---- user exists
            if(data.length) {
              //---------- check user password
              var newUserPassword = localDB.md5(thisCtrl.user.password);
              if(newUserPassword === data[0].password) {
                //----- checking user activation
                if(data[0].locked) {
                  //------- checking user FactoryId
                  if(data[0].factory_id > 0) {
                    angular.extend(UserStor.userInfo, data[0]);
                    //------- set User Location
                    loginServ.prepareLocationToUse().then(function() {
                      loginServ.setUserLocation();
                      /** download all data */
                      loginServ.downloadAllData();
                    });
                  } else {
                    GlobalStor.global.isLoader = 0;
                    thisCtrl.isOffline = 1;
                  }
                } else {
                  GlobalStor.global.isLoader = 0;
                  //---- show attantion
                  thisCtrl.isUserNotActive = 1;
                }
              } else {
                GlobalStor.global.isLoader = 0;
                //---- user not exists
                thisCtrl.isUserPasswordError = 1;
              }
            } else {
              GlobalStor.global.isLoader = 0;
              //---- user not exists
              thisCtrl.isUserNotExist = 1;
            }

          });

        } else {
          GlobalStor.global.isLoader = 0;
          thisCtrl.isOffline = 1;
        }
      }
    }


    function checkingUser() {
      localDB.importUser(thisCtrl.user.phone).then(function(result) {
        if(result.status) {
          var userTemp = angular.copy(result.user);
          //console.log('USER!!!!!!!!!!!!', thisCtrl.user.phone, result);
          //---------- check user password
          var newUserPassword = localDB.md5(thisCtrl.user.password);
          if(newUserPassword === userTemp.password) {

            userTemp.therm_coeff_id = angular.copy(result.thermCoeffId);
            //-------- check factory Link
            if(result.factoryLink !== null) {
              userTemp.factoryLink = angular.copy(result.factoryLink);
            }
            importDBProsses(userTemp);
          } else {
            GlobalStor.global.isLoader = 0;
            //---- user not exists
            thisCtrl.isUserPasswordError = 1;
          }
        } else {
          GlobalStor.global.isLoader = 0;
          //---- user not exists
          thisCtrl.isUserNotExist = 1;
        }

      });
    }



    function importDBProsses(user) {

      //----- checking user activation
      if(user.locked) {
        //------- clean all tables in LocalDB
        //              console.log('CLEEN START!!!!');
        localDB.cleanLocalDB(localDB.tablesLocalDB).then(function(data) {
          if(data) {
            //                  console.log('CLEEN DONE!!!!');
            //------- creates all tables in LocalDB
            //                  console.log('CREATE START!!!!');
            localDB.createTablesLocalDB(localDB.tablesLocalDB).then(function(data) {
              if(data) {
                //                      console.log('CREATE DONE!!!!');
                //------- save user in LocalDB
                localDB.insertRowLocalDB(user, localDB.tablesLocalDB.users.tableName);
                //------- save user in Stor
                angular.extend(UserStor.userInfo, user);
                //------- import Location
                localDB.importLocation(UserStor.userInfo.phone, UserStor.userInfo.device_code).then(function(data) {
                  if(data) {
                    //------ save Location Data in local obj
                    loginServ.prepareLocationToUse().then(function() {
                      checkingFactory();
                    });
                  }
                });
              }
            });
          }
        });
      } else {
        GlobalStor.global.isLoader = 0;
        //---- show attantion
        thisCtrl.isUserNotActive = 1;
      }

    }



    function checkingFactory() {
      //------- set User Location
      loginServ.setUserLocation();
      if((UserStor.userInfo.factory_id * 1) > 0) {
        loginServ.isLocalDBExist().then(function(data) {
          thisCtrl.isLocalDB = data;
          if (thisCtrl.isLocalDB) {
            //------- current FactoryId matches to user FactoryId, go to main page without importDB
            //TODO localDB.syncDb(UserStor.userInfo.phone, UserStor.userInfo.device_code).then(function() {
            /** download all data */
            loginServ.downloadAllData();
            //});
          } else {
            //------ LocalDB is empty
            importDBfromServer(UserStor.userInfo.factory_id);
          }
        });
      } else {
        //---- show Factory List
        //----- collect city Ids regarding to user country
        loginServ.collectCityIdsAsCountry().then(function(cityIds) {
          localDB.importFactories(UserStor.userInfo.phone, UserStor.userInfo.device_code, cityIds).then(function(result){
//            console.log('Factories++++++', result);
            GlobalStor.global.isLoader = 0;
            if(result.status) {
              thisCtrl.factories = setFactoryLocation(result.factories);
              //-------- close Factory Dialog
              thisCtrl.isFactoryId = 1;
            } else {
              console.log('can not get factories!');
            }
          });
        });
      }
    }



    function importDBfromServer() {
      thisCtrl.isStartImport = 1;
//      console.log('START Time!!!!!!', new Date(), new Date().getMilliseconds());
      localDB.importAllDB(UserStor.userInfo.phone, UserStor.userInfo.device_code).then(function(data) {
        if(data) {
          /** download all data */
          loginServ.downloadAllData();
          thisCtrl.isStartImport = 0;
        } else {
          console.log('Error!');
        }
      });
    }



    function setFactoryLocation(factories) {
      var factoryQty = factories.length,
          locationQty;
      while(--factoryQty > -1) {
        locationQty = GlobalStor.global.locations.cities.length;
        while(--locationQty > -1) {
          if(factories[factoryQty].city_id === GlobalStor.global.locations.cities[locationQty].cityId) {
            factories[factoryQty].location = GlobalStor.global.locations.cities[locationQty].fullLocation;
          }
        }
      }
      return factories;
    }



    function selectFactory() {
      if(thisCtrl.user.factoryId > 0) {
        //TODO thisCtrl.isOnline = $cordovaNetwork.isOnline();
        if(thisCtrl.isOnline) {
          GlobalStor.global.isLoader = 1;
          //-------- send selected Factory Id in Server
          UserStor.userInfo.factory_id = angular.copy(thisCtrl.user.factoryId);
//                  console.log(UserStor.userInfo.factory_id);
          //----- update factoryId in LocalDB & Server
          localDB.updateLocalServerDBs(localDB.tablesLocalDB.users.tableName, UserStor.userInfo.id, {factory_id: UserStor.userInfo.factory_id}).then(function() {
            //-------- close Factory Dialog
            thisCtrl.isFactoryId = 0;
            importDBfromServer();
          });
        } else {
          thisCtrl.isOffline = 1;
        }
      } else {
        //---- show attantion if any factory was chosen
        thisCtrl.isFactoryNotSelect = 1;
      }

    }

    function closeFactoryDialog() {
      thisCtrl.isFactoryNotSelect = 0;
      thisCtrl.isFactoryId = 0;
      delete thisCtrl.user.factoryId;
    }





    /**============ registration ============*/

    function switchRegistration() {
      //------ check Internet
      //TODO thisCtrl.isOnline = $cordovaNetwork.isOnline();
      if(thisCtrl.isOnline) {
        //------- check available Local DB
        loginServ.isLocalDBExist().then(function(data) {
          thisCtrl.isLocalDB = data;
//          console.log('REG', data);
          //------ if locations is not exists refresh Location and Users
          if(thisCtrl.isLocalDB) {
            GlobalStor.global.isLoader = 1;
            loginServ.prepareLocationToUse(1).then(function() {
              GlobalStor.global.isLoader = 0;
              thisCtrl.isRegistration = 1;
            });
          } else {
            GlobalStor.global.isLoader = 1;
            //------- clean all tables in LocalDB
            localDB.cleanLocalDB(localDB.tablesLocalDB).then(function(data) {
              if(data) {
                //------- creates all tables in LocalDB
                localDB.createTablesLocalDB(localDB.tablesLocationLocalDB).then(function (data) {
                  if(data) {
                    //------- import Location
                    localDB.importLocation().then(function(data) {
                      if(data) {
                        //------ save Location Data in local obj
                        loginServ.prepareLocationToUse(1).then(function() {
                          GlobalStor.global.isLoader = 0;
                          thisCtrl.isRegistration = 1;
                        });
                      }
                    });
                  }
                });
              }
            });
          }
          thisCtrl.user = {};
          //angular.element('#first_input').focus();
        });
      } else {
        thisCtrl.isOffline = 1;
      }
    }


    function closeRegistration() {
      thisCtrl.user = {};
      thisCtrl.isRegistration = 0;
    }

    function registrForm(form) {
      // Trigger validation flag.
      thisCtrl.submitted = true;
      if (form.$valid) {
        //------ check Internet
        //TODO thisCtrl.isOnline = $cordovaNetwork.isOnline();
        if(thisCtrl.isOnline) {
          GlobalStor.global.isLoader = 1;
          //--- checking user in server
          localDB.importUser(thisCtrl.user.phone).then(function(result) {
            if(result.status) {
              GlobalStor.global.isLoader = 0;
              //---- show attantion
              thisCtrl.isUserExist = 1;
            } else {
              var userData = {
                name: thisCtrl.user.name,
                phone: thisCtrl.user.phone,
                email: thisCtrl.user.mail,
                cityId: thisCtrl.user.city.id,
                password: localDB.md5(thisCtrl.user.phone)
              };
              console.log('CREATE USER!!!!!!!!!!!!', userData);
              //--- create new user in Server
              localDB.createUserServer(userData);
              GlobalStor.global.isLoader = 0;
              //-------- sent confirmed email
              thisCtrl.isSendEmail = 1;
              closeRegistration();
            }
          });
        } else {
          thisCtrl.isOffline = 1;
        }
      }
    }

    //--------- if was empty option selected in select after choosing
    function selectLocation() {
      if(!thisCtrl.user.country) {
        delete thisCtrl.user.region;
        delete thisCtrl.user.city;
      } else if(!thisCtrl.user.region) {
        delete thisCtrl.user.city;
      }
    }


  }
})();


// controllers/main.js

(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('MainCtrl', mainPageCtrl);

    
  function mainPageCtrl($timeout, DesignServ, DesignStor, loginServ, MainServ, SVGServ, GlobalStor, ProductStor, UserStor, AuxStor, globalConstants) {

   var thisCtrl = this,
    delaySubMenu1 = 300,
    delaySubMenu2 = 600,
    delaySubMenu3 = 900,
    delaySubMenu4 = 1200;

    thisCtrl.G = GlobalStor;
    thisCtrl.P = ProductStor;
    thisCtrl.U = UserStor;
    thisCtrl.A = AuxStor;
    thisCtrl.constants = globalConstants;
    thisCtrl.D = DesignStor;
    //------- set current Page
    GlobalStor.global.currOpenPage = 'main';

      thisCtrl.config = {
      //---- design menu
      isDesignError: 0,

      //----- door
      isDoorConfig: 0,
      selectedStep1: 0,
      selectedStep2: 0,
      selectedStep3: 0,
      selectedStep4: 0,

      DELAY_SHOW_FIGURE_ITEM: 1000,
      typing: 'on'
    };


//=========== clicking ============//

    thisCtrl.designSaved = DesignServ.designSaved;
    thisCtrl.designCancel = DesignServ.designCancel;
    thisCtrl.selectMenuItem = selectMenuItem;
    thisCtrl.setDefaultConstruction = DesignServ.setDefaultConstruction;

    //----- door config
    thisCtrl.toggleDoorConfig = toggleDoorConfig;
    thisCtrl.selectDoor = selectDoor;
    thisCtrl.selectSash = selectSash;
    thisCtrl.selectHandle = selectHandle;
    thisCtrl.selectLock = selectLock;
    thisCtrl.closeDoorConfig = closeDoorConfig;
    thisCtrl.saveDoorConfig = saveDoorConfig;

    //------ edit design
    thisCtrl.insertSash = insertSash;
    thisCtrl.insertCorner = insertCorner;
    thisCtrl.insertImpost = insertImpost;
    thisCtrl.insertArc = insertArc;
    thisCtrl.initMirror = initMirror;
    thisCtrl.positionAxis = positionAxis;
    thisCtrl.positionGlass = positionGlass;

    thisCtrl.stepBack = DesignServ.stepBack;


    //=============== FIRST START =========//

    if(GlobalStor.global.startProgramm) {
//      GlobalStor.global.isLoader = 1;
//      console.log('START main CTRL!!!!!!');
//      console.log('START!!!!!!', new Date(), new Date().getMilliseconds());
      //playSound('menu');

      /** save first User entrance */
      MainServ.saveUserEntry();
      /** create order date */
      MainServ.createOrderData();
      /** set Curr Discounts */
      MainServ.setCurrDiscounts();

      /** set first Template */
      MainServ.setCurrTemplate();
      /** set Templates */
      MainServ.prepareTemplates(ProductStor.product.construction_type).then(function() {
        MainServ.prepareMainPage();
      /** start lamination filtering */
        MainServ.laminatFiltering();

        /** download all cities */
        if(GlobalStor.global.locations.cities.length === 1) {
          loginServ.downloadAllCities(1);
        }


        //--------- set template from ProductStor
        DesignServ.setDefaultTemplate();
       

        //console.log('FINISH!!!!!!', new Date(), new Date().getMilliseconds());
      });
    }

    //============ if Door Construction
    if(ProductStor.product.construction_type === 4) {
//      DesignServ.downloadDoorConfig();
      DesignServ.setIndexDoorConfig();
    }


      
 
    //------- close Report
    GlobalStor.global.isReport = 0;

    //================ EDIT PRODUCT =================
    if (GlobalStor.global.productEditNumber) {
      console.log('EDIT!!!!');
      console.log('product = ', ProductStor.product);
      SVGServ.createSVGTemplate(ProductStor.product.template_source, ProductStor.product.profileDepths).then(function(data) {
        ProductStor.product.template = data;
      });
    }


//========= methods  ================//


    //--------Select menu item
    function selectMenuItem(id) {
      if(DesignStor.design.tempSize.length) {
        //----- finish size culculation
        DesignServ.closeSizeCaclulator();
      } else {
        DesignStor.design.activeMenuItem = (DesignStor.design.activeMenuItem === id) ? 0 : id;
        DesignStor.design.isDropSubMenu = 0;
        DesignServ.hideCornerMarks();
        DesignServ.deselectAllImpost();
        if (id !== 4) {
          DesignServ.deselectAllArc();
        }
        //----- hide culculator
        DesignServ.hideSizeTools();
        if (DesignStor.design.activeMenuItem) {
          switch (DesignStor.design.activeMenuItem) {
            case 1:
              showAllAvailableGlass(id);
              //------ drop submenu items
              $timeout(function(){
                DesignStor.design.isDropSubMenu = 2;
              }, delaySubMenu1);
              $timeout(function(){
                DesignStor.design.isDropSubMenu = 6;
              }, delaySubMenu2);
              $timeout(function(){
                DesignStor.design.isDropSubMenu = 8;
              }, delaySubMenu3);
              $timeout(function(){
                DesignStor.design.isDropSubMenu = 0;
              }, delaySubMenu4);
              break;
            case 2:
              DesignServ.deselectAllGlass();
              showAllAvailableCorner(id);
              break;
            case 3:
              showAllAvailableGlass(id);
              //------ drop submenu items
              $timeout(function(){
                DesignStor.design.isDropSubMenu = 4;
              }, delaySubMenu1);
              $timeout(function(){
                DesignStor.design.isDropSubMenu = 8;
              }, delaySubMenu2);
              $timeout(function(){
                DesignStor.design.isDropSubMenu = 12;
              }, delaySubMenu3);
              $timeout(function(){
                DesignStor.design.isDropSubMenu = 0;
              }, delaySubMenu4);
              break;
            case 4:
              DesignServ.deselectAllGlass();
              showAllAvailableArc(id);
              break;
            case 5:
              //DesignServ.deselectAllGlass();
              DesignStor.design.activeSubMenuItem = id;
              break;
          }
        } else {
          //------ if we close menu
          DesignStor.design.activeSubMenuItem = 0;
          //-------- delete selected glasses
          DesignServ.deselectAllGlass();
          DesignServ.deselectAllArc();
          $timeout(function () {
            DesignStor.design.isImpostDelete = 0;
          }, 300);
        }
      }
    }


    function deactivMenu() {
      DesignStor.design.activeMenuItem = 0;
      DesignStor.design.activeSubMenuItem = 0;
      DesignStor.design.isDropSubMenu = 0;
    }

    function showDesignError() {
      thisCtrl.config.isDesignError = 1;
      DesignStor.design.activeMenuItem = 0;
      DesignStor.design.activeSubMenuItem = 0;
      $timeout(function(){
        thisCtrl.config.isDesignError = 0;
      }, 800);
    }


    //++++++++++ Edit Sash ++++++++++//

    function showAllAvailableGlass(menuId) {
      DesignStor.design.activeSubMenuItem = menuId;
      if(!DesignStor.design.selectedGlass.length) {
        //----- show all glasses
        var glasses = d3.selectAll('#tamlateSVG .glass');
        DesignStor.design.selectedGlass = glasses[0];
        glasses.classed('glass-active', true);
      }
    }



    function insertSash(sashType, event) {
//      console.log('INSER SASH ===', event, DesignStor.design.activeSubMenuItem);
      event.preventDefault();
//      event.srcEvent.stopPropagation();

      var isPermit = 1,
          glassQty = DesignStor.design.selectedGlass.length,
          i = 0;

      if(sashType === 1) {
        deactivMenu();
        //----- delete sash
        for(; i < glassQty; i++) {
          DesignServ.deleteSash(DesignStor.design.selectedGlass[i]);
        }
      } else {
        if(sashType === 2 || sashType === 6 || sashType === 8) {
          if(DesignStor.design.isDropSubMenu === sashType) {
            DesignStor.design.isDropSubMenu = 0;
          } else {
            DesignStor.design.isDropSubMenu = sashType;
            isPermit = 0;
          }
        }

        if(isPermit) {
          deactivMenu();
          //----- insert sash
          for (; i < glassQty; i++) { //TODO download hardare types and create submenu
            DesignServ.createSash(sashType, DesignStor.design.selectedGlass[i]);
          }
        }
      }
    }



    //++++++++++ Edit Corner ++++++++//

    //-------- show all Corner Marks
    function showAllAvailableCorner(menuId) {
      var corners = d3.selectAll('#tamlateSVG .corner_mark');
      if(corners[0].length) {
        //---- show submenu
        DesignStor.design.activeSubMenuItem = menuId;
        corners.transition().duration(300).ease("linear").attr('r', 50);
        DesignStor.design.selectedCorner = corners[0];
//        corners.on('touchstart', function () {
        corners.on('click', function () {
          //----- hide all cornerMark
          DesignServ.hideCornerMarks();

          //----- show selected cornerMark
          var corner = d3.select(this).transition().duration(300).ease("linear").attr('r', 50);
          DesignStor.design.selectedCorner.push(corner[0][0]);

        });
      } else {
        showDesignError();
      }
    }

    function insertCorner(conerType, event) {
      event.preventDefault();
      //event.srcEvent.stopPropagation();
      //------ hide menu
      deactivMenu();
      var cornerQty = DesignStor.design.selectedCorner.length,
          i = 0;
      switch(conerType) {
        //----- delete
        case 1:
          for(; i < cornerQty; i++) {
            DesignServ.deleteCornerPoints(DesignStor.design.selectedCorner[i]);
          }
          break;
        //----- line angel
        case 2:
          for(; i < cornerQty; i++) {
            DesignServ.setCornerPoints(DesignStor.design.selectedCorner[i]);
          }
          break;
        //----- curv angel
        case 3:
          for(; i < cornerQty; i++) {
            DesignServ.setCurvCornerPoints(DesignStor.design.selectedCorner[i]);
          }
          break;
      }
    }





    //++++++++++ Edit Arc ++++++++//

    function showAllAvailableArc(menuId) {
      var arcs = d3.selectAll('#tamlateSVG .frame')[0].filter(function (item) {
        if (item.__data__.type === 'frame' || item.__data__.type === 'arc') {
          return true;
        }
      });
      //----- if not corners
      if(arcs.length) {
        DesignStor.design.activeSubMenuItem = menuId;
//        console.log('Arcs++++++', DesignStor.design.selectedArc);
        if(!DesignStor.design.selectedArc.length) {
          //----- show all frames and arc
          var arcsD3 = d3.selectAll(arcs);
          DesignStor.design.selectedArc = arcsD3[0];
          arcsD3.classed('active_svg', true);
        }
      } else {
        showDesignError();
      }
    }



    function insertArc(arcType, event) {
      event.preventDefault();
      //event.srcEvent.stopPropagation();
      deactivMenu();
      //---- get quantity of arcs
      var arcQty = DesignStor.design.selectedArc.length;

      //======= delete arc
      if(arcType === 1) {
        //------ delete all arcs
        if (arcQty > 1) {
          DesignServ.workingWithAllArcs(0);
        } else {
          //------ delete one selected arc
          DesignServ.deleteArc(DesignStor.design.selectedArc[0]);
          DesignStor.design.selectedArc.length = 0;
        }

      //======= insert arc
      } else {
        //------ insert all arcs
        if(arcQty > 1) {
          DesignServ.workingWithAllArcs(1);
        } else {
          //------ insert one selected arc
          DesignServ.createArc(DesignStor.design.selectedArc[0]);
          DesignStor.design.selectedArc.length = 0;
        }
      }
    }




    //++++++++++ Edit Impost ++++++++//


    function insertImpost(impostType, event) {
      event.preventDefault();
      //event.srcEvent.stopPropagation();
      var isPermit = 1,
          impostsQty = DesignStor.design.selectedImpost.length,
          i = 0;

      if(impostType === 1) {
        deactivMenu();
        //----- delete imposts
        if (impostsQty) {
          for (; i < impostsQty; i++) {
            DesignServ.deleteImpost(DesignStor.design.selectedImpost[i]);
          }
          $timeout(function(){
            DesignStor.design.isImpostDelete = 0;
          }, 300);
        }
      } else {
        //----- show drop submenu
        if(impostType === 4 || impostType === 8 || impostType === 12) {
          if(DesignStor.design.isDropSubMenu === impostType) {
            DesignStor.design.isDropSubMenu = 0;
          } else {
            DesignStor.design.isDropSubMenu = impostType;
            isPermit = 0;
          }
        }

        if(isPermit) {
          deactivMenu();
          if (!impostsQty) {
            var glassQty = DesignStor.design.selectedGlass.length;
            if (glassQty) {
              //------- insert imposts
              for (; i < glassQty; i++) {
                DesignServ.createImpost(impostType, DesignStor.design.selectedGlass[i]);
              }
            }
          } else {
            DesignServ.deselectAllImpost();
          }
        }
      }
    }


    /**++++++++++ create Mirror ++++++++*/

    function initMirror(event) {
      event.preventDefault();
      deactivMenu();
      DesignServ.initMirror();
    }


    /**++++++++++ position by Axises ++++++++*/

    function positionAxis(event) {
      event.preventDefault();
      deactivMenu();
      DesignServ.positionAxises();
    }


    /**++++++++++ position by Glasses ++++++++*/

    function positionGlass(event) {
      event.preventDefault();
      deactivMenu();
      DesignServ.positionGlasses();
    }






    /**============= DOOR ===============*/

    //---------- Show Door Configuration
    function toggleDoorConfig() {
      thisCtrl.config.isDoorConfig = 1;
      DesignServ.closeSizeCaclulator();
      //----- set emplty index values
//      DesignStor.design.doorConfig.doorShapeIndex = '';
//      DesignStor.design.doorConfig.sashShapeIndex = '';
//      DesignStor.design.doorConfig.handleShapeIndex = '';
//      DesignStor.design.doorConfig.lockShapeIndex = '';
    }

    //---------- Select door shape
    function selectDoor(id) {
      if(!thisCtrl.config.selectedStep2) {
        if(DesignStor.design.doorConfig.doorShapeIndex === id) {
          DesignStor.design.doorConfig.doorShapeIndex = '';
          thisCtrl.config.selectedStep1 = 0;
        } else {
          DesignStor.design.doorConfig.doorShapeIndex = id;
          thisCtrl.config.selectedStep1 = 1;
        }
      }
    }
    //---------- Select sash shape
    function selectSash(id) {
      if(!thisCtrl.config.selectedStep3) {
        if(DesignStor.design.doorConfig.sashShapeIndex === id) {
          DesignStor.design.doorConfig.sashShapeIndex = '';
          thisCtrl.config.selectedStep2 = 0;
        } else {
          DesignStor.design.doorConfig.sashShapeIndex = id;
          thisCtrl.config.selectedStep2 = 1;
        }
      }
    }
    //-------- Select handle shape
    function selectHandle(id) {
      if(!thisCtrl.config.selectedStep4) {
        if(DesignStor.design.doorConfig.handleShapeIndex === id) {
          DesignStor.design.doorConfig.handleShapeIndex = '';
          thisCtrl.config.selectedStep3 = 0;
        } else {
          DesignStor.design.doorConfig.handleShapeIndex = id;
          thisCtrl.config.selectedStep3 = 1;
        }
      }
    }
    //--------- Select lock shape
    function selectLock(id) {
      if(DesignStor.design.doorConfig.lockShapeIndex === id) {
        DesignStor.design.doorConfig.lockShapeIndex = '';
        thisCtrl.config.selectedStep4 = 0;
      } else {
        DesignStor.design.doorConfig.lockShapeIndex = id;
        thisCtrl.config.selectedStep4 = 1;
      }
    }

    //--------- Close Door Configuration
    function closeDoorConfig() {
      if(thisCtrl.config.selectedStep3) {
        thisCtrl.config.selectedStep3 = 0;
        thisCtrl.config.selectedStep4 = 0;
        DesignStor.design.doorConfig.lockShapeIndex = '';
        DesignStor.design.doorConfig.handleShapeIndex = '';
      } else if(thisCtrl.config.selectedStep2) {
        thisCtrl.config.selectedStep2 = 0;
        DesignStor.design.doorConfig.sashShapeIndex = '';
      } else if(thisCtrl.config.selectedStep1) {
        thisCtrl.config.selectedStep1 = 0;
        DesignStor.design.doorConfig.doorShapeIndex = '';
      } else {
        //------ close door config
        thisCtrl.config.isDoorConfig = 0;
        //------ set Default indexes
        DesignStor.design.doorConfig = DesignStor.setDefaultDoor();
      }
    }

    //--------- Save Door Configuration
    function saveDoorConfig() {
      DesignServ.rebuildSVGTemplate();
      thisCtrl.config.isDoorConfig = 0;
    }

    //=============== End Door ==================//



    }
})();




//event.srcEvent.stopPropagation();
//event.preventDefault();
//$event.stopImmediatePropagation();


// controllers/menus/addelems_menu.js

/* globals d3 */
(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('addElementMenuCtrl', addElementMenuCtrl);

  function addElementMenuCtrl(
    $timeout,
    $filter,
    globalConstants,
    GlobalStor,
    ProductStor,
    UserStor,
    AuxStor,
    MainServ,
    AddElementMenuServ,
    AddElementsServ,
    DesignServ
  ) {

    var thisCtrl = this;
    thisCtrl.constants = globalConstants;
    thisCtrl.G = GlobalStor;
    thisCtrl.P = ProductStor;
    thisCtrl.U = UserStor;
    thisCtrl.A = AuxStor;


    thisCtrl.config = {
      DELAY_START: globalConstants.STEP,
      DELAY_SHOW_ELEMENTS_MENU: 10 * globalConstants.STEP,
      typing: 'on'
    };

    //------- translate
    thisCtrl.TIP = $filter('translate')('add_elements_menu.TIP');
    thisCtrl.EMPTY_ELEMENT = $filter('translate')('add_elements_menu.EMPTY_ELEMENT');
    thisCtrl.NAME_LABEL = $filter('translate')('add_elements.NAME_LABEL');
    thisCtrl.QTY_LABEL = $filter('translate')('add_elements.QTY_LABEL');
    thisCtrl.WIDTH_LABEL = $filter('translate')('add_elements.WIDTH_LABEL');
    thisCtrl.HEIGHT_LABEL = $filter('translate')('add_elements.HEIGHT_LABEL');
    thisCtrl.ADD = $filter('translate')('add_elements.ADD');
    thisCtrl.TAB_NAME_SIMPLE_FRAME = $filter('translate')('add_elements_menu.TAB_NAME_SIMPLE_FRAME');
    thisCtrl.TAB_NAME_HARD_FRAME = $filter('translate')('add_elements_menu.TAB_NAME_HARD_FRAME');
    thisCtrl.TAB_EMPTY_EXPLAIN = $filter('translate')('add_elements_menu.TAB_EMPTY_EXPLAIN');


    /**============ clicking ============*/
    thisCtrl.closeAddElementsMenu = AddElementMenuServ.closeAddElementsMenu;
    thisCtrl.selectAddElement = selectAddElement;
    thisCtrl.chooseAddElement = AddElementMenuServ.chooseAddElement;
    thisCtrl.chooseAddElementList = AddElementMenuServ.chooseAddElementList;
    thisCtrl.deleteAddElement = AddElementMenuServ.deleteAddElement;
    thisCtrl.showFrameTabs = showFrameTabs;
    thisCtrl.initAddElementTools = AddElementsServ.initAddElementTools;
    thisCtrl.showInfoBox = MainServ.showInfoBox;
    //------- culculator
    thisCtrl.closeQtyCaclulator = AddElementMenuServ.closeQtyCaclulator;
    thisCtrl.setValueQty = AddElementMenuServ.setValueQty;
    thisCtrl.pressCulculator = AddElementMenuServ.pressCulculator;
    //------- grid
    thisCtrl.confirmGrid = AddElementMenuServ.confirmGrid;
    thisCtrl.setGridToAll = AddElementMenuServ.setGridToAll;
    thisCtrl.closeGridSelectorDialog = AddElementMenuServ.closeGridSelectorDialog;








    /**============ methods ================*/

    /**------- Show Tabs -------*/

    function showFrameTabs() {
      //playSound('swip');
      AuxStor.aux.isTabFrame = !AuxStor.aux.isTabFrame;
    }



    /**---------- common function to select addElem in 2 cases --------*/

    function selectAddElement(typeId, elementId, clickEvent) {
      if(GlobalStor.global.isQtyCalculator || GlobalStor.global.isSizeCalculator) {
        /** calc Price previous parameter and close caclulators */
        AddElementMenuServ.finishCalculators();
      }
      /** if ListView is opened */
      if (AuxStor.aux.isAddElementListView) {
        selectAddElementList(typeId, elementId, clickEvent);
      } else {
        /** if grid,  show grid selector dialog */
        if(AuxStor.aux.isFocusedAddElement === 1) {
          if(ProductStor.product.is_addelem_only) {
            /** without window */
            AddElementMenuServ.chooseAddElement(typeId, elementId);
          } else {
            /** show Grid Selector Dialog */
            AuxStor.aux.selectedGrid = [typeId, elementId];
            AuxStor.aux.isGridSelectorDialog = 1;
            DesignServ.initAllGlassXGrid();
          }
        } else {
          AddElementMenuServ.chooseAddElement(typeId, elementId);
        }
      }
    }


    /**----------- Select Add Element when open List View ------------*/

    function selectAddElementList(typeId, elementId, clickEvent) {
      if(AuxStor.aux.isAddElement === typeId+'-'+elementId) {
        AuxStor.aux.isAddElement = false;
      } else if(AuxStor.aux.isAddElement === false) {
        var coord = $(clickEvent.target).offset();
        //$scope.addElementsMenu.coordinats = {'top': coord.top-34};
        thisCtrl.coordinats = {'top': coord.top-17};
        $timeout(function() {
          AddElementMenuServ.getAddElementPrice(typeId, elementId);
          //AuxStor.aux.isAddElement = typeId + '-' + elementId;
        }, 500);
      } else {
        AuxStor.aux.isAddElement = false;
        $timeout(function() {
          var coord = $(clickEvent.target).offset();
          //$scope.addElementsMenu.coordinats = {'top': coord.top-34};
          thisCtrl.coordinats = {'top': coord.top-17};
        }, 500);
        $timeout(function() {
          AddElementMenuServ.getAddElementPrice(typeId, elementId);
        }, 1000);
      }
    }



  }
})();



// controllers/menus/cart_menu.js

(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('CartModule')
    .controller('CartMenuCtrl', cartMenuCtrl);

  function cartMenuCtrl($filter, globalConstants, GlobalStor, OrderStor, UserStor, CartStor, CartMenuServ) {

    var thisCtrl = this;
    thisCtrl.G = GlobalStor;
    thisCtrl.U = UserStor;
    thisCtrl.O = OrderStor;
    thisCtrl.C = CartStor;

    thisCtrl.config = {
      activeMenuItem: false,
      month: $filter('translate')('common_words.MONTH_LABEL'),
      montha: $filter('translate')('common_words.MONTHA_LABEL'),
      months: $filter('translate')('common_words.MONTHS_LABEL'),
      //activeInstalmentSwitcher: false,
      DELAY_START: globalConstants.STEP,
      typing: 'on'
    };

    //------- translate
    thisCtrl.DELIVERY = $filter('translate')('cart.DELIVERY');
    thisCtrl.SELF_EXPORT = $filter('translate')('cart.SELF_EXPORT');
    thisCtrl.FLOOR = $filter('translate')('cart.FLOOR');
    thisCtrl.ASSEMBLING = $filter('translate')('cart.ASSEMBLING');
    thisCtrl.WITHOUT_ASSEMBLING = $filter('translate')('cart.WITHOUT_ASSEMBLING');
    thisCtrl.FREE = $filter('translate')('cart.FREE');
    thisCtrl.PAYMENT_BY_INSTALMENTS = $filter('translate')('cart.PAYMENT_BY_INSTALMENTS');
    thisCtrl.WITHOUT_INSTALMENTS = $filter('translate')('cart.WITHOUT_INSTALMENTS');
    thisCtrl.DELIVERY_DATE = $filter('translate')('cart.DELIVERY_DATE');
    thisCtrl.FIRST_PAYMENT_LABEL = $filter('translate')('cart.FIRST_PAYMENT_LABEL');
    thisCtrl.DATE_DELIVERY_LABEL = $filter('translate')('cart.DATE_DELIVERY_LABEL');
    thisCtrl.MONTHLY_PAYMENT_LABEL = $filter('translate')('cart.MONTHLY_PAYMENT_LABEL');
    thisCtrl.TOTAL_PRICE_LABEL = $filter('translate')('cart.TOTAL_PRICE_LABEL');
    thisCtrl.ORDER = $filter('translate')('cart.ORDER');
    thisCtrl.MEASURE = $filter('translate')('cart.MEASURE');



    //------ clicking
    thisCtrl.selectMenuItem = selectMenuItem;
    thisCtrl.closeInstalment = closeInstalment;
    thisCtrl.selectFloorPrice = CartMenuServ.selectFloorPrice;
    thisCtrl.selectAssembling = CartMenuServ.selectAssembling;
    thisCtrl.selectInstalment = CartMenuServ.selectInstalment;
    thisCtrl.openMasterDialog = openMasterDialog;
    thisCtrl.openOrderDialog = openOrderDialog;
    thisCtrl.swipeDiscountBlock = CartMenuServ.swipeDiscountBlock;





    //============ methods ================//

    //----- Select menu item
    function selectMenuItem(id) {
      thisCtrl.config.activeMenuItem = (thisCtrl.config.activeMenuItem === id) ? 0 : id;
    }

    function closeInstalment() {
      OrderStor.order.is_instalment = 0;
      OrderStor.order.instalment_id = 0;
      OrderStor.order.selectedInstalmentPeriod = 0;
      OrderStor.order.selectedInstalmentPercent = 0;
      thisCtrl.config.activeMenuItem = 0;
    }

    //------ show Call Master Dialog
    function openMasterDialog() {
      CartStor.cart.isMasterDialog = 1;
    }

    //------ show Order/Credit Dialog
    function openOrderDialog() {
      if(OrderStor.order.is_instalment) {
        CartStor.cart.isCreditDialog = 1;
      } else {
        CartStor.cart.isOrderDialog = 1;
      }
    }


  }
})();


// controllers/menus/config_menu.js

(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('ConfigMenuCtrl', configMenuCtrl);

  function configMenuCtrl($filter, globalConstants, GeneralServ, MainServ, AddElementMenuServ, DesignServ, GlobalStor, OrderStor, ProductStor, UserStor) {

    var thisCtrl = this;
    thisCtrl.constants = globalConstants;
    thisCtrl.G = GlobalStor;
    thisCtrl.O = OrderStor;
    thisCtrl.P = ProductStor;
    thisCtrl.U = UserStor;


    thisCtrl.config = {
      TOOLTIP: [
        '',
        $filter('translate')('mainpage.TEMPLATE_TIP'),
        $filter('translate')('mainpage.PROFILE_TIP'),
        $filter('translate')('mainpage.GLASS_TIP')
      ],
      DELAY_START: globalConstants.STEP,
      DELAY_SHOW_CONFIG_LIST: 5 * globalConstants.STEP,
      DELAY_SHOW_FOOTER: 5 * globalConstants.STEP,
      DELAY_TYPE_ITEM_TITLE: 10 * globalConstants.STEP,
      DELAY_SHOW_U_COEFF: 20 * globalConstants.STEP,
      DELAY_GO_TO_CART: 2 * globalConstants.STEP,
      typing: 'on'
    };

    //------- translate
    thisCtrl.CONFIGMENU_CONFIGURATION = $filter('translate')('mainpage.CONFIGMENU_CONFIGURATION');
    thisCtrl.CONFIGMENU_SIZING = $filter('translate')('mainpage.CONFIGMENU_SIZING');
    thisCtrl.MM = $filter('translate')('mainpage.MM');
    thisCtrl.CONFIGMENU_PROFILE = $filter('translate')('mainpage.CONFIGMENU_PROFILE');
    thisCtrl.CONFIGMENU_GLASS = $filter('translate')('mainpage.CONFIGMENU_GLASS');
    thisCtrl.CONFIGMENU_HARDWARE = $filter('translate')('mainpage.CONFIGMENU_HARDWARE');
    thisCtrl.CONFIGMENU_LAMINATION = $filter('translate')('mainpage.CONFIGMENU_LAMINATION');
    thisCtrl.CONFIGMENU_LAMINATION_TYPE = $filter('translate')('mainpage.CONFIGMENU_LAMINATION_TYPE');
    thisCtrl.CONFIGMENU_ADDITIONAL = $filter('translate')('mainpage.CONFIGMENU_ADDITIONAL');
    thisCtrl.CONFIGMENU_NO_ADDELEMENTS = $filter('translate')('mainpage.CONFIGMENU_NO_ADDELEMENTS');
    thisCtrl.CONFIGMENU_IN_CART = $filter('translate')('mainpage.CONFIGMENU_IN_CART');
    thisCtrl.SAVE = $filter('translate')('settings.SAVE');
    thisCtrl.LETTER_M = $filter('translate')('common_words.LETTER_M');
    thisCtrl.HEATCOEF_VAL = $filter('translate')('mainpage.HEATCOEF_VAL');


    //------ clicking
    thisCtrl.selectConfigPanel = selectConfigPanel;
    thisCtrl.inputProductInOrder = saveProduct;
    thisCtrl.showNextTip = showNextTip;


    //============ methods ================//


    //------- Select menu item

    function selectConfigPanel(id) {
      if(GlobalStor.global.isQtyCalculator || GlobalStor.global.isSizeCalculator) {
        /** calc Price previous parameter and close caclulators */
        AddElementMenuServ.finishCalculators();
      }
      GlobalStor.global.activePanel = (GlobalStor.global.activePanel === id) ? 0 : id;
      //---- hide rooms if opened
      GlobalStor.global.showRoomSelectorDialog = 0;
      //---- hide tips
      GlobalStor.global.configMenuTips = 0;
      //---- hide comment if opened
      GlobalStor.global.isShowCommentBlock = 0;
      //---- hide template type menu if opened
      GlobalStor.global.isTemplateTypeMenu = 0;
      GeneralServ.stopStartProg();
      MainServ.setDefaultAuxParam();
      //------ delete events on Glass/Grid Selector Dialogs
      DesignServ.removeGlassEventsInSVG();
      GlobalStor.global.showGlassSelectorDialog = 0;
    }

    function saveProduct() {
      if(MainServ.inputProductInOrder()){
        //--------- moving to Cart when click on Cart button
        MainServ.goToCart();
      }
    }

    function showNextTip() {
      var tipQty = thisCtrl.config.TOOLTIP.length;
      ++GlobalStor.global.configMenuTips;
      if(GlobalStor.global.configMenuTips === tipQty) {
        GlobalStor.global.configMenuTips = 0;
        //------ open templates
        GlobalStor.global.activePanel = 1;
        //------ close rooms
        GlobalStor.global.showRoomSelectorDialog = 0;
      }
    }


  }
})();


// controllers/menus/navigation_menu.js

(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('NavMenuCtrl', navigationMenuCtrl);

  function navigationMenuCtrl($location, $window, $filter, globalConstants, GeneralServ, NavMenuServ, GlobalStor, OrderStor, ProductStor, UserStor) {

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


// controllers/panels/add_elements_cart.js

(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('CartModule')
    .controller('AddElemCartCtrl', addElementsCartCtrl);

  function addElementsCartCtrl(globalConstants, GeneralServ, CartServ, CartMenuServ, OrderStor, CartStor, AuxStor) {

    var thisCtrl = this;
    thisCtrl.constants = globalConstants;
    thisCtrl.config = {
      addElementDATA: GeneralServ.addElementDATA,
      selectedAddElemUnit: {id: 0},
      isAddElemUnitDetail: 0,
      addElemUnitProducts: [],
      isLinkExplodeMenu: 0,
      explodeMenuTop: 0,
      explodeMenuLeft: 0,
      isSwipeProdSelector: 0
    };

    //=========== clicking =============//
    thisCtrl.closeAllAddElemsPanel = closeAllAddElemsPanel;
    thisCtrl.deleteAllAddElems = deleteAllAddElems;
    thisCtrl.deleteAddElemsItem = deleteAddElemsItem;

    thisCtrl.showAddElemUnitDetail = showAddElemUnitDetail;
    thisCtrl.closeAddElemUnitDetail = closeAddElemUnitDetail;
    thisCtrl.deleteAddElemUnit = deleteAddElemUnit;
    thisCtrl.toggleExplodeLinkMenu = toggleExplodeLinkMenu;
    thisCtrl.explodeUnitToProduct = explodeUnitToProduct;

    //------ adding elements to product
    thisCtrl.swipeProductSelector = swipeProductSelector;
    thisCtrl.selectProductToAddElem = selectProductToAddElem;




    //============ methods ================//


    function closeAllAddElemsPanel() {
      CartStor.cart.isAllAddElems = 0;
      //------ clean AddElems array for All AddElems Panel
      CartStor.cart.allAddElemsOrder.length = 0;
      CartStor.cart.addElemsOrderPriceTOTAL = 0;
      //------ hide searching box
      CartStor.cart.isSelectedProduct = 0;
      AuxStor.aux.showAddElementsMenu = 0;
      AuxStor.aux.addElementGroups.length = 0;
      AuxStor.aux.searchingWord = '';
    }



    function deleteAddElemsItem(addElem) {
      deleteAddElemsInOrder(addElem);
      CartMenuServ.joinAllAddElements();
      //------ if last AddElem was delete
      if(!CartStor.cart.isExistAddElems) {
        //------ go back in cart
        closeAllAddElemsPanel();
      } else {
        CartServ.showAllAddElements();
      }
      //------ culculate AddElems Price in each Products
      CartServ.calculateAddElemsProductsPrice(1);
      //------ change order Price
      CartMenuServ.calculateOrderPrice();
    }



    function deleteAllAddElems() {
      //------ delete all chosenAddElements in Products
      deleteAddElemsInOrder();
      //------ culculate AddElems Price in each Products
      CartServ.calculateAddElemsProductsPrice();
      //------ change order Price
      CartMenuServ.calculateOrderPrice();
      CartMenuServ.joinAllAddElements();
      //------ go back in cart
      closeAllAddElemsPanel();
    }



    function deleteAddElemsInOrder(element) {
      var productsQty = OrderStor.order.products.length,
          addElemProdQty, addElemQty;
      while(--productsQty > -1) {
        addElemProdQty = OrderStor.order.products[productsQty].chosenAddElements.length;
        while(--addElemProdQty > -1) {
          addElemQty = OrderStor.order.products[productsQty].chosenAddElements[addElemProdQty].length;
          if(addElemQty) {
            //--------- delete one Add Element
            if(element) {
              while(--addElemQty > -1) {
                if(OrderStor.order.products[productsQty].chosenAddElements[addElemProdQty][addElemQty].id === element.id) {
                  if(OrderStor.order.products[productsQty].chosenAddElements[addElemProdQty][addElemQty].element_width === element.element_width) {
                    if(OrderStor.order.products[productsQty].chosenAddElements[addElemProdQty][addElemQty].element_height === element.element_height) {
                      OrderStor.order.products[productsQty].chosenAddElements[addElemProdQty].splice(addElemQty, 1);
                    }
                  }
                }
              }
            } else {
              //--------- delete All Add Element
              OrderStor.order.products[productsQty].chosenAddElements[addElemProdQty].length = 0;
            }
          }
        }
      }
    }









    function showAddElemUnitDetail(elemUnit) {
      thisCtrl.config.selectedAddElemUnit = elemUnit;
      collectAddElemUnitProducts();
      thisCtrl.config.isAddElemUnitDetail = 1;
    }


    function collectAddElemUnitProducts() {
      var allAddElemsQty = CartStor.cart.allAddElements.length,
          addElemProdQty, addElemProd;

      //------ clean addElemUnit array
      thisCtrl.config.addElemUnitProducts.length = 0;
      console.log('      ', CartStor.cart.allAddElements);
      for(var i = 0; i < allAddElemsQty; i++) {
        addElemProdQty = CartStor.cart.allAddElements[i].length;
        for(var j = 0; j < addElemProdQty; j++) {
          if(CartStor.cart.allAddElements[i][j].id === thisCtrl.config.selectedAddElemUnit.id) {
            if(CartStor.cart.allAddElements[i][j].element_width === thisCtrl.config.selectedAddElemUnit.element_width) {
              if(CartStor.cart.allAddElements[i][j].element_height === thisCtrl.config.selectedAddElemUnit.element_height) {

                //-------- if product is addElems only
                if(OrderStor.order.products[i].is_addelem_only) {
                  addElemProd = {
                    productIndex: i,
                    is_addelem_only: OrderStor.order.products[i].is_addelem_only,
                    name: CartStor.cart.allAddElements[i][j].name,
                    element_width: CartStor.cart.allAddElements[i][j].element_width,
                    element_height: CartStor.cart.allAddElements[i][j].element_height,
                    element_qty: CartStor.cart.allAddElements[i][j].element_qty,
                    elementPriceDis: CartStor.cart.allAddElements[i][j].elementPriceDis
                  };
                  thisCtrl.config.addElemUnitProducts.push(addElemProd);

                } else {

                  addElemProd = {
                    productIndex: i,
                    is_addelem_only: OrderStor.order.products[i].is_addelem_only,
                    element_qty: CartStor.cart.allAddElements[i][j].element_qty / OrderStor.order.products[i].product_qty
                  };
//                  console.info('addElemProd------', thisCtrl.config.selectedAddElemUnit);
//                  console.info('addElemProd------', CartStor.cart.allAddElements[i][j]);
//                  console.info('addElemProd------', OrderStor.order.products[i]);
//                  console.info('addElemProd------', addElemProd);
                  if(OrderStor.order.products[i].product_qty > 1) {
                    var wagon = [],
                        cloneQty = OrderStor.order.products[i].product_qty*1;
                    while(--cloneQty > -1) {
                      wagon.push(addElemProd);
                    }
                    thisCtrl.config.addElemUnitProducts.push(wagon);
                  } else {
                    thisCtrl.config.addElemUnitProducts.push(addElemProd);
                  }

                }

              }
            }
          }
        }
      }
      console.warn('addElemUnitProducts++++',thisCtrl.config.addElemUnitProducts);
    }



    function closeAddElemUnitDetail() {
      thisCtrl.config.isAddElemUnitDetail = 0;
      thisCtrl.config.selectedAddElemUnit = {id: 0};
      thisCtrl.config.isLinkExplodeMenu = 0;
    }



    function deleteAddElemUnit(addElemUnit, isWagon) {
      console.info('delet----', thisCtrl.config.selectedAddElemUnit);

      if(isWagon) {
        //------- decrease Product quantity
        CartServ.decreaseProductQty(addElemUnit[0].productIndex);
      } else {
        //------- delete AddElem in Product
        delAddElemUnitInProduct(addElemUnit);
        CartMenuServ.joinAllAddElements();
      }

      //------ if last AddElem was delete
      if(!CartStor.cart.isExistAddElems) {
        //------ go back in cart
        closeAddElemUnitDetail();
        closeAllAddElemsPanel();
      } else {
        CartServ.showAllAddElements();
        collectAddElemUnitProducts();
        //------ change selected AddElemUnit
        reviewAddElemUnit();
      }
      //------ culculate AddElems Price in each Products
      CartServ.calculateAddElemsProductsPrice(1);
      //------ change order Price
      CartMenuServ.calculateOrderPrice();

    }



    function delAddElemUnitInProduct(productIndex) {
      var addElemProdQty = OrderStor.order.products[productIndex].chosenAddElements.length,
          addElemQty;

      while(--addElemProdQty > -1) {
        addElemQty = OrderStor.order.products[productIndex].chosenAddElements[addElemProdQty].length;
        if(addElemQty) {
          while(--addElemQty > -1) {
            if(OrderStor.order.products[productIndex].chosenAddElements[addElemProdQty][addElemQty].id === thisCtrl.config.selectedAddElemUnit.id) {
              if(OrderStor.order.products[productIndex].chosenAddElements[addElemProdQty][addElemQty].element_width === thisCtrl.config.selectedAddElemUnit.element_width) {
                if(OrderStor.order.products[productIndex].chosenAddElements[addElemProdQty][addElemQty].element_height === thisCtrl.config.selectedAddElemUnit.element_height) {
                  OrderStor.order.products[productIndex].chosenAddElements[addElemProdQty].splice(addElemQty, 1);
                }
              }
            }
          }
        }
      }
    }


    function reviewAddElemUnit() {
      var addElemsQty = CartStor.cart.allAddElemsOrder.length,
        noExist = 1;
      while(--addElemsQty > -1) {
        if(CartStor.cart.allAddElemsOrder[addElemsQty].id === thisCtrl.config.selectedAddElemUnit.id) {
          thisCtrl.config.selectedAddElemUnit.element_qty = angular.copy(CartStor.cart.allAddElemsOrder[addElemsQty].element_qty);
          --noExist;
        }
      }
      if(noExist) {
        closeAddElemUnitDetail();
      }
    }


    /**-------- Show/Hide Explode Link Menu ------*/
    function toggleExplodeLinkMenu(prodInd, event) {
      console.log(prodInd);
      console.log(event.center);
      thisCtrl.config.isLinkExplodeMenu = !thisCtrl.config.isLinkExplodeMenu;
      thisCtrl.config.explodeMenuTop = event.center.y - 50;
      thisCtrl.config.explodeMenuLeft = event.center.x - 30;
    }


    /**-------- Explode by Products ------*/
    function explodeUnitToProduct(addElemUnit, isAllProducts) {
      var lastProductId = d3.max(OrderStor.order.products.map(function (item) {
            return item.product_id;
          })),
          cloneProduct = angular.copy(OrderStor.order.products[addElemUnit[0].productIndex]),
          newProductQty = cloneProduct.product_qty-1;

      cloneProduct.product_qty = 1;

      //--------- whole explode product
      if(isAllProducts) {
        OrderStor.order.products[addElemUnit[0].productIndex].product_qty = 1;
        while(--newProductQty > -1) {
          CartServ.addCloneProductInOrder(cloneProduct, lastProductId);
        }
      } else {
        //--------- explode product once
        OrderStor.order.products[addElemUnit[0].productIndex].product_qty -= 1;
        CartServ.addCloneProductInOrder(cloneProduct, lastProductId);
      }

      thisCtrl.config.isLinkExplodeMenu = 0;
      CartMenuServ.joinAllAddElements();

      CartServ.showAllAddElements();
      collectAddElemUnitProducts();
      //------ change selected AddElemUnit
      reviewAddElemUnit();

      //------ culculate AddElems Price in each Products
      CartServ.calculateAddElemsProductsPrice(1);
      //------ change order Price
      CartMenuServ.calculateOrderPrice();

    }




    /** ======== ADDING ADDELEMENTS TO PRODUCTS ==========*/



    /** open/close product selector by swipe */
    function swipeProductSelector() {
      thisCtrl.config.isSwipeProdSelector = !thisCtrl.config.isSwipeProdSelector;
    }



    function selectProductToAddElem(prodInd) {
      var isSelected = CartStor.cart.selectedProducts[prodInd].length;
      if(isSelected) {
        CartStor.cart.selectedProducts[prodInd].length = 0;
        //------- check another products
        checkAllSelectedProducts();
      } else {
        CartStor.cart.selectedProducts[prodInd].push(1);
        CartStor.cart.isSelectedProduct = 1;
      }
    }



    function checkAllSelectedProducts() {
      var isSelected = 0,
          prodIndQty = CartStor.cart.selectedProducts.length;
      while(--prodIndQty > -1) {
        if(CartStor.cart.selectedProducts[prodIndQty].length) {
          isSelected++;
        }
      }
      CartStor.cart.isSelectedProduct = (isSelected) ? 1 : 0;
    }


  }
})();



// controllers/panels/add_elements_list.js

(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('AddElementsListCtrl', addElementsListCtrl);

  function addElementsListCtrl(globalConstants, GeneralServ, AddElementsServ, AddElementMenuServ, GlobalStor, ProductStor, UserStor, AuxStor) {

    var thisCtrl = this;
    thisCtrl.G = GlobalStor;
    thisCtrl.P = ProductStor;
    thisCtrl.U = UserStor;
    thisCtrl.A = AuxStor;


    thisCtrl.config = {
      addElementDATA: GeneralServ.addElementDATA,
      DELAY_START: globalConstants.STEP,
      DELAY_SHOW_ELEMENTS_MENU: globalConstants.STEP * 6,
      filteredGroups: [],
      typing: 'on'
    };

    //------ clicking
    thisCtrl.selectAddElement = AddElementsServ.selectAddElement;
    thisCtrl.initAddElementTools = AddElementsServ.initAddElementTools;
    thisCtrl.deleteAddElement = AddElementMenuServ.deleteAddElement;
    thisCtrl.deleteAllAddElements = AddElementMenuServ.deleteAllAddElements;
    thisCtrl.closeAddElementListView = AddElementsServ.closeAddElementListView;
    thisCtrl.pressCulculator = AddElementMenuServ.pressCulculator;

  }
})();



// controllers/panels/add_elements.js

(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('AddElementsCtrl', addElementsCtrl);

  function addElementsCtrl(globalConstants, GeneralServ, AddElementsServ, AddElementMenuServ, GlobalStor, AuxStor, ProductStor) {

    var thisCtrl = this;
    thisCtrl.constants = globalConstants;
    thisCtrl.G = GlobalStor;
    thisCtrl.P = ProductStor;
    thisCtrl.A = AuxStor;

    thisCtrl.config = {
      DELAY_START: globalConstants.STEP,
      addElementDATA: GeneralServ.addElementDATA,
      DELAY_SHOW_INSIDESLOPETOP: globalConstants.STEP * 20,
      DELAY_SHOW_INSIDESLOPERIGHT: globalConstants.STEP * 22,
      DELAY_SHOW_INSIDESLOPELEFT: globalConstants.STEP * 21,
      DELAY_SHOW_FORCECONNECT: globalConstants.STEP * 30,
      DELAY_SHOW_BALCONCONNECT: globalConstants.STEP * 35,
      DELAY_SHOW_BUTTON: globalConstants.STEP * 40,
      DELAY_SHOW_ELEMENTS_MENU: globalConstants.STEP * 12,
      typing: 'on'
    };



    //------ clicking
    thisCtrl.selectAddElement = AddElementsServ.selectAddElement;
    thisCtrl.initAddElementTools = AddElementsServ.initAddElementTools;
    thisCtrl.pressCulculator = AddElementMenuServ.pressCulculator;
    thisCtrl.openAddElementListView = AddElementsServ.openAddElementListView;
    thisCtrl.showWindowScheme = showWindowScheme;
    thisCtrl.closeWindowScheme = closeWindowScheme;



    //============ methods ================//

    // Show Window Scheme Dialog
    function showWindowScheme() {
      //playSound('fly');
      AuxStor.aux.isWindowSchemeDialog = true;
    }

    function closeWindowScheme() {
      //playSound('fly');
      AuxStor.aux.isWindowSchemeDialog = false;
    }

  }
})();



// controllers/panels/glasses.js

(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('GlassesCtrl', glassSelectorCtrl);

  function glassSelectorCtrl($filter, globalConstants, MainServ, AnalyticsServ, DesignServ, SVGServ, GlobalStor, OrderStor, ProductStor, DesignStor, UserStor) {

    var thisCtrl = this;
    thisCtrl.constants = globalConstants;
    thisCtrl.G = GlobalStor;
    thisCtrl.P = ProductStor;

    thisCtrl.config = {
      selectGlassId: 0,
      selectGlassName: '',
      camera: $filter('translate')('panels.CAMERa'),
      camer: $filter('translate')('panels.CAMER'),
      camers: $filter('translate')('panels.CAMERs'),
      DELAY_START: 5 * globalConstants.STEP,
      DELAY_BLOCK: 2 * globalConstants.STEP,
      DELAY_TYPING: 2.5 * globalConstants.STEP,
      typing: 'on'
    };


    //------ clicking
    thisCtrl.selectGlass = selectGlass;
    thisCtrl.confirmGlass = confirmGlass;
    thisCtrl.setGlassToAll = setGlassToAll;
    thisCtrl.closeGlassSelectorDialog = closeGlassSelectorDialog;
    thisCtrl.showInfoBox = MainServ.showInfoBox;


    //============ methods ================//

    /** Select glass */
    function selectGlass(newId, newName) {
      //if(ProductStor.product.glass[0].id !== newId) {
        thisCtrl.config.selectGlassId = newId;
        thisCtrl.config.selectGlassName = newName;
        //----- open glass selector dialog
        GlobalStor.global.showGlassSelectorDialog = 1;
        DesignServ.initAllGlassXGlass();
      //}
    }



    function confirmGlass() {
      var selectBlockQty = DesignStor.design.selectedGlass.length;
      if(selectBlockQty) {
        while (--selectBlockQty > -1) {
          var blockId = DesignStor.design.selectedGlass[selectBlockQty].attributes.block_id.nodeValue;
          MainServ.setGlassToTemplateBlocks(blockId, thisCtrl.config.selectGlassId, thisCtrl.config.selectGlassName);
        }
        changePriceAsNewGlass();
        closeGlassSelectorDialog();
      }
    }


    function setGlassToAll() {
      MainServ.setGlassToTemplateBlocks(0, thisCtrl.config.selectGlassId, thisCtrl.config.selectGlassName);
      changePriceAsNewGlass();
      closeGlassSelectorDialog();
    }


    function changePriceAsNewGlass () {
      GlobalStor.global.selectLastGlassId = thisCtrl.config.selectGlassId;
      DesignStor.design.selectedGlass.length = 0;
      //------- set currenct Glass
      MainServ.setCurrentGlass(ProductStor.product, GlobalStor.global.selectLastGlassId);
      SVGServ.createSVGTemplate(ProductStor.product.template_source, ProductStor.product.profileDepths).then(function(result) {
        ProductStor.product.template = angular.copy(result);
        //------ calculate price
        var hardwareIds = (ProductStor.product.hardware.id) ? ProductStor.product.hardware.id : 0;
        MainServ.preparePrice(ProductStor.product.template, ProductStor.product.profile.id, ProductStor.product.glass, hardwareIds, ProductStor.product.lamination.img_in_id);
        //------ save analytics data
        //TODO ?? AnalyticsServ.saveAnalyticDB(UserStor.userInfo.id, OrderStor.order.id, ProductStor.product.template_id, newId, 2);
      });
    }

    function closeGlassSelectorDialog() {
      DesignServ.removeGlassEventsInSVG();
      GlobalStor.global.showGlassSelectorDialog = !GlobalStor.global.showGlassSelectorDialog;
    }

  }
})();



// controllers/panels/hardwares.js

(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('HardwaresCtrl', hardwareSelectorCtrl);

  function hardwareSelectorCtrl(globalConstants, GlobalStor, OrderStor, ProductStor, UserStor, MainServ, AnalyticsServ) {

    var thisCtrl = this;
    thisCtrl.G = GlobalStor;
    thisCtrl.P = ProductStor;

    thisCtrl.config = {
      DELAY_START: 5 * globalConstants.STEP,
      DELAY_BLOCK: 2 * globalConstants.STEP,
      DELAY_TYPING: 2.5 * globalConstants.STEP,
      typing: 'on'
    };


    //------ clicking
    thisCtrl.selectHardware = selectHardware;
    thisCtrl.showInfoBox = MainServ.showInfoBox;


    /**============ methods ================*/


    /**----------- Select hardware -------- */
    function selectHardware(newId) {
      if(ProductStor.product.hardware.id !== newId) {
        //-------- set current Hardware
        MainServ.setCurrentHardware(ProductStor.product, newId);
        //------ calculate price
        MainServ.preparePrice(ProductStor.product.template, ProductStor.product.profile.id, ProductStor.product.glass, ProductStor.product.hardware.id, ProductStor.product.lamination.img_in_id);
        //------ save analytics data
//        AnalyticsServ.saveAnalyticDB(UserStor.userInfo.id, OrderStor.order.id, ProductStor.product.template_id, newId, 3);
        /** send analytics data to Server*/
        AnalyticsServ.sendAnalyticsData(UserStor.userInfo.id, OrderStor.order.id, ProductStor.product.template_id, newId, 3);
      }
    }

  }
})();



// controllers/panels/laminations.js

(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('LaminationsCtrl', laminationSelectorCtrl);

  function laminationSelectorCtrl(globalConstants, MainServ, DesignServ ,GlobalStor, OrderStor, ProductStor, UserStor) {

    var thisCtrl = this;
    thisCtrl.G = GlobalStor;
    thisCtrl.P = ProductStor;

    thisCtrl.config = {
      DELAY_START: 5 * globalConstants.STEP,
      DELAY_BLOCK: 2 * globalConstants.STEP,
      DELAY_TYPING: 2.5 * globalConstants.STEP,
      typing: 'on'
    };

    //------ clicking
    thisCtrl.selectLaminat = selectLaminat;
    thisCtrl.initLaminatFilter = initLaminatFilter;
    thisCtrl.showInfoBox = MainServ.showInfoBox;



    //============ methods ================//


    /** init Laminat Filter */
    function initLaminatFilter(typeId) {
      //console.info('init filter --- ', typeId);
      var laminatQty = GlobalStor.global.laminats.length;
      while(--laminatQty > -1) {
        if(GlobalStor.global.laminats[laminatQty].type_id === typeId) {
          GlobalStor.global.laminats[laminatQty].isActive = !GlobalStor.global.laminats[laminatQty].isActive;
          //console.info('init filter --- ', GlobalStor.global.laminats[laminatQty]);
          MainServ.laminatFiltering();
        }
      }
    }


    //------------ Select lamination
    function selectLaminat(id) {
      //console.info('select lamin --- ', id);
      MainServ.setCurrLamination(id);

      MainServ.setProfileByLaminat(id).then(function() {
        //------ save analytics data
        /** send analytics data to Server*/
        //TODO AnalyticsServ.sendAnalyticsData(UserStor.userInfo.id, OrderStor.order.id, ProductStor.product.template_id, id, 4);
      })
      DesignServ.rebuildSVGTemplate();

    }

  }
})();



// controllers/panels/profiles.js

(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('ProfilesCtrl', profileSelectorCtrl);

  function profileSelectorCtrl($filter, globalConstants, MainServ, AnalyticsServ, GlobalStor, OrderStor, ProductStor, UserStor) {

    var thisCtrl = this;
    thisCtrl.G = GlobalStor;
    thisCtrl.P = ProductStor;

    thisCtrl.config = {
      camera: $filter('translate')('panels.CAMERa'),
      camer: $filter('translate')('panels.CAMER'),
      camers: $filter('translate')('panels.CAMERs'),
      DELAY_START: 5 * globalConstants.STEP,
      DELAY_BLOCK: 2 * globalConstants.STEP,
      DELAY_TYPING: 2.5 * globalConstants.STEP,
      typing: 'on'
    };

    //------ clicking
    thisCtrl.selectProfile = selectProfile;
    thisCtrl.showInfoBox = MainServ.showInfoBox;



    //============ methods ================//

    //---------- Select profile
    function selectProfile(newId) {
      if(ProductStor.product.profile.id !== newId) {
        /** set default white lamination */
        MainServ.setCurrLamination();
        MainServ.setCurrentProfile(ProductStor.product, newId).then(function () {
          ProductStor.product.glass.length = 0;
          MainServ.parseTemplate().then(function () {
            //------ save analytics data
//            AnalyticsServ.saveAnalyticDB(UserStor.userInfo.id, OrderStor.order.id, ProductStor.product.template_id, newId, 1);
            /** change lamination groups as of new profile */
            MainServ.laminatFiltering();
            /** send analytics data to Server*/
            AnalyticsServ.sendAnalyticsData(UserStor.userInfo.id, OrderStor.order.id, ProductStor.product.template_id, newId, 1);
          });
        });
      }
    }

  }
})();



// controllers/panels/templates.js

(function(){
'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('TemplatesCtrl', templateSelectorCtrl);

  function templateSelectorCtrl($location, $filter, globalConstants, MainServ, GeneralServ, TemplatesServ, optionsServ, GlobalStor, OrderStor, ProductStor) {

    var thisCtrl = this;
    thisCtrl.constants = globalConstants;
    thisCtrl.G = GlobalStor;
    thisCtrl.O = OrderStor;
    thisCtrl.P = ProductStor;


    thisCtrl.config = {
      DELAY_TEMPLATE_ELEMENT: 5 * globalConstants.STEP,
      typing: 'on'
    };


    //---------- download templates Img icons
    optionsServ.getTemplateImgIcons(function (results) {
      if (results.status) {
        thisCtrl.templatesImgs = results.data.templateImgs;
      } else {
        console.log(results);
      }
    });


    //------ clicking

    thisCtrl.selectNewTemplate = TemplatesServ.selectNewTemplate;
    thisCtrl.toggleTemplateType = toggleTemplateType;
    thisCtrl.selectNewTemplateType = selectNewTemplateType;
    thisCtrl.gotoConstructionPage = gotoConstructionPage;




    //============ methods ================//


    //------ click on top button to change template type
    function toggleTemplateType() {
      GlobalStor.global.isTemplateTypeMenu = !GlobalStor.global.isTemplateTypeMenu;
    }


    //------- Select new Template Type
    function selectNewTemplateType(marker) {
      GlobalStor.global.isTemplateTypeMenu = 0;

      function goToNewTemplateType() {
        if (marker === 4) {
          MainServ.setDefaultDoorConfig();
        }
        GlobalStor.global.isChangedTemplate = 0;
        TemplatesServ.initNewTemplateType(marker);
      }

      if (GlobalStor.global.isChangedTemplate) {
        //----- если выбран новый шаблон после изменения предыдущего
        GeneralServ.confirmAlert(
          $filter('translate')('common_words.NEW_TEMPLATE_TITLE'),
          $filter('translate')('common_words.TEMPLATE_CHANGES_LOST'),
          goToNewTemplateType
        );
      } else {
        TemplatesServ.initNewTemplateType(marker);
      }

    }


    function gotoConstructionPage() {
      thisCtrl.G.global.activePanel = 0;
      $location.path('/design');
    }


  }
})();


// controllers/parts/addelems_group_menu.js

(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('AddElemGroupMenuCtrl', addElemGroupCtrl);

  function addElemGroupCtrl(AddElementsServ, AuxStor) {

    var thisCtrl = this;
    thisCtrl.A = AuxStor;

    //------ clicking
    thisCtrl.selectAddElement = AddElementsServ.selectAddElement;

  }
})();


// controllers/parts/alert.js

(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('AlertCtrl', alertCtrl);

  function alertCtrl(GlobalStor) {

    var thisCtrl = this;
    thisCtrl.G = GlobalStor;

    thisCtrl.clickYes = clickYes;

    function clickYes() {
      GlobalStor.global.isAlert = 0;
      GlobalStor.global.confirmAction();
    }

  }
})();


// controllers/parts/info_box.js

(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('infoBoxCtrl', infoBoxCtrl);

  function infoBoxCtrl(GlobalStor) {

    var thisCtrl = this;
    thisCtrl.G = GlobalStor;

    //------ clicking
    thisCtrl.closeInfoBox = closeInfoBox;


    //============ methods ================//
    /** close Info Box */
    function closeInfoBox() {
      GlobalStor.global.isInfoBox = 0;
      GlobalStor.global.infoTitle = '';
      GlobalStor.global.infoImg =  '';
      GlobalStor.global.infoLink = '';
      GlobalStor.global.infoDescrip = '';
    }



  }
})();


// controllers/parts/loader.js

(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('LoaderCtrl', loaderCtrl);

  function loaderCtrl(GlobalStor) {

    var thisCtrl = this;
    thisCtrl.G = GlobalStor;

  }
})();


// controllers/parts/order_form.js

(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('CartModule')
    .controller('OrderFormCtrl', orderFormCtrl);

  function orderFormCtrl($filter, GlobalStor, OrderStor, UserStor, CartStor, CartMenuServ) {

    var thisCtrl = this;
    thisCtrl.O = OrderStor;
    thisCtrl.C = CartStor;
    thisCtrl.U = UserStor;

    thisCtrl.config = {
      month: $filter('translate')('common_words.MONTH_LABEL'),
      montha: $filter('translate')('common_words.MONTHA_LABEL'),
      months: $filter('translate')('common_words.MONTHS_LABEL')
    };

    //SettingServ.downloadLocations().then(function(data) {
    //    thisCtrl.locations = data;
    //});
    /** база городов и регионов долны быть только одной страны завода */
    thisCtrl.locations = GlobalStor.global.locations.cities.filter(function(item) {
      return item.countryId === UserStor.userInfo.countryId;
    });

    //------ clicking
    thisCtrl.submitForm = submitForm;
    thisCtrl.changeLocation = CartMenuServ.changeLocation;
    thisCtrl.selectCity = CartMenuServ.selectCity;
    thisCtrl.closeOrderDialog = CartMenuServ.closeOrderDialog;


    //============ methods ================//

    //------- Send Form Data
    function submitForm(form) {
      //------- Trigger validation flag.
      CartStor.cart.submitted = true;
      if(form.$valid) {
        CartMenuServ.sendOrder();
      }
    }

  }
})();


// controllers/parts/qty_calculator.js

(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('qtyCalculatorCtrl', qtyCalcCtrl);

  function qtyCalcCtrl(AddElementMenuServ) {

    var thisCtrl = this;

    //------ clicking
    thisCtrl.setValueQty = AddElementMenuServ.setValueQty;
    thisCtrl.closeQtyCaclulator = AddElementMenuServ.closeQtyCaclulator;
    thisCtrl.pressCulculator = AddElementMenuServ.pressCulculator;

  }
})();


// controllers/parts/report.js

(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('ReportCtrl', reportCtrl);

  function reportCtrl($rootScope, $filter, localDB, GeneralServ, GlobalStor, ProductStor, UserStor) {

    var thisCtrl = this;
    thisCtrl.G = GlobalStor;
    thisCtrl.P = ProductStor;
    thisCtrl.U = UserStor;

    thisCtrl.config = {
      reportMenu: [],
      reportFilterId: undefined,
      reportPriceTotal: 0
    };

    //------ clicking

    //thisCtrl.showReport = showReport;
    thisCtrl.sortReport = sortReport;


    //============ methods ================//



    $('.main-content').off("keypress").keypress(function(event) {
      //      console.log(UserStor.userInfo.user_type);
      //console.log('RRRRRRRRR', event.keyCode);
      //------ show report only for Plands (5,7)
      if(UserStor.userInfo.user_type === 5 || UserStor.userInfo.user_type === 7) {
        //----- Button 'R'
        if(event.keyCode === 82 || event.keyCode === 114) {
          showReport();
        }
      }
    });


    function showReport() {
      GlobalStor.global.isReport = !GlobalStor.global.isReport;
      /** cuclulate Total Price of Report */
      culcReportPriceTotal();
      /** download report Menu */
      if(GlobalStor.global.isReport) {
        localDB.selectLocalDB(localDB.tablesLocalDB.elements_groups.tableName).then(function(result) {
          thisCtrl.config.reportMenu = result.filter(function(item) {
            return item.position > 0;
          });
          thisCtrl.config.reportMenu.push({
            id: 0,
            name: $filter('translate')('common_words.ALL')
          });
        });
      }
      $rootScope.$apply();
    }



    function sortReport(groupId) {
      /** cuclulate Total Price of group of Report */
      culcReportPriceTotal(groupId);
      if(groupId) {
        thisCtrl.config.reportFilterId = groupId;
      } else {
        thisCtrl.config.reportFilterId = undefined;
      }
    }



    function culcReportPriceTotal(group) {
      var currReportList = (group) ? ProductStor.product.report.filter(function(item) {
        return item.element_group_id === group;
      }) : angular.copy(ProductStor.product.report);

      if(currReportList.length) {
        thisCtrl.config.reportPriceTotal = GeneralServ.roundingValue(currReportList.reduce(function (sum, item) {
          return {priceReal: sum.priceReal + item.priceReal};
        }).priceReal, 2);
      } else {
        thisCtrl.config.reportPriceTotal = 0;
      }
    }


  }
})();


// controllers/parts/room_info.js

(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('RoomInfoCtrl', roomInfoCtrl);

  function roomInfoCtrl($filter, MainServ, GeneralServ, TemplatesServ, globalConstants, GlobalStor, OrderStor, ProductStor, UserStor) {

    var thisCtrl = this;
    thisCtrl.constants = globalConstants;
    thisCtrl.G = GlobalStor;
    thisCtrl.O = OrderStor;
    thisCtrl.P = ProductStor;
    thisCtrl.U = UserStor;

  
      thisCtrl.config = {
      DELAY_SHOW_COEFF: 20 * globalConstants.STEP,
      DELAY_SHOW_ALLROOMS_BTN: 15 * globalConstants.STEP,
      typing: 'on'
    };
  

    //------ clicking

    thisCtrl.showRoomSelectorDialog = showRoomSelectorDialog;
    thisCtrl.switchComment = switchComment;
    thisCtrl.selectNewTemplate = TemplatesServ.selectNewTemplate;
    thisCtrl.toggleTemplateType = toggleTemplateType;
    thisCtrl.selectNewTemplateType = selectNewTemplateType;
    



    //========================= selection rooms ========================================//

    //------ Show/Close Room Selector Dialog
    function showRoomSelectorDialog() {
      //----- open if comment block is closed
      if(!GlobalStor.global.isShowCommentBlock) {
//        GlobalStor.global.showRoomSelectorDialog = !GlobalStor.global.showRoomSelectorDialog;
        GlobalStor.global.showRoomSelectorDialog = 1;
        //playSound('fly');
      }
    }

    //----- Show Comments
    function switchComment() {
      //playSound('swip');
      GlobalStor.global.isShowCommentBlock = !GlobalStor.global.isShowCommentBlock;
    }
  

   //------ click on top button to change template type
    
    function toggleTemplateType() {
      GlobalStor.global.isTemplateTypeMenu = !GlobalStor.global.isTemplateTypeMenu;
    }

    //================== Select new Template Type ========================//
  

    function selectNewTemplateType(marker) {
      GlobalStor.global.isTemplateTypeMenu = 0;

      function goToNewTemplateType() {
        if (marker === 4) {
          MainServ.setDefaultDoorConfig();
        }
        GlobalStor.global.isChangedTemplate = 0;
        TemplatesServ.initNewTemplateType(marker);
      }

      if (GlobalStor.global.isChangedTemplate) {
        //----- если выбран новый шаблон после изменения предыдущего
        GeneralServ.confirmAlert(
          $filter('translate')('common_words.NEW_TEMPLATE_TITLE'),
          $filter('translate')('common_words.TEMPLATE_CHANGES_LOST'),
          goToNewTemplateType
        );
      } else {
        TemplatesServ.initNewTemplateType(marker);
      }

    }
  }

})();


// controllers/parts/room_selector.js

(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('RoomSelectorCtrl', roomSelectorCtrl);

  function roomSelectorCtrl(globalConstants, MainServ, TemplatesServ, GlobalStor, ProductStor, UserStor) {

    var thisCtrl = this;
    thisCtrl.G = GlobalStor;
    thisCtrl.P = ProductStor;
    thisCtrl.U = UserStor;

    thisCtrl.config = {
      DELAY_SHOW_ROOM: 2*globalConstants.STEP
    };



    //------ clicking
    thisCtrl.selectRoom = selectRoom;
    thisCtrl.closeRoomSelectorDialog = MainServ.closeRoomSelectorDialog;

    //============ methods ================//

    //---------- Room Select
   
   function selectRoom(id) {
      TemplatesServ.selectNewTemplate((GlobalStor.global.rooms[id].template_id - 1), id+1);
    }



  }
})();


// controllers/parts/search_box.js

(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('searchCtrl', searchCtrl);

  function searchCtrl($filter, GlobalStor, AuxStor, HistoryStor, AddElementsServ, AddElementMenuServ) {

    var thisCtrl = this;
    thisCtrl.G = GlobalStor;


    //------ clicking
    //----------- for AddElements List View
    if(GlobalStor.global.currOpenPage === 'main' || GlobalStor.global.currOpenPage === 'cart') {
      thisCtrl.placeholder = $filter('translate')('add_elements.INPUT_ADD_ELEMENT');
      thisCtrl.checkChanges = checkChanges;
      thisCtrl.cancelSearching = cancelSearching;
      thisCtrl.deleteSearchChart = deleteSearchChart;
    } else if(GlobalStor.global.currOpenPage === 'history'){
      //----------- for History Page
      thisCtrl.placeholder = $filter('translate')('history.SEARCH_PLACEHOLDER');
      thisCtrl.checkChanges = checkChangesHistory;
      thisCtrl.cancelSearching = cancelSearchingHistory;
      thisCtrl.deleteSearchChart = deleteSearchChartHistory;
    }

    //============ methods ================//

    //----------- Searching Block in AddElements List View

    function checkChanges() {
      if(thisCtrl.searchingWord !== '') {
        if(thisCtrl.searchingWord.length === 1) {
          AddElementsServ.createAddElementGroups();
        }
        AuxStor.aux.searchingWord = thisCtrl.searchingWord;
      } else {
        cancelSearching();
      }
    }

    //------- Delete searching word
    function cancelSearching() {
      thisCtrl.searchingWord = '';
      AuxStor.aux.addElementGroups.length = 0;
      AuxStor.aux.searchingWord = thisCtrl.searchingWord;
      AddElementMenuServ.closeAddElementsMenu();
    }

    //-------- Delete last chart searching word
    function deleteSearchChart() {
      thisCtrl.searchingWord = thisCtrl.searchingWord.slice(0,-1);
      if(thisCtrl.searchingWord === '') {
        cancelSearching();
      } else {
        AuxStor.aux.searchingWord = thisCtrl.searchingWord;
      }
    }


    //========== History Page ===========//

    function checkChangesHistory() {
      if(thisCtrl.searchingWord !== '') {
        HistoryStor.history.searchingWord = thisCtrl.searchingWord;
      }
    }
    //-------- Delete searching word
    function cancelSearchingHistory() {
      thisCtrl.searchingWord = '';
      HistoryStor.history.searchingWord = '';
      HistoryStor.history.isOrderSearch = 0;
    }

    //-------- Delete last chart searching word
    function deleteSearchChartHistory() {
      thisCtrl.searchingWord = thisCtrl.searchingWord.slice(0,-1);
      HistoryStor.history.searchingWord = thisCtrl.searchingWord;
    }


  }
})();


// controllers/parts/size_calculator.js

(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('sizeCalculatorCtrl', sizeCalcCtrl);

  function sizeCalcCtrl(GlobalStor, DesignStor, AddElementMenuServ, DesignServ) {

    var thisCtrl = this;
    thisCtrl.isDesignPage = false;
    thisCtrl.D = DesignStor;


    //------ clicking
    //------ for Add Elements Panel
    if(GlobalStor.global.activePanel == 6) {
      thisCtrl.isDesignPage = false;
      thisCtrl.setValueSize = AddElementMenuServ.setValueSize;
      thisCtrl.deleteLastNumber = AddElementMenuServ.deleteLastNumber;
      thisCtrl.closeSizeCaclulator = AddElementMenuServ.closeSizeCaclulator;
    //------ for Design Page
    } else {
      thisCtrl.isDesignPage = true;
      thisCtrl.setValueSize = DesignServ.setValueSize;
      thisCtrl.deleteLastNumber = DesignServ.deleteLastNumber;
      thisCtrl.closeSizeCaclulator = DesignServ.closeSizeCaclulator;
    }
    thisCtrl.pressCulculator = AddElementMenuServ.pressCulculator;


  }
})();


// controllers/parts/user_info.js

(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('UserInfoCtrl', userInfoCtrl);

  function userInfoCtrl(globalConstants, GlobalStor, UserStor) {

    var thisCtrl = this;
    thisCtrl.G = GlobalStor;
    thisCtrl.U = UserStor;

    thisCtrl.config = {
      DELAY_SHOW_USER_INFO: 40 * globalConstants.STEP,
      typing: 'on',
      checked: false
    };

    //------ clicking

    thisCtrl.swipeMainPage = swipeMainPage;
    thisCtrl.swipeLeft = swipeLeft;
    thisCtrl.swipeRight = swipeRight;

    //============ methods ================//

    function swipeMainPage(event) {
      GlobalStor.global.isNavMenu = !GlobalStor.global.isNavMenu;
      GlobalStor.global.isConfigMenu = !GlobalStor.global.isConfigMenu;
      //playSound('swip');
    }

    function swipeLeft(event) {
      if(GlobalStor.global.isNavMenu) {
        GlobalStor.global.isNavMenu = 0;
        GlobalStor.global.isConfigMenu = 1;
        //playSound('swip');
      }
    }

    function swipeRight(event) {
      if(!GlobalStor.global.isNavMenu) {
        GlobalStor.global.isNavMenu = 1;
        GlobalStor.global.isConfigMenu = 0;
        //playSound('swip');
      }
    }

  }
})();


// controllers/settings.js

(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('SettingsModule')
    .controller('SettingsCtrl', settingsPageCtrl);

  function settingsPageCtrl($location, globalConstants, localDB, SettingServ, GlobalStor, OrderStor, ProductStor, AuxStor, UserStor ) {

    var thisCtrl = this;
    thisCtrl.U = UserStor;


    thisCtrl.config = {
      DELAY_START: globalConstants.STEP,
      DELAY_SHOW_ICONS: globalConstants.STEP * 10,
      isInsertPhone: false,
      isEmailError: false,
      addPhones: [],
      tempAddPhone: '',
      regex: globalConstants.REG_PHONE,
      mailReg: globalConstants.REG_MAIL,
      typing: 'on'
    };

    //------- set current Page
    GlobalStor.global.currOpenPage = 'settings';

    //    $scope.global.startProgramm = false;
    //    //----- for location page
    //    $scope.global.isOpenSettingsPage = true;

    //----- parse additional phones
    if(UserStor.userInfo.city_phone) {
      thisCtrl.config.addPhones = UserStor.userInfo.city_phone.split(',');
    }


    //------ clicking
    thisCtrl.changeSettingData = changeSettingData;
    thisCtrl.appendInputPhone = appendInputPhone;
    thisCtrl.cancelAddPhone = cancelAddPhone;
    thisCtrl.saveChanges = saveChanges;
    thisCtrl.saveChangesBlur = saveChangesBlur;
    thisCtrl.changeEmail = changeEmail;
    thisCtrl.addNewPhone = addNewPhone;
    thisCtrl.saveChangesPhone = saveChangesPhone;
    thisCtrl.deletePhone = deletePhone;
    thisCtrl.gotoPasswordPage = SettingServ.gotoPasswordPage;
    thisCtrl.gotoLanguagePage = SettingServ.gotoLanguagePage;
    thisCtrl.gotoLocationPage = SettingServ.gotoLocationPage;
    thisCtrl.closeSettingsPage = SettingServ.closeSettingsPage;
    thisCtrl.logOut = logOut;



    //============ methods ================//



    function changeSettingData(id, obj) {
      thisCtrl.config.selectedSetting = id;
      //TODO ipad findInput(obj.currentTarget.id);
      findInput(obj.target.id);
    }


    function saveChanges(marker, newTxt) {
      if (event.which == 13) {
        saveTxtInBD(marker, newTxt);
      }
    }

    function saveChangesBlur(marker, newTxt) {
        saveTxtInBD(marker, newTxt);
    }

    function saveTxtInBD(marker, newTxt) {
      var updateData = {};
      switch(marker) {
        case 'user-name': updateData.name = newTxt;
          break;
        case 'user-address': updateData.address = newTxt;
          break;
        case 'user-email':
          var checkEmail = thisCtrl.config.mailReg.test(newTxt);
          if(checkEmail) {
            thisCtrl.config.isEmailError = 0;
            updateData.email = newTxt;
          } else {
            thisCtrl.config.isEmailError = 1;
          }
          break;
      }
      if(!$.isEmptyObject(updateData)) {
        //----- update factoryId in LocalDB & Server
        localDB.updateLocalServerDBs(localDB.tablesLocalDB.users.tableName, UserStor.userInfo.id, updateData);
      }
    }

    function changeEmail() {
      thisCtrl.config.isEmailError = 0;
    }



    function addNewPhone() {
      if(thisCtrl.config.tempAddPhone && thisCtrl.config.tempAddPhone !== '') {
        saveNewPhone();
      } else {
        appendInputPhone();
      }
    }

    function appendInputPhone() {
      thisCtrl.config.isInsertPhone = !thisCtrl.config.isInsertPhone;
      thisCtrl.config.tempAddPhone = '';
      thisCtrl.config.isErrorPhone = 0;
      findInputPhone();
    }

    function cancelAddPhone() {
      thisCtrl.config.isInsertPhone = 0;
      thisCtrl.config.isErrorPhone = 0;
    }

    function saveChangesPhone() {
      if (event.which == 13) {
        saveNewPhone();
      }
    }

    function saveNewPhone() {
      var checkPhone = thisCtrl.config.regex.test(thisCtrl.config.tempAddPhone);
      if(checkPhone) {
        thisCtrl.config.isInsertPhone = 0;
        thisCtrl.config.isErrorPhone = 0;
        thisCtrl.config.addPhones.push(thisCtrl.config.tempAddPhone);
        //------- save phones in DB
        savePhoneInDB(thisCtrl.config.addPhones);
      } else {
        thisCtrl.config.isErrorPhone = 1;
      }
    }


    function deletePhone(phoneId) {
      thisCtrl.config.addPhones.splice(phoneId, 1);
      //------- save phones in DB
      savePhoneInDB(thisCtrl.config.addPhones);
    }

    //------- save phones in DB
    function savePhoneInDB(phones) {
      var phonesString = phones.join(',');
      UserStor.userInfo.city_phone = phonesString;
      localDB.updateLocalServerDBs(localDB.tablesLocalDB.users.tableName, UserStor.userInfo.id, {"city_phone": phonesString});
      thisCtrl.config.tempAddPhone = '';
    }


    function logOut() {
      UserStor.userInfo = UserStor.setDefaultUser();
      GlobalStor.global = GlobalStor.setDefaultGlobal();
      OrderStor.order = OrderStor.setDefaultOrder();
      ProductStor.product = ProductStor.setDefaultProduct();
      AuxStor.aux = AuxStor.setDefaultAuxiliary();

      $location.path('/login');
    }

    function findInput(idElement) {
      setTimeout(function() {
        $('#'+idElement).find('input').focus();
      }, 100);
    }

    function findInputPhone() {
      setTimeout(function() {
        $('.set-input-phone').focus();
      }, 100);
    }

  }
})();


// directives/calendar_scroll.js

(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('HistoryModule')
    .directive('calendarScroll', calendarScrollDir);

  function calendarScrollDir($filter, HistoryStor) {

    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      scope: {
        calendarType: '=',
        orderType: '='
      },
      template: function(elem, attr){
        var typeTemplate = attr.calendarType* 1,
            templateBody = '',
            dateRange = '',
            formName = '',
            selectDayId = '',
            selectDayName = '',
            selectMonthId = '',
            selectMonthName = '',
            selectYearId = '',
            selectYearName = '',
            monthObj = $filter('translate')('common_words.MONTHS'),
            monthArr = monthObj.split(', '),
            monthQty = monthArr.length,
            dayIndex = 1, monthIndex = 0,
            yearIndex = 2010, yearEnd = new Date().getFullYear()+1;

        if(typeTemplate) {
          /** Data Finish */
          dateRange = 'date_range_from';
          formName = 'date_from';
          selectDayId = 'from_date';
          selectDayName = 'from_date_'+attr.orderType;
          selectMonthId = 'from_month';
          selectMonthName = 'from_month_'+attr.orderType;
          selectYearId = 'from_fullYear';
          selectYearName = 'from_fullYear_'+attr.orderType;
        } else {
          /** Data Start */
          dateRange = 'date_range_to';
          formName = 'date_to';
          selectDayId = 'to_date';
          selectDayName = 'to_date_'+attr.orderType;
          selectMonthId = 'to_month';
          selectMonthName = 'to_month_'+attr.orderType;
          selectYearId = 'to_fullYear';
          selectYearName = 'to_fullYear_'+attr.orderType;
        }
        templateBody = '<div class="date_range outside">'+
          '<div class="date_range_container">'+
          '<div class="'+dateRange+'">'+
          '<form name="'+formName+'">'+
          '<div class="lines"><div></div></div>'+
          '<select class="date" id="'+selectDayId+'" name="'+selectDayName+'">';

        /** Day generating */
        while(dayIndex < 32) {
          templateBody += '<option value="'+dayIndex+'">'+dayIndex+'</option>';
          dayIndex++;
        }
        templateBody += '</select><select class="date" id="'+selectMonthId+'" name="'+selectMonthName+'">';

        /** Month generating */
        while(monthIndex < monthQty) {
          templateBody += '<option value="'+monthIndex+'">'+monthArr[monthIndex]+'</option>';
          monthIndex++;
        }
        templateBody += '</select><select class="date" id="'+selectYearId+'" name="'+selectYearName+'">';

        /** Year generating */
        while(yearIndex <= yearEnd) {
          templateBody += '<option value="'+yearIndex+'">'+yearIndex+'</option>';
          yearIndex++;
        }
        templateBody += '</select></form></div></div></div>';

        return templateBody;

      },
      link: function (scope, element, attrs) {

//      Hammer.plugins.fakeMultitouch();

        function getIndexForValue(selectTag, value) {
          var selectQty = selectTag.options.length;
          while(--selectQty > -1) {
            if (selectTag.options[selectQty].value == value) {
              return selectQty;
            }
          }
        }

        function update(panel, section, datetime) {
          $('.'+panel).find("#" + section + "_date").drum('setIndex', datetime.getDate()-1);
          $('.'+panel).find("#" + section + "_month").drum('setIndex', datetime.getMonth());
          $('.'+panel).find("#" + section + "_fullYear").drum('setIndex', getIndexForValue($("#" + section + "_fullYear")[0], datetime.getFullYear()));
        }

        $(function(){
          $("select.date").drum({
            onChange : function (elem) {
              var elemNameArr = elem.name.split('_'),
                  section = elemNameArr[0],
                  isOrder = elemNameArr[2]*1,
                  arr = {'date' : 'setDate', 'month' : 'setMonth', 'fullYear' : 'setFullYear'},
                  date = new Date();
              for (var s in arr) {
                var i = ($("form[name='date_" + section + "'] select[id='" + section + "_" + s + "']"))[0].value;
                eval ("date." + arr[s] + "(" + i + ")");
              }

              if(isOrder) {
                update('history-view', section, date);
                /** save Data for order */
                if(section === 'from'){
                  HistoryStor.history.startDate = date;
                } else {
                  HistoryStor.history.finishDate = date;
                }
              } else {
                update('draft-view', section, date);
                /** save Data for draft */
                if(section === 'from'){
                  HistoryStor.history.startDateDraft = date;
                } else {
                  HistoryStor.history.finishDateDraft = date;
                }
              }
              scope.$apply();
            }
          });

          var now = new Date();
          update('history-view', "from", new Date(now.getFullYear(), now.getMonth(), now.getDate()));
          update('history-view', "to", new Date(now.getFullYear(), now.getMonth(), now.getDate()));
          update('draft-view', "from", new Date(now.getFullYear(), now.getMonth(), now.getDate()));
          update('draft-view', "to", new Date(now.getFullYear(), now.getMonth(), now.getDate()));
        });

      }
    };

  }
})();


// directives/calendar.js

(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('CartModule')
    .directive('calendar', calendarDir);

  function calendarDir($filter, CartMenuServ, GlobalStor, OrderStor) {

    return {
      restrict: 'E',
      transclude: true,
      link: function (scope, element, attrs) {

        var orderDay = new Date(OrderStor.order.order_date).getDate(),
        minDeliveryDate = new Date().setDate( (orderDay + GlobalStor.global.deliveryCoeff.min_time - 1) ),
//        maxDeliveryDate = new Date().setDate( (orderDay + globalConstants.maxDeliveryDays)),
        deliveryDate = $filter('date')(OrderStor.order.new_delivery_date, 'dd.MM.yyyy'),
        oldDeliveryDate = $filter('date')(OrderStor.order.delivery_date, 'dd.MM.yyyy');

        $(function(){
          var opt = {
            flat: true,
            format: 'd.m.Y',
            locale: {
              days: [],
              daysShort: [],
              daysMin: [],
              monthsShort: [],
              months: []
            },
            date: deliveryDate,
            min: minDeliveryDate,
//            max: maxDeliveryDate,
            change: function (date) {
              CartMenuServ.checkDifferentDate(oldDeliveryDate, date);
              scope.$apply();
            }
          };
          opt.locale.monthsShort = $filter('translate')('common_words.MONTHS_SHOT').split(', ');
          opt.locale.months = $filter('translate')('common_words.MONTHS').split(', ');
          element.pickmeup(opt);
        });
      }
    };

  }
})();



// directives/file_loader.js

(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('BauVoiceApp')
    .directive('fileread', fileLoader);



  function fileLoader(SettingServ, UserStor) {
    return {
      scope: {
        fileread: "="
      },
      link: function (scope, element, attributes) {
        element.bind("change", function (changeEvent) {
          var fd = new FormData(),
              reader = new FileReader();
          fd.append("user", UserStor.userInfo.id);
          fd.append("file", changeEvent.target.files[0]);

          reader.onload = function (loadEvent) {
            scope.$apply(function () {
              scope.fileread = loadEvent.target.result;
              SettingServ.changeAvatar(scope.fileread, fd);
            });
          };
          reader.readAsDataURL(changeEvent.target.files[0]);

        });
      }
    };
  }

})();


// directives/location_filter.js

(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('BauVoiceApp')
    .filter('locationFilter', locationFilter);

  function locationFilter($filter) {

    return function(items, searchWord) {
      var itemsQty = items.length,
          searchWTemp,
          filtered = [];
          //regexp = new RegExp('^'+searchWord+'\\.*','i');

      if(searchWord && (searchWord.length > 2)) {
        //------- slower!!!!
        //while(--itemsQty > -1) {
        //  if(regexp.test(items[itemsQty].fullLocation)) {
        //    filtered.push(items[itemsQty]);
        //  }
        //}
        searchWTemp = searchWord.toLowerCase();
        while(--itemsQty > -1) {
          if(items[itemsQty].fullLocation.toLowerCase().indexOf(searchWTemp) === 0) {
            filtered.push(items[itemsQty]);
          }
        }
      }
      filtered = $filter('orderBy')(filtered, 'cityName', false);
      return filtered;
    };

  }
})();



// directives/order_date.js

(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('HistoryModule')
    .directive('orderDate', orderDateDir);

  function orderDateDir($filter) {


    return {
      restrict: 'A',
      scope: {
        orderDate: '@',
        typeDate: '='
      },

      link: function (scope, element, attrs) {

        function getDateInNewFormat(oldD, type) {
          var oldDateFormat, oldDateFormatArr, monthsArr, newDateFormat, monthId;

          monthsArr = $filter('translate')('common_words.MONTHA').split(', ');

          if(oldD !== '') {
            if(type === 'order') {
              oldDateFormat = oldD.split(' ');
              oldDateFormatArr = oldDateFormat[0].split('-');
              monthId = parseInt(oldDateFormatArr[1], 10) - 1;
              newDateFormat = oldDateFormatArr[2] + ' ' + monthsArr[monthId] + ', ' + oldDateFormatArr[0];
            } else {
              oldDateFormatArr = oldD.split('/');
              monthId = parseInt(oldDateFormatArr[0], 10) - 1;
              newDateFormat = oldDateFormatArr[1] + ' ' + monthsArr[monthId] + ', ' + oldDateFormatArr[2];
            }
          } else {
            oldDateFormat = new Date();
            newDateFormat = oldDateFormat.getDate() + ' ' + monthsArr[oldDateFormat.getMonth()] + ', ' + oldDateFormat.getFullYear();
          }

          if(!type && oldD === '') {
            element.text('');
          } else {
            element.text(newDateFormat);
          }
        }

        getDateInNewFormat(scope.orderDate, scope.typeDate);

        attrs.$observe('orderDate', function () {
          getDateInNewFormat(scope.orderDate, scope.typeDate);
        });

      }
    };


  }
})();


// directives/order_filter.js

(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('HistoryModule')
    .filter('orderSorting', orderSortingFilter);

  function orderSortingFilter() {

    return function(items, sortType) {
      var filtered = [];

      function buildOrdersByType(items, orderStyle) {
        angular.forEach(items, function(item) {
          if(angular.equals(item.order_style, orderStyle)) {
            filtered.push(item);
          }
        });
      }

      if(sortType === 'type') {
        buildOrdersByType(items, 'order');
        buildOrdersByType(items, 'master');
        buildOrdersByType(items, 'done');
      } else if(sortType === 'first') {
        angular.forEach(items, function(item) {
          filtered.push(item);
        });
        filtered.reverse();
      } else {
        angular.forEach(items, function(item) {
          filtered.push(item);
        });
      }

      return filtered;
    };

  }
})();



// directives/price_x_qty.js

(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('BauVoiceApp')
    .directive('priceFixed', priceFixedDir);

  function priceFixedDir() {

    return {
      restrict: 'A',
      scope: {
        priceFixed: '@',
        qtyElement: '@',
        currencyElement: '@'
      },

      link: function (scope, element, attrs) {

        function getNewPrice(priceAtr, qty, currency) {
          var newPrice = parseFloat( ((Math.round(parseFloat(priceAtr) * 100)/100) * qty).toFixed(2) ) + ' ' + currency;
          element.text(newPrice);
        }

        getNewPrice(scope.priceFixed, scope.qtyElement, scope.currencyElement);

        attrs.$observe('qtyElement', function () {
          getNewPrice(scope.priceFixed, scope.qtyElement, scope.currencyElement);
        });
        attrs.$observe('priceFixed', function () {
          getNewPrice(scope.priceFixed, scope.qtyElement, scope.currencyElement);
        });

      }
    };


  }
})();



// directives/price.js

(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('BauVoiceApp')
    .directive('price', priceDir);

  function priceDir(globalConstants, SoundPlayServ) {

    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      scope: {
        priceValue: '=',
        priceCurrency: '='
      },
      template:
        '<div class="price clearfix" data-output="priceValue">' +
          '<div id="price" class="price-value">' +
            '<div class="digit-cell"><div class="digit">&nbsp;</div><div class="digit">0</div><div class="digit">1</div><div class="digit">2</div><div class="digit">3</div><div class="digit">4</div><div class="digit">5</div><div class="digit">6</div><div class="digit">7</div><div class="digit">8</div><div class="digit">9</div><div class="digit">.</div></div>' +
            '<div class="digit-cell"><div class="digit">&nbsp;</div><div class="digit">0</div><div class="digit">1</div><div class="digit">2</div><div class="digit">3</div><div class="digit">4</div><div class="digit">5</div><div class="digit">6</div><div class="digit">7</div><div class="digit">8</div><div class="digit">9</div><div class="digit">.</div></div>' +
            '<div class="digit-cell"><div class="digit">&nbsp;</div><div class="digit">0</div><div class="digit">1</div><div class="digit">2</div><div class="digit">3</div><div class="digit">4</div><div class="digit">5</div><div class="digit">6</div><div class="digit">7</div><div class="digit">8</div><div class="digit">9</div><div class="digit">.</div></div>' +
            '<div class="digit-cell"><div class="digit">&nbsp;</div><div class="digit">0</div><div class="digit">1</div><div class="digit">2</div><div class="digit">3</div><div class="digit">4</div><div class="digit">5</div><div class="digit">6</div><div class="digit">7</div><div class="digit">8</div><div class="digit">9</div><div class="digit">.</div></div>' +
            '<div class="digit-cell"><div class="digit">&nbsp;</div><div class="digit">0</div><div class="digit">1</div><div class="digit">2</div><div class="digit">3</div><div class="digit">4</div><div class="digit">5</div><div class="digit">6</div><div class="digit">7</div><div class="digit">8</div><div class="digit">9</div><div class="digit">.</div></div>' +
            '<div class="digit-cell"><div class="digit">&nbsp;</div><div class="digit">0</div><div class="digit">1</div><div class="digit">2</div><div class="digit">3</div><div class="digit">4</div><div class="digit">5</div><div class="digit">6</div><div class="digit">7</div><div class="digit">8</div><div class="digit">9</div><div class="digit">.</div></div>' +
            '<div class="digit-cell"><div class="digit">&nbsp;</div><div class="digit">0</div><div class="digit">1</div><div class="digit">2</div><div class="digit">3</div><div class="digit">4</div><div class="digit">5</div><div class="digit">6</div><div class="digit">7</div><div class="digit">8</div><div class="digit">9</div><div class="digit">.</div></div>' +
            '<div class="digit-cell"><div class="digit">&nbsp;</div><div class="digit">0</div><div class="digit">1</div><div class="digit">2</div><div class="digit">3</div><div class="digit">4</div><div class="digit">5</div><div class="digit">6</div><div class="digit">7</div><div class="digit">8</div><div class="digit">9</div><div class="digit">.</div></div>' +
            '<div class="digit-cell"><div class="digit">&nbsp;</div><div class="digit">0</div><div class="digit">1</div><div class="digit">2</div><div class="digit">3</div><div class="digit">4</div><div class="digit">5</div><div class="digit">6</div><div class="digit">7</div><div class="digit">8</div><div class="digit">9</div><div class="digit">.</div></div>' +
            '<div class="digit-cell"><div class="digit">&nbsp;</div><div class="digit">0</div><div class="digit">1</div><div class="digit">2</div><div class="digit">3</div><div class="digit">4</div><div class="digit">5</div><div class="digit">6</div><div class="digit">7</div><div class="digit">8</div><div class="digit">9</div><div class="digit">.</div></div>' +
            '<div class="digit-cell"><div class="digit">&nbsp;</div><div class="digit">0</div><div class="digit">1</div><div class="digit">2</div><div class="digit">3</div><div class="digit">4</div><div class="digit">5</div><div class="digit">6</div><div class="digit">7</div><div class="digit">8</div><div class="digit">9</div><div class="digit">.</div></div>' +
          '</div>' +
          '<div id="currency" class="price-currency">{{ priceCurrency }}</div>' +
        '</div>',
      link: function (scope, elem, attrs) {
        scope.$watch(attrs.output, function (price) {
          changePrice(price, elem);
        });
      }
    };


    //============ methods ================//

    function changePrice(price, elem) {
      var DELAY_PRICE_DIGIT = globalConstants.STEP * 2,
          DIGIT_CELL_HEIGHT = 64,
          priceByDigit,
          digitCells = elem.find('#price').children(),
          MAX_DIGITS = digitCells.length,
          COLUMN_LENGTH = $(digitCells[0]).children().length,
          n = 0,
          $digitCell,
          digit, scrollDigitY,
          i;

      if(price === undefined) {
        return false;
      } else {

        //playSound('price');
        SoundPlayServ.playSound();

        //priceByDigit = price.toString().split('');
        if(typeof price === 'string') {
          priceByDigit = price.split('');
        } else {
          priceByDigit = price.toFixed(2).split('');
        }

      }
      changePrice.revertDigitState = function () {
        $digitCell.animate({ top: 0 }, 'fast');
      };

      changePrice.initDigit = function () {
        digit = priceByDigit.shift();
      };

      changePrice.animateDigit = function () {
        if (digit === '.') {
          scrollDigitY = (COLUMN_LENGTH - 1) * DIGIT_CELL_HEIGHT;
        } else {
          scrollDigitY = (parseInt(digit, 10) + 1) * DIGIT_CELL_HEIGHT;
        }

        $digitCell
          .delay(n * DELAY_PRICE_DIGIT)
          .animate({ top: (-scrollDigitY/16) + "rem" }, 'fast');
      };

      for (i = MAX_DIGITS; i > 0; i--) {
        $digitCell = $(digitCells[n]);

        if (i > priceByDigit.length) {
          changePrice.revertDigitState();
        } else {
          changePrice.initDigit();
          changePrice.animateDigit();
        }

        n++;
      }
    }

// event.srcEvent.stopPropagation();
  }
})();


// directives/show_delay.js

(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('BauVoiceApp')
    .directive('showDelay', showDelayDir);

  function showDelayDir() {

    return {
      scope: {
        showDelay: '@'
      },
      link: function (scope, elem, attrs) {
        attrs.$observe('showDelay', function () {
          showElementWithDelay();
        });

        function showElementWithDelay() {
          var unvisibleClass = 'unvisible';

          setTimeout(function () {
            elem.removeClass(unvisibleClass);
          }, scope.showDelay*1);
        }
      }
    };

  }
})();


// directives/svg_points.js


// (function(){
//   'use strict';
//     /**@ngInject*/

//   angular
//     .module('BauVoiceApp')
//     .directive('svgTemplatePoints', svgTemplatePoints);

//   function svgTemplatePoints(DesignStor, ProductStor) {
//   	var pixell = 0.265;
//   	var Kx= (900*0.265);
//   	var Ky= 100;

//   return {
//       restrict: 'E',
//       replace: true,
//       transclude: true,
//       scope: {
//         template: '=',
//       },
//       link: function (scope, elem, attrs) {

//         scope.$watch('template', function () {
//           templatePoints(scope.template);
//         });

//         function templatePoints(template) {
//         	 var container = document.createElement('div'), mainPointsSVG;
// 			if(template && !$.isEmptyObject(template)) {
// 				console.info('2222-', template);
// 				var blockQty = template.details.length,
// 	        	path = '';
// 				if(ProductStor.product.construction_type == 1 || ProductStor.product.construction_type == 3 ) {
// 	        	  while(--blockQty > 0) {
// 	        	   if (template.details[blockQty].level === 1) {
// 	        	  	console.info('333333-', template.details[blockQty].pointsOut);
// 	        	  	var pointsOutQty =  template.details[blockQty].pointsOut.length;
// 	        	  	while(--pointsOutQty > -1) {
// 	        	  		path += (template.details[blockQty].pointsOut[pointsOutQty].x*pixell+Kx);
// 	        	  		if(pointsOutQty == 0) {
// 							path += ' '+(template.details[blockQty].pointsOut[pointsOutQty].y*pixell+Ky);
// 	        	  		} else {
// 							path += ' '+(template.details[blockQty].pointsOut[pointsOutQty].y*pixell+Ky) +',';
// 	        	  		}
						
// 	        	  	}
					
// 				  }
// 	        	}

// 	        	console.info('333333-', path);

// 	        	mainPointsSVG = d3.select(container).append('svg').attr({
// 	              'width': 0,
// 	              'height': 0
// 	            });
// 	            mainPointsSVG.append('defs').append('clipPath')
// 	            .attr('id', 'clipPolygon')
// 	            .append('polygon')
// 	            .attr('points', function() {
// 	            	return path
// 	            } , transform: 'translate(' + position.x + ', ' + position.y + ') scale('+ scale +','+ scale +')'  );

// 	             elem.html(container);
//            }
// 		}


			
//         }
//       }
//     }
//   }
// })();



// directives/svg.js

(function(){
  'use strict';
    /**@ngInject*/
  angular
    .module('BauVoiceApp')
    .directive('svgTemplate', svgTemplateDir);

  function svgTemplateDir(globalConstants, GeneralServ, ProductStor, SVGServ, DesignServ) {

    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      scope: {
        typeConstruction: '@',
        template: '=',
        templateWidth: '=',
        templateHeight: '='
      },
      link: function (scope, elem, attrs) {

        scope.$watch('template', function () {
          buildSVG(scope.template, scope.templateWidth, scope.templateHeight);
        });



        function buildSVG(template, widthSVG, heightSVG) {
          if(template && !$.isEmptyObject(template)) {
            var container = document.createElement('div'),
                lineCreator = d3.svg.line()
                  .x(function(d) { return d.x; })
                  .y(function(d) { return d.y; })
                  .interpolate("linear"),
                padding = 0.7,
                position = {x: 0, y: 0},
                mainSVG, mainGroup, elementsGroup, dimGroup, points, dimMaxMin, scale, blocksQty;

            if(scope.typeConstruction === 'icon'){
              padding = 1;
            } else if(scope.typeConstruction === 'edit') {
              padding = 0.6;
            } else if(scope.typeConstruction === 'MainEdit') {
                padding = 0.6;
              }
            

            mainSVG = d3.select(container).append('svg').attr({
              'width': widthSVG,
              'height': heightSVG
            });

            if(scope.typeConstruction === 'icon') {
              mainSVG.attr('class', 'tamlateIconSVG');
            } else if(scope.typeConstruction === 'setGlass') {
              mainSVG.attr('id', globalConstants.SVG_ID_GLASS);
            } else if(scope.typeConstruction === 'setGrid') {
              mainSVG.attr('id', globalConstants.SVG_ID_GRID);
            } else {
              mainSVG.attr('id', globalConstants.SVG_ID_EDIT);
            }

            points = SVGServ.collectAllPointsOut(template.details);
            dimMaxMin = GeneralServ.getMaxMinCoord(points);

      
            if(scope.typeConstruction === 'MainEdit') {
             scale = SVGServ.setTemplateScaleMAIN(dimMaxMin, widthSVG, heightSVG, padding);
            } else {
             scale = SVGServ.setTemplateScale(dimMaxMin, widthSVG, heightSVG, padding); 
            }


            if(scope.typeConstruction !== 'icon') {
              if (scope.typeConstruction === 'MainEdit') {
              position = SVGServ.setTemplatePositionMAIN(dimMaxMin, widthSVG, heightSVG, scale);
            } else {
              position = SVGServ.setTemplatePosition(dimMaxMin, widthSVG, heightSVG, scale);
            }
            }
            mainGroup = mainSVG.append("g").attr({
              'id': 'main_group',
              'transform': 'translate(' + position.x + ', ' + position.y + ') scale('+ scale +','+ scale +')'
            });


        //===================zoom=====================//


            if (scope.typeConstruction === 'edit' ) {
              mainSVG.call(d3.behavior.zoom()
                .translate([position.x, position.y])
                .scale(scale)
                .scaleExtent([0, 8])
                .on("zoom", zooming));
            } 

        //===================zoom end=====================//

           
            /** Defs */
            if(scope.typeConstruction !== 'icon') {
              var defs = mainGroup.append("defs"),
                  pathHandle = "M4.5,0C2.015,0,0,2.015,0,4.5v6c0,1.56,0.795,2.933,2,3.74V7.5C2,6.119,3.119,5,4.5,5S7,6.119,7,7.5v6.74c1.205-0.807,2-2.18,2-3.74v-6C9,2.015,6.985,0,4.5,0z"+
                    "M7,26.5C7,27.881,5.881,29,4.5,29l0,0C3.119,29,2,27.881,2,26.5v-19C2,6.119,3.119,5,4.5,5l0,0C5.881,5,7,6.119,7,7.5V26.5z";
              /** dimension */
              //----- horizontal marker arrow
              setMarker(defs, 'dimHorL', '-5, -5, 1, 8', -5, -2, 0, 50, 50, 'M 0,0 L -4,-2 L0,-4 z', 'size-line');
              setMarker(defs, 'dimHorR', '-5, -5, 1, 8', -5, -2, 180, 50, 50, 'M 0,0 L -4,-2 L0,-4 z', 'size-line');
              //------- vertical marker arrow
              setMarker(defs, 'dimVertL', '4.2, -1, 8, 9', 5, 2, 90, 100, 60, 'M 0,0 L 4,2 L0,4 z', 'size-line');
              setMarker(defs, 'dimVertR', '4.2, -1, 8, 9', 5, 2, 270, 100, 60, 'M 0,0 L 4,2 L0,4 z', 'size-line');

              setMarker(defs, 'dimArrow', '4.2, -1, 8, 9', 5, 2, 'auto', 100, 60, 'M 0,0 L 4,2 L0,4 z', 'size-line');

              /** handle */
              setMarker(defs, 'handleR', '0 -1 9 32', 4, 23, 90, 29, 49, pathHandle, 'handle-mark');
              setMarker(defs, 'handleL', '0 -1 9 32', 5, 23, 270, 29, 49, pathHandle, 'handle-mark');
              setMarker(defs, 'handleU', '0 -1 9 32', -10, 10, 270, 29, 49, pathHandle, 'handle-mark');
              setMarker(defs, 'handleD', '0 -1 9 32', 20, 10, 270, 29, 49, pathHandle, 'handle-mark');

              /** lamination */
      
                defs.append('pattern')
                  .attr('id', 'laminat')
                  .attr('patternUnits', 'userSpaceOnUse')
                  .attr('width', 600)
                  .attr('height', 400)
                  .append("image")
                  .attr("xlink:href", "img/lamination/"+ProductStor.product.lamination.img_in_id+".jpg")
                  .attr('width', 600)
                  .attr('height', 400);


                defs.append('pattern')
                  .attr('id', 'background')
                  .attr('patternUnits', 'userSpaceOnUse')
                  .attr('width', 4200)
                  .attr('height', 2800)
                  .append("image")
                  .attr("xlink:href", "img/room/fon.jpg")
                  .attr('width', 4200)
                  .attr('height', 2800);

           
                  //  defs.append('mask')
                  // .attr('id', 'masking')
                  // .attr('maskUnits', 'objectBoundingBox')
                  // .attr('fill', 'img/room/2.jpg')
                  // .attr('width', 4200)
                  // .attr('height', 2800)
                  // .append("circle")
                  // .attr('cx', 5)
                  // .attr('cy', 5)
                  // .attr('r', .35)
                  // .attr('fill', 'white');
            }
                  
  

            elementsGroup = mainGroup.append("g").attr({
              'id': 'elem_group'
            });
            dimGroup = mainGroup.append("g").attr({
              'id': 'dim_group'
            });

            blocksQty = template.details.length;
            for (var i = 1; i < blocksQty; i++) {
              elementsGroup.selectAll('path.' + template.details[i].id)
                .data(template.details[i].parts)
                .enter().append('path')
                .attr({
                  'block_id': template.details[i].id,
                  'parent_id': template.details[i].parent,
                  //'class': function(d) { return d.type; },
                  'class': function (d) {
                    if(scope.typeConstruction === 'icon') {
                      return (d.type === 'glass') ? 'glass-icon' : 'frame-icon';
                    } else {
                      if(d.doorstep) {
                        return 'doorstep';
                      } else {
                        return (d.type === 'glass') ? 'glass' : 'frame';
                      }
                    }
                  },
                  'item_type': function (d) {
                    return d.type;
                  },
                  'item_dir': function (d) {
                    return d.dir;
                  },
                  'item_id': function(d) {
                    return d.points[0].id;
                  },
                  'd': function (d) {
                    return d.path;
                  },
                  'fill': function(d) {
                    if(ProductStor.product.lamination.img_in_id > 1) {
                      return (d.type !== 'glass') ? 'url(#laminat)' : '';
                    } else {
                      return '#f9f9f9';
                    }
                  }
                });


              if(scope.typeConstruction !== 'icon') {
                //----- sash open direction
                if (template.details[i].sashOpenDir) {
                  elementsGroup.selectAll('path.sash_mark.' + template.details[i].id)
                    .data(template.details[i].sashOpenDir)
                    .enter()
                    .append('path')
                    .classed('sash_mark', true)
                    .attr({
                      'd': function (d) {
                            return lineCreator(d.points);
                          },
                      'marker-mid': function(d) {
                        var dirQty = template.details[i].sashOpenDir.length;
                        if(template.details[i].handlePos) {
                          if (dirQty === 1) {
                            if (template.details[i].handlePos === 2) {
                              return 'url(#handleR)';
                            } else if (template.details[i].handlePos === 1) {
                              return 'url(#handleU)';
                            } else if (template.details[i].handlePos === 4) {
                              return 'url(#handleL)';
                            } else if (template.details[i].handlePos === 3) {
                              return 'url(#handleD)';
                            }
                          } else if (dirQty === 2) {
                            if (d.points[1].fi < 45 || d.points[1].fi > 315) {
                              return 'url(#handleR)';
                            } else if (d.points[1].fi > 135 && d.points[1].fi < 225) {
                              return 'url(#handleL)';
                            }
                          }
                        }
                      }
                    });
                }


                //---- corner markers
                if(scope.typeConstruction === 'edit' || scope.typeConstruction === 'MainEdit') {
                  if (template.details[i].level === 1) {
              
                    //----- create array of frame points with corner = true
                    var corners = template.details[i].pointsOut.filter(function (item) {
                      return item.corner > 0;
                    });
                    elementsGroup.selectAll('circle.corner_mark.' + template.details[i].id)
                      .data(corners)
                      .enter()
                      .append('circle')
                      .attr({
                        'block_id': template.details[i].id,
                        'class': 'corner_mark',
                        'parent_id': function (d) {
                          return d.id;
                        },
                        'cx': function (d) {
                          return d.x;
                        },
                        'cy': function (d) {
                          return d.y;
                        },
                        'r': 0
                      });
                  }
                }

                /** type Glass names */
                if (scope.typeConstruction === 'setGlass') {
                  if(!template.details[i].children.length) {
                    elementsGroup.append('text')
                      .text(template.details[i].glassTxt)
                      .attr({
                        'class': 'glass-txt',
                        'x': template.details[i].center.x,
                        'y': template.details[i].center.y
                      });
                  }
                }

                /** type Grid names */
                if (scope.typeConstruction === 'setGrid') {
                  if(!template.details[i].children.length && template.details[i].gridId) {
                    elementsGroup.append('text')
                      .text(template.details[i].gridTxt)
                      .attr({
                        'class': 'glass-txt',
                        'x': template.details[i].center.x,
                        'y': template.details[i].center.y
                      });
                  }
                }

              }

            }


        
           var blockQty = template.details.length,
                path = '';
                while(--blockQty > 0) {
                   if (template.details[blockQty].level === 1) {
                console.info('333333-', template.details[blockQty].pointsOut);
                var pointsOutQty =  template.details[blockQty].pointsOut.length;
                while(--pointsOutQty > -1) {
                  path += (template.details[blockQty].pointsOut[pointsOutQty].x);
                   if(pointsOutQty == 0) {
              path += ' '+(template.details[blockQty].pointsOut[pointsOutQty].y);
                } else {
              path += ' '+(template.details[blockQty].pointsOut[pointsOutQty].y) +',';
                  }
                }
              }
            }
          
           if(scope.typeConstruction !== 'icon') {
               mainGroup.append('g').append("polygon")
              .attr({
                'id' : 'clipPolygon',
                'points' : path,
              'transform': 'translate(' + position.x + ', ' + position.y + ') scale('+ (scale/100)*500 +','+ (scale/100)*500 +')'
            });

          }
       




            if(scope.typeConstruction !== 'icon') {
              //--------- dimension
              var dimXQty = template.dimension.dimX.length,
                  dimYQty = template.dimension.dimY.length,
                  dimQQty = template.dimension.dimQ.length;
              for (var dx = 0; dx < dimXQty; dx++) {
                createDimension(0, template.dimension.dimX[dx], dimGroup, lineCreator);
              }
              for (var dy = 0; dy < dimYQty; dy++) {
                createDimension(1, template.dimension.dimY[dy], dimGroup, lineCreator);
              }
              for (var dq = 0; dq < dimQQty; dq++) {
                createRadiusDimension(template.dimension.dimQ[dq], dimGroup, lineCreator);
              }
            }

            elem.html(container);

            //======= set Events on elements
            DesignServ.removeAllEventsInSVG();
            //--------- set clicking to all elements
            if (scope.typeConstruction === 'edit' || scope.typeConstruction === 'MainEdit') {
              DesignServ.initAllImposts();
              DesignServ.initAllGlass();
              DesignServ.initAllArcs();
              DesignServ.initAllDimension();
            }
          }
        }


        function zooming() {
          d3.select('#main_group').attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        }


        function setMarker(defs, id, view, refX, refY, angel, w, h, path, classMarker) {
          defs.append("marker")
            .classed(classMarker, true)
            .attr({
              'id': id,
              'viewBox': view,
              'refX': refX,
              'refY': refY,
              'markerWidth': w,
              'markerHeight': h,
              'orient': angel
            })
            .append("path")
            .attr("d", path);
        }


        function createDimension(dir, dim, dimGroup, lineCreator) {
          if (scope.typeConstruction === !'MainEdit') {
          var dimLineHeight = -150,
              dimEdger = 50,
              dimMarginBottom = -20,
              sizeBoxWidth = 160,
              sizeBoxHeight = 70,
              sizeBoxRadius = 20,
              lineSideL = [],
              lineSideR = [],
              lineCenter = [],
              dimBlock, sizeBox,
              pointL1 = {
                x: (dir) ? dimMarginBottom : dim.from,
                y: (dir) ? dim.from : dimMarginBottom
              },
              pointL2 = {
                x: (dir) ? dimLineHeight : dim.from,
                y: (dir) ? dim.from : dimLineHeight
              },
              pointR1 = {
                x: (dir) ? dimMarginBottom : dim.to,
                y: (dir) ? dim.to : dimMarginBottom
              },
              pointR2 = {
                x: (dir) ? dimLineHeight : dim.to,
                y: (dir) ? dim.to : dimLineHeight
              },
              pointC1 = {
                x: (dir) ? dimLineHeight + dimEdger : dim.from,
                y: (dir) ? dim.from : dimLineHeight + dimEdger
              },
              pointC2 = {
                x: (dir) ? dimLineHeight + dimEdger : dim.to,
                y: (dir) ? dim.to : dimLineHeight + dimEdger
              };
          lineSideL.push(pointL1, pointL2);
          lineSideR.push(pointR1, pointR2);
          lineCenter.push(pointC1, pointC2);

          dimBlock = dimGroup.append('g')
           .attr({
             'class': function() {
               if(dir) {
                 return (dim.level) ? 'dim_blockY' : 'dim_block dim_hidden';
               } else {
                 return (dim.level) ? 'dim_blockX' : 'dim_block dim_hidden';
               }
             },
             'block_id': dim.blockId,
             'axis': dim.axis
           });

          dimBlock.append('path')
           .classed('size-line', true)
           .attr('d', lineCreator(lineSideR));
          dimBlock.append('path')
           .classed('size-line', true)
           .attr('d', lineCreator(lineSideL));

          dimBlock.append('path')
           .classed('size-line', true)
           .attr({
             'd': lineCreator(lineCenter),
             'marker-start': function() { return (dir) ? 'url(#dimVertR)' : 'url(#dimHorL)'; },
             'marker-end': function() { return (dir) ? 'url(#dimVertL)' : 'url(#dimHorR)'; }
           });

          sizeBox = dimBlock.append('g')
           .classed('size-box', true);

          if(scope.typeConstruction === 'edit' || scope.typeConstruction === 'MainEdit') {
            sizeBox.append('rect')
             .classed('size-rect', true)
             .attr({
               'x': function() { return (dir) ? (dimLineHeight - sizeBoxWidth*0.8) : (dim.from + dim.to - sizeBoxWidth)/2; },
               'y': function() { return (dir) ? (dim.from + dim.to - sizeBoxHeight)/2 : (dimLineHeight - sizeBoxHeight*0.8); },
               'rx': sizeBoxRadius,
               'ry': sizeBoxRadius
             });
          }


          sizeBox.append('text')
           .text(dim.text)
           .attr({
             'class': function() { return (scope.typeConstruction === 'edit' || scope.typeConstruction === 'MainEdit' ) ? 'size-txt-edit' : 'size-txt'; },
             'x': function() { return (dir) ? (dimLineHeight - sizeBoxWidth*0.8) : (dim.from + dim.to - sizeBoxWidth)/2; },
             'y': function() { return (dir) ? (dim.from + dim.to - sizeBoxHeight)/2 : (dimLineHeight - sizeBoxHeight*0.8); },
             'dx': 80,
             'dy': 40,
             'type': 'line',
             'block_id': dim.blockId,
             'size_val': dim.text,
             'min_val': dim.minLimit,
             'max_val': dim.maxLimit,
             'dim_id': dim.dimId,
             'from_point': dim.from,
             'to_point': dim.to,
             'axis': dim.axis
           });

        }
}

        function createRadiusDimension(dimQ, dimGroup, lineCreator) {

          var radiusLine = [],
              sizeBoxRadius = 20,
              startPR = {
                x: dimQ.startX,
                y: dimQ.startY
              },
              endPR = {
                x: dimQ.midleX,
                y: dimQ.midleY
              },
              dimBlock, sizeBox;

          radiusLine.push(endPR, startPR);

          dimBlock = dimGroup.append('g')
            .attr({
              'class': 'dim_block_radius',
              'block_id': dimQ.blockId
            });

          dimBlock.append('path')
            .classed('size-line', true)
            .attr({
              'd': lineCreator(radiusLine),
              'style': 'stroke: #000;',
              'marker-end': 'url(#dimArrow)'
            });

          sizeBox = dimBlock.append('g')
            .classed('size-box', true);

          if(scope.typeConstruction === 'edit' || scope.typeConstruction === 'MainEdit') {
            sizeBox.append('rect')
              .classed('size-rect', true)
              .attr({
                'x': dimQ.midleX,
                'y': dimQ.midleY,
                'rx': sizeBoxRadius,
                'ry': sizeBoxRadius
              });
          }


          sizeBox.append('text')
            .text(dimQ.radius)
            .attr({
              'class': 'size-txt-edit',
              'x': dimQ.midleX,
              'y': dimQ.midleY,
              'dx': 80,
              'dy': 40,
              'type': 'curve',
              'block_id': dimQ.blockId,
              'size_val': dimQ.radius,
              'min_val': dimQ.radiusMax,
              'max_val': dimQ.radiusMin,
              'dim_id': dimQ.id,
              'chord': dimQ.lengthChord
            });

        }

      }
    };

  }
})();


// directives/typing.js

(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('BauVoiceApp')
    .directive('typing', typingDir);

  function typingDir() {

    return {
      scope: {
        output: '@',
        typingDelay: '@'
      },
      link: function (scope, elem, attrs) {
        attrs.$observe('typing', function (mode) {
          if (mode.toString() === 'on') {
            typingTextWithDelay();
          }
        });
        attrs.$observe('output', function () {
            typingTextWithDelay();
        });

        function typingTextWithDelay() {
          setTimeout(function () {
            var source = scope.output,
                text = '',
                NEXT_CHAR_DELAY = 15,
                timerId,
                hasChar;

            timerId = setInterval(function () {
              hasChar = text.length < source.length;

              if (hasChar) {
                text += source[text.length];
              } else {
                clearInterval(timerId);
              }
              elem.text(text);
            }, NEXT_CHAR_DELAY);
          }, scope.typingDelay*1);
        }
      }
    };


  }
})();


// nuancespeechkit.js


var NuanceSpeechKitPlugin = function() {
};

// **Initialize speech kit**
//
// `credentialClassName`  The class name to be loaded to retrieve the app id and key  
// `serverName`  The hostname of the server to connect to  
// `port`  The port number for connection  
// `sslEnabled`  True if SSL is enabled for the connection  
// `successCallback`  The callback function for success  
// `failureCallback`  The callback function for error  
NuanceSpeechKitPlugin.prototype.initialize = function(credentialClassName,
                                                      serverName, port, sslEnabled,
                                                      successCallback, failureCallback) {
    return Cordova.exec( successCallback,
                         failureCallback,
                         "PhoneGapSpeechPlugin",
                         "initSpeechKit",
                         [credentialClassName, serverName, port, sslEnabled]);
};

// **Clean up speech kit**
//
// `successCallback` The callback function for success  
// `failureCallback` The callback function for error  
NuanceSpeechKitPlugin.prototype.cleanup = function(successCallback, failureCallback) {
    return Cordova.exec(successCallback,
                         failureCallback,
                         "PhoneGapSpeechPlugin",
                         "cleanupSpeechKit",
                         []);
};

// **Starts speech recognition**
//
// `recoType`  Type of recognition (dictation or websearch)  
// `language`  Language code for recognition  
// `successCallback`  The callback function for success  
// `failureCallback`  The callback function for error  
NuanceSpeechKitPlugin.prototype.startRecognition = function(recoType, language,
                                                            successCallback, failureCallback) {
    return Cordova.exec(successCallback,
                         failureCallback,
                         "PhoneGapSpeechPlugin",
                         "startRecognition",
                         [recoType, language]);
};

// **Stops speech recognition**
//
// `successCallback`  The callback function for success  
// `failureCallback`  The callback function for error  
NuanceSpeechKitPlugin.prototype.stopRecognition = function(successCallback, failureCallback) {
    return Cordova.exec(successCallback,
                         failureCallback,
                         "PhoneGapSpeechPlugin",
                         "stopRecognition",
                         []);
};

// **Gets the last set of results from speech recognition**
//
// `successCallback` The callback function for success  
// `failureCallback` The callback function for error  
NuanceSpeechKitPlugin.prototype.getResults = function(successCallback, failureCallback) {
    return Cordova.exec(successCallback,
                         failureCallback,
                         "PhoneGapSpeechPlugin",
                         "getRecoResult",
                         []);
};

// **Plays text using text to speech**
//
// `text` The text to play  
// `language` Language code for TTS playback  
// `voice` The voice to be used for TTS playback  
// `successCallback`  The callback function for success  
// `failureCallback`  The callback function for error  
NuanceSpeechKitPlugin.prototype.playTTS = function(text, language, voice,
                                                   successCallback, failureCallback) {
    return Cordova.exec(successCallback,
                         failureCallback,
                         "PhoneGapSpeechPlugin",
                         "startTTS",
                         [text, language, voice]);
};

// **Stops text to speech playback**
//
// `text` The text to play  
// `language` Language code for TTS playback  
// `voice` The voice to be used for TTS playback  
// `successCallback`  The callback function for success  
// `failureCallback`  The callback function for error  
NuanceSpeechKitPlugin.prototype.stopTTS = function(successCallback, failureCallback) {
    return Cordova.exec(successCallback,
                         failureCallback,
                         "PhoneGapSpeechPlugin",
                         "stopTTS",
                         []);
};


	


// parser.js


/*APP.factory('FactoryName', function () {
            return {
            functionName: function () {}
            };
            });

*/


function parseStringToDimension(value) {
    value = value.toLowerCase();
    var array = value.split(" ");
    array = updateDigits(array);
    array = updateFirstTwoToM(array);
    array = updateCM(array);
    array = updateMs(array);
    array = updateM(array);
    array = updateMM(array);
    value = summAll(array);
    return value;
}


//helpers


function updateDigits(array) {
  for (var i =0; i < array.length; i++) {
		if (array[i] === "ноль") {
			array[i] = "0";
		}
        if (array[i] === "раз") {
            array[i] = "1";
        }
        if (array[i] === "один") {
            array[i] = "1";
        }
		if (array[i] === "два") {
			array[i] = "2";
		}
		if (array[i] === "три") {
			array[i] = "3";
		}
		if (array[i] === "четыре") {
			array[i] = "4";
		}
		if (array[i] === "пять") {
			array[i] = "5";
		}
		if (array[i] === "шесть") {
			array[i] = "6";
		}
		if (array[i] === "семь") {
			array[i] = "7";
		}
		if (array[i] === "восемь") {
			array[i] = "8";
		}
		if (array[i] === "девять") {
			array[i] = "9";
		}
	}
	return array;
}

function updateCM(array) {
	for (var i =0; i < array.length; i++) {
        if (array[i] === "и") {
            array[i] = "см";
        }

        
		if ((i > 0) && (array[i] === "см") && (isNumber(array[i - 1]))) {
			array[i - 1] = parseInt(array[i - 1], 10) * 10;
			array.splice(i, 1);
		}
	}
	return array;
}

function updateMM(array) {
	for (var i =0; i < array.length; i++) {
		if ((i > 0) && (array[i] === "мм") && (isNumber(array[i - 1]))) {
			array.splice(i, 1);
		}
	}
	return array;
}

function updateMs(array) {
	for (var i =0; i < array.length; i++) {
		if (array[i] === "метр" || array[0] === "1м" || array[i] === "тыща" 
			|| array[i] === "тысяча") {
			array[i] = "м";
		}
	}
	return array;
}

function updateM(array) {
	for (var i =1; i < array.length; i++) {
		if ((array[i] === "м") && (isNumber(array[i - 1]))) {
			array[i - 1] = "" + parseInt(array[i - 1], 10) * 1000;
			array = upadtePostM(array, i);
			array.splice(i, 1);
		}
	}
	if (array[0] === "м") {
		array[0] = "1000";
		array = upadtePostM(array, 0);
	}

	return array;
}

function updateFirstTwoToM(array) {
	if (array.length == 2) {
		if ((isNumber(array[0])) && (isNumber(array[1]))) {
			array[2] = array[1];
			array[1] = "м";
			//array[0] = "" + parseInt(array[0]) * 1000;
			
			if (parseInt(array[2], 10) < 100) {
				array[3] = "см";
			} else {
				array[3] = "мм";
			}
		}
	}
	return array;
}

function upadtePostM(array, i) {
	if (i === array.length - 2) {
		if ((isNumber(array[i + 1])) && (parseInt(array[i + 1], 10) < 100)) {
			array[i + 1] = "" + parseInt(array[i + 1], 10) * 10;
		}
	} else if (i < array.length - 1) {
		if ((isNumber(array[i + 1])) && (parseInt(array[i + 1], 10) < 100) && (isNumber(array[i + 2]))) {
			array[i + 1] = "" + parseInt(array[i + 1], 10) * 10;
		}		
	}
	return array;
}
/*
function updateHalf(array) {
	for (var i =1; i < array.length - 2; i++) {
		if ((array[i] === "с") && (array[i + 1] === "половиной")) {
			array[i - 1] = "" + parseFloat(array[i -1]) + 0.5; 
			array.splice(i, 2);
		}
	}
	return array;
}

*/

function summAll(array) {
	var ret = 0;
	for (var i =0; i < array.length; i++) {
		ret += parseInt(array[i], 10);
	}
	return "" + ret;
}



String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};


function isNumber(str) {
   return  ("" + parseInt(str, 10) === str);
}



// result.js

/* exported OkResult, ErrorResult */

"use strict";

function OkResult(data) {
  this.status = true;
  this.data = data;
}

function ErrorResult(code, message) {
  this.status = false;
  this.code = code;
  this.message = message;

  console.error(this.code, this.message);
}


// services/addelem_menu_serv.js

(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .factory('AddElementMenuServ', addElemMenuFactory);

  function addElemMenuFactory(
    $q,
    $timeout,
    GlobalStor,
    OrderStor,
    ProductStor,
    CartStor,
    AuxStor,
    DesignStor,
    UserStor,
    localDB,
    GeneralServ,
    MainServ,
    SVGServ,
    DesignServ,
    AnalyticsServ,
    CartServ,
    CartMenuServ
  ) {

    var thisFactory = this;

    thisFactory.publicObj = {
      closeAddElementsMenu: closeAddElementsMenu,
      chooseAddElement: chooseAddElement,
      chooseAddElementList: chooseAddElementList,
      getAddElementPrice: getAddElementPrice,
      deleteAddElement: deleteAddElement,
      deleteAllAddElements: deleteAllAddElements,
      finishCalculators: finishCalculators,

      //---- grid
      confirmGrid: confirmGrid,
      setGridToAll: setGridToAll,
      closeGridSelectorDialog: closeGridSelectorDialog,

      //---- calculators:
      pressCulculator: pressCulculator,
      setValueQty: setValueQty,
      closeQtyCaclulator: closeQtyCaclulator,
      setValueSize: setValueSize,
      deleteLastNumber: deleteLastNumber,
      changeElementSize: changeElementSize,
      closeSizeCaclulator: closeSizeCaclulator
    };

    return thisFactory.publicObj;




    //============ methods ================//

    //-------- Close AddElements Menu
    function closeAddElementsMenu() {
      if(GlobalStor.global.isQtyCalculator || GlobalStor.global.isSizeCalculator) {
        /** calc Price previous parameter and close caclulators */
        finishCalculators();
      }
      AuxStor.aux.isFocusedAddElement = 0;
      AuxStor.aux.isTabFrame = 0;
      AuxStor.aux.isGridSelectorDialog = 0;
      AuxStor.aux.selectedGrid = 0;
      AuxStor.aux.showAddElementsMenu = 0;
      AuxStor.aux.isAddElement = 0;
      //playSound('swip');
    }


    function desactiveAddElementParameters() {
      AuxStor.aux.auxParameter = 0;
      GlobalStor.global.isQtyCalculator = 0;
      GlobalStor.global.isSizeCalculator = 0;
      GlobalStor.global.isWidthCalculator = 0;
    }



    //--------- Select AddElement
    function chooseAddElement(typeIndex, elementIndex) {
      if(GlobalStor.global.isQtyCalculator || GlobalStor.global.isSizeCalculator) {
        /** calc Price previous parameter and close caclulators */
        finishCalculators();
      }
      if (typeIndex === undefined && elementIndex === undefined) {
        /**------- if all grids deleting --------*/
        if(AuxStor.aux.isFocusedAddElement === 1) {
          deleteGridsInTemplate();
        }
        var index = (AuxStor.aux.isFocusedAddElement - 1);
        AuxStor.aux.isAddElement = 0;
        //-------- clean all elements in selected Type
        ProductStor.product.chosenAddElements[index].length = 0;

        //-------- Set Total Product Price
        setAddElementsTotalPrice(ProductStor.product);

      } else {
        getAddElementPrice(typeIndex, elementIndex).then(function (addElem) {
          pushSelectedAddElement(ProductStor.product, addElem);
          //Set Total Product Price
          setAddElementsTotalPrice(ProductStor.product);

          //------ save analytics data
          //TODO ??? AnalyticsServ.saveAnalyticDB(UserStor.userInfo.id, OrderStor.order.id, ProductStor.product.profile.id, addElem.id, typeIndex);
        });
      }
    }


    //--------- Select AddElement List
    function chooseAddElementList(typeIndex, elementIndex) {
      /** in main page */
      if(GlobalStor.global.currOpenPage === 'main') {

        /** if grid,  show grid selector dialog */
        if(AuxStor.aux.isFocusedAddElement === 1) {
          if(ProductStor.product.is_addelem_only) {
            /** without window */
            pushSelectedAddElement(ProductStor.product, AuxStor.aux.addElementsList[typeIndex][elementIndex]);
            //---------- Set Total Product Price
            setAddElementsTotalPrice(ProductStor.product);
          } else {
            //------- show Grid Selector Dialog
            AuxStor.aux.selectedGrid = [typeIndex, elementIndex];
            AuxStor.aux.isGridSelectorDialog = 1;
            DesignServ.initAllGlassXGrid();
          }
        } else {
          pushSelectedAddElement(ProductStor.product, AuxStor.aux.addElementsList[typeIndex][elementIndex]);
          //---------- Set Total Product Price
          setAddElementsTotalPrice(ProductStor.product);
        }

      } else if(GlobalStor.global.currOpenPage === 'cart') {
        /** in cart page */
        var productsQty = CartStor.cart.selectedProducts.length;
        for(var p = 0; p < productsQty; p++) {
          if(CartStor.cart.selectedProducts[p].length) {
            pushSelectedAddElement(OrderStor.order.products[p], AuxStor.aux.addElementsList[typeIndex][elementIndex]);
            //Set Total Product Price
            CartServ.calculateAddElemsProductsPrice(1);
            CartMenuServ.joinAllAddElements();
            CartServ.collectAllAddElems();
            CartServ.getAddElemsPriceTotal();
            //------ change order Price
            CartMenuServ.calculateOrderPrice();
          }
        }
      }
      //----- hide element price in menu
      AuxStor.aux.currAddElementPrice = 0;
      //------ save analytics data
      //TODO ??? AnalyticsServ.saveAnalyticDB(UserStor.userInfo.id, OrderStor.order.id, ProductStor.product.profile.id, AuxStor.aux.addElementsList[typeIndex][elementIndex].id, typeIndex);
      AuxStor.aux.isAddElement = 0;
    }


    function getAddElementPrice(typeIndex, elementIndex) {
      var deferred = $q.defer();
      AuxStor.aux.isAddElement = typeIndex+'-'+elementIndex;
      //------- checking if add element is not grid and has price
      //if(AuxStor.aux.isFocusedAddElement > 1 && AuxStor.aux.addElementsList[typeIndex][elementIndex].element_price > 0) {
      //  AuxStor.aux.currAddElementPrice = GeneralServ.setPriceDis(AuxStor.aux.addElementsList[typeIndex][elementIndex].element_price, OrderStor.order.discount_addelem);
      //  AuxStor.aux.addElementsList[typeIndex][elementIndex].elementPriceDis = angular.copy(AuxStor.aux.currAddElementPrice);
      //
      //  deferred.resolve(angular.copy(AuxStor.aux.addElementsList[typeIndex][elementIndex]));
      //} else {
        calcAddElemPrice(typeIndex, elementIndex, AuxStor.aux.addElementsList).then(function() {
          deferred.resolve(angular.copy(AuxStor.aux.addElementsList[typeIndex][elementIndex]));
        });
      //}
      return deferred.promise;
    }



    function pushSelectedAddElement(currProduct, currElement) {
      var index = (AuxStor.aux.isFocusedAddElement - 1),
          existedElement;

      existedElement = checkExistedSelectAddElement(currProduct.chosenAddElements[index], currElement);
      if(!existedElement) {
        var newElementSource = {
              element_type: index,
              element_width: 0,
              element_height: 0,
              block_id: 0
            },
            newElement = angular.extend(newElementSource, currElement);

        currProduct.chosenAddElements[index].push(newElement);
        //---- open TABFrame when second element selected
        if(currProduct.chosenAddElements[index].length === 2) {
          AuxStor.aux.isTabFrame = 1;
        }
      }
    }


    //--------- when we select new addElement, function checks is there this addElements in order to increase only elementQty
    function checkExistedSelectAddElement(elementsArr, currElement) {
      var elementsQty = elementsArr.length, isExist = 0;
      while(--elementsQty > -1){
        if(elementsArr[elementsQty].id === currElement.id) {
          /** if element has width and height */
          if(currElement.element_width && currElement.element_height) {
            if(elementsArr[elementsQty].element_width === currElement.element_width) {
              if(elementsArr[elementsQty].element_height === currElement.element_height) {
                isExist++;
              }
            }
          }
          /** if element has only width */
          if(currElement.element_width && !currElement.element_height) {
            if(elementsArr[elementsQty].element_width === currElement.element_width) {
              isExist++;
            }
          }
          /** if element has only qty */
          if(!currElement.element_width && !currElement.element_height) {
            isExist++;
          }

          /** increase quantity if exist */
          if(isExist) {
            elementsArr[elementsQty].element_qty += 1;
            break;
          }
        }

      }
      return isExist;
    }


    function setAddElementsTotalPrice(currProduct) {
      var elemTypeQty = currProduct.chosenAddElements.length;
      currProduct.addelem_price = 0;
      currProduct.addelemPriceDis = 0;
      while(--elemTypeQty > -1) {
        var elemQty = currProduct.chosenAddElements[elemTypeQty].length;
        if (elemQty > 0) {
          while(--elemQty > -1) {
            currProduct.addelem_price += (currProduct.chosenAddElements[elemTypeQty][elemQty].element_qty * currProduct.chosenAddElements[elemTypeQty][elemQty].element_price);
          }
        }
      }
      currProduct.addelem_price = GeneralServ.roundingValue(currProduct.addelem_price);
      currProduct.addelemPriceDis = GeneralServ.setPriceDis(currProduct.addelem_price, OrderStor.order.discount_addelem);
      $timeout(function() {
        MainServ.setProductPriceTOTAL(currProduct);
      }, 50);
    }



    //-------- Delete AddElement from global object
    function deleteAddElement(typeId, elementId) {
      if(GlobalStor.global.isQtyCalculator || GlobalStor.global.isSizeCalculator) {
        /** calc Price previous parameter and close caclulators */
        finishCalculators();
      }
      /**------- if grid delete --------*/
      if(AuxStor.aux.isFocusedAddElement === 1) {
        deleteGridsInTemplate(ProductStor.product.chosenAddElements[typeId][elementId].block_id);
      }
      ProductStor.product.chosenAddElements[typeId].splice(elementId, 1);
      //------ Set Total Product Price
      setAddElementsTotalPrice(ProductStor.product);
    }


    //--------- Delete All List of selected AddElements
    function deleteAllAddElements() {
      var elementsQty = ProductStor.product.chosenAddElements.length, i = 0;
      for(; i < elementsQty; i++) {
        /**------- check grids -----*/
        if(!i) {
          if(ProductStor.product.chosenAddElements[i].length) {
            deleteGridsInTemplate();
          }
        }
        ProductStor.product.chosenAddElements[i].length = 0;
      }
      ProductStor.product.addelem_price = 0;
      ProductStor.product.addelemPriceDis = 0;
      //------ Set Total Product Price
      setAddElementsTotalPrice(ProductStor.product);
      //------ close AddElements Menu
      closeAddElementsMenu();
    }



    /** =========== GRID ========== */


    /** set Selected Grids */
    function confirmGrid() {
      if(DesignStor.design.selectedGlass.length) {
        var grids = DesignStor.design.selectedGlass.map(function(item) {
          var blockId = item.attributes.block_id.nodeValue;
          //------- collect grids relative to blocks
          return collectGridsAsBlock(blockId, AuxStor.aux.selectedGrid)[0];
        });
        insertGrids(grids);
      }
    }



    /** set Grids for all Sashes */
    function setGridToAll() {
      var grids = collectGridsAsBlock(0, AuxStor.aux.selectedGrid);
      insertGrids(grids);
    }



    function collectGridsAsBlock(blockId, gridIndex) {
      var blocksQty = ProductStor.product.template_source.details.length,
          gridElements = [];
      while(--blocksQty > 0) {
        if(blockId) {
          /** set grid to template block by its Id */
          if(ProductStor.product.template_source.details[blocksQty].id === blockId) {
            /** check block to old grid
             * delete in product.choosenAddElements if exist
             * */
            deleteOldGridInList(blocksQty);
            gridElements.push(setCurrGridToBlock(blockId, blocksQty, gridIndex));
            break;
          }
        } else {
          /** set grid to all template blocks */
          if(ProductStor.product.template_source.details[blocksQty].blockType === 'sash') {
            deleteOldGridInList(blocksQty);
            gridElements.push(setCurrGridToBlock(ProductStor.product.template_source.details[blocksQty].id, blocksQty, gridIndex));
          }
        }
      }
      return gridElements;
    }



    function deleteOldGridInList(blockIndex) {
      if(ProductStor.product.template_source.details[blockIndex].gridId) {
        var chosenGridsQty = ProductStor.product.chosenAddElements[0].length;
        while(--chosenGridsQty > -1) {
          if(ProductStor.product.chosenAddElements[0][chosenGridsQty].block_id === ProductStor.product.template_source.details[blockIndex].id) {
            if (ProductStor.product.chosenAddElements[0][chosenGridsQty].element_qty === 1) {
              ProductStor.product.chosenAddElements[0].splice(chosenGridsQty, 1);
            } else if (ProductStor.product.chosenAddElements[0][chosenGridsQty].element_qty > 1) {
              ProductStor.product.chosenAddElements[0][chosenGridsQty].element_qty -= 1;
            }
          }
        }
      }
    }



    function setCurrGridToBlock(blockId, blockIndex, gridIndex) {
      var sizeGridX = ProductStor.product.template.details[blockIndex].pointsIn.map(function(item) {
            return item.x;
          }),
          sizeGridY = ProductStor.product.template.details[blockIndex].pointsIn.map(function(item) {
            return item.y;
          }), gridTemp;
      //------- insert grid in block
      ProductStor.product.template_source.details[blockIndex].gridId = AuxStor.aux.addElementsList[gridIndex[0]][gridIndex[1]].id;
      ProductStor.product.template_source.details[blockIndex].gridTxt = AuxStor.aux.addElementsList[gridIndex[0]][gridIndex[1]].name;
      //-------- add sizes in grid object
      gridTemp = angular.copy(AuxStor.aux.addElementsList[gridIndex[0]][gridIndex[1]]);
      gridTemp.element_width = (d3.max(sizeGridX) - d3.min(sizeGridX));
      gridTemp.element_height = (d3.max(sizeGridY) - d3.min(sizeGridY));
      gridTemp.block_id = blockId;
      return gridTemp;
    }





    function insertGrids(grids) {
      DesignServ.getGridPrice(grids).then(function(data) {
        var dataQty = data.length;
        AuxStor.aux.currAddElementPrice = 0;
        if(dataQty) {
          while(--dataQty > -1) {
            pushSelectedAddElement(ProductStor.product, data[dataQty]);
            AuxStor.aux.currAddElementPrice += data[dataQty].elementPriceDis;
          }
          AuxStor.aux.currAddElementPrice = GeneralServ.roundingValue(AuxStor.aux.currAddElementPrice);
          //------ show element price
          AuxStor.aux.isAddElement = AuxStor.aux.selectedGrid[0]+'-'+AuxStor.aux.selectedGrid[1];
          //------ Set Total Product Price
          setAddElementsTotalPrice(ProductStor.product);
          //------ change SVG
          changeSVGTemplateAsNewGrid();
          //------ close Grid Dialog
          closeGridSelectorDialog();
        }
      });
    }



    function changeSVGTemplateAsNewGrid () {
      SVGServ.createSVGTemplate(ProductStor.product.template_source, ProductStor.product.profileDepths).then(function(result) {
        ProductStor.product.template = angular.copy(result);
        //------ save analytics data
        //TODO ?? AnalyticsServ.saveAnalyticDB(UserStor.userInfo.id, OrderStor.order.id, ProductStor.product.template_id, newId, 2);
      });
    }




    function closeGridSelectorDialog() {
      DesignServ.removeGlassEventsInSVG();
      DesignStor.design.selectedGlass.length = 0;
      AuxStor.aux.selectedGrid = 0;
      AuxStor.aux.isGridSelectorDialog = !AuxStor.aux.isGridSelectorDialog;
    }



    function deleteGridsInTemplate(blockID) {
      var blocksQty = ProductStor.product.template_source.details.length;
      while(--blocksQty > 0) {
        if(blockID) {
          if(ProductStor.product.template_source.details[blocksQty].id === blockID) {
            if(ProductStor.product.template_source.details[blocksQty].gridId) {
              delete ProductStor.product.template_source.details[blocksQty].gridId;
              delete ProductStor.product.template_source.details[blocksQty].gridTxt;
              break;
            }
          }
        } else {
          if(ProductStor.product.template_source.details[blocksQty].gridId) {
            delete ProductStor.product.template_source.details[blocksQty].gridId;
            delete ProductStor.product.template_source.details[blocksQty].gridTxt;
          }
        }
      }
      changeSVGTemplateAsNewGrid();
    }



    /** =========== Qty Calculator ========== */

    //--------- Change Qty parameter
    function setValueQty(newValue) {
      var elementIndex = AuxStor.aux.currentAddElementId,
          index = (AuxStor.aux.auxParameter.split('-')[0] - 1);
      if(ProductStor.product.chosenAddElements[index][elementIndex].element_qty < 2 && newValue < 0) {
        return false;
      } else if(ProductStor.product.chosenAddElements[index][elementIndex].element_qty < 6 && newValue == -5) {
        return false;
      } else {
        if(AuxStor.aux.tempSize.length) {
          ProductStor.product.chosenAddElements[index][elementIndex].element_qty =  parseInt(AuxStor.aux.tempSize.join(''), 10) + newValue;
          AuxStor.aux.tempSize.length = 0;
        } else {
          ProductStor.product.chosenAddElements[index][elementIndex].element_qty += newValue;
        }
      }
    }


    //--------- Close Qty Calculator
    function closeQtyCaclulator() {
      //------- close caclulators
      desactiveAddElementParameters();
      //------ clean tempSize
      AuxStor.aux.tempSize.length = 0;
      //--------- Set Total Product Price
      setAddElementsTotalPrice(ProductStor.product);
    }




    /** ============= SIze Calculator ============= */


    function pressCulculator(keyEvent) {
      //console.log('PRESS KEY====', keyEvent.which);
      var newValue;
      //------ Enter
      if (keyEvent.which === 13) {
        if (GlobalStor.global.isQtyCalculator) {
          closeQtyCaclulator();
        } else if (GlobalStor.global.isSizeCalculator) {
          closeSizeCaclulator();
        }
      } else if(keyEvent.which === 8) {
        //-------- Backspace
        deleteLastNumber();
      } else {
        //-------- Numbers
        switch(keyEvent.which) {
          case 48:
          case 96:
            newValue = 0;
            break;
          case 49:
          case 97:
            newValue = 1;
            break;
          case 50:
          case 98:
            newValue = 2;
            break;
          case 51:
          case 99:
            newValue = 3;
            break;
          case 52:
          case 100:
            newValue = 4;
            break;
          case 53:
          case 101:
            newValue = 5;
            break;
          case 54:
          case 102:
            newValue = 6;
            break;
          case 55:
          case 103:
            newValue = 7;
            break;
          case 56:
          case 104:
            newValue = 8;
            break;
          case 57:
          case 105:
            newValue = 9;
            break;
        }
        if(newValue !== undefined) {
          setValueSize(newValue);
        }
      }
    }


      //------- Change Size parameter
    function setValueSize(newValue) {
      var sizeLength = AuxStor.aux.tempSize.length;
      //---- clean tempSize if indicate only one 0
      if(sizeLength === 4 || (sizeLength === 1 && !AuxStor.aux.tempSize[0])) {
        AuxStor.aux.tempSize.length = 0;
      }
      if (newValue === '0') {
        if (sizeLength && AuxStor.aux.tempSize[0]) {
          AuxStor.aux.tempSize.push(newValue);
          changeElementSize();
        }
      } else if(newValue === '00') {
        if (sizeLength && AuxStor.aux.tempSize[0]) {
          if (sizeLength < 3) {
            AuxStor.aux.tempSize.push(0, 0);
          } else if (sizeLength === 3) {
            AuxStor.aux.tempSize.push(0);
          }
          changeElementSize();
        }
      } else {
        AuxStor.aux.tempSize.push(newValue);
        changeElementSize();
      }

    }



    //------- Delete last number
    function deleteLastNumber() {
      AuxStor.aux.tempSize.pop();
      if(AuxStor.aux.tempSize.length < 1) {
        AuxStor.aux.tempSize.push(0);
      }
      changeElementSize();
    }


    function changeElementSize(){
      var newElementSize = '',
          elementIndex = AuxStor.aux.currentAddElementId,
          index = (AuxStor.aux.auxParameter.split('-')[0] - 1);

      newElementSize = parseInt(AuxStor.aux.tempSize.join(''), 10);
      if(GlobalStor.global.isQtyCalculator) {
        ProductStor.product.chosenAddElements[index][elementIndex].element_qty = newElementSize;
      } else if(GlobalStor.global.isSizeCalculator) {
        if(GlobalStor.global.isWidthCalculator) {
          ProductStor.product.chosenAddElements[index][elementIndex].element_width = newElementSize;
        } else {
          ProductStor.product.chosenAddElements[index][elementIndex].element_height = newElementSize;
        }
      }

    }


    //------- Close Size Calculator
    function closeSizeCaclulator() {
      var elementIndex = AuxStor.aux.currentAddElementId,
          index = (AuxStor.aux.auxParameter.split('-')[0] - 1);
      AuxStor.aux.tempSize.length = 0;
      desactiveAddElementParameters();
      //-------- recalculate add element price
      calcAddElemPrice(index, elementIndex, ProductStor.product.chosenAddElements).then(function() {
        setAddElementsTotalPrice(ProductStor.product);
      });
    }


    function calcAddElemPrice(typeIndex, elementIndex, addElementsList) {
        var objXAddElementPrice = {
              currencyId: UserStor.userInfo.currencyId,
              elementId: addElementsList[typeIndex][elementIndex].id,
              elementWidth: (addElementsList[typeIndex][elementIndex].element_width/1000),
              elementHeight: (addElementsList[typeIndex][elementIndex].element_height/1000)
            };
        return localDB.getAdditionalPrice(objXAddElementPrice).then(function (results) {
          if (results) {
            AuxStor.aux.currAddElementPrice = GeneralServ.roundingValue(GeneralServ.setPriceDis(results.priceTotal, OrderStor.order.discount_addelem));
            addElementsList[typeIndex][elementIndex].element_price = angular.copy(GeneralServ.roundingValue( results.priceTotal ));
            addElementsList[typeIndex][elementIndex].elementPriceDis = angular.copy(AuxStor.aux.currAddElementPrice);
          }
          return results;
        });
    }


    function finishCalculators() {
      //if(AuxStor.aux.tempSize.length) {
        //changeElementSize();
        if(GlobalStor.global.isSizeCalculator) {
          closeSizeCaclulator();
        } else if(GlobalStor.global.isQtyCalculator) {
          closeQtyCaclulator();
        }
      //}
      AuxStor.aux.currentAddElementId = 0;
    }


  }
})();



// services/addelem_serv.js

(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .factory('AddElementsServ', addElemFactory);

  function addElemFactory($timeout, globalConstants, GeneralServ, AddElementMenuServ, GlobalStor, ProductStor, AuxStor) {

    var thisFactory = this,
      delayShowElementsMenu = globalConstants.STEP * 12;

    thisFactory.publicObj = {
      selectAddElement: selectAddElement,
      initAddElementTools: initAddElementTools,
      openAddElementListView: openAddElementListView,
      closeAddElementListView: closeAddElementListView,
      createAddElementGroups: createAddElementGroups
    };

    return thisFactory.publicObj;




    //============ methods ================//


    //--------- Select additional element group
    function selectAddElement(id) {
      if(GlobalStor.global.isQtyCalculator || GlobalStor.global.isSizeCalculator) {
        /** calc Price previous parameter and close caclulators */
        AddElementMenuServ.finishCalculators();
      }
      /** if AddElem Menu is opened yet */
      if(AuxStor.aux.showAddElementsMenu) {
        if (AuxStor.aux.isFocusedAddElement === id) {
          //-------- close menu
          AddElementMenuServ.closeAddElementsMenu();
        } else {
          //-------- close menu
          AddElementMenuServ.closeAddElementsMenu();
          //-------- next open new menu
          $timeout(function () {
            showingAddElemMenu(id);
          }, delayShowElementsMenu);
        }
      } else {
        /** first open of AddElem Menu */
        showingAddElemMenu(id);
      }
    }


    function showingAddElemMenu(id) {
      AuxStor.aux.isFocusedAddElement = id;
      //playSound('swip');
      AuxStor.aux.showAddElementsMenu = globalConstants.activeClass;
      downloadAddElementsData(id);
    }




    function downloadAddElementsData(id) {
      var index = (id - 1);
      AuxStor.aux.addElementsMenuStyle = GeneralServ.addElementDATA[index].typeClass + '-theme';
      AuxStor.aux.addElementsType = angular.copy(GlobalStor.global.addElementsAll[index].elementType);
      AuxStor.aux.addElementsList = angular.copy(GlobalStor.global.addElementsAll[index].elementsList);
    }


    //------- Select Add Element Parameter
    function initAddElementTools(groupId, toolsId, elementIndex) {
      /** click to the same parameter => calc Price and close caclulators */
      if(AuxStor.aux.auxParameter === groupId+'-'+toolsId+'-'+elementIndex) {
        AddElementMenuServ.finishCalculators();
      } else {
        /** click another parameter */
        if(GlobalStor.global.isQtyCalculator || GlobalStor.global.isSizeCalculator) {
          /** calc Price previous parameter and close caclulators */
          AddElementMenuServ.finishCalculators();
        }
        var currElem = ProductStor.product.chosenAddElements[groupId-1][elementIndex];
        AuxStor.aux.auxParameter = groupId + '-' + toolsId + '-' + elementIndex;
        AuxStor.aux.currentAddElementId = elementIndex;
        /** set css theme for calculator */
        AuxStor.aux.calculatorStyle = GeneralServ.addElementDATA[groupId-1].typeClass + '-theme';
        switch (toolsId) {
          case 1:
            GlobalStor.global.isQtyCalculator = 1;
            break;
          case 2:
            GlobalStor.global.isSizeCalculator = 1;
            GlobalStor.global.isWidthCalculator = 1;
            break;
          case 3:
            GlobalStor.global.isSizeCalculator = 1;
            GlobalStor.global.isWidthCalculator = 0;
            break;
        }
      }
    }

    function openAddElementListView() {
      AuxStor.aux.isAddElementListView = 1;
      viewSwitching();
    }

    function closeAddElementListView() {
      AuxStor.aux.isAddElementListView = 0;
      viewSwitching();
    }


    // Open Add Elements in List View
    function viewSwitching() {
      //playSound('swip');
      AuxStor.aux.isFocusedAddElement = 0;
      AuxStor.aux.isTabFrame = 0;
      AuxStor.aux.showAddElementsMenu = 0;
      AuxStor.aux.isAddElement = 0;
      //------ close Grid Selector Dialog
      AuxStor.aux.isGridSelectorDialog = 0;
      if(GlobalStor.global.isQtyCalculator || GlobalStor.global.isSizeCalculator) {
        /** calc Price previous parameter and close caclulators */
        AddElementMenuServ.finishCalculators();
      }
    }


    //----------- create AddElement Groups for Searching
    function createAddElementGroups() {
      var groupNamesQty = GeneralServ.addElementDATA.length,
          g = 0;
      AuxStor.aux.addElementGroups.length = 0;
      for(; g < groupNamesQty; g++){
        if(GlobalStor.global.addElementsAll[g].elementsList) {
          var groupTempObj = {};
          groupTempObj.groupId = (g+1);
          groupTempObj.groupName = angular.copy(GeneralServ.addElementDATA[g].name);
          groupTempObj.groupClass = GeneralServ.addElementDATA[g].typeClass + '-theme';
          AuxStor.aux.addElementGroups.push(groupTempObj);
          //AuxStor.aux.addElementGroups.push(angular.copy(GeneralServ.addElementDATA[g]));
        }
      }
    }


  }
})();



// services/analytics_serv.js

(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('BauVoiceApp')
    .factory('AnalyticsServ', analyticsFactory);

  function analyticsFactory(localDB, UserStor) {

    var thisFactory = this;

    thisFactory.analyticsObjSource = {
      user_id: 0,
      order_id: 0,
      element_id: 0,
      element_type: 0
    };

    thisFactory.publicObj = {
      sendAnalyticsData: sendAnalyticsData//,
//      saveAnalyticDB: insertAnalyticsDB,
//      sendAnalyticsDB: sendAnalyticsDB
    };

    return thisFactory.publicObj;


    //============ methods ================//
/*
    function insertAnalyticsDB(userId, orderId, templateId, elementId, elementType) {
      var analyticsObj = angular.copy(thisFactory.analyticsObjSource);
      analyticsObj.user_id = userId;
      analyticsObj.order_id = orderId;
      analyticsObj.calculation_id = templateId;
      analyticsObj.element_id = elementId;
      analyticsObj.element_type = elementType;
      localDB.insertRowLocalDB(analyticsObj, localDB.tablesLocalDB.analytics.tableName);
    }


    function sendAnalyticsDB() {
      //----- get Analytics Data from localDB
      localDB.selectLocalDB(localDB.tablesLocalDB.analytics.tableName).then(function(data) {
        var analytics = angular.copy(data),
            analytQty = analytics.length;
        if (analytics && analytQty) {
          while(--analytQty > -1) {
            var tableName = '';
            switch(analytics[analytQty].element_type) {
              case 1: //----- profiles
                tableName = 'profile_analytics';
                break;
              case 2: //----- glass
                break;
              case 3: //----- hardware
                tableName = 'hardware_analytics';
                break;
              case 4: //----- lamination
                break;
            }
            analytics[analytQty].date = new Date();
            delete analytics[analytQty].element_type;
            delete analytics[analytQty].id;
            delete analytics[analytQty].modified;
            //----- send Analytics Data to Server
            localDB.insertServer(UserStor.userInfo.phone, UserStor.userInfo.device_code, tableName, analytics[analytQty]);
          }
          //---- clear Analytics Table in localDB
          localDB.deleteRowLocalDB(localDB.tablesLocalDB.analytics.tableName);
        }
      });
    }
*/

    function sendAnalyticsData(userId, orderId, templateId, elementId, elementType) {
      var analyticsObj = {
            user_id: userId,
            order_id: orderId,
            calculation_id: templateId,
            element_id: elementId,
            date: new Date()
          },
          tableName = '';

      switch(elementType) {
        case 1: //----- profiles
          tableName = 'profile_analytics';
          break;
        case 2: //----- glass
          break;
        case 3: //----- hardware
          tableName = 'hardware_analytics';
          break;
        case 4: //----- lamination
          break;
      }
      //----- send Analytics Data to Server
      localDB.insertServer(UserStor.userInfo.phone, UserStor.userInfo.device_code, tableName, analyticsObj);
    }

  }
})();



// services/cart_menu_serv.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('CartModule')
    .factory('CartMenuServ', cartMenuFactory);

  function cartMenuFactory($location, GeneralServ, MainServ, GlobalStor, OrderStor, CartStor, UserStor) {

    var thisFactory = this;

    thisFactory.publicObj = {
      joinAllAddElements: joinAllAddElements,
      //---- menu
      selectFloorPrice: selectFloorPrice,
      selectAssembling: selectAssembling,
      selectInstalment: selectInstalment,
      checkDifferentDate: checkDifferentDate,
      //---- price
      calculateOrderPrice: calculateOrderPrice,
      calculateAllProductsPrice: calculateAllProductsPrice,
      calculateTotalOrderPrice: calculateTotalOrderPrice,
      changeProductPriceAsDiscount: changeProductPriceAsDiscount,
      changeAddElemPriceAsDiscount: changeAddElemPriceAsDiscount,
      openDiscountBlock: openDiscountBlock,
      closeDiscountBlock: closeDiscountBlock,
      swipeDiscountBlock: swipeDiscountBlock,
      approveNewDisc: approveNewDisc,

      //---- sent order
      closeOrderDialog: closeOrderDialog,
      changeLocation: changeLocation,
      selectCity: selectCity,
      sendOrder: sendOrder
    };

    return thisFactory.publicObj;




    //============ methods ================//


    /**---------- join all Add Elements for Detials ---------*/
    function joinAllAddElements() {
      var productsQty = OrderStor.order.products.length,
          isExistElem = 0,
          typeElementsQty, elementsQty,
          product, tempElement, prod, type, elem;
      //------ cleaning allAddElements
      CartStor.cart.allAddElements.length = 0;
      CartStor.cart.isExistAddElems = 0;

      for(prod = 0; prod < productsQty; prod++) {
        product = [];
        typeElementsQty = OrderStor.order.products[prod].chosenAddElements.length;
        for(type = 0; type < typeElementsQty; type++) {
          elementsQty = OrderStor.order.products[prod].chosenAddElements[type].length;
          if(elementsQty > 0) {
            for(elem = 0; elem < elementsQty; elem++) {
              tempElement = angular.copy(OrderStor.order.products[prod].chosenAddElements[type][elem]);
              var element = {
                id: tempElement.id,
                list_group_id: tempElement.list_group_id,
                name: tempElement.name,
                elementPriceDis: tempElement.elementPriceDis,
                element_price: tempElement.element_price,
                element_qty: tempElement.element_qty * OrderStor.order.products[prod].product_qty,
                element_type: tempElement.element_type,
                element_width: tempElement.element_width,
                element_height: tempElement.element_height
              };
              product.push(element);
            }
          }
        }
        if(product.length) {
          isExistElem++;
        }
        CartStor.cart.allAddElements.push(product);
      }
      //------ to show button All AddElements
      if(isExistElem) {
        CartStor.cart.isExistAddElems = 1;
      }
    }


    //------- Select dropdown menu item

    function selectFloorPrice(currDelivery) {
      if(OrderStor.order.floor_id !== currDelivery.id) {
        OrderStor.order.floor_id = currDelivery.id;
        if(currDelivery.id) {
          OrderStor.order.floorName = currDelivery.name;
          OrderStor.order.floor_price = currDelivery.priceReal;
          OrderStor.order.delivery_user_id = currDelivery.user_id;
        } else {
          OrderStor.order.floorName = '';
          OrderStor.order.floor_price = 0;
          OrderStor.order.delivery_user_id = 0;
        }
        calculateTotalOrderPrice();
      }
    }

    function selectAssembling(currAssemb) {
      if(OrderStor.order.mounting_id !== currAssemb.id) {
        OrderStor.order.mounting_id = currAssemb.id;
        if(currAssemb.id) {
          OrderStor.order.mountingName = currAssemb.name;
          OrderStor.order.mounting_price = currAssemb.priceReal;
          OrderStor.order.mounting_user_id = currAssemb.user_id;
        } else {
          OrderStor.order.mountingName = '';
          OrderStor.order.mounting_price = 0;
          OrderStor.order.mounting_user_id = 0;
        }
        calculateTotalOrderPrice();
      }
    }

    function selectInstalment(id, period, percent) {
      if(OrderStor.order.instalment_id !== id) {
        OrderStor.order.is_instalment = 1;
        OrderStor.order.instalment_id = id;
        OrderStor.order.selectedInstalmentPeriod = period;
        OrderStor.order.selectedInstalmentPercent = percent;
        calculateInstalmentPrice(OrderStor.order.order_price, OrderStor.order.order_price_primary, OrderStor.order.order_price_dis, OrderStor.order.orderPricePrimaryDis);
      }
    }


    /** Calendar */
    //------ change date
    function checkDifferentDate(lastday, newday) {
      var lastDateArr = lastday.split("."),
          newDateArr = newday.split("."),
          lastDate = new Date(lastDateArr[ 2 ], lastDateArr[ 1 ]-1, lastDateArr[0]),
          newDate = new Date(newDateArr[ 2 ], newDateArr[ 1 ]-1, newDateArr[0]),
          qtyDays = Math.floor((newDate - lastDate)/(1000*60*60*24));
      OrderStor.order.delivery_price = 0;

      //------- culc Delivery Plant Discount
      if(qtyDays && qtyDays > 0) {
        var weekNumber = qtyDays/ 7,
            discountPlant = 0,
            userDiscConstr = 0,
            userDiscAddElem = 0;
        if(weekNumber <= 1) {
          discountPlant = GlobalStor.global.deliveryCoeff.week_1;
          userDiscConstr = UserStor.userInfo.discConstrByWeek[0];
          userDiscAddElem = UserStor.userInfo.discAddElemByWeek[0];
        } else if (weekNumber > 1 && weekNumber <= 2) {
          discountPlant = GlobalStor.global.deliveryCoeff.week_2;
          userDiscConstr = UserStor.userInfo.discConstrByWeek[1];
          userDiscAddElem = UserStor.userInfo.discAddElemByWeek[1];
        } else if (weekNumber > 2 && weekNumber <= 3) {
          discountPlant = GlobalStor.global.deliveryCoeff.week_3;
          userDiscConstr = UserStor.userInfo.discConstrByWeek[2];
          userDiscAddElem = UserStor.userInfo.discAddElemByWeek[2];
        } else if (weekNumber > 3 && weekNumber <= 4) {
          discountPlant = GlobalStor.global.deliveryCoeff.week_4;
          userDiscConstr = UserStor.userInfo.discConstrByWeek[3];
          userDiscAddElem = UserStor.userInfo.discAddElemByWeek[3];
        } else if (weekNumber > 4 && weekNumber <= 5) {
          discountPlant = GlobalStor.global.deliveryCoeff.week_5;
          userDiscConstr = UserStor.userInfo.discConstrByWeek[4];
          userDiscAddElem = UserStor.userInfo.discAddElemByWeek[4];
        } else if (weekNumber > 5 && weekNumber <= 6) {
          discountPlant = GlobalStor.global.deliveryCoeff.week_6;
          userDiscConstr = UserStor.userInfo.discConstrByWeek[5];
          userDiscAddElem = UserStor.userInfo.discAddElemByWeek[5];
        } else if (weekNumber > 6 && weekNumber <= 7) {
          discountPlant = GlobalStor.global.deliveryCoeff.week_7;
          userDiscConstr = UserStor.userInfo.discConstrByWeek[6];
          userDiscAddElem = UserStor.userInfo.discAddElemByWeek[6];
        } else if (weekNumber > 7 ) {
          discountPlant = GlobalStor.global.deliveryCoeff.week_8;
          userDiscConstr = UserStor.userInfo.discConstrByWeek[7];
          userDiscAddElem = UserStor.userInfo.discAddElemByWeek[7];
        }

        if(userDiscConstr) {
          OrderStor.order.discount_construct = userDiscConstr;
          changeProductPriceAsDiscount(userDiscConstr);
          calculateAllProductsPrice();
        } else {
          //---- set default discount user
          OrderStor.order.discount_construct = angular.copy(UserStor.userInfo.discountConstr);
          changeProductPriceAsDiscount(OrderStor.order.discount_construct);
          calculateAllProductsPrice();
        }
        if(userDiscAddElem) {
          OrderStor.order.discount_addelem = userDiscAddElem;
          changeAddElemPriceAsDiscount(userDiscAddElem);
          calculateAllProductsPrice();
        } else {
          //---- set default discount user
          OrderStor.order.discount_addelem = angular.copy(UserStor.userInfo.discountAddElem);
          changeAddElemPriceAsDiscount(OrderStor.order.discount_addelem);
          calculateAllProductsPrice();
        }

//        console.info('discont', userDiscConstr, userDiscAddElem);
//        console.info('discont Plant', discountPlant);
        if(discountPlant) {
          CartStor.cart.discountDeliveyPlant = discountPlant;
          culcDeliveyPriceByDiscPlant();
          OrderStor.order.is_date_price_less = 1;
          OrderStor.order.is_date_price_more = 0;
          OrderStor.order.is_old_price = 1;
        } else {
          calculateAllProductsPrice();
          hideDeliveryPriceOnCalendar();
        }

      //------- culc Delivery Plant Margin
      } else if (qtyDays && qtyDays < 0) {
        //------- set default User discount
        MainServ.setCurrDiscounts();
        changeAddElemPriceAsDiscount(OrderStor.order.discount_addelem);
        changeProductPriceAsDiscount(OrderStor.order.discount_construct);
        calculateAllProductsPrice();

        var marginIndex = Math.abs(GlobalStor.global.deliveryCoeff.standart_time + qtyDays);
        CartStor.cart.marginDeliveyPlant = GlobalStor.global.deliveryCoeff.percents[marginIndex]*1;
//        console.info('margin', margin);
        if(CartStor.cart.marginDeliveyPlant) {
          culcDeliveryPriceByMargPlant();
          OrderStor.order.is_date_price_more = 1;
          OrderStor.order.is_date_price_less = 0;
          OrderStor.order.is_old_price = 1;
        } else {
          hideDeliveryPriceOnCalendar();
        }

      //------ default delivery date
      } else {
        //------- set default User discount
        MainServ.setCurrDiscounts();
        changeAddElemPriceAsDiscount(OrderStor.order.discount_addelem);
        changeProductPriceAsDiscount(OrderStor.order.discount_construct);
        calculateAllProductsPrice();
        hideDeliveryPriceOnCalendar();
      }
      OrderStor.order.new_delivery_date = newDate.getTime();
      calculateTotalOrderPrice();
    }


    function culcDeliveyPriceByDiscPlant() {
      OrderStor.order.delivery_price = GeneralServ.roundingValue(OrderStor.order.productsPriceDis * CartStor.cart.discountDeliveyPlant / 100);
    }

    function culcDeliveryPriceByMargPlant() {
      OrderStor.order.delivery_price = GeneralServ.roundingValue(OrderStor.order.productsPriceDis * CartStor.cart.marginDeliveyPlant / 100);
    }

    function hideDeliveryPriceOnCalendar() {
      OrderStor.order.is_date_price_less = 0;
      OrderStor.order.is_date_price_more = 0;
      OrderStor.order.is_old_price = 0;
    }


    function setMenuItemPriceReal(items) {
      if(items) {
        var itemQty = items.length;
        while(--itemQty > -1) {
          if(items[itemQty].type) {
            switch(items[itemQty].type) {
              case 1: //----- Цена за 1 конструкцию
                items[itemQty].priceReal = Math.round(items[itemQty].price * CartStor.cart.qtyTotal);
                break;
              case 2: //----- Цена за 1 м2 конструкции
                items[itemQty].priceReal = Math.round(items[itemQty].price * CartStor.cart.squareTotal);
                break;
              case 3: //----- Цена за 1 м/п конструкции
                items[itemQty].priceReal = Math.round(items[itemQty].price * CartStor.cart.perimeterTotal);
                break;
              case 4: //----- Цена как % от стоимости
                items[itemQty].priceReal = Math.round(OrderStor.order.productsPriceDis * items[itemQty].price/100);
                break;
              default:
                items[itemQty].priceReal = Math.round(items[itemQty].price); //----- type = 5 price per order
                break;
            }
          }
        }
      }
    }




    /**========== Calculate Order Price ============*/

    function calculateOrderPrice() {
      calculateAllProductsPrice();
      //------ reculculate delivery price
      if(CartStor.cart.discountDeliveyPlant) {
        culcDeliveyPriceByDiscPlant();
      }
      if(CartStor.cart.marginDeliveyPlant) {
        culcDeliveryPriceByMargPlant();
      }
      //----- join together product prices and order option
      calculateTotalOrderPrice();

      /** set Supply & Mounting Price for submenu items*/
      setMenuItemPriceReal(GlobalStor.global.supplyData);
      setMenuItemPriceReal(GlobalStor.global.assemblingData);
    }



    //-------- Calculate All Products Price
    function calculateAllProductsPrice() {
      var productsQty = OrderStor.order.products.length;
      OrderStor.order.templates_price = 0;
      OrderStor.order.addelems_price = 0;
      OrderStor.order.products_price = 0;
      OrderStor.order.productsPriceDis = 0;
      CartStor.cart.squareTotal = 0;
      CartStor.cart.perimeterTotal = 0;
      CartStor.cart.qtyTotal = 0;
      while(--productsQty > -1) {
        OrderStor.order.addelems_price += OrderStor.order.products[productsQty].addelem_price * OrderStor.order.products[productsQty].product_qty;
        OrderStor.order.templates_price += OrderStor.order.products[productsQty].template_price * OrderStor.order.products[productsQty].product_qty;
        OrderStor.order.products_price += OrderStor.order.products[productsQty].product_price * OrderStor.order.products[productsQty].product_qty;
        OrderStor.order.productsPriceDis += OrderStor.order.products[productsQty].productPriceDis * OrderStor.order.products[productsQty].product_qty;
        //------ data for cuclulate Supply and Mounting Prices Submenu
        CartStor.cart.squareTotal += (OrderStor.order.products[productsQty].template_square * OrderStor.order.products[productsQty].product_qty);
        CartStor.cart.perimeterTotal += 0.002 * (OrderStor.order.products[productsQty].template_width + OrderStor.order.products[productsQty].template_height) * OrderStor.order.products[productsQty].product_qty;
        CartStor.cart.qtyTotal += OrderStor.order.products[productsQty].product_qty;
      }
      OrderStor.order.addelems_price = GeneralServ.roundingValue(OrderStor.order.addelems_price);
      OrderStor.order.templates_price = GeneralServ.roundingValue(OrderStor.order.templates_price);
      OrderStor.order.products_price = GeneralServ.roundingValue(OrderStor.order.products_price);
      CartStor.cart.squareTotal = GeneralServ.roundingValue(CartStor.cart.squareTotal);
      CartStor.cart.perimeterTotal = GeneralServ.roundingValue(CartStor.cart.perimeterTotal);
      CartStor.cart.qtyTotal = GeneralServ.roundingValue(CartStor.cart.qtyTotal);

      /** if default user discount = 0 */
      if(OrderStor.order.productsPriceDis) {
        OrderStor.order.productsPriceDis = GeneralServ.roundingValue(OrderStor.order.productsPriceDis);
      } else {
        OrderStor.order.productsPriceDis = angular.copy(OrderStor.order.products_price);
      }
    }


    //-------- Calculate Total Order Price
    function calculateTotalOrderPrice() {
      //playSound('price');

      OrderStor.order.order_price = 0;
      OrderStor.order.order_price_dis = 0;

      //----- add mounting margin by Day
      setMountingMarginDay();

      //----- add product prices, floor price, assembling price
      //OrderStor.order.order_price = GeneralServ.roundingValue(OrderStor.order.products_price + OrderStor.order.floor_price + OrderStor.order.mounting_price);
      OrderStor.order.order_price = OrderStor.order.products_price;
      OrderStor.order.order_price_dis = GeneralServ.roundingValue(OrderStor.order.productsPriceDis + OrderStor.order.floor_price + OrderStor.order.mounting_price);

      //----- save primary total price
      OrderStor.order.order_price_primary = angular.copy(OrderStor.order.order_price);
      OrderStor.order.orderPricePrimaryDis = angular.copy(OrderStor.order.order_price_dis);

      //----- add delivery price if order edit
      if(OrderStor.order.delivery_price) {
        if(OrderStor.order.is_date_price_more) {
          if(CartStor.cart.marginDeliveyPlant) {
            OrderStor.order.order_price += (OrderStor.order.products_price * CartStor.cart.marginDeliveyPlant / 100);
          }
          OrderStor.order.order_price_dis += OrderStor.order.delivery_price;
        } else if(OrderStor.order.is_date_price_less) {
          if(CartStor.cart.discountDeliveyPlant) {
            OrderStor.order.order_price -= (OrderStor.order.products_price * CartStor.cart.discountDeliveyPlant / 100);
          }
          OrderStor.order.order_price_dis -= OrderStor.order.delivery_price;
        } else {
          var default_delivery_plant = GlobalStor.global.deliveryCoeff.percents[GlobalStor.global.deliveryCoeff.standart_time];
          if(default_delivery_plant) {
            OrderStor.order.order_price -= (OrderStor.order.products_price * default_delivery_plant / 100);
          }
        }
      }

      OrderStor.order.order_price = GeneralServ.roundingValue(OrderStor.order.order_price);
      OrderStor.order.order_price_dis = GeneralServ.roundingValue(OrderStor.order.order_price_dis);
      CartStor.cart.discountPriceDiff = GeneralServ.roundingValue(OrderStor.order.order_price - OrderStor.order.order_price_dis);

      //------ get price with instalment
      calculateInstalmentPrice(OrderStor.order.order_price, OrderStor.order.order_price_primary, OrderStor.order.order_price_dis, OrderStor.order.orderPricePrimaryDis);
    }



    function calculateInstalmentPrice(price, pricePrimary, priceDis, pricePrimaryDis) {
      if(OrderStor.order.is_instalment) {
        OrderStor.order.payment_first = GeneralServ.roundingValue( (price * OrderStor.order.selectedInstalmentPercent / 100) );
        OrderStor.order.payment_monthly = GeneralServ.roundingValue( ((price - OrderStor.order.payment_first) / OrderStor.order.selectedInstalmentPeriod) );
        OrderStor.order.paymentFirstDis = GeneralServ.roundingValue( (priceDis * OrderStor.order.selectedInstalmentPercent / 100) );
        OrderStor.order.paymentMonthlyDis = GeneralServ.roundingValue( ((priceDis - OrderStor.order.paymentFirstDis) / OrderStor.order.selectedInstalmentPeriod) );
        if(pricePrimary) {
          OrderStor.order.payment_first_primary = GeneralServ.roundingValue( (pricePrimary * OrderStor.order.selectedInstalmentPercent / 100) );
          OrderStor.order.payment_monthly_primary = GeneralServ.roundingValue( ((pricePrimary - OrderStor.order.payment_first_primary) / OrderStor.order.selectedInstalmentPeriod) );
          OrderStor.order.paymentFirstPrimaryDis = GeneralServ.roundingValue( (pricePrimaryDis * OrderStor.order.selectedInstalmentPercent / 100) );
          OrderStor.order.paymentMonthlyPrimaryDis = GeneralServ.roundingValue( ((pricePrimaryDis - OrderStor.order.paymentFirstPrimaryDis) / OrderStor.order.selectedInstalmentPeriod) );
        }
      }
    }


    /** mounting margin by Day */
    function setMountingMarginDay() {
      var dayIndex = new Date(OrderStor.order.new_delivery_date).getDay(),
          dayMargin = 0;
//      console.warn('new_delivery_date', dayIndex);
      switch(dayIndex) {
        case 0: //---- Sunday
          dayMargin = (UserStor.userInfo.mount_sun) ? UserStor.userInfo.mount_sun : 0;
          break;
        case 1: //---- Monday
          dayMargin = (UserStor.userInfo.mount_mon) ? UserStor.userInfo.mount_mon : 0;
          break;
        case 2: //---- Tuesday
          dayMargin = (UserStor.userInfo.mount_tue) ? UserStor.userInfo.mount_tue : 0;
          break;
        case 3: //---- Wednesday
          dayMargin = (UserStor.userInfo.mount_wed) ? UserStor.userInfo.mount_wed : 0;
          break;
        case 4: //---- Thursday
          dayMargin = (UserStor.userInfo.mount_thu) ? UserStor.userInfo.mount_thu : 0;
          break;
        case 5: //---- Friday
          dayMargin = (UserStor.userInfo.mount_fri) ? UserStor.userInfo.mount_fri : 0;
          break;
        case 6: //---- Sataday
          dayMargin = (UserStor.userInfo.mount_sat) ? UserStor.userInfo.mount_sat : 0;
          break;
      }
//      console.log('dayMargin',dayMargin);
      OrderStor.order.mounting_price = GeneralServ.roundingValue(OrderStor.order.mounting_price * (1 + (dayMargin/100)));
    }



    /**-------- open/close discount block --------*/

    function openDiscountBlock() {
      CartStor.cart.tempConstructDisc = OrderStor.order.discount_construct*1;
      CartStor.cart.tempAddelemDisc = OrderStor.order.discount_addelem*1;
      CartStor.cart.isShowDiscount = 1;
    }

    function closeDiscountBlock() {
      CartStor.cart.isShowDiscount = 0;
    }

    function swipeDiscountBlock() {
      if(!CartStor.cart.isShowDiscount) {
        CartStor.cart.tempConstructDisc = OrderStor.order.discount_construct*1;
        CartStor.cart.tempAddelemDisc = OrderStor.order.discount_addelem*1;
      }
      CartStor.cart.isShowDiscount = !CartStor.cart.isShowDiscount;
    }



    function changeAddElemPriceAsDiscount(discount) {
      var productQty = OrderStor.order.products.length;
      for(var prod = 0; prod < productQty; prod++) {
        var templatePriceDis =  OrderStor.order.products[prod].productPriceDis - OrderStor.order.products[prod].addelemPriceDis;
        OrderStor.order.products[prod].addelemPriceDis = GeneralServ.setPriceDis(OrderStor.order.products[prod].addelem_price, discount);
        OrderStor.order.products[prod].productPriceDis = GeneralServ.roundingValue(templatePriceDis + OrderStor.order.products[prod].addelemPriceDis);

        var addElemsQty = OrderStor.order.products[prod].chosenAddElements.length;
        for(var elem = 0; elem < addElemsQty; elem++) {
          var elemQty = OrderStor.order.products[prod].chosenAddElements[elem].length;
          if (elemQty > 0) {
            for (var item = 0; item < elemQty; item++) {
              OrderStor.order.products[prod].chosenAddElements[elem][item].elementPriceDis = GeneralServ.setPriceDis(OrderStor.order.products[prod].chosenAddElements[elem][item].element_price, discount);
            }
          }
        }
      }
      /** recollect AllAddElements for Details */
      joinAllAddElements();
    }


    function changeProductPriceAsDiscount(discount) {
      var productQty = OrderStor.order.products.length;
      for(var prod = 0; prod < productQty; prod++) {
        OrderStor.order.products[prod].productPriceDis = angular.copy( GeneralServ.roundingValue( GeneralServ.setPriceDis(OrderStor.order.products[prod].template_price, discount) + OrderStor.order.products[prod].addelemPriceDis ));
      }
    }




    function approveNewDisc(type) {
      //console.info(CartStor.cart.tempConstructDisc);
      if(type) {
        //------- discount x add element
        CartStor.cart.tempAddelemDisc = checkNewDiscount(CartStor.cart.tempAddelemDisc);
        if(CartStor.cart.tempAddelemDisc > UserStor.userInfo.discountAddElemMax) {
          CartStor.cart.tempAddelemDisc = UserStor.userInfo.discountAddElemMax*1;
        }
        OrderStor.order.discount_addelem = CartStor.cart.tempAddelemDisc*1;
        changeAddElemPriceAsDiscount(OrderStor.order.discount_addelem);

      } else {
        //------- discount x construction
        CartStor.cart.tempConstructDisc = checkNewDiscount(CartStor.cart.tempConstructDisc);
        if(CartStor.cart.tempConstructDisc > UserStor.userInfo.discountConstrMax) {
          CartStor.cart.tempConstructDisc = UserStor.userInfo.discountConstrMax*1;
        }
        OrderStor.order.discount_construct = CartStor.cart.tempConstructDisc*1;
        changeProductPriceAsDiscount(OrderStor.order.discount_construct);
      }
      //----------- start order price total calculation
      calculateOrderPrice();
    }



    function checkNewDiscount(discount) {
      if(discount == null) {
        discount = 0;
      } else if(discount % 1) {
        //--- float
        discount = parseFloat(discount.toFixed(1));
      }
      return discount;
    }




    /** ========== Orders Dialogs ====== */

    /** send Order in Local DB */
    function sendOrder() {
      var orderStyle;
      GlobalStor.global.isLoader = 1;
      //------- set order style
      if(CartStor.cart.isMasterDialog) {
        orderStyle = 'master';
      } else {
        orderStyle = 'order';
      }

      MainServ.saveOrderInDB(CartStor.cart.customer, 1, orderStyle).then(function() {
        //--------- Close cart dialog, go to history
        closeOrderDialog();
        //------- set previos Page
        GeneralServ.setPreviosPage();
        GlobalStor.global.isLoader = 0;
        $location.path('/history');
      });
    }



    /** Close any Order Dialog */
    function closeOrderDialog() {
      CartStor.cart.submitted = 0;
      CartStor.cart.isCityBox = 0;
      if(GlobalStor.global.orderEditNumber > 0) {
        CartStor.fillOrderForm();
      } else{
        setDefaultCustomerData(OrderStor.order.customer_city_id, OrderStor.order.customer_city, OrderStor.order.customer_location);
        CartStor.cart.customer.customer_sex = 0;
      }
      CartStor.cart.isMasterDialog = 0;
      CartStor.cart.isOrderDialog = 0;
      CartStor.cart.isCreditDialog = 0;
    }


    function changeLocation() {
      if(CartStor.cart.customer.customer_location) {
        CartStor.cart.isCityBox = 1;
      } else {
        CartStor.cart.isCityBox = 0;
      }
    }

    /** Select City in Order Dialogs */
    function selectCity(location) {
      setDefaultCustomerData(location.cityId, location.cityName, location.fullLocation);
      CartStor.cart.isCityBox = 0;
    }


    function setDefaultCustomerData() {
      CartStor.cart.customer.customer_city_id = arguments[0];
      CartStor.cart.customer.customer_city = arguments[1];
      CartStor.cart.customer.customer_location = arguments[2];
    }

  }
})();



// services/cart_serv.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('CartModule')
    .factory('CartServ', cartFactory);

  function cartFactory($location, $filter, GeneralServ, MainServ, CartMenuServ, GlobalStor, OrderStor, ProductStor, CartStor, AuxStor) {

    var thisFactory = this;

    thisFactory.publicObj = {
      increaseProductQty: increaseProductQty,
      decreaseProductQty: decreaseProductQty,
      addNewProductInOrder: addNewProductInOrder,
      clickDeleteProduct: clickDeleteProduct,
      editProduct: editProduct,

      showAllAddElements: showAllAddElements,
      collectAllAddElems: collectAllAddElems,
      getAddElemsPriceTotal: getAddElemsPriceTotal,
      calculateAddElemsProductsPrice: calculateAddElemsProductsPrice,
      createProductCopy: createProductCopy,
      addCloneProductInOrder: addCloneProductInOrder
    };

    return thisFactory.publicObj;




    //============ methods ================//

    //------- add new product in order
    function addNewProductInOrder() {
      //------- set previos Page
      GeneralServ.setPreviosPage();
      //=============== CREATE NEW PRODUCT =========//
      MainServ.createNewProduct();
    }



    //----- Increase Product Qty
    function increaseProductQty(productIndex) {
      OrderStor.order.products[productIndex].product_qty += 1;
      CartMenuServ.joinAllAddElements();
      CartMenuServ.calculateOrderPrice();
    }



    //----- Reduce Product Qty
    function decreaseProductQty(productIndex) {
      //----- if product 1 - delete product completely
      if(OrderStor.order.products[productIndex].product_qty === 1) {
        //------ ask client to delete
        clickDeleteProduct(productIndex);
      } else {
        OrderStor.order.products[productIndex].product_qty -= 1;
        CartMenuServ.calculateOrderPrice();
      }
      CartMenuServ.joinAllAddElements();
    }


    //----- Delete Product
    function clickDeleteProduct(productIndex) {

      GeneralServ.confirmAlert(
        $filter('translate')('common_words.DELETE_PRODUCT_TITLE'),
        $filter('translate')('common_words.DELETE_PRODUCT_TXT'),
        deleteProduct
      );

      function deleteProduct() {
        //playSound('delete');
        OrderStor.order.products.splice(productIndex, 1);
        CartStor.cart.allAddElements.splice(productIndex, 1);

        //----- if all products were deleted go to main page????
        CartMenuServ.calculateOrderPrice();
        if(OrderStor.order.products.length > 0 ) {
          //--------- Change order price
        } else {
          //$scope.global.createNewProjectCart();
          //TODO create new project
        }
      }
    }


    //----- Edit Produtct in main page
    function editProduct(productIndex, type) {
      ProductStor.product = angular.copy(OrderStor.order.products[productIndex]);
      GlobalStor.global.productEditNumber = ProductStor.product.product_id;
      GlobalStor.global.isCreatedNewProduct = 1;
      GlobalStor.global.isChangedTemplate = 1;
      MainServ.prepareMainPage();
      if(type === 'auxiliary') {
        //------ open AddElements Panel
        GlobalStor.global.activePanel = 6;
      }
      //------- set previos Page
      GeneralServ.setPreviosPage();
      $location.path('/main');
    }







    /**======== ALL ADD LEMENTS PANEL ========*/

    /** show All Add Elements Panel */
    function showAllAddElements() {
      collectAllAddElems();
      getAddElemsPriceTotal();
      initSelectedProductsArr();
      CartStor.cart.isAllAddElems = 1;
      AuxStor.aux.isAddElementListView = 1;
    }


    function collectAllAddElems() {
      var addElemsSource = angular.copy(CartStor.cart.allAddElements),
          addElemsQty = addElemsSource.length,
          prodQty, elemsOrderQty, noExist;
      CartStor.cart.allAddElemsOrder.length = 0;
      while(--addElemsQty > -1) {
        prodQty = addElemsSource[addElemsQty].length;
        if(prodQty) {
          while(--prodQty > -1) {
            elemsOrderQty = CartStor.cart.allAddElemsOrder.length;
            if(elemsOrderQty) {
              noExist = 1;
              while(--elemsOrderQty > -1) {
                if(CartStor.cart.allAddElemsOrder[elemsOrderQty].id === addElemsSource[addElemsQty][prodQty].id) {
                  if(CartStor.cart.allAddElemsOrder[elemsOrderQty].element_width === addElemsSource[addElemsQty][prodQty].element_width) {
                    if(CartStor.cart.allAddElemsOrder[elemsOrderQty].element_height === addElemsSource[addElemsQty][prodQty].element_height) {
                      CartStor.cart.allAddElemsOrder[elemsOrderQty].element_qty = GeneralServ.roundingValue(CartStor.cart.allAddElemsOrder[elemsOrderQty].element_qty + addElemsSource[addElemsQty][prodQty].element_qty);
                      --noExist;
                    }
                  }
                }
              }
              if(noExist) {
                CartStor.cart.allAddElemsOrder.push(addElemsSource[addElemsQty][prodQty]);
              }
            } else {
              CartStor.cart.allAddElemsOrder.push(addElemsSource[addElemsQty][prodQty]);
            }
          }
        }
      }
      console.warn(CartStor.cart.allAddElemsOrder);
    }



    function getAddElemsPriceTotal() {
      var productsQty = OrderStor.order.products.length;
      CartStor.cart.addElemsOrderPriceTOTAL = 0;
      while(--productsQty > -1) {
        CartStor.cart.addElemsOrderPriceTOTAL += (OrderStor.order.products[productsQty].addelemPriceDis * OrderStor.order.products[productsQty].product_qty);
      }
      CartStor.cart.addElemsOrderPriceTOTAL = GeneralServ.roundingValue(CartStor.cart.addElemsOrderPriceTOTAL);
    }



    function initSelectedProductsArr() {
      CartStor.cart.selectedProducts.length = 0;
      CartStor.cart.selectedProducts = OrderStor.order.products.map(function() {
        return [];
      });
    }




    function calculateAddElemsProductsPrice(reculc) {
      var productsQty = OrderStor.order.products.length,
          addElemTypeQty, addElemQty;
      while(--productsQty > -1) {
        OrderStor.order.products[productsQty].addelem_price = 0;
        OrderStor.order.products[productsQty].addelemPriceDis = 0;

        //-------- if was delete only one AddElemItem
        if(reculc) {
          addElemTypeQty = OrderStor.order.products[productsQty].chosenAddElements.length;
          while (--addElemTypeQty > -1) {
            addElemQty = OrderStor.order.products[productsQty].chosenAddElements[addElemTypeQty].length;
            if (addElemQty) {
              while (--addElemQty > -1) {
                OrderStor.order.products[productsQty].addelem_price += OrderStor.order.products[productsQty].chosenAddElements[addElemTypeQty][addElemQty].element_qty * OrderStor.order.products[productsQty].chosenAddElements[addElemTypeQty][addElemQty].element_price;
              }
              OrderStor.order.products[productsQty].addelem_price = GeneralServ.roundingValue(OrderStor.order.products[productsQty].addelem_price);
              OrderStor.order.products[productsQty].addelemPriceDis = GeneralServ.setPriceDis(OrderStor.order.products[productsQty].addelem_price, OrderStor.order.discount_addelem);
            }
          }
        }

        //------ reculculate product price total
        MainServ.setProductPriceTOTAL(OrderStor.order.products[productsQty]);
      }
    }





    function createProductCopy(currProdInd) {
      var lastProductId = d3.max(OrderStor.order.products.map(function(item) {
            return item.product_id;
          })),
      cloneProduct = angular.copy(OrderStor.order.products[currProdInd]);
      addCloneProductInOrder(cloneProduct, lastProductId);
      CartMenuServ.joinAllAddElements();
      CartMenuServ.calculateOrderPrice();
    }


    function addCloneProductInOrder(cloneProduct, lastProductId) {
      ++lastProductId;
      cloneProduct.product_id = lastProductId;
      OrderStor.order.products.push(cloneProduct);
    }


  }
})();



// services/constants.js

(function(){
  'use strict';

  angular
    .module('BauVoiceApp')
    .constant('globalConstants', {
      serverIP: 'http://api.windowscalculator.net',
      //serverIP: 'http://api.steko.com.ua',
      STEP: 50,
      REG_PHONE: /^\d+$/, // /^[0-9]{1,10}$/
      REG_NAME: /^[a-zA-Z]+$/,
      REG_MAIL: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
          // /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
      svgTemplateIconWidth: 70,
      svgTemplateIconHeight: 70,
      svgTemplateIconBigWidth: 500,
      svgTemplateIconBigHeight: 450,
      svgTemplateWidth: 1022,
      svgTemplateHeight: 767,

      //---Edit Design
      squareLimit: 0.15,
      minSizeLimit: 100,
      minSizeLimitStulp: 300,
      minRadiusHeight: 10,

      activeClass: 'active',
      //------------ SVG
      SVG_ID_EDIT: 'tamlateSVG',
      SVG_ID_GLASS: 'tamlateSVGGlass',
      SVG_ID_GRID: 'tamlateSVGGrid',

      //------------ Languages
      languages: [
        {label: 'uk', name: 'Українська'},
        {label: 'ru', name: 'Русский'},
        {label: 'en', name: 'English'},
        {label: 'de', name: 'Deutsch'},
        {label: 'ro', name: 'Român'},
        {label: 'it', name: 'Italiano'}
      ]

    });

})();



// services/design_serv.js

/* globals d3, startRecognition, parseStringToDimension, playTTS */
(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('DesignModule')
    .factory('DesignServ', designFactory);

  function designFactory(
    $rootScope,
    $location,
    $timeout,
    $filter,
    $q,
    globalConstants,
    GeneralServ,
    localDB,
    MainServ,
    AnalyticsServ,
    optionsServ,
    SVGServ,
    GlobalStor,
    DesignStor,
    OrderStor,
    ProductStor,
    UserStor
  ) {

    var thisFactory = this,
        clickEvent = (GlobalStor.global.isDevice) ? 'touchstart' : 'click';

    thisFactory.publicObj = {
      setDefaultTemplate: setDefaultTemplate,
      designSaved: designSaved,
      designCancel: designCancel,
      setDefaultConstruction: setDefaultConstruction,

      initAllImposts: initAllImposts,
      initAllGlass: initAllGlass,
      initAllGlassXGlass: initAllGlassXGlass,
      initAllGlassXGrid: initAllGlassXGrid,
      initAllArcs: initAllArcs,
      initAllDimension: initAllDimension,
      hideCornerMarks: hideCornerMarks,
      deselectAllImpost: deselectAllImpost,
      deselectAllArc: deselectAllArc,
      deselectAllGlass: deselectAllGlass,
      rebuildSVGTemplate: rebuildSVGTemplate,

      //------- edit sash
      createSash: createSash,
      deleteSash: deleteSash,
      //------- edit corners
      setCornerPoints: setCornerPoints,
      setCurvCornerPoints: setCurvCornerPoints,
      deleteCornerPoints: deleteCornerPoints,
      //-------- edit arc
      createArc: createArc,
      deleteArc: deleteArc,
      workingWithAllArcs: workingWithAllArcs,
      //-------- edit impost
      createImpost: createImpost,
      deleteImpost: deleteImpost,
      //-------- mirror
      initMirror: initMirror,
      positionAxises: positionAxises,
      positionGlasses: positionGlasses,
      removeAllEventsInSVG: removeAllEventsInSVG,
      removeGlassEventsInSVG: removeGlassEventsInSVG,

      //---- change sizes
      setValueSize: setValueSize,
      deleteLastNumber: deleteLastNumber,
      closeSizeCaclulator: closeSizeCaclulator,
      hideSizeTools: hideSizeTools,

      stepBack: stepBack,
      getGridPrice: getGridPrice,

      //---- door
//      downloadDoorConfig: downloadDoorConfig,
      setIndexDoorConfig: setIndexDoorConfig
    };

    return thisFactory.publicObj;




    /**============ methods ================*/


    function setDefaultTemplate() {
      DesignStor.designSource.templateSourceTEMP = angular.copy(ProductStor.product.template_source);
      DesignStor.designSource.templateTEMP = angular.copy(ProductStor.product.template);
      DesignStor.design.templateSourceTEMP = angular.copy(ProductStor.product.template_source);
      DesignStor.design.templateTEMP = angular.copy(ProductStor.product.template);
    }



    /**------- Save and Close Construction Page ----------*/

    function designSaved() {
      closeSizeCaclulator(1).then(function() {
        /** save new template in product */
        ProductStor.product.template_source = angular.copy(DesignStor.design.templateSourceTEMP);
        ProductStor.product.template = angular.copy(DesignStor.design.templateTEMP);

        /** create template icon */
        SVGServ.createSVGTemplateIcon(DesignStor.design.templateSourceTEMP, ProductStor.product.profileDepths).then(function(result) {
          ProductStor.product.templateIcon = angular.copy(result);
        });

        /** if Door Construction */
        if(ProductStor.product.construction_type === 4) {
          //------- save new door config
          ProductStor.product.door_shape_id = DesignStor.design.doorShapeList[DesignStor.design.doorConfig.doorShapeIndex].shapeId;
          ProductStor.product.door_sash_shape_id = DesignStor.design.doorShapeList[DesignStor.design.doorConfig.sashShapeIndex].shapeId;
          ProductStor.product.door_handle_shape_id = DesignStor.design.doorShapeList[DesignStor.design.doorConfig.handleShapeIndex].shapeId;
          ProductStor.product.door_lock_shape_id = DesignStor.design.doorShapeList[DesignStor.design.doorConfig.lockShapeIndex].shapeId;
        }

        /** save new template in templates Array */
        GlobalStor.global.templatesSource[ProductStor.product.templateIndex] = angular.copy(ProductStor.product.template_source);

        /** if sash was added/removed in template */
        var isSashesInTemplate = MainServ.checkSashInTemplate(ProductStor.product);
        if (isSashesInTemplate) {
          if(!GlobalStor.global.isSashesInTemplate) {
            GlobalStor.global.isSashesInTemplate = 1;
            ProductStor.product.hardware = GlobalStor.global.hardwares[0][0];
            //------ save analytics data
            //AnalyticsServ.saveAnalyticDB(UserStor.userInfo.id, OrderStor.order.id, ProductStor.product.template_id, ProductStor.product.hardware.id, 3);
          }
        } else {
          ProductStor.product.hardware = {};
          ProductStor.product.hardware.id = 0;
          GlobalStor.global.isSashesInTemplate = 0;
        }

        /** check grids */
        var isChanged = updateGrids();
        if(isChanged) {
          //------ get new grids price
          getGridPrice(ProductStor.product.chosenAddElements[0]);
        }

        /** refresh price of new template */
        MainServ.preparePrice(ProductStor.product.template, ProductStor.product.profile.id, ProductStor.product.glass, ProductStor.product.hardware.id, ProductStor.product.lamination.img_in_id).then(function() {
          //-------- template was changed
          GlobalStor.global.isChangedTemplate = 1;
          backtoTemplatePanel();
        });

      });
    }




    //--------- Cancel and Close Construction Page
    function designCancel() {
      //------- close calculator if is opened
      hideSizeTools();
      //------ go to Main Page
      backtoTemplatePanel();
    }



    //-------- Back to Template Panel
    function backtoTemplatePanel() {
      //------ cleaning DesignStor
      DesignStor.design = DesignStor.setDefaultDesign();
      //      delete DesignStor.design.templateSourceTEMP;
      //      delete DesignStor.design.templateTEMP;
      GlobalStor.global.activePanel = 0;
      GlobalStor.global.isNavMenu = 0;
      GlobalStor.global.isConfigMenu = 1;
      $location.path('/main');
    }

 
    //------- set Default Construction
    function setDefaultConstruction() {
      //------- close calculator if is opened
      hideSizeTools();
      //----- do if Size Calculator is not opened
      //if(!GlobalStor.global.isSizeCalculator) {
        DesignStor.design = DesignStor.setDefaultDesign();
        setDefaultTemplate();
        //============ if Door Construction
        if(ProductStor.product.construction_type === 4) {
          //---- set indexes
          setIndexDoorConfig();
        }
      //}
    }



    /**--------------- GRIDs --------------*/

    function updateGrids() {
      var gridQty = ProductStor.product.chosenAddElements[0].length, isChanged = 0;
      if(gridQty) {
        GridArr: while(--gridQty > -1) {
          //----- find grid in template
          var blockQty = ProductStor.product.template.details.length;
          while(--blockQty > 0) {
            if(ProductStor.product.template.details[blockQty].id === ProductStor.product.chosenAddElements[0][gridQty].block_id) {
              //------- if grid there is in this block
              if(ProductStor.product.template.details[blockQty].gridId) {

                //------ defined inner block sizes
                var sizeGridX = ProductStor.product.template.details[blockQty].pointsIn.map(function(item) {
                      return item.x;
                    }),
                    sizeGridY = ProductStor.product.template.details[blockQty].pointsIn.map(function(item) {
                      return item.y;
                    }),
                    gridTemp = {};
                gridTemp.width = (d3.max(sizeGridX) - d3.min(sizeGridX));
                gridTemp.height = (d3.max(sizeGridY) - d3.min(sizeGridY));
                //----- if width or height are defferented - reculculate grid price
                if(ProductStor.product.chosenAddElements[0][gridQty].element_width !== gridTemp.width || ProductStor.product.chosenAddElements[0][gridQty].element_height !== gridTemp.height) {
                  ProductStor.product.chosenAddElements[0][gridQty].element_width = gridTemp.width;
                  ProductStor.product.chosenAddElements[0][gridQty].element_height = gridTemp.height;
                  isChanged = 1;
                }

              } else {
                //----- delete grid in chosenAddElements
                ProductStor.product.chosenAddElements[0].splice(gridQty, 1);
                continue GridArr;
              }
            }
          }
        }
      }
      return isChanged;
    }


    function getGridPrice(grids) {
      var deff = $q.defer(),
          proms = grids.map(function(item) {
            var deff2 = $q.defer(),
                objXAddElementPrice = {
                  currencyId: UserStor.userInfo.currencyId,
                  elementId: item.id,
                  elementWidth: (item.element_width/1000),
                  elementHeight: (item.element_height/1000)
                };
            //console.log('objXAddElementPrice=====', objXAddElementPrice);
            //-------- get current add element price
            localDB.getAdditionalPrice(objXAddElementPrice).then(function (results) {
              if (results) {
                item.element_price = angular.copy(GeneralServ.roundingValue( results.priceTotal ));
                item.elementPriceDis = angular.copy(GeneralServ.setPriceDis(results.priceTotal, OrderStor.order.discount_addelem));
                //console.log('objXAddElementPrice====result +++', results, item);
                deff2.resolve(item);
              } else {
                deff2.reject(results);
              }
            });

            return deff2.promise;
          });

      deff.resolve($q.all(proms));
      return deff.promise;
    }



    /**---------------- DOORs--------------*/

//    function downloadDoorConfig() {
//      optionsServ.getDoorConfig(function (results) {
//        if (results.status) {
//          DesignStor.design.doorShapeList = results.data.doorType;
//          DesignStor.design.sashShapeList = results.data.sashType;
//          DesignStor.design.handleShapeList = results.data.handleType;
//          DesignStor.design.lockShapeList = results.data.lockType;
          //---- set indexes
//          setIndexDoorConfig();
//        } else {
//          console.log(results);
//        }
//      });
//    }

    function setIndexDoorConfig() {
      DesignStor.designSource.doorConfig.doorShapeIndex = setDoorConfigIndex(DesignStor.design.doorShapeList, ProductStor.product.door_shape_id);
      DesignStor.designSource.doorConfig.sashShapeIndex = setDoorConfigIndex(DesignStor.design.doorShapeList, ProductStor.product.door_sash_shape_id);
      DesignStor.designSource.doorConfig.handleShapeIndex = setDoorConfigIndex(DesignStor.design.doorShapeList, ProductStor.product.door_handle_shape_id);
      DesignStor.designSource.doorConfig.lockShapeIndex = setDoorConfigIndex(DesignStor.design.doorShapeList, ProductStor.product.door_lock_shape_id);

      //-------- set Default values in design
      DesignStor.design.doorConfig = DesignStor.setDefaultDoor();
    }


    function setDoorConfigIndex(list, configId) {
      var listQty = list.length;
      for(var i = 0; i < listQty; i++) {
        if(list[i].shapeId === configId) {
          return i;
        }
      }
    }





    /**-------------- Edit Design --------------*/


    //------ add to all imposts event on click
    function initAllImposts() {
      DesignStor.design.selectedImpost.length = 0;
      d3.selectAll('#'+globalConstants.SVG_ID_EDIT+' [item_type=impost]')
        .each(function() {
          var impost = d3.select(this);
          impost.on(clickEvent, function() {
            if(DesignStor.design.tempSize.length) {
              closeSizeCaclulator();
              cleanTempSize();
            } else {
              var isImpost = isExistElementInSelected(impost[0][0], DesignStor.design.selectedImpost);
              if (isImpost) {
                impost.classed('frame-active', true);
                //------- active impost menu and submenu
                DesignStor.design.activeMenuItem = 3;
                DesignStor.design.isImpostDelete = 1;
                DesignStor.design.activeSubMenuItem = 3;
                hideCornerMarks();
                deselectAllArc();
                hideSizeTools();
                $rootScope.$apply();
              } else {
                impost.classed('frame-active', false);
                //----- if none imposts
                if (!DesignStor.design.selectedImpost.length) {
                  //------- close impost menu and submenu
                  DesignStor.design.activeMenuItem = 0;
                  DesignStor.design.activeSubMenuItem = 0;
                  $rootScope.$apply();
                  DesignStor.design.isImpostDelete = 0;
                }
              }
            }
          });
        });
    }



    function isExistElementInSelected(newElem, selectedArr) {
      var exist = 1,
          newElemId = newElem.attributes.block_id.nodeValue,
          selectedQty = selectedArr.length;
      while(--selectedQty > -1) {
        if(selectedArr[selectedQty].attributes.block_id.nodeValue === newElemId) {
          selectedArr.splice(selectedQty, 1);
          exist = 0;
          break;
        }
      }
      //-------- if the element is new one
      if(exist){
        selectedArr.push(newElem);
      }
      return exist;
    }



    //------- set click to all Glass for Dimensions
    function initAllGlass() {
      console.log('clickclickclickclickclickclickclickclickclickclick')
      DesignStor.design.selectedGlass.length = 0;
      d3.selectAll('#'+globalConstants.SVG_ID_EDIT+' .glass')
        .each(function() {
          var glass = d3.select(this);
          glass.on(clickEvent, function() {
            if(DesignStor.design.tempSize.length) {
              closeSizeCaclulator();
              cleanTempSize();
            } else {
              //========= select glass
              var isGlass = isExistElementInSelected(glass[0][0], DesignStor.design.selectedGlass), blockID = glass[0][0].attributes.block_id.nodeValue;

              if (isGlass) {
                glass.classed('glass-active', true);
                GlobalStor.global.isTemplateItemMenu = 1;
                hideCornerMarks();
                deselectAllImpost();
                deselectAllArc();
                hideSizeTools();

                //------- show Dimensions
                showCurrentDimLevel(blockID);

                $rootScope.$apply();
              } else {
                glass.classed('glass-active', false);
                GlobalStor.global.isTemplateItemMenu = 0;
                //------- hide Dimensions of current Block
                d3.selectAll('#'+globalConstants.SVG_ID_EDIT+' .dim_block[block_id=' + blockID + ']').classed('dim_hidden', true);

                if (!DesignStor.design.selectedGlass.length) {
                  //------- close glass menu and submenu
                  DesignStor.design.activeMenuItem = 0;
                  DesignStor.design.activeSubMenuItem = 0;
                  //---- shifting global dimension
                  hideAllDimension();
                  $rootScope.$apply();
                }
              }
            }
          });
        });
    }


    /**------- set click to all Glass for Glass selector ---------- */

    function initAllGlassXGlass() {
      DesignStor.design.selectedGlass.length = 0;
      d3.selectAll('#'+globalConstants.SVG_ID_GLASS+' .glass')
        .each(function() {
          var glass = d3.select(this);
          glass.on(clickEvent, function() {
              //========= select glass
              var isGlass = isExistElementInSelected(glass[0][0], DesignStor.design.selectedGlass);
              if (isGlass) {
                glass.classed('glass-active', true);
              } else {
                glass.classed('glass-active', false);
              }
          });
        });
    }

    /**------- set click to all Glass for Grid selector ---------- */

    function initAllGlassXGrid() {
      DesignStor.design.selectedGlass.length = 0;
      d3.selectAll('#'+globalConstants.SVG_ID_GRID+' .glass')
        .each(function() {
          var glass = d3.select(this);
          glass.on(clickEvent, function() {
            var blocks = ProductStor.product.template.details,
                blocksQty = blocks.length,
                blockID = glass[0][0].attributes.block_id.nodeValue;
            //-------- check glass per sash
            while(--blocksQty > 0) {
              if(blocks[blocksQty].id === blockID) {
                if (blocks[blocksQty].blockType === "sash") {
                  var isGlass = isExistElementInSelected(glass[0][0], DesignStor.design.selectedGlass);
                  //========= select glass
                  if (isGlass) {
                    glass.classed('glass-active', true);
                  } else {
                    glass.classed('glass-active', false);
                  }
                } else {
                  //------ show error
                  showErrorInBlock(blockID, globalConstants.SVG_ID_GRID);
                }
              }
            }

          });
        });
    }



    function showCurrentDimLevel(currDimId) {
      var dim = d3.selectAll('#'+globalConstants.SVG_ID_EDIT+' .dim_block[block_id='+currDimId+']'),
          dimQty = dim[0].length,
          isXDim = 0, isYDim = 0;
      //------- checking what kind of dimension X or Y direction
      if(dimQty) {
        while(--dimQty > -1) {
          if(dim[0][dimQty].attributes.axis) {
            if (dim[0][dimQty].attributes.axis.nodeValue === 'x') {
              ++isXDim;
            } else if (dim[0][dimQty].attributes.axis.nodeValue === 'y') {
              ++isYDim;
            }
          }
        }
        //------- shifting overall dimensions is level0 is existed
        if(isXDim) {
          d3.selectAll('#'+globalConstants.SVG_ID_EDIT+' .dim_blockX').classed('dim_shiftX', 1);
        }
        if(isYDim) {
          d3.selectAll('#'+globalConstants.SVG_ID_EDIT+' .dim_blockY').classed('dim_shiftY', 1);
        }
        dim.classed('dim_hidden', 0);
      }
    }




    function initAllArcs() {
      var arcs = d3.selectAll('#'+globalConstants.SVG_ID_EDIT+' .frame')[0].filter(function (item) {
        if (item.__data__.type === 'frame' || item.__data__.type === 'arc') {
          return true;
        }
      });
      if(arcs.length) {
        d3.selectAll(arcs).each(function() {
          var arc = d3.select(this);
          arc.on(clickEvent, function() {
            if(DesignStor.design.tempSize.length) {
              closeSizeCaclulator();
              cleanTempSize();
            } else {
              var isArc = isExistArcInSelected(arc[0][0], DesignStor.design.selectedArc);
              //console.log('add to ARC++++', DesignStor.design.selectedArc);
              if (isArc) {
                arc.classed('active_svg', true);
                deselectAllGlass();
                hideCornerMarks();
                deselectAllImpost();
                hideSizeTools();
                $rootScope.$apply();
              } else {
                arc.classed('active_svg', false);
                if (!DesignStor.design.selectedArc.length) {
                  //------- close glass menu and submenu
                  DesignStor.design.activeMenuItem = 0;
                  DesignStor.design.activeSubMenuItem = 0;
                  $rootScope.$apply();
                }
              }
            }
          });
        });
      }
    }

function upBackground () {
  
}

    function isExistArcInSelected(newElem, selectedArr) {
      var exist = 1,
          newElemId = newElem.attributes.item_id.nodeValue,
          selectedQty = selectedArr.length;
      while(--selectedQty > -1) {
        if(selectedArr[selectedQty].attributes.item_id.nodeValue === newElemId) {
          selectedArr.splice(selectedQty, 1);
          exist = 0;
          break;
        }
      }
      //-------- if the element is new one
      if(exist){
        selectedArr.push(newElem);
      }
      return exist;
    }



    function hideAllDimension() {
      d3.selectAll('#'+globalConstants.SVG_ID_EDIT+' .dim_blockX').classed('dim_shiftX', false);
      d3.selectAll('#'+globalConstants.SVG_ID_EDIT+' .dim_blockY').classed('dim_shiftY', false);
      d3.selectAll('#'+globalConstants.SVG_ID_EDIT+' .dim_block').classed('dim_hidden', true);
    }


    function hideCornerMarks() {
      DesignStor.design.selectedCorner.length = 0;
      d3.selectAll('#'+globalConstants.SVG_ID_EDIT+' .corner_mark')
        .transition()
        .duration(300)
        .ease("linear")
        .attr('r', 0);
    }

    function deselectAllImpost() {
      DesignStor.design.selectedImpost.length = 0;
      d3.selectAll('#'+globalConstants.SVG_ID_EDIT+' [item_type=impost]').classed('frame-active', false);
    }


    function deselectAllArc() {
      DesignStor.design.selectedArc.length = 0;
      d3.selectAll('#'+globalConstants.SVG_ID_EDIT+' .frame').classed('active_svg', false);
    }


    function deselectAllGlass() {
      DesignStor.design.selectedGlass.length = 0;
      d3.selectAll('#'+globalConstants.SVG_ID_EDIT+' .glass').classed('glass-active', false);
    }


    function rebuildSVGTemplate() {
      SVGServ.createSVGTemplate(DesignStor.design.templateSourceTEMP, ProductStor.product.profileDepths).then(function(result) {
        DesignStor.design.templateTEMP = angular.copy(result);
      });
    }


    //++++++++++ Edit Sash +++++++++//

    function createSash(type, glassObj) {
      var glass = glassObj.__data__,
          blockID = glassObj.attributes.block_id.nodeValue,
          blocks = DesignStor.design.templateSourceTEMP.details,
          blocksQty = blocks.length,
          minGlassSize = d3.min(glass.sizes),
          sashesParams;

      /**---- shtulps ---*/
      if(type === 8 || type === 9) {
        if(minGlassSize >= globalConstants.minSizeLimitStulp) {

          if(type === 8) {
            sashesParams = [
              {
                openDir: [4],
                handlePos: 0,
                sashType: 4
              },
              {
                openDir: [1, 2],
                handlePos: 2,
                sashType: 17
              }
            ];
          } else if(type === 9) {
            sashesParams = [
              {
                openDir: [1, 4],
                handlePos: 4,
                sashType: 17
              },
              {
                openDir: [2],
                handlePos: 0,
                sashType: 4
              }
            ];
          }

          createShtulp(blockID, sashesParams);

        } else {
          //------ show error
          showErrorInBlock(blockID);
        }

      } else {

        if (minGlassSize >= globalConstants.minSizeLimit || glass.square >= globalConstants.squareLimit) {

          //---- save last step
          DesignStor.design.designSteps.push(angular.copy(DesignStor.design.templateSourceTEMP));

          for (var b = 1; b < blocksQty; b++) {
            if (blocks[b].id === blockID) {
              blocks[b].blockType = 'sash';
              blocks[b].gridId = 0;
              blocks[b].gridTxt = '';

              switch (type) {
                //----- 'left'
                case 2:
                  blocks[b].openDir = [4];
                  blocks[b].handlePos = 4;
                  blocks[b].sashType = 2;
                  break;
                //----- 'right'
                case 3:
                  blocks[b].openDir = [2];
                  blocks[b].handlePos = 2;
                  blocks[b].sashType = 2;
                  break;
                //----- 'up'
                case 4:
                  blocks[b].openDir = [1];
                  blocks[b].handlePos = 1;
                  blocks[b].sashType = 7;
                  break;
                //------ 'down'
                case 5:
                  blocks[b].openDir = [3];
                  blocks[b].handlePos = 3;
                  blocks[b].sashType = 2;
                  break;
                //------ 'up', 'right'
                case 6:
                  blocks[b].openDir = [1, 2];
                  blocks[b].handlePos = 2;
                  blocks[b].sashType = 6;
                  break;
                //------ 'up', 'left'
                case 7:
                  blocks[b].openDir = [1, 4];
                  blocks[b].handlePos = 4;
                  blocks[b].sashType = 6;
                  break;
              }
              //----- change Template
              rebuildSVGTemplate();
            }
          }
        } else {
          //------ show error
          showErrorInBlock(blockID);
        }
      }
    }



    /**----------- create SHTULP -----------*/

    function createShtulp(blockID, sashesParams) {
      var blocks = DesignStor.design.templateTEMP.details,
          blocksQty = blocks.length,
          blocksSource = DesignStor.design.templateSourceTEMP.details,
          angel = 90, dimType = 0, currBlockInd, curBlockN,
          lastBlockN,
          impVector,
          crossPoints;

        //---- save last step
        DesignStor.design.designSteps.push(angular.copy(DesignStor.design.templateSourceTEMP));


        //------- find lines as to current block
        while (--blocksQty > 0) {
          if (blocks[blocksQty].id === blockID) {
            currBlockInd = blocksQty*1;
            curBlockN = Number(blocks[blocksQty].id.replace(/\D+/g, ""));
          }
        }
        lastBlockN = getLastBlockNumber(blocksSource);
        impVector = SVGServ.cteateLineByAngel(blocks[currBlockInd].center, angel);
        crossPoints = getImpostCrossPointInBlock(impVector, blocks[currBlockInd].linesOut);

        if(crossPoints.length > 2) {
          sliceExtraPoints(crossPoints);
        }

        var impPointsQty = crossPoints.length;
        if (impPointsQty === 2) {
          while (--impPointsQty > -1) {
            createImpostPoint(crossPoints[impPointsQty], curBlockN, currBlockInd, blocksSource, dimType, 1);
            createChildBlock(++lastBlockN, currBlockInd, blocksSource, 1, sashesParams[impPointsQty]);
          }
          //----- change Template
          rebuildSVGTemplate();
        } else {
          //------ show error
          showErrorInBlock(blockID);
        }
    }





    function showErrorInBlock(blockID, svgSelector) {
      var idSVG = (svgSelector) ? svgSelector : globalConstants.SVG_ID_EDIT,
          currGlass = d3.select('#'+idSVG+' .glass[block_id='+blockID+']'),
          i = 1;
      currGlass.classed('error_glass', true);
      var interval = setInterval(function() {
        if(i === 11) {
          clearInterval(interval);
        }
        if(i%2) {
          currGlass.classed('error_glass', false);
        } else {
          currGlass.classed('error_glass', true);
        }
        i++;
      }, 50);
    }




    function deleteSash(glassObj) {
      var blockID = glassObj.attributes.block_id.nodeValue,
          blocks = DesignStor.design.templateSourceTEMP.details,
          blocksQty = blocks.length,
          isShtulp = 0;

      //---- save last step
      DesignStor.design.designSteps.push(angular.copy(DesignStor.design.templateSourceTEMP));

      for(var b = 1; b < blocksQty; b++) {
        if (blocks[b].id === blockID) {
          //console.log('delete sash-----', blocks[b]);

          //------- checking existing SHTULP
          isShtulp = checkShtulp(blocks[b].parent, blocks, blocksQty);
          if(isShtulp) {
            //----- delete children blocks and impost points
            removeAllChildrenBlock(blocks[isShtulp].children[0], blocks);
            removeAllChildrenBlock(blocks[isShtulp].children[1], blocks);
            blocks[isShtulp].children.length = 0;
            delete blocks[isShtulp].impost;

          } else {
            removeSashPropInBlock(blocks[b]);
          }
          break;
        }
      }
      //----- change Template
      rebuildSVGTemplate();
    }




    function checkShtulp(parentId, blocks, blocksQty) {
      var isShtulp = 0;
      while(--blocksQty > 0) {
        if(blocks[blocksQty].id === parentId) {
          if(blocks[blocksQty].impost) {
            if(blocks[blocksQty].impost.impostAxis[0].type === 'shtulp') {
              isShtulp = blocksQty;
            }
          }
        }
      }
      return isShtulp;
    }




    function removeSashPropInBlock(block) {
      block.blockType = 'frame';
      delete block.openDir;
      delete block.handlePos;
      delete block.sashType;
      delete block.gridId;
      delete block.gridTxt;
    }


    //------ delete sash if block sizes are small (add/remove arc)
    function checkSashesBySizeBlock(template) {
      var blocksSource = DesignStor.design.templateSourceTEMP.details,
          blocksQty = template.details.length,
          isSashDelet = 0;
      while(--blocksQty > 0) {
        if(template.details[blocksQty].level && template.details[blocksQty].blockType === 'sash') {
          var partsQty = template.details[blocksQty].parts.length;
          while(--partsQty > -1) {
            if(template.details[blocksQty].parts[partsQty].type === 'glass') {
              var minGlassSize = d3.min(template.details[blocksQty].parts[partsQty].sizes);
//              console.log('GLASS SIZES', minGlassSize);
              if(minGlassSize <= globalConstants.minSizeLimit && minGlassSize <= globalConstants.minSizeLimit) {
                //------ delete sash
                removeSashPropInBlock(blocksSource[blocksQty]);
                isSashDelet = 1;
              }
            }
          }
        }
      }
      return isSashDelet;
    }





    //++++++++++ Edit Corners ++++++++//



    function setCornerPoints(cornerObj) {
      var cornerID = cornerObj.__data__.id,
          cornerN = Number(cornerID.replace(/\D+/g, "")),
          blockID = cornerObj.attributes.block_id.nodeValue,
          blocksSource = DesignStor.design.templateSourceTEMP.details,
          blocks = DesignStor.design.templateTEMP.details,
          blocksQty = blocks.length;

      //---- save last step
      DesignStor.design.designSteps.push(angular.copy(DesignStor.design.templateSourceTEMP));

      while(--blocksQty > 0) {
        if(blocks[blocksQty].id === blockID) {
          //---- set simple corner
          if(cornerObj.__data__.view) {
            startCreateCornerPoint(cornerID, cornerN, blocks[blocksQty].linesOut, blocksQty, blocksSource);

          //----- change curve corner to simple
          } else {
            //---- delete qc point in blocks
            removePointQ('qc'+cornerN, blockID, blocksSource);
          }
        }
      }
      //----- change Template
      rebuildSVGTemplate();
    }


    function setCurvCornerPoints(cornerObj) {
      var cornerID = cornerObj.__data__.id,
          cornerN = Number(cornerID.replace(/\D+/g, "")),
          blockID = cornerObj.attributes.block_id.nodeValue,
          blocksSource = DesignStor.design.templateSourceTEMP.details,
          blocks = DesignStor.design.templateTEMP.details,
          blocksQty = blocks.length;

      //---- save last step
      DesignStor.design.designSteps.push(angular.copy(DesignStor.design.templateSourceTEMP));

      while(--blocksQty > 0) {
        if(blocks[blocksQty].id === blockID) {
          //----- set curve corner
          if (cornerObj.__data__.view) {
            startCreateCornerPoint(cornerID, cornerN, blocks[blocksQty].linesOut, blocksQty, blocksSource);
            createQCPoint(cornerN, blocksQty, blocksSource);
          //----- change simple corner to corve
          } else {
            var linesQty = blocks[blocksQty].linesOut.length;
            for (var l = 0; l < linesQty; l++) {
              if (blocks[blocksQty].linesOut[l].from.id === 'c'+cornerN+'-2' && blocks[blocksQty].linesOut[l].to.id === 'c'+cornerN+'-1' ) {
                createCurveQPoint('corner', 'qc'+cornerN, blocks[blocksQty].linesOut[l], cornerN, blocksQty, blocksSource);
              }
            }
          }
        }
      }
      //----- change Template
      rebuildSVGTemplate();
    }


    function startCreateCornerPoint(cornerID, cornerN, lines, blockIndex, blocks) {
      var linesQty = lines.length;
      for(var l = 0; l < linesQty; l++) {
        if(lines[l].from.id === cornerID) {
          createCornerPoint(1, cornerN, lines[l], blockIndex, blocks);
        } else if(lines[l].to.id === cornerID) {
          createCornerPoint(2, cornerN, lines[l], blockIndex, blocks);
        }
      }
      //----- hide this point
      var pointsOutQty = blocks[blockIndex].pointsOut.length;
      while(--pointsOutQty > -1) {
        if(blocks[blockIndex].pointsOut[pointsOutQty].id === cornerID) {
          blocks[blockIndex].pointsOut[pointsOutQty].view = 0;
        }
      }
    }


    function createCornerPoint(pointN, cornerN, line, blockIndex, blocks) {
      var dictance = 200,
          cornerPoint = {
            type:'corner',
            id: 'c' + cornerN + '-' + pointN,
            dir:'line'
          };
      if(pointN === 1) {
        cornerPoint.x = ( line.from.x * (line.size - dictance) + line.to.x * dictance)/ line.size;
        cornerPoint.y = ( line.from.y * (line.size - dictance) + line.to.y * dictance)/ line.size;
      } else if(pointN === 2) {
        cornerPoint.x = ( line.from.x * dictance + line.to.x * (line.size - dictance))/ line.size;
        cornerPoint.y = ( line.from.y * dictance + line.to.y * (line.size - dictance))/ line.size;
      }
      blocks[blockIndex].pointsOut.push(cornerPoint);
    }


    function createQCPoint(cornerN, blocksInd, blocks) {
      var pointOutQty = blocks[blocksInd].pointsOut.length,
          currLine = {};
      while (--pointOutQty > -1) {
        if(blocks[blocksInd].pointsOut[pointOutQty].type === 'corner') {
          if (blocks[blocksInd].pointsOut[pointOutQty].id === 'c' + cornerN + '-2') {
            currLine.from = blocks[blocksInd].pointsOut[pointOutQty];
          }
          if (blocks[blocksInd].pointsOut[pointOutQty].id === 'c' + cornerN + '-1') {
            currLine.to = blocks[blocksInd].pointsOut[pointOutQty];
          }
        }
      }
      SVGServ.setLineCoef(currLine);
      //currLine.size = GeneralServ.rounding10( (Math.hypot((currLine.to.x - currLine.from.x), (currLine.to.y - currLine.from.y))) );
      currLine.size = GeneralServ.roundingValue( (Math.hypot((currLine.to.x - currLine.from.x), (currLine.to.y - currLine.from.y))), 1 );
      createCurveQPoint('corner', 'qc'+cornerN, currLine, cornerN, blocksInd, blocks);
    }


    function createCurveQPoint(typeQ, idQ, line, position, blockIndex, blocks) {
      var pointQ = {
        type: typeQ,
        blockId: blocks[blockIndex].id,
        id: idQ,
        heightQ: line.size/4,
        fromPId: line.from.id,
        toPId: line.to.id,
        positionQ: position
      };
      //---- insert impostPoint in parent block
      if(!blocks[blockIndex].pointsQ) {
        blocks[blockIndex].pointsQ = [];
      }
      blocks[blockIndex].pointsQ.push(pointQ);
    }





    function deleteCornerPoints(cornerObj) {
      var cornerID = cornerObj.__data__.id,
          cornerN = Number(cornerID.replace(/\D+/g, "")),
          blockID = cornerObj.attributes.block_id.nodeValue,
          blocksSource = DesignStor.design.templateSourceTEMP.details,
          blocksSourceQty = blocksSource.length;

      //---- save last step
      DesignStor.design.designSteps.push(angular.copy(DesignStor.design.templateSourceTEMP));

      //------- delete corner point in block
      removePoint(['c' + cornerN + '-1', 'c' + cornerN + '-2'], blockID, blocksSource);

      //------- delete Q point in block
      removePointQ('qc'+cornerN, blockID, blocksSource);

      while(--blocksSourceQty > 0) {
        if(blocksSource[blocksSourceQty].id === blockID) {
          var pointsOutQty = blocksSource[blocksSourceQty].pointsOut.length;
          while(--pointsOutQty > -1) {
            if(blocksSource[blocksSourceQty].pointsOut[pointsOutQty].id === cornerID) {
              blocksSource[blocksSourceQty].pointsOut[pointsOutQty].view = 1;
            }
          }
        }
      }

      //----- change Template
      rebuildSVGTemplate();
    }


    function removePoint(criterions, blockId, blocks) {
      var blockQty = blocks.length;
      while(--blockQty > 0) {
        if(blocks[blockQty].id === blockId) {
          var pointsQty = blocks[blockQty].pointsOut.length;
          while(--pointsQty > -1) {
            var critQty = criterions.length;
            while(--critQty > -1) {
              if(blocks[blockQty].pointsOut[pointsQty].id === criterions[critQty]) {
                blocks[blockQty].pointsOut.splice(pointsQty, 1);
                break;
              }
            }
          }
        }
      }
    }


    function removePointQ(criterion, blockId, blocks) {
      var blockQty = blocks.length;
      while(--blockQty > 0) {
        if(blocks[blockQty].id === blockId) {
          if(blocks[blockQty].pointsQ) {
            var qQty = blocks[blockQty].pointsQ.length;
            while(--qQty > -1) {
              if(blocks[blockQty].pointsQ[qQty].id === criterion) {
                blocks[blockQty].pointsQ.splice(qQty, 1);
                break;
              }
            }
          }
        }
      }
    }




    //++++++++++ Edit Arc ++++++++//


    function createArc(arcObj) {
      var defer = $q.defer();
      if(!$.isEmptyObject(arcObj)) {

        var arc = arcObj.__data__;
//        console.log('+++++++++++++ ARC +++++++++++++++++++++');
        //------ make changes only if element is frame, don't touch arc
        if (arc.type === 'frame') {
          var arcN = Number(arc.points[0].id.replace(/\D+/g, "")),
              blockID = arcObj.attributes.block_id.nodeValue,
              blocks = angular.copy(DesignStor.design.templateTEMP.details),
              blocksQty = blocks.length,
              blocksSource = DesignStor.design.templateSourceTEMP.details,
              currBlockIndex, currLine, position;

          //---- save last step
          DesignStor.design.designSteps.push(angular.copy(DesignStor.design.templateSourceTEMP));

          //------- find line and block in order to insert Q point
          for (var b = 1; b < blocksQty; b++) {
            if (blocks[b].id === blockID) {
              var linesQty = blocks[b].linesOut.length;
              while (--linesQty > -1) {
                if (blocks[b].linesOut[linesQty].from.id === arc.points[0].id && blocks[b].linesOut[linesQty].to.id === arc.points[1].id) {
                  currBlockIndex = b;
                  currLine = blocks[b].linesOut[linesQty];
                }
              }
            }
          }
          //------ up
          if (arc.points[0].fi < 180 && arc.points[1].fi < 180) {
            position = 1;
            //------ right
          } else if (arc.points[0].fi < 90 && arc.points[1].fi > 270) {
            position = 2;
            //------ down
          } else if (arc.points[0].fi > 180 && arc.points[1].fi > 180) {
            position = 3;
            //------ left
          } else if (arc.points[0].fi < 270 && arc.points[1].fi > 90) {
            position = 4;
          }
          var coordQ = SVGServ.setQPointCoord(position, currLine, currLine.size / 2);
          if (position === 1) {
            shiftingAllPoints(1, 0, coordQ.y, blocks);
            shiftingAllPoints(1, 0, coordQ.y, blocksSource);
            coordQ.y = 0;
          } else if (position === 4) {
            shiftingAllPoints(1, 1, coordQ.x, blocks);
            shiftingAllPoints(1, 1, coordQ.x, blocksSource);
            coordQ.x = 0;
          }
          //------- rebuild linesOut after shifting of points
          if (!coordQ.y || !coordQ.x) {
            currLine = rebuildLinesOut(arc.points, currBlockIndex, blocksSource);
          }
          createCurveQPoint('arc', 'qa'+arcN, currLine, position, currBlockIndex, blocksSource);

          //------ change templateTEMP
          SVGServ.createSVGTemplate(DesignStor.design.templateSourceTEMP, ProductStor.product.profileDepths).then(function (result) {
            //------ delete sash if block sizes are small
            var wasSashDelet = checkSashesBySizeBlock(result);
            if (wasSashDelet) {
              SVGServ.createSVGTemplate(DesignStor.design.templateSourceTEMP, ProductStor.product.profileDepths).then(function (result) {
                DesignStor.design.templateTEMP = angular.copy(result);
                defer.resolve('done');
              });
            } else {
              DesignStor.design.templateTEMP = angular.copy(result);
              defer.resolve('done');
            }

          });

        } else {
          defer.resolve('done');
        }
      }
      return defer.promise;
    }


    function shiftingAllPoints(dir, param, shift, blocks) {
      var blocksQty = blocks.length;
      while(--blocksQty > 0) {
        if(blocks[blocksQty].level) {
          //------ pointsOut
          if(blocks[blocksQty].pointsOut.length) {
            shiftingCoordPoints(dir, param, blocks[blocksQty].pointsOut, blocks[blocksQty].pointsOut.length, shift);
          }
          //------ pointsIn
          if(blocks[blocksQty].pointsIn.length) {
            shiftingCoordPoints(dir, param, blocks[blocksQty].pointsIn, blocks[blocksQty].pointsIn.length, shift);
          }
          //------ impostAxis
          if(blocks[blocksQty].impost) {
            var impostAxisQty = blocks[blocksQty].impost.impostAxis.length;
            if(impostAxisQty) {
              shiftingCoordPoints(dir, param, blocks[blocksQty].impost.impostAxis, impostAxisQty, shift);
            }
          }
        }
      }
    }

    function shiftingCoordPoints(dir, param, points, pointsQty, shift) {
      while(--pointsQty > -1) {
        if(param) {
          if(dir) {
            points[pointsQty].x += shift;
          } else {
            points[pointsQty].x -= shift;
          }
        } else {
          if(dir) {
            points[pointsQty].y += shift;
          } else {
            points[pointsQty].y -= shift;
          }
        }
      }
    }

    function rebuildLinesOut(arc, blockIndex, blocks) {
      var currLine,
          center = SVGServ.centerBlock(blocks[blockIndex].pointsOut),
          pointsOut = SVGServ.sortingPoints(blocks[blockIndex].pointsOut, center),
          linesOut = SVGServ.setLines(pointsOut),
          linesQty = linesOut.length;
      while(--linesQty > -1) {
        if(linesOut[linesQty].from.id === arc[0].id && linesOut[linesQty].to.id === arc[1].id) {
          currLine = linesOut[linesQty];
        }
      }
      return currLine;
    }



    function deleteArc(arcObj) {
      var defer = $q.defer();
      if(!$.isEmptyObject(arcObj)) {
        var arc = arcObj.__data__;
//console.log('DELET ARC+++++++',arc);
        if (arc.type === 'arc') {
          var arcID = arc.points[1].id,
              blockID = arcObj.attributes.block_id.nodeValue,
              blocksSource = DesignStor.design.templateSourceTEMP.details;

          //---- save last step
          DesignStor.design.designSteps.push(angular.copy(DesignStor.design.templateSourceTEMP));

          //------- delete Q point in block (pointsQ)
          removePointQ(arcID, blockID, blocksSource);

          //------ unshifting
          if (!arc.points[1].x) {
            shiftingAllPoints(0, 1, arc.points[0].x, blocksSource);
          } else if (!arc.points[1].y) {
            shiftingAllPoints(0, 0, arc.points[0].y, blocksSource);
          }

          //------ change templateTEMP
          SVGServ.createSVGTemplate(DesignStor.design.templateSourceTEMP, ProductStor.product.profileDepths).then(function (result) {
            //------ delete sash if block sizes are small
            var wasSashDelet = checkSashesBySizeBlock(result);
            if (wasSashDelet) {
              SVGServ.createSVGTemplate(DesignStor.design.templateSourceTEMP, ProductStor.product.profileDepths).then(function (result) {
                DesignStor.design.templateTEMP = angular.copy(result);
                defer.resolve('done');
              });
            } else {
              DesignStor.design.templateTEMP = angular.copy(result);
              defer.resolve('done');
            }

          });

        } else {
          defer.resolve('done');
        }
      }
      return defer.promise;
    }


    function workingWithAllArcs(param) {
      var firstArc = DesignStor.design.selectedArc.shift(),
          arcId = firstArc.attributes.item_id.nodeValue,
          currElem = d3.select('#'+globalConstants.SVG_ID_EDIT+' [item_id='+arcId+']');
      if(currElem[0].length) {
        if(param) {
          createArc(currElem[0][0]).then(function() {
            if(DesignStor.design.selectedArc.length) {
              $timeout(function() {
                workingWithAllArcs(param);
              }, 1)
            }
          });
        } else {
          deleteArc(currElem[0][0]).then(function() {
            if(DesignStor.design.selectedArc.length) {
              $timeout(function() {
                workingWithAllArcs(param);
              }, 1)
            }
          });
        }
      }
    }





    //++++++++++ Edit Imposts ++++++++//


    function createImpost(impType, glassObj) {
      var glass = glassObj.__data__,
          blockID = glassObj.attributes.block_id.nodeValue,
          minGlassSize = d3.min(glass.sizes),
          blocks = DesignStor.design.templateTEMP.details,
          blocksQty = blocks.length,
          blocksSource = DesignStor.design.templateSourceTEMP.details,
          angel, dimType = 0, isImpCurv = 0, positionQ, currBlockInd, curBlockN, lastBlockN, impVector, crossPoints;


      if(minGlassSize >= globalConstants.minSizeLimit && glass.square >= globalConstants.squareLimit) {
//      if(glass.square >= globalConstants.squareLimit) {

        //---- save last step
        DesignStor.design.designSteps.push(angular.copy(DesignStor.design.templateSourceTEMP));

        //-------- dimType x = 0, y = 1

        switch (impType) {
          //----- vertical
          case 2:
            angel = 90;
            break;
          //----- horisontal
          case 3:
            angel = 180;
            dimType = 1;
            break;
          //----- inclined right
          case 4:
            angel = 170;
            dimType = 1;
            break;
          case 5:
            angel = 190;
            dimType = 1;
            break;
          //----- inclined left
          case 6:
            angel = 80;
            break;
          case 7:
            angel = 100;
            break;

          //----- curve vertical
          case 8:
            angel = 90;
            isImpCurv = 1;
            positionQ = 2; //---right
            break;
          case 9:
            angel = 90;
            isImpCurv = 1;
            positionQ = 4; //---left
            break;
          //----- curve horisontal
          case 10:
            angel = 180;
            dimType = 1;
            isImpCurv = 1;
            positionQ = 1; //--- up
            break;
          case 11:
            angel = 180;
            dimType = 1;
            isImpCurv = 1;
            positionQ = 3; //--- down
            break;
          //----- inclined right curve
          case 12:
            angel = 100;
            isImpCurv = 1;
            positionQ = 1; //---- left-up
            break;
          case 13:
            angel = 100;
            isImpCurv = 1;
            positionQ = 3; //---- right-down
            break;
          //----- inclined left curve
          case 14:
            angel = 10;
            dimType = 1;
            isImpCurv = 1;
            positionQ = 4; //----- left-down
            break;
          case 15:
            angel = 10;
            dimType = 1;
            isImpCurv = 1;
            positionQ = 2; //----- right-up
            break;
        }
        //------- find lines as to current block
        for (var b = 1; b < blocksQty; b++) {
          if (blocks[b].id === blockID) {
            currBlockInd = b;
            curBlockN = Number(blocks[b].id.replace(/\D+/g, ""));
          }
        }
        lastBlockN = getLastBlockNumber(blocksSource);
        impVector = SVGServ.cteateLineByAngel(blocks[currBlockInd].center, angel);
//        console.log('~~~~~~~~~~~~impVector~~~~~~~~', impVector);
        crossPoints = getImpostCrossPointInBlock(impVector, blocks[currBlockInd].linesOut);

        if(crossPoints.length > 2) {
          sliceExtraPoints(crossPoints);
        }

        var impPointsQty = crossPoints.length;
        if (impPointsQty === 2) {

          while (--impPointsQty > -1) {
//            createImpostPoint(crossPoints[impPointsQty], curBlockN, currBlockInd, blocksSource, impPointsQty);
            createImpostPoint(crossPoints[impPointsQty], curBlockN, currBlockInd, blocksSource, dimType);
            createChildBlock(++lastBlockN, currBlockInd, blocksSource);
          }
          //------- if impost is curve
          if (isImpCurv) {
            var distMax = getRadiusMaxImpostCurv(positionQ, impVector, blocks[currBlockInd].linesIn, blocks[currBlockInd].pointsIn);
            createImpostQPoint(distMax, positionQ, curBlockN, currBlockInd, blocksSource);
          }

          //----- change Template
          rebuildSVGTemplate();
        } else {
          //------ show error
          showErrorInBlock(blockID);
          //TODO reload again createImpost(impType, glassObj) with angel changed +10 degree
        }

      } else {
        //------ show error
        showErrorInBlock(blockID);
      }
    }




    function getLastBlockNumber(blocks) {
      var blocksQty = blocks.length,
          blockN = 0;
      while(--blocksQty > 0) {
        var tempN = Number(blocks[blocksQty].id.replace(/\D+/g, ""));
        if(tempN > blockN) {
          blockN = tempN;
        }
      }
      return blockN;
    }


    function getImpostCrossPointInBlock(vector, lines) {
      var impPoints = [],
          linesQty = lines.length;
      for(var l = 0; l < linesQty; l++) {
        var coord, checkPoint;
        //console.log('~~~~~~~~~~~~lines[l]~~~~~~~~', lines[l]);
        coord = SVGServ.getCoordCrossPoint(vector, lines[l]);
        if(coord.x >= 0 && coord.y >= 0) {
          //------ checking is cross point inner of line
          checkPoint = SVGServ.checkLineOwnPoint(coord, lines[l].to, lines[l].from);
          //console.log('~~~~~~~~~~~~checkPoint~~~~~~~~', checkPoint);
          var isCross = SVGServ.isInsidePointInLine(checkPoint);
          if(isCross) {
            //---- checking dublicats
            var noExist = SVGServ.checkEqualPoints(coord, impPoints);
            if(noExist) {

              //----------- avoid insert impost in corner
              var noInCorner1 = checkImpPointInCorner(lines[l].from, coord);
              if(noInCorner1) {
                var noInCorner2 = checkImpPointInCorner(lines[l].to, coord);
                if(noInCorner2) {
//                  console.log('IMp++++++++++ line', lines[l]);
//                  console.log('~~~~~~~~~~~~coord~~~~~~~~', coord);
                  impPoints.push(coord);
                }
              }
            }
          }
        }
      }
      return impPoints;
    }



    function sliceExtraPoints(points) {
      var diff = 5,
          pQty = points.length;
      while(--pQty > -1) {
        var pQty2 = points.length;
        while(--pQty2 > -1){
          var difX = Math.abs( points[pQty].x - points[pQty2].x),
              difY = Math.abs( points[pQty].y - points[pQty2].y);
          if(difX > 0 && difX < diff) {
            if(difY > 0 && difY < diff) {
              points.splice(pQty, 1);
              break;
            }
          }
        }
      }
    }



    function checkImpPointInCorner(linePoint, impPoint) {
      var noMatch = 1,
          limit = 40,
          xDiff = impPoint.x - linePoint.x,
          yDiff = impPoint.y - linePoint.y;

      if(xDiff > 0 && xDiff < limit) {
        if(yDiff > 0 && yDiff < limit) {
          noMatch = 0;
        }
      }
      return noMatch;
    }


    function createImpostPoint(coord, curBlockN, blockIndex, blocks, dimType, isShtulp) {
      var impPoint = {
        type:'impost',
        id:'ip'+curBlockN,
        x: Math.round(coord.x),
        y: Math.round(coord.y),
        dir:'line',
        dimType: dimType
      };
      //---------- for SHTULP
      if(isShtulp) {
        impPoint.type = 'shtulp';
        impPoint.id = 'sht'+curBlockN;
      }
      //---- insert impostPoint in parent block
      if(!blocks[blockIndex].impost) {
        blocks[blockIndex].impost = {
          impostAxis: [],
          impostOut: [],
          impostIn: []
        };
      }
      blocks[blockIndex].impost.impostAxis.push(impPoint);
    }


    function createChildBlock (blockN, blockIndex, blocks, isShtulp, sashParams) {
      var newBlock = {
        type: 'skylight',
        id: 'block_' + blockN,
        level: blocks[blockIndex].level + 1,
        blockType: 'frame',
        parent: blocks[blockIndex].id,
        children: [],
        pointsOut: [],
        pointsIn: [],
        parts: [],
        glassId: blocks[blockIndex].glassId,
        glassTxt: blocks[blockIndex].glassTxt
      };

      //---------- for SHTULP
      if(isShtulp) {
        newBlock.blockType = 'sash';
        angular.extend(newBlock, sashParams);
      }

      //---- add Id new block in parent block
      blocks[blockIndex].children.push(newBlock.id);
      //---- insert block in blocks
      blocks.push(newBlock);
    }


    function getRadiusMaxImpostCurv(position, impVector, linesIn, pointsIn) {
//      console.log('!!!!!!!!!!getRadiusMaxImpostCurv!!!!!!!!!');

      var crossPointsIn = getImpostCrossPointInBlock(impVector, linesIn);
//      console.log('!!!!!!!!!!crossPointsIn!!!!!!!!!', crossPointsIn);
      if(crossPointsIn.length === 2) {
        var impLine = {
              from: crossPointsIn[0],
              to: crossPointsIn[1]
            },
            //impRadius = GeneralServ.rounding10( (Math.hypot((impLine.from.x - impLine.to.x), (impLine.from.y - impLine.to.y)) / 2) ),
            impRadius = GeneralServ.roundingValue( (Math.hypot((impLine.from.x - impLine.to.x), (impLine.from.y - impLine.to.y)) / 2), 1 ),
            pointsIn = angular.copy(pointsIn),
            pointsQty = pointsIn.length,
            currPoints = [],
            currBlockCenter,
            distCenterToImpost,
            coordQ, posQ;

        SVGServ.setLineCoef(impLine);
        coordQ = SVGServ.setQPointCoord(position, impLine, impRadius);
        //------ if impost vert or hor
        if (!impLine.coefA && position === 1) {
          coordQ.y -= impRadius * 2;
        } else if (!impLine.coefB && position === 4) {
          coordQ.x -= impRadius * 2;
        }
        posQ = SVGServ.setPointLocationToLine(impLine.from, impLine.to, coordQ);
        while (--pointsQty > -1) {
          var posP = SVGServ.setPointLocationToLine(impLine.from, impLine.to, pointsIn[pointsQty]);
          if (posP > 0 && posQ > 0) {
            currPoints.push(pointsIn[pointsQty]);
          } else if (posP < 0 && posQ < 0) {
            currPoints.push(pointsIn[pointsQty]);
          }
        }
        currPoints.push(impLine.from, impLine.to);
//        console.log('!!!!!!!!!!currPoints!!!!!!!!!', currPoints);
        currBlockCenter = SVGServ.centerBlock(currPoints);
//        console.log('!!!!!!!!!!currBlockCenter!!!!!!!!!', currBlockCenter);
//        distCenterToImpost = GeneralServ.rounding10( (Math.abs((impLine.coefA * currBlockCenter.x + impLine.coefB * currBlockCenter.y + impLine.coefC) / Math.hypot(impLine.coefA, impLine.coefB))) );
        distCenterToImpost = GeneralServ.roundingValue( (Math.abs((impLine.coefA * currBlockCenter.x + impLine.coefB * currBlockCenter.y + impLine.coefC) / Math.hypot(impLine.coefA, impLine.coefB))), 1 );
//      console.log('IMP -------------',impRadius, distCenterToImpost);
        if (impRadius < distCenterToImpost) {
          return impRadius / 2;
        } else {
          return distCenterToImpost / 2;
        }
      }
    }


    function createImpostQPoint(dist, position, curBlockN, blockIndex, blocks) {
      var impQPoint = {
        blockId: blocks[blockIndex].id,
        dir:'curv',
        id: 'qi'+curBlockN,
        heightQ: dist,
        positionQ: position
      };
      blocks[blockIndex].impost.impostAxis.push(impQPoint);
    }






    function deleteImpost(impObj) {
      var blockID = impObj.attributes.block_id.nodeValue,
          blocksSource = DesignStor.design.templateSourceTEMP.details,
          blocksQty = blocksSource.length;

      //---- save last step
      DesignStor.design.designSteps.push(angular.copy(DesignStor.design.templateSourceTEMP));

      //----- delete children blocks and impost points
      while(--blocksQty > 0) {
        if(blocksSource[blocksQty].id === blockID) {
          removeAllChildrenBlock(blocksSource[blocksQty].children[0], blocksSource);
          removeAllChildrenBlock(blocksSource[blocksQty].children[1], blocksSource);
          blocksSource[blocksQty].children.length = 0;
          delete blocksSource[blocksQty].impost;
          break;
        }
      }

      //----- change Template
      rebuildSVGTemplate();
    }


    function removeAllChildrenBlock(blockID, blocks) {
      var blocksQty = blocks.length;
      while(--blocksQty > 0) {
        if(blocks[blocksQty].id === blockID) {
          var childQty = blocks[blocksQty].children.length;
          if(childQty) {
            removeAllChildrenBlock(blocks[blocksQty].children[0], blocks);
            removeAllChildrenBlock(blocks[blocksQty].children[1], blocks);
            blocks.splice(blocksQty, 1);
          } else {
            blocks.splice(blocksQty, 1);
          }
          break;
        }
      }

    }





    /**++++++++++ Create Mirror ++++++++*/


    function initMirror() {
      var blocks = DesignStor.design.templateSourceTEMP.details,
          blocksQty = blocks.length,
          points = SVGServ.collectAllPointsOut(DesignStor.design.templateTEMP.details),
          maxX = d3.max(points, function(d) { return d.x; });

      //---- save last step
      DesignStor.design.designSteps.push(angular.copy(DesignStor.design.templateSourceTEMP));

      changeCoordPointsAsMirror(maxX, blocks, blocksQty);

      for(var b = 1; b < blocksQty; b++) {
        if(blocks[b].level === 1) {
          changeChildrenIdChildren(b, blocksQty, blocks);
        }
      }
//      console.log('mirror blocks_________', blocks);
      rebuildSVGTemplate();
      $timeout(function() {
        DesignStor.design.activeMenuItem = 0;
      }, 500);
    }


    function changeCoordPointsAsMirror(maxX, blocks, blocksQty) {
      for(var b = 1; b < blocksQty; b++) {
        if(blocks[b].level && blocks[b].pointsQ) {
          var pqQty = blocks[b].pointsQ.length;
          if(pqQty) {
            while(--pqQty > -1) {
              if(blocks[b].pointsQ[pqQty].id.indexOf('qa')+1) {
                setOppositDirRadiusAsMirror(blocks[b].pointsQ[pqQty]);
              } else if(blocks[b].pointsQ[pqQty].id.indexOf('qc')+1) {
                setOppositDirRadiusInclinedAsMirror(blocks[b].pointsQ[pqQty]);
              }
            }
          }
        }
        if(blocks[b].impost) {
          setNewCoordPointsAsMirror(maxX, blocks[b].impost.impostAxis);
          //------- if impost curve - change Q
          if(blocks[b].impost.impostAxis[2]) {
            var tempLine = {
              from: blocks[b].impost.impostAxis[0],
              to: blocks[b].impost.impostAxis[1]
            };
            SVGServ.setLineCoef(tempLine);
            //--------- if horizontal or vertical
            if(!tempLine.coefA || !tempLine.coefB) {
              setOppositDirRadiusAsMirror(blocks[b].impost.impostAxis[2]);
            } else {
              setOppositDirRadiusInclinedAsMirror(blocks[b].impost.impostAxis[2]);
            }
          }
        }
        if(blocks[b].pointsOut.length) {
          setNewCoordPointsAsMirror(maxX, blocks[b].pointsOut);
        }
        if(blocks[b].pointsIn.length) {
          setNewCoordPointsAsMirror(maxX, blocks[b].pointsIn);
        }

      }
    }


    function setNewCoordPointsAsMirror(maxX, points) {
      var pointsQty = points.length;
      while(--pointsQty > -1) {
        //        if(points[pointsQty].type !== 'frame') {
        if (points[pointsQty].x === 0) {
          points[pointsQty].x = maxX;
        } else if (points[pointsQty].x === maxX) {
          points[pointsQty].x = 0;
        } else {
          points[pointsQty].x = maxX - points[pointsQty].x;
        }
        //        }
      }
    }


    function setOppositDirRadiusAsMirror(pointsQ) {
      if(pointsQ.positionQ === 4) {
        pointsQ.positionQ = 2;
      } else if(pointsQ.positionQ === 2) {
        pointsQ.positionQ = 4;
      }
    }


    function setOppositDirRadiusInclinedAsMirror(pointsQ) {
      if(pointsQ.positionQ === 4) {
        pointsQ.positionQ = 3;
      } else if(pointsQ.positionQ === 2) {
        pointsQ.positionQ = 1;
      } else if(pointsQ.positionQ === 1) {
        pointsQ.positionQ = 2;
      } else if(pointsQ.positionQ === 3) {
        pointsQ.positionQ = 4;
      }
    }


    function changeChildrenIdChildren(indexBlock, blocksQty, blocks) {
      var childQty = blocks[indexBlock].children.length;
      if(childQty) {
        //------- change Id place of children
        var lastChildId = blocks[indexBlock].children.pop();
        blocks[indexBlock].children.unshift(lastChildId);
        for(var b = 1; b < blocksQty; b++) {
          if(blocks[b].id === blocks[indexBlock].children[0] || blocks[b].id === blocks[indexBlock].children[1]) {
            //----- change children
            changeChildrenIdChildren(b, blocksQty, blocks);
          }
        }
      }

    }



    /**++++++++++ Set Position by Axises ++++++++*/


    function positionAxises() {
      var blocksSource = DesignStor.design.templateSourceTEMP.details,
          blocksQty = blocksSource.length,
          blocks = DesignStor.design.templateTEMP.details,
          parentBlocs = [], parentBlocsQty,
          impostInd = [],
          parentSizeMin, parentSizeMax, tempImpost,
          step, impostIndSort, impostIndQty, newX,
          isInside1, isInside2,
          b, p, i;

      //---- save last step
      DesignStor.design.designSteps.push(angular.copy(DesignStor.design.templateSourceTEMP));

      //----- find dimensions of block Level 1
      for(b = 1; b < blocksQty; b++) {
        if(blocksSource[b].level === 1) {
          parentBlocs.push(blocksSource[b].pointsOut.map(function(point) {
            return point.x;
          }));
        }
      }
      //console.info('impost parent----', parentBlocs);
      //----- find vertical imosts
      parentBlocsQty = parentBlocs.length;
      for(p = 0; p < parentBlocsQty; p++) {
        impostInd = [];
        parentSizeMin = d3.min(parentBlocs[p]);
        parentSizeMax = d3.max(parentBlocs[p]);

        //console.log('max/min', parentSizeMin, parentSizeMax);
        for(b = 1; b < blocksQty; b++) {
          if(blocksSource[b].impost) {
            if(blocksSource[b].impost.impostAxis) {
              //----- if impost vertical
              if(blocksSource[b].impost.impostAxis[0].x === blocksSource[b].impost.impostAxis[1].x) {
                //----- if impost belong to parent Block
                if(blocksSource[b].impost.impostAxis[0].x > parentSizeMin && blocksSource[b].impost.impostAxis[0].x < parentSizeMax) {
                  tempImpost = {ind: b, x: blocksSource[b].impost.impostAxis[0].x};
                  impostInd.push(tempImpost);
                  //console.info('impost', blocksSource[b].impost.impostAxis, tempImpost);
                }
              }
            }
          }
        }
        //----- set new step
        step = Math.round(parentSizeMax/(impostInd.length+1));
        impostIndSort = impostInd.sort(SVGServ.sortByX);
        impostIndQty = impostIndSort.length;

        for(i = 0; i < impostIndQty; i++) {
          //-------- insert back imposts X
          if(!i) {
            newX = (parentSizeMin + step);
          } else {
            newX = (impostIndSort[i-1].x + step);
          }
          //console.warn('final----', newX);
          //--------- checking is new impost Position inside of block
          isInside1 = isPointInsideBlock(blocks[impostIndSort[i].ind].pointsOut, newX, blocksSource[impostIndSort[i].ind].impost.impostAxis[0].y);
          isInside2 = isPointInsideBlock(blocks[impostIndSort[i].ind].pointsOut, newX, blocksSource[impostIndSort[i].ind].impost.impostAxis[1].y);
          //----- if inside
          if(!isInside1 && !isInside2) {
            impostIndSort[i].x = newX;
            blocksSource[impostIndSort[i].ind].impost.impostAxis[0].x = newX;
            blocksSource[impostIndSort[i].ind].impost.impostAxis[1].x = newX;
          }

        }
      }
      rebuildSVGTemplate();
    }



    function isPointInsideBlock(pointsOut, pointX, pointY) {
      var newP = {
            x: pointX,
            y: pointY
          },
          isInside = 0,
          tempInside = 0,
          pointsOutQty = pointsOut.length,
          p = 0;
      for(; p < pointsOutQty; p++) {
        if(pointsOut[p+1]) {
          tempInside = SVGServ.setPointLocationToLine(pointsOut[p], pointsOut[p+1], newP);
        } else {
          tempInside = SVGServ.setPointLocationToLine(pointsOut[p], pointsOut[0], newP);
        }
        if(tempInside > 0) {
          isInside = tempInside;
          break;
        }
      }
      return isInside;
    }




    /**++++++++++ Set Position by Glass Width ++++++++*/


    function positionGlasses() {
      var blocks = DesignStor.design.templateTEMP.details,
          blocksQty = blocks.length,
          blocksSource = DesignStor.design.templateSourceTEMP.details,
          selectedGlassQty = DesignStor.design.selectedGlass.length,
          blockID,
          selectedBlocks = [], selectedBlocksQty,
          glassWidthAvg,
          impQty1, impQty2, isImpClone,
          impsSBQty, impsSBQty2,
          step, isAprove,
          impostN, blockN,
          g, b, imp1, imp2, sb, isb, sb2, isb2, p;

      //---- save last step
      DesignStor.design.designSteps.push(angular.copy(DesignStor.design.templateSourceTEMP));

      //------- if is exist selected glasses
      if(selectedGlassQty) {
        for(g = 0; g < selectedGlassQty; g++) {
          blockID = DesignStor.design.selectedGlass[g].attributes.block_id.nodeValue;
          //----- find this block among all blocks
          for(b = 1; b < blocksQty; b++) {
            if(blocks[b].id === blockID) {
              prepareBlockXPosition(blocks[b], selectedBlocks);
            }
          }
        }
      } else {
        //-------- working with all glass
        //----- collect blocks with parallele imposts
        for(b = 1; b < blocksQty; b++) {
          //----- take block only with glass
          if(!blocks[b].children.length && blocks[b].glassPoints) {
            prepareBlockXPosition(blocks[b], selectedBlocks);
          }
        }
      }


      selectedBlocksQty = selectedBlocks.length;
      //------ common glass width for each selectedBlocks
      //glassWidthAvg = GeneralServ.rounding100(selectedBlocks.reduce(function(summ, item) {
      glassWidthAvg = GeneralServ.roundingValue(selectedBlocks.reduce(function(summ, item) {
        return {width: (summ.width + item.width)};
      }).width/selectedBlocksQty);

      //console.info(selectedBlocks, glassWidthAvg);


      //---- find common impost if 2 selectedBlocks
      if(selectedBlocksQty === 2) {
        //console.info('when 2 glass----');
        impQty1 = selectedBlocks[0].imps.length;
        impQty2 = selectedBlocks[1].imps.length;
        isImpClone = 0;
        circle1: for(imp1 = 0; imp1 < impQty1; imp1++) {
          for(imp2 = 0; imp2 < impQty2; imp2++) {
            if(selectedBlocks[1].imps[imp2].id === selectedBlocks[0].imps[imp1].id) {
              isImpClone = selectedBlocks[1].imps[imp2].id;
              break circle1;
            }
          }
        }
      }

      for(sb = 0; sb < selectedBlocksQty; sb++) {
        impsSBQty = selectedBlocks[sb].imps.length;
        step = Math.round(glassWidthAvg - selectedBlocks[sb].width);
        //console.info('step----', selectedBlocks[sb]);
        //console.info('step----', glassWidthAvg +' - '+ selectedBlocks[sb].width, step);
        for(isb = 0; isb < impsSBQty; isb++) {
          if(!selectedBlocks[sb].imps[isb].isChanged) {
            isAprove = 0;
            if(selectedBlocksQty === 2) {
              if(selectedBlocks[sb].imps[isb].id === isImpClone) {
                isAprove = 1;
              }
            } else {
              isAprove = 1;
            }
            if(isAprove) {
              if(selectedBlocks[sb].imps[isb].x < selectedBlocks[sb].maxX) {
                //----- if impost is left, it shoud be decrece if glass is bigger
                step *= -1;
              }
              selectedBlocks[sb].imps[isb].x += step;
              //console.info('impst----', selectedBlocks[sb].imps[isb].x);
              //------- set mark in equals impost other blocks
              for (sb2 = 0; sb2 < selectedBlocksQty; sb2++) {
                if (isb !== sb2) {
                  impsSBQty2 = selectedBlocks[sb2].imps.length;
                  for (isb2 = 0; isb2 < impsSBQty2; isb2++) {
                    if (sb !== sb2 && selectedBlocks[sb2].imps[isb2].id === selectedBlocks[sb].imps[isb].id) {
                      selectedBlocks[sb2].imps[isb2].isChanged = 1;
                      selectedBlocks[sb2].width -= step;
                    }
                  }
                }
              }
            }
          }
        }
      }
      //console.warn('FINISH----', selectedBlocks);
      //------- change imposts X in blockSource
      for(sb = 0; sb < selectedBlocksQty; sb++) {
        impsSBQty = selectedBlocks[sb].imps.length;
        for(isb = 0; isb < impsSBQty; isb++) {
          if(!selectedBlocks[sb].imps[isb].isChanged) {
            impostN = Number(selectedBlocks[sb].imps[isb].id.replace(/\D+/g, ""));
            for(p = 1; p < blocksQty; p++) {
              blockN = Number(blocksSource[p].id.replace(/\D+/g, ""));
              if(blockN === impostN) {
                if(blocksSource[p].impost) {
                  blocksSource[p].impost.impostAxis[0].x = selectedBlocks[sb].imps[isb].x*1;
                  blocksSource[p].impost.impostAxis[1].x = selectedBlocks[sb].imps[isb].x*1;
                }
              }
            }

          }
        }
      }
      rebuildSVGTemplate();
    }




    function prepareBlockXPosition(currBlock, selectedBlocks) {
      var selectedBlock = {imps: []},
          impostPoints = currBlock.pointsOut.filter(function(point) {
            return point.type === 'impost' || point.type === 'shtulp';
          }),
          impostPointsQty = impostPoints.length,
          isParall, isCouple, isExist, impsQty, glassXArr,
          i = 0, j;

      for(; i < impostPointsQty; i++) {
        isParall = 0;
        isCouple = 0;
        for(j = 0; j < impostPointsQty; j++) {
          if(i !== j) {
            if(impostPoints[j].id === impostPoints[i].id) {
              isCouple = 1;
              if(impostPoints[j].x === impostPoints[i].x) {
                isParall = 1
              }
            }
          }
        }
        //------ if only one point of impost, deselect this block
        if(!isCouple) {
          break;
        } else {
          if(isParall) {
            isExist = 1;
            impsQty = selectedBlock.imps.length;
            //------ seek dublicate
            while(--impsQty > -1) {
              if(selectedBlock.imps[impsQty].id === impostPoints[i].id) {
                isExist = 0
              }
            }
            if(isExist) {
              selectedBlock.imps.push(impostPoints[i]);
            }
          }
        }
      }

      if(selectedBlock.imps.length) {
        glassXArr = currBlock.glassPoints.map(function(item){return item.x});
        selectedBlock.minX = d3.min(glassXArr);
        selectedBlock.maxX = d3.max(glassXArr);
        selectedBlock.width = (selectedBlock.maxX - selectedBlock.minX);
        selectedBlocks.push(selectedBlock);
      }
    }







    /**=============== CHANGE CONSTRUCTION SIZE ==============*/


    //------- set click to all Dimensions
    function initAllDimension() {
      d3.selectAll('#'+globalConstants.SVG_ID_EDIT+' .size-box')
        .each(function() {
          var size = d3.select(this);
          size.on(clickEvent, function() {
            var sizeRect = size.select('.size-rect'),
                isActive = sizeRect[0][0].attributes[0].nodeValue.indexOf('active')+1;

            if(DesignStor.design.tempSize.length) {
              /** save new Size when click another size */
              closeSizeCaclulator();
              cleanTempSize();
            } else {
              if (isActive) {
                hideSizeTools();
              } else {
                deselectAllDimension();
                sizeRect.classed('active', true);
                var dim = size.select('.size-txt-edit');
                dim.classed('active', true);
                DesignStor.design.oldSize = dim[0][0];
                DesignStor.design.minSizeLimit = +dim[0][0].attributes[8].nodeValue;
                DesignStor.design.maxSizeLimit = +dim[0][0].attributes[9].nodeValue;
                //------- show caclulator or voice helper
                if (GlobalStor.global.isVoiceHelper) {
                  DesignStor.design.openVoiceHelper = 1;
                  startRecognition(doneRecognition, recognitionProgress, GlobalStor.global.voiceHelperLanguage);
                } else {
                  GlobalStor.global.isSizeCalculator = 1;
                  DesignStor.design.isMinSizeRestriction = 0;
                  DesignStor.design.isMaxSizeRestriction = 0;
                }
              }
              $rootScope.$apply();
            }
          });
        });

      /** switch on keyboard */
      d3.select(window)
        .on('keydown', function() {
          if(GlobalStor.global.isSizeCalculator) {
            pressCulculator(d3.event);
          }
        });
    }





    function doneRecognition(value) {
      //console.log("полученные данные", value);
      //console.log("тип полученных данных", typeof value);
      DesignStor.design.voiceTxt = value;
      $rootScope.$apply();
      $timeout(function() {
        var intValue = parseStringToDimension(value);
        //console.log("данные после парса", intValue);
        //console.log("тип полученных данных", typeof intValue);
        if (intValue == "NaN") {
          intValue = $filter('translate')('construction.VOICE_NOT_UNDERSTAND');
        }
        playTTS(intValue);
        setValueSize(intValue);
        $rootScope.$apply();
      }, 1000)
    }



    //---------- define voice force
    function recognitionProgress(value) {
      if (value > 100) {
        //console.log('value', value);
        DesignStor.design.loudVoice = true;
        DesignStor.design.quietVoice = false;

      } else {
        //console.log('value', value);
        DesignStor.design.loudVoice = false;
        DesignStor.design.quietVoice = true;
      }
      $rootScope.$apply();
    }






    /**=============== Size Calculator ==============*/


    function pressCulculator(keyEvent) {
      var newValue;
      //--------- Enter
      if (keyEvent.which === 13) {
        closeSizeCaclulator();
        $rootScope.$apply();
      } else if(keyEvent.which === 8) {
        //-------- Backspace
        deleteLastNumber();
      } else {
        switch(keyEvent.which) {
          case 48:
          case 96:
            newValue = 0;
            break;
          case 49:
          case 97:
            newValue = 1;
            break;
          case 50:
          case 98:
            newValue = 2;
            break;
          case 51:
          case 99:
            newValue = 3;
            break;
          case 52:
          case 100:
            newValue = 4;
            break;
          case 53:
          case 101:
            newValue = 5;
            break;
          case 54:
          case 102:
            newValue = 6;
            break;
          case 55:
          case 103:
            newValue = 7;
            break;
          case 56:
          case 104:
            newValue = 8;
            break;
          case 57:
          case 105:
            newValue = 9;
            break;
        }
        if(newValue !== undefined) {
          setValueSize(newValue);
        }
      }
    }


    //-------- Get number from calculator
    function setValueSize(newValue) {
      var sizeLength = DesignStor.design.tempSize.length;
      //console.log('take new value = ', newValue);
      if(GlobalStor.global.isVoiceHelper) {

        var tempVal = parseInt(newValue, 10);
        //console.log('tempVal=====', tempVal);
        DesignStor.design.voiceTxt = '';
        DesignStor.design.openVoiceHelper = false;

        if ((tempVal > 0) && (tempVal < 10000)) {
          DesignStor.design.tempSize = ("" + tempVal).split('');
          //console.log('$scope.constructData.tempSize == ', $scope.constructData.tempSize);
          changeSize();
        }
        deselectAllDimension();

      } else {
        //---- clear array from 0 after delete all number in array
        if (sizeLength === 4 || (sizeLength === 1 && !DesignStor.design.tempSize[0])) {
          DesignStor.design.tempSize.length = 0;
        }
        if (newValue === '0') {
          if (sizeLength && DesignStor.design.tempSize[0]) {
            DesignStor.design.tempSize.push(newValue);
            changeSize();
          }
        } else if(newValue === '00') {
          if (sizeLength && DesignStor.design.tempSize[0]) {
            if (sizeLength < 3) {
              DesignStor.design.tempSize.push(0, 0);
            } else if (sizeLength === 3) {
              DesignStor.design.tempSize.push(0);
            }
            changeSize();
          }
        } else {
          DesignStor.design.tempSize.push(newValue);
          changeSize();
        }
      }
    }



    //------ Delete last number from calculator
    function deleteLastNumber() {
      DesignStor.design.tempSize.pop();
      if(DesignStor.design.tempSize.length < 1) {
        DesignStor.design.tempSize.push(0);
      }
      changeSize();
    }





    //------ Change size on SVG
    function changeSize() {
      var newSizeString = '';
      for(var numer = 0; numer < DesignStor.design.tempSize.length; numer++) {
        newSizeString += DesignStor.design.tempSize[numer].toString();
      }
      var dim = d3.select(DesignStor.design.oldSize);
      dim.text(newSizeString);
      if(GlobalStor.global.isVoiceHelper) {
        closeSizeCaclulator();
      }
    }




    //------- Close Size Calculator
    function closeSizeCaclulator(prom) {
      var deff = $q.defer();
      if(DesignStor.design.tempSize.length) {
        var newLength = parseInt(DesignStor.design.tempSize.join(''), 10);
        //------- Dimensions limits checking
        if (newLength >= DesignStor.design.minSizeLimit && newLength <= DesignStor.design.maxSizeLimit) {

          addNewSizeInTemplate(newLength);
          //------ close size calculator and deactive size box in svg
          hideSizeTools();
          //----- change Template
          SVGServ.createSVGTemplate(DesignStor.design.templateSourceTEMP, ProductStor.product.profileDepths).then(function(result) {
            DesignStor.design.templateTEMP = angular.copy(result);
            cleanTempSize();
            deff.resolve(1);
          });
        } else {

          //------ show error size
          if(newLength < DesignStor.design.minSizeLimit) {
            if(GlobalStor.global.isVoiceHelper) {
              playTTS($filter('translate')('construction.VOICE_SMALLEST_SIZE'), GlobalStor.global.voiceHelperLanguage);
              //------- deactive size box in svg
              deselectAllDimension();
              //-------- build new template
              rebuildSVGTemplate();
            } else {
              DesignStor.design.isMinSizeRestriction = 1;
              DesignStor.design.isMaxSizeRestriction = 0;
            }
          } else if(newLength > DesignStor.design.maxSizeLimit) {
            if(GlobalStor.global.isVoiceHelper) {
              playTTS($filter('translate')('construction.VOICE_BIGGEST_SIZE'), GlobalStor.global.voiceHelperLanguage);
              //------- deactive size box in svg
              deselectAllDimension();
              //-------- build new template
              rebuildSVGTemplate();
            } else {
              DesignStor.design.isMinSizeRestriction = 0;
              DesignStor.design.isMaxSizeRestriction = 1;
            }
          }
          deff.resolve(1);
        }
      } else {
        //------ close size calculator and deselect All Dimension
        hideSizeTools();
        deff.resolve(1);
      }
      DesignStor.design.openVoiceHelper = 0;
      DesignStor.design.loudVoice = 0;
      DesignStor.design.quietVoice = 0;
      //console.log('FINISH CACL');
      if(prom) {
        return deff.promise;
      }
    }





    function addNewSizeInTemplate(newLength) {
      DesignStor.design.isMinSizeRestriction = 0;
      DesignStor.design.isMaxSizeRestriction = 0;

      //---- save last step
      DesignStor.design.designSteps.push(angular.copy(DesignStor.design.templateSourceTEMP));


      //-------- change point coordinates in templateSource
      var blocks = DesignStor.design.templateSourceTEMP.details,
          blocksOLD = DesignStor.design.templateTEMP.details,
          curBlockId = DesignStor.design.oldSize.attributes[6].nodeValue,
          curDimType = DesignStor.design.oldSize.attributes[5].nodeValue,
          dimId = DesignStor.design.oldSize.attributes[10].nodeValue,
          blocksQty = blocks.length;

      //          console.log('SIZE ````````curBlockId````````', curBlockId);
      //          console.log('SIZE ````````curDimType````````', curDimType);
      //          console.log('SIZE ````````dimId````````', dimId);


      if(curDimType === 'curve') {
        //============ changing Radius

        var newHeightQ = culcHeightQByRadiusCurve(+DesignStor.design.oldSize.attributes[11].nodeValue, newLength);

        mainFor: for (var b = 1; b < blocksQty; b++) {
          if(blocks[b].id === curBlockId) {
            //-------- search in PointsQ
            if(blocks[b].pointsQ) {
              var pointsQQty = blocks[b].pointsQ.length;
              while(--pointsQQty > -1) {
                if(blocks[b].pointsQ[pointsQQty].id === dimId) {
                  blocks[b].pointsQ[pointsQQty].heightQ = newHeightQ;
                  break mainFor;
                }
              }
            }
            //-------- search in Imposts
            if(blocks[b].impost) {
              if(blocks[b].impost.impostAxis[2].id === dimId) {
                blocks[b].impost.impostAxis[2].heightQ = newHeightQ;
                break mainFor;
              }
            }

          }
        }

      } else if(dimId.indexOf('qa')+1) {
        //========== changing Arc Height

        for(var b = 1; b < blocksQty; b++) {
          if(blocks[b].level === 1) {
            var pointsQQty = blocks[b].pointsQ.length;
            if(pointsQQty) {
              while(--pointsQQty > -1) {
                if(blocks[b].pointsQ[pointsQQty].id === dimId) {
                  blocks[b].pointsQ[pointsQQty].heightQ = newLength;
                  //                      console.log('ARC height=====', blocks[b].pointsQ[pointsQQty]);
                }
              }
            }
          }
        }

      } else {
        //========== changing Line dimension

        var startSize = +DesignStor.design.oldSize.attributes[11].nodeValue,
            oldSizeValue = +DesignStor.design.oldSize.attributes[12].nodeValue,
            axis = DesignStor.design.oldSize.attributes[13].nodeValue;

        //            console.log('SIZE ````````newLength````````', newLength);
        //            console.log('SIZE ````````startSize````````', startSize);
        //            console.log('SIZE ````````oldSizeValue````````', oldSizeValue);
        //            console.log('SIZE ````````axis````````', axis);

        for(var b = 1; b < blocksQty; b++) {
          var pointsOutQty = blocks[b].pointsOut.length;
          if(pointsOutQty) {
            while(--pointsOutQty > -1) {
              if(axis === 'x') {
                if (blocks[b].pointsOut[pointsOutQty].x === oldSizeValue) {
                  blocks[b].pointsOut[pointsOutQty].x = startSize + newLength;
                }
              } else if(axis === 'y') {
                if (blocks[b].pointsOut[pointsOutQty].y === oldSizeValue) {
                  blocks[b].pointsOut[pointsOutQty].y = startSize + newLength;
                }
              }
            }
          }
          if(blocks[b].impost) {
            for(var i = 0; i < 2; i++) {
              if(axis === 'x') {
                if (blocks[b].impost.impostAxis[i].x === oldSizeValue) {
                  blocks[b].impost.impostAxis[i].x = startSize + newLength;
                  //                      console.log('SIZE ````````x````````', blocks[b].impost.impostAxis[i]);
                }
              } else if (axis === 'y') {
                if (blocks[b].impost.impostAxis[i].y === oldSizeValue) {
                  blocks[b].impost.impostAxis[i].y = startSize + newLength;
                  //                      console.log('SIZE ````````y````````', blocks[b].impost.impostAxis[i]);
                }
              }
            }
          }
        }

      }
    }







    function cleanTempSize() {
      DesignStor.design.tempSize.length = 0;
      DesignStor.design.isMinSizeRestriction = 0;
      DesignStor.design.isMaxSizeRestriction = 0;
    }


    function culcHeightQByRadiusCurve(lineLength, radius) {
      //return GeneralServ.rounding10( (radius - Math.sqrt(Math.pow(radius,2) - Math.pow(lineLength,2)/4)) );
      return GeneralServ.roundingValue( (radius - Math.sqrt(Math.pow(radius,2) - Math.pow(lineLength,2)/4)), 1);
    }


    function hideSizeTools() {
      deselectAllDimension();
      GlobalStor.global.isSizeCalculator = 0;
      DesignStor.design.openVoiceHelper = 0;
    }


    function deselectAllDimension() {
      d3.selectAll('#'+globalConstants.SVG_ID_EDIT+' .size-rect').classed('active', false);
      d3.selectAll('#'+globalConstants.SVG_ID_EDIT+' .size-txt-edit').classed('active', false);
    }




//======================clear SVG====================//

    function removeAllEventsInSVG() {
      // console.log('remove remove remove remove remove remove')
      // //--------- delete click on imposts
      // d3.selectAll('#'+globalConstants.SVG_ID_EDIT+' [item_type=impost]')
      //   .each(function() {
      //     d3.select(this).on(clickEvent, null);
      //   });
      // //--------- delete click on glasses
      // d3.selectAll('#'+globalConstants.SVG_ID_EDIT+' .glass')
      //   .each(function() {
      //     d3.select(this).on(clickEvent, null);
      //   });
      // //--------- delete click on arcs
      // d3.selectAll('#'+globalConstants.SVG_ID_EDIT+' .frame')
      //   .each(function() {
      //     d3.select(this).on(clickEvent, null);
      //   });
      // //--------- delete click on dimension
      // d3.selectAll('#'+globalConstants.SVG_ID_EDIT+' .size-box')
      //   .each(function() {
      //     d3.select(this).on(clickEvent, null);
      //   });
      // //--------- delete event listener for keydown
      // d3.select(window).on('keydown', null);
    }


    function removeGlassEventsInSVG() {
      //--------- delete click on glasses
      d3.selectAll('#'+globalConstants.SVG_ID_GLASS+' .glass')
        .each(function() {
          d3.select(this).on(clickEvent, null)
            .classed('glass-active', false);
        });
      d3.selectAll('#'+globalConstants.SVG_ID_GRID+' .glass')
        .each(function() {
          d3.select(this).on(clickEvent, null)
            .classed('glass-active', false);
        });
      //--------- delete event listener for keydown
      d3.select(window).on('keydown', null);
    }



    function stepBack() {
      var lastIndex = DesignStor.design.designSteps.length - 1;
      DesignStor.design.templateSourceTEMP = angular.copy(DesignStor.design.designSteps[lastIndex]);
      SVGServ.createSVGTemplate(DesignStor.design.templateSourceTEMP, ProductStor.product.profileDepths).then(function(result) {
        DesignStor.design.templateTEMP = angular.copy(result);
      });
      DesignStor.design.designSteps.pop();
      cleanTempSize();
      hideSizeTools();
    }



  }
})();



// services/general_serv.js

(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('BauVoiceApp')
    .factory('GeneralServ', generalFactory);

  function generalFactory($filter, $window, $document, globalConstants, GlobalStor) {
    var thisFactory = this,
        addElementDATA = [
          /** GRID */
          {
            id: 20,
            name: $filter('translate')('add_elements.GRIDS'),
            typeClass: 'aux-grid',
            //colorClass: 'aux_color_connect',
            delay: globalConstants.STEP * 5
          },
          /** VISOR */
          {
            id: 21,
            name: $filter('translate')('add_elements.VISORS'),
            typeClass: 'aux-visor',
            //colorClass: 'aux_color_big',
            delay: globalConstants.STEP * 6
          },
          /**SPILLWAY*/
          {
            id: 9,
            name: $filter('translate')('add_elements.SPILLWAYS'),
            typeClass: 'aux-spillway',
            //colorClass: 'aux_color_middle',
            delay: globalConstants.STEP * 6
          },
          /**OUTSIDE*/
          {
            id: 19,
            name: $filter('translate')('add_elements.OUTSIDE'),
            typeClass: 'aux-outside',
            //colorClass: 'aux_color_slope',
            delay: globalConstants.STEP * 10
          },
          /**LOUVER*/
          {
            id: 26,
            name: $filter('translate')('add_elements.LOUVERS'),
            typeClass: 'aux-louver',
            //colorClass: 'aux_color_middle',
            delay: globalConstants.STEP * 15
          },
          /**INSIDESLOPE*/
          {
            id: 19,
            name: $filter('translate')('add_elements.INSIDE'),
            typeClass: 'aux-inside',
            //colorClass: 'aux_color_slope',
            delay: globalConstants.STEP * 20
          },
          /**CONNECTORS*/
          {
            id: 12,
            name: $filter('translate')('add_elements.CONNECTORS'),
            typeClass: 'aux-connectors',
            //colorClass: 'aux_color_connect',
            delay: globalConstants.STEP * 30
          },
          /**FAN*/
          {
            id: 27,
            name: $filter('translate')('add_elements.FAN'),
            typeClass: 'aux-fan',
            //colorClass: 'aux_color_small',
            delay: globalConstants.STEP * 31
          },
          /**WINDOWSILL*/
          {
            id: 8,
            name: $filter('translate')('add_elements.WINDOWSILLS'),
            typeClass: 'aux-windowsill',
            //colorClass: 'aux_color_big',
            delay: globalConstants.STEP * 13
          },
          /**HANDLE*/
          {
            id: 24,
            name: $filter('translate')('add_elements.HANDLELS'),
            typeClass: 'aux-handle',
            //colorClass: 'aux_color_middle',
            delay: globalConstants.STEP * 28
          },
          /**OTHERS*/
          {
            id: 18,
            name: $filter('translate')('add_elements.OTHERS'),
            typeClass: 'aux-others',
            //colorClass: 'aux_color_small',
            delay: globalConstants.STEP * 31
          }
        ];

    thisFactory.publicObj = {
      addElementDATA: addElementDATA,
      stopStartProg: stopStartProg,
      setPreviosPage: setPreviosPage,
      roundingValue: roundingValue,
      addMarginToPrice: addMarginToPrice,
      setPriceDis: setPriceDis,
      sorting: sorting,
      removeDuplicates: removeDuplicates,
      getMaxMinCoord: getMaxMinCoord,
      confirmAlert: confirmAlert
    };

    //TODO desktop
    //------- IMG rooms preload
    //$document.ready(function() {
    //  for(var i = 0; i < 16; i++) {
    //    $("<img />").attr("src", "img/rooms/"+i+".jpg");
    //  }
    //});

    //-------- blocking to refresh page
    //$window.onbeforeunload = function (){
    //  return $filter('translate')('common_words.PAGE_REFRESH');
    //};

    /** prevent Backspace back to previos Page */
    $window.addEventListener('keydown', function(e){
      if(e.keyCode === 8 && !$(e.target).is("input, textarea")){
        e.preventDefault();
      }
    });

    return thisFactory.publicObj;


    //============ methods ================//

    function stopStartProg() {
      if(GlobalStor.global.startProgramm && GlobalStor.global.currOpenPage === 'main') {
        GlobalStor.global.startProgramm = 0;
      }
    }

    function setPreviosPage() {
      GlobalStor.global.prevOpenPage = GlobalStor.global.currOpenPage;
    }


    function roundingValue(nubmer, radix) {
      var radix = (radix) ? radix : 2,
          numberType = typeof nubmer,
          roundRadix = '1', i = 0;

      for(; i < radix; i++) {
        roundRadix += '0';
      }
      roundRadix *= 1;

      if(numberType === 'string') {
        return parseFloat( (Math.round(parseFloat(nubmer) * roundRadix) / roundRadix).toFixed(radix) );
      } else if(numberType === 'number') {
        return parseFloat( (Math.round(nubmer * roundRadix) / roundRadix).toFixed(radix) );
      }
    }

    /** price Margins of Plant */
    function addMarginToPrice(price, margin) {
      return price * margin;
    }

    function setPriceDis(price, discount) {
      return roundingValue( price * (1 - discount/100) );
    }

    function sorting(a, b) {
      return a - b;
    }

    function removeDuplicates(arr) {
      return arr.filter(function(elem, index, self) {
        return index == self.indexOf(elem);
      });
    }


    function getMaxMinCoord(points) {
      var overall = {
        minX: d3.min(points, function(d) { return d.x; }),
        maxX: d3.max(points, function(d) { return d.x; }),
        minY: d3.min(points, function(d) { return d.y; }),
        maxY: d3.max(points, function(d) { return d.y; })
      };
      return overall;
    }


    function confirmAlert(title, descript, callback) {
      GlobalStor.global.isAlert = 1;
      GlobalStor.global.alertTitle = title || '';
      GlobalStor.global.alertDescr = descript || '';
      GlobalStor.global.confirmAction = callback;
    }

  }
})();



// services/history_serv.js

(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('HistoryModule')
    .factory('HistoryServ', historyFactory);

  function historyFactory($location, $filter, $q, localDB, GeneralServ, MainServ, SVGServ, GlobalStor, OrderStor, ProductStor, UserStor, HistoryStor, CartStor) {

    var thisFactory = this,
        orderMasterStyle = 'master',
        orderDoneStyle = 'done';

    thisFactory.publicObj = {
      toCurrentCalculation: toCurrentCalculation,
      downloadOrders: downloadOrders,
      sendOrderToFactory: sendOrderToFactory,
      makeOrderCopy: makeOrderCopy,
      clickDeleteOrder: clickDeleteOrder,
      editOrder: editOrder,
      viewSwitching: viewSwitching,

      orderSearching: orderSearching,
      orderDateSelecting: orderDateSelecting,
      openCalendarScroll: openCalendarScroll,
      orderSorting: orderSorting,
      sortingInit: sortingInit
    };

    return thisFactory.publicObj;




    //============ methods ================//


    //------ go to current calculations
    function toCurrentCalculation () {
      //------- set previos Page
      GeneralServ.setPreviosPage();
      if(GlobalStor.global.isCreatedNewProduct && GlobalStor.global.isCreatedNewProject) {
        $location.path('/main');
      } else {
        //-------- CREATE NEW PROJECT
        MainServ.createNewProject();
      }
    }


    //------ Download complete Orders from localDB
    function downloadOrders() {
      localDB.selectLocalDB(localDB.tablesLocalDB.orders.tableName, {order_type: 1}).then(function(result) {
        var orders = angular.copy(result),
            orderQty = orders.length;
        HistoryStor.history.isEmptyResult = 0;
        if(orderQty) {
          while(--orderQty > -1) {
            orders[orderQty].created = new Date(orders[orderQty].created);
            orders[orderQty].delivery_date = new Date(orders[orderQty].delivery_date);
            orders[orderQty].new_delivery_date = new Date(orders[orderQty].new_delivery_date);
            orders[orderQty].order_date = new Date(orders[orderQty].order_date);
          }
          HistoryStor.history.ordersSource = angular.copy(orders);
          HistoryStor.history.orders = angular.copy(orders);
//          console.info('HISTORY orders+++++', HistoryStor.history.orders);
          //----- max day for calendar-scroll
//          HistoryStor.history.maxDeliveryDateOrder = getOrderMaxDate(HistoryStor.history.orders);
//          console.log('maxDeliveryDateOrder =', HistoryStor.history.maxDeliveryDateOrder);
        } else {
          HistoryStor.history.isEmptyResult = 1;
        }
      });
    }

    //------- defind Order MaxDate
//    function getOrderMaxDate(orders) {
//      var ordersDateArr = orders.map(function(item) {
//            return item.new_delivery_date;
//          }).sort(function (a, b) {
//            return b - a;
//          });
//        //var oldDateArr = orders[it].deliveryDate.split('.');
//        //var newDateStr = Date.parse(oldDateArr[1]+'/'+oldDateArr[0]+'/'+oldDateArr[2]);
//        //var newDateStr = Date.parse(oldDateArr[2], oldDateArr[1], oldDateArr[0]);
//      return ordersDateArr[0];
//    }






    //========== Send Order to Factory ========//

    function sendOrderToFactory(orderStyle, orderNum) {

      if(orderStyle !== orderMasterStyle) {
        GeneralServ.confirmAlert(
          $filter('translate')('common_words.SEND_ORDER_TITLE'),
          $filter('translate')('common_words.SEND_ORDER_TXT'),
          sendOrder
        );
      }

      function sendOrder() {
        var ordersQty = HistoryStor.history.orders.length;
        for(var ord = 0; ord < ordersQty; ord++) {
          if(HistoryStor.history.orders[ord].id === orderNum) {
            //-------- change style for order
            HistoryStor.history.orders[ord].order_style = orderDoneStyle;
            HistoryStor.history.ordersSource[ord].order_style = orderDoneStyle;
            //------ update in Local BD
            localDB.updateLocalServerDBs(localDB.tablesLocalDB.orders.tableName,  orderNum, {order_style: orderDoneStyle, sended: new Date()});
          }
        }
      }

    }






    //========= make Order Copy =========//

    function makeOrderCopy(orderStyle, orderNum) {

      if(orderStyle !== orderMasterStyle) {
        GeneralServ.confirmAlert(
          $filter('translate')('common_words.COPY_ORDER_TITLE'),
          $filter('translate')('common_words.COPY_ORDER_TXT'),
          copyOrder
        );
      }

      function copyOrder() {
        //---- new order number
        var ordersQty = HistoryStor.history.orders.length,
            newOrderCopy;

        for(var ord = 0; ord < ordersQty; ord++) {
          if(HistoryStor.history.orders[ord].id === orderNum) {
            newOrderCopy = angular.copy(HistoryStor.history.orders[ord]);
          }
        }
        newOrderCopy.id = MainServ.createOrderID();
        newOrderCopy.order_number = 0;
        newOrderCopy.order_hz = '---';
        newOrderCopy.created = new Date();
        newOrderCopy.modified = new Date();

        localDB.insertServer(UserStor.userInfo.phone, UserStor.userInfo.device_code, localDB.tablesLocalDB.orders.tableName, newOrderCopy).then(function(respond) {
          if(respond.status) {
            newOrderCopy.order_number = respond.order_number;
          }
          //---- save new order
          HistoryStor.history.orders.push(newOrderCopy);
          HistoryStor.history.ordersSource.push(newOrderCopy);
          //---- save new order in LocalDB
          localDB.insertRowLocalDB(newOrderCopy, localDB.tablesLocalDB.orders.tableName);
        });

        //------ copy all Products of this order
        copyOrderElements(orderNum, newOrderCopy.id, localDB.tablesLocalDB.order_products.tableName);

        //------ copy all AddElements of this order
        copyOrderElements(orderNum, newOrderCopy.id, localDB.tablesLocalDB.order_addelements.tableName);
      }



      function copyOrderElements(oldOrderNum, newOrderNum, nameTableDB) {
        //------ Download elements of order from localDB
        localDB.selectLocalDB(nameTableDB, {'order_id': oldOrderNum}).then(function(result) {
//          console.log('result+++++', result);
          if(result.length) {
            var allElements = angular.copy(result),
                allElemQty = allElements.length,
                i = 0;

            if (allElemQty > 0) {
              //-------- set new orderId in all elements of order
              for (; i < allElemQty; i++) {
                delete allElements[i].id;
                allElements[i].modified = new Date();
                allElements[i].order_id = newOrderNum;

                //-------- insert all elements in LocalDB
                localDB.insertRowLocalDB(allElements[i], nameTableDB);
                localDB.insertServer(UserStor.userInfo.phone, UserStor.userInfo.device_code, nameTableDB, allElements[i]);
              }
            }

          } else {
            console.log('Empty result = ', result);
          }
        });


      }

    }





    //========== Delete order ==========//

    function clickDeleteOrder(orderType, orderNum, event) {
      event.preventDefault();
      event.stopPropagation();

      GeneralServ.confirmAlert(
        $filter('translate')('common_words.DELETE_ORDER_TITLE'),
        $filter('translate')('common_words.DELETE_ORDER_TXT'),
        deleteOrder
      );

      function deleteOrder() {
        var orderList, orderListSource;
        //-------- delete order
        if(orderType) {
          orderList = HistoryStor.history.orders;
          orderListSource = HistoryStor.history.ordersSource;
        //-------- delete draft
        } else {
          orderList = HistoryStor.history.drafts;
          orderListSource = HistoryStor.history.draftsSource;
        }
        var orderListQty = orderList.length;
        while(--orderListQty > -1) {
          if(orderList[orderListQty].id === orderNum) {
            orderList.splice(orderListQty, 1);
            orderListSource.splice(orderListQty, 1);
            break;
          }
        }
        //------ if no more orders
         if(!orderList.length) {
           HistoryStor.history.isEmptyResult = 1;
         }

        //------- delete order/draft and all its elements in LocalDB
        MainServ.deleteOrderInDB(orderNum);
        //------- delet order in Server
        if(orderType) {
          localDB.deleteOrderServer(UserStor.userInfo.phone, UserStor.userInfo.device_code, orderNum);
        }
      }
    }




    /** =========== Edit Order & Draft =========== */

    function editOrder(typeOrder, orderNum) {
      GlobalStor.global.isLoader = 1;
      GlobalStor.global.orderEditNumber = orderNum;
      //----- cleaning order
      OrderStor.order = OrderStor.setDefaultOrder();

      var ordersQty = (typeOrder) ? HistoryStor.history.orders.length : HistoryStor.history.drafts.length;
      while(--ordersQty > -1) {
        if(typeOrder) {
          if(HistoryStor.history.orders[ordersQty].id === orderNum) {
            angular.extend(OrderStor.order, HistoryStor.history.orders[ordersQty]);
            CartStor.fillOrderForm();
          }
        } else {
          if(HistoryStor.history.drafts[ordersQty].id === orderNum) {
            angular.extend(OrderStor.order, HistoryStor.history.drafts[ordersQty]);
            CartStor.fillOrderForm();
          }
        }

      }
      OrderStor.order.order_date = new Date(OrderStor.order.order_date).getTime();
      OrderStor.order.delivery_date = new Date(OrderStor.order.delivery_date).getTime();
      OrderStor.order.new_delivery_date = new Date(OrderStor.order.new_delivery_date).getTime();
      setOrderOptions(1, OrderStor.order.floor_id, GlobalStor.global.supplyData);
      setOrderOptions(2, OrderStor.order.mounting_id, GlobalStor.global.assemblingData);
      setOrderOptions(3, OrderStor.order.instalment_id, GlobalStor.global.instalmentsData);

      delete OrderStor.order.additional_payment;
      delete OrderStor.order.created;
      delete OrderStor.order.sended;
      delete OrderStor.order.state_to;
      delete OrderStor.order.state_buch;
      delete OrderStor.order.batch;
      delete OrderStor.order.base_price;
      delete OrderStor.order.factory_margin;
      delete OrderStor.order.purchase_price;
      delete OrderStor.order.sale_price;
      delete OrderStor.order.modified;

      //------ Download All Products of edited Order
      downloadProducts().then(function() {
        //------ Download All Add Elements from LocalDB
        downloadAddElements().then(function () {
          GlobalStor.global.isConfigMenu = 1;
          GlobalStor.global.isNavMenu = 0;
          //------- set previos Page
          GeneralServ.setPreviosPage();
          GlobalStor.global.isLoader = 0;
//          console.warn('ORDER ====', OrderStor.order);
          $location.path('/cart');
        });
      });

    }


    function setOrderOptions(param, id, data) {
      if(id) {
        var dataQty = data.length;
        while(--dataQty > -1) {
          if(data[dataQty].id === id) {
            switch(param) {
              case 1:
                OrderStor.order.floorName = angular.copy(data[dataQty].name);
                break;
              case 2:
                OrderStor.order.mountingName = angular.copy(data[dataQty].name);
                break;
              case 3:
                OrderStor.order.selectedInstalmentPeriod = angular.copy(data[dataQty].name);
                OrderStor.order.selectedInstalmentPercent = angular.copy(data[dataQty].value);
                break;
            }
          }
        }
      }
    }


    //------ Download All Products Data for Order
    function downloadProducts() {
      var deferred = $q.defer();

      localDB.selectLocalDB(localDB.tablesLocalDB.order_products.tableName, {'order_id': GlobalStor.global.orderEditNumber}).then(function(result) {
        var products = angular.copy(result);
        if(products.length) {

          //------------- parsing All Templates Source and Icons for Order
          var productPromises = products.map(function(prod) {
            var defer1 = $q.defer(),
                tempProd = ProductStor.setDefaultProduct();
            angular.extend(tempProd, prod);
            delete tempProd.id;
            delete tempProd.modified;
            //----- checking product with design or only addElements
            if(!tempProd.is_addelem_only) {
              //----- parsing design from string to object
              tempProd.template_source = JSON.parse(tempProd.template_source);

              //----- find depths and build design icon
              MainServ.setCurrentProfile(tempProd, tempProd.profile_id).then(function(){
                if(tempProd.glass_id) {
                  var glassIDs = tempProd.glass_id.split(', '),
                      glassIDsQty = glassIDs.length;
                  if(glassIDsQty) {
                    while(--glassIDsQty > -1) {
                      setGlassXOrder(tempProd, glassIDs[glassIDsQty]*1);
                    }
                  }
                }
                GlobalStor.global.isSashesInTemplate = MainServ.checkSashInTemplate(tempProd);
                MainServ.setCurrentHardware(tempProd, tempProd.hardware_id);
                MainServ.setCurrLamination(tempProd.lamination_id);
                delete tempProd.lamination_id;
                delete tempProd.lamination_in_id;
                delete tempProd.lamination_out_id;
                defer1.resolve(tempProd);
              });

            } else {
              defer1.resolve(1);
            }
            return defer1.promise;
          });

          $q.all(productPromises).then(function(data) {

            var iconPromise = data.map(function(item) {
              var deferIcon = $q.defer();
              SVGServ.createSVGTemplateIcon(item.template_source, item.profileDepths).then(function(data) {
                item.templateIcon = data;
                delete item.profile_id;
                delete item.glass_id;
                delete item.hardware_id;

                //----- set price Discounts
                item.addelemPriceDis = GeneralServ.setPriceDis(item.addelem_price, OrderStor.order.discount_addelem);
                item.productPriceDis = (GeneralServ.setPriceDis(item.template_price, OrderStor.order.discount_construct) + item.addelemPriceDis);

                OrderStor.order.products.push(item);
                deferIcon.resolve(1);
              });
              return deferIcon.promise;
            });

            deferred.resolve($q.all(iconPromise));
          });

        } else {
          deferred.reject(products);
        }
      });
      return deferred.promise;
    }



    function setGlassXOrder(product, id) {
      //----- set default glass in ProductStor
      var tempGlassArr = GlobalStor.global.glassesAll.filter(function(item) {
        return item.profileId === product.profile.id;
      });
      //      console.log('tempGlassArr = ', tempGlassArr);
      if(tempGlassArr.length) {
        product.glass.unshift(MainServ.fineItemById(id, tempGlassArr[0].glasses));
      }

    }


    //------ Download All Add Elements from LocalDB
    function downloadAddElements() {
      var deferred = $q.defer();
      localDB.selectLocalDB(localDB.tablesLocalDB.order_addelements.tableName, {'order_id': GlobalStor.global.orderEditNumber}).then(function(result) {
        var elementsAdd = angular.copy(result),
            allAddElemQty = elementsAdd.length,
            orderProductsQty = OrderStor.order.products.length;

        if(allAddElemQty) {
          while(--allAddElemQty > -1) {
            for(var prod = 0; prod < orderProductsQty; prod++) {
              if(elementsAdd[allAddElemQty].product_id === OrderStor.order.products[prod].product_id) {
                elementsAdd[allAddElemQty].id = angular.copy(elementsAdd[allAddElemQty].element_id);
                delete elementsAdd[allAddElemQty].element_id;
                delete elementsAdd[allAddElemQty].modified;
                elementsAdd[allAddElemQty].elementPriceDis = GeneralServ.setPriceDis(elementsAdd[allAddElemQty].element_price, OrderStor.order.discount_addelem);
                OrderStor.order.products[prod].chosenAddElements[elementsAdd[allAddElemQty].element_type].push(elementsAdd[allAddElemQty]);
                if(!allAddElemQty) {
                  deferred.resolve(1);
                }
              }
            }
          }

        } else {
          deferred.resolve(1);
        }
      });
      return deferred.promise;
    }








    //------- Orders/Drafts View switcher
    function viewSwitching() {
      HistoryStor.history.isOrderDate = 0;
      HistoryStor.history.isOrderDateDraft = 0;
      HistoryStor.history.isDraftView = !HistoryStor.history.isDraftView;

      //------ Download Drafts from localDB in first open
      if(!HistoryStor.history.drafts.length) {
        downloadDrafts();
      }
    }



    //------ Download draft Orders from localDB
    function downloadDrafts() {
      localDB.selectLocalDB(localDB.tablesLocalDB.orders.tableName, {'order_type': 0}).then(function(result) {
        var drafts = angular.copy(result),
            draftQty = drafts.length;
//        console.log('draft =', drafts);
        HistoryStor.history.isEmptyResultDraft = 0;
        if(draftQty) {
          while(--draftQty > -1) {
            drafts[draftQty].created = new Date(drafts[draftQty].created);
            drafts[draftQty].delivery_date = new Date(drafts[draftQty].delivery_date);
            drafts[draftQty].new_delivery_date = new Date(drafts[draftQty].new_delivery_date);
            drafts[draftQty].order_date = new Date(drafts[draftQty].order_date);
          }
          HistoryStor.history.draftsSource = angular.copy(drafts);
          HistoryStor.history.drafts = angular.copy(drafts);
          //----- max day for calendar-scroll
//          HistoryStor.history.maxDeliveryDateOrder = getOrderMaxDate(HistoryStor.history.orders);
        } else {
          HistoryStor.history.isEmptyResultDraft = 1;
        }
      });
    }




    //============= HISTORY TOOLS ============//

    //=========== Searching

    function orderSearching() {
      HistoryStor.history.isOrderSearch = 1;
      HistoryStor.history.isOrderDate = 0;
      HistoryStor.history.isOrderSort = 0;
    }







    //=========== Filtering by Date

    //------- show Date filter tool dialog
    function orderDateSelecting() {
      var filterResult;
      //------ in Drafts
      if(HistoryStor.history.isDraftView) {
        if(HistoryStor.history.isOrderDateDraft) {
          //-------- filtering orders by selected date
          filterResult = filteringByDate(HistoryStor.history.draftsSource, HistoryStor.history.startDateDraft, HistoryStor.history.finishDateDraft);
          if(filterResult) {
            HistoryStor.history.drafts = filterResult;
          }
        }
        HistoryStor.history.isOrderDateDraft = !HistoryStor.history.isOrderDateDraft;
        HistoryStor.history.isOrderSortDraft = 0;

        //------ in Orders
      } else {
        if(HistoryStor.history.isOrderDate) {
          //-------- filtering orders by selected date
          filterResult = filteringByDate(HistoryStor.history.ordersSource, HistoryStor.history.startDate, HistoryStor.history.finishDate);
          if(filterResult) {
            HistoryStor.history.orders = filterResult;
          }
        }
        HistoryStor.history.isOrderDate = !HistoryStor.history.isOrderDate;
        HistoryStor.history.isOrderSearch = 0;
        HistoryStor.history.isOrderSort = 0;
      }
    }

    //------- filtering orders by Dates
    function filteringByDate(obj, start, end) {
      if(start !== '' || end !== '') {
        var newObj, startDate, finishDate;
        newObj = angular.copy(obj);
        startDate = new Date(start).valueOf();
        finishDate = new Date(end).valueOf();
        if(start !== '' && end !== '' && startDate > finishDate) {
          return false;
        }
        for(var t = newObj.length-1;  t >= 0; t--) {
          var objDate = new Date(newObj[t].created).valueOf();
          if(objDate < startDate || objDate > finishDate) {
            newObj.splice(t, 1);
          }
        }
        return newObj;
      } else {
        return false;
      }
    }


    //------ Select calendar-scroll
    function openCalendarScroll(dataType) {
      if(HistoryStor.history.isDraftView) {
        if (dataType === 'start-date' && !HistoryStor.history.isStartDateDraft ) {
          HistoryStor.history.isStartDateDraft  = 1;
          HistoryStor.history.isFinishDateDraft  = 0;
          HistoryStor.history.isAllPeriodDraft  = 0;
        } else if (dataType === 'finish-date' && !HistoryStor.history.isFinishDateDraft ) {
          HistoryStor.history.isStartDateDraft  = 0;
          HistoryStor.history.isFinishDateDraft  = 1;
          HistoryStor.history.isAllPeriodDraft  = 0;
        } else if (dataType === 'full-date' && !HistoryStor.history.isAllPeriodDraft ) {
          HistoryStor.history.isStartDateDraft  = 0;
          HistoryStor.history.isFinishDateDraft  = 0;
          HistoryStor.history.isAllPeriodDraft  = 1;
          HistoryStor.history.startDateDraft  = '';
          HistoryStor.history.finishDateDraft  = '';
          HistoryStor.history.drafts = angular.copy(HistoryStor.history.draftsSource);
        } else {
          HistoryStor.history.isStartDateDraft  = 0;
          HistoryStor.history.isFinishDateDraft  = 0;
          HistoryStor.history.isAllPeriodDraft = 0;
        }
      } else {
        if (dataType === 'start-date' && !HistoryStor.history.isStartDate) {
          HistoryStor.history.isStartDate = 1;
          HistoryStor.history.isFinishDate = 0;
          HistoryStor.history.isAllPeriod = 0;
        } else if (dataType === 'finish-date' && !HistoryStor.history.isFinishDate) {
          HistoryStor.history.isStartDate = 0;
          HistoryStor.history.isFinishDate = 1;
          HistoryStor.history.isAllPeriod = 0;
        } else if (dataType === 'full-date' && !HistoryStor.history.isAllPeriod) {
          HistoryStor.history.isStartDate = 0;
          HistoryStor.history.isFinishDate = 0;
          HistoryStor.history.isAllPeriod = 1;
          HistoryStor.history.startDate = '';
          HistoryStor.history.finishDate = '';
          HistoryStor.history.orders = angular.copy(HistoryStor.history.ordersSource);
        } else {
          HistoryStor.history.isStartDate = 0;
          HistoryStor.history.isFinishDate = 0;
          HistoryStor.history.isAllPeriod = 0;
        }
      }
    }




    //=========== Sorting

    //------- show Sorting tool dialog
    function orderSorting() {
      if(HistoryStor.history.isDraftView) {
        HistoryStor.history.isOrderSortDraft = !HistoryStor.history.isOrderSortDraft;
        HistoryStor.history.isOrderDateDraft = 0;
      } else {
        HistoryStor.history.isOrderSort = !HistoryStor.history.isOrderSort;
        HistoryStor.history.isOrderSearch = 0;
        HistoryStor.history.isOrderDate = 0;
      }
    }


    //------ Select sorting type item in list
    function sortingInit(filterType, sortType) {
      if(HistoryStor.history.isDraftView) {

        if(HistoryStor.history.isSortTypeDraft === sortType) {
          HistoryStor.history.isSortTypeDraft = 0;
          HistoryStor.history.reverseDraft = 1;
        } else {
          HistoryStor.history.isSortTypeDraft = sortType;

          if(HistoryStor.history.isSortTypeDraft === 'first') {
            HistoryStor.history.reverseDraft = 1;
          }
          if(HistoryStor.history.isSortTypeDraft === 'last') {
            HistoryStor.history.reverseDraft = 0;
          }
        }

      } else {
        if(filterType) {
          /** filtering by Type order */
          if(HistoryStor.history.isFilterType === sortType) {
            HistoryStor.history.isFilterType = undefined;
          } else {
            HistoryStor.history.isFilterType = sortType;
          }
        } else {
          /** sorting by time */
          if (HistoryStor.history.isSortType === sortType) {
            HistoryStor.history.orders = angular.copy(HistoryStor.history.ordersSource);
            HistoryStor.history.isSortType = 'last';
          } else {
            HistoryStor.history.isSortType = sortType;
          }
        }
      }
    }



  }
})();



// services/localdb_serv.js

(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('BauVoiceApp')
    .factory('localDB', globalDBFactory);

  function globalDBFactory($http, $q, $filter, globalConstants, GeneralServ, UserStor, GlobalStor) {
    var thisFactory = this,
        db = openDatabase('bauvoice', '1.0', 'bauvoice', 5000000),

        tablesLocalDB = {
          'addition_folders': {
            'tableName': 'addition_folders',
            'prop': 'name VARCHAR(255),' +
              ' addition_type_id INTEGER,' +
              ' factory_id INTEGER,' +
              ' position INTEGER,' +
              ' img VARCHAR,' +
              ' description VARCHAR,' +
              ' link VARCHAR',
            'foreignKey': ', FOREIGN KEY(factory_id) REFERENCES factories(id), FOREIGN KEY(addition_type_id) REFERENCES addition_types(id)'
          },
          'cities': {
            'tableName': 'cities',
            'prop': 'name VARCHAR(255), region_id INTEGER, transport VARCHAR(2)',
            'foreignKey': ', FOREIGN KEY(region_id) REFERENCES regions(id)'
          },
          'countries': {
            'tableName': 'countries',
            'prop': 'name VARCHAR(255), currency_id INTEGER',
            'foreignKey': ', FOREIGN KEY(currency_id) REFERENCES currencies(id)'
          },
          'currencies': {
            'tableName': 'currencies',
            'prop': 'name VARCHAR(100), value NUMERIC(10, 2), factory_id INTEGER, is_base INTEGER',
            'foreignKey': ', FOREIGN KEY(factory_id) REFERENCES factories(id)'
          },
          'directions': {
            'tableName': 'directions',
            'prop': 'name VARCHAR(255)',
            'foreignKey': ''
          },
          'elements_groups': {
            'tableName': 'elements_groups',
            'prop': 'name VARCHAR(255), base_unit INTEGER, position INTEGER',
            'foreignKey': ''
          },
          'beed_profile_systems': {
            'tableName': 'beed_profile_systems',
            'prop': 'profile_system_id INTEGER, list_id INTEGER, glass_width INTEGER',
            'foreignKey': ', FOREIGN KEY(list_id) REFERENCES lists(id)'
          },
          'glass_folders': {
            'tableName': 'glass_folders',
            'prop': 'name VARCHAR(255),' +
              ' img VARCHAR,' +
              ' position INTEGER,' +
              ' factory_id INTEGER,' +
              ' description VARCHAR,' +
              ' link VARCHAR,' +
              ' is_base INTEGER',
            'foreignKey': ''
          },
          'glass_prices': {
            'tableName': 'glass_prices',
            'prop': 'element_id INTEGER,' +
              ' col_1_range NUMERIC(10, 2),' +
              ' col_1_price NUMERIC(10, 2),' +
              ' col_2_range_1 NUMERIC(10, 2),' +
              ' col_2_range_2 NUMERIC(10, 2),' +
              ' col_2_price NUMERIC(10, 2),' +
              ' col_3_range_1 NUMERIC(10, 2),' +
              ' col_3_range_2 NUMERIC(10, 2),' +
              ' col_3_price NUMERIC(10, 2),' +
              ' col_4_range_1 NUMERIC(10, 2),' +
              ' col_4_range_2 NUMERIC(10, 2),' +
              ' col_4_price NUMERIC(10, 2),' +
              ' col_5_range NUMERIC(10, 2),' +
              ' col_5_price NUMERIC(10, 2),' +
              ' table_width INTEGER',
            'foreignKey': ''
          },
          'lamination_factory_colors': {
            'tableName': 'lamination_factory_colors',
            'prop': 'name VARCHAR(255), lamination_type_id INTEGER, factory_id INTEGER',
            'foreignKey': ', FOREIGN KEY(lamination_type_id) REFERENCES lamination_default_colors(id), FOREIGN KEY(factory_id) REFERENCES factories(id)'
          },
          'lamination_types': {
            'tableName': 'lamination_types',
            'prop': 'name VARCHAR(255)',
            'foreignKey': ''
          },
          'lists_groups': {
            'tableName': 'lists_groups',
            'prop': 'name VARCHAR(255)',
            'foreignKey': ''
          },
          'lists_types': {
            'tableName': 'lists_types',
            'prop': 'name VARCHAR(255), image_add_param VARCHAR(100)',
            'foreignKey': ''
          },
          'options_coefficients': {
            'tableName': 'options_coefficients',
            'prop': 'rentability_percent INTEGER,' +
              ' rentability_hrn_m INTEGER,' +
              ' rentability_hrn INTEGER,' +
              ' others_percent INTEGER,' +
              ' others_hrn_m INTEGER,' +
              ' others_hrn INTEGER,' +
              ' transport_cost_percent INTEGER,' +
              ' transport_cost_hrn_m INTEGER,' +
              ' transport_cost_hrn INTEGER,' +
              ' salary_manager_percent INTEGER,' +
              ' salary_manager_hrn_m INTEGER,' +
              ' salary_manager_hrn INTEGER,' +
              ' rent_offices_percent INTEGER,' +
              ' rent_offices_hrn_m INTEGER,' +
              ' rent_offices_hrn INTEGER,' +
              ' salary_itr_percent INTEGER,' +
              ' salary_itr_hrn_m INTEGER,' +
              ' salary_itr_hrn INTEGER,' +
              ' rent_production_percent INTEGER,' +
              ' rent_production_hrn_m INTEGER,' +
              ' rent_production_hrn INTEGER,' +
              ' salary_glass_percent INTEGER,' +
              ' salary_glass_hrn_m INTEGER,' +
              ' salary_glass_hrn INTEGER,' +
              ' salary_assembly_percent INTEGER,' +
              ' salary_assembly_hrn_m INTEGER,' +
              ' salary_assembly_hrn INTEGER,' +
              ' estimated_cost INTEGER,' +
              ' factory_id INTEGER,' +
              ' plan_production INTEGER,' +
              ' margin NUMERIC(10, 2),' +
              ' coeff NUMERIC(10, 2)',
            'foreignKey': ''
          },
          'options_discounts': {
            'tableName': 'options_discounts',
            'prop': 'factory_id INTEGER,' +
              ' min_time INTEGER,' +
              ' standart_time INTEGER,' +
              ' base_time INTEGER,' +
              ' week_1 INTEGER,' +
              ' week_2 INTEGER,' +
              ' week_3 INTEGER,' +
              ' week_4 INTEGER,' +
              ' week_5 INTEGER,' +
              ' week_6 INTEGER,' +
              ' week_7 INTEGER,' +
              ' week_8 INTEGER,' +
              ' percents ARRAY',
            'foreignKey': ', FOREIGN KEY(factory_id) REFERENCES factories(id)'
          },
          'elements': {
            'tableName': 'elements',
            'prop': 'heat_coeff INTEGER,' +
              ' name VARCHAR(255),' +
              ' element_group_id INTEGER,' +
              ' currency_id INTEGER,' +
              ' supplier_id INTEGER,' +
              ' margin_id INTEGER,' +
              ' waste NUMERIC(10, 2),' +
              ' is_optimized INTEGER,' +
              ' is_virtual INTEGER,' +
              ' is_additional INTEGER,' +
              ' weight_accounting_unit NUMERIC(10, 3),' +
              ' glass_folder_id INTEGER,' +
              ' min_width NUMERIC,' +
              ' min_height NUMERIC,' +
              ' max_width NUMERIC,' +
              ' max_height NUMERIC,' +
              ' max_sq NUMERIC,' +
              ' transcalency NUMERIC(10, 2),' +
              ' glass_width INTEGER,' +
              ' factory_id INTEGER,' +
              ' price NUMERIC(10, 2),' +
              ' amendment_pruning NUMERIC(10, 2),' +
              ' noise_coeff NUMERIC,' +
              ' sku VARCHAR(100),' +
              ' lamination_in_id INTEGER,' +
              ' lamination_out_id INTEGER',
            'foreignKey': ', FOREIGN KEY(factory_id) REFERENCES factories(id), FOREIGN KEY(glass_folder_id) REFERENCES glass_folders(id), FOREIGN KEY(margin_id) REFERENCES margin_types(id), FOREIGN KEY(supplier_id) REFERENCES suppliers(id), FOREIGN KEY(currency_id) REFERENCES currencies(id), FOREIGN KEY(element_group_id) REFERENCES elements_groups(id)'
          },
          'profile_system_folders': {
            'tableName': 'profile_system_folders',
            'prop': 'name VARCHAR(255),' +
              ' factory_id INTEGER,' +
              ' position INTEGER,' +
              ' link VARCHAR,' +
              ' description VARCHAR,' +
              ' img VARCHAR',
            'foreignKey': ', FOREIGN KEY(factory_id) REFERENCES factories(id)'
          },
          'profile_systems': {
            'tableName': 'profile_systems',
            'prop': 'name VARCHAR(255),' +
              ' short_name VARCHAR(100),' +
              ' folder_id INTEGER,' +
              ' rama_list_id INTEGER,' +
              ' rama_still_list_id INTEGER,' +
              ' stvorka_list_id INTEGER,' +
              ' impost_list_id INTEGER,' +
              ' shtulp_list_id INTEGER,' +
              ' is_editable INTEGER,' +
              ' is_default INTEGER,' +
              ' position INTEGER,' +
              ' country VARCHAR(100),' +
              ' cameras INTEGER,' +
              ' heat_coeff INTEGER,' +
              ' noise_coeff INTEGER,' +
              ' heat_coeff_value NUMERIC(5,2),' +
              ' link VARCHAR,' +
              ' description VARCHAR,' +
              ' img VARCHAR',
            'foreignKey': ''
          },
          'profile_laminations': {
            'tableName': 'profile_laminations',
            'prop': 'profile_id INTEGER,' +
            ' lamination_in_id INTEGER,' +
            ' lamination_out_id INTEGER,' +
            ' rama_list_id INTEGER,' +
            ' rama_still_list_id INTEGER,' +
            ' stvorka_list_id INTEGER,' +
            ' impost_list_id INTEGER,' +
            ' shtulp_list_id INTEGER,' +
            ' code_sync VARCHAR',
            'foreignKey': ''
          },
          'rules_types': {
            'tableName': 'rules_types',
            'prop': 'name VARCHAR(255), parent_unit INTEGER, child_unit INTEGER, suffix VARCHAR(15)',
            'foreignKey': ''
          },
          'regions': {
            'tableName': 'regions',
            'prop': 'name VARCHAR(255), country_id INTEGER, heat_transfer NUMERIC(10, 2), climatic_zone NUMERIC',
            'foreignKey': ', FOREIGN KEY(country_id) REFERENCES countries(id)'
          },
          'users': {
            'tableName': 'users',
            'prop':
              ' email VARCHAR(255),' +
              ' password VARCHAR(255),' +
              ' factory_id INTEGER,' +
              ' name VARCHAR(255),' +
              ' phone VARCHAR(100),' +
              ' locked INTEGER,' +
              ' user_type INTEGER,' +
              ' city_phone VARCHAR(100),' +
              ' city_id INTEGER,' +
              ' fax VARCHAR(100),' +
              ' avatar VARCHAR(255),' +
              ' birthday DATE,' +
              ' sex VARCHAR(100),' +
              ' mount_mon NUMERIC(5,2),' +
              ' mount_tue NUMERIC(5,2),' +
              ' mount_wed NUMERIC(5,2),' +
              ' mount_thu NUMERIC(5,2),' +
              ' mount_fri NUMERIC(5,2),' +
              ' mount_sat NUMERIC(5,2),' +
              ' mount_sun NUMERIC(5,2),' +
              ' device_code VARCHAR(250),'+
              ' last_sync TIMESTAMP,' +
              ' address VARCHAR,' +
              ' therm_coeff_id INTEGER,' +
              ' factoryLink VARCHAR',
            'foreignKey': ', FOREIGN KEY(factory_id) REFERENCES factories(id), FOREIGN KEY(city_id) REFERENCES cities(id)'
          },
          'users_discounts': {
            'tableName': 'users_discounts',
            'prop': 'user_id INTEGER,' +
              ' max_construct NUMERIC(5,1),' +
              ' max_add_elem NUMERIC(5,1),' +
              ' default_construct NUMERIC(5,1),' +
              ' default_add_elem NUMERIC(5,1),' +
              ' week_1_construct NUMERIC(5,1),' +
              ' week_1_add_elem NUMERIC(5,1),' +
              ' week_2_construct NUMERIC(5,1),' +
              ' week_2_add_elem NUMERIC(5,1),' +
              ' week_3_construct NUMERIC(5,1),' +
              ' week_3_add_elem NUMERIC(5,1),' +
              ' week_4_construct NUMERIC(5,1),' +
              ' week_4_add_elem NUMERIC(5,1),' +
              ' week_5_construct NUMERIC(5,1),' +
              ' week_5_add_elem NUMERIC(5,1),' +
              ' week_6_construct NUMERIC(5,1),' +
              ' week_6_add_elem NUMERIC(5,1),' +
              ' week_7_construct NUMERIC(5,1),' +
              ' week_7_add_elem NUMERIC(5,1),' +
              ' week_8_construct NUMERIC(5,1),' +
              ' week_8_add_elem NUMERIC(5,1)',
            'foreignKey': ''
          },
          'users_deliveries': {
            'tableName': 'users_deliveries',
            'prop': 'user_id INTEGER,' +
              ' active INTEGER,' +
              ' name VARCHAR,' +
              ' type INTEGER,' +
              ' price NUMERIC(6,1)',
            'foreignKey': ''
          },
          'users_mountings': {
            'tableName': 'users_mountings',
            'prop': 'user_id INTEGER,' +
              ' active INTEGER,' +
              ' name VARCHAR,' +
              ' type INTEGER,' +
              ' price NUMERIC(6,1)',
            'foreignKey': ''
          },
          'lists': {
            'tableName': 'lists',
            'prop': 'name VARCHAR(255),' +
              ' list_group_id INTEGER,' +
              ' list_type_id INTEGER,' +
              ' a NUMERIC(10, 2),' +
              ' b NUMERIC(10, 2),' +
              ' c NUMERIC(10, 2),' +
              ' d NUMERIC(10, 2),' +
              ' parent_element_id INTEGER,' +
              ' position NUMERIC,' +
              ' add_color_id INTEGER,' +
              ' addition_folder_id INTEGER,' +
              ' amendment_pruning NUMERIC(10, 2),' +
              ' waste NUMERIC(10, 2),' +
              ' cameras INTEGER,' +
              ' link VARCHAR,' +
              ' description VARCHAR,' +
              ' img VARCHAR,' +
              ' beed_lamination_id INTEGER',
            'foreignKey': ', FOREIGN KEY(parent_element_id) REFERENCES elements(id), FOREIGN KEY(parent_element_id) REFERENCES elements(id), FOREIGN KEY(list_group_id) REFERENCES lists_groups(id), FOREIGN KEY(add_color_id) REFERENCES addition_colors(id)'
          },
          'list_contents': {
            'tableName': 'list_contents',
            'prop': 'parent_list_id INTEGER,' +
              ' child_id INTEGER,' +
              ' child_type VARCHAR(255),' +
              ' value NUMERIC(10, 7),' +
              ' rules_type_id INTEGER,' +
              ' direction_id INTEGER,' +
              ' window_hardware_color_id INTEGER,' +
              ' lamination_type_id INTEGER',
            'foreignKey': ', FOREIGN KEY(parent_list_id) REFERENCES lists(id), FOREIGN KEY(rules_type_id) REFERENCES rules_types(id), FOREIGN KEY(direction_id) REFERENCES directions(id), FOREIGN KEY(lamination_type_id) REFERENCES lamination_types(id), FOREIGN KEY(window_hardware_color_id) REFERENCES window_hardware_colors(id)'
          },
          'window_hardware_types': {
            'tableName': 'window_hardware_types',
            'prop': 'name VARCHAR(255), short_name VARCHAR(100)',
            'foreignKey': ''
          },
          'window_hardware_folders': {
            'tableName': 'window_hardware_folders',
            'prop': 'name VARCHAR,' +
              ' factory_id INTEGER,'+
              ' link VARCHAR,' +
              ' description VARCHAR,' +
              ' img VARCHAR',
            'foreignKey': ''
          },

          'window_hardware_groups': {
            'tableName': 'window_hardware_groups',
            'prop': 'name VARCHAR(255),' +
              ' short_name VARCHAR(100),' +
              ' folder_id INTEGER,' +
              ' is_editable INTEGER,' +
              ' is_group INTEGER,' +
              ' is_in_calculation INTEGER,' +
              ' is_default INTEGER,' +
              ' position INTEGER,' +
              ' producer VARCHAR(255),' +
              ' country VARCHAR(255),' +
              ' noise_coeff INTEGER,' +
              ' heat_coeff INTEGER,' +
              ' min_height INTEGER,' +
              ' max_height INTEGER,' +
              ' min_width INTEGER,' +
              ' max_width INTEGER,' +
              ' link VARCHAR,' +
              ' description VARCHAR,' +
              ' img VARCHAR',
            'foreignKey': ''
          },
          'window_hardwares': {
            'tableName': 'window_hardwares',
            'prop': 'window_hardware_type_id INTEGER,' +
              ' min_width INTEGER,' +
              ' max_width INTEGER,' +
              ' min_height INTEGER,' +
              ' max_height INTEGER,' +
              ' direction_id INTEGER,' +
              ' window_hardware_color_id INTEGER,' +
              ' length INTEGER,' +
              ' count INTEGER,' +
              ' child_id INTEGER,' +
              ' child_type VARCHAR(100),' +
              ' position INTEGER,' +
              ' factory_id INTEGER,' +
              ' window_hardware_group_id INTEGER',
            'foreignKey': ', FOREIGN KEY(factory_id) REFERENCES factories(id), FOREIGN KEY(window_hardware_type_id) REFERENCES window_hardware_types(id), FOREIGN KEY(direction_id) REFERENCES directions(id), FOREIGN KEY(window_hardware_group_id) REFERENCES window_hardware_groups(id), FOREIGN KEY(window_hardware_color_id) REFERENCES window_hardware_colors(id)'
          },
          'window_hardware_colors': {
            'tableName': 'window_hardware_colors',
            'prop': 'name VARCHAR(255)',
            'foreignKey': ''
          },
          'window_hardware_handles': {
            'tableName': 'window_hardware_handles',
            'prop': 'element_id INTEGER, location VARCHAR(255), constant_value NUMERIC(10, 2)',
            'foreignKey': ''
          },


          'elements_profile_systems': {
            'tableName': 'elements_profile_systems',
            'prop': 'profile_system_id INTEGER, element_id INTEGER',
            'foreignKey': ''
          },
          'orders': {
            'tableName': 'orders',
            'prop':
              'order_number VARCHAR,' +
              ' order_hz VARCHAR,' +
              ' order_date TIMESTAMP,' +
              ' order_type INTEGER,' +
              ' order_style VARCHAR,' +
              ' user_id INTEGER,' +
              ' created TIMESTAMP,' +
              ' additional_payment VARCHAR,' +
              ' sended TIMESTAMP,' +
              ' state_to TIMESTAMP,' +
              ' state_buch TIMESTAMP,' +
              ' batch VARCHAR,' +
              ' base_price NUMERIC(13, 2),' +
              ' factory_margin NUMERIC(11, 2),'+
              ' factory_id INTEGER,' +
              ' purchase_price NUMERIC(10, 2),' +
              ' sale_price NUMERIC(10, 2),' +
              ' climatic_zone INTEGER,' +
              ' heat_coef_min NUMERIC,' +

              ' products_qty INTEGER,' +
              ' templates_price NUMERIC,' +
              ' addelems_price NUMERIC,' +
              ' products_price NUMERIC,'+

              ' delivery_date TIMESTAMP,' +
              ' new_delivery_date TIMESTAMP,' +
              ' delivery_price NUMERIC,'+
              ' is_date_price_less INTEGER,' +
              ' is_date_price_more INTEGER,' +
              ' floor_id INTEGER,' +
              ' floor_price NUMERIC,' +
              ' mounting_id INTEGER,' +
              ' mounting_price NUMERIC,'+
              ' is_instalment INTEGER,' +
              ' instalment_id INTEGER,' +

              ' is_old_price INTEGER,' +
              ' payment_first NUMERIC,' +
              ' payment_monthly NUMERIC,' +
              ' payment_first_primary NUMERIC,' +
              ' payment_monthly_primary NUMERIC,' +
              ' order_price NUMERIC,' +
              ' order_price_dis NUMERIC,' +
              ' order_price_primary NUMERIC,' +

              ' discount_construct NUMERIC,' +
              ' discount_addelem NUMERIC,' +
              ' discount_construct_max NUMERIC,' +
              ' discount_addelem_max NUMERIC,' +
              ' delivery_user_id NUMERIC,' +
              ' mounting_user_id NUMERIC,' +
              ' default_term_plant NUMERIC,' +
              ' disc_term_plant NUMERIC,' +
              ' margin_plant NUMERIC,' +

              ' customer_name TEXT,' +
              ' customer_email TEXT,' +
              ' customer_phone VARCHAR(30),' +
              ' customer_phone_city VARCHAR(20),' +
              ' customer_city_id INTEGER,' +
              ' customer_city VARCHAR,' +
              ' customer_address TEXT,' +
              ' customer_location VARCHAR,' +
              ' customer_itn INTEGER,' +
              ' customer_starttime VARCHAR,' +
              ' customer_endtime VARCHAR,' +
              ' customer_target VARCHAR,' +
              ' customer_sex INTEGER,' +
              ' customer_age INTEGER,' +
              ' customer_education INTEGER,' +
              ' customer_occupation INTEGER,' +
              ' customer_infoSource INTEGER',
            'foreignKey': ''
          },
          'order_products': {
            'tableName': 'order_products',
            'prop':
              'order_id NUMERIC,' +
              ' product_id INTEGER,' +
              ' is_addelem_only INTEGER,' +
              ' room_id INTEGER,' +
              ' construction_type INTEGER,' +
              ' template_id INTEGER,' +
              ' template_source TEXT,' +
              ' template_width NUMERIC,' +
              ' template_height NUMERIC,' +
              ' template_square NUMERIC,' +
              ' profile_id INTEGER,' +
              ' glass_id VARCHAR,' +
              ' hardware_id INTEGER,' +
              ' lamination_id INTEGER,' +
              ' lamination_out_id INTEGER,' +
              ' lamination_in_id INTEGER,' +
              ' door_shape_id INTEGER,' +
              ' door_sash_shape_id INTEGER,' +
              ' door_handle_shape_id INTEGER,' +
              ' door_lock_shape_id INTEGER,' +
              ' heat_coef_total NUMERIC,' +
              ' template_price NUMERIC,' +
              ' addelem_price NUMERIC,' +
              ' product_price NUMERIC,' +
              ' comment TEXT,' +
              ' product_qty INTEGER',
            'foreignKey': ''
          },
          'order_addelements': {
            'tableName': 'order_addelements',
            'prop': 'order_id NUMERIC,' +
              ' product_id INTEGER,' +
              ' element_type INTEGER,' +
              ' element_id INTEGER,' +
              ' name VARCHAR,' +
              ' element_width NUMERIC,' +
              ' element_height NUMERIC,' +
              ' element_price NUMERIC,' +
              ' element_qty INTEGER,' +
              ' block_id INTEGER',
            'foreignKey': ''
          },
//          'order_elements': {
//            'tableName': 'order_elements',
//            'prop': 'order_id NUMERIC,' +
//              ' element_id INTEGER,' +
//              ' element_group_id INTEGER,' +
//              ' name VARCHAR,' +
//              ' sku VARCHAR,' +
//              ' size NUMERIC,' +
//              ' amount INTEGER,' +
//              ' price NUMERIC',
//            'foreignKey': ''
//          },
          'template_groups':{
            'tableName': 'template_groups',
            'prop': 'name VARCHAR(255)',
            'foreignKey': ''
          },
          'templates':{
            'tableName': 'templates',
            'prop': 'group_id INTEGER,'+
              'name VARCHAR(255),' +
              'icon TEXT,' +
              'template_object TEXT',
            'foreignKey': ''
          },
          'background_templates':{
            'tableName': 'background_templates',
            'prop': 'factory_id INTEGER,'+
            'desc_1 VARCHAR(255),' +
            'desc_2 VARCHAR(255),' +
            'template_id INTEGER,' +
            'group_id INTEGER,' +
            'position INTEGER,' +
            'img VARCHAR',
            'foreignKey': ''
          },

          //-------- inner temables
//          'analytics': {
//            'tableName': 'analytics',
//            'prop': 'order_id NUMERIC, user_id INTEGER, calculation_id INTEGER, element_id INTEGER, element_type INTEGER',
//            'foreignKey': ''
//          },

          'export': {
            'tableName': 'export',
            //          'prop': 'table_name VARCHAR, row_id INTEGER, message TEXT',
            'prop': 'model VARCHAR, rowId INTEGER, field TEXT',
            'foreignKey': ''
          }
        },



        tablesLocationLocalDB = {
          'cities': {
            'tableName': 'cities',
            'prop': 'name VARCHAR(255), region_id INTEGER, transport VARCHAR(2)',
            'foreignKey': ', FOREIGN KEY(region_id) REFERENCES regions(id)'
          },
          'countries': {
            'tableName': 'countries',
            'prop': 'name VARCHAR(255), currency_id INTEGER',
            'foreignKey': ', FOREIGN KEY(currency_id) REFERENCES currencies(id)'
          },
          'regions': {
            'tableName': 'regions',
            'prop': 'name VARCHAR(255), country_id INTEGER, heat_transfer NUMERIC(10, 2), climatic_zone NUMERIC',
            'foreignKey': ', FOREIGN KEY(country_id) REFERENCES countries(id)'
          }
        };





    thisFactory.publicObj = {
      tablesLocalDB: tablesLocalDB,
      tablesLocationLocalDB: tablesLocationLocalDB,

      cleanLocalDB: cleanLocalDB,
      createTablesLocalDB: createTablesLocalDB,
      insertRowLocalDB: insertRowLocalDB,
      insertTablesLocalDB: insertTablesLocalDB,
      selectLocalDB: selectLocalDB,
      updateLocalDB: updateLocalDB,
      deleteRowLocalDB: deleteRowLocalDB,

      importUser: importUser,
      importLocation: importLocation,
      importFactories: importFactories,
      importAllDB: importAllDB,
      insertServer: insertServer,
      updateServer: updateServer,
      createUserServer: createUserServer,
      exportUserEntrance: exportUserEntrance,
      deleteOrderServer: deleteOrderServer,
      updateLocalServerDBs: updateLocalServerDBs,
      sendIMGServer: sendIMGServer,
      md5: md5,

      calculationPrice: calculationPrice,
      getAdditionalPrice: getAdditionalPrice,
      currencyExgange: currencyExgange
    };

    return thisFactory.publicObj;





    //============ methods ================//



    function cleanLocalDB(tables) {
      var tableKeys = Object.keys(tables),
          promises = tableKeys.map(function(table) {
            var defer = $q.defer();
            db.transaction(function (trans) {
              trans.executeSql("DROP TABLE IF EXISTS " + table, [], function () {
                defer.resolve(1);
              }, function () {
                console.log('not find deleting table');
                defer.resolve(0);
              });
            });
            return defer.promise;
          });
      return $q.all(promises);
    }



    function createTablesLocalDB(tables) {
      var tableKeys = Object.keys(tables),
          promises = tableKeys.map(function(table) {
            var defer = $q.defer();
            db.transaction(function (trans) {
              trans.executeSql("CREATE TABLE IF NOT EXISTS " + tablesLocalDB[table].tableName + " (id INTEGER PRIMARY KEY AUTOINCREMENT, "+ tablesLocalDB[table].prop + ", modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP" + tablesLocalDB[table].foreignKey+")", [], function() {
                defer.resolve(1);
              }, function () {
                console.log('Something went wrong with creating table ' + tablesLocalDB[table].tableName);
                defer.resolve(0);
              });
            });
            return defer.promise;
          });
      return $q.all(promises);
    }



    function insertRowLocalDB(row, tableName) {
      var keysArr = Object.keys(row),
          colums = keysArr.join(', '),
          values = keysArr.map(function (key) {
            row[key] = checkStringToQuote(row[key]);
            return "'"+row[key]+"'";
          }).join(', ');
      db.transaction(function (trans) {
        trans.executeSql('INSERT INTO ' + tableName + ' (' + colums + ') VALUES (' + values + ')', [], null, function () {
          console.log('Something went wrong with insert into ' + tableName);
        });
      });
    }


    function insertTablesLocalDB(result) {
      //        console.log('INSERT START');
      var promises = [],
          tableKeys = Object.keys(result.tables),
          tableQty = tableKeys.length;
      //console.log('tabless =', tableKeys);
      db.transaction(function (trans) {
        for (var t = 0; t < tableQty; t++) {
          var colums = result.tables[tableKeys[t]].fields.join(', '),
              rowsQty = result.tables[tableKeys[t]].rows.length;
          //console.log('insert ++++', tableKeys[t]);
          if (rowsQty) {
            for (var r = 0; r < rowsQty; r++) {
              var defer = $q.defer(),
                  values = result.tables[tableKeys[t]].rows[r].map(function (elem) {
                    elem = checkStringToQuote(elem);
                    return "'" + elem + "'";
                  }).join(', ');
              //console.log('insert ++++', tableKeys[t], colums);
              trans.executeSql('INSERT INTO ' + tableKeys[t] + ' (' + colums + ') VALUES (' + values + ')', [], function() {
                defer.resolve(1);
              }, function(error) {
                console.log('Error!!! ', tableKeys[t], colums);
                defer.resolve(0);
              });

              promises.push(defer.promise);
            }
          }
        }
      });
      return $q.all(promises);
    }


    /**----- if string has single quote <'> it replaces to double quotes <''> -----*/

    function checkStringToQuote(str) {
      if(angular.isString(str)) {
        if(str.indexOf("'")+1) {
          //console.warn(str);
          return str.replace(/'/g, "''");
        } else {
          return str;
        }
      } else {
        return str;
      }
    }


    function selectLocalDB(tableName, options, columns) {
      var defer = $q.defer(),
          properties = (columns) ? columns : '*',
          vhereOptions = "";
      if(options) {
        vhereOptions = " WHERE ";
        var optionKeys = Object.keys(options);
        vhereOptions += optionKeys[0] + " = '" + options[optionKeys[0]] + "'";
        var optionQty = optionKeys.length;
        if(optionQty > 1) {
          for(var k = 1; k < optionQty; k++) {
            vhereOptions += " AND " + optionKeys[k] + " = '" + options[optionKeys[k]] + "'";
          }
        }
      }
      db.transaction(function (trans) {
        trans.executeSql("SELECT "+properties+" FROM " + tableName + vhereOptions, [],
          function (tx, result) {
            var resultQty = result.rows.length;
            if (resultQty) {
              var resultARR = [];
              for(var i = 0; i < resultQty; i++) {
                resultARR.push(result.rows.item(i));
              }
              defer.resolve(resultARR);
            } else {
              defer.resolve(0);
            }
          },
          function (tx, result) {
            if(Object.keys(tx).length === 0 && result.code === 5) {
              defer.resolve(0);
            }
          });
      });
      return defer.promise;
    }



    function updateLocalDB(tableName, elem, options) {
      var vhereOptions = '',
          keysArr = Object.keys(elem),
          keysQty = keysArr.length,
          optionKeys = Object.keys(options),
          optionQty = optionKeys.length,
          elements = "";

      if(keysQty) {
        for(var k = 0; k < keysQty; k++) {
          if(!k) {
            elements += keysArr[k] + " = '" + elem[keysArr[k]]+"'";
          } else {
            elements += ", " + keysArr[k] + " = '" + elem[keysArr[k]]+"'";
          }
        }
      }
      if(optionQty) {
        vhereOptions = " WHERE ";
        vhereOptions += optionKeys[0] + " = '" + options[optionKeys[0]] + "'";
        if(optionQty > 1) {
          for(var op = 1; op < optionQty; op++) {
            vhereOptions += " AND " + optionKeys[op] + " = '" + options[optionKeys[op]] + "'";
          }
        }
      }
      db.transaction(function (trans) {
        trans.executeSql("UPDATE " + tableName + " SET " + elements + vhereOptions, [], function () {
        }, function () {
          console.log('Something went wrong with updating ' + tableName + ' record');
        });
      });
    }



    function deleteRowLocalDB(tableName, options) {
      var vhereOptions = "";
      if(options) {
        var optionKeys = Object.keys(options),
            optionQty = optionKeys.length;
        vhereOptions = " WHERE " + optionKeys[0] + " = '" + options[optionKeys[0]] + "'";
        if(optionQty > 1) {
          for(var k = 1; k < optionQty; k++) {
            vhereOptions += " AND " + optionKeys[k] + " = '" + options[optionKeys[k]] + "'";
          }
        }
      }
      db.transaction(function (trans) {
        trans.executeSql('DELETE FROM ' + tableName + vhereOptions, [], null, function () {
          console.log('Something went wrong with insert into ' + tableName);
        });
      });
    }






    //============== SERVER ===========//


    /** get User from Server by login */
    function importUser(login, type) {
      var defer = $q.defer(),
        query = (type) ? '/api/login?type=1' : '/api/login';
      $http.post(globalConstants.serverIP + query, {login: login}).then(
        function (result) {
          defer.resolve(result.data);
        },
        function () {
          console.log('Something went wrong with User recive!');
          defer.resolve({status: 0});
        }
      );
      return defer.promise;
    }



    /** get Cities, Regions, Countries from Server */
    function importLocation(login, access) {
      var defer = $q.defer();
      $http.get(globalConstants.serverIP + '/api/get/locations?login='+login+'&access_token='+access).then(
        function (result) {
          if(result.data.status) {
            //-------- insert in LocalDB
            //console.warn(result.data);
            insertTablesLocalDB(result.data).then(function() {
              defer.resolve(1);
            });
          } else {
            console.log('Error!');
            defer.resolve(0);
          }
        },
        function () {
          console.log('Something went wrong with Location!');
          defer.resolve(0);
        }
      );
      return defer.promise;
    }



    function importFactories(login, access, cityIds) {
      var defer = $q.defer();
      $http.get(globalConstants.serverIP + '/api/get/factories-by-country?login='+login+'&access_token='+access+'&cities_ids='+cityIds).then(
        function (result) {
          defer.resolve(result.data);
        },
        function () {
          console.log('Something went wrong with get factories!');
          defer.resolve({status: 0});
        }
      );
      return defer.promise;
    }




    function importAllDB(login, access) {
      var defer = $q.defer();
      console.log('Import database begin!');
      $http.get(globalConstants.serverIP+'/api/sync?login='+login+'&access_token='+access).then(
        function (result) {
          console.log('importAllDB+++', result);
          if(result.data.status) {
            //-------- insert in LocalDB
            insertTablesLocalDB(result.data).then(function() {
              defer.resolve(1);
            });
          } else {
            console.log('Error!');
            defer.resolve(0);
          }
        },
        function () {
          console.log('Something went wrong with importing Database!');
          defer.resolve(0);
        }
      );
      return defer.promise;
    }




    function insertServer(login, access, table, data) {
      var defer = $q.defer(),
          dataToSend = {
            model: table,
            row: JSON.stringify(data)
          };
      $http.post(globalConstants.serverIP+'/api/insert?login='+login+'&access_token='+access, dataToSend).then(
        function (result) {
          console.log('send changes to server success:', result);
          defer.resolve(result.data);
        },
        function (result) {
          console.log('send changes to server failed');
          defer.resolve(result.data);
        }
      );
      return defer.promise;
    }



    function updateServer(login, access, data) {
      //        tablesToSync.push({model: table_name, rowId: tempObject.id, field: JSON.stringify(tempObject)});
      var promises = data.map(function(item) {
        var defer = $q.defer();
        $http.post(globalConstants.serverIP+'/api/update?login='+login+'&access_token='+access, item).then(
          function (result) {
            console.log('send changes to server success:', result);
            defer.resolve(1);
          },
          function () {
            console.log('send changes to server failed');
            defer.resolve(0);
          }
        );
        return defer.promise;
      });
      return $q.all(promises);
    }




    function createUserServer(dataJson) {
      $http.post(globalConstants.serverIP+'/api/register', dataJson).then(
        function (result) {
          console.log(result);
        },
        function () {
          console.log('Something went wrong when user creating!');
        }
      );
    }



    function exportUserEntrance(login, access) {
      var currTime = new Date();
      $http.get(globalConstants.serverIP+'/api/signed?login='+login+'&access_token='+access+'&date='+currTime).then(
        function () {
          console.log('Sucsess!');
        },
        function () {
          console.log('Something went wrong!');
        }
      );
    }




    function deleteOrderServer(login, access, orderNumber) {
      var dataSend = {orderId: orderNumber*1};
      $http.post(globalConstants.serverIP+'/api/remove-order?login='+login+'&access_token='+access, dataSend).then(
        function (result) {
          console.log(result.data);
        },
        function () {
          console.log('Something went wrong with order delete!');
        }
      );
    }




    function updateLocalServerDBs(table, row, data) {
      var defer = $q.defer(),
          dataToSend = [
            {
              model: table,
              rowId: row,
              field: JSON.stringify(data)
            }
          ];
      updateLocalDB(table, data, {'id': row});
      updateServer(UserStor.userInfo.phone, UserStor.userInfo.device_code, dataToSend).then(function(data) {
        if(!data) {
          //----- if no connect with Server save in Export LocalDB
          insertRowLocalDB(dataToSend, tablesLocalDB.export.tableName);
        }
        defer.resolve(1);
      });
      return defer.promise;
    }




    function sendIMGServer(data) {
      var defer = $q.defer();
      $http.post(globalConstants.serverIP+'/api/load-avatar', data, {
        //          withCredentials: true,
        headers: {'Content-Type': undefined },
        transformRequest: angular.identity
      }).then(
        function (result) {
          console.log('send changes to server success:', result);
          defer.resolve(1);
        },
        function () {
          console.log('send changes to server failed');
          defer.resolve(0);
        }
      );
    }




    function md5(string) {
      function RotateLeft(lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
      }
      function AddUnsigned(lX, lY) {
        var lX4, lY4, lX8, lY8, lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
          return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (lX4 | lY4) {
          if (lResult & 0x40000000) {
            return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
          } else {
            return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
          }
        } else {
          return (lResult ^ lX8 ^ lY8);
        }
      }
      function F(x, y, z) {
        return (x & y) | ((~x) & z);
      }
      function G(x, y, z) {
        return (x & z) | (y & (~z));
      }
      function H(x, y, z) {
        return (x ^ y ^ z);
      }
      function I(x, y, z) {
        return (y ^ (x | (~z)));
      }
      function FF(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
      }
      function GG(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
      }
      function HH(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
      }
      function II(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
      }
      function ConvertToWordArray(string) {
        var lWordCount;
        var lMessageLength = string.length;
        var lNumberOfWords_temp1 = lMessageLength + 8;
        var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
        var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
        var lWordArray = Array(lNumberOfWords - 1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while (lByteCount < lMessageLength) {
          lWordCount = (lByteCount - (lByteCount % 4)) / 4;
          lBytePosition = (lByteCount % 4) * 8;
          lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
          lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
      }
      function WordToHex(lValue) {
        var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
          lByte = (lValue >>> (lCount * 8)) & 255;
          WordToHexValue_temp = "0" + lByte.toString(16);
          WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
        }
        return WordToHexValue;
      }
      function Utf8Encode(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
          var c = string.charCodeAt(n);
          if (c < 128) {
            utftext += String.fromCharCode(c);
          }
          else if ((c > 127) && (c < 2048)) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
          }
          else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
          }
        }
        return utftext;
      }
      var x = Array();
      var k, AA, BB, CC, DD, a, b, c, d;
      var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
      var S21 = 5, S22 = 9 , S23 = 14, S24 = 20;
      var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
      var S41 = 6, S42 = 10, S43 = 15, S44 = 21;
      string = Utf8Encode(string);
      x = ConvertToWordArray(string);
      a = 0x67452301;
      b = 0xEFCDAB89;
      c = 0x98BADCFE;
      d = 0x10325476;
      for (k = 0; k < x.length; k += 16) {
        AA = a;
        BB = b;
        CC = c;
        DD = d;
        a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
        d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
        c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
        b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
        a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
        d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
        c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
        b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
        a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
        d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
        c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
        b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
        a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
        d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
        c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
        b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
        a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
        d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
        c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
        b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
        a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
        d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
        c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
        b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
        a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
        d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
        c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
        b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
        a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
        d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
        c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
        b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
        a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
        d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
        c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
        b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
        a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
        d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
        c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
        b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
        a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
        d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
        c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
        b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
        a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
        d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
        c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
        b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
        a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
        d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
        c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
        b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
        a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
        d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
        c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
        b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
        a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
        d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
        c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
        b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
        a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
        d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
        c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
        b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
        a = AddUnsigned(a, AA);
        b = AddUnsigned(b, BB);
        c = AddUnsigned(c, CC);
        d = AddUnsigned(d, DD);
      }
      var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);
      return temp.toLowerCase();
    }



    //TODO old

    function getLastSync(callback) {
      db.transaction(function (transaction) {
        transaction.executeSql("SELECT last_sync FROM device", [], function (transaction, result) {
          if (result.rows.length) {
            callback(new OkResult({last_sync: result.rows.item(0).last_sync}));
          } else {
            callback(new ErrorResult(2, 'No last_sync data in database!'));
          }
        }, function () {
          callback(new ErrorResult(2, 'Something went wrong with selection last_sync record'));
        });
      });
    }

    function syncDb(login, access_token) {
      var deferred = $q.defer();
      var i, k, table, updateSql, lastSyncDate;
      getLastSync(function (result) {
        lastSyncDate = result.data.last_sync;
        $http.get('http://api.voice-creator.net/sync/elements?login='+login+'&access_token=' + access_token + '&last_sync=' + lastSyncDate).success(function (result) {
          db.transaction(function (transaction) {
            if(result.tables.length) {
              for (table in result.tables) {
                for (i = 0; i < result.tables[table].rows.length; i++) {
                  updateSql = '';
                  for(k = 0; k < result.tables[table].fields.length; k++){
                    if(!k) {
                      updateSql += result.tables[table].fields[k] + " = '" + result.tables[table].rows[i][k] + "'";
                    } else {
                      updateSql += ", " + result.tables[table].fields[k] + " = '" + result.tables[table].rows[i][k] + "'";
                    }
                  }
                  transaction.executeSql("UPDATE " + table + " SET " + updateSql + " WHERE id = " + result.tables[table].rows[i][0], [], function () {
                  }, function () {
                    console.log('Something went wrong with updating ' + table + ' record');
                  });
                }
              }
            }
            transaction.executeSql("UPDATE device SET sync = 1, last_sync = ? WHERE id = 1", [""+result.last_sync+""], function(){
              deferred.resolve('UPDATE is done!');
            }, function () {
              console.log('Something went wrong with updating device table!');
            });
          });

        }).error(function () {
          console.log('Something went wrong with sync Database!');
        });
      });
      return deferred.promise;
    }










    /********* PRICE *********/


    function parseMainKit(construction){
      var deff = $q.defer(),
          promisesKit = construction.sizes.map(function(item, index, arr) {
            var deff1 = $q.defer();
			      //----- chekh is sizes and id
            if(item.length && construction.ids[index]) {
              /** if hardware */
              if(index === arr.length-1) {
                parseHardwareKit(construction.ids[index], item, construction.laminationId).then(function(hardwares) {
                  if(hardwares.length) {
                    deff1.resolve(hardwares);
                  } else {
                    deff1.resolve(0);
                  }
                });
              } else {
                if(angular.isArray(construction.ids[index])) {
                  var promisKits = construction.ids[index].map(function(item2) {
                    var deff2 = $q.defer();
                    selectLocalDB(tablesLocalDB.lists.tableName, {id: item2}, 'id, parent_element_id, name, waste, amendment_pruning').then(function(result2) {
                      if(result2.length) {
                        deff2.resolve(result2);
                      } else {
                        deff2.resolve(0);
                      }
                    });
                    return deff2.promise;
                  });
                  $q.all(promisKits).then(function(result3) {
                    var data3 = angular.copy(result3),
                        resQty = data3.length,
                        collectArr = [];
                    for(var i = 0; i < resQty; i++) {
                      if(data3[i]) {
                        if(data3[i][0].amendment_pruning) {
                          data3[i][0].amendment_pruning /= 1000;
                        }
                        collectArr.push(data3[i][0]);
                      }
                    }
					          if(collectArr.length > 1) {
                      deff1.resolve(collectArr);
                    } else if(collectArr.length === 1) {
                      deff1.resolve(collectArr[0]);
                    } else {
                      deff1.resolve(0);
                    }
                  })
                } else {
                  selectLocalDB(tablesLocalDB.lists.tableName, {id: construction.ids[index]}, 'id, parent_element_id, name, waste, amendment_pruning').then(function(result) {
                    var data = angular.copy(result);
                    if(data && data.length) {
                      if(data[0].amendment_pruning) {
                        data[0].amendment_pruning /= 1000;
                      }
                      deff1.resolve(data[0]);
                    } else {
                      deff1.resolve(0);
                    }
                  });
                }
              }
            } else {
              deff1.resolve(0);
            }
            return deff1.promise;
          });
	    deff.resolve($q.all(promisesKit));
      return deff.promise;
    }



    function getKitByID(kitID) {
      var deff = $q.defer();
      selectLocalDB(tablesLocalDB.lists.tableName, {id: kitID}, 'parent_element_id, name, waste, amendment_pruning').then(function(result) {
        if(result && result.length) {
          if(result[0].amendment_pruning) {
            result[0].amendment_pruning /= 1000;
          }
          deff.resolve(result[0]);
        } else {
          deff.resolve(0);
        }
      });
      return deff.promise;
    }



	  function parseHardwareKit(whId, sashBlocks, color){
      var deff = $q.defer();
      selectLocalDB(tablesLocalDB.window_hardwares.tableName, {window_hardware_group_id: whId}).then(function(result) {
        //        console.warn('*****hardware = ', result);
        var resQty = result.length,
            hardwareKits = [],
            sashBlocksQty = sashBlocks.length;
        if(resQty) {
		  //----- loop by sizes (sashesBlock)
          for(var s = 0; s < sashBlocksQty; s++){
		        var hardware = angular.copy(result),
                hardware1 = [],
                hardware2 = [],
                openDirQty = sashBlocks[s].openDir.length;

            /** change openDir for directions
             * direction_id == 1 - не учитывать
             * 2 - право
             * 3 - лево
             * */
            for(var dir = 0; dir < openDirQty; dir++) {
              if(sashBlocks[s].openDir[dir] === 4) {
                sashBlocks[s].openDir[dir] = 2;
              } else if(sashBlocks[s].openDir[dir] == 2) {
                sashBlocks[s].openDir[dir] = 3;
              } else {
                sashBlocks[s].openDir[dir] = 1;
              }
            }

            //------ filter by type, direction and color
            hardware1 = hardware.filter(function(item) {
              if(item.window_hardware_type_id == sashBlocks[s].type && (item.window_hardware_color_id == color || !item.window_hardware_color_id)) {
                if (openDirQty == 1) {
                  return  (item.direction_id == sashBlocks[s].openDir[0] || item.direction_id == 1);
                } else if (openDirQty == 2) {
                  return (item.direction_id == sashBlocks[s].openDir[0] || item.direction_id == sashBlocks[s].openDir[1] || item.direction_id == 1);
                }
              }
            });

            hardware2 = hardware1.filter(function(item) {
              if(item.min_width && item.max_width && !item.min_height && !item.max_height) {
                if(sashBlocks[s].sizes[0] >= item.min_width && sashBlocks[s].sizes[0] <= item.max_width) {
                  return item;
                }
              } else if (!item.min_width && !item.max_width && item.min_height && item.max_height) {
                if(sashBlocks[s].sizes[1] >= item.min_height && sashBlocks[s].sizes[1] <= item.max_height) {
                  return item;
                }
              } else if (item.min_width && item.max_width && item.min_height && item.max_height) {
                if(sashBlocks[s].sizes[1] >= item.min_height && sashBlocks[s].sizes[1] <= item.max_height) {
                  if(sashBlocks[s].sizes[0] >= item.min_width && sashBlocks[s].sizes[0] <= item.max_width) {
                    return item;
                  }
                }
              } else if (!item.min_width && !item.max_width && !item.min_height && !item.max_height) {
                return item;
              }
            });
            hardwareKits.push(hardware2);
          }
          if(hardwareKits.length) {
		        deff.resolve(hardwareKits);
          } else {
            deff.resolve(0);
          }
        } else {
          deff.resolve(0);
        }
      });
      return deff.promise;
    }



    function parseKitConsist(kits) {
      var deff = $q.defer(),
          promKits = kits.map(function(item, index, arr) {
            var deff1 = $q.defer();
            if(item) {
              if(angular.isArray(item)) {
                var promisElem = item.map(function(item2){
                  var deff2 = $q.defer();
                  /** if hardware */
                  if(index === arr.length-1) {
                    if(angular.isArray(item2)) {
                      var promisHW = item2.map(function(item3) {
                        var deff3 = $q.defer();
                        parseListContent(item3.child_id).then(function (result4) {
                          if(result4.length) {
                            deff3.resolve(result4);
                          } else {
                            deff3.resolve(0);
                          }
                        });
                        return deff3.promise;
                      });
                      deff2.resolve($q.all(promisHW));
                    }
                  } else {
                    parseListContent(item2.id).then(function (result2) {
                      if(result2.length) {
                        deff2.resolve(result2);
                      } else {
                        deff2.resolve(0);
                      }
                    });
                  }
                  return deff2.promise;
                });
                $q.all(promisElem).then(function(result3) {
                  var resQty = result3.length,
                      collectArr = [];
                  if(resQty) {
                    for(var i = 0; i < resQty; i++) {
                      if(angular.isArray(result3[i])) {
                        collectArr.push(result3[i]);
                      } else {
                        if(result3[i][0]) {
                          collectArr.push(result3[i][0]);
                        } else {
                          collectArr.push(result3[i]);
                        }
                      }
                    }
                  }
                  if(collectArr.length) {
                    deff1.resolve(collectArr);
                  } else {
                    deff1.resolve(0);
                  }
                });
              } else {
                var itemId = 0;
                /** if hardware */
                if(index === arr.length-1) {
                  itemId = item.child_id;
                } else {
                  itemId = item.id;
                }
                if(itemId) {
                  parseListContent(itemId).then(function (result1) {
                    if(result1.length) {
                      deff1.resolve(result1);
                    } else {
                      deff1.resolve(0);
                    }
                  });
                } else {
                  deff1.resolve(0);
                }
              }
            } else {
              deff1.resolve(0);
            }
            return deff1.promise;
          });
      deff.resolve($q.all(promKits));
      return deff.promise;
    }



    function parseListContent(listId){
      var defer = $q.defer(),
          lists = [],
          elemLists = [];
      if(angular.isArray(listId)) {
        lists = listId;
      } else {
        lists.push(listId);
      }
      (function nextRecord() {
        if (lists.length) {
          var firstKit = lists.shift(0),
              firstKitId = 0;
          if(typeof firstKit === 'object') {
            firstKitId = firstKit.childId;
          } else {
            firstKitId = firstKit;
          }
          selectLocalDB(tablesLocalDB.list_contents.tableName, {parent_list_id: firstKitId}).then(function(result) {
            var resQty = result.length;
            if(resQty) {
              for (var i = 0; i < resQty; i++) {
                if(typeof firstKit === 'object') {
                  result[i].parentId = firstKit.parentId;
                }
                elemLists.push(result[i]);
                if(result[i].child_type === 'list') {
                  var nextKit = {
                    childId: result[i].child_id,
                    parentId: result[i].id
                  };
                  lists.push(nextKit);
                }
              }
            }
            nextRecord();
          });
        } else {
          if(elemLists.length) {
            defer.resolve(elemLists);
          } else {
            defer.resolve(0);
          }
        }
      })();
      return defer.promise;
    }



    function parseKitElement(kits){
      var deff = $q.defer(),
          promisesKitElem = kits.map(function(item, index, arr) {
            var deff1 = $q.defer();
            if(item) {
              if(angular.isArray(item)) {
                var promisElem = item.map(function(item2){
                  var deff2 = $q.defer();

                  /** if hardware */
                  if(index === arr.length-1) {
                    if(angular.isArray(item2)) {
                      var promisHW = item2.map(function (item3) {
                        var deff3 = $q.defer();
                        if(item3.child_type === 'element') {
                          deff3.resolve(getElementByListId(1, item3.child_id));
                        } else {
                          getKitByID(item3.child_id).then(function(data) {
                            angular.extend(item3, data);
                            deff3.resolve(getElementByListId(1, data.parent_element_id));
                          });
                        }
                        return deff3.promise;
                      });
                      deff2.resolve($q.all(promisHW));
                    }
                  } else {
                    deff2.resolve(getElementByListId(0, item2.parent_element_id));
                  }
                  return deff2.promise;
                });

                $q.all(promisElem).then(function(result2) {
                  var resQty = result2.length,
                      collectArr = [];
                  if(resQty) {
                    /** if glass or beads */
                    if(index === 5 || index === 6) {
                      collectArr = result2;
                    } else {
                      for (var i = 0; i < resQty; i++) {
                        if (result2[i]) {
                          if (angular.isArray(result2[i])) {
                            var innerArr = [], innerQty = result2[i].length;
                            //                          console.info(result2[i]);
                            for (var j = 0; j < innerQty; j++) {
                              if (result2[i][j]) {
                                innerArr.push(result2[i][j][0]);
                              }
                            }
                            collectArr.push(innerArr);
                          } else {
                            collectArr.push(result2[i][0]);
                          }

                        }
                      }
                    }
                  }
                  if(collectArr.length) {
                    deff1.resolve(collectArr);
                  } else {
                    deff1.resolve(0);
                  }
                });
              } else {
                /** if hardware */
                if(index === arr.length-1) {
                  if(item.child_type === 'element') {
                    deff1.resolve(getElementByListId(0, item.child_id));
                  } else {
                    getKitByID(item.child_id).then(function(data) {
                      angular.extend(item, data);
                      deff1.resolve(getElementByListId(0, data.parent_element_id));
                    });
                  }
                } else {
                  deff1.resolve(getElementByListId(0, item.parent_element_id));
                }
              }
            } else {
              deff1.resolve(0);
            }
            return deff1.promise;
          });
      deff.resolve($q.all(promisesKitElem));
      return deff.promise;
    }



	function getElementByListId(isArray, listID) {
      var deff = $q.defer();
      selectLocalDB(tablesLocalDB.elements.tableName, {id: listID}, 'id, sku, currency_id, price, name, element_group_id').then(function(result) {
        if(result.length) {
          if(isArray) {
            deff.resolve(result);
          } else {
            deff.resolve(result[0]);
          }
        } else {
          deff.resolve(0);
        }
      });
      return deff.promise;
    }



	
    function parseConsistElem(consists) {
      var deff = $q.defer();
      if(consists.length) {
        var promConsist = consists.map(function(item) {
          var deff1 = $q.defer();
          if(item && item.length) {
            var promConsistElem = item.map(function(item2) {
              var deff2 = $q.defer();
              if(angular.isArray(item2)) {
                var promConsistElem2 = item2.map(function(item3) {
                  var deff3 = $q.defer();
                  if(item3) {
                    if(angular.isArray(item3)) {
                      var promConsistElem3 = item3.map(function(item4) {
                        var deff4 = $q.defer();
                        if(item4) {
                          if(item4.child_type === 'element') {
                            deff4.resolve(getElementByListId(0, item4.child_id));
                          } else {
                            getKitByID(item4.child_id).then(function(data4) {
                              angular.extend(item4, data4);
                              deff4.resolve(getElementByListId(0, data4.parent_element_id));
                            });
                          }
                        } else {
                          deff4.resolve(0);
                        }
                        return deff4.promise;
                      });
                      deff3.resolve($q.all(promConsistElem3));
                    } else {
                      if(item3.child_type === 'element') {
                        deff3.resolve(getElementByListId(0, item3.child_id));
                      } else {
                        getKitByID(item3.child_id).then(function(data) {
                          angular.extend(item3, data);
                          deff3.resolve(getElementByListId(0, data.parent_element_id));
                        });
                      }
                    }
                  } else {
                    deff3.resolve(0);
                  }
                  return deff3.promise;
                });
                deff2.resolve($q.all(promConsistElem2));
              } else {
                if(item2) {
                  if (item2.child_type === 'element') {
                    deff2.resolve(getElementByListId(0, item2.child_id));
                  } else {
                    getKitByID(item2.child_id).then(function (data) {
                      angular.extend(item2, data);
                      deff2.resolve(getElementByListId(0, data.parent_element_id));
                    });
                  }
                } else {
                  deff2.resolve(0);
                }
              }
              return deff2.promise;
            });
            deff1.resolve($q.all(promConsistElem));
          } else {
            deff1.resolve(0);
          }
          return deff1.promise;
        });
        deff.resolve($q.all(promConsist));
      } else {
        deff.resolve(0);
      }
      return deff.promise;
    }





    function culcKitPrice(priceObj, sizes) {
      var kitElemQty = priceObj.kitsElem.length,
          sizeQty = 0,
          constrElements = [];
      priceObj.priceTotal = 0;

      for(var ke = 0; ke < kitElemQty; ke++) {
        if(priceObj.kitsElem[ke]) {
          sizeQty = sizes[ke].length;
          if(angular.isArray(priceObj.kitsElem[ke])) {
//            console.info('culcKitPrice ===== array');
            var kitElemChildQty = priceObj.kitsElem[ke].length;
            for(var child = 0; child < kitElemChildQty; child++) {
              /** hardware */
              if(angular.isArray(priceObj.kitsElem[ke][child])) {
//                console.info('culcKitPrice ===== hardware');
                var kitElemChildQty2 = priceObj.kitsElem[ke][child].length;
                for(var child2 = 0; child2 < kitElemChildQty2; child2++) {
                  culcPriceAsSize(ke, priceObj.kits[ke][child][child2], priceObj.kitsElem[ke][child][child2], sizes[ke][child], 1, priceObj, constrElements);
                }
              } else {
                culcPriceAsSize(ke, priceObj.kits[ke][child], priceObj.kitsElem[ke][child], sizes[ke], sizeQty, priceObj, constrElements);
              }
            }
          } else {
//            console.info('culcKitPrice ===== object');
            culcPriceAsSize(ke, priceObj.kits[ke], priceObj.kitsElem[ke], sizes[ke], sizeQty, priceObj, constrElements);
          }
        }
      }

      return constrElements;
    }




    function culcPriceAsSize(group, kits, kitsElem, sizes, sizeQty, priceObj, constrElements) {
      var priceTemp = 0,
          sizeTemp = 0,
          sizeLabelTemp = 0,
          qtyTemp = 1,
          constrElem = {},
          waste = (kits.waste) ? (1 + (kits.waste / 100)) : 1;

//      console.info('culcPriceAsSize =====', group, kits, kitsElem, sizes);

      /** beads */
      if(group === 6) {
        for (var block = 0; block < sizeQty; block++) {
          /** check beadId */
          if (sizes[block].elemId === kits.id) {
            var sizeBeadQty = sizes[block].sizes.length;
            while(--sizeBeadQty > -1) {
              constrElem = angular.copy(kitsElem);
              sizeTemp = (sizes[block].sizes[sizeBeadQty] + kits.amendment_pruning);
              priceTemp = (sizeTemp * constrElem.price) * waste;

              /** currency conversion */
              if (UserStor.userInfo.currencyId != constrElem.currency_id) {
                priceTemp = currencyExgange(priceTemp, constrElem.currency_id);
              }
              constrElem.qty = angular.copy(qtyTemp);
              constrElem.size = GeneralServ.roundingValue(sizeTemp, 3);
              constrElem.priceReal = GeneralServ.roundingValue(priceTemp, 3);
              priceObj.priceTotal += priceTemp;
//              console.warn('finish bead-________',constrElem);
              constrElements.push(constrElem);
            }
          }
        }
      } else {
        for (var siz = 0; siz < sizeQty; siz++) {
          constrElem = angular.copy(kitsElem);
          /** glasses */
          if (group === 5) {
            var isExist = 0;
            /** check size by id of glass */
            if (sizes[siz].elemId === kits.id) {
              sizeTemp = sizes[siz].square;
              sizeLabelTemp = GeneralServ.roundingValue(sizes[siz].square, 3) + ' '+ $filter('translate')('common_words.LETTER_M') +'2 (' + sizes[siz].sizes[0] + ' x ' + sizes[siz].sizes[1] + ')';
              priceTemp = sizeTemp * constrElem.price * waste;
              isExist++;
            }
            /** hardware */
          } else if (group === 7) {
            qtyTemp = kits.count;
            priceTemp = qtyTemp * constrElem.price * waste;
          } else {
            sizeTemp = (sizes[siz] + kits.amendment_pruning);
            priceTemp = (sizeTemp * constrElem.price) * waste;
          }

          if (group === 5 && isExist || group !== 5) {
            /** currency conversion */
            if (UserStor.userInfo.currencyId != constrElem.currency_id) {
              priceTemp = currencyExgange(priceTemp, constrElem.currency_id);
            }
            constrElem.qty = angular.copy(qtyTemp);
            constrElem.size = GeneralServ.roundingValue(sizeTemp, 3);
            constrElem.sizeLabel = sizeLabelTemp;
            constrElem.priceReal = GeneralServ.roundingValue(priceTemp, 3);
            priceObj.priceTotal += priceTemp;
            //          console.warn(constrElem);
            constrElements.push(constrElem);
          }
        }
      }
    }





    function currencyExgange(price, currencyElemId) {
      var currencyQty = GlobalStor.global.currencies.length,
          c = 0,
          currIndex, elemIndex;
      if(currencyQty) {
        for (; c < currencyQty; c++) {
          if(GlobalStor.global.currencies[c].id === UserStor.userInfo.currencyId) {
            currIndex = c;
          }
          if(GlobalStor.global.currencies[c].id === currencyElemId){
            elemIndex = c;
          }
        }
      }
//      console.warn('currencies+++++++', GlobalStor.global.currencies[currIndex], GlobalStor.global.currencies[elemIndex]);
      if(GlobalStor.global.currencies[currIndex] && GlobalStor.global.currencies[elemIndex]) {
        price *= GlobalStor.global.currencies[elemIndex].value;
      }
      return price;
    }







    function culcConsistPrice(priceObj, construction) {
      var groupQty = priceObj.consist.length,
          group = 0;

      for(; group < groupQty; group++) {
        if(priceObj.consist[group]) {
          //console.log('         ');
          //console.log('Group  ---------------------', group);
          var sizeQty = construction.sizes[group].length,
              consistQty = priceObj.consist[group].length;

          if(consistQty) {

            if(angular.isArray(priceObj.kits[group])) {
//              console.info('culcConsistPrice ===== array');
//                console.info('1-----', group);
//                console.info('2-----', construction.sizes[group]);
//                console.info('3-----', priceObj.kits[group]);
//                console.info('4-----', priceObj.consist[group]);
//                console.info('5-----', priceObj.consistElem[group]);

              for(var elem = 0; elem < consistQty; elem++) {
                /** if glass or beads */
                if(group === 5 || group === 6) {
                  var sizeObjQty = construction.sizes[group].length;
                  for(var s = 0; s < sizeObjQty; s++) {
                    if(construction.sizes[group][s].elemId === priceObj.kits[group][elem].id) {
                      if(priceObj.consistElem[group][elem]) {
                        culcPriceConsistElem(group, priceObj.consist[group][elem], priceObj.consistElem[group][elem], construction.sizes[group][s], priceObj.kits[group][elem], priceObj);
                      }
                    }
                  }
                } else {
                  if(priceObj.consistElem[group][elem]) {
                    culcPriceConsistElem(group, priceObj.consist[group][elem], priceObj.consistElem[group][elem], construction.sizes[group][elem], priceObj.kits[group][elem], priceObj);
                  }
                }

              }

            } else {
//              console.info('culcConsistPrice ===== object');
              for(var s = 0; s < sizeQty; s++) {
                for (var elem = 0; elem < consistQty; elem++) {
                  if(priceObj.consistElem[group][elem]) {
                    culcPriceConsistElem(group, priceObj.consist[group][elem], priceObj.consistElem[group][elem], construction.sizes[group][s], priceObj.kits[group], priceObj);
                  }
                }
              }
            }

          }

        }
        //console.log('Group - конец ---------------------');
      }

    }




    function culcPriceConsistElem(group, currConsist, currConsistElem, currConstrSize, mainKit, priceObj) {
      /** if hardware */
      if(group === priceObj.consist.length-1) {
        //console.warn('-------hardware------- currConsist', currConsist);
        //console.warn('-------hardware------- currConsistElem', currConsistElem);
        //console.warn('-------hardware------- mainKit', mainKit);
        //console.warn('-------hardware------- currConstrSize', currConstrSize);
        if(angular.isArray(currConsistElem)) {
          var hwElemQty = currConsistElem.length,
              openDirQty = currConstrSize.openDir.length,
              hwInd = 0;
          for(; hwInd < hwElemQty; hwInd++) {
            if(angular.isArray(currConsistElem[hwInd])) {
              var hwElemQty2 = currConsistElem[hwInd].length,
                  hwInd2 = 0;
              hwElemLoop: for(; hwInd2 < hwElemQty2; hwInd2++) {
                //------ check direction
                if(checkDirectionConsistElem(currConsist[hwInd][hwInd2], currConstrSize.openDir, openDirQty)) {
//                  console.warn('-------hardware----2--- currConsist', currConsist[hwInd][hwInd2]);
//                  console.warn('-------hardware----2--- currConsistElem', currConsistElem[hwInd][hwInd2]);

                  var objTmp = angular.copy(currConsistElem[hwInd][hwInd2]), priceReal = 0, wasteValue = 1;

                  if (currConsist[hwInd][hwInd2].parent_list_id === mainKit[hwInd].child_id) {
//                    console.warn('-------hardware----2--- mainKit', mainKit[hwInd]);
                    wasteValue = (mainKit[hwInd].waste) ? (1 + (mainKit[hwInd].waste / 100)) : 1;
                    objTmp.qty = getValueByRule(mainKit[hwInd].count, currConsist[hwInd][hwInd2].value, currConsist[hwInd][hwInd2].rules_type_id);
                    if (currConsist[hwInd][hwInd2].child_type === "list") {
                      currConsist[hwInd][hwInd2].newValue = angular.copy(objTmp.qty);
                    }
                  } else {
                    for (var el = 0; el < hwElemQty2; el++) {
                      if (currConsist[hwInd][hwInd2].parent_list_id === currConsist[hwInd][el].child_id && currConsist[hwInd][hwInd2].parentId === currConsist[hwInd][el].id) {
//                        console.warn('-------hardware------- parent list', currConsist[hwInd][el]);
                        if(!checkDirectionConsistElem(currConsist[hwInd][el], currConstrSize.openDir, openDirQty)) {
                          continue hwElemLoop;
                        }
                        wasteValue = (currConsist[hwInd][el].waste) ? (1 + (currConsist[hwInd][el].waste / 100)) : 1;
                        objTmp.qty = getValueByRule(currConsist[hwInd][el].newValue, currConsist[hwInd][hwInd2].value, currConsist[hwInd][hwInd2].rules_type_id);
                        if (currConsist[hwInd][hwInd2].child_type === "list") {
                          currConsist[hwInd][hwInd2].newValue = angular.copy(objTmp.qty);
                        }
                      }
                    }
                  }

                  priceReal = objTmp.qty * currConsistElem[hwInd][hwInd2].price * wasteValue;
                  //console.log('++++++', priceReal, objTmp.qty, currConsistElem[hwInd][hwInd2].price, wasteValue);
                  if (priceReal) {
                    /** currency conversion */
                    if (UserStor.userInfo.currencyId != currConsistElem[hwInd][hwInd2].currency_id) {
                      priceReal = currencyExgange(priceReal, currConsistElem[hwInd][hwInd2].currency_id);
                    }
                    objTmp.priceReal = GeneralServ.roundingValue(priceReal, 3);
                    objTmp.size = 0;
//                    console.info('finish -------priceObj------- ', priceObj);
//                    console.info('finish -------hardware------- ', priceObj.priceTotal, ' + ', objTmp.priceReal);
                    priceObj.constrElements.push(objTmp);
                    priceObj.priceTotal += objTmp.priceReal;
                  }
                }
              }
            }


          }
        }

      } else {
//        console.log('nooo hardware');
        if(angular.isArray(currConsistElem)) {
          //console.log('array');
          //console.info('1-----', group);
          //console.info('2-----', currConstrSize);
          //console.info('3-----', mainKit);
          var elemQty = currConsistElem.length, elemInd = 0;
          for (; elemInd < elemQty; elemInd++) {
//            console.info('4-----', currConsist[elemInd], currConsistElem[elemInd]);

            /** if beads */
            if (group === 6) {
              var sizeQty = currConstrSize.sizes.length;
              while (--sizeQty > -1) {
//                console.info('bead size-----', currConstrSize.sizes[sizeQty]);
                prepareConsistElemPrice(group, currConstrSize.sizes[sizeQty], mainKit, currConsist[elemInd], currConsistElem[elemInd], currConsist, priceObj);
              }
            } else {
              prepareConsistElemPrice(group, currConstrSize, mainKit, currConsist[elemInd], currConsistElem[elemInd], currConsist, priceObj);
            }
          }
        } else {
//          console.log('object');
          /** if beads */
          if(group === 6) {
            var sizeQty = currConstrSize.sizes.length;
            while(--sizeQty > -1) {
              prepareConsistElemPrice(group, currConstrSize.sizes[sizeQty], mainKit, currConsist, currConsistElem, priceObj.consist[group], priceObj);
            }
          } else {
            prepareConsistElemPrice(group, currConstrSize, mainKit, currConsist, currConsistElem, priceObj.consist[group], priceObj);
          }
        }
      }
    }


    function checkDirectionConsistElem(currConsist, openDir, openDirQty) {
      if(currConsist.direction_id == 1) {
        return 1;
      } else {
        var isExist = 0,
            d = 0;
        for(; d < openDirQty; d++) {
          if(openDir[d] === currConsist.direction_id) {
            isExist++;
          }
        }
        return isExist;
      }
    }


    function prepareConsistElemPrice(group, currConstrSize, mainKit, currConsist, currConsistElem, consistArr, priceObj) {
      //console.info('1-----', group);
      //console.info('2-----', currConsist, currConsistElem);
      //console.info('3-----', currConstrSize, mainKit);
      if (currConsist.parent_list_id === mainKit.id) {

        var fullSize = 1,
            currSize = 1,
            sizeLabel = 0,
            wasteValue = (mainKit.waste) ? (1 + (mainKit.waste / 100)) : 1;
        /** if glasses */
        if(group === 5) {
          if(currConsist.rules_type_id === 5) {
            fullSize = currConstrSize.square;
            currSize = currConstrSize.square;
            sizeLabel = GeneralServ.roundingValue(currConstrSize.square, 3) + ' '+ $filter('translate')('common_words.LETTER_M') +'2 (' + currConstrSize.sizes[0] + ' x ' + currConstrSize.sizes[1] + ')';
          } else if(currConsist.rules_type_id === 21) {
            fullSize = currConstrSize.sizes[0];
            currSize = currConstrSize.sizes[0];
          } else if(currConsist.rules_type_id === 22) {
            fullSize = currConstrSize.sizes[1];
            currSize = currConstrSize.sizes[1];
          } else {
            currSize = currConstrSize.square;
          }
        } else {
          fullSize = GeneralServ.roundingValue((currConstrSize + mainKit.amendment_pruning), 3);
          currSize = currConstrSize;
        }
        if(currConsist.child_type === "list") {
          currConsist.newValue = getValueByRule(fullSize, currConsist.value, currConsist.rules_type_id);
        }
        culcPriceAsRule(1, currSize, currConsist, currConsistElem, mainKit.amendment_pruning, wasteValue, priceObj, sizeLabel);

      } else {
        var consistQty = consistArr.length;
        for (var el = 0; el < consistQty; el++) {
          if(currConsist.parent_list_id === consistArr[el].child_id && currConsist.parentId === consistArr[el].id){
            var wasteValue = (consistArr[el].waste) ? (1 + (consistArr[el].waste / 100)) : 1,
                newValue = 1;
            if(currConsist.child_type === "list") {
              currConsist.newValue = getValueByRule(consistArr[el].newValue, currConsist.value, currConsist.rules_type_id);
            }
            if(consistArr[el].rules_type_id === 2) {
              if(currConsist.rules_type_id === 2 || currConsist.rules_type_id === 4 || currConsist.rules_type_id === 15) {
                newValue = consistArr[el].newValue;
              }
            }
            culcPriceAsRule(newValue, consistArr[el].newValue, currConsist, currConsistElem, consistArr[el].amendment_pruning, wasteValue, priceObj);
          }
        }
      }
    }



    function getValueByRule(parentValue, childValue, rule){
//      console.info('rule++', parentValue, childValue, rule);
      var value = 0;
      switch (rule) {
        case 1:
        case 21: //---- less width of glass
        case 22: //---- less height of glass
          //------ меньше родителя на X (м)
          value = GeneralServ.roundingValue((parentValue - childValue), 3);
          break;
        case 2: //------ X шт. на родителя
        case 5: //----- X шт. на 1 м2 родителя
          var parentValueTemp = (parentValue < 1) ? 1 : parseInt(parentValue);
          value = parentValueTemp * childValue;
          break;
        case 3:
        case 12:
        case 14:
          //------ X шт. на метр родителя
          value = GeneralServ.roundingValue((Math.round(parentValue) * childValue), 3);
          break;
        case 6:
        case 7:
        case 8:
        case 9:
        case 13:
        case 23: //------ кг на м
          value = GeneralServ.roundingValue((parentValue * childValue), 3);
          break;
        default:
          value = childValue;
          break;
      }
//      console.info('rule++value+++', value);
      return value;
    }






    function culcPriceAsRule(parentValue, currSize, currConsist, currConsistElem, pruning, wasteValue, priceObj, sizeLabel) {
      if(currConsistElem) {
        var objTmp = angular.copy(currConsistElem), priceReal = 0, sizeReal = 0, qtyReal = 1;

        //console.log('id: ' + currConsist.id + '///' + currConsistElem.id);
        //console.log('Название: ' + currConsistElem.name);
        //console.log('Цена: ' + currConsistElem.price);
        //console.log('% отхода : ' + wasteValue);
        //console.log('Поправка на обрезку : ' + pruning);
        //console.log('Размер: ' + currSize + ' m');
        //console.log('parentValue: ' + parentValue);

        /** if glass */
        if (objTmp.element_group_id === 9) {
          sizeReal = currSize;
        }
        switch (currConsist.rules_type_id) {
          case 1:
          case 21:
          case 22:
            sizeReal = GeneralServ.roundingValue((currSize + pruning - currConsist.value), 3);
            //console.log('Правило 1: меньше родителя на ', currSize, ' + ', pruning, ' - ', currConsist.value, ' = ', (currSize + pruning - currConsist.value), sizeReal);
            break;
          case 3:
            //qtyReal = Math.round(currSize + pruning) * currConsist.value;
            qtyReal = (currSize + pruning) * currConsist.value;
            //console.log('Правило 3 : (', currSize, ' + ', pruning, ') *', currConsist.value, ' = ', qtyReal, ' шт. на метр родителя');
            break;
          case 5:
            //var sizeTemp = ((currSize + pruning) < 1) ? 1 : parseInt(currSize + pruning);
            //qtyReal = sizeTemp * currConsist.value;
            qtyReal = currConsist.value;
            //console.log('Правило 5 : (', sizeTemp, ') *', currConsist.value, ' = ', qtyReal, ' шт. на 1 метр2 родителя');
            //console.log('Правило 5 : (', currConsist.value, ') = ', qtyReal, ' шт. на 1 метр2 родителя');
            break;
          case 6:
          case 23:
            //qtyReal = GeneralServ.roundingNumbers((currSize + pruning) * currConsist.value, 3);
            qtyReal = (currSize + pruning) * currConsist.value;
            //console.log('Правило 23 : (', currSize, ' + ', pruning, ') *', currConsist.value, ' = ', (currSize + pruning) * currConsist.value, qtyReal, ' kg. на метр родителя');
            break;
          case 2:
          case 4:
          case 15:
            qtyReal = parentValue * currConsist.value;
            //console.log('Правило 2: ',  parentValue, ' * ', currConsist.value, ' = ', qtyReal, ' шт. на родителя');
            break;
          default:
            sizeReal = GeneralServ.roundingValue((currSize + pruning), 3);
            //console.log('Правило else:', currSize, ' + ', pruning, ' = ', (currSize + pruning), sizeReal);
            break;
        }

        if (sizeReal) {
          priceReal = sizeReal * qtyReal * currConsistElem.price * wasteValue;
        } else {
          priceReal = qtyReal * currConsistElem.price * wasteValue;
        }

        /** currency conversion */
        if (UserStor.userInfo.currencyId != currConsistElem.currency_id) {
          priceReal = currencyExgange(priceReal, currConsistElem.currency_id);
        }
        //console.info('@@@@@@@@@@@@', objTmp, objTmp.priceReal, priceReal);
        //objTmp.priceReal = GeneralServ.roundingNumbers(priceReal, 3);
        //objTmp.qty = GeneralServ.roundingNumbers(qtyReal, 3);
        objTmp.priceReal = priceReal;
        objTmp.size = GeneralServ.roundingValue(sizeReal, 3);
        objTmp.sizeLabel = sizeLabel;
        objTmp.qty = qtyReal;
        //console.warn('finish -------------- priceTmp', objTmp.priceReal, objTmp);
        priceObj.constrElements.push(objTmp);
        priceObj.priceTotal += objTmp.priceReal;
      }
    }







    /** CONSTRUCTION PRICE **/

    function calculationPrice(construction) {
      var deffMain = $q.defer(),
          priceObj = {},
          finishPriceObj = {};

      //console.info('START+++', construction);
	  
	    parseMainKit(construction).then(function(kits) {
        //console.warn('kits!!!!!!+', kits);
        priceObj.kits = kits;

        /** collect Kit Children Elements*/
        parseKitConsist(priceObj.kits).then(function(consist){
          //console.warn('consist!!!!!!+', consist);
          priceObj.consist = consist;

          parseKitElement(priceObj.kits).then(function(kitsElem) {
            //console.warn('kitsElem!!!!!!+', kitsElem);
            priceObj.kitsElem = kitsElem;

            parseConsistElem(priceObj.consist).then(function(consistElem){
              //console.warn('consistElem!!!!!!+', consistElem);
              priceObj.consistElem = consistElem;
              priceObj.constrElements = culcKitPrice(priceObj, construction.sizes);
              culcConsistPrice(priceObj, construction);
              priceObj.priceTotal = GeneralServ.roundingValue(priceObj.priceTotal);
                //console.info('FINISH====:', priceObj);
              finishPriceObj.constrElements = angular.copy(priceObj.constrElements);
              finishPriceObj.priceTotal = (isNaN(priceObj.priceTotal)) ? 0 : angular.copy(priceObj.priceTotal);
              deffMain.resolve(finishPriceObj);
            });

          });
        });
      });
      return deffMain.promise;
    }




    /**========= ADDELEMENT PRICE ==========*/

    function getAdditionalPrice(AddElement){
      var deffMain = $q.defer(),
          finishPriceObj = {},
          priceObj = {
            constrElements: [],
            priceTotal: 0
          };
      //console.info('START+++', AddElement);
      /** collect Kit Children Elements*/
      parseListContent(angular.copy(AddElement.elementId)).then(function (result) {
        //console.warn('consist!!!!!!+', result);
        priceObj.consist = result;

        /** parse Kit */
        getKitByID(AddElement.elementId).then(function(kits) {
          if(kits) {
            priceObj.kits = kits;
            //console.warn('kits!!!!!!+', kits);
            /** parse Kit Element */
            getElementByListId(0, priceObj.kits.parent_element_id ).then(function(kitsElem){
              priceObj.kitsElem = kitsElem;
              //console.warn('kitsElem!!!!!!+', kitsElem);

              parseConsistElem([priceObj.consist]).then(function(consist){
                //console.warn('consistElem!!!!!!+', consist[0]);
                priceObj.consistElem = consist[0];
                if (AddElement.elementWidth > 0) {
                  /** culc Kit Price */

                  var sizeSource = 0,
                      sizeTemp = 0;
                  //------ if height is existed
                  if(AddElement.elementHeight) {
                    sizeSource = GeneralServ.roundingValue((AddElement.elementWidth * AddElement.elementHeight), 3);
                    sizeTemp = GeneralServ.roundingValue(((AddElement.elementWidth + priceObj.kits.amendment_pruning)*(AddElement.elementHeight + priceObj.kits.amendment_pruning)), 3);
                  } else {
                    sizeSource = AddElement.elementWidth;
                    sizeTemp = (AddElement.elementWidth + priceObj.kits.amendment_pruning);
                  }
                  var wasteValue = (priceObj.kits.waste) ? (1 + (priceObj.kits.waste / 100)) : 1,
                      constrElem = angular.copy(priceObj.kitsElem),
                      priceTemp = GeneralServ.roundingValue((sizeTemp * constrElem.price) * wasteValue);

                  //console.warn('!!!!!!+', sizeSource, sizeTemp);
                  /** currency conversion */
                  if (UserStor.userInfo.currencyId != constrElem.currency_id){
                    priceTemp = currencyExgange(priceTemp, constrElem.currency_id);
                  }
                  constrElem.qty = 1;
                  constrElem.size = sizeTemp;
                  constrElem.priceReal = priceTemp;
                  priceObj.priceTotal += priceTemp;
                  priceObj.constrElements.push(constrElem);
                    //console.warn('constrElem!!!!!!+', constrElem);

                  /** culc Consist Price */

                  if(priceObj.consistElem) {
                    var consistQty = priceObj.consist.length;
                    if(consistQty) {
                      for(var cons = 0; cons < consistQty; cons++) {
//                          console.warn('child++++', priceObj.consist[cons]);
                        if(priceObj.consist[cons]) {
                          if (priceObj.consist[cons].parent_list_id === AddElement.elementId) {
                            if(priceObj.consist[cons].child_type === "list") {
                              priceObj.consist[cons].newValue = getValueByRule(sizeTemp, priceObj.consist[cons].value, priceObj.consist[cons].rules_type_id);
                            }
                            culcPriceAsRule(1, sizeSource, priceObj.consist[cons], priceObj.consistElem[cons], priceObj.kits.amendment_pruning, wasteValue, priceObj);
                          } else {
                            for (var el = 0; el < consistQty; el++) {
                              if(priceObj.consist[cons].parent_list_id === priceObj.consist[el].child_id && priceObj.consist[cons].parentId === priceObj.consist[el].id){
//                                  console.warn('parent++++', priceObj.consist[el]);
                                wasteValue = (priceObj.consist[el].waste) ? (1 + (priceObj.consist[el].waste / 100)) : 1;
                                if(priceObj.consist[cons].child_type === "list") {
                                  priceObj.consist[cons].newValue = getValueByRule(priceObj.consist[el].newValue, priceObj.consist[cons].value, priceObj.consist[cons].rules_type_id);
                                }
                                culcPriceAsRule(priceObj.consist[cons].newValue, priceObj.consist[el].newValue, priceObj.consist[cons], priceObj.consistElem[cons], priceObj.consist[el].amendment_pruning, wasteValue, priceObj);
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
                priceObj.priceTotal = GeneralServ.roundingValue(priceObj.priceTotal);
                //console.info('FINISH ADD ====:', priceObj);
                finishPriceObj.constrElements = angular.copy(priceObj.constrElements);
                finishPriceObj.priceTotal = angular.copy(priceObj.priceTotal);
                deffMain.resolve(finishPriceObj);
              });

            });
          } else {
            deffMain.resolve(priceObj);
          }
        });

      });
      return deffMain.promise;
    }

  }
})();



// services/login_serv.js

(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('LoginModule')
    .factory('loginServ', startFactory);

  function startFactory($q, $cordovaGlobalization, $cordovaFileTransfer, $translate, $location, $filter, localDB, globalConstants, GeneralServ, optionsServ, GlobalStor, OrderStor, ProductStor, UserStor) {

    var thisFactory = this;

    thisFactory.publicObj = {
      getDeviceLanguage: getDeviceLanguage,
      initExport: initExport,
      isLocalDBExist: isLocalDBExist,
      prepareLocationToUse: prepareLocationToUse,
      downloadAllCities: downloadAllCities,
      collectCityIdsAsCountry: collectCityIdsAsCountry,
      setUserLocation: setUserLocation,
      setUserGeoLocation: setUserGeoLocation,
      downloadAllData: downloadAllData
    };

    return thisFactory.publicObj;


    //============ methods ================//


    //------- defined system language
    function getDeviceLanguage() {
      GlobalStor.global.isDevice = isDevice;
      if(GlobalStor.global.isDevice) {
        /** if Ipad */
        $cordovaGlobalization.getPreferredLanguage().then(
          function(result) {
            console.log('language++', result);
            checkLangDictionary(result.value);
            $translate.use(UserStor.userInfo.langLabel);
          },
          function(error) {
            console.log('No language defined');
          });

      } else {
        /** if browser */
        var browserLang = navigator.language || navigator.userLanguage;
        //console.info(window.navigator);
//        console.info(window.navigator.language);
//        console.info(window.navigator.userLanguage);
//        console.info(window.navigator.browserLanguage);
//        console.info("The language is: " + browserLang);
        checkLangDictionary(browserLang);
        $translate.use(UserStor.userInfo.langLabel);
      }
    }




    //------ compare device language with existing dictionary, if not exist set default language = English
    function checkLangDictionary(lang) {
      var langQty = globalConstants.languages.length;
      while(--langQty > -1) {
        if(globalConstants.languages[langQty].label.indexOf(lang)+1) {
          UserStor.userInfo.langLabel = globalConstants.languages[langQty].label;
          UserStor.userInfo.langName = globalConstants.languages[langQty].name;
          break;
        }
      }
    }




    function initExport() {
      var defer = $q.defer();
      console.log('EXPORT');
      //------- check Export Table
      localDB.selectLocalDB(localDB.tablesLocalDB.export.tableName).then(function(data) {
        //        console.log('data ===', data);
        if(data.length) {
          //----- get last user
          localDB.selectLocalDB(localDB.tablesLocalDB.users.tableName).then(function(user) {
            if(user.length) {
              localDB.updateServer(user[0].phone, user[0].device_code, data).then(function(result) {
                console.log('FINISH export',result);
                //----- if update Server is success, clean Export in LocalDB
                if(result) {
                  localDB.cleanLocalDB({export: 1});
                  defer.resolve(1);
                }
              });
            }
          });
        }
      });
      return defer.promise;
    }


    function isLocalDBExist() {
      var defer = $q.defer();
//      localDB.selectLocalDB(localDB.tablesLocalDB.users.tableName).then(function(data) {
      localDB.selectLocalDB('sqlite_sequence').then(function(data) {
//        console.log('data ===', data);
        if(data && data.length > 5) {
          defer.resolve(1);
        } else {
          defer.resolve(0);
        }
      });
      return defer.promise;
    }



    //------- collecting cities, regions and countries in one object for registration form
    function prepareLocationToUse(allCityParam) {
      var deferred = $q.defer(),
          countryQty, regionQty;
      //if(!GlobalStor.global.locations.cities.length) {
        //console.info('start time+++', new Date(), new Date().getMilliseconds());
        //---- get all counties
        localDB.selectLocalDB(localDB.tablesLocalDB.countries.tableName, null, 'id, name, currency_id as currency').then(function (data) {
          //console.log('country!!!', data);
          countryQty = data.length;
          if (countryQty) {
            GlobalStor.global.locations.countries = angular.copy(data);
          } else {
            console.log('Error!!!', data);
          }
        }).then(function () {

          //--------- get all regions
          localDB.selectLocalDB(localDB.tablesLocalDB.regions.tableName, null, 'id, name, country_id as countryId, climatic_zone as climaticZone, heat_transfer as heatTransfer').then(function (data) {
            //console.log('regions!!!', data);
            regionQty = data.length;
            if (regionQty) {
              GlobalStor.global.locations.regions = angular.copy(data);
            } else {
              console.log('Error!!!', data);
            }

          }).then(function () {
            //--------- get city
            downloadAllCities(allCityParam).then(function () {
              deferred.resolve(1);
            });
          });
        });
      //} else {
      //  deferred.resolve(1);
      //}
      return deferred.promise;
    }



    function downloadAllCities(allCityParam) {
      var deff = $q.defer(),
          cityOption = (allCityParam) ? null : {'id': UserStor.userInfo.city_id},
          countryQty, regionQty, cityQty;

      localDB.selectLocalDB(localDB.tablesLocalDB.cities.tableName, cityOption, 'id as cityId, name as cityName, region_id as regionId').then(function(data) {
        //console.log('cities!!!', data);
        cityQty = data.length;
        if(cityQty) {
          GlobalStor.global.locations.cities = angular.copy(data);
          while(--cityQty > -1) {
            regionQty = GlobalStor.global.locations.regions.length;
            while(--regionQty > -1) {
              if(GlobalStor.global.locations.cities[cityQty].regionId === GlobalStor.global.locations.regions[regionQty].id) {
                GlobalStor.global.locations.cities[cityQty].fullLocation = ''+ GlobalStor.global.locations.cities[cityQty].cityName +', '+ GlobalStor.global.locations.regions[regionQty].name;
                GlobalStor.global.locations.cities[cityQty].climaticZone = GlobalStor.global.locations.regions[regionQty].climaticZone;
                GlobalStor.global.locations.cities[cityQty].heatTransfer = GlobalStor.global.locations.regions[regionQty].heatTransfer;
                countryQty = GlobalStor.global.locations.countries.length;
                while(--countryQty > -1) {
                  if(GlobalStor.global.locations.regions[regionQty].countryId === GlobalStor.global.locations.countries[countryQty].id) {
                    GlobalStor.global.locations.cities[cityQty].countryId = GlobalStor.global.locations.countries[countryQty].id;
                    GlobalStor.global.locations.cities[cityQty].currencyId = GlobalStor.global.locations.countries[countryQty].currency;

                  }
                }
              }
            }
          }

          //console.info('generalLocations', GlobalStor.global.locations);

          //console.info('finish time+++', new Date(), new Date().getMilliseconds());
          deff.resolve(1);
        } else {
          deff.resolve(0);
        }
      });
      return deff.promise;
    }



    function collectCityIdsAsCountry() {
      var defer = $q.defer(),
          cityIds = GlobalStor.global.locations.cities.map(function(item) {
            if(item.countryId === UserStor.userInfo.countryId) {
              return item.cityId;
            }
          }).join(',');
      defer.resolve(cityIds);
      return defer.promise;
    }


    //--------- set user location
    function setUserLocation() {
      var cityQty = GlobalStor.global.locations.cities.length;
      while(--cityQty > -1) {
        if(GlobalStor.global.locations.cities[cityQty].cityId === UserStor.userInfo.city_id) {
          UserStor.userInfo.cityName = GlobalStor.global.locations.cities[cityQty].cityName;
          UserStor.userInfo.countryId = GlobalStor.global.locations.cities[cityQty].countryId;
          UserStor.userInfo.climaticZone = GlobalStor.global.locations.cities[cityQty].climaticZone;
          UserStor.userInfo.heatTransfer = (UserStor.userInfo.therm_coeff_id) ? GeneralServ.roundingValue(1/GlobalStor.global.locations.cities[cityQty].heatTransfer) : GlobalStor.global.locations.cities[cityQty].heatTransfer;
          UserStor.userInfo.fullLocation = GlobalStor.global.locations.cities[cityQty].fullLocation;
          //------ set current GeoLocation
          setUserGeoLocation(UserStor.userInfo.city_id, UserStor.userInfo.cityName, UserStor.userInfo.climaticZone, UserStor.userInfo.heatTransfer, UserStor.userInfo.fullLocation);
        }
      }
    }

    //--------- set current user geolocation
    function setUserGeoLocation(cityId, cityName, climatic, heat, fullLocation) {
      OrderStor.order.customer_city_id = cityId;
      OrderStor.order.customer_city = cityName;
      OrderStor.order.climatic_zone = climatic;
      OrderStor.order.heat_coef_min = heat;
      OrderStor.order.customer_location = fullLocation;
    }





    /** =========== DOWNLOAD ALL DATA =========== */

    function downloadAllData() {
      //console.log('START DOWNLOAD!!!!!!', new Date(), new Date().getMilliseconds());
      /** download All Currencies and set currency symbol */
      setCurrency().then(function(data) {
        if(data) {
          /** download user discounts */
          //console.log('TIME Currencies!!!!!!', new Date(), new Date().getMilliseconds());
          setUserDiscounts().then(function(data) {
            if(data) {
              //console.log('TIME user discounts!!!!!!', new Date(), new Date().getMilliseconds());
              /** download price Margins of Plant */
              downloadPriceMargin().then(function(margins) {
                if(margins && margins.length) {
                  GlobalStor.global.margins = angular.copy(margins[0]);
                  //console.warn('Margins!!', margins);
                  //console.log('TIME  Margins of Plant!!!!!!', new Date(), new Date().getMilliseconds());
                  /** download delivery Coeff of Plant */
                  downloadDeliveryCoeff().then(function(coeff){
                    if(coeff && coeff.length) {
                      //console.warn('delivery Coeff!!', coeff);
                      GlobalStor.global.deliveryCoeff = angular.copy(coeff[0]);
                      GlobalStor.global.deliveryCoeff.percents = coeff[0].percents.split(',').map(function(item) {
                        return item * 1;
                      });
                      //console.log('TIME delivery Coeff of Plant!!!!!!', new Date(), new Date().getMilliseconds());
                      /** download All Profiles */
                      downloadAllElemAsGroup(localDB.tablesLocalDB.profile_system_folders.tableName, localDB.tablesLocalDB.profile_systems.tableName, GlobalStor.global.profilesType, GlobalStor.global.profiles).then(function(data) {
                        if(data) {
                          //console.log('PROFILES ALL ++++++',GlobalStor.global.profilesType, GlobalStor.global.profiles);
                          //console.log('TIME Profiles!!!!!!', new Date(), new Date().getMilliseconds());
                          /** download All Glasses */
                          downloadAllGlasses().then(function(data) {
                            if(data) {
                              /** sorting glasses as to Type */
                              sortingGlasses();
                              //console.log('GLASSES All +++++', GlobalStor.global.glassesAll);
                              //console.log('TIME Glasses!!!!!!', new Date(), new Date().getMilliseconds());
                              /** download All Hardwares */
                              downloadAllElemAsGroup(localDB.tablesLocalDB.window_hardware_folders.tableName, localDB.tablesLocalDB.window_hardware_groups.tableName, GlobalStor.global.hardwareTypes, GlobalStor.global.hardwares).then(function(data){
                                if(data) {
                                  //console.log('HARDWARE ALL ++++++', GlobalStor.global.hardwareTypes, GlobalStor.global.hardwares);
                                  //console.log('TIME Hardwares!!!!!!', new Date(), new Date().getMilliseconds());
                                  /** download All Templates and Backgrounds */
                                  downloadAllBackgrounds().then(function() {
                                    //console.log('TIME Backgrounds!!!!!!', new Date(), new Date().getMilliseconds());
                                    /** download All AddElements */
                                    downloadAllAddElements().then(function() {
                                      //console.log('TIME AddElements!!!!!!', new Date(), new Date().getMilliseconds());
                                      /** download All Lamination */
                                      downloadAllLamination().then(function(result) {
                                        //console.log('LAMINATION++++', result);
                                        if(result && result.length) {

                                          GlobalStor.global.laminats = angular.copy(result).map(function(item) {
                                            item.isActive = 0;
                                            return item;
                                          });

                                          /** add white color */
                                          GlobalStor.global.laminats.push({
                                            id: 1,
                                            type_id: 1,

                                            isActive: 0,

                                            name: $filter('translate')('mainpage.WHITE_LAMINATION')
                                          });
                                          /** download lamination couples */
                                          downloadLamCouples().then(function() {
                                            /** add white-white couple */
                                            GlobalStor.global.laminatCouples.push(angular.copy(ProductStor.product.lamination));

                                            //console.log('TIME Lamination!!!!!!', new Date(), new Date().getMilliseconds());
                                          });
                                        }
                                        /** download Cart Menu Data */
                                        downloadCartMenuData();
                                        GlobalStor.global.isLoader = 0;
                                        $location.path('/main');
                                        //console.log('FINISH DOWNLOAD !!!!!!', new Date(), new Date().getMilliseconds());

                                      });
                                    });
                                  });
                                }
                              });
                            }
                          });
                        }
                      });

                    } else {
                      console.error('not find options_discounts!');
                    }
                  });

                } else {
                  console.error('not find options_coefficients!');
                }
              });

            }
          });
        }
      });
    }



    function setCurrency() {
      var defer = $q.defer();
      /** download All Currencies */
      localDB.selectLocalDB(localDB.tablesLocalDB.currencies.tableName, null, 'id, is_base, name, value').then(function(currencies) {
        var currencQty = currencies.length;
        if(currencies && currencQty) {
          GlobalStor.global.currencies = currencies;
          /** set current currency */
          while(--currencQty > -1) {
            if(currencies[currencQty].is_base === 1) {
              UserStor.userInfo.currencyId = currencies[currencQty].id;
              if( /uah/i.test(currencies[currencQty].name) ) {
                UserStor.userInfo.currency = '\u20b4';//'₴';
              } else if( /rub/i.test(currencies[currencQty].name) ) {
                UserStor.userInfo.currency = '\ue906';// '\u20BD';//'₽';
              } else if( /(usd|\$)/i.test(currencies[currencQty].name) ) {
                UserStor.userInfo.currency = '$';
              } else if( /eur/i.test(currencies[currencQty].name) ) {
                UserStor.userInfo.currency = '\u20AC';//'€';
              } else {
                UserStor.userInfo.currency = '\xA4';//Generic Currency Symbol
              }
            }
          }
          defer.resolve(1);
        } else {
          console.error('not find currencies!');
          defer.resolve(0);
        }
      });
      return defer.promise;
    }


    function setUserDiscounts() {
      var defer = $q.defer();
      //-------- add server url to avatar img
      UserStor.userInfo.avatar = globalConstants.serverIP + UserStor.userInfo.avatar;

      localDB.selectLocalDB(localDB.tablesLocalDB.users_discounts.tableName).then(function(result) {
//        console.log('DISCTOUN=====', result);
        var discounts = angular.copy(result[0]);
        if(discounts) {
          UserStor.userInfo.discountConstr = discounts.default_construct*1;
          UserStor.userInfo.discountAddElem = discounts.default_add_elem*1;
          UserStor.userInfo.discountConstrMax = discounts.max_construct*1;
          UserStor.userInfo.discountAddElemMax = discounts.max_add_elem*1;

          var disKeys = Object.keys(discounts),
              disQty = disKeys.length;
          for(var dis = 0; dis < disQty; dis++) {
            if(disKeys[dis].indexOf('week')+1) {
              if(disKeys[dis].indexOf('construct')+1) {
                UserStor.userInfo.discConstrByWeek.push(discounts[disKeys[dis]]*1);
              } else if(disKeys[dis].indexOf('add_elem')+1) {
                UserStor.userInfo.discAddElemByWeek.push(discounts[disKeys[dis]]*1);
              }
            }
          }
          defer.resolve(1);
        } else {
          console.error('not find users_discounts!');
          defer.resolve(0);
        }
      });
      return defer.promise;
    }



    /** price Margins of Plant */
    function downloadPriceMargin() {
      return localDB.selectLocalDB(localDB.tablesLocalDB.options_coefficients.tableName, null, 'margin, coeff').then(function(margins) {
        return margins;
      });
    }

    /** delivery Coeff of Plant */
    function downloadDeliveryCoeff() {
      return localDB.selectLocalDB(localDB.tablesLocalDB.options_discounts.tableName).then(function(coeff) {
        return coeff;
      });
    }



    //----------- get all elements as to groups

    function downloadAllElemAsGroup(tableGroup, tableElem, groups, elements) {
      var defer = $q.defer();
      //------- get all Folders
      localDB.selectLocalDB(tableGroup).then(function(result) {
        /** sorting types by position */
        var types = angular.copy(result).sort(function(a, b) {
          return GeneralServ.sorting(a.position, b.position);
        }),
        typesQty = types.length;
        if (typesQty) {
          groups.length = 0;
          angular.extend(groups, types);
          var promises = types.map(function(type) {
            var defer2 = $q.defer();

            /** change Images Path and save in device */
            type.img = downloadElemImg(type.img);

            localDB.selectLocalDB(tableElem, {'folder_id': type.id}).then(function (result2) {
              if (result2.length) {
                var elem = angular.copy(result2).sort(function(a, b) {
                  return GeneralServ.sorting(a.position, b.position);
                });
                defer2.resolve(elem);
              } else {
                defer2.resolve(0);
              }
            });
            return defer2.promise;
          });
          $q.all(promises).then(function(result3){
            var resQty = result3.length,
                existType = [],
                r = 0;
            for(; r < resQty; r++) {
              var elemsQty = result3[r].length;
              if(result3[r] && elemsQty) {
                /** change Images Path and save in device */
                while(--elemsQty > -1) {
                  result3[r][elemsQty].img = downloadElemImg(result3[r][elemsQty].img);
                }
                elements.push(result3[r]);
                existType.push(result3[r][0].folder_id);
              }
            }
            /** delete empty group */
            var existTypeQty = existType.length,
            groupQty = groups.length;
            if(existTypeQty) {
              while(--groupQty > -1) {
                var isExist = 0, t = 0;
                for(; t < existTypeQty; t++) {
                  if(groups[groupQty].id === existType[t]) {
                    isExist = 1;
                  }
                }
                if(!isExist) {
                  groups.splice(groupQty, 1);
                }
              }
            }
            defer.resolve(1);
          });
        } else {
          defer.resolve(0);
        }
      });
      return defer.promise;
    }



    /** change Images Path and save in device */
    function downloadElemImg(urlSource) {
      if(urlSource) {
        /** check image */
        if( /^.*\.(jpg|jpeg|png|gif|tiff)$/i.test(urlSource) ) {
          var url = globalConstants.serverIP + '' + urlSource;
          if (GlobalStor.global.isDevice) {
            var imgName = urlSource.split('/').pop(),
                targetPath = cordova.file.documentsDirectory + '' + imgName,
                trustHosts = true,
                options = {};

            console.log('image name ====', imgName);
            console.log('image path ====', targetPath);
            $cordovaFileTransfer.download(url, targetPath, options, trustHosts).then(function (result) {
              console.log('Success!', result);
            }, function (err) {
              console.log('Error!', err);
            }, function (progress) {
//            $timeout(function () {
//              $scope.downloadProgress = (progress.loaded / progress.total) * 100;
//            })
            });
            return targetPath;
          } else {
            return url;
          }
        } else {
          return '';
        }
      }
    }



    function downloadAllGlasses() {
      var defer = $q.defer(),
          profilesQty = GlobalStor.global.profiles.length,
          profileIds = [];
      //----- collect profiles in one array
      while(--profilesQty > -1) {
        var profileQty = GlobalStor.global.profiles[profilesQty].length;
        while(--profileQty > -1) {
          profileIds.push(GlobalStor.global.profiles[profilesQty][profileQty].id);
        }
      }

      //------ create structure of GlobalStor.global.glassesAll
      //------ insert profile Id and glass Types
      var promises2 = profileIds.map(function(item) {
        var defer2 = $q.defer(),
            glassObj = {profileId: item, glassTypes: [], glasses: []};
        localDB.selectLocalDB(localDB.tablesLocalDB.glass_folders.tableName).then(function (types) {
          if(types.length) {
            glassObj.glassTypes = angular.copy(types);
            GlobalStor.global.glassesAll.push(glassObj);
            defer2.resolve(1);
          } else {
            defer2.resolve(0);
          }
        });
        return defer2.promise;
      });

      $q.all(promises2).then(function(data){
        //        console.log('data!!!!', data);
        if(data) {
          //-------- select all glass Ids as to profile Id
          var promises3 = GlobalStor.global.glassesAll.map(function(item) {
            var defer3 = $q.defer();
            localDB.selectLocalDB(localDB.tablesLocalDB.elements_profile_systems.tableName, {'profile_system_id': item.profileId}).then(function (glassId) {
              var glassIdQty = glassId.length;
              if(glassIdQty){
                defer3.resolve(glassId);
              } else {
                defer3.resolve(0);
              }
            });
            return defer3.promise;
          });

          $q.all(promises3).then(function(glassIds) {
            //-------- get glass as to its Id
            var glassIdsQty = glassIds.length,
                promises4 = [], promises6 = [];
//                        console.log('glassIds!!!!', glassIds);
            for(var i = 0; i < glassIdsQty; i++) {
              var defer4 = $q.defer();
              if(glassIds[i]) {
                var promises5 = glassIds[i].map(function (item) {
                  var defer5 = $q.defer();
                  localDB.selectLocalDB(localDB.tablesLocalDB.elements.tableName, {'id': item.element_id}).then(function (result) {
                    //                  console.log('glass!!!!', glass);
                    var glass = angular.copy(result), glassQty = glass.length;
                    if (glassQty) {
                      defer5.resolve(glass[0]);
                    } else {
                      defer5.resolve(0);
                    }
                  });
                  return defer5.promise;
                });
                defer4.resolve($q.all(promises5));
              } else {
                defer4.resolve(0);
              }
              promises4.push(defer4.promise);
            }

            for(var j = 0; j < glassIdsQty; j++) {
              var defer6 = $q.defer();
              console.warn(glassIds[j]); //TODO error
              var promises7 = glassIds[j].map(function(item) {
                var defer7 = $q.defer();
                localDB.selectLocalDB(localDB.tablesLocalDB.lists.tableName, {'parent_element_id': item.element_id}).then(function (result2) {
                  var list = angular.copy(result2),
                      listQty = list.length;
                  if(listQty){
                    defer7.resolve(list[0]);
                  } else {
                    defer7.resolve(0);
                  }
                });
                return defer7.promise;
              });

              defer6.resolve($q.all(promises7));
              promises6.push(defer6.promise);
            }

            $q.all(promises4).then(function(glasses) {
              //              console.log('glasses after 1111!!!!', glasses);
              var glassesQty = glasses.length;
              if(glassesQty) {
                for(var i = 0; i < glassesQty; i++) {
                  GlobalStor.global.glassesAll[i].glasses = glasses[i];
                }
              }
            });
            $q.all(promises6).then(function(lists) {
              //              console.log('glasses after 2222!!!!', lists);
              var listsQty = lists.length;
              if(listsQty) {
                for(var i = 0; i < listsQty; i++) {
                  GlobalStor.global.glassesAll[i].glassLists = lists[i];
                  defer.resolve(1);
                }
              }
            });

          });

        }
      });
      return defer.promise;
    }


    function sortingGlasses() {
      var glassAllQty = GlobalStor.global.glassesAll.length, g = 0;

      for(; g < glassAllQty; g++) {
        //------- merge glassList to glasses
        var listQty = GlobalStor.global.glassesAll[g].glassLists.length,
            glassTypeQty = GlobalStor.global.glassesAll[g].glassTypes.length,
            newGlassesType = [],
            newGlasses = [];
        /** merge glassList to glasses */
        for(var l = 0; l < listQty; l++) {
          if(GlobalStor.global.glassesAll[g].glassLists[l].parent_element_id === GlobalStor.global.glassesAll[g].glasses[l].id) {
            GlobalStor.global.glassesAll[g].glasses[l].elem_id = angular.copy(GlobalStor.global.glassesAll[g].glasses[l].id);
            GlobalStor.global.glassesAll[g].glasses[l].id = angular.copy(GlobalStor.global.glassesAll[g].glassLists[l].id);
            GlobalStor.global.glassesAll[g].glasses[l].name = angular.copy(GlobalStor.global.glassesAll[g].glassLists[l].name);
            GlobalStor.global.glassesAll[g].glasses[l].cameras = angular.copy(GlobalStor.global.glassesAll[g].glassLists[l].cameras);
            GlobalStor.global.glassesAll[g].glasses[l].position = angular.copy(GlobalStor.global.glassesAll[g].glassLists[l].position);
            GlobalStor.global.glassesAll[g].glasses[l].img = angular.copy(GlobalStor.global.glassesAll[g].glassLists[l].img);
            /** change Images Path and save in device */
            GlobalStor.global.glassesAll[g].glasses[l].img = downloadElemImg(GlobalStor.global.glassesAll[g].glasses[l].img);

            GlobalStor.global.glassesAll[g].glasses[l].link = angular.copy(GlobalStor.global.glassesAll[g].glassLists[l].link);
            GlobalStor.global.glassesAll[g].glasses[l].description = angular.copy(GlobalStor.global.glassesAll[g].glassLists[l].description);
          }
        }

        /** sorting glassTypes by position */
        GlobalStor.global.glassesAll[g].glassTypes.sort(function(a, b) {
          return GeneralServ.sorting(a.position, b.position);
        });

        /** sorting glasses by type */
        while(--glassTypeQty > -1) {
          /** change Images Path and save in device */
          GlobalStor.global.glassesAll[g].glassTypes[glassTypeQty].img = downloadElemImg(GlobalStor.global.glassesAll[g].glassTypes[glassTypeQty].img);

          var glassByType = GlobalStor.global.glassesAll[g].glasses.filter(function(elem) {
            return elem.glass_folder_id === GlobalStor.global.glassesAll[g].glassTypes[glassTypeQty].id;
          });
          //          console.log('glassByType!!!!!', glassByType);
          if(glassByType.length) {
            newGlassesType.unshift(GlobalStor.global.glassesAll[g].glassTypes[glassTypeQty]);
            /** sorting glasses by position */
            glassByType.sort(function(a, b) {
              return GeneralServ.sorting(a.position, b.position);
            });
            newGlasses.unshift(glassByType);
          }
        }

        GlobalStor.global.glassesAll[g].glassTypes = angular.copy(newGlassesType);
        GlobalStor.global.glassesAll[g].glasses = angular.copy(newGlasses);
        delete GlobalStor.global.glassesAll[g].glassLists;
      }

    }

    /** download all Templates */
    function downloadAllTemplates() {
//TODO
    }


    /** download all Backgrounds */
    function downloadAllBackgrounds() {
      var deff = $q.defer();
      localDB.selectLocalDB(localDB.tablesLocalDB.background_templates.tableName).then(function(result) {
        var rooms = angular.copy(result),
            roomQty = rooms.length;
        if(roomQty) {
          /** sorting types by position */
          rooms = rooms.sort(function(a, b) {
            return GeneralServ.sorting(a.position, b.position);
          });

          while(--roomQty > -1) {
            rooms[roomQty].img = downloadElemImg(rooms[roomQty].img);
            //---- prerendering img
            $("<img />").attr("src", rooms[roomQty].img);
          }
          GlobalStor.global.rooms = rooms;
        }
        deff.resolve(1);
      });
      return deff.promise;
    }


    /** download all lamination */
    function downloadAllLamination() {
      return localDB.selectLocalDB(localDB.tablesLocalDB.lamination_factory_colors.tableName, null, 'id, name, lamination_type_id as type_id').then(function(lamin) {
        return lamin;
      });
    }


    /** download lamination couples */
    function downloadLamCouples() {
      var deff = $q.defer();
      localDB.selectLocalDB(localDB.tablesLocalDB.profile_laminations.tableName).then(function(lamins) {
        if(lamins) {
          GlobalStor.global.laminatCouples = angular.copy(lamins);
          /** add lamination names */
          var coupleQty = GlobalStor.global.laminatCouples.length,
              laminatQty = GlobalStor.global.laminats.length,
              lam;
          while(--coupleQty > -1) {
            delete GlobalStor.global.laminatCouples[coupleQty].code_sync;
            delete GlobalStor.global.laminatCouples[coupleQty].modified;
            for(lam = 0; lam < laminatQty; lam++) {
              if(GlobalStor.global.laminats[lam].id === GlobalStor.global.laminatCouples[coupleQty].lamination_in_id) {
                GlobalStor.global.laminatCouples[coupleQty].laminat_in_name = GlobalStor.global.laminats[lam].name;
                GlobalStor.global.laminatCouples[coupleQty].img_in_id = GlobalStor.global.laminats[lam].type_id;
              }
              if(GlobalStor.global.laminats[lam].id === GlobalStor.global.laminatCouples[coupleQty].lamination_out_id) {
                GlobalStor.global.laminatCouples[coupleQty].laminat_out_name = GlobalStor.global.laminats[lam].name;
                GlobalStor.global.laminatCouples[coupleQty].img_out_id = GlobalStor.global.laminats[lam].type_id;
              }
            }
          }
          deff.resolve(1);
        } else {
          deff.resolve(1);
        }
      });
      return deff.promise;
    }


    function downloadAllAddElements() {
      var defer = $q.defer();
      /** get All kits of addElements */
      getAllAddKits().then(function() {
        /** get All elements of addElements*/
        getAllAddElems().then(function() {
          sortingAllAddElem().then(function() {
            defer.resolve(1);
          });
        })
      });
      return defer.promise;
    }



    function getAllAddKits() {
      var defer = $q.defer(),
          promises = GeneralServ.addElementDATA.map(function(item) {
            return localDB.selectLocalDB(localDB.tablesLocalDB.lists.tableName, {'list_group_id': item.id});
          });
      $q.all(promises).then(function (result) {
        var addKits = angular.copy(result),
            resultQty = addKits.length,
            i = 0;
        for(; i < resultQty; i++) {
          var elemGroupObj = {elementType: [], elementsList: addKits[i]};
          GlobalStor.global.addElementsAll.push(elemGroupObj);
        }
        defer.resolve(1);
      });
      return defer.promise;
    }


    function getAllAddElems() {
      var deff = $q.defer(),
          promGroup = GlobalStor.global.addElementsAll.map(function(group) {
            var deff1 = $q.defer();
            if(group.elementsList && group.elementsList.length) {
              var promElems = group.elementsList.map(function(item) {
                var deff2 = $q.defer();

                /** change Images Path and save in device */
                item.img = downloadElemImg(item.img);

                localDB.selectLocalDB(localDB.tablesLocalDB.elements.tableName, {'id': item.parent_element_id}).then(function(result) {
                  if(result && result.length) {
                    GlobalStor.global.tempAddElements.push(angular.copy(result[0]));
                    deff2.resolve(1);
                  } else {
                    deff2.resolve(0);
                  }
                });
                return deff2.promise;
              });
              deff1.resolve($q.all(promElems));
            } else {
              deff1.resolve(0);
            }
            return deff1.promise;
          });
      deff.resolve($q.all(promGroup));
      return deff.promise;
    }


    function sortingAllAddElem() {
      var deff = $q.defer();
      localDB.selectLocalDB(localDB.tablesLocalDB.addition_folders.tableName).then(function(groups) {

        var elemAllQty = GlobalStor.global.addElementsAll.length,
            defaultGroup = {
              id: 0,
              name: $filter('translate')('add_elements.OTHERS')
            };

        /** sorting types by position */
        if(groups && groups.length) {
          groups = groups.sort(function (a, b) {
            return GeneralServ.sorting(a.position, b.position);
          });
        }
        //console.info('AddElems sorting====', GlobalStor.global.addElementsAll);
        while(--elemAllQty > -1) {
          if(GlobalStor.global.addElementsAll[elemAllQty].elementsList) {
            if(groups && groups.length) {
              GlobalStor.global.addElementsAll[elemAllQty].elementType = angular.copy(groups);
            }
            GlobalStor.global.addElementsAll[elemAllQty].elementType.push(defaultGroup);
            //------- sorting
            var newElemList = [],
                typeDelete = [],
                typeQty = GlobalStor.global.addElementsAll[elemAllQty].elementType.length,
                elemQty = GlobalStor.global.addElementsAll[elemAllQty].elementsList.length,
                tempElemQty = GlobalStor.global.tempAddElements.length;
            for(var t = 0; t < typeQty; t++) {
              var elements = [];
              for(var el = 0; el < elemQty; el++) {
                if(GlobalStor.global.addElementsAll[elemAllQty].elementType[t].id === GlobalStor.global.addElementsAll[elemAllQty].elementsList[el].addition_folder_id) {
                  var widthTemp = 0,
                      heightTemp = 0;
                  switch(GlobalStor.global.addElementsAll[elemAllQty].elementsList[el].list_group_id){
                    case 21: // 1 - visors
                    case 9: // 2 - spillways
                    case 8: // 8 - windowSill
                    case 19: // 3 - outSlope & inSlope
                    case 12: // 6 - connectors
                      widthTemp = 1000;
                      break;
                    case 20: // 0 - grids
                    case 26: // 4 - louvers
                      widthTemp = 1000;
                      heightTemp = 1000;
                      break;
                  }
                  GlobalStor.global.addElementsAll[elemAllQty].elementsList[el].element_width = widthTemp;
                  GlobalStor.global.addElementsAll[elemAllQty].elementsList[el].element_height = heightTemp;
                  GlobalStor.global.addElementsAll[elemAllQty].elementsList[el].element_qty = 1;
                  /** get price of element */
                  for(var k = 0; k < tempElemQty; k++) {
                    if(GlobalStor.global.tempAddElements[k].id === GlobalStor.global.addElementsAll[elemAllQty].elementsList[el].parent_element_id) {
                      /** add price margin */
                      GlobalStor.global.tempAddElements[k].price = GeneralServ.addMarginToPrice(angular.copy(GlobalStor.global.tempAddElements[k].price), GlobalStor.global.margins.margin);
                      /** currency conversion */
                      GlobalStor.global.addElementsAll[elemAllQty].elementsList[el].element_price = localDB.currencyExgange(GlobalStor.global.tempAddElements[k].price, GlobalStor.global.tempAddElements[k].currency_id);
                    }
                  }
                  elements.push(angular.copy(GlobalStor.global.addElementsAll[elemAllQty].elementsList[el]));
                }
              }
              if(elements.length) {
                ///** sorting elements by position */
                //elements = elements.sort(function(a, b) {
                //  return GeneralServ.sorting(a.position, b.position);
                //});
                /** sorting by name */
                elements = $filter('orderBy')(elements, 'name');

                newElemList.push(elements);
              } else {
                typeDelete.push(t);
              }
            }

            if(newElemList.length) {
              GlobalStor.global.addElementsAll[elemAllQty].elementsList = angular.copy(newElemList);
            } else {
              GlobalStor.global.addElementsAll[elemAllQty].elementsList = 0;
            }

            /** delete empty groups */
            var delQty = typeDelete.length;
            if(delQty) {
              while(--delQty > -1) {
                GlobalStor.global.addElementsAll[elemAllQty].elementType.splice(typeDelete[delQty], 1);
              }
            }
          }
          //console.log('addElementsAll________________', GlobalStor.global.addElementsAll);
        }
        deff.resolve(1);
      });
      return deff.promise;
    }




    function downloadCartMenuData() {
      /** download Supply Data */
      localDB.selectLocalDB(localDB.tablesLocalDB.users_deliveries.tableName).then(function(supply) {
        if (supply.length) {
          GlobalStor.global.supplyData = angular.copy(supply);
          //console.warn('supplyData=', GlobalStor.global.supplyData);
        }
      });
      /** download Mounting Data */
      localDB.selectLocalDB(localDB.tablesLocalDB.users_mountings.tableName).then(function(mounting) {
        if (mounting.length) {
          GlobalStor.global.assemblingData = angular.copy(mounting);
          //console.warn('assemblingData=', GlobalStor.global.assemblingData);
        }
      });
      /** download Instalment Data */
      optionsServ.getInstalment(function (results) {
        if (results.status) {
          GlobalStor.global.instalmentsData = results.data.instalment;
        } else {
          console.log(results);
        }
      });
    }





  }
})();



// services/main_serv.js

(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .factory('MainServ', navFactory);

  function navFactory($location, $q, $filter, $timeout, localDB, DesignStor, GeneralServ, SVGServ, loginServ, optionsServ, AnalyticsServ, GlobalStor, OrderStor, ProductStor, UserStor, AuxStor, CartStor) {

    var thisFactory = this;

    thisFactory.publicObj = {
      saveUserEntry: saveUserEntry,
      createOrderData: createOrderData,
      createOrderID: createOrderID,
      setCurrDiscounts: setCurrDiscounts,
      setCurrTemplate: setCurrTemplate,
      prepareTemplates: prepareTemplates,
      downloadAllTemplates: downloadAllTemplates,

      setCurrentProfile: setCurrentProfile,
      setCurrentGlass: setCurrentGlass,
      setGlassToTemplateBlocks: setGlassToTemplateBlocks,
      setCurrentHardware: setCurrentHardware,
      fineItemById: fineItemById,
      parseTemplate: parseTemplate,
      saveTemplateInProduct: saveTemplateInProduct,
      checkSashInTemplate: checkSashInTemplate,
      preparePrice: preparePrice,
      setProductPriceTOTAL: setProductPriceTOTAL,
      showInfoBox: showInfoBox,
      closeRoomSelectorDialog: closeRoomSelectorDialog,
      laminatFiltering: laminatFiltering,
      setCurrLamination: setCurrLamination,
      setProfileByLaminat: setProfileByLaminat,

      createNewProject: createNewProject,
      createNewProduct: createNewProduct,
      setDefaultDoorConfig: setDefaultDoorConfig,
      prepareMainPage: prepareMainPage,
      setDefaultAuxParam: setDefaultAuxParam,

      inputProductInOrder: inputProductInOrder,
      goToCart: goToCart,
      saveOrderInDB: saveOrderInDB,
      deleteOrderInDB: deleteOrderInDB
    };

    return thisFactory.publicObj;





    //============ methods ================//


    function saveUserEntry() {
      localDB.exportUserEntrance(UserStor.userInfo.phone, UserStor.userInfo.device_code);
      //TODO offline
//      ++UserStor.userInfo.entries;
//      var data = {entries: UserStor.userInfo.entries},
//          dataToSend = [
//            {
//              model: 'users',
//              rowId: UserStor.userInfo.id,
//              field: JSON.stringify(data)
//            }
//          ];
//      localDB.updateLocalDB(localDB.tablesLocalDB.user.tableName, data, {'id': UserStor.userInfo.id});
//      localDB.updateServer(UserStor.userInfo.phone, UserStor.userInfo.device_code, dataToSend).then(function(data) {
//        if(!data) {
//          //----- if no connect with Server save in Export LocalDB
//          localDB.insertRowLocalDB(dataToSend, localDB.tablesLocalDB.export.tableName);
//        }
//      });
    }




    /**  Create Order Id and Date */
    function createOrderData() {
      var productDay;
      //----------- create order number for new project
      OrderStor.order.id = createOrderID();
      //------ set delivery day
      OrderStor.order.order_date = new Date().getTime();
      productDay = new Date(OrderStor.order.order_date).getDate() + GlobalStor.global.deliveryCoeff.standart_time;
      OrderStor.order.delivery_date = new Date().setDate(productDay);
      OrderStor.order.new_delivery_date = angular.copy(OrderStor.order.delivery_date);
    }

    function createOrderID() {
      var currTime = new Date().getTime();
      return (UserStor.userInfo.id + '' + currTime)*1;
    }


    function setCurrDiscounts() {
      OrderStor.order.discount_construct = angular.copy(UserStor.userInfo.discountConstr);
      OrderStor.order.discount_addelem = angular.copy(UserStor.userInfo.discountAddElem);
    }


    function setCurrTemplate() {
      ProductStor.product.construction_type = GlobalStor.global.rooms[0].group_id;
      ProductStor.product.template_id = (GlobalStor.global.rooms[0].template_id - 1);
    }


    function prepareTemplates(type) {
      var deferred = $q.defer();
      downloadAllTemplates(type).then(function(data) {
        if(data) {
          GlobalStor.global.templatesSourceSTORE = angular.copy(data);
          GlobalStor.global.templatesSource = angular.copy(data);

          //--------- set current profile in ProductStor
          setCurrentProfile(ProductStor.product).then(function(){
            parseTemplate().then(function() {
              deferred.resolve(1);
            });
          });
        } else {
          deferred.resolve(0);
        }
      });
      return deferred.promise;
    }



    //-------- get default json template
    function downloadAllTemplates(type) {
      var deferred = $q.defer();

      switch(type) {
        case 1:
          optionsServ.getTemplatesWindow(function (results) {
            if (results.status) {
              GlobalStor.global.templateLabel = $filter('translate')('panels.TEMPLATE_WINDOW');
              deferred.resolve(results.data.windows);
            } else {
              console.log(results);
            }
          });
          break;
        case 2:
          optionsServ.getTemplatesWindowDoor(function (results) {
            if (results.status) {
              GlobalStor.global.templateLabel = $filter('translate')('panels.TEMPLATE_BALCONY_ENTER');
              deferred.resolve(results.data.windowDoor);
            } else {
              console.log(results);
            }
          });
          break;
        case 3:
          optionsServ.getTemplatesBalcony(function (results) {
            if (results.status) {
              GlobalStor.global.templateLabel = $filter('translate')('panels.TEMPLATE_BALCONY');
              deferred.resolve(results.data.balconies);
            } else {
              console.log(results);
            }
          });
          break;
        case 4:
          optionsServ.getTemplatesDoor(function (results) {
            if (results.status) {
              GlobalStor.global.templateLabel = $filter('translate')('panels.TEMPLATE_DOOR');
              deferred.resolve(results.data.doors);
            } else {
              console.log(results);
            }
          });
          break;
      }
      return deferred.promise;
    }




    //-------- set default profile
    function setCurrentProfile(product, id) {
      var deferred = $q.defer();
      if(id) {
        product.profile = angular.copy(fineItemById(id, GlobalStor.global.profiles));
      } else {
        product.profile = angular.copy(GlobalStor.global.profiles[0][0]);
      }
      //------- set Depths
      $q.all([
        downloadProfileDepth(product.profile.rama_list_id),
        downloadProfileDepth(product.profile.rama_still_list_id),
        downloadProfileDepth(product.profile.stvorka_list_id),
        downloadProfileDepth(product.profile.impost_list_id),
        downloadProfileDepth(product.profile.shtulp_list_id)
      ]).then(function (result) {
        product.profileDepths.frameDepth = result[0];
        product.profileDepths.frameStillDepth = result[1];
        product.profileDepths.sashDepth = result[2];
        product.profileDepths.impostDepth = result[3];
        product.profileDepths.shtulpDepth = result[4];
        deferred.resolve(1);
      });
      return deferred.promise;
    }


    function fineItemById(id, list) {
      var typeQty = list.length;
      while(--typeQty > -1) {
        var itemQty = list[typeQty].length;
        while(--itemQty > -1) {
          if(list[typeQty][itemQty].id === id) {
            return list[typeQty][itemQty];
          }
        }
      }
    }


    function downloadProfileDepth(elementId) {
      var defer = $q.defer();
      localDB.selectLocalDB(localDB.tablesLocalDB.lists.tableName, {'id': elementId}).then(function(result) {
        var resultObj = {};
        if (result.length) {
          resultObj.a = result[0].a;
          resultObj.b = result[0].b;
          resultObj.c = result[0].c;
          resultObj.d = result[0].d;
        }
        defer.resolve(resultObj);
      });
      return defer.promise;
    }




    function parseTemplate() {
      var deferred = $q.defer();
      //------- set current template for product
      saveTemplateInProduct(ProductStor.product.template_id).then(function() {
        setCurrentHardware(ProductStor.product);
        var hardwareIds = (ProductStor.product.hardware.id) ? ProductStor.product.hardware.id : 0;
        preparePrice(ProductStor.product.template, ProductStor.product.profile.id, ProductStor.product.glass, hardwareIds, ProductStor.product.lamination.img_in_id).then(function() {
          deferred.resolve(1);
        });
      });
      return deferred.promise;
    }



    function saveTemplateInProduct(templateIndex) {
      var defer = $q.defer();
      if(!GlobalStor.global.isChangedTemplate) {
        ProductStor.product.template_source = angular.copy(GlobalStor.global.templatesSource[templateIndex]);
      }
      setCurrentGlass(ProductStor.product);
      //----- create template
      SVGServ.createSVGTemplate(ProductStor.product.template_source, ProductStor.product.profileDepths).then(function(result) {
        ProductStor.product.template = angular.copy(result);
        DesignStor.design.templateTEMP = angular.copy(result);
        GlobalStor.global.isSashesInTemplate = checkSashInTemplate(ProductStor.product);
//        console.log('TEMPLATE +++', ProductStor.product.template);
        //----- create template icon
        SVGServ.createSVGTemplateIcon(ProductStor.product.template_source, ProductStor.product.profileDepths).then(function(result) {
          ProductStor.product.templateIcon = angular.copy(result);
          defer.resolve(1);
        });
      });
      return defer.promise;
    }



    function checkSashInTemplate(product) {
      var templQty = product.template_source.details.length,
          counter = 0;
      while(--templQty > 0) {
        if(product.template_source.details[templQty].blockType === 'sash') {
          ++counter;
        }
      }
      return counter;
    }



    function setCurrentGlass(product, id) {
      //------- cleaning glass in product
      product.glass.length = 0;
      if(id) {
        //----- get Glass Ids from template and check dublicates
        var glassIds = GeneralServ.removeDuplicates(getGlassFromTemplateBlocks()),
            glassIdsQty = glassIds.length;
        //------- glass filling by new elements
        while(--glassIdsQty > -1) {
          product.glass.push(fineItemById(glassIds[glassIdsQty], GlobalStor.global.glasses));
        }
      } else {
        //----- set default glass in ProductStor
        var tempGlassArr = GlobalStor.global.glassesAll.filter(function(item) {
          return item.profileId === product.profile.id;
        });
        if(tempGlassArr.length) {
          GlobalStor.global.glassTypes = angular.copy(tempGlassArr[0].glassTypes);
          GlobalStor.global.glasses = angular.copy(tempGlassArr[0].glasses);
          product.glass.push(angular.copy(GlobalStor.global.glasses[0][0]));
          GlobalStor.global.selectLastGlassId = product.glass[0].id;
          /** set Glass to all template blocks without children */
          setGlassToTemplateBlocks(0, product.glass[0].id, product.glass[0].sku);
        }
      }
    }


    function getGlassFromTemplateBlocks() {
      var blocksQty = ProductStor.product.template_source.details.length,
          glassIds = [];
      while(--blocksQty > 0) {
        if(!ProductStor.product.template_source.details[blocksQty].children.length) {
          if(ProductStor.product.template_source.details[blocksQty].glassId) {
            glassIds.push(angular.copy(ProductStor.product.template_source.details[blocksQty].glassId));
          }
        }
      }
      return glassIds;
    }



    function setGlassToTemplateBlocks(blockId, glassId, glassName) {
      var blocksQty = ProductStor.product.template_source.details.length;
      while(--blocksQty > 0) {
        if(blockId) {
          /** set glass to template block by its Id */
          if(ProductStor.product.template_source.details[blocksQty].id === blockId) {
            ProductStor.product.template_source.details[blocksQty].glassId = glassId;
            ProductStor.product.template_source.details[blocksQty].glassTxt = glassName;
            break;
          }
        } else {
          /** set glass to all template blocks */
          //if(!ProductStor.product.template_source.details[blocksQty].children.length) {
            ProductStor.product.template_source.details[blocksQty].glassId = glassId;
            ProductStor.product.template_source.details[blocksQty].glassTxt = glassName;
          //}
        }
      }
    }


    function setCurrentHardware(product, id) {
      if(id) {
        product.hardware = fineItemById(id, GlobalStor.global.hardwares);
      } else {
        //----- set default hardware in ProductStor
        if(GlobalStor.global.isSashesInTemplate) {
          product.hardware = GlobalStor.global.hardwares[0][0];
        } else {
          product.hardware = {};
        }
      }
    }


    //--------- create object to send in server for price calculation
    function preparePrice(template, profileId, glassIds, hardwareId, laminatId) {
      var deferred = $q.defer();
      GlobalStor.global.isLoader = 1;
      setBeadId(profileId, laminatId).then(function(beadResult) {
        var beadIds = GeneralServ.removeDuplicates(angular.copy(beadResult).map(function(item) {
              var beadQty = template.priceElements.beadsSize.length;
              while(--beadQty > -1) {
                if(template.priceElements.beadsSize[beadQty].glassId === item.glassId) {
                  template.priceElements.beadsSize[beadQty].elemId = item.beadId;
                }
              }
              return item.beadId;
            })),
            objXFormedPrice = {
              laminationId: ProductStor.product.lamination.img_in_id,
              ids: [
                ProductStor.product.profile.rama_list_id,
                ProductStor.product.profile.rama_still_list_id,
                ProductStor.product.profile.stvorka_list_id,
                ProductStor.product.profile.impost_list_id,
                ProductStor.product.profile.shtulp_list_id,
                (glassIds.length > 1) ? glassIds.map(function(item){ return item.id; }) : glassIds[0].id,
                (beadIds.length > 1) ? beadIds : beadIds[0],
                hardwareId
              ],
              sizes: []
            };

        //------- fill objXFormedPrice for sizes
        for(var size in template.priceElements) {
          objXFormedPrice.sizes.push(angular.copy(template.priceElements[size]));
        }

        //------- set Overall Dimensions
        ProductStor.product.template_width = 0;
        ProductStor.product.template_height = 0;
        ProductStor.product.template_square = 0;
        var overallQty = ProductStor.product.template.details[0].overallDim.length;
        while(--overallQty > -1) {
          ProductStor.product.template_width += ProductStor.product.template.details[0].overallDim[overallQty].w;
          ProductStor.product.template_height += ProductStor.product.template.details[0].overallDim[overallQty].h;
          ProductStor.product.template_square += ProductStor.product.template.details[0].overallDim[overallQty].square;
        }

//        console.warn(ProductStor.product.template_width, ProductStor.product.template_height);
//        console.log('objXFormedPrice+++++++', JSON.stringify(objXFormedPrice));
//        console.log('objXFormedPrice+++++++', objXFormedPrice);

        //console.log('START PRICE Time!!!!!!', new Date(), new Date().getMilliseconds());

        //--------- get product price
        calculationPrice(objXFormedPrice).then(function(result) {
          deferred.resolve(1);
          /** set Report */
          if(result) {
            //---- only for this type of user
            if(UserStor.userInfo.user_type === 5 || UserStor.userInfo.user_type === 7) {
              ProductStor.product.report = prepareReport(result.constrElements);
              //console.log('REPORT', ProductStor.product.report);
            }
          }
        });

        /** calculate coeffs */
        calculateCoeffs(objXFormedPrice);

        /** save analytics data first time */
        if(GlobalStor.global.startProgramm) {
//          AnalyticsServ.saveAnalyticDB(UserStor.userInfo.id, OrderStor.order.id, ProductStor.product.template_id, ProductStor.product.profile.id, 1);
          /** send analytics data to Server*/
          //------ profile
          AnalyticsServ.sendAnalyticsData(UserStor.userInfo.id, OrderStor.order.id, ProductStor.product.template_id, ProductStor.product.profile.id, 1);
        }
      });
      return deferred.promise;
    }


    /** set Bead Id */
    function setBeadId(profileId, laminatId) {
      var deff = $q.defer(),
          promisBeads = ProductStor.product.glass.map(function(item) {
            var deff2 = $q.defer();
            if(item.glass_width) {
              localDB.selectLocalDB(localDB.tablesLocalDB.beed_profile_systems.tableName, {'profile_system_id': profileId, "glass_width": item.glass_width}, 'list_id').then(function(beadIds) {
                var beadsQty = beadIds.length,
                    beadObj = {
                      glassId: item.id,
                      beadId: 0
                    };
                if(beadsQty) {
                  //console.log('beads++++', beadIds);
                  //----- if beads more one
                  if(beadsQty > 1) {
                    //----- go to kits and find bead width required laminat Id
                    var pomisList = beadIds.map(function(item2) {
                      var deff3 = $q.defer();
                      localDB.selectLocalDB(localDB.tablesLocalDB.lists.tableName, {'id': item2}, 'beed_lamination_id').then(function(lamId) {
                        console.log('lamId++++', lamId);
                        if(lamId) {
                          if(lamId[0] === laminatId) {
                            deff3.resolve(1);
                          } else {
                            deff3.resolve(0);
                          }
                        }
                      });
                      return deff3.promise;
                    });

                    $q.all(pomisList).then(function(results) {
                      console.log('finish++++', results);
                      var resultQty = results.length;
                      while(--resultQty > -1) {
                        if(results[resultQty]) {
                          beadObj.beadId = beadIds[resultQty].list_id;
                          deff2.resolve(beadObj);
                        }
                      }
                    });

                  } else {
                    beadObj.beadId = beadIds[0].list_id;
                    deff2.resolve(beadObj);
                  }

                } else {
                  console.log('Error!!', result);
                  deff2.resolve(0);
                }
              });
              return deff2.promise;
            }
          });

      deff.resolve($q.all(promisBeads));
      return deff.promise;
    }

    //function setBeadId(profileId, laminatId) {
    //  var defer = $q.defer(),
    //      promises = ProductStor.product.glass.map(function(item) {
    //        var defer2 = $q.defer();
    //        if(item.glass_width) {
    //          localDB.selectLocalDB(localDB.tablesLocalDB.beed_profile_systems.tableName, {'profile_system_id': profileId, "glass_width": item.glass_width}, 'list_id').then(function(result) {
    //            if(result.length) {
    //              var beadObj = {
    //                glassId: item.id,
    //                beadId: result[0].list_id
    //              };
    //              defer2.resolve(beadObj);
    //            } else {
    //              console.log('Error!!', result);
    //              defer2.resolve(0);
    //            }
    //          });
    //          return defer2.promise;
    //        }
    //      });
    //  defer.resolve($q.all(promises));
    //  return defer.promise;
    //}


    //---------- Price define
    function calculationPrice(obj) {
      var deferred = $q.defer();
      localDB.calculationPrice(obj).then(function (result) {
        if(result.priceTotal){
          ProductStor.product.template_price = GeneralServ.roundingValue(GeneralServ.addMarginToPrice(result.priceTotal, GlobalStor.global.margins.coeff), 2);
          setProductPriceTOTAL(ProductStor.product);
          //console.log('FINISH PRICE Time!!!!!!', new Date(), new Date().getMilliseconds());
          deferred.resolve(result);
        } else {
          ProductStor.product.template_price = 0;
          deferred.resolve(0);
        }
      });
      return deferred.promise;
    }



    function prepareReport(elementList) {
      var report = [],
          elementListQty = elementList.length,
          ind = 0,
          tempObj, reportQty, exist;
      if(elementListQty) {
        for (; ind < elementListQty; ind++) {
          tempObj = angular.copy(elementList[ind]);
          tempObj.element_id = angular.copy(tempObj.id);
          tempObj.amount = angular.copy(tempObj.qty);
          delete tempObj.id;
          delete tempObj.amendment_pruninng;
          delete tempObj.currency_id;
          delete tempObj.qty;
          delete tempObj.waste;
          if (ind) {
            reportQty = report.length;
            exist = 0;
            if (reportQty) {
              while (--reportQty > -1) {
                if (report[reportQty].element_id === tempObj.element_id && report[reportQty].size === tempObj.size) {
                  exist++;
                  report[reportQty].amount += tempObj.amount;
                  report[reportQty].priceReal += tempObj.priceReal;
                }
              }
              if (!exist) {
                report.push(tempObj);
              }
            }
          } else {
            report.push(tempObj);
          }
        }
        //------ add margins to price of every elements
        reportQty = report.length;
        while(--reportQty > -1) {
          report[reportQty].amount = GeneralServ.roundingValue(report[reportQty].amount, 3);
          report[reportQty].priceReal = GeneralServ.roundingValue(GeneralServ.addMarginToPrice(report[reportQty].priceReal, GlobalStor.global.margins.coeff), 2);
        }
      }
      return report;
    }






    //---------- Coeffs define
    function calculateCoeffs(objXFormedPrice) {
      var glassSquareTotal = 0,
          glassSizeQty = objXFormedPrice.sizes[5].length,
          glassQty = ProductStor.product.glass.length,
          glassHeatCoeffTotal = 0,
          profileHeatCoeffTotal = 0,
          commonHeatCoeffTotal = 0;

      /** working with glasses */
      while(--glassSizeQty > -1) {
        /** culculate glass Heat Coeff Total */
        for(var g = 0; g < glassQty; g++) {
          if(objXFormedPrice.sizes[5][glassSizeQty].elemId == ProductStor.product.glass[g].id) {
            //$.isNumeric
            if(!angular.isNumber(ProductStor.product.glass[g].transcalency)){
              ProductStor.product.glass[g].transcalency = 1;
            }
            glassHeatCoeffTotal += ProductStor.product.glass[g].transcalency * objXFormedPrice.sizes[5][glassSizeQty].square;
          }
        }
        /** get total glasses square */
        glassSquareTotal += objXFormedPrice.sizes[5][glassSizeQty].square;
      }
      glassHeatCoeffTotal = GeneralServ.roundingValue(glassHeatCoeffTotal);
      glassSquareTotal = GeneralServ.roundingValue(glassSquareTotal, 3);

      /** culculate profile Heat Coeff Total */
      if(!angular.isNumber(ProductStor.product.profile.heat_coeff_value)) {
        ProductStor.product.profile.heat_coeff_value = 1;
      }
      profileHeatCoeffTotal = ProductStor.product.profile.heat_coeff_value * (ProductStor.product.template_square - glassSquareTotal);

      commonHeatCoeffTotal = profileHeatCoeffTotal + glassHeatCoeffTotal;
      /** calculate Heat Coeff Total */
      if(UserStor.userInfo.therm_coeff_id) {
        /** R */
        ProductStor.product.heat_coef_total = GeneralServ.roundingValue( commonHeatCoeffTotal/ProductStor.product.template_square );
      } else {
        /** U */
        ProductStor.product.heat_coef_total = GeneralServ.roundingValue( ProductStor.product.template_square/commonHeatCoeffTotal );
      }

    }



    function setProductPriceTOTAL(Product) {
      var default_delivery_plant = GlobalStor.global.deliveryCoeff.percents[GlobalStor.global.deliveryCoeff.standart_time];
      //playSound('price');
      Product.product_price = GeneralServ.roundingValue( Product.template_price + Product.addelem_price );
      Product.productPriceDis = ( GeneralServ.setPriceDis(Product.template_price, OrderStor.order.discount_construct) + Product.addelemPriceDis );
      //------ add Discount of standart delivery day of Plant
      if(default_delivery_plant) {
        Product.productPriceDis = GeneralServ.setPriceDis(Product.productPriceDis, default_delivery_plant);
      }
      GlobalStor.global.isLoader = 0;
    }





    /** show Info Box of element or group */
    function showInfoBox(id, itemArr) {
      if(GlobalStor.global.isInfoBox !== id) {
//        console.info(id, itemArr);
        var itemArrQty = itemArr.length,
            tempObj = {};
        while(--itemArrQty > -1) {
          if(itemArr[itemArrQty].lamination_type_id) {
            if(itemArr[itemArrQty].lamination_type_id === id) {
              tempObj = itemArr[itemArrQty];
            }
          } else {
            if(itemArr[itemArrQty].id === id) {
              tempObj = itemArr[itemArrQty];
            }
          }
        }
        if(!$.isEmptyObject(tempObj)) {
          GlobalStor.global.infoTitle = tempObj.name;
          GlobalStor.global.infoImg =  tempObj.img;
          GlobalStor.global.infoLink = tempObj.link;
          GlobalStor.global.infoDescrip = tempObj.description;
          GlobalStor.global.isInfoBox = id;
        }
//        console.info(GlobalStor.global.infoTitle, GlobalStor.global.infoImg, GlobalStor.global.infoLink, GlobalStor.global.infoDescrip);
      }
    }


    /**---------- Close Room Selector Dialog ---------*/
    function closeRoomSelectorDialog() {
      GlobalStor.global.showRoomSelectorDialog = 0;
      GlobalStor.global.configMenuTips = (GlobalStor.global.startProgramm) ? 1 : 0;
      //playSound('fly');
    }



    /**-------- filtering Lamination Groupes -----------*/

    function laminatFiltering() {
      var laminatQty = GlobalStor.global.laminats.length,
          /** sort by Profile */
          lamGroupsTemp = GlobalStor.global.laminatCouples.filter(function(item) {
            if(item.profile_id) {
              return item.profile_id === ProductStor.product.profile.id;
            } else {
              return true;
            }
          }),
          lamGroupsTempQty, isAnyActive = 0;

      //console.info('filter _____ ', lamGroupsTemp);

      GlobalStor.global.lamGroupFiltered.length = 0;

      while(--laminatQty > -1) {
        if(GlobalStor.global.laminats[laminatQty].isActive) {
          isAnyActive = 1;
          lamGroupsTempQty = lamGroupsTemp.length;
          while(--lamGroupsTempQty > -1) {
            if(lamGroupsTemp[lamGroupsTempQty].img_in_id === GlobalStor.global.laminats[laminatQty].type_id) {
              if(checkLamGroupExist(lamGroupsTemp[lamGroupsTempQty].id)) {
                GlobalStor.global.lamGroupFiltered.push(lamGroupsTemp[lamGroupsTempQty]);
              }
            } else if(lamGroupsTemp[lamGroupsTempQty].img_out_id === GlobalStor.global.laminats[laminatQty].type_id) {
              if(checkLamGroupExist(lamGroupsTemp[lamGroupsTempQty].id)) {
                GlobalStor.global.lamGroupFiltered.push(lamGroupsTemp[lamGroupsTempQty]);
              }
            }
          }
        }
      }
      //console.info('lamGroupFiltered _____ ', GlobalStor.global.lamGroupFiltered);
      if(!GlobalStor.global.lamGroupFiltered.length) {
        if(!isAnyActive) {
          GlobalStor.global.lamGroupFiltered = lamGroupsTemp;
        }
      }
    }


    function checkLamGroupExist(lamId) {
      var lamQty = GlobalStor.global.lamGroupFiltered.length,
          noExist = 1;
      while(--lamQty > -1) {
        if(GlobalStor.global.lamGroupFiltered[lamQty].id === lamId) {
          noExist = 0;
        }
      }
      return noExist;
    }


    function setCurrLamination(newLamId) {
      var laminatGroupQty = GlobalStor.global.laminatCouples.length;
      //---- clean filter
      cleanLamFilter();
      while(--laminatGroupQty > -1) {
        if(newLamId) {
          //------ set lamination Couple with color
          if(GlobalStor.global.laminatCouples[laminatGroupQty].id === newLamId) {
            ProductStor.product.lamination = GlobalStor.global.laminatCouples[laminatGroupQty];
          }
        } else {
          //----- set white lamination Couple
          if(!GlobalStor.global.laminatCouples[laminatGroupQty].id) {
            ProductStor.product.lamination = GlobalStor.global.laminatCouples[laminatGroupQty];
          }
        }
      }
    }


    function cleanLamFilter() {
      var laminatQty = GlobalStor.global.laminats.length;
      //---- deselect filter
      while(--laminatQty > -1) {
        GlobalStor.global.laminats[laminatQty].isActive = 0;
      }
    }



    function setProfileByLaminat(lamId) {
      var deff = $q.defer();
      if(lamId) {
        //------ set profiles parameters
        ProductStor.product.profile.rama_list_id = ProductStor.product.lamination.rama_list_id;
        ProductStor.product.profile.rama_still_list_id = ProductStor.product.lamination.rama_still_list_id;
        ProductStor.product.profile.stvorka_list_id = ProductStor.product.lamination.stvorka_list_id;
        ProductStor.product.profile.impost_list_id = ProductStor.product.lamination.impost_list_id;
        ProductStor.product.profile.shtulp_list_id = ProductStor.product.lamination.shtulp_list_id;
      } else {
        ProductStor.product.profile = angular.copy(fineItemById(ProductStor.product.profile.id, GlobalStor.global.profiles));
      }
      //------- set Depths
      $q.all([
        downloadProfileDepth(ProductStor.product.profile.rama_list_id),
        downloadProfileDepth(ProductStor.product.profile.rama_still_list_id),
        downloadProfileDepth(ProductStor.product.profile.stvorka_list_id),
        downloadProfileDepth(ProductStor.product.profile.impost_list_id),
        downloadProfileDepth(ProductStor.product.profile.shtulp_list_id)
      ]).then(function (result) {
        ProductStor.product.profileDepths.frameDepth = result[0];
        ProductStor.product.profileDepths.frameStillDepth = result[1];
        ProductStor.product.profileDepths.sashDepth = result[2];
        ProductStor.product.profileDepths.impostDepth = result[3];
        ProductStor.product.profileDepths.shtulpDepth = result[4];

        SVGServ.createSVGTemplate(ProductStor.product.template_source, ProductStor.product.profileDepths).then(function(result) {
          ProductStor.product.template = angular.copy(result);
          var hardwareIds = (ProductStor.product.hardware.id) ? ProductStor.product.hardware.id : 0;
          preparePrice(ProductStor.product.template, ProductStor.product.profile.id, ProductStor.product.glass, hardwareIds, ProductStor.product.lamination.img_in_id).then(function() {
            deff.resolve(1);
          });
          //----- create template icon
          SVGServ.createSVGTemplateIcon(ProductStor.product.template_source, ProductStor.product.profileDepths).then(function(result) {
            ProductStor.product.templateIcon = angular.copy(result);
          });
        });

      });
      return deff.promise;
    }







    /**========== CREATE ORDER ==========*/

    function createNewProject() {
      console.log('new project!!!!!!!!!!!!!!', OrderStor.order);
      //----- cleaning product
      ProductStor.product = ProductStor.setDefaultProduct();
      //------- set new orderId
      createOrderData();
      //------- set current Discounts
      setCurrDiscounts();
      GlobalStor.global.isChangedTemplate = 0;
      GlobalStor.global.isShowCommentBlock = 0;
      GlobalStor.global.isCreatedNewProject = 1;
      GlobalStor.global.isCreatedNewProduct = 1;
      //------- set new templates
      setCurrTemplate();
      prepareTemplates(ProductStor.product.construction_type).then(function() {
        GlobalStor.global.isLoader = 0;
        prepareMainPage();
        /** start lamination filtering */
        cleanLamFilter();
        laminatFiltering();
        if(GlobalStor.global.currOpenPage !== 'main') {
          GlobalStor.global.showRoomSelectorDialog = 0;
          $location.path('/main');
          $timeout(function() {
            GlobalStor.global.showRoomSelectorDialog = 1;
          }, 1000);
        }
      });
    }






    /**========== CREATE PRODUCT ==========*/

    function createNewProduct() {
      console.log('new product!!!!!!!!!!!!!!!');
      //------- cleaning product
      ProductStor.product = ProductStor.setDefaultProduct();
      GlobalStor.global.isCreatedNewProduct = 1;
      GlobalStor.global.isChangedTemplate = 0;
      //------- set new templates
      setCurrTemplate();
      prepareTemplates(ProductStor.product.construction_type).then(function() {
        prepareMainPage();
        /** start lamination filtering */
        cleanLamFilter();
        laminatFiltering();
        if(GlobalStor.global.currOpenPage !== 'main') {
          GlobalStor.global.showRoomSelectorDialog = 0;
          $location.path('/main');
          $timeout(function() {
            GlobalStor.global.showRoomSelectorDialog = 1;
          }, 1000);
        }
      });
    }


    function setDefaultDoorConfig() {
      ProductStor.product.door_shape_id = 0;
      ProductStor.product.door_sash_shape_id = 0;
      ProductStor.product.door_handle_shape_id = 0;
      ProductStor.product.door_lock_shape_id = 0;
    }


    function prepareMainPage() {
      GlobalStor.global.isNavMenu = 0;
      GlobalStor.global.isConfigMenu = 1;
      GlobalStor.global.activePanel = 0;
      setDefaultAuxParam();
      if(GlobalStor.global.startProgramm) {
        $timeout(function() {
          GlobalStor.global.showRoomSelectorDialog = 1;
        }, 2000);
        $timeout(closeRoomSelectorDialog, 5000);
      }
    }


    function setDefaultAuxParam() {
      AuxStor.aux.isWindowSchemeDialog = 0;
      AuxStor.aux.isAddElementListView = 0;
      AuxStor.aux.isFocusedAddElement = 0;
      AuxStor.aux.isTabFrame = 0;
      AuxStor.aux.isAddElementListView = 0;
      AuxStor.aux.showAddElementsMenu = 0;
      AuxStor.aux.addElementGroups.length = 0;
      AuxStor.aux.searchingWord = '';
      AuxStor.aux.isGridSelectorDialog = 0;
    }





    /**========== SAVE PRODUCT ==========*/

    //-------- Save Product in Order and go to Cart
    function inputProductInOrder() {
      var permission = 1;
      //------- if AddElems only, check is there selected AddElems
      if(ProductStor.product.is_addelem_only) {
        permission = checkEmptyChoosenAddElems();
      }

      if(permission) {
        GlobalStor.global.tempAddElements.length = 0;
        GlobalStor.global.configMenuTips = 0;
        GlobalStor.global.isShowCommentBlock = 0;
        setDefaultAuxParam();

        /**============ EDIT Product =======*/
        if (GlobalStor.global.productEditNumber) {
          var productsQty = OrderStor.order.products.length;
          //-------- replace product in order
          while (--productsQty > -1) {
            if (OrderStor.order.products[productsQty].product_id === GlobalStor.global.productEditNumber) {
              OrderStor.order.products[productsQty] = angular.copy(ProductStor.product);
            }
          }

          /**========== if New Product =========*/
        } else {
          ProductStor.product.product_id = (OrderStor.order.products.length > 0) ? (OrderStor.order.products.length + 1) : 1;
          ProductStor.product.template_source['beads'] = angular.copy(ProductStor.product.template.priceElements.beadsSize);
          delete ProductStor.product.template;
          //-------- insert product in order
          OrderStor.order.products.push(ProductStor.product);
        }
        //----- finish working with product
        GlobalStor.global.isCreatedNewProduct = 0;
        GeneralServ.stopStartProg();
      }
      return permission;
    }


    function checkEmptyChoosenAddElems() {
      var addElemQty = ProductStor.product.chosenAddElements.length,
          isExist = 0;

      while(--addElemQty > -1) {
        if(ProductStor.product.chosenAddElements[addElemQty].length) {
          isExist++;
        }
      }
      return isExist;
    }


    //--------- moving to Cart when click on Cart button
    function goToCart() {
      $timeout(function() {
        //------- set previos Page
        GeneralServ.setPreviosPage();
        $location.path('/cart');
      }, 100);
    }





    /** ========== SAVE ORDER ==========*/

    //-------- save Order into Local DB
    function saveOrderInDB(newOptions, orderType, orderStyle) {
      var deferred = $q.defer();

      //---------- if EDIT Order, before inserting delete old order
      if(GlobalStor.global.orderEditNumber) {
        deleteOrderInDB(GlobalStor.global.orderEditNumber);
        localDB.deleteOrderServer(UserStor.userInfo.phone, UserStor.userInfo.device_code, GlobalStor.global.orderEditNumber);
        GlobalStor.global.orderEditNumber = 0;
      }
      angular.extend(OrderStor.order, newOptions);

      /** ===== SAVE PRODUCTS =====*/

      var prodQty = OrderStor.order.products.length;
      for(var p = 0; p < prodQty; p++) {
        var productData = angular.copy(OrderStor.order.products[p]);
        productData.order_id = OrderStor.order.id;
        productData.template_source = JSON.stringify(OrderStor.order.products[p].template_source);
        productData.profile_id = OrderStor.order.products[p].profile.id;
        productData.glass_id = OrderStor.order.products[p].glass.map(function(item) {
          return item.id;
        }).join(', ');
        productData.hardware_id = (OrderStor.order.products[p].hardware.id) ? OrderStor.order.products[p].hardware.id : 0;
        productData.lamination_id = OrderStor.order.products[p].lamination.id;
        productData.lamination_in_id = OrderStor.order.products[p].lamination.lamination_in_id;
        productData.lamination_out_id = OrderStor.order.products[p].lamination.lamination_out_id;
        productData.modified = new Date();
        if(productData.template) {
          delete productData.template;
        }
        delete productData.templateIcon;
        delete productData.profile;
        delete productData.glass;
        delete productData.hardware;
        delete productData.lamination;
        delete productData.chosenAddElements;
        delete productData.profileDepths;
        delete productData.addelemPriceDis;
        delete productData.productPriceDis;
        delete productData.report;

        /** culculate products quantity for order */
        OrderStor.order.products_qty += OrderStor.order.products[p].product_qty;

        console.log('SEND PRODUCT------', productData);
        //-------- insert product into local DB
        localDB.insertRowLocalDB(productData, localDB.tablesLocalDB.order_products.tableName);
        //-------- send to Server
        if(orderType) {
          localDB.insertServer(UserStor.userInfo.phone, UserStor.userInfo.device_code, localDB.tablesLocalDB.order_products.tableName, productData);
        }


        /** ====== SAVE Report Data ===== */

        var productReportData = angular.copy(OrderStor.order.products[p].report),
            reportQty = productReportData.length;
        //console.log('productReportData', productReportData);
        while(--reportQty > -1) {
          productReportData[reportQty].order_id = OrderStor.order.id;
          productReportData[reportQty].price = angular.copy(productReportData[reportQty].priceReal);
          delete productReportData[reportQty].priceReal;
          //-------- insert product Report into local DB
//          localDB.insertRowLocalDB(productReportData[reportQty], localDB.tablesLocalDB.order_elements.tableName);
          //-------- send Report to Server
//TODO          localDB.insertServer(UserStor.userInfo.phone, UserStor.userInfo.device_code, localDB.tablesLocalDB.order_elements.tableName, productReportData[reportQty]);
        }

        /**============= SAVE ADDELEMENTS ============ */

        var addElemQty = OrderStor.order.products[p].chosenAddElements.length;
        for(var add = 0; add < addElemQty; add++) {
          var elemQty = OrderStor.order.products[p].chosenAddElements[add].length;
          if(elemQty > 0) {
            for (var elem = 0; elem < elemQty; elem++) {

              var addElementsData = {
                order_id: OrderStor.order.id,
                product_id: OrderStor.order.products[p].product_id,
                element_type: OrderStor.order.products[p].chosenAddElements[add][elem].element_type,
                element_id: OrderStor.order.products[p].chosenAddElements[add][elem].id,
                name: OrderStor.order.products[p].chosenAddElements[add][elem].name,
                element_width: OrderStor.order.products[p].chosenAddElements[add][elem].element_width,
                element_height: OrderStor.order.products[p].chosenAddElements[add][elem].element_height,
                element_price: OrderStor.order.products[p].chosenAddElements[add][elem].element_price,
                element_qty: OrderStor.order.products[p].chosenAddElements[add][elem].element_qty,
                block_id:  OrderStor.order.products[p].chosenAddElements[add][elem].block_id,
                modified: new Date()
              };


              console.log('SEND ADD',addElementsData);
              localDB.insertRowLocalDB(addElementsData, localDB.tablesLocalDB.order_addelements.tableName);
              if(orderType) {
                localDB.insertServer(UserStor.userInfo.phone, UserStor.userInfo.device_code, localDB.tablesLocalDB.order_addelements.tableName, addElementsData);
              }
            }
          }
        }
      }

      /** ============ SAVE ORDER =========== */

//      console.log('!!!!ORDER!!!!', JSON.stringify(OrderStor.order));
      var orderData = angular.copy(OrderStor.order);
      orderData.order_date = new Date(OrderStor.order.order_date);
      orderData.order_type = orderType;
      orderData.order_style = orderStyle;
      orderData.factory_id = UserStor.userInfo.factory_id;
      orderData.user_id = UserStor.userInfo.id;
      orderData.delivery_date = new Date(OrderStor.order.delivery_date);
      orderData.new_delivery_date = new Date(OrderStor.order.new_delivery_date);
      orderData.customer_sex = (OrderStor.order.customer_sex) ? +OrderStor.order.customer_sex : 0;
      orderData.customer_age = (OrderStor.order.customer_age) ? OrderStor.order.customer_age.id : 0;
      orderData.customer_education = (OrderStor.order.customer_education) ? OrderStor.order.customer_education.id : 0;
      orderData.customer_occupation = (OrderStor.order.customer_occupation) ? OrderStor.order.customer_occupation.id : 0;
      orderData.customer_infoSource = (OrderStor.order.customer_infoSource) ? OrderStor.order.customer_infoSource.id : 0;
      orderData.products_qty = GeneralServ.roundingValue(OrderStor.order.products_qty);
      //----- rates %
      orderData.discount_construct_max = UserStor.userInfo.discountConstrMax;
      orderData.discount_addelem_max = UserStor.userInfo.discountAddElemMax;
      orderData.default_term_plant = GlobalStor.global.deliveryCoeff.percents[GlobalStor.global.deliveryCoeff.standart_time];
      orderData.disc_term_plant = CartStor.cart.discountDeliveyPlant;
      orderData.margin_plant = CartStor.cart.marginDeliveyPlant;

      if(orderType) {
        orderData.additional_payment = '';
        orderData.created = new Date();
        orderData.sended = new Date(0);
        orderData.state_to = new Date(0);
        orderData.state_buch = new Date(0);
        orderData.batch = '---';
        orderData.base_price = 0;
        orderData.factory_margin = 0;
        orderData.purchase_price = 0;
        orderData.sale_price = 0;
        orderData.modified = new Date();
      }

      delete orderData.products;
      delete orderData.floorName;
      delete orderData.mountingName;
      delete orderData.selectedInstalmentPeriod;
      delete orderData.selectedInstalmentPercent;
      delete orderData.productsPriceDis;
      delete orderData.orderPricePrimaryDis;
      delete orderData.paymentFirstDis;
      delete orderData.paymentMonthlyDis;
      delete orderData.paymentFirstPrimaryDis;
      delete orderData.paymentMonthlyPrimaryDis;

      console.log('!!!!orderData!!!!', orderData);
      if(orderType) {
        localDB.insertServer(UserStor.userInfo.phone, UserStor.userInfo.device_code, localDB.tablesLocalDB.orders.tableName, orderData).then(function(respond) {
          if(respond.status) {
            orderData.order_number = respond.order_number;
          }
          localDB.insertRowLocalDB(orderData, localDB.tablesLocalDB.orders.tableName);
          deferred.resolve(1);
        });
      } else {
        //------- save draft
        localDB.insertRowLocalDB(orderData, localDB.tablesLocalDB.orders.tableName);
        deferred.resolve(1);
      }

      //TODO
      //------ send analytics data to Server
//      AnalyticsServ.sendAnalyticsDB();

      //----- cleaning order
      OrderStor.order = OrderStor.setDefaultOrder();
      //------ set current GeoLocation
      loginServ.setUserGeoLocation(UserStor.userInfo.city_id, UserStor.userInfo.cityName, UserStor.userInfo.climaticZone, UserStor.userInfo.heatTransfer, UserStor.userInfo.fullLocation);
      //----- finish working with order
      GlobalStor.global.isCreatedNewProject = 0;
      return deferred.promise;
    }



    //-------- delete order from LocalDB
    function deleteOrderInDB(orderNum) {
      localDB.deleteRowLocalDB(localDB.tablesLocalDB.orders.tableName, {'id': orderNum});
      localDB.deleteRowLocalDB(localDB.tablesLocalDB.order_products.tableName, {'order_id': orderNum});
      localDB.deleteRowLocalDB(localDB.tablesLocalDB.order_addelements.tableName, {'order_id': orderNum});
    }



  }
})();



// services/nav_menu_serv.js

(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .factory('NavMenuServ', navFactory);

  function navFactory($location, $http, $filter, $cordovaGeolocation, GeneralServ, MainServ, CartMenuServ, GlobalStor, OrderStor, ProductStor) {

    var thisFactory = this;

    thisFactory.publicObj = {
      getCurrentGeolocation: getCurrentGeolocation,
      setLanguageVoiceHelper: setLanguageVoiceHelper,
      switchVoiceHelper: switchVoiceHelper,
      gotoHistoryPage: gotoHistoryPage,
      createAddElementsProduct: createAddElementsProduct,
      clickNewProject: clickNewProject
    };

    return thisFactory.publicObj;




    //============ methods ================//

    function getCurrentGeolocation() {
      //------ Data from GPS device
      //navigator.geolocation.getCurrentPosition(successLocation, errorLocation);
      $cordovaGeolocation.getCurrentPosition().then(successLocation, errorLocation);

        function successLocation(position) {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            $http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng='+latitude+','+longitude+'&sensor=true&language=ru').
                success(function(data, status, headers, config) {
                    //----- save previous current location
                    //$scope.global.prevGeoLocation = angular.copy($scope.global.currentGeoLocation);

                    var deviceLocation = data.results[0].formatted_address.split(', ');
                    //TODO set new currencyID!!!!
                    //TODO before need to fine currencyId!!!!
                    //TODO loginServ.setUserGeoLocation(cityId, cityName, climatic, heat, fullLocation, currencyId)

                    OrderStor.order.customer_city_id = 156; //TODO должны тянуть с базы согласно новому городу, но город гугл дает на украинском языке, в базе на русском
                    OrderStor.order.customer_city = deviceLocation[deviceLocation.length-3];
                    OrderStor.order.climatic_zone = 7; //TODO
                    OrderStor.order.heat_coef_min = 0.99; //TODO
                    OrderStor.order.customer_location = deviceLocation[deviceLocation.length-3] + ', ' + deviceLocation[deviceLocation.length-2] + ', ' + deviceLocation[deviceLocation.length-1];

                }).
                error(function(data, status, headers, config) {
                    alert(status);
                });
        }
        function errorLocation(error) {
            alert(error.message);
        }
    }


    function switchVoiceHelper() {
      GlobalStor.global.isVoiceHelper = !GlobalStor.global.isVoiceHelper;
      if(GlobalStor.global.isVoiceHelper) {
        //------- set Language for Voice Helper
        GlobalStor.global.voiceHelperLanguage = setLanguageVoiceHelper();
        playTTS($filter('translate')('construction.VOICE_SWITCH_ON'), GlobalStor.global.voiceHelperLanguage);
      }
    }


    function setLanguageVoiceHelper() {
      var langLabel = 'ru_RU';

//      switch (UserStor.userInfo.langLabel) {
//        //case 'ua': langLabel = 'ukr-UKR';
//        case 'ua': langLabel = 'ru_RU';
//        break;
//        case 'ru': langLabel = 'ru_RU';
//        break;
//        case 'en': langLabel = 'en_US';
//        break;
//        case 'de': langLabel = 'de_DE';
//        break;
//        case 'ro': langLabel = 'ro_RO';
//        break;
//      }
      return langLabel;
    }


    function gotoHistoryPage() {
      GlobalStor.global.isNavMenu = false;
      GlobalStor.global.isConfigMenu = true;
      //---- если идем в историю через корзину, заказ сохраняем в черновик
      /*if($scope.global.isOpenedCartPage) {
       $scope.global.insertOrderInLocalDB({}, $scope.global.draftOrderType, '');
       $scope.global.isCreatedNewProject = false;
       $scope.global.isCreatedNewProduct = false;
       }*/
      //------- set previos Page
      GeneralServ.setPreviosPage();
      $location.path('/history');
    }


    function createAddElementsProduct() {
      GeneralServ.stopStartProg();
      if(ProductStor.product.is_addelem_only) {
        MainServ.createNewProduct();
      } else {
        //------- create new empty product
        ProductStor.product = ProductStor.setDefaultProduct();
        MainServ.closeRoomSelectorDialog();
        MainServ.setDefaultAuxParam();
        ProductStor.product.is_addelem_only = 1;
        GlobalStor.global.isNavMenu = 0;
        GlobalStor.global.isConfigMenu = 1;
        //------ open AddElements Panel
        GlobalStor.global.activePanel = 6;
      }
    }




    //----------- Create new Project
    function clickNewProject() {

      //------- Start programm, without draft, for Main Page
      if(GlobalStor.global.startProgramm) {
        GeneralServ.stopStartProg();
        MainServ.prepareMainPage();

      } else {
        GlobalStor.global.isLoader = 1;

        //------- Create New Project with Draft saving in Main Page
        if(GlobalStor.global.isCreatedNewProject && GlobalStor.global.isCreatedNewProduct) {
          //------ save product
          if(MainServ.inputProductInOrder()) {
            //------- define order Price
            CartMenuServ.calculateOrderPrice();
            //-------- save order as Draft
            MainServ.saveOrderInDB({}, 0, '');
          }
          //------- Create New Project with Draft saving in Cart Page
        } else if(GlobalStor.global.isCreatedNewProject && !GlobalStor.global.isCreatedNewProduct) {
          //-------- save order as Draft
          MainServ.saveOrderInDB({}, 0, '');
        }

        //------- set previos Page
        GeneralServ.setPreviosPage();
        //=============== CREATE NEW PROJECT =========//
        MainServ.createNewProject();

      }
    }


  }
})();



// services/options_serv.js

(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('BauVoiceApp')
    .factory('optionsServ', optionFactory);

  function optionFactory($filter) {

    return {


      getTemplateImgIcons: function (callback) {
        callback(new OkResult({
          templateImgs: [
            {
              id: 1,
              name: $filter('translate')('panels.ONE_WINDOW_TYPE'),
              src: 'img/templates/1.png'
            },
            {
              id: 2,
              name: $filter('translate')('panels.TWO_WINDOW_TYPE'),
              src: 'img/templates/3.png'
            },
            {
              id: 3,
              name: $filter('translate')('panels.THREE_WINDOW_TYPE'),
              src: 'img/templates/4.png'
            },
            {
              id: 4,
              name: $filter('translate')('panels.TWO_WINDOW_TYPE'),
              src: 'img/templates/5.png'
            },
            {
              id: 5,
              name: $filter('translate')('panels.TWO_WINDOW_TYPE'),
              src: 'img/templates/6.png'
            },
            {
              id: 6,
              name: $filter('translate')('panels.TWO_WINDOW_TYPE'),
              src: 'img/templates/7.png'
            },
            {
              id: 7,
              name: $filter('translate')('panels.ONE_WINDOW_TYPE'),
              src: 'img/templates/8.png'
            },
            {
              id: 8,
              name: $filter('translate')('panels.TWO_WINDOW_TYPE'),
              src: 'img/templates/9.png'
            },
            {
              id: 9,
              name: $filter('translate')('panels.THREE_WINDOW_TYPE'),
              src: 'img/templates/10.png'
            },
            {
              id: 10,
              name: $filter('translate')('panels.THREE_WINDOW_TYPE'),
              src: 'img/templates/11.png'
            },
            {
              id: 11,
              name: $filter('translate')('panels.THREE_WINDOW_TYPE'),
              src: 'img/templates/12.png'
            }
          ]
        }));
      },


      getTemplatesWindow: function(callback) {
        callback(new OkResult({
          windows: [
            {
              name: 'Глухое',
              details: [
                {
                  type:'skylight',
                  id:'block_0',
                  level: 0,
                  blockType:'frame',
                  children:['block_1'],
                  maxSizeLimit: 5000
                },
                //------- Level 1
                {
                  type:'skylight',
                  id:'block_1',
                  level: 1,
                  blockType:'frame',
                  parent: 'block_0',
                  children: [],
                  pointsOut: [
                    {type:'frame', id:'fp1', x:0, y:0, dir:'line', view:1},
                    {type:'frame', id:'fp2', x:1300, y:0, dir:'line', view:1},
                    {type:'frame', id:'fp3', x:1300, y:1400, dir:'line', view:1, sill:1},
                    {type:'frame', id:'fp4', x:0, y:1400, dir:'line', view:1, sill:1}
                  ],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                }
              ]
            },

            {
              name: 'Двухстворчатое',
              details: [
                {
                  type:'skylight',
                  id:'block_0',
                  level: 0,
                  blockType:'frame',
                  children:['block_1'],
                  maxSizeLimit: 5000
                },
                //------- Level 1
                {
                  type:'skylight',
                  id:'block_1',
                  level: 1,
                  blockType:'frame',
                  parent: 'block_0',
                  children: ['block_2', 'block_3'],
                  impost: {
                    impostAxis: [
                      {type:'impost', id:'ip1', x:530, y:0, dir:'line'},
                      {type:'impost', id:'ip1', x:530, y:1320, dir:'line'}
                    ],
                    impostOut: [],
                    impostIn : []
                  },
                  pointsOut: [
                    {type:'frame', id:'fp1', x:0, y:0, dir:'line', view:1},
                    {type:'frame', id:'fp2', x:1060, y:0, dir:'line', view:1},
                    {type:'frame', id:'fp3', x:1060, y:1320, dir:'line', view:1, sill:1},
                    {type:'frame', id:'fp4', x:0, y:1320, dir:'line', view:1, sill:1}
                  ],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                },
                //------- Level 2
                {
                  type:'skylight',
                  id:'block_2',
                  level: 2,
                  blockType: 'frame',
                  parent: 'block_1',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                },
                {
                  type:'skylight',
                  id:'block_3',
                  level: 2,
                  blockType: 'frame',
                  parent: 'block_1',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                }
              ]
            },

            {
              name: 'Трехстворчатое',
              details: [
                {
                  type:'skylight',
                  id:'block_0',
                  level: 0,
                  blockType:'frame',
                  children:['block_1'],
                  maxSizeLimit: 5000
                },
                //------- Level 1
                {
                  type:'skylight',
                  id:'block_1',
                  level: 1,
                  blockType:'frame',
                  parent: 'block_0',
                  children: ['block_2', 'block_3'],
                  impost: {
                    impostAxis: [
                      {type:'impost', id:'ip1', x:700, y:0, dir:'line'},
                      {type:'impost', id:'ip1', x:700, y:1400, dir:'line'}
                    ],
                    impostOut: [],
                    impostIn : []
                  },
                  pointsOut: [
                    {type:'frame', id:'fp1', x:0, y:0, dir:'line', view:1},
                    {type:'frame', id:'fp2', x:2100, y:0, dir:'line', view:1},
                    {type:'frame', id:'fp3', x:2100, y:1400, dir:'line', view:1, sill:1},
                    {type:'frame', id:'fp4', x:0, y:1400, dir:'line', view:1, sill:1}
                  ],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                },
                //------- Level 2
                {
                  type:'skylight',
                  id:'block_2',
                  level: 2,
                  blockType: 'frame',
                  parent: 'block_1',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                },
                {
                  type:'skylight',
                  id:'block_3',
                  level: 2,
                  blockType: 'frame',
                  parent: 'block_1',
                  children: ['block_4', 'block_5'],
                  pointsOut: [],
                  pointsIn: [],
                  impost: {
                    impostAxis: [
                      {type:'impost', id:'ip3', x:1400, y:0, dir:'line'},
                      {type:'impost', id:'ip3', x:1400, y:1400, dir:'line'}
                    ],
                    impostOut: [],
                    impostIn : []
                  },
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                },
                //------- Level 3
                {
                  type:'skylight',
                  id:'block_4',
                  level: 3,
                  blockType: 'frame',
                  parent: 'block_3',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                },
                {
                  type:'skylight',
                  id:'block_5',
                  level: 3,
                  blockType: 'frame',
                  parent: 'block_3',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                }
              ]
            },



            {
              name: 'Двухстворчатое',
              details: [
                {
                  type:'skylight',
                  id:'block_0',
                  level: 0,
                  blockType:'frame',
                  children:['block_1'],
                  maxSizeLimit: 5000
                },
//------- Level 1
                {
                  type:'skylight',
                  id:'block_1',
                  level: 1,
                  blockType:'frame',
                  parent: 'block_0',
                  children: ['block_2', 'block_3'],
                  impost: {
                    impostAxis: [
                      {type:'impost', id:'ip1', x:530, y:0, dir:'line'},
                      {type:'impost', id:'ip1', x:530, y:1320, dir:'line'}
                    ],
                    impostOut: [],
                    impostIn : []
                  },
                  pointsOut: [
                    {type:'frame', id:'fp1', x:0, y:0, dir:'line', view:1},
                    {type:'frame', id:'fp2', x:1060, y:0, dir:'line', view:1},
                    {type:'frame', id:'fp3', x:1060, y:1320, dir:'line', view:1, sill:1},
                    {type:'frame', id:'fp4', x:0, y:1320, dir:'line', view:1, sill:1}
                  ],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                },
//------- Level 2
                {
                  type:'skylight',
                  id:'block_2',
                  level: 2,
                  blockType: 'frame',
                  parent: 'block_1',
                  children: ['block_4', 'block_5'],
                  impost: {
                    impostAxis: [
                      {type:'impost', id:'ip3', x:0, y:300, dir:'line'},
                      {type:'impost', id:'ip3', x:530, y:300, dir:'line'}
                    ],
                    impostOut: [],
                    impostIn : []
                  },
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                },
                {
                  type:'skylight',
                  id:'block_3',
                  level: 2,
                  blockType: 'frame',
                  parent: 'block_1',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                },
//------- Level 3
                {
                  type:'skylight',
                  id:'block_4',
                  level: 3,
                  blockType: 'frame',
                  parent: 'block_2',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                },
                {
                  type:'skylight',
                  id:'block_5',
                  level: 3,
                  blockType: 'frame',
                  parent: 'block_2',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                }
              ]
            },

            {
              name: 'Двухстворчатое',
              details: [
                {
                  type:'skylight',
                  id:'block_0',
                  level: 0,
                  blockType:'frame',
                  children:['block_1'],
                  maxSizeLimit: 5000
                },
//------- Level 1
                {
                  type:'skylight',
                  id:'block_1',
                  level: 1,
                  blockType:'frame',
                  parent: 'block_0',
                  children: ['block_2', 'block_3'],
                  impost: {
                    impostAxis: [
                      {type:'impost', id:'ip1', x:530, y:0, dir:'line'},
                      {type:'impost', id:'ip1', x:530, y:1320, dir:'line'}
                    ],
                    impostOut: [],
                    impostIn : []
                  },
                  pointsOut: [
                    {type:'frame', id:'fp1', x:0, y:0, dir:'line', view:1},
                    {type:'frame', id:'fp2', x:1060, y:0, dir:'line', view:1},
                    {type:'frame', id:'fp3', x:1060, y:1320, dir:'line', view:1, sill:1},
                    {type:'frame', id:'fp4', x:0, y:1320, dir:'line', view:1, sill:1}
                  ],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                },
//------- Level 2
                {
                  type:'skylight',
                  id:'block_2',
                  level: 2,
                  blockType: 'frame',
                  parent: 'block_1',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                },
                {
                  type:'skylight',
                  id:'block_3',
                  level: 2,
                  blockType: 'frame',
                  parent: 'block_1',
                  children: ['block_4', 'block_5'],
                  pointsOut: [],
                  pointsIn: [],
                  impost: {
                    impostAxis: [
                      {type:'impost', id:'ip3', x:1060, y:300, dir:'line'},
                      {type:'impost', id:'ip3', x:530, y:300, dir:'line'}
                    ],
                    impostOut: [],
                    impostIn : []
                  },
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                },
//------- Level 3
                {
                  type:'skylight',
                  id:'block_4',
                  level: 3,
                  blockType: 'frame',
                  parent: 'block_3',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                },
                {
                  type:'skylight',
                  id:'block_5',
                  level: 3,
                  blockType: 'frame',
                  parent: 'block_3',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                }
              ]
            },

            {
              name: 'Двухстворчатое',
              details: [
                {
                  type:'skylight',
                  id:'block_0',
                  level: 0,
                  blockType:'frame',
                  children:['block_1'],
                  maxSizeLimit: 5000
                },
//------- Level 1
                {
                  type:'skylight',
                  id:'block_1',
                  level: 1,
                  blockType:'frame',
                  parent: 'block_0',
                  children: ['block_2', 'block_3'],
                  impost: {
                    impostAxis: [
                      {type:'impost', id:'ip1', x:530, y:0, dir:'line'},
                      {type:'impost', id:'ip1', x:530, y:1320, dir:'line'}
                    ],
                    impostOut: [],
                    impostIn : []
                  },
                  pointsOut: [
                    {type:'frame', id:'fp1', x:0, y:0, dir:'line', view:1},
                    {type:'frame', id:'fp2', x:1060, y:0, dir:'line', view:1},
                    {type:'frame', id:'fp3', x:1060, y:1320, dir:'line', view:1, sill:1},
                    {type:'frame', id:'fp4', x:0, y:1320, dir:'line', view:1, sill:1}
                  ],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                },
//------- Level 2
                {
                  type:'skylight',
                  id:'block_2',
                  level: 2,
                  blockType: 'frame',
                  parent: 'block_1',
                  children: ['block_4', 'block_5'],
                  impost: {
                    impostAxis: [
                      {type:'impost', id:'ip3', x:0, y:300, dir:'line'},
                      {type:'impost', id:'ip3', x:530, y:300, dir:'line'}
                    ],
                    impostOut: [],
                    impostIn : []
                  },
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                },
                {
                  type:'skylight',
                  id:'block_3',
                  level: 2,
                  blockType: 'frame',
                  parent: 'block_1',
                  children: ['block_6', 'block_7'],
                  impost: {
                    impostAxis: [
                      {type:'impost', id:'ip3', x:1060, y:300, dir:'line'},
                      {type:'impost', id:'ip3', x:530, y:300, dir:'line'}
                    ],
                    impostOut: [],
                    impostIn : []
                  },
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                },
//------- Level 3
                {
                  type:'skylight',
                  id:'block_4',
                  level: 3,
                  blockType: 'frame',
                  parent: 'block_2',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                },
                {
                  type:'skylight',
                  id:'block_5',
                  level: 3,
                  blockType: 'frame',
                  parent: 'block_2',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                },
                {
                  type:'skylight',
                  id:'block_6',
                  level: 3,
                  blockType: 'frame',
                  parent: 'block_3',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                },
                {
                  type:'skylight',
                  id:'block_7',
                  level: 3,
                  blockType: 'frame',
                  parent: 'block_3',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                }
              ]
            },

            {
              name: 'Одностворчатое',
              details: [
                {
                  type:'skylight',
                  id:'block_0',
                  level: 0,
                  blockType:'frame',
                  children:['block_1'],
                  maxSizeLimit: 5000
                },
                //------- Level 1
                {
                  type:'skylight',
                  id:'block_1',
                  level: 1,
                  blockType:'frame',
                  parent: 'block_0',
                  children: ['block_2', 'block_3'],
                  impost: {
                    impostAxis: [
                      {type:'impost', id:'ip1',  x:1060, y:300, dir:'line'},
                      {type:'impost', id:'ip1', x:0, y:300, dir:'line'}
                    ],
                    impostOut: [],
                    impostIn : []
                  },
                  pointsOut: [
                    {type:'frame', id:'fp1', x:0, y:0, dir:'line', view:1},
                    {type:'frame', id:'fp2', x:1060, y:0, dir:'line', view:1},
                    {type:'frame', id:'fp3', x:1060, y:1320, dir:'line', view:1, sill:1},
                    {type:'frame', id:'fp4', x:0, y:1320, dir:'line', view:1, sill:1}
                  ],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                },
                //------- Level 2
                {
                  type:'skylight',
                  id:'block_2',
                  level: 2,
                  blockType: 'frame',
                  parent: 'block_1',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                },
                {
                  type:'skylight',
                  id:'block_3',
                  level: 2,
                  blockType: 'frame',
                  parent: 'block_1',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                }
              ]
            },


            {
              name: 'Трехстворчатое',
              details: [
                {
                  type:'skylight',
                  id:'block_0',
                  level: 0,
                  blockType:'frame',
                  children:['block_1'],
                  maxSizeLimit: 5000
                },
//------- Level 1
                {
                  type:'skylight',
                  id:'block_1',
                  level: 1,
                  blockType:'frame',
                  parent: 'block_0',
                  children: ['block_2', 'block_3'],
                  impost: {
                    impostAxis: [
                      {type:'impost', id:'ip1', x:1060, y:300, dir:'line'},
                      {type:'impost', id:'ip1', x:0, y:300, dir:'line'}
                    ],
                    impostOut: [],
                    impostIn : []
                  },
                  pointsOut: [
                    {type:'frame', id:'fp1', x:0, y:0, dir:'line', view:1},
                    {type:'frame', id:'fp2', x:1060, y:0, dir:'line', view:1},
                    {type:'frame', id:'fp3', x:1060, y:1320, dir:'line', view:1, sill:1},
                    {type:'frame', id:'fp4', x:0, y:1320, dir:'line', view:1, sill:1}
                  ],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                },
//------- Level 2
                {
                  type:'skylight',
                  id:'block_2',
                  level: 2,
                  blockType: 'frame',
                  parent: 'block_1',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                },
                {
                  type:'skylight',
                  id:'block_3',
                  level: 2,
                  blockType: 'frame',
                  parent: 'block_1',
                  children: ['block_4', 'block_5'],
                  pointsOut: [],
                  pointsIn: [],
                  impost: {
                    impostAxis: [
                      {type:'impost', id:'ip3', x:530, y:0, dir:'line'},
                      {type:'impost', id:'ip3', x:530, y:1320, dir:'line'}
                    ],
                    impostOut: [],
                    impostIn : []
                  },
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                },
//------- Level 3
                {
                  type:'skylight',
                  id:'block_4',
                  level: 3,
                  blockType: 'frame',
                  parent: 'block_3',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                },
                {
                  type:'skylight',
                  id:'block_5',
                  level: 3,
                  blockType: 'frame',
                  parent: 'block_3',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                }
              ]
            },


            {
              name: 'Трехстворчатое',
              details: [
                {
                  type:'skylight',
                  id:'block_0',
                  level: 0,
                  blockType:'frame',
                  children:['block_1'],
                  maxSizeLimit: 5000
                },
//------- Level 1
                {
                  type:'skylight',
                  id:'block_1',
                  level: 1,
                  blockType:'frame',
                  parent: 'block_0',
                  children: ['block_2', 'block_3'],
                  impost: {
                    impostAxis: [
                      {type:'impost', id:'ip1', x:2100, y:300, dir:'line'},
                      {type:'impost', id:'ip1', x:0, y:300, dir:'line'}
                    ],
                    impostOut: [],
                    impostIn : []
                  },
                  pointsOut: [
                    {type:'frame', id:'fp1', x:0, y:0, dir:'line', view:1},
                    {type:'frame', id:'fp2', x:2100, y:0, dir:'line', view:1},
                    {type:'frame', id:'fp3', x:2100, y:1400, dir:'line', view:1, sill:1},
                    {type:'frame', id:'fp4', x:0, y:1400, dir:'line', view:1, sill:1}
                  ],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                },
//------- Level 2
                {
                  type:'skylight',
                  id:'block_2',
                  level: 2,
                  blockType: 'frame',
                  parent: 'block_1',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                },
                {
                  type:'skylight',
                  id:'block_3',
                  level: 2,
                  blockType: 'frame',
                  parent: 'block_1',
                  children: ['block_4', 'block_5'],
                  pointsOut: [],
                  pointsIn: [],
                  impost: {
                    impostAxis: [
                      {type:'impost', id:'ip3', x:700, y:300, dir:'line'},
                      {type:'impost', id:'ip3', x:700, y:1400, dir:'line'}
                    ],
                    impostOut: [],
                    impostIn : []
                  },
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                },
//------- Level 3
                {
                  type:'skylight',
                  id:'block_4',
                  level: 3,
                  blockType: 'frame',
                  parent: 'block_3',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                },
                {
                  type:'skylight',
                  id:'block_5',
                  level: 3,
                  blockType: 'frame',
                  parent: 'block_3',
                  children: ['block_6', 'block_7'],
                  impost: {
                    impostAxis: [
                      {type:'impost', id:'ip3', x:1400, y:300, dir:'line'},
                      {type:'impost', id:'ip3', x:1400, y:1400, dir:'line'}
                    ],
                    impostOut: [],
                    impostIn : []
                  },
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                },
//------- Level 4
                {
                  type:'skylight',
                  id:'block_6',
                  level: 4,
                  blockType: 'frame',
                  parent: 'block_5',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                },
                {
                  type:'skylight',
                  id:'block_7',
                  level: 4,
                  blockType: 'frame',
                  parent: 'block_5',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                }
              ]
            },



            {
              name: 'Трехстворчатое',
              details: [
                {
                  type:'skylight',
                  id:'block_0',
                  level: 0,
                  blockType:'frame',
                  children:['block_1'],
                  maxSizeLimit: 5000
                },
//------- Level 1
                {
                  type:'skylight',
                  id:'block_1',
                  level: 1,
                  blockType:'frame',
                  parent: 'block_0',
                  children: ['block_2', 'block_3'],
                  impost: {
                    impostAxis: [
                      {type:'impost', id:'ip1', x:2100, y:300, dir:'line'},
                      {type:'impost', id:'ip1', x:0, y:300, dir:'line'}
                    ],
                    impostOut: [],
                    impostIn : []
                  },
                  pointsOut: [
                    {type:'frame', id:'fp1', x:0, y:0, dir:'line', view:1},
                    {type:'frame', id:'fp2', x:2100, y:0, dir:'line', view:1},
                    {type:'frame', id:'fp3', x:2100, y:1400, dir:'line', view:1, sill:1},
                    {type:'frame', id:'fp4', x:0, y:1400, dir:'line', view:1, sill:1}
                  ],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                },
//------- Level 2
                {
                  type:'skylight',
                  id:'block_2',
                  level: 2,
                  blockType: 'frame',
                  parent: 'block_1',
                  children: ['block_4', 'block_5'],
                  impost: {
                    impostAxis: [
                      {type:'impost', id:'ip3', x:1050, y:0, dir:'line'},
                      {type:'impost', id:'ip3', x:1050, y:300, dir:'line'}
                    ],
                    impostOut: [],
                    impostIn : []
                  },
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                },
                {
                  type:'skylight',
                  id:'block_3',
                  level: 2,
                  blockType: 'frame',
                  parent: 'block_1',
                  children: ['block_6', 'block_7'],
                  pointsOut: [],
                  pointsIn: [],
                  impost: {
                    impostAxis: [
                      {type:'impost', id:'ip3', x:700, y:300, dir:'line'},
                      {type:'impost', id:'ip3', x:700, y:1400, dir:'line'}
                    ],
                    impostOut: [],
                    impostIn : []
                  },
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                },
//------- Level 3
                {
                  type:'skylight',
                  id:'block_4',
                  level: 3,
                  blockType: 'frame',
                  parent: 'block_2',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                },
                {
                  type:'skylight',
                  id:'block_5',
                  level: 3,
                  blockType: 'frame',
                  parent: 'block_2',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                },
                {
                  type:'skylight',
                  id:'block_6',
                  level: 3,
                  blockType: 'frame',
                  parent: 'block_3',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                },
                {
                  type:'skylight',
                  id:'block_7',
                  level: 3,
                  blockType: 'frame',
                  parent: 'block_3',
                  children: ['block_8', 'block_9'],
                  impost: {
                    impostAxis: [
                      {type:'impost', id:'ip3', x:1400, y:300, dir:'line'},
                      {type:'impost', id:'ip3', x:1400, y:1400, dir:'line'}
                    ],
                    impostOut: [],
                    impostIn : []
                  },
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                },
//------- Level 4
                {
                  type:'skylight',
                  id:'block_8',
                  level: 4,
                  blockType: 'frame',
                  parent: 'block_7',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                },
                {
                  type:'skylight',
                  id:'block_9',
                  level: 4,
                  blockType: 'frame',
                  parent: 'block_7',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                }
              ]
            },



            {
              name: 'Трехстворчатое',
              details: [
                {
                  type:'skylight',
                  id:'block_0',
                  level: 0,
                  blockType:'frame',
                  children:['block_1'],
                  maxSizeLimit: 5000
                },
//------- Level 1
                {
                  type:'skylight',
                  id:'block_1',
                  level: 1,
                  blockType:'frame',
                  parent: 'block_0',
                  children: ['block_2', 'block_3'],
                  impost: {
                    impostAxis: [
                      {type:'impost', id:'ip1', x:2100, y:300, dir:'line'},
                      {type:'impost', id:'ip1', x:0, y:300, dir:'line'}
                    ],
                    impostOut: [],
                    impostIn : []
                  },
                  pointsOut: [
                    {type:'frame', id:'fp1', x:0, y:0, dir:'line', view:1},
                    {type:'frame', id:'fp2', x:2100, y:0, dir:'line', view:1},
                    {type:'frame', id:'fp3', x:2100, y:1400, dir:'line', view:1, sill:1},
                    {type:'frame', id:'fp4', x:0, y:1400, dir:'line', view:1, sill:1}
                  ],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                },
//------- Level 2
                {
                  type:'skylight',
                  id:'block_2',
                  level: 2,
                  blockType: 'frame',
                  parent: 'block_1',
                  children: ['block_4', 'block_5'],
                  impost: {
                    impostAxis: [
                      {type:'impost', id:'ip3', x:700, y:0, dir:'line'},
                      {type:'impost', id:'ip3', x:700, y:300, dir:'line'}
                    ],
                    impostOut: [],
                    impostIn : []
                  },
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                },
                {
                  type:'skylight',
                  id:'block_3',
                  level: 2,
                  blockType: 'frame',
                  parent: 'block_1',
                  children: ['block_6', 'block_7'],
                  pointsOut: [],
                  pointsIn: [],
                  impost: {
                    impostAxis: [
                      {type:'impost', id:'ip3', x:700, y:300, dir:'line'},
                      {type:'impost', id:'ip3', x:700, y:1400, dir:'line'}
                    ],
                    impostOut: [],
                    impostIn : []
                  },
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                },
//------- Level 3
                {
                  type:'skylight',
                  id:'block_4',
                  level: 3,
                  blockType: 'frame',
                  parent: 'block_2',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                },
                {
                  type:'skylight',
                  id:'block_5',
                  level: 3,
                  blockType: 'frame',
                  parent: 'block_2',
                  children: ['block_8', 'block_9'],
                  impost: {
                    impostAxis: [
                      {type:'impost', id:'ip3', x:1400, y:0, dir:'line'},
                      {type:'impost', id:'ip3', x:1400, y:300, dir:'line'}
                    ],
                    impostOut: [],
                    impostIn : []
                  },
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                },
                {
                  type:'skylight',
                  id:'block_6',
                  level: 3,
                  blockType: 'frame',
                  parent: 'block_3',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                },
                {
                  type:'skylight',
                  id:'block_7',
                  level: 3,
                  blockType: 'frame',
                  parent: 'block_3',
                  children: ['block_10', 'block_11'],
                  impost: {
                    impostAxis: [
                      {type:'impost', id:'ip3', x:1400, y:300, dir:'line'},
                      {type:'impost', id:'ip3', x:1400, y:1400, dir:'line'}
                    ],
                    impostOut: [],
                    impostIn : []
                  },
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                },
//------- Level 4
                {
                  type:'skylight',
                  id:'block_8',
                  level: 4,
                  blockType: 'frame',
                  parent: 'block_5',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                },
                {
                  type:'skylight',
                  id:'block_9',
                  level: 4,
                  blockType: 'frame',
                  parent: 'block_5',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                },
                {
                  type:'skylight',
                  id:'block_10',
                  level: 4,
                  blockType: 'frame',
                  parent: 'block_7',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                },
                {
                  type:'skylight',
                  id:'block_11',
                  level: 4,
                  blockType: 'frame',
                  parent: 'block_7',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                }
              ]
            }

          ]

        }));
      },


      getTemplatesWindowDoor: function(callback) {
        callback(new OkResult({

          windowDoor: [
            {
              name: 'Выход на балкон',
              details: [
                {
                  type:'skylight',
                  id:'block_0',
                  level: 0,
                  blockType:'frame',
                  children:['block_1', 'block_2'],
                  maxSizeLimit: 5000
                },
                //------- Level 1
                {
                  type:'skylight',
                  id:'block_1',
                  level: 1,
                  blockType:'frame',
                  parent: 'block_0',
                  children: [],
                  pointsOut: [
                    {type:'frame', id:'fp1', x:0, y:0, dir:'line', view:1},
                    {type:'frame', id:'fp2', x:1300, y:0, dir:'line', view:1},
                    {type:'frame', id:'fp3', x:1300, y:1400, dir:'line', view:1, sill:1},
                    {type:'frame', id:'fp4', x:0, y:1400, dir:'line', view:1, sill:1}
                  ],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                },
                {
                  type:'skylight',
                  id:'block_2',
                  level: 1,
                  blockType:'sash',
                  parent: 'block_0',
                  children: [],
                  pointsOut: [
                    {type:'frame', id:'fp5', x:1300, y:0, dir:'line', view:1},
                    {type:'frame', id:'fp6', x:2000, y:0, dir:'line', view:1},
                    {type:'frame', id:'fp7', x:2000, y:2100, dir:'line', view:1},
                    {type:'frame', id:'fp8', x:1300, y:2100, dir:'line', view:1}
                  ],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: '',
                  openDir: [1, 4],
                  handlePos: 4,
                  sashType: 2
                }
              ]
            }

          ]

        }));
      },



      getTemplatesBalcony: function(callback) {
        callback(new OkResult({

          balconies: [
            {
              name: 'Трехстворчатое',
              details: [
                {
                  type:'skylight',
                  id:'block_0',
                  level: 0,
                  blockType:'frame',
                  children:['block_1'],
                  maxSizeLimit: 5000
                },
//------- Level 1
                {
                  type:'skylight',
                  id:'block_1',
                  level: 1,
                  blockType:'frame',
                  parent: 'block_0',
                  children: ['block_2', 'block_3'],
                  impost: {
                    impostAxis: [
                      {type:'impost', id:'ip1', x:700, y:0, dir:'line'},
                      {type:'impost', id:'ip1', x:700, y:1400, dir:'line'}
                    ],
                    impostOut: [],
                    impostIn : []
                  },
                  pointsOut: [
                    {type:'frame', id:'fp1', x:0, y:0, dir:'line', view:1},
                    {type:'frame', id:'fp2', x:2100, y:0, dir:'line', view:1},
                    {type:'frame', id:'fp3', x:2100, y:1400, dir:'line', view:1, sill:1},
                    {type:'frame', id:'fp4', x:0, y:1400, dir:'line', view:1, sill:1}
                  ],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                },
//------- Level 2
                {
                  type:'skylight',
                  id:'block_2',
                  level: 2,
                  blockType: 'frame',
                  parent: 'block_1',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                },
                {
                  type:'skylight',
                  id:'block_3',
                  level: 2,
                  blockType: 'frame',
                  parent: 'block_1',
                  children: ['block_4', 'block_5'],
                  pointsOut: [],
                  pointsIn: [],
                  impost: {
                    impostAxis: [
                      {type:'impost', id:'ip3', x:1400, y:0, dir:'line'},
                      {type:'impost', id:'ip3', x:1400, y:1400, dir:'line'}
                    ],
                    impostOut: [],
                    impostIn : []
                  },
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                },
//------- Level 3
                {
                  type:'skylight',
                  id:'block_4',
                  level: 3,
                  blockType: 'frame',
                  parent: 'block_3',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                },
                {
                  type:'skylight',
                  id:'block_5',
                  level: 3,
                  blockType: 'frame',
                  parent: 'block_3',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                }
              ]
            }

          ]

        }));
      },


      getTemplatesDoor: function(callback) {
        callback(new OkResult({

          doors: [
            {
              name: 'Одностворчатая',
              details: [
                {
                  type:'skylight',
                  id:'block_0',
                  level: 0,
                  blockType:'frame',
                  children:['block_1'],
                  maxSizeLimit: 5000
                },
                //------- Level 1
                {
                  type:'skylight',
                  id:'block_1',
                  level: 1,
                  blockType:'sash',
                  parent: 'block_0',
                  children: [],
                  pointsOut: [
                    {type:'frame', id:'fp1', x:0, y:0, dir:'line', view:1},
                    {type:'frame', id:'fp2', x:700, y:0, dir:'line', view:1},
                    {type:'frame', id:'fp3', x:700, y:2100, dir:'line', view:1},
                    {type:'frame', id:'fp4', x:0, y:2100, dir:'line', view:1}
                  ],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: '',
                  openDir: [1, 4],
                  handlePos: 4,
                  sashType: 2
                }
              ]
            }
          ]

        }));
      },






      getInstalment: function (callback) {
        callback(new OkResult({

          instalment: [
            {
              id: 1,
              name: 1,
              value: 15
            },
            {
              id: 2,
              name: 2,
              value: 20
            },
            {
              id: 3,
              name: 3,
              value: 25
            },
            {
              id: 4,
              name: 4,
              value: 30
            },
            {
              id: 5,
              name: 5,
              value: 35
            }
          ]

        }));
      }


    }


  }
})();



// services/settings_serv.js

(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('SettingsModule')
    .factory('SettingServ', settingsFactory);

  function settingsFactory($rootScope, $location, localDB, GlobalStor, UserStor) {

    var thisFactory = this;

    thisFactory.publicObj = {
      changeAvatar: changeAvatar,
      //downloadLocations: downloadLocations,
      closeLocationPage: closeLocationPage,
      gotoLocationPage: gotoLocationPage,
      gotoPasswordPage: gotoPasswordPage,
      gotoLanguagePage: gotoLanguagePage,
      gotoSettingsPage: gotoSettingsPage,
      closeSettingsPage: closeSettingsPage
    };

    return thisFactory.publicObj;




    //============ methods ================//

    //----- change avatar
    function changeAvatar(newAvatar, form) {
      UserStor.userInfo.avatar = newAvatar;
      //------- send avatar to Server
      localDB.sendIMGServer(form);
      //------- save avatar in LocalDB
      localDB.updateLocalDB(localDB.tablesLocalDB.users.tableName, {avatar: newAvatar}, {'id': UserStor.userInfo.id});

//TODO ipad
//      navigator.camera.getPicture( function( data ) {
//        UserStor.userInfo.avatar = 'data:image/jpeg;base64,' + data;
//        localDB.updateLocalServerDBs(localDB.tablesLocalDB.users.tableName, UserStor.userInfo.id, {"avatar": UserStor.userInfo.avatar});
//        $rootScope.$apply();
//      }, function( error ) {
//        console.log( 'Error upload user avatar' + error );
//        console.log(UserStor.userInfo);
//      }, {
//        destinationType: Camera.DestinationType.DATA_URL,
//        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
//        allowEdit: false,
//        targetWidth: 76,
//        targetHeight: 76,
//        mediaType: Camera.MediaType.PICTURE
//      } );
    }



    //-------- close Location Page
    function closeLocationPage() {
      $location.path('/' + GlobalStor.global.currOpenPage);
    }

    function gotoLocationPage() {
      $location.path('/location');
    }

    function gotoPasswordPage() {
      $location.path('/change-pass');
    }

    function gotoLanguagePage() {
      $location.path('/change-lang');
    }

    function gotoSettingsPage() {
      $location.path('/settings');
    }

    function closeSettingsPage() {
      //      $scope.global.isOpenSettingsPage = false;
      //      $scope.global.isReturnFromDiffPage = true;
      console.log('prevOpenPage +++', GlobalStor.global.prevOpenPage);
      $location.path(GlobalStor.global.prevOpenPage);
    }

  }
})();



// services/sound_serv.js

(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('BauVoiceApp')
    .factory('SoundPlayServ', soundPlayFactory);

  function soundPlayFactory() {

    var thisFactory = this;

    thisFactory.soundsIntervals = {
      menu: {start: 7.93, end: 11.7},
      swip: {start: 8, end: 9},
      price: {from: 21.5, to: 23.2},
      fly: {start: 0.57, end: 1.59},
      switching: {start: 1.81, end: 2.88}
    };

    thisFactory.publicObj = {
      playSound: playSound
    };

    return thisFactory.publicObj;


    //============ methods ================//

    //----------- Play audio sounds
    function playSound() {
      var audioPlayer = document.getElementById('sounds');
      audioPlayer.play();
    }
    /*
     function playSound(element) {
     var audioPlayer = document.getElementById('sounds');
     //console.log('currentTime1', audioPlayer.currentTime);
     audioPlayer.pause();
     audioPlayer.currentTime = soundsIntervals[element].from;
     if(audioPlayer.currentTime === soundsIntervals[element].from) {
     audioPlayer.play();
     audioPlayer.addEventListener('timeupdate', handle, false);
     }
     //console.log('currentTime2', audioPlayer.currentTime);
     function handle() {
     var end = soundsIntervals[element].to;
     //console.log(this.currentTime + ' = ' + end);
     if(this.currentTime >= end) {
     this.pause();
     this.removeEventListener('timeupdate', handle);
     }
     }
     }
     */

  }
})();



// services/svg_serv.js

(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .factory('SVGServ', designFactory);

  function designFactory($q, globalConstants, GeneralServ, ProductStor, DesignStor) {

    var thisFactory = this;

    thisFactory.publicObj = {
      createSVGTemplate: createSVGTemplate,
      createSVGTemplateIcon: createSVGTemplateIcon,
      collectAllPointsOut: collectAllPointsOut,
      setTemplateScale: setTemplateScale,
      setTemplateScaleMAIN: setTemplateScaleMAIN,
      setTemplatePositionMAIN: setTemplatePositionMAIN,
      setTemplatePosition: setTemplatePosition,

      centerBlock: centerBlock,
      sortingPoints: sortingPoints,
      getAngelPoint: getAngelPoint,
      setLines: setLines,
      setLineCoef: setLineCoef,
      getNewCoefC: getNewCoefC,
      setPointLocationToLine: setPointLocationToLine,
      intersectionQ: intersectionQ,
      cteateLineByAngel: cteateLineByAngel,
      getIntersectionInCurve: getIntersectionInCurve,
      getCoordCrossPoint: getCoordCrossPoint,
      checkLineOwnPoint: checkLineOwnPoint,
      isInsidePointInLine: isInsidePointInLine,
      getCoordSideQPCurve: getCoordSideQPCurve,
      checkEqualPoints: checkEqualPoints,
      setQPointCoord: setQPointCoord,
      getCenterLine: getCenterLine,

      checkInsidePointInLineEasy: checkInsidePointInLineEasy,
      sortByX: sortByX
    };

    return thisFactory.publicObj;




    //============ methods ================//


    function createSVGTemplate(sourceObj, depths) {
      //console.log('------------------------------------------------------');
//      console.log('svg start', new Date(), new Date().getMilliseconds());
      var thisObj = {},
          defer = $q.defer();
      //  thisObj.name = sourceObj.name;
      thisObj.details = angular.copy(sourceObj.details);
      thisObj.priceElements = {
        framesSize: [],
        frameSillSize: [],
        sashsSize: [],
        impostsSize: [],
        shtulpsSize: [],
        glassSquares: [],
        beadsSize: [],
        sashesBlock: []
      };

      var blocksQty = thisObj.details.length;


      for(var i = 0; i < blocksQty; i++) {

        //------ block 0
        if(!thisObj.details[i].level) {

          var childQty = thisObj.details[i].children.length,
              b = 0;
          if(childQty === 1) {
            for(; b < blocksQty; b++) {
              if(thisObj.details[i].children[0] === thisObj.details[b].id) {
                thisObj.details[b].position = 'single';
              }
            }
          } else if(childQty > 1) {
            for(; b < blocksQty; b++) {
              if(thisObj.details[i].children[0] === thisObj.details[b].id) {
                thisObj.details[b].position = 'first';
              } else if(thisObj.details[i].children[childQty-1] === thisObj.details[b].id) {
                thisObj.details[b].position = 'last';
              }
            }
          }

          thisObj.details[i].overallDim = [];

        } else {
//          console.log('+++++++++ block ID ++++++++++', thisObj.details[i].id);
//          console.log('+++++++++ block ++++++++++', thisObj.details[i]);
          //----- create point Q for arc or curve corner in block 1
          if(thisObj.details[i].level === 1 && thisObj.details[i].pointsQ) {
            setQPInMainBlock(thisObj.details[i]);
          }
          thisObj.details[i].center = centerBlock(thisObj.details[i].pointsOut);
          thisObj.details[i].pointsOut = sortingPoints(thisObj.details[i].pointsOut, thisObj.details[i].center);
//          console.log('+++++++++ block ++++++++++pointsOut');
          thisObj.details[i].linesOut = setLines(thisObj.details[i].pointsOut);
          if(thisObj.details[i].level === 1) {
            thisObj.details[i].pointsIn = setPointsIn(thisObj.details[i].linesOut, depths, 'frame');
          } else {
            thisObj.details[i].center = centerBlock(thisObj.details[i].pointsIn);
//            console.log('+++++++++ block ++++++++++pointsIn', JSON.stringify(thisObj.details[i].pointsIn));
            thisObj.details[i].pointsIn = sortingPoints(thisObj.details[i].pointsIn, thisObj.details[i].center);
//            console.log('+++++++++ block ++++++++++pointsIn');
          }
          thisObj.details[i].linesIn = setLines(thisObj.details[i].pointsIn);

          if(thisObj.details[i].level === 1) {
            setCornerProp(thisObj.details);
            //------- set points for each part of construction
            $.merge(thisObj.details[i].parts, setParts(thisObj.details[i].pointsOut, thisObj.details[i].pointsIn, thisObj.priceElements));
          }


          //-------- if block has children and type is sash
          if(thisObj.details[i].children.length) {

            if(thisObj.details[i].blockType === 'sash') {
              thisObj.details[i].sashPointsOut = copyPointsOut(setPointsIn(thisObj.details[i].linesIn, depths, 'sash-out'), 'sash');
              thisObj.details[i].sashLinesOut = setLines(thisObj.details[i].sashPointsOut);
              thisObj.details[i].sashPointsIn = setPointsIn(thisObj.details[i].sashLinesOut, depths, 'sash-in');
              thisObj.details[i].sashLinesIn = setLines(thisObj.details[i].sashPointsIn);

              thisObj.details[i].hardwarePoints = setPointsIn(thisObj.details[i].sashLinesOut, depths, 'hardware');
              thisObj.details[i].hardwareLines = setLines(thisObj.details[i].hardwarePoints);

              $.merge(thisObj.details[i].parts, setParts(thisObj.details[i].sashPointsOut, thisObj.details[i].sashPointsIn, thisObj.priceElements));

              //----- set openPoints for sash
              thisObj.details[i].sashOpenDir = setOpenDir(thisObj.details[i].openDir, thisObj.details[i].sashLinesIn);
              setSashePropertyXPrice(thisObj.details[i].sashType, thisObj.details[i].openDir, thisObj.details[i].hardwareLines, thisObj.priceElements);
            }

          //------- if block is empty
          } else {
            //------ if block is frame
            if(thisObj.details[i].blockType === 'frame') {
//              console.log('+++++++++ block ++++++++++beads');
              thisObj.details[i].beadPointsOut = copyPointsOut(thisObj.details[i].pointsIn, 'bead');
              thisObj.details[i].beadLinesOut = setLines(thisObj.details[i].beadPointsOut);
              thisObj.details[i].beadPointsIn = setPointsIn(thisObj.details[i].beadLinesOut, depths, 'frame-bead');
              //          thisObj.details[i].beadLinesIn = setLines(thisObj.details[i].beadPointsIn);

              thisObj.details[i].glassPoints = setPointsIn(thisObj.details[i].beadLinesOut, depths, 'frame-glass');
              /*          thisObj.details[i].glassLines = setLines(thisObj.details[i].beadPointsIn);*/

              thisObj.details[i].parts.push(setGlass(thisObj.details[i].glassPoints, thisObj.priceElements, thisObj.details[i].glassId));
              $.merge(thisObj.details[i].parts, setParts(thisObj.details[i].beadPointsOut, thisObj.details[i].beadPointsIn, thisObj.priceElements, thisObj.details[i].glassId));

            } else if(thisObj.details[i].blockType === 'sash') {
              //console.info('-------', i, thisObj.details[i]);
              thisObj.details[i].sashPointsOut = copyPointsOut(setPointsIn(thisObj.details[i].linesIn, depths, 'sash-out'), 'sash');
              thisObj.details[i].sashLinesOut = setLines(thisObj.details[i].sashPointsOut);
              thisObj.details[i].sashPointsIn = setPointsIn(thisObj.details[i].sashLinesOut, depths, 'sash-in');
              thisObj.details[i].sashLinesIn = setLines(thisObj.details[i].sashPointsIn);

              thisObj.details[i].hardwarePoints = setPointsIn(thisObj.details[i].sashLinesOut, depths, 'hardware');
              thisObj.details[i].hardwareLines = setLines(thisObj.details[i].hardwarePoints);

              thisObj.details[i].beadPointsOut = copyPointsOut(thisObj.details[i].sashPointsIn, 'bead');
              thisObj.details[i].beadLinesOut = setLines(thisObj.details[i].beadPointsOut);
              thisObj.details[i].beadPointsIn = setPointsIn(thisObj.details[i].beadLinesOut, depths, 'sash-bead');
              //------ for defined open directions of sash
              thisObj.details[i].beadLinesIn = setLines(thisObj.details[i].beadPointsIn);

              thisObj.details[i].glassPoints = setPointsIn(thisObj.details[i].beadLinesOut, depths, 'sash-glass');
              //          thisObj.details[i].glassLines = setLines(thisObj.details[i].beadPointsIn);

              $.merge(thisObj.details[i].parts, setParts(thisObj.details[i].sashPointsOut, thisObj.details[i].sashPointsIn, thisObj.priceElements));
              thisObj.details[i].parts.push(setGlass(thisObj.details[i].glassPoints, thisObj.priceElements, thisObj.details[i].glassId));
              $.merge(thisObj.details[i].parts, setParts(thisObj.details[i].beadPointsOut, thisObj.details[i].beadPointsIn, thisObj.priceElements, thisObj.details[i].glassId));

              //----- set openPoints for sash
              thisObj.details[i].sashOpenDir = setOpenDir(thisObj.details[i].openDir, thisObj.details[i].beadLinesIn);
              setSashePropertyXPrice(thisObj.details[i].sashType, thisObj.details[i].openDir, thisObj.details[i].hardwareLines, thisObj.priceElements);
            }
          }
          setPointsXChildren(thisObj.details[i], thisObj.details, depths);
          //----- create impost parts
          if(thisObj.details[i].children.length) {
            thisObj.details[i].parts.push( setImpostParts(thisObj.details[i].impost.impostIn, thisObj.priceElements) );
          }


        }
      }

      thisObj.dimension = initDimensions(thisObj.details);

      console.log('TEMPLATE END++++', thisObj);
      //console.log('svg finish', new Date(), new Date().getMilliseconds());
      //console.log('------------------------------------------------------');
      defer.resolve(thisObj);
      return defer.promise;
    }




    //----------- ICON

    function createSVGTemplateIcon(sourceObj, depths) {
      var defer = $q.defer(),
          newDepth = angular.copy(depths),
          coeffScale = 2;
      for(var p in newDepth) {
        for(var el in newDepth[p]) {
          newDepth[p][el] *= coeffScale;
        }
      }
      createSVGTemplate(sourceObj, newDepth).then(function(result) {
        defer.resolve(result);
      });
      return defer.promise;
    }


    //----------- SCALE

    function setTemplateScale(dim, windowW, windowH, padding) {
      var templateW = (dim.maxX - dim.minX)+300,
          templateH = (dim.maxY - dim.minY),
          scaleTmp,
          d3scaling = d3.scale.linear()
            .domain([0, 1])
            .range([0, padding]);

      //console.info('scale----', templateW, templateH, windowW, windowH, padding);
      //var windRatio = windowW/windowH;
      //var tempRatio = templateW/templateH;
      //var ratio = windRatio/tempRatio;
      //console.info('scale--2--', windRatio, tempRatio, ratio, d3scaling(ratio));


      if(templateW > templateH) {
        if(windowW > templateW) {
          scaleTmp = d3scaling(templateW/windowW);
          //console.info('W < =====', templateW/windowW, scaleTmp);
        } else if(windowW < templateW) {
          scaleTmp = d3scaling(windowW/templateW);
          //console.info('W > =====', windowW/templateW, scaleTmp);
        } else {
          scaleTmp = d3scaling(1);
          //console.info('W======', scaleTmp);
        }
        //console.info('W > H --', scaleTmp);
      } else if(templateW <= templateH) {
        if(windowH > templateH) {
          scaleTmp = d3scaling(templateH/windowH);
          //console.info('H < =====', templateH/windowH, scaleTmp);
        } else if(windowH < templateH) {
          scaleTmp = d3scaling(windowH/templateH);
          //console.info('H > =====', (windowH/templateH), scaleTmp);
        } else {
          scaleTmp = d3scaling(1);
          //console.info('H======', scaleTmp);
        }
        //console.info('H > W --', scaleTmp);
      }
      return scaleTmp;
    }


        //----------- SCALE MAIN

    function setTemplateScaleMAIN(dim, windowW, windowH, padding) {
    if(ProductStor.product.construction_type == 1 || ProductStor.product.construction_type == 3 ) {
      var templateW = (dim.maxX - dim.minX)+300,
          templateH = (dim.maxY - dim.minY),
          scaleTmp,
          d3scaling = d3.scale.linear()
            .domain([0, 1])
            .range([0, padding]);

      //console.info('scale----', templateW, templateH, windowW, windowH, padding);
      //var windRatio = windowW/windowH;
      //var tempRatio = templateW/templateH;
      //var ratio = windRatio/tempRatio;
      //console.info('scale--2--', windRatio, tempRatio, ratio, d3scaling(ratio));
 
            scaleTmp = d3scaling(0.38);
            return scaleTmp;
    
    } if(ProductStor.product.construction_type == 2 || ProductStor.product.construction_type == 4 ) {
      var templateW = (dim.maxX - dim.minX)+300,
          templateH = (dim.maxY - dim.minY),
          scaleTmp,
          d3scaling = d3.scale.linear()
            .domain([0, 1])
            .range([0, padding]);

      //console.info('scale----', templateW, templateH, windowW, windowH, padding);
      //var windRatio = windowW/windowH;
      //var tempRatio = templateW/templateH;
      //var ratio = windRatio/tempRatio;
      //console.info('scale--2--', windRatio, tempRatio, ratio, d3scaling(ratio));
 
            scaleTmp = d3scaling(0.38);
            return scaleTmp;
    
    }

  }



    //----------- TRANSLATE

    function setTemplatePosition(dim, windowW, windowH, scale) {
      var position = {
        x: (windowW - (dim.minX + dim.maxX)*scale)/2,
        y: (windowH - (dim.minY + dim.maxY)*scale)/2,
      };
      return position;
    }

    function setTemplatePositionMAIN(dim, windowW, windowH, scale) {
      if(ProductStor.product.construction_type == 1 || ProductStor.product.construction_type == 3 ) {
        var position = {
          x: 250,
          y: (windowH - (dim.minY + dim.maxY)*scale)-310,
      }
        } if(ProductStor.product.construction_type == 2) {
           var position = {
              x: (windowW - (dim.minX + dim.maxX)*scale)/2,
              y: (windowH - (dim.minY + dim.maxY)*scale)/2,
      } 
        } if(ProductStor.product.construction_type == 4) {
           var position = {
              x: 250,
              y: (windowH - (dim.minY + dim.maxY)*scale)-120,
      }
        }
        return position;
    }



    /////////////////////////////////////////////////////////////////////////////////////



    function centerBlock(points){
      var pointsQty = points.length,
          center = {
            x: points.reduce(function(sum, curr){
              if(curr.dir === 'curv') {
                return sum + curr.xQ;
              } else {
                return sum + curr.x;
              }
            }, 0) / pointsQty,
            y: points.reduce(function(sum, curr){
              if(curr.dir === 'curv') {
                return sum + curr.yQ;
              } else {
                return sum + curr.y;
              }
            }, 0) / pointsQty
          };
      return center;
    }


    function sortingPoints(points, center) {
      var pointsQty = points.length;

      for(var i = 0; i < pointsQty; i++) {
        points[i].fi = getAngelPoint(center, points[i]);
      }
      points.sort(function(a, b){
        return b.fi - a.fi;
      });
//      console.log('CHECK FI+++++++++++++', JSON.stringify(points));
      return points;
    }


    function getAngelPoint(center, point) {
      var fi;
      if(point.dir === 'curv') {
        fi = Math.atan2(center.y - point.yQ, point.xQ - center.x) * (180 / Math.PI);
      } else {
        fi = Math.atan2(center.y - point.y, point.x - center.x) * (180 / Math.PI);
      }
      if(fi < 0) {
        fi += 360;
      }
      return fi;
    }



    function setLines(points) {
      var lines = [],
          pointsQty = points.length;

      for(var i = 0; i < pointsQty; i++) {
        //------ if point.view = 0
        if(points[i].type === 'frame' && !points[i].view) {
          continue;
        }
        var line = {}, index;
        //------- first
        line.from = angular.copy(points[i]);
        line.dir = points[i].dir;
        //------- end
        if(i === (pointsQty - 1)) {
          index = 0;
          if(points[index].type === 'frame' && !points[index].view) {
            index = 1;
          }
        } else {
          index = i+1;
          if(points[index].type === 'frame' && !points[index].view) {
            if(index === (pointsQty - 1)) {
              index = 0;
            } else {
              index = i+2;
            }
          }
        }
        line.to = angular.copy(points[index]);
//        line.type = setLineType(points[i].type, points[index].type);
        line.type = setLineType(points[i].id, points[index].id);
        if(line.dir === 'line') {
          line.dir = (points[index].dir === 'curv') ? 'curv' : 'line';
        }
        line.size = GeneralServ.roundingValue( (Math.hypot((line.to.x - line.from.x), (line.to.y - line.from.y))) );
        setLineCoef(line);
        lines.push(line);
      }
      //------ change place last element in array to first
      var last = lines.pop();
      lines.unshift(last);

      return lines;
    }


    function setLineCoef(line) {
      line.coefA = (line.from.y - line.to.y);
      line.coefB = (line.to.x - line.from.x);
      line.coefC = (line.from.x*line.to.y - line.to.x*line.from.y);
    }


//    function setLineType(from, to) {
//      var type = '';
//      if(from === to) {
//        if(from === 'impost') {
//          type = 'impost';
//        } else {
//          type = 'frame';
//        }
//      } else {
//        type = 'frame';
//      }
//      return type;
//    }

    function setLineType(from, to) {
      var type = '';
      if(from.indexOf('ip')+1 && to.indexOf('ip')+1) {
        type = 'impost';
      //} else if(from.indexOf('sht')+1 && to.indexOf('sht')+1) {
      } else if(from.indexOf('sht')+1 && to.indexOf('sht')+1 && from === to) {
        type = 'shtulp';
      } else {
        type = 'frame';
      }
      return type;
    }



    function setPointsIn(lines, depths, group) {
      var pointsIn = [],
          linesQty = lines.length;
//console.info('lines+++', lines);
      for(var i = 0; i < linesQty; i++) {
        var newLine1 = angular.copy(lines[i]),
            newLine2 = {},
            crossPoint = {},
            index;
        newLine1.coefC = getNewCoefC(depths, newLine1, group);
        if(i === (linesQty - 1)) {
          index = 0;
        } else {
          index = i+1;
        }
        newLine2 = angular.copy(lines[index]);
        newLine2.coefC = getNewCoefC(depths, newLine2, group);
        crossPoint = getCrossPoint2Lines(newLine1, newLine2);
        pointsIn.push(crossPoint);
      }
      return pointsIn;
    }


    function getNewCoefC(depths, line, group) {
      var depth = 0, beadDepth = 20;
      //console.info('depth++++', group, line.type);
      switch(group) {
        case 'frame':
          if(line.type === 'frame') {
            depth = depths.frameDepth.c;
          } else if(line.type === 'impost') {
            depth = depths.impostDepth.c/2;
          } else if(line.type === 'shtulp') {
            depth = depths.shtulpDepth.b/2;
          }
          break;
        case 'frame-bead':
        case 'sash-bead':
          depth = beadDepth;
          break;
        case 'frame-glass':
          if(line.type === 'frame') {
            depth = depths.frameDepth.d - depths.frameDepth.c;
          } else if(line.type === 'impost') {
            depth = depths.impostDepth.b - depths.impostDepth.c/2;
          }
          break;

        case 'sash-out':
          if(line.type === 'frame') {
            depth = depths.frameDepth.b - depths.frameDepth.c;
          } else if(line.type === 'impost') {
            depth = depths.impostDepth.d - depths.impostDepth.c/2;
          } else if(line.type === 'shtulp') {
            depth = depths.shtulpDepth.a/2 - depths.shtulpDepth.b/2;
          }
          break;
        case 'sash-in':
          depth = depths.sashDepth.c;
          break;
        case 'hardware':
          depth = depths.sashDepth.b;
          break;
        case 'sash-glass':
          depth = depths.sashDepth.d - depths.sashDepth.c;
          break;

        //case 'frame+sash':
        //  depth = depths.frameDepth.b + depths.sashDepth.c;
        //  break;
      }
      var newCoefC = line.coefC - (depth * Math.hypot(line.coefA, line.coefB));
      return newCoefC;
    }


    function getCrossPoint2Lines(line1, line2) {
      var crossPoint = {},
          coord = {},
          isParall = checkParallel(line1, line2);

      //------- if lines are paralles
      if(isParall) {
//            console.log('parallel = ', isParall);
        //----- set normal statement
        //    var normal = {
        //      coefA: 1,
        //      coefB: -(line1.coefB / line1.coefA),
        //      coefC: (line1.coefB * line1.to.x/ line1.coefA) - line1.to.y
        //    };

        var x2 = line1.to.x,
            y2 = line1.to.y;
//        if(line1.to.dir === 'curv') {
//          x2 = line1.to.xQ;
//          y2 = line1.to.yQ;
//        }
        var normal = {
          coefA: line1.coefB,
          coefB: -line1.coefA,
          coefC: (line1.coefA * y2 - line1.coefB * x2)
        };
//        console.log('normal = ',  normal);
        coord = getCoordCrossPoint(line1, normal);
      } else {
        coord = getCoordCrossPoint(line1, line2);
      }
//        console.log('coord = ', coord);
      crossPoint.x = coord.x;
      crossPoint.y = coord.y;

      //crossPoint.type = (line1.type === 'impost' || line2.type === 'impost') ? 'impost' : 'frame';
      if(line1.type === 'impost' || line2.type === 'impost') {
        crossPoint.type = 'impost';
      } else if(line1.type === 'shtulp' || line2.type === 'shtulp') {
        crossPoint.type = 'shtulp';
      } else {
        crossPoint.type = 'frame';
      }
      if(line1.to.dir === 'curv') {
        crossPoint.dir = 'curv';
        crossPoint.xQ = line1.to.xQ;
        crossPoint.yQ = line1.to.yQ;
      } else {
        crossPoint.dir = 'line';
      }
      crossPoint.id = line1.to.id;
      crossPoint.view = 1;
      return crossPoint;
    }


    function checkParallel(line1, line2) {
      var k1 = checkParallelCoef(line1),
          k2 = checkParallelCoef(line2);
      return (k1 === k2) ? 1 : 0;
    }


    function checkParallelCoef(line) {
      var x1 = line.from.x,
          y1 = line.from.y,
          x2 = line.to.x,
          y2 = line.to.y;
//      if(line.from.dir === 'curv') {
//        x1 = line.from.xQ;
//        y1 = line.from.yQ;
//      }
//      if(line.to.dir === 'curv') {
//        x2 = line.to.xQ;
//        y2 = line.to.yQ;
//      }
      return Math.round( (y2 - y1) / (x2 - x1) );
    }



    function setQPInMainBlock(currBlock) {
      var qpQty = currBlock.pointsQ.length;
      if(qpQty) {
        for (var q = 0; q < qpQty; q++) {
          var pointsOutQty = currBlock.pointsOut.length, curvP0 = 0, curvP1 = 0;
          for (var p = 0; p < pointsOutQty; p++) {
            if (currBlock.pointsQ[q].fromPId === currBlock.pointsOut[p].id) {
              curvP0 = currBlock.pointsOut[p];
            }
            if (currBlock.pointsQ[q].toPId === currBlock.pointsOut[p].id) {
              curvP1 = currBlock.pointsOut[p];
            }
          }

          if (curvP0 && curvP1) {
            var curvLine = {
                  from: curvP0,
                  to: curvP1
                },
                centerLine = getCenterLine(curvP0, curvP1),
                curvQP = {
                  type: currBlock.pointsQ[q].type,
                  id: currBlock.pointsQ[q].id,
                  dir: 'curv',
                  xQ: centerLine.x,
                  yQ: centerLine.y
                }, coordQP;

            setLineCoef(curvLine);

            //------ get coordinates Q point
            coordQP = setQPointCoord(currBlock.pointsQ[q].positionQ, curvLine, currBlock.pointsQ[q].heightQ * 2);
//            console.log('!!!!! curvQP -----', curvP0, curvP1, coordQP);
//            console.log('!!!!! curvQP -----', currBlock.pointsQ[q]);
            curvQP.x = coordQP.x;
            curvQP.y = coordQP.y;

            //------ if curve vert or hor
            if (!curvLine.coefA && currBlock.pointsQ[q].positionQ === 1) {
              curvQP.y -= currBlock.pointsQ[q].heightQ * 4;
            } else if (!curvLine.coefB && currBlock.pointsQ[q].positionQ === 4) {
              curvQP.x -= currBlock.pointsQ[q].heightQ * 4;
            }
//            console.log('!!!!! curvQP -----', curvQP);
            currBlock.pointsOut.push(angular.copy(curvQP));

            //------ for R dimension, get coordinates for Radius location
            currBlock.pointsQ[q].midleX = curvQP.xQ;
            currBlock.pointsQ[q].midleY = curvQP.yQ;
            setRadiusCoordXCurve(currBlock.pointsQ[q], curvP0, curvQP, curvP1);
          }

        }
      }
    }


    function setPointsXChildren(currBlock, blocks, depths) {
      if(currBlock.children.length) {
        var blocksQty = blocks.length,
            impPointsQty = currBlock.impost.impostAxis.length,
            impAx0 = angular.copy(currBlock.impost.impostAxis[0]),
            impAx1 = angular.copy(currBlock.impost.impostAxis[1]),
            pointsOut = angular.copy(currBlock.pointsOut),
            pointsIn, linesIn,
            indexChildBlock1, indexChildBlock2;

//console.log('-------------setPointsXChildren -----------');
        if(currBlock.blockType === 'sash') {
          pointsIn = angular.copy(currBlock.sashPointsIn);
          linesIn = currBlock.sashLinesIn;
        } else {
          pointsIn = angular.copy(currBlock.pointsIn);
          linesIn = currBlock.linesIn;
        }
        var linesInQty = linesIn.length;

        //-------- get indexes of children blocks
        for(var i = 1; i < blocksQty; i++) {
          if(blocks[i].id === currBlock.children[0]) {
            indexChildBlock1 = i;
          } else if(blocks[i].id === currBlock.children[1]) {
            indexChildBlock2 = i;
          }
        }

        //------- create 2 impost vectors
        var impVectorAx1 = {
              type: (impAx0.type === 'impost') ? 'impost' : 'shtulp',
              from: impAx0,
              to: impAx1
            },
            impVectorAx2 = {
              type: (impAx0.type === 'impost') ? 'impost' : 'shtulp',
              from: impAx1,
              to: impAx0
            };
        setLineCoef(impVectorAx1);
        setLineCoef(impVectorAx2);

        var impVector1 = angular.copy(impVectorAx1),
            impVector2 = angular.copy(impVectorAx2);

        impVector1.coefC = getNewCoefC(depths, impVector1, 'frame');
        impVector2.coefC = getNewCoefC(depths, impVector2, 'frame');
//        console.log('IMP impVectorAx1+++++++++', impVectorAx1);
//        console.log('IMP impVector1++++++++++', impVector1);
//        console.log('IMP impVector2++++++++++', impVector2);
//        console.log('IMP linesIn++++++++++', linesIn);
        //-------- finde cross points each impost vectors with lineIn of block
        for(var i = 0; i < linesInQty; i++) {
//          console.log('!!!!! impVector1 -----');
          getCPImpostInsideBlock(0, 0, i, linesInQty, linesIn, impVector1, impAx0, currBlock.impost.impostIn);
//          console.log('!!!!! impVector2 -----');
          getCPImpostInsideBlock(1, 0, i, linesInQty, linesIn, impVector2, impAx1, currBlock.impost.impostIn);
//          console.log('!!!!! impVectorAx1 -----');
          getCPImpostInsideBlock(0, 1, i, linesInQty, linesIn, impVectorAx1, impAx0, currBlock.impost.impostOut, pointsIn);
        }

        //------- if curve impost
        if(impPointsQty === 3) {
          //----- make order for impostOut
          var impostOutQty = currBlock.impost.impostOut.length, impAxQ;
          for(var i = 0; i < impostOutQty; i++) {
            currBlock.impost.impostOut[i].fi = getAngelPoint(currBlock.center, currBlock.impost.impostOut[i]);
            currBlock.impost.impostAxis[i].fi = getAngelPoint(currBlock.center, currBlock.impost.impostAxis[i]);
          }
          if(currBlock.impost.impostOut[0].fi !== currBlock.impost.impostAxis[0].fi) {
            currBlock.impost.impostOut.reverse();
          }

          impAxQ = getImpostQP(0, 1, currBlock.impost);
          getImpostQP(0, 0, currBlock.impost);
          getImpostQP(1, 0, currBlock.impost);

          blocks[indexChildBlock1].pointsOut.push(angular.copy(impAxQ));
          blocks[indexChildBlock2].pointsOut.push(angular.copy(impAxQ));

          //------ for R dimension, get coordinates for Radius location
          currBlock.impost.impostAxis[2].midleX = impAxQ.xQ;
          currBlock.impost.impostAxis[2].midleY = impAxQ.yQ;
          setRadiusCoordXCurve(currBlock.impost.impostAxis[2], currBlock.impost.impostOut[0], impAxQ, currBlock.impost.impostOut[1]);
        }


        var impostAx = angular.copy(currBlock.impost.impostAxis);
        //------- insert pointsOut of parent block in pointsOut of children blocks
//        console.log('!!!!! -----', blocks[indexChildBlock1].id, blocks[indexChildBlock2].id);
//        console.log('!!!!! pointsOut -----',JSON.stringify(pointsOut));
        collectPointsXChildBlock(impostAx, pointsOut, blocks[indexChildBlock1].pointsOut, blocks[indexChildBlock2].pointsOut);
        //------- insert impostOut of impost in pointsOut of children blocks
//        for(var i = 0; i < 2; i++) {
//          blocks[indexChildBlock1].pointsOut.push(angular.copy(impostAx[i]));
//          blocks[indexChildBlock2].pointsOut.push(angular.copy(impostAx[i]));
//        }
//        console.log('!!!!! pointsIn -----', JSON.stringify(pointsIn));
        //------- insert pointsIn of parent block in pointsIn of children blocks
        collectPointsXChildBlock(impostAx, pointsIn, blocks[indexChildBlock1].pointsIn, blocks[indexChildBlock2].pointsIn);
        //------- insert impostIn of impost in pointsIn of children blocks
        collectImpPointsXChildBlock(currBlock.impost.impostIn, blocks[indexChildBlock1].pointsIn, blocks[indexChildBlock2].pointsIn);
//        console.log('!!!!! indexChildBlock1 -----', JSON.stringify(blocks[indexChildBlock1].pointsIn));
//        console.log('!!!!! indexChildBlock2 -----', JSON.stringify(blocks[indexChildBlock2].pointsIn));
        //-------- set real impostAxis coord for dimensions
        var linesOutQty = currBlock.linesOut.length,
            impostQP;
        if(currBlock.impost.impostAxis[2]) {
          impostQP = angular.copy(currBlock.impost.impostAxis[2]);
        }
        currBlock.impost.impostAxis.length = 0;
        for(var i = 0; i < linesOutQty; i++) {
          getCPImpostInsideBlock(0, 0, i, linesOutQty, currBlock.linesOut, impVectorAx1, impAx0, currBlock.impost.impostAxis);
        }
        if(impostQP) {
          currBlock.impost.impostAxis.push(impostQP);
        }
        for(var i = 0; i < 2; i++) {
          blocks[indexChildBlock1].pointsOut.push(angular.copy(currBlock.impost.impostAxis[i]));
          blocks[indexChildBlock2].pointsOut.push(angular.copy(currBlock.impost.impostAxis[i]));
        }
      }
    }





    function getCPImpostInsideBlock(group, markAx, i, linesInQty, linesIn, impVector, impAx, impost, pointsIn) {
      var impCP = getCoordCrossPoint(linesIn[i], impVector),
          isInside = checkLineOwnPoint(impCP, linesIn[i].to, linesIn[i].from),
          isCross = isInsidePointInLine(isInside);

      if (isCross) {
        var ip = angular.copy(impAx);
        ip.group = group;
        ip.x = impCP.x;
        ip.y = impCP.y;

        if (linesIn[i].dir === 'curv') {
          var impCenterP = findImpostCenter(markAx, impVector);
          var intersect = getIntersectionInCurve(i, linesInQty, linesIn, impCenterP, impCP);
//          console.log('intersect +++impCenterP, impCP', impCenterP, impCP);
//          console.log('intersect +++', intersect[0]);
          if (intersect.length) {
            ip.x = intersect[0].x;
            ip.y = intersect[0].y;
            ip.t = intersect[0].t;
//            var noExist = checkEqualPoints(ip, impost);
//            if(noExist) {
//              if (markAx) {
//                setSideQPCurve(i, linesInQty, linesIn, intersect[0], pointsIn);
//              }
//              impost.push(angular.copy(ip));
//            }
          }
        }
        var noExist = checkEqualPoints(ip, impost);
        if(noExist) {
          if (linesIn[i].dir === 'curv' && markAx) {
            setSideQPCurve(i, linesInQty, linesIn, ip, pointsIn);
          }
//            console.log('impCP++++++++', JSON.stringify(ip));
          impost.push(angular.copy(ip));
//            console.log('impost++++++++', JSON.stringify(impost));
        }
      }
    }


    function isInsidePointInLine(checkCrossPoint) {
      var isCross = 0;
      if(checkCrossPoint.x === Infinity && checkCrossPoint.y >= 0 && checkCrossPoint.y <= 1) {
        isCross = 1;
      } else if(checkCrossPoint.x >= 0 && checkCrossPoint.x <= 1  && checkCrossPoint.y === Infinity) {
        isCross = 1;
      } else if(isNaN(checkCrossPoint.x) && checkCrossPoint.y >= 0 && checkCrossPoint.y <= 1) {
        isCross = 1;
      } else if(checkCrossPoint.x >= 0 && checkCrossPoint.x <= 1  && isNaN(checkCrossPoint.y)) {
        isCross = 1;
      } else if (checkCrossPoint.x >= 0 && checkCrossPoint.x <= 1  && checkCrossPoint.y >= 0 && checkCrossPoint.y <= 1) {
        isCross = 1;
        //            }
      } else if (checkCrossPoint.x >= 0 && checkCrossPoint.x <= 1  && $.isNumeric(checkCrossPoint.y)) {
        if(checkCrossPoint.y < -2 || checkCrossPoint.y > 2) {
          isCross = 1;
        }
      } else if ($.isNumeric(checkCrossPoint.x) && checkCrossPoint.y >= 0 && checkCrossPoint.y <= 1) {
        if(checkCrossPoint.x < -2 || checkCrossPoint.x > 2) {
          isCross = 1;
        }
      }
      return isCross;
    }


    function findImpostCenter(markAx, impost) {
      //---- take middle point of impost
      var centerImpost = getCenterLine(impost.from, impost.to);
      //---- if impost Axis line
      if(markAx) {
        return centerImpost;
      } else {
      //---- if impost inner line
        var normal = {
          coefA: impost.coefB,
          coefB: -impost.coefA,
          coefC: (impost.coefA * centerImpost.y - impost.coefB * centerImpost.x)
        };
        return getCoordCrossPoint(impost, normal);
      }
    }


    function setSideQPCurve(i, linesInQty, linesIn, intersect, pointsIn) {
      var sideQP1, sideQP2, index, curvP0, curvP2;
      if (linesIn[i].from.id.indexOf('q')+1) {
        index = i - 1;
        if (!linesIn[index]) {
          index = linesInQty - 1;
        }
        curvP0 = linesIn[index].from;
        curvP2 = linesIn[i].to;
        sideQP1 = angular.copy(linesIn[i].from);
      } else if (linesIn[i].to.id.indexOf('q') + 1) {
        index = i + 1;
        if (!linesIn[index]) {
          index = 0;
        }
        curvP0 = linesIn[i].from;
        curvP2 = linesIn[index].to;
        sideQP1 = angular.copy(linesIn[i].to);
      }
      sideQP2 = angular.copy(sideQP1);

      var impostQP1 = getCoordSideQPCurve(intersect.t, curvP0, sideQP1),
          impostQP2 = getCoordSideQPCurve(intersect.t, sideQP2, curvP2),
          impostQPCenter1 = getCenterLine(curvP0, intersect),
          impostQPCenter2 = getCenterLine(intersect, curvP2);

      sideQP1.x = impostQP1.x;
      sideQP1.y = impostQP1.y;
      sideQP1.xQ = impostQPCenter1.x;
      sideQP1.yQ = impostQPCenter1.y;

      sideQP2.x = impostQP2.x;
      sideQP2.y = impostQP2.y;
      sideQP2.xQ = impostQPCenter2.x;
      sideQP2.yQ = impostQPCenter2.y;
//      console.log('QQQQ--------', sideQP1);
//      console.log('QQQQ--------', sideQP2);

      //----- delete Q point parent
      var pQty = pointsIn.length;
      while(--pQty > -1) {
        if(pointsIn[pQty].id === sideQP1.id) {
          pointsIn.splice(pQty, 1);
        }
      }
//      console.log('QQQQ pointsIn after clean--------', JSON.stringify(pointsIn));

      var noExist1 = checkEqualPoints(sideQP1, pointsIn);
      if(noExist1) {
//        console.log('noExist1-------');
        pointsIn.push(sideQP1);
      }
      var noExist2 = checkEqualPoints(sideQP2, pointsIn);
      if(noExist2) {
//        console.log('noExist2-------');
        pointsIn.push(sideQP2);
      }
//      console.log('QQQQ pointsIn--------', JSON.stringify(pointsIn));
    }




    function getImpostQP(group, paramAx, impostBlock) {
      var impQP, impCurvPoints = [];

      //-------- for impostAxis
      if(paramAx) {
        impQP = {
          type: 'impost',
          id: impostBlock.impostAxis[2].id,
          dir: 'curv'
        };
        impCurvPoints.push(impostBlock.impostOut[0], impostBlock.impostOut[1]);

        //------- for impostsIn
      } else {
        impQP = angular.copy(impostBlock.impostOut[2]);
        impCurvPoints = impostBlock.impostIn.filter(function(a) {
          return (a.group === group && a.dir === 'line') ? 1 : 0;
        });
      }


      if(impCurvPoints.length === 2) {
        var impChord = {
              from: angular.copy(impCurvPoints[0]),
              to: angular.copy(impCurvPoints[1])
            },
            centerImpChord = getCenterLine(impChord.from, impChord.to),
            coordQP;

        setLineCoef(impChord);

        //------ get Q point Axis of impost
        coordQP = setQPointCoord(impostBlock.impostAxis[2].positionQ, impChord, impostBlock.impostAxis[2].heightQ*2);
        impQP.x = coordQP.x;
        impQP.y = coordQP.y;
        impQP.xQ = centerImpChord.x;
        impQP.yQ = centerImpChord.y;
        impQP.group = group;

        //------ if impost vert or hor
        if(!impChord.coefA && impostBlock.impostAxis[2].positionQ === 1) {
          impQP.y -= impostBlock.impostAxis[2].heightQ * 4;
        } else if(!impChord.coefB && impostBlock.impostAxis[2].positionQ === 4) {
          impQP.x -= impostBlock.impostAxis[2].heightQ * 4;
        }
//        console.log('!!!!! impQP -----', impQP);
        if(paramAx) {
          impostBlock.impostOut.push(impQP);
          return impQP;
        } else {
          impostBlock.impostIn.push(impQP);
        }
      }

    }




    function collectPointsXChildBlock(impostVector, points, pointsBlock1, pointsBlock2) {
      var pointsQty = points.length;
      for(var i = 0; i < pointsQty; i++) {
        //------- check pointsIn of parent block as to impost
        var position = setPointLocationToLine(impostVector[0], impostVector[1], points[i]);
        //------ block right side
        if(position > 0) {
          var exist = 0;
          if(pointsBlock2.length) {
            exist = checkDoubleQPoints(points[i].id, pointsBlock2);
          }
          if(!exist) {
            pointsBlock2.push(angular.copy(points[i]));
          }
        //------ block left side
        } else if(position < 0){
          var exist = 0;
          if(pointsBlock1.length) {
            exist = checkDoubleQPoints(points[i].id, pointsBlock1);
          }
          if(!exist) {
            pointsBlock1.push(angular.copy(points[i]));
          }
        }
      }
    }


    function collectImpPointsXChildBlock(points, pointsBlock1, pointsBlock2) {
      var pointsQty = points.length;
      for(var i = 0; i < pointsQty; i++) {
        //------ block right side
        if(points[i].group) {
          pointsBlock2.push(angular.copy(points[i]));
        //------ block left side
        } else {
          pointsBlock1.push(angular.copy(points[i]));
        }
      }
    }


    function setPointLocationToLine(lineP1, lineP2, newP) {
      return (newP.x - lineP2.x)*(newP.y - lineP1.y)-(newP.y - lineP2.y)*(newP.x - lineP1.x);
    }


    function checkEqualPoints(newPoint, pointsArr) {
      var noExist = 1,
          pointsQty = pointsArr.length;
      if (pointsQty) {
        while (--pointsQty > -1) {
          if (pointsArr[pointsQty].x === newPoint.x && pointsArr[pointsQty].y === newPoint.y) {
            noExist = 0;
          }
        }
      }
      return noExist;
    }


    function checkDoubleQPoints(newPointId, pointsIn) {
      //      console.log('-----------', newPointId, pointsIn);
      var isExist = 0,
          pointsInQty = pointsIn.length;
      if (pointsInQty) {
        while (--pointsInQty > -1) {
          if (pointsIn[pointsInQty].id.slice(0, 3) === newPointId.slice(0, 3)) {
//            if (pointsIn[pointsInQty].id.slice(0, 3).indexOf('qa') + 1 || pointsIn[pointsInQty].id.slice(0, 3).indexOf('qc') + 1) {
            if (pointsIn[pointsInQty].id.slice(0, 3).indexOf('q') + 1) {
              isExist = 1;
            }
          }
        }
      }
      return isExist;
    }


    function getCoordSideQPCurve(t, p0, p1) {
      var qpi = {
        x: GeneralServ.roundingValue( ((1-t)*p0.x + t*p1.x) ),
        y: GeneralServ.roundingValue( ((1-t)*p0.y + t*p1.y) )
      };
      return qpi;
    }


    function setQPointCoord(side, line, dist) {
      var middle = getCenterLine(line.from, line.to),
          coordQP = {};
//      console.log('setQPointCoord-----------', line, middle);
      //------- line vert or hor
      if(!line.coefA || !line.coefB) {
        coordQP.x = Math.sqrt( Math.pow(dist, 2) / ( 1 + ( Math.pow((line.coefB / line.coefA), 2) ) )) + middle.x;
        coordQP.y = Math.sqrt( Math.abs( Math.pow(dist, 2) - Math.pow((coordQP.x - middle.x), 2) ) ) + middle.y;
//        console.log('line vert or hor');
      } else {
        switch(side) {
          case 1:
            coordQP.y = middle.y - Math.sqrt( Math.pow(dist, 2) / ( 1 + ( Math.pow((line.coefB / line.coefA), 2) ) ));
            coordQP.x = middle.x - Math.sqrt( Math.abs( Math.pow(dist, 2) - Math.pow((middle.y - coordQP.y), 2) ) );
//            console.log('1');
            break;
          case 2:
            coordQP.y = middle.y - Math.sqrt( Math.pow(dist, 2) / ( 1 + ( Math.pow((line.coefB / line.coefA), 2) ) ));
            coordQP.x = Math.sqrt( Math.abs( Math.pow(dist, 2) - Math.pow((coordQP.y - middle.y), 2) ) ) + middle.x;
//            console.log('2');
            break;
          case 3:
            coordQP.y = Math.sqrt( Math.pow(dist, 2) / ( 1 + ( Math.pow((line.coefB / line.coefA), 2) ) )) + middle.y;
            coordQP.x = Math.sqrt( Math.abs( Math.pow(dist, 2) - Math.pow((coordQP.y - middle.y), 2) ) ) + middle.x;
//            console.log('3');
            break;
          case 4:
            coordQP.y = Math.sqrt( Math.pow(dist, 2) / ( 1 + ( Math.pow((line.coefB / line.coefA), 2) ) )) + middle.y;
            coordQP.x = middle.x - Math.sqrt( Math.abs( Math.pow(dist, 2) - Math.pow((middle.y - coordQP.y), 2) ) );
//            console.log('4');

            break;
        }
      }
      coordQP.y = GeneralServ.roundingValue( coordQP.y, 1 );
      coordQP.x = GeneralServ.roundingValue( coordQP.x, 1 );
//      console.log('ERROR coordQP!!!', coordQP);
      return coordQP;
    }







    function setParts(pointsOut, pointsIn, priceElements, currGlassId) {
      var newPointsOut = pointsOut.filter(function (item) {
        if(item.type === 'frame' && !item.view) {
          return false;
        } else {
          return true;
        }
      });

      var parts = [],
          pointsQty = newPointsOut.length,
          beadObj = {
            glassId: currGlassId,
            sizes: []
          }, tempPoint, tempPoint2;

      for(var index = 0; index < pointsQty; index++) {
        //----- passing if first point is curv
        if(index === 0 && newPointsOut[index].dir === 'curv') {
          continue;
        }
        var part = {
          type: newPointsOut[index].type,
          dir: 'line',
          points: []
        };
        /**------ last point ------*/
        if(index === (pointsQty - 1)) {
          /** if curv */
          //------- if one point is 'curv' from both
          if(newPointsOut[index].dir === 'curv') {
            break;
          } else if(newPointsOut[0].dir === 'curv') {
            part.type = 'arc';
            part.points.push(newPointsOut[index], newPointsOut[0], newPointsOut[1], pointsIn[1], pointsIn[0], pointsIn[index]);
            if(newPointsOut[index].type === 'corner' || newPointsOut[1].type === 'corner') {
              part.type = 'arc-corner';
            }
            part.dir = 'curv';
          } else {
            /**----- DOOR -----*/
            if(ProductStor.product.construction_type === 4 && (DesignStor.design.doorConfig.doorShapeIndex === 1 || DesignStor.design.doorConfig.doorShapeIndex === 2)) {
              //-------- change points fp2-fp3 frame
              if (newPointsOut[0].type === 'frame' && newPointsOut[0].id === 'fp3') {
                tempPoint = angular.copy(pointsIn[0]);
                tempPoint.y = newPointsOut[0].y * 1;
                collectPointsInParts(part, newPointsOut[index], newPointsOut[0], tempPoint, pointsIn[index]);
              } else {
                /** if line */
                collectPointsInParts(part, newPointsOut[index], newPointsOut[0], pointsIn[0], pointsIn[index]);
              }
            } else if(ProductStor.product.construction_type === 4 && DesignStor.design.doorConfig.doorShapeIndex === 3) {
              //-------- change points fp2-fp3 frame
              if (newPointsOut[0].type === 'frame' && newPointsOut[0].id === 'fp3') {
                tempPoint = angular.copy(newPointsOut[0]);
                tempPoint.y = pointsIn[0].y * 1;
                collectPointsInParts(part, newPointsOut[index], tempPoint, pointsIn[0], pointsIn[index]);
              } else {
                /** if line */
                collectPointsInParts(part, newPointsOut[index], newPointsOut[0], pointsIn[0], pointsIn[index]);
              }
            } else {
              /** if line */
              collectPointsInParts(part, newPointsOut[index], newPointsOut[0], pointsIn[0], pointsIn[index]);
            }

          }
        } else {

          /** if curv */
          if(newPointsOut[index].dir === 'curv' || newPointsOut[index+1].dir === 'curv') {
            part.type = 'arc';
            part.points.push(newPointsOut[index], newPointsOut[index+1]);
            if(newPointsOut[index+2]) {
              part.points.push(newPointsOut[index+2], pointsIn[index+2]);
              if(newPointsOut[index].type === 'corner' || newPointsOut[index+2].type === 'corner') {
                part.type = 'arc-corner';
              }
            } else {
              part.points.push(newPointsOut[0], pointsIn[0]);
              if(newPointsOut[index].type === 'corner' || newPointsOut[0].type === 'corner') {
                part.type = 'arc-corner';
              }
            }
            part.points.push(pointsIn[index+1], pointsIn[index]);
            part.dir = 'curv';
            index++;
          } else {
            /**----- DOOR -----*/
            if(ProductStor.product.construction_type === 4 && (DesignStor.design.doorConfig.doorShapeIndex === 1 || DesignStor.design.doorConfig.doorShapeIndex === 2)) {
              /** without doorstep */
              //-------- delete fp3-fp4 frame
              if(DesignStor.design.doorConfig.doorShapeIndex === 1) {
                if (newPointsOut[index].type === 'frame' && newPointsOut[index].id === 'fp3') {
                  continue;
                }
              }
              /** doorstep Al inner */
              //-------- change fp3-fp4 frame to inner doorstep
              if(DesignStor.design.doorConfig.doorShapeIndex === 2) {
                if (newPointsOut[index].type === 'frame' && newPointsOut[index].id === 'fp3') {
                  tempPoint = angular.copy(newPointsOut[index]);
                  tempPoint.x = pointsIn[index].x * 1;
                  tempPoint2 = angular.copy(newPointsOut[index+1]);
                  tempPoint2.x = pointsIn[index+1].x * 1;
                  collectPointsInParts(part, tempPoint, tempPoint2, pointsIn[index+1], pointsIn[index]);
                  part.doorstep = 1;
                }
              }

              if (newPointsOut[index].type === 'frame' && newPointsOut[index].id === 'fp4') {
                //-------- change points fp4-fp1 frame
                tempPoint = angular.copy(pointsIn[index]);
                tempPoint.y = newPointsOut[index].y * 1;
                collectPointsInParts(part, newPointsOut[index], newPointsOut[index+1], pointsIn[index+1], tempPoint);
              } else {
                if ((newPointsOut[index].type === 'frame' && newPointsOut[index].id !== 'fp3') || newPointsOut[index].type !== 'frame') {
                  /** if line */
                  collectPointsInParts(part, newPointsOut[index], newPointsOut[index + 1], pointsIn[index + 1], pointsIn[index]);
                }
              }
            } else if(ProductStor.product.construction_type === 4 && DesignStor.design.doorConfig.doorShapeIndex === 3) {
              /** doorstep Al outer */
              //-------- change fp3-fp4 frame to outer doorstep
              if (newPointsOut[index].type === 'frame' && newPointsOut[index].id === 'fp3') {
                tempPoint = angular.copy(pointsIn[index]);
                tempPoint.x = newPointsOut[index].x * 1;
                tempPoint2 = angular.copy(pointsIn[index+1]);
                tempPoint2.x = newPointsOut[index+1].x * 1;
                collectPointsInParts(part, newPointsOut[index], newPointsOut[index+1], tempPoint2, tempPoint);
                part.doorstep = 1;
              }

              if (newPointsOut[index].type === 'frame' && newPointsOut[index].id === 'fp4') {
                //-------- change points fp4-fp1 frame
                tempPoint = angular.copy(newPointsOut[index]);
                tempPoint.y = pointsIn[index].y * 1;
                collectPointsInParts(part, tempPoint, newPointsOut[index+1], pointsIn[index+1], pointsIn[index]);
              } else {
                if ((newPointsOut[index].type === 'frame' && newPointsOut[index].id !== 'fp3') || newPointsOut[index].type !== 'frame') {
                  /** if line */
                  collectPointsInParts(part, newPointsOut[index], newPointsOut[index + 1], pointsIn[index + 1], pointsIn[index]);
                }
              }
            } else {
              /** if line */
              collectPointsInParts(part, newPointsOut[index], newPointsOut[index+1], pointsIn[index+1], pointsIn[index]);
            }
          }

        }
        //console.info(part.points);
        part.path = assamblingPath(part.points);
        //------- culc length
        part.size = culcLength(part.points);

        //------- per Price
        //----- converting size from mm to m
        var sizeValue = GeneralServ.roundingValue(angular.copy(part.size)/1000, 3);
        if(newPointsOut[index].type === 'bead') {
          part.type = 'bead';
          beadObj.sizes.push(sizeValue);
        } else if(newPointsOut[index].type === 'sash') {
          part.type = 'sash';
          priceElements.sashsSize.push(sizeValue);
        } else if(part.type === 'frame') {
          if(part.sill) {
            priceElements.frameSillSize.push(sizeValue);
          } else {
            priceElements.framesSize.push(sizeValue);
          }
        }
        parts.push(part);
      }
      if(beadObj.sizes.length) {
        priceElements.beadsSize.push(beadObj);
      }
      return parts;
    }


    function collectPointsInParts(part, point1, point2, point3, point4) {
      part.points.push(point1, point2, point3, point4);
      if(point1.type === 'corner' || point2.type === 'corner') {
        part.type = 'corner';
      }
      //-------- set sill
      if(point1.sill && point2.sill) {
        part.sill = 1;
      }
    }


    function assamblingPath(arrPoints) {
      var path = 'M ' + arrPoints[0].x + ',' + arrPoints[0].y,
          p = 1,
          pointQty = arrPoints.length;

      //------- Line
      if(pointQty === 4) {
        for(; p < pointQty; p++) {

          path += ' L ' + arrPoints[p].x + ',' + arrPoints[p].y;

          if(p === (pointQty - 1)) {
            path += ' Z';
          }

        }
        //--------- Curve
      } else if(pointQty === 6) {
        for(; p < pointQty; p++) {
          if(p === 3) {
            path += ' L ' + arrPoints[p].x + ',' + arrPoints[p].y;
          } else {
            path += ' Q '+ arrPoints[p].x +','+ arrPoints[p].y + ' ' + arrPoints[p+1].x +','+ arrPoints[p+1].y;
            p++;
          }

          if(p === (pointQty - 1)) {
            path += ' Z';
          }

        }
      }
      //  console.log(arrPoints);

      return path;
    }


    function culcLength(arrPoints) {
      var pointQty = arrPoints.length,
          size = 0;
      //------- Line
      if(pointQty === 2 || pointQty === 4) {
        size = GeneralServ.roundingValue( (Math.hypot((arrPoints[1].x - arrPoints[0].x), (arrPoints[1].y - arrPoints[0].y))), 1 );

        //--------- Curve
      } else if(pointQty === 3 || pointQty === 6) {
        var step = 0.01,
            t = 0;
        while(t <= 1) {
          var sizeX = 2*((1-t)*(arrPoints[1].x - arrPoints[0].x) + t*(arrPoints[2].x - arrPoints[1].x));
          var sizeY = 2*((1-t)*(arrPoints[1].y - arrPoints[0].y) + t*(arrPoints[2].y - arrPoints[1].y));
          size += Math.hypot(sizeX, sizeY)*step;
          t += step;
        }
      }
      return size;
    }


    function setGlass(glassPoints, priceElements, currGlassId) {
      var part = {
            type: 'glass',
            points: glassPoints,
            path: 'M ',
            square: 0
          },
          glassObj = {
            elemId: currGlassId
          },
          pointsQty = glassPoints.length,
          i = 0;

      for(; i < pointsQty; i++) {
        //----- if first point
        if(i === 0) {
          //----- if first point is curve
          if (glassPoints[i].dir === 'curv') {
            part.path += glassPoints[pointsQty - 1].x + ',' + glassPoints[pointsQty - 1].y;

            //-------- if line
          } else {
            part.path += glassPoints[i].x + ',' + glassPoints[i].y;
          }
        }
        //------- if curve
        if(glassPoints[i].dir === 'curv') {
          part.path += ' Q ' + glassPoints[i].x + ',' + glassPoints[i].y + ',';
          if(glassPoints[i+1]) {
            part.path += glassPoints[i+1].x + ',' + glassPoints[i+1].y;
          } else {
            part.path += glassPoints[0].x + ',' + glassPoints[0].y + ' Z';
          }
          i++;
        //-------- if line
        } else {
          part.path += ' L ' + glassPoints[i].x + ',' + glassPoints[i].y;
          if(i === (pointsQty - 1)) {
            part.path += ' Z';
          }
        }

      }
      part.square = calcSquare(glassPoints);
      part.sizes = culcLengthGlass(glassPoints);

      //------- per Price
      glassObj.square = angular.copy(part.square);
      //----- converting size from mm to m
      glassObj.sizes = angular.copy(part.sizes).map(function(item) {
        return GeneralServ.roundingValue(item/1000, 3);
      });
      priceElements.glassSquares.push(glassObj);

      return part;
    }


    function calcSquare(arrPoints) {
      var square = 0,
          pointQty = arrPoints.length;

      for(var p = 0; p < pointQty; p++) {
        if(arrPoints[p+1]) {
          square += arrPoints[p].x * arrPoints[p+1].y - arrPoints[p].y * arrPoints[p+1].x;
        } else {
          square += arrPoints[p].x * arrPoints[0].y - arrPoints[p].y * arrPoints[0].x
        }
      }
      square /= (2 * 1000000);

      //  console.log('square = ', square);
      return square;
    }


    function culcLengthGlass(points) {
      var pointQty = points.length,
          sizes = [];

      for(var p = 0; p < pointQty; p++) {
        var size = 0, indNext;
        if(p === 0 && points[p].dir === 'curve') {
          continue;
        }
        if(points[p+1]) {
          indNext = p+1;
        } else {
          indNext = 0;
        }
        //--------- Curve
        if(points[indNext].dir === 'curve') {
          var step = 0.01, t = 0, ind2;
          if(points[p+2]) {
            ind2 = p+2;
          } else {
            ind2 = 1;
          }
          while (t <= 1) {
            var sizeX = 2 * ((1 - t) * (points[indNext].x - points[p].x) + t * (points[ind2].x - points[indNext].x));
            var sizeY = 2 * ((1 - t) * (points[indNext].y - points[p].y) + t * (points[ind2].y - points[indNext].y));
            size += Math.hypot(sizeX, sizeY) * step;
            t += step;
          }
          ++p;
        } else {
          //------- Line
          size = GeneralServ.roundingValue( Math.hypot((points[indNext].x - points[p].x), (points[indNext].y - points[p].y)), 1 );
        }

        sizes.push(size);
      }

      return sizes;
    }




    function setCornerProp(blocks) {
      var blocksQty = blocks.length;

      for(var b = 1; b < blocksQty; b++) {
        //------- if block 1
        if(blocks[b].level === 1) {
          var pointsQty = blocks[b].pointsOut.length,
              i = 0;
          if(blocks[b].position === 'single') {
            for(; i < pointsQty; i++){
              blocks[b].pointsOut[i].corner = checkPointXCorner(blocks[b].pointsOut, (pointsQty-1), i);
            }
          } else if(blocks[b].position === 'first') {
            for(; i < pointsQty; i++){
              if(blocks[b].pointsOut[i].fi > 90 && blocks[b].pointsOut[i].fi < 270) {
                blocks[b].pointsOut[i].corner = checkPointXCorner(blocks[b].pointsOut, (pointsQty-1), i);
              }
            }
          } else if(blocks[b].position === 'last') {
            for(; i < pointsQty; i++){
              if(blocks[b].pointsOut[i].fi < 90 || blocks[b].pointsOut[i].fi > 270) {
                blocks[b].pointsOut[i].corner = checkPointXCorner(blocks[b].pointsOut, (pointsQty-1), i);
              }
            }
          }

        }
      }

    }


    function checkPointXCorner(points, last, curr) {
      if(curr === 0) {
        if(points[last].type !== 'arc' && points[curr].type === 'frame' && points[curr+1].type !== 'arc') {
          return 1;
        } else {
          return 0;
        }
      } else if(curr === last) {
        if(points[curr-1].type !== 'arc' && points[curr].type === 'frame' && points[0].type !== 'arc') {
          return 1;
        } else {
          return 0;
        }
      } else {
        if(points[curr-1].type !== 'arc' && points[curr].type === 'frame' && points[curr+1].type !== 'arc') {
          return 1;
        } else {
          return 0;
        }
      }
    }




    function copyPointsOut(pointsArr, label) {
      var newPointsArr = angular.copy(pointsArr),
          newPointsQty = newPointsArr.length;
      while(--newPointsQty > -1) {
        newPointsArr[newPointsQty].type = label;
      }
      return newPointsArr;
    }




    function setOpenDir(direction, beadLines) {
      var parts = [],
          newPoints = preparePointsXMaxMin(beadLines),
          center = centerBlock(newPoints),
//          dim = GeneralServ.getMaxMinCoord(newPoints),
//          center = {
//            x: (dim.minX + dim.maxX)/2,
//            y: (dim.minY + dim.maxY)/2
//          },
          dirQty = direction.length;
//      console.log('DIR line===', beadLines);
//      console.log('DIR newPoints===', newPoints);
//      console.log('DIR geomCenter===', geomCenter);

      for(var index = 0; index < dirQty; index++) {
        var part = {
          type: 'sash-dir',
          points: []
        };

        switch(direction[index]) {
          //----- 'up'
          case 1:
            part.points.push(getCrossPointSashDir(1, center, 225, beadLines), getCrossPointSashDir(3, center, 90, beadLines), getCrossPointSashDir(1, center, 315, beadLines));
            break;
          //----- 'right'
          case 2:
            part.points.push(getCrossPointSashDir(2, center, 225, beadLines), getCrossPointSashDir(4, center, 180, beadLines), getCrossPointSashDir(2, center, 135, beadLines));
            break;
          //------ 'down'
          case 3:
            part.points.push(getCrossPointSashDir(3, center, 135, beadLines), getCrossPointSashDir(1, center, 270, beadLines), getCrossPointSashDir(3, center, 45, beadLines));
            break;
          //----- 'left'
          case 4:
            part.points.push(getCrossPointSashDir(4, center, 45, beadLines), getCrossPointSashDir(2, center, 180, beadLines), getCrossPointSashDir(4, center, 315, beadLines));
            break;
        }
        parts.push(part);
      }

      return parts;
    }


    function preparePointsXMaxMin(lines) {
      var points = [],
          linesQty = lines.length;
      for(var l = 0; l < linesQty; l++) {
        if(lines[l].dir === 'curv') {
          var t = 0.5,
              peak = {}, ind0, ind1 = l, ind2;
          if(l === 0) {
            ind0 = linesQty - 1;
            ind2 = l + 1;
          } else if(l === (linesQty - 1)) {
            ind0 = l - 1;
            ind2 = 0;
          } else {
            ind0 = l - 1;
            ind2 = l + 1;
          }
          peak.x = getCoordCurveByT(lines[ind0].to.x, lines[ind1].to.x, lines[ind2].to.x, t);
          peak.y = getCoordCurveByT(lines[ind0].to.y, lines[ind1].to.y, lines[ind2].to.y, t);
          points.push(peak);
        } else {
          points.push(lines[l].to);
        }
      }
      return points;
    }


    function getCrossPointSashDir(position, centerGeom, angel, lines) {
      var sashDirVector = cteateLineByAngel(centerGeom, angel);
      var crossPoints = getCrossPointInBlock(position, sashDirVector, lines);
//      console.log('DIR new coord----------', crossPoints);
      return crossPoints;
    }


    function cteateLineByAngel(center, angel) {
//      console.log(angel);
      var k =  Math.tan(angel * Math.PI / 180),
          lineMark = {
            center: center,
            coefA: k,
            coefB: -1,
            coefC: (center.y - k*center.x)
          };
      return lineMark;
    }


    function getCrossPointInBlock(position, vector, lines) {
      var linesQty = lines.length;
//      console.log('lines @@@@@@', lines);
      for(var l = 0; l < linesQty; l++) {
        var coord, isInside, isCross, intersect;
//        console.log('DIR line ++++', lines[l]);

        coord = getCoordCrossPoint(vector, lines[l]);
        if(coord.x >= 0 && coord.y >= 0) {

          //------ checking is cross point inner of line
          isInside = checkLineOwnPoint(coord, lines[l].to, lines[l].from);
          isCross = isInsidePointInLine(isInside);
          if(isCross) {
            if(lines[l].dir === 'curv') {
              intersect = getIntersectionInCurve(l, linesQty, lines, vector.center, coord);
              if(intersect.length) {
                coord.x = intersect[0].x;
                coord.y = intersect[0].y;
              }
            }

            coord.fi = getAngelPoint(vector.center, coord);
            if(position) {
              switch(position) {
                case 1:
                  if(coord.fi > 180) {
                    return coord;
                  }
                  break;
                case 2:
                  if(coord.fi > 90 && coord.fi < 270) {
                    return coord;
                  }
                  break;
                case 3:
                  if(coord.fi < 180) {
                    return coord;
                  }
                  break;
                case 4:
                  if(coord.fi > 270 || coord.fi < 90) {
                    return coord;
                  }
                  break;
              }
            } else {
              return coord;
            }
          }
        }
      }
    }




    function getIntersectionInCurve(i, linesQty, lines, vector, coord) {
      var p1, p2, p3, l1, l2, index;

      if (lines[i].from.id.indexOf('q') + 1) {
        index = i - 1;
        if (!lines[index]) {
          index = linesQty - 1;
        }
        p1 = lines[index].from;
        p2 = lines[i].from;
        p3 = lines[i].to;
      } else if (lines[i].to.id.indexOf('q') + 1) {
        index = i + 1;
        if (!lines[index]) {
          index = 0;
        }
        p1 = lines[i].from;
        p2 = lines[i].to;
        p3 = lines[index].to;
      }

      l1 = vector;
      l2 = coord;
      //--------- calc the intersections
      return intersectionQ(p1, p2, p3, l1, l2);
    }


    function intersectionQ(p1, p2, p3, a1, a2) {
      var intersections = [],
          //------- inverse line normal
          normal = {
            x: a1.y-a2.y,//coefA
            y: a2.x-a1.x//coefB
          },
          //------- Q-coefficients
          c2 = {
            x: p1.x - 2*p2.x + p3.x,
            y: p1.y - 2*p2.y + p3.y
          },
          c1 = {
            x: 2*(p2.x - p1.x),
            y: 2*(p2.y - p1.y)
          },
          c0 = {
            x: p1.x,
            y: p1.y
          },
          //--------- Transform to line
          coefficient = a1.x*a2.y - a2.x*a1.y,//coefC
          roots = [],
          a, b, c, d;

      if(Math.abs(normal.x) === Math.abs(normal.y)) {
        a = Math.abs(normal.x*c2.x) + Math.abs(normal.y*c2.y);
        //------ if line is vert or horisontal
      } else if(!Math.abs(normal.x)) {
        a = c2.x + normal.y*c2.y;
      } else if(!Math.abs(normal.y)) {
        a = normal.x*c2.x + c2.y;
      } else {
        a = normal.x*c2.x + normal.y*c2.y;
      }

      b = (normal.x*c1.x + normal.y*c1.y)/a ;
      c = (normal.x*c0.x + normal.y*c0.y + coefficient)/a;
      d = (b*b - 4*c);

//        console.log('normal ++++',normal);
//        console.log('c1 ++++',c1);
//      console.log('c2 ++++',c2);
//      console.log('c0 ++++',c0);
//        console.log('a ++++',a);
//        console.log('b ++++',b);
//        console.log('c ++++',c);
//        console.log('d ++++',d);
      // solve the roots
      if(d > 0) {
        var delta = Math.sqrt(d);
//        console.log('delta ++++', b, delta);
        roots.push( GeneralServ.roundingValue( (-b + delta)/2 ), GeneralServ.roundingValue( (-b - delta)/2 ) );
//        roots.push( (-b + delta)/2 );
//        roots.push( (-b - delta)/2 );
      } else if(d === 0) {
        roots.push( GeneralServ.roundingValue( -b/2 ) );
//        roots.push( -b/2 );
      }
//TODO проблема с точкой пересечения
//      console.log('t++++',roots);

      //---------- calc the solution points
      for(var i=0; i<roots.length; i++) {
        var t = roots[i];

        //    if(t >= 0 && t <= 1) {
        if(t > 0 && t < 1) {
          // possible point -- pending bounds check
          var point = {
                t: t,
                x: getCoordCurveByT(p1.x, p2.x, p3.x, t),
                y: getCoordCurveByT(p1.y, p2.y, p3.y, t)
              },
              minX = Math.min(a1.x, a2.x, p1.x, p2.x, p3.x),
              minY = Math.min(a1.y, a2.y, p1.y, p2.y, p3.y),
              maxX = Math.max(a1.x, a2.x, p1.x, p2.x, p3.x),
              maxY = Math.max(a1.y, a2.y, p1.y, p2.y, p3.y);
          //---------- bounds checks
//          console.log('t++++',point);
          if(a1.x === a2.x && point.y >= minY && point.y <= maxY){
            //-------- vertical line
            intersections.push(point);
          } else if(a1.y === a2.y && point.x >= minX && point.x <= maxX){
            //-------- horizontal line
            intersections.push(point);
          } else if(point.x >= minX && point.y >= minY && point.x <= maxX && point.y <= maxY){
            //--------- line passed bounds check
            intersections.push(point);
          }
        }
      }
//      console.log('~~~~~~~intersections ===', intersections);
      return intersections;
    }


    //---------- linear interpolation utility
    function getCoordCurveByT(P0, P1, P2, t) {
      return GeneralServ.roundingValue( (t*t*(P0 - 2*P1 + P2) - 2*t*(P0 - P1) + P0) );
    }



    function setSashePropertyXPrice(sashType, openDir, hardwareLines, priceElements) {
      var tempSashBlock = {
            sizes: [],
            openDir: openDir,
            type: sashType
          },
          hardwareQty = hardwareLines.length;
      while(--hardwareQty > -1) {
        tempSashBlock.sizes.push(hardwareLines[hardwareQty].size);
      }
      priceElements.sashesBlock.push(tempSashBlock);
    }



    //---------- for impost


    function setImpostParts(points, priceElements) {
      var pointsType = points[0].type,
          pointsQty = points.length,
          part = {
            type: pointsType,
            dir: 'line'
          };
      //------ if impost is line
      if(pointsQty === 4) {
        var center = centerBlock(points);
        part.points = sortingPoints(points, center);
      //------- if impost is curve
      } else if(pointsQty === 6){
        part.dir = 'curv';
//        console.log('-----------IMPOST Q -----------', points);
        part.points = sortingQImpostPoints(points);
      }
      part.path = assamblingPath(part.points);

      //------- culc length
      var sizePoints = sortingImpPXSizes(pointsQty, part.points);
      part.size = culcLength(sizePoints);

      //------- for Price
      //----- converting size from mm to m
      var sizeValue = GeneralServ.roundingValue(angular.copy(part.size)/1000, 3);

      if(pointsType === 'impost') {
        priceElements.impostsSize.push(sizeValue);
      } else if(pointsType === 'shtulp') {
        priceElements.shtulpsSize.push(sizeValue);
      }

      return part;
    }



    function sortingQImpostPoints(points) {
      var newPoints = [],
          pointsLeft = [],
          pointsRight = [],
          impLineP1, impLineP2,
          pointsQty = points.length;
      for(var i = 0; i < pointsQty; i++) {
        if(points[i].id.indexOf('qi')+1) {
          if(points[i].group) {
            impLineP2 = points[i];
          } else {
            impLineP1 = points[i];
          }
        }
      }
      for(var i = 0; i < pointsQty; i++) {
        if(points[i].id.indexOf('qi')+1) {
          continue;
        }
        var position = setPointLocationToLine(impLineP1, impLineP2, points[i]);
        if(position > 0) {
          pointsLeft.push(points[i]);
        } else {
          pointsRight.push(points[i]);
        }
      }
      for(var l = 0; l < pointsLeft.length; l++) {
        if(pointsLeft[l].group) {
          newPoints.unshift(pointsLeft[l]);
        } else {
          newPoints.push(pointsLeft[l]);
        }
      }
      newPoints.unshift(impLineP2);
      newPoints.push(impLineP1);
      for(var r = 0; r < pointsRight.length; r++) {
        if(pointsRight[r].group) {
          newPoints.unshift(pointsRight[r]);
        } else {
          newPoints.push(pointsRight[r]);
        }
      }
//      console.log('-----------IMPOST Q -----------', newPoints);
      return newPoints;
    }


    function sortingImpPXSizes(pointsQty, impPoints) {
      var newImpPoints = [];
      if(pointsQty === 4) {
        while(--pointsQty > -1) {
          if(impPoints[pointsQty].group) {
            newImpPoints.push(impPoints[pointsQty]);
          }
        }
      } else if(pointsQty === 6) {
        for(var i = 0; i < pointsQty; i++) {
          if(impPoints[i].group) {
            if(impPoints[i].id.indexOf('ip')+1 || impPoints[i].id.indexOf('sht')+1) {
              newImpPoints.push(impPoints[i]);
            }
          }
        }
        for(var i = 0; i < pointsQty; i++) {
          if(impPoints[i].group) {
            if(impPoints[i].id.indexOf('qi')+1) {
              newImpPoints.splice(1, 0, impPoints[i]);
            }
          }
        }
      }
      return newImpPoints;
    }




    function getCoordCrossPoint(line1, line2) {
      var base = (line1.coefA * line2.coefB) - (line2.coefA * line1.coefB),
          baseX = (line1.coefB * line2.coefC) - (line2.coefB * line1.coefC),
          baseY = (line2.coefA * line1.coefC) - (line1.coefA * line2.coefC),
          crossPoint = {
            x: GeneralServ.roundingValue( GeneralServ.roundingValue(baseX/base, 3) ),
            y: GeneralServ.roundingValue( GeneralServ.roundingValue(baseY/base, 3) )
          };
      if(crossPoint.x === -0) {
        crossPoint.x = 0;
      } else if(crossPoint.y === -0) {
        crossPoint.y = 0;
      }
      return crossPoint;
    }



    function checkLineOwnPoint(point, lineTo, lineFrom) {
      var check = {
        x: GeneralServ.roundingValue( ((point.x - lineTo.x)/(lineFrom.x - lineTo.x)) ),
        y: GeneralServ.roundingValue( ((point.y - lineTo.y)/(lineFrom.y - lineTo.y)) )
      };
      if(check.x === -Infinity) {
        check.x = Infinity;
      } else if(check.y === -Infinity) {
        check.y = Infinity;
      }
      if(check.x === -0) {
        check.x = 0;
      } else if(check.y === -0) {
        check.y = 0;
      }
      return check;
    }



    function getCenterLine(pointStart, pointEnd) {
      var center = {
        x: (pointStart.x + pointEnd.x)/2,
        y: (pointStart.y + pointEnd.y)/2
      };
      return center;
    }



    function collectAllPointsOut(blocks) {
      var points = [],
          blocksQty = blocks.length;

      while(--blocksQty > 0) {
        var pointsOutQty = blocks[blocksQty].pointsOut.length;
        if(pointsOutQty) {
          while(--pointsOutQty > -1) {
            points.push(angular.copy(blocks[blocksQty].pointsOut[pointsOutQty]));
          }
        }
      }
      //------ delete dublicates
      cleanDublicat(3, points);
      return points;
    }


    function cleanDublicat(param, arr) {
      var pQty = arr.length;
      while(--pQty > -1) {
        var pQty2 = arr.length,
            exist = 0;
        for(var i = 0; i < pQty2; i++) {
          switch(param) {
            case 1:
              if(arr[i].x === arr[pQty].x) {
                exist++;
              }
              break;
            case 2:
              if(arr[i].y === arr[pQty].y) {
                exist++;
              }
              break;
            case 3:
              if(arr[i].x === arr[pQty].x && arr[i].y === arr[pQty].y) {
                exist++;
              }
              break;
          }
        }
        if(exist > 1) {
          arr.splice(pQty, 1);
        }
      }
    }


    function cleanDublicatNoFP(param, points) {
//      console.log('points******** ', points);
      var pQty = points.length;

      while(--pQty > -1) {
        var pQty2 = points.length;

        while(--pQty2 > -1) {
          if(pQty !== pQty2) {
//            console.log('********', points[pQty], points[pQty2]);
            if(points[pQty] && points[pQty2]) {
              switch(param) {
                case 1:
                  if(points[pQty].x === points[pQty2].x) {
//                    if(points[pQty].type === 'frame' && points[pQty2].type === 'frame' || points[pQty].type === 'impost' && points[pQty2].type === 'frame') {
//                      delete points[pQty];
                      //                    points.splice(pQty, 1);
//                    } else
                    if ((points[pQty2].type === 'impost' || points[pQty2].type === 'shtulp') && (points[pQty].type === 'frame' || points[pQty].type === 'corner')) {
                      delete points[pQty2];
                      //                    points.splice(pQty2, 1);
                    } else {
                      delete points[pQty];
                    }
//                    console.log('***** delete');
                  }
                  break;
                case 2:
                  if(points[pQty].y === points[pQty2].y) {
//                    if(points[pQty].type === 'frame' && points[pQty2].type === 'frame' || points[pQty].type === 'impost' && points[pQty2].type === 'frame') {
//                      delete points[pQty];
                      //                    points.splice(pQty, 1);
//                    } else
                    if ((points[pQty2].type === 'impost' || points[pQty2].type === 'shtulp') && (points[pQty].type === 'frame' || points[pQty].type === 'corner')) {
                      //                    points.splice(pQty2, 1);
                      delete points[pQty2];
                    } else {
                      delete points[pQty];
                    }
//                    console.log('***** delete');
                  }
                  break;
              }
            }
          }

        }
      }
      return points.filter(function(item) {
        return (item) ? 1 : 0;
      })
    }


    function sortByX(a, b) {
      return a.x - b.x;
    }


    function sortByY(a, b) {
      return a.y - b.y;
    }















    /**=============== DIMENSION ============*/


    function initDimensions(blocks) {
      var dimension = {
            dimX: [],
            dimY: [],
            dimQ: []
          },
          blocksQty = blocks.length,
          maxSizeLimit = blocks[0].maxSizeLimit,
          globalLimitsX, globalLimitsY, allPoints;
      /**---------- All points ----------*/
      allPoints = collectAllPointsOut(blocks);
      //------ except Q points
      allPoints = allPoints.filter(function (elem) {
        return (elem.dir === 'curv' || elem.t) ? 0 : 1;
      });
      globalLimitsX = angular.copy(allPoints);
      globalLimitsY = angular.copy(allPoints);
      //------ delete dublicates
      cleanDublicat(1, globalLimitsX);
      cleanDublicat(2, globalLimitsY);
      //---- sorting
      globalLimitsX.sort(sortByX);
      globalLimitsY.sort(sortByY);
      //console.log('``````````allPoints``````', allPoints);
      //console.log('``````````globalLimitsX``````', globalLimitsX);
      //console.log('``````````globalLimitsY``````', globalLimitsY);

      /**-------- on eah block --------*/
      for (var b = 1; b < blocksQty; b++) {
        var pointsOutQty = blocks[b].pointsOut.length;
        //console.log('+++++++++++BLOCKS+++++++++', blocks[b].id);

        /** Global Dimension of Blocks level 1 */
        if (blocks[b].level === 1) {
          //console.log('========= block 1===========');
          var globalDimX = [],
              globalDimY,
              arcHeights = [],
              overallDim = {w: 0, h: 0};

          for (var i = 0; i < pointsOutQty; i++) {
            if (blocks[b].pointsOut[i].id.indexOf('fp') + 1) {
              globalDimX.push(blocks[b].pointsOut[i]);
            } else if(blocks[b].pointsOut[i].id.indexOf('qa') + 1) {
              arcHeights.push(blocks[b].pointsOut[i]);
            }
          }
          globalDimY = angular.copy(globalDimX);
          //------ delete dublicates
          cleanDublicat(1, globalDimX);
          cleanDublicat(2, globalDimY);
          //---- sorting
          globalDimX.sort(sortByX);
          globalDimY.sort(sortByY);

          //console.log('``````````globalDimX ``````', globalDimX);
          //console.log('``````````globalDimY ``````', globalDimY);
          //console.log('``````````heightArcX ``````', arcHeights);
          collectDimension(1, 'x', globalDimX, dimension.dimX, globalLimitsX, blocks[b].id, maxSizeLimit);
          collectDimension(1, 'y', globalDimY, dimension.dimY, globalLimitsY, blocks[b].id, maxSizeLimit);
          //------ collect dim for arc height
          createArcDim(1, blocks[b].id, arcHeights, dimension, blocks, blocksQty);

          //----------- collect Curver Radius
          if (blocks[b].pointsQ) {
            var curveQty = blocks[b].pointsQ.length;
            if (curveQty) {
              while (--curveQty > -1) {
                dimension.dimQ.push(blocks[b].pointsQ[curveQty]);
              }
            }
          }

          //--------- get Overall Dimension
//          console.log('for overall------', dimension.dimX, dimension.dimY);
          collectOverallDim(overallDim, dimension);
//          console.log('for overall finish ------', overallDim);

          overallDim.square = calcSquare(blocks[b].pointsOut);
          //--------- push Overall Dimension
          blocks[0].overallDim.push(overallDim);
        }



        /**========= Dimension in Block without children ==========*/

        if (!blocks[b].children.length) {
          var blockDimX = [],
              blockDimY,
              blockLimits = [];

          cleanPointsOutDim(blockDimX, blocks[b].pointsOut);
          //console.log('`````````` blockDimX ``````````', JSON.stringify(blockDimX));

          //------ go to parent and another children for Limits
          for (var bp = 1; bp < blocksQty; bp++) {
            if (blocks[bp].id === blocks[b].parent) {
              //------- add impost
              if(blocks[bp].impost) {
                //============ collect Curver Radius of impost
                if (blocks[bp].impost.impostAxis[2]) {
                  dimension.dimQ.push(blocks[bp].impost.impostAxis[2]);
                }
              }
            }
          }
/*
          //-------- set block Limits
          //------ go to parent and another children for Limits
          for (var bp = 1; bp < blocksQty; bp++) {
            if (blocks[bp].id === blocks[b].parent) {
              var childQty = blocks[bp].children.length;
              //------- add parent pointsOut
              cleanPointsOutDim(blockLimits, blocks[bp].pointsOut);
              //------- add impost
              if(blocks[bp].impost) {
//                console.log('dimQ+++++++++', blocks[bp].impost, blocks[bp].impost.impostAxis[0], blocks[bp].impost.impostAxis[1]);
                if(!blocks[bp].impost.impostAxis[0].t) {
                  blockLimits.push(blocks[bp].impost.impostAxis[0]);
                }
                if(!blocks[bp].impost.impostAxis[1].t) {
                  blockLimits.push(blocks[bp].impost.impostAxis[1]);
                }

                //============ collect Curver Radius of impost
                if (blocks[bp].impost.impostAxis[2]) {
//                  console.log('dimQ+++++++++', blocks[bp].impost, blocks[bp].impost.impostAxis[2]);
                  dimension.dimQ.push(blocks[bp].impost.impostAxis[2]);
                }
              }
              //------- add imposts of childern
              while(--childQty > -1) {
                if(blocks[bp].children[childQty] !== blocks[b].id) {
                  getAllImpostDim(blockLimits, blocks[bp].children[childQty], blocksQty, blocks);
                }
              }
            }
          }
*/

          blockLimits = angular.copy(allPoints);
          //console.log('`````````` blockLimits ``````````', blockLimits);
          blockDimY = angular.copy(blockDimX);

          /**-------- build Dimension -----------*/
          if (blockDimX.length > 1) {
            /** X */
            //------ delete dublicates
            blockDimX = cleanDublicatNoFP(1, blockDimX);
            //---- sorting
            blockDimX.sort(sortByX);
            //console.log('`````````` new dim X ``````````', blockDimX);
            collectDimension(0, 'x', blockDimX, dimension.dimX, blockLimits, blocks[b].id, maxSizeLimit);

            /** Y */
            //------ delete dublicates
            blockDimY = cleanDublicatNoFP(2, blockDimY);
            //---- sorting
            blockDimY.sort(sortByY);
            //console.log('`````````` new dim Y ``````````', blockDimY);
            collectDimension(0, 'y', blockDimY, dimension.dimY, blockLimits, blocks[b].id, maxSizeLimit);
          }
        }

      }

      dimension.dimX = angular.copy(deleteDublicatDim(dimension.dimX));
      dimension.dimY = angular.copy(deleteDublicatDim(dimension.dimY));
      return dimension;
    }





    function createArcDim(level, currBlockId, arcDims, dimension, blocks, blocksQty) {
      var arcQty = arcDims.length;
      while(--arcQty > -1) {
        var dim = {
          blockId: currBlockId,
          level: level,
          dimId: arcDims[arcQty].id,
          minLimit: globalConstants.minRadiusHeight
        };
        //---------- find point Q in pointsQ
        for(var b = 1; b < blocksQty; b++) {
          if(blocks[b].level === 1) {
            if(blocks[b].pointsQ) {
              var pointsQQty = blocks[b].pointsQ.length;
              if(pointsQQty) {
                for(var q = 0; q < pointsQQty; q++) {
                  if(blocks[b].pointsQ[q].id === dim.dimId) {
                    //                    console.log('DIM HEIGHT ARC pointsQ ------------', blocks[b].pointsQ[q]);
                    switch(blocks[b].pointsQ[q].positionQ) {
                      case 1:
                        dim.axis = 'y';
                        dim.from = angular.copy(blocks[b].pointsQ[q].startY);
                        dim.to = angular.copy(blocks[b].pointsQ[q].midleY);
                        break;
                      case 2:
                        dim.axis = 'x';
                        dim.from = angular.copy(blocks[b].pointsQ[q].midleX);
                        dim.to = angular.copy(blocks[b].pointsQ[q].startX);
                        break;
                      case 3:
                        dim.axis = 'y';
                        dim.from = angular.copy(blocks[b].pointsQ[q].midleY);
                        dim.to = angular.copy(blocks[b].pointsQ[q].startY);
                        break;
                      case 4:
                        dim.axis = 'x';
                        dim.from = angular.copy(blocks[b].pointsQ[q].startX);
                        dim.to = angular.copy(blocks[b].pointsQ[q].midleX);
                        break;
                    }
                    dim.text = GeneralServ.roundingValue( angular.copy(blocks[b].pointsQ[q].heightQ), 1 );
                    dim.maxLimit = blocks[b].pointsQ[q].lengthChord/4;
                  }
                }
              }
            }
          }
        }
        //        console.log('DIM HEIGHT ARC finish ------------', dim);
        if(dim.axis === 'x') {
          dimension.dimX.push(dim);
        } else {
          dimension.dimY.push(dim);
        }
      }
    }



    function collectOverallDim(overallDim, dimension) {
      var dimXQty = dimension.dimX.length,
          dimYQty = dimension.dimY.length;
      while(--dimXQty > -1) {
        if(dimension.dimX[dimXQty].level) {
          overallDim.w += dimension.dimX[dimXQty].text;
        }
      }
      while(--dimYQty > -1) {
        if(dimension.dimY[dimYQty].level) {
          overallDim.h += dimension.dimY[dimYQty].text;
        }
      }
    }



    function cleanPointsOutDim(result, points) {
      var pQty = points.length;
      while(--pQty > -1) {
        if(points[pQty].t || points[pQty].dir === 'curv' || (points[pQty].id.indexOf('fp')+1 && !points[pQty].view)){
//TODO        if(points[pQty].dir === 'curv' || (points[pQty].id.indexOf('fp')+1 && !points[pQty].view)){
          continue;
        } else {
          result.push(points[pQty]);
        }
      }
    }




    function getAllImpostDim(blockLimits, childBlockId, blocksQty, blocks) {
      for(var i = 1; i < blocksQty; i++) {
        if(blocks[i].id === childBlockId) {
          if(blocks[i].children.length) {
            if(!blocks[i].impost.impostAxis[0].t) {
              blockLimits.push(blocks[i].impost.impostAxis[0]);
            }
            if(!blocks[i].impost.impostAxis[1].t) {
              blockLimits.push(blocks[i].impost.impostAxis[1]);
            }
            getAllImpostDim(blockLimits, blocks[i].children[0], blocksQty, blocks);
            getAllImpostDim(blockLimits, blocks[i].children[1], blocksQty, blocks);
          }
        }
      }
    }




    function deleteDublicatDim(dimension) {
      var dimXLevel1 = dimension.filter(function(item) {
            return item.level === 1;
          }),
          dimXLevel1Qty = dimXLevel1.length,
          dimX = dimension.filter(function(item) {
            var count = 0;
            for(var d = 0; d < dimXLevel1Qty; d++) {
              if(!item.level && item.from === dimXLevel1[d].from && item.to === dimXLevel1[d].to) {
                ++count;
              }
            }
            if(!count) {
              return 1;
            }
          });
//      console.log('````````````````````', dimX);
      return dimX;
    }




    function collectDimension(level, axis, pointsDim, dimension, limits, currBlockId, maxSizeLimit) {
      var dimQty = pointsDim.length - 1;
//      console.log('-------- points ---------', JSON.stringify(pointsDim));
      for(var d = 0; d < dimQty; d++) {
        //TODO----- not create global dim in block level 0
        //if(!level && d+1 === dimQty && (pointsDim[d+1].type === 'frame' || pointsDim[d+1].type === 'corner')) {
        //  break;
        //} else {
          dimension.push(createDimObj(level, axis, d, d+1, pointsDim, limits, currBlockId, maxSizeLimit));
        //}
      }
    }



    function createDimObj(level, axis, index, indexNext, blockDim, limits, currBlockId, maxSizeLimit) {
//      console.log('FINISH current point---------', blockDim[index], blockDim[indexNext]);
      var dim = {
            blockId: currBlockId,
            level: level,
            axis: axis,
            dimId: blockDim[indexNext].id,
            from: (axis === 'x') ? angular.copy(blockDim[index].x) : angular.copy(blockDim[index].y),
            to: (axis === 'x') ? angular.copy(blockDim[indexNext].x) : angular.copy(blockDim[indexNext].y)
          },
          currLimit;
      dim.text = GeneralServ.roundingValue( Math.abs(dim.to - dim.from), 1 );
//      console.log('FINISH limits---------', dim, limits);
      //=========== set Limints
      //-------- for global
      if(level) {
//                console.log('FINISH global---------');
        currLimit = setLimitsGlobalDim(dim, limits, maxSizeLimit);
      } else {
        //-------- for block
        //        console.log('FINISH block---------');
        currLimit = setLimitsDim(axis, blockDim[indexNext], dim.from, limits, maxSizeLimit);
      }
      dim.minLimit = currLimit.minL;
      dim.maxLimit = currLimit.maxL;
//      console.log('---------------DIM FINISH ------------');
      return dim;
    }



    function setLimitsGlobalDim(dim, limits, maxSizeLimit) {
      var dimLimit = {},
          limitsQty = limits.length;
      for(var i = 0; i < limitsQty; i++) {
        if(dim.axis === 'x') {
          if(limits[i].x === dim.to) {
            dimLimit.minL = (limits[i-1]) ? GeneralServ.roundingValue( (limits[i-1].x + globalConstants.minSizeLimit), 1 ) : globalConstants.minSizeLimit;
            dimLimit.maxL = (limits[i+1]) ? GeneralServ.roundingValue( (limits[i+1].x - dim.from - globalConstants.minSizeLimit), 1 ) : maxSizeLimit;
          }
        } else {
          if(limits[i].y === dim.to) {
            dimLimit.minL = (limits[i-1]) ? GeneralServ.roundingValue( (limits[i-1].y + globalConstants.minSizeLimit), 1 ) : globalConstants.minSizeLimit;
            dimLimit.maxL = (limits[i+1]) ? GeneralServ.roundingValue( (limits[i+1].y - dim.from - globalConstants.minSizeLimit), 1 ) : maxSizeLimit;
          }
        }
      }
      return dimLimit;
    }



    function setLimitsDim(axis, pointDim, startDim, limits, maxSizeLimit) {
//      console.log('!!!!!!!!! DIM LIMITS ------------', axis, pointDim, startDim, limits, maxSizeLimit);
      var dimLimit = {},
          //------ set new Limints by X or Y
          currLimits = setNewLimitsInBlock(axis, pointDim, limits),
          currLimitsQty = currLimits.length;
      //console.log('!!!!!!!!! DIM NEW LIMITS ------------', currLimits);
      for(var i = 0; i < currLimitsQty; i++) {
        //---- find left second imp point
        var isSecondImpP = 0;
        for(var s = 0; s < currLimitsQty; s++) {
          if(currLimits[s].id === pointDim.id){
            var difX = pointDim.x - currLimits[s].x,
                difY = pointDim.y - currLimits[s].y;
            if(axis === 'x' && difX > 0) {
              isSecondImpP = 1;
            } else if(axis === 'y' && difY > 0){
              isSecondImpP = 1;
            }
          }
        }
        //console.log('!!!!!!!!! DIM  isSecondImpP------------', isSecondImpP, pointDim);
        if(axis === 'x') {
          if(currLimits[i].x === pointDim.x) {
            if(currLimits[i-1]) {
              if(isSecondImpP) {
                //----- second impP last
                if(pointDim.id === currLimits[i-1].id) {
                  dimLimit.minL = globalConstants.minSizeLimit;
                } else {
                  dimLimit.minL = GeneralServ.roundingValue( (pointDim.x - currLimits[i-1].x - globalConstants.minSizeLimit), 1 );
                }
              } else {
                dimLimit.minL = globalConstants.minSizeLimit;
              }
            } else {
              dimLimit.minL = globalConstants.minSizeLimit;
            }
            dimLimit.maxL = (currLimits[i+1]) ? GeneralServ.roundingValue( ((pointDim.x - startDim) + (currLimits[i+1].x - pointDim.x - globalConstants.minSizeLimit)), 1 ) : maxSizeLimit;
          }
        } else {
          if(currLimits[i].y === pointDim.y) {
            if(currLimits[i-1]) {
              if(isSecondImpP) {
                //----- second impP last
                if(pointDim.id === currLimits[i-1].id) {
                  dimLimit.minL = globalConstants.minSizeLimit;
                } else {
                  dimLimit.minL = GeneralServ.roundingValue( (pointDim.y - currLimits[i-1].y - globalConstants.minSizeLimit), 1 );
                }
              } else {
                dimLimit.minL = globalConstants.minSizeLimit;
              }
            } else {
              dimLimit.minL = globalConstants.minSizeLimit;
            }
            dimLimit.maxL = (currLimits[i+1]) ? GeneralServ.roundingValue( ((pointDim.y - startDim) + (currLimits[i+1].y - pointDim.y - globalConstants.minSizeLimit)), 1 ) : maxSizeLimit;
          }
        }
      }
      return dimLimit;
    }






    function setNewLimitsInBlock(axis, pointDim, limits) {
      var currLimits = [],
          limitsQty = limits.length,
          lim = 0;
      if(axis === 'x') {
        for(; lim < limitsQty; lim++) {
          if(pointDim.y === limits[lim].y || limits[lim].id.indexOf('fp')+1) {
            currLimits.push(limits[lim]);
          }
        }
        //------ delete dublicates
        cleanDublicat(1, currLimits);
        //---- sorting
        currLimits.sort(sortByX);
      } else {
        for(; lim < limitsQty; lim++) {
          if (pointDim.x === limits[lim].x || limits[lim].id.indexOf('fp')+1) {
            currLimits.push(limits[lim]);
          }
        }
        //------ delete dublicates
        cleanDublicat(2, currLimits);
        //---- sorting
        currLimits.sort(sortByY);
      }
      return currLimits;
    }
















    function checkInsidePointInLineEasy(isInside) {
      var exist = 0;
      if(isInside.x === Infinity || isInside.y === Infinity) {
        exist = 0;
      } else if(isInside.x >= 0 && isInside.x <= 1 && isInside.y >= 0 && isInside.y <= 1) {
        exist = 1;
      } else if(isNaN(isInside.x) && isInside.y >= 0 && isInside.y <= 1) {
        exist = 1;
      } else if(isInside.x >= 0 && isInside.x <= 1  && isNaN(isInside.y)) {
        exist = 1;
      }
      return exist;
    }





    function setRadiusCoordXCurve(pointQ, P0, QP, P1) {
      pointQ.startX = getCoordCurveByT(P0.x, QP.x, P1.x, 0.5);
      pointQ.startY = getCoordCurveByT(P0.y, QP.y, P1.y, 0.5);
      pointQ.lengthChord = GeneralServ.roundingValue( Math.hypot((P1.x - P0.x), (P1.y - P0.y)) );
      pointQ.radius = culcRadiusCurve(pointQ.lengthChord, pointQ.heightQ);
      pointQ.radiusMax = culcRadiusCurve(pointQ.lengthChord, pointQ.lengthChord/4);
      pointQ.radiusMin = culcRadiusCurve(pointQ.lengthChord, globalConstants.minRadiusHeight);
    }


    function culcRadiusCurve(lineLength, heightQ) {
      return Math.round( (heightQ/2 + (lineLength*lineLength)/(8*heightQ)) );
    }



  }
})();



// services/templates_serv.js

(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .factory('TemplatesServ', templatesFactory);

  function templatesFactory($filter, GeneralServ, MainServ, AnalyticsServ, GlobalStor, OrderStor, ProductStor, UserStor) {

    var thisFactory = this;

    thisFactory.publicObj = {
      selectNewTemplate: selectNewTemplate,
      //backDefaultTemplate: backDefaultTemplate,
      //newPriceForNewTemplate: newPriceForNewTemplate,
      initNewTemplateType: initNewTemplateType
    };

    return thisFactory.publicObj;




    //============ methods ================//


    //---------- select new template and recalculate it price
    function selectNewTemplate(templateIndex, roomInd) {
      GlobalStor.global.isTemplateTypeMenu = 0;

      function goToNewTemplate() {
        //------ change last changed template to old one
        backDefaultTemplate();
        GlobalStor.global.isChangedTemplate = 0;
        newPriceForNewTemplate(templateIndex, roomInd);
      }

      if(GlobalStor.global.isChangedTemplate) {
        //----- если выбран новый шаблон после изменения предыдущего
        GeneralServ.confirmAlert(
          $filter('translate')('common_words.NEW_TEMPLATE_TITLE'),
          $filter('translate')('common_words.TEMPLATE_CHANGES_LOST'),
          goToNewTemplate
        );
      } else {
        newPriceForNewTemplate(templateIndex, roomInd);
      }
    }


    //------- return to the initial template
    function backDefaultTemplate() {
      GlobalStor.global.templatesSource[ProductStor.product.template_id] = angular.copy(GlobalStor.global.templatesSourceSTORE[ProductStor.product.template_id]);
    }



    function newPriceForNewTemplate(templateIndex, roomInd) {
      /** if was selected room */
      if(roomInd) {
        MainServ.closeRoomSelectorDialog();
        ProductStor.product.room_id = roomInd-1;
        /** set new Template Group */
        if(ProductStor.product.construction_type !== GlobalStor.global.rooms[roomInd-1].group_id) {
          ProductStor.product.construction_type = GlobalStor.global.rooms[roomInd-1].group_id;
          MainServ.downloadAllTemplates(ProductStor.product.construction_type).then(function(data) {
            if (data) {
              GlobalStor.global.templatesSourceSTORE = angular.copy(data);
              GlobalStor.global.templatesSource = angular.copy(data);

              culcPriceNewTemplate(templateIndex);
            }
          });
        } else {
          culcPriceNewTemplate(templateIndex);
        }

      } else {
        if(ProductStor.product.template_id !== templateIndex) {
          culcPriceNewTemplate(templateIndex);
        }
      }

    }


    function culcPriceNewTemplate(templateIndex) {
      ProductStor.product.template_id = templateIndex;
      MainServ.saveTemplateInProduct(templateIndex).then(function() {
        ProductStor.product.glass.length = 0;
        MainServ.setCurrentGlass(ProductStor.product);
        MainServ.setCurrentHardware(ProductStor.product);
        var hardwareIds = (ProductStor.product.hardware.id) ? ProductStor.product.hardware.id : 0;
        //------ define product price
        MainServ.preparePrice(ProductStor.product.template, ProductStor.product.profile.id, ProductStor.product.glass, hardwareIds, ProductStor.product.lamination.img_in_id);
        //------ save analytics data
        //          AnalyticsServ.saveAnalyticDB(UserStor.userInfo.id, OrderStor.order.id, ProductStor.product.template_id, ProductStor.product.profile.id, 1);
        /** send analytics data to Server*/
        AnalyticsServ.sendAnalyticsData(UserStor.userInfo.id, OrderStor.order.id, ProductStor.product.template_id, ProductStor.product.profile.id, 1);
      });
    }



    function initNewTemplateType(marker) {
      ProductStor.product.construction_type = marker;
      ProductStor.product.template_id = 0;
      MainServ.prepareTemplates(marker);
    }



  }
})();



// storages/auxiliary_stor.js

(function(){
  'use strict';
    /**@ngInject*/
  angular
    .module('MainModule')
    .factory('AuxStor', auxStorageFactory);

  function auxStorageFactory() {

    var thisFactory = this;

    thisFactory.publicObj = {
      auxiliarySource: {
        addElementsType: [],
        addElementsList: [],
        showAddElementsMenu: 0,
        addElementsMenuStyle: 0,
        isFocusedAddElement: 0,
        isAddElement: 0,
        currentAddElementId: 0,
        auxParameter: 0,
        tempSize: [],
        currAddElementPrice: 0,
        isTabFrame: 0,
        isAddElementListView: 0,
        isWindowSchemeDialog: 0,
        isGridSelectorDialog: 0,
        selectedGrid: 0,
        calculatorStyle: '',

        addElementGroups: [],
        searchingWord: ''
      },
      setDefaultAuxiliary: setDefaultAuxiliary
    };

    thisFactory.publicObj.aux = setDefaultAuxiliary();

    return thisFactory.publicObj;


    //============ methods ================//

    function setDefaultAuxiliary() {
      var publicObj = angular.copy(thisFactory.publicObj.auxiliarySource);
      return publicObj;
    }

  }
})();



// storages/cart_stor.js

(function(){
  'use strict';
    /**
     * @ngInject
     */
  angular
    .module('CartModule')
    .factory('CartStor', cartStorageFactory);

  function cartStorageFactory($filter, OrderStor) {

    var thisFactory = this;

    thisFactory.publicObj = {
      cartSource: {
        allAddElements: [],
        isShowDiscount: 0,
        tempConstructDisc: 0,
        tempAddelemDisc: 0,
        discountPriceDiff: 0,
        discountDeliveyPlant: 0,
        marginDeliveyPlant: 0,
        squareTotal: 0,
        perimeterTotal: 0,
        qtyTotal: 0,

        isExistAddElems: 0,
        isAllAddElems: 0,
        allAddElemsOrder: [],
        addElemsOrderPriceTOTAL: 0,
        isSelectedProduct: 0,
        selectedProducts: [],

        isMasterDialog: 0,
        isOrderDialog: 0,
        isCreditDialog: 0,
        submitted: 0,
        isCityBox: 0,
        customer: {
          customer_sex: 0 //1-m, 2-f
        }
      },

      //------- data x order dialogs
      optionAge: [
        {id: 1, name: '20-30'},
        {id: 2, name: '31-40'},
        {id: 3, name: '41-50'},
        {id: 4, name: '51-60'},
        {id: 5, name: $filter('translate')('cart.CLIENT_AGE_OLDER') +' 61'}
      ],
      optionEductaion: [
        {id: 1, name: $filter('translate')('cart.CLIENT_EDUC_MIDLE')},
        {id: 2, name: $filter('translate')('cart.CLIENT_EDUC_SPEC')},
        {id: 3, name: $filter('translate')('cart.CLIENT_EDUC_HIGH')},
        {id: 4, name: $filter('translate')('cart.CLIENT_EDUC_4')}
      ],
      optionOccupation: [
        {id: 1, name: $filter('translate')('cart.CLIENT_OCCUP_WORKER')},
        {id: 2, name: $filter('translate')('cart.CLIENT_OCCUP_HOUSE')},
        {id: 3, name: $filter('translate')('cart.CLIENT_OCCUP_BOSS')},
        {id: 4, name: $filter('translate')('cart.CLIENT_OCCUP_STUD')},
        {id: 5, name: $filter('translate')('cart.CLIENT_OCCUP_PENSION')},
        {id: 6, name: $filter('translate')('cart.UNKNOWN')}
      ],
      optionInfo: [
        {id: 1, name: 'TV'},
        {id: 2, name: 'InterNET'},
        {id: 3, name: $filter('translate')('cart.CLIENT_INFO_PRESS')},
        {id: 4, name: $filter('translate')('cart.CLIENT_INFO_FRIEND')},
        {id: 5, name: $filter('translate')('cart.CLIENT_INFO_ADV')}
      ],

      setDefaultCart: setDefaultCart,
      fillOrderForm: fillOrderForm
    };


    thisFactory.publicObj.cart = setDefaultCart();

    return thisFactory.publicObj;


    //============ methods ================//

    function setDefaultCart() {
      var publicObj = angular.copy(thisFactory.publicObj.cartSource);
      return publicObj;
    }

    //------- filling order form
    function fillOrderForm() {
      thisFactory.publicObj.cart.customer.customer_name = angular.copy(OrderStor.order.customer_name);
      thisFactory.publicObj.cart.customer.customer_location = angular.copy(OrderStor.order.customer_location);
      thisFactory.publicObj.cart.customer.customer_address = angular.copy(OrderStor.order.customer_address);
      thisFactory.publicObj.cart.customer.customer_city = angular.copy(OrderStor.order.customer_city);
      thisFactory.publicObj.cart.customer.customer_city_id = angular.copy(OrderStor.order.customer_city_id);
      thisFactory.publicObj.cart.customer.customer_email = angular.copy(OrderStor.order.customer_email);
      thisFactory.publicObj.cart.customer.customer_phone = angular.copy(OrderStor.order.customer_phone);
      thisFactory.publicObj.cart.customer.customer_phone_city = angular.copy(OrderStor.order.customer_phone_city);
      thisFactory.publicObj.cart.customer.customer_itn = angular.copy(OrderStor.order.customer_itn);
      thisFactory.publicObj.cart.customer.customer_starttime = angular.copy(OrderStor.order.customer_starttime);
      thisFactory.publicObj.cart.customer.customer_endtime = angular.copy(OrderStor.order.customer_endtime);
      thisFactory.publicObj.cart.customer.customer_target = angular.copy(OrderStor.order.customer_target);
      thisFactory.publicObj.cart.customer.customer_sex = angular.copy(OrderStor.order.customer_sex);
      thisFactory.publicObj.cart.customer.customer_age = angular.copy(OrderStor.order.customer_age);
      thisFactory.publicObj.cart.customer.customer_education = angular.copy(OrderStor.order.customer_education);
      thisFactory.publicObj.cart.customer.customer_occupation = angular.copy(OrderStor.order.customer_occupation);
      thisFactory.publicObj.cart.customer.customer_infoSource = angular.copy(OrderStor.order.customer_infoSource);
    }

  }
})();



// storages/design_stor.js

(function(){
  'use strict';
    /**
     * @ngInject
     */
  angular
    .module('DesignModule')
    .factory('DesignStor', designStorageFactory);

  function designStorageFactory($filter) {

    var thisFactory = this;

    thisFactory.publicObj = {
      designSource: {
        templateSourceTEMP: {},
        templateTEMP: {},
        designSteps: [],
        activeMenuItem: 0,
        activeSubMenuItem: 0,
        isDropSubMenu: 0,
        isImpostDelete: 0,
        //----- Edit
        selectedGlass: [],
        selectedCorner: [],
        selectedImpost: [],
        selectedArc: [],
        //----- Sizes
        openVoiceHelper: false,
        loudVoice: false,
        quietVoice: false,
        voiceTxt: '',
        selectedGlassId: 0,

        isDimAnimate: 0,
        oldSize: 0,
        tempSize: [],

        isMinSizeRestriction: 0,
        isMaxSizeRestriction: 0,
        minSizeLimit: 200,
        maxSizeLimit: 5000,

        //----- Door
        doorShapeList: [
          {
            shapeId: 1,
            shapeLabel: $filter('translate')('panels.DOOR_TYPE1'),
            shapeIcon: 'img/door-config/doorstep.png',
            shapeIconSelect: 'img/door-config-selected/doorstep.png'
          },
          {
            shapeId: 2,
            shapeLabel: $filter('translate')('panels.DOOR_TYPE2'),
            shapeIcon: 'img/door-config/no-doorstep.png',
            shapeIconSelect: 'img/door-config-selected/no-doorstep.png'
          },
          {
            shapeId: 3,
            shapeLabel: $filter('translate')('panels.DOOR_TYPE3') + '1',
            shapeIcon: 'img/door-config/doorstep-al1.png',
            shapeIconSelect: 'img/door-config-selected/doorstep-al1.png'
          },
          {
            shapeId: 4,
            shapeLabel: $filter('translate')('panels.DOOR_TYPE3')+ '2',
            shapeIcon: 'img/door-config/doorstep-al2.png',
            shapeIconSelect: 'img/door-config-selected/doorstep-al2.png'
          }
        ],
        sashShapeList: [
          {
            shapeId: 1,
            shapeLabel: $filter('translate')('panels.SASH_TYPE1') + ', 98' + $filter('translate')('mainpage.MM')
          },
          {
            shapeId: 2,
            shapeLabel: $filter('translate')('panels.SASH_TYPE2') + ', 116' + $filter('translate')('mainpage.MM')
          },
          {
            shapeId: 3,
            shapeLabel: $filter('translate')('panels.SASH_TYPE3') +', 76' + $filter('translate')('mainpage.MM')
          }
        ],
        handleShapeList: [
          {
            shapeId: 1,
            shapeLabel: $filter('translate')('panels.HANDLE_TYPE1'),
            shapeIcon: 'img/door-config/lever-handle.png',
            shapeIconSelect: 'img/door-config-selected/lever-handle.png'
          },
          {
            shapeId: 2,
            shapeLabel: $filter('translate')('panels.HANDLE_TYPE2'),
            shapeIcon: 'img/door-config/standart-handle.png',
            shapeIconSelect: 'img/door-config-selected/standart-handle.png'
          }
        ],
        lockShapeList: [
          {
            shapeId: 1,
            shapeLabel: $filter('translate')('panels.LOCK_TYPE1'),
            shapeIcon: 'img/door-config/onelock.png',
            shapeIconSelect: 'img/door-config-selected/onelock.png'
          },
          {
            shapeId: 2,
            shapeLabel: $filter('translate')('panels.LOCK_TYPE2'),
            shapeIcon: 'img/door-config/multilock.png',
            shapeIconSelect: 'img/door-config-selected/multilock.png'
          }
        ],
        doorConfig: {
          doorShapeIndex: 0,
          sashShapeIndex: 0,
          handleShapeIndex: 0,
          lockShapeIndex: 0
        }

      },

      setDefaultDesign: setDefaultDesign,
      setDefaultDoor: setDefaultDoor
    };

    thisFactory.publicObj.design = setDefaultDesign();
    return thisFactory.publicObj;


    //============ methods ================//


    function setDefaultDesign() {
      var publicObj = angular.copy(thisFactory.publicObj.designSource);
      return publicObj;
    }

    function setDefaultDoor() {
      var publicObj = angular.copy(thisFactory.publicObj.designSource.doorConfig);
      return publicObj;
    }

  }
})();



// storages/global_stor.js

(function(){
  'use strict';
    /**@ngInject*/
  angular
    .module('BauVoiceApp')
    .factory('GlobalStor', globalStorageFactory);

  function globalStorageFactory() {

    var thisFactory = this;

    thisFactory.publicObj = {

      globalSource: {
        isDevice: 0,
        isLoader: 0,
        startProgramm: 1, // for START
        //------ navigation
        isNavMenu: 1,
        isConfigMenu: 0,
        activePanel: 0,
        configMenuTips: 0,
        isTemplateItemMenu: 0,
        isTemplateItemDesign: 1,
        isCreatedNewProject: 1,
        isCreatedNewProduct: 1,
        productEditNumber: 0,
        orderEditNumber: 0,

        prevOpenPage: '',
        currOpenPage: 'main',

        isChangedTemplate: 0,
        isVoiceHelper: 0,
        voiceHelperLanguage: '', 
        showGlassSelectorDialog: 0,
        isShowCommentBlock: 0,
        isTemplateTypeMenu: 0,
        
        //------ Rooms background
        showRoomSelectorDialog: 0,
        

        //------- Templates
        templateLabel: '',
        templatesSource: [],
        templatesSourceSTORE: [],
        //TODO templateIcons: [],
        isSashesInTemplate: 0,

        //------ Profiles
        profiles: [],
        profilesType: [],

        //------- Glasses
        glassesAll: [],
        glassTypes: [],
        glasses: [],
        selectLastGlassId: 0,

        //------ Hardwares
        hardwares: [],
        hardwareTypes: [],

        //------ Lamination
        laminats: [],
        laminatCouples: [],

        lamGroupFiltered: [],


        //------ Add Elements
        addElementsAll: [],
        tempAddElements: [],

        //------ Cart
        supplyData: [],
        assemblingData: [],
        instalmentsData: [],

        //------ Info
        isInfoBox: 0,
        infoTitle: '',
        infoImg: '',
        infoLink: '',
        infoDescrip: '',

        //---- report
        isReport: 0,

        currencies: [],
        locations: {
          countries: [],
          regions: [],
          cities: []
        },
        margins: {},
        deliveryCoeff: {},

        //----- Alert
        isAlert: 0,
        alertTitle: '',
        alertDescr: '',
        confirmAction: 0,

        //---- Calculators
        isQtyCalculator: 0,
        isSizeCalculator: 0,
        isWidthCalculator: 0
      },

      setDefaultGlobal: setDefaultGlobal
    };

    thisFactory.publicObj.global = setDefaultGlobal();

    return thisFactory.publicObj;


    //============ methods ================//

    function setDefaultGlobal() {
      var publicObj = angular.copy(thisFactory.publicObj.globalSource);
      return publicObj;
    }


  }
})();



// storages/history_stor.js

(function(){
  'use strict';
    /**
     * @ngInject
     */
  angular
    .module('HistoryModule')
    .factory('HistoryStor', historyStorageFactory);

  function historyStorageFactory() {

    var thisFactory = this;

    thisFactory.publicObj = {
      historySource: {
        //===== Order
        orders: [],
        ordersSource: [],
        isEmptyResult: 0,
        //--- Tools
        isOrderSearch: 0,
        searchingWord: '',

        isOrderDate: 0,
        startDate: '',
        finishDate: '',
        isStartDate: 0,
        isFinishDate: 0,
        isAllPeriod: 1,
//        maxDeliveryDateOrder: 0,

        isOrderSort: 0,
        isSortType: 'last',
        isFilterType: undefined,

        //===== Draft
        isDraftView: 0,
        drafts: [],
        draftsSource: [],
        isEmptyResultDraft: 0,
        //--- Tools
        isOrderDateDraft: 0,
        startDateDraft: '',
        finishDateDraft: '',
        isStartDateDraft: 0,
        isFinishDateDraft: 0,
        isAllPeriodDraft: 1,

        isOrderSortDraft: 0,
        isSortTypeDraft: 'last',
        reverseDraft: 1
      },
      setDefaultHistory: setDefaultHistory
    };

    thisFactory.publicObj.history = setDefaultHistory();

    return thisFactory.publicObj;


    //============ methods ================//

    function setDefaultHistory() {
      var publicObj = angular.copy(thisFactory.publicObj.historySource);
      return publicObj;
    }

  }
})();



// storages/order_stor.js

(function(){
  'use strict';
    /**
     * @ngInject
     */
  angular
    .module('BauVoiceApp')
    .factory('OrderStor', orderStorageFactory);

  function orderStorageFactory() {
    var thisFactory = this;


    thisFactory.publicObj = {
      orderSource: {
        id: 0,
        order_number: 0,
        order_hz: '---',
        order_type: 1, // 0 - draft
        order_date: 0,
        order_style: '',

        climatic_zone: 0,
        heat_coef_min: 0,

        discount_construct: 0,
        discount_addelem: 0,
        discount_construct_max: 0,
        discount_addelem_max: 0,
        delivery_user_id: 0,
        mounting_user_id: 0,
        default_term_plant: 0,
        disc_term_plant: 0,
        margin_plant: 0,

        products_qty: 0,
        products: [],
        templates_price: 0,
        addelems_price: 0,
        products_price: 0,
        productsPriceDis: 0,

        delivery_date: 0,
        new_delivery_date: 0,
        delivery_price: 0,
        is_date_price_less: 0,
        is_date_price_more: 0,

        floor_id: 0,
        floorName: '',
        floor_price: 0,
        mounting_id: 0,
        mountingName: '',
        mounting_price: 0,
        is_instalment: 0,
        instalment_id: 0,
        selectedInstalmentPeriod: 0,
        selectedInstalmentPercent: 0,

        is_old_price: 0,
        payment_first: 0,
        payment_monthly: 0,
        payment_first_primary: 0,
        payment_monthly_primary: 0,
        paymentFirstDis: 0,
        paymentMonthlyDis: 0,
        paymentFirstPrimaryDis: 0,
        paymentMonthlyPrimaryDis: 0,

        order_price: 0,
        order_price_dis: 0,
        order_price_primary: 0,
        orderPricePrimaryDis: 0,

        customer_name: '',
        customer_email: '',
        customer_phone: '',
        customer_phone_city: '',
        customer_address: '',
        customer_location: '',
        customer_city: '',
        customer_city_id: 0,
        customer_itn: 0,
        customer_starttime: '',
        customer_endtime: '',
        customer_target: '',
        customer_sex: 0,
        customer_age: 0,
        customer_education: 0,
        customer_occupation: 0,
        customer_infoSource: 0
      },

      setDefaultOrder: setDefaultOrder
    };

    thisFactory.publicObj.order = setDefaultOrder();

    return thisFactory.publicObj;


    //============ methods ================//

    function setDefaultOrder() {
      var publicObj = angular.copy(thisFactory.publicObj.orderSource);
      return publicObj;
    }

  }
})();



// storages/product_stor.js

 (function(){
  'use strict';
    /**@ngInject*/
  angular
    .module('BauVoiceApp')
    .factory('ProductStor', productStorageFactory);

  function productStorageFactory($filter) {
    var thisFactory = this;

    thisFactory.publicObj = { 
      productSource: {
        product_id: 0,
        is_addelem_only: 0,
        room_id: 0,
        construction_type: 1, // 1 - window; 2 - windowDoor; 3 - balcony; 4 - door
        heat_coef_total: 0,

        template_id: 0,
        template_source: {},
        template: {},
        templateIcon: {},
        template_width: 0,
        template_height: 0,
        template_square: 0,

        profile: {},
        glass: [],
        hardware: {},

        profileDepths: {
          frameDepth: {},
          frameStillDepth: {},
          sashDepth: {},
          impostDepth: {},
          shtulpDepth: {}
        },
        lamination: {
          id: 0,
          lamination_in_id: 1,
          lamination_out_id: 1,
          laminat_in_name: $filter('translate')('mainpage.WHITE_LAMINATION'),
          laminat_out_name: $filter('translate')('mainpage.WHITE_LAMINATION'),
          img_in_id: 1,
          img_out_id: 1
        },

        chosenAddElements: [
          [], // 0 - grids
          [], // 1 - visors
          [], // 2 - spillways
          [], // 3 - outSlope
          [], // 4 - louvers
          [], // 5 - inSlope
          [], // 6 - connectors
          [], // 7 - fans
          [], // 8 - windowSill
          [], // 9 - handles
          [] // 10 - others
        ],

        door_shape_id: 1,
        door_sash_shape_id: 1,
        door_handle_shape_id: 1,
        door_lock_shape_id: 1,

        template_price: 0,
        addelem_price: 0,
        addelemPriceDis: 0,
        product_price: 0,
        productPriceDis: 0,

        report: [],
        comment: '',
        product_qty: 1

      },

      setDefaultProduct: setDefaultProduct
    };

    thisFactory.publicObj.product = setDefaultProduct();

    return thisFactory.publicObj;


    //============ methods ================//

    function setDefaultProduct() {
      var publicObj = angular.copy(thisFactory.publicObj.productSource);
      return publicObj;
    }

  }
})();



// storages/user_stor.js

(function(){
  'use strict';
    /**
     * @ngInject
     */
  angular
    .module('BauVoiceApp')
    .factory('UserStor', userStorageFactory);

  function userStorageFactory() {

    var thisFactory = this;

    thisFactory.publicObj = {
      userInfoSource: {
        cityName: '',
        regionName: '',
        countryName: '',
        fullLocation: '',
        climaticZone: 0,
        heatTransfer: 0,
        langLabel: 'en',
        langName: 'English',
        currencyId: 0,
        currency: '',
        discountConstr: 0,
        discountAddElem: 0,
        discountConstrMax: 0,
        discountAddElemMax: 0,
        discConstrByWeek: [],
        discAddElemByWeek: [],
        factoryLink: ''
      },
      setDefaultUser: setDefaultUser
    };

    thisFactory.publicObj.userInfo = setDefaultUser();

    return thisFactory.publicObj;


    //============ methods ================//

    function setDefaultUser() {
      var publicObj = angular.copy(thisFactory.publicObj.userInfoSource);
      return publicObj;
    }

  }
})();



// translations/de.js

(function(){
  'use strict';

  angular
    .module('BauVoiceApp')
    .constant('germanDictionary', {

      common_words: {
        CHANGE: 'untreu sein',
        MONTHS: 'Januar, Februar, März, April, Mai, Juni, Juli, August, September, Oktober, November, Dezember',
        MONTHS_SHOT: 'Jan, Feb, Mär, Apr, Mai, Jun, Jul, Aug, Sep, Okt, Nov, Dez',
        MONTHA: 'Januar, Februar, März, April, Mai, Juni, Juli, August, September, Oktober, November, Dezember',
        MONTH_LABEL: 'Monat',
        MONTHA_LABEL: 'Monats',
        MONTHS_LABEL: 'Monate',
        ALL: 'alles',
        MIN: 'min.',
        MAX: 'maks.',
        //----- confirm dialogs
        BUTTON_Y: 'JA',
        BUTTON_N: 'NEIN',
        DELETE_PRODUCT_TITLE: 'Die Entfernung!',
        DELETE_PRODUCT_TXT: 'Sie wollen das Produkt entfernen?',
        DELETE_ORDER_TITLE: 'Die Entfernung der Bestellung!',
        DELETE_ORDER_TXT: 'Sie wollen die Bestellung entfernen?',
        COPY_ORDER_TITLE: 'Das Kopieren!',
        COPY_ORDER_TXT: 'Sie wollen der Bestellung kopieren?',
        SEND_ORDER_TITLE: 'In die Produktion!',
        SEND_ORDER_TXT: 'Sie wollen die Bestellung auf den Betrieb absenden?',
        NEW_TEMPLATE_TITLE: 'Template-Wechsel',
        TEMPLATE_CHANGES_LOST: 'Die Template-Änderungen gehen verloren! Fortfahren?',
        PAGE_REFRESH: 'Das Neuladen der Seite zu Datenverlust führen!',
        SELECT: 'wählen',
        AND: 'und',
        OK: 'OK',
        BACK: 'Back',
        LETTER_M: 'm'
      },
      login: {
        ENTER: 'Einloggen',
        PASS_CODE: 'Teilen Sie diesen Kode dem Manager mit.',
        YOUR_CODE: 'Ihr Kode: ',
        EMPTY_FIELD: 'Füllen Sie dieses Feld aus.',
        WRONG_NUMBER: 'Die falsche Nummer.',
        SHORT_NAME: 'Eine zu kurze Namen',
        SHORT_PASSWORD: 'Die viel zu kleine Parole',
        SHORT_PHONE: 'Zu wenig Telefonnummer.',
        IMPORT_DB_START: 'Warten begann Laden der Datenbank',
        IMPORT_DB_FINISH: 'Vielen Dank für das Herunterladen abgeschlossen ist',
        MOBILE: 'Handy',
        PASSWORD: 'Passwort',
        REGISTRATION: 'Anmeldung',
        SELECT_COUNTRY: 'Land wählen',
        SELECT_REGION: 'Region wählen',
        SELECT_CITY: 'Wählen Sie die Stadt',
        USER_EXIST: 'Dieser Benutzer ist bereits vorhanden! Versuchen Sie es erneut.',
        USER_NOT_EXIST: 'Ein solcher Benutzer nicht existiert. Registrieren.',
        USER_NOT_ACTIVE: 'Sie haben Ihr Profil aktiviert. Überprüfen Sie Ihre E-Mail.',
        USER_CHECK_EMAIL: 'Bestätigungsemail wurde Ihnen in der E-Mail gesendet.',
        SELECT_PRODUCER: 'Hersteller auswählen',
        SELECT_FACTORY: 'Sie haben noch keine gewählten Hersteller',
        USER_PASSWORD_ERROR: 'ungültiges Kennwort!',
        OFFLINE: 'Keine Verbindung zum Internet!',
        IMPORT_DB: 'Databases JETZT HERUNTERLADEN! Warten Sie mal!'
      },
      mainpage: {
        MM: ' mm ',
        CLIMATE_ZONE: 'Die Klimazone',
        THERMAL_RESISTANCE: 'Wärmeübertragung',
        AIR_CIRCULATION: 'Der Koeffizient des Luftwechsels',
        NAVMENU_GEOLOCATION: 'Die Anordnung zu wählen',
        NAVMENU_CURRENT_GEOLOCATION: 'Die laufende Anordnung',
        NAVMENU_CURRENT_CALCULATION: 'Die laufende Berechnung',
        NAVMENU_CART: 'Der Korb der Berechnung',
        NAVMENU_ADD_ELEMENTS: 'Die zusätzlichen Elemente',
        NAVMENU_ALL_CALCULATIONS: 'Bestellverlauf',
        NAVMENU_SETTINGS: 'Einstellungen',
        NAVMENU_MORE_INFO: 'Es gibt als mehrere Informationen',
        NAVMENU_VOICE_HELPER: 'Der Stimmverwaltung',
        NAVMENU_CALCULATIONS: 'Die Berechnungen',
        NAVMENU_APPENDIX: 'Anwendung',
        NAVMENU_NEW_CALC: '+Neue Berechnungs',
        CONFIGMENU_CONFIGURATION: 'Die Konfiguration und die Umfänge',
        CONFIGMENU_SIZING: 'Die Breite * die Höhe',
        CONFIGMENU_PROFILE: 'Profil',
        CONFIGMENU_GLASS: 'Bauglasplatte',
        CONFIGMENU_HARDWARE: 'Zubehör',
        CONFIGMENU_LAMINATION: 'Laminierung',
        CONFIGMENU_LAMINATION_TYPE: 'in den Zimmer / Die Fassade',
        WHITE_LAMINATION: 'Weiß',
        CONFIGMENU_ADDITIONAL: 'Zusätzlich',
        CONFIGMENU_IN_CART: 'Zum Warenkorb',
        VOICE_SPEACH: 'Sprechen...',
        COMMENT: 'Lassen Sie eine Notiz in der Größenordnung hier.',
        ROOM_SELECTION1: 'Fenster',
        ROOM_SELECTION2: 'Dekoration',
        ROOM_SELECTION3: 'Die Wahl Template',
        CONFIGMENU_NO_ADDELEMENTS: 'Zusätzliche Elemente ausgewählt',
        HEATCOEF_VAL: 'W',
        TEMPLATE_TIP: 'Um die Größe zu ändern, klicken Sie hier',
        PROFILE_TIP: 'Um ein Profil auszuwählen, klicken Sie hier',
        GLASS_TIP: 'Um eine doppelt verglasten Fenster auszuwählen, klicken Sie hier',
        SELECT_ALL: 'Alle auswählen',
        SELECT_GLASS_WARN: 'Klicken Sie auf die Verglasung zu ändern, Sie wollen'
      },
      panels: {
        TEMPLATE_WINDOW: 'Fenster',
        TEMPLATE_BALCONY: 'Altan',
        TEMPLATE_DOOR: 'Tür',
        TEMPLATE_BALCONY_ENTER: 'Der Ausgang auf den Balkon',
        TEMPLATE_EDIT: 'Editieren',
        TEMPLATE_DEFAULT: 'Das Projekt als Voreinstellung',
        COUNTRY: 'Land',
        BRAND: 'Das Warenzeichen',
        HEAT_INSULATION: 'warm Isolation',
        NOICE_INSULATION: 'Isolierung',
        CORROSION_COEFF: 'Korrosionsschutz',
        BURGLAR_COEFF: 'Diebstahlschutz',
        LAMINAT_INSIDE: 'im Raum',
        LAMINAT_OUTSIDE: 'Straßenfront',
        ONE_WINDOW_TYPE: 'Das Einaufklappbare',
        TWO_WINDOW_TYPE: 'Das Zweiaufklappbare',
        THREE_WINDOW_TYPE: 'Das Dreiaufklappbare',
        CAMERa: 'Kameras',
        CAMER: 'Kameras',
        CAMERs: 'Kameras',
        ENERGY_SAVE: '+Energiesparen',
        DOOR_TYPE1: 'Nach dem Perimeter',
        DOOR_TYPE2: 'Ohne Schwelle',
        DOOR_TYPE3: 'Die Aluminiumschwelle, Typ',
        SASH_TYPE1: 'Interzimmer',
        SASH_TYPE2: 'Tür- t-bildlich',
        SASH_TYPE3: 'Fenster',
        HANDLE_TYPE1: 'Druck- die Garnitur',
        HANDLE_TYPE2: 'Der standardmäßige Bürogriff',
        LOCK_TYPE1: 'One-Stop-Verriegelung',
        LOCK_TYPE2: 'Multipoint-Latch'
      },
      add_elements: {
        CHOOSE: 'Wählen',
        ADD: 'drauflegen',
        GRID: 'Moskitonetz',
        VISOR: 'Deflektor',
        SPILLWAY: 'Entwässerungsanlage',
        OUTSIDE: 'Außen Pisten',
        LOUVERS: 'Jalousie',
        INSIDE: 'Innen Pisten',
        CONNECTORS: 'Zwischenstepsel',
        FAN: 'Mikroventilation',
        WINDOWSILL: 'Fensterbank',
        HANDLEL: 'Griff',
        OTHERS: 'Übrige',
        GRIDS: 'Moskitonetze',
        VISORS: 'Visiere',
        SPILLWAYS: 'Entwässerungsanlagen',
        WINDOWSILLS: 'Fensterbänke',
        HANDLELS: 'Griff',
        NAME_LABEL: 'Benennung',
        ARTICUL_LABEL: 'Nachschlagewerke',
        QTY_LABEL: 'pcs',
        SIZE_LABEL: 'Größe',
        WIDTH_LABEL: 'Breite',
        HEIGHT_LABEL: 'Höhe',
        OTHER_ELEMENTS1: 'Noch',
        OTHER_ELEMENTS2: 'Komponente ...',
        SCHEME_VIEW: 'Schematisch',
        LIST_VIEW: 'Liste',
        INPUT_ADD_ELEMENT: 'Komponente hinzufügen',
        CANCEL: 'Stornierung',
        TOTAL_PRICE_TXT: 'Gesamte zusätzliche Komponenten in der Menge von:',
        ELEMENTS: 'Komponenten',
        ELEMENT: 'Komponente',
        ELEMENTA: 'Komponente'
      },
      add_elements_menu: {
        TIP: 'Wählen Sie ein Element aus der Liste',
        EMPTY_ELEMENT: 'Ohne das Element',
        TAB_NAME_SIMPLE_FRAME: 'Einfacher Aufbau',
        TAB_NAME_HARD_FRAME: 'Verbundstruktur',
        TAB_EMPTY_EXPLAIN: 'Wählen Sie den Anfangspunkt zu starten Bau.'
      },
      construction: {
        SASH_SHAPE: 'Flügel',
        ANGEL_SHAPE: 'Winkel',
        IMPOST_SHAPE: 'Abgaben',
        ARCH_SHAPE: 'Gewölbe',
        POSITION_SHAPE: 'Position',
        UNITS_DESCRIP: 'Da die Einheiten in mm',
        PROJECT_DEFAULT: 'Standardprojekt',
        DOOR_CONFIG_LABEL: 'Anordnung der Türen',
        DOOR_CONFIG_DESCTIPT: 'Türrahmen',
        SASH_CONFIG_DESCTIPT: 'Torblatt',
        HANDLE_CONFIG_DESCTIPT: 'Griff',
        LOCK_CONFIG_DESCTIPT: 'Verschluss',
        STEP: 'Schritt',
        LABEL_DOOR_TYPE: 'Wählen Sie ein Design Türrahmen',
        LABEL_SASH_TYPE: 'Wählen Sie die Art des Türblattes',
        LABEL_HANDLE_TYPE: 'Wählen Sie die Art der Griff',
        LABEL_LOCK_TYPE: 'Wählen Sie die Art der Sperre',
        VOICE_SWITCH_ON: "Voice-Modus aktiviert ist",
        VOICE_NOT_UNDERSTAND: 'es ist nicht klar',
        VOICE_SMALLEST_SIZE: 'zu klein',
        VOICE_BIGGEST_SIZE: "zu groß",
        VOICE_SMALL_GLASS_BLOCK: "zu kleine Oberlichter",
        NOT_AVAILABLE: 'nicht Verfügbar!'
      },
      history: {
        SEARCH_PLACEHOLDER: 'Suche nach Stichwort',
        DRAFT_VIEW: 'Entwürfe Berechnungen',
        HISTORY_VIEW: 'Siedlungsgeschichte',
        PHONE: 'Telefon',
        CLIENT: 'Der Kunde',
        ADDRESS: 'Anschrift',
        FROM: 'von ',
        UNTIL: 'vor ',
        PAYMENTS: 'Zahlungen',
        ALLPRODUCTS: 'Produkte',
        ON: 'bis',
        DRAFT: 'Entwurf',
        DATE_RANGE: 'Datumsbereich',
        ALL_TIME: 'Die ganze Zeit',
        SORTING: 'Sortierung',
        NEWEST_FIRST: 'Mit der Zeit: neue zuerst',
        NEWEST_LAST: 'Zu der Zeit, neue am Ende',
        SORT_BY_TYPE: 'Nach Art',
        SORT_SHOW: 'Show',
        SORT_SHOW_ACTIVE: 'Nur aktiv',
        SORT_SHOW_WAIT: 'Nur angemeldete',
        SORT_SHOW_DONE: 'nur abgeschlossen',
        BY_YOUR_REQUEST: 'Je nach Wunsch',
        NOT_FIND: 'nichts gefunden',
        WAIT_MASTER: 'erwartet Gager',
        INCLUDED: 'inbegriffen'
      },
      cart: {
        ALL_ADD_ELEMENTS: 'Alle Anbauteile bestellen',
        ADD_ORDER: 'Fügen Sie das Produkt',
        PRODUCT_QTY: 'Anzahl der Produkte',
        LIGHT_VIEW: 'Kurzansicht',
        FULL_VIEW: 'Vollansicht',
        DELIVERY: 'Lieferung',
        SELF_EXPORT: 'Abholen',
        FLOOR: 'Etage',
        ASSEMBLING: 'Montage',
        WITHOUT_ASSEMBLING: 'ohne Montage',
        FREE: 'kostenlos',
        PAYMENT_BY_INSTALMENTS: 'Ratenzahlung',
        WITHOUT_INSTALMENTS: 'losen Raten',
        DELIVERY_DATE: 'Liefertermin',
        TOTAL_PRICE_LABEL: 'Insgesamt Lieferung auf',
        MONTHLY_PAYMENT_LABEL: 'monatlichen Zahlungen auf',
        DATE_DELIVERY_LABEL: 'Geliefert auf',
        FIRST_PAYMENT_LABEL: 'Die erste Zahlung',
        ORDER: 'Bestellen',
        MEASURE: 'Maßnahme',
        READY: 'Bereit',
        CALL_MASTER: 'Rufen Gager zu berechnen',
        CALL_MASTER_DESCRIP: 'Um Gager nennen wir brauchen etwas für Sie zu wissen. Beide Felder sind Pflichtfelder.',
        CLIENT_LOCATION: 'Lage',
        CLIENT_ADDRESS: 'Anschrift',
        CALL_ORDER: 'Bestellung zur Berechnung',
        CALL_ORDER_DESCRIP: 'Um den Auftrag zu erfüllen, müssen wir etwas über Sie wissen.',
        CALL_ORDER_CLIENT_INFO: 'Kundeninformation (muss ausgefüllt werden):',
        CLIENT_NAME: 'Vollständiger Name',
        CALL_ORDER_DELIVERY: 'Liefern Sie eine Bestellung für',
        CALL_ORDER_TOTAL_PRICE: 'insgesamt',
        CALL_ORDER_ADD_INFO: 'Extras (optional):',
        CLIENT_EMAIL: 'E-Mail',
        ADD_PHONE: 'Zusätzliche Telefon',
        CALL_CREDIT: 'Machen Tranche und um zu berechnen',
        CALL_CREDIT_DESCRIP: 'Um Raten anordnen und erfüllen den Auftrag, wir haben etwas für Sie zu wissen.',
        CALL_CREDIT_CLIENT_INFO: 'Ratenzahlung:',
        CREDIT_TARGET: 'Der Zweck der Registrierung von Raten',
        CLIENT_ITN: 'Individuelle Steuernummers',
        CALL_START_TIME: 'Rufen Sie aus:',
        CALL_END_TIME: 'vor:',
        CALL_CREDIT_PARTIAL_PRICE: 'auf',
        ADDELEMENTS_EDIT_LIST: 'Liste bearbeiten ...',
        ADDELEMENTS_PRODUCT_COST: 'einem Produkt',
        HEAT_TRANSFER: 'Wärmeübertragung',
        WRONG_EMAIL: 'Falsche E-Mail',
        LINK_BETWEEN_COUPLE: 'zwischen einem Paar von',
        LINK_BETWEEN_ALL: 'unter allen',
//        LINK_DELETE_ALL_GROUPE: 'unter allen',
        CLIENT_SEX: 'Paul',
        CLIENT_SEX_M: 'M',
        CLIENT_SEX_F: 'F',
        CLIENT_AGE: 'Alter',
        CLIENT_AGE_OLDER: "älteren",
        //CLIENT_EDUCATION: 'Bildung',
        //CLIENT_EDUC_MIDLE: "Durchschnitt",
        //CLIENT_EDUC_SPEC: "die durchschnittliche professionell.",
        //CLIENT_EDUC_HIGH: "Higher",
        CLIENT_EDUCATION: "Das wichtigste Kriterium Ihrer Wahl",
        CLIENT_EDUC_MIDLE: "Guter Preis",
        CLIENT_EDUC_SPEC: "Bildermacher",
        CLIENT_EDUC_HIGH: "Markenprofil und Hardware",
        CLIENT_EDUC_4: 'Empfehlungen Verkäufers',
        CLIENT_OCCUPATION: "Beschäftigung",
        CLIENT_OCCUP_WORKER: "Mitarbeiter",
        CLIENT_OCCUP_HOUSE: "Hausfrau",
        CLIENT_OCCUP_BOSS: "Entrepreneur",
        CLIENT_OCCUP_STUD: 'Student',
        CLIENT_OCCUP_PENSION: 'Retired',
        CLIENT_INFO_SOURCE: 'Source',
        CLIENT_INFO_PRESS: 'Press',
        CLIENT_INFO_FRIEND: "Von Freunden",
        CLIENT_INFO_ADV: "Visuelle Werbung",
        SELECT_PLACEHOLD: 'wählen Sie Ihre Variante',
        //SELECT_AGE: "Wählen Sie Ihr Alter",
        //SELECT_ADUCATION: "Wählen Sie Ihre Bildung",
        //SELECT_OCCUPATION: "Wählen Sie Ihre Beschäftigung",
        //SELECT_INFO_SOURCE: "Quelle wählen",
        NO_DISASSEMBL: 'Ohne Demontage',
        STANDART_ASSEMBL: 'Der Standardmäßige',
        VIP_ASSEMBL: 'Der VIP-Montage',
        DISCOUNT: 'Rabatt',
        DISCOUNT_SELECT: 'Die Auswahl der Preisnachlässe',
        DISCOUNT_WITH: 'Im Hinblick auf die Preisnachlässe',
        DISCOUNT_WITHOUT: 'Ohne Rabatte',
        DISCOUNT_WINDOW: 'Rabatt auf ein Produkt',
        DISCOUNT_ADDELEM: 'Discount auf zusätzliche Elemente',
        ORDER_COMMENT: 'Anmerkung Bestellen',
        UNKNOWN: 'unbekannt'
      },
      settings: {
        AUTHORIZATION: 'Autorisierung:',
        CHANGE_PASSWORD: 'Kennwort ändern',
        CHANGE_LANGUAGE: 'ändern Sie die Sprache',
        PRIVATE_INFO: 'Persönliche Informationen:',
        USER_NAME: 'Gesprächspartner',
        CITY: 'Stadt',
        ADD_PHONES: 'Zusätzliche Telefone:',
        INSERT_PHONE: 'Hinzufügen einer Telefon',
        CLIENT_SUPPORT: 'Poderzhka Benutzer',
        LOGOUT: 'Beenden Sie die Anwendung',
        SAVE: 'Speichern',
        CURRENT_PASSWORD: 'Die Jetzige',
        NEW_PASSWORD: 'Neu',
        CONFIRM_PASSWORD: 'Bestätigen',
        NO_CONFIRM_PASS: 'Ungültiges Passwort'
      }//,

      //'SWITCH_LANG': 'German'

    });

})();


// translations/en.js

(function(){
  'use strict';

  angular
    .module('BauVoiceApp')
    .constant('englishDictionary', {

      common_words: {
        CHANGE: 'Change',
        MONTHS: 'January, February, March, April, May, June, July, August, September, October, November, December',
        MONTHS_SHOT: 'Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sept, Oct, Nov, Dec',
        MONTHA: 'January, February, March, April, May, June, July, August, September, October, November, December',
        MONTH_LABEL: 'month',
        MONTHA_LABEL: 'months',
        MONTHS_LABEL: 'months',
        ALL: 'All',
        MIN: 'min.',
        MAX: 'max.',
        //----- confirm dialogs
        BUTTON_Y: 'YES',
        BUTTON_N: 'NO',
        DELETE_PRODUCT_TITLE: 'Delete!',
        DELETE_PRODUCT_TXT: 'Do you want to delete a product?',
        DELETE_ORDER_TITLE: 'Delete of order!',
        DELETE_ORDER_TXT: 'Do you want to delete an order?',
        COPY_ORDER_TITLE: 'Printing-down!',
        COPY_ORDER_TXT: 'Do you want to do the copy of order?',
        SEND_ORDER_TITLE: 'In a production!',
        SEND_ORDER_TXT: 'Do you want to send an order on a factory?',
        NEW_TEMPLATE_TITLE: 'Template changing',
        TEMPLATE_CHANGES_LOST: 'The template changes will lost! Continue?',
        PAGE_REFRESH: 'Reloading the page will lead to data loss!',
        SELECT: 'Select',
        AND: 'and',
        OK: 'OK',
        BACK: 'Back',
        LETTER_M: 'm'
      },
      login: {
        ENTER: 'To enter',
        PASS_CODE: 'You will reveal to this code the manager.',
        YOUR_CODE: 'Your code: ',
        EMPTY_FIELD: 'You should to fill this field.',
        WRONG_NUMBER: 'Incorrect number.',
        SHORT_NAME: 'Too short name',
        SHORT_PASSWORD: 'Too little password.',
        SHORT_PHONE: 'Too little phone number.',
        IMPORT_DB_START: 'Wait, began loading the database',
        IMPORT_DB_FINISH: 'Thank you for the download is complete',
        MOBILE: 'Mobile telephone',
        PASSWORD: 'Password',
        REGISTRATION: 'Registration',
        SELECT_COUNTRY: 'Select country',
        SELECT_REGION: 'Select region',
        SELECT_CITY: 'Select city',
        USER_EXIST: 'Sorry, but this user already exists! Please, try again.',
        USER_NOT_EXIST: 'Sorry, but this user not exists! Registrate please.',
        USER_NOT_ACTIVE: 'Sorry, but your profile is not active. Please check your email.',
        USER_CHECK_EMAIL: 'The confirmed email was send to you. Please check your email.',
        SELECT_PRODUCER: 'Choose the producer',
        SELECT_FACTORY: 'Please select the producer',
        USER_PASSWORD_ERROR: 'Sorry, but your password is wrong!',
        OFFLINE: 'No internet connection!',
        IMPORT_DB: 'DataBase Import was started! Waite please!'
      },
      mainpage: {
        MM: ' mm ',
        CLIMATE_ZONE: 'climatic area',
        THERMAL_RESISTANCE: 'heat transfer',
        AIR_CIRCULATION: 'coefficient of ventilation',
        NAVMENU_GEOLOCATION: 'To choose a location',
        NAVMENU_CURRENT_GEOLOCATION: 'Current location',
        NAVMENU_CURRENT_CALCULATION: 'Current calculation',
        NAVMENU_CART: 'Basket of calculation',
        NAVMENU_ADD_ELEMENTS: 'Add. elements',
        NAVMENU_ALL_CALCULATIONS: 'Order history',
        NAVMENU_SETTINGS: 'Settings',
        NAVMENU_MORE_INFO: 'More information',
        NAVMENU_VOICE_HELPER: 'Voice control',
        NAVMENU_CALCULATIONS: 'Calculations',
        NAVMENU_APPENDIX: 'Appendix',
        NAVMENU_NEW_CALC: '+New calculation',
        CONFIGMENU_CONFIGURATION: 'Configuration and sizes',
        CONFIGMENU_SIZING: 'width * height',
        CONFIGMENU_PROFILE: 'Profile',
        CONFIGMENU_GLASS: 'Glazing',
        CONFIGMENU_HARDWARE: 'accessories',
        CONFIGMENU_LAMINATION: 'Lamination',
        CONFIGMENU_LAMINATION_TYPE: 'room / Facade',
        WHITE_LAMINATION: 'White',
        CONFIGMENU_ADDITIONAL: 'Additionally',
        CONFIGMENU_IN_CART: 'In a basket',
        VOICE_SPEACH: 'You talk...',
        COMMENT: 'Leave a note on the order here.',
        ROOM_SELECTION1: 'Window',
        ROOM_SELECTION2: 'Decoration',
        ROOM_SELECTION3: 'Template selection',
        CONFIGMENU_NO_ADDELEMENTS: 'Add Elements are not choosen',
        HEATCOEF_VAL: 'W',
        TEMPLATE_TIP: 'To change the size, click here',
        PROFILE_TIP: 'To select a profile, click here',
        GLASS_TIP: 'To select a double-glazed window, click here',
        SELECT_ALL: 'Take all',
        SELECT_GLASS_WARN: 'Click on the glazing, you want to change'
      },
      panels: {
        TEMPLATE_WINDOW: 'Window',
        TEMPLATE_BALCONY: 'Balcony',
        TEMPLATE_DOOR: 'Door',
        TEMPLATE_BALCONY_ENTER: 'Exit to a balcony',
        TEMPLATE_EDIT: 'edit',
        TEMPLATE_DEFAULT: 'Project by default',
        COUNTRY: 'country',
        BRAND: 'trademark',
        HEAT_INSULATION: 'thermal insulation',
        NOICE_INSULATION: 'noise isolation',
        CORROSION_COEFF: 'Anticorrosion',
        BURGLAR_COEFF: 'Burglar',
        LAMINAT_INSIDE: 'In room',
        LAMINAT_OUTSIDE: 'Facade',
        ONE_WINDOW_TYPE: 'One-casement',
        TWO_WINDOW_TYPE: 'Two-casement',
        THREE_WINDOW_TYPE: 'Three-leaf',
        CAMERa: 'cameras',
        CAMER: 'cameras',
        CAMERs: 'cameras',
        ENERGY_SAVE: '+energy saving',
        DOOR_TYPE1: 'on perimeter',
        DOOR_TYPE2: 'without threshold',
        DOOR_TYPE3: 'aluminum threshold, type',
        SASH_TYPE1: 'the interroom',
        SASH_TYPE2: 'the door T-shaped',
        SASH_TYPE3: 'the window',
        HANDLE_TYPE1: 'press set',
        HANDLE_TYPE2: 'standard office handle',
        LOCK_TYPE1: 'one-locking with a latch',
        LOCK_TYPE2: 'multilocking with a latch'
      },
      add_elements: {
        CHOOSE: 'select',
        ADD: 'add',
        GRID: 'mosquito grid',
        VISOR: 'peak',
        SPILLWAY: 'water outflow',
        OUTSIDE: 'external slopes',
        LOUVERS: 'blinds',
        INSIDE: 'internal slopes',
        CONNECTORS: 'connector',
        FAN: 'microairing',
        WINDOWSILL: 'windowsill',
        HANDLEL: 'handle',
        OTHERS: 'other',
        GRIDS: 'mosquito grids',
        VISORS: 'peaks',
        SPILLWAYS: 'Drainages',
        WINDOWSILLS: 'sills',
        HANDLELS: 'handle',
        NAME_LABEL: 'name',
        ARTICUL_LABEL: 'reference',
        QTY_LABEL: 'pcs.',
        SIZE_LABEL: 'size',
        WIDTH_LABEL: 'width',
        HEIGHT_LABEL: 'height',
        OTHER_ELEMENTS1: 'Yet',
        OTHER_ELEMENTS2: 'component...',
        SCHEME_VIEW: 'Schematically',
        LIST_VIEW: 'List',
        INPUT_ADD_ELEMENT: 'Add Component',
        CANCEL: 'cancel',
        TOTAL_PRICE_TXT: 'Total additional components in the amount of:',
        ELEMENTS: 'components',
        ELEMENT: 'component',
        ELEMENTA: 'component'
      },
      add_elements_menu: {
        TIP: 'Select an item from the list',
        EMPTY_ELEMENT: 'Without the element',
        TAB_NAME_SIMPLE_FRAME: 'Simple design',
        TAB_NAME_HARD_FRAME: 'Composite structure',
        TAB_EMPTY_EXPLAIN: 'Please select the first item to start up construction.'
      },
      construction: {
        SASH_SHAPE: 'shutters',
        ANGEL_SHAPE: 'corners',
        IMPOST_SHAPE: 'imposts',
        ARCH_SHAPE: 'arches',
        POSITION_SHAPE: 'position',
        UNITS_DESCRIP: 'All Units are in mm',
        PROJECT_DEFAULT: 'Default project',
        DOOR_CONFIG_LABEL: 'configuration of doors',
        DOOR_CONFIG_DESCTIPT: 'door frame',
        SASH_CONFIG_DESCTIPT: 'door leaf',
        HANDLE_CONFIG_DESCTIPT: 'handle',
        LOCK_CONFIG_DESCTIPT: 'lock',
        STEP: 'step',
        LABEL_DOOR_TYPE: 'Select a design door frame',
        LABEL_SASH_TYPE: 'Select the type of door leaf',
        LABEL_HANDLE_TYPE: 'Select the type of handle',
        LABEL_LOCK_TYPE: 'Select the type of lock',
        VOICE_SWITCH_ON: "The voice helper is switched on",
        VOICE_NOT_UNDERSTAND: 'It is not clear',
        VOICE_SMALLEST_SIZE: 'The smallest size',
        VOICE_BIGGEST_SIZE: "The biggest size",
        VOICE_SMALL_GLASS_BLOCK: "too small skylights",
        NOT_AVAILABLE: 'Not Available!'
      },
      history: {
        SEARCH_PLACEHOLDER: 'Search by keyword',
        DRAFT_VIEW: 'Drafts calculations',
        HISTORY_VIEW: 'History of settlements',
        PHONE: 'phone',
        CLIENT: 'client',
        ADDRESS: 'address',
        FROM: 'from ',
        UNTIL: 'to ',
        PAYMENTS: 'payments',
        ALLPRODUCTS: 'products',
        ON: 'on',
        DRAFT: 'Draft',
        DATE_RANGE: 'Date Range',
        ALL_TIME: 'For all time',
        SORTING: 'Sorting',
        NEWEST_FIRST: 'By the time: new first',
        NEWEST_LAST: 'By the time new at the end of',
        SORT_BY_TYPE: 'By type',
        SORT_SHOW: 'Show',
        SORT_SHOW_ACTIVE: 'Only active',
        SORT_SHOW_WAIT: 'Only pending',
        SORT_SHOW_DONE: 'Only completed',
        BY_YOUR_REQUEST: 'According to your request',
        NOT_FIND: 'nothing found',
        WAIT_MASTER: 'expects gager',
        INCLUDED: 'included'
      },
      cart: {
        ALL_ADD_ELEMENTS: 'All additional elements order',
        ADD_ORDER: 'Add the product',
        PRODUCT_QTY: 'number of products',
        LIGHT_VIEW: 'Short view',
        FULL_VIEW: 'Full view',
        DELIVERY: 'Delivery',
        SELF_EXPORT: 'Pickup',
        FLOOR: 'floor',
        ASSEMBLING: 'mounting',
        WITHOUT_ASSEMBLING: 'without mounting',
        FREE: 'free',
        PAYMENT_BY_INSTALMENTS: 'Payment by installments',
        WITHOUT_INSTALMENTS: 'free installments',
        DELIVERY_DATE: 'Delivery date',
        TOTAL_PRICE_LABEL: 'Total Delivered on',
        MONTHLY_PAYMENT_LABEL: 'monthly payments on',
        DATE_DELIVERY_LABEL: 'Delivered on',
        FIRST_PAYMENT_LABEL: 'The first payment',
        ORDER: 'To order',
        MEASURE: 'Measure',
        READY: 'Ready',
        CALL_MASTER: 'Call gager to calculate',
        CALL_MASTER_DESCRIP: 'To call gager we need something for you to know. Both fields are required.',
        CLIENT_LOCATION: 'Location',
        CLIENT_ADDRESS: 'address',
        CALL_ORDER: 'Ordering for calculating',
        CALL_ORDER_DESCRIP: 'In order to fulfill the order, we need to something about you know.',
        CALL_ORDER_CLIENT_INFO: 'Customer Information (must be filled):',
        CLIENT_NAME: 'Full Name',
        CALL_ORDER_DELIVERY: 'Deliver an order for',
        CALL_ORDER_TOTAL_PRICE: 'in all',
        CALL_ORDER_ADD_INFO: 'Extras (Optional):',
        CLIENT_EMAIL: 'Email',
        ADD_PHONE: 'Additional phone',
        CALL_CREDIT: 'Making installment and order to calculate',
        CALL_CREDIT_DESCRIP: 'To arrange installments and fulfill the order, we have something for you to know.',
        CALL_CREDIT_CLIENT_INFO: 'Installment:',
        CREDIT_TARGET: 'The purpose of registration of installments',
        CLIENT_ITN: 'Individual Tax Number',
        CALL_START_TIME: 'Call from:',
        CALL_END_TIME: 'prior to:',
        CALL_CREDIT_PARTIAL_PRICE: 'on',
        ADDELEMENTS_EDIT_LIST: 'Edit List ...',
        ADDELEMENTS_PRODUCT_COST: 'one product',
        HEAT_TRANSFER: 'heat transfer',
        WRONG_EMAIL: 'Incorrect e-mail',
        LINK_BETWEEN_COUPLE: 'between couple',
        LINK_BETWEEN_ALL: 'between all',
//        LINK_DELETE_ALL_GROUPE: 'delete all',
        CLIENT_SEX: 'Sex',
        CLIENT_SEX_M: 'm',
        CLIENT_SEX_F: 'F',
        CLIENT_AGE: 'Age',
        CLIENT_AGE_OLDER: 'older',
        //CLIENT_EDUCATION: 'Education',
        //CLIENT_EDUC_MIDLE: 'middle',
        //CLIENT_EDUC_SPEC: 'specific middle',
        //CLIENT_EDUC_HIGH: 'high',
        CLIENT_EDUCATION: 'The main criterion of your choice',
        CLIENT_EDUC_MIDLE: 'Good price',
        CLIENT_EDUC_SPEC: 'image maker',
        CLIENT_EDUC_HIGH: 'brand profile and hardware',
        CLIENT_EDUC_4: 'Recommendations seller',
        CLIENT_OCCUPATION: 'Occupation',
        CLIENT_OCCUP_WORKER: 'Employee',
        CLIENT_OCCUP_HOUSE: 'Householder',
        CLIENT_OCCUP_BOSS: 'Employer',
        CLIENT_OCCUP_STUD: 'Student',
        CLIENT_OCCUP_PENSION: 'Pensioner',
        CLIENT_INFO_SOURCE: 'Information source',
        CLIENT_INFO_PRESS: 'Press',
        CLIENT_INFO_FRIEND: 'From friends',
        CLIENT_INFO_ADV: 'Visual advertising',
        SELECT_PLACEHOLD: 'select your option',
        //SELECT_AGE: 'Select your age',
        //SELECT_ADUCATION: 'Select your aducation',
        //SELECT_OCCUPATION: 'Select your occupation',
        //SELECT_INFO_SOURCE: 'Select source',
        NO_DISASSEMBL: 'without dismantle',
        STANDART_ASSEMBL: 'the standard',
        VIP_ASSEMBL: 'VIP-installation',
        DISCOUNT: 'Discount',
        DISCOUNT_SELECT: 'The choice of discounts',
        DISCOUNT_WITH: 'In view of the discounts',
        DISCOUNT_WITHOUT: 'Excluding discounts',
        DISCOUNT_WINDOW: 'Discount on a product',
        DISCOUNT_ADDELEM: 'Discount on additional elements',
        ORDER_COMMENT: 'Order note',
        UNKNOWN: 'Unknown'
      },
      settings: {
        AUTHORIZATION: 'Authorization:',
        CHANGE_PASSWORD: 'Change password',
        CHANGE_LANGUAGE: 'Change language',
        PRIVATE_INFO: 'Personal information:',
        USER_NAME: 'Contact person',
        CITY: 'City',
        ADD_PHONES: 'Additional phones:',
        INSERT_PHONE: 'Add a phone',
        CLIENT_SUPPORT: 'Customer Support',
        LOGOUT: 'Exit the application',
        SAVE: 'Save',
        CURRENT_PASSWORD: 'The Current',
        NEW_PASSWORD: 'New',
        CONFIRM_PASSWORD: 'Confirm',
        NO_CONFIRM_PASS: 'Invalid password'
      }

    });

})();


// translations/it.js

(function(){
  'use strict';

  angular
    .module('BauVoiceApp')
    .constant('italianDictionary', {

      common_words: {
        CHANGE: 'Cambiare',
        MONTHS: 'Gennaio, Febbraio, Marzo, Aprile, Maggio, Giugno, Luglio, Agosto, Settembre, Ottobre, Novembre, Dicembre',
        MONTHS_SHOT: 'Gen., Febb., Marzo, Apr., Mag., Giu., Luglio, Ago., Sett., Ott., Nov., Dic.',
        MONTHA: 'Gennaio, Febbraio, Marzo, Aprile, Maggio, Giugno, Luglio, Agosto, Settembre, Ottobre, Novembre, Dicembre',
        MONTH_LABEL: 'mese',
        MONTHA_LABEL: 'del mese',
        MONTHS_LABEL: 'mesi',
        ALL: 'tutto',
        MIN: 'Min',
        MAX: 'Max',
        //----- confirm dialogs
        BUTTON_Y: 'Sì',
        BUTTON_N: 'No',
        DELETE_PRODUCT_TITLE: 'Cancella!',
        DELETE_PRODUCT_TXT: 'Volete cancellare il prodotto?',
        DELETE_ORDER_TITLE: 'Cancellazione dell’ordine!',
        DELETE_ORDER_TXT: 'Volete cancellare l’ordine?',
        COPY_ORDER_TITLE: 'Copia!',
        COPY_ORDER_TXT: 'Volete fare una copia dell’ordine?',
        SEND_ORDER_TITLE: 'La produzione !',
        SEND_ORDER_TXT: ' Volete inviare l’ordine in fabbrica?',
        NEW_TEMPLATE_TITLE: 'Cambiamento di una sagoma',
        TEMPLATE_CHANGES_LOST: ' I cambiamenti in una sagoma saranno persi! Continuare?',
        PAGE_REFRESH: "L'azzerramento della pagina porterà a perdita di dati!",
        SELECT: ' Scegliere ',
        AND: ' e ',
        OK: 'OK',
        BACK: 'Back',
        LETTER_M: 'm'
      },
      login: {
        ENTER: 'Entrare',
        PASS_CODE: 'Comunicate il codice al manager.',
        YOUR_CODE: 'Il vostro codice: ',
        EMPTY_FIELD: 'Riempite questo campo.',
        WRONG_NUMBER: 'Numero errato, formato +XX(XXX)XXX-XXXX.',
        SHORT_NAME: 'Nome troppo piccolo.',
        SHORT_PASSWORD: 'Password troppo breve.',
        SHORT_PHONE: 'Numero del telefono troppo piccolo.',
        IMPORT_DB_START: 'Aspetti, il carico di un database ha cominciato',
        IMPORT_DB_FINISH: ' Grazie, caricandolo sono complete',
        MOBILE: 'Il cellulare',
        PASSWORD: 'Password',
        REGISTRATION: 'Registrazione',
        SELECT_COUNTRY: 'Il paese di Veberite',
        SELECT_REGION: 'Scelga la regione',
        SELECT_CITY: 'Scelga la città',
        USER_EXIST: 'Un tal utente già esiste! Provi ancora una volta.',
        USER_NOT_EXIST: 'Un tal utente non esiste. Esser registrato.',
        USER_NOT_ACTIVE: 'Non ha attivato il Suo profilo. Controlli la Sua posta.',
        USER_CHECK_EMAIL: 'La lettera di conferma La è stata mandata a posta.',
        SELECT_PRODUCER: 'Scelga il produttore',
        SELECT_FACTORY: 'Non ha scelto il produttore',
        USER_PASSWORD_ERROR: "Parola d'ordine scorretta!",
        OFFLINE: "Non c'è connessione con l'Internet!",
        IMPORT_DB: 'Il carico di Database ha cominciato! Aspetti, per favore!'
      },
      mainpage: {
        MM: ' мм ',
        CLIMATE_ZONE: 'Zona  climatica',
        THERMAL_RESISTANCE: 'Resistenza alla trasmissione termica',
        AIR_CIRCULATION: 'Coefficiente della circolazione d’aria',
        NAVMENU_GEOLOCATION: 'Scegliere la disposizione',
        NAVMENU_CURRENT_GEOLOCATION: 'La disposizione corrente',
        NAVMENU_CURRENT_CALCULATION: 'Pagamento corrente',
        NAVMENU_CART: 'Cestino per il pagamento',
        NAVMENU_ADD_ELEMENTS: 'Elementi aggiuntivi',
        NAVMENU_ALL_CALCULATIONS: 'Tutti i pagamenti',
        NAVMENU_SETTINGS: 'Impostazioni',
        NAVMENU_MORE_INFO: 'Maggiore informazione',
        NAVMENU_VOICE_HELPER: 'Assistenza a voce',
        NAVMENU_CALCULATIONS: 'Pagamenti',
        NAVMENU_APPENDIX: 'Allegato',
        NAVMENU_NEW_CALC: 'Il nuovo pagamento',
        CONFIGMENU_CONFIGURATION: 'Configurazioni e dimensioni',
        CONFIGMENU_SIZING: 'larghezza * altezza -',
        CONFIGMENU_PROFILE: 'Profilo',
        CONFIGMENU_GLASS: 'Parquet di vetro',
        CONFIGMENU_HARDWARE: 'Fornitura',
        CONFIGMENU_LAMINATION: 'Laminazione',
        CONFIGMENU_LAMINATION_TYPE: 'in camera / facciata',
        WHITE_LAMINATION: 'La bianca',
        CONFIGMENU_ADDITIONAL: 'In aggiunta',
        CONFIGMENU_IN_CART: 'Nel cestino',
        VOICE_SPEACH: 'Parlate...',
        COMMENT: "Lasci la nota sull'ordine qui.",
        ROOM_SELECTION1: 'Finestra',
        ROOM_SELECTION2: 'Decorazione',
        ROOM_SELECTION3: 'Scelta template',
        CONFIGMENU_NO_ADDELEMENTS: 'Gli elementi supplementari non sono scelti',
        HEATCOEF_VAL: 'Wt',
        TEMPLATE_TIP: 'Poiché il cambiamento delle dimensioni preme qui',
        PROFILE_TIP: 'Poiché una scelta di un profilo preme qui',
        GLASS_TIP: 'Poiché una scelta di una finestra doppio invetriata preme qui',
        SELECT_ALL: 'Selezionare tutto',
        SELECT_GLASS_WARN: 'Clicca sul vetro, che si desidera modificare'
      },
      panels: {
        TEMPLATE_WINDOW: 'Finestra',
        TEMPLATE_BALCONY: 'Balcone',
        TEMPLATE_DOOR: 'Porta',
        TEMPLATE_BALCONY_ENTER: 'Uscita sul balcone',
        TEMPLATE_EDIT: 'Redigere',
        TEMPLATE_DEFAULT: 'Progetto per difetto',
        COUNTRY: 'paese',
        BRAND: 'marchio commerciale',
        HEAT_INSULATION: 'isolamento termico',
        NOICE_INSULATION: 'isolamento acustico',
        CORROSION_COEFF: 'anticorrosione',
        BURGLAR_COEFF: 'protezione contro rottura',
        LAMINAT_INSIDE: 'in camera',
        LAMINAT_OUTSIDE: 'la facciata',
        ONE_WINDOW_TYPE: 'La porta sola',
        TWO_WINDOW_TYPE: "L'ala doppio",
        THREE_WINDOW_TYPE: 'Il da tre foglie',
        CAMERa: 'di camera',
        CAMER: ' di camera ',
        CAMERs: 'di camere',
        ENERGY_SAVE: '+risparmio di energia',
        DOOR_TYPE1: 'su perimetro',
        DOOR_TYPE2: 'senza soglia',
        DOOR_TYPE3: 'la soglia di alluminio, battere a macchina',
        SASH_TYPE1: "l'intercamera",
        SASH_TYPE2: 'la porta T-shaped',
        SASH_TYPE3: 'la finestra',
        HANDLE_TYPE1: 'prema la serie',
        HANDLE_TYPE2: 'maniglia di ufficio standard',
        LOCK_TYPE1: 'una chiusura con una serratura a scatto',
        LOCK_TYPE2: 'la multichiusura con una serratura a scatto'
      },
      add_elements: {
        CHOOSE: 'Scegliere',
        ADD: 'Aggiungere',
        GRID: 'zanzaniera',
        VISOR: 'tettoia',
        SPILLWAY: 'scolo d’acqua',
        OUTSIDE: 'spallette esterne',
        LOUVERS: 'le serrande',
        INSIDE: 'spallette interne',
        CONNECTORS: 'connettore',
        FAN: 'microventilazione',
        WINDOWSILL: 'davanzale',
        HANDLEL: 'maniglia',
        OTHERS: 'altro',
        GRIDS: 'le zanzariere',
        VISORS: 'le tettoie',
        SPILLWAYS: 'gli scoli d’acqua',
        WINDOWSILLS: 'i davanzali',
        HANDLELS: 'le maniglie',
        NAME_LABEL: 'denominazione',
        ARTICUL_LABEL: 'riferimento',
        QTY_LABEL: 'pz.',
        SIZE_LABEL: 'dimensione, misura',
        WIDTH_LABEL: 'larghezza',
        HEIGHT_LABEL: 'altezza',
        OTHER_ELEMENTS1: 'Ancora',
        OTHER_ELEMENTS2: 'componenti...',
        SCHEME_VIEW: 'Schematicamente',
        LIST_VIEW: 'Lista',
        INPUT_ADD_ELEMENT: 'Aggiungere un componente elemento',
        CANCEL: 'Revoca',
        TOTAL_PRICE_TXT: 'Totale componenti aggiuntivi:',
        ELEMENTS: 'componenti',
        ELEMENT: 'componente',
        ELEMENTA: 'di componente'
      },
      add_elements_menu: {
        TIP: 'Scegliete un componente dalal lista',
        EMPTY_ELEMENT: 'Senza elemento',
        TAB_NAME_SIMPLE_FRAME: 'Schema semplice',
        TAB_NAME_HARD_FRAME: 'Schema complesso',
        TAB_EMPTY_EXPLAIN: 'Scegliete il primo elemento dalla lista.'
      },
      construction: {
        SASH_SHAPE: 'battenti',
        ANGEL_SHAPE: 'angoli',
        IMPOST_SHAPE: 'imposte',
        ARCH_SHAPE: 'archi',
        POSITION_SHAPE: 'posizione',
        UNITS_DESCRIP: 'come unità di musura sono usati millimetri',
        PROJECT_DEFAULT: 'progetto per difetto',
        DOOR_CONFIG_LABEL: 'configurazione delal porta',
        DOOR_CONFIG_DESCTIPT: 'infisso porta',
        SASH_CONFIG_DESCTIPT: 'battente della porta',
        HANDLE_CONFIG_DESCTIPT: 'maniglia',
        LOCK_CONFIG_DESCTIPT: 'la serratura',
        STEP: 'passo',
        LABEL_DOOR_TYPE: 'Scegliete il modello dell’infisso porta',
        LABEL_SASH_TYPE: 'Scegliete un tipo dibattente portamaniglia',
        LABEL_HANDLE_TYPE: 'Scegliete un tipo di maniglia',
        LABEL_LOCK_TYPE: 'Scegliete un tipo di serratura',
        VOICE_SWITCH_ON: "il modo di voce è incluso",
        VOICE_NOT_UNDERSTAND: 'Non è chiaro',
        VOICE_SMALLEST_SIZE: 'dimensioni troppo piccole',
        VOICE_BIGGEST_SIZE: "dimensioni troppo grandi",
        VOICE_SMALL_GLASS_BLOCK: "apertura leggera troppo piccola",
        NOT_AVAILABLE: 'È inaccessibile!'
      },
      history: {
        SEARCH_PLACEHOLDER: 'Ricerca per parole chiave',
        DRAFT_VIEW: 'Brutte copie dei conteggi',
        HISTORY_VIEW: 'Storia deiconteggi',
        PHONE: 'telefono',
        CLIENT: 'cliente',
        ADDRESS: 'indirizzo',
        FROM: 'da ',
        UNTIL: 'fino a ',
        PAYMENTS: 'dei pagamenti',
        ALLPRODUCTS: 'prodotti',
        ON: 'per',
        DRAFT: 'Brutta copia',
        DATE_RANGE: 'Diapason delle date',
        ALL_TIME: 'Per tutto il tempo',
        SORTING: 'Cernita',
        NEWEST_FIRST: 'Per cronologia: i nuovi all’inizio',
        NEWEST_LAST: 'Per cronologia: i nuovi alal fine',
        SORT_BY_TYPE: 'Per tipo',
        SORT_SHOW: 'Mostrare',
        SORT_SHOW_ACTIVE: 'Solo attivi',
        SORT_SHOW_WAIT: 'Solo in attesa',
        SORT_SHOW_DONE: 'Appena finito',
        BY_YOUR_REQUEST: 'Su vostra richiesta',
        NOT_FIND: 'Non è stato trovato niente',
        WAIT_MASTER: 'Aspetta il misuratore ',
        INCLUDED: 'sono inclusi'
      },
      cart: {
        ALL_ADD_ELEMENTS: 'Tutti gli elementi supplementari dell’oedine',
        ADD_ORDER: 'Aggiungere un prodotto',
        PRODUCT_QTY: 'quantitativo di prodotti',
        LIGHT_VIEW: 'Aspetto ridotto',
        FULL_VIEW: 'Aspetto integrale ',
        DELIVERY: 'Consegna',
        SELF_EXPORT: 'Trasporto individuale',
        FLOOR: 'piano',
        ASSEMBLING: 'Montaggio',
        WITHOUT_ASSEMBLING: 'senza montaggio',
        FREE: 'gratuitamente',
        PAYMENT_BY_INSTALMENTS: 'Rateazione',
        WITHOUT_INSTALMENTS: 'senza rateazione',
        DELIVERY_DATE: 'Data consegna',
        TOTAL_PRICE_LABEL: 'Totale per la consegna',
        MONTHLY_PAYMENT_LABEL: 'pagamenti mensili per',
        DATE_DELIVERY_LABEL: 'con consegna per ',
        FIRST_PAYMENT_LABEL: 'Nuovo pagamento',
        ORDER: 'Ordinare',
        MEASURE: 'Misurare',
        READY: 'Pronto',
        CALL_MASTER: 'Chiamata del misuratore per il conteggio',
        CALL_MASTER_DESCRIP: 'Per la telefonata del measurer abbiamo bisogno di sapere qualcosa su Lei. Entrambi i campi sono obbligatori per riempitura.',
        CLIENT_LOCATION: 'Località',
        CLIENT_ADDRESS: 'Indirizzo',
        CALL_ORDER: 'Stesura dell’ordine per il conteggio',
        CALL_ORDER_DESCRIP: 'Per poter eseguire il vostro ordine dobbiamo sapere qualccosa di voi.',
        CALL_ORDER_CLIENT_INFO: 'Informazioni sul cliente (campo obbligatorio):',
        CLIENT_NAME: 'Cognome Nome Patronimico',
        CALL_ORDER_DELIVERY: 'Consegnare l’ordine per',
        CALL_ORDER_TOTAL_PRICE: 'In totale',
        CALL_ORDER_ADD_INFO: 'In aggiunta (campo facoltativo):',
        CLIENT_EMAIL: 'posta elettronica',
        ADD_PHONE: 'Telefono supplementare',
        CALL_CREDIT: 'Concessione rateazione e Accettazione dell’ordine per il conteggio',
        CALL_CREDIT_DESCRIP: "Per emettere il pagamento di rate ed eseguire l'ordine, dobbiamo sapere qualcosa su Lei.",
        CALL_CREDIT_CLIENT_INFO: 'Rateazione:',
        CREDIT_TARGET: 'Finalità della concessione di rateazione',
        CLIENT_ITN: 'Codice  fiscale ',
        CALL_START_TIME: 'Telefonare da:',
        CALL_END_TIME: 'fino a:',
        CALL_CREDIT_PARTIAL_PRICE: 'per',
        ADDELEMENTS_EDIT_LIST: 'Redigere la lista ...',
        ADDELEMENTS_PRODUCT_COST: 'in un prodotto',
        HEAT_TRANSFER: 'tarsmissione di calore',
        WRONG_EMAIL: 'Posta elettronica errata',
        LINK_BETWEEN_COUPLE: 'tra coppia',
        LINK_BETWEEN_ALL: 'tra tutti',
//        LINK_DELETE_ALL_GROUPE: 'cancelare tutto',
        CLIENT_SEX: 'di sesso',
        CLIENT_SEX_M: 'U',
        CLIENT_SEX_F: 'D',
        CLIENT_AGE: 'Età',
        CLIENT_AGE_OLDER: 'è più più anziano',
        //CLIENT_EDUCATION: 'Istruzione',
        //CLIENT_EDUC_MIDLE: 'media',
        //CLIENT_EDUC_SPEC: 'specializzato secondario',
        //CLIENT_EDUC_HIGH: 'il più alto',
        CLIENTE_ISTRUZIONE: 'Il criterio principale della vostra scelta',
        CLIENT_EDUC_MIDLE: 'Il buon prezzo',
        CLIENTE_EDUC_SPEC: 'creatore di immagine',
        CLIENT_EDUC_HIGH: 'il profilo del marchio e hardware',
        CLIENT_EDUC_4: 'Raccomandazioni venditore',
        CLIENT_OCCUPATION: 'Occupazione',
        CLIENT_OCCUP_WORKER: 'Dipendente',
        CLIENT_OCCUP_HOUSE: 'Casalinga',
        CLIENT_OCCUP_BOSS: "Uomo d'affari",
        CLIENT_OCCUP_STUD: 'Studente',
        CLIENT_OCCUP_PENSION: 'Pensionato',
        CLIENT_INFO_SOURCE: 'Fonte di informazioni',
        CLIENT_INFO_PRESS: 'Premere',
        CLIENT_INFO_FRIEND: 'Da conoscenti',
        CLIENT_INFO_ADV: 'Fare annunci visivo',
        SELECT_PLACEHOLD: "selezionare l'opzione",
        //SELECT_AGE: 'Scelga la Sua età',
        //SELECT_ADUCATION: 'Scelga la Sua istruzione',
        //SELECT_OCCUPATION: 'Scelga la Sua occupazione',
        //SELECT_INFO_SOURCE: 'Scelga la fonte di informazioni',
        NO_DISASSEMBL: 'senza smontano',
        STANDART_ASSEMBL: 'lo standard',
        VIP_ASSEMBL: 'INSTALLAZIONE DEL VIP',
        DISCOUNT: 'Sconto',
        DISCOUNT_SELECT: 'Scelta di sconto',
        DISCOUNT_WITH: 'Prendere in considerazione uno sconto',
        DISCOUNT_WITHOUT: 'Senza uno sconto',
        DISCOUNT_WINDOW: 'Sconto a un prodotto',
        DISCOUNT_ADDELEM: 'Sconto a elementi supplementari',
        ORDER_COMMENT: 'Nota Order',
        UNKNOWN: 'Sconosciuto'
      },
      settings: {
        AUTHORIZATION: 'Autorizzazione:',
        CHANGE_PASSWORD: "Cambiare la parola d'ordine",
        CHANGE_LANGUAGE: 'Cambiare la lingua',
        PRIVATE_INFO: 'Dati personalio:',
        USER_NAME: 'Persona di contatto',
        CITY: 'Città',
        ADD_PHONES: 'Telefoni supplementari:',
        INSERT_PHONE: 'Aggiungere un telefono',
        CLIENT_SUPPORT: 'Assistenza agli utentui',
        LOGOUT: 'Uscire dall’allegato',
        SAVE: 'Salvare',
        CURRENT_PASSWORD: 'Corrente',
        NEW_PASSWORD: 'Nuovo',
        CONFIRM_PASSWORD: 'Confermare',
        NO_CONFIRM_PASS: 'Password errata'
      }

    });

})();



// translations/ro.js

(function(){
  'use strict';

  angular
    .module('BauVoiceApp')
    .constant('romanianDictionary', {

      common_words: {
        CHANGE: 'modifică',
        MONTHS: 'Ianuarie, Februarie, Martie, Aprilie, Mai, Iunie, Iulie, August, Septembrie, Octombrie, Novembie, Decembrie',
        MONTHS_SHOT: 'Ian, Feb, Mart, Apr, Mai, Iun, Iul, Aug, Sept, Oct, Nov, Dec',
        MONTHA: 'Ianuarie, Februarie, Martie, Aprilie, Mai, Iunie, Iulie, August, Septembrie, Octombrie, Novembie, Decembrie',
        MONTH_LABEL: 'lună',
        MONTHA_LABEL: 'lunii',
        MONTHS_LABEL: 'luni',
        ALL: 'toate',
        MIN: 'minimum',
        MAX: 'maximum',
        //----- confirm dialogs
        BUTTON_Y: 'Da',
        BUTTON_N: 'Nu',
        DELETE_PRODUCT_TITLE: 'STERGE!',
        DELETE_PRODUCT_TXT: 'Doriți să eliminați produsul?',
        DELETE_ORDER_TITLE: 'Sterge comanda!',
        DELETE_ORDER_TXT: 'Doriți să anulați comanda?',
        COPY_ORDER_TITLE: 'Copierea!',
        COPY_ORDER_TXT: 'Doriți să facă o copie la comandă?',
        SEND_ORDER_TITLE: 'în producție!',
        SEND_ORDER_TXT: 'Doriți să trimiteți comanda la uzină?',
        NEW_TEMPLATE_TITLE: 'Template changing',
        TEMPLATE_CHANGES_LOST: 'The template changes will lost! Continue?',
        PAGE_REFRESH: 'Reîncărcarea paginii va duce la pierderi de date!',
        SELECT: 'Select',
        AND: 'și',
        OK: 'OK',
        BACK: 'Back',
        LETTER_M: 'm'
      },
      login: {
        ENTER: 'autentificare',
        PASS_CODE: 'Spune-i managerului acest cod.',
        YOUR_CODE: 'codul dvs: ',
        EMPTY_FIELD: 'Completați acest câmp.',
        WRONG_NUMBER: 'numar incorrect.',
        SHORT_NAME: 'Too short name',
        SHORT_PASSWORD: 'parola e prea mica.',
        SHORT_PHONE: 'Too little phone number.',
        IMPORT_DB_START: 'Stai, a început încărcarea de date',
        IMPORT_DB_FINISH: 'Vă mulțumim pentru descărcarea este completă',
        MOBILE: 'telefon mobil',
        PASSWORD: 'Parola',
        REGISTRATION: 'înregistrare',
        SELECT_COUNTRY: 'Select country',
        SELECT_REGION: 'Select region',
        SELECT_CITY: 'Select city',
        USER_EXIST: 'Sorry, but this user already exists! Please, try again.',
        USER_NOT_EXIST: 'Sorry, but this user not exists! Registrate please.',
        USER_NOT_ACTIVE: 'Sorry, but your profile is not active. Please check your email.',
        USER_CHECK_EMAIL: 'The confirmed email was send to you. Please check your email.',
        SELECT_PRODUCER: 'Choose the producer',
        SELECT_FACTORY: 'Please select the producer',
        USER_PASSWORD_ERROR: 'Sorry, but your password is wrong!',
        OFFLINE: 'Nu există conexiune la Internet!',
        IMPORT_DB: 'Baze de date începe descărcarea! Va rugam asteptati! '
      },
      mainpage: {
        MM: ' mm ',
        CLIMATE_ZONE: 'zona climatica ',
        THERMAL_RESISTANCE: 'transfer de căldură',
        AIR_CIRCULATION: 'coeficientul circulatiei aerului',
        NAVMENU_GEOLOCATION: 'Selectați locația',
        NAVMENU_CURRENT_GEOLOCATION: 'Locul de amplasare actual',
        NAVMENU_CURRENT_CALCULATION: 'calcul actual',
        NAVMENU_CART: 'cosul de cumparaturi',
        NAVMENU_ADD_ELEMENTS: 'elemente suplimentare',
        NAVMENU_ALL_CALCULATIONS: 'Istoric comenzi',
        NAVMENU_SETTINGS: 'Setări',
        NAVMENU_MORE_INFO: 'Mai multe informații',
        NAVMENU_VOICE_HELPER: 'Сontrolul voce-activat',
        NAVMENU_CALCULATIONS: 'calcule',
        NAVMENU_APPENDIX: 'Propunere',
        NAVMENU_NEW_CALC: '+Calcul Nou',
        CONFIGMENU_CONFIGURATION: 'Configurația și dimensiunile',
        CONFIGMENU_SIZING: 'Lățime * Înălțime',
        CONFIGMENU_PROFILE: 'profil',
        CONFIGMENU_GLASS: 'geam termopan',
        CONFIGMENU_HARDWARE: 'furnitura ',
        CONFIGMENU_LAMINATION: 'laminare',
        CONFIGMENU_LAMINATION_TYPE: 'camera / fațadă',
        WHITE_LAMINATION: 'alb',
        CONFIGMENU_ADDITIONAL: 'Suplimentar',
        CONFIGMENU_IN_CART: 'Adaugă in coș',
        VOICE_SPEACH: 'Vorbiți...',
        COMMENT: 'Lasă un bilet pe ordinea de aici.',
        ROOM_SELECTION1: 'Fereastră',
        ROOM_SELECTION2: 'Decorare',
        ROOM_SELECTION3: 'Template selection',
        CONFIGMENU_NO_ADDELEMENTS: 'Suplimentare sunt selectate',
        HEATCOEF_VAL: 'W',
        TEMPLATE_TIP: "Pentru a schimba dimensiunea, faceți clic aici",
        PROFILE_TIP: "Pentru a selecta un profil, faceți clic aici",
        GLASS_TIP: "Pentru a selecta o fereastră termopan, click aici",
        SELECT_ALL: 'Selectați toate',
        SELECT_GLASS_WARN: 'Faceți clic pe geam, doriți să modificați'
      },
      panels: {
        TEMPLATE_WINDOW: 'Fereastră',
        TEMPLATE_BALCONY: 'Balcon',
        TEMPLATE_DOOR: 'Ușă',
        TEMPLATE_BALCONY_ENTER: 'Ieșire la balcon',
        TEMPLATE_EDIT: 'Editare',
        TEMPLATE_DEFAULT: 'Proiect Standard',
        COUNTRY: 'țara',
        BRAND: 'marcă comercială',
        HEAT_INSULATION: 'izolație termică',
        NOICE_INSULATION: 'izolare fonica',
        CORROSION_COEFF: 'anticoroziune',
        BURGLAR_COEFF: 'hoț',
        LAMINAT_INSIDE: 'in camera',
        LAMINAT_OUTSIDE: 'față',
        ONE_WINDOW_TYPE: 'One-casement',
        TWO_WINDOW_TYPE: 'Two-casement',
        THREE_WINDOW_TYPE: 'Three-leaf',
        CAMERa: 'cameras',
        CAMER: 'cameras',
        CAMERs: 'cameras',
        ENERGY_SAVE: '+energy saving',
        DOOR_TYPE1: 'on perimeter',
        DOOR_TYPE2: 'without threshold',
        DOOR_TYPE3: 'aluminum threshold, type',
        SASH_TYPE1: 'the interroom',
        SASH_TYPE2: 'the door T-shaped',
        SASH_TYPE3: 'the window',
        HANDLE_TYPE1: 'press set',
        HANDLE_TYPE2: 'standard office handle',
        LOCK_TYPE1: 'one-locking with a latch',
        LOCK_TYPE2: 'multilocking with a latch'
      },
      add_elements: {
        CHOOSE: 'Alege',
        ADD: 'Adauga',
        GRID: 'plasă contra țânțarilor',
        VISOR: 'parasolară',
        SPILLWAY: 'scurgere',
        OUTSIDE: 'pante exterioare',
        LOUVERS: 'jaluzele',
        INSIDE: 'pante interne',
        CONNECTORS: 'conector',
        FAN: 'micro ventilare',
        WINDOWSILL: 'pervaz',
        HANDLEL: 'mâner',
        OTHERS: 'altele',
        GRIDS: 'plase de țânțari',
        VISORS: 'viziere',
        SPILLWAYS: 'scurgeri',
        WINDOWSILLS: 'Pervaze',
        HANDLELS: 'manere',
        NAME_LABEL: 'nume',
        ARTICUL_LABEL: 'referință',
        QTY_LABEL: 'Bucăți',
        SIZE_LABEL: 'dimensiune',
        WIDTH_LABEL: 'lățime',
        HEIGHT_LABEL: 'înălțime',
        OTHER_ELEMENTS1: 'încă',
        OTHER_ELEMENTS2: 'componenta...',
        SCHEME_VIEW: 'schematic',
        LIST_VIEW: 'Lista',
        INPUT_ADD_ELEMENT: 'Adaugă Componenta',
        CANCEL: 'anulare',
        TOTAL_PRICE_TXT: 'Total componente suplimentare în valoare de',
        ELEMENTS: 'componente',
        ELEMENT: 'component',
        ELEMENTA: 'componenta'
      },
      add_elements_menu: {
        TIP: 'Selectați un element din listă',
        EMPTY_ELEMENT: 'fără elementul',
        TAB_NAME_SIMPLE_FRAME: 'construcție simplă',
        TAB_NAME_HARD_FRAME: 'construcție component',
        TAB_EMPTY_EXPLAIN: 'Vă rugăm să selectați primul element,pentru a porni construcția.'
      },
      construction: {
        SASH_SHAPE: 'cercevea',
        ANGEL_SHAPE: 'unghiuri',
        IMPOST_SHAPE: 'impost',
        ARCH_SHAPE: 'arcuri',
        POSITION_SHAPE: 'poziția',
        UNITS_DESCRIP: 'Unitățile de măsură sunt în mm',
        PROJECT_DEFAULT: 'Proiect Standard',
        DOOR_CONFIG_LABEL: 'configurația uși',
        DOOR_CONFIG_DESCTIPT: 'cadru de ușă',
        SASH_CONFIG_DESCTIPT: 'ori usi',
        HANDLE_CONFIG_DESCTIPT: 'mâner',
        LOCK_CONFIG_DESCTIPT: 'blocare a ușii',
        STEP: 'pas',
        LABEL_DOOR_TYPE: 'Selectaţi un toc de proiectare a ușii',
        LABEL_SASH_TYPE: 'Selectați tipul de cercevea la ușă',
        LABEL_HANDLE_TYPE: 'Selectați tipul de mâner',
        LABEL_LOCK_TYPE: 'Selectați tipul de blocare',
        VOICE_SWITCH_ON: "Modul Voce este activat",
        VOICE_NOT_UNDERSTAND: 'nu este clar',
        VOICE_SMALLEST_SIZE: 'prea mic',
        VOICE_BIGGEST_SIZE: "prea mare",
        VOICE_SMALL_GLASS_BLOCK: "luminatoare prea mici",
        NOT_AVAILABLE: 'nu Este Disponibil!'
      },
      history: {
        SEARCH_PLACEHOLDER: 'Căutare după cuvinte cheie',
        DRAFT_VIEW: 'calcule Ciorne',
        HISTORY_VIEW: 'istoria calculelor',
        PHONE: 'telefon',
        CLIENT: 'client',
        ADDRESS: 'adresa',
        FROM: 'de la ',
        UNTIL: 'pînă la ',
        PAYMENTS: 'achitare prin',
        ALLPRODUCTS: 'Construcți',
        ON: 'pe',
        DRAFT: 'ciornă',
        DATE_RANGE: 'intervalul de date',
        ALL_TIME: 'Pentru tot timpul',
        SORTING: 'Sortarea',
        NEWEST_FIRST: 'după timp:cele noi primele',
        NEWEST_LAST: 'după timp:cele noi la urmă',
        SORT_BY_TYPE: 'După tipul',
        SORT_SHOW: 'Arată',
        SORT_SHOW_ACTIVE: 'Doar activi',
        SORT_SHOW_WAIT: 'Numai în așteptarea',
        SORT_SHOW_DONE: 'Numai finalizat',
        BY_YOUR_REQUEST: 'Potrivit cererea dvs.',
        NOT_FIND: 'nimic nu a fost găsit',
        WAIT_MASTER: 'aşteaptă inginerul',
        INCLUDED: 'inclus'
      },
      cart: {
        ALL_ADD_ELEMENTS: 'toate elemente suplimentare a comenzii',
        ADD_ORDER: 'adaugă produsul',
        PRODUCT_QTY: 'numărul de produse',
        LIGHT_VIEW: 'Vizualizare scurtă',
        FULL_VIEW: 'Vizualizare completă',
        DELIVERY: 'livrare',
        SELF_EXPORT: 'Fara livrare',
        FLOOR: 'etajul',
        ASSEMBLING: 'instalare',
        WITHOUT_ASSEMBLING: 'fără montare',
        FREE: 'gratuit',
        PAYMENT_BY_INSTALMENTS: 'Plata în rate',
        WITHOUT_INSTALMENTS: 'fără rate',
        DELIVERY_DATE: 'data de livrare',
        TOTAL_PRICE_LABEL: 'în total la livrare ',
        MONTHLY_PAYMENT_LABEL: 'plata lunara cîte',
        DATE_DELIVERY_LABEL: 'La livrare',
        FIRST_PAYMENT_LABEL: 'prima achitare',
        ORDER: 'a comanda',
        MEASURE: 'Măsura',
        READY: 'Gata',
        CALL_MASTER: 'chemarea inginerului pentru calcul',
        CALL_MASTER_DESCRIP: 'Pentru a solicita inginerul, avem nevoie de ceva informatie despre dvs. Ambele campurile sunt obligatorii.',
        CLIENT_LOCATION: 'locație',
        CLIENT_ADDRESS: 'adresa',
        CALL_ORDER: 'Pentru a calcula',
        CALL_ORDER_DESCRIP: 'Pentru a îndeplini comanda,este necesar informatie despre dvs.',
        CALL_ORDER_CLIENT_INFO: 'Informații client (câmpuri obligatorii):',
        CLIENT_NAME: 'numele prenumele patronimicul',
        CALL_ORDER_DELIVERY: 'livrarea comenzi pe',
        CALL_ORDER_TOTAL_PRICE: 'Total',
        CALL_ORDER_ADD_INFO: 'suplimentar (completarea la dorinţă):',
        CLIENT_EMAIL: 'poșta electronică',
        ADD_PHONE: 'telefon suplimentar',
        CALL_CREDIT: 'Efectuarea rate și calculul comenzi',
        CALL_CREDIT_DESCRIP: 'Pentru a aranja rate și îndeplini comanda, avem ceva pentru tine să știu.',
        CALL_CREDIT_CLIENT_INFO: 'Plata în rate:',
        CREDIT_TARGET: 'Scopul clearance de rate',
        CLIENT_ITN: 'Cod fiscal individual',
        CALL_START_TIME: 'sunați de la:',
        CALL_END_TIME: 'pînă la :',
        CALL_CREDIT_PARTIAL_PRICE: 'pe ',
        ADDELEMENTS_EDIT_LIST: 'redactarea listei ...',
        ADDELEMENTS_PRODUCT_COST: 'într-o construcţie',
        HEAT_TRANSFER: 'transferul de căldură',
        WRONG_EMAIL: 'poșta electronica este incorectă',
        LINK_BETWEEN_COUPLE: 'între o pereche de',
        LINK_BETWEEN_ALL: 'printre toate',
//        LINK_DELETE_ALL_GROUPE: 'Eliminați toate',
        CLIENT_SEX: "Sex",
        CLIENT_SEX_M: 'M',
        CLIENT_SEX_F: "F",
        CLIENT_AGE: "Age",
        CLIENT_AGE_OLDER: "mai vechi",
        //CLIENT_EDUCATION: "Educație",
        //CLIENT_EDUC_MIDLE: "Media",
        //CLIENT_EDUC_SPEC: "profesional mediu.",
        //CLIENT_EDUC_HIGH: "superior",
        CLIENT_EDUCAȚIE: "Principalul criteriu de alegere",
        CLIENT_EDUC_MIDLE: "preț bun",
        CLIENT_EDUC_SPEC: "filtru de imagine",
        CLIENT_EDUC_HIGH: "profilul de brand și hardware ",
        CLIENT_EDUC_4:" vânzător Recomandări",
        CLIENT_OCCUPATION: "Ocuparea forței de muncă",
        CLIENT_OCCUP_WORKER: "angajat",
        CLIENT_OCCUP_HOUSE: "Casnică",
        CLIENT_OCCUP_BOSS: "Antreprenor",
        CLIENT_OCCUP_STUD: "Student",
        CLIENT_OCCUP_PENSION: "Pensionar",
        CLIENT_INFO_SOURCE: "sursa",
        CLIENT_INFO_PRESS: "Presă",
        CLIENT_INFO_FRIEND: "De la prieteni",
        CLIENT_INFO_ADV: "publicitate vizuala",
        SELECT_PLACEHOLD: 'selectați opțiunea dumneavoastră',
        //SELECT_AGE: "Alegeți vârsta",
        //SELECT_ADUCATION: "Alegeți educatia ta",
        //SELECT_OCCUPATION: "Alege muncă dumneavoastră",
        //SELECT_INFO_SOURCE: "Selectați sursa ",
        NO_DISASSEMBL: "fără demontare",
        STANDART_ASSEMBL: "standard",
        VIP_ASSEMBL: "montaj VIP",
        DISCOUNT: 'Discount',
        DISCOUNT_SELECT: 'Alegerea de reduceri',
        DISCOUNT_WITH: 'Având în vedere reduceri',
        DISCOUNT_WITHOUT: 'Discount Excluderea',
        DISCOUNT_WINDOW: 'Discount pe un produs',
        DISCOUNT_ADDELEM: 'Discount pe elemente suplimentare',
        ORDER_COMMENT: 'Nota Ordine',
        UNKNOWN: 'Necunoscut'
      },
      settings: {
        AUTHORIZATION: 'Autentificare:',
        CHANGE_PASSWORD: 'schimbați parola',
        CHANGE_LANGUAGE: 'Change language',
        PRIVATE_INFO: 'Informații personale:',
        USER_NAME: 'persoana de contact',
        CITY: 'oraș',
        ADD_PHONES: 'telefon suplimentar:',
        INSERT_PHONE: 'adaugați  nr de telefon',
        CLIENT_SUPPORT: 'suport clienți',
        LOGOUT: 'Ieșirea din aplicația',
        SAVE: 'Salvați',
        CURRENT_PASSWORD: 'Current',
        NEW_PASSWORD: 'nou',
        CONFIRM_PASSWORD: 'Confirmare',
        NO_CONFIRM_PASS: 'parolă incorectă'
      }

    });

})();


// translations/ru.js

(function(){
  'use strict';

  angular
    .module('BauVoiceApp')
    .constant('russianDictionary', {

      common_words: {
        CHANGE: 'Изменить',
        MONTHS: 'Январь, Февраль, Март, Апрель, Май, Июнь, Июль, Август, Сентябрь, Октябрь, Ноябрь, Декабрь',
        MONTHS_SHOT: 'Янв, Февр, Март, Апр, Май, Июнь, Июль, Авг, Сент, Окт, Ноя, Дек',
        MONTHA: 'Января, Февраля, Марта, Апреля, Мая, Июня, Июля, Августа, Сентября, Октября, Ноября, Декабря',
        MONTH_LABEL: 'месяц',
        MONTHA_LABEL: 'месяца',
        MONTHS_LABEL: 'месяцeв',
        ALL: 'Все',
        MIN: 'мин.',
        MAX: 'макс.',
        //----- confirm dialogs
        BUTTON_Y: 'ДА',
        BUTTON_N: 'НЕТ',
        DELETE_PRODUCT_TITLE: 'Удаление!',
        DELETE_PRODUCT_TXT: 'Хотите удалить продукт?',
        DELETE_ORDER_TITLE: 'Удаление заказа!',
        DELETE_ORDER_TXT: 'Хотите удалить заказ?',
        COPY_ORDER_TITLE: 'Копирование!',
        COPY_ORDER_TXT: 'Хотите сделать копию заказа?',
        SEND_ORDER_TITLE: 'В производство!',
        SEND_ORDER_TXT: 'Хотите отправить заказ на завод?',
        NEW_TEMPLATE_TITLE: 'Изменение шаблона',
        TEMPLATE_CHANGES_LOST: 'Изменения в шаблоне будут потеряны! Продолжить?',
        PAGE_REFRESH: 'Перезагрузка страницы приведет к потерю данных!',
        SELECT: 'Выбрать',
        AND: 'и',
        OK: 'OK',
        BACK: 'Назад',
        LETTER_M: 'м'
      },
      login: {
        ENTER: 'Войти',
        PASS_CODE: 'Сообщите этот код менеджеру.',
        YOUR_CODE: 'Ваш код: ',
        EMPTY_FIELD: 'Заполните это поле.',
        WRONG_NUMBER: 'Неверный номер.',
        SHORT_NAME: 'Слишком маленькое имя.',
        SHORT_PASSWORD: 'Слишком маленький пароль.',
        SHORT_PHONE: 'Слишком маленький номер телефона.',
        IMPORT_DB_START: 'Подождите, началась загрузка базы данных',
        IMPORT_DB_FINISH: 'Спасибо, загрузка завершена',
        MOBILE: 'Мобильный телефон',
        PASSWORD: 'Пароль',
        REGISTRATION: 'Регистрация',
        SELECT_COUNTRY: 'Веберите страну',
        SELECT_REGION: 'Выберите регион',
        SELECT_CITY: 'Выберите город',
        USER_EXIST: 'Такой пользователь уже существует! Попробуйте еще раз.',
        USER_NOT_EXIST: 'Такой пользователь не существует. Зарегистрируйтесь.',
        USER_NOT_ACTIVE: 'Вы не активировали Ваш профиль. Проверьте Вашу почту.',
        USER_CHECK_EMAIL: 'Подтвердительное письмо было отправлено Вам на почту.',
        SELECT_PRODUCER: 'Выберите производителя',
        SELECT_FACTORY: 'Вы не выбрали производителя',
        USER_PASSWORD_ERROR: 'Неверный пароль!',
        OFFLINE: 'Нет соединения с интернетом!',
        IMPORT_DB: 'Началась загрузка Баз данных! Подождите пожалуйста!'
      },
      mainpage: {
        MM: ' мм ',
        CLIMATE_ZONE: 'климатическая зона',
        THERMAL_RESISTANCE: 'теплопередачa',
        AIR_CIRCULATION: 'коэффициент воздухообмена',
        NAVMENU_GEOLOCATION: 'Выбрать расположение',
        NAVMENU_CURRENT_GEOLOCATION: 'Текущее расположение',
        NAVMENU_CURRENT_CALCULATION: 'Текущий расчет',
        NAVMENU_CART: 'Корзина расчета',
        NAVMENU_ADD_ELEMENTS: 'Доп. элементы',
        NAVMENU_ALL_CALCULATIONS: 'История заказов',
        NAVMENU_SETTINGS: 'Настройки',
        NAVMENU_MORE_INFO: 'Больше информации',
        NAVMENU_VOICE_HELPER: 'Голосовое управление',
        NAVMENU_CALCULATIONS: 'Расчеты',
        NAVMENU_APPENDIX: 'Приложение',
        NAVMENU_NEW_CALC: '+Новый расчет',
        CONFIGMENU_CONFIGURATION: 'Конфигурация и размеры',
        CONFIGMENU_SIZING: 'ширина * высота',
        CONFIGMENU_PROFILE: 'Профиль',
        CONFIGMENU_GLASS: 'Стеклопакет',
        CONFIGMENU_HARDWARE: 'Фурнитура',
        CONFIGMENU_LAMINATION: 'Ламинация',
        CONFIGMENU_LAMINATION_TYPE: 'в комнате / фасад',
        WHITE_LAMINATION: 'Белая',
        CONFIGMENU_ADDITIONAL: 'Дополнительно',
        CONFIGMENU_IN_CART: 'В корзину',
        VOICE_SPEACH: 'Говорите...',
        COMMENT: 'Оставьте свою заметку о заказе здесь.',
        ROOM_SELECTION1: 'Окно',
        ROOM_SELECTION2: 'Декор',
        ROOM_SELECTION3: 'Выбор шаблона',
        CONFIGMENU_NO_ADDELEMENTS: 'Доп.элементы не выбраны',
        HEATCOEF_VAL: 'Вт',
        TEMPLATE_TIP: 'Для изменения размеров нажмите сюда',
        PROFILE_TIP: 'Для выбора профиля нажмите сюда',
        GLASS_TIP: 'Для выбора стеклопакета нажмите сюда',
        SELECT_ALL: 'Выбрать все',
        SELECT_GLASS_WARN: 'Кликните на стеклопакет, который хотите изменить'
      },
      panels: {
        TEMPLATE_WINDOW: 'Oкно',
        TEMPLATE_BALCONY: 'Балкон',
        TEMPLATE_DOOR: 'Дверь',
        TEMPLATE_BALCONY_ENTER: 'Выход на балкон',
        TEMPLATE_EDIT: 'Редактировать',
        TEMPLATE_DEFAULT: 'Проект по умолчанию',
        COUNTRY: 'страна',
        BRAND: 'торговая марка',
        HEAT_INSULATION: 'теплоизоляция',
        NOICE_INSULATION: 'шумоизоляция',
        CORROSION_COEFF: 'aнтикоррозийность',
        BURGLAR_COEFF: 'противовзломность',
        LAMINAT_INSIDE: 'в комнате',
        LAMINAT_OUTSIDE: 'фасад',
        ONE_WINDOW_TYPE: 'Одностворчатое',
        TWO_WINDOW_TYPE: 'Двухстворчатое',
        THREE_WINDOW_TYPE: 'Трехстворчатое',
        CAMERa: 'камера',
        CAMER: 'камеры',
        CAMERs: 'камер',
        ENERGY_SAVE: '+энергосбережение',
        DOOR_TYPE1: 'по периметру',
        DOOR_TYPE2: 'без порога',
        DOOR_TYPE3: 'алюминиевый порог, тип',
        SASH_TYPE1: 'межкомнатная',
        SASH_TYPE2: 'дверная т-образная',
        SASH_TYPE3: 'оконная',
        HANDLE_TYPE1: 'нажимной гарнитур',
        HANDLE_TYPE2: 'стандартная офисная ручка',
        LOCK_TYPE1: 'однозапорный с защелкой',
        LOCK_TYPE2: 'многозапорный с защелкой'
      },
      add_elements: {
        CHOOSE: 'Выбрать',
        ADD: 'Добавить',
        GRID: 'москитная сетка',
        VISOR: 'козырек',
        SPILLWAY: 'водоотлив',
        OUTSIDE: 'наружные откосы',
        LOUVERS: 'жалюзи',
        INSIDE: 'внутренние откосы',
        CONNECTORS: 'соединитель',
        FAN: 'микропроветривание',
        WINDOWSILL: 'подоконник',
        HANDLEL: 'ручка',
        OTHERS: 'прочее',
        GRIDS: 'москитные сетки',
        VISORS: 'козырьки',
        SPILLWAYS: 'водоотливы',
        WINDOWSILLS: 'подоконники',
        HANDLELS: 'ручки',
        NAME_LABEL: 'наименование',
        ARTICUL_LABEL: 'aртикул',
        QTY_LABEL: 'шт.',
        SIZE_LABEL: 'размер',
        WIDTH_LABEL: 'ширина',
        HEIGHT_LABEL: 'высота',
        OTHER_ELEMENTS1: 'Еще',
        OTHER_ELEMENTS2: 'компонента...',
        SCHEME_VIEW: 'Схематически',
        LIST_VIEW: 'Cписок',
        INPUT_ADD_ELEMENT: 'Добавить компонент',
        CANCEL: 'Отмена',
        TOTAL_PRICE_TXT: 'Итого дополнительных компонентов на сумму:',
        ELEMENTS: 'компонентов',
        ELEMENT: 'компонент',
        ELEMENTA: 'компонента'
      },
      add_elements_menu: {
        TIP: 'Выберите элемент из списка',
        EMPTY_ELEMENT: 'Без элемента',
        TAB_NAME_SIMPLE_FRAME: 'Простая конструкция',
        TAB_NAME_HARD_FRAME: 'Составная конструкция',
        TAB_EMPTY_EXPLAIN: 'Выберите из списка первый элемент, чтобы начать составлять конструкцию.'
      },
      construction: {
        SASH_SHAPE: 'створки',
        ANGEL_SHAPE: 'углы',
        IMPOST_SHAPE: 'импосты',
        ARCH_SHAPE: 'арки',
        POSITION_SHAPE: 'позиция',
        UNITS_DESCRIP: 'В качестве единиц измерения используются миллиметры',
        PROJECT_DEFAULT: 'Проект по умолчанию',
        DOOR_CONFIG_LABEL: 'конфигурация двери',
        DOOR_CONFIG_DESCTIPT: 'рама двери',
        SASH_CONFIG_DESCTIPT: 'створка двери',
        HANDLE_CONFIG_DESCTIPT: 'ручка',
        LOCK_CONFIG_DESCTIPT: 'замок',
        STEP: 'шаг',
        LABEL_DOOR_TYPE: 'Выберите конструкцию рамы двери',
        LABEL_SASH_TYPE: 'Выберите тип створки двери',
        LABEL_HANDLE_TYPE: 'Выберите тип ручки',
        LABEL_LOCK_TYPE: 'Выберите тип замка',
        VOICE_SWITCH_ON: "голосовой режим включен",
        VOICE_NOT_UNDERSTAND: 'Не понятно',
        VOICE_SMALLEST_SIZE: 'слишком маленький размер',
        VOICE_BIGGEST_SIZE: "слишком большой размер",
        VOICE_SMALL_GLASS_BLOCK: "слишком маленький световой проем",
        NOT_AVAILABLE: 'Недоступно!'
      },
      history: {
        SEARCH_PLACEHOLDER: 'Поиск по ключевым словам',
        DRAFT_VIEW: 'Черновики расчетов',
        HISTORY_VIEW: 'История расчетов',
        PHONE: 'телефон',
        CLIENT: 'клиент',
        ADDRESS: 'адрес',
        FROM: 'от ',
        UNTIL: 'до ',
        PAYMENTS: 'платежей по',
        ALLPRODUCTS: 'изделий',
        ON: 'на',
        DRAFT: 'Черновик',
        DATE_RANGE: 'Диапазон дат',
        ALL_TIME: 'За все время',
        SORTING: 'Сортировка',
        NEWEST_FIRST: 'По времени: новые в начале',
        NEWEST_LAST: 'По времени: новые в конце',
        SORT_BY_TYPE: 'По типам',
        SORT_SHOW: 'Показать',
        SORT_SHOW_ACTIVE: 'Только активные',
        SORT_SHOW_WAIT: 'Только в ожидании',
        SORT_SHOW_DONE: 'Только завершенные',
        BY_YOUR_REQUEST: 'По вашему запросу',
        NOT_FIND: 'ничего не найдено',
        WAIT_MASTER: 'ожидает замерщика',
        INCLUDED: 'включены'
      },
      cart: {
        ALL_ADD_ELEMENTS: 'Все доп.элементы заказа',
        ADD_ORDER: 'Добавить изделие',
        PRODUCT_QTY: 'количество изделий',
        LIGHT_VIEW: 'Сокращенный вид',
        FULL_VIEW: 'Полный вид',
        DELIVERY: 'Доставка',
        SELF_EXPORT: 'самовывоз',
        FLOOR: 'этаж',
        ASSEMBLING: 'Монтаж',
        WITHOUT_ASSEMBLING: 'без монтажа',
        FREE: 'бесплатно',
        PAYMENT_BY_INSTALMENTS: 'Рассрочка',
        WITHOUT_INSTALMENTS: 'без рассрочки',
        DELIVERY_DATE: 'Дата поставки',
        TOTAL_PRICE_LABEL: 'Итого при поставке на',
        MONTHLY_PAYMENT_LABEL: 'ежемесячных платежа по',
        DATE_DELIVERY_LABEL: 'при поставке на',
        FIRST_PAYMENT_LABEL: 'Первый платеж',
        ORDER: 'Заказать',
        MEASURE: 'Замерить',
        READY: 'Готово',
        CALL_MASTER: 'Вызов замерщика для рассчета',
        CALL_MASTER_DESCRIP: 'Для вызова замерщика нам нужно кое-что о вас знать. Оба поля являются обязательными для заполнения.',
        CLIENT_LOCATION: 'Местоположение',
        CLIENT_ADDRESS: 'Адрес',
        CALL_ORDER: 'Оформление заказа для рассчета',
        CALL_ORDER_DESCRIP: 'Для того, чтобы выполнить заказ, мы должны кое-что о вас знать.',
        CALL_ORDER_CLIENT_INFO: 'Информация о клиенте (заполняйте обязательно):',
        CLIENT_NAME: 'Фамилия Имя Отчество',
        CALL_ORDER_DELIVERY: 'Доставить заказ на',
        CALL_ORDER_TOTAL_PRICE: 'Всего',
        CALL_ORDER_ADD_INFO: 'Дополнительно (заполняйте по желанию):',
        CLIENT_EMAIL: 'Электронная почта',
        ADD_PHONE: 'Дополнительный телефон',
        CALL_CREDIT: 'Оформление рассрочки и заказа для рассчета',
        CALL_CREDIT_DESCRIP: 'Для того, чтобы оформить рассрочку и выполнить заказ, мы должны кое-что о вас знать.',
        CALL_CREDIT_CLIENT_INFO: 'Рассрочка:',
        CREDIT_TARGET: 'Цель оформления рассрочки',
        CLIENT_ITN: 'Индивидуальный налоговый номер',
        CALL_START_TIME: 'Звонить от:',
        CALL_END_TIME: 'до:',
        CALL_CREDIT_PARTIAL_PRICE: 'по',
        ADDELEMENTS_EDIT_LIST: 'Редактировать список ...',
        ADDELEMENTS_PRODUCT_COST: 'в одном изделии',
        HEAT_TRANSFER: 'теплопередача',
        WRONG_EMAIL: 'Неверная электронная почта',
        LINK_BETWEEN_COUPLE: 'между парой',
        LINK_BETWEEN_ALL: 'между всеми',
//        LINK_DELETE_ALL_GROUPE: 'удалить все',
        CLIENT_SEX: 'Пол',
        CLIENT_SEX_M: 'M',
        CLIENT_SEX_F: 'Ж',
        CLIENT_AGE: 'Возраст',
        CLIENT_AGE_OLDER: 'старше',
        //CLIENT_EDUCATION: 'Образование',
        //CLIENT_EDUC_MIDLE: 'среднее',
        //CLIENT_EDUC_SPEC: 'среднее спец.',
        //CLIENT_EDUC_HIGH: 'высшее',
        CLIENT_EDUCATION: 'Главный критерий вашего выбора',
        CLIENT_EDUC_MIDLE: 'Выгодная цена',
        CLIENT_EDUC_SPEC: 'Имидж производителя',
        CLIENT_EDUC_HIGH: 'Бренд профиля или фурнитуры',
        CLIENT_EDUC_4: 'Рекомендации продавца',
        CLIENT_OCCUPATION: 'Занятость',
        CLIENT_OCCUP_WORKER: 'Служащий',
        CLIENT_OCCUP_HOUSE: 'Домохозяйка',
        CLIENT_OCCUP_BOSS: 'Предприниматель',
        CLIENT_OCCUP_STUD: 'Студент',
        CLIENT_OCCUP_PENSION: 'Пенсионер',
        CLIENT_INFO_SOURCE: 'Источник информации',
        CLIENT_INFO_PRESS: 'Пресса',
        CLIENT_INFO_FRIEND: 'От знакомых',
        CLIENT_INFO_ADV: 'Визуальная реклама',
        SELECT_PLACEHOLD: 'выберите свой вариант',
        //SELECT_AGE: 'Выберите Ваш возраст',
        //SELECT_ADUCATION: 'Выберите Ваше образование',
        //SELECT_OCCUPATION: 'Выберите Вашу занятость',
        //SELECT_INFO_SOURCE: 'Выберите источник информации',
        NO_DISASSEMBL: 'без демонтажа',
        STANDART_ASSEMBL: 'стандартный',
        VIP_ASSEMBL: 'VIP-монтаж',
        DISCOUNT: 'Cкидка',
        DISCOUNT_SELECT: 'Выбор скидки',
        DISCOUNT_WITH: 'С учетом скидки',
        DISCOUNT_WITHOUT: 'Без учета скидки',
        DISCOUNT_WINDOW: 'Скидка на изделие',
        DISCOUNT_ADDELEM: 'Скидка на дополнительные элементы',
        ORDER_COMMENT: 'Заметка о заказе',
        UNKNOWN: 'Не известно'
      },
      settings: {
        AUTHORIZATION: 'Авторизация:',
        CHANGE_PASSWORD: 'Изменить пароль',
        CHANGE_LANGUAGE: 'Изменить язык',
        PRIVATE_INFO: 'Личная информация:',
        USER_NAME: 'Контактное лицо',
        CITY: 'Город',
        ADD_PHONES: 'Дополнительные телефоны:',
        INSERT_PHONE: 'Добавить телефон',
        CLIENT_SUPPORT: 'Подержка пользователей',
        LOGOUT: 'Выйти из приложения',
        SAVE: 'Сохранить',
        CURRENT_PASSWORD: 'Текущий',
        NEW_PASSWORD: 'Новый',
        CONFIRM_PASSWORD: 'Подтвердить',
        NO_CONFIRM_PASS: 'Неверный пароль'
      }

    });

})();


// translations/ua.js

(function(){
  'use strict';

  angular
    .module('BauVoiceApp')
    .constant('ukrainianDictionary', {

      common_words: {
        CHANGE: 'Змінити',
        MONTHS: 'Січень, Лютий, Березень, Квітень, Травень, Червень, Липень, Серпень, Вересень, Жовтень, Листопад, Грудень',
        MONTHS_SHOT: 'Січ, Лют, Бер, Квіт, Трав, Черв, Лип, Серп, Вер, Жовт, Лист, Груд',
        MONTHA: 'Січня, Лютого, Березня, Квітня, Травня, Червня, Липня, Серпня, Вересня, Жовтня, Листопада, Грудня',
        MONTH_LABEL: 'місяць',
        MONTHA_LABEL: 'місяця',
        MONTHS_LABEL: 'місяців',
        ALL: 'Все',
        MIN: 'мін.',
        MAX: 'макс.',
        //----- confirm dialogs
        BUTTON_Y: 'ТАК',
        BUTTON_N: 'НІ',
        DELETE_PRODUCT_TITLE: 'Видалення!',
        DELETE_PRODUCT_TXT: 'Хочете видалити продукт?',
        DELETE_ORDER_TITLE: 'Видалення замовлення!',
        DELETE_ORDER_TXT: 'Хочете видалити замовлення?',
        COPY_ORDER_TITLE: 'Копіювання!',
        COPY_ORDER_TXT: 'Хочете зробити копію замовлення?',
        SEND_ORDER_TITLE: 'На виробництво!',
        SEND_ORDER_TXT: 'Хочете відправити замовлення на завод?',
        NEW_TEMPLATE_TITLE: 'Зміна шаблона',
        TEMPLATE_CHANGES_LOST: 'Зміни у шаблоні будуть загублені. Продовжити?',
        PAGE_REFRESH: 'Перезагрузка страницы приведет к потерю данных!',
        SELECT: 'Выбрать',
        AND: 'та',
        OK: 'OK',
        BACK: 'Назад',
        LETTER_M: 'м'
      },
      login: {
        ENTER: 'Увійти',
        PASS_CODE: 'Повідомте цей код менеджерові.',
        YOUR_CODE: 'Ваш код: ',
        EMPTY_FIELD: 'Заповніть це поле.',
        WRONG_NUMBER: 'Невірний номер.',
        SHORT_NAME: 'Слишком маленькое имя.',
        SHORT_PASSWORD: 'Занадто маленький пароль.',
        SHORT_PHONE: 'Занадто маленький номер телефона.',
        IMPORT_DB_START: 'Подождите, началась загрузка базы данных',
        IMPORT_DB_FINISH: 'Спасибо, загрузка завершена',
        MOBILE: 'Мобільный телефон',
        PASSWORD: 'Пароль',
        REGISTRATION: 'Регістрація',
        SELECT_COUNTRY: 'Веберите страну',
        SELECT_REGION: 'Выберите регион',
        SELECT_CITY: 'Выберите город',
        USER_EXIST: 'Такой пользователь уже существует! Попробуйте еще раз.',
        USER_NOT_EXIST: 'Такой пользователь не существует. Зарегистрируйтесь.',
        USER_NOT_ACTIVE: 'Вы не активировали Ваш профиль. Проверьте Вашу почту.',
        USER_CHECK_EMAIL: 'Подтвердительное письмо было отправлено Вам на почту.',
        SELECT_PRODUCER: 'Выберите производителя',
        SELECT_FACTORY: 'Вы не выбрали производителя',
        USER_PASSWORD_ERROR: 'Неверный пароль!',
        OFFLINE: 'Нема зв`язку з iнтернетом!',
        IMPORT_DB: 'Почалась загрузка Баз данних! Почекайте будь ласка!'
      },
      mainpage: {
        MM: ' мм ',
        CLIMATE_ZONE: 'кліматична зона',
        THERMAL_RESISTANCE: 'теплопередачa',
        AIR_CIRCULATION: 'коефіцієнт повітрообміну',
        NAVMENU_GEOLOCATION: 'Вибрати розташування',
        NAVMENU_CURRENT_GEOLOCATION: 'Поточне розташування',
        NAVMENU_CURRENT_CALCULATION: 'Поточний розрахунок',
        NAVMENU_CART: 'Кошик розрахунку',
        NAVMENU_ADD_ELEMENTS: 'Дод. елементи',
        NAVMENU_ALL_CALCULATIONS: 'Історія замовлень',
        NAVMENU_SETTINGS: 'Налаштування',
        NAVMENU_MORE_INFO: 'Більше інформації',
        NAVMENU_VOICE_HELPER: 'Голосове управління',
        NAVMENU_CALCULATIONS: 'Розрахунки',
        NAVMENU_APPENDIX: 'Додаток',
        NAVMENU_NEW_CALC: '+Новий розрахунок',
        CONFIGMENU_CONFIGURATION: 'Конфігурація і розміри',
        CONFIGMENU_SIZING: 'ширина * висота -',
        CONFIGMENU_PROFILE: 'Профіль',
        CONFIGMENU_GLASS: 'Склопакет',
        CONFIGMENU_HARDWARE: 'Фурнітура',
        CONFIGMENU_LAMINATION: 'Ламінація',
        CONFIGMENU_LAMINATION_TYPE: 'в кімнаті / фасад',
        WHITE_LAMINATION: 'Біла',
        CONFIGMENU_ADDITIONAL: 'Додатково',
        CONFIGMENU_IN_CART: 'В кошик',
        VOICE_SPEACH: 'Говоріть...',
        COMMENT: 'Залиште свою замітку про заказ тут.',
        ROOM_SELECTION1: 'Вiкно',
        ROOM_SELECTION2: 'Декор',
        ROOM_SELECTION3: 'Вибір шаблону',
        CONFIGMENU_NO_ADDELEMENTS: 'Дод.елементи не вибранi',
        HEATCOEF_VAL: 'Вт',
        TEMPLATE_TIP: 'Для зміни розмірів натисніть сюди',
        PROFILE_TIP: 'Для вибору профілю натисніть сюди',
        GLASS_TIP: 'Для вибору склопакета натисніть сюди',
        SELECT_ALL: 'Вибрати все',
        SELECT_GLASS_WARN: 'Натисніть на склопакет, який хочете змінити'
      },
      panels: {
        TEMPLATE_WINDOW: 'Вікно',
        TEMPLATE_BALCONY: 'Балкон',
        TEMPLATE_DOOR: 'Двері',
        TEMPLATE_BALCONY_ENTER: 'Вихід на балкон',
        TEMPLATE_EDIT: 'Редагувати',
        TEMPLATE_DEFAULT: 'Проект за умовчанням',
        COUNTRY: 'країна',
        BRAND: 'торгова марка',
        HEAT_INSULATION: 'теплоізоляція',
        NOICE_INSULATION: 'шумоізоляція',
        CORROSION_COEFF: 'aнтикорозійність',
        BURGLAR_COEFF: 'протизламність',
        LAMINAT_INSIDE: 'в кімнаті',
        LAMINAT_OUTSIDE: 'фасад',
        ONE_WINDOW_TYPE: 'Одностворчатое',
        TWO_WINDOW_TYPE: 'Двухстворчатое',
        THREE_WINDOW_TYPE: 'Трехстворчатое',
        CAMERa: 'камера',
        CAMER: 'камеры',
        CAMERs: 'камер',
        ENERGY_SAVE: '+энергосбережение',
        DOOR_TYPE1: 'по периметру',
        DOOR_TYPE2: 'без порога',
        DOOR_TYPE3: 'алюминевый порог, тип',
        SASH_TYPE1: 'межкомнатная',
        SASH_TYPE2: 'дверная т-образная',
        SASH_TYPE3: 'оконная',
        HANDLE_TYPE1: 'нажимной гарнитур',
        HANDLE_TYPE2: 'стандартная офисная ручка',
        LOCK_TYPE1: 'однозапорный с защелкой',
        LOCK_TYPE2: 'многозапорный с защелкой'
      },
      add_elements: {
        CHOOSE: 'Вибрати',
        ADD: 'Додати',
        GRID: 'москітна сітка',
        VISOR: 'Козирок',
        SPILLWAY: 'водовідлив',
        OUTSIDE: 'зовнішні укоси',
        LOUVERS: 'жалюзі',
        INSIDE: 'внутрішні укоси',
        CONNECTORS: 'з`єднувач',
        FAN: 'мікропровітрювання',
        WINDOWSILL: 'підвіконня',
        HANDLEL: 'ручка',
        OTHERS: 'інше',
        GRIDS: 'москітні сітки',
        VISORS: 'козирки',
        SPILLWAYS: 'водовідливи',
        WINDOWSILLS: 'підвіконня',
        HANDLELS: 'ручки',
        NAME_LABEL: 'найменування',
        ARTICUL_LABEL: 'aртикул',
        QTY_LABEL: 'шт.',
        SIZE_LABEL: 'розмір',
        WIDTH_LABEL: 'ширина',
        HEIGHT_LABEL: 'висота',
        OTHER_ELEMENTS1: 'Ще',
        OTHER_ELEMENTS2: 'компонента...',
        SCHEME_VIEW: 'Схематично',
        LIST_VIEW: 'Cписок',
        INPUT_ADD_ELEMENT: 'Додати компонент',
        CANCEL: 'Відміна',
        TOTAL_PRICE_TXT: 'Разом додаткових компонентів на суму:',
        ELEMENTS: 'компонентів',
        ELEMENT: 'компонент',
        ELEMENTA: 'компонента'
      },
      add_elements_menu: {
        TIP: 'Виберіть елемент зі списку',
        EMPTY_ELEMENT: 'Без элементу',
        TAB_NAME_SIMPLE_FRAME: 'Проста конструкція',
        TAB_NAME_HARD_FRAME: 'Складена конструкція',
        TAB_EMPTY_EXPLAIN: 'Виберіть зі списку перший елемент, щоб почати складати конструкцію.'
      },
      construction: {
        SASH_SHAPE: 'стулки',
        ANGEL_SHAPE: 'кути',
        IMPOST_SHAPE: 'імпости',
        ARCH_SHAPE: 'арки',
        POSITION_SHAPE: 'позиція',
        UNITS_DESCRIP: 'Як одиниці виміру використовуються міліметри',
        PROJECT_DEFAULT: 'Проект за умовчанням',
        DOOR_CONFIG_LABEL: 'конфігурація дверей',
        DOOR_CONFIG_DESCTIPT: 'рама дверей',
        SASH_CONFIG_DESCTIPT: 'стулка дверей',
        HANDLE_CONFIG_DESCTIPT: 'ручка',
        LOCK_CONFIG_DESCTIPT: 'замок',
        STEP: 'крок',
        LABEL_DOOR_TYPE: 'Виберіть конструкцію рами дверей',
        LABEL_SASH_TYPE: 'Виберіть тип стулки дверей',
        LABEL_HANDLE_TYPE: 'Виберіть тип ручки',
        LABEL_LOCK_TYPE: 'Виберіть тип замка',
        VOICE_SWITCH_ON: "голосовий режим включен",
        VOICE_NOT_UNDERSTAND: 'Не зрозуміло',
        VOICE_SMALLEST_SIZE: 'замалий розмір',
        VOICE_BIGGEST_SIZE: "завеликий розмір",
        VOICE_SMALL_GLASS_BLOCK: "слишком маленький световой проем",
        NOT_AVAILABLE: 'Недоступно!'
      },
      history: {
        SEARCH_PLACEHOLDER: 'Пошук за ключовими словами',
        DRAFT_VIEW: 'Чернетки розрахунків',
        HISTORY_VIEW: 'Історія розрахунків',
        PHONE: 'телефон',
        CLIENT: 'клієнт',
        ADDRESS: 'адреса',
        FROM: 'від ',
        UNTIL: 'до ',
        PAYMENTS: 'платежів по',
        ALLPRODUCTS: 'виробів',
        ON: 'на',
        DRAFT: 'Чернетка',
        DATE_RANGE: 'Діапазон дат',
        ALL_TIME: 'За весь час',
        SORTING: 'Сортування',
        NEWEST_FIRST: 'За часом: нові на початку',
        NEWEST_LAST: 'За часом: нові у кінці',
        SORT_BY_TYPE: 'По типах',
        SORT_SHOW: 'Показати',
        SORT_SHOW_ACTIVE: 'Тільки активні',
        SORT_SHOW_WAIT: 'Тільки в очікуванні',
        SORT_SHOW_DONE: 'Тільки завершені',
        BY_YOUR_REQUEST: 'По вашому запиту',
        NOT_FIND: 'нічого не знайдено',
        WAIT_MASTER: 'очікує замірювача',
        INCLUDED: 'включені'
      },
      cart: {
        ALL_ADD_ELEMENTS: 'Всі дод.елементи замовлення',
        ADD_ORDER: 'Додати виріб',
        PRODUCT_QTY: 'кількість виробів',
        LIGHT_VIEW: 'Скорочений вид',
        FULL_VIEW: 'Повний вид',
        DELIVERY: 'Доставка',
        SELF_EXPORT: 'самовивезення',
        FLOOR: 'поверх',
        ASSEMBLING: 'Монтаж',
        WITHOUT_ASSEMBLING: 'без монтажу',
        FREE: 'безкоштовно',
        PAYMENT_BY_INSTALMENTS: 'Розстрочка',
        WITHOUT_INSTALMENTS: 'без розстрочки',
        DELIVERY_DATE: 'Дата постачання',
        TOTAL_PRICE_LABEL: 'Разом при постачанні на',
        MONTHLY_PAYMENT_LABEL: 'щомісячних платежів по',
        DATE_DELIVERY_LABEL: 'при постачанні на',
        FIRST_PAYMENT_LABEL: 'Перший платіж',
        ORDER: 'Замовити',
        MEASURE: 'Заміряти',
        READY: 'Готово',
        CALL_MASTER: 'Виклик замірювача для розрахунку',
        CALL_MASTER_DESCRIP: 'Для виклику замірювача нам потрібно дещо про вас знати. Обидва поля є обов`язковими для заповнення.',
        CLIENT_LOCATION: 'Місце розташування',
        CLIENT_ADDRESS: 'Адреса',
        CALL_ORDER: 'Оформлення замовлення для розрахунку',
        CALL_ORDER_DESCRIP: 'Для того, щоб виконати замовлення, ми повинні дещо про вас знати.',
        CALL_ORDER_CLIENT_INFO: 'Інформація про клієнта (заповнюйте обов`язково):',
        CLIENT_NAME: 'Прізвище Ім`я По батькові',
        CALL_ORDER_DELIVERY: 'Доставити замовлення на',
        CALL_ORDER_TOTAL_PRICE: 'Загалом',
        CALL_ORDER_ADD_INFO: 'Додатково (заповнюйте за бажанням):',
        CLIENT_EMAIL: 'Електронна пошта',
        ADD_PHONE: 'Додатковий телефон',
        CALL_CREDIT: 'Оформлення розстрочки і замовлення для розрахунку',
        CALL_CREDIT_DESCRIP: 'Для того, щоб оформити розстрочку і виконати замовлення, ми повинні дещо про вас знати.',
        CALL_CREDIT_CLIENT_INFO: 'Розстрочка:',
        CREDIT_TARGET: 'Мета оформлення розстрочки',
        CLIENT_ITN: 'Індивідуальний податковий номер',
        CALL_START_TIME: 'Дзвонити від:',
        CALL_END_TIME: 'до:',
        CALL_CREDIT_PARTIAL_PRICE: 'по',
        ADDELEMENTS_EDIT_LIST: 'Редагувати список ...',
        ADDELEMENTS_PRODUCT_COST: 'в одному виробі',
        HEAT_TRANSFER: 'теплопередача',
        WRONG_EMAIL: 'Невірна електронна пошта',
        LINK_BETWEEN_COUPLE: 'між парою',
        LINK_BETWEEN_ALL: 'між усіма',
//        LINK_DELETE_ALL_GROUPE: 'видалити усі',
        CLIENT_SEX: 'Стать',
        CLIENT_SEX_M: 'Ч',
        CLIENT_SEX_F: 'Ж',
        CLIENT_AGE: 'Вік',
        CLIENT_AGE_OLDER: 'старше',
        //CLIENT_EDUCATION: 'Освіта',
        //CLIENT_EDUC_MIDLE: 'середнэ',
        //CLIENT_EDUC_SPEC: 'середнэ спец.',
        //CLIENT_EDUC_HIGH: 'вища',
        CLIENT_EDUCATION: 'Головний критерій вашого вибору',
        CLIENT_EDUC_MIDLE: 'Вигідна ціна',
        CLIENT_EDUC_SPEC: 'Імідж виробника',
        CLIENT_EDUC_HIGH: 'Бренд профілю або фурнітури',
        CLIENT_EDUC_4: 'Рекомендації продавця',
        CLIENT_OCCUPATION: 'Зайнятість',
        CLIENT_OCCUP_WORKER: 'Службовець',
        CLIENT_OCCUP_HOUSE: 'Домогосподарка',
        CLIENT_OCCUP_BOSS: 'Підприэмиць',
        CLIENT_OCCUP_STUD: 'Студент',
        CLIENT_OCCUP_PENSION: 'Пенсіонер',
        CLIENT_INFO_SOURCE: 'Джерело информаціі',
        CLIENT_INFO_PRESS: 'Преса',
        CLIENT_INFO_FRIEND: 'Від знайомих',
        CLIENT_INFO_ADV: 'Візуальна реклама',
        SELECT_PLACEHOLD: 'выберите свой вариант',
        //SELECT_AGE: 'Выберите Ваш возраст',
        //SELECT_ADUCATION: 'Выберите Ваше образование',
        //SELECT_OCCUPATION: 'Выберите Вашу занятость',
        //SELECT_INFO_SOURCE: 'Выберите источник информации',
        NO_DISASSEMBL: 'без демонтажа',
        STANDART_ASSEMBL: 'стандартный',
        VIP_ASSEMBL: 'VIP-монтаж',
        DISCOUNT: 'Знижка',
        DISCOUNT_SELECT: 'Вибір знижки',
        DISCOUNT_WITH: 'Зі знижкою',
        DISCOUNT_WITHOUT: 'Без знижки',
        DISCOUNT_WINDOW: 'Знижка на виріб',
        DISCOUNT_ADDELEM: 'Знижка на додаткові елементи',
        ORDER_COMMENT: 'Заметка о заказе',
        UNKNOWN: 'Не известно'
      },
      settings: {
        AUTHORIZATION: 'Авторизація:',
        CHANGE_PASSWORD: 'Змінити пароль',
        CHANGE_LANGUAGE: 'Змінити мову',
        PRIVATE_INFO: 'Особиста інформація:',
        USER_NAME: 'Контактна особа',
        CITY: 'Місто',
        ADD_PHONES: 'Додаткові телефони:',
        INSERT_PHONE: 'Додати телефон',
        CLIENT_SUPPORT: 'Підтримка користувачів',
        LOGOUT: 'Вийти з додатка',
        SAVE: 'Зберегти',
        CURRENT_PASSWORD: 'Поточний',
        NEW_PASSWORD: 'Новий',
        CONFIRM_PASSWORD: 'Підтвердити',
        NO_CONFIRM_PASS: 'Невірний пароль'
      }

    });

})();


// voicerec.js


// voicerec.js


var speechKit = new NuanceSpeechKitPlugin();


function doInit() {
    var serverURL = "cvq.nmdp.nuancemobility.net";
    speechKit.initialize("Credentials", serverURL, 443, false, function(r){printResult(r);}, function(e){printResult(e);} );
}

function doCleanup(){
    speechKit.cleanup( function(r){printResult(r);}, function(e){printResult(e);} );
}

function startRecognition(callback, progressCalback, languageLabel){
    var recInProcess = true,
        recognitionLanguage = languageLabel;
    console.log("Before startRecognition");
    speechKit.startRecognition("dictation", recognitionLanguage, function(r){printRecoResult(r);}, function(e){printRecoResult(e);} );
    console.log("After startRecognition");
    var tempObj = {};
   
    setTimeout(forceStop, 5000);
    
    function forceStop() {
        console.log("FORCE STOP" + recInProcess);
        if (recInProcess === true) {
            //inProcess = false;
            console.log("FORCE STOP");
            forceStopRecognition();
        }
    }
    
    function forceStopRecognition(){
        speechKit.stopRecognition(function(r){printRecoResult(r);}, function(e){console.log(e);} );
        
    }

    
    
    function printRecoResult(resultObject){
        if (resultObject.event == 'RecoVolumeUpdate'){
            console.log("RecoVolumeUpdate");
            if (progressCalback) {
                 progressCalback(resultObject.volumeLevel);
            }
        }
        else{
           
           parseAndCallback(resultObject);
        }
    }
    
    function parseAndCallback(resultObject){
        console.log("parseAndCallback" + resultObject.event);
        if (resultObject.results != undefined){
            if (resultObject.results.length > 0) {
                callback(resultObject.results[0].value);
                 recInProcess = false;
                return;
            }
        }
        if (resultObject.event != 'RecoStarted') {
            callback("0");
            recInProcess = false;
            return;
            
        }
    }
}


function stopRecognition(){
    speechKit.stopRecognition(function(r){printRecoResult(r);}, function(e){console.log(e);} );
    
}


function getResult(){
    speechKit.getResults(function(r){printResult(r);}, function(e){console.log("getResult" + e);} );
}



function printResult(resultObject){
    console.log("printResult " + resultObject.event);
}

function playTTS(text, languageLabel) {
    if (text.length > 0){
        console.log("Playing TTS");
        
        var ttsLanguageSelect = document.getElementById("tts-language");
        var ttsLanguage = languageLabel;
        speechKit.playTTS(text, ttsLanguage, null, function(r){printTTSResult(r);}, function(e){printTTSResult(e);} );
    }
    
    function printTTSResult(resultObject){
        console.log("printTTSResult " + JSON.stringify(resultObject));
    }

}

