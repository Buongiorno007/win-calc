/* globals BauVoiceApp, STEP */

'use strict';

BauVoiceApp.controller('CartCtrl', ['$scope', 'localDB', 'localStorage', '$location', function ($scope, localDB, localStorage, $location) {

  $scope.global = localStorage;

  $scope.cart = {
    allAddElements: [],
    allTemplateIcons: [],
    isAddElementDetail: false
  };

  var p, prod, product, newProductsQty, oldProductPrice, newProductPrice;

  $scope.global.isOpenedCartPage = true;
  $scope.global.isCreatedNewProject = false;
  $scope.global.isReturnFromDiffPage = false;

  //------- если из корзины пойти в историю а потом вернуться через редактирование и нажать на nav-menu button
  $scope.global.isHistoryPage = false;
  //------- finish edit product
  $scope.global.productEditNumber = 0;



  //------ Download All Add Elements for Order
  localDB.selectDB($scope.global.gridsTableBD, {'orderId': $scope.global.orderNumber}, function (results) {
    if (results.status) {
      $scope.cart.allGridsDB = angular.copy(results.data);
    } else {
      console.log(results);
    }
  });

  localDB.selectDB($scope.global.visorsTableBD, {'orderId': $scope.global.orderNumber}, function (results) {
    if (results.status) {
      $scope.cart.allVisorsDB = angular.copy(results.data);
    } else {
      console.log(results);
    }
  });

  localDB.selectDB($scope.global.spillwaysTableBD, {'orderId': $scope.global.orderNumber}, function (results) {
    if (results.status) {
      $scope.cart.allSpillwaysDB = angular.copy(results.data);
    } else {
      console.log(results);
    }
  });

  localDB.selectDB($scope.global.outSlopesTableBD, {'orderId': $scope.global.orderNumber}, function (results) {
    if (results.status) {
      $scope.cart.allOutSlopesDB = angular.copy(results.data);
    } else {
      console.log(results);
    }
  });

  localDB.selectDB($scope.global.inSlopesTableBD, {'orderId': $scope.global.orderNumber}, function (results) {
    if (results.status) {
      $scope.cart.allInSlopesDB = angular.copy(results.data);
    } else {
      console.log(results);
    }
  });

  localDB.selectDB($scope.global.louversTableBD, {'orderId': $scope.global.orderNumber}, function (results) {
    if (results.status) {
      $scope.cart.allLouversDB = angular.copy(results.data);
    } else {
      console.log(results);
    }
  });

  localDB.selectDB($scope.global.connectorsTableBD, {'orderId': $scope.global.orderNumber}, function (results) {
    if (results.status) {
      $scope.cart.allConnectorsDB = angular.copy(results.data);
    } else {
      console.log(results);
    }
  });

  localDB.selectDB($scope.global.fansTableBD, {'orderId': $scope.global.orderNumber}, function (results) {
    if (results.status) {
      $scope.cart.allFansDB = angular.copy(results.data);
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

  localDB.selectDB($scope.global.handlesTableBD, {'orderId': $scope.global.orderNumber}, function (results) {
    if (results.status) {
      $scope.cart.allHandlesDB = angular.copy(results.data);
    } else {
      console.log(results);
    }
  });

  localDB.selectDB($scope.global.othersTableBD, {'orderId': $scope.global.orderNumber}, function (results) {
    if (results.status) {
      $scope.cart.allOthersDB = angular.copy(results.data);
    } else {
      console.log(results);
    }
  });


  //------ Download All Products Data for Order
  localDB.selectDB($scope.global.productsTableBD, {'orderId': $scope.global.orderNumber}, function (results) {
  //localDB.selectAllDB($scope.global.productsTableBD, function (results) {
    if (results.status) {
      $scope.cart.productObjSource = angular.copy(results.data);
      //$scope.global.productObj = angular.copy(results.data);
      //$scope.global.productCounter = $scope.global.productObj.length;

      var productObj = angular.copy(results.data);
      var productCounter = productObj.length;

      //------------- Download All Templates for Order
      localDB.selectDB($scope.global.componentsTableBD, {'orderId': $scope.global.orderNumber}, function (results) {
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

          $scope.global.calculateOrderPrice();
          $scope.global.orderTotalPrice = $scope.global.orderPrice;

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



  //----- Delete Product
  $scope.clickDeleteProduct = function(productIdBD, productIdArr) {

    navigator.notification.confirm(
      'Хотите удалить продукт?',
      deleteProduct,
      'Удаление!',
      ['Да','Нет']
    );

    //----- Delete Product
    function deleteProduct(button) {
      if(button == 1) {

                                    $scope.global.productObj.splice(productIdArr, 1);
                                    $scope.cart.productObjSource.splice(productIdArr, 1);
                                    $scope.cart.allAddElements.splice(productIdArr, 1);
                                    --$scope.global.productCounter;
                                    localDB.deleteDB($scope.global.productsTableBD, {'orderId': {"value": $scope.global.orderNumber, "union": 'AND'}, "productId": productIdBD});
                                    localDB.deleteDB($scope.global.componentsTableBD, {'orderId': {"value": $scope.global.orderNumber, "union": 'AND'}, "productId": productIdBD});
                                    localDB.deleteDB($scope.global.visorsTableBD, {'orderId': {"value": $scope.global.orderNumber, "union": 'AND'}, "productId": productIdBD});
                                    localDB.deleteDB($scope.global.windowSillsTableBD, {'orderId': {"value": $scope.global.orderNumber, "union": 'AND'}, "productId": productIdBD});
                                    //----- if all products were deleted go to main page????
                                    if($scope.global.productCounter > 0 ) {
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
  $scope.lessProduct = function(productIdBD, productIdArr) {
    newProductsQty = $scope.global.productObj[productIdArr].productQty;
    if(newProductsQty === 1) {
      //$scope.deleteProduct(productIdBD, productIdArr);
      $scope.clickDeleteProduct(productIdBD, productIdArr);

    } else {
      $scope.global.productObj[productIdArr].productQty = --newProductsQty;
      //oldProductPrice = parseFloat($scope.cart.productObjSource[productIdArr].productPrice);
      //newProductPrice = parseFloat($scope.global.productObj[productIdArr].productPrice);
      //$scope.global.productObj[productIdArr].productPrice = parseFloat((newProductPrice - oldProductPrice).toFixed(2));
      $scope.global.calculateOrderPrice();
      // Change product value in DB
      localDB.updateDB($scope.global.productsTableBD, {"productQty": newProductsQty}, {'orderId': {"value": $scope.global.orderNumber, "union": 'AND'}, "productId": productIdBD});
    }
  };


  //----- Increase Product Qty
  $scope.moreProduct = function(productIdBD, productIdArr) {
    newProductsQty = $scope.global.productObj[productIdArr].productQty;
    $scope.global.productObj[productIdArr].productQty = ++newProductsQty;
    //oldProductPrice = parseFloat($scope.cart.productObjSource[productIdArr].productPrice);
    //newProductPrice = parseFloat($scope.global.productObj[productIdArr].productPrice);
    //$scope.global.productObj[productIdArr].productPrice = parseFloat((oldProductPrice + newProductPrice).toFixed(2));
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
      $scope.global.orderPrice += parseFloat( (parseFloat($scope.global.productObj[p].productPrice.toFixed(2)) * $scope.global.productObj[p].productQty).toFixed(2) );
    }

    $scope.global.orderPrice = parseFloat($scope.global.orderPrice.toFixed(2));
  };

  // Calculate Order Price
  $scope.global.calculateOrderPrice = function() {
    $scope.calculateProductsPrice();
    //----- join together product prices and order option
    $scope.global.calculateTotalOrderPrice();
  };


  //------- add new product in order
  $scope.addNewProductInOrder = function() {
    $scope.global.isOpenedCartPage = false;
    $scope.global.isAddNewProductInOrder = true;
    $scope.global.productEditNumber = false;
    $scope.global.templateIndex = 0;
    $scope.global.profileIndex = 0;
    $scope.global.product = angular.copy($scope.global.productSource);
    $scope.global.clearAllAddElements();
    $scope.global.prepareMainPage();
    $location.path('/main');
  };

}]);