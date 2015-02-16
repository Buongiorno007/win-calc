/* globals BauVoiceApp, STEP */

'use strict';

BauVoiceApp.controller('CartCtrl', ['$scope', 'localDB', 'localStorage', '$location', '$filter', function ($scope, localDB, localStorage, $location, $filter) {

  $scope.global = localStorage;

  $scope.cart = {
    orderEddited: [],
    productsEddited: [],
    //------- for checking order in orders into LocalStorage
    isOrderExisted: true,
    allGridsDB: [],
    allVisorsDB: [],
    allSpillwaysDB: [],
    allOutSlopesDB: [],
    allInSlopesDB: [],
    allLouversDB: [],
    allConnectorsDB: [],
    allFansDB: [],
    allWindowSillsDB: [],
    allHandlesDB: [],
    allOthersDB: [],

    allAddElements: [],
    allAddElementsListSource: {
      grids: [],
      visors: [],
      spillways: [],
      outsideSlope: [],
      louvers: [],
      insideSlope: [],
      connectors: [],
      fans: [],
      windowSill: [],
      handles: [],
      others: []
    },
    allAddElementsList: {},
    addElementsUniqueList: {},
    allTemplateIcons: [],
    activeProductIndex: 0,
    addElementsListPriceTOTAL: 0,
    isAddElementDetail: false,
    isAllAddElements: false,
    isShowAllAddElements: false,
    isShowAddElementUnit: false,
    selectedAddElementUnitId: 0,
    selectedAddElementUnitIndex: 0,
    selectedAddElementUnitType: 0,
    selectedAddElementUnits: [],
    isOrderHaveAddElements: false,
    isShowLinkExplodeMenu: false,
    DELAY_START: STEP,
    typing: 'on'
  };

  var p, prod, product, addElementUnique;

  $scope.isCartLightView = false;

  $scope.global.startProgramm = false;
  $scope.global.isReturnFromDiffPage = false;
  $scope.global.isChangedTemplate = false;
  $scope.global.isOpenedCartPage = true;
  $scope.global.isOpenedHistoryPage = false;

  //------- finish edit product
  $scope.global.productEditNumber = '';


  console.log('cart page!!!!!!!!!!!!!!!');
  console.log('product ====== ', $scope.global.product);
  console.log('order ====== ', $scope.global.order);


  //----- Calculate All Products Price
  $scope.calculateProductsPrice = function() {
    $scope.global.order.productsPriceTOTAL = 0;
    for(p = 0; p <  $scope.global.order.products.length; p++) {
      $scope.global.order.productsPriceTOTAL += parseFloat( (parseFloat($scope.global.order.products[p].productPriceTOTAL.toFixed(2)) * $scope.global.order.products[p].productQty).toFixed(2) );
    }
  };

  // Calculate Order Price
  $scope.global.calculateOrderPrice = function() {
    $scope.calculateProductsPrice();
    //----- join together product prices and order option
    $scope.global.calculateTotalOrderPrice();
  };


  //---------- parse Add Elements from LocalStorage
  $scope.parseAddElementsLocaly = function() {
    $scope.cart.allAddElements = [];
    for(prod = 0; prod < $scope.global.order.products.length; prod++) {
      product = [];

      for(var prop in $scope.global.order.products[prod].chosenAddElements) {
        if (!$scope.global.order.products[prod].chosenAddElements.hasOwnProperty(prop)) {
          continue;
        }
        if($scope.global.order.products[prod].chosenAddElements[prop].length > 0) {
          $scope.cart.isOrderHaveAddElements = true;
          for (var elem = 0; elem < $scope.global.order.products[prod].chosenAddElements[prop].length; elem++) {
            product.push($scope.global.order.products[prod].chosenAddElements[prop][elem]);
          }
        }
      }
      $scope.cart.allAddElements.push(product);
    }
  };




  //================ EDIT order from Histoy ===============
  if($scope.global.orderEditNumber > 0) {
    //-------- checking if order exist in orders array into LocalStorage
    $scope.cart.isOrderExisted = false;
    for(var ord = 0; ord < $scope.global.orders.length; ord++) {
      if($scope.global.orders[ord].orderId === $scope.global.orderEditNumber) {
        $scope.cart.isOrderExisted = true;
        console.log('isOrderExisted !!!! == ', $scope.cart.isOrderExisted );
        $scope.global.order = angular.copy($scope.global.orders[ord]);
        console.log('order !!!! == ', $scope.global.order );
        $scope.parseAddElementsLocaly();
        //----------- start order price total calculation
        //$scope.calculateProductsPrice();
      }
    }

    if(!$scope.cart.isOrderExisted) {
      //------ if order not exist take it from LocalDB

      localDB.selectDB($scope.global.ordersTableBD, {'orderId': $scope.global.orderEditNumber}, function (results) {
        if (results.status) {
          $scope.cart.orderEddited = angular.copy(results.data);
          $scope.global.order = angular.copy($scope.global.orderSource);
          console.log('isOrderExisted == ', $scope.cart.isOrderExisted );
          console.log('orderEddited == ', $scope.cart.orderEddited );
          console.log('order == ', $scope.global.order );

          angular.extend($scope.global.order, $scope.cart.orderEddited[0]);
          if($scope.global.order.isOldPrice === 'true') {
            $scope.global.order.isOldPrice = true;
          } else {
            $scope.global.order.isOldPrice = false;
          }
          console.log('extendedOrder ==== ', $scope.global.order);

        } else {
          console.log(results);
        }
      });




      //------ Download All Add Elements from LocalDB

      localDB.selectDB($scope.global.addElementsTableBD, {'orderId': $scope.global.orderEditNumber}, function (results) {
        if (results.status) {
          console.log('results.data === ', results.data);
          var allEddElements = angular.copy(results.data);
          for(var el = 0; el < allEddElements.length; el++) {
            switch (allEddElements[el].elementType) {
              case 1: $scope.cart.allGridsDB.push(allEddElements[el]);
                break;
              case 2: $scope.cart.allVisorsDB.push(allEddElements[el]);
                break;
              case 3: $scope.cart.allSpillwaysDB.push(allEddElements[el]);
                break;
              case 4: $scope.cart.allOutSlopesDB.push(allEddElements[el]);
                break;
              case 5: $scope.cart.allLouversDB.push(allEddElements[el]);
                break;
              case 6: $scope.cart.allInSlopesDB.push(allEddElements[el]);
                break;
              case 7: $scope.cart.allConnectorsDB.push(allEddElements[el]);
                break;
              case 8: $scope.cart.allFansDB.push(allEddElements[el]);
                break;
              case 9: $scope.cart.allWindowSillsDB.push(allEddElements[el]);
                break;
              case 10: $scope.cart.allHandlesDB.push(allEddElements[el]);
                break;
              case 11: $scope.cart.allOthersDB.push(allEddElements[el]);
                break;
            }
          }
        } else {
          console.log(results);
        }
      });


      //----------- sorting all Edd Elements by Products
      $scope.parseAddElements = function() {
        console.log('productsEdit', $scope.global.order.products);
        for(prod = 0; prod < $scope.global.order.productsQty; prod++) {

          if($scope.cart.allGridsDB.length > 0) {
            for(var elem = 0; elem < $scope.cart.allGridsDB.length; elem++) {
              if($scope.cart.allGridsDB[elem].productId === $scope.global.order.products[prod].productId) {
                $scope.global.order.products[prod].chosenAddElements.selectedGrids.push($scope.cart.allGridsDB[elem]);
              }
            }
          }

          if($scope.cart.allVisorsDB.length > 0) {
            for(var elem = 0; elem < $scope.cart.allVisorsDB.length; elem++) {
              if($scope.cart.allVisorsDB[elem].productId === $scope.global.order.products[prod].productId) {
                $scope.global.order.products[prod].chosenAddElements.selectedVisors.push($scope.cart.allVisorsDB[elem]);
              }
            }
          }

          if($scope.cart.allSpillwaysDB.length > 0) {
            for(var elem = 0; elem < $scope.cart.allSpillwaysDB.length; elem++) {
              if($scope.cart.allSpillwaysDB[elem].productId === $scope.global.order.products[prod].productId) {
                $scope.global.order.products[prod].chosenAddElements.selectedSpillways.push($scope.cart.allSpillwaysDB[elem]);
              }
            }
          }

          if($scope.cart.allOutSlopesDB.length > 0) {
            for(var elem = 0; elem < $scope.cart.allOutSlopesDB.length; elem++) {
              if($scope.cart.allOutSlopesDB[elem].productId === $scope.global.order.products[prod].productId) {
                $scope.global.order.products[prod].chosenAddElements.selectedOutsideSlope.push($scope.cart.allOutSlopesDB[elem]);
              }
            }
          }

          if($scope.cart.allInSlopesDB.length > 0) {
            for(var elem = 0; elem < $scope.cart.allInSlopesDB.length; elem++) {
              if($scope.cart.allInSlopesDB[elem].productId === $scope.global.order.products[prod].productId) {
                $scope.global.order.products[prod].chosenAddElements.selectedInsideSlope.push($scope.cart.allInSlopesDB[elem]);
              }
            }
          }

          if($scope.cart.allLouversDB.length > 0) {
            for(var elem = 0; elem < $scope.cart.allLouversDB.length; elem++) {
              if($scope.cart.allLouversDB[elem].productId === $scope.global.order.products[prod].productId) {
                $scope.global.order.products[prod].chosenAddElements.selectedLouvers.push($scope.cart.allLouversDB[elem]);
              }
            }
          }

          if($scope.cart.allConnectorsDB.length > 0) {
            for(var elem = 0; elem < $scope.cart.allConnectorsDB.length; elem++) {
              if($scope.cart.allConnectorsDB[elem].productId === $scope.global.order.products[prod].productId) {
                $scope.global.order.products[prod].chosenAddElements.selectedConnectors.push($scope.cart.allConnectorsDB[elem]);
              }
            }
          }

          if($scope.cart.allFansDB.length > 0) {
            for(var elem = 0; elem < $scope.cart.allFansDB.length; elem++) {
              if($scope.cart.allFansDB[elem].productId === $scope.global.order.products[prod].productId) {
                $scope.global.order.products[prod].chosenAddElements.selectedFans.push($scope.cart.allFansDB[elem]);
              }
            }
          }

          if($scope.cart.allWindowSillsDB.length > 0) {
            for (var elem = 0; elem < $scope.cart.allWindowSillsDB.length; elem++) {
              if ($scope.cart.allWindowSillsDB[elem].productId === $scope.global.order.products[prod].productId) {
                $scope.global.order.products[prod].chosenAddElements.selectedWindowSill.push($scope.cart.allWindowSillsDB[elem]);
              }
            }
          }

          if($scope.cart.allHandlesDB.length > 0) {
            for (var elem = 0; elem < $scope.cart.allHandlesDB.length; elem++) {
              if ($scope.cart.allHandlesDB[elem].productId === $scope.global.order.products[prod].productId) {
                $scope.global.order.products[prod].chosenAddElements.selectedHandles.push($scope.cart.allHandlesDB[elem]);
              }
            }
          }

          if($scope.cart.allOthersDB.length > 0) {
            for (var elem = 0; elem < $scope.cart.allOthersDB.length; elem++) {
              if ($scope.cart.allOthersDB[elem].productId === $scope.global.order.products[prod].productId) {
                $scope.global.order.products[prod].chosenAddElements.selectedOthers.push($scope.cart.allOthersDB[elem]);
              }
            }
          }
        }

        $scope.parseAddElementsLocaly();
      };



      //------ Download All Products Data for Order
      localDB.selectDB($scope.global.productsTableBD, {'orderId': $scope.global.orderEditNumber}, function (results) {
        if (results.status) {
          $scope.cart.productsEddited = angular.copy(results.data);
          //------------- parsing All Templates Source and Icons for Order

          for(var prod = 0; prod < $scope.cart.productsEddited.length; prod++) {
            var product = {};
            product = angular.copy($scope.global.productSource);
            angular.extend(product, $scope.cart.productsEddited[prod]);
            console.log('product ==== ', product);

            if(!product.isAddElementsONLY || product.isAddElementsONLY === 'false') {
              product.templateSource = parsingTemplateSource(product.templateSource);
              console.log('templateSource', product.templateSource);

              // парсинг шаблона, расчет размеров
              $scope.global.templateDepths = {
                frameDepth: $scope.global.allProfileFrameSizes[product.profileIndex],
                sashDepth: $scope.global.allProfileSashSizes[product.profileIndex],
                impostDepth: $scope.global.allProfileImpostSizes[product.profileIndex],
                shtulpDepth: $scope.global.allProfileShtulpSizes[product.profileIndex]
              };
              product.templateIcon = new TemplateIcon(product.templateSource, $scope.global.templateDepths);
              product.templateDefault = new Template(product.templateSource, $scope.global.templateDepths);
              console.log('templateIcon', product.templateIcon);
            }
            $scope.global.order.products.push(product);
          }
          $scope.parseAddElements();
          //----------- start order price total calculation
          //$scope.calculateProductsPrice();

        } else {
          console.log(results);
        }
      });

    }


  //=========== from Main page
  } else {
    $scope.parseAddElementsLocaly();
    //----------- start order price total calculation
    $scope.calculateProductsPrice();
    $scope.global.order.orderPriceTOTAL = $scope.global.order.productsPriceTOTAL;

  }








  //----- Delete Product
  $scope.clickDeleteProduct = function(productIndex) {

    navigator.notification.confirm(
      $filter('translate')('common_words.DELETE_PRODUCT_TXT'),
      deleteProduct,
      $filter('translate')('common_words.DELETE_PRODUCT_TITLE'),
      [$filter('translate')('common_words.BUTTON_Y'), $filter('translate')('common_words.BUTTON_N')]
    );

    function deleteProduct(button) {
      if(button == 1) {
        //playSound('delete');
        $scope.global.order.products.splice(productIndex, 1);
        $scope.cart.allAddElements.splice(productIndex, 1);

        if(!$scope.cart.isOrderExisted) {
          var productIdBD = productIndex + 1;
          localDB.deleteDB($scope.global.productsTableBD, {'orderId': {"value": $scope.global.orderEditNumber, "union": 'AND'}, "productId": productIdBD});
          localDB.deleteDB($scope.global.addElementsTableBD, {'orderId': {"value": $scope.global.orderEditNumber, "union": 'AND'}, "productId": productIdBD});
        }

        //----- if all products were deleted go to main page????
        if($scope.global.order.products.length > 0 ) {
          // Change order price
          $scope.global.calculateOrderPrice();
        } else {
          $scope.global.createNewProjectCart();
          //TODO create new project
        }

      }

    }
  };




  //----- Edit Produtct in main page
  $scope.editProduct = function(productIndex) {
    $scope.global.productEditNumber = productIndex;
    $scope.global.isCreatedNewProject = false;
    $scope.global.isCreatedNewProduct = false;
    $scope.global.prepareMainPage();
    $location.path('/main');
  };


  //----- Reduce Product Qty
  $scope.lessProduct = function(productIndex) {
    var newProductsQty = $scope.global.order.products[productIndex].productQty;
    if(newProductsQty === 1) {
      $scope.clickDeleteProduct(productIndex);
    } else {
      --newProductsQty;
      $scope.global.order.products[productIndex].productQty = newProductsQty;
      // Change product value in DB
      var productIdBD = productIndex + 1;
      localDB.updateDB($scope.global.productsTableBD, {"productQty": newProductsQty}, {'orderId': {"value": $scope.global.order.orderId, "union": 'AND'}, "productId": productIdBD});

      $scope.global.calculateOrderPrice();
    }
  };


  //----- Increase Product Qty
  $scope.moreProduct = function(productIndex) {
    var newProductsQty = $scope.global.order.products[productIndex].productQty;
    ++newProductsQty;
    $scope.global.order.products[productIndex].productQty = newProductsQty;
    // Change product value in DB
    var productIdBD = productIndex + 1;
    localDB.updateDB($scope.global.productsTableBD, {"productQty": newProductsQty}, {'orderId': {"value": $scope.global.order.orderId, "union": 'AND'}, "productId": productIdBD});

    $scope.global.calculateOrderPrice();
  };


  //============= AddElements detail block
  //------- Show AddElements detail block for product
  $scope.showAllAddElementDetail = function(productIndex) {
    if($scope.cart.allAddElements[productIndex].length > 0) {
      //playSound('switching');
      $scope.cart.activeProductIndex = productIndex;
      $scope.cart.isAddElementDetail = true;
    }
  };
  //--------- Close AddElements detail block
  $scope.closeAllAddElementDetail = function() {
    $scope.cart.isAddElementDetail = false;
  };

  // Full/Light View switcher
  $scope.viewSwitching = function() {
    //playSound('swip');
    $scope.isCartLightView = !$scope.isCartLightView;
  };



  //------- add new product in order
  $scope.addNewProductInOrder = function() {
    $scope.global.isOpenedCartPage = false;
    $scope.global.isCreatedNewProject = false;
    $scope.global.isCreatedNewProduct = true;
    $scope.global.prepareMainPage();
    $location.path('/main');
  };



  //============= ALL AddElements panels

  //-------- collect all AddElements in allAddElementsList from all products
  $scope.prepareAllAddElementsList = function(){
    $scope.cart.allAddElementsList = angular.copy($scope.cart.allAddElementsListSource);
    for(var pr = 0; pr < $scope.global.order.products.length; pr++) {

      for(var prop in $scope.global.order.products[pr].chosenAddElements) {
        if (!$scope.global.order.products[pr].chosenAddElements.hasOwnProperty(prop)) {
          continue;
        }
        if($scope.global.order.products[pr].chosenAddElements[prop].length > 0) {
          for (var elem = 0; elem < $scope.global.order.products[pr].chosenAddElements[prop].length; elem++) {
            var tempChosenAddElement = angular.copy($scope.global.order.products[pr].chosenAddElements[prop][elem]);
            tempChosenAddElement.elementQty *= $scope.global.order.products[pr].productQty;
            tempChosenAddElement.productQty = $scope.global.order.products[pr].productQty;
            tempChosenAddElement.productId = $scope.global.order.products[pr].productId;
            tempChosenAddElement.isAddElementsONLY = $scope.global.order.products[pr].isAddElementsONLY;
            switch (tempChosenAddElement.elementType) {
              case 1:
                $scope.cart.allAddElementsList.grids.push(tempChosenAddElement);
                break;
              case 2:
                $scope.cart.allAddElementsList.visors.push(tempChosenAddElement);
                break;
              case 3:
                $scope.cart.allAddElementsList.spillways.push(tempChosenAddElement);
                break;
              case 4:
                $scope.cart.allAddElementsList.outsideSlope.push(tempChosenAddElement);
                break;
              case 5:
                $scope.cart.allAddElementsList.louvers.push(tempChosenAddElement);
                break;
              case 6:
                $scope.cart.allAddElementsList.insideSlope.push(tempChosenAddElement);
                break;
              case 7:
                $scope.cart.allAddElementsList.connectors.push(tempChosenAddElement);
                break;
              case 8:
                $scope.cart.allAddElementsList.fans.push(tempChosenAddElement);
                break;
              case 9:
                $scope.cart.allAddElementsList.windowSill.push(tempChosenAddElement);
                break;
              case 10:
                $scope.cart.allAddElementsList.handles.push(tempChosenAddElement);
                break;
              case 11:
                $scope.cart.allAddElementsList.others.push(tempChosenAddElement);
                break;
            }

          }
        }
      }
    }
  };

  //--------------- dublicats cleaning in allAddElementsList in order to make unique element
  $scope.cleaningAllAddElementsList = function(){
    $scope.cart.addElementsUniqueList = angular.copy($scope.cart.allAddElementsList);
    //---- check dublicats
    for(var type in $scope.cart.addElementsUniqueList) {
      if (!$scope.cart.addElementsUniqueList.hasOwnProperty(type)) {
        continue;
      }
      if($scope.cart.addElementsUniqueList[type].length > 0) {
        for(var elem = $scope.cart.addElementsUniqueList[type].length - 1; elem >= 0 ; elem--) {
          for(var el = $scope.cart.addElementsUniqueList[type].length - 1; el >= 0 ; el--) {
            if(elem === el) {
              continue;
            } else {
              if($scope.cart.addElementsUniqueList[type][elem].elementId === $scope.cart.addElementsUniqueList[type][el].elementId && $scope.cart.addElementsUniqueList[type][elem].elementWidth === $scope.cart.addElementsUniqueList[type][el].elementWidth && $scope.cart.addElementsUniqueList[type][elem].elementHeight === $scope.cart.addElementsUniqueList[type][el].elementHeight) {
                $scope.cart.addElementsUniqueList[type][elem].elementQty += $scope.cart.addElementsUniqueList[type][el].elementQty;
                $scope.cart.addElementsUniqueList[type].splice(el, 1);
                elem--;
              }
            }
          }
        }
      }
    }
    //console.log('$scope.cart.addElementsUniqueList ==== ', $scope.cart.addElementsUniqueList);
  };

  //------ calculate TOTAL AddElements price
  $scope.getTOTALAddElementsPrice = function() {
    $scope.cart.addElementsListPriceTOTAL = 0;
    for(var i = 0; i < $scope.global.order.products.length; i++) {
      $scope.cart.addElementsListPriceTOTAL += ($scope.global.order.products[i].addElementsPriceSELECT * $scope.global.order.products[i].productQty);
    }
  };


  //-------- show All Add Elements panel
  $scope.showAllAddElements = function() {
    //--- open if AddElements are existed
    if($scope.cart.isOrderHaveAddElements) {
      //playSound('swip');
      $scope.cart.isShowAllAddElements = !$scope.cart.isShowAllAddElements;
      if($scope.cart.isShowAllAddElements) {
        $scope.prepareAllAddElementsList();
        $scope.cleaningAllAddElementsList();
        $scope.getTOTALAddElementsPrice();
      } else {
        $scope.cart.allAddElementsList = angular.copy($scope.cart.allAddElementsListSource);
        $scope.cart.addElementsUniqueList = {};
      }
    }
  };


  //------ delete All AddElements List
  $scope.deleteAllAddElementsList = function() {
    $scope.cart.addElementsListPriceTOTAL = 0;
    for(var pr = 0; pr < $scope.global.order.products.length; pr++) {
      $scope.global.order.products[pr].productPriceTOTAL -= $scope.global.order.products[pr].addElementsPriceSELECT;
      $scope.global.order.products[pr].addElementsPriceSELECT = 0;
      for(var prop in $scope.global.order.products[pr].chosenAddElements) {
        if (!$scope.global.order.products[pr].chosenAddElements.hasOwnProperty(prop)) {
          continue;
        }
        if($scope.global.order.products[pr].chosenAddElements[prop].length > 0) {
          $scope.global.order.products[pr].chosenAddElements[prop].length = 0;
        }
      }
    }
    //---- close all AddElements panel
    $scope.parseAddElementsLocaly();
    $scope.showAllAddElements();
    $scope.global.calculateOrderPrice();
    $scope.cart.isOrderHaveAddElements = false;
  };

  function getCurrentAddElementsType(elementType) {
    var curentType = '';
    switch (elementType) {
      case 1: curentType = 'grids';
        break;
      case 2: curentType = 'visors';
        break;
      case 3: curentType = 'spillways';
        break;
      case 4: curentType = 'outsideSlope';
        break;
      case 5: curentType = 'louvers';
        break;
      case 6: curentType = 'insideSlope';
        break;
      case 7: curentType = 'connectors';
        break;
      case 8: curentType = 'fans';
        break;
      case 9: curentType = 'windowSill';
        break;
      case 10: curentType = 'handles';
        break;
      case 11: curentType = 'others';
        break;
    }
    return curentType;
  }


  //------ delete AddElement in All AddElementsList
  $scope.deleteAddElementList = function(elementType, elementId) {
    var curentType;
    //----- if we delete all AddElement Unit in header of Unit Detail panel
    if($scope.cart.isShowAddElementUnit) {
      playSound('swip');
      $scope.cart.isShowAddElementUnit = !$scope.cart.isShowAddElementUnit;
      $scope.cart.selectedAddElementUnitId = 0;
      $scope.cart.selectedAddElementUnitIndex = 0;
      $scope.cart.selectedAddElementUnitType = 0;
      $scope.cart.selectedAddElementUnits.length = 0;
      curentType = elementType;
    } else {
      curentType = getCurrentAddElementsType(elementType);
    }
    for (var el = ($scope.cart.allAddElementsList[curentType].length - 1); el >= 0; el--) {
      if($scope.cart.allAddElementsList[curentType][el].elementId === elementId) {
        $scope.cart.allAddElementsList[curentType].splice(el, 1);
      }
    }
    $scope.cleaningAllAddElementsList();
    for(var p = 0; p < $scope.global.order.products.length; p++) {
      for(var prop in $scope.global.order.products[p].chosenAddElements) {
        if (!$scope.global.order.products[p].chosenAddElements.hasOwnProperty(prop)) {
          continue;
        }
        if((prop.toUpperCase()).indexOf(curentType.toUpperCase())+1 && $scope.global.order.products[p].chosenAddElements[prop].length > 0) {
          for (var elem = ($scope.global.order.products[p].chosenAddElements[prop].length - 1); elem >= 0; elem--) {
            if($scope.global.order.products[p].chosenAddElements[prop][elem].elementId === elementId) {
              $scope.global.order.products[p].addElementsPriceSELECT -= $scope.global.order.products[p].chosenAddElements[prop][elem].elementPrice;
              $scope.global.order.products[p].productPriceTOTAL -= $scope.global.order.products[p].chosenAddElements[prop][elem].elementPrice;
              $scope.global.order.products[p].chosenAddElements[prop].splice(elem, 1);
            }
          }
        }
      }
    }
    $scope.getTOTALAddElementsPrice();
    $scope.parseAddElementsLocaly();
    $scope.global.calculateOrderPrice();
    //--------- if all AddElements were deleted
    //---- close all AddElements panel
    if(!$scope.cart.addElementsListPriceTOTAL) {
      $scope.showAllAddElements();
      $scope.cart.isOrderHaveAddElements = false;
    }
  };





  //-------- show Add Element Unit Detail panel
  $scope.showAddElementUnitDetail = function(elementType, elementId, elementIndex) {
    playSound('swip');
    $scope.cart.isShowAddElementUnit = !$scope.cart.isShowAddElementUnit;
    if($scope.cart.isShowAddElementUnit) {
      $scope.cart.selectedAddElementUnitId = elementId;
      $scope.cart.selectedAddElementUnitIndex = elementIndex;
      $scope.cart.selectedAddElementUnitType = getCurrentAddElementsType(elementType);
      $scope.cart.selectedAddElementUnits.length = 0;
      //console.log('allAddElementsList == ', $scope.cart.allAddElementsList);

      for(var i = 0; i < $scope.cart.allAddElementsList[$scope.cart.selectedAddElementUnitType].length; i++) {
        if($scope.cart.allAddElementsList[$scope.cart.selectedAddElementUnitType][i].elementId === $scope.cart.selectedAddElementUnitId) {
          if($scope.cart.allAddElementsList[$scope.cart.selectedAddElementUnitType][i].productQty === 1){
            $scope.cart.selectedAddElementUnits.push($scope.cart.allAddElementsList[$scope.cart.selectedAddElementUnitType][i]);
          } else {
            var addElementsUniqueProduct = [];
            var addElementsUnique = angular.copy($scope.cart.allAddElementsList[$scope.cart.selectedAddElementUnitType][i]);
            addElementsUnique.elementQty /= addElementsUnique.productQty;
            for(var p = 0; p < addElementsUnique.productQty; p++) {
              addElementsUniqueProduct.push(addElementsUnique);
            }
            if(addElementsUniqueProduct.length > 0) {
              $scope.cart.selectedAddElementUnits.push(addElementsUniqueProduct);
            }

          }
        }
      }
      console.log('start selectedAddElementUnits = ', $scope.cart.selectedAddElementUnits);
    } else {
      $scope.cart.selectedAddElementUnitId = 0;
      $scope.cart.selectedAddElementUnitIndex = 0;
      $scope.cart.selectedAddElementUnitType = 0;
      $scope.cart.selectedAddElementUnits.length = 0;
    }

  };


  //------ delete AddElement Unit in selectedAddElementUnits panel
  $scope.deleteAddElementUnit = function(parentIndex, elementIndex, addElementUnit) {
    console.log('start delete addElementsUniqueList = ', $scope.cart.addElementsUniqueList);
    //---- close selectedAddElementUnits panel when we delete last unit
    if($scope.cart.selectedAddElementUnits.length === 1) {
      $scope.deleteAddElementList($scope.cart.selectedAddElementUnitType, addElementUnit.elementId);
      $scope.cart.selectedAddElementUnits.length = 0;
      $scope.cart.isShowLinkExplodeMenu = false;
    } else if($scope.cart.selectedAddElementUnits.length > 1) {
      if(parentIndex === '') {
        $scope.cart.selectedAddElementUnits.splice(elementIndex, 1);
      } else {
        //-------- Delete all group
        $scope.cart.isShowLinkExplodeMenu = false;
        $scope.cart.selectedAddElementUnits.splice(parentIndex, 1);
      }
      var curentType = $scope.cart.selectedAddElementUnitType;
      for (var el = ($scope.cart.allAddElementsList[curentType].length - 1); el >= 0; el--) {
        if($scope.cart.allAddElementsList[curentType][el].productId === addElementUnit.productId && $scope.cart.allAddElementsList[curentType][el].elementId === addElementUnit.elementId) {
          $scope.cart.allAddElementsList[curentType].splice(el, 1);
        }
      }
      $scope.cleaningAllAddElementsList();
      for (var p = 0; p < $scope.global.order.products.length; p++) {
        for (var prop in $scope.global.order.products[p].chosenAddElements) {
          if (!$scope.global.order.products[p].chosenAddElements.hasOwnProperty(prop)) {
            continue;
          }
          if ((prop.toUpperCase()).indexOf(curentType.toUpperCase()) + 1 && $scope.global.order.products[p].chosenAddElements[prop].length > 0) {
            for (var elem = ($scope.global.order.products[p].chosenAddElements[prop].length - 1); elem >= 0; elem--) {
              if ($scope.global.order.products[p].productId === addElementUnit.productId && $scope.global.order.products[p].chosenAddElements[prop][elem].elementId === addElementUnit.elementId) {
                $scope.global.order.products[p].addElementsPriceSELECT -= $scope.global.order.products[p].chosenAddElements[prop][elem].elementPrice;
                $scope.global.order.products[p].productPriceTOTAL -= $scope.global.order.products[p].chosenAddElements[prop][elem].elementPrice;
                $scope.global.order.products[p].chosenAddElements[prop].splice(elem, 1);
              }
            }
          }
        }
      }
      console.log($scope.global.order.products);
      $scope.getTOTALAddElementsPrice();
      $scope.parseAddElementsLocaly();
      $scope.global.calculateOrderPrice();

    }
    console.log('end delete addElementsUniqueList = ', $scope.cart.addElementsUniqueList);
  };

  //-------- Show/Hide Explode Link Menu
  $scope.toggleExplodeLinkMenu = function() {
    $scope.cart.isShowLinkExplodeMenu = !$scope.cart.isShowLinkExplodeMenu;
  };

  //-------- Explode group to one unit
  $scope.explodeUnitToOneProduct = function(parentIndex) {
    $scope.cart.isShowLinkExplodeMenu = !$scope.cart.isShowLinkExplodeMenu;

    //----- change selected product
    var currentProductId = $scope.cart.selectedAddElementUnits[parentIndex][0].productId;
    var currentProductIndex = currentProductId - 1;
    var newProductsQty = $scope.global.order.products[currentProductIndex].productQty - 1;

    // making clone
    var cloneProduct = angular.copy($scope.global.order.products[currentProductIndex]);
    cloneProduct.productId = '';
    cloneProduct.productQty = 1;
    $scope.global.order.products.push(cloneProduct);

    $scope.global.order.products[currentProductIndex].productQty = newProductsQty;
    // Change product value in DB
    localDB.updateDB($scope.global.productsTableBD, {"productQty": newProductsQty}, {'orderId': {"value": $scope.global.order.orderId, "union": 'AND'}, "productId": currentProductId});

    console.log('selectedAddElementUnits == ', $scope.cart.selectedAddElementUnits);
    console.log('selected obj == ', $scope.cart.selectedAddElementUnits[parentIndex][0]);
    console.log('selected product id== ' );
  };

  //-------- Explode all group
  $scope.explodeUnitGroupToProducts = function(parentIndex) {
    $scope.cart.isShowLinkExplodeMenu = !$scope.cart.isShowLinkExplodeMenu;
  };


}]);