
// services/cart_serv.js

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
//      downloadOrder: downloadOrder,
//      downloadProducts: downloadProducts,
//      downloadAddElements: downloadAddElements,
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

    //TODO
//    function setOrderPriceByDiscount(order) {
//      order.orderPriceTOTALDis = (order.construct_price_total * (1 - order.discount_construct/100)) + (order.addelem_price_total * (1 - order.discount_addelem/100)) + order.floor_price + order.mounting_price;
//      if(order.is_date_price_less) {
//        order.orderPriceTOTALDis -= order.delivery_price;
//      } else if(order.is_date_price_more) {
//        order.orderPriceTOTALDis += order.delivery_price;
//      }
//      order.orderPriceTOTALDis = GeneralServ.roundingNumbers(order.orderPriceTOTALDis);
//    }



    //TODO
    //    function editProductInLocalDB(product) {
    //      console.log('!!!!Edit!!!!',product);
    //      localDB.deleteDB(localDB.productsTableBD, {'orderId': {"value": product.orderId, "union": 'AND'}, "productId": product.productId});
    //      localDB.deleteDB(localDB.addElementsTableBD, {'orderId': {"value": product.orderId, "union": 'AND'}, "productId": product.productId});
    //      insertProductInLocalDB(product);
    //    }



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
      OrderStor.order.construct_price_total = 0;
      OrderStor.order.addelem_price_total = 0;
      OrderStor.order.products_price_total = 0;
      CartStor.cart.productsPriceTOTALDis = 0;
      while(--productsQty > -1) {
        OrderStor.order.addelem_price_total += OrderStor.order.products[productsQty].addelem_price * OrderStor.order.products[productsQty].product_qty;
        OrderStor.order.construct_price_total += OrderStor.order.products[productsQty].template_price * OrderStor.order.products[productsQty].product_qty;
        OrderStor.order.products_price_total += OrderStor.order.products[productsQty].product_price * OrderStor.order.products[productsQty].product_qty;
        CartStor.cart.productsPriceTOTALDis += OrderStor.order.products[productsQty].productPriceTOTALDis * OrderStor.order.products[productsQty].product_qty;
      }
      OrderStor.order.addelem_price_total = GeneralServ.roundingNumbers(OrderStor.order.addelem_price_total);
      OrderStor.order.construct_price_total = GeneralServ.roundingNumbers(OrderStor.order.construct_price_total);
      OrderStor.order.products_price_total = GeneralServ.roundingNumbers(OrderStor.order.products_price_total);
      CartStor.cart.productsPriceTOTALDis = GeneralServ.roundingNumbers(CartStor.cart.productsPriceTOTALDis);
    }





    //----- Edit Produtct in main page
    function editProduct(productIndex, type) {
      GlobalStor.global.productEditNumber = productIndex;
      ProductStor.product = angular.copy(OrderStor.order.products[productIndex]);
      //GlobalStor.global.isCreatedNewProject = false;
      GlobalStor.global.isCreatedNewProduct = true;
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
        var oldDiff =  OrderStor.order.products[prod].productPriceTOTALDis - OrderStor.order.products[prod].addElementsPriceSELECTDis;
        OrderStor.order.products[prod].addElementsPriceSELECTDis = angular.copy( GeneralServ.roundingNumbers( OrderStor.order.products[prod].addelem_price * (1 - discount/100) ) );
        OrderStor.order.products[prod].productPriceTOTALDis = angular.copy( GeneralServ.roundingNumbers( oldDiff + OrderStor.order.products[prod].addElementsPriceSELECTDis ));

        var addElemsQty = OrderStor.order.products[prod].chosenAddElements.length;
        for(var elem = 0; elem < addElemsQty; elem++) {
          var elemQty = OrderStor.order.products[prod].chosenAddElements[elem].length;
          if (elemQty > 0) {
            for (var item = 0; item < elemQty; item++) {
              OrderStor.order.products[prod].chosenAddElements[elem][item].elementPriceDis = angular.copy( GeneralServ.roundingNumbers( OrderStor.order.products[prod].chosenAddElements[elem][item].element_price * (1 - discount/100) ) );
            }
          }
        }
      }
      calculateOrderPrice();
    }


    function changeProductPriceAsDiscount(discount) {
      var productQty = OrderStor.order.products.length;
      for(var prod = 0; prod < productQty; prod++) {
        var oldDiff =  (OrderStor.order.products[prod].product_price - OrderStor.order.products[prod].addelem_price) * (1 - discount/100);
        OrderStor.order.products[prod].productPriceTOTALDis = angular.copy( GeneralServ.roundingNumbers( oldDiff + OrderStor.order.products[prod].addElementsPriceSELECTDis ));
      }
      calculateOrderPrice();
    }


  }
})();

