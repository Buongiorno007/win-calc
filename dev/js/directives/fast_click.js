(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('BauVoiceApp')
    .directive('fsClick',

  function(GlobalStor) {

    return function(scope, elem, attrs) {
      var clickEvent = (GlobalStor.global.isDevice) ? 'touchstart' : 'mousedown';
      elem.on(clickEvent, function () {
        scope.$apply(attrs["fsClick"]);
      });
    };

  });
})();