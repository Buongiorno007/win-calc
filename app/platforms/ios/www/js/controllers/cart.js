
// controllers/cart.js

/* globals BauVoiceApp, STEP */

'use strict';

BauVoiceApp.controller('CartCtrl', ['$scope', 'localDB', 'localStorage', '$location', function ($scope, localDB, localStorage, $location) {

  $scope.global = localStorage;

  $scope.cart = {
    allAddElements: [],
    isAddElementDetail: false
  };

  var p, prod, product, newProductsQty, oldProductPrice, newProductPrice;

  //-------- checking cart page was opened for save draft order
  $scope.global.wasOpenedCartPage = true;
  //------- если из корзины пойти в историю а потом вернуться через редактирование и нажать на nav-menu button
  $scope.global.isHistoryPage = false;
  //------- finish edit product
  $scope.global.productEditNumber = 0;

  //------ Download Add Elements from localDB
  localDB.selectDB($scope.global.visorsTableBD, {'orderId': $scope.global.orderNumber}, function (results) {
    if (results.status) {
      $scope.cart.allVisorsDB = angular.copy(results.data);
    } else {
      console.log(results);
    }
  });
  localDB.selectDB($scope.global.windowSillsTableBD, {'orderId': $scope.global.orderNumber}, function (results) {
    if (results.status) {
      $scope.cart.allWindowSillsDB = angular.copy(results.data);
    } else {
      console.log(results);
    }
  });

  //------ Download Products Data from localDB
  localDB.selectDB($scope.global.productsTableBD, {'orderId': $scope.global.orderNumber}, function (results) {
  //localDB.selectAllDB($scope.global.productsTableBD, function (results) {
    if (results.status) {
      $scope.cart.productObjSource = angular.copy(results.data);
      $scope.global.productObj = angular.copy(results.data);
      $scope.global.productCounter = $scope.global.productObj.length;

      $scope.global.calculateOrderPrice();
      $scope.global.orderTotalPrice = $scope.global.orderPrice;

      for(prod = 0; prod < $scope.global.productCounter; prod++) {

        product = [];
        if($scope.cart.allVisorsDB && $scope.cart.allVisorsDB.length > 0) {
          for(var elem = 0; elem < $scope.cart.allVisorsDB.length; elem++) {
            if($scope.cart.allVisorsDB[elem].productId === $scope.global.productObj[prod].productId) {
              product.push($scope.cart.allVisorsDB[elem]);
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

        $scope.cart.allAddElements.push(product);
      }
      $scope.cart.allAddElementsSource = angular.copy($scope.cart.allAddElements);
    } else {
      console.log(results);
    }
  });


  //----- Delete Product
  $scope.deleteProduct = function(productIdBD, productIdArr) {
    $scope.global.productObj.splice(productIdArr, 1);
    $scope.cart.productObjSource.splice(productIdArr, 1);
    $scope.cart.allAddElements.splice(productIdArr, 1);
    --$scope.global.productCounter;
    // Change order price
    $scope.global.calculateOrderPrice();
    localDB.deleteDB($scope.global.productsTableBD, {'orderId': {"value": $scope.global.orderNumber, "union": 'AND'}, "productId": productIdBD});
    localDB.deleteDB($scope.global.componentsTableBD, {'orderId': {"value": $scope.global.orderNumber, "union": 'AND'}, "productId": productIdBD});
    localDB.deleteDB($scope.global.visorsTableBD, {'orderId': {"value": $scope.global.orderNumber, "union": 'AND'}, "productId": productIdBD});
    localDB.deleteDB($scope.global.windowSillsTableBD, {'orderId': {"value": $scope.global.orderNumber, "union": 'AND'}, "productId": productIdBD});
    //----- if all products were deleted go to main page
    if(!$scope.global.productCounter) {
      $scope.global.createNewProject();
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
  $scope.lessProduct = function(productIdBD, productIdArr) {
    newProductsQty = $scope.global.productObj[productIdArr].productQty;
    if(newProductsQty === 1) {
      $scope.deleteProduct(productIdBD, productIdArr);
    } else {
      $scope.global.productObj[productIdArr].productQty = --newProductsQty;
      oldProductPrice = parseFloat($scope.cart.productObjSource[productIdArr].productPrice);
      newProductPrice = parseFloat($scope.global.productObj[productIdArr].productPrice);
      $scope.global.productObj[productIdArr].productPrice = parseFloat((newProductPrice - oldProductPrice).toFixed(2));
      $scope.global.calculateOrderPrice();

      // Change product value in DB
      localDB.updateDB($scope.global.productsTableBD, {"productQty": newProductsQty}, {'orderId': {"value": $scope.global.orderNumber, "union": 'AND'}, "productId": productIdBD});
    }
  };


  //----- Increase Product Qty
  $scope.moreProduct = function(productIdBD, productIdArr) {
    newProductsQty = $scope.global.productObj[productIdArr].productQty;
    $scope.global.productObj[productIdArr].productQty = ++newProductsQty;
    oldProductPrice = parseFloat($scope.cart.productObjSource[productIdArr].productPrice);
    newProductPrice = parseFloat($scope.global.productObj[productIdArr].productPrice);
    $scope.global.productObj[productIdArr].productPrice = parseFloat((oldProductPrice + newProductPrice).toFixed(2));

    $scope.global.calculateOrderPrice();
    // Change product value in DB
    localDB.updateDB($scope.global.productsTableBD, {"productQty": newProductsQty}, {'orderId': {"value": $scope.global.orderNumber, "union": 'AND'}, "productId": productIdBD});
  };


  //----- AddElements detail block
    // Show AddElements detail block for product
  $scope.showAllAddElementDetail = function(productIdBD, productIdArr) {
    if($scope.cart.allAddElements[productIdArr].length > 0) {
      $scope.cart.isAddElementDetail = productIdBD;
    }
  };
    // Close AddElements detail block
  $scope.closeAllAddElementDetail = function() {
    $scope.cart.isAddElementDetail = false;
  };


  // Full/Light View switcher
  $scope.isCartLightView = false;
  $scope.viewSwitching = function() {
    $scope.isCartLightView = !$scope.isCartLightView;
  };

  //----- Calculate All Products Price
  $scope.calculateProductsPrice = function() {
    $scope.global.orderPrice = 0;
    for(p = 0; p < $scope.global.productCounter; p++) {
      $scope.global.orderPrice += ($scope.global.productObj[p].productPrice * $scope.global.productObj[p].productQty);
    }
    $scope.global.orderPrice = parseFloat($scope.global.orderPrice.toFixed(2));
  };

  // Calculate Order Price
  $scope.global.calculateOrderPrice = function() {
    $scope.calculateProductsPrice();
    //----- join together product prices and order option
    $scope.global.calculateTotalOrderPrice();
  };

}]);
