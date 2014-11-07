/* globals BauVoiceApp, STEP */

'use strict';

BauVoiceApp.controller('CartCtrl', ['$scope', 'localDB', 'localStorage', '$location', function ($scope, localDB, localStorage, $location) {

  $scope.global = localStorage;

  $scope.cart = {
    allAddElements: [],
    isAddElementDetail: false
  };

  var p, prod, product, newProductsQty, oldProductPrice, newProductPrice;



  //------ Download Add Elements from localDB
  localDB.selectAllDB($scope.global.visorsTableBD, function (results) {
    if (results.status) {
      $scope.cart.allVisorsDB = angular.copy(results.data);
    } else {
      console.log(results);
    }
  });
  localDB.selectAllDB($scope.global.windowSillsTableBD, function (results) {
    if (results.status) {
      $scope.cart.allWindowSillsDB = angular.copy(results.data);
    } else {
      console.log(results);
    }
  });

  //------ Download Products Data from localDB
  localDB.selectAllDB($scope.global.productsTableBD, function (results) {
    if (results.status) {
      $scope.cart.productObjSource = angular.copy(results.data);
      $scope.global.productObj = angular.copy(results.data);
      $scope.global.productCounter = $scope.global.productObj.length;

      calculateOrderPrice();
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
        //console.log($scope.cart.allAddElements);
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
    calculateOrderPrice();
    localDB.deleteDB($scope.global.productsTableBD, {"productId": productIdBD});
    localDB.deleteDB($scope.global.componentsTableBD, {"productId": productIdBD});
    localDB.deleteDB($scope.global.visorsTableBD, {"productId": productIdBD});
    localDB.deleteDB($scope.global.windowSillsTableBD, {"productId": productIdBD});
  };



  //----- Edit Produtct in main page
  $scope.editProduct = function(productId) {
    $scope.global.productEditNumber = productId;
    $scope.global.showNavMenu = false;
    $scope.global.isConfigMenu = true;
    $location.path('/main');
  };


  //----- Reduce Product Qty
  $scope.lessProduct = function(productIdBD, productIdArr) {
    newProductsQty = $scope.global.productObj[productIdArr].productQty;
    if(newProductsQty === 1) {
      $scope.deleteProduct(productIdBD, productIdArr);
    } else {
      $scope.global.productObj[productIdArr].productQty = --newProductsQty;
      oldProductPrice = Math.round(parseFloat($scope.cart.productObjSource[productIdArr].productPrice) * 100) / 100;
      newProductPrice = Math.round(parseFloat($scope.global.productObj[productIdArr].productPrice) * 100) / 100;
      $scope.global.productObj[productIdArr].productPrice = Math.round((newProductPrice - oldProductPrice) * 100) / 100;
      calculateOrderPrice();

      // Change product value in DB
      localDB.updateDB($scope.global.productsTableBD, {"productQty": newProductsQty}, {"productId": productIdBD});
    }
  };




  //----- Increase Product Qty
  $scope.moreProduct = function(productIdBD, productIdArr) {
    newProductsQty = $scope.global.productObj[productIdArr].productQty;
    $scope.global.productObj[productIdArr].productQty = ++newProductsQty;
    oldProductPrice = Math.round(parseFloat($scope.cart.productObjSource[productIdArr].productPrice) * 100) / 100;
    newProductPrice = Math.round(parseFloat($scope.global.productObj[productIdArr].productPrice) * 100) / 100;
    $scope.global.productObj[productIdArr].productPrice = Math.round((oldProductPrice + newProductPrice) * 100) / 100;
    calculateOrderPrice();

    // Change product value in DB
    localDB.updateDB($scope.global.productsTableBD, {"productQty": newProductsQty}, {"productId": productIdBD});
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

  // Calculate Order Price
  function calculateOrderPrice() {
    $scope.global.orderPrice = 0;
    for(p = 0; p < $scope.global.productCounter; p++) {
      $scope.global.orderPrice += parseFloat($scope.global.productObj[p].productPrice);
    }
  }

}]);