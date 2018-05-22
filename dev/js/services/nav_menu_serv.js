(function () {
    'use strict';
    /**@ngInject*/
    angular
        .module('MainModule')
        .factory('NavMenuServ',

            function (
                $location,
                $http,
                $filter,
                $cordovaGeolocation,
                GeneralServ,
                MainServ,
                CartMenuServ,
                ConfigMenuServ,
                GlobalStor,
                OrderStor,
                ProductStor
            ) {
                /*jshint validthis:true */
                var thisFactory = this;


                /**============ METHODS ================*/

                function getCurrentGeolocation() {
                    //------ Data from GPS device
                    //navigator.geolocation.getCurrentPosition(successLocation, errorLocation);
                    $cordovaGeolocation.getCurrentPosition().then(successLocation, errorLocation);

                    function successLocation(position) {
                        var latitude = position.coords.latitude,
                            longitude = position.coords.longitude;

                        $http.get(
                            'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&sensor=true&language=ru'
                        ).then(
                            function (data) {
                                //----- save previous current location
                                //$scope.global.prevGeoLocation = angular.copy($scope.global.currentGeoLocation);

                                var deviceLocation = data.results[0].formatted_address.split(', ');
//TODO set new currencyID!!!!
//TODO before need to fine currencyId!!!!
//TODO loginServ.setUserGeoLocation(cityId, cityName, climatic, heat, fullLocation, currencyId)
//TODO должны тянуть с базы согласно новому городу, но город гугл дает на украинском языке, в базе на русском
                                OrderStor.order.customer_city_id = 156;
                                OrderStor.order.customer_city = deviceLocation[deviceLocation.length - 3];
                                OrderStor.order.climatic_zone = 7; //TODO
                                OrderStor.order.heat_coef_min = 0.99; //TODO
                                OrderStor.order.customer_location = deviceLocation[deviceLocation.length - 3] +
                                    ', ' + deviceLocation[deviceLocation.length - 2] +
                                    ', ' + deviceLocation[deviceLocation.length - 1];
                            },
                            function (data, status) {
                                console.log('Something went wrong with User recive!', data, status);
                            }
                        );

                    }

                    function errorLocation(error) {
                        console.log(error.message);
                    }
                }


                function setLanguageVoiceHelper() {
                    var langLabel = 'ru_RU';

//      switch (UserStor.userInfo.langLabel) {
//        //case 'ua': langLabel = 'ukr-UKR';
//        case 'ua': langLabel = 'ru_RU';
//        break;
//        case 'ru': langLabel = 'ru_RU';
//        break;
//        case 'en': langLabel = 'en_US';
//        break;
//        case 'de': langLabel = 'de_DE';
//        break;
//        case 'ro': langLabel = 'ro_RO';
//        break;
//      }
                    return langLabel;
                }


                function switchVoiceHelper() {
                    GlobalStor.global.isVoiceHelper = !GlobalStor.global.isVoiceHelper;
                    if (GlobalStor.global.isVoiceHelper) {
                        //------- set Language for Voice Helper
                        GlobalStor.global.voiceHelperLanguage = setLanguageVoiceHelper();
                        playTTS($filter('translate')('construction.VOICE_SWITCH_ON'), GlobalStor.global.voiceHelperLanguage);
                    }
                }


                function gotoHistoryPage() {
                    GlobalStor.global.isNavMenu = false;
                    GlobalStor.global.isConfigMenu = true;
                    //---- если идем в историю через корзину, заказ сохраняем в черновик
                    /*if($scope.global.isOpenedCartPage) {
                     $scope.global.insertOrderInLocalDB({}, $scope.global.draftOrderType, '');
                     $scope.global.isCreatedNewProject = false;
                     $scope.global.isCreatedNewProduct = false;
                     }*/
                    //------- set previos Page
                    GeneralServ.setPreviosPage();
                    $location.path("/history");
                }


                function createAddElementsProduct() {
                    GeneralServ.stopStartProg();
                    if (ProductStor.product.is_addelem_only) {
                        MainServ.createNewProduct();
                    } else {
                        //------- create new empty product
                        ProductStor.product = ProductStor.setDefaultProduct();
                        MainServ.closeRoomSelectorDialog();
                        MainServ.setDefaultAuxParam();
                        ProductStor.product.is_addelem_only = 1;
                        GlobalStor.global.isNavMenu = 0;
                        ConfigMenuServ.selectConfigPanel(5);
                        // GlobalStor.global.isConfigMenu = 1;
                        //------ open AddElements Panel
                        GlobalStor.global.activePanel = 6;
                    }
                }

                function clickNewProject() {
                    //------- Start programm, without draft, for Main Page
                    if (GlobalStor.global.startProgramm) {
                        GeneralServ.stopStartProg();
                        MainServ.prepareMainPage();
                    } else {
                        GlobalStor.global.isLoader = 1;
                        //------- Create New Project with Draft saving in Main Page
                        if (GlobalStor.global.isCreatedNewProject && GlobalStor.global.isCreatedNewProduct) {
                            //------ save product
                            if (MainServ.inputProductInOrder()) {
                                //------- define order Price
                                CartMenuServ.calculateOrderPrice();
                                //-------- save order as Draft
                                MainServ.saveOrderInDB({}, 0, '');
                            }
                            //------- Create New Project with Draft saving in Cart Page
                        } else if (GlobalStor.global.isCreatedNewProject && !GlobalStor.global.isCreatedNewProduct) {
                            //-------- save order as Draft
                            MainServ.saveOrderInDB({}, 0, '');
                        }
                        //------- set previos Page
                        GeneralServ.setPreviosPage();
                        //=============== CREATE NEW PROJECT =========//
                        MainServ.createNewProject();

                    }
                }

                /**========== FINISH ==========*/

                thisFactory.publicObj = {
                    getCurrentGeolocation: getCurrentGeolocation,
                    setLanguageVoiceHelper: setLanguageVoiceHelper,
                    switchVoiceHelper: switchVoiceHelper,
                    gotoHistoryPage: gotoHistoryPage,
                    createAddElementsProduct: createAddElementsProduct,
                    clickNewProject: clickNewProject
                };

                return thisFactory.publicObj;
            });
})();
