
// directives/file_loader.js

(function(){
  'use strict';
    /**
     * @ngInject
     */
  angular
    .module('BauVoiceApp')
    .directive('fileread', fileLoader);



  function fileLoader(SettingServ) {
    return {
      scope: {
        fileread: "="
      },
      link: function (scope, element, attributes) {
        element.bind("change", function (changeEvent) {
          var reader = new FileReader();
          reader.onload = function (loadEvent) {
            scope.$apply(function () {
              scope.fileread = loadEvent.target.result;
              SettingServ.changeAvatar(scope.fileread);
            });
          };
          reader.readAsDataURL(changeEvent.target.files[0]);

        });
      }
    }
  }

})();
