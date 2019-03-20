(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('BauVoiceApp')
    .directive('showDelay',

  function() {

    return {
      scope: {
        showDelay: '@'
      },
      link: function (scope, elem, attrs) {

        function showElementWithDelay() {
          var unvisibleClass = 'unvisible';

          setTimeout(function () {
            elem.removeClass(unvisibleClass);
          }, +scope.showDelay);
        }

        attrs.$observe('showDelay', function () {
          showElementWithDelay();
        });

      }
    };

  });
})();