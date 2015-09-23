
// directives/typing.js

(function(){
  'use strict';
    /**
     * @ngInject
     */
  angular
    .module('BauVoiceApp')
    .directive('typing', typingDir);

  function typingDir() {

    return {
      scope: {
        output: '@',
        typingDelay: '@'
      },
      link: function (scope, elem, attrs) {
        attrs.$observe('typing', function (mode) {
          if (mode.toString() === 'on') {
            typingTextWithDelay();
          }
        });
        attrs.$observe('output', function () {
            typingTextWithDelay();
        });

        function typingTextWithDelay() {
          setTimeout(function () {
            var source = scope.output,
                text = '',
                NEXT_CHAR_DELAY = 15,
                timerId,
                hasChar;

            timerId = setInterval(function () {
              hasChar = text.length < source.length;

              if (hasChar) {
                text += source[text.length];
              } else {
                clearInterval(timerId);
              }
              elem.text(text);
            }, NEXT_CHAR_DELAY);
          }, scope.typingDelay*1);
        }
      }
    };


  }
})();
