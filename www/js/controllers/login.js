
// controllers/login.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('LoginModule')
    .controller('LoginCtrl', loginPageCtrl);

  function loginPageCtrl($location, $cordovaNetwork, globalConstants, localDB, loginServ, GlobalStor, UserStor) {

    var thisCtrl = this;
    //TODO thisCtrl.isOnline = $cordovaNetwork.isOnline();
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
    thisCtrl.factories = 0;
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


    //------- export data
    if(thisCtrl.isOnline) {
      loginServ.initExport();

      entriyWithoutLogin();
    }


    //============ methods ================//


    function entriyWithoutLogin() {
      var url = $location.search();
//      console.log('url = ', url); //{access: '5b1b68a9abf4d2cd155c81a9225fd158'}
      switch(url.access) {
        case '7d537b6746f925b1703aefa9b8a9a4bc':
          thisCtrl.user.phone = '0950604425';
          thisCtrl.user.password = '0950604425';
          break;
        case 'ff8134058378465dd485608f85eea994':
          thisCtrl.user.phone = 'steko';
          thisCtrl.user.password = 'steko';
          break;
      }
      if(thisCtrl.user.phone && thisCtrl.user.password) {
        GlobalStor.global.isLoader = 1;
        importDBProsses();
      }

    }
//?access=7d537b6746f925b1703aefa9b8a9a4bc
//?access=ff8134058378465dd485608f85eea994



    function closeOfflineAlert() {
      thisCtrl.isOffline = false;
    }



    //=========== SIGN IN ========//

    function enterForm(form) {
//      console.log('@@@@@@@@@@@@=', typethisCtrl.user.phone, thisCtrl.user.password);
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
              localDB.selectLocalDB(localDB.tablesLocalDB.users.tableName, {'phone': thisCtrl.user.phone}).then(function(data) {
                //---- user exists
                if(data.length) {
                  //---------- check user password
                  var newUserPassword = localDB.md5(thisCtrl.user.password);
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
                  console.log('Sync IMPORT');
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
          localDB.selectLocalDB(localDB.tablesLocalDB.users.tableName, {'phone': thisCtrl.user.phone}).then(function(data) {
            //---- user exists
            if(data.length) {
              //---------- check user password
              var newUserPassword = localDB.md5(thisCtrl.user.password);
              if(newUserPassword === data[0].password) {
                //----- checking user activation
                if(data[0].locked) {
                  //------- checking user FactoryId
                  if(data[0].factory_id > 0) {
                    angular.extend(UserStor.userInfo, data[0]);
                    //------- set User Location
                    loginServ.prepareLocationToUse().then(function (data) {
                      thisCtrl.generalLocations = data;
                      loginServ.setUserLocation(thisCtrl.generalLocations.mergerLocation, UserStor.userInfo.city_id);
                      //--------- set currency symbol
                      loginServ.setCurrency().then(function(data) {
                        if(data) {
                          loginServ.setUserDiscounts().then(function(data) {
                            if(data) {
                              GlobalStor.global.isLoader = 0;
                              $location.path('/main');
                            }
                          });
                        }
                      });
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
          GlobalStor.global.isLoader = 0;
          thisCtrl.isOffline = 1;
        }
      }
    }


    function importDBProsses() {
      localDB.importUser(thisCtrl.user.phone).then(function(result) {
//        console.log('USER!!!!!!!!!!!!', thisCtrl.user.phone, result);
        if(result.status) {
          //---------- check user password
          var newUserPassword = localDB.md5(thisCtrl.user.password);
          if(newUserPassword === result.user.password) {

            //----- checking user activation
            if(result.user.locked) {
              //------- clean all tables in LocalDB
//              console.log('CLEEN START!!!!');
              localDB.cleanLocalDB(localDB.tablesLocalDB).then(function(data) {
                if(data) {
//                  console.log('CLEEN DONE!!!!');
                  //------- creates all tables in LocalDB
//                  console.log('CREATE START!!!!');
                  localDB.createTablesLocalDB(localDB.tablesLocalDB).then(function(data) {
                    if(data) {
//                      console.log('CREATE DONE!!!!');
                      //------- save user in LocalDB
                      localDB.insertRowLocalDB(result.user, localDB.tablesLocalDB.users.tableName);
                      //------- save user in Stor
                      angular.extend(UserStor.userInfo, result.user);

                      //------- import Location
                      localDB.importLocation(UserStor.userInfo.phone, UserStor.userInfo.device_code).then(function(data) {
                        if(data) {
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
        loginServ.isLocalDBExist().then(function(data) {
          thisCtrl.isLocalDB = data;
          if (thisCtrl.isLocalDB) {
            //------- current FactoryId matches to user FactoryId, go to main page without importDB
            //TODO localDB.syncDb(UserStor.userInfo.phone, UserStor.userInfo.device_code).then(function() {
            //--------- set currency symbol
            loginServ.setCurrency().then(function (data) {
              if (data) {
                loginServ.setUserDiscounts().then(function (data) {
                  if (data) {
                    GlobalStor.global.isLoader = 0;
                    $location.path('/main');
                  }
                });
              }
            });
            //});
          } else {
            //------ GlobalDB is ampty
            importDBfromServer(UserStor.userInfo.factory_id);
          }
        });
      } else {
        //---- show Factory List
        //----- collect city Ids regarding to user country
        loginServ.collectCityIdsAsCountry(thisCtrl.generalLocations.mergerLocation).then(function(cityIds) {
          localDB.importFactories(UserStor.userInfo.phone, UserStor.userInfo.device_code, cityIds).then(function(result){
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
      thisCtrl.isStartImport = 1;
//      console.log('START Time!!!!!!', new Date(), new Date().getMilliseconds());
      localDB.importAllDB(UserStor.userInfo.phone, UserStor.userInfo.device_code).then(function(data) {
        if(data) {
//          console.log('insert AllDB is done!');
          //--------- set currency symbol
          loginServ.setCurrency().then(function(data) {
            if(data) {
              loginServ.setUserDiscounts().then(function(data) {
                if(data) {
                  GlobalStor.global.isLoader = 0;
                  thisCtrl.isStartImport = 0;
//                  console.log('Finish Time!!!!!!', new Date(), new Date().getMilliseconds());
                  $location.path('/main');
                }
              });
            }
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
          UserStor.userInfo.factory_id = angular.copy(thisCtrl.user.factoryId);
//                  console.log(UserStor.userInfo.factory_id);
          //----- update factoryId in LocalDB & Server
          localDB.updateLocalServerDBs(localDB.tablesLocalDB.users.tableName, UserStor.userInfo.id, {factory_id: UserStor.userInfo.factory_id}).then(function() {
            //-------- close Factory Dialog
            thisCtrl.isFactoryId = 0;
            importDBfromServer();
          });
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
            localDB.cleanLocalDB(localDB.tablesLocalDB).then(function(data) {
              if(data) {
                //------- creates all tables in LocalDB
                localDB.createTablesLocalDB(localDB.tablesLocationLocalDB).then(function (data) {
                  if(data) {
                    //------- import Location
                    localDB.importLocation().then(function(data) {
                      if(data) {
                        //------ save Location Data in local obj
                        loginServ.prepareLocationToUse().then(function(data) {
                          thisCtrl.generalLocations = data;
//                          console.log('DOWNLOAD LOCATION 2', data);
                          GlobalStor.global.isLoader = 0;
                          thisCtrl.isRegistration = 1;
                        });
                      }
                    });
                  }
                });
              }
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
          localDB.importUser(thisCtrl.user.phone).then(function(result) {
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
                password: localDB.md5(thisCtrl.user.phone)
              };
              console.log('CREATE USER!!!!!!!!!!!!', userData);
              //--- create new user in Server
              localDB.createUserServer(userData);
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
