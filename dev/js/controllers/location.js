(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('SettingsModule')
    .controller('LocationCtrl',

  function(localDB, loginServ, SettingServ, GlobalStor, OrderStor, UserStor) {
    /*jshint validthis:true */
    var thisCtrl = this;

    //----- current user location
    thisCtrl.userNewLocation = angular.copy(OrderStor.order.customer_location);


    //SettingServ.downloadLocations().then(function(data) {
    //  thisCtrl.locations = data;
    //});
    /** база городов и регионов долны быть только одной страны завода */
    thisCtrl.locations = GlobalStor.global.locations.cities.filter(function(item) {
      return item.countryId === UserStor.userInfo.countryId;
    });




    /**============ METHODS ================*/

    //-------- Select City
    function selectCity(location) {
      thisCtrl.userNewLocation = location.fullLocation;

      //----- if user settings changing
      if(GlobalStor.global.currOpenPage === 'settings') {
        UserStor.userInfo.city_id = location.cityId;
        UserStor.userInfo.cityName = location.cityName;
        UserStor.userInfo.countryId = location.countryId;
        //UserStor.userInfo.countryName = location.countryName;
        UserStor.userInfo.fullLocation = location.fullLocation;
        UserStor.userInfo.climaticZone = location.climaticZone;
        UserStor.userInfo.heatTransfer = location.heatTransfer;
        //----- save new City Id in LocalDB & Server
        //----- update password in LocalDB & Server
        localDB.updateLocalServerDBs(
          localDB.tablesLocalDB.users.tableName, UserStor.userInfo.id, {'city_id': location.cityId}
        );

        //-------- if current geolocation changing
      } else if(GlobalStor.global.currOpenPage === 'main'){
        //----- build new currentGeoLocation
        loginServ.setUserGeoLocation(
          location.cityId, location.cityName, location.climaticZone, location.heatTransfer, location.fullLocation
        );
      }
      GlobalStor.global.startProgramm = false;
      SettingServ.closeLocationPage();
    }



    /**========== FINISH ==========*/

    //------ clicking
    thisCtrl.closeLocationPage = SettingServ.closeLocationPage;
    thisCtrl.selectCity = selectCity;


  });
})();