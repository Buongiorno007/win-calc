
// storages/user_stor.js

(function(){
  'use strict';
    /**
     * @ngInject
     */
  angular
    .module('BauVoiceApp')
    .factory('UserStor', userStorageFactory);

  function userStorageFactory() {

    var thisFactory = this;

    thisFactory.publicObj = {
      userInfoSource: {
        cityName: '',
        regionName: '',
        countryName: '',
        fullLocation: '',
        climaticZone: 0,
        heatTransfer: 0,
        langLabel: 'en',
        langName: 'English',
        currencyId: 0,
        currency: '',
        discountConstr: 0,
        discountAddElem: 0,
        discountConstrMax: 0,
        discountAddElemMax: 0,
        discConstrByWeek: [],
        discAddElemByWeek: []
      },
      setDefaultUser: setDefaultUser
    };

    thisFactory.publicObj.userInfo = setDefaultUser();

    return thisFactory.publicObj;


    //============ methods ================//

    function setDefaultUser() {
      var publicObj = angular.copy(thisFactory.publicObj.userInfoSource);
      return publicObj;
    }

  }
})();

