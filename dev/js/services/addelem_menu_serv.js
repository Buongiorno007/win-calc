(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .factory('AddElementMenuServ', addElemMenuFactory);

  function addElemMenuFactory($q, $timeout, globalConstants, GlobalStor, AuxStor, OrderStor, ProductStor, CartStor, UserStor, localDB, GeneralServ, MainServ, AddElementsServ, AnalyticsServ, CartServ, CartMenuServ) {

    var thisFactory = this,
        delayShowElementsMenu = globalConstants.STEP * 12,
        tempSize = [];

    thisFactory.publicObj = {
      closeAddElementsMenu: closeAddElementsMenu,
      chooseAddElement: chooseAddElement,
      chooseAddElementList: chooseAddElementList,
      getAddElementPrice: getAddElementPrice,
      deleteAddElement: deleteAddElement,
      deleteAllAddElements: deleteAllAddElements,
      //---- calculators:
      setValueQty: setValueQty,
      setValueSize: setValueSize,
      deleteLastNumber: deleteLastNumber,
      closeSizeCaclulator: closeSizeCaclulator
    };

    return thisFactory.publicObj;




    //============ methods ================//

    //-------- Close AddElements Menu
    function closeAddElementsMenu() {
      AuxStor.aux.isFocusedAddElement = 0;
      AuxStor.aux.isTabFrame = 0;
      //playSound('swip');
      AuxStor.aux.showAddElementsMenu = 0;
      AddElementsServ.desactiveAddElementParameters();
      $timeout(function() {
        AuxStor.aux.isAddElement = 0;
        //playSound('swip');
        AuxStor.aux.addElementsMenuStyle = 0;
      }, delayShowElementsMenu);
    }


    //--------- Select AddElement
    function chooseAddElement(typeIndex, elementIndex) {
      if(typeIndex === undefined && elementIndex === undefined) {
        var index = (AuxStor.aux.isFocusedAddElement - 1);
        AddElementsServ.desactiveAddElementParameters();
        AuxStor.aux.isAddElement = 0;
        //-------- clean all elements in selected Type
        ProductStor.product.chosenAddElements[index].length = 0;

        //-------- Set Total Product Price
        setAddElementsTotalPrice(ProductStor.product);

      } else {
        getAddElementPrice(typeIndex, elementIndex).then(function(addElem) {
          pushSelectedAddElement(ProductStor.product, addElem);
          //Set Total Product Price
          setAddElementsTotalPrice(ProductStor.product);

          //------ save analytics data
          //TODO ??? AnalyticsServ.saveAnalyticDB(UserStor.userInfo.id, OrderStor.order.id, ProductStor.product.profile.id, addElem.id, typeIndex);
        });
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
            AuxStor.aux.addElementsList[typeIndex][elementIndex].element_price = angular.copy(GeneralServ.roundingNumbers( results.priceTotal ));
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
      var elementTypeQty = currProduct.chosenAddElements.length;
      currProduct.addelem_price = 0;
      currProduct.addelemPriceDis = 0;
      for (var i = 0; i < elementTypeQty; i++) {
        var elementQty = currProduct.chosenAddElements[i].length;
        if (elementQty > 0) {
          for (var j = 0; j < elementQty; j++) {
            currProduct.addelem_price += currProduct.chosenAddElements[i][j].element_qty * currProduct.chosenAddElements[i][j].element_price;
            currProduct.addelem_price = GeneralServ.roundingNumbers(currProduct.addelem_price);
          }
        }
      }
      currProduct.addelemPriceDis = GeneralServ.setPriceDis(currProduct.addelem_price, OrderStor.order.discount_addelem);
      $timeout(function() {
        MainServ.setProductPriceTOTAL(currProduct);
      }, 50);
    }



    //-------- Delete AddElement from global object
    function deleteAddElement(typeId, elementId) {
      var index = (typeId - 1);
      ProductStor.product.chosenAddElements[index].splice(elementId, 1);
      AddElementsServ.desactiveAddElementParameters();
      //Set Total Product Price
      setAddElementsTotalPrice(ProductStor.product);
    }


    //--------- Delete All List of selected AddElements
    function deleteAllAddElements() {
      var elementsQty = ProductStor.product.chosenAddElements.length;
      for(var index = 0; index < elementsQty; index++) {
        ProductStor.product.chosenAddElements[index].length = 0;
      }
      ProductStor.product.addelem_price = 0;
      ProductStor.product.addelemPriceDis = 0;
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
        ProductStor.product.chosenAddElements[index][elementIndex].element_qty += newValue;
      }

      //--------- Set Total Product Price
      setAddElementsTotalPrice(ProductStor.product);
    }



    /** SIze Calculator */

      //------- Change Size parameter
    function setValueSize(newValue) {
      //console.log($scope.addElementsMenu.tempSize);
      if(tempSize.length == 1 && tempSize[0] === 0) {
        tempSize.length = 0;
      }
      if(tempSize.length < 4) {
        if(newValue === '00'){
          tempSize.push(0, 0);
        } else {
          tempSize.push(newValue);
        }
      }
      changeElementSize();
    }



    //------- Delete last number
    function deleteLastNumber() {
      tempSize.pop();
      if(tempSize.length < 1) {
        tempSize.push(0);
      }
      changeElementSize();
    }


    function changeElementSize(){
      var newElementSize = '',
          elementIndex = AuxStor.aux.currentAddElementId,
          index = (AuxStor.aux.isFocusedAddElement - 1);

      for(var numer = 0; numer < tempSize.length; numer++) {
        newElementSize += tempSize[numer].toString();
      }
      newElementSize = parseInt(newElementSize, 10);

      if(GlobalStor.global.isWidthCalculator) {
        ProductStor.product.chosenAddElements[index][elementIndex].element_width = newElementSize;
      } else {
        if(index === 4) {
          ProductStor.product.chosenAddElements[index][elementIndex].element_height = newElementSize;
        }
      }
    }


    //------- Close Size Calculator
    function closeSizeCaclulator() {
      var elementIndex = AuxStor.aux.currentAddElementId,
          index = (AuxStor.aux.isFocusedAddElement - 1);

      GlobalStor.global.isWidthCalculator = false;
      tempSize.length = 0;
      AddElementsServ.desactiveAddElementParameters();

      //-------- recalculate add element price
      var objXAddElementPrice = {
        currencyId: UserStor.userInfo.currencyId,
        elementId: ProductStor.product.chosenAddElements[index][elementIndex].id,
        elementWidth: (ProductStor.product.chosenAddElements[index][elementIndex].element_width/1000)
      };

      //      console.log('objXAddElementPrice change size ===== ', objXAddElementPrice);
      localDB.getAdditionalPrice(objXAddElementPrice).then(function (results) {
        if (results) {
          //          console.log(results.data.price);
          AuxStor.aux.currAddElementPrice = GeneralServ.setPriceDis(results.priceTotal, OrderStor.order.discount_addelem);
          ProductStor.product.chosenAddElements[index][elementIndex].element_price = angular.copy(GeneralServ.roundingNumbers( results.priceTotal ));
          ProductStor.product.chosenAddElements[index][elementIndex].elementPriceDis = angular.copy(AuxStor.aux.currAddElementPrice);
          //------- Set Total Product Price
          setAddElementsTotalPrice(ProductStor.product);
        } else {
          console.log(results);
        }
      });

    }


  }
})();
