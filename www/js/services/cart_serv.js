
// services/cart_serv.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('CartModule')
    .factory('CartServ', cartFactory);

  function cartFactory($location, $filter, GeneralServ, MainServ, CartMenuServ, GlobalStor, OrderStor, ProductStor, CartStor) {

    var thisFactory = this;

    thisFactory.publicObj = {
      joinAllAddElements: joinAllAddElements,
      increaseProductQty: increaseProductQty,
      decreaseProductQty: decreaseProductQty,
      addNewProductInOrder: addNewProductInOrder,
      clickDeleteProduct: clickDeleteProduct,
      editProduct: editProduct
    };

    return thisFactory.publicObj;




    //============ methods ================//



    //---------- parse Add Elements from LocalStorage
    function joinAllAddElements() {
      var productsQty = OrderStor.order.products.length,
          product;
      //------ cleaning allAddElements
      CartStor.cart.allAddElements.length = 0;

      for(var prod = 0; prod < productsQty; prod++) {
        product = [];
        var typeElementsQty = OrderStor.order.products[prod].chosenAddElements.length;
        for(var type = 0; type < typeElementsQty; type++) {
          var elementsQty = OrderStor.order.products[prod].chosenAddElements[type].length;
          if(elementsQty > 0) {
            for(var elem = 0; elem < elementsQty; elem++) {
              product.push(OrderStor.order.products[prod].chosenAddElements[type][elem]);
            }
          }
        }
        CartStor.cart.allAddElements.push(product);
      }
    }



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


  }
})();

