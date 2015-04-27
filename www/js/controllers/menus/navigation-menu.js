
// controllers/menus/navigation-menu.js

(function(){
  'use strict';

  /**
   * @ngInject
   */

  angular
    .module('MainModule')
    .controller('NavMenuCtrl', navigationMenuCtrl);

  function navigationMenuCtrl($location, $filter, globalConstants, localDB, NavMenuServ, GlobalStor, OrderStor, ProductStor) {

    console.log('START NAV MENU!!!!!!');
    console.log('START Time!!!!!!', new Date());

    var thisCtrl = this;
    thisCtrl.global = GlobalStor.global;
    thisCtrl.order = OrderStor.order;
    thisCtrl.product = ProductStor.product;


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
      thisCtrl.activeMenuItem = ($scope.navMenu.activeMenuItem === id) ? 0 : id;

      //-------- go to...
      switch(thisCtrl.activeMenuItem) {
        case 1:
          $location.path('/location');
          break;
        case 2:
          NavMenuServ.getCurrentGeolocation().then(function() {
              //------- switch off navMenuItem
              thisCtrl.activeMenuItem = 0;
          });
          break;
        case 3:
          $location.path('/main');
          break;
        case 4:
          $location.path('/cart');
          break;
        case 5:
          gotoAddElementsPanel();
          break;
        case 6:
          gotoHistoryPage();
          break;
        case 7:
          $location.path('/settings');
          break;
        case 8:
          var ref = window.open('http://axorindustry.com', '_system');
          thisCtrl.activeMenuItem = 0;
          ref.close();
          break;
        case 9:
          switchVoiceHelper();
          break;
      }
    }





    function gotoAddElementsPanel() {
//      if(ProductStor.product.isAddElementsONLY) {
//        $scope.global.startProgramm = false;
//        $scope.global.isCreatedNewProject = false;
//        $scope.global.createNewProduct();
//      } else {
//        //------- create new empty product
//        ProductStor.product = ProductStor.setDefaultProduct();
//        ProductStor.product.isAddElementsONLY = true;
//        $scope.global.showNavMenu = false;
//        $scope.global.isConfigMenu = true;
//        $scope.global.showPanels = {};
//        $scope.global.showPanels.showAddElementsPanel = true;
//        $scope.global.isAddElementsPanel = true;
//      }
    }


//
//    $scope.gotoCurrentProduct = function () {
//      $scope.navMenu.activeMenuItem = false;
//      $scope.global.startProgramm = false;
//      $scope.global.isReturnFromDiffPage = true;
//      $scope.global.prepareMainPage();
//      $location.path('/main');
//    };

    function gotoHistoryPage() {
      GlobalStor.global.isNavMenu = false;
      //---- если идем в историю через корзину, заказ сохраняем в черновик
      /*if($scope.global.isOpenedCartPage) {
       $scope.global.insertOrderInLocalDB({}, $scope.global.draftOrderType, '');
       $scope.global.isCreatedNewProject = false;
       $scope.global.isCreatedNewProduct = false;
       }*/
      $location.path('/history');
    }


    function switchVoiceHelper() {
      GlobalStor.global.isVoiceHelper = !GlobalStor.global.isVoiceHelper;
      if(GlobalStor.global.isVoiceHelper) {
        //------- set Language for Voice Helper
        GlobalStor.global.voiceHelperLanguage = NavMenuServ.setLanguageVoiceHelper();
        playTTS($filter('translate')('construction.VOICE_SWITCH_ON'), GlobalStor.global.voiceHelperLanguage);
      }
    }




    //----------- Create new Project
    function clickNewProject() {

//      //------ если старт и на главной странице, не сохраняет в черновики
//      if($scope.global.startProgramm && !$scope.global.isOpenedHistoryPage && !$scope.global.isOpenedCartPage) {
//        console.log('start Btn');
//        $scope.global.startProgramm = false;
//        $scope.global.prepareMainPage();
//
//      //------- если после старта пошли в историю
//      } else if($scope.global.startProgramm && $scope.global.isOpenedHistoryPage && !$scope.global.isOpenedCartPage) {
//        console.log('start Btn from history');
//        $scope.global.startProgramm = false;
//        $scope.global.prepareMainPage();
//        //------- create new empty product
//        ProductStor.product = angular.copy(ProductStor.productDefault); //TODO
//        //------- create new empty order
//        $scope.global.order = angular.copy($scope.global.orderSource);
//        $location.path('/main');
//
//      //------- создание нового проекта с сохранением в черновик предыдущего незаконченного
//      } else if(!$scope.global.startProgramm && !$scope.global.isOrderFinished) {
//        //------- если находимся на главной странице или в истории
//        console.log('draft from history');
//        if(!$scope.global.isOpenedCartPage) {
//          //------ сохраняем черновик продукта в LocalDB
//          console.log('draft from main page');
//          $scope.global.inputProductInOrder();
//          $scope.global.order.orderPriceTOTAL = ProductStor.product.productPriceTOTAL;
//        }
//        //------ сохраняем черновик заказа в LocalDB
//        $scope.global.insertOrderInLocalDB({}, $scope.global.draftOrderType, '');
//        //------ create new order
//        $scope.global.isReturnFromDiffPage = false;
//        $scope.global.isChangedTemplate = false;
//        $scope.global.isCreatedNewProject = true;
//        $scope.global.isCreatedNewProduct = true;
//        $scope.global.prepareMainPage();
//        if($scope.global.isOpenedCartPage || $scope.global.isOpenedHistoryPage) {
//          //------- create new empty product
//          ProductStor.product = angular.copy(ProductStor.productDefault); //TODO
//          //------- create new empty order
//          $scope.global.order = angular.copy($scope.global.orderSource);
//          $location.path('/main');
//        } else {
//          $scope.global.createNewProject();
//        }
//
//      //------- создание нового проекта после сохранения заказа в истории
//      } else if(!$scope.global.startProgramm && $scope.global.isOrderFinished) {
//        console.log('order finish and new order!!!!');
//        //------ create new order
//        $scope.global.isReturnFromDiffPage = false;
//        $scope.global.isChangedTemplate = false;
//        $scope.global.isCreatedNewProject = true;
//        $scope.global.isCreatedNewProduct = true;
//        $scope.global.isOrderFinished = false;
//        $scope.global.prepareMainPage();
//        //------- create new empty product
//        ProductStor.product = angular.copy(ProductStor.productDefault); //TODO
//        //------- create new empty order
//        $scope.global.order = angular.copy($scope.global.orderSource);
//        $location.path('/main');
//      }

    }






//



//
//
//
//    //-------- save Order into Local DB
//    $scope.global.insertOrderInLocalDB = function(newOptions, orderType, orderStyle) {
//      var orderData = {};
//
//      $scope.global.order.orderType = orderType;
//      $scope.global.order.orderStyle = orderStyle;
//      $scope.global.order.productsQty = $scope.global.order.products.length;
//      $scope.global.order.productsPriceTOTAL = parseFloat($scope.global.order.productsPriceTOTAL.toFixed(2));
//      $scope.global.order.paymentFirst = parseFloat($scope.global.order.paymentFirst.toFixed(2));
//      $scope.global.order.paymentMonthly = parseFloat($scope.global.order.paymentMonthly.toFixed(2));
//      $scope.global.order.paymentFirstPrimary = parseFloat($scope.global.order.paymentFirstPrimary.toFixed(2));
//      $scope.global.order.paymentMonthlyPrimary = parseFloat($scope.global.order.paymentMonthlyPrimary.toFixed(2));
//      $scope.global.order.orderPriceTOTAL = parseFloat($scope.global.order.orderPriceTOTAL.toFixed(2));
//      $scope.global.order.orderPriceTOTALPrimary = parseFloat($scope.global.order.orderPriceTOTALPrimary.toFixed(2));
//      angular.extend($scope.global.order, newOptions);
//      //------- save order in orders LocalStorage
//      if(!$scope.global.orderEditNumber || $scope.global.orderEditNumber < 0) {
//        $scope.global.orders.push($scope.global.order);
//      }
//      //console.log(JSON.stringify($scope.global.order));
//      //------- save order in LocalDB
//      orderData = angular.copy($scope.global.order);
//      delete orderData.products;
//
//      //console.log('$scope.global.order.orderStyle === ', $scope.global.order);
//      localDB.insertDB(localDB.ordersTableBD, orderData);
//
//    };
//
//    //-------- delete order from LocalDB
//    $scope.global.deleteOrderFromLocalDB = function(orderNum) {
//      localDB.deleteDB(localDB.ordersTableBD, {'orderId': orderNum});
//      localDB.deleteDB(localDB.productsTableBD, {'orderId': orderNum});
//      localDB.deleteDB(localDB.addElementsTableBD, {'orderId': orderNum});
//    };


  }
})();
