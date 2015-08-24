
// controllers/login.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('LoginModule')
    .controller('LoginCtrl', loginPageCtrl);

  function loginPageCtrl($location, $cordovaNetwork, $cordovaProgress, globalConstants, globalDB, loginServ, GlobalStor, UserStor) {

    var thisCtrl = this;
    thisCtrl.isOnline = 1;
    thisCtrl.isOffline = 0;
    thisCtrl.isLocalDB = 0;
    thisCtrl.isRegistration = 0;
    thisCtrl.generalLocations = {};
    thisCtrl.submitted = 0;
    thisCtrl.isUserExist = false;
    thisCtrl.isUserNotExist = false;
    thisCtrl.isUserPasswordError = false;
    thisCtrl.isSendEmail = false;
    thisCtrl.isUserNotActive = false;
    thisCtrl.isFactoryId = false;
    thisCtrl.isFactoryNotSelect = false;
    thisCtrl.isStartImport = false;
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

    //------- check available Local DB
    globalDB.isExistLocalDB().then(function(data) {
      console.log('data ===', data);
      if(data) {
        thisCtrl.isLocalDB = data.rows.item(0).id;
      }
    });





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

          if(thisCtrl.isLocalDB) {
            //======== SYNC

            //---- checking user in LocalDB
            globalDB.selectLocalDB(globalDB.tablesLocalDB.user.tableName, {'phone': thisCtrl.user.phone}).then(function(result) {
              //---- user exists
              if(result) {
                //---------- check user password
                var newUserPassword = globalDB.md5(thisCtrl.user.password);
                if(newUserPassword === result[0].password) {
                  //----- checking user activation
                  if(UserStor.userInfo.locked) {
                    angular.extend(UserStor.userInfo, result[0]);
                    //------- set User Location
                    loginServ.prepareLocationToUse().then(function(data) {
                      thisCtrl.generalLocations = data;
                      //                  checkingFactory(UserStor.userInfo.factory_id);
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

              }

            });


          } else {
            //======== IMPORT
            globalDB.importUser(thisCtrl.user.phone).then(function(result) {
              console.log('USER!!!!!!!!!!!!', result);
              if(result.status) {
                //---------- check user password
                var newUserPassword = globalDB.md5(thisCtrl.user.password);
                console.log('new USER password', newUserPassword);
                if(newUserPassword === result.user.password) {

                  //----- checking user activation
                  if(result.user.locked) {
                    //------- clean all tables in LocalDB
                    globalDB.cleanLocalDB().then(function() {
                      //------- creates all tables in LocalDB
                      globalDB.createTablesLocalDB().then(function() {
                        //------- save user in LocalDB
                        globalDB.insertRowLocalDB(result.user, globalDB.tablesLocalDB.user.tableName);
                        //------- save user in Stor
                        angular.extend(UserStor.userInfo, result.user);
                        console.log('new USER password', UserStor.userInfo);
                        //------- import Location
                        globalDB.importLocation().then(function() {
                          //------ save Location Data in local obj
                          loginServ.prepareLocationToUse().then(function(data) {
                            thisCtrl.generalLocations = data;
                            console.log('DOWNLOAD LOCATION', data);
                            //                  checkingFactory(UserStor.userInfo.factory_id);
                          });
                        });
                      });
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


/*

          //TODO $cordovaProgress.showSimple(true);
          //------ import Location Data & All Users
          loginServ.downloadUsers().then(function(data) {
            thisCtrl.generalLocations = data;
            console.log('DOWNLOAD USERS', data);
            //---- checking user in GlobalDB
            globalDB.selectDBGlobal(globalDB.userTableDB, {'phone': thisCtrl.user.phone}).then(function(results) {
              //---- user exists
              console.log('TAKE USER IN TABLE', results);
              if(results) {
                //---------- check user password
                var newUserPassword = globalDB.md5(thisCtrl.user.password);
                console.log('USER EXIST', newUserPassword);
                if(newUserPassword === results[0].password) {
                  angular.extend(UserStor.userInfo, results[0]);

                  //----- checking user activation
                  if(UserStor.userInfo.locked) {
                    console.log('USER LOCKED', UserStor.userInfo);
                    checkingFactory(UserStor.userInfo.factory_id);

                  } else {

                    globalDB.ifUserExist(thisCtrl.user.phone, function(result){
                      //console.log(result);
                      //---- user activated
                      if(result.activation) {
                        //----- update locked in user of GlobalDB
                        globalDB.updateDBGlobal(globalDB.userTableDB, {'locked': 1}, {'phone': thisCtrl.user.phone});
                        //----- checking FactoryId
                        checkingFactory(result.factory);

                      } else {
                        $cordovaProgress.hide();
                        //---- show attantion
                        thisCtrl.isUserNotActive = true;
                      }
                    });

                  }
                } else {
                  //TODO $cordovaProgress.hide();
                  //---- user not exists
                  thisCtrl.isUserPasswordError = true;
                }

              } else {
                //TODO $cordovaProgress.hide();
                //---- user not exists
                thisCtrl.isUserNotExist = true;
              }

            });

          });
*/
        //-------- check LocalDB
        } else if(thisCtrl.isLocalDB) {

          //---- checking user in LocalDB
          globalDB.selectLocalDB(globalDB.userTableDB, {'phone': thisCtrl.user.phone}).then(function(results) {
            //---- user exists
            if(results) {
              //---------- check user password
              var newUserPassword = globalDB.md5(thisCtrl.user.password);

              if(newUserPassword === results[0].password) {

                //----- checking user activation
                if(UserStor.userInfo.locked) {
                  angular.extend(UserStor.userInfo, results[0]);
                  //------- set User Location
                  loginServ.prepareLocationToUse().then(function(data) {
                    thisCtrl.generalLocations = data;
                    loginServ.setUserLocation(thisCtrl.generalLocations.mergerLocation, UserStor.userInfo.city_id);
                    //------- checking if GlobalDB matches to user FactoryId
                    globalDB.selectAllDBGlobal(globalDB.deviceTableDB).then(function(result) {
                      if(result) {
                        var currFactoryId = result[0].device_code;

                        if(currFactoryId == UserStor.userInfo.factory_id) {
                          //------- current FactoryId matches to user FactoryId, go to main page without importDB
                          GlobalStor.global.isLoader = 0;
                          $location.path('/main');
                        }
                      } else {
                        //------ GlobalDB is ampty
                        console.log('GlobalDB is empty');
                      }
                    });
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

        } else {
          thisCtrl.isOffline = 1;
        }


      }
    }


    function checkingFactory(factory) {
      var factory = parseInt(factory, 10);
      //------- set User Location
      loginServ.setUserLocation(thisCtrl.generalLocations.mergerLocation, UserStor.userInfo.city_id);
      if(factory > 0) {

        //------- checking if GlobalDB matches to user FactoryId
        globalDB.selectAllDBGlobal(globalDB.deviceTableDB).then(function(result) {
          console.log('TAKE DEVICE ', result);
          if(result) {
            var currFactoryId = result[0].device_code;

            if(currFactoryId == UserStor.userInfo.factory_id) {
              //------- current FactoryId matches to user FactoryId, go to main page without importDB
              globalDB.syncDb(UserStor.userInfo.phone, UserStor.userInfo.device_code).then(function() {
                //TODO $cordovaProgress.hide();
                $location.path('/main');
              });
            } else {
              //-------- current FactoryId NOT matches to user FactoryId, update FactoryId & importDB
              importDBfromServer(UserStor.userInfo.factory_id);
            }
          } else {
            //------ GlobalDB is ampty
            //console.log('GlobalDB is empty');
            importDBfromServer(UserStor.userInfo.factory_id);
          }
        });

      } else {
        //---- show Factory List
        globalDB.getFactories(UserStor.userInfo.city_id, function(result){
          if(result.status) {
            //TODO $cordovaProgress.hide();
            thisCtrl.factories = result.data;
            thisCtrl.isFactoryId = true;
          } else {
            console.log('can not get factories!');
          }
        });
      }
    }




    function selectFactory() {
      if(thisCtrl.user.factoryId > 0) {
          //-------- send selected Factory Id in Server
        thisCtrl.user.factoryId = 1; //TODO for all factories id = 1
        globalDB.setFactory(UserStor.userInfo.phone, thisCtrl.user.factoryId, UserStor.userInfo.device_code, function(result){
          console.log(result);
          if(result.status) {
            //-------- close Factory Dialog
            thisCtrl.isFactoryId = 0;
          //TODO $cordovaProgress.showSimple(true);
            importDBfromServer(thisCtrl.user.factoryId);
          } else {
            console.log('FactoryId not was sent!');
          }
        });
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


    function importDBfromServer(factory) {
      thisCtrl.isStartImport = true;
        globalDB.clearDb().then(function() {
        globalDB.importDb(UserStor.userInfo.phone, factory, UserStor.userInfo.device_code).then(function() {
          //TODO $cordovaProgress.hide();
          thisCtrl.isStartImport = 0;
          $location.path('/main');
        });
      });
    }


    //-------- user registration

    function switchRegistration() {
      //------ check Internet
      thisCtrl.isOnline = $cordovaNetwork.isOnline();
      if(thisCtrl.isOnline) {
        //------ if generalLocations is not exists refresh Location and Users
        if(thisCtrl.isLocalDB) {
          loginServ.prepareLocationToUse().then(function(data) {
            thisCtrl.generalLocations = data;
            console.log('DOWNLOAD LOCATION', data);
          });
        } else {
          GlobalStor.global.isLoader = 1;
          //------- import Location
          globalDB.importLocation().then(function() {
            //------ save Location Data in local obj
            loginServ.prepareLocationToUse().then(function(data) {
              thisCtrl.generalLocations = data;
              console.log('DOWNLOAD LOCATION', data);
            });
          });

        }
        GlobalStor.global.isLoader = 0;
        thisCtrl.user = {};
        thisCtrl.isRegistration = 1;
        //angular.element('#first_input').focus();
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
        thisCtrl.isOnline = $cordovaNetwork.isOnline();
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
              //--- create new user
              globalDB.createUser(thisCtrl.user.phone, {"name": thisCtrl.user.name, "phone": thisCtrl.user.phone, "cityId": thisCtrl.user.city.id, "email": thisCtrl.user.mail}, function(result){
                if(result.status) {
                  GlobalStor.global.isLoader = 0;
                  //-------- sent confirmed email
                  thisCtrl.isSendEmail = 1;
//                  switchRegistration();
                  //-------- save new user in localDB
//                  globalDB.importUser(result.userId, result.access_token, function(result){
//                    console.log(result);
//                  });
                } else {
                  console.log('some problem dureing user creating');
                }
              });
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
