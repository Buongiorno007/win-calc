(function(){
  'use strict';

/*
  window.PhonegapApp = {
    initialize: function() {
      this.bindEvents();
    },
    bindEvents: function() {
      document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
      //alert('onDeviceReady');
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

*/


  angular.module('BauVoiceApp', [
    'ngRoute',
    'angular-websql',
    'pascalprecht.translate',
    'hmTouchEvents',
    'ngCordova',

    'LoginModule',
    'MainModule',
    'ConstructionModule',
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
    .module('ConstructionModule', []);
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
    'romanianDictionary'
  ];

  function configurationApp($routeProvider, $locationProvider, $httpProvider, $translateProvider, ukrainianDictionary, russianDictionary, englishDictionary, germanDictionary, romanianDictionary) {

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
        title: 'Settings'
      })
      .when('/change-pass', {
        templateUrl: 'views/change-pass.html',
        controller: 'ChangePassCtrl',
        title: 'Change Pass'
      })
      .when('/change-lang', {
        templateUrl: 'views/change-lang.html',
        controller: 'ChangeLangCtrl',
        title: 'Change Language'
      })
      .when('/location', {
        templateUrl: 'views/location.html',
        controller: 'LocationCtrl',
        title: 'Location'
      })
      .when('/history', {
        templateUrl: 'views/history.html',
        controller: 'HistoryCtrl',
        title: 'History'
      })
      .when('/cart', {
        templateUrl: 'views/cart.html',
        controller: 'CartCtrl',
        title: 'Cart'
      })
      .when('/construction', {
        templateUrl: 'views/construction.html',
        controller: 'ConstructionCtrl',
        title: 'Construction'
      })
      .otherwise({
        redirectTo: '/'
      });

    $translateProvider.translations('ru', russianDictionary);
    $translateProvider.translations('ua', ukrainianDictionary);
    $translateProvider.translations('en', englishDictionary);
    $translateProvider.translations('de', germanDictionary);
    $translateProvider.translations('ro', romanianDictionary);

    $translateProvider.preferredLanguage('en');


    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $httpProvider.defaults.transformRequest = [function(data) {
      var param = function(obj)
      {
        var query = '';
        var name, value, fullSubName, subValue, innerObj, i, subName;

        for(name in obj)
        {
          value = obj[name];

          if(value instanceof Array)
          {
            for(i=0; i<value.length; ++i)
            {
              subValue = value[i];
              fullSubName = name + '[' + i + ']';
              innerObj = {};
              innerObj[fullSubName] = subValue;
              query += param(innerObj) + '&';
            }
          }
          else if(value instanceof Object)
          {
            for(subName in value)
            {
              subValue = value[subName];
              fullSubName = name + '[' + subName + ']';
              innerObj = {};
              innerObj[fullSubName] = subValue;
              query += param(innerObj) + '&';
            }
          }
          else if(value !== undefined && value !== null)
          {
            query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
          }
        }

        return query.length ? query.substr(0, query.length - 1) : query;
      };

      return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];


  }

})();