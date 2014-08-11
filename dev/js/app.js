/* exported BauVoiceApp */

'use strict';

var BauVoiceApp = angular.module('BauVoiceApp', [
  'ngRoute'
])
  .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
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
      .otherwise({
        redirectTo: '/'
      });

//    $locationProvider
//      .html5Mode(true);
  }]);