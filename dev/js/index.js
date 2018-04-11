'use strict';
/** global variable defined Browser or Device */
/** check first device */
let isDevice = (/(Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone)/i.test(window.navigator.userAgent)) ? 1 : 0;
//console.log("!!!!!");
let portrait = false;
(function () {
    /** check browser */
    function getDeviseScreen() {
        if (window.matchMedia("(orientation: portrait)").matches) {
            console.log("portrait")
        }
        if (window.matchMedia("(orientation: landscape)").matches) {
            console.log("landscape")
        }
    }
    let app = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;
    if (app) {
        isDevice = 1;
        // console.log("PhoneGap application");
        let deviceType = (navigator.userAgent.match(/iPad/i)) == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i)) == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";
        if (deviceType === 'iPad' || deviceType === 'iPhone') {
            $('body').addClass('padding-top-ios')
        }

    } else {
        isDevice = 0;
        // console.log("Web page");
    }
    $(window).load(function () {
        location.hash = "/";
    });
    if (isDevice) {

        let app = window.PhonegapApp = {
            initialize: function () {
                this.bindEvents();
            },
            bindEvents: function () {
                document.addEventListener('deviceready', this.onDeviceReady, false);
            },
            onDeviceReady: function () {


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
            .when('/mobile', {
                templateUrl: 'views/mobile-view.html',
                controller: 'MobileCtrl as mobilePage',
                title: 'Mobile'
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

        let browserLang = navigator.language;
        let label = browserLang.substr(0, 2);
        $translateProvider.preferredLanguage(label);

        $translateProvider.useSanitizeValueStrategy(null);
        $translateProvider.useLoader('AsyncLoader');

        // window.resolveLocalFileSystemURL();
    }

})();
