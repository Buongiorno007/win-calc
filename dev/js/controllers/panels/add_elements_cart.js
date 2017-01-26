(function () {
  'use strict';
  /**@ngInject*/
  angular
    .module('CartModule')
    .controller('AddElemCartCtrl',

      function (globalConstants,
                GeneralServ,
                CartServ,
                CartMenuServ,
                OrderStor,
                CartStor,
                AuxStor,
                GlobalStor,
                EditAddElementCartServ) {
        /*jshint validthis:true */
        var thisCtrl = this;
        thisCtrl.C = CartStor;
        thisCtrl.constants = globalConstants;
        thisCtrl.config = {
          addElementDATA: GeneralServ.addElementDATA,
          selectedAddElemUnit: {id: 0},
          isAddElemUnitDetail: 0,
          addElemUnitProducts: [],
          isLinkExplodeMenu: 0,
          explodeMenuTop: 0,
          explodeMenuLeft: 0,
          isSwipeProdSelector: 0
        };

        var dependObject = [
          'element_height',
          'element_type',
          'element_width',
          'id',
          'list_group_id',
          'name'
        ];


        /**============ METHODS ================*/


        function closeAllAddElemsPanel() {
          CartStor.cart.isAllAddElems = 0;
          //------ clean AddElems array for All AddElems Panel
          CartStor.cart.allAddElemsOrder.length = 0;
          CartStor.cart.addElemsOrderPriceTOTAL = 0;
          //------ hide searching box
          CartStor.cart.isSelectedProduct = 0;
          AuxStor.aux.showAddElementsMenu = 0;
          AuxStor.aux.addElementGroups.length = 0;
          AuxStor.aux.searchingWord = '';
          GlobalStor.global.isWidthCalculator = 0;
          GlobalStor.global.isSizeCalculator = 0;
          GlobalStor.global.isQtyCalculator = 0;
          CartStor.cart.indexType = null;
          CartStor.cart.indexElem = null;
          CartStor.cart.indexParam = null;
          GlobalStor.global.maxSizeAddElem = null;
          GlobalStor.global.isWidthCalculator = null;
          GlobalStor.global.isSizeCalculator = null;
          CartStor.cart.addElemIndex = null;
        }

        function deleteAddElemsInOrder(element) {
          var products = OrderStor.order.products,
            productsQty = products.length,
            addElemProdQty, addElemQty, addElem, details;
          while (--productsQty > -1) {
            addElem = products[productsQty].chosenAddElements;
            details = products[productsQty].template_source.details;
            var blocksQty = details.length;
            while (--blocksQty > 0) {
                if (details[blocksQty].gridTxt) {
                  if (details[blocksQty].gridTxt === element.name) {
                    if (details[blocksQty].gridId) {
                      delete details[blocksQty].gridId;
                      delete details[blocksQty].gridTxt;
                      break;
                    }
                  }
              } else {
                if (details[blocksQty].gridId) {
                  delete details[blocksQty].gridId;
                  delete details[blocksQty].gridTxt;
                }
              }
            }
            addElemProdQty = addElem.length;
            while (--addElemProdQty > -1) {
              addElemQty = addElem[addElemProdQty].length;
              if (addElemQty) {
                //--------- delete one Add Element
                if (element) {
                  while (--addElemQty > -1) {
                    if (addElem[addElemProdQty][addElemQty].id === element.id) {
                      if (addElem[addElemProdQty][addElemQty].element_width === element.element_width) {
                        if (addElem[addElemProdQty][addElemQty].element_height === element.element_height) {
                          addElem[addElemProdQty].splice(addElemQty, 1);
                          break;

                        }
                      }
                    }
                  }
                } else {
                  //--------- delete All Add Element
                  addElem[addElemProdQty].length = 0;
                }
              }
            }
          }

        }

        function editQty(indexType, index, element, allElements) {
          var index2 = angular.copy(index);
          for (var x = 0; x < allElements.length; x += 1) {
            if (_.isEqual(_.pick(element, dependObject), _.pick(allElements[x], dependObject))) {
              index = x;
            }
          }
          if (CartStor.cart.selectedProduct >= 0) {

            if (CartStor.cart.indexType === indexType && CartStor.cart.indexParam === 'qty') {
              CartStor.cart.indexType = null;
              CartStor.cart.indexElem = null;
              CartStor.cart.indexParam = null;
              GlobalStor.global.maxSizeAddElem = null;
              GlobalStor.global.isWidthCalculator = null;
              GlobalStor.global.isSizeCalculator = null;
              CartStor.cart.addElemIndex = null;
            } else {
              CartStor.cart.indexType = indexType;
              CartStor.cart.indexParam = 'qty';
              CartStor.cart.indexElem = index2;
              GlobalStor.global.maxSizeAddElem = 2500;
              GlobalStor.global.isWidthCalculator = 0;
              GlobalStor.global.isSizeCalculator = 0;
              CartStor.cart.addElemIndex = index;
            }
            GlobalStor.global.isQtyCalculator = !GlobalStor.global.isQtyCalculator;
          }
        }

        function editWidth(indexType, index, element, allElements) {
          var index2 = angular.copy(index);
          for (var x = 0; x < allElements.length; x += 1) {
            if (_.isEqual(_.pick(element, dependObject), _.pick(allElements[x], dependObject))) {
              index = x;
            }
          }
          if (CartStor.cart.selectedProduct >= 0) {
            if (CartStor.cart.indexType === indexType && CartStor.cart.indexParam === 'width') {
              CartStor.cart.indexType = null;
              CartStor.cart.indexElem = null;
              CartStor.cart.indexParam = null;
              GlobalStor.global.maxSizeAddElem = null;
              GlobalStor.global.isWidthCalculator = null;
              GlobalStor.global.isSizeCalculator = null;
              CartStor.cart.addElemIndex = null;
            } else {
              GlobalStor.global.maxSizeAddElem = 2500;
              GlobalStor.global.isSizeCalculator = !GlobalStor.global.isSizeCalculator;
              GlobalStor.global.isQtyCalculator = 0;
              GlobalStor.global.isWidthCalculator = 1;
              CartStor.cart.addElemIndex = index;
              CartStor.cart.indexType = indexType;
              CartStor.cart.indexParam = 'width';
              CartStor.cart.indexElem = index2;
            }
          }
        }

        function editHeight(indexType, index, element, allElements) {
          var index2 = angular.copy(index);
          for (var x = 0; x < allElements.length; x += 1) {
            if (_.isEqual(_.pick(element, dependObject), _.pick(allElements[x], dependObject))) {
              index = x;
            }
          }
          if (CartStor.cart.selectedProduct >= 0) {
            if (CartStor.cart.indexType === indexType && CartStor.cart.indexParam === 'height') {
              CartStor.cart.indexType = null;
              CartStor.cart.indexElem = null;
              CartStor.cart.indexParam = null;
              GlobalStor.global.maxSizeAddElem = null;
              GlobalStor.global.isWidthCalculator = null;
              GlobalStor.global.isSizeCalculator = null;
              CartStor.cart.addElemIndex = null;
            } else {
              CartStor.cart.indexType = indexType;
              CartStor.cart.indexParam = 'height';
              CartStor.cart.indexElem = index2;
              GlobalStor.global.isQtyCalculator = 0;
              GlobalStor.global.isWidthCalculator = 0;
              GlobalStor.global.maxSizeAddElem = 2500;
              GlobalStor.global.isSizeCalculator = !GlobalStor.global.isSizeCalculator;
              CartStor.cart.addElemIndex = index;
            }
          }
        }

        function deleteAddElemsItem(addElem) {
          deleteAddElemsInOrder(addElem);
          CartMenuServ.joinAllAddElements();
          //------ if last AddElem was delete
          if (!CartStor.cart.isExistAddElems) {
            //------ go back in cart
            closeAllAddElemsPanel();
          } else {
            CartServ.showAllAddElements();
          }
          //------ culculate AddElems Price in each Products
          CartServ.calculateAddElemsProductsPrice(1);
          //------ change order Price
          CartMenuServ.calculateOrderPrice();
        }


        function deleteAllAddElems() {
          //------ delete all chosenAddElements in Products
          deleteAddElemsInOrder();
          //------ culculate AddElems Price in each Products
          CartServ.calculateAddElemsProductsPrice();
          //------ change order Price
          CartMenuServ.calculateOrderPrice();
          CartMenuServ.joinAllAddElements();
          //------ go back in cart
          closeAllAddElemsPanel();
        }


        function collectAddElemUnitProducts() {
          var allAddElemsQty = CartStor.cart.allAddElements.length,
            addElemProdQty, addElemProd, i, j, wagon, cloneQty, addElem;

          //------ clean addElemUnit array
          thisCtrl.config.addElemUnitProducts.length = 0;
          //console.log('      ', CartStor.cart.allAddElements);
          for (i = 0; i < allAddElemsQty; i += 1) {
            addElem = CartStor.cart.allAddElements[i];
            addElemProdQty = addElem.length;
            for (j = 0; j < addElemProdQty; j += 1) {
              if (addElem[j].id === thisCtrl.config.selectedAddElemUnit.id) {
                if (addElem[j].element_width === thisCtrl.config.selectedAddElemUnit.element_width) {
                  if (addElem[j].element_height === thisCtrl.config.selectedAddElemUnit.element_height) {

                    //-------- if product is addElems only
                    if (OrderStor.order.products[i].is_addelem_only) {
                      addElemProd = {
                        productIndex: i,
                        is_addelem_only: OrderStor.order.products[i].is_addelem_only,
                        name: addElem[j].name,
                        element_width: addElem[j].element_width,
                        element_height: addElem[j].element_height,
                        element_qty: addElem[j].element_qty,
                        elementPriceDis: addElem[j].elementPriceDis
                      };
                      thisCtrl.config.addElemUnitProducts.push(addElemProd);

                    } else {

                      addElemProd = {
                        productIndex: i,
                        is_addelem_only: OrderStor.order.products[i].is_addelem_only,
                        element_qty: addElem[j].element_qty / OrderStor.order.products[i].product_qty
                      };
//                  console.info('addElemProd------', thisCtrl.config.selectedAddElemUnit);
//                  console.info('addElemProd------', CartStor.cart.allAddElements[i][j]);
//                  console.info('addElemProd------', OrderStor.order.products[i]);
//                  console.info('addElemProd------', addElemProd);
                      if (OrderStor.order.products[i].product_qty > 1) {
                        wagon = [];
                        cloneQty = +OrderStor.order.products[i].product_qty;
                        while (--cloneQty > -1) {
                          wagon.push(addElemProd);
                        }
                        thisCtrl.config.addElemUnitProducts.push(wagon);
                      } else {
                        thisCtrl.config.addElemUnitProducts.push(addElemProd);
                      }

                    }

                  }
                }
              }
            }
          }
          //console.warn('addElemUnitProducts++++',thisCtrl.config.addElemUnitProducts);
        }


        function showAddElemUnitDetail(elemUnit) {
          thisCtrl.config.selectedAddElemUnit = elemUnit;
          collectAddElemUnitProducts();
          thisCtrl.config.isAddElemUnitDetail = 1;
        }


        function closeAddElemUnitDetail() {
          thisCtrl.config.isAddElemUnitDetail = 0;
          thisCtrl.config.selectedAddElemUnit = {id: 0};
          thisCtrl.config.isLinkExplodeMenu = 0;
        }


        function delAddElemUnitInProduct(productIndex) {
          var addElem = OrderStor.order.products[productIndex].chosenAddElements,
            addElemProdQty = addElem.length,
            addElemUnit = thisCtrl.config.selectedAddElemUnit,
            addElemQty;

          while (--addElemProdQty > -1) {
            addElemQty = addElem[addElemProdQty].length;
            if (addElemQty) {
              while (--addElemQty > -1) {
                if (addElem[addElemProdQty][addElemQty].id === addElemUnit.id) {
                  if (addElem[addElemProdQty][addElemQty].element_width === addElemUnit.element_width) {
                    if (addElem[addElemProdQty][addElemQty].element_height === addElemUnit.element_height) {
                      addElem[addElemProdQty].splice(addElemQty, 1);
                    }
                  }
                }
              }
            }
          }
        }


        function reviewAddElemUnit() {
          var addElems = CartStor.cart.allAddElemsOrder,
            addElemUnit = thisCtrl.config.selectedAddElemUnit,
            addElemsQty = addElems.length,
            noExist = 1;
          while (--addElemsQty > -1) {
            if (addElems[addElemsQty].id === addElemUnit.id) {
              addElemUnit.element_qty = angular.copy(addElems[addElemsQty].element_qty);
              noExist -= 1;
            }
          }
          if (noExist) {
            closeAddElemUnitDetail();
          }
        }


        function deleteAddElemUnit(addElemUnit, isWagon) {
          //console.info('delet----', thisCtrl.config.selectedAddElemUnit);

          if (isWagon) {
            //------- decrease Product quantity
            CartServ.decreaseProductQty(addElemUnit[0].productIndex);
          } else {
            //------- delete AddElem in Product
            delAddElemUnitInProduct(addElemUnit);
            CartMenuServ.joinAllAddElements();
          }

          //------ if last AddElem was delete
          if (!CartStor.cart.isExistAddElems) {
            //------ go back in cart
            closeAddElemUnitDetail();
            closeAllAddElemsPanel();
          } else {
            CartServ.showAllAddElements();
            collectAddElemUnitProducts();
            //------ change selected AddElemUnit
            reviewAddElemUnit();
          }
          //------ culculate AddElems Price in each Products
          CartServ.calculateAddElemsProductsPrice(1);
          //------ change order Price
          CartMenuServ.calculateOrderPrice();

        }


        /**-------- Show/Hide Explode Link Menu ------*/
        function toggleExplodeLinkMenu(prodInd, event) {
          //console.log(prodInd);
          //console.log(event.center);
          thisCtrl.config.isLinkExplodeMenu = !thisCtrl.config.isLinkExplodeMenu;
          thisCtrl.config.explodeMenuTop = event.center.y - 50;
          thisCtrl.config.explodeMenuLeft = event.center.x - 30;
        }


        /**-------- Explode by Products ------*/
        function explodeUnitToProduct(addElemUnit, isAllProducts) {
          var lastProductId = d3.max(OrderStor.order.products.map(function (item) {
              return item.product_id;
            })),
            cloneProduct = angular.copy(OrderStor.order.products[addElemUnit[0].productIndex]),
            newProductQty = cloneProduct.product_qty - 1;

          cloneProduct.product_qty = 1;

          //--------- whole explode product
          if (isAllProducts) {
            OrderStor.order.products[addElemUnit[0].productIndex].product_qty = 1;
            while (--newProductQty > -1) {
              CartServ.addCloneProductInOrder(cloneProduct, lastProductId);
            }
          } else {
            //--------- explode product once
            OrderStor.order.products[addElemUnit[0].productIndex].product_qty -= 1;
            CartServ.addCloneProductInOrder(cloneProduct, lastProductId);
          }

          thisCtrl.config.isLinkExplodeMenu = 0;
          CartMenuServ.joinAllAddElements();

          CartServ.showAllAddElements();
          collectAddElemUnitProducts();
          //------ change selected AddElemUnit
          reviewAddElemUnit();

          //------ culculate AddElems Price in each Products
          CartServ.calculateAddElemsProductsPrice(1);
          //------ change order Price
          CartMenuServ.calculateOrderPrice();

        }


        /** ======== ADDING ADDELEMENTS TO PRODUCTS ==========*/


        /** open/close product selector by swipe */
        function swipeProductSelector() {
          thisCtrl.config.isSwipeProdSelector = !thisCtrl.config.isSwipeProdSelector;
        }


        function checkAllSelectedProducts() {
          var isSelected = 0,
            prodIndQty = CartStor.cart.selectedProducts.length;
          while (--prodIndQty > -1) {
            if (CartStor.cart.selectedProducts[prodIndQty].length) {
              isSelected += 1;
            }
          }
          CartStor.cart.isSelectedProduct = isSelected ? 1 : 0;
        }


        function selectProductToAddElem(prodInd) {
          GlobalStor.global.isWidthCalculator = 0;
          GlobalStor.global.isSizeCalculator = 0;
          GlobalStor.global.isQtyCalculator = 0;
          CartStor.cart.indexType = null;
          CartStor.cart.indexElem = null;
          CartStor.cart.indexParam = null;
          GlobalStor.global.maxSizeAddElem = null;
          GlobalStor.global.isWidthCalculator = null;
          GlobalStor.global.isSizeCalculator = null;
          CartStor.cart.addElemIndex = null;
          if (CartStor.cart.selectedProduct === prodInd) {
            CartStor.cart.selectedProduct = -1;
          } else {
            CartStor.cart.selectedProduct = prodInd;
          }
          ;
          CartServ.collectAllAddElems();
          if (CartStor.cart.isSelectedProduct) {
            CartServ.initSelectedProductsArr();
            //------- check another products
            checkAllSelectedProducts();
          } else {
            CartStor.cart.selectedProducts[prodInd].push(1);
            CartStor.cart.isSelectedProduct = 1;
          }
        }


        /**========== FINISH ==========*/

        //=========== clicking =============//
        thisCtrl.closeAllAddElemsPanel = closeAllAddElemsPanel;
        thisCtrl.deleteAllAddElems = deleteAllAddElems;
        thisCtrl.deleteAddElemsItem = deleteAddElemsItem;

        thisCtrl.showAddElemUnitDetail = showAddElemUnitDetail;
        thisCtrl.closeAddElemUnitDetail = closeAddElemUnitDetail;
        thisCtrl.deleteAddElemUnit = deleteAddElemUnit;
        thisCtrl.toggleExplodeLinkMenu = toggleExplodeLinkMenu;
        thisCtrl.explodeUnitToProduct = explodeUnitToProduct;

        //------ adding elements to product
        thisCtrl.swipeProductSelector = swipeProductSelector;
        thisCtrl.selectProductToAddElem = selectProductToAddElem;
        thisCtrl.editHeight = editHeight;
        thisCtrl.editWidth = editWidth;
        thisCtrl.editQty = editQty;
        thisCtrl.calcAddElemPrice = EditAddElementCartServ.calcAddElemPrice;


      });
})();
