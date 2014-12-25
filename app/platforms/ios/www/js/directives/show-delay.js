
// directives/show-delay.js

'use strict';

BauVoiceApp.directive('showDelay', function () {
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
});
