(function () {
  'use strict';
  /**@ngInject*/
  angular
    .module('LoginModule')
    .controller('LoginCtrl',
      function ($location,
        $timeout,
        $rootScope,
        $route,
        $http,
        // $cordovaNetwork,
        $filter,
        $translate,
        $q,
        GlobalStor,
        ProductStor,
        OrderStor,
        AuxStor,
        DesignStor,
        UserStor,
        HistoryStor,
        CartStor,
        globalConstants,
        localDB,
        loginServ,
        MainServ,
        SettingServ,
        HistoryServ,
        GeneralServ) {
        /*jshint validthis:true */
        var thisCtrl = this;
        thisCtrl.G = GlobalStor;
        thisCtrl.consts = globalConstants;


        //TODO thisCtrl.isOnline = $cordovaNetwork.isOnline();

        thisCtrl.showTerms = false;
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
        thisCtrl.countries = 0;
        thisCtrl.registration_data = {
          email: '',
          name: ''
        }
        thisCtrl.selected_country = 0;
        thisCtrl.email_required = 0;
        thisCtrl.isConfirmRegistration = 0;


        /** PING SERVER*/
        MainServ.getOnline();
        //------- translate
        thisCtrl.TITLE = $filter('translate')('login.TITLE');
        thisCtrl.PLAN_A = $filter('translate')('login.PLAN_A');
        thisCtrl.PLAN_B = $filter('translate')('login.PLAN_B');
        thisCtrl.PLAN_C = $filter('translate')('login.PLAN_C');
        thisCtrl.PLAN_G = $filter('translate')('login.PLAN_G');
        thisCtrl.TITLE_INFO = $filter('translate')('login.TITLE_INFO');
        thisCtrl.A_TITLE = $filter('translate')('login.A_TITLE');
        thisCtrl.A_TITLE_PRETEXT = $filter('translate')('login.A_TITLE_PRETEXT');
        thisCtrl.A_TITLE_TEXT_1 = $filter('translate')('login.A_TITLE_TEXT_1');
        thisCtrl.A_TITLE_TEXT_2 = $filter('translate')('login.A_TITLE_TEXT_2');
        thisCtrl.A_TITLE_TEXT_3 = $filter('translate')('login.A_TITLE_TEXT_3');
        thisCtrl.A_TITLE_TEXT_4 = $filter('translate')('login.A_TITLE_TEXT_4');
        thisCtrl.B_TITLE = $filter('translate')('login.B_TITLE');
        thisCtrl.B_TITLE_TEXT_1 = $filter('translate')('login.B_TITLE_TEXT_1');
        thisCtrl.B_TITLE_TEXT_2 = $filter('translate')('login.B_TITLE_TEXT_2');
        thisCtrl.B_TITLE_TEXT_3 = $filter('translate')('login.B_TITLE_TEXT_3');
        thisCtrl.B_TITLE_TEXT_4 = $filter('translate')('login.B_TITLE_TEXT_4');
        thisCtrl.B_TITLE_TEXT_5 = $filter('translate')('login.B_TITLE_TEXT_5');
        thisCtrl.B_TITLE_TEXT_6 = $filter('translate')('login.B_TITLE_TEXT_6');
        thisCtrl.B_TITLE_TEXT_7 = $filter('translate')('login.B_TITLE_TEXT_7');
        thisCtrl.C_TITLE = $filter('translate')('login.C_TITLE');
        thisCtrl.C_TITLE_TEXT_1 = $filter('translate')('login.C_TITLE_TEXT_1');
        thisCtrl.C_TITLE_TEXT_2 = $filter('translate')('login.C_TITLE_TEXT_2');
        thisCtrl.C_TITLE_TEXT_3 = $filter('translate')('login.C_TITLE_TEXT_3');
        thisCtrl.C_TITLE_TEXT_4 = $filter('translate')('login.C_TITLE_TEXT_4');
        thisCtrl.C_TITLE_TEXT_5 = $filter('translate')('login.C_TITLE_TEXT_5');
        thisCtrl.G_TITLE = $filter('translate')('login.G_TITLE');
        thisCtrl.G_TITLE_TEXT_1 = $filter('translate')('login.G_TITLE_TEXT_1');
        thisCtrl.G_TITLE_TEXT_2 = $filter('translate')('login.G_TITLE_TEXT_2');
        thisCtrl.G_TITLE_TEXT_3 = $filter('translate')('login.G_TITLE_TEXT_3');
        thisCtrl.G_TITLE_TEXT_4 = $filter('translate')('login.G_TITLE_TEXT_4');
        thisCtrl.G_TITLE_TEXT_5 = $filter('translate')('login.G_TITLE_TEXT_5');
        thisCtrl.G_TITLE_TEXT_6 = $filter('translate')('login.G_TITLE_TEXT_6');
        thisCtrl.G_TITLE_TEXT_7 = $filter('translate')('login.G_TITLE_TEXT_7');
        thisCtrl.G_TITLE_TEXT_8 = $filter('translate')('login.G_TITLE_TEXT_8');
        thisCtrl.BACK = $filter('translate')('login.BACK');
        thisCtrl.LOADER_TEXT1 = $filter('translate')('login.LOADER_TEXT1');
        thisCtrl.LOADER_TEXT2 = $filter('translate')('login.LOADER_TEXT2');
        thisCtrl.LOADER_TEXT3 = $filter('translate')('login.LOADER_TEXT3');
        thisCtrl.OFFLINE = $filter('translate')('login.OFFLINE');
        thisCtrl.OK = $filter('translate')('common_words.OK');
        thisCtrl.USER_CHECK_EMAIL = $filter('translate')('login.USER_CHECK_EMAIL');
        thisCtrl.USER_NOT_EXIST = $filter('translate')('login.USER_NOT_EXIST');
        thisCtrl.USER_NOT_ACTIVE = $filter('translate')('login.USER_NOT_ACTIVE');
        thisCtrl.USER_PASSWORD_ERROR = $filter('translate')('login.USER_PASSWORD_ERROR');
        thisCtrl.BY_PRESSING_ENTER = $filter('translate')('login.BY_PRESSING_ENTER');
        thisCtrl.PRIVACY_POLICY = $filter('translate')('login.PRIVACY_POLICY');
        thisCtrl.IMPORT_DB = $filter('translate')('login.IMPORT_DB');
        thisCtrl.LOGIN = $filter('translate')('login.LOGIN');
        thisCtrl.PASSWORD = $filter('translate')('login.PASSWORD');
        thisCtrl.EMPTY_FIELD = $filter('translate')('login.EMPTY_FIELD');
        thisCtrl.WRONG_LOGIN = $filter('translate')('login.WRONG_LOGIN');
        thisCtrl.ENTER = $filter('translate')('login.ENTER');
        thisCtrl.REGISTRATION = $filter('translate')('login.REGISTRATION');
        thisCtrl.REGISTRATION_INFO = $filter('translate')('login.REGISTRATION_INFO');
        thisCtrl.REGISTRATION_LOGIN_EMAIL = $filter('translate')('login.REGISTRATION_LOGIN_EMAIL');
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
        thisCtrl.WINDOW_COST = $filter('translate')('login.WINDOW_COST');
        thisCtrl.CONTACT_US = $filter('translate')('login.CONTACT_US');

        thisCtrl.TEST_USER = $filter('translate')('login.TEST_USER');
        thisCtrl.TEST_USER_LOGIN = $filter('translate')('login.TEST_USER_LOGIN');
        thisCtrl.TEST_USER_PASS = $filter('translate')('login.TEST_USER_PASS');

        thisCtrl.ATENTION = $filter('translate')('natification.ATENTION');
        /** reload room img */

        //$("<img />").attr("src", "img/room/1.png");
        //$("<img />").attr("src", "img/room/33.gif");
        //$("<img />").attr("src", "img/room/333.gif");
        let app = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;

        function preloadImages(array) {
          if (!app) {
            if (!preloadImages.list) {
              preloadImages.list = [];
            }
            var list = preloadImages.list,
              i, img;
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
        }

        preloadImages([
          "./img/room/1.png",
          "./img/room/4.png",
          "./img/room/6.png",
          "./img/room/7.png",
          "./img/room/8.png",
          "./img/room/9.png",
          "./img/room/10.png",
          "./img/room/11.png",
          "./img/room/12.png",
          "./img/room/26.png",
          "./img/room/121.png",
          "./img/room/122.png",
          "./img/room/123.png",
          "./img/room/fon.jpg",
          "./img/room/3333.png"
        ]);

        /**============ METHODS ================*/

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
          // console.time('prepareTemplates');
          MainServ.prepareTemplates(ProductStor.product.construction_type).then(function () {
            // console.timeEnd('prepareTemplates');
            MainServ.prepareMainPage();
            /** start lamination filtering */
            MainServ.laminatFiltering();
            /** download all cities */
            //   loginServ.downloadAllCities(1);
            GlobalStor.global.isLoader = 0;
            GlobalStor.global.startSlider = 0;
            //console.timeEnd('prog');

            if (UserStor.userInfo.user_type === 8) {
              if (window.matchMedia("(orientation: portrait)").matches) {
                GlobalStor.global.currOpenPage = 'mobile';
              } else {
                GlobalStor.global.currOpenPage = 'light';
                GlobalStor.global.isLightVersion = 1;
              }
            } else {
              GlobalStor.global.isLightVersion = 0;
              if (window.matchMedia("(orientation: portrait)").matches) {
                GlobalStor.global.currOpenPage = 'mobile';
              } else {
                GlobalStor.global.currOpenPage = 'main';
              }
            }

            /** !!!! **/

            let deviceType = (navigator.userAgent.match(/iPad/i)) == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i)) == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";
            if (app) {
              if (deviceType !== 'iPad' && deviceType !== 'iPhone') {
                saveCache();
              }
            } else {
              saveCache();
            }

            $location.path("/" + GlobalStor.global.currOpenPage);
            GlobalStor.global.ISLOGIN = 0;
          });
        }

        function saveCache() {
          GlobalStor.global.loadDate = new Date();
          var global = LZString.compressToUTF16(JSON.stringify(GlobalStor.global));
          var product = LZString.compressToUTF16(JSON.stringify(ProductStor.product));
          var userInfo = LZString.compressToUTF16(JSON.stringify(UserStor.userInfo));
          var design = LZString.compressToUTF16(JSON.stringify(DesignStor.design));
          var aux = LZString.compressToUTF16(JSON.stringify(AuxStor.aux));
          var order = LZString.compressToUTF16(JSON.stringify(OrderStor.order));
          console.log("configuration finished. get ready to rock");
          window.localStorage.clear();
          window.localStorage.setItem('GlobalStor', global);
          window.localStorage.setItem('ProductStor', product);
          window.localStorage.setItem('UserStor', userInfo);
          window.localStorage.setItem('AuxStor', aux);
          window.localStorage.setItem('DesignStor', design);
          window.localStorage.setItem('OrderStor', order);
        }

        function importDBfromServer() {
          //thisCtrl.isStartImport = 1;
          //      console.log('START Time!!!!!!', new Date(), new Date().getMilliseconds());
          // console.time('importAllDB');
          localDB.importAllDB(UserStor.userInfo.phone, UserStor.userInfo.device_code).then(function (data) {
            if (data) {
              /** download all data */
              loginServ.downloadAllData().then(function () {
                startProgramm();
              });
              thisCtrl.isStartImport = 0;
            } else {
              console.log('Error!');
              thisCtrl.unexpectedError = 1;
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
            // console.time('isLocalDBExist');
            // console.timeEnd('isLocalDBExist');
            if (thisCtrl.isLocalDB) {
              //------- current FactoryId matches to user FactoryId, go to main page without importDB
              //TODO localDB.syncDb(UserStor.userInfo.phone, UserStor.userInfo.device_code).then(function() {
              /** download all data */
              // console.time('downloadAllData');
              loginServ.downloadAllData().then(function () {
                // console.timeEnd('downloadAllData');
                startProgramm();
              });
              //});
            } else {
              //------ LocalDB is empty
              importDBfromServer(UserStor.userInfo.factory_id);
            }
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
            angular.extend(UserStor.userInfo, user);
            //------- import Location
            // console.time('importLocation');
            localDB.importLocation(UserStor.userInfo.phone, UserStor.userInfo.device_code).then(function (data) {
              if (data) {
                //------ save Location Data in local obj
                // console.time('prepareLocationToUse');
                loginServ.prepareLocationToUse(data).then(function () {
                  checkingFactory();
                });
                var key = "UserStor.userInfo.phone";
                var value = UserStor.userInfo.phone;
                localDB.db.setItem(key, value, function (err, value) { });
                var key = "UserStor.userInfo.device_code";
                var value = UserStor.userInfo.device_code;
                localDB.db.setItem(key, value, function (err, value) { });
              } else {
                GlobalStor.global.isLoader = 0;
                GlobalStor.global.startSlider = 0;
                thisCtrl.unexpectedError = 1;
              }
            });
          } else {
            GlobalStor.global.isLoader = 0;
            GlobalStor.global.startSlider = 0;
            //---- show attantion
            thisCtrl.isUserNotActive = 1;
          }
        }


        function checkingUser(DemoLogin, DemoPass) {
          GlobalStor.global.ISLOGIN = 1;
          localDB.db.setItem("FirstIn", "true", function (err, value) { });
          // console.log('importUser');
          let login = 'DemoRU';
          let pass = 'DemoRU';
          if (DemoLogin) {
            login = DemoLogin;
            pass = DemoPass;
          } else {
            login = thisCtrl.user.phone;
            pass = thisCtrl.user.password;
          }

          localDB.importUser(login).then(function (result) {
            if (result.status) {
              var userTemp = angular.copy(result.user);
              //console.log('USER!!!!!!!!!!!!', thisCtrl.user.phone, result);
              //---------- check user password
              var newUserPassword = localDB.md5(pass);
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
                  // loader();
                  checkingUser();
                }
              } else {
                GlobalStor.global.loadDate = new Date();
                GlobalStor.global.isLoader = 1;
                GlobalStor.global.startSlider = 1;
                // loader();
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
              // loader();
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

        function loaderChange(state, time) {
          GlobalStor.global.isLoader2 = state;
          if (state <= 98) {
            $timeout(function () {
              loaderChange(++state)
            }, temp)
          }
        }

        let temp;

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
            temp = (240 / 99) * 1000;
            loaderChange(1, temp)
          }
        }


        if (window.location.hash.length > 10) {
          // loader()
        }
        if (!GlobalStor.global.onlineMode && !navigator.onLine) {
          localDB.db.getItem("UserStor.userInfo.phone", function (err, value) {
            UserStor.userInfo.phone = value;
          });

          localDB.db.getItem("UserStor.userInfo.device_code", function (err, value) {
            UserStor.userInfo.device_code = value;
          });
        }
        //$(".i").hide();
        $(".print-conteiner").hide();
        var FirstIn = "true";
        localDB.db.getItem("FirstIn", function (err, value) {
          if (value !== "true") {
            GlobalStor.global.loadDate = new Date();
            localDB.db.setItem("loadDate", GlobalStor.global.loadDate, function (err, value) { });
            /** **/
          } else {
            localDB.db.getItem("loadDate", function (err, value) {
              GlobalStor.global.loadDate = new Date(value);
            });
          }
        });


        function enterForm(form) {
          thisCtrl.submitted = 1;

          if (form.$valid) {


            if (navigator.onLine) {
              GlobalStor.global.loadDate = new Date();
              GlobalStor.global.isLoader = 1;
              GlobalStor.global.startSlider = 1;
              checkingUser();
              // if (new Date("2018-08-01") >= new Date()) {
              // } else {
              //     GeneralServ.infoAlert(thisCtrl.ATENTION, 'Тестовое время работы истекло. Установите актуальную версию приложения');
              // }
            } else {
              thisCtrl.isOfflineImport = 1;
            }

            // localforage.getItem("analitics", function (err, value) {
            //   if (value) {
            //     GlobalStor.global.analitics_storage.push(value);
            //     // console.log(JSON.stringify(GlobalStor.global.analitics_storage));
            //     // console.log(GlobalStor.global.analitics_storage);
            //   }
            // });
          }
        }

        document.addEventListener("deviceready", onDeviceReady, false);

        function onDeviceReady() {
          GlobalStor.global.cordova = window.cordova;
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
                "users", UserStor.userInfo.id, {
                  factory_id: UserStor.userInfo.factory_id
                }
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
                // localDB.cleanLocalDB(localDB.tablesLocalDB).then(function (data) {
                //   if (data) {
                //     //------- creates all tables in LocalDB
                //     localDB.createTablesLocalDB(localDB.tablesLocationLocalDB).then(function (data) {
                //       if (data) {
                //         //------- import Location
                //         localDB.importLocation().then(function (data) {
                //           if (data) {
                //             //------ save Location Data in local obj
                //             loginServ.prepareLocationToUse(1).then(function () {
                //               GlobalStor.global.isLoader = 0;
                //               thisCtrl.isRegistration = 1;
                //             });
                //           }
                //         });
                //       }
                //     });
                //   }
                // });
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
          thisCtrl.email_required = 0;
        }

        function registrForm(form) {
          // Trigger validation flag.
          thisCtrl.submitted = true;
          if (form.$valid) {
            if (thisCtrl.registration_data.selected_country > 0) {
              GlobalStor.global.isLoader = 1;
              let url;
              if (globalConstants.serverIP === 'http://api.steko.com.ua') {
                url = `http://export.steko.com.ua/api/wc/?name=${thisCtrl.registration_data.name}&country=${thisCtrl.registration_data.selected_country}&email=${thisCtrl.registration_data.email}`;
              } else {
                url = `https://windowscalculator.net/api/wc/?name=${thisCtrl.registration_data.name}&country=${thisCtrl.registration_data.selected_country}&email=${thisCtrl.registration_data.email}`;
              }
              $http
                .get(url)
                .then(
                  (result) => {
                    GlobalStor.global.isLoader = 0;
                    thisCtrl.isRegistration = 0;
                    thisCtrl.isConfirmRegistration = 1;
                  },
                  function () {

                  }
                );
            } else {
              thisCtrl.email_required = 1;
            }
          } else {
            if (thisCtrl.registration_data.selected_country === 0) {
              thisCtrl.email_required = 1;
            }
          }
        }

        function ShowTerms() {
          thisCtrl.showTerms = !thisCtrl.showTerms;
          console.log(thisCtrl.showTerms)
        }

        function DemoLogin() {
          let login, pass;

          switch (+thisCtrl.registration_data.selected_country) {
            case 1:
              login = '000003';
              pass = '000003';
              break;
            case 2:
            case 3:
            case 5:
            case 9:
            case 12:
            case 25:
            case 72:
            case 145:
            case 173:
            case 203:
            case 214:
            case 217:
              {
                login = 'DemoRU';
                pass = 'DemoRU';
                break;
              }
            case 7:
            case 10:
            case 97:
            case 139:
            case 154:
              {
                login = '2222';
                pass = '2222';
                break;
              }

            default:
              {
                login = 'Website';
                pass = 'Website';
                break;
              }

          }

          if (globalConstants.serverIP == 'http://api.steko.com.ua') {
            login = '000003';
            pass = '000003';
          }
          if (navigator.onLine) {
            GlobalStor.global.loadDate = new Date();
            GlobalStor.global.isLoader = 1;
            GlobalStor.global.startSlider = 1;
            thisCtrl.isConfirmRegistration = 0;
            console.log('login, pass', login, pass)
            checkingUser(login, pass);
          }
        }
        //--------- if was empty option selected in select after choosing
        function selectLocation(id) {
          thisCtrl.email_required = 0;
          thisCtrl.registration_data.selected_country = thisCtrl.selected_country.id;
          console.log('country id ', thisCtrl.registration_data.selected_country);
        }

        function registration() {
          GlobalStor.global.isLoader = 1;
          let url, name;
          if (globalConstants.serverIP == 'http://api.steko.com.ua') {
            url = "http://export.steko.com.ua/api/wc/?task=region";
            name = thisCtrl.SELECT_REGION;
          } else {
            url = 'https://windowscalculator.net/api/wc/?task=country';
            name = thisCtrl.SELECT_COUNTRY;
          }
          $http
            .post(url)
            .then(
              function (result) {
                console.log("result", result)
                thisCtrl.countries = result.data;
                thisCtrl.countries.unshift({
                  'id': '0',
                  'name': name
                });
                thisCtrl.registration_data.selected_country = 0;
                thisCtrl.isRegistration = 1;
                GlobalStor.global.isLoader = 0;

              },
              function () {

              }
            );
        }

        function gotoSettingsPage() {
          let app = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;
          if (window.location.hash.length < 10 || app) {
            if (GlobalStor.global.gotoSettingsPage === 0) {
              $timeout(function () {
                $location.path('/change-lang');
              }, 1);
              $timeout(function () {
                $location.path("/");
              }, 1);
              GlobalStor.global.gotoSettingsPage = 1;
            }
          } else {
            GlobalStor.global.gotoSettingsPage = 1;
          }
        }

        setTimeout(function () {
          $('#jssj').trigger('click');
        }, 500);

        function checkSavedData() {
          var order = window.localStorage.getItem("OrderStor");
          var product = window.localStorage.getItem("ProductStor");
          var aux = window.localStorage.getItem("AuxStor");
          var design = window.localStorage.getItem("DesignStor");
          var user = window.localStorage.getItem("UserStor");
          var global = window.localStorage.getItem("GlobalStor");

          if (product && user && global && design && order && aux) {
            localDB.getSavedLocation();
            var loadDate = new Date(Date.parse(JSON.parse(LZString.decompressFromUTF16(global)).loadDate));
            var checkDate = loadDate.getFullYear() + "" + loadDate.getMonth() + "" + loadDate.getDate();
            var curDate = new Date().getFullYear() + "" + new Date().getMonth() + "" + new Date().getDate();
            if ((curDate === checkDate) || GlobalStor.global.ISEXT) {
              UserStor.userInfo = JSON.parse(LZString.decompressFromUTF16(user));
              GlobalStor.global = JSON.parse(LZString.decompressFromUTF16(global));
              OrderStor.order = JSON.parse(LZString.decompressFromUTF16(order));
              ProductStor.product = JSON.parse(LZString.decompressFromUTF16(product));
              AuxStor.aux = JSON.parse(LZString.decompressFromUTF16(aux));
              console.log("Данные загружены, приложение работает");
              MainServ.createOrderData();
              return true;
            } else {
              localStorage.clear();
              localDB.db.clear().then(function () {
                // Run this code once the database has been entirely deleted.
                console.log('Database is now empty.');
              }).catch(function (err) {
                // This code runs if there were any errors
                console.log(err);
              });
              $location.path('/');
              console.log("разные даты");
              return false;
            }
          } else {
            console.log("не все данные сохранены");
            localStorage.clear();
            return false;
          }

        }
        //Simple autologin for rehau landing
        if (window.location.href === "https://rehau2021selected.xyz/calculator/#/") {
          setTimeout(() => {
            thisCtrl.user.phone = 'rehausite'
            thisCtrl.user.password = 'rehau'
            document.querySelector('.login-submit').click();
          }, 2000);
          
        }

        function fastEnter(url) {
          GlobalStor.global.isLoader = 0;
          GlobalStor.global.startSlider = 0;
          GlobalStor.global.ISLOGIN = 0;
          if (url.orderEdit) {
            HistoryStor.history.orderEdit = 2;
            HistoryServ.reqResult().then(function () {
              HistoryServ.editOrder(1, url.orderEdit);
            });
          } else {
            $location.path("/" + GlobalStor.global.currOpenPage);
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
        thisCtrl.DemoLogin = DemoLogin;
        thisCtrl.registration = registration;
        thisCtrl.ShowTerms = ShowTerms;


        //------- defined system language
        setTimeout(function () {
          loginServ.getDeviceLanguage();
        }, 1000);
        //------- export data
        if (thisCtrl.isOnline) {
          // loginServ.initExport();
          entryWithoutLogin();
        }
        if (app) {
          // console.log("PhoneGap application");
          let deviceType = (navigator.userAgent.match(/iPad/i)) == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i)) == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";
          if (deviceType === 'iPad' || deviceType === 'iPhone') {
            try {
              console.log('device', device.model);
              console.log('device', window.device);
              console.log('device', $(window).height());

            } catch (e) { }
            $('body').addClass('padding-top-ios')
          }
        }
        $("#main-frame").addClass("main-frame-mobView");
        $("#app-container").addClass("app-container-mobView");
        let obj = $("#main-frame");
        obj.css({
          "transform": "scale(1)",
          "left": "0px",
          "top": "0px",
        });
      }
    );
})();
