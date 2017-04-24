(function () {
  'use strict';
  /**@ngInject*/
  angular
    .module('LoginModule')
    .controller('LoginCtrl',

      function ($location,
                $timeout,
                $cordovaNetwork,
                $filter,
                globalConstants,
                localDB,
                loginServ,
                MainServ,
                GlobalStor,
                ProductStor,
                OrderStor,
                AuxStor,
                DesignStor,
                UserStor,
                HistoryStor,
                SettingServ,
                HistoryServ,
                GeneralServ) {
        /*jshint validthis:true */
        var thisCtrl = this;
        thisCtrl.G = GlobalStor;
        thisCtrl.consts = globalConstants;


        //TODO thisCtrl.isOnline = $cordovaNetwork.isOnline();
        thisCtrl.isOnline = 1;
        thisCtrl.isOffline = 0;
        thisCtrl.isOfflineImport = 0;
        thisCtrl.isAutoSyncInfo = 0;
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
        GlobalStor.global.loader = 0;
        thisCtrl.unexpectedError = 0;


        /** PING SERVER*/
        MainServ.getOnline();
        //------- translate
        thisCtrl.OFFLINE = $filter('translate')('login.OFFLINE');
        thisCtrl.OK = $filter('translate')('common_words.OK');
        thisCtrl.USER_CHECK_EMAIL = $filter('translate')('login.USER_CHECK_EMAIL');
        thisCtrl.USER_NOT_EXIST = $filter('translate')('login.USER_NOT_EXIST');
        thisCtrl.USER_NOT_ACTIVE = $filter('translate')('login.USER_NOT_ACTIVE');
        thisCtrl.USER_PASSWORD_ERROR = $filter('translate')('login.USER_PASSWORD_ERROR');
        thisCtrl.IMPORT_DB = $filter('translate')('login.IMPORT_DB');
        thisCtrl.LOGIN = $filter('translate')('login.LOGIN');
        thisCtrl.PASSWORD = $filter('translate')('login.PASSWORD');
        thisCtrl.EMPTY_FIELD = $filter('translate')('login.EMPTY_FIELD');
        thisCtrl.WRONG_LOGIN = $filter('translate')('login.WRONG_LOGIN');
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
        thisCtrl.OFFLINE_IMPORT = $filter('translate')('login.OFFLINE_IMPORT');
        thisCtrl.AUTO_SYNCHRONIZE = $filter('translate')('login.AUTO_SYNCHRONIZE');
        thisCtrl.SYNCHRONIZE_INFO = $filter('translate')('login.SYNCHRONIZE_INFO');
        thisCtrl.UNEXPECTED_ERROR = $filter('translate')('login.UNEXPECTED_ERROR');
        thisCtrl.SYNC_INFO_P1 = $filter('translate')('login.SYNC_INFO_P1');
        thisCtrl.SYNC_INFO_P2 = $filter('translate')('login.SYNC_INFO_P2');
        /** reload room img */

        //$("<img />").attr("src", "img/room/1.png");
        //$("<img />").attr("src", "img/room/33.gif");
        //$("<img />").attr("src", "img/room/333.gif");

        function preloadImages(array) {
          if (!preloadImages.list) {
            preloadImages.list = [];
          }
          var list = preloadImages.list, i, img;
          for (i = 0; i < array.length; i += 1) {
            img = new Image();
            img.onload = function () {
              var index = list.indexOf(this);
              if (index !== -1) {
                // remove image from the array once it's loaded
                // for memory consumption reasons
                list.splice(index, 1);
              }
            };
            list.push(img);
            img.src = array[i];
          }
        }

        preloadImages([
          "img/room/1.png",
          "img/room/4.png",
          "img/room/6.png",
          "img/room/7.png",
          "img/room/8.png",
          "img/room/9.png",
          "img/room/10.png",
          "img/room/11.png",
          "img/room/12.png",
          "img/room/26.png",
          "img/room/121.png",
          "img/room/122.png",
          "img/room/123.png",
          "img/room/fon.jpg",
          "img/room/3333.png"
        ]);

        /**============ METHODS ================*/
        function startSlider() {
          $('#featured').orbit({
            'bullets': true,
            'timer': true,
            'animation': 'horizontal-slide'
          });
        }

        function startProgramm() {
          //console.time('prog');
          /** save first User entrance */
          MainServ.saveUserEntry();
          /** create order date */
          MainServ.createOrderData();
          /** set Curr Discounts */
          MainServ.setCurrDiscounts();

          /** set first Template */
          MainServ.setCurrTemplate();
          /** set Templates */
          MainServ.prepareTemplates(ProductStor.product.construction_type).then(function () {
            MainServ.prepareMainPage();
            /** start lamination filtering */
            MainServ.laminatFiltering();
            /** download all cities */
            if (GlobalStor.global.locations.cities.length === 1) {
              loginServ.downloadAllCities(1);
              GlobalStor.global.isLoader = 0;
              GlobalStor.global.startSlider = 0;
              //console.timeEnd('prog');

              $location.path('/main');
              GlobalStor.global.currOpenPage = '/main';
            }
            /** !!!! **/
            GlobalStor.global.loadDate = new Date();

            var global = LZString.compress(JSON.stringify(GlobalStor.global));
            var product = LZString.compress(JSON.stringify(ProductStor.product));
            var userInfo = LZString.compress(JSON.stringify(UserStor.userInfo));
            var design = LZString.compress(JSON.stringify(DesignStor.design));
            var aux = LZString.compress(JSON.stringify(AuxStor.aux));
            var order = LZString.compress(JSON.stringify(OrderStor.order));
            var history = LZString.compress(JSON.stringify(HistoryStor.history));

            localStorage.clear();

            localStorage.setItem('GlobalStor', global);
            localStorage.setItem('ProductStor', product);
            localStorage.setItem('UserStor', userInfo);
            localStorage.setItem('AuxStor', aux);
            localStorage.setItem('DesignStor', design);
            localStorage.setItem('OrderStor', order);
            localStorage.setItem('HistoryStor', history);


          });
        }


        function importDBfromServer() {
          //thisCtrl.isStartImport = 1;
          //      console.log('START Time!!!!!!', new Date(), new Date().getMilliseconds());
          localDB.importAllDB(UserStor.userInfo.phone, UserStor.userInfo.device_code).then(function (data) {
            if (data) {
              /** download all data */
              loginServ.downloadAllData().then(function () {
                startProgramm();
              });
              thisCtrl.isStartImport = 0;
            } else {
              console.log('Error!');
            }
          });
        }


        function setFactoryLocation(factories) {
          var factoryQty = factories.length,
            locationQty;
          while (--factoryQty > -1) {
            locationQty = GlobalStor.global.locations.cities.length;
            while (--locationQty > -1) {
              if (factories[factoryQty].city_id === GlobalStor.global.locations.cities[locationQty].cityId) {
                factories[factoryQty].location = GlobalStor.global.locations.cities[locationQty].fullLocation;
              }
            }
          }
          return factories;
        }


        function checkingFactory() {
          //------- set User Location
          loginServ.setUserLocation();
          if ((+UserStor.userInfo.factory_id) > 0) {
            loginServ.isLocalDBExist().then(function (data) {
              thisCtrl.isLocalDB = data;
              if (thisCtrl.isLocalDB) {
                //------- current FactoryId matches to user FactoryId, go to main page without importDB
                //TODO localDB.syncDb(UserStor.userInfo.phone, UserStor.userInfo.device_code).then(function() {
                /** download all data */
                loginServ.downloadAllData().then(function () {
                  startProgramm();
                });
                //});
              } else {
                //------ LocalDB is empty
                importDBfromServer(UserStor.userInfo.factory_id);
              }
            });
          } else {
            //---- show Factory List
            //----- collect city Ids regarding to user country
            loginServ.collectCityIdsAsCountry().then(function (cityIds) {
              localDB.importFactories(UserStor.userInfo.phone, UserStor.userInfo.device_code, cityIds)
                .then(function (result) {
                  //            console.log('Factories++++++', result);
                  GlobalStor.global.startSlider = 0;
                  GlobalStor.global.isLoader = 0;
                  if (result.status) {
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
          if (user.locked) {
            //------- clean all tables in LocalDB
            localDB.cleanLocalDB(localDB.tablesLocalDB).then(function (data) {
              if (data) {
                //------- creates all tables in LocalDB
                localDB.createTablesLocalDB(localDB.tablesLocalDB).then(function (data) {
                  if (data) {
                    //------- save user in LocalDB
                    localDB.insertRowLocalDB(user, localDB.tablesLocalDB.users.tableName);
                    //------- save user in Stor
                    angular.extend(UserStor.userInfo, user);
                    //------- import Location
                    localDB.importLocation(UserStor.userInfo.phone, UserStor.userInfo.device_code).then(function (data) {
                      if (data) {
                        //------ save Location Data in local obj
                        loginServ.prepareLocationToUse().then(function () {
                          checkingFactory();
                        });
                        var key = "UserStor.userInfo.phone";
                        var value = UserStor.userInfo.phone;
                        localforage.setItem(key, value, function (err, value) {
                        });
                        var key = "UserStor.userInfo.device_code";
                        var value = UserStor.userInfo.device_code;
                        localforage.setItem(key, value, function (err, value) {
                        });
                      }
                    });
                  }
                });
              }
            });
          } else {
            GlobalStor.global.isLoader = 0;
            GlobalStor.global.startSlider = 0;
            //---- show attantion
            thisCtrl.isUserNotActive = 1;
          }

        }


        function checkingUser() {
          localforage.setItem("FirstIn", "true", function (err, value) {
          });
          localDB.importUser(thisCtrl.user.phone).then(function (result) {
            //console.log(result);
            if (result.status) {
              var userTemp = angular.copy(result.user);
              startSlider();
              //console.log('USER!!!!!!!!!!!!', thisCtrl.user.phone, result);
              //---------- check user password
              var newUserPassword = localDB.md5(thisCtrl.user.password);
              if (newUserPassword === userTemp.password) {
                importDBProsses(userTemp);
                GlobalStor.global.startSlider = 1;
              } else {
                GlobalStor.global.isLoader = 0;
                GlobalStor.global.startSlider = 0;
                //---- user not exists
                thisCtrl.isUserPasswordError = 1;
              }
            } else {
              GlobalStor.global.isLoader = 0;
              GlobalStor.global.startSlider = 0;
              //---- user not exists
              thisCtrl.isUserNotExist = 1;
            }
          });

        }

        /**============== ENTRY BY LINK ===============*/
        function entryWithoutLogin() {
          var url = $location.search(),
            accessArr = [
              '7d537b6746f925b1703aefa9b8a9a4bc',
              '3f5f0c7d46d318e026f9ba60dceffc65',
              '799e078b084c6d57cea0b0d53a7e3008',
              '9aefeef9c7e53f9de9bb36f32649dc3f',
              'a2da6d85764368b24392740020efbc92',
              'ceb60bfed037baaa484bd7b88d274c98',
              '632b3213660804acb71fe045c6e321ed',
              'd11758b674ac02f0fcf128dcc906dbef',
              '8155bc545f84d9652f1012ef2bdfb6eb',
              '59e711d152de7bec7304a8c2ecaf9f0f',
              '877466ffd21fe26dd1b3366330b7b560',
              'f31c147335274c56d801f833d3c26a70',
              'f68ec4f0c6df90137749af75a929a3eb',
              '0f190e6e164eafe66f011073b4486975',
              'a9588aa82388c0579d8f74b4d02b895f',
              '66a516f865fca1c921dba625ede4a693',
              '7cebd0178b69b2e88774529e1e59a7b0',
              'ad1df793247a0e650d0d7166341b8d97',
              'ffc14b7acfd31440e19d0431d4ab0cba',
              '4736b2b496ba3de748c6eea6c6b9ca65',
              '15bbb9d0bbf25e8d2978de1168c749dc',

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
              '988a8fa4855bf7ea54057717655d3fc9',
              '82deec386376c6f81845e561f491e19a',
              'f427fe660e069c2a1d03db07126c95b7'

            ],
            phoneArr = [
              '0950604425',
              '0500505500',
              '78124541170',
              '22274313',
              '9201922876',
              '903528981',
              '9301600441',
              '89324310961',
              '1000000',
              '1000001',
              '1000002',
              '1000003',
              '1000004',
              '1000005',
              '1000006',
              '1000007',
              '1000008',
              '1000009',
              'wd-op',
              'op1',
              'Website',

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
              '000028',
              'vikna',
              '5371'
            ],
            passwordArr = [
              '0950604425',
              '0500505500',
              '78124541170',
              '22274313',
              '9201922876',
              '903528981',
              '9301600441',
              '89324310961',
              '1000000',
              '1000001',
              '1000002',
              '1000003',
              '1000004',
              '1000005',
              '1000006',
              '1000007',
              '1000008',
              '1000009',
              'wd-op',
              'op1op1',
              'Website',

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
              '000028',
              'vikna',
              '5371'
            ],
            accessQty = accessArr.length,
            isCustomer = 0;
          if (checkSavedData()) {
            fastEnter(url);
          } else {
            if (url.access) {
              //setTimeout(function () {
              while (accessQty > -1) {
                accessQty -= 1;
                if (accessArr[accessQty] === url.access) {
                  thisCtrl.user.phone = phoneArr[accessQty];
                  thisCtrl.user.password = passwordArr[accessQty];
                  isCustomer = 1;
                }
              }

              if (isCustomer) {
                if (thisCtrl.user.phone && thisCtrl.user.password) {
                  GlobalStor.global.loadDate = new Date();
                  GlobalStor.global.isLoader = 1;
                  GlobalStor.global.startSlider = 1;
                  loader();
                  checkingUser();
                }
              } else {
                GlobalStor.global.loadDate = new Date();
                GlobalStor.global.isLoader = 1;
                GlobalStor.global.startSlider = 1;
                loader();
                localDB.importUser(url.access, 1).then(function (result) {
                  var userTemp = angular.copy(result.user);
                  GlobalStor.global.isLoader = 1;
                  GlobalStor.global.startSlider = 1;
                  importDBProsses(userTemp);
                });
              }
              //},1000);
            }
            if (url.autologin) {
              GlobalStor.global.loadDate = new Date();
              GlobalStor.global.isLoader = 1;
              GlobalStor.global.startSlider = 1;
              loader();
              localDB.importUser(url.autologin, 1).then(function (result) {
                if (result.status) {
                  var userTemp = angular.copy(result.user);
                  GlobalStor.global.isLoader = 1;
                  GlobalStor.global.startSlider = 1;
                  importDBProsses(userTemp);
                } else {
                  thisCtrl.isUserNotExist = 1;
                  GlobalStor.global.isLoader = 0;
                  GlobalStor.global.startSlider = 0;
                }
              });
            }
          }
        }


        function closeOfflineAlert() {
          thisCtrl.isOffline = false;
        }


        /** =========== SIGN IN ======== */
        function loader() {
          if (GlobalStor.global.isLoader3 === 1) {
            if (GlobalStor.global.isLoader === 1) {
              GlobalStor.global.isLoader3 = 0
            }
          }
          if (GlobalStor.global.isLoader3 === 0) {
            $timeout(function () {
              GlobalStor.global.isLoader3 = 1
            }, 1)
            $timeout(function () {
              GlobalStor.global.isLoader2 = 0
            }, 1)
            $timeout(function () {
              GlobalStor.global.isLoader2 = 25
            }, 100)
            $timeout(function () {
              GlobalStor.global.isLoader2 = 40
            }, 1500)
            $timeout(function () {
              GlobalStor.global.isLoader2 = 65
            }, 3000)
            $timeout(function () {
              GlobalStor.global.isLoader2 = 90
            }, 4000)
            $timeout(function () {
              GlobalStor.global.isLoader2 = 94
            }, 7000)
            $timeout(function () {
              GlobalStor.global.isLoader2 = 95
            }, 9000)
            $timeout(function () {
              GlobalStor.global.isLoader2 = 96
            }, 11000)
            $timeout(function () {
              GlobalStor.global.isLoader2 = 97
            }, 15000)
            $timeout(function () {
              GlobalStor.global.isLoader2 = 98
            }, 21000)
            $timeout(function () {
              GlobalStor.global.isLoader2 = 99
            }, 30000)
            $timeout(function () {
              GlobalStor.global.isLoader3 = 0
            }, 31000)
          }
        }

        function formatDate(date) {
          var year = date.getFullYear();
          var month = date.getMonth() + 1;
          if (month < 10) month = "0" + month;
          var day = date.getDate();
          if (day < 10) day = "0" + day;
          return "\n" + year + "-" + month + "-" + day + "\n";
        }

        if (window.location.hash.length > 10) {
          loader()
        }
        if (!GlobalStor.global.onlineMode && !navigator.onLine) {
          localforage.getItem("UserStor.userInfo.phone", function (err, value) {
            UserStor.userInfo.phone = value;
          });

          localforage.getItem("UserStor.userInfo.device_code", function (err, value) {
            UserStor.userInfo.device_code = value;
          });
        }
        //$(".i").hide();
        $(".print-conteiner").hide();
        var FirstIn = "true";
        localforage.getItem("FirstIn", function (err, value) {
          if (value !== "true") {
            $("#updateDBcheck").prop("checked", true);
            GlobalStor.global.loadDate = new Date();
            localforage.setItem("loadDate", GlobalStor.global.loadDate, function (err, value) {
            });
            /** **/
          } else {
            $(".i").show();
            localforage.getItem("loadDate", function (err, value) {
              GlobalStor.global.loadDate = new Date(value);
            });
          }
        });

        function enterForm(form) {
          var newUserPassword;
          //console.log('@@@@@@@@@@@@=', typethisCtrl.user.phone, thisCtrl.user.password);
          //------ Trigger validation flag.
          thisCtrl.submitted = 1;
          if (form.$valid) {
            localforage.getItem("analitics", function (err, value) {
              if (value) {
                GlobalStor.global.analitics_storage.push(value);
                // console.log(JSON.stringify(GlobalStor.global.analitics_storage));
                // console.log(GlobalStor.global.analitics_storage);
              }
            });
            //noinspection JSAnnotator
            function enterFormSubmit() {
              GlobalStor.global.isLoader = 1;
              GlobalStor.global.startSlider = 1;
              loader();
              //------ check Internet
              //TODO thisCtrl.isOnline = $cordovaNetwork.isOnline();
              //if (navigator.onLine){    thisCtrl.isOnline = 1;} else {    thisCtrl.isOnline = 0;}
              if (thisCtrl.isOnline) {
                if ($("#updateDBcheck").prop("checked")) {
                  if (GlobalStor.global.onlineMode && navigator.onLine) {
                    HistoryServ.synchronizeOrders().then(function () {
                      GlobalStor.global.isLoader = 1;
                      GlobalStor.global.startSlider = 1;
                      checkingUser();
                    });
                  } else {
                    GlobalStor.global.isLoader = 0;
                    GlobalStor.global.startSlider = 0;
                    thisCtrl.isOfflineImport = 1;
                  }
                }
                else {
                  //------- check available Local DB
                  //for offline work
                  loginServ.isLocalDBExist().then(function (data) {
                    thisCtrl.isLocalDB = data;
                    if (thisCtrl.isLocalDB) {
                      //======== SYNC
                      console.log('SYNC');
                      //---- checking user in LocalDB
                      localDB.selectLocalDB(localDB.tablesLocalDB.users.tableName, {'phone': thisCtrl.user.phone})
                        .then(function (data) {
                          //---- user exists
                          if (data.length) {
                            //---------- check user password
                            newUserPassword = localDB.md5(thisCtrl.user.password);
                            if (newUserPassword === data[0].password) {
                              //----- checking user activation
                              if (data[0].locked) {
                                startSlider();
                                angular.extend(UserStor.userInfo, data[0]);
                                //------- set User Location
                                loginServ.prepareLocationToUse().then(function () {
                                  checkingFactory();
                                });

                              } else {
                                GlobalStor.global.startSlider = 0;
                                GlobalStor.global.isLoader = 0;
                                //---- show attantion
                                thisCtrl.isUserNotActive = 1;
                              }
                            } else {
                              GlobalStor.global.isLoader = 0;
                              GlobalStor.global.startSlider = 0;
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
                }


                //-------- check LocalDB
              } else if (thisCtrl.isLocalDB) {
                console.log('OFFLINE');
                //---- checking user in LocalDB
                localDB.selectLocalDB(localDB.tablesLocalDB.users.tableName, {'phone': thisCtrl.user.phone})
                  .then(function (data) {
                    //---- user exists
                    if (data.length) {
                      //---------- check user password
                      var newUserPassword = localDB.md5(thisCtrl.user.password);
                      if (newUserPassword === data[0].password) {
                        //----- checking user activation
                        if (data[0].locked) {
                          //------- checking user FactoryId
                          if (data[0].factory_id > 0) {
                            angular.extend(UserStor.userInfo, data[0]);
                            //------- set User Location
                            loginServ.prepareLocationToUse().then(function () {
                              loginServ.setUserLocation();
                              /** download all data */
                              loginServ.downloadAllData().then(function () {
                                startProgramm();
                              });
                            });
                          } else {
                            GlobalStor.global.startSlider = 0;
                            GlobalStor.global.isLoader = 0;
                            thisCtrl.isOffline = 1;
                          }
                        } else {
                          GlobalStor.global.startSlider = 0;
                          GlobalStor.global.isLoader = 0;
                          //---- show attantion
                          thisCtrl.isUserNotActive = 1;
                        }
                      } else {
                        GlobalStor.global.startSlider = 0;
                        GlobalStor.global.isLoader = 0;
                        //---- user not exists
                        thisCtrl.isUserPasswordError = 1;
                      }
                    } else {
                      GlobalStor.global.startSlider = 0;
                      GlobalStor.global.isLoader = 0;
                      //---- user not exists
                      thisCtrl.isUserNotExist = 1;
                    }
                  });

              } else {
                GlobalStor.global.startSlider = 0;
                GlobalStor.global.isLoader = 0;
                thisCtrl.isOffline = 1;
              }
            }

            if (GlobalStor.global.ISEXT) {
              if (!$("#updateDBcheck").prop("checked")) {
                var curDate = new Date();
                if (curDate.getFullYear() == GlobalStor.global.loadDate.getFullYear()) {
                  if (curDate.getMonth() == GlobalStor.global.loadDate.getMonth()) {
                    if (curDate.getDate() > GlobalStor.global.loadDate.getDate()) {
                      getAlert();
                    } else {
                      enterFormSubmit();
                    }
                  } else {
                    getAlert();
                  }

                } else {
                  getAlert();
                }
              } else {
                enterFormSubmit();
              }
            }
            else {
              //console.log("обновляем");
              GlobalStor.global.loadDate = new Date();
              GlobalStor.global.isLoader = 1;
              GlobalStor.global.startSlider = 1;
              loader();
              checkingUser();
            }
            //noinspection JSAnnotator
            function getAlert() {
              GeneralServ.syncAlert(
                thisCtrl.SYNC_INFO_P1 + formatDate(GlobalStor.global.loadDate) + thisCtrl.SYNC_INFO_P2,
                enterFormSubmit
              );
              GeneralServ.confirmPath(
                enterFormSubmit
              );
            }
          }
        }

//********************


        /**--------- FACTORIES ------------*/

        function selectFactory() {
          if (thisCtrl.user.factoryId > 0) {
            //TODO thisCtrl.isOnline = $cordovaNetwork.isOnline();
            if (thisCtrl.isOnline) {
              GlobalStor.global.startSlider = 1;
              GlobalStor.global.isLoader = 1;
              //-------- send selected Factory Id in Server
              UserStor.userInfo.factory_id = angular.copy(thisCtrl.user.factoryId);
//                  console.log(UserStor.userInfo.factory_id);
              //----- update factoryId in LocalDB & Server
              localDB.updateLocalServerDBs(
                localDB.tablesLocalDB.users.tableName, UserStor.userInfo.id, {factory_id: UserStor.userInfo.factory_id}
              ).then(function () {
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
          if (thisCtrl.isOnline) {
            //------- check available Local DB
            loginServ.isLocalDBExist().then(function (data) {
              thisCtrl.isLocalDB = data;
//          console.log('REG', data);
              //------ if locations is not exists refresh Location and Users
              if (thisCtrl.isLocalDB) {
                GlobalStor.global.isLoader = 1;
                loginServ.prepareLocationToUse(1).then(function () {
                  GlobalStor.global.isLoader = 0;
                  thisCtrl.isRegistration = 1;
                });
              } else {
                GlobalStor.global.isLoader = 1;
                //------- clean all tables in LocalDB
                localDB.cleanLocalDB(localDB.tablesLocalDB).then(function (data) {
                  if (data) {
                    //------- creates all tables in LocalDB
                    localDB.createTablesLocalDB(localDB.tablesLocationLocalDB).then(function (data) {
                      if (data) {
                        //------- import Location
                        localDB.importLocation().then(function (data) {
                          if (data) {
                            //------ save Location Data in local obj
                            loginServ.prepareLocationToUse(1).then(function () {
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
            if (thisCtrl.isOnline) {
              GlobalStor.global.isLoader = 1;
              //--- checking user in server
              localDB.importUser(thisCtrl.user.phone).then(function (result) {
                if (result.status) {
                  GlobalStor.global.isLoader = 0;
                  //---- show attantion
                  thisCtrl.isUserExist = 1;
                } else {
                  var userData = {
                    name: thisCtrl.user.name,
                    phone: thisCtrl.user.phone,
                    email: thisCtrl.user.mail,
                    cityId: thisCtrl.user.city.cityId,
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
          if (!thisCtrl.user.country) {
            delete thisCtrl.user.region;
            delete thisCtrl.user.city;
          } else if (!thisCtrl.user.region) {
            delete thisCtrl.user.city;
          }
        }

        function gotoSettingsPage() {
          if (window.location.hash.length < 10) {
            if (GlobalStor.global.gotoSettingsPage === 0) {
              $timeout(function () {
                $location.path('/change-lang');
              }, 1);
              $timeout(function () {
                $location.path('/');
              }, 1);
              GlobalStor.global.gotoSettingsPage = 1;
            }
          } else {
            GlobalStor.global.gotoSettingsPage = 1;
          }
        }

        setTimeout(function () {
          $('#jssj').trigger('click');
        }, 1000);

        function checkSavedData() {
          var order = localStorage.getItem("OrderStor");
          var product = localStorage.getItem("ProductStor");
          var aux = localStorage.getItem("AuxStor");
          var design = localStorage.getItem("DesignStor");
          var user = localStorage.getItem("UserStor");
          var global = localStorage.getItem("GlobalStor");
          var history = localStorage.getItem("HistoryStor");

          if (order && product && aux && design && user && global && history) {
            var loadDate = new Date(Date.parse(JSON.parse(LZString.decompress(global)).loadDate));
            var checkDate = loadDate.getFullYear() + "" + loadDate.getMonth() + "" + loadDate.getDate();
            var curDate = new Date().getFullYear() + "" + new Date().getMonth() + "" + new Date().getDate();
            if ((curDate === checkDate)) {
              console.log("типа все ок");
              return true;
            } else {
              console.log("разные даты");
              return false;
            }
          } else {
            console.log("не все данные сохранены");
            return false;
          }
        }


        function fastEnter(url) {
          GlobalStor.global.isLoader = 0;
          GlobalStor.global.startSlider = 0;
          if (url.orderEdit) {
            HistoryStor.history.orderEdit = 2;
            HistoryServ.reqResult().then(function () {
              HistoryServ.editOrder(1, url.orderEdit);
            });
          } else {
            $location.path(GlobalStor.global.currOpenPage);
          }

        }


        /**========== FINISH ==========*/


        //------ clicking
        thisCtrl.gotoSettingsPage = gotoSettingsPage;
        thisCtrl.switchRegistration = switchRegistration;
        thisCtrl.closeRegistration = closeRegistration;
        thisCtrl.enterForm = enterForm;
        thisCtrl.loader = loader;
        thisCtrl.registrForm = registrForm;
        thisCtrl.selectLocation = selectLocation;
        thisCtrl.selectFactory = selectFactory;
        thisCtrl.closeFactoryDialog = closeFactoryDialog;
        thisCtrl.closeOfflineAlert = closeOfflineAlert;
        thisCtrl.startSlider = startSlider;


        //------- defined system language
        loginServ.getDeviceLanguage();


        //------- export data
        if (thisCtrl.isOnline) {
          loginServ.initExport();
          entryWithoutLogin();

        }


      });
})();