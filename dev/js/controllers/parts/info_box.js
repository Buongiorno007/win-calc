(function () {
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('infoBoxCtrl',

      function (GlobalStor, UserStor, InfoBoxServ, $filter, MainServ) {
        /*jshint validthis:true */
        var thisCtrl = this;
        thisCtrl.G = GlobalStor;
        thisCtrl.U = UserStor;
        //Country translation 
        thisCtrl.COUNTRY_NAME = $filter('translate')('natification.COUNTRY_NAME');
        thisCtrl.COUNTRY_DESKR = $filter('translate')('natification.COUNTRY_DESKR');
        thisCtrl.IDEAL_NAME = $filter('translate')('natification.IDEAL_NAME');
        thisCtrl.IDEAL_DESKR = $filter('translate')('natification.IDEAL_DESKR');
        thisCtrl.ASKING_PRICE = $filter('translate')('natification.ASKING_PRICE');       
        /**============ METHODS ================*/

        /** close Info Box */
        function closeInfoBox(clickEvent) {
          clickEvent.stopPropagation();
          if (GlobalStor.global.showApply === 1) {
            GlobalStor.global.inform = 1;
          }
          GlobalStor.global.showApply = 0
          GlobalStor.global.isInfoBox = 0;
          GlobalStor.global.infoTitle = '';
          GlobalStor.global.infoImg = '';
          GlobalStor.global.infoLink = '';
          GlobalStor.global.infoDescrip = '';
        }


        /**========== FINISH ==========*/
        //------ clicking
        thisCtrl.extendUrl = MainServ.extendUrl;
        thisCtrl.closeInfoBox = closeInfoBox;
        thisCtrl.isApply = InfoBoxServ.isApply;


      });
})();