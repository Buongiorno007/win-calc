
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
            loginServ.setUserGeoLocation(locationId, thisCtrl.locations[j].cityName, thisCtrl.locations[j].regionName, thisCtrl.locations[j].countryName, thisCtrl.locations[j].climaticZone, thisCtrl.locations[j].heatTransfer, thisCtrl.userNewLocation);
          }
          GlobalStor.global.startProgramm = false;
          SettingServ.closeLocationPage();
        }
      }
    }




  }
})();
