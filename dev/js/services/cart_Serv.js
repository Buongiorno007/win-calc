(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('CartModule')
    .factory('CartServ', cartFactory);

  function cartFactory($location, $q, $filter, $cordovaDialogs, localDB, GeneralServ, MainServ, CartMenuServ, GlobalStor, OrderStor, ProductStor, CartStor) {

    var thisFactory = this;

    thisFactory.publicObj = {
      cleanAllTemplatesInOrder: cleanAllTemplatesInOrder,
      downloadOrder: downloadOrder,
      downloadProducts: downloadProducts,
      downloadAddElements: downloadAddElements,
      joinAllAddElements: joinAllAddElements,
      increaseProductQty: increaseProductQty,
      decreaseProductQty: decreaseProductQty,
      addNewProductInOrder: addNewProductInOrder,
      clickDeleteProduct: clickDeleteProduct,
      calculateAllProductsPrice: calculateAllProductsPrice,
      calculateOrderPrice: calculateOrderPrice,
      editProduct: editProduct
    };

    return thisFactory.publicObj;




    //============ methods ================//

    //------ clean template in products
    function cleanAllTemplatesInOrder() {
      var productsQty = OrderStor.order.products.length,
          prod = 0;
      for(; prod < productsQty; prod++) {
        if(OrderStor.order.products[prod].template) {
          delete OrderStor.order.products[prod].template;
        }
      }
    }

    function downloadOrder() {
      localDB.selectDB(localDB.ordersTableBD, {'orderId': GlobalStor.global.orderEditNumber}).then(function(result) {
        if(result) {
          angular.extend(OrderStor.order, result[0]);
          //---- fill form
          CartStor.fillOrderForm();
        } else {
          console.log(result);
        }
      });
    }


    //------ Download All Products Data for Order
    function downloadProducts() {
      var deferred = $q.defer();
      localDB.selectDB(localDB.productsTableBD, {'orderId': GlobalStor.global.orderEditNumber}).then(function(result) {
        if(result) {
          var editedProducts = angular.copy(result),
            editedProductsQty = editedProducts.length,
            prod = 0;

          //------------- parsing All Templates Source and Icons for Order
          for(; prod < editedProductsQty; prod++) {
            ProductStor.product = ProductStor.setDefaultProduct();
            angular.extend(ProductStor.product, editedProducts[prod]);

            //----- checking product with design or only addElements
            if(!ProductStor.product.isAddElementsONLY || ProductStor.product.isAddElementsONLY === 'false') {
              //----- parsing design from string to object
              ProductStor.product.templateSource = parsingTemplateSource(ProductStor.product.templateSource);
//              console.log('templateSource', ProductStor.product.templateSource);
              //----- find depths and build design icon
              MainServ.setCurrentProfile().then(function(){
                ProductStor.product.templateIcon = new TemplateIcon(ProductStor.product.templateSource, GlobalStor.global.profileDepths);
                //console.log('++++++templateIcon+++', ProductStor.product.templateIcon);
                deferred.resolve('done');
              });
            } else {
              deferred.resolve('done');
            }
            OrderStor.order.products.push(ProductStor.product);
          }

        } else {
          deferred.reject(result);
        }
      });
      return deferred.promise;
    }


    //------ Download All Add Elements from LocalDB
    function downloadAddElements() {
      var deferred = $q.defer();
      localDB.selectDB(localDB.addElementsTableBD, {'orderId': GlobalStor.global.orderEditNumber}).then(function(result) {
        if(result) {
//          console.log('results.data === ', result);
          var allAddElements = angular.copy(result),
              allAddElementsQty = allAddElements.length,
              elem = 0;

          for(; elem < allAddElementsQty; elem++) {
            var prod = 0;
            for(; prod < OrderStor.order.productsQty; prod++) {
              if(allAddElements[elem].productId === OrderStor.order.products[prod].productId) {
                OrderStor.order.products[prod].chosenAddElements[allAddElements[elem].elementType].push(allAddElements[elem]);
                deferred.resolve('done');
              }
            }
          }

        } else {
          deferred.resolve('done');
        }
      });
      return deferred.promise;
    }






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
      //------- set previos Page
      GeneralServ.setPreviosPage();
      GlobalStor.global.isCreatedNewProduct = true;

      //=============== CREATE NEW PRODUCT =========//
      MainServ.createNewProduct();

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
      CartMenuServ.calculateTotalOrderPrice();
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


  }
})();
