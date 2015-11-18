'use strict';
/** global variable defined Browser or Device */
/** check first device */
var isDevice = ( /(Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone)/i.test(window.navigator.userAgent) ) ? 1 : 0;

(function(){

  /**------- defined system ------ */
//  console.log('USER: navigator++', window.navigator);
//  console.log('USER: userAgent+++', window.navigator.userAgent);
//  console.log('USER: platform', window.navigator.platform);
  /** check browser */
  if(/(chrome|Chromium|safari|firefox|Opera|Yandex|internet explorer|Seamonkey)/i.test(window.navigator.userAgent)) {
    isDevice = 0;
  }
  console.log('isDevice===', isDevice);


  if(isDevice) {
    window.PhonegapApp = {
      initialize: function() {
        this.bindEvents();
      },
      bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
      },
      onDeviceReady: function() {
        //      alert('onDeviceReady');
        doInit();
        angular.element(document).ready(function() {
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
    'hmTouchEvents',
    'ngCordova',

    'LoginModule',
    'MainModule',
    'DesignModule',
    'CartModule',
    'HistoryModule',
    'SettingsModule'
  ]).config(configurationApp);

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


  configurationApp.$inject = [
    '$routeProvider',
    '$locationProvider',
    '$httpProvider',
    '$translateProvider',

    'ukrainianDictionary',
    'russianDictionary',
    'englishDictionary',
    'germanDictionary',
    'romanianDictionary',
    'italianDictionary'
  ];

  function configurationApp($routeProvider, $locationProvider, $httpProvider, $translateProvider, ukrainianDictionary, russianDictionary, englishDictionary, germanDictionary, romanianDictionary, italianDictionary) {

    $routeProvider
      .when('/', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'loginPage',
        title: 'Login'
      })
      .when('/main', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'mainPage',
        title: 'Main'
      })
      .when('/settings', {
        templateUrl: 'views/settings.html',
        controller: 'SettingsCtrl',
        controllerAs: 'settingsPage',
        title: 'Settings'
      })
      .when('/change-pass', {
        templateUrl: 'views/change-pass.html',
        controller: 'ChangePassCtrl',
        controllerAs: 'passwordPage',
        title: 'Change Pass'
      })
      .when('/change-lang', {
        templateUrl: 'views/change-lang.html',
        controller: 'ChangeLangCtrl',
        controllerAs: 'languagePage',
        title: 'Change Language'
      })
      .when('/location', {
        templateUrl: 'views/location.html',
        controller: 'LocationCtrl',
        controllerAs: 'locationPage',
        title: 'Location'
      })
      .when('/history', {
        templateUrl: 'views/history.html',
        controller: 'HistoryCtrl',
        controllerAs: 'historyPage',
        title: 'History'
      })
      .when('/cart', {
        templateUrl: 'views/cart.html',
        controller: 'CartCtrl',
        controllerAs: 'cartPage',
        title: 'Cart'
      })
      .when('/design', {
        templateUrl: 'views/design.html',
        controller: 'DesignCtrl',
        controllerAs: 'designPage',
        title: 'Design'
      })
      .otherwise({
        redirectTo: '/'
      });

    $translateProvider.translations('ru', russianDictionary);
    $translateProvider.translations('ua', ukrainianDictionary);
    $translateProvider.translations('en', englishDictionary);
    $translateProvider.translations('de', germanDictionary);
    $translateProvider.translations('ro', romanianDictionary);
    $translateProvider.translations('it', italianDictionary);

    $translateProvider.preferredLanguage('en');

  }

})();