(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('BauVoiceApp')
    .directive('fileread',

  function(SettingServ, UserStor) {
    return {
      scope: {
        fileread: "="
      },
      link: function (scope, element) {
        element.bind("change", function (changeEvent) {
          var fd = new FormData(),
              reader = new FileReader();
          fd.append("user", UserStor.userInfo.id);
          fd.append("file", changeEvent.target.files[0]);

          reader.onload = function (loadEvent) {
            scope.$apply(function () {
              scope.fileread = loadEvent.target.result;
              SettingServ.changeAvatar(scope.fileread, fd);
            });
          };
          reader.readAsDataURL(changeEvent.target.files[0]);

        });
      }
    };

  });
})();