(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .factory('EditAddElementCartServ',

  function(
    $q,
    $timeout,
    GlobalStor,
    OrderStor,
    CartStor,
    AuxStor,
    DesignStor,
    UserStor,
    localDB,
    GeneralServ,
    MainServ,
    CartServ,
    CartMenuServ
  ) {
    /*jshint validthis:true */
    var thisFactory = this;
    var firstIndex = 0;
    var secondIndex = 0;




    /**============ METHODS ================*/


    function desactiveAddElementParameters() {
      AuxStor.aux.auxParameter = 0;
      GlobalStor.global.isQtyCalculator = 0;
      GlobalStor.global.isSizeCalculator = 0;
      GlobalStor.global.isWidthCalculator = 0;
    }


    /** =========== Qty Calculator ========== */

    //--------- Change Qty parameter
    function setValueQty(newValue) {
      console.log(newValue, 'newValue')
      var obj = [
        'element_height',
        'element_type',
        'element_width',
        'id',
        'list_group_id',
        'name'
      ];
      var products = OrderStor.order.products;
      var addElemProdQty, addElemQty, addElem;
      var element = CartStor.cart.allAddElemsOrder,
          index = CartStor.cart.addElemIndex;
      if(element[index].element_qty + newValue <= 0 || newValue == 0) {
        console.log('false')
        return false;
      } else {

          addElem = products[CartStor.cart.selectedProduct].chosenAddElements;
          addElemProdQty = addElem.length;
          while(--addElemProdQty > -1) {
            addElemQty = addElem[addElemProdQty].length;
            if(addElemQty) {
              while(--addElemQty > -1) {
                if(_.isEqual(_.pick(element[index], obj), _.pick(addElem[addElemProdQty][addElemQty], obj))) {
                  if(AuxStor.aux.tempSize.length) {
                    element[index].element_qty = parseInt(AuxStor.aux.tempSize.join(''), 10) + newValue;
                    addElem[addElemProdQty][addElemQty].element_qty = parseInt(AuxStor.aux.tempSize.join(''), 10) + newValue;
                    AuxStor.aux.tempSize.length = 0;
                  } else {
                    element[index].element_qty += newValue;
                    addElem[addElemProdQty][addElemQty].element_qty += newValue;
                  }
                  firstIndex = addElemProdQty;
                  secondIndex = addElemQty;
                  calcAddElemPrice(element[index]).then(function() {
                    calcAddElemPrice(OrderStor.order.products[0].chosenAddElements[firstIndex][secondIndex]).then(function() {
                      CartServ.calculateAddElemsProductsPrice(1);
                      CartMenuServ.calculateOrderPrice();
                      CartMenuServ.joinAllAddElements();
                      CartServ.getAddElemsPriceTotal();
                    });
                  });
                }
              }
            }
          
        }
      }
    }


    //--------- Close Qty Calculator
    function closeQtyCaclulator() {
      //------- close caclulators
      desactiveAddElementParameters();
      //------ clean tempSize
      AuxStor.aux.tempSize.length = 0;
      //--------- Set Total Product Price
    }




  /** ============= SIze Calculator ============= */


    function calcAddElemPrice(item) {
      var item;
      /** Grid */
      if(item.list_group_id === 20) {

        var objXAddElementPrice = {
          currencyId: UserStor.userInfo.currencyId,
          element: item
        };
        //-------- get current add element price
        return localDB.calculationGridPrice(objXAddElementPrice).then(function (results) {
          if (results) {
            item.element_price = angular.copy(GeneralServ.roundingValue(
              GeneralServ.addMarginToPrice(results.priceTotal, GlobalStor.global.margins.margin)
            ));
            item.elementPriceDis = angular.copy(GeneralServ.roundingValue(
              GeneralServ.setPriceDis(item.element_price, OrderStor.order.discount_addelem)
            ));
            AuxStor.aux.currAddElementPrice = angular.copy(item.elementPriceDis);
          }
          return results;
        });

      } else {
        var objXAddElementPrice = {
          currencyId: UserStor.userInfo.currencyId,
          elementId: item.id,
          elementWidth: (item.element_width/1000),
          elementHeight: (item.element_height/1000)
        };
        return localDB.getAdditionalPrice(objXAddElementPrice).then(function (results) {
          if (results) {
            item.element_price = GeneralServ.roundingValue(
              GeneralServ.addMarginToPrice(results.priceTotal, GlobalStor.global.margins.margin)
            );
            item.elementPriceDis = GeneralServ.roundingValue(
              GeneralServ.setPriceDis(
                item.element_price, OrderStor.order.discount_addelem
              )
            );
            AuxStor.aux.currAddElementPrice = angular.copy(item.elementPriceDis);
          }
          return results;
        });
      }
    }


    //------- Close Size Calculator
    function closeSizeCaclulator() {
      var element = CartStor.cart.allAddElemsOrder,
      index = CartStor.cart.addElemIndex;
      AuxStor.aux.tempSize.length = 0;
      if(element[index].element_width <= GlobalStor.global.maxSizeAddElem) {
        desactiveAddElementParameters();
        DesignStor.design.isMinSizeRestriction = 0;
        DesignStor.design.isMaxSizeRestriction = 0;
        //-------- recalculate add element price
        calcAddElemPrice(element[index]).then(function() {
          calcAddElemPrice(OrderStor.order.products[CartStor.cart.selectedProduct].chosenAddElements[firstIndex][secondIndex]).then(function() {
            CartServ.calculateAddElemsProductsPrice(1);
            CartMenuServ.calculateOrderPrice();
            CartMenuServ.joinAllAddElements();
            CartServ.getAddElemsPriceTotal();
          });
        });
      } else {
        DesignStor.design.isMinSizeRestriction = 0;
        DesignStor.design.isMaxSizeRestriction = 1;
        element[index].element_width = 1000;
      }


    }


    function changeElementSize(){
      var obj = [
        'element_height',
        'element_type',
        'element_width',
        'id',
        'list_group_id',
        'name'
      ];
      var products = OrderStor.order.products;
      var addElemProdQty, addElemQty, addElem;
      var element = CartStor.cart.allAddElemsOrder,
      index = CartStor.cart.addElemIndex;
      var newElementSize = '',
      newElementSize = parseInt(AuxStor.aux.tempSize.join(''), 10);

        addElem = products[CartStor.cart.selectedProduct].chosenAddElements;
        addElemProdQty = addElem.length;
        while(--addElemProdQty > -1) {
          addElemQty = addElem[addElemProdQty].length;
          if(addElemQty) {
            while(--addElemQty > -1) {
              if(_.isEqual(_.pick(element[index], obj), _.pick(addElem[addElemProdQty][addElemQty], obj))) {

                  if(GlobalStor.global.isWidthCalculator) {
                    element[index].element_width = newElementSize;
                    addElem[addElemProdQty][addElemQty].element_width = newElementSize;
                  } else {
                    element[index].element_height = newElementSize;
                    addElem[addElemProdQty][addElemQty].element_height = newElementSize;
                  }
                
                firstIndex = addElemProdQty;
                secondIndex = addElemQty;
              }
            }
          }
        }
      
    }


    //------- Change Size parameter
    function setValueSize(newValue) {
      var sizeLength = AuxStor.aux.tempSize.length;
      //---- clean tempSize if indicate only one 0
      if(sizeLength === 4 || (sizeLength === 1 && !AuxStor.aux.tempSize[0])) {
        AuxStor.aux.tempSize.length = 0;
      }
      if (newValue === '0') {
        if (sizeLength && AuxStor.aux.tempSize[0]) {
          AuxStor.aux.tempSize.push(newValue);
          changeElementSize();
        }
      } else if(newValue === '00') {
        if (sizeLength && AuxStor.aux.tempSize[0]) {
          if (sizeLength < 3) {
            AuxStor.aux.tempSize.push(0, 0);
          } else if (sizeLength === 3) {
            AuxStor.aux.tempSize.push(0);
          }
          changeElementSize();
        }
      } else {
        AuxStor.aux.tempSize.push(newValue);
        changeElementSize();
      }

    }



    //------- Delete last number
    function deleteLastNumber() {
      AuxStor.aux.tempSize.pop();
      if(AuxStor.aux.tempSize.length < 1) {
        AuxStor.aux.tempSize.push(0);
      }
      changeElementSize();
    }



    function pressCulculator(keyEvent) {
      //console.log('PRESS KEY====', keyEvent.which);
      var newValue;
      //------ Enter
      if (keyEvent.which === 13) {
        if (GlobalStor.global.isQtyCalculator) {
          closeQtyCaclulator();
        } else if (GlobalStor.global.isSizeCalculator) {
          closeSizeCaclulator();
        }
      } else if(keyEvent.which === 8) {
        //-------- Backspace
        deleteLastNumber();
      } else {
        //-------- Numbers
        switch(keyEvent.which) {
          case 48:
          case 96:
            newValue = 0;
            break;
          case 49:
          case 97:
            newValue = 1;
            break;
          case 50:
          case 98:
            newValue = 2;
            break;
          case 51:
          case 99:
            newValue = 3;
            break;
          case 52:
          case 100:
            newValue = 4;
            break;
          case 53:
          case 101:
            newValue = 5;
            break;
          case 54:
          case 102:
            newValue = 6;
            break;
          case 55:
          case 103:
            newValue = 7;
            break;
          case 56:
          case 104:
            newValue = 8;
            break;
          case 57:
          case 105:
            newValue = 9;
            break;
        }
        if(newValue !== undefined) {
          setValueSize(newValue);
        }
      }
    }





    function finishCalculators() {
      //if(AuxStor.aux.tempSize.length) {
      //changeElementSize();
      if(GlobalStor.global.isSizeCalculator) {
        closeSizeCaclulator();
      } else if(GlobalStor.global.isQtyCalculator) {
        closeQtyCaclulator();
      }
      //}
      AuxStor.aux.currentAddElementId = 0;
    }




    //-------- Close AddElements Menu
    function closeAddElementsMenu() {
      $('#'+AuxStor.aux.trfal).css({
            'color' : '#363636'
             });
      if(GlobalStor.global.isQtyCalculator || GlobalStor.global.isSizeCalculator) {
        /** calc Price previous parameter and close caclulators */
        finishCalculators();
      }
      AuxStor.aux.isFocusedAddElement = 0;
      AuxStor.aux.isTabFrame = 0;
      AuxStor.aux.isGridSelectorDialog = 0;
      AuxStor.aux.selectedGrid = 0;
      AuxStor.aux.showAddElementsMenu = 0;
      AuxStor.aux.isAddElement = 0;
      //playSound('swip');
    }



    function setAddElementsTotalPrice(currProduct) {
      var elemTypeQty = currProduct.chosenAddElements.length,
          elemQty;
      currProduct.addelem_price = 0;
      currProduct.addelemPriceDis = 0;
      while(--elemTypeQty > -1) {
        elemQty = currProduct.chosenAddElements[elemTypeQty].length;
        if (elemQty > 0) {
          while(--elemQty > -1) {
            currProduct.addelem_price += (currProduct.chosenAddElements[elemTypeQty][elemQty].element_qty * currProduct.chosenAddElements[elemTypeQty][elemQty].element_price);

          }
        }
      }
      currProduct.addelem_price = GeneralServ.roundingValue(currProduct.addelem_price);
      currProduct.addelemPriceDis = GeneralServ.setPriceDis(
        currProduct.addelem_price, OrderStor.order.discount_addelem
      );
      $timeout(function() {
        if(GlobalStor.global.currOpenPage !== 'history') {
          MainServ.setProductPriceTOTAL(currProduct);
        }
      }, 50);
    }


    /**========== FINISH ==========*/

    thisFactory.publicObj = {
      closeAddElementsMenu: closeAddElementsMenu,
      finishCalculators: finishCalculators,
      pressCulculator: pressCulculator,
      deleteLastNumber: deleteLastNumber,
      setValueSize: setValueSize,
      changeElementSize: changeElementSize,
      closeSizeCaclulator: closeSizeCaclulator,
      calcAddElemPrice: calcAddElemPrice,
      desactiveAddElementParameters: desactiveAddElementParameters,
      setValueQty: setValueQty,
      closeQtyCaclulator: closeQtyCaclulator,

    };

    return thisFactory.publicObj;

  });
})();



