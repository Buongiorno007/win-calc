(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .factory('NavMenuServ', navFactory);

  function navFactory($location, $http, $filter, $cordovaGeolocation, GeneralServ, MainServ, CartServ, GlobalStor, OrderStor, ProductStor) {

    var thisFactory = this;

    thisFactory.publicObj = {
      getCurrentGeolocation: getCurrentGeolocation,
      setLanguageVoiceHelper: setLanguageVoiceHelper,
      switchVoiceHelper: switchVoiceHelper,
      gotoHistoryPage: gotoHistoryPage,
      createAddElementsProduct: createAddElementsProduct,
      clickNewProject: clickNewProject
    };

    return thisFactory.publicObj;




    //============ methods ================//

    function getCurrentGeolocation() {
      //------ Data from GPS device
      //navigator.geolocation.getCurrentPosition(successLocation, errorLocation);
      $cordovaGeolocation.getCurrentPosition().then(successLocation, errorLocation);

        function successLocation(position) {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            $http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng='+latitude+','+longitude+'&sensor=true&language=ru').
                success(function(data, status, headers, config) {
                    //----- save previous current location
                    //$scope.global.prevGeoLocation = angular.copy($scope.global.currentGeoLocation);

                    var deviceLocation = data.results[0].formatted_address.split(', ');
                    //TODO set new currencyID!!!!
                    //TODO before need to fine currencyId!!!!
                    //TODO loginServ.setUserGeoLocation(cityId, cityName, regionName, countryName, climatic, heat, fullLocation, currencyId)

                    OrderStor.order.currCityId = 156; //TODO должны тянуть с базы согласно новому городу, но город гугл дает на украинском языке, в базе на русском
                    OrderStor.order.customer_city = deviceLocation[deviceLocation.length-3];
                    OrderStor.order.currRegionName = deviceLocation[deviceLocation.length-2];
                    OrderStor.order.currCountryName = deviceLocation[deviceLocation.length-1];
                    OrderStor.order.climatic_zone = 7; //TODO
                    OrderStor.order.heat_coef_min = 0.99; //TODO
                    OrderStor.order.currFullLocation = deviceLocation[deviceLocation.length-3] + ', ' + deviceLocation[deviceLocation.length-2] + ', ' + deviceLocation[deviceLocation.length-1];

                }).
                error(function(data, status, headers, config) {
                    alert(status);
                });
        }
        function errorLocation(error) {
            alert(error.message);
        }
    }


    function switchVoiceHelper() {
      GlobalStor.global.isVoiceHelper = !GlobalStor.global.isVoiceHelper;
      if(GlobalStor.global.isVoiceHelper) {
        //------- set Language for Voice Helper
        GlobalStor.global.voiceHelperLanguage = setLanguageVoiceHelper();
        playTTS($filter('translate')('construction.VOICE_SWITCH_ON'), GlobalStor.global.voiceHelperLanguage);
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
      $location.path('/history');
    }


    function createAddElementsProduct() {
      GeneralServ.stopStartProg();
      if(ProductStor.product.is_addelem_only) {
        MainServ.createNewProduct();
      } else {
        //------- create new empty product
        ProductStor.product = ProductStor.setDefaultProduct();
        ProductStor.product.is_addelem_only = true;
        GlobalStor.global.isNavMenu = false;
        GlobalStor.global.isConfigMenu = true;
        //------ open AddElements Panel
        GlobalStor.global.activePanel = 6;
      }
    }




    //----------- Create new Project
    function clickNewProject() {

      //------- Start programm, without draft, for Main Page
      if(GlobalStor.global.startProgramm) {
        GeneralServ.stopStartProg();
        MainServ.prepareMainPage();

      } else {
        //$cordovaProgress.showSimple(true);

        //------- Create New Project with Draft saving in Main Page
        if(GlobalStor.global.isCreatedNewProject && GlobalStor.global.isCreatedNewProduct) {

          //------ save product in LocalDB
          MainServ.inputProductInOrder();
          //------- define order Price
          CartServ.calculateAllProductsPrice();
          OrderStor.order.order_price_total = OrderStor.order.products_price_total;
          //-------- save order as Draft
          MainServ.insertOrderInLocalDB({}, 0, '');

          //------- Create New Project with Draft saving in Cart Page
        } else if(GlobalStor.global.isCreatedNewProject && !GlobalStor.global.isCreatedNewProduct) {
          //-------- save order as Draft
          MainServ.insertOrderInLocalDB({}, 0, '');
        }

        //------- set previos Page
        GeneralServ.setPreviosPage();
        //=============== CREATE NEW PROJECT =========//
        MainServ.createNewProject();

      }
    }


  }
})();
