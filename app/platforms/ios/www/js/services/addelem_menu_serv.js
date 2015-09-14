(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .factory('AddElementMenuServ', addElemMenuFactory);

  function addElemMenuFactory($rootScope, $q, $timeout, globalConstants, GlobalStor, AuxStor, OrderStor, ProductStor, UserStor, localDB, GeneralServ, MainServ, AddElementsServ, analyticsServ) {

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
      AuxStor.aux.isFocusedAddElement = false;
      AuxStor.aux.isTabFrame = false;
      //playSound('swip');
      AuxStor.aux.showAddElementsMenu = false;
      AddElementsServ.desactiveAddElementParameters();
      $timeout(function() {
        AuxStor.aux.isAddElement = false;
        //playSound('swip');
        AuxStor.aux.addElementsMenuStyle = false;
      }, delayShowElementsMenu);
    }


    //--------- Select AddElement
    function chooseAddElement(typeIndex, elementIndex) {
      if(typeIndex === undefined && elementIndex === undefined) {
        var index = (AuxStor.aux.isFocusedAddElement - 1);
        AddElementsServ.desactiveAddElementParameters();
        AuxStor.aux.isAddElement = false;
        //-------- clean all elements in selected Type
        ProductStor.product.chosenAddElements[index].length = 0;

        //-------- Set Total Product Price
        setAddElementsTotalPrice();

      } else {
        getAddElementPrice(typeIndex, elementIndex).then(function(addElem) {
          pushSelectedAddElement(addElem);
          //Set Total Product Price
          setAddElementsTotalPrice();

          //------ save analytics data
          //TODO analyticsServ.saveAnalyticDB(UserStor.userInfo.id, OrderStor.order.order_number, addElem.element_id, typeIndex);
        });
      }
    }


    //--------- Select AddElement List
    function chooseAddElementList(typeIndex, elementIndex) {
      pushSelectedAddElement(AuxStor.aux.addElementsList[typeIndex][elementIndex]);
      //Set Total Product Price
      setAddElementsTotalPrice();
      //----- hide element price in menu
      AuxStor.aux.currAddElementPrice = 0;
      //------ save analytics data
      //TODO analyticsServ.saveAnalyticDB(UserStor.userInfo.id, OrderStor.order.order_number, AuxStor.aux.addElementsList[typeIndex][elementIndex].element_id, typeIndex);
      AuxStor.aux.isAddElement = false;
    }


    function getAddElementPrice(typeIndex, elementIndex) {
      var deferred = $q.defer();
      AuxStor.aux.isAddElement = typeIndex+'-'+elementIndex;
      //------- checking if add element price is
      if(AuxStor.aux.addElementsList[typeIndex][elementIndex].element_price > 0) {
        AuxStor.aux.currAddElementPrice = GeneralServ.roundingNumbers( AuxStor.aux.addElementsList[typeIndex][elementIndex].element_price * (1 - OrderStor.order.discount_addelem/100) );
        AuxStor.aux.addElementsList[typeIndex][elementIndex].elementPriceDis = angular.copy(AuxStor.aux.currAddElementPrice);

        deferred.resolve(angular.copy(AuxStor.aux.addElementsList[typeIndex][elementIndex]));
      } else {
        var objXAddElementPrice = {
          cityId: UserStor.userInfo.city_id,
          currencyId: UserStor.userInfo.currencyId,
          elementId: AuxStor.aux.addElementsList[typeIndex][elementIndex].element_id,
          elementLength: AuxStor.aux.addElementsList[typeIndex][elementIndex].element_width
        };

        //-------- get current add element price
        localDB.getAdditionalPrice(objXAddElementPrice, function (results) {
          if (results.status) {
            AuxStor.aux.currAddElementPrice = GeneralServ.roundingNumbers( results.data.price * (1 - OrderStor.order.discount_addelem/100) );
            AuxStor.aux.addElementsList[typeIndex][elementIndex].element_price = angular.copy(GeneralServ.roundingNumbers( results.data.price ));
            AuxStor.aux.addElementsList[typeIndex][elementIndex].elementPriceDis = angular.copy(AuxStor.aux.currAddElementPrice);
            $rootScope.$apply();
            deferred.resolve(angular.copy(AuxStor.aux.addElementsList[typeIndex][elementIndex]));
          } else {
            deferred.reject(results);
          }
        });
      }
      return deferred.promise;
    }



    function pushSelectedAddElement(currElement) {
      var index = (AuxStor.aux.isFocusedAddElement - 1),
          existedElement;

      existedElement = checkExistedSelectAddElement(ProductStor.product.chosenAddElements[index], currElement.element_id);
      if(existedElement === undefined) {
        var newElementSource = {
              element_type: AuxStor.aux.isFocusedAddElement,
              element_width: 0,
              element_height: 0
            },
            newElement = angular.extend(newElementSource, currElement);

        ProductStor.product.chosenAddElements[index].push(newElement);
        //---- open TABFrame when second element selected
        if(ProductStor.product.chosenAddElements[index].length === 2) {
          AuxStor.aux.isTabFrame = true;
        }
      } else {
        ProductStor.product.chosenAddElements[index][existedElement].element_qty += 1;
      }

    }


    //--------- when we select new addElement, function checks is there this addElements in order to increase only elementQty
    function checkExistedSelectAddElement(elementsArr, elementId) {
      for(var j = 0; j < elementsArr.length; j++){
        if(elementsArr[j].element_id === elementId) {
          return j;
        }
      }
    }


    function setAddElementsTotalPrice() {
      var elementTypeQty = ProductStor.product.chosenAddElements.length;
      ProductStor.product.addelem_price = 0;
      ProductStor.product.addElementsPriceSELECTDis = 0;
      for (var i = 0; i < elementTypeQty; i++) {
        var elementQty = ProductStor.product.chosenAddElements[i].length;
        if (elementQty > 0) {
          for (var j = 0; j < elementQty; j++) {
            ProductStor.product.addelem_price += ProductStor.product.chosenAddElements[i][j].element_qty * ProductStor.product.chosenAddElements[i][j].element_price;
            ProductStor.product.addelem_price = GeneralServ.roundingNumbers(ProductStor.product.addelem_price);
          }
        }
      }
      ProductStor.product.addElementsPriceSELECTDis = GeneralServ.roundingNumbers( ProductStor.product.addelem_price * (1 - OrderStor.order.discount_addelem/100) );
      $timeout(function() {
        MainServ.setProductPriceTOTAL();
      }, 50);
    }



    //-------- Delete AddElement from global object
    function deleteAddElement(typeId, elementId) {
      var index = (typeId - 1);
      ProductStor.product.chosenAddElements[index].splice(elementId, 1);
      AddElementsServ.desactiveAddElementParameters();
      //Set Total Product Price
      setAddElementsTotalPrice();
    }


    //--------- Delete All List of selected AddElements
    function deleteAllAddElements() {
      var elementsQty = ProductStor.product.chosenAddElements.length;
      for(var index = 0; index < elementsQty; index++) {
        ProductStor.product.chosenAddElements[index].length = 0;
      }
      ProductStor.product.addelem_price = 0;
      ProductStor.product.addElementsPriceSELECTDis = 0;
    }








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
      setAddElementsTotalPrice();
    }



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
        cityId: UserStor.userInfo.city_id,
        currencyId: UserStor.userInfo.currencyId,
        elementId: ProductStor.product.chosenAddElements[index][elementIndex].element_id,
        elementLength: ProductStor.product.chosenAddElements[index][elementIndex].element_width
      };

      //console.log('objXAddElementPrice change size ===== ', $scope.global.objXAddElementPrice);
      localDB.getAdditionalPrice(objXAddElementPrice, function (results) {
        if (results.status) {
//          console.log('change size!!!!!!!');
//          console.log(results.data.price);
          //var newElementPrice = parseFloat(results.data.price);
          //$scope.addElementsMenu.isAddElementPrice = true;
          AuxStor.aux.currAddElementPrice = GeneralServ.roundingNumbers( results.data.price * (1 - OrderStor.order.discount_addelem/100) );
          ProductStor.product.chosenAddElements[index][elementIndex].element_price = angular.copy(GeneralServ.roundingNumbers( results.data.price ));
          ProductStor.product.chosenAddElements[index][elementIndex].elementPriceDis = angular.copy(AuxStor.aux.currAddElementPrice);
          //------- Set Total Product Price
          setAddElementsTotalPrice();
          //$scope.$apply();

        } else {
          console.log(results);
        }
      });

    }


  }
})();