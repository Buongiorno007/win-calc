/* globals BauVoiceApp, STEP */

'use strict';

BauVoiceApp.controller('CartCtrl', ['$scope', 'localDB', 'localStorage', '$location', '$filter', function ($scope, localDB, localStorage, $location, $filter) {

  $scope.global = localStorage;

  $scope.cart = {
    //product: {},
    //order: {},
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
    allTemplateIcons: [],
    isAddElementDetail: 'false'
  };

  var p, prod, product, newProductsQty;

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
    for(prod = 0; prod < $scope.global.order.products.length; prod++) {
      product = [];

      for(var prop in $scope.global.order.products[prod].chosenAddElements) {
        if (!$scope.global.order.products[prod].chosenAddElements.hasOwnProperty(prop)) {
          continue;
        }
        for (var elem = 0; elem < $scope.global.order.products[prod].chosenAddElements[prop].length; elem++) {
          product.push($scope.global.order.products[prod].chosenAddElements[prop][elem]);
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
      localDB.selectDB($scope.global.gridsTableBD, {'orderId': $scope.global.orderEditNumber}, function (results) {
        if (results.status) {
          $scope.cart.allGridsDB = angular.copy(results.data);
        } else {
          console.log(results);
        }
      });

      localDB.selectDB($scope.global.visorsTableBD, {'orderId': $scope.global.orderEditNumber}, function (results) {
        if (results.status) {
          $scope.cart.allVisorsDB = angular.copy(results.data);
        } else {
          console.log(results);
        }
      });

      localDB.selectDB($scope.global.spillwaysTableBD, {'orderId': $scope.global.orderEditNumber}, function (results) {
        if (results.status) {
          $scope.cart.allSpillwaysDB = angular.copy(results.data);
        } else {
          console.log(results);
        }
      });

      localDB.selectDB($scope.global.outSlopesTableBD, {'orderId': $scope.global.orderEditNumber}, function (results) {
        if (results.status) {
          $scope.cart.allOutSlopesDB = angular.copy(results.data);
        } else {
          console.log(results);
        }
      });

      localDB.selectDB($scope.global.inSlopesTableBD, {'orderId': $scope.global.orderEditNumber}, function (results) {
        if (results.status) {
          $scope.cart.allInSlopesDB = angular.copy(results.data);
        } else {
          console.log(results);
        }
      });

      localDB.selectDB($scope.global.louversTableBD, {'orderId': $scope.global.orderEditNumber}, function (results) {
        if (results.status) {
          $scope.cart.allLouversDB = angular.copy(results.data);
        } else {
          console.log(results);
        }
      });

      localDB.selectDB($scope.global.connectorsTableBD, {'orderId': $scope.global.orderEditNumber}, function (results) {
        if (results.status) {
          $scope.cart.allConnectorsDB = angular.copy(results.data);
        } else {
          console.log(results);
        }
      });

      localDB.selectDB($scope.global.fansTableBD, {'orderId': $scope.global.orderEditNumber}, function (results) {
        if (results.status) {
          $scope.cart.allFansDB = angular.copy(results.data);
        } else {
          console.log(results);
        }
      });

      localDB.selectDB($scope.global.windowSillsTableBD, {'orderId': $scope.global.orderEditNumber}, function (results) {
        if (results.status) {
          $scope.cart.allWindowSillsDB = angular.copy(results.data);
        } else {
          console.log(results);
        }
      });

      localDB.selectDB($scope.global.handlesTableBD, {'orderId': $scope.global.orderEditNumber}, function (results) {
        if (results.status) {
          $scope.cart.allHandlesDB = angular.copy(results.data);
        } else {
          console.log(results);
        }
      });

      localDB.selectDB($scope.global.othersTableBD, {'orderId': $scope.global.orderEditNumber}, function (results) {
        if (results.status) {
          $scope.cart.allOthersDB = angular.copy(results.data);
        } else {
          console.log(results);
        }
      });



      //----------- sorting all Edd Elements by Products
      $scope.parseAddElements = function() {
        console.log('productsEdit', $scope.global.order.products);
        for(prod = 0; prod < $scope.global.order.productsQty; prod++) {

          if($scope.cart.allGridsDB && $scope.cart.allGridsDB.length > 0) {
            for(var elem = 0; elem < $scope.cart.allGridsDB.length; elem++) {
              if($scope.cart.allGridsDB[elem].productId === $scope.global.order.products[prod].productId) {
                $scope.global.order.products[prod].chosenAddElements.selectedGrids.push($scope.cart.allGridsDB[elem]);
              }
            }
          }

          if($scope.cart.allVisorsDB && $scope.cart.allVisorsDB.length > 0) {
            for(var elem = 0; elem < $scope.cart.allVisorsDB.length; elem++) {
              if($scope.cart.allVisorsDB[elem].productId === $scope.global.order.products[prod].productId) {
                $scope.global.order.products[prod].chosenAddElements.selectedVisors.push($scope.cart.allVisorsDB[elem]);
              }
            }
          }

          if($scope.cart.allSpillwaysDB && $scope.cart.allSpillwaysDB.length > 0) {
            for(var elem = 0; elem < $scope.cart.allSpillwaysDB.length; elem++) {
              if($scope.cart.allSpillwaysDB[elem].productId === $scope.global.order.products[prod].productId) {
                $scope.global.order.products[prod].chosenAddElements.selectedSpillways.push($scope.cart.allSpillwaysDB[elem]);
              }
            }
          }

          if($scope.cart.allOutSlopesDB && $scope.cart.allOutSlopesDB.length > 0) {
            for(var elem = 0; elem < $scope.cart.allOutSlopesDB.length; elem++) {
              if($scope.cart.allOutSlopesDB[elem].productId === $scope.global.order.products[prod].productId) {
                $scope.global.order.products[prod].chosenAddElements.selectedOutsideSlope.push($scope.cart.allOutSlopesDB[elem]);
              }
            }
          }

          if($scope.cart.allInSlopesDB && $scope.cart.allInSlopesDB.length > 0) {
            for(var elem = 0; elem < $scope.cart.allInSlopesDB.length; elem++) {
              if($scope.cart.allInSlopesDB[elem].productId === $scope.global.order.products[prod].productId) {
                $scope.global.order.products[prod].chosenAddElements.selectedInsideSlope.push($scope.cart.allInSlopesDB[elem]);
              }
            }
          }

          if($scope.cart.allLouversDB && $scope.cart.allLouversDB.length > 0) {
            for(var elem = 0; elem < $scope.cart.allLouversDB.length; elem++) {
              if($scope.cart.allLouversDB[elem].productId === $scope.global.order.products[prod].productId) {
                $scope.global.order.products[prod].chosenAddElements.selectedLouvers.push($scope.cart.allLouversDB[elem]);
              }
            }
          }

          if($scope.cart.allConnectorsDB && $scope.cart.allConnectorsDB.length > 0) {
            for(var elem = 0; elem < $scope.cart.allConnectorsDB.length; elem++) {
              if($scope.cart.allConnectorsDB[elem].productId === $scope.global.order.products[prod].productId) {
                $scope.global.order.products[prod].chosenAddElements.selectedConnectors.push($scope.cart.allConnectorsDB[elem]);
              }
            }
          }

          if($scope.cart.allFansDB && $scope.cart.allFansDB.length > 0) {
            for(var elem = 0; elem < $scope.cart.allFansDB.length; elem++) {
              if($scope.cart.allFansDB[elem].productId === $scope.global.order.products[prod].productId) {
                $scope.global.order.products[prod].chosenAddElements.selectedFans.push($scope.cart.allFansDB[elem]);
              }
            }
          }

          if($scope.cart.allWindowSillsDB && $scope.cart.allWindowSillsDB.length > 0) {
            for (var elem = 0; elem < $scope.cart.allWindowSillsDB.length; elem++) {
              if ($scope.cart.allWindowSillsDB[elem].productId === $scope.global.order.products[prod].productId) {
                $scope.global.order.products[prod].chosenAddElements.selectedWindowSill.push($scope.cart.allWindowSillsDB[elem]);
              }
            }
          }

          if($scope.cart.allHandlesDB && $scope.cart.allHandlesDB.length > 0) {
            for (var elem = 0; elem < $scope.cart.allHandlesDB.length; elem++) {
              if ($scope.cart.allHandlesDB[elem].productId === $scope.global.order.products[prod].productId) {
                $scope.global.order.products[prod].chosenAddElements.selectedHandles.push($scope.cart.allHandlesDB[elem]);
              }
            }
          }

          if($scope.cart.allOthersDB && $scope.cart.allOthersDB.length > 0) {
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
          $scope.global.order.products.splice(productIndex, 1);
          $scope.cart.allAddElements.splice(productIndex, 1);

        if(!$scope.cart.isOrderExisted) {
          var productIdBD = productIndex + 1;
          localDB.deleteDB($scope.global.productsTableBD, {'orderId': {"value": $scope.global.orderEditNumber, "union": 'AND'}, "productId": productIdBD});
          localDB.deleteDB($scope.global.visorsTableBD, {'orderId': {"value": $scope.global.orderEditNumber, "union": 'AND'}, "productId": productIdBD});
          localDB.deleteDB($scope.global.windowSillsTableBD, {'orderId': {"value": $scope.global.orderEditNumber, "union": 'AND'}, "productId": productIdBD});
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

    newProductsQty = $scope.global.order.products[productIndex].productQty;
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

    newProductsQty = $scope.global.order.products[productIndex].productQty;
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
    /*
    if($scope.cart.allAddElements[productIndex].length > 0) {
      $scope.cart.isAddElementDetail = productIndex;
      console.log('ADDELEM', $scope.global.order.products[$scope.cart.isAddElementDetail].templateIcon);
    }
    */
  };
  //--------- Close AddElements detail block
  $scope.closeAllAddElementDetail = function() {
    $scope.cart.isAddElementDetail = 'false';
  };

  // Full/Light View switcher
  $scope.viewSwitching = function() {
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

}]);