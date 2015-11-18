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
      isLinkExplodeMenu: 0,
      explodeMenuTop: 0,
      explodeMenuLeft: 0
    };

    //------ clicking
    thisCtrl.closeAllAddElemsPanel = closeAllAddElemsPanel;
    thisCtrl.deleteAllAddElems = deleteAllAddElems;
    thisCtrl.deleteAddElemsItem = deleteAddElemsItem;

    thisCtrl.showAddElemUnitDetail = showAddElemUnitDetail;
    thisCtrl.closeAddElemUnitDetail = closeAddElemUnitDetail;
    thisCtrl.deleteAddElemUnit = deleteAddElemUnit;
    thisCtrl.toggleExplodeLinkMenu = toggleExplodeLinkMenu;
    thisCtrl.explodeUnitToProduct = explodeUnitToProduct;


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
                    element_qty: CartStor.cart.allAddElements[i][j].element_qty,
                    elementPriceDis: CartStor.cart.allAddElements[i][j].elementPriceDis
                  };
                  thisCtrl.config.addElemUnitProducts.push(addElemProd);

                } else {

                  addElemProd = {
                    productIndex: i,
                    is_addelem_only: OrderStor.order.products[i].is_addelem_only,
                    element_qty: CartStor.cart.allAddElements[i][j].element_qty / OrderStor.order.products[i].product_qty
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
      thisCtrl.config.isLinkExplodeMenu = 0;
    }



    function deleteAddElemUnit(addElemUnit, isWagon) {
      console.info('delet----', thisCtrl.config.selectedAddElemUnit);

      if(isWagon) {
        //------- decrease Product quantity
        CartServ.decreaseProductQty(addElemUnit[0].productIndex);
      } else {
        //------- delete AddElem in Product
        delAddElemUnitInProduct(addElemUnit);
        CartServ.joinAllAddElements();
      }

      //------ if last AddElem was delete
      if(!CartStor.cart.isExistAddElems) {
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


    function reviewAddElemUnit() {
      var addElemsQty = CartStor.cart.allAddElemsOrder.length,
        noExist = 1;
      while(--addElemsQty > -1) {
        if(CartStor.cart.allAddElemsOrder[addElemsQty].id === thisCtrl.config.selectedAddElemUnit.id) {
          thisCtrl.config.selectedAddElemUnit.element_qty = angular.copy(CartStor.cart.allAddElemsOrder[addElemsQty].element_qty);
          --noExist;
        }
      }
      if(noExist) {
        closeAddElemUnitDetail();
      }
    }


    /**-------- Show/Hide Explode Link Menu ------*/
    function toggleExplodeLinkMenu(prodInd, event) {
      console.log(prodInd);
      console.log(event.center);
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
          newProductQty = cloneProduct.product_qty-1;

      cloneProduct.product_qty = 1;

      //--------- whole explode product
      if(isAllProducts) {
        OrderStor.order.products[addElemUnit[0].productIndex].product_qty = 1;
        while(--newProductQty > -1) {
          CartServ.addCloneProductInOrder(cloneProduct, lastProductId);
        }
      } else {
        //--------- explode product once
        OrderStor.order.products[addElemUnit[0].productIndex].product_qty -= 1;
        CartServ.addCloneProductInOrder(cloneProduct, lastProductId);
      }

      thisCtrl.config.isLinkExplodeMenu = 0;
      CartServ.joinAllAddElements();

      CartServ.showAllAddElements();
      collectAddElemUnitProducts();
      //------ change selected AddElemUnit
      reviewAddElemUnit();

      //------ culculate AddElems Price in each Products
      calculateAddElemsProductsPrice(1);
      //------ change order Price
      CartMenuServ.calculateOrderPrice();

    }


  }
})();
