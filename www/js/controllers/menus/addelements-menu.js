
// controllers/menus/addelements-menu.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .controller('addElementMenuCtrl', addElementMenuCtrl);

  function addElementMenuCtrl($scope, $timeout, globalConstants, globalDB, GlobalStor, ProductStor, UserStor, AuxStor, AddElementMenuServ) {

    var thisCtrl = this,
        tempSize = [];
    thisCtrl.constants = globalConstants;
    thisCtrl.global = GlobalStor.global;
    thisCtrl.product = ProductStor.product;
    thisCtrl.aux = AuxStor.aux;


    thisCtrl.config = {
      DELAY_START: globalConstants.STEP,
      DELAY_SHOW_ELEMENTS_MENU: 10 * globalConstants.STEP,
      typing: 'on'
    };



    //------ clicking
    thisCtrl.closeAddElementsMenu = AddElementMenuServ.closeAddElementsMenu;
    thisCtrl.chooseAddElement = AddElementMenuServ.chooseAddElement;
    thisCtrl.selectElementListView = selectElementListView;
    thisCtrl.initAddElementMenuTools = AddElementsServ.initAddElementMenuTools;
    thisCtrl.showFrameTabs = showFrameTabs;
    thisCtrl.deleteAddElement = deleteAddElement;



    //============ methods ================//



    // Select Add Element when open List View
    function selectElementListView(typeId, elementId, clickEvent) {
      if(typeId === undefined && elementId === undefined) {
        GlobalStor.global.isAddElement = false;
      } else if(GlobalStor.global.isAddElement === typeId+'-'+elementId) {
        GlobalStor.global.isAddElement = 1;
      } else if(GlobalStor.global.isAddElement === false || GlobalStor.global.isAddElement === 1) {
        var coord = $(clickEvent.target).offset();
        //$scope.addElementsMenu.coordinats = {'top': coord.top-34};
        thisCtrl.coordinats = {'top': coord.top-17};
        $timeout(function() {
          GlobalStor.global.isAddElement = typeId + '-' + elementId;
        }, 500);
      } else {
        GlobalStor.global.isAddElement = 1;
        $timeout(function() {
          var coord = $(clickEvent.target).offset();
          //$scope.addElementsMenu.coordinats = {'top': coord.top-34};
          thisCtrl.coordinats = {'top': coord.top-17};
        }, 500);
        $timeout(function() {
          GlobalStor.global.isAddElement = typeId + '-' + elementId;
        }, 1000);
      }
    }



    // Show Tabs
    function showFrameTabs() {
      //playSound('swip');
      GlobalStor.global.isTabFrame = !GlobalStor.global.isTabFrame;
    }

    // Delete AddElement from global object
    function deleteAddElement(typeId, elementId) {
      switch(typeId) {
        case 1:
          ProductStor.product.chosenAddElements.selectedGrids.splice(elementId, 1);
          break;
        case 2:
          ProductStor.product.chosenAddElements.selectedVisors.splice(elementId, 1);
          break;
        case 3:
          ProductStor.product.chosenAddElements.selectedSpillways.splice(elementId, 1);
          break;
        case 4:
          ProductStor.product.chosenAddElements.selectedOutsideSlope.splice(elementId, 1);
          break;
        case 5:
          ProductStor.product.chosenAddElements.selectedLouvers.splice(elementId, 1);
          break;
        case 6:
          ProductStor.product.chosenAddElements.selectedInsideSlope.splice(elementId, 1);
          break;
        case 7:
          ProductStor.product.chosenAddElements.selectedConnectors.splice(elementId, 1);
          break;
        case 8:
          ProductStor.product.chosenAddElements.selectedFans.splice(elementId, 1);
          break;
        case 9:
          ProductStor.product.chosenAddElements.selectedWindowSill.splice(elementId, 1);
          break;
        case 10:
          ProductStor.product.chosenAddElements.selectedHandles.splice(elementId, 1);
          break;
        case 11:
          ProductStor.product.chosenAddElements.selectedOthers.splice(elementId, 1);
          break;
      }
      AddElementsServ.desactiveAddElementParameters();
      //Set Total Product Price
      setAddElementsTotalPrice();
    }



    // Change Qty parameter
    function setValueQty(newValue) {
      var elementId = GlobalStor.global.currentAddElementId;
      switch(GlobalStor.global.isFocusedAddElement) {
        case 1:
          if(ProductStor.product.chosenAddElements.selectedGrids[elementId].elementQty < 2 && newValue < 0) {
            break;
          } else if(ProductStor.product.chosenAddElements.selectedGrids[elementId].elementQty < 6 && newValue == -5) {
            break;
          } else {
            ProductStor.product.chosenAddElements.selectedGrids[elementId].elementQty += newValue;
          }
          break;
        case 2:
          if(ProductStor.product.chosenAddElements.selectedVisors[elementId].elementQty < 2 && newValue < 0) {
            break;
          } else if(ProductStor.product.chosenAddElements.selectedVisors[elementId].elementQty < 6 && newValue == -5) {
            break;
          } else {
            ProductStor.product.chosenAddElements.selectedVisors[elementId].elementQty += newValue;
          }
          break;
        case 3:
          if(ProductStor.product.chosenAddElements.selectedSpillways[elementId].elementQty < 2 && newValue < 0) {
            break;
          } else if(ProductStor.product.chosenAddElements.selectedSpillways[elementId].elementQty < 6 && newValue == -5) {
            break;
          } else {
            ProductStor.product.chosenAddElements.selectedSpillways[elementId].elementQty += newValue;
          }
          break;
        case 4:
          if(ProductStor.product.chosenAddElements.selectedOutsideSlope[elementId].elementQty < 2 && newValue < 0) {
            break;
          } else if(ProductStor.product.chosenAddElements.selectedOutsideSlope[elementId].elementQty < 6 && newValue == -5) {
            break;
          } else {
            ProductStor.product.chosenAddElements.selectedOutsideSlope[elementId].elementQty += newValue;
          }
          break;
        case 5:
          if(ProductStor.product.chosenAddElements.selectedLouvers[elementId].elementQty < 2 && newValue < 0) {
            break;
          } else if(ProductStor.product.chosenAddElements.selectedLouvers[elementId].elementQty < 6 && newValue == -5) {
            break;
          } else {
            ProductStor.product.chosenAddElements.selectedLouvers[elementId].elementQty += newValue;
          }
          break;
        case 6:
          if(ProductStor.product.chosenAddElements.selectedInsideSlope[elementId].elementQty < 2 && newValue < 0) {
            break;
          } else if(ProductStor.product.chosenAddElements.selectedInsideSlope[elementId].elementQty < 6 && newValue == -5) {
            break;
          } else {
            ProductStor.product.chosenAddElements.selectedInsideSlope[elementId].elementQty += newValue;
          }
          break;
        case 7:
          if(ProductStor.product.chosenAddElements.selectedConnectors[elementId].elementQty < 2 && newValue < 0) {
            break;
          } else if(ProductStor.product.chosenAddElements.selectedConnectors[elementId].elementQty < 6 && newValue == -5) {
            break;
          } else {
            ProductStor.product.chosenAddElements.selectedConnectors[elementId].elementQty += newValue;
          }
          break;
        case 8:
          if(ProductStor.product.chosenAddElements.selectedFans[elementId].elementQty < 2 && newValue < 0) {
            break;
          } else if(ProductStor.product.chosenAddElements.selectedFans[elementId].elementQty < 6 && newValue == -5) {
            break;
          } else {
            ProductStor.product.chosenAddElements.selectedFans[elementId].elementQty += newValue;
          }
          break;
        case 9:
          if(ProductStor.product.chosenAddElements.selectedWindowSill[elementId].elementQty < 2 && newValue < 0) {
            break;
          } else if(ProductStor.product.chosenAddElements.selectedWindowSill[elementId].elementQty < 6 && newValue == -5) {
            break;
          } else {
            ProductStor.product.chosenAddElements.selectedWindowSill[elementId].elementQty += newValue;
          }
          break;
        case 10:
          if(ProductStor.product.chosenAddElements.selectedHandles[elementId].elementQty < 2 && newValue < 0) {
            break;
          } else if(ProductStor.product.chosenAddElements.selectedHandles[elementId].elementQty < 6 && newValue == -5) {
            break;
          } else {
            ProductStor.product.chosenAddElements.selectedHandles[elementId].elementQty += newValue;
          }
          break;
        case 11:
          if(ProductStor.product.chosenAddElements.selectedOthers[elementId].elementQty < 2 && newValue < 0) {
            break;
          } else if(ProductStor.product.chosenAddElements.selectedOthers[elementId].elementQty < 6 && newValue == -5) {
            break;
          } else {
            ProductStor.product.chosenAddElements.selectedOthers[elementId].elementQty += newValue;
          }
          break;
      }
      //Set Total Product Price
      setAddElementsTotalPrice();
    }



    // Close Qty Calculator
    function closeQtyCaclulator() {
      AddElementsServ.desactiveAddElementParameters();
    }



    // Change Size parameter
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



    // Delete last number
    $scope.deleteLastNumber = function() {
      tempSize.pop();
      if(tempSize.length < 1) {
        tempSize.push(0);
      }
      changeElementSize();
    };

    // Close Size Calculator
    function closeSizeCaclulator() {
      GlobalStor.global.isWidthCalculator = false;
      tempSize.length = 0;
      AddElementsServ.desactiveAddElementParameters();

      //-------- recalculate add element price
      var objXAddElementPrice = {
        cityId: UserStor.userInfo.city_id,
        currencyId: UserStor.userInfo.currencyId,
        elementId: 0,
        elementLength: 0
      };

      switch (GlobalStor.global.isFocusedAddElement) {
        case 2:
          objXAddElementPrice.elementId = ProductStor.product.chosenAddElements.selectedVisors[GlobalStor.global.currentAddElementId].elementId;
          objXAddElementPrice.elementLength = ProductStor.product.chosenAddElements.selectedVisors[GlobalStor.global.currentAddElementId].elementWidth;
          break;
        case 3:
          objXAddElementPrice.elementId = ProductStor.product.chosenAddElements.selectedSpillways[GlobalStor.global.currentAddElementId].elementId;
          objXAddElementPrice.elementLength = ProductStor.product.chosenAddElements.selectedSpillways[GlobalStor.global.currentAddElementId].elementWidth;
          break;
        case 4:
          objXAddElementPrice.elementId = ProductStor.product.chosenAddElements.selectedOutsideSlope[GlobalStor.global.currentAddElementId].elementId;
          objXAddElementPrice.elementLength = ProductStor.product.chosenAddElements.selectedOutsideSlope[GlobalStor.global.currentAddElementId].elementWidth;
          break;
        case 5:
          objXAddElementPrice.elementId = ProductStor.product.chosenAddElements.selectedLouvers[GlobalStor.global.currentAddElementId].elementId;
          objXAddElementPrice.elementLength = ProductStor.product.chosenAddElements.selectedLouvers[GlobalStor.global.currentAddElementId].elementWidth;
          break;
        case 6:
          objXAddElementPrice.elementId = ProductStor.product.chosenAddElements.selectedInsideSlope[GlobalStor.global.currentAddElementId].elementId;
          objXAddElementPrice.elementLength = ProductStor.product.chosenAddElements.selectedInsideSlope[GlobalStor.global.currentAddElementId].elementWidth;
          break;
        case 7:
          objXAddElementPrice.elementId = ProductStor.product.chosenAddElements.selectedConnectors[GlobalStor.global.currentAddElementId].elementId;
          objXAddElementPrice.elementLength = ProductStor.product.chosenAddElements.selectedConnectors[GlobalStor.global.currentAddElementId].elementWidth;
          break;
        case 9:
          objXAddElementPrice.elementId = ProductStor.product.chosenAddElements.selectedWindowSill[GlobalStor.global.currentAddElementId].elementId;
          objXAddElementPrice.elementLength = ProductStor.product.chosenAddElements.selectedWindowSill[GlobalStor.global.currentAddElementId].elementWidth;
          break;
      }

      //console.log('objXAddElementPrice change size ===== ', $scope.global.objXAddElementPrice);
      globalDB.getAdditionalPrice(objXAddElementPrice, function (results) {
        if (results.status) {
          console.log('change size!!!!!!!');
          console.log(results.data.price);
          var newElementPrice = parseFloat(results.data.price);
          //$scope.addElementsMenu.isAddElementPrice = true;
          thisCtrl.currAddElementPrice = newElementPrice;

          switch (GlobalStor.global.isFocusedAddElement) {
            case 2:
              ProductStor.product.chosenAddElements.selectedVisors[GlobalStor.global.currentAddElementId].elementPrice = newElementPrice;
              break;
            case 3:
              ProductStor.product.chosenAddElements.selectedSpillways[GlobalStor.global.currentAddElementId].elementPrice = newElementPrice;
              break;
            case 4:
              ProductStor.product.chosenAddElements.selectedOutsideSlope[GlobalStor.global.currentAddElementId].elementPrice = newElementPrice;
              break;
            case 5:
              ProductStor.product.chosenAddElements.selectedLouvers[GlobalStor.global.currentAddElementId].elementPrice = newElementPrice;
              break;
            case 6:
              ProductStor.product.chosenAddElements.selectedInsideSlope[GlobalStor.global.currentAddElementId].elementPrice = newElementPrice;
              break;
            case 7:
              ProductStor.product.chosenAddElements.selectedConnectors[GlobalStor.global.currentAddElementId].elementPrice = newElementPrice;
              break;
            case 9:
              ProductStor.product.chosenAddElements.selectedWindowSill[GlobalStor.global.currentAddElementId].elementPrice = newElementPrice;
              break;
          }
          //console.log('chosenAddElements === ', $scope.global.product.chosenAddElements);
          //Set Total Product Price
          setAddElementsTotalPrice();
          //$scope.$apply();

        } else {
          console.log(results);
        }
      });

    }

    function changeElementSize(){
      var newElementSize = '';
      for(var numer = 0; numer < tempSize.length; numer++) {
        newElementSize += tempSize[numer].toString();
      }
      var elementId = GlobalStor.global.currentAddElementId;
      newElementSize = parseInt(newElementSize, 10);
      if(GlobalStor.global.isWidthCalculator) {
        switch(GlobalStor.global.isFocusedAddElement) {
          case 2:
            ProductStor.product.chosenAddElements.selectedVisors[elementId].elementWidth = newElementSize;
            break;
          case 3:
            ProductStor.product.chosenAddElements.selectedSpillways[elementId].elementWidth = newElementSize;
            break;
          case 4:
            ProductStor.product.chosenAddElements.selectedOutsideSlope[elementId].elementWidth = newElementSize;
            break;
          case 5:
            ProductStor.product.chosenAddElements.selectedLouvers[elementId].elementWidth = newElementSize;
            break;
          case 6:
            ProductStor.product.chosenAddElements.selectedInsideSlope[elementId].elementWidth = newElementSize;
            break;
          case 7:
            ProductStor.product.chosenAddElements.selectedConnectors[elementId].elementWidth = newElementSize;
            break;
          case 9:
            ProductStor.product.chosenAddElements.selectedWindowSill[elementId].elementWidth = newElementSize;
            break;
        }
      } else {
        if(GlobalStor.global.isFocusedAddElement === 5) {
          ProductStor.product.chosenAddElements.selectedLouvers[elementId].elementHeight = newElementSize;
        }
      }
    }


    // Select Add Element Lamination
    function selectAddElementColor(id) {
      GlobalStor.global.isAddElementColor = id;
      var elementId = GlobalStor.global.currentAddElementId;
      if(id === 'matt') {
        ProductStor.product.chosenAddElements.selectedWindowSill[elementId].elementColor = GlobalStor.global.addElementLaminatWhiteMatt.laminationUrl;
        ProductStor.product.chosenAddElements.selectedWindowSill[elementId].elementColorId = 'matt';
      } else if(id === 'glossy') {
        ProductStor.product.chosenAddElements.selectedWindowSill[elementId].elementColor = GlobalStor.global.addElementLaminatWhiteGlossy.laminationUrl;
        ProductStor.product.chosenAddElements.selectedWindowSill[elementId].elementColorId = 'glossy';
      } else {
        ProductStor.product.chosenAddElements.selectedWindowSill[elementId].elementColor = GlobalStor.global.addElementLaminatColor[id].laminationUrl;
        ProductStor.product.chosenAddElements.selectedWindowSill[elementId].elementColorId = id;
      }
    }

    function clearSelectedAddElement() {
      GlobalStor.global.isAddElement = false;
    }

  }
})();

