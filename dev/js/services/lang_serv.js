(function(){
  'use strict';

  var isDevice = (/(Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone)/i.test(window.navigator.userAgent)) ? 1 : 0;
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
