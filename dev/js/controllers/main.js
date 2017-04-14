(function () {
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('MainCtrl',


      function ($location,
                $timeout,
                $q,
                localDB,
                globalConstants,
                GeneralServ,
                loginServ,
                MainServ,
                SVGServ,
                DesignServ,
                AddElementMenuServ,
                GlobalStor,
                ProductStor,
                DesignStor,
                UserStor,
                AuxStor) {
        /*jshint validthis:true */
        var thisCtrl = this;
        thisCtrl.G = GlobalStor;
        thisCtrl.P = ProductStor;
        thisCtrl.U = UserStor;
        thisCtrl.A = AuxStor;
        thisCtrl.constants = globalConstants;
        thisCtrl.D = DesignStor;
        //------- set current Page
        GlobalStor.global.currOpenPage = 'main';
        //------- close Report
        GlobalStor.global.isReport = 0;

        thisCtrl.config = {
          //---- design menu
          isDesignError: 0,

          DELAY_SHOW_FIGURE_ITEM: 1000,
          typing: 'on'
        };

        /**============ METHODS ================*/
        //TODO delete
        function goToEditTemplate() {
          GlobalStor.global.templateTEMP = angular.copy(ProductStor.product);
          if (!ProductStor.product.is_addelem_only) {
            if (GlobalStor.global.isQtyCalculator || GlobalStor.global.isSizeCalculator) {
              /** calc Price previous parameter and close caclulators */
              AddElementMenuServ.finishCalculators();
            }
            //---- hide rooms if opened
            GlobalStor.global.showRoomSelectorDialog = 0;
            //---- hide tips
            GlobalStor.global.configMenuTips = 0;
            //---- hide comment if opened
            GlobalStor.global.isShowCommentBlock = 0;
            //---- hide template type menu if opened
            GlobalStor.global.isTemplateTypeMenu = 0;
            GeneralServ.stopStartProg();
            MainServ.setDefaultAuxParam();
            //------ close Glass Selector Dialogs
            if (GlobalStor.global.showGlassSelectorDialog) {
              DesignServ.closeGlassSelectorDialog(1);
            }
            GlobalStor.global.activePanel = 0;
            DesignStor.design.isGlassExtra = 0;
            $location.path('/design');
            GlobalStor.global.currOpenPage = '/design';
          }
        }

        /**=============== FIRST START =========*/

        if (GlobalStor.global.startProgramm) {
          //playSound('menu');
          /** for SVG_MAIN */
          //--------- set templateTEMP from ProductStor
          DesignServ.setDefaultTemplate();

        }


        /**================ EDIT PRODUCT =================*/
        if (GlobalStor.global.productEditNumber && !ProductStor.product.is_addelem_only) {
          SVGServ.createSVGTemplate(ProductStor.product.template_source, ProductStor.product.profileDepths)
            .then(function (data) {
              ProductStor.product.template = data;
            });
        }
        if (!ProductStor.product.is_addelem_only) {
          profile();
          MainServ.doorProfile();
          MainServ.laminationDoor();
        }
        getPCPower();


        function getPCPower() {
          var iterations = 1000000;
          var s = 0;
          var diffs = 0;
          for (var j = 0; j < 10; j++) {
            var start = +new Date();
            for (var i = 0; i < iterations; i++) {
              var t = Math.sqrt(i) * Math.sin(i) * Math.cos(i / 2) / 2;
              s += t;
            }
            ;
            var end = +new Date();

            var diff = end - start;
            diffs += diff;
          }
          GlobalStor.global.getPCPower = Math.round(1000000 / diffs);
          GlobalStor.global.loader = 2;
          return Math.round(1000000 / diffs);

        }

        function profile() {
          var deferred = $q.defer();
          if (ProductStor.product.is_addelem_only === 0) {
            localDB.selectLocalDB(
              localDB.tablesLocalDB.elements_profile_systems.tableName, {
                'profile_system_id': ProductStor.product.profile.id
              }).then(function (result) {
              GlobalStor.global.dataProfiles = angular.copy(result)
              deferred.resolve(result);
            });
          }
          return deferred.promise;
        }

        /**========== FINISH ==========*/

        //------ clicking
        thisCtrl.profile = profile;
        thisCtrl.getPCPower = getPCPower;
        thisCtrl.goToEditTemplate = goToEditTemplate;
        thisCtrl.setDefaultConstruction = DesignServ.setDefaultConstruction;


      });
})();


//event.srcEvent.stopPropagation();
//event.preventDefault();
//$event.stopImmediatePropagation();
