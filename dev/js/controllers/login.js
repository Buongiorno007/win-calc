(function(){
  'use strict';

  /**
   * @ngInject
   */

  angular
    .module('LoginModule')
    .controller('LoginCtrl', loginPageCtrl);

  function loginPageCtrl($scope, $location, $q, $translate, $cordovaGlobalization, $cordovaProgress, globalDB, localStorage) {

    var startTime = new Date();
    console.log('startTime', startTime);
    //$cordovaProgress.showSimple(true);
    var thisCtrl = this;

    localStorage.userInfo = angular.copy(localStorage.userInfoSource);

    thisCtrl.isRegistration = false;
    thisCtrl.submitted = false;
    thisCtrl.isUserExist = false;
    thisCtrl.isUserNotExist = false;
    thisCtrl.isSendEmail = false;
    thisCtrl.isUserNotActive = false;
    thisCtrl.isFactoryId = false;
    thisCtrl.isFactoryNotSelect = false;
    thisCtrl.user = {};
    thisCtrl.factories;
    thisCtrl.regPhone = /^\d+$/;
    thisCtrl.regName = /^[a-zA-Z]+$/;
    thisCtrl.regMail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

    //------ clicking
    thisCtrl.switchRegistration = switchRegistration;
    thisCtrl.enterForm = enterForm;
    thisCtrl.registrForm = registrForm;
    thisCtrl.selectLocation = selectLocation;
    thisCtrl.selectFactory = selectFactory;
    thisCtrl.closeFactoryDialog = closeFactoryDialog;


    //------- defined system language
    /*
     $cordovaGlobalization.getPreferredLanguage().then(
       function(result) {
         checkLangDictionary(result.value.split('-')[0]);
         $translate.use(localStorage.userInfo.langLabel);
       },
       function(error) {
        console.log('No language defined');
       });

     */
    localStorage.userInfo.langLabel = 'en';
    $translate.use(localStorage.userInfo.langLabel);



/*
      //--- get device code
    globalDB.getDeviceCodeLocalDb(function(result){
      thisCtrl.deviceCode = result.data.deviceCode;
    });
*/

    //------ import Location Data & All Users
    globalDB.clearLocation(function(result){}).then(function() {
      globalDB.importLocation(function(result){}).then(function() {
        //------ save Location Data in local obj
        prepareLocationToUse().then(function(data) {
          thisCtrl.generalLocations = data;
          console.log('data = ', thisCtrl.generalLocations);
          var endTime = new Date();
          console.log('endTime', endTime);
          //$cordovaProgress.hide();
        });
      });
    });




/*
    //---- import global DB
    globalDB.initApp(function(result){}).then(function(data) {
      console.log('!!!!!!==', data);
      thisCtrl.isCodeCheckingSuccess = true;
    });
    //globalDB.clearDb(function(result){});
    globalDB.syncDb(function(result){});
*/



    //============ methods ================//

    function switchRegistration() {
      thisCtrl.user = {};
      thisCtrl.isRegistration = !thisCtrl.isRegistration;
      //angular.element('#first_input').focus();
    }

    //-------- user sign in
    function enterForm(form) {
      // Trigger validation flag.
      thisCtrl.submitted = true;
      if (form.$valid) {
        console.log('user 1 = ', localStorage.userInfo);
        //---- checking user in GlobalDB
        //globalDB.selectDBGlobal(globalDB.usersTableDBGlobal, {'phone': {"value": thisCtrl.user.phone, "union": 'AND'}, "password": thisCtrl.user.password}, function (results) {
        globalDB.selectDBGlobal(globalDB.usersTableDBGlobal, {'phone': thisCtrl.user.phone}, function (results) {
          console.log('chek = ', results);
          //---- user exists
          if (results.status) {
            angular.extend(localStorage.userInfo, results.data[0]);
            console.log('user 2 = ', localStorage.userInfo);
            //----- checking user activation
            globalDB.ifUserExist(thisCtrl.user.phone, function(result){
              console.log(result);
              //---- user activated
              if(result.activation) {
                //----- update locked in user of GlobalDB
                globalDB.updateDBGlobal(globalDB.usersTableDBGlobal, {'locked': 1}, {'phone': thisCtrl.user.phone});
                //----- checking FactoryId
                if(result.factory) {


                  //------- checking if GlobalDB matches to user FactoryId
                  globalDB.selectAllDBGlobal(globalDB.deviceTableDBGlobal, function (result) {
                    if (result.status) {
                      var currFactoryId = result.data[0].device_code;

                      if(currFactoryId == localStorage.userInfo.factory_id) {
                        //------- current FactoryId matches to user FactoryId, go to main page without importDB
                        //$cordovaProgress.showSimple(true);
                        console.log('!!!!!!!!!!!!!!sync');
                        globalDB.syncDb(localStorage.userInfo.phone, localStorage.userInfo.device_code, function(result){}).then(function(result) {
                          //$cordovaProgress.hide();
                          console.log('!!!!!!!!!!!!!!sync', result);
                          //$scope.$apply();
                          $location.path('/main');
                        });
                      } else {
                        //-------- current FactoryId NOT matches to user FactoryId, update FactoryId & importDB
                        //$cordovaProgress.showSimple(true);
                        globalDB.clearDb(function(result){}).then(function() {
                          globalDB.importDb(localStorage.userInfo.phone, localStorage.userInfo.factory_id, localStorage.userInfo.device_code, function(result){}).then(function() {
                            //$cordovaProgress.hide();
                            $location.path('/main');
                          });
                        });
                      }
                    } else {
                      //------ GlobalDB is ampty
                      console.log('GlobalDB is ampty');
                      //$cordovaProgress.showSimple(true);
                      globalDB.clearDb(function(result){}).then(function() {
                        globalDB.importDb(localStorage.userInfo.phone, localStorage.userInfo.factory_id, localStorage.userInfo.device_code, function(result){}).then(function() {
                          //$cordovaProgress.hide();
                          $location.path('/main');
                        });
                      });
                    }
                  });


                } else {
                  //---- show Factory List
                  globalDB.getFactories(localStorage.userInfo.city_id, function(result){
                    console.log(result);
                    if(result.status) {
                      thisCtrl.factories = result.data;
                      thisCtrl.isFactoryId = true;
                    } else {
                      console.log('can not get factories!');
                    }
                  });
                }
              } else {
                //---- show attantion
                thisCtrl.isUserNotActive = true;
              }
            });

          } else {
            //---- user not exists
            thisCtrl.isUserNotExist = true;
          }

        });

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
                switchRegistration();
                //-------- save new user in localDB
                globalDB.importUser(result.userId, result.access_token, function(result){
                  console.log(result);
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
      globalDB.selectAllDBGlobal(globalDB.countriesTableDBGlobal, function (results) {
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
          globalDB.selectAllDBGlobal(globalDB.regionsTableDBGlobal, function (results) {
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
              globalDB.selectAllDBGlobal(globalDB.citiesTableDBGlobal, function (results) {
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


    function selectFactory() {
      console.log('factoryId = ', thisCtrl.user.factoryId);
      console.log('userInfo = ', localStorage.userInfo);
      if(thisCtrl.user.factoryId > 0) {
        //-------- send selected Factory Id in Server
        globalDB.setFactory(localStorage.userInfo.phone, thisCtrl.user.factoryId, localStorage.userInfo.device_code, function(result){
          console.log(result);
          if(result.status) {

            console.log('importStartTime', new Date());
            //-------- close Factory Dialog
            thisCtrl.isFactoryId = false;
            //$cordovaProgress.showSimple(true);
            globalDB.clearDb(function(result){}).then(function() {
              globalDB.importDb(localStorage.userInfo.phone, thisCtrl.user.factoryId, localStorage.userInfo.device_code, function(result){}).then(function() {
                //$cordovaProgress.hide();
                console.log('importFinishTime', new Date());
                $location.path('/main');
              });
            });

          } else {
            console.log('FactoryId not was sent!');
          }
        });
      } else {
        //---- show attantion if any factory was chosen
        thisCtrl.isFactoryNotSelect = true;
      }

    }

    function closeFactoryDialog() {
      thisCtrl.isFactoryNotSelect = false;
      thisCtrl.isFactoryId = false;
      delete thisCtrl.user.factoryId;
    }


  }
})();