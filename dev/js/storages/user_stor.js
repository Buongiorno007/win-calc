(function () {
    'use strict';
    /**@ngInject*/
    angular
        .module('BauVoiceApp')
        .factory('UserStor',

            function (globalConstants) {
                /*jshint validthis:true */
                var thisFactory = this;

                function setDefaultUser() {
                    return angular.copy(thisFactory.publicObj.userInfoSource);
                }

                var browserLang = navigator.language,
                    name;
                var label = browserLang.substr(0, 2);
                switch (label) {
                    case 'uk':
                        name = 'Українська'
                        break;
                    case 'ru':
                        name = 'Русский'
                        break;
                    case 'en':
                        name = 'English'
                        break;
                    case 'de':
                        name = 'Deutsch'
                        break;
                    case 'ro':
                        name = 'Român'
                        break;
                    case 'it':
                        name = 'Italiano'
                        break;
                    case 'pl':
                        name = 'Polski'
                        break;
                    case 'bg':
                        name = 'Български'
                        break;
                }
                thisFactory.publicObj = {
                    userInfoSource: {
                        cityName: '',
                        regionName: '',
                        countryName: '',
                        fullLocation: '',
                        climatic_zone: 0,
                        heat_transfer: 0,
                        langLabel: label || 'ru',
                        langName: name,
                        currencLabel: label,
                        currencyName: name,
                        currencyId: 0,
                        currency: '',
                        currencies: '₴',
                        discountConstr: 0,
                        discountAddElem: 0,
                        discountConstrMax: 0,
                        discountAddElemMax: 0,
                        discConstrByWeek: [],
                        discAddElemByWeek: [],
                        factoryLink: ''
                    },
                    setDefaultUser: setDefaultUser
                };

                thisFactory.publicObj.userInfo = setDefaultUser();

                return thisFactory.publicObj;


            });
})();
