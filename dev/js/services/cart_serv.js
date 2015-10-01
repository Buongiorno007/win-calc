(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('CartModule')
    .factory('CartServ', cartFactory);

  function cartFactory($location, $q, $filter, $cordovaDialogs, localDB, GeneralServ, MainServ, CartMenuServ, SVGServ, GlobalStor, OrderStor, ProductStor, CartStor, UserStor) {

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
      createDiscontsList: createDiscontsList,
      changeProductPriceAsDiscount: changeProductPriceAsDiscount,
      changeAddElemPriceAsDiscount: changeAddElemPriceAsDiscount
    };

    return thisFactory.publicObj;




    //============ methods ================//


    //----------- create Discount List
    function createDiscontsList() {
      var discounts = {
            constr: [],
            addElem: []
          },
          multipl = 5,
          discQty = UserStor.userInfo.discountConstrMax/multipl,
          discAddQty = UserStor.userInfo.discountAddElemMax/multipl,
          d = 0, da = 0;
      for(; d <= discQty; d++) {
        discounts.constr.push( (d * multipl) );
      }
      for(; da <= discAddQty; da++) {
        discounts.addElem.push( (da * multipl) );
      }
      return discounts;
    }



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
            //$scope.cart.isOrderHaveAddElements = true;
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
      var newProductQty = OrderStor.order.products[productIndex].product_qty + 1,
          productIdBD = productIndex + 1;
      OrderStor.order.products[productIndex].product_qty = newProductQty;
      //------- Change product value in DB

      //TODO localDB.updateDB(localDB.productsTableBD, {"productQty": newProductQty}, {'orderId': {"value": OrderStor.order.orderId, "union": 'AND'}, "productId": productIdBD});
      calculateOrderPrice();
    }



    //----- Reduce Product Qty
    function decreaseProductQty(productIndex) {
      var newProductQty = OrderStor.order.products[productIndex].product_qty;
      //----- if product 1 - delete product completely
      if(newProductQty === 1) {
        clickDeleteProduct(productIndex);
      } else {
        var productIdBD = productIndex + 1;
        --newProductQty;
        OrderStor.order.products[productIndex].product_qty = newProductQty;
        //------ Change product value in DB

        //TODO localDB.updateDB(localDB.productsTableBD, {"productQty": newProductQty}, {'orderId': {"value": OrderStor.order.orderId, "union": 'AND'}, "productId": productIdBD});
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

            //TODO localDB.deleteDB(localDB.productsTableBD, {'orderId': {"value": GlobalStor.global.orderEditNumber, "union": 'AND'}, "productId": productIdBD});
            //TODO localDB.deleteDB(localDB.addElementsTableBD, {'orderId': {"value": GlobalStor.global.orderEditNumber, "union": 'AND'}, "productId": productIdBD});
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
      CartMenuServ.calculateTotalOrderPrice();
    }



    //-------- Calculate All Products Price
    function calculateAllProductsPrice() {
      var productsQty = OrderStor.order.products.length;
      OrderStor.order.templates_price = 0;
      OrderStor.order.addelems_price = 0;
      OrderStor.order.products_price = 0;
      OrderStor.order.productsPriceDis = 0;
      while(--productsQty > -1) {
        OrderStor.order.addelems_price += OrderStor.order.products[productsQty].addelem_price * OrderStor.order.products[productsQty].product_qty;
        OrderStor.order.templates_price += OrderStor.order.products[productsQty].template_price * OrderStor.order.products[productsQty].product_qty;
        OrderStor.order.products_price += OrderStor.order.products[productsQty].product_price * OrderStor.order.products[productsQty].product_qty;
        OrderStor.order.productsPriceDis += OrderStor.order.products[productsQty].productPriceDis * OrderStor.order.products[productsQty].product_qty;
      }
      OrderStor.order.addelems_price = GeneralServ.roundingNumbers(OrderStor.order.addelems_price);
      OrderStor.order.templates_price = GeneralServ.roundingNumbers(OrderStor.order.templates_price);
      OrderStor.order.products_price = GeneralServ.roundingNumbers(OrderStor.order.products_price);
      OrderStor.order.productsPriceDis = GeneralServ.roundingNumbers(OrderStor.order.productsPriceDis);
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
        GlobalStor.global.activePanel = 5;
      }
      //------- set previos Page
      GeneralServ.setPreviosPage();
      $location.path('/main');
    }






    function changeAddElemPriceAsDiscount(discount) {
      var productQty = OrderStor.order.products.length;
      for(var prod = 0; prod < productQty; prod++) {
        var templatePriceDis =  OrderStor.order.products[prod].productPriceDis - OrderStor.order.products[prod].addelemPriceDis;
        OrderStor.order.products[prod].addelemPriceDis = GeneralServ.setPriceDis(OrderStor.order.products[prod].addelem_price, discount);
        OrderStor.order.products[prod].productPriceDis = GeneralServ.roundingNumbers(templatePriceDis + OrderStor.order.products[prod].addelemPriceDis);

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
      calculateOrderPrice();
    }


    function changeProductPriceAsDiscount(discount) {
      var productQty = OrderStor.order.products.length;
      for(var prod = 0; prod < productQty; prod++) {
        OrderStor.order.products[prod].productPriceDis = angular.copy( GeneralServ.roundingNumbers( GeneralServ.setPriceDis(OrderStor.order.products[prod].template_price, discount) + OrderStor.order.products[prod].addelemPriceDis ));
      }
      calculateOrderPrice();
    }


  }
})();
