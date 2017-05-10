(function () {
  'use strict';
  /**@ngInject*/
  angular
    .module('LightModule')
    .factory('LightServ',

      function (GlobalStor,
                DesignStor,
                ProductStor,
                MainServ,
                DesignServ,
                loginServ,
                SVGServ) {
        /*jshint validthis:true */
        var thisFactory = this;

        function designSaved() {
          if (GlobalStor.global.checkDoors === 0) {
            var isSashesInTemplate;
            GlobalStor.global.isLoader = 1;
            DesignServ.closeSizeCaclulator(1).then(function () {
              /** check sizes of all glass */
              MainServ.checkGlassSizes(DesignStor.design.templateTEMP);
              if (DesignStor.design.extraGlass.length) {
                /** expose Alert */
                GlobalStor.global.isLoader = 0;
                DesignStor.design.isGlassExtra = 1;
              } else {
                /** if sash was added/removed in template */
                isSashesInTemplate = MainServ.checkSashInTemplate(DesignStor.design.templateSourceTEMP);
                if (isSashesInTemplate) {
                  /** set first hardware if sash were not existed before */
                  if ((!GlobalStor.global.isSashesInTemplate || !ProductStor.product.hardware.id) && ProductStor.product.construction_type !== 4) {
                    GlobalStor.global.isSashesInTemplate = 1;
                    ProductStor.product.hardware = GlobalStor.global.hardwares[0][0];
                  }
                  /** check sizes of all hardware in sashes */
                  MainServ.checkHardwareSizes(DesignStor.design.templateTEMP);

                } else {
                  /** sashes were removed */
                  ProductStor.product.hardware = {};
                  ProductStor.product.hardware.id = 0;
                  GlobalStor.global.isSashesInTemplate = 0;
                  //------ clean Extra Hardware
                  DesignStor.design.extraHardware.length = 0;
                }

                if (DesignStor.design.extraHardware.length) {
                  /** expose Alert */
                  GlobalStor.global.isLoader = 0;
                  DesignStor.design.isHardwareExtra = 1;
                } else {
                  /** save new template in product ***** */
                  ProductStor.product.template_source = angular.copy(DesignStor.design.templateSourceTEMP);
                  ProductStor.product.template = angular.copy(DesignStor.design.templateTEMP);

                  /** rebuild glasses */
                  MainServ.setGlassfilter();
                  if (ProductStor.product.construction_type !== 4) {
                    MainServ.setCurrentGlass(ProductStor.product, 1);
                    MainServ.setCurrentProfile(ProductStor.product, ProductStor.product.profile.id).then(function () {
                      next();
                    });
                  } else {
                    next();
                  }

                  //noinspection JSAnnotator
                  function next() {
                    /** create template icon */
                    SVGServ.createSVGTemplateIcon(DesignStor.design.templateSourceTEMP, ProductStor.product.profileDepths)
                      .then(function (result) {
                        ProductStor.product.templateIcon = angular.copy(result);
                      });
                    /** save new template in templates Array */
                    GlobalStor.global.templatesSource[ProductStor.product.templateIndex] = angular.copy(
                      ProductStor.product.template_source
                    );
                    /** check grids */
                      // console.log(ProductStor.product);
                    var isChanged = DesignServ.updateGrids();
                    if (isChanged) {
                      //------ get new grids price
                      var sumMosq = 0;
                      var sumMosqDis = 0;
                      ProductStor.product.chosenAddElements[0].forEach(function (entry) {
                        sumMosq += entry.element_price;
                        sumMosqDis += entry.elementPriceDis;
                      });

                      ProductStor.product.addelem_price -= sumMosq;
                      ProductStor.product.addelemPriceDis -= sumMosqDis;

                      loginServ.getGridPrice(ProductStor.product.chosenAddElements[0]).then(function () {
                        sumMosq = 0;
                        sumMosqDis = 0;
                        ProductStor.product.chosenAddElements[0].forEach(function (entry) {
                          sumMosq += entry.element_price;
                          sumMosqDis += entry.elementPriceDis;
                        });
                        ProductStor.product.addelem_price += sumMosq;
                        ProductStor.product.addelemPriceDis += sumMosqDis;
                      });


                    }
                    SVGServ.createSVGTemplate(ProductStor.product.template_source, ProductStor.product.profileDepths).then(function (result) {
                      ProductStor.product.template = angular.copy(result);
                      /** refresh price of new template */
                      MainServ.preparePrice(
                        ProductStor.product.template,
                        ProductStor.product.profile.id,
                        ProductStor.product.glass,
                        ProductStor.product.hardware.id,
                        ProductStor.product.lamination.lamination_in_id
                      ).then(function () {
                        //-------- template was changed
                        SVGServ.createSVGTemplate(ProductStor.product.template_source, ProductStor.product.profileDepths).then(function (result) {
                          ProductStor.product.template = angular.copy(result);
                          DesignStor.design.templateTEMP = angular.copy(result);
                          GlobalStor.global.isChangedTemplate = 1;
                          ProductStor.product.product_qty = GlobalStor.global.product_qty;
                          MainServ.inputProductInOrder();
                          setTimeout(function () {
                          }, 1000);
                        });
                      });
                    });
                  }
                }
              }
            });
          }
          // console.log("ProductStor.product", ProductStor.product);
          console.log("схоронили");
        }


        /**========== FINISH ==========*/

        thisFactory.publicObj = {
          designSaved: designSaved

        };

        return thisFactory.publicObj;


      });
})();
