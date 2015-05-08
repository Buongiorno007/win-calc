
// controllers/location.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('SettingsModule')
    .controller('LocationCtrl', locationCtrl);

  function locationCtrl($scope, globalDB, loginServ, SettingServ, GlobalStor, OrderStor, UserStor) {

    var thisCtrl = this;
    thisCtrl.userInfo = UserStor.userInfo;

    //----- current user location
    thisCtrl.userNewLocation = angular.copy(OrderStor.order.currFullLocation);


    //------ get all regions and cities
    //TODO база городов и регионов долны быть только одной страны завода
    SettingServ.downloadLocations().then(function(data) {
      thisCtrl.locations = data;
    });


    //------ clicking
    thisCtrl.closeLocationPage = SettingServ.closeLocationPage;
    thisCtrl.selectCity = selectCity;


    //============ methods ================//

    //-------- Select City
    function selectCity(locationId) {
      var locationQty = thisCtrl.locations.length,
          j = 0;
      for(; j < locationQty; j++) {
        if(thisCtrl.locations[j].cityId === locationId) {
          thisCtrl.userNewLocation = thisCtrl.locations[j].fullLocation;
          //----- if user settings changing
          if(GlobalStor.global.currOpenPage === 'settings') {
            UserStor.userInfo.fullLocation = thisCtrl.userNewLocation;
            UserStor.userInfo.city_id = locationId;
            UserStor.userInfo.cityName = thisCtrl.locations[j].cityName;
            UserStor.userInfo.regionName = thisCtrl.locations[j].regionName;
            UserStor.userInfo.countryName = thisCtrl.locations[j].countryName;
            UserStor.userInfo.climaticZone = thisCtrl.locations[j].climaticZone;
            UserStor.userInfo.heatTransfer = thisCtrl.locations[j].heatTransfer;
            //----- save new City Id in Global DB
            globalDB.updateDBGlobal(globalDB.usersTableDBGlobal, {"city_id": locationId}, {"id": UserStor.userInfo.id});
          //-------- if current geolocation changing
          } else if(GlobalStor.global.currOpenPage === 'main'){
            //----- build new currentGeoLocation
            OrderStor.order.currCityId = locationId;
            OrderStor.order.currCityName = thisCtrl.locations[j].cityName;
            OrderStor.order.currRegionName = thisCtrl.locations[j].regionName;
            OrderStor.order.currCountryName = thisCtrl.locations[j].countryName;
            OrderStor.order.currClimaticZone = thisCtrl.locations[j].climaticZone;
            OrderStor.order.currHeatTransfer = thisCtrl.locations[j].heatTransfer;
            OrderStor.order.currFullLocation = thisCtrl.userNewLocation;
          }
          GlobalStor.global.startProgramm = false;
          SettingServ.closeLocationPage();
        }
      }
    }




  }
})();
