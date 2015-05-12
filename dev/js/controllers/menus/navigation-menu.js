(function(){
  'use strict';

  /**
   * @ngInject
   */

  angular
    .module('MainModule')
    .controller('NavMenuCtrl', navigationMenuCtrl);

  function navigationMenuCtrl($location, $filter, $timeout, $cordovaProgress, globalConstants, localDB, GeneralServ, MainServ, NavMenuServ, CartServ, GlobalStor, OrderStor, ProductStor) {

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
      thisCtrl.activeMenuItem = (thisCtrl.activeMenuItem === id) ? 0 : id;

      //-------- go to...
      switch(thisCtrl.activeMenuItem) {
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
          GeneralServ.stopStartProg();
          gotoAddElementsPanel();
          break;
        case 6:
          GeneralServ.stopStartProg();
          gotoHistoryPage();
          break;
        case 7:
          //------- set previos Page
          GeneralServ.setPreviosPage();
          $location.path('/settings');
          break;
        case 8:
          var ref = window.open('http://axorindustry.com', '_system');
          //------- switch off navMenuItem
          thisCtrl.activeMenuItem = 0;
          ref.close();
          break;
        case 9:
          NavMenuServ.switchVoiceHelper();
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







    //----------- Create new Project
    function clickNewProject() {

      //------- Start programm, without draft, for Main Page
      if(GlobalStor.global.startProgramm) {
        console.log('start Btn');
        GeneralServ.stopStartProg();
        MainServ.prepareMainPage();

      } else {
        //console.log('@@@@@@@@', JSON.stringify(GlobalStor.global));
        //$cordovaProgress.showSimple(true);

        //------- Create New Project with Draft saving in Main Page
        if(GlobalStor.global.isCreatedNewProject && GlobalStor.global.isCreatedNewProduct) {

          //------ save product in LocalDB
          MainServ.inputProductInOrder();
          console.log('@@@@@@@@ save product');
          //------- define order Price
          CartServ.calculateAllProductsPrice();
          OrderStor.order.orderPriceTOTAL = OrderStor.order.productsPriceTOTAL;
          //-------- save order as Draft
          MainServ.insertOrderInLocalDB({}, globalConstants.draftOrderType, '');

        //------- Create New Project with Draft saving in Cart Page
        } else if(GlobalStor.global.isCreatedNewProject && !GlobalStor.global.isCreatedNewProduct) {
          //-------- save order as Draft
          MainServ.insertOrderInLocalDB({}, globalConstants.draftOrderType, '');
        }

        //------- set previos Page
        GeneralServ.setPreviosPage();
        //=============== CREATE NEW PROJECT =========//
        MainServ.createNewProject();
        $timeout(function(){
          //$cordovaProgress.hide();
          $location.path('/main');
        }, 100);

      }


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



  }
})();