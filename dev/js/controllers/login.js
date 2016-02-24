(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('LoginModule')
    .controller('LoginCtrl',

  function(
    $location,
    $cordovaNetwork,
    $filter,
    globalConstants,
    localDB,
    loginServ,
    GlobalStor,
    UserStor
  ) {
    /*jshint validthis:true */
    var thisCtrl = this;
    thisCtrl.G = GlobalStor;

    //TODO thisCtrl.isOnline = $cordovaNetwork.isOnline();
    thisCtrl.isOnline = 1;
    thisCtrl.isOffline = 0;
    thisCtrl.isLocalDB = 0;
    thisCtrl.isRegistration = 0;
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

    //------- translate
    thisCtrl.OFFLINE = $filter('translate')('login.OFFLINE');
    thisCtrl.OK = $filter('translate')('common_words.OK');
    thisCtrl.USER_CHECK_EMAIL = $filter('translate')('login.USER_CHECK_EMAIL');
    thisCtrl.USER_NOT_EXIST = $filter('translate')('login.USER_NOT_EXIST');
    thisCtrl.USER_NOT_ACTIVE = $filter('translate')('login.USER_NOT_ACTIVE');
    thisCtrl.USER_PASSWORD_ERROR = $filter('translate')('login.USER_PASSWORD_ERROR');
    thisCtrl.IMPORT_DB = $filter('translate')('login.IMPORT_DB');
    thisCtrl.MOBILE = $filter('translate')('login.MOBILE');
    thisCtrl.EMPTY_FIELD = $filter('translate')('login.EMPTY_FIELD');
    thisCtrl.WRONG_NUMBER = $filter('translate')('login.WRONG_NUMBER');
    thisCtrl.SHORT_PHONE = $filter('translate')('login.SHORT_PHONE');
    thisCtrl.PASSWORD = $filter('translate')('login.PASSWORD');
    thisCtrl.SHORT_PASSWORD = $filter('translate')('login.SHORT_PASSWORD');
    thisCtrl.ENTER = $filter('translate')('login.ENTER');
    thisCtrl.REGISTRATION = $filter('translate')('login.REGISTRATION');
    thisCtrl.SELECT_FACTORY = $filter('translate')('login.SELECT_FACTORY');
    thisCtrl.SELECT_PRODUCER = $filter('translate')('login.SELECT_PRODUCER');
    thisCtrl.SELECT = $filter('translate')('common_words.SELECT');
    thisCtrl.USER_EXIST = $filter('translate')('login.USER_EXIST');
    thisCtrl.CLIENT_NAME = $filter('translate')('cart.CLIENT_NAME');
    thisCtrl.WRONG_NAME = $filter('translate')('login.WRONG_NAME');
    thisCtrl.SHORT_NAME = $filter('translate')('login.SHORT_NAME');
    thisCtrl.SELECT_COUNTRY = $filter('translate')('login.SELECT_COUNTRY');
    thisCtrl.SELECT_REGION = $filter('translate')('login.SELECT_REGION');
    thisCtrl.SELECT_CITY = $filter('translate')('login.SELECT_CITY');
    thisCtrl.CLIENT_EMAIL = $filter('translate')('cart.CLIENT_EMAIL');
    thisCtrl.WRONG_EMAIL = $filter('translate')('cart.WRONG_EMAIL');




    /**============ METHODS ================*/



    function importDBfromServer() {
      thisCtrl.isStartImport = 1;
      //      console.log('START Time!!!!!!', new Date(), new Date().getMilliseconds());
      localDB.importAllDB(UserStor.userInfo.phone, UserStor.userInfo.device_code).then(function(data) {
        if(data) {
          /** download all data */
          loginServ.downloadAllData();
          thisCtrl.isStartImport = 0;
        } else {
          console.log('Error!');
        }
      });
    }


    function setFactoryLocation(factories) {
      var factoryQty = factories.length,
          locationQty;
      while(--factoryQty > -1) {
        locationQty = GlobalStor.global.locations.cities.length;
        while(--locationQty > -1) {
          if(factories[factoryQty].city_id === GlobalStor.global.locations.cities[locationQty].cityId) {
            factories[factoryQty].location = GlobalStor.global.locations.cities[locationQty].fullLocation;
          }
        }
      }
      return factories;
    }


    function checkingFactory() {
      //------- set User Location
      loginServ.setUserLocation();
      if((+UserStor.userInfo.factory_id) > 0) {
        loginServ.isLocalDBExist().then(function(data) {
          thisCtrl.isLocalDB = data;
          if (thisCtrl.isLocalDB) {
            //------- current FactoryId matches to user FactoryId, go to main page without importDB
            //TODO localDB.syncDb(UserStor.userInfo.phone, UserStor.userInfo.device_code).then(function() {
            /** download all data */
            loginServ.downloadAllData();
            //});
          } else {
            //------ LocalDB is empty
            importDBfromServer(UserStor.userInfo.factory_id);
          }
        });
      } else {
        //---- show Factory List
        //----- collect city Ids regarding to user country
        loginServ.collectCityIdsAsCountry().then(function(cityIds) {
          localDB.importFactories(UserStor.userInfo.phone, UserStor.userInfo.device_code, cityIds).then(function(result){
            //            console.log('Factories++++++', result);
            GlobalStor.global.isLoader = 0;
            if(result.status) {
              thisCtrl.factories = setFactoryLocation(result.factories);
              //-------- close Factory Dialog
              thisCtrl.isFactoryId = 1;
            } else {
              console.log('can not get factories!');
            }
          });
        });
      }
    }


    function importDBProsses(user) {

      //----- checking user activation
      if(user.locked) {
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
                localDB.insertRowLocalDB(user, localDB.tablesLocalDB.users.tableName);
                //------- save user in Stor
                angular.extend(UserStor.userInfo, user);
                //------- import Location
                localDB.importLocation(UserStor.userInfo.phone, UserStor.userInfo.device_code).then(function(data) {
                  if(data) {
                    //------ save Location Data in local obj
                    loginServ.prepareLocationToUse().then(function() {
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

    }


    function checkingUser() {
      localDB.importUser(thisCtrl.user.phone).then(function(result) {
        if(result.status) {
          var userTemp = angular.copy(result.user);
          console.log('USER!!!!!!!!!!!!', thisCtrl.user.phone, result);
          //---------- check user password
          var newUserPassword = localDB.md5(thisCtrl.user.password);
          if(newUserPassword === userTemp.password) {

            userTemp.therm_coeff_id = angular.copy(result.thermCoeffId);
            //-------- check factory Link
            if(result.factoryLink !== null) {
              userTemp.factoryLink = angular.copy(result.factoryLink);
            }
            importDBProsses(userTemp);
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





    /**============== ENTRY BY LINK ===============*/


    function entriyWithoutLogin() {
      var url = $location.search(),
          accessArr = [
            '7d537b6746f925b1703aefa9b8a9a4bc',
            '3f5f0c7d46d318e026f9ba60dceffc65',
            '799e078b084c6d57cea0b0d53a7e3008',
            '9aefeef9c7e53f9de9bb36f32649dc3f',
            'a2da6d85764368b24392740020efbc92',
            'ceb60bfed037baaa484bd7b88d274c98',
            '632b3213660804acb71fe045c6e321ed',

            '04fc711301f3c784d66955d98d399afb',
            '768c1c687efe184ae6dd2420710b8799',
            'f7a5c99c58103f6b65c451efd0f81826',
            '27701bd8dd141b953b94a5c9a44697c0',
            '7f7d5f9f3a660f2b09e3aae62a15e29b',
            '23ff17389acbfd020043268fb49e7048',
            'cd714cc33cfd23e74f414cbb8b9787fe',
            '2959f1aea8db0f7fbba61f0f8474d0ef',
            'a28a19e19b283845c851b4876b97cef4',
            '661e67f8ce5eaf9d63c1b5be6fce1afb',
            '0653e359db756493450c3fb1fc6790b2',
            'ec5fefce8d1d81849b47923d6d1b52c0',
            'd4ccb0f347163d9ee1cd5a106e1ec48b',
            'c500ea6c5baf3deb447be25b90cf5f1c',
            '59a6670111970ede6a77e9b43a5c4787',
            '266021e24dd0bfaaa96f2b5e21d7c800',
            'b8c4b7f74db12fadbe2d979ed93f392b',
            '2482b711a07d1da3efa733aa7014f947',
            '573b8926f015aa477cb6604901b92aea',
            'b54d11c86eb7c8955a50d20f6b3be2f2',
            '3a55b7218a5ca395ac71b3ec9904b6ed',
            '3615d9213b1b3d5fe760901f43a8405f',
            'e50137601a90943ce98b03e90d73272e',
            'd4651afb4e1c749f0bacc7ff5d101982',
            '988a8fa4855bf7ea54057717655d3fc9'
          ],
          phoneArr = [
            '0950604425',
            '0500505500',
            '78124541170',
            '22274313',
            '9201922876',
            '903528981',
            '9301600441',

            '000001',
            '000002',
            '000003',
            '000007',
            '000008',
            '000009',
            '000010',
            '000011',
            '000012',
            '000013',
            '000014',
            '000015',
            '000016',
            '000017',
            '000018',
            '000019',
            '000020',
            '000021',
            '000022',
            '000023',
            '000024',
            '000025',
            '000026',
            '000027',
            '000028'
          ],
          passwordArr = [
            '0950604425',
            '0500505500',
            '78124541170',
            '22274313',
            '9201922876',
            '903528981',
            '9301600441',

            '000001',
            '000002',
            '000003',
            '000007',
            '000008',
            '000009',
            '000010',
            '000011',
            '000012',
            '000013',
            '000014',
            '000015',
            '000016',
            '000017',
            '000018',
            '000019',
            '000020',
            '000021',
            '000022',
            '000023',
            '000024',
            '000025',
            '000026',
            '000027',
            '000028'
          ],
          accessQty = accessArr.length,
          isCustomer = 0;


      if(url.access) {

        while(accessQty > -1) {
          accessQty -= 1;
          if(accessArr[accessQty] === url.access) {
            thisCtrl.user.phone = phoneArr[accessQty];
            thisCtrl.user.password = passwordArr[accessQty];
            isCustomer = 1;
          }
        }

        if(isCustomer) {
          if(thisCtrl.user.phone && thisCtrl.user.password) {
            GlobalStor.global.isLoader = 1;
            checkingUser();
          }
        } else {
          localDB.importUser(url.access, 1).then(function(result) {
            var userTemp = angular.copy(result.user);
            GlobalStor.global.isLoader = 1;
            userTemp.therm_coeff_id = angular.copy(result.thermCoeffId);
            //-------- check factory Link
            if(result.factoryLink !== null) {
              userTemp.factoryLink = angular.copy(result.factoryLink);
            }
            importDBProsses(userTemp);
          });
        }

      }
    }




    function closeOfflineAlert() {
      thisCtrl.isOffline = false;
    }



    /** =========== SIGN IN ======== */

    function enterForm(form) {
//      console.log('@@@@@@@@@@@@=', typethisCtrl.user.phone, thisCtrl.user.password);
      //------ Trigger validation flag.
      thisCtrl.submitted = 1;
      if (form.$valid) {
        GlobalStor.global.isLoader = 1;
        //------ check Internet
        //TODO thisCtrl.isOnline = $cordovaNetwork.isOnline();
        if(thisCtrl.isOnline) {

          ////TODO for Steko
          //======== IMPORT
          //console.log('IMPORT');
          //checkingUser();
///*
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
                      loginServ.prepareLocationToUse().then(function() {
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
                  checkingUser();
                }

              });


            } else {
              //======== IMPORT
              console.log('IMPORT');
              checkingUser();
            }
          });
          //*/
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
                    loginServ.prepareLocationToUse().then(function() {
                      loginServ.setUserLocation();
                      /** download all data */
                      loginServ.downloadAllData();
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



    /**--------- FACTORIES ------------*/

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





    /**============ Registration ============*/


    function switchRegistration() {
      //------ check Internet
      //TODO thisCtrl.isOnline = $cordovaNetwork.isOnline();
      if(thisCtrl.isOnline) {
        //------- check available Local DB
        loginServ.isLocalDBExist().then(function(data) {
          thisCtrl.isLocalDB = data;
//          console.log('REG', data);
          //------ if locations is not exists refresh Location and Users
          if(thisCtrl.isLocalDB) {
            GlobalStor.global.isLoader = 1;
            loginServ.prepareLocationToUse(1).then(function() {
              GlobalStor.global.isLoader = 0;
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
                        loginServ.prepareLocationToUse(1).then(function() {
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






    /**========== FINISH ==========*/


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
    loginServ.getDeviceLanguage();


    //------- export data
    if(thisCtrl.isOnline) {
      loginServ.initExport();

      entriyWithoutLogin();
    }



  });
})();