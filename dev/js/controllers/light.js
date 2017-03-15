(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('LightModule')
    .controller('LightCtrl',

      function(
        $filter,
        $timeout,
        globalConstants,
        DesignServ,
        GlobalStor,
        ProductStor,
        MainServ,
        DesignStor,
        ConfigMenuServ,
        AddElementMenuServ
      ) {
        var thisCtrl = this;

        thisCtrl.constants = globalConstants;
        thisCtrl.G = GlobalStor;
        thisCtrl.P = ProductStor;
        thisCtrl.D = DesignStor;

        //------- set current Page
        GlobalStor.global.currOpenPage = 'light';

        thisCtrl.config = {
          //---- design menu
          isDesignError: 0,
          isTest: 0,

          DELAY_SHOW_FIGURE_ITEM: 1000,
          typing: 'on'
        };
        GlobalStor.global.isNavMenu = 0;
        GlobalStor.global.isConfigMenu = 1;
      });
})();
