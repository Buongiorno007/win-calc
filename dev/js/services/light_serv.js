(function () {
  'use strict';
  /**@ngInject*/
  angular
    .module('LightModule')
    .factory('LightServ',

      function ($filter,
                $q,

                GlobalStor,
                DesignStor,
                ProductStor,
                OrderStor,

                MainServ,
                GeneralServ,
                CartMenuServ,
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
                    // MainServ.setCurrentGlass(ProductStor.product, 1);
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
                          ProductStor.product.product_qty = GlobalStor.global.product_qty;
                          MainServ.inputProductInOrder();
                          OrderStor.order.construction_count = 0;
                          OrderStor.order.products.forEach(function (product) {
                            OrderStor.order.construction_count += product.product_qty;

                          });
                          DesignStor.design.designSteps = [];
                        });
                      });
                    });
                  }
                }
              }
            });
          }
          // console.log("ProductStor.product", ProductStor.product);
          // console.log("схоронили");
        }

        //----- Edit Produtct in main page
        function box(productIndex, type) {
          GlobalStor.global.isBox = !GlobalStor.global.isBox;
          //console.log(GlobalStor.global.isBox, 'GlobalStor.global.isBox')
          function editProduct() {
            if(OrderStor.order.products[productIndex].lamination.id > 0) {
              OrderStor.order.products[productIndex].profile.impost_list_id = angular.copy(OrderStor.order.products[productIndex].lamination.impost_list_id);
              OrderStor.order.products[productIndex].profile.rama_list_id = angular.copy(OrderStor.order.products[productIndex].lamination.rama_list_id);
              OrderStor.order.products[productIndex].profile.rama_still_list_id = angular.copy(OrderStor.order.products[productIndex].lamination.rama_still_list_id);
              OrderStor.order.products[productIndex].profile.shtulp_list_id = angular.copy(OrderStor.order.products[productIndex].lamination.shtulp_list_id);
              OrderStor.order.products[productIndex].profile.stvorka_list_id = angular.copy(OrderStor.order.products[productIndex].lamination.stvorka_list_id);
            }
            ProductStor.product = angular.copy(OrderStor.order.products[productIndex]);
            GlobalStor.global.productEditNumber = ProductStor.product.product_id;
            GlobalStor.global.isCreatedNewProduct = 1;
            GlobalStor.global.isChangedTemplate = 1;
            MainServ.prepareMainPage();
            if(type === 'auxiliary') {
              //------ open AddElements Panel
              GlobalStor.global.activePanel = 6;
            }
            if(!ProductStor.product.is_addelem_only) {
              //------- set previos Page
              var productTEMP;
              var newId = ProductStor.product.profile.id;
              /** save previous Product */
              productTEMP = angular.copy(ProductStor.product);

              /** check new Profile */
              MainServ.setCurrentProfile(ProductStor.product, newId).then(function () {
                //------- set current template for product
                MainServ.saveTemplateInProduct(ProductStor.product.template_id).then(function() {

                  /** Extra Glass finding */
                  MainServ.checkGlassSizes(ProductStor.product.template);

                  /** return previous Product */
                  ProductStor.product = angular.copy(productTEMP);
                  DesignStor.design.templateSourceTEMP = angular.copy(ProductStor.product.template_source);
                  GlobalStor.global.showKarkas=1;
                  GlobalStor.global.showConfiguration=0;
                  GlobalStor.global.showCart=0;
                });
              });
              GlobalStor.global.isBox = !GlobalStor.global.isBox;
            } else {
              GlobalStor.global.activePanel = 6;
              GlobalStor.global.isBox = !GlobalStor.global.isBox;
              GlobalStor.global.showKarkas=1;
              GlobalStor.global.showConfiguration=0;
              GlobalStor.global.showCart=0;
            }
            setTimeout(function () {
              DesignServ.rebuildSVGTemplate();
            }, 250);
          }
          function addCloneProductInOrder(cloneProduct, lastProductId) {
            // console.log(cloneProduct)
            lastProductId += 1;
            cloneProduct.product_id = lastProductId;
            OrderStor.order.products.push(cloneProduct);
          }
          function createProductCopy() {
            var lastProductId = d3.max(OrderStor.order.products.map(function(item) {
                return item.product_id;
              })),

              cloneProduct = angular.copy(OrderStor.order.products[productIndex]);
            GlobalStor.global.isBox = !GlobalStor.global.isBox;
            addCloneProductInOrder(cloneProduct, lastProductId);
            CartMenuServ.joinAllAddElements();
            CartMenuServ.calculateOrderPrice();
          }
          GeneralServ.confirmAlert(
            $filter('translate')('common_words.EDIT_COPY_TXT'),
            $filter('translate')('  '),
            editProduct
          );
          GeneralServ.confirmPath(
            createProductCopy
          );

        }
        function toggleDoorConfig() {
          GlobalStor.global.checkDoors = 0;
          DesignStor.design.steps.isDoorConfig = 1;
          DesignServ.closeSizeCaclulator();
          /*
          * .config-menu{
           display : none;
           }
           .right-side, .main-content {
           width : 100%;
           }*/
          $(".config-menu").hide();
          $(".right-side").width("100%");
          $(".main-content").width("100%");
        }
        function closeDoorConfig() {
          if (DesignStor.design.steps.selectedStep3) {
            DesignStor.design.steps.selectedStep3 = 0;
            DesignStor.design.steps.selectedStep4 = 0;
            DesignStor.design.doorConfig.lockShapeIndex = '';
            DesignStor.design.doorConfig.handleShapeIndex = '';
          } else if (DesignStor.design.steps.selectedStep2) {
            DesignStor.design.steps.selectedStep2 = 0;
            DesignStor.design.doorConfig.sashShapeIndex = '';
          } else if (DesignStor.design.steps.selectedStep1) {
            DesignStor.design.steps.selectedStep1 = 0;
            DesignStor.design.doorConfig.doorShapeIndex = '';
          } else {
            //------ close door config
            DesignStor.design.steps.isDoorConfig = 0;
            //------ set Default indexes
            DesignStor.design.doorConfig = DesignStor.setDefaultDoor();
            $(".config-menu").show();
            $(".right-side").width("96rem");
            $(".main-content").width("96rem");
          }

        }
        function saveDoorConfig(product) {
          (product) ? product = product : product = ProductStor.product;
          var deferred = $q.defer();
          DesignServ.checkGlassInTemplate(product);
          DesignServ.setNewDoorParamValue(product, DesignStor.design).then(function (res) {
            SVGServ.createSVGTemplate(DesignStor.design.templateSourceTEMP, product.profileDepths).then(function (result) {
              DesignStor.design.templateTEMP = angular.copy(result);
              MainServ.preparePrice(
                DesignStor.design.templateTEMP,
                product.profile.id,
                product.glass,
                product.hardware.id,
                product.lamination.lamination_in_id
              ).then(function () {
                SVGServ.createSVGTemplate(DesignStor.design.templateSourceTEMP, product.profileDepths).then(function (result) {
                  deferred.resolve(1);
                });
              });
            });
          });
          DesignStor.design.steps.isDoorConfig = 0;
          $(".config-menu").show();
          $(".right-side").width("96rem");
          $(".main-content").width("96rem");
          return deferred.promise;
        }
        function addProdQty() {
          GlobalStor.global.product_qty++;
        }

        function subtractProdQty() {
          if (GlobalStor.global.product_qty > 1) {
            GlobalStor.global.product_qty--;
          }
        }
        /**========== FINISH ==========*/

        thisFactory.publicObj = {
          designSaved: designSaved,
          box : box,
          toggleDoorConfig : toggleDoorConfig,
          closeDoorConfig : closeDoorConfig,
          saveDoorConfig : saveDoorConfig,
          addProdQty : addProdQty,
          subtractProdQty : subtractProdQty

        };

        return thisFactory.publicObj;


      });
})();
