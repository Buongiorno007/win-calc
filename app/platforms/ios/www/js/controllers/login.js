(function(){
  'use strict';

  angular
    .module('LoginModule')
    .controller('LoginCtrl', loginPageCtrl);

  loginPageCtrl.$inject = ['$location', 'globalDB', 'localDB', '$cordovaGlobalization', '$cordovaProgress', 'localStorage', '$translate', '$q'];

  function loginPageCtrl($location, globalDB, localDB, $cordovaGlobalization, $cordovaProgress, localStorage, $translate, $q) {

    var startTime = new Date();
    console.log('startTime', startTime);
    $cordovaProgress.showSimple(true);
    var thisCtrl = this;

    thisCtrl.isRegistration = false;
    thisCtrl.submitted = false;
    thisCtrl.isUserExist = false;
    thisCtrl.isSendEmail = false;
    thisCtrl.user = {};
    thisCtrl.regPhone = /^\d+$/;
    thisCtrl.regName = /^[a-zA-Z]+$/;

    //------ clicking
    thisCtrl.switchRegistration = switchRegistration;
    thisCtrl.enterForm = enterForm;
    thisCtrl.registrForm = registrForm;
    thisCtrl.selectLocation = selectLocation;



    //------- defined system language
    $cordovaGlobalization.getPreferredLanguage().then(
      function(result) {
        checkLangDictionary(result.value.split('-')[0]);
        $translate.use(localStorage.userInfo.langLabel);
      },
      function(error) {
        console.log('No language defined');
      });


    //------ import Location Data & All Users
    globalDB.clearLocation(function(result){}).then(function() {
      globalDB.importLocation(function(result){}).then(function() {
        //------ save Location Data in local obj
        prepareLocationToUse().then(function(data) {
          thisCtrl.generalLocations = data;
          console.log('data = ', thisCtrl.generalLocations);
          var endTime = new Date();
          console.log('endTime', endTime);
          $cordovaProgress.hide();
        });
      });
    });



    //============ methods ================//

    function switchRegistration() {
      thisCtrl.user = {};
      thisCtrl.isRegistration = !thisCtrl.isRegistration;
    }

    //-------- user sign in
    function enterForm(form) {
      // Trigger validation flag.
      thisCtrl.submitted = true;
      if (form.$valid) {
        //---- checking fist user enter
        globalDB.ifUserExist('0974391208', function(result){
          console.log(result);
        });

        //$location.path('/main');
      }
    }

    //-------- user registration
    function registrForm(form) {
      // Trigger validation flag.
      thisCtrl.submitted = true;
      if (form.$valid) {
        console.log(thisCtrl.user);
        //--- checking user in server
        globalDB.ifUserExist(thisCtrl.user.phone, function(result){
          console.log(result);
          if(!result.status) {
            //--- create new user
            globalDB.createUser(thisCtrl.user.phone, {"name":thisCtrl.user.name, "phone":thisCtrl.user.phone, "cityId":thisCtrl.user.city.id, "email":thisCtrl.user.mail}, function(result){
              console.log(result);
              if(result.status) {
                //-------- sent confirmed email
                thisCtrl.isSendEmail = true;
                //-------- save user in localDB
                globalDB.importUser(result.userId, result.access_token, function(result){
                  console.log(result);
                  if(result.status) {
                    //-------- save user in localDB
                  } else {

                  }

                });
              } else {
                console.log('some problem dureing user creating');
              }

            });
          } else {
            //---- show attantion
            thisCtrl.isUserExist = true;
          }
        });
      }
    }

    //------ compare device language with existing dictionary, if not exist set default language = English
    function checkLangDictionary(label) {
      var langQty = localStorage.languages.length;
      while(--langQty > -1) {
        if(localStorage.languages[langQty].label === label) {
          localStorage.userInfo.langLabel = label;
        }
      }
      //---- set English if not exist dictionary
      if(!localStorage.userInfo.langLabel) {
        localStorage.userInfo.langLabel = 'en';
      }
    }

    //------- collecting cities, regions and countries in one object for registration form
    function prepareLocationToUse() {
      var deferred = $q.defer(),
          generalLocations = {
            countries: [],
            regions: [],
            cities: [],
            mergerLocation: []
          };

      //---- get all counties
      localDB.selectAllDBGlobal(localStorage.countriesTableDBGlobal, function (results) {
        if (results.status) {
          var countryQty = results.data.length;
          while(--countryQty > -1) {
            var tempCountry = {
              id: results.data[countryQty].id,
              name: results.data[countryQty].name
            };
            generalLocations.countries.push(tempCountry);
          }

          //--------- get all regions
          localDB.selectAllDBGlobal(localStorage.regionsTableDBGlobal, function (results) {
            if (results.status) {
              var regionQty = results.data.length;
              while(--regionQty > -1) {
                var tempRegion = {
                  id: results.data[regionQty].id,
                  countryId: results.data[regionQty].country_id,
                  name: results.data[regionQty].name
                };
                generalLocations.regions.push(tempRegion);
              }

              //--------- get all cities
              localDB.selectAllDBGlobal(localStorage.citiesTableDBGlobal, function (results) {
                if (results.status) {
                  var cityQty = results.data.length;
                  while(--cityQty > -1) {
                    var tempCity = {
                      id: results.data[cityQty].id,
                      regionId: results.data[cityQty].region_id,
                      name: results.data[cityQty].name
                    };
                    generalLocations.cities.push(tempCity);
                  }

                  for(var c = 0; c < generalLocations.cities.length; c++) {
                    var location = {};
                    location.cityId = generalLocations.cities[c].id;
                    location.cityName = generalLocations.cities[c].name;
                    for(var r = 0; r < generalLocations.regions.length; r++) {
                      if(generalLocations.cities[c].region_id === generalLocations.regions[r].id) {
                        location.regionName = generalLocations.regions[r].name;
                        location.climaticZone = generalLocations.regions[r].climatic_zone;
                        location.heatTransfer = generalLocations.regions[r].heat_transfer;
                        for(var s = 0; s < generalLocations.countries.length; s++) {
                          if(generalLocations.regions[r].country_id === generalLocations.countries[s].id) {
                            location.countryName = generalLocations.countries[s].name;
                            generalLocations.mergerLocation.push(location);
                          }
                        }
                      }
                    }
                  }
                  deferred.resolve(generalLocations);
                } else {
                  deferred.reject(results);
                }
              });


            } else {
              console.log(results);
            }
          });


        } else {
          console.log(results);
        }
      });

      return deferred.promise;
    }

    //--------- if was empty option selected in select after choosing
    function selectLocation() {
      if(!thisCtrl.user.country) {
        delete thisCtrl.user.region;
        delete thisCtrl.user.city;
      } else if(!thisCtrl.user.region) {
        delete thisCtrl.user.city;
      }
    }

  }
})();