(function () {
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .factory('ConfigMenuServ',
      function ($location,
                $filter,
                GeneralServ,
                MainServ,
                CartMenuServ,
                GlobalStor,
                OrderStor,
                ProductStor,
                $timeout,
                InfoBoxServ,
                DesignStor,
                SVGServ,
                DesignServ,
                AddElementMenuServ) {
        var thisFactory = this;


        /**============ METHODS ================*/
        function selectConfigPanel(id) {
          if ($location.path() === "/light") {
            ProductStor.product.template_source = DesignStor.design.templateSourceTEMP;
            ProductStor.product.template = DesignStor.design.templateTEMP;
          }

          GlobalStor.global.configMenuTips++;
          MainServ.laminatFiltering();
          if (GlobalStor.global.isQtyCalculator || GlobalStor.global.isSizeCalculator) {
            /** calc Price previous parameter and close caclulators */
            AddElementMenuServ.finishCalculators();
          }
          //---- hide rooms if opened
          GlobalStor.global.showRoomSelectorDialog = 0;
          GlobalStor.global.showCoefInfoBlock = 0;
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

          if (id === 1) {
            GlobalStor.global.templateTEMP = angular.copy(ProductStor.product);
            GlobalStor.global.activePanel = 0;
            DesignStor.design.isGlassExtra = 0;
            $location.path("/design");
            GlobalStor.global.currOpenPage = 'design';
            //console.log(DesignStor.design.showHint);
            if (DesignStor.design.showHint >= 0) {
              GlobalStor.global.hintTimer = setTimeout(function () {
                DesignStor.design.showHint = 1;
              }, 90000);
            }
          } else {
            if (id === 3) {
              var temp = [];
              GlobalStor.global.glasses.forEach(function (glass) {
                glass.forEach(function (glass_img) {
                  temp.push(glass_img.glass_image);
                });

              });
              var transcalency_arr = [];
              var noise_coeff_arr = [];
              GlobalStor.global.glasses.forEach(function (glass_arr) {
                glass_arr.forEach(function (glass) {
                  transcalency_arr.push(glass.transcalency);
                  noise_coeff_arr.push(glass.noise_coeff);
                });
              });
              var transcalency_min = Math.min.apply(Math, transcalency_arr);
              var transcalency_max = Math.max.apply(Math, transcalency_arr);

              var noise_coeff_min = Math.min.apply(Math, noise_coeff_arr);
              var noise_coeff_max = Math.max.apply(Math, noise_coeff_arr);

              GlobalStor.global.glasses.forEach(function (glass_arr) {
                glass_arr.forEach(function (glass) {
                  glass.transcalencyD = 1 + Math.floor(((glass.transcalency - transcalency_min) / (transcalency_max - transcalency_min)) * 4);
                  if (glass.noise_coeff !== 0) {
                    glass.noise_coeffD = 1 + Math.floor(((glass.noise_coeff - noise_coeff_min) / (noise_coeff_max - noise_coeff_min)) * 4);
                  } else glass.noise_coeffD = glass.noise_coeff;
                });
              });
            }
            /** if Door */
            if (ProductStor.product.construction_type === 4) {
              //--------- show only Glasses and AddElements
              if (id === 3 || id === 6 || id === 5) {
                GlobalStor.global.activePanel = (GlobalStor.global.activePanel === id) ? 0 : id;
              } else {
                // GlobalStor.global.activePanel = 0;
                DesignStor.design.isGlassExtra = 0;
                if ($location.path() !== '/light') {
                  $location.path("/design")
                  GlobalStor.global.currOpenPage = 'design';
                } else {
                  $(".config-menu").hide();
                  $(".right-side").width("100%");
                  $(".main-content").width("100%");
                }
                GlobalStor.global.templateTEMP = angular.copy(ProductStor.product);
                DesignServ.setDoorConfigDefault(ProductStor.product).then(function (result) {
                  DesignStor.design.steps.isDoorConfig = 1;
                })
              }
            } else {

              // GlobalStor.global.activePanel = (GlobalStor.global.activePanel === id) ? 0 : id;
              if (GlobalStor.global.activePanel === id) {
                GlobalStor.global.activePanel = 0;
                if ($location.path() === '/light') {
                  setTimeout(function () {
                    DesignServ.rebuildSVGTemplate();
                  }, 1000);
                }
              } else {
                GlobalStor.global.activePanel = id;

              }
            }
          }
          if (GlobalStor.global.activePanel !== 0 && GlobalStor.global.setTimeout === 0) {
            GlobalStor.global.setTimeout = 1;
            $timeout(function () {
              InfoBoxServ.autoShow(id);
            }, 4000);
          }
        }


        /**========== FINISH ==========*/

        thisFactory.publicObj = {
          selectConfigPanel: selectConfigPanel
        };

        return thisFactory.publicObj;


      });
})();
