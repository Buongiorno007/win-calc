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
      editProduct: editProduct,

      showAllAddElements: showAllAddElements
//      collectAllAddElems: collectAllAddElems,
//      getAddElemsPriceTotal: getAddElemsPriceTotal
    };

    return thisFactory.publicObj;




    //============ methods ================//



    //---------- parse Add Elements from LocalStorage
    function joinAllAddElements() {
      var productsQty = OrderStor.order.products.length,
          isExistElem = 0,
          typeElementsQty, elementsQty,
          product, tempElement;
      //------ cleaning allAddElements
      CartStor.cart.allAddElements.length = 0;
      CartStor.cart.isExistAddElems = 0;

      for(var prod = 0; prod < productsQty; prod++) {
        product = [];
        typeElementsQty = OrderStor.order.products[prod].chosenAddElements.length;
        for(var type = 0; type < typeElementsQty; type++) {
          elementsQty = OrderStor.order.products[prod].chosenAddElements[type].length;
          if(elementsQty > 0) {
            for(var elem = 0; elem < elementsQty; elem++) {
              tempElement = angular.copy(OrderStor.order.products[prod].chosenAddElements[type][elem]);
              tempElement.element_qty *= OrderStor.order.products[prod].product_qty;
              product.push(tempElement);
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







    /**======== ALL ADD LEMENTS PANEL ========*/

    /** show All Add Elements Panel */
    function showAllAddElements() {
      collectAllAddElems();
      getAddElemsPriceTotal();
      CartStor.cart.isAllAddElems = 1;
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
                      CartStor.cart.allAddElemsOrder[elemsOrderQty].element_qty = GeneralServ.roundingNumbers(CartStor.cart.allAddElemsOrder[elemsOrderQty].element_qty + addElemsSource[addElemsQty][prodQty].element_qty);
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
        CartStor.cart.addElemsOrderPriceTOTAL += OrderStor.order.products[productsQty].addelemPriceDis;
      }
      CartStor.cart.addElemsOrderPriceTOTAL = GeneralServ.roundingNumbers(CartStor.cart.addElemsOrderPriceTOTAL);
    }


  }
})();
