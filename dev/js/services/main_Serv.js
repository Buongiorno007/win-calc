(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .factory('MainServ', navFactory);

  function navFactory(GlobalStor, UserStor, ProductStor, OrderStor) {

    var thisFactory = this;

    thisFactory.publicObj = {
      createOrderData: createOrderData,
      downloadAllProfiles: downloadAllProfiles
    };

    return thisFactory.publicObj;




    //============ methods ================//

    //------------- Create Order Id and Date
    function createOrderData() {
      var deliveryDate = new Date(),
          currentDate = new Date(),
          valuesDate,
          idDate;

      //----------- create order number for new project
      OrderStor.order.orderId = Math.floor((Math.random() * 100000));

      //------ set delivery day
      deliveryDate.setDate( currentDate.getDate() + GlobalStor.productionDays );
      valuesDate = [
        deliveryDate.getDate(),
        deliveryDate.getMonth() + 1
      ];
      for(idDate in valuesDate) {
        valuesDate[ idDate ] = valuesDate[ idDate ].toString().replace( /^([0-9])$/, '0$1' );
      }

      OrderStor.order.deliveryDate = valuesDate[ 0 ] + '.' + valuesDate[ 1 ] + '.' + deliveryDate.getFullYear();
      OrderStor.order.newDeliveryDate = OrderStor.order.deliveryDate;
    }



    //----------- get all profiles
    function downloadAllProfiles(results) {
      console.log(results);
      if(results) {
        GlobalStor.global.profilesType = angular.copy(results[0].folder);
        GlobalStor.global.profiles = angular.copy(results[0].profiles);

        ProductStor.product.profileId = GlobalStor.global.profiles[ProductStor.product.profileIndex].id;
        //$scope.global.product.profileName = $scope.global.profiles[$scope.global.profileIndex].name;
        //$scope.global.product.profileHeatCoeff = $scope.global.profiles[$scope.global.profileIndex].heatCoeff;
        //$scope.global.product.profileAirCoeff = $scope.global.profiles[$scope.global.profileIndex].airCoeff;
      } else {
        console.log(results);
      }
    }

  }
})();
