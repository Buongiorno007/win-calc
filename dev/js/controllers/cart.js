(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('CartModule')
    .controller('CartCtrl', cartPageCtrl);

  function cartPageCtrl($filter, globalConstants, GlobalStor, OrderStor, ProductStor, UserStor, CartStor, CartServ, CartMenuServ) {

    var thisCtrl = this;
    thisCtrl.constants = globalConstants;
    thisCtrl.G = GlobalStor;
    thisCtrl.O = OrderStor;
    thisCtrl.U = UserStor;
    thisCtrl.C = CartStor;

    thisCtrl.config = {
      currDisConstr: 0,
      isAddElementDetail: 0,
      isCartLightView: 0,
      detailProductIndex: 0,
      isShowDiscInput: 0,
      isShowDiscInputAdd: 0,
      isProductComment: 0,

      element: $filter('translate')('add_elements.ELEMENT'),
      elementa: $filter('translate')('add_elements.ELEMENTA'),
      elements: $filter('translate')('add_elements.ELEMENTS'),
      DELAY_START: globalConstants.STEP,
      typing: 'on'
    };

    //------- set current Page
    GlobalStor.global.currOpenPage = 'cart';
    GlobalStor.global.productEditNumber = 0;
    //------- collect all AddElements of Order
    CartServ.joinAllAddElements();
    //----------- start order price total calculation
    CartMenuServ.calculateOrderPrice();

    //console.log('cart +++++', JSON.stringify(OrderStor.order));

    //-------- return from Main Page
    if(GlobalStor.global.prevOpenPage === 'main') {
      //----- cleaning product
      ProductStor.product = ProductStor.setDefaultProduct();
    }
    //------- set customer data per order dialogs
    if(!GlobalStor.global.orderEditNumber) {
      CartStor.cart.customer.customer_location = OrderStor.order.customer_location;
    }



    //------ clicking
    thisCtrl.decreaseProductQty = CartServ.decreaseProductQty;
    thisCtrl.increaseProductQty = CartServ.increaseProductQty;
    thisCtrl.addNewProductInOrder = CartServ.addNewProductInOrder;
    thisCtrl.clickDeleteProduct = CartServ.clickDeleteProduct;
    thisCtrl.editProduct = CartServ.editProduct;
    thisCtrl.showAddElementDetail = showAddElementDetail;
    thisCtrl.closeAddElementDetail = closeAddElementDetail;
    thisCtrl.viewSwitching = viewSwitching;
    thisCtrl.switchProductComment = switchProductComment;

    thisCtrl.showAllAddElements = CartServ.showAllAddElements;

    thisCtrl.swipeDiscountBlock = CartMenuServ.swipeDiscountBlock;
    thisCtrl.openDiscInput = openDiscInput;
    thisCtrl.setNewDiscont = setNewDiscont;
    thisCtrl.approveNewDisc = approveNewDisc;



    //============ methods ================//


    //============= AddElements detail block
    //------- Show AddElements detail block for product
    function showAddElementDetail(productIndex) {
      if(CartStor.cart.allAddElements[productIndex].length > 0) {
        //playSound('switching');
        thisCtrl.config.detailProductIndex = productIndex;
        thisCtrl.config.isAddElementDetail = true;
      }
    }

    //--------- Close AddElements detail block
    function closeAddElementDetail() {
      thisCtrl.config.isAddElementDetail = false;
    }

    //--------- Full/Light View switcher
    function viewSwitching() {
      //playSound('swip');
      thisCtrl.config.isCartLightView = !thisCtrl.config.isCartLightView;
    }


    function switchProductComment(index) {
      var commId = index+1;
      thisCtrl.config.isProductComment = (thisCtrl.config.isProductComment === commId) ? 0 : commId;
    }



    function openDiscInput(type) {
      //------- discount x add element
      if(type) {
        thisCtrl.config.isShowDiscInput = 0;
        thisCtrl.config.isShowDiscInputAdd = 1;
      } else {
        //------- discount x construction
        thisCtrl.config.isShowDiscInput = 1;
        thisCtrl.config.isShowDiscInputAdd = 0;
      }
    }


    function setNewDiscont(type) {
      //------- discount x add element
      if(type) {
        if(!CartStor.cart.tempAddelemDisc) {
          CartStor.cart.tempAddelemDisc = UserStor.userInfo.discountAddElemMax*1;
        }
      //------- discount x construction
      } else {
        if(!CartStor.cart.tempConstructDisc) {
          CartStor.cart.tempConstructDisc = UserStor.userInfo.discountConstrMax*1;
        }
      }
    }


    function approveNewDisc(type) {
      if(type) {
        //------- discount x add element
        OrderStor.order.discount_addelem = CartStor.cart.tempAddelemDisc*1;
        CartMenuServ.changeAddElemPriceAsDiscount(OrderStor.order.discount_addelem);

      } else {
        //------- discount x construction
        OrderStor.order.discount_construct = CartStor.cart.tempConstructDisc*1;
        CartMenuServ.changeProductPriceAsDiscount(OrderStor.order.discount_construct);
      }
      //----------- start order price total calculation
      CartMenuServ.calculateOrderPrice();
    }













//    var p, prod, product, addElementUnique;


    //============= ALL AddElements panels

    //-------- collect all AddElements in allAddElementsList from all products
//    $scope.prepareAllAddElementsList = function(){
//      $scope.cart.allAddElementsList = angular.copy($scope.cart.allAddElementsListSource);
//      for(var pr = 0; pr < $scope.global.order.products.length; pr++) {
//
//        for(var prop in $scope.global.order.products[pr].chosenAddElements) {
//          if (!$scope.global.order.products[pr].chosenAddElements.hasOwnProperty(prop)) {
//            continue;
//          }
//          if($scope.global.order.products[pr].chosenAddElements[prop].length > 0) {
//            for (var elem = 0; elem < $scope.global.order.products[pr].chosenAddElements[prop].length; elem++) {
//              var tempChosenAddElement = angular.copy($scope.global.order.products[pr].chosenAddElements[prop][elem]);
//              tempChosenAddElement.elementQty *= $scope.global.order.products[pr].productQty;
//              tempChosenAddElement.productQty = $scope.global.order.products[pr].productQty;
//              tempChosenAddElement.productId = $scope.global.order.products[pr].productId;
//              tempChosenAddElement.isAddElementsONLY = $scope.global.order.products[pr].isAddElementsONLY;
//              switch (tempChosenAddElement.elementType) {
//                case 1:
//                  $scope.cart.allAddElementsList.grids.push(tempChosenAddElement);
//                  break;
//                case 2:
//                  $scope.cart.allAddElementsList.visors.push(tempChosenAddElement);
//                  break;
//                case 3:
//                  $scope.cart.allAddElementsList.spillways.push(tempChosenAddElement);
//                  break;
//                case 4:
//                  $scope.cart.allAddElementsList.outsideSlope.push(tempChosenAddElement);
//                  break;
//                case 5:
//                  $scope.cart.allAddElementsList.louvers.push(tempChosenAddElement);
//                  break;
//                case 6:
//                  $scope.cart.allAddElementsList.insideSlope.push(tempChosenAddElement);
//                  break;
//                case 7:
//                  $scope.cart.allAddElementsList.connectors.push(tempChosenAddElement);
//                  break;
//                case 8:
//                  $scope.cart.allAddElementsList.fans.push(tempChosenAddElement);
//                  break;
//                case 9:
//                  $scope.cart.allAddElementsList.windowSill.push(tempChosenAddElement);
//                  break;
//                case 10:
//                  $scope.cart.allAddElementsList.handles.push(tempChosenAddElement);
//                  break;
//                case 11:
//                  $scope.cart.allAddElementsList.others.push(tempChosenAddElement);
//                  break;
//              }
//
//            }
//          }
//        }
//      }
//    };
//
//    //--------------- dublicats cleaning in allAddElementsList in order to make unique element
//    $scope.cleaningAllAddElementsList = function(){
//      $scope.cart.addElementsUniqueList = angular.copy($scope.cart.allAddElementsList);
//      //---- check dublicats
//      for(var type in $scope.cart.addElementsUniqueList) {
//        if (!$scope.cart.addElementsUniqueList.hasOwnProperty(type)) {
//          continue;
//        }
//        if($scope.cart.addElementsUniqueList[type].length > 0) {
//          for(var elem = $scope.cart.addElementsUniqueList[type].length - 1; elem >= 0 ; elem--) {
//            for(var el = $scope.cart.addElementsUniqueList[type].length - 1; el >= 0 ; el--) {
//              if(elem === el) {
//                continue;
//              } else {
//                if($scope.cart.addElementsUniqueList[type][elem].elementId === $scope.cart.addElementsUniqueList[type][el].elementId && $scope.cart.addElementsUniqueList[type][elem].elementWidth === $scope.cart.addElementsUniqueList[type][el].elementWidth && $scope.cart.addElementsUniqueList[type][elem].elementHeight === $scope.cart.addElementsUniqueList[type][el].elementHeight) {
//                  $scope.cart.addElementsUniqueList[type][elem].elementQty += $scope.cart.addElementsUniqueList[type][el].elementQty;
//                  $scope.cart.addElementsUniqueList[type].splice(el, 1);
//                  elem--;
//                }
//              }
//            }
//          }
//        }
//      }
//      //console.log('$scope.cart.addElementsUniqueList ==== ', $scope.cart.addElementsUniqueList);
//    };
//
//    //------ calculate TOTAL AddElements price
//    $scope.getTOTALAddElementsPrice = function() {
//      $scope.cart.addElementsListPriceTOTAL = 0;
//      for(var i = 0; i < $scope.global.order.products.length; i++) {
//        $scope.cart.addElementsListPriceTOTAL += ($scope.global.order.products[i].addElementsPriceSELECT * $scope.global.order.products[i].productQty);
//      }
//    };
//
//
//    //-------- show All Add Elements panel
//    $scope.showAllAddElements = function() {
//      //--- open if AddElements are existed
//      if($scope.cart.isOrderHaveAddElements) {
//        //playSound('swip');
//        $scope.cart.isShowAllAddElements = !$scope.cart.isShowAllAddElements;
//        if($scope.cart.isShowAllAddElements) {
//          $scope.prepareAllAddElementsList();
//          $scope.cleaningAllAddElementsList();
//          $scope.getTOTALAddElementsPrice();
//        } else {
//          $scope.cart.allAddElementsList = angular.copy($scope.cart.allAddElementsListSource);
//          $scope.cart.addElementsUniqueList = {};
//        }
//      }
//    };
//
//
//    //------ delete All AddElements List
//    $scope.deleteAllAddElementsList = function() {
//      $scope.cart.addElementsListPriceTOTAL = 0;
//      for(var pr = 0; pr < $scope.global.order.products.length; pr++) {
//        $scope.global.order.products[pr].productPriceTOTAL -= $scope.global.order.products[pr].addElementsPriceSELECT;
//        $scope.global.order.products[pr].addElementsPriceSELECT = 0;
//        for(var prop in $scope.global.order.products[pr].chosenAddElements) {
//          if (!$scope.global.order.products[pr].chosenAddElements.hasOwnProperty(prop)) {
//            continue;
//          }
//          if($scope.global.order.products[pr].chosenAddElements[prop].length > 0) {
//            $scope.global.order.products[pr].chosenAddElements[prop].length = 0;
//          }
//        }
//      }
//      //---- close all AddElements panel
//      $scope.parseAddElementsLocaly();
//      $scope.showAllAddElements();
//      $scope.global.calculateOrderPrice();
//      $scope.cart.isOrderHaveAddElements = false;
//    };
//
//    function getCurrentAddElementsType(elementType) {
//      var curentType = '';
//      switch (elementType) {
//        case 1: curentType = 'grids';
//          break;
//        case 2: curentType = 'visors';
//          break;
//        case 3: curentType = 'spillways';
//          break;
//        case 4: curentType = 'outsideSlope';
//          break;
//        case 5: curentType = 'louvers';
//          break;
//        case 6: curentType = 'insideSlope';
//          break;
//        case 7: curentType = 'connectors';
//          break;
//        case 8: curentType = 'fans';
//          break;
//        case 9: curentType = 'windowSill';
//          break;
//        case 10: curentType = 'handles';
//          break;
//        case 11: curentType = 'others';
//          break;
//      }
//      return curentType;
//    }
//
//
//    //------ delete AddElement in All AddElementsList
//    $scope.deleteAddElementList = function(elementType, elementId) {
//      var curentType;
//      //----- if we delete all AddElement Unit in header of Unit Detail panel
//      if($scope.cart.isShowAddElementUnit) {
//        //playSound('swip');
//        $scope.cart.isShowAddElementUnit = !$scope.cart.isShowAddElementUnit;
//        $scope.cart.selectedAddElementUnitId = 0;
//        $scope.cart.selectedAddElementUnitIndex = 0;
//        $scope.cart.selectedAddElementUnitType = 0;
//        $scope.cart.selectedAddElementUnits.length = 0;
//        curentType = elementType;
//      } else {
//        curentType = getCurrentAddElementsType(elementType);
//      }
//      for (var el = ($scope.cart.allAddElementsList[curentType].length - 1); el >= 0; el--) {
//        if($scope.cart.allAddElementsList[curentType][el].elementId === elementId) {
//          $scope.cart.allAddElementsList[curentType].splice(el, 1);
//        }
//      }
//      $scope.cleaningAllAddElementsList();
//      for(var p = 0; p < $scope.global.order.products.length; p++) {
//        for(var prop in $scope.global.order.products[p].chosenAddElements) {
//          if (!$scope.global.order.products[p].chosenAddElements.hasOwnProperty(prop)) {
//            continue;
//          }
//          if((prop.toUpperCase()).indexOf(curentType.toUpperCase())+1 && $scope.global.order.products[p].chosenAddElements[prop].length > 0) {
//            for (var elem = ($scope.global.order.products[p].chosenAddElements[prop].length - 1); elem >= 0; elem--) {
//              if($scope.global.order.products[p].chosenAddElements[prop][elem].elementId === elementId) {
//                $scope.global.order.products[p].addElementsPriceSELECT -= $scope.global.order.products[p].chosenAddElements[prop][elem].elementPrice;
//                $scope.global.order.products[p].productPriceTOTAL -= $scope.global.order.products[p].chosenAddElements[prop][elem].elementPrice;
//                $scope.global.order.products[p].chosenAddElements[prop].splice(elem, 1);
//              }
//            }
//          }
//        }
//      }
//      $scope.getTOTALAddElementsPrice();
//      $scope.parseAddElementsLocaly();
//      $scope.global.calculateOrderPrice();
//      //--------- if all AddElements were deleted
//      //---- close all AddElements panel
//      if(!$scope.cart.addElementsListPriceTOTAL) {
//        $scope.showAllAddElements();
//        $scope.cart.isOrderHaveAddElements = false;
//      }
//    };
//
//
//
//
//
//    //-------- show Add Element Unit Detail panel
//    $scope.showAddElementUnitDetail = function(elementType, elementId, elementIndex) {
//      //playSound('swip');
//      $scope.cart.isShowAddElementUnit = !$scope.cart.isShowAddElementUnit;
//      if($scope.cart.isShowAddElementUnit) {
//        $scope.cart.selectedAddElementUnitId = elementId;
//        $scope.cart.selectedAddElementUnitIndex = elementIndex;
//        $scope.cart.selectedAddElementUnitType = getCurrentAddElementsType(elementType);
//        $scope.cart.selectedAddElementUnits.length = 0;
//        //console.log('allAddElementsList == ', $scope.cart.allAddElementsList);
//
//        for(var i = 0; i < $scope.cart.allAddElementsList[$scope.cart.selectedAddElementUnitType].length; i++) {
//          if($scope.cart.allAddElementsList[$scope.cart.selectedAddElementUnitType][i].elementId === $scope.cart.selectedAddElementUnitId) {
//            if($scope.cart.allAddElementsList[$scope.cart.selectedAddElementUnitType][i].productQty === 1){
//              $scope.cart.selectedAddElementUnits.push($scope.cart.allAddElementsList[$scope.cart.selectedAddElementUnitType][i]);
//            } else {
//              var addElementsUniqueProduct = [];
//              var addElementsUnique = angular.copy($scope.cart.allAddElementsList[$scope.cart.selectedAddElementUnitType][i]);
//              addElementsUnique.elementQty /= addElementsUnique.productQty;
//              for(var p = 0; p < addElementsUnique.productQty; p++) {
//                addElementsUniqueProduct.push(addElementsUnique);
//              }
//              if(addElementsUniqueProduct.length > 0) {
//                $scope.cart.selectedAddElementUnits.push(addElementsUniqueProduct);
//              }
//
//            }
//          }
//        }
//        console.log('start selectedAddElementUnits = ', $scope.cart.selectedAddElementUnits);
//      } else {
//        $scope.cart.selectedAddElementUnitId = 0;
//        $scope.cart.selectedAddElementUnitIndex = 0;
//        $scope.cart.selectedAddElementUnitType = 0;
//        $scope.cart.selectedAddElementUnits.length = 0;
//      }
//
//    };
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
//    //-------- Show/Hide Explode Link Menu
//    $scope.toggleExplodeLinkMenu = function() {
//      $scope.cart.isShowLinkExplodeMenu = !$scope.cart.isShowLinkExplodeMenu;
//    };
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