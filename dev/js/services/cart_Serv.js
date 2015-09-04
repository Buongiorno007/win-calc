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
//      cleanAllTemplatesInOrder: cleanAllTemplatesInOrder,
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
      editProduct: editProduct,
      createDiscontsList: createDiscontsList,
      changeProductPriceAsDiscount: changeProductPriceAsDiscount,
      changeAddElemPriceAsDiscount: changeAddElemPriceAsDiscount
    };

    return thisFactory.publicObj;




    //============ methods ================//

    //------ clean template in products
//    function cleanAllTemplatesInOrder() {
//      var productsQty = OrderStor.order.products.length,
//          prod = 0;
//      for(; prod < productsQty; prod++) {
//        if(OrderStor.order.products[prod].template) {
//          delete OrderStor.order.products[prod].template;
//        }
//      }
//    }

    function downloadOrder() {
      localDB.selectLocalDB(localDB.tablesLocalDB.orders.tableName, {'order_number': GlobalStor.global.orderEditNumber}).then(function(result) {
        if(result.length) {
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
      localDB.selectLocalDB(localDB.tablesLocalDB.order_products.tableName, {'order_number': GlobalStor.global.orderEditNumber}).then(function(result) {
        if(result) {
          var editedProducts = angular.copy(result),
            editedProductsQty = editedProducts.length,
            prod = 0;

          //------------- parsing All Templates Source and Icons for Order
          for(; prod < editedProductsQty; prod++) {
            ProductStor.product = ProductStor.setDefaultProduct();
            angular.extend(ProductStor.product, editedProducts[prod]);

            //----- checking product with design or only addElements
            if(!ProductStor.product.is_addelem_only || ProductStor.product.is_addelem_only === 'false') {
              //----- parsing design from string to object
//              ProductStor.product.template_source = parsingTemplateSource(ProductStor.product.templateSource);
              ProductStor.product.template_source = JSON.parse(ProductStor.product.template_source);
//              console.log('templateSource', ProductStor.product.templateSource);
              //----- find depths and build design icon
              MainServ.setCurrentProfile().then(function(){
                SVGServ.createSVGTemplateIcon(ProductStor.product.template_source, GlobalStor.global.profileDepths).then(function(result) {
                  ProductStor.product.templateIcon = angular.copy(result);
                  deferred.resolve('done');
                });
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
      localDB.selectLocalDB(localDB.tablesLocalDB.order_addelements.tableName, {'order_number': GlobalStor.global.orderEditNumber}).then(function(result) {
        if(result) {
//          console.log('results.data === ', result);
          var allAddElements = angular.copy(result),
              allAddElementsQty = allAddElements.length,
              elem = 0;

          for(; elem < allAddElementsQty; elem++) {
            var prod = 0;
            for(; prod < OrderStor.order.products_qty; prod++) {
              if(allAddElements[elem].product_id === OrderStor.order.products[prod].product_id) {
                OrderStor.order.products[prod].chosenAddElements[allAddElements[elem].element_type].push(allAddElements[elem]);
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


    //----------- create Discount List
    function createDiscontsList() {
      var discounts = {
            window: [],
            addElem: []
          },
          multipl = 5,
          discQty = UserStor.userInfo.discountConstrMax/multipl,
          discAddQty = UserStor.userInfo.discountAddElemMax/multipl;
      for(var d = 0; d <= discQty; d++) {
        discounts.window.push( (d * multipl) );
      }
      for(var d = 0; d <= discAddQty; d++) {
        discounts.addElem.push( (d * multipl) );
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
      GlobalStor.global.isCreatedNewProduct = true;

      //=============== CREATE NEW PRODUCT =========//
      MainServ.createNewProduct();

      MainServ.prepareMainPage();
      $location.path('/main');
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

        //TODOlocalDB.updateDB(localDB.productsTableBD, {"productQty": newProductQty}, {'orderId': {"value": OrderStor.order.orderId, "union": 'AND'}, "productId": productIdBD});
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
      OrderStor.order.products_price_total = 0;
      CartStor.cart.productsPriceTOTALDis = 0;
      for(var prod = 0; prod < productsQty; prod++) {
        OrderStor.order.products_price_total += OrderStor.order.products[prod].product_price * OrderStor.order.products[prod].product_qty;
        CartStor.cart.productsPriceTOTALDis += OrderStor.order.products[prod].productPriceTOTALDis * OrderStor.order.products[prod].product_qty;
      }
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
