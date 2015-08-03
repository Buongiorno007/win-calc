
// directives/tap.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('BauVoiceApp')
    .directive('fastTap', tapDir);

  function tapDir() {

    return {
      restrict: 'A',
      link: function (scope, elem, attrs) {

          function tap() {
            scope.$apply(function() {
              scope.$eval(attrs.fastTap);
            });
          }

        elem.on('touchstart', function(event) {
          tap();
          });

//        elem.on('mousedown', function(event) {
//              fn();
//          });

      }
    };



  }
})();
