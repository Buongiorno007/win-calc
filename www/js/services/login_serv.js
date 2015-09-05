
// services/login_serv.js

(function(){
  'use strict';
    /**
     * @ngInject
     */
  angular
    .module('LoginModule')
    .factory('loginServ', startFactory);

  function startFactory($q, $cordovaGlobalization, $translate, localDB, globalConstants, GeneralServ, OrderStor, UserStor) {

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
      $cordovaGlobalization.getPreferredLanguage().then(
        function(result) {
          checkLangDictionary(result.value.split('-')[0]);
          $translate.use(UserStor.userInfo.langLabel);
        },
        function(error) {
          console.log('No language defined');
        });
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
          localDB.selectLocalDB(localDB.tablesLocalDB.user.tableName).then(function(user) {
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
//      localDB.selectLocalDB(localDB.tablesLocalDB.user.tableName).then(function(data) {
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
          cityIds = location.map(function(loc) {
            if(loc.countryId === UserStor.userInfo.countryId) {
              return loc.cityId;
            }
          });
      defer.resolve(cityIds.join(','));
      return defer.promise;
    }


    //--------- set user location
    function setUserLocation(locations, cityId) {
      var locationQty = locations.length;
      for(var loc = 0; loc < locationQty; loc++) {
        if(locations[loc].cityId === cityId) {
          UserStor.userInfo.cityName = locations[loc].cityName;
          UserStor.userInfo.regionName = locations[loc].regionName;
          UserStor.userInfo.climaticZone = locations[loc].climaticZone;
          UserStor.userInfo.heatTransfer = locations[loc].heatTransfer;
          UserStor.userInfo.countryName = locations[loc].countryName;
          UserStor.userInfo.countryId = locations[loc].countryId;
          UserStor.userInfo.fullLocation = locations[loc].fullLocation;
          //------ set current GeoLocation
          setUserGeoLocation(cityId, locations[loc].cityName, locations[loc].regionName, locations[loc].countryName, locations[loc].climaticZone, locations[loc].heatTransfer, locations[loc].fullLocation);
        }
      }
    }

    //--------- set current user geolocation
    function setUserGeoLocation(cityId, cityName, regionName, countryName, climatic, heat, fullLocation) {
      OrderStor.order.currCityId = cityId;
      OrderStor.order.customer_city = cityName;
      OrderStor.order.currRegionName = regionName;
      OrderStor.order.currCountryName = countryName;
      OrderStor.order.climatic_zone = climatic;
      OrderStor.order.heat_coef_min = heat;
      OrderStor.order.currFullLocation = fullLocation;
    }


    function setCurrency() {
      var defer = $q.defer();
      localDB.selectLocalDB(localDB.tablesLocalDB.currencies.tableName, {'is_base': 1}).then(function(data) {
        if(data.length) {
          UserStor.userInfo.currencyId = data[0].id;
          switch(data[0].name) {
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
          defer.resolve(1);
        } else {
          defer.resolve(0);
        }
      });
      return defer.promise;
    }


    function setUserDiscounts() {
      var defer = $q.defer();
      localDB.selectLocalDB(localDB.tablesLocalDB.users_discounts.tableName).then(function(data) {
        if(data.length) {
//          console.log('DISCTOUN=====', data);
          UserStor.userInfo.discountConstr = data[0].default_construct;
          UserStor.userInfo.discountAddElem = data[0].default_add_elem;
          UserStor.userInfo.discountConstrMax = data[0].max_construct;
          UserStor.userInfo.discountAddElemMax = data[0].max_add_elem;
          defer.resolve(1);
        } else {
          defer.resolve(0);
        }
      });
      return defer.promise;
    }


  }
})();

