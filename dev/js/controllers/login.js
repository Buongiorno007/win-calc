(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('LoginModule')
    .controller('LoginCtrl', loginPageCtrl);

  function loginPageCtrl($location, $cordovaNetwork, globalConstants, globalDB, loginServ, GlobalStor, UserStor) {

    var thisCtrl = this;
    thisCtrl.isOnline = 1;
    thisCtrl.isOffline = 0;
    thisCtrl.isLocalDB = 0;
    thisCtrl.isRegistration = 0;
    thisCtrl.generalLocations = {};
    thisCtrl.submitted = 0;
    thisCtrl.isUserExist = 0;
    thisCtrl.isUserNotExist = 0;
    thisCtrl.isUserPasswordError = 0;
    thisCtrl.isSendEmail = 0;
    thisCtrl.isUserNotActive = 0;
    thisCtrl.isFactoryId = 0;
    thisCtrl.isFactoryNotSelect = 0;
    thisCtrl.isStartImport = 0;
    thisCtrl.user = {};
    thisCtrl.factories;
    thisCtrl.regPhone = globalConstants.REG_PHONE;
    thisCtrl.regName = globalConstants.REG_NAME;
    thisCtrl.regMail = globalConstants.REG_MAIL;

    //------ clicking
    thisCtrl.switchRegistration = switchRegistration;
    thisCtrl.closeRegistration = closeRegistration;
    thisCtrl.enterForm = enterForm;
    thisCtrl.registrForm = registrForm;
    thisCtrl.selectLocation = selectLocation;
    thisCtrl.selectFactory = selectFactory;
    thisCtrl.closeFactoryDialog = closeFactoryDialog;
    thisCtrl.closeOfflineAlert = closeOfflineAlert;



    //------- defined system language
    //TODO loginServ.getDeviceLanguage();




    //============ methods ================//


    function closeOfflineAlert() {
      thisCtrl.isOffline = false;
    }



    //-------- user sign in
    function enterForm(form) {
      //------ Trigger validation flag.
      thisCtrl.submitted = 1;
      if (form.$valid) {
        GlobalStor.global.isLoader = 1;
        //------ check Internet
        //TODO thisCtrl.isOnline = $cordovaNetwork.isOnline();
        if(thisCtrl.isOnline) {
          //------- check available Local DB
          loginServ.isLocalDBExist().then(function(data){
            thisCtrl.isLocalDB = data;
            if(thisCtrl.isLocalDB) {
              //======== SYNC
              console.log('SYNC');
              //---- checking user in LocalDB
              globalDB.selectLocalDB(globalDB.tablesLocalDB.user.tableName, {'phone': thisCtrl.user.phone}).then(function(data) {
                console.log('SYNC', data);
                //---- user exists
                if(data.length) {
                  //---------- check user password
                  var newUserPassword = globalDB.md5(thisCtrl.user.password);
                  if(newUserPassword === data[0].password) {
                    //----- checking user activation
                    if(data[0].locked) {
                      angular.extend(UserStor.userInfo, data[0]);
                      //------- set User Location
                      loginServ.prepareLocationToUse().then(function(data) {
                        thisCtrl.generalLocations = data;
                        checkingFactory();
                      });

                    } else {
                      GlobalStor.global.isLoader = 0;
                      //---- show attantion
                      thisCtrl.isUserNotActive = 1;
                    }
                  } else {
                    GlobalStor.global.isLoader = 0;
                    //---- user not exists
                    thisCtrl.isUserPasswordError = 1;
                  }
                } else {
                  //======== IMPORT
                  console.log('IMPORT');
                  importDBProsses();
                }

              });


            } else {
              //======== IMPORT
              console.log('IMPORT');
              importDBProsses();
            }
          });
        //-------- check LocalDB
        } else if(thisCtrl.isLocalDB) {
          console.log('OFFLINE');
          //---- checking user in LocalDB
          globalDB.selectLocalDB(globalDB.userTableDB, {'phone': thisCtrl.user.phone}).then(function(result) {
            //---- user exists
            if(result) {
              //---------- check user password
              var newUserPassword = globalDB.md5(thisCtrl.user.password);

              if(newUserPassword === result.rows.item(0).password) {

                //----- checking user activation
                if(result.rows.item(0).locked) {
                  //------- checking user FactoryId
                  if(result.rows.item(0).factory_id > 0) {
                    angular.extend(UserStor.userInfo, result.rows.item(0));
                    //------- set User Location
                    loginServ.prepareLocationToUse().then(function (data) {
                      thisCtrl.generalLocations = data;
                      loginServ.setUserLocation(thisCtrl.generalLocations.mergerLocation, UserStor.userInfo.city_id);
                      //--------- set currency symbol
                      loginServ.setCurrency();
                      GlobalStor.global.isLoader = 0;
                      $location.path('/main');
                    });
                  } else {
                    GlobalStor.global.isLoader = 0;
                    thisCtrl.isOffline = 1;
                  }
                } else {
                  GlobalStor.global.isLoader = 0;
                  //---- show attantion
                  thisCtrl.isUserNotActive = 1;
                }
              } else {
                GlobalStor.global.isLoader = 0;
                //---- user not exists
                thisCtrl.isUserPasswordError = 1;
              }
            } else {
              GlobalStor.global.isLoader = 0;
              //---- user not exists
              thisCtrl.isUserNotExist = 1;
            }

          });

        } else {
          thisCtrl.isOffline = 1;
        }


      }
    }


    function importDBProsses() {
      globalDB.importUser(thisCtrl.user.phone).then(function(result) {
//        console.log('USER!!!!!!!!!!!!', thisCtrl.user.phone, result);
        if(result.status) {
          //---------- check user password
          var newUserPassword = globalDB.md5(thisCtrl.user.password);
          if(newUserPassword === result.user.password) {

            //----- checking user activation
            if(result.user.locked) {
              //------- clean all tables in LocalDB
//              console.log('CLEEN START!!!!');
              globalDB.cleanLocalDB().then(function(data) {
                if(data) {
//                  console.log('CLEEN DONE!!!!');
                  //------- creates all tables in LocalDB
//                  console.log('CREATE START!!!!');
                  globalDB.createTablesLocalDB(globalDB.tablesLocalDB).then(function(data) {
                    if(data) {
//                      console.log('CREATE DONE!!!!');
                      //------- save user in LocalDB
                      globalDB.insertRowLocalDB(result.user, globalDB.tablesLocalDB.user.tableName);
                      //------- save user in Stor
                      angular.extend(UserStor.userInfo, result.user);
                      //                        console.log('new USER password', UserStor.userInfo);

                      //------- import Location
//                      console.log('START LOCATION');
                      globalDB.importLocation(UserStor.userInfo.phone, UserStor.userInfo.device_code).then(function(data) {
                        if(data) {
                          console.log('INSERT LOCATION FINISH!!!!');
                          //------ save Location Data in local obj
                          loginServ.prepareLocationToUse().then(function (data) {
                            thisCtrl.generalLocations = data;
//                            console.log('generalLocations----------', thisCtrl.generalLocations);
                            checkingFactory();
                          });
                        }
                      });
                    }
                  });
                }
              });
            } else {
              GlobalStor.global.isLoader = 0;
              //---- show attantion
              thisCtrl.isUserNotActive = 1;
            }
          } else {
            GlobalStor.global.isLoader = 0;
            //---- user not exists
            thisCtrl.isUserPasswordError = 1;
          }
        } else {
          GlobalStor.global.isLoader = 0;
          //---- user not exists
          thisCtrl.isUserNotExist = 1;
        }

      });
    }


    function checkingFactory() {
      //------- set User Location
      loginServ.setUserLocation(thisCtrl.generalLocations.mergerLocation, UserStor.userInfo.city_id);
      if(+UserStor.userInfo.factory_id > 0) {
        console.log('userInfo++++', UserStor.userInfo);
        if(thisCtrl.isLocalDB) {
          //------- current FactoryId matches to user FactoryId, go to main page without importDB
          //TODO globalDB.syncDb(UserStor.userInfo.phone, UserStor.userInfo.device_code).then(function() {
            //--------- set currency symbol
            loginServ.setCurrency();
            GlobalStor.global.isLoader = 0;
            $location.path('/main');
          //});
        } else {
          //------ GlobalDB is ampty
//          console.log('GlobalDB is empty');
          importDBfromServer(UserStor.userInfo.factory_id);
        }

      } else {
        //---- show Factory List
        //----- collect city Ids regarding to user country
        loginServ.collectCityIdsAsCountry(thisCtrl.generalLocations.mergerLocation).then(function(cityIds) {
          globalDB.importFactories(UserStor.userInfo.phone, UserStor.userInfo.device_code, cityIds).then(function(result){
//            console.log('Factories++++++', result);
            GlobalStor.global.isLoader = 0;
            if(result.status) {
              thisCtrl.factories = setFactoryLocation(result.factories, thisCtrl.generalLocations.mergerLocation);
              //-------- close Factory Dialog
              thisCtrl.isFactoryId = 1;
            } else {
              console.log('can not get factories!');
            }
          });
        });
      }
    }



    function importDBfromServer() {
      thisCtrl.isStartImport = true;
      console.log('START Time!!!!!!', new Date(), new Date().getMilliseconds());
      globalDB.importAllDB(UserStor.userInfo.phone, UserStor.userInfo.device_code).then(function(result) {
        if(result.status) {
          globalDB.insertTablesLocalDB(result).then(function() {
            console.log('insert AllDB is done!');
            //--------- set currency symbol
            loginServ.setCurrency().then(function(data) {
              if(data) {
                GlobalStor.global.isLoader = 0;
                thisCtrl.isStartImport = 0;
                console.log('Finish Time!!!!!!', new Date(), new Date().getMilliseconds());
                $location.path('/main');
              }
            });
          });
        } else {
          console.log('Error!');
        }


      });
    }



    function setFactoryLocation(factories, location) {
      var factoryQty = factories.length,
          locationQty = location.length;
      while(--factoryQty > -1) {
        for(var l = 0; l < locationQty; l++) {
          if(factories[factoryQty].city_id === location[l].cityId) {
            factories[factoryQty].location = location[l].fullLocation;
          }
        }
      }
      return factories;
    }



    function selectFactory() {
      if(thisCtrl.user.factoryId > 0) {
        //TODO thisCtrl.isOnline = $cordovaNetwork.isOnline();
        if(thisCtrl.isOnline) {
          GlobalStor.global.isLoader = 1;
          //-------- send selected Factory Id in Server
          thisCtrl.user.factoryId = 1; //TODO for all factories id = 1
          UserStor.userInfo.factory_id = angular.copy(thisCtrl.user.factoryId);
          //        console.log(UserStor.userInfo);
          //----- update factoryId in LocalDB
          globalDB.updateLocalDB(globalDB.tablesLocalDB.user.tableName, {'factory_id': UserStor.userInfo.factory_id}, {'id': UserStor.userInfo.id});
          //----- update factoryId in Server
          var dataToSend = [
            {
              model: 'users',
              rowId: UserStor.userInfo.id,
              field: JSON.stringify({factory_id: UserStor.userInfo.factory_id})
            }
          ];
          globalDB.updateServer(UserStor.userInfo.phone, UserStor.userInfo.device_code, dataToSend);
          //-------- close Factory Dialog
          thisCtrl.isFactoryId = 0;
          importDBfromServer();
        } else {
          thisCtrl.isOffline = 1;
        }
      } else {
        //---- show attantion if any factory was chosen
        thisCtrl.isFactoryNotSelect = 1;
      }

    }

    function closeFactoryDialog() {
      thisCtrl.isFactoryNotSelect = 0;
      thisCtrl.isFactoryId = 0;
      delete thisCtrl.user.factoryId;
    }





    //-------- user registration

    function switchRegistration() {
      //------ check Internet
      //TODO thisCtrl.isOnline = $cordovaNetwork.isOnline();
      if(thisCtrl.isOnline) {
        //------- check available Local DB
        loginServ.isLocalDBExist().then(function(data) {
          thisCtrl.isLocalDB = data;
//          console.log('REG', data);
          //------ if generalLocations is not exists refresh Location and Users
          if(thisCtrl.isLocalDB) {
            loginServ.prepareLocationToUse().then(function(data) {
              thisCtrl.generalLocations = data;
//              console.log('DOWNLOAD LOCATION 1', data);
              thisCtrl.isRegistration = 1;
            });
          } else {
            GlobalStor.global.isLoader = 1;
            //------- clean all tables in LocalDB
            globalDB.cleanLocalDB().then(function() {
              //------- creates all tables in LocalDB
              globalDB.createTablesLocalDB(globalDB.tablesLocationLocalDB).then(function () {
                //------- import Location
                globalDB.importLocation().then(function() {
                  //------ save Location Data in local obj
                  loginServ.prepareLocationToUse().then(function(data) {
                    thisCtrl.generalLocations = data;
//                    console.log('DOWNLOAD LOCATION 2', data);
                    GlobalStor.global.isLoader = 0;
                    thisCtrl.isRegistration = 1;
                  });
                });
              });
            });
          }
          thisCtrl.user = {};
          //angular.element('#first_input').focus();
        });
      } else {
        thisCtrl.isOffline = 1;
      }
    }


    function closeRegistration() {
      thisCtrl.user = {};
      thisCtrl.isRegistration = 0;
    }

    function registrForm(form) {
      // Trigger validation flag.
      thisCtrl.submitted = true;
      if (form.$valid) {
        //------ check Internet
        //TODO thisCtrl.isOnline = $cordovaNetwork.isOnline();
        if(thisCtrl.isOnline) {
          GlobalStor.global.isLoader = 1;
          //--- checking user in server
          globalDB.importUser(thisCtrl.user.phone).then(function(result) {
            console.log('USER!!!!!!!!!!!!', result);
            if(result.status) {
              GlobalStor.global.isLoader = 0;
              //---- show attantion
              thisCtrl.isUserExist = 1;
            } else {
              var userData = {
                name: thisCtrl.user.name,
                phone: thisCtrl.user.phone,
                email: thisCtrl.user.mail,
                cityId: thisCtrl.user.city.id,
                password: globalDB.md5(thisCtrl.user.phone)
              };
              //--- create new user in Server
              globalDB.createUserServer(userData);
              GlobalStor.global.isLoader = 0;
              //-------- sent confirmed email
              thisCtrl.isSendEmail = 1;
              closeRegistration();
            }
          });
        } else {
          thisCtrl.isOffline = 1;
        }
      }
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