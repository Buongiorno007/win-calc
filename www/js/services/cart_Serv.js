
// services/cart_Serv.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('CartModule')
    .factory('CartServ', cartFactory);

  function cartFactory($location, $filter, $cordovaDialogs, localDB, GeneralServ, MainServ, GlobalStor, OrderStor, CartStor) {

    var thisFactory = this;

    thisFactory.publicObj = {
      joinAllAddElements: joinAllAddElements,
      increaseProductQty: increaseProductQty,
      decreaseProductQty: decreaseProductQty,
      addNewProductInOrder: addNewProductInOrder,
      clickDeleteProduct: clickDeleteProduct,
      calculateAllProductsPrice: calculateAllProductsPrice,
      calculateOrderPrice: calculateOrderPrice,
      editProduct: editProduct,

      showOrderDialog: showOrderDialog,
      setDefaultUserInfoXOrder: setDefaultUserInfoXOrder,
      closeOrderDialog: closeOrderDialog
    };

    return thisFactory.publicObj;




    //============ methods ================//


    //---------- parse Add Elements from LocalStorage
    function joinAllAddElements() {
      var productsQty = OrderStor.order.products.length,
          prod = 0,
          product;
      //------ cleaning allAddElements
      CartStor.cart.allAddElements.length = 0;

      for(; prod < productsQty; prod++) {
        product = [];
        var typeElementsQty = OrderStor.order.products[prod].chosenAddElements.length,
            type = 0;
        for(; type < typeElementsQty; type++) {
          var elementsQty = OrderStor.order.products[prod].chosenAddElements[type].length,
              elem = 0;
          if(elementsQty > 0) {
            //$scope.cart.isOrderHaveAddElements = true;
            for(; elem < elementsQty; elem++) {
              product.push(OrderStor.order.products[prod].chosenAddElements[type][elem]);
            }
          }
        }
        CartStor.cart.allAddElements.push(product);
      }
    }



    //------- add new product in order
    function addNewProductInOrder() {
      //$scope.global.isOpenedCartPage = false;
      GlobalStor.global.isCreatedNewProject = false;
      GlobalStor.global.isCreatedNewProduct = true;
      MainServ.prepareMainPage();
      $location.path('/main');
    }



    //----- Increase Product Qty
    function increaseProductQty(productIndex) {
      var newProductQty = OrderStor.order.products[productIndex].productQty + 1,
          productIdBD = productIndex + 1;
      OrderStor.order.products[productIndex].productQty = newProductQty;
      //------- Change product value in DB
      localDB.updateDB(localDB.productsTableBD, {"productQty": newProductQty}, {'orderId': {"value": OrderStor.order.orderId, "union": 'AND'}, "productId": productIdBD});
      calculateOrderPrice();
    }



    //----- Reduce Product Qty
    function decreaseProductQty(productIndex) {
      var newProductQty = OrderStor.order.products[productIndex].productQty;
      //----- if product 1 - delete product completely
      if(newProductQty === 1) {
        clickDeleteProduct(productIndex);
      } else {
        var productIdBD = productIndex + 1;
        --newProductQty;
        OrderStor.order.products[productIndex].productQty = newProductQty;
        //------ Change product value in DB
        localDB.updateDB(localDB.productsTableBD, {"productQty": newProductQty}, {'orderId': {"value": OrderStor.order.orderId, "union": 'AND'}, "productId": productIdBD});
        calculateOrderPrice();
      }
    }


    //----- Delete Product
    function clickDeleteProduct(productIndex) {

      $cordovaDialogs.confirm(
        $filter('translate')('common_words.DELETE_PRODUCT_TXT'),
        $filter('translate')('common_words.DELETE_PRODUCT_TITLE'),
        [$filter('translate')('common_words.BUTTON_Y'), $filter('translate')('common_words.BUTTON_N')])
        .then(function(buttonIndex) {
          deleteProduct(buttonIndex);
        });

      function deleteProduct(button) {
        if(button == 1) {
          //playSound('delete');
          OrderStor.order.products.splice(productIndex, 1);
          CartStor.cart.allAddElements.splice(productIndex, 1);

          if(GlobalStor.global.orderEditNumber > 0) {
            var productIdBD = productIndex + 1;
            localDB.deleteDB(localDB.productsTableBD, {'orderId': {"value": GlobalStor.global.orderEditNumber, "union": 'AND'}, "productId": productIdBD});
            localDB.deleteDB(localDB.addElementsTableBD, {'orderId': {"value": GlobalStor.global.orderEditNumber, "union": 'AND'}, "productId": productIdBD});
          }

          //----- if all products were deleted go to main page????
          if(OrderStor.order.products.length > 0 ) {
            //--------- Change order price
            calculateOrderPrice();
          } else {
            //$scope.global.createNewProjectCart();
            calculateOrderPrice();
            //TODO create new project
          }

        }

      }
    }



    //-------- Calculate Order Price
    function calculateOrderPrice() {
      calculateAllProductsPrice();
      //----- join together product prices and order option
      //TODO $scope.global.calculateTotalOrderPrice();
    }



    //-------- Calculate All Products Price
    function calculateAllProductsPrice() {
      var productsQty = OrderStor.order.products.length,
          prod = 0;
      OrderStor.order.productsPriceTOTAL = 0;
      for(; prod < productsQty; prod++) {
        OrderStor.order.productsPriceTOTAL += OrderStor.order.products[prod].productPriceTOTAL * OrderStor.order.products[prod].productQty;
      }
      OrderStor.order.productsPriceTOTAL = GeneralServ.roundingNumbers(OrderStor.order.productsPriceTOTAL);
    }





    //----- Edit Produtct in main page
    function editProduct(productIndex, type) {
//      GlobalStor.global.productEditNumber = productIndex;
//      ProductStor.product = angular.copy($scope.global.order.products[productIndex]);
//      if($scope.global.product.constructionType === 1) {
//        changeTemplateInArray($scope.global.product.templateIndex, $scope.global.templatesWindSource, $scope.global.templatesWindList, $scope.global.templatesWindIconList, $scope.global.product.templateSource,$scope.global.product.templateDefault, $scope.global.product.templateIcon);
//      } else if($scope.global.product.constructionType === 2) {
//        changeTemplateInArray($scope.global.product.templateIndex, $scope.global.templatesWindDoorSource, $scope.global.templatesWindDoorList, $scope.global.templatesWindDoorIconList, $scope.global.product.templateSource,$scope.global.product.templateDefault, $scope.global.product.templateIcon);
//      } else if($scope.global.product.constructionType === 3) {
//        changeTemplateInArray($scope.global.product.templateIndex, $scope.global.templatesBalconySource, $scope.global.templatesBalconyList, $scope.global.templatesBalconyIconList, $scope.global.product.templateSource,$scope.global.product.templateDefault, $scope.global.product.templateIcon);
//      } else if($scope.global.product.constructionType === 4) {
//        $scope.global.isConstructWind = false;
//        $scope.global.isConstructWindDoor = false;
//        $scope.global.isConstructBalcony = false;
//        $scope.global.isConstructDoor = true;
//        changeTemplateInArray($scope.global.product.templateIndex, $scope.global.templatesDoorSource, $scope.global.templatesDoorList, $scope.global.templatesDoorIconList, $scope.global.product.templateSource,$scope.global.product.templateDefault, $scope.global.product.templateIcon);
//      }
//      //------- refresh current templates arrays
//      $scope.global.getCurrentTemplates();
//      $scope.global.isCreatedNewProject = false;
//      $scope.global.isCreatedNewProduct = false;
//      $scope.global.isOpenedHistoryPage = false;
//      $scope.global.prepareMainPage();
//      if(type === 'auxiliary') {
//        $scope.global.showPanels = {};
//        $scope.global.showPanels.showAddElementsPanel = true;
//        $scope.global.isTemplatePanel = false;
//        $scope.global.isAddElementsPanel = true;
//      }
//      $location.path('/main');
    }









    function showOrderDialog() {
      //TODO globalStor
      /*
      if(OrderStor.order.isInstalment !== 'false') {
        CartStor.showCreditDialog = true;
      } else if() {
        CartStor.showOrderDialog = true;
      } else if() {
        CartStor.showMasterDialog = true;
      }
      */
    }

    //--------- this function uses into Order/Credit Dialog for create user object and set default values for select fields
    function setDefaultUserInfoXOrder() {
      return {
        sex: ''
      };
    }

    //---------- Close any Order Dialog
    function closeOrderDialog() {
      CartStor.showMasterDialog = false;
      CartStor.showOrderDialog = false;
      CartStor.showCreditDialog = false;
    }

  }
})();

