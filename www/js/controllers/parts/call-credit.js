
// controllers/parts/call-credit.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('CartModule')
    .controller('CallCreditCtrl', callCreditCtrl);

  function callCreditCtrl($filter, $location, globalConstants, localDB, GlobalStor, OrderStor, UserStor, CartStor, CartMenuServ) {

    var thisCtrl = this;
    //thisCtrl.global = GlobalStor.global;
    thisCtrl.order = OrderStor.order;
    thisCtrl.cartStor = CartStor;
    thisCtrl.cart = CartStor.cart;
    thisCtrl.userInfo = UserStor.userInfo;

    thisCtrl.config = {
      month: $filter('translate')('common_words.MONTH_LABEL'),
      montha: $filter('translate')('common_words.MONTHA_LABEL'),
      months: $filter('translate')('common_words.MONTHS_LABEL'),

      //DELAY_START: globalConstants.STEP,
      //typing: 'on'
    };


    //------ clicking
    thisCtrl.submitForm = submitForm;
    thisCtrl.closeOrderDialog = CartMenuServ.closeOrderDialog;


    //============ methods ================//


    //--------- Send Form Data
    function submitForm(form) {
      //------- Trigger validation flag.
      CartStor.cart.submitted = true;
      if(form.$valid) {
        CartMenuServ.sendOrder();
      }
    }





    // Search Location
//    $scope.showTipCity = false;
//    $scope.currentCity = false;
//    $scope.filteredCity = [];
//    var regex, checkCity, indexCity, cityObj;
//
//    optionsServ.getLocations(function (results) {
//      if (results.status) {
//        $scope.cities = results.data.locations;
//      } else {
//        console.log(results);
//      }
//    });
//
//    // Create regExpresion
//    function escapeRegExp(string){
//      return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
//    }
//
//
//
//    $scope.checkChanges = function() {
//      $scope.filteredCity.length = 0;
//      $scope.currentCity = false;
//      if($scope.user.location && $scope.user.location.length > 0) {
//        regex = new RegExp('^' + escapeRegExp($scope.user.location), 'i');
//        for(indexCity = 0; indexCity < $scope.cities.length; indexCity++){
//          checkCity = regex.test($scope.cities[indexCity].city);
//          if(checkCity) {
//            cityObj = {};
//            cityObj.city = $scope.cities[indexCity].city;
//            cityObj.current = $scope.cities[indexCity].current;
//            $scope.filteredCity.push(cityObj);
//          }
//        }
//      }
//      if($scope.filteredCity.length > 0) {
//        $scope.showTipCity = true;
//      } else {
//        $scope.showTipCity = false;
//      }
//    };
//
//    // Select City
//    $scope.selectCity = function(city, curr) {
//      $scope.user.location = city;
//      $scope.showTipCity = false;
//      if(curr) {
//        $scope.currentCity = true;
//      }
//    };






  }
})();
