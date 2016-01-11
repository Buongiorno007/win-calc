(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .factory('AddElementMenuServ', addElemMenuFactory);

  function addElemMenuFactory($q, $timeout, globalConstants, GlobalStor, AuxStor, OrderStor, ProductStor, CartStor, UserStor, localDB, GeneralServ, MainServ, AnalyticsServ, CartServ, CartMenuServ) {

    var thisFactory = this,
        delayShowElementsMenu = globalConstants.STEP * 12;

    thisFactory.publicObj = {
      closeAddElementsMenu: closeAddElementsMenu,
      chooseAddElement: chooseAddElement,
      chooseAddElementList: chooseAddElementList,
      getAddElementPrice: getAddElementPrice,
      deleteAddElement: deleteAddElement,
      deleteAllAddElements: deleteAllAddElements,
      desactiveAddElementParameters: desactiveAddElementParameters,
      //---- calculators:
      pressCulculator: pressCulculator,
      setValueQty: setValueQty,
      closeQtyCaclulator: closeQtyCaclulator,
      setValueSize: setValueSize,
      deleteLastNumber: deleteLastNumber,
      changeElementSize: changeElementSize,
      closeSizeCaclulator: closeSizeCaclulator
    };

    return thisFactory.publicObj;




    //============ methods ================//

    //-------- Close AddElements Menu
    function closeAddElementsMenu() {
      if(!GlobalStor.global.isQtyCalculator && !GlobalStor.global.isSizeCalculator) {
        AuxStor.aux.isFocusedAddElement = 0;
        AuxStor.aux.isTabFrame = 0;
        AuxStor.aux.isGridSelectorDialog = 0;
        //playSound('swip');
        AuxStor.aux.showAddElementsMenu = 0;
        desactiveAddElementParameters();
        $timeout(function () {
          AuxStor.aux.isAddElement = 0;
          //playSound('swip');
          AuxStor.aux.addElementsMenuStyle = 0;
        }, delayShowElementsMenu);
      }
    }


    function desactiveAddElementParameters() {
      AuxStor.aux.auxParameter = 0;
      GlobalStor.global.isQtyCalculator = 0;
      GlobalStor.global.isSizeCalculator = 0;
      GlobalStor.global.isWidthCalculator = 0;
    }



    //--------- Select AddElement
    function chooseAddElement(typeIndex, elementIndex) {
      if(!GlobalStor.global.isQtyCalculator && !GlobalStor.global.isSizeCalculator) {
        if (typeIndex === undefined && elementIndex === undefined) {
          var index = (AuxStor.aux.isFocusedAddElement - 1);
          desactiveAddElementParameters();
          AuxStor.aux.isAddElement = 0;
          //-------- clean all elements in selected Type
          ProductStor.product.chosenAddElements[index].length = 0;

          //-------- Set Total Product Price
          setAddElementsTotalPrice(ProductStor.product);

        } else {
          getAddElementPrice(typeIndex, elementIndex).then(function (addElem) {
            pushSelectedAddElement(ProductStor.product, addElem);
            //Set Total Product Price
            setAddElementsTotalPrice(ProductStor.product);

            //------ save analytics data
            //TODO ??? AnalyticsServ.saveAnalyticDB(UserStor.userInfo.id, OrderStor.order.id, ProductStor.product.profile.id, addElem.id, typeIndex);
          });
        }
      }
    }


    //--------- Select AddElement List
    function chooseAddElementList(typeIndex, elementIndex) {
      /** in main page */
      if(GlobalStor.global.currOpenPage === 'main') {

        pushSelectedAddElement(ProductStor.product, AuxStor.aux.addElementsList[typeIndex][elementIndex]);
        //Set Total Product Price
        setAddElementsTotalPrice(ProductStor.product);

      } else if(GlobalStor.global.currOpenPage === 'cart') {
        /** in cart page */
        var productsQty = CartStor.cart.selectedProducts.length;
        for(var p = 0; p < productsQty; p++) {
          if(CartStor.cart.selectedProducts[p].length) {
            pushSelectedAddElement(OrderStor.order.products[p], AuxStor.aux.addElementsList[typeIndex][elementIndex]);
            //Set Total Product Price
            CartServ.calculateAddElemsProductsPrice(1);
            CartServ.joinAllAddElements();
            CartServ.collectAllAddElems();
            CartServ.getAddElemsPriceTotal();
            //------ change order Price
            CartMenuServ.calculateOrderPrice();
          }
        }
      }
      //----- hide element price in menu
      AuxStor.aux.currAddElementPrice = 0;
      //------ save analytics data
      //TODO ??? AnalyticsServ.saveAnalyticDB(UserStor.userInfo.id, OrderStor.order.id, ProductStor.product.profile.id, AuxStor.aux.addElementsList[typeIndex][elementIndex].id, typeIndex);
      AuxStor.aux.isAddElement = 0;
    }


    function getAddElementPrice(typeIndex, elementIndex) {
      var deferred = $q.defer();
      AuxStor.aux.isAddElement = typeIndex+'-'+elementIndex;
      //------- checking if add element price is
      if(AuxStor.aux.addElementsList[typeIndex][elementIndex].element_price > 0) {
        AuxStor.aux.currAddElementPrice = GeneralServ.setPriceDis(AuxStor.aux.addElementsList[typeIndex][elementIndex].element_price, OrderStor.order.discount_addelem);
        AuxStor.aux.addElementsList[typeIndex][elementIndex].elementPriceDis = angular.copy(AuxStor.aux.currAddElementPrice);

        deferred.resolve(angular.copy(AuxStor.aux.addElementsList[typeIndex][elementIndex]));
      } else {
        var objXAddElementPrice = {
          currencyId: UserStor.userInfo.currencyId,
          elementId: AuxStor.aux.addElementsList[typeIndex][elementIndex].id,
          elementWidth: (AuxStor.aux.addElementsList[typeIndex][elementIndex].element_width/1000)
        };
//                console.log('objXAddElementPrice=====', objXAddElementPrice);
        //-------- get current add element price
        localDB.getAdditionalPrice(objXAddElementPrice).then(function (results) {
          if (results) {
            AuxStor.aux.currAddElementPrice = GeneralServ.setPriceDis(results.priceTotal, OrderStor.order.discount_addelem);
            AuxStor.aux.addElementsList[typeIndex][elementIndex].element_price = angular.copy(GeneralServ.roundingValue( results.priceTotal ));
            AuxStor.aux.addElementsList[typeIndex][elementIndex].elementPriceDis = angular.copy(AuxStor.aux.currAddElementPrice);
            deferred.resolve(angular.copy(AuxStor.aux.addElementsList[typeIndex][elementIndex]));
          } else {
            deferred.reject(results);
          }
        });
      }
      return deferred.promise;
    }



    function pushSelectedAddElement(currProduct, currElement) {
      var index = (AuxStor.aux.isFocusedAddElement - 1),
          existedElement;

      existedElement = checkExistedSelectAddElement(currProduct.chosenAddElements[index], currElement.id);
      if(existedElement === undefined) {
        var newElementSource = {
              element_type: index,
              element_width: 0,
              element_height: 0
            },
            newElement = angular.extend(newElementSource, currElement);

        currProduct.chosenAddElements[index].push(newElement);
        //---- open TABFrame when second element selected
        if(currProduct.chosenAddElements[index].length === 2) {
          AuxStor.aux.isTabFrame = 1;
        }
      } else {
        currProduct.chosenAddElements[index][existedElement].element_qty += 1;
      }

    }


    //--------- when we select new addElement, function checks is there this addElements in order to increase only elementQty
    function checkExistedSelectAddElement(elementsArr, elementId) {
      for(var j = 0; j < elementsArr.length; j++){
        if(elementsArr[j].id === elementId) {
          return j;
        }
      }
    }


    function setAddElementsTotalPrice(currProduct) {
      var elemTypeQty = currProduct.chosenAddElements.length;
      currProduct.addelem_price = 0;
      currProduct.addelemPriceDis = 0;
      while(--elemTypeQty > -1) {
        var elemQty = currProduct.chosenAddElements[elemTypeQty].length;
        if (elemQty > 0) {
          while(--elemQty > -1) {
            currProduct.addelem_price += (currProduct.chosenAddElements[elemTypeQty][elemQty].element_qty * currProduct.chosenAddElements[elemTypeQty][elemQty].element_price);
          }
        }
      }
      currProduct.addelem_price = GeneralServ.roundingValue(currProduct.addelem_price);
      currProduct.addelemPriceDis = GeneralServ.setPriceDis(currProduct.addelem_price, OrderStor.order.discount_addelem);
      //console.info('setAddElementsTotalPrice', currProduct.addelem_price, currProduct.addelemPriceDis);
      $timeout(function() {
        MainServ.setProductPriceTOTAL(currProduct);
      }, 50);
    }



    //-------- Delete AddElement from global object
    function deleteAddElement(typeId, elementId) {
      var index = (typeId - 1);
      ProductStor.product.chosenAddElements[index].splice(elementId, 1);
      desactiveAddElementParameters();
      //Set Total Product Price
      setAddElementsTotalPrice(ProductStor.product);
    }


    //--------- Delete All List of selected AddElements
    function deleteAllAddElements() {
      var elementsQty = ProductStor.product.chosenAddElements.length;
      while(--elementsQty > -1) {
        ProductStor.product.chosenAddElements[elementsQty].length = 0;
      }
      ProductStor.product.addelem_price = 0;
      ProductStor.product.addelemPriceDis = 0;
      //Set Total Product Price
      setAddElementsTotalPrice(ProductStor.product);
    }






    /** Qty Calculator */

    //--------- Change Qty parameter
    function setValueQty(newValue) {
      var elementIndex = AuxStor.aux.currentAddElementId,
          index = (AuxStor.aux.isFocusedAddElement - 1);
      if(ProductStor.product.chosenAddElements[index][elementIndex].element_qty < 2 && newValue < 0) {
        return false;
      } else if(ProductStor.product.chosenAddElements[index][elementIndex].element_qty < 6 && newValue == -5) {
        return false;
      } else {
        if(AuxStor.aux.tempSize.length) {
          ProductStor.product.chosenAddElements[index][elementIndex].element_qty =  parseInt(AuxStor.aux.tempSize.join(''), 10) + newValue;
          AuxStor.aux.tempSize.length = 0;
        } else {
          ProductStor.product.chosenAddElements[index][elementIndex].element_qty += newValue;
        }
      }
      //console.info('Qty-----', AuxStor.aux.tempSize, ProductStor.product.chosenAddElements[index][elementIndex].element_qty);
      //--------- Set Total Product Price
      //setAddElementsTotalPrice(ProductStor.product);
    }


    //--------- Close Qty Calculator
    function closeQtyCaclulator() {
      //------- close caclulators
      desactiveAddElementParameters();
      //------ clean tempSize
      AuxStor.aux.tempSize.length = 0;
      //--------- Set Total Product Price
      setAddElementsTotalPrice(ProductStor.product);
    }




    /** SIze Calculator */


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
          //if (GlobalStor.global.isQtyCalculator) {
          //  setValueQty(newValue);
          //} else if (GlobalStor.global.isSizeCalculator) {
            setValueSize(newValue);
          //}
        }
      }
    }


      //------- Change Size parameter
    function setValueSize(newValue) {
      //console.info('tempSize====', AuxStor.aux.tempSize);
      //---- clean tempSize if indicate only one 0
      if(AuxStor.aux.tempSize.length === 1 && AuxStor.aux.tempSize[0] === 0) {
        AuxStor.aux.tempSize.length = 0;
      }
      if(AuxStor.aux.tempSize.length === 4) {
        AuxStor.aux.tempSize.length = 0;
      }
      if(newValue === '00'){
        if(AuxStor.aux.tempSize.length === 1 || AuxStor.aux.tempSize.length === 2) {
          AuxStor.aux.tempSize.push(0, 0);
          changeElementSize();
        } else if(AuxStor.aux.tempSize.length === 3) {
          AuxStor.aux.tempSize.push(0);
          changeElementSize();
        }
      } else {
        if(AuxStor.aux.tempSize.length < 4) {
          AuxStor.aux.tempSize.push(newValue);
          changeElementSize();
        }
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


    function changeElementSize(){
      var newElementSize = '',
          elementIndex = AuxStor.aux.currentAddElementId,
          index = (AuxStor.aux.isFocusedAddElement - 1);

      newElementSize = parseInt(AuxStor.aux.tempSize.join(''), 10);

      if(GlobalStor.global.isQtyCalculator) {
        ProductStor.product.chosenAddElements[index][elementIndex].element_qty = newElementSize;
      } else if(GlobalStor.global.isSizeCalculator) {
        if(GlobalStor.global.isWidthCalculator) {
          ProductStor.product.chosenAddElements[index][elementIndex].element_width = newElementSize;
        } else {
          if(index === 4) {
            ProductStor.product.chosenAddElements[index][elementIndex].element_height = newElementSize;
          }
        }
      }

    }


    //------- Close Size Calculator
    function closeSizeCaclulator() {
      var elementIndex = AuxStor.aux.currentAddElementId,
          index = (AuxStor.aux.isFocusedAddElement - 1);
//console.info('closeSizeCaclulator');
      GlobalStor.global.isWidthCalculator = false;
      AuxStor.aux.tempSize.length = 0;
      desactiveAddElementParameters();

      //-------- recalculate add element price
      var objXAddElementPrice = {
        currencyId: UserStor.userInfo.currencyId,
        elementId: ProductStor.product.chosenAddElements[index][elementIndex].id,
        elementWidth: (ProductStor.product.chosenAddElements[index][elementIndex].element_width / 1000)
      };

      //      console.log('objXAddElementPrice change size ===== ', objXAddElementPrice);
      localDB.getAdditionalPrice(objXAddElementPrice).then(function (results) {
        if (results) {
          //          console.log(results.data.price);
          AuxStor.aux.currAddElementPrice = GeneralServ.setPriceDis(results.priceTotal, OrderStor.order.discount_addelem);
          ProductStor.product.chosenAddElements[index][elementIndex].element_price = angular.copy(GeneralServ.roundingValue(results.priceTotal));
          ProductStor.product.chosenAddElements[index][elementIndex].elementPriceDis = angular.copy(AuxStor.aux.currAddElementPrice);
          //console.info('closeSizeCaclulator', ProductStor.product.chosenAddElements[index][elementIndex].element_price, ProductStor.product.chosenAddElements[index][elementIndex].elementPriceDis);
          //------- Set Total Product Price
          setAddElementsTotalPrice(ProductStor.product);
        } else {
          console.log(results);
        }
      });
    }


  }
})();
