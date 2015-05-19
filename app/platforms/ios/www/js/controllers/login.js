
// controllers/login.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('LoginModule')
    .controller('LoginCtrl', loginPageCtrl);

  function loginPageCtrl($location, $translate, $cordovaNetwork, $cordovaGlobalization, $cordovaProgress, globalConstants, globalDB, loginServ, UserStor) {

    var thisCtrl = this;
    thisCtrl.isOnline = true;
    thisCtrl.isRegistration = false;
    thisCtrl.submitted = false;
    thisCtrl.isUserExist = false;
    thisCtrl.isUserNotExist = false;
    thisCtrl.isUserPasswordError = false;
    thisCtrl.isSendEmail = false;
    thisCtrl.isUserNotActive = false;
    thisCtrl.isFactoryId = false;
    thisCtrl.isFactoryNotSelect = false;
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


    startApp();



    //============ methods ================//

    function startApp() {
      //------ check Internet
      thisCtrl.isOnline = $cordovaNetwork.isOnline();
      if(thisCtrl.isOnline) {
        $cordovaProgress.showSimple(true);

        //------- defined system language
        $cordovaGlobalization.getPreferredLanguage().then(
          function(result) {
            loginServ.checkLangDictionary(result.value.split('-')[0]);
            $translate.use(UserStor.userInfo.langLabel);
          },
          function(error) {
            console.log('No language defined');
          });

        //------ import Location Data & All Users
        globalDB.clearLocation(function(result){}).then(function() {
          globalDB.importLocation(function(result){}).then(function() {
            //------ save Location Data in local obj
            loginServ.prepareLocationToUse().then(function(data) {
              thisCtrl.generalLocations = data;
              $cordovaProgress.hide();
            });
          });
        });
      } else {
        thisCtrl.isOnline = false;
      }
    }



    //-------- user sign in
    function enterForm(form) {
      //------ Trigger validation flag.
      thisCtrl.submitted = true;
      if (form.$valid) {
        //---- checking user in GlobalDB
        globalDB.selectDBGlobal(globalDB.usersTableDBGlobal, {'phone': thisCtrl.user.phone}, function (results) {
          //---- user exists
          if (results.status) {
            //---------- check user password
            var newUserPassword = globalDB.md5(thisCtrl.user.password);

            if(newUserPassword === results.data[0].password) {
              angular.extend(UserStor.userInfo, results.data[0]);
              //----- checking user activation
              globalDB.ifUserExist(thisCtrl.user.phone, function(result){
                //console.log(result);
                //---- user activated
                if(result.activation) {
                  //----- update locked in user of GlobalDB
                  globalDB.updateDBGlobal(globalDB.usersTableDBGlobal, {'locked': 1}, {'phone': thisCtrl.user.phone});
                  //----- checking FactoryId
                  if(result.factory) {

                    //------- set User Location
                    loginServ.setUserLocation(thisCtrl.generalLocations.mergerLocation, UserStor.userInfo.city_id);

                    //------- checking if GlobalDB matches to user FactoryId
                    globalDB.selectAllDBGlobal(globalDB.deviceTableDBGlobal, function (result) {
                      if (result.status) {
                        var currFactoryId = result.data[0].device_code;

                        if(currFactoryId == UserStor.userInfo.factory_id) {
                          //------- current FactoryId matches to user FactoryId, go to main page without importDB
                          $cordovaProgress.showSimple(true);
                          globalDB.syncDb(UserStor.userInfo.phone, UserStor.userInfo.device_code, function(result){}).then(function(result) {
                            $cordovaProgress.hide();
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
                      //console.log(result);
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
              thisCtrl.isUserPasswordError = true;
            }

          } else {
            //---- user not exists
            thisCtrl.isUserNotExist = true;
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
        $cordovaProgress.showSimple(true);
        globalDB.clearDb(function(result){}).then(function() {
          globalDB.importDb(UserStor.userInfo.phone, factory, UserStor.userInfo.device_code, function(result){}).then(function() {
            $cordovaProgress.hide();
            $location.path('/main');
          });
        });
      }


      //-------- user registration

      function switchRegistration() {
        thisCtrl.user = {};
        thisCtrl.isRegistration = !thisCtrl.isRegistration;
        //angular.element('#first_input').focus();
      }

    function registrForm(form) {
      // Trigger validation flag.
      thisCtrl.submitted = true;
      if (form.$valid) {
        //--- checking user in server
        globalDB.ifUserExist(thisCtrl.user.phone, function(result){
          if(!result.status) {
            //--- create new user
            globalDB.createUser(thisCtrl.user.phone, {"name": thisCtrl.user.name, "phone": thisCtrl.user.phone, "cityId": thisCtrl.user.city.id, "email": thisCtrl.user.mail}, function(result){
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
