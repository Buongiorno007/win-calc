(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('CartModule')
    .controller('AddElemCartCtrl', addElementsCartCtrl);

  function addElementsCartCtrl(localDB, GeneralServ, MainServ, CartServ, CartMenuServ, globalConstants, GlobalStor, OrderStor, CartStor, UserStor) {

    var thisCtrl = this;
    thisCtrl.constants = globalConstants;
    thisCtrl.G = GlobalStor;
    thisCtrl.O = OrderStor;
    thisCtrl.C = CartStor;
    thisCtrl.U = UserStor;


    thisCtrl.config = {
      addElemsTypes: localDB.addElementDBId,
      selectedAddElemUnit: {id: 0},
      isAddElemUnitDetail: 0,
      addElemUnitProducts: [],
      isLinkExplodeMenu: 0
      //      selectedAddElementUnitId: 0,
      //      selectedAddElementUnitIndex: 0,
      //      selectedAddElementUnitType: 0,
      //      selectedAddElementUnits: [],
      //      isOrderHaveAddElements: false,
      //      isShowLinkExplodeMenu: false,
    };

    //------ clicking
    thisCtrl.closeAllAddElemsPanel = closeAllAddElemsPanel;
    thisCtrl.deleteAllAddElems = deleteAllAddElems;
    thisCtrl.deleteAddElemsItem = deleteAddElemsItem;

    thisCtrl.showAddElemUnitDetail = showAddElemUnitDetail;
    thisCtrl.closeAddElemUnitDetail = closeAddElemUnitDetail;
    thisCtrl.deleteAddElemUnit = deleteAddElemUnit;
    thisCtrl.toggleExplodeLinkMenu = toggleExplodeLinkMenu;


    function closeAllAddElemsPanel() {
      CartStor.cart.isAllAddElems = 0;
      //------ clean AddElems array for All AddElems Panel
      CartStor.cart.allAddElemsOrder.length = 0;
      CartStor.cart.addElemsOrderPriceTOTAL = 0;
    }



    function deleteAddElemsItem(addElem) {
      deleteAddElemsInOrder(addElem);
      CartServ.joinAllAddElements();
      //------ if last AddElem was delete
      if(!CartStor.cart.isExistAddElems) {
        //------ go back in cart
        closeAllAddElemsPanel();
      } else {
        CartServ.showAllAddElements();
      }
      //------ culculate AddElems Price in each Products
      calculateAddElemsProductsPrice(1);
      //------ change order Price
      CartMenuServ.calculateOrderPrice();
    }



    function deleteAllAddElems() {
      //------ delete all chosenAddElements in Products
      deleteAddElemsInOrder();
      //------ culculate AddElems Price in each Products
      calculateAddElemsProductsPrice();
      //------ change order Price
      CartMenuServ.calculateOrderPrice();
      CartServ.joinAllAddElements();
      //------ go back in cart
      closeAllAddElemsPanel();
    }



    function deleteAddElemsInOrder(element) {
      var productsQty = OrderStor.order.products.length,
          addElemProdQty, addElemQty;
      while(--productsQty > -1) {
        addElemProdQty = OrderStor.order.products[productsQty].chosenAddElements.length;
        while(--addElemProdQty > -1) {
          addElemQty = OrderStor.order.products[productsQty].chosenAddElements[addElemProdQty].length;
          if(addElemQty) {
            //--------- delete one Add Element
            if(element) {
              while(--addElemQty > -1) {
                if(OrderStor.order.products[productsQty].chosenAddElements[addElemProdQty][addElemQty].id === element.id) {
                  if(OrderStor.order.products[productsQty].chosenAddElements[addElemProdQty][addElemQty].element_width === element.element_width) {
                    if(OrderStor.order.products[productsQty].chosenAddElements[addElemProdQty][addElemQty].element_height === element.element_height) {
                      OrderStor.order.products[productsQty].chosenAddElements[addElemProdQty].splice(addElemQty, 1);
                    }
                  }
                }
              }
            } else {
              //--------- delete All Add Element
              OrderStor.order.products[productsQty].chosenAddElements[addElemProdQty].length = 0;
            }
          }
        }
      }
    }




    function calculateAddElemsProductsPrice(reculc) {
      var productsQty = OrderStor.order.products.length,
          addElemTypeQty, addElemQty;
      while(--productsQty > -1) {
        OrderStor.order.products[productsQty].addelem_price = 0;
        OrderStor.order.products[productsQty].addelemPriceDis = 0;

        //-------- if was delete only one AddElemItem
        if(reculc) {
          addElemTypeQty = OrderStor.order.products[productsQty].chosenAddElements.length;
          while (--addElemTypeQty > -1) {
            addElemQty = OrderStor.order.products[productsQty].chosenAddElements[addElemTypeQty].length;
            if (addElemQty) {
              while (--addElemQty > -1) {
                OrderStor.order.products[productsQty].addelem_price += OrderStor.order.products[productsQty].chosenAddElements[addElemTypeQty][addElemQty].element_qty * OrderStor.order.products[productsQty].chosenAddElements[addElemTypeQty][addElemQty].element_price;
              }
              OrderStor.order.products[productsQty].addelem_price = GeneralServ.roundingNumbers(OrderStor.order.products[productsQty].addelem_price);
              OrderStor.order.products[productsQty].addelemPriceDis = GeneralServ.setPriceDis(OrderStor.order.products[productsQty].addelem_price, OrderStor.order.discount_addelem);
            }
          }
        }

        //------ reculculate product price total
        MainServ.setProductPriceTOTAL(OrderStor.order.products[productsQty]);
      }
    }




    function showAddElemUnitDetail(elemUnit) {
      thisCtrl.config.selectedAddElemUnit = elemUnit;
      collectAddElemUnitProducts();
      thisCtrl.config.isAddElemUnitDetail = 1;
    }


    function collectAddElemUnitProducts() {
      var allAddElemsQty = CartStor.cart.allAddElements.length,
          addElemProdQty, addElemProd;

      //------ clean addElemUnit array
      thisCtrl.config.addElemUnitProducts.length = 0;
      console.log('      ', CartStor.cart.allAddElements);
      for(var i = 0; i < allAddElemsQty; i++) {
        addElemProdQty = CartStor.cart.allAddElements[i].length;
        for(var j = 0; j < addElemProdQty; j++) {
          if(thisCtrl.config.selectedAddElemUnit.id === CartStor.cart.allAddElements[i][j].id) {
            if(thisCtrl.config.selectedAddElemUnit.element_width === CartStor.cart.allAddElements[i][j].element_width) {
              if(thisCtrl.config.selectedAddElemUnit.element_height === CartStor.cart.allAddElements[i][j].element_height) {

                //-------- if product is addElems only
                if(OrderStor.order.products[i].is_addelem_only) {
                  addElemProd = {
                    productIndex: i,
                    is_addelem_only: OrderStor.order.products[i].is_addelem_only,
                    element_width: CartStor.cart.allAddElements[i][j].element_width,
                    element_height: CartStor.cart.allAddElements[i][j].element_height,
                    element_qty: CartStor.cart.allAddElements[i][j].element_qty * OrderStor.order.products[i].product_qty,
                    elementPriceDis: CartStor.cart.allAddElements[i][j].elementPriceDis
                  };
                  thisCtrl.config.addElemUnitProducts.push(addElemProd);

                } else {

                  addElemProd = {
                    productIndex: i,
                    is_addelem_only: OrderStor.order.products[i].is_addelem_only,
                    element_qty: CartStor.cart.allAddElements[i][j].element_qty
                  };
//                  console.info('addElemProd------', thisCtrl.config.selectedAddElemUnit);
//                  console.info('addElemProd------', CartStor.cart.allAddElements[i][j]);
//                  console.info('addElemProd------', OrderStor.order.products[i]);
//                  console.info('addElemProd------', addElemProd);
                  if(OrderStor.order.products[i].product_qty > 1) {
                    var wagon = [],
                        cloneQty = OrderStor.order.products[i].product_qty*1;
                    while(--cloneQty > -1) {
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
      console.warn('addElemUnitProducts++++',thisCtrl.config.addElemUnitProducts);
    }



    function closeAddElemUnitDetail() {
      thisCtrl.config.isAddElemUnitDetail = 0;
      thisCtrl.config.selectedAddElemUnit = {id: 0};
    }



    function deleteAddElemUnit(productIndex) {
      console.info('delet----', productIndex);

      //------- delete AddElem in Product
      delAddElemUnitInProduct(productIndex);

      CartServ.joinAllAddElements();
      //------ if last AddElem was delete
      if(!CartStor.cart.isExistAddElems) {
        //------ go back in cart
        closeAddElemUnitDetail();
        closeAllAddElemsPanel();
      } else {
        CartServ.showAllAddElements();
        collectAddElemUnitProducts();
      }
      //------ culculate AddElems Price in each Products
      calculateAddElemsProductsPrice(1);
      //------ change order Price
      CartMenuServ.calculateOrderPrice();

    }



    function delAddElemUnitInProduct(productIndex) {
      var addElemProdQty = OrderStor.order.products[productIndex].chosenAddElements.length,
          addElemQty;

      while(--addElemProdQty > -1) {
        addElemQty = OrderStor.order.products[productIndex].chosenAddElements[addElemProdQty].length;
        if(addElemQty) {
          while(--addElemQty > -1) {
            if(OrderStor.order.products[productIndex].chosenAddElements[addElemProdQty][addElemQty].id === thisCtrl.config.selectedAddElemUnit.id) {
              if(OrderStor.order.products[productIndex].chosenAddElements[addElemProdQty][addElemQty].element_width === thisCtrl.config.selectedAddElemUnit.element_width) {
                if(OrderStor.order.products[productIndex].chosenAddElements[addElemProdQty][addElemQty].element_height === thisCtrl.config.selectedAddElemUnit.element_height) {
                  OrderStor.order.products[productIndex].chosenAddElements[addElemProdQty].splice(addElemQty, 1);
                }
              }
            }
          }
        }
      }
    }




    //-------- Show/Hide Explode Link Menu
    function toggleExplodeLinkMenu(prodInd) {
      console.log(prodInd);
      thisCtrl.config.isLinkExplodeMenu = !thisCtrl.config.isLinkExplodeMenu;
    }




    //
    //
    //    //------ delete AddElement Unit in selectedAddElementUnits panel
    //    $scope.deleteAddElementUnit = function(parentIndex, elementIndex, addElementUnit) {
    //      console.log('start delete addElementsUniqueList = ', $scope.cart.addElementsUniqueList);
    //      //---- close selectedAddElementUnits panel when we delete last unit
    //      if($scope.cart.selectedAddElementUnits.length === 1) {
    //        $scope.deleteAddElementList($scope.cart.selectedAddElementUnitType, addElementUnit.elementId);
    //        $scope.cart.selectedAddElementUnits.length = 0;
    //        $scope.cart.isShowLinkExplodeMenu = false;
    //      } else if($scope.cart.selectedAddElementUnits.length > 1) {
    //        if(parentIndex === '') {
    //          $scope.cart.selectedAddElementUnits.splice(elementIndex, 1);
    //        } else {
    //          //-------- Delete all group
    //          $scope.cart.isShowLinkExplodeMenu = false;
    //          $scope.cart.selectedAddElementUnits.splice(parentIndex, 1);
    //        }
    //        var curentType = $scope.cart.selectedAddElementUnitType;
    //        for (var el = ($scope.cart.allAddElementsList[curentType].length - 1); el >= 0; el--) {
    //          if($scope.cart.allAddElementsList[curentType][el].productId === addElementUnit.productId && $scope.cart.allAddElementsList[curentType][el].elementId === addElementUnit.elementId) {
    //            $scope.cart.allAddElementsList[curentType].splice(el, 1);
    //          }
    //        }
    //        $scope.cleaningAllAddElementsList();
    //        for (var p = 0; p < $scope.global.order.products.length; p++) {
    //          for (var prop in $scope.global.order.products[p].chosenAddElements) {
    //            if (!$scope.global.order.products[p].chosenAddElements.hasOwnProperty(prop)) {
    //              continue;
    //            }
    //            if ((prop.toUpperCase()).indexOf(curentType.toUpperCase()) + 1 && $scope.global.order.products[p].chosenAddElements[prop].length > 0) {
    //              for (var elem = ($scope.global.order.products[p].chosenAddElements[prop].length - 1); elem >= 0; elem--) {
    //                if ($scope.global.order.products[p].productId === addElementUnit.productId && $scope.global.order.products[p].chosenAddElements[prop][elem].elementId === addElementUnit.elementId) {
    //                  $scope.global.order.products[p].addElementsPriceSELECT -= $scope.global.order.products[p].chosenAddElements[prop][elem].elementPrice;
    //                  $scope.global.order.products[p].productPriceTOTAL -= $scope.global.order.products[p].chosenAddElements[prop][elem].elementPrice;
    //                  $scope.global.order.products[p].chosenAddElements[prop].splice(elem, 1);
    //                }
    //              }
    //            }
    //          }
    //        }
    //        console.log($scope.global.order.products);
    //        $scope.getTOTALAddElementsPrice();
    //        $scope.parseAddElementsLocaly();
    //        $scope.global.calculateOrderPrice();
    //
    //      }
    //      console.log('end delete addElementsUniqueList = ', $scope.cart.addElementsUniqueList);
    //    };
    //
    //
    //
    //    //-------- Explode group to one unit
    //    $scope.explodeUnitToOneProduct = function(parentIndex) {
    //      $scope.cart.isShowLinkExplodeMenu = !$scope.cart.isShowLinkExplodeMenu;
    //
    //      //----- change selected product
    //      var currentProductId = $scope.cart.selectedAddElementUnits[parentIndex][0].productId;
    //      var currentProductIndex = currentProductId - 1;
    //      var newProductsQty = $scope.global.order.products[currentProductIndex].productQty - 1;
    //
    //      // making clone
    //      var cloneProduct = angular.copy($scope.global.order.products[currentProductIndex]);
    //      cloneProduct.productId = '';
    //      cloneProduct.productQty = 1;
    //      $scope.global.order.products.push(cloneProduct);
    //
    //      $scope.global.order.products[currentProductIndex].productQty = newProductsQty;
    //      // Change product value in DB
    //      localDB.updateDB(localDB.productsTableBD, {"productQty": newProductsQty}, {'orderId': {"value": $scope.global.order.orderId, "union": 'AND'}, "productId": currentProductId});
    //
    //      console.log('selectedAddElementUnits == ', $scope.cart.selectedAddElementUnits);
    //      console.log('selected obj == ', $scope.cart.selectedAddElementUnits[parentIndex][0]);
    //      console.log('selected product id== ' );
    //    };
    //
    //    //-------- Explode all group
    //    $scope.explodeUnitGroupToProducts = function(parentIndex) {
    //      $scope.cart.isShowLinkExplodeMenu = !$scope.cart.isShowLinkExplodeMenu;
    //    };


  }
})();
