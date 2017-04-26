(function () {
  'use strict';
  /**@ngInject*/
  angular
    .module('LightModule')
    .factory('LightServ',

      function (

      ) {
        /*jshint validthis:true */
        var thisFactory = this;

        function designSaved() {
        }


        /**========== FINISH ==========*/

        thisFactory.publicObj = {
          designSaved : designSaved

        };

        return thisFactory.publicObj;


      });
})();
