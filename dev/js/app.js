'use strict';

window.BauVoiceApp = angular.module('BauVoiceApp', [
  'ngRoute',
  'pascalprecht.translate'
])
.config([
  '$routeProvider',
  '$locationProvider',
  '$httpProvider',
  '$translateProvider',
  function ($routeProvider, $locationProvider, $httpProvider, $translateProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '../views/login.html',
        controller: 'LoginCtrl',
        title: 'Login'
      })
      .when('/main', {
        templateUrl: '../views/main.html',
        controller: 'MainCtrl',
        title: 'Main'
      })
      .when('/settings', {
        templateUrl: '../views/settings.html',
        controller: 'SettingsCtrl',
        title: 'Settings'
      })
      .when('/change-pass', {
        templateUrl: '../views/change-pass.html',
        controller: 'ChangePassCtrl',
        title: 'Change Pass'
      })
      .when('/location', {
        templateUrl: '../views/location.html',
        controller: 'LocationCtrl',
        title: 'Location'
      })
      .when('/history', {
        templateUrl: '../views/history.html',
        controller: 'HistoryCtrl',
        title: 'History'
      })
      .when('/cart', {
        templateUrl: '../views/cart.html',
        controller: 'CartCtrl',
        title: 'Cart'
      })
      .when('/construction', {
        templateUrl: '../views/construction.html',
        controller: 'ConstructionCtrl',
        title: 'Construction'
      })
      .otherwise({
        redirectTo: '/'
      });

//    $locationProvider
//      .html5Mode(true);

    $translateProvider.translations('ru', russianDictionary);
    $translateProvider.translations('en', englishDictionary);

    $translateProvider.preferredLanguage('ru');


    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  }
]);