/* globals BauVoiceApp, STEP */

'use strict';

BauVoiceApp.controller('CartCtrl', ['$scope', 'localDB', 'localStorage', '$location', function ($scope, localDB, localStorage, $location) {

  $scope.global = localStorage;

  $scope.cart = {
    allAddElements: [],
    isAddElementDetail: ''
  };

  var p, prod, product, elem, productIdBD, newProductsQty, oldProductPrice, newProductPrice;

  // download Add Elements
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

  // Get Products Data
  localDB.selectAllDB($scope.global.orderTableBD, function (results) {
    if (results.status) {
      $scope.cart.orderSource = angular.copy(results.data);
      $scope.global.order = angular.copy(results.data);
      $scope.global.ordersInCart = $scope.global.order.length;

      calculateOrderPrice();
      //console.log('$scope.global.orderPrice = '+$scope.global.orderPrice);

      for(prod = 1; prod <= $scope.global.ordersInCart; prod++) {

        product = [];
        if($scope.cart.allVisorsDB && $scope.cart.allVisorsDB.length > 0) {
          for(elem = 0; elem < $scope.cart.allVisorsDB.length; elem++) {
            if($scope.cart.allVisorsDB[elem].productId === prod) {
              product.push($scope.cart.allVisorsDB[elem]);
            }
          }
        }

        if($scope.cart.allWindowSillsDB && $scope.cart.allWindowSillsDB.length > 0) {
          for (elem = 0; elem < $scope.cart.allWindowSillsDB.length; elem++) {
            if ($scope.cart.allWindowSillsDB[elem].productId === prod) {
              product.push($scope.cart.allWindowSillsDB[elem]);
            }
          }
        }

        $scope.cart.allAddElements.push(product);
        console.log($scope.cart.allAddElements);
      }
      $scope.cart.allAddElementsSource = angular.copy($scope.cart.allAddElements);
    } else {
      console.log(results);
    }
  });



  // Delete Product
  $scope.deleteProduct = function(productId) {
    $scope.global.order.splice(productId, 1);
    --$scope.global.ordersInCart;
    // Change order price
    calculateOrderPrice();
    productIdBD = productId+1;
    localDB.deleteDB($scope.global.orderTableBD, {"productId": productIdBD});
    localDB.deleteDB($scope.global.visorsTableBD, {"productId": productIdBD});
    localDB.deleteDB($scope.global.windowSillsTableBD, {"productId": productIdBD});
  };

  // Reduce Product Qty
  $scope.lessProduct = function(productId) {
    productIdBD = productId+1;
    newProductsQty = $scope.global.order[productId].productQty;
    if(newProductsQty === 1) {
      $scope.deleteProduct(productId);
    } else {
      $scope.global.order[productId].productQty = --newProductsQty;
      oldProductPrice = Math.round(parseFloat($scope.cart.orderSource[productId].productPrice) * 100) / 100;
      newProductPrice = Math.round(parseFloat($scope.global.order[productId].productPrice) * 100) / 100;
      $scope.global.order[productId].productPrice = Math.round((newProductPrice - oldProductPrice) * 100) / 100;
      calculateOrderPrice();
      localDB.updateDB($scope.global.orderTableBD, {"productQty": newProductsQty}, {"productId": productIdBD});
      localDB.updateDB($scope.global.orderTableBD, {"productPrice": $scope.global.order[productId].productPrice}, {"productId": productIdBD});
    }
  };

  // Increase Product Qty
  $scope.moreProduct = function(productId) {
    productIdBD = productId+1;
    newProductsQty = $scope.global.order[productId].productQty;
    $scope.global.order[productId].productQty = ++newProductsQty;
    oldProductPrice = Math.round(parseFloat($scope.cart.orderSource[productId].productPrice) * 100) / 100;
    newProductPrice = Math.round(parseFloat($scope.global.order[productId].productPrice) * 100) / 100;
    $scope.global.order[productId].productPrice = Math.round((oldProductPrice + newProductPrice) * 100) / 100;
    calculateOrderPrice();


    // Change add elements quantity local
    if($scope.cart.allAddElements[productId] && $scope.cart.allAddElements[productId].length > 0) {
      for(elem = 0; elem < $scope.cart.allAddElements[productId].length; elem++) {
        $scope.cart.allAddElements[productId][elem].elementQty = $scope.cart.allAddElementsSource[productId][elem].elementQty * newProductsQty;
      }
    }

    // Change add elements quantity in DB
    if($scope.cart.allVisorsDB && $scope.cart.allVisorsDB.length > 0) {
      for(elem = 0; elem < $scope.cart.allVisorsDB.length; elem++) {
        if($scope.cart.allVisorsDB[elem].productId === productIdBD) {
          var newAddElementQty = $scope.cart.allVisorsDB[elem].elementQty * newProductsQty;
          localDB.updateDB($scope.global.visorsTableBD, {"elementQty": newAddElementQty}, {"productId": productIdBD});
        }
      }
    }
/*
    if($scope.cart.allWindowSillsDB && $scope.cart.allWindowSillsDB.length > 0) {
      for (elem = 0; elem < $scope.cart.allWindowSillsDB.length; elem++) {
        if ($scope.cart.allWindowSillsDB[elem].productId === productId) {

          localDB.updateDB($scope.global.windowSillsTableBD, {"elementQty": newProductsQty}, {"productId": productId});
        }
      }
    }
*/
    localDB.updateDB($scope.global.orderTableBD, {"productQty": newProductsQty}, {"productId": productIdBD});
    localDB.updateDB($scope.global.orderTableBD, {"productPrice": $scope.global.order[productId].productPrice}, {"productId": productIdBD});
  };


  // Show AddElements detail block for product
  $scope.showAllAddElementDetail = function(productId) {
    if($scope.cart.allAddElements[productId].length > 0) {
      $scope.cart.isAddElementDetail = productId;
    }
  };
  // Close AddElements detail block
  $scope.closeAllAddElementDetail = function() {
    $scope.cart.isAddElementDetail = '';
  };


  // Create New Product
  $scope.createNewProduct = function() {
    //$scope.global.showNavMenu = false;
    //$scope.global.isConfigMenu = true;
    $scope.global.showPanels = {};
    //$scope.global.showPanels.showTemplatePanel = true;
    //$scope.global.isTemplatePanel = true;

    // Clear Add Elements in localStorage
    for(var prop in $scope.global.chosenAddElements) {
      if (!$scope.global.chosenAddElements.hasOwnProperty(prop)) {
        continue;
      }
      $scope.global.chosenAddElements[prop].length = 0;
    }
    $location.path('/main');
  };

  // Full/Light View switcher
  $scope.isCartLightView = false;
  $scope.viewSwitching = function() {
    $scope.isCartLightView = !$scope.isCartLightView;
  };

  // Calculate Order Price
  function calculateOrderPrice() {
    $scope.global.orderPrice = 0;
    for(p = 0; p < $scope.global.ordersInCart; p++) {
      $scope.global.orderPrice += parseFloat($scope.global.order[p].productPrice);
    }
  }

}]);