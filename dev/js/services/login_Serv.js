(function(){
  'use strict';
    /**
     * @ngInject
     */
  angular
    .module('LoginModule')
    .factory('loginServ', startFactory);

  function startFactory($q, globalDB, UserStor, localStorage) {

    var thisFactory = this;

    thisFactory.publicObj = {
      checkLangDictionary: checkLangDictionary,
      prepareLocationToUse: prepareLocationToUse,
      setUserLocation: setUserLocation
    };

    return thisFactory.publicObj;


    //============ methods ================//

    //------ compare device language with existing dictionary, if not exist set default language = English
    function checkLangDictionary(label) {
      var langQty = localStorage.storage.languages.length;
      while(--langQty > -1) {
        if(localStorage.storage.languages[langQty].label === label) {
          UserStor.userInfo.langLabel = label;
          UserStor.userInfo.langName = localStorage.storage.languages[langQty].name;
        }
      }
    }


    //------- collecting cities, regions and countries in one object for registration form
    function prepareLocationToUse() {
      //console.log('start:', new Date().getMilliseconds());
      var deferred = $q.defer(),
          generalLocations = {
            countries: [],
            regions: [],
            cities: [],
            mergerLocation: []
          },
          countryQty, regionQty, cityQty;


      //---- get all counties
      globalDB.selectAllDBGlobal(globalDB.countriesTableDBGlobal).then(function(results) {
        if(results) {
          countryQty = results.length;
          for (var stat = 0; stat < countryQty; stat++) {
            var tempCountry = {
              id: results[stat].id,
              name: results[stat].name,
              currency: results[stat].currency_id
            };
            generalLocations.countries.push(tempCountry);
          }
        } else {
          console.log('Error!!!', results);
        }
      }).then(function(){

        //--------- get all regions
        globalDB.selectAllDBGlobal(globalDB.regionsTableDBGlobal).then(function(results) {
          if(results) {
            regionQty = results.length;
            for (var reg = 0; reg < regionQty; reg++) {
              var tempRegion = {
                id: results[reg].id,
                countryId: results[reg].country_id,
                name: results[reg].name,
                climaticZone: results[reg].climatic_zone,
                heatTransfer: results[reg].heat_transfer
              };
              generalLocations.regions.push(tempRegion);
            }
          } else {
            console.log('Error!!!', results);
          }

        }).then(function() {

          //--------- get all cities
          globalDB.selectAllDBGlobal(globalDB.citiesTableDBGlobal).then(function(results) {
            if(results) {
              cityQty = results.length;
              for(var cit = 0; cit < cityQty; cit++) {
                var tempCity = {
                  id: results[cit].id,
                  regionId: results[cit].region_id,
                  name: results[cit].name
                };
                generalLocations.cities.push(tempCity);

                var location = {
                  cityId: results[cit].id,
                  cityName: results[cit].name
                };
                for(var r = 0; r < regionQty; r++) {
                  if(results[cit].region_id === generalLocations.regions[r].id) {
                    location.regionName = generalLocations.regions[r].name;
                    location.climaticZone = generalLocations.regions[r].climaticZone;
                    location.heatTransfer = generalLocations.regions[r].heatTransfer;
                    for(var s = 0; s < countryQty; s++) {
                      if(generalLocations.regions[r].countryId === generalLocations.countries[s].id) {
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
              //console.log('finish:', new Date().getMilliseconds());
              //console.log('generalLocations ==== ', generalLocations);
            } else {
              deferred.reject(results);
            }
          });

        });
      });
      return deferred.promise;
    }


    //--------- set current location for user
    function setUserLocation(locations, cityId) {
      var locationQty = locations.length;
      for(var loc = 0; loc < locationQty; loc++) {
        if(locations[loc].cityId === cityId) {
          UserStor.userInfo.cityName = locations[loc].cityName;
          UserStor.userInfo.regionName = locations[loc].regionName;
          UserStor.userInfo.climaticZone = locations[loc].climaticZone;
          UserStor.userInfo.heatTransfer = locations[loc].heatTransfer;
          UserStor.userInfo.countryName = locations[loc].countryName;
          UserStor.userInfo.currencyId = locations[loc].currencyId;
          UserStor.userInfo.fullLocation = locations[loc].fullLocation;

          //------ set current GeoLocation
          UserStor.userInfo.currCityId = cityId;
          UserStor.userInfo.currCityName = locations[loc].cityName;
          UserStor.userInfo.currRegionName = locations[loc].regionName;
          UserStor.userInfo.currCountryName = locations[loc].countryName;
          UserStor.userInfo.currClimaticZone = locations[loc].climaticZone;
          UserStor.userInfo.currHeatTransfer = locations[loc].heatTransfer;
          UserStor.userInfo.currFullLocation = locations[loc].fullLocation;
        }
      }
    }

  }
})();
