(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('BauVoiceApp')
    .factory('AsyncLoader',

  function($http, $q) {

    return function (options) {
      var def = $q.defer(),
          query = '/local/'+options.key+'.json';
      //console.info('language', query);
      $http.get(query).then(
        function(result) {
          def.resolve(result.data);
        },
        function () {
          console.log('Something went wrong with language json');
          def.reject(options.key);
        }
      );
      return def.promise;
    };

  });
})();
