(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('SettingsModule')
    .controller('LocationCtrl',

  function(
    localDB,
    GeneralServ,
    loginServ,
    SettingServ,
    MainServ,
    GlobalStor,
    OrderStor,
    UserStor
  ) {
    /*jshint validthis:true */
    var thisCtrl = this;

    //----- current user location
    thisCtrl.userNewLocation = angular.copy(OrderStor.order.customer_location);


    //SettingServ.downloadLocations().then(function(data) {
    //  thisCtrl.locations = data;
    //});
    /** база городов и регионов долны быть только одной страны завода */
    thisCtrl.locations = GlobalStor.global.locations.cities.filter(function(item) {
      return item.country_id === UserStor.userInfo.country_id;
    });




    /**============ METHODS ================*/

    //-------- Select City
    function selectCity(location) {
      thisCtrl.userNewLocation = location.fullLocation;
      

      //----- change heat_transfer
      if (UserStor.userInfo.therm_coeff_id) {
        UserStor.userInfo.heat_transfer = GeneralServ.roundingValue( 1/location.heat_transfer );
      } else {
        UserStor.userInfo.heat_transfer = location.heat_transfer;
      }

      //----- if user settings changing
      if(GlobalStor.global.currOpenPage === 'settings') {
        UserStor.userInfo.city_id = location.cityId;
        UserStor.userInfo.cityName = location.cityName;
        UserStor.userInfo.country_id = location.country_id;
        //UserStor.userInfo.countryName = location.countryName;
        UserStor.userInfo.fullLocation = location.fullLocation;
        UserStor.userInfo.climatic_zone = location.climatic_zone;
        //UserStor.userInfo.heat_transfer = location.heat_transfer;
        //----- save new City Id in LocalDB & Server
        //----- update password in LocalDB & Server
        localDB.updateLocalServerDBs(
          localDB.tablesLocalDB.users.tableName, UserStor.userInfo.id, {'city_id': location.cityId}
        );

        //-------- if current geolocation changing
      } else if(GlobalStor.global.currOpenPage === 'main'){
        //----- build new currentGeoLocation
        loginServ.setUserGeoLocation(
          location.cityId,
          location.cityName,
          location.climatic_zone,
          UserStor.userInfo.heat_transfer,
          location.fullLocation
        );
      }
      GlobalStor.global.startProgramm = false;
      SettingServ.closeLocationPage();
    }



    /**========== FINISH ==========*/

    //------ clicking
    thisCtrl.closeLocationPage = SettingServ.closeLocationPage;
    thisCtrl.selectCity = selectCity;
    $("#main-frame").removeClass("main-frame-mobView");
    $("#app-container").removeClass("app-container-mobView");
    $(window).load(function() {
      MainServ.resize();
    });
    window.onresize = function() {
      MainServ.resize();
    };

  });
})();