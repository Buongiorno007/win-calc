(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('CartModule')
    .controller('CallOrderCtrl', callOrderCtrl);

  function callOrderCtrl($scope, $location, globalConstants, optionsServ, localStorage, localDB, CartStor, CartServ, analyticsServ) {

    $scope.orderStyle = 'order';
    $scope.global = localStorage.storage;
    $scope.cartStor = CartStor;
    $scope.user = CartServ.setDefaultUserInfoXOrder();

    // Search Location
    $scope.showTipCity = false;
    $scope.currentCity = false;
    $scope.filteredCity = [];
    var regex, checkCity, indexCity, cityObj;

    optionsServ.getLocations(function (results) {
      if (results.status) {
        $scope.cities = results.data.locations;
      } else {
        console.log(results);
      }
    });

    // Create regExpresion
    function escapeRegExp(string){
      return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    }

    $scope.checkChanges = function() {
      $scope.filteredCity.length = 0;
      $scope.currentCity = false;
      if($scope.user.location && $scope.user.location.length > 0) {
        regex = new RegExp('^' + escapeRegExp($scope.user.location), 'i');
        for(indexCity = 0; indexCity < $scope.cities.length; indexCity++){
          checkCity = regex.test($scope.cities[indexCity].city);
          if(checkCity) {
            cityObj = {};
            cityObj.city = $scope.cities[indexCity].city;
            cityObj.current = $scope.cities[indexCity].current;
            $scope.filteredCity.push(cityObj);
          }
        }
      }
      if($scope.filteredCity.length > 0) {
        $scope.showTipCity = true;
      } else {
        $scope.showTipCity = false;
      }
    };

    // Select City
    $scope.selectCity = function(city, curr) {
      $scope.user.location = city;
      $scope.showTipCity = false;
      if(curr) {
        $scope.currentCity = true;
      }
    };


    // Close Call Master Dialog
    $scope.hideCallOrderDialog = function() {
      $scope.submitted = false;
      $scope.showTipCity = false;
      $scope.currentCity = false;
      $scope.user = CartServ.setDefaultUserInfoXOrder();
      CartServ.closeOrderDialog();
    };

    // Send Form Data
    $scope.submitForm = function (form) {
      // Trigger validation flag.
      $scope.submitted = true;

      if (form.$valid) {
        if($scope.global.orderEditNumber) {
          //----- delete old order in localDB
          localDB.deleteDB(localDB.ordersTableBD, {'orderId': $scope.global.orderEditNumber});
          //$scope.global.deleteOrderFromLocalDB($scope.global.orderEditNumber);
          /*
          for(var prod = 0; prod < $scope.global.order.products.length; prod++) {
            $scope.global.insertProductInLocalDB($scope.global.orderEditNumber, $scope.global.order.products[prod].productId, $scope.global.order.products[prod]);
          }
          */
        }
        $scope.global.insertOrderInLocalDB($scope.user, $scope.global.fullOrderType, $scope.orderStyle);
        //--------- Close cart dialog, go to history
        $scope.hideCallOrderDialog();
        $scope.global.orderEditNumber = false;
        $scope.global.isCreatedNewProject = false;
        $scope.global.isCreatedNewProduct = false;
        $scope.global.isOrderFinished = true;
        analyticsServ.sendAnalyticsGlobalDB($scope.global.order);
        $location.path('/history');
      }
    };

  }
})();