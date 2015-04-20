(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('SettingsModule')
    .controller('LocationCtrl', locationCtrl);

  function locationCtrl($scope, globalDB, localStorage, loginServ, UserStor) {


    $scope.global = localStorage.storage;
    //var generalLocations = [];

    //------ get all countries, regions and cities
    loginServ.prepareLocationToUse().then(function(data) {
      $scope.locations = data.mergerLocation;
    });

    //----- current user location
    $scope.userNewLocation = angular.copy(UserStor.userInfo.currFullLocation);

    //-------- Select City
    $scope.selectCity = function(locationId) {
      for(var j = 0; j < $scope.locations.length; j++) {
        if($scope.locations[j].cityId === locationId) {
          $scope.userNewLocation = $scope.locations[j].fullLocation;
          //----- if user settings changing
          if($scope.global.isOpenSettingsPage) {
            UserStor.userInfo.fullLocation = $scope.userNewLocation;
            UserStor.userInfo.city_id = locationId;
            UserStor.userInfo.cityName = $scope.locations[j].cityName;
            UserStor.userInfo.regionName = $scope.locations[j].regionName;
            UserStor.userInfo.countryName = $scope.locations[j].countryName;
            UserStor.userInfo.climaticZone = $scope.locations[j].climaticZone;
            UserStor.userInfo.heatTransfer = $scope.locations[j].heatTransfer;
            //----- save new City Id in Global DB
            globalDB.updateDBGlobal(globalDB.usersTableDBGlobal, {"city_id": locationId}, {"id": UserStor.userInfo.id});
          //-------- if current geolocation changing
          } else {
            //----- build new currentGeoLocation
            UserStor.userInfo.currCityId = locationId;
            UserStor.userInfo.currCityName = $scope.locations[j].cityName;
            UserStor.userInfo.currRegionName = $scope.locations[j].regionName;
            UserStor.userInfo.currCountryName = $scope.locations[j].countryName;
            UserStor.userInfo.currClimaticZone = $scope.locations[j].climaticZone;
            UserStor.userInfo.currHeatTransfer = $scope.locations[j].heatTransfer;
            UserStor.userInfo.currFullLocation = $scope.userNewLocation;
          }
          $scope.global.startProgramm = false;
          closeLocationPage();
        }
      }

    };
    //-------- close Location Page
    $scope.cancelLocationPage = function() {
      closeLocationPage()
    };

    function closeLocationPage() {
      if($scope.global.isOpenSettingsPage) {
        $scope.global.gotoSettingsPage();
      } else {
        $scope.global.showNavMenu = true;
        $scope.global.isConfigMenu = false;
        $scope.global.showPanels = {};
        $scope.global.gotoMainPage();
      }
    }


  }
})();