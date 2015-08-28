(function(){
  'use strict';
    /**
     * @ngInject
     */
  angular
    .module('LoginModule')
    .factory('loginServ', startFactory);

  function startFactory($q, $cordovaGlobalization, $translate, globalDB, globalConstants, GeneralServ, OrderStor, UserStor) {

    var thisFactory = this;

    thisFactory.publicObj = {
      getDeviceLanguage: getDeviceLanguage,
      isLocalDBExist: isLocalDBExist,
      prepareLocationToUse: prepareLocationToUse,
      collectCityIdsAsCountry: collectCityIdsAsCountry,
      setUserLocation: setUserLocation,
      setUserGeoLocation: setUserGeoLocation,
      setCurrency: setCurrency
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



    function isLocalDBExist() {
      var defer = $q.defer();
//      globalDB.selectLocalDB(globalDB.tablesLocalDB.user.tableName).then(function(data) {
      globalDB.selectLocalDB('sqlite_sequence').then(function(data) {
        console.log('data ===', data);
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
      globalDB.selectLocalDB(globalDB.tablesLocalDB.countries.tableName).then(function(data) {
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
        globalDB.selectLocalDB(globalDB.tablesLocalDB.regions.tableName).then(function(data) {
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
          globalDB.selectLocalDB(globalDB.tablesLocalDB.cities.tableName).then(function(data) {
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
      while(--locationQty > -1) {
        if(location[locationQty].countryId === UserStor.userInfo.countryId) {
          cityIds.push(location[locationQty].cityId);
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
          UserStor.userInfo.regionName = locations[loc].regionName;
          UserStor.userInfo.climaticZone = locations[loc].climaticZone;
          UserStor.userInfo.heatTransfer = locations[loc].heatTransfer;
          UserStor.userInfo.countryName = locations[loc].countryName;
          UserStor.userInfo.countryId = locations[loc].countryId;
          UserStor.userInfo.fullLocation = locations[loc].fullLocation;
          UserStor.userInfo.currencyId = locations[loc].currencyId;
          //------ set current GeoLocation
          setUserGeoLocation(cityId, locations[loc].cityName, locations[loc].regionName, locations[loc].countryName, locations[loc].climaticZone, locations[loc].heatTransfer, locations[loc].fullLocation);
        }
      }
    }

    //--------- set current user geolocation
    function setUserGeoLocation(cityId, cityName, regionName, countryName, climatic, heat, fullLocation) {
      OrderStor.order.currCityId = cityId;
      OrderStor.order.currCityName = cityName;
      OrderStor.order.currRegionName = regionName;
      OrderStor.order.currCountryName = countryName;
      OrderStor.order.currClimaticZone = climatic;
      OrderStor.order.currHeatTransfer = heat;
      OrderStor.order.currFullLocation = fullLocation;
    }

    function setCurrency() {
      var defer = $q.defer();
      globalDB.selectLocalDB(globalDB.tablesLocalDB.currencies.tableName, {'id':  UserStor.userInfo.currencyId}).then(function(data) {
//        console.log('setCurrency = ',result);
        if(data.length) {
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

  }
})();
