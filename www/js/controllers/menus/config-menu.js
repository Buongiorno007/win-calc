
// controllers/menus/config-menu.js

(function(){
  'use strict';

  /**
   * @ngInject
   */

  angular
    .module('MainModule')
    .controller('ConfigMenuCtrl', glassSelectorCtrl);

  function glassSelectorCtrl(globalConstants, localDB, GlobalStor, OrderStor, ProductStor) {

    console.log('START CONFIG MENU!!!!!!');
    var thisCtrl = this;
    thisCtrl.constants = globalConstants;
    thisCtrl.global = GlobalStor.global;
    thisCtrl.order = OrderStor.order;
    thisCtrl.product = ProductStor.product;


    thisCtrl.config = {
      DELAY_START: globalConstants.STEP,
      DELAY_SHOW_CONFIG_LIST: 5 * globalConstants.STEP,
      DELAY_SHOW_FOOTER: 5 * globalConstants.STEP,
      DELAY_TYPE_ITEM_TITLE: 10 * globalConstants.STEP,
      DELAY_SHOW_U_COEFF: 20 * globalConstants.STEP,
      DELAY_GO_TO_CART: 2 * globalConstants.STEP,
      typing: 'on'
    };

    GlobalStor.global.isOpenedCartPage = false;
    GlobalStor.global.isOpenedHistoryPage = false;

    //------ clicking

    thisCtrl.selectConfigPanel = selectConfigPanel;


    //============ methods ================//


    //------- Select menu item

    function selectConfigPanel(id) {
      //------- if panel is opened yet
      if(GlobalStor.global.activePanel === id) {
        GlobalStor.global.activePanel = 0;
      } else {
        GlobalStor.global.activePanel = id;
      }

      GlobalStor.global.isWindowSchemeDialog = false;
      GlobalStor.global.isAddElementListView = false;
      GlobalStor.global.isFocusedAddElement = false;
      GlobalStor.global.isTabFrame = false;
      GlobalStor.global.showAddElementsMenu = false;
//      GlobalStor.global.desactiveAddElementParameters();
    }








//
//
//    // Save Product in Order and enter in Cart
//    $scope.global.inputProductInOrder = function() {
//
//      //=========== if no EDIT product
//      if ($scope.global.productEditNumber === '') {
//
//        //-------- add product in order LocalStorage
//        $scope.global.product.orderId = $scope.global.order.orderId;
//        $scope.global.product.productId = ($scope.global.order.products.length > 0) ? ($scope.global.order.products.length + 1) : 1;
//        $scope.global.order.products.push($scope.global.product);
//        $scope.global.order.productsQty = $scope.global.order.products.length;
//        $scope.insertProductInLocalDB($scope.global.product);
//
//        if($scope.global.orderEditNumber > 0) {
//          for(var ord = 0; ord < $scope.global.orders.length; ord++) {
//            if ($scope.global.orders[ord].orderId === $scope.global.orderEditNumber) {
//              $scope.global.orders[ord] = angular.copy($scope.global.order);
//            }
//          }
//        }
//
//      } else {
//        //-------- replace product in order LocalStorage
//        for(var prod = 0; prod < $scope.global.order.products.length; prod++) {
//          if(prod === $scope.global.productEditNumber) {
//            $scope.global.order.products[prod] = angular.copy($scope.global.product);
//            if($scope.global.orderEditNumber > 0) {
//              for(var ord = 0; ord < $scope.global.orders.length; ord++) {
//                if ($scope.global.orders[ord].orderId === $scope.global.orderEditNumber) {
//                  $scope.global.orders[ord] = angular.copy($scope.global.order);
//                }
//              }
//
//            }
//          }
//        }
//
//        $scope.editProductInLocalDB($scope.global.product);
//
//      }
//
//      $scope.global.isCreatedNewProject = false;
//      $scope.global.isCreatedNewProduct = false;
//
//    };
//
//    $scope.insertProductInLocalDB = function(product) {
//
//      var productData = angular.copy(product),
//          addElementsData = {},
//          addElementsObj = product.chosenAddElements;
//
//      if($scope.global.isConstructWind) {
//        productData.constructionType = 1;
//      } else if($scope.global.isConstructWindDoor) {
//        productData.constructionType = 2;
//      } else if($scope.global.isConstructBalcony) {
//        productData.constructionType = 3;
//      } else if($scope.global.isConstructDoor) {
//        productData.constructionType = 4;
//      }
//
//
//      //-------- insert product into local DB
//      //productData.orderId = product.orderID;
//      productData.heatTransferMin = UserStor.userInfo.currHeatTransfer;
//      productData.templateSource = JSON.stringify(product.templateSource);
//      productData.laminationOutPrice = parseFloat(product.laminationOutPrice.toFixed(2));
//      productData.laminationInPrice = parseFloat(product.laminationInPrice.toFixed(2));
//      productData.templatePriceSELECT = parseFloat(product.templatePriceSELECT.toFixed(2));
//      productData.laminationPriceSELECT = parseFloat(product.laminationPriceSELECT.toFixed(2));
//      productData.addElementsPriceSELECT = parseFloat(product.addElementsPriceSELECT.toFixed(2));
//      productData.productPriceTOTAL = parseFloat(product.productPriceTOTAL.toFixed(2));
//      delete productData.templateDefault;
//      delete productData.templateIcon;
//      delete productData.chosenAddElements;
//      localDB.insertDB(localDB.productsTableBD, productData);
//
//
//      //--------- insert additional elements into local DB
//      for(var prop in addElementsObj) {
//        if (!addElementsObj.hasOwnProperty(prop)) {
//          continue;
//        }
//        for (var elem = 0; elem < addElementsObj[prop].length; elem++) {
//          addElementsData = {
//            "orderId": product.orderId,
//            "productId": product.productId,
//            "elementId": addElementsObj[prop][elem].elementId,
//            "elementType": addElementsObj[prop][elem].elementType,
//            "elementName": addElementsObj[prop][elem].elementName,
//            "elementWidth": addElementsObj[prop][elem].elementWidth,
//            "elementHeight": addElementsObj[prop][elem].elementHeight,
//            "elementColor": addElementsObj[prop][elem].elementColor,
//            "elementPrice": addElementsObj[prop][elem].elementPrice,
//            "elementQty": addElementsObj[prop][elem].elementQty
//          };
//
//          localDB.insertDB(localDB.addElementsTableBD, addElementsData);
//        }
//      }
//    };
//
//
//
//    $scope.editProductInLocalDB = function(product) {
//      console.log('!!!!!!!!',product);
//      localDB.deleteDB(localDB.productsTableBD, {'orderId': {"value": product.orderId, "union": 'AND'}, "productId": product.productId});
//      localDB.deleteDB(localDB.addElementsTableBD, {'orderId': {"value": product.orderId, "union": 'AND'}, "productId": product.productId});
//      $scope.insertProductInLocalDB(product);
//    };
//
//
//
//    //--------- moving to Cart when click on Cart button
//    $scope.movetoCart = function() {
//      $timeout(function(){
//        $scope.global.gotoCartPage();
//      }, $scope.configMenu.DELAY_GO_TO_CART);
//    };



  }
})();
