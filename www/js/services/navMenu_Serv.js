
// services/navMenu_Serv.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .factory('NavMenuServ', navFactory);

  function navFactory($http, $cordovaGeolocation, OrderStor, UserStor) {

    var thisFactory = this;

    thisFactory.publicObj = {
      getCurrentGeolocation: getCurrentGeolocation,
      setLanguageVoiceHelper: setLanguageVoiceHelper
    };

    return thisFactory.publicObj;




    //============ methods ================//

      function getCurrentGeolocation() {
        //------ Data from GPS device
        //navigator.geolocation.getCurrentPosition(successLocation, errorLocation);
        $cordovaGeolocation.getCurrentPosition().then(successLocation, errorLocation);

          function successLocation(position) {
              var latitude = position.coords.latitude;
              var longitude = position.coords.longitude;
              $http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng='+latitude+','+longitude+'&sensor=true&language=ru').
                  success(function(data, status, headers, config) {
                      //----- save previous current location
                      //$scope.global.prevGeoLocation = angular.copy($scope.global.currentGeoLocation);

                      var deviceLocation = data.results[0].formatted_address.split(', ');
                      //TODO set new currencyID!!!!
                      //TODO before need to fine currencyId!!!!
                      //TODO loginServ.setUserGeoLocation(cityId, cityName, regionName, countryName, climatic, heat, fullLocation, currencyId)

                      OrderStor.order.currCityId = 156; //TODO должны тянуть с базы согласно новому городу, но город гугл дает на украинском языке, в базе на русском
                      OrderStor.order.currCityName = deviceLocation[deviceLocation.length-3];
                      OrderStor.order.currRegionName = deviceLocation[deviceLocation.length-2];
                      OrderStor.order.currCountryName = deviceLocation[deviceLocation.length-1];
                      OrderStor.order.currClimaticZone = 7; //TODO
                      OrderStor.order.currHeatTransfer = 0.99; //TODO
                      OrderStor.order.currFullLocation = deviceLocation[deviceLocation.length-3] + ', ' + deviceLocation[deviceLocation.length-2] + ', ' + deviceLocation[deviceLocation.length-1];

                  }).
                  error(function(data, status, headers, config) {
                      alert(status);
                  });
          }
          function errorLocation(error) {
              alert(error.message);
          }
      }



    function setLanguageVoiceHelper() {
      var langLabel = 'ru_RU';

//      switch (UserStor.userInfo.langLabel) {
//        //case 'ua': langLabel = 'ukr-UKR';
//        case 'ua': langLabel = 'ru_RU';
//        break;
//        case 'ru': langLabel = 'ru_RU';
//        break;
//        case 'en': langLabel = 'en_US';
//        break;
//        case 'de': langLabel = 'de_DE';
//        break;
//        case 'ro': langLabel = 'ro_RO';
//        break;
//      }
      return langLabel;
    }



  }
})();

