
// directives/show-delay.js

(function(){
  'use strict';

  angular
    .module('BauVoiceApp')
    .directive('showDelay', showDelayDir);

  showDelayDir.$inject = [];

  function showDelayDir() {

    return {
      scope: {
        showDelay: '@'
      },
      link: function (scope, elem, attrs) {
        attrs.$observe('showDelay', function () {
          showElementWithDelay();
        });

        function showElementWithDelay() {
          var unvisibleClass = 'unvisible';

          setTimeout(function () {
            elem.removeClass(unvisibleClass);
          }, parseInt(scope.showDelay, 10));
        }
      }
    };

  }
})();
