
// directives/report.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('BauVoiceApp')
    .directive('report', reportDir);

  function reportDir() {

    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      scope: {
        reportArr: '=',
        priceCurrency: '='
      },
      template:
        '<div class="report-box" data-output="reportArr">' +
          '<div class="report-item" ng-repeat="report in reportArr">' +
          '</div>' +
          '<div id="currency" class="price-currency">{{ priceCurrency }}</div>' +
        '</div>',

      link: function (scope, elem, attrs) {
        scope.$watch(attrs.output, function (price) {
          console.log(price, elem);
        });

      }
    };



// event.srcEvent.stopPropagation();
  }
})();
