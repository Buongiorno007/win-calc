(function(){
  'use strict';

  var app = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;
  if (app) {
    // console.log("PhoneGap application");
    isDevice = 1;
  } else {
    isDevice = 0;
    // console.log("Web page");
  }
  /**@ngInject*/
  angular
    .module('BauVoiceApp')
    .factory('AsyncLoader',
  function($http, $q, globalConstants) {
    return function (options) {
      var def = $q.defer(),
          query = globalConstants.localPath+options.key+'.json',
          path;
      if(isDevice) {
        path = window.location.href.replace('/index.html', '');
        path = path.replace('#/', '');
        path = path.replace('main','');
        path = path.replace('mobile','');
        path = path.replace('light','');
        path = path.replace('change-lang', '');
        $.getJSON(path + query, function(data){
          def.resolve(data);
        });
      } else {
        $http.get(query).then(
          function(result) {
            def.resolve(result.data);
          },
          function () {
            console.log('Something went wrong with language json');
            def.reject(options.key);
          }
        );
      }
      return def.promise;
    };
  });
})();
