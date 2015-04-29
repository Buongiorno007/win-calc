(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .factory('AddElementMenuServ', addElemMenuFactory);

  function addElemMenuFactory($timeout, globalConstants, GlobalStor, AuxStor, OrderStor, ProductStor, UserStor, globalDB, GeneralServ, MainServ, AddElementsServ, analyticsServ) {

    var thisFactory = this,
      delayShowElementsMenu = globalConstants.STEP * 12;

    thisFactory.publicObj = {
      closeAddElementsMenu: closeAddElementsMenu,
      chooseAddElement: chooseAddElement,
//      desactiveAddElementParameters: desactiveAddElementParameters,
//      viewSwitching: viewSwitching
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


    // Select AddElement
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
        AuxStor.aux.isAddElement = typeIndex+'-'+elementIndex;

        var sourceAddElement = angular.copy( AuxStor.aux.addElementsList[typeIndex][elementIndex] );

        var objXAddElementPrice = {
          cityId: UserStor.userInfo.city_id,
          currencyId: UserStor.userInfo.currencyId,
          elementId: sourceAddElement.elementId,
          elementLength: sourceAddElement.elementWidth
        };

        console.log(objXAddElementPrice);
        //-------- get current add element price
        globalDB.getAdditionalPrice(objXAddElementPrice, function (results) {
          if (results.status) {
            //console.log(results.data);
            sourceAddElement.elementPrice = GeneralServ.roundingNumbers(results.data.price);
            //$scope.addElementsMenu.isAddElementPrice = true;
            AuxStor.aux.currAddElementPrice = sourceAddElement.elementPrice;

            pushSelectedAddElement(sourceAddElement);
            //Set Total Product Price
            setAddElementsTotalPrice();
            //$scope.$apply();

          } else {
            console.log(results);
          }
        });

        //------ save analytics data
        analyticsServ.saveAnalyticDB(UserStor.userInfo.id, OrderStor.order.orderId, sourceAddElement.elementId, typeIndex);

        if(AuxStor.aux.isAddElementListView) {
          AuxStor.aux.isAddElement = 1;
        }
      }

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
              elementColor: ''
            },
            newElement = angular.extend(newElementSource, currElement);

        ProductStor.product.chosenAddElements[index].push(newElement);
        //---- open TABFrame when second element selected
        if(ProductStor.product.chosenAddElements[index].length === 2) {
          AuxStor.aux.isTabFrame = true;
        }
      } else {
        ProductStor.product.chosenAddElements.selectedGrids[index][existedElement].elementQty += 1;
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
      var elementTypeQty = ProductStor.product.chosenAddElements.length,
          i = 0;
      ProductStor.product.addElementsPriceSELECT = 0;

      for (; i < elementTypeQty; i++) {
        var elementQty = ProductStor.product.chosenAddElements[i].length;
        if (elementQty > 0) {
          for (var j = 0; j < elementQty; j++) {
            ProductStor.product.addElementsPriceSELECT += ProductStor.product.chosenAddElements[i][j].elementQty * ProductStor.product.chosenAddElements[i][j].elementPrice;
            ProductStor.product.addElementsPriceSELECT = GeneralServ.roundingNumbers(ProductStor.product.addElementsPriceSELECT);
          }
        }
      }
      MainServ.setProductPriceTOTAL();
    }



  }
})();
