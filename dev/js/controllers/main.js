(function () {
    'use strict';
    /**@ngInject*/
    angular
        .module('MainModule')
        .controller('MainCtrl',


            function ($location,
                      $timeout,
                      $q,
                      $scope,
                      $window,
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
                        $location.path("/design");
                        GlobalStor.global.currOpenPage = "design";
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
                localDB.getLocalStor().then((result) => {
                    if (result)
                        if (!ProductStor.product.is_addelem_only) {
                            MainServ.profile();
                            MainServ.doorProfile();
                            MainServ.laminationDoor();
                        }
                });
                MainServ.getPCPower();

                /**
                 * for testing
                 * **/
                // $scope.getWindowOrientation = function () {
                //     return $window.orientation;
                // };
                //
                // $scope.$watch($scope.getWindowOrientation, function (newValue, oldValue) {
                //     console.log(newValue);
                //     switch (newValue) {
                //         case 0 : {
                //             $location.path('/mobile')
                //             break;
                //         }
                //         case 90 : {
                //             $location.path('/main')
                //             break;
                //         }
                //     }
                // }, true);
                //
                // angular.element($window).bind('orientationchange', function () {
                //     $scope.$apply();
                // });


                /**========== FINISH ==========*/

                //------ clicking
                thisCtrl.profile = MainServ.profile;
                thisCtrl.goToEditTemplate = goToEditTemplate;
                thisCtrl.setDefaultConstruction = DesignServ.setDefaultConstruction;

                $("#main-frame").removeClass("main-frame-mobView");
                $("#app-container").removeClass("app-container-mobView");

                MainServ.resize();
                $(window).load(function () {
                    MainServ.resize();
                });
                window.onresize = function () {
                    MainServ.resize();
                };

            });
})();


//event.srcEvent.stopPropagation();
//event.preventDefault();
//$event.stopImmediatePropagation();
