
// controllers/cart.js

/* globals BauVoiceApp, STEP */

'use strict';

BauVoiceApp.controller('CartCtrl', ['$scope', 'localDB', 'localStorage', '$location', '$filter', function ($scope, localDB, localStorage, $location, $filter) {

  $scope.global = localStorage;

  $scope.cart = {
    order: {},
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

  $scope.global.isOpenedCartPage = true;
  $scope.global.isCreatedNewProject = false;
  $scope.global.isReturnFromDiffPage = false;

  //------- если из корзины пойти в историю а потом вернуться через редактирование и нажать на nav-menu button
  //$scope.global.isHistoryPage = false;
  //------- finish edit product
  $scope.global.productEditNumber = false;





  //----- Calculate All Products Price
  $scope.calculateProductsPrice = function() {
    $scope.global.order.productsPriceTOTAL = 0;
    for(p = 0; p <  $scope.cart.order.products.length; p++) {
      $scope.global.order.productsPriceTOTAL += parseFloat( (parseFloat($scope.cart.order.products[p].productPriceTOTAL.toFixed(2)) * $scope.cart.order.products[p].productQty).toFixed(2) );
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
    for(prod = 0; prod < $scope.cart.order.products.length; prod++) {
      product = [];

      for(var prop in $scope.cart.order.products[prod].chosenAddElements) {
        if (!$scope.cart.order.products[prod].chosenAddElements.hasOwnProperty(prop)) {
          continue;
        }
        for (var elem = 0; elem < $scope.cart.order.products[prod].chosenAddElements[prop].length; elem++) {
          product.push($scope.cart.order.products[prod].chosenAddElements[prop][elem]);
        }
      }
      $scope.cart.allAddElements.push(product);
    }
    //console.log('parseAddElementsLocaly', $scope.cart.allAddElements);
  };




  //================ EDIT order from Histoy
  if($scope.global.orderEditNumber) {

    $scope.cart.isOrderExisted = false;
    //-------- checking if order exist in orders array into LocalStorage
    for(var ord = 0; ord < $scope.global.orders; ord++) {
      if($scope.global.orders[ord].orderId === $scope.global.orderEditNumber) {
        $scope.cart.isOrderExisted = true;
        $scope.cart.order = angular.copy($scope.global.orders[ord]);
        $scope.parseAddElementsLocaly();
      }
    }
    //------ if order not exist take it from LocalDB
    if(!$scope.cart.isOrderExisted) {


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


      //------ Download All Products Data for Order
      localDB.selectDB($scope.global.productsTableBD, {'orderId': $scope.global.orderEditNumber}, function (results) {
        if (results.status) {
          $scope.cart.productObjSource = angular.copy(results.data);

          var productObj = angular.copy(results.data);
          var productCounter = productObj.length;

          /*

           var newobj = obj.split(',"objects":');
           var part1 = newobj[0].replace(/^{/gm,'');
           var part2 = newobj[1].replace(/}$/gm,'');
           var part1Arr = part1.split(':');
           console.log(part1);
           console.log(part1Arr);
           mainObj[part1Arr[0].replace(/^"+"$/gm)] = part1Arr[1].replace(/^\"/gm, '').replace(/\"$/gm, '');
           console.log(mainObj);

           */

          //------------- Download All Templates for Order
          localDB.selectDB($scope.global.componentsTableBD, {'orderId': $scope.global.orderEditNumber}, function (results) {
            if (results.status) {
              $scope.global.productObj = productObj;

              $scope.global.productCounter = productCounter;
              console.log($scope.global.productObj);
              var tempTemplateSource = angular.copy(results.data);
              for(var prod = 1; prod <=  $scope.global.productCounter; prod++) {

                var productIconSource,
                    productIcon;
                //------ if Add Elements only
                if($scope.global.productObj.addElementsOnly) {
                  productIcon = {};
                } else {
                  productIconSource = $scope.global.parseTemplateLocalDB(tempTemplateSource, prod);
                  productIcon = new TemplateIcon(productIconSource, $scope.global.templateDepths);
                }

                $scope.cart.allTemplateIcons.push(productIcon);
                $scope.global.productObj[prod-1].icon = productIcon;

              }

              //$scope.global.calculateOrderPrice();
              //$scope.global.orderTotalPrice = $scope.global.orderPrice;

              $scope.parseAddElements();

            } else {
              console.log(results);
            }
          });

        } else {
          console.log(results);
        }
      });



      $scope.parseAddElements = function() {
        for(prod = 0; prod < $scope.global.productCounter; prod++) {

          product = [];

          if($scope.cart.allGridsDB && $scope.cart.allGridsDB.length > 0) {
            for(var elem = 0; elem < $scope.cart.allGridsDB.length; elem++) {
              if($scope.cart.allGridsDB[elem].productId === $scope.global.productObj[prod].productId) {
                product.push($scope.cart.allGridsDB[elem]);
              }
            }
          }

          if($scope.cart.allVisorsDB && $scope.cart.allVisorsDB.length > 0) {
            for(var elem = 0; elem < $scope.cart.allVisorsDB.length; elem++) {
              if($scope.cart.allVisorsDB[elem].productId === $scope.global.productObj[prod].productId) {
                product.push($scope.cart.allVisorsDB[elem]);
              }
            }
          }

          if($scope.cart.allSpillwaysDB && $scope.cart.allSpillwaysDB.length > 0) {
            for(var elem = 0; elem < $scope.cart.allSpillwaysDB.length; elem++) {
              if($scope.cart.allSpillwaysDB[elem].productId === $scope.global.productObj[prod].productId) {
                product.push($scope.cart.allSpillwaysDB[elem]);
              }
            }
          }

          if($scope.cart.allOutSlopesDB && $scope.cart.allOutSlopesDB.length > 0) {
            for(var elem = 0; elem < $scope.cart.allOutSlopesDB.length; elem++) {
              if($scope.cart.allOutSlopesDB[elem].productId === $scope.global.productObj[prod].productId) {
                product.push($scope.cart.allOutSlopesDB[elem]);
              }
            }
          }

          if($scope.cart.allInSlopesDB && $scope.cart.allInSlopesDB.length > 0) {
            for(var elem = 0; elem < $scope.cart.allInSlopesDB.length; elem++) {
              if($scope.cart.allInSlopesDB[elem].productId === $scope.global.productObj[prod].productId) {
                product.push($scope.cart.allInSlopesDB[elem]);
              }
            }
          }

          if($scope.cart.allLouversDB && $scope.cart.allLouversDB.length > 0) {
            for(var elem = 0; elem < $scope.cart.allLouversDB.length; elem++) {
              if($scope.cart.allLouversDB[elem].productId === $scope.global.productObj[prod].productId) {
                product.push($scope.cart.allLouversDB[elem]);
              }
            }
          }

          if($scope.cart.allConnectorsDB && $scope.cart.allConnectorsDB.length > 0) {
            for(var elem = 0; elem < $scope.cart.allConnectorsDB.length; elem++) {
              if($scope.cart.allConnectorsDB[elem].productId === $scope.global.productObj[prod].productId) {
                product.push($scope.cart.allConnectorsDB[elem]);
              }
            }
          }

          if($scope.cart.allFansDB && $scope.cart.allFansDB.length > 0) {
            for(var elem = 0; elem < $scope.cart.allFansDB.length; elem++) {
              if($scope.cart.allFansDB[elem].productId === $scope.global.productObj[prod].productId) {
                product.push($scope.cart.allFansDB[elem]);
              }
            }
          }

          if($scope.cart.allWindowSillsDB && $scope.cart.allWindowSillsDB.length > 0) {
            for (var elem = 0; elem < $scope.cart.allWindowSillsDB.length; elem++) {
              if ($scope.cart.allWindowSillsDB[elem].productId === $scope.global.productObj[prod].productId) {
                product.push($scope.cart.allWindowSillsDB[elem]);
              }
            }
          }

          if($scope.cart.allHandlesDB && $scope.cart.allHandlesDB.length > 0) {
            for (var elem = 0; elem < $scope.cart.allHandlesDB.length; elem++) {
              if ($scope.cart.allHandlesDB[elem].productId === $scope.global.productObj[prod].productId) {
                product.push($scope.cart.allHandlesDB[elem]);
              }
            }
          }

          if($scope.cart.allOthersDB && $scope.cart.allOthersDB.length > 0) {
            for (var elem = 0; elem < $scope.cart.allOthersDB.length; elem++) {
              if ($scope.cart.allOthersDB[elem].productId === $scope.global.productObj[prod].productId) {
                product.push($scope.cart.allOthersDB[elem]);
              }
            }
          }
          console.log(product);
          $scope.cart.allAddElements.push(product);
        }
        console.log( $scope.cart.allAddElements);
        $scope.cart.allAddElementsSource = angular.copy($scope.cart.allAddElements);
      };


    }

  //=========== from Main page
  } else {
    $scope.cart.order = angular.copy($scope.global.order);
    $scope.parseAddElementsLocaly();
  }

  //----------- start order price total calculation
  $scope.calculateProductsPrice();
  $scope.global.order.orderPriceTOTAL = $scope.global.order.productsPriceTOTAL;






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

        if($scope.cart.isOrderExisted) {
          $scope.global.order.products.splice(productIndex, 1);
          $scope.cart.order.products.splice(productIndex, 1);
          $scope.cart.allAddElements.splice(productIndex, 1);
        } else {
          $scope.cart.order.products.splice(productIndex, 1);
          $scope.cart.allAddElements.splice(productIndex, 1);
          var productIdBD = productIndex + 1;
          localDB.deleteDB($scope.global.productsTableBD, {'orderId': {"value": $scope.global.orderEditNumber, "union": 'AND'}, "productId": productIdBD});
          localDB.deleteDB($scope.global.visorsTableBD, {'orderId': {"value": $scope.global.orderEditNumber, "union": 'AND'}, "productId": productIdBD});
          localDB.deleteDB($scope.global.windowSillsTableBD, {'orderId': {"value": $scope.global.orderEditNumber, "union": 'AND'}, "productId": productIdBD});
        }

        //----- if all products were deleted go to main page????
        if($scope.cart.order.products.length > 0 ) {
          // Change order price
          $scope.global.calculateOrderPrice();
        } else {
          $scope.global.createNewProjectCart();
        }

      }

    }
  };




  //----- Edit Produtct in main page
  $scope.editProduct = function(productId) {
    $scope.global.productEditNumber = productId;
    $scope.global.showNavMenu = false;
    $scope.global.isConfigMenu = true;
    $scope.global.showPanels = {};
    $scope.global.clearAllAddElements();
    $location.path('/main');
  };


  //----- Reduce Product Qty
  $scope.lessProduct = function(productIndex) {

    newProductsQty = $scope.cart.order.products[productIndex].productQty;
    if(newProductsQty === 1) {
      $scope.clickDeleteProduct(productIndex);
    } else {
      --newProductsQty;
      $scope.cart.order.products[productIndex].productQty = newProductsQty;
      $scope.global.order.products[productIndex].productQty = newProductsQty;
      // Change product value in DB
      var productIdBD = productIndex + 1;
      localDB.updateDB($scope.global.productsTableBD, {"productQty": newProductsQty}, {'orderId': {"value": $scope.cart.order.orderId, "union": 'AND'}, "productId": productIdBD});

      $scope.global.calculateOrderPrice();

    }
  };


  //----- Increase Product Qty
  $scope.moreProduct = function(productIndex) {

    newProductsQty = $scope.cart.order.products[productIndex].productQty;
    ++newProductsQty;
    $scope.cart.order.products[productIndex].productQty = newProductsQty;
    $scope.global.order.products[productIndex].productQty = newProductsQty;
    // Change product value in DB
    var productIdBD = productIndex + 1;
    localDB.updateDB($scope.global.productsTableBD, {"productQty": newProductsQty}, {'orderId': {"value": $scope.cart.order.orderId, "union": 'AND'}, "productId": productIdBD});

    $scope.global.calculateOrderPrice();

  };


  //============= AddElements detail block
  //------- Show AddElements detail block for product
  $scope.showAllAddElementDetail = function(productIndex) {
    if($scope.cart.allAddElements[productIndex].length > 0) {
      $scope.cart.isAddElementDetail = productIndex;
    }
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
    //$scope.global.isAddNewProductInOrder = true;
    $scope.global.productEditNumber = false;
    //$scope.global.templateIndex = 0;
    //$scope.global.profileIndex = 0;
    $scope.global.product = angular.copy($scope.global.productSource);
    //$scope.global.clearAllAddElements();
    $scope.global.prepareMainPage();
    $location.path('/main');
  };

}]);
