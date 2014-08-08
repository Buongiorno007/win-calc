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
      .otherwise({
        redirectTo: '/'
      });

//    $locationProvider
//      .html5Mode(true);
  }]);