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
        //TODO тянутся с server
        discount: 10, //discount_construct_default
        discountAddElem: 10, //discount_addelem_default
        discountMax: 50, //discount_construct_max
        discountAddElemMax: 50 //discount_addelem_max
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
