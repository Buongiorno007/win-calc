(function () {
  'use strict';
  /**@ngInject*/
  angular
    .module('BauVoiceApp')
    .factory('UserStor',

      function () {
        /*jshint validthis:true */
        var thisFactory = this;

        function setDefaultUser() {
          return angular.copy(thisFactory.publicObj.userInfoSource);
        }

        function restoreUser(data) {
          return angular.copy(JSON.parse(LZString.decompress(data)));
        }

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
            discAddElemByWeek: [],
            factoryLink: ''
          },
          setDefaultUser: setDefaultUser,
          restoreUser: restoreUser
        };


        var data = localStorage.getItem("UserStor");
        if (data) {
          thisFactory.publicObj.userInfo = restoreUser(data);
        } else {
          thisFactory.publicObj.userInfo = setDefaultUser();
        }

        return thisFactory.publicObj;


      });
})();
