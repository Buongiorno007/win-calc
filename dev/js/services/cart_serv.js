(function () {
  'use strict';
  /**@ngInject*/
  angular
    .module('CartModule')
    .factory('CartServ',

      function ($location,
                $filter,
                GeneralServ,
                MainServ,
                CartMenuServ,
                GlobalStor,
                OrderStor,
                DesignStor,
                ProductStor,
                CartStor,
                AuxStor) {
        /*jshint validthis:true */
        var thisFactory = this;


        /**============ METHODS ================*/

        //------- add new product in order
        function addNewProductInOrder() {
          //------- set previos Page
          CartStor.cart.showCurrentTemp = 0;
          GeneralServ.setPreviosPage();
          //=============== CREATE NEW PRODUCT =========//
          MainServ.createNewProduct();
        }


        //----- Increase Product Qty
        function increaseProductQty(productIndex) {
          OrderStor.order.products[productIndex].product_qty += 1;
          CartMenuServ.joinAllAddElements();
          CartMenuServ.calculateOrderPrice();
        }


        //----- Delete Product
        function clickDeleteProduct(productIndex) {
          function deleteProduct() {
            //playSound('delete');
            OrderStor.order.products.splice(productIndex, 1);
            CartStor.cart.allAddElements.splice(productIndex, 1);

            //----- if all products were deleted go to main page????
            CartMenuServ.calculateOrderPrice();
            var products = OrderStor.order.products;
            if (products.length > 0) {
              for (var x = 0; x < products.length; x += 1) {
                products[x].product_id = x + 1;
              }
              //--------- Change order price
            } else {
              //$scope.global.createNewProjectCart();
              //TODO create new project
            }
          }

          GeneralServ.confirmAlert(
            $filter('translate')('common_words.DELETE_PRODUCT_TITLE'),
            $filter('translate')('common_words.DELETE_PRODUCT_TXT'),
            deleteProduct
          );
        }


        //----- Reduce Product Qty
        function decreaseProductQty(productIndex) {
          //----- if product 1 - delete product completely
          if (OrderStor.order.products[productIndex].product_qty === 1) {
            //------ ask client to delete
            clickDeleteProduct(productIndex);
          } else {
            OrderStor.order.products[productIndex].product_qty -= 1;
            CartMenuServ.calculateOrderPrice();
          }
          CartMenuServ.joinAllAddElements();
        }

        /*** FASTEDIT*/
        function fastEdit(productIndex, type) {
          function edit() {
            CartStor.cart.showCurrentTemp = !CartStor.cart.showCurrentTemp;
            ProductStor.product = angular.copy(OrderStor.order.products[productIndex]);
            GlobalStor.global.productEditNumber = ProductStor.product.product_id;
            GlobalStor.global.isCreatedNewProduct = 1;
            GlobalStor.global.isChangedTemplate = 1;
            MainServ.prepareMainPage();
            if (type === 'auxiliary') {
              //------ open AddElements Panel
              GlobalStor.global.activePanel = 6;
            }
            if (!ProductStor.product.is_addelem_only) {
              //------- set previos Page
              GeneralServ.setPreviosPage();
              var productTEMP;
              var newId = ProductStor.product.profile.id;
              /** save previous Product */
              productTEMP = angular.copy(ProductStor.product);

              /** check new Profile */
              MainServ.setCurrentProfile(ProductStor.product, newId).then(function () {
                //------- set current template for product
                MainServ.saveTemplateInProduct(ProductStor.product.template_id).then(function () {

                  /** Extra Glass finding */
                  MainServ.checkGlassSizes(ProductStor.product.template);

                  /** return previous Product */
                  ProductStor.product = angular.copy(productTEMP);
                  DesignStor.design.templateSourceTEMP = angular.copy(ProductStor.product.template_source);
                  if (GlobalStor.global.isLightVersion) {
                    GlobalStor.global.showKarkas=1;
                    GlobalStor.global.showConfiguration=0;
                    GlobalStor.global.showCart=0;
                  } else {
                    $location.path('/main');
                    GlobalStor.global.isLightVersion =0;
                  }
                });
              });
              GlobalStor.global.isBox = !GlobalStor.global.isBox;
            } else {
              GlobalStor.global.activePanel = 6;
              GlobalStor.global.isBox = !GlobalStor.global.isBox;
              if (GlobalStor.global.isLightVersion) {
                GlobalStor.global.showKarkas=1;
                GlobalStor.global.showConfiguration=0;
                GlobalStor.global.showCart=0;
              } else {
                $location.path('/main');
                GlobalStor.global.isLightVersion =0;
              }
            }
          }

          GeneralServ.confirmAlert(
            $filter('translate')('common_words.BUTTON_E') + "?",
            $filter('translate')('  '),
            edit
          );
        }


        //----- Edit Produtct in main page
        function box(productIndex, type) {
          GlobalStor.global.isBox = !GlobalStor.global.isBox;
          //console.log(GlobalStor.global.isBox, 'GlobalStor.global.isBox')
          function editProduct() {
            if (OrderStor.order.products[productIndex].lamination.id > 0) {
              OrderStor.order.products[productIndex].profile.impost_list_id = angular.copy(OrderStor.order.products[productIndex].lamination.impost_list_id);
              OrderStor.order.products[productIndex].profile.rama_list_id = angular.copy(OrderStor.order.products[productIndex].lamination.rama_list_id);
              OrderStor.order.products[productIndex].profile.rama_still_list_id = angular.copy(OrderStor.order.products[productIndex].lamination.rama_still_list_id);
              OrderStor.order.products[productIndex].profile.shtulp_list_id = angular.copy(OrderStor.order.products[productIndex].lamination.shtulp_list_id);
              OrderStor.order.products[productIndex].profile.stvorka_list_id = angular.copy(OrderStor.order.products[productIndex].lamination.stvorka_list_id);
            }
            ProductStor.product = angular.copy(OrderStor.order.products[productIndex]);
            GlobalStor.global.productEditNumber = ProductStor.product.product_id;
            GlobalStor.global.isCreatedNewProduct = 1;
            GlobalStor.global.isChangedTemplate = 1;
            MainServ.prepareMainPage();
            if (type === 'auxiliary') {
              //------ open AddElements Panel
              GlobalStor.global.activePanel = 6;
            }
            if (!ProductStor.product.is_addelem_only) {
              //------- set previos Page
              GeneralServ.setPreviosPage();
              var productTEMP;
              var newId = ProductStor.product.profile.id;
              /** save previous Product */
              productTEMP = angular.copy(ProductStor.product);

              /** check new Profile */
              MainServ.setCurrentProfile(ProductStor.product, newId).then(function () {
                //------- set current template for product
                MainServ.saveTemplateInProduct(ProductStor.product.template_id).then(function () {

                  /** Extra Glass finding */
                  MainServ.checkGlassSizes(ProductStor.product.template);

                  /** return previous Product */
                  ProductStor.product = angular.copy(productTEMP);
                  $location.path('/main');
                });
              });
              GlobalStor.global.isBox = !GlobalStor.global.isBox;
            } else {
              GlobalStor.global.activePanel = 6;
              GlobalStor.global.isBox = !GlobalStor.global.isBox;
              $location.path('/main');
            }
          }

          function addCloneProductInOrder(cloneProduct, lastProductId) {
            // console.log(cloneProduct)
            lastProductId += 1;
            cloneProduct.product_id = lastProductId;
            OrderStor.order.products.push(cloneProduct);
          }

          function createProductCopy() {
            var lastProductId = d3.max(OrderStor.order.products.map(function (item) {
                return item.product_id;
              })),

              cloneProduct = angular.copy(OrderStor.order.products[productIndex]);
            GlobalStor.global.isBox = !GlobalStor.global.isBox;
            addCloneProductInOrder(cloneProduct, lastProductId);
            CartMenuServ.joinAllAddElements();
            CartMenuServ.calculateOrderPrice();
          }

          GeneralServ.confirmAlert(
            $filter('translate')('common_words.EDIT_COPY_TXT'),
            $filter('translate')('  '),
            editProduct
          );
          GeneralServ.confirmPath(
            createProductCopy
          );

        }


        /**======== ALL ADD LEMENTS PANEL ========*/



        function collectAllAddElems() {
          var addElemsSource = angular.copy(CartStor.cart.allAddElements),
            addElemsQty = addElemsSource.length,
            prodQty, elemsOrderQty, noExist;
          CartStor.cart.allAddElemsOrder.length = 0;
          if (CartStor.cart.selectedProduct === -1) {
            while (--addElemsQty > -1) {
              prodQty = addElemsSource[addElemsQty].length;
              if (prodQty) {
                while (--prodQty > -1) {
                  elemsOrderQty = CartStor.cart.allAddElemsOrder.length;
                  if (elemsOrderQty) {
                    noExist = 1;
                    while (--elemsOrderQty > -1) {
                      if (CartStor.cart.allAddElemsOrder[elemsOrderQty].id === addElemsSource[addElemsQty][prodQty].id) {
                        if (CartStor.cart.allAddElemsOrder[elemsOrderQty].element_width === addElemsSource[addElemsQty][prodQty].element_width) {
                          if (CartStor.cart.allAddElemsOrder[elemsOrderQty].element_height === addElemsSource[addElemsQty][prodQty].element_height) {
                            CartStor.cart.allAddElemsOrder[elemsOrderQty].element_qty = GeneralServ.roundingValue(CartStor.cart.allAddElemsOrder[elemsOrderQty].element_qty + addElemsSource[addElemsQty][prodQty].element_qty);
                            noExist -= 1;
                          }
                        }
                      }
                    }
                    if (noExist) {
                      CartStor.cart.allAddElemsOrder.push(addElemsSource[addElemsQty][prodQty]);
                    }
                  } else {
                    CartStor.cart.allAddElemsOrder.push(addElemsSource[addElemsQty][prodQty]);
                  }
                }
              }
            }
          } else {
            CartStor.cart.allAddElemsOrder = angular.copy(addElemsSource[CartStor.cart.selectedProduct]).reverse();
          }
        }


        function getAddElemsPriceTotal() {
          var productsQty = OrderStor.order.products.length;
          CartStor.cart.addElemsOrderPriceTOTAL = 0;
          while (--productsQty > -1) {
            CartStor.cart.addElemsOrderPriceTOTAL += (OrderStor.order.products[productsQty].addelemPriceDis * OrderStor.order.products[productsQty].product_qty);
          }
          CartStor.cart.addElemsOrderPriceTOTAL = GeneralServ.roundingValue(CartStor.cart.addElemsOrderPriceTOTAL);
        }


        function initSelectedProductsArr() {
          CartStor.cart.selectedProducts.length = 0;
          CartStor.cart.selectedProducts = OrderStor.order.products.map(function () {
            return [];
          });
        }


        /** show All Add Elements Panel */
        function showAllAddElements() {
          collectAllAddElems();
          getAddElemsPriceTotal();
          initSelectedProductsArr();
          CartStor.cart.isAllAddElems = 1;
          AuxStor.aux.isAddElementListView = 1;
        }


        function calculateAddElemsProductsPrice(reculc) {
          var productsQty = OrderStor.order.products.length,
            addElemTypeQty, addElemQty;
          while (--productsQty > -1) {
            OrderStor.order.products[productsQty].addelem_price = 0;
            OrderStor.order.products[productsQty].addelemPriceDis = 0;

            //-------- if was delete only one AddElemItem
            if (reculc) {
              addElemTypeQty = OrderStor.order.products[productsQty].chosenAddElements.length;
              while (--addElemTypeQty > -1) {
                addElemQty = OrderStor.order.products[productsQty].chosenAddElements[addElemTypeQty].length;
                if (addElemQty) {
                  while (--addElemQty > -1) {
                    OrderStor.order.products[productsQty].addelem_price += OrderStor.order.products[productsQty].chosenAddElements[addElemTypeQty][addElemQty].element_qty * OrderStor.order.products[productsQty].chosenAddElements[addElemTypeQty][addElemQty].element_price;
                  }
                  OrderStor.order.products[productsQty].addelem_price = GeneralServ.roundingValue(
                    OrderStor.order.products[productsQty].addelem_price
                  );
                  OrderStor.order.products[productsQty].addelemPriceDis = GeneralServ.setPriceDis(
                    OrderStor.order.products[productsQty].addelem_price, OrderStor.order.discount_addelem
                  );
                }
              }
            }

            //------ reculculate product price total
            MainServ.setProductPriceTOTAL(OrderStor.order.products[productsQty]);
          }
        }


        function addCloneProductInOrder(cloneProduct, lastProductId) {
          lastProductId += 1;
          cloneProduct.product_id = lastProductId;
          OrderStor.order.products.push(cloneProduct);
        }


        function createProductCopy(currProdInd) {
          var lastProductId = d3.max(OrderStor.order.products.map(function (item) {
              return item.product_id;
            })),
            cloneProduct = angular.copy(OrderStor.order.products[currProdInd]);
          addCloneProductInOrder(cloneProduct, lastProductId);
          CartMenuServ.joinAllAddElements();
          CartMenuServ.calculateOrderPrice();
        }


        /**========== FINISH ==========*/

        thisFactory.publicObj = {
          increaseProductQty: increaseProductQty,
          decreaseProductQty: decreaseProductQty,
          addNewProductInOrder: addNewProductInOrder,
          clickDeleteProduct: clickDeleteProduct,
          box: box,
          fastEdit: fastEdit,
          showAllAddElements: showAllAddElements,
          collectAllAddElems: collectAllAddElems,
          getAddElemsPriceTotal: getAddElemsPriceTotal,
          calculateAddElemsProductsPrice: calculateAddElemsProductsPrice,
          createProductCopy: createProductCopy,
          addCloneProductInOrder: addCloneProductInOrder,
          initSelectedProductsArr: initSelectedProductsArr
        };

        return thisFactory.publicObj;


      });
})();
