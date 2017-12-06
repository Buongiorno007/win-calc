'use strict';
/** global variable defined Browser or Device */
/** check first device */
var isDevice = (/(Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone)/i.test(window.navigator.userAgent)) ? 1 : 0;
//console.log("!!!!!");

(function() {
  /** check browser */
  // if (/(chrome|Chromium|safari|firefox|Opera|Yandex|internet explorer|Seamonkey)/i.test(window.navigator.userAgent)) {
  //   isDevice = 0;
  // }
  //console.log("isDevice",isDevice);
  // Test via a getter in the options object to see if the passive property is accessed
  var app = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;
  if (app) {
    isDevice = 1;
    // console.log("PhoneGap application");
  } else {
    isDevice = 0;
    // console.log("Web page");
  }
  $(window).load(function() {
    location.hash = "#/";
    var obj = $("#main-frame");
    var width = obj.width();
    var height = obj.height();
    var scale = 1,
      left = 0,
      top = 0;
    if (self.innerWidth / width > self.innerHeight / height) {
      scale = self.innerHeight / height;
      left = Math.round(Math.abs(self.innerWidth - width * scale) / 2);
    } else {
      scale = self.innerWidth / width;
      top = Math.round(Math.abs(self.innerHeight - height * scale) / 2);
    }
    if (scale > 1) {
      scale = 1;
    }
    obj.css({
      "transform": "scale(" + scale + ")",
      "left": left + "px",
      "top": top + "px"
    });
  });

  window.onresize = function() {
    var obj = $("#main-frame");
    var width = obj.width();
    var height = obj.height();
    var scale = 1,
      left = 0,
      top = 0;
    if (self.innerWidth / width > self.innerHeight / height) {
      scale = self.innerHeight / height;
      left = Math.round(Math.abs(self.innerWidth - width * scale) / 2);
    } else {
      scale = self.innerWidth / width;
      top = Math.round(Math.abs(self.innerHeight - height * scale) / 2);
    }
    if (scale > 1) {
      scale = 1;
    }
    obj.css({
      "transform": "scale(" + scale + ")",
      "left": left + "px",
      "top": top + "px"
    });
  };
  if (isDevice) {

    var app = window.PhonegapApp = {
      initialize: function() {
        this.bindEvents();
      },
      bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
      },
      onDeviceReady: function() {


      }
    };
    app.initialize();
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
    'LightModule',
    'SettingsModule'
  ]).config( /*@ngInject*/ configurationApp);

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
  angular
    .module('LightModule', []);


  function configurationApp($routeProvider, $locationProvider, $translateProvider, $httpProvider, $compileProvider) {

    //-------- delete # !!!
    //$locationProvider.html5Mode({
    //  enabled: true,
    //  requireBase: false
    //});
    // $locationProvider.html5Mode(true).hashPrefix('!');
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
      .when('/light', {
        templateUrl: 'views/light.html',
        controller: 'LightCtrl as lightPage',
        title: 'Light'
      })
      .otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(false).hashPrefix('');

    $compileProvider.imgSrcSanitizationWhitelist(/^\s*((https?|ftp|file|blob|chrome-extension):|data:image\/)/);

    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.defaults.headers.common["Accept"] = "application/json";
    $httpProvider.defaults.headers.common["Content-Type"] = "application/json";

    var browserLang = navigator.language;
    var label = browserLang.substr(0, 2);
    $translateProvider.preferredLanguage(label);

    $translateProvider.useSanitizeValueStrategy(null);
    $translateProvider.useLoader('AsyncLoader');

    // window.resolveLocalFileSystemURL();
  }

})();
