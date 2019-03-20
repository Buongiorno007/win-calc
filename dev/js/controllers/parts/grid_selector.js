(function () {
    'use strict';
    /**@ngInject*/
    angular
        .module('MainModule')
        .controller('GridSelectorCtrl',

            function ($filter,
                      AddElementMenuServ,
                      globalConstants,
                      ProductStor,
                      GlobalStor,
                      AuxStor) {
                /*jshint validthis:true */
                var thisCtrl = this;
                thisCtrl.constants = globalConstants;
                thisCtrl.P = ProductStor;
                thisCtrl.A = AuxStor;
                thisCtrl.G = GlobalStor;
                //------ translate
                thisCtrl.SELECT_ALL = $filter('translate')('mainpage.SELECT_ALL');
                thisCtrl.SELECT_GLASS_WARN = $filter('translate')('mainpage.SELECT_GLASS_WARN');
                thisCtrl.APPLY = $filter('translate')('common_words.APPLY');


                /**============ METHODS ================*/


                /**========== FINISH ==========*/

                thisCtrl.confirmGrid = AddElementMenuServ.confirmGrid;
                thisCtrl.setGridToAll = AddElementMenuServ.setGridToAll;
                thisCtrl.closeGridSelectorDialog = AddElementMenuServ.closeGridSelectorDialog;

            });
})();
