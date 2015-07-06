(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('LoginModule')
    .controller('LoginCtrl', loginPageCtrl);

  function loginPageCtrl($location, $cordovaNetwork, $cordovaProgress, globalConstants, globalDB, loginServ, UserStor) {

    var thisCtrl = this;
    thisCtrl.isOnline = true;
    thisCtrl.isOffline = false;
    thisCtrl.isGlobalDB = true;
    thisCtrl.isRegistration = false;
    thisCtrl.generalLocations = {};
    thisCtrl.submitted = false;
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
    thisCtrl.enterForm = enterForm;
    thisCtrl.registrForm = registrForm;
    thisCtrl.selectLocation = selectLocation;
    thisCtrl.selectFactory = selectFactory;
    thisCtrl.closeFactoryDialog = closeFactoryDialog;
    thisCtrl.closeOfflineAlert = closeOfflineAlert;



    //------- defined system language
    //TODO loginServ.getDeviceLanguage();

    //------- check available Global DB
    globalDB.checkGlobalDB().then(function(data) {
      thisCtrl.isGlobalDB = data;
    });

    //============ methods ================//

    function closeOfflineAlert() {
      thisCtrl.isOffline = false;
    }



    //-------- user sign in
    function enterForm(form) {
      //------ Trigger validation flag.
      thisCtrl.submitted = true;
      if (form.$valid) {
        //------ check Internet
        //TODO thisCtrl.isOnline = $cordovaNetwork.isOnline();
        if(thisCtrl.isOnline) {

          //TODO $cordovaProgress.showSimple(true);
          //------ import Location Data & All Users
          loginServ.downloadUsers().then(function(data) {
            thisCtrl.generalLocations = data;

            //---- checking user in GlobalDB
            globalDB.selectDBGlobal(globalDB.usersTableDBGlobal, {'phone': thisCtrl.user.phone}).then(function(results) {
              //---- user exists
              if(results) {
                //---------- check user password
                var newUserPassword = globalDB.md5(thisCtrl.user.password);

                if(newUserPassword === results[0].password) {
                  angular.extend(UserStor.userInfo, results[0]);

                  //----- checking user activation
                  if(UserStor.userInfo.locked) {

                    checkingFactory(UserStor.userInfo.factory_id);

                  } else {

                    globalDB.ifUserExist(thisCtrl.user.phone, function(result){
                      //console.log(result);
                      //---- user activated
                      if(result.activation) {
                        //----- update locked in user of GlobalDB
                        globalDB.updateDBGlobal(globalDB.usersTableDBGlobal, {'locked': 1}, {'phone': thisCtrl.user.phone});
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

        //-------- check LocalDB
        } else if(thisCtrl.isGlobalDB) {

          //TODO $cordovaProgress.showSimple(true);

          loginServ.prepareLocationToUse().then(function(data) {
            thisCtrl.generalLocations = data;


            //---- checking user in GlobalDB
            globalDB.selectDBGlobal(globalDB.usersTableDBGlobal, {'phone': thisCtrl.user.phone}).then(function(results) {
              //---- user exists
              if(results) {
                //---------- check user password
                var newUserPassword = globalDB.md5(thisCtrl.user.password);

                if(newUserPassword === results[0].password) {
                  angular.extend(UserStor.userInfo, results[0]);

                  //----- checking user activation
                  //---- user activated
                  if(UserStor.userInfo.locked) {

                    //------- set User Location
                    loginServ.setUserLocation(thisCtrl.generalLocations.mergerLocation, UserStor.userInfo.city_id);
                    //------- checking if GlobalDB matches to user FactoryId
                    globalDB.selectAllDBGlobal(globalDB.deviceTableDBGlobal).then(function(result) {
                      if(result) {
                        var currFactoryId = result[0].device_code;

                        if(currFactoryId == UserStor.userInfo.factory_id) {
                          //------- current FactoryId matches to user FactoryId, go to main page without importDB
                          //TODO $cordovaProgress.hide();
                          $location.path('/main');
                        }
                      } else {
                        //------ GlobalDB is ampty
                        console.log('GlobalDB is empty');
                      }
                    });


                  } else {
                    //TODO $cordovaProgress.hide();
                    //---- show attantion
                    thisCtrl.isUserNotActive = true;
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


        } else {
          thisCtrl.isOffline = true;
        }


      }
    }


    function checkingFactory(factory) {
      var factory = parseInt(factory, 10);
      //------- set User Location
      loginServ.setUserLocation(thisCtrl.generalLocations.mergerLocation, UserStor.userInfo.city_id);
      if(factory > 0) {

        //------- checking if GlobalDB matches to user FactoryId
        globalDB.selectAllDBGlobal(globalDB.deviceTableDBGlobal).then(function(result) {
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
            thisCtrl.isFactoryId = false;
          //TODO $cordovaProgress.showSimple(true);
            importDBfromServer(thisCtrl.user.factoryId);
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


    function importDBfromServer(factory) {
      thisCtrl.isStartImport = true;
        globalDB.clearDb().then(function() {
        globalDB.importDb(UserStor.userInfo.phone, factory, UserStor.userInfo.device_code).then(function() {
          //TODO $cordovaProgress.hide();
          thisCtrl.isStartImport = false;
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
        if(Object.keys(thisCtrl.generalLocations).length > 0) {
          thisCtrl.user = {};
          thisCtrl.isRegistration = !thisCtrl.isRegistration;
        } else {
          //TODO $cordovaProgress.showSimple(true);
          //------ import Location Data & All Users
          loginServ.downloadUsers().then(function(data) {
            thisCtrl.generalLocations = data;
            //TODO $cordovaProgress.hide();
            thisCtrl.user = {};
            thisCtrl.isRegistration = !thisCtrl.isRegistration;
          });
        }
        //angular.element('#first_input').focus();
      } else {
        thisCtrl.isOffline = true;
      }
    }

    function registrForm(form) {
      // Trigger validation flag.
      thisCtrl.submitted = true;
      if (form.$valid) {
        //------ check Internet
        thisCtrl.isOnline = $cordovaNetwork.isOnline();
        if(thisCtrl.isOnline) {
          //TODO $cordovaProgress.showSimple(true);
          //--- checking user in server
          globalDB.ifUserExist(thisCtrl.user.phone, function(result){
            if(!result.status) {
              //--- create new user
              globalDB.createUser(thisCtrl.user.phone, {"name": thisCtrl.user.name, "phone": thisCtrl.user.phone, "cityId": thisCtrl.user.city.id, "email": thisCtrl.user.mail}, function(result){
                if(result.status) {
                  //TODO $cordovaProgress.hide();
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
              //TODO $cordovaProgress.hide();
              //---- show attantion
              thisCtrl.isUserExist = true;
            }
          });
        } else {
          //TODO $cordovaProgress.hide();
          thisCtrl.isOffline = true;
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