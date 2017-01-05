'use strict';
/** global variable defined Browser or Device */
/** check first device */
var isDevice = (/(Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone)/i.test(window.navigator.userAgent) ) ? 1 : 0;


(function () {
  /** check browser */
  if (/(chrome|Chromium|safari|firefox|Opera|Yandex|internet explorer|Seamonkey)/i.test(window.navigator.userAgent)) {
    isDevice = 0;
  }
  window.onload = function () {
    if(!isDevice){location.hash = "#/";}
    var obj = document.getElementById('main-frame'),
    width = $(obj).width(),
    height = $(obj).height();
    var scale=1;
    if (self.innerWidth/width > self.innerHeight/height) {scale=self.innerHeight/height;}
    else {scale=self.innerWidth/width;}
    if (scale > 1) {scale=1;}
    obj.style.transform = 'scale('+scale+')';

  };
  // window.onresize = function (event) {
  //   var elm = document.getElementById('main-frame'); // all -- элемент, в который был обернут весь сайт
  //   var coeff = document.documentElement.clientHeight / elm.offsetHeight; // считаем коэффициент масштабирования так, чтобы элемент all занял весь экран
  //   if (coeff > 1) coeff = 1; // нам нужно только уменьшение сайта, но не его увеличение, поэтому ограничиваем коэффициент сверху единицей
  //   if (coeff < 0.6) coeff = 0.6; // ограничение снизу добавлено для того, чтобы сайт совсем уж не превращался в нечитаемый
  //   if (coeff != 1.0) {
  //     if (navigator.userAgent.indexOf('Firefox') != -1) elm.style.boxShadow = 'none';  // масштабирование в Firefox порождало некорректное отображение boxshadow, и пришлось это свойство отключить
  //     elm.style.webkitTransform = 'scale(' + coeff + ')';
  //     elm.style.msTransform =
  //       elm.style.mozTransform =
  //         elm.style.transform = 'scale(' + coeff + ')'; // собственно масштабирование
  //   }
  //
  // };


  //console.log('isDevice===', isDevice);


  if (isDevice) {
    window.PhonegapApp = {
      initialize: function () {
        this.bindEvents();
      },
      bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
      },
      onDeviceReady: function () {
        //      alert('onDeviceReady');
        doInit();
        angular.element(document).ready(function () {
          angular.bootstrap(document, ['BauVoiceApp', 'LoginModule']);

          //$(document).bind('touchmove', false);
          //$cordovaDialogs
          //      $cordovaInAppBrowser.open('http://ngcordova.com', '_blank', options).then(function () {
          //        console.log("InAppBrowser opened http://ngcordova.com successfully");
          //      }, function (error) {
          //        console.log("Error: " + error);
          //      });

        });

      }
    };

    PhonegapApp.initialize();
  }


  angular.module('BauVoiceApp', [
    'ngRoute',
    'pascalprecht.translate',
    'ngTouch',
    'ngCordova',
    'swipe',

    'LoginModule',
    'MainModule',
    'DesignModule',
    'CartModule',
    'HistoryModule',
    'SettingsModule'
  ]).config(/*@ngInject*/ configurationApp);

  //============== Modules ============//
  angular
    .module('LoginModule', []);
  angular
    .module('MainModule', []);
  angular
    .module('DesignModule', []);
  angular
    .module('CartModule', []);
  angular
    .module('HistoryModule', []);
  angular
    .module('SettingsModule', []);


  function configurationApp($routeProvider, $locationProvider, $translateProvider, $httpProvider, $compileProvider) {

    //-------- delete # !!!
    //$locationProvider.html5Mode({
    //  enabled: true,
    //  requireBase: false
    //});

    $routeProvider
      .when('/', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl as loginPage',
        title: 'Login'
      })
      .when('/main', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl as mainPage',
        title: 'Main'
      })
      .when('/settings', {
        templateUrl: 'views/settings.html',
        controller: 'SettingsCtrl as settingsPage',
        title: 'Settings'
      })
      .when('/change-pass', {
        templateUrl: 'views/change-pass.html',
        controller: 'ChangePassCtrl as passwordPage',
        title: 'Change Pass'
      })
      .when('/change-lang', {
        templateUrl: 'views/change-lang.html',
        controller: 'ChangeLangCtrl as languagePage',
        title: 'Change Language'
      })
      .when('/location', {
        templateUrl: 'views/location.html',
        controller: 'LocationCtrl as locationPage',
        title: 'Location'
      })
      .when('/history', {
        templateUrl: 'views/history.html',
        controller: 'HistoryCtrl as historyPage',
        title: 'History'
      })
      .when('/cart', {
        templateUrl: 'views/cart.html',
        controller: 'CartCtrl as cartPage',
        title: 'Cart'
      })
      .when('/design', {
        templateUrl: 'views/design.html',
        controller: 'DesignCtrl as designPage',
        title: 'Design'
      })
      .otherwise({
        redirectTo: '/'
      });



    $compileProvider.imgSrcSanitizationWhitelist(/^\s*((https?|ftp|file|blob|chrome-extension):|data:image\/)/);
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.defaults.headers.common["Accept"] = "application/json";
    $httpProvider.defaults.headers.common["Content-Type"] = "application/json";
    $translateProvider.preferredLanguage('en');
    $translateProvider.useLoader('AsyncLoader');
  }

})();
