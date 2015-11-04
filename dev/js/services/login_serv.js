(function(){
  'use strict';
    /**
     * @ngInject
     */
  angular
    .module('LoginModule')
    .factory('loginServ', startFactory);

  function startFactory($window, $q, $cordovaGlobalization, $translate, $filter, localDB, globalConstants, GeneralServ, GlobalStor, OrderStor, UserStor) {

    var thisFactory = this;

    thisFactory.publicObj = {
      getDeviceLanguage: getDeviceLanguage,
      initExport: initExport,
      isLocalDBExist: isLocalDBExist,
      prepareLocationToUse: prepareLocationToUse,
      collectCityIdsAsCountry: collectCityIdsAsCountry,
      setUserLocation: setUserLocation,
      setUserGeoLocation: setUserGeoLocation,
      setCurrency: setCurrency,
      setUserDiscounts: setUserDiscounts
    };

    return thisFactory.publicObj;


    //============ methods ================//


    //------- defined system language
    function getDeviceLanguage() {
//      console.log('USER: navigator++', $window.navigator);
//      console.log('USER: userAgent+++', $window.navigator.userAgent);
//      console.log('USER: platform', $window.navigator.platform);

      var browsers = {chrome: /chrome/i, safari: /safari/i, firefox: /firefox/i, ie: /internet explorer/i};
      var userAgent = $window.navigator.userAgent;
      var platform = 0;

      for(var key in browsers) {
        if (browsers[key].test(userAgent)) {
          platform++;
        }
      }

      /** if browser */
      if(platform) {
        var browserLang = navigator.language || navigator.userLanguage;
        console.info("The language is: " + browserLang);
        checkLangDictionary(browserLang.split('-')[0]);
        $translate.use(UserStor.userInfo.langLabel);
      } else {
        /** if Ipad */
        $cordovaGlobalization.getPreferredLanguage().then(
          function(result) {
            checkLangDictionary(result.value.split('-')[0]);
            $translate.use(UserStor.userInfo.langLabel);
          },
          function(error) {
            console.log('No language defined');
          });
      }
    }

    function detectmob() {
      if( navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)
        ){
        return true;
      }
      else {
        return false;
      }
    }

    //------ compare device language with existing dictionary, if not exist set default language = English
    function checkLangDictionary(label) {
      var langQty = globalConstants.languages.length;
      while(--langQty > -1) {
        if(globalConstants.languages[langQty].label === label) {
          UserStor.userInfo.langLabel = label;
          UserStor.userInfo.langName = globalConstants.languages[langQty].name;
        }
      }
    }




    function initExport() {
      var defer = $q.defer();
      console.log('EXPORT');
      //------- check Export Table
      localDB.selectLocalDB(localDB.tablesLocalDB.export.tableName).then(function(data) {
        //        console.log('data ===', data);
        if(data.length) {
          //----- get last user
          localDB.selectLocalDB(localDB.tablesLocalDB.users.tableName).then(function(user) {
            if(user.length) {
              localDB.updateServer(user[0].phone, user[0].device_code, data).then(function(result) {
                console.log('FINISH export',result);
                //----- if update Server is success, clean Export in LocalDB
                if(result) {
                  localDB.cleanLocalDB({export: 1});
                  defer.resolve(1);
                }
              });
            }
          });
        }
      });
      return defer.promise;
    }


    function isLocalDBExist() {
      var defer = $q.defer();
//      localDB.selectLocalDB(localDB.tablesLocalDB.users.tableName).then(function(data) {
      localDB.selectLocalDB('sqlite_sequence').then(function(data) {
//        console.log('data ===', data);
        if(data && data.length > 5) {
          defer.resolve(1);
        } else {
          defer.resolve(0);
        }
      });
      return defer.promise;
    }



    //------- collecting cities, regions and countries in one object for registration form
    function prepareLocationToUse() {
      var deferred = $q.defer(),
          generalLocations = {
            countries: [],
            regions: [],
            cities: [],
            mergerLocation: []
          },
          countryQty, regionQty, cityQty;
      //---- get all counties
      localDB.selectLocalDB(localDB.tablesLocalDB.countries.tableName).then(function(data) {
        countryQty = data.length;
        if(countryQty) {
          for (var stat = 0; stat < countryQty; stat++) {
            var tempCountry = {
              id: data[stat].id,
              name: data[stat].name,
              currency: data[stat].currency_id
            };
            generalLocations.countries.push(tempCountry);
          }
        } else {
          console.log('Error!!!', data);
        }
      }).then(function(){

        //--------- get all regions
        localDB.selectLocalDB(localDB.tablesLocalDB.regions.tableName).then(function(data) {
          regionQty = data.length;
          if(regionQty) {
            for (var reg = 0; reg < regionQty; reg++) {
              var tempRegion = {
                id: data[reg].id,
                countryId: data[reg].country_id,
                name: data[reg].name,
                climaticZone: data[reg].climatic_zone,
                heatTransfer: data[reg].heat_transfer
              };
              generalLocations.regions.push(tempRegion);
            }
          } else {
            console.log('Error!!!', data);
          }

        }).then(function() {

          //--------- get all cities
          localDB.selectLocalDB(localDB.tablesLocalDB.cities.tableName).then(function(data) {
            cityQty = data.length;
            if(cityQty) {
              for(var cit = 0; cit < cityQty; cit++) {
                var tempCity = {
                  id: data[cit].id,
                  regionId: data[cit].region_id,
                  name: data[cit].name
                };
                generalLocations.cities.push(tempCity);

                var location = {
                  cityId: data[cit].id,
                  cityName: data[cit].name
                };
                for(var r = 0; r < regionQty; r++) {
                  if(data[cit].region_id === generalLocations.regions[r].id) {
                    location.regionName = generalLocations.regions[r].name;
                    location.climaticZone = generalLocations.regions[r].climaticZone;
                    location.heatTransfer = GeneralServ.roundingNumbers(1/generalLocations.regions[r].heatTransfer);
                    for(var s = 0; s < countryQty; s++) {
                      if(generalLocations.regions[r].countryId === generalLocations.countries[s].id) {
                        location.countryId = generalLocations.countries[s].id;
                        location.countryName = generalLocations.countries[s].name;
                        location.currencyId = generalLocations.countries[s].currency;
                        location.fullLocation = '' + location.cityName + ', ' + location.regionName + ', ' + location.countryName;
                        generalLocations.mergerLocation.push(location);
                      }
                    }
                  }
                }

              }
              deferred.resolve(generalLocations);
            } else {
              deferred.reject(data);
            }
          });

        });
      });
      return deferred.promise;
    }


    function collectCityIdsAsCountry(location) {
      var defer = $q.defer(),
          locationQty = location.length,
          cityIds = [];
      for(var i = 0; i < locationQty; i++) {
        if(location[i].countryId === UserStor.userInfo.countryId) {
          cityIds.push(location[i].cityId);
        }
      }
      defer.resolve(cityIds.join(','));
      return defer.promise;
    }


    //--------- set user location
    function setUserLocation(locations, cityId) {
      var locationQty = locations.length;
      for(var loc = 0; loc < locationQty; loc++) {
        if(locations[loc].cityId === cityId) {
          UserStor.userInfo.cityName = locations[loc].cityName;
          UserStor.userInfo.climaticZone = locations[loc].climaticZone;
          UserStor.userInfo.heatTransfer = locations[loc].heatTransfer;
          UserStor.userInfo.countryName = locations[loc].countryName;
          UserStor.userInfo.countryId = locations[loc].countryId;
          UserStor.userInfo.fullLocation = locations[loc].fullLocation;
          //------ set current GeoLocation
          setUserGeoLocation(cityId, locations[loc].cityName, locations[loc].climaticZone, locations[loc].heatTransfer, locations[loc].fullLocation);
        }
      }
    }

    //--------- set current user geolocation
    function setUserGeoLocation(cityId, cityName, climatic, heat, fullLocation) {
      OrderStor.order.customer_city_id = cityId;
      OrderStor.order.customer_city = cityName;
      OrderStor.order.climatic_zone = climatic;
      OrderStor.order.heat_coef_min = heat;
      OrderStor.order.customer_location = fullLocation;
    }


    function setCurrency() {
      var defer = $q.defer();
      /** download All Currencies */
      localDB.selectLocalDB(localDB.tablesLocalDB.currencies.tableName, null, 'id, is_base, name, value').then(function(currencies) {
        var currencQty = currencies.length;
        if(currencies && currencQty) {
          GlobalStor.global.currencies = currencies;
//          console.warn('all currencies!!', currencies);
          /** set current currency */
          while(--currencQty > -1) {
            if(currencies[currencQty].is_base === 1) {
              UserStor.userInfo.currencyId = currencies[currencQty].id;
              switch(currencies[currencQty].name) {
                case 'uah':  UserStor.userInfo.currency = '₴';
                  break;
                case 'rub':  UserStor.userInfo.currency = '₽';
                  break;
                case 'usd':  UserStor.userInfo.currency = '$';
                  break;
                case 'eur':  UserStor.userInfo.currency = '€';
                  break;
                default:  UserStor.userInfo.currency = '₴';
                  break;
              }
            }
          }
          defer.resolve(1);
        } else {
          console.error('not find currencies!');
          defer.resolve(0);
        }
      });
      return defer.promise;
    }


    function setUserDiscounts() {
      var defer = $q.defer();
      //-------- add server url to avatar img
//      UserStor.userInfo.avatar = globalConstants.serverIP + UserStor.userInfo.avatar;
      UserStor.userInfo.avatar = UserStor.userInfo.avatar;

      localDB.selectLocalDB(localDB.tablesLocalDB.users_discounts.tableName).then(function(result) {
//        console.log('DISCTOUN=====', result);
        var discounts = angular.copy(result[0]);
        if(discounts) {
          UserStor.userInfo.discountConstr = discounts.default_construct*1;
          UserStor.userInfo.discountAddElem = discounts.default_add_elem*1;
          UserStor.userInfo.discountConstrMax = discounts.max_construct*1;
          UserStor.userInfo.discountAddElemMax = discounts.max_add_elem*1;

          var disKeys = Object.keys(discounts),
              disQty = disKeys.length;
          for(var dis = 0; dis < disQty; dis++) {
            if(disKeys[dis].indexOf('week')+1) {
              if(disKeys[dis].indexOf('construct')+1) {
                UserStor.userInfo.discConstrByWeek.push(discounts[disKeys[dis]]*1);
              } else if(disKeys[dis].indexOf('add_elem')+1) {
                UserStor.userInfo.discAddElemByWeek.push(discounts[disKeys[dis]]*1);
              }
            }
          }
          /** download price Margins of Plant */
          downloadPriceMargin().then(function(margins) {
            if(margins && margins.length) {
              GlobalStor.global.margins = angular.copy(margins[0]);
//              console.warn('Margins!!', margins);
              /** download delivery Coeff of Plant */
              downloadDeliveryCoeff().then(function(coeff){
                if(coeff && coeff.length) {
//                  console.warn('delivery Coeff!!', coeff);
                  GlobalStor.global.deliveryCoeff = angular.copy(coeff[0]);
                  GlobalStor.global.deliveryCoeff.percents = coeff[0].percents.split(',');
                  defer.resolve(1);
                } else {
                  console.error('not find options_discounts!');
                  defer.resolve(0);
                }
              });
            } else {
              console.error('not find options_coefficients!');
              defer.resolve(0);
            }
          });
        } else {
          console.error('not find users_discounts!');
          defer.resolve(0);
        }
      });
      return defer.promise;
    }



    /** price Margins of Plant */
    function downloadPriceMargin() {
      return localDB.selectLocalDB(localDB.tablesLocalDB.options_coefficients.tableName, null, 'margin, coeff').then(function(margins) {
        return margins;
      });
    }

    /** delivery Coeff of Plant */
    function downloadDeliveryCoeff() {
      return localDB.selectLocalDB(localDB.tablesLocalDB.options_discounts.tableName).then(function(coeff) {
        return coeff;
      });
    }

  }
})();
