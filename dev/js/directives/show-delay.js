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

BauVoiceApp.directive('styleDelay', function () {
  return {
    scope: {
      styleDelay: '@'
    },
    link: function (scope, elem, attrs) {
      attrs.$observe('styleDelay', function () {
        addClassWithDelay();
      });

      function addClassWithDelay() {
        var selectedClass = 'selected';

        setTimeout(function () {
          elem.addClass(selectedClass);
        }, parseInt(scope.styleDelay, 10));
      }
    }
  };
});