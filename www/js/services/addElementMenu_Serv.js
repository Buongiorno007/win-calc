
// services/addElementMenu_Serv.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .factory('AddElementMenuServ', addElemMenuFactory);

  function addElemMenuFactory($rootScope, $q, $timeout, globalConstants, GlobalStor, AuxStor, OrderStor, ProductStor, UserStor, globalDB, GeneralServ, MainServ, AddElementsServ, analyticsServ) {

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
      closeSizeCaclulator: closeSizeCaclulator,
      selectAddElementColor: selectAddElementColor
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
          analyticsServ.saveAnalyticDB(UserStor.userInfo.id, OrderStor.order.orderId, addElem.elementId, typeIndex);
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
      analyticsServ.saveAnalyticDB(UserStor.userInfo.id, OrderStor.order.orderId, AuxStor.aux.addElementsList[typeIndex][elementIndex].elementId, typeIndex);
      AuxStor.aux.isAddElement = false;
    }


    function getAddElementPrice(typeIndex, elementIndex) {
      var deferred = $q.defer();
      AuxStor.aux.isAddElement = typeIndex+'-'+elementIndex;
      //------- checking if add element price is
      if(AuxStor.aux.addElementsList[typeIndex][elementIndex].elementPrice > 0) {
        AuxStor.aux.currAddElementPrice = GeneralServ.roundingNumbers( AuxStor.aux.addElementsList[typeIndex][elementIndex].elementPrice * (1 - OrderStor.order.currDiscountAddElem/100) );
        AuxStor.aux.addElementsList[typeIndex][elementIndex].elementPriceDis = angular.copy(AuxStor.aux.currAddElementPrice);

        deferred.resolve(angular.copy(AuxStor.aux.addElementsList[typeIndex][elementIndex]));
      } else {
        var objXAddElementPrice = {
          cityId: UserStor.userInfo.city_id,
          currencyId: UserStor.userInfo.currencyId,
          elementId: AuxStor.aux.addElementsList[typeIndex][elementIndex].elementId,
          elementLength: AuxStor.aux.addElementsList[typeIndex][elementIndex].elementWidth
        };

        //-------- get current add element price
        globalDB.getAdditionalPrice(objXAddElementPrice, function (results) {
          if (results.status) {
            AuxStor.aux.currAddElementPrice = GeneralServ.roundingNumbers( results.data.price * (1 - OrderStor.order.currDiscountAddElem/100) );
            AuxStor.aux.addElementsList[typeIndex][elementIndex].elementPrice = angular.copy(GeneralServ.roundingNumbers( results.data.price ));
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

      existedElement = checkExistedSelectAddElement(ProductStor.product.chosenAddElements[index], currElement.elementId);
      if(existedElement === undefined) {
        var newElementSource = {
              elementType: AuxStor.aux.isFocusedAddElement,
              elementWidth: 0,
              elementHeight: 0,
              elementColor: '',
              elementColorId: 0
            },
            newElement = angular.extend(newElementSource, currElement);

        ProductStor.product.chosenAddElements[index].push(newElement);
        //---- open TABFrame when second element selected
        if(ProductStor.product.chosenAddElements[index].length === 2) {
          AuxStor.aux.isTabFrame = true;
        }
      } else {
        ProductStor.product.chosenAddElements[index][existedElement].elementQty += 1;
      }

    }


    //--------- when we select new addElement, function checks is there this addElements in order to increase only elementQty
    function checkExistedSelectAddElement(elementsArr, elementId) {
      for(var j = 0; j < elementsArr.length; j++){
        if(elementsArr[j].elementId === elementId) {
          return j;
        }
      }
    }


    function setAddElementsTotalPrice() {
      var elementTypeQty = ProductStor.product.chosenAddElements.length;
      ProductStor.product.addElementsPriceSELECT = 0;
      ProductStor.product.addElementsPriceSELECTDis = 0;
      for (var i = 0; i < elementTypeQty; i++) {
        var elementQty = ProductStor.product.chosenAddElements[i].length;
        if (elementQty > 0) {
          for (var j = 0; j < elementQty; j++) {
            ProductStor.product.addElementsPriceSELECT += ProductStor.product.chosenAddElements[i][j].elementQty * ProductStor.product.chosenAddElements[i][j].elementPrice;
            ProductStor.product.addElementsPriceSELECT = GeneralServ.roundingNumbers(ProductStor.product.addElementsPriceSELECT);
          }
        }
      }
      ProductStor.product.addElementsPriceSELECTDis = GeneralServ.roundingNumbers( ProductStor.product.addElementsPriceSELECT * (1 - OrderStor.order.currDiscountAddElem/100) );
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
      var elementsQty = ProductStor.product.chosenAddElements.length,
          index = 0;
      for(; index < elementsQty; index++) {
        ProductStor.product.chosenAddElements[index].length = 0;
      }
      ProductStor.product.addElementsPriceSELECT = 0;
      ProductStor.product.addElementsPriceSELECTDis = 0;
    }








    //--------- Change Qty parameter
    function setValueQty(newValue) {
      var elementIndex = AuxStor.aux.currentAddElementId,
        index = (AuxStor.aux.isFocusedAddElement - 1);

      if(ProductStor.product.chosenAddElements[index][elementIndex].elementQty < 2 && newValue < 0) {
        return false;
      } else if(ProductStor.product.chosenAddElements[index][elementIndex].elementQty < 6 && newValue == -5) {
        return false;
      } else {
        ProductStor.product.chosenAddElements[index][elementIndex].elementQty += newValue;
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
        ProductStor.product.chosenAddElements[index][elementIndex].elementWidth = newElementSize;
      } else {
        if(index === 4) {
          ProductStor.product.chosenAddElements[index][elementIndex].elementHeight = newElementSize;
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
        elementId: ProductStor.product.chosenAddElements[index][elementIndex].elementId,
        elementLength: ProductStor.product.chosenAddElements[index][elementIndex].elementWidth
      };

      //console.log('objXAddElementPrice change size ===== ', $scope.global.objXAddElementPrice);
      globalDB.getAdditionalPrice(objXAddElementPrice, function (results) {
        if (results.status) {
//          console.log('change size!!!!!!!');
//          console.log(results.data.price);
          //var newElementPrice = parseFloat(results.data.price);
          //$scope.addElementsMenu.isAddElementPrice = true;
          AuxStor.aux.currAddElementPrice = GeneralServ.roundingNumbers( results.data.price * (1 - OrderStor.order.currDiscountAddElem/100) );
          ProductStor.product.chosenAddElements[index][elementIndex].elementPrice = angular.copy(GeneralServ.roundingNumbers( results.data.price ));
          ProductStor.product.chosenAddElements[index][elementIndex].elementPriceDis = angular.copy(AuxStor.aux.currAddElementPrice);
          //------- Set Total Product Price
          setAddElementsTotalPrice();
          //$scope.$apply();

        } else {
          console.log(results);
        }
      });

    }


    // Select Add Element Lamination
    function selectAddElementColor(id) {
      var elementIndex = AuxStor.aux.currentAddElementId,
          index = (AuxStor.aux.isFocusedAddElement - 1);

      AuxStor.aux.isAddElementColor = id;
      if(id === 'matt') {
        ProductStor.product.chosenAddElements[index][elementIndex].elementColor = AuxStor.aux.addElementLaminatWhiteMatt.laminationUrl;
        ProductStor.product.chosenAddElements[index][elementIndex].elementColorId = 'matt';
      } else if(id === 'glossy') {
        ProductStor.product.chosenAddElements[index][elementIndex].elementColor = AuxStor.aux.addElementLaminatWhiteGlossy.laminationUrl;
        ProductStor.product.chosenAddElements[index][elementIndex].elementColorId = 'glossy';
      } else {
        ProductStor.product.chosenAddElements[index][elementIndex].elementColor = AuxStor.aux.addElementLaminatColor[id].laminationUrl;
        ProductStor.product.chosenAddElements[index][elementIndex].elementColorId = id;
      }
    }





  }
})();

