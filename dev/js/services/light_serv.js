(function () {
  'use strict';
  /**@ngInject*/
  angular
    .module('LightModule')
    .factory('LightServ',

      function ($http, $filter,
                globalConstants,
        $q,
        GlobalStor,
        DesignStor,
        ProductStor,
        OrderStor,
        UserStor,
        MainServ,
        GeneralServ,
        CartMenuServ,
        DesignServ,
        loginServ,
        SVGServ) {
        /*jshint validthis:true */
        var thisFactory = this;

        function errorHandler(errors) {
          window.localStorage.setItem('errors', errors)
        }

        function getStatusPrice(link) {
          window.localStorage.setItem('link', link)
          var defer = $q.defer();
          $http.get(link).then(
              function (result) {
                GlobalStor.global.isLoader = 0;
                if (result.data.cost) {
                  ProductStor.product.product_price = result.data.cost
                  ProductStor.product.productPriceDis =  result.data.cost
                  GlobalStor.global.tempPrice = ProductStor.product.product_price;
                  window.localStorage.removeItem('link')
                  window.localStorage.removeItem('errors')
                  defer.resolve(result.data);
                } else {
                  defer.resolve(false);
                }
              },
              function (err) {
                GlobalStor.global.isLoader = 0;
                console.log(err)
                defer.resolve(false);
              }
          );
          return defer.promise;
        }

        function getPrice() {
          var defer = $q.defer();
          const link = window.localStorage.getItem('link');
          const factoryId = 'b8881e50-5aeb-4e57-8eb0-49a8e1fdfef7';
          const dealerId = '89bab35f-768a-4d9f-b3bb-eb3f2a206552';
          const templateSource = {
            beads: ProductStor.product.beadsData,
          }
          
          const orderData = Object.assign(templateSource, ProductStor.product.template_source);

            const orderObj = {
              "profile_id": ProductStor.product.profile.id,
              "glass_id": ProductStor.product.glass[0].id.toString(),
              "hardware_id": ProductStor.product.hardware.id,
              "lamination_in_id": ProductStor.product.lamination.lamination_in_id,
              "lamination_out_id": ProductStor.product.lamination.lamination_out_id,
              "template_height": ProductStor.product.template_height,
              "template_width": ProductStor.product.template_width,
              "template_source": orderData
            }
          if (link) {
            getStatusPrice(link).then((resp) => {
              defer.resolve(resp)
            });
          } else {
            GlobalStor.global.isLoader = 1;
            $http.post('https://calc.ramex.baueffect.com/' + `calculate/dealer/${dealerId}/factory/${factoryId}`, orderObj).then(
                 function (result) {
                   errorHandler(result.data.errors);
                  if (result.data.errors.length) {
                    getStatusPrice(result.data.status_link).then((resp) => {
                      defer.resolve(resp)
                    });
                  } else {
                    GlobalStor.global.isLoader = 0;
                    ProductStor.product.product_price = result.data.cost
                    ProductStor.product.productPriceDis = result.data.cost;
                    GlobalStor.global.tempPrice = ProductStor.product.product_price;
                    defer.resolve(result.data);
                  }
                },
                function (err) {
                  console.log(err)
                  defer.resolve(false);
                }
            );
          }
          return defer.promise;
        }


        function preparePrice(template, profileId, glassIds, hardwareId, laminatId) {
          var deferred = $q.defer();
          GlobalStor.global.isLoader = 1;
          MainServ.setBeadId(profileId, laminatId).then(function (beadResult) {

            if (beadResult.length && beadResult[0]) {
              var beadIds = GeneralServ.removeDuplicates(_.map(angular.copy(beadResult), function (item) {
                var beadQty = template.priceElements.beadsSize.length;
                while (--beadQty > -1) {
                  if (template.priceElements.beadsSize[beadQty].glassId === item.glassId) {
                    template.priceElements.beadsSize[beadQty].elemId = item.beadId;
                  }
                }
                return item.beadId;
              })), objXFormedPrice = {
                laminationId: laminatId,
                ids: [
                  ProductStor.product.profile.rama_list_id,
                  ProductStor.product.profile.rama_still_list_id,
                  ProductStor.product.profile.stvorka_list_id,
                  ProductStor.product.profile.impost_list_id,
                  ProductStor.product.profile.shtulp_list_id,
                  (glassIds.length > 1) ? _.map(glassIds, function (item) {
                    return item.id;
                  }) : glassIds[0].id,
                  (beadIds.length > 1) ? beadIds : beadIds[0],
                  hardwareId
                ],
                sizes: []
              };
              //-------- beads data for analysis
              ProductStor.product.beadsData = angular.copy(template.priceElements.beadsSize);
              //------- fill objXFormedPrice for sizes
              for (var size in template.priceElements) {
                /** for door elements */
                objXFormedPrice.sizes.push(angular.copy(template.priceElements[size]));
              }

              //------- set Overall Dimensions
              ProductStor.product.template_width = 0;
              ProductStor.product.template_height = 0;
              ProductStor.product.template_square = 0;
              var overallQty = ProductStor.product.template.details[0].overallDim.length;
              while (--overallQty > -1) {
                if (ProductStor.product.construction_type === 3) {
                  if (ProductStor.product.template_id === 1) {
                    ProductStor.product.template_height =
                      ProductStor.product.template.details[0].overallDim[0].h;
                  } else {
                    ProductStor.product.template_height =
                      ProductStor.product.template.details[0].overallDim[1].h - ProductStor.product.template.details[0].overallDim[0].h;
                  }
                  if (ProductStor.product.template_id === 2) {
                    ProductStor.product.template_square =
                      ProductStor.product.template.details[0].overallDim[0].square + ProductStor.product.template.details[0].overallDim[1].square + ProductStor.product.template.details[0].overallDim[2].square;
                    ProductStor.product.template_width =
                      ProductStor.product.template.details[0].overallDim[2].w;
                  } else {
                    ProductStor.product.template_square =
                      ProductStor.product.template.details[0].overallDim[0].square + ProductStor.product.template.details[0].overallDim[1].square;
                    ProductStor.product.template_width =
                      ProductStor.product.template.details[0].overallDim[1].w;

                  }
                } else {
                  ProductStor.product.template_width += ProductStor.product.template.details[0].overallDim[overallQty].w;
                  ProductStor.product.template_height += ProductStor.product.template.details[0].overallDim[overallQty].h;
                  ProductStor.product.template_square += ProductStor.product.template.details[0].overallDim[overallQty].square;
                }
              }

              //        console.warn(ProductStor.product.template_width, ProductStor.product.template_height);
              //        console.log('objXFormedPrice+++++++', JSON.stringify(objXFormedPrice));

              //console.log('START PRICE Time!!!!!!', new Date(), new Date().getMilliseconds());

              //--------- get product price
              MainServ.calculationPrice(objXFormedPrice).then(function (result) {
                deferred.resolve(1);
                /** set Report */
                if (result) {
                  //---- only for this type of user
                  if (UserStor.userInfo.user_type === 5 || UserStor.userInfo.user_type === 7) {
                    ProductStor.product.report = MainServ.prepareReport(result.constrElements);
                    //console.log('REPORT', ProductStor.product.report);
                    //console.timeEnd('price');
                  }
                }
              });

              /** calculate coeffs */
              MainServ.calculateCoeffs(objXFormedPrice);
            } else {
              deferred.resolve(1);
            }
          });
          return deferred.promise;
        }

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
                      preparePrice(
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
                          GlobalStor.global.construction_count = 0;
                          OrderStor.order.products.forEach(function (product) {
                            GlobalStor.global.construction_count += product.product_qty;

                          });
                          GlobalStor.global.isNewTemplate = 0;
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
            if (OrderStor.order.products[productIndex].lamination.id > 0) {
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
            if (type === 'auxiliary') {
              //------ open AddElements Panel
              GlobalStor.global.activePanel = 6;
            }
            if (!ProductStor.product.is_addelem_only) {
              //------- set previos Page
              var productTEMP;
              var newId = ProductStor.product.profile.id;
              /** save previous Product */
              productTEMP = angular.copy(ProductStor.product);

              /** check new Profile */
              MainServ.setCurrentProfile(ProductStor.product, newId).then(function () {
                //------- set current template for product
                MainServ.saveTemplateInProduct(ProductStor.product.template_id).then(function () {

                  /** Extra Glass finding */
                  MainServ.checkGlassSizes(ProductStor.product.template);

                  /** return previous Product */
                  ProductStor.product = angular.copy(productTEMP);
                  DesignStor.design.templateSourceTEMP = angular.copy(ProductStor.product.template_source);
                  GlobalStor.global.showKarkas = 1;
                  GlobalStor.global.showConfiguration = 0;
                  GlobalStor.global.showCart = 0;
                });
              });
              GlobalStor.global.isBox = !GlobalStor.global.isBox;
            } else {
              GlobalStor.global.activePanel = 6;
              GlobalStor.global.isBox = !GlobalStor.global.isBox;
              GlobalStor.global.showKarkas = 1;
              GlobalStor.global.showConfiguration = 0;
              GlobalStor.global.showCart = 0;
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
            var lastProductId = d3.max(_.map(OrderStor.order.products, function (item) {
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
          MainServ.setProductPriceTOTAL(ProductStor.product);
        }

        function subtractProdQty() {
          if (GlobalStor.global.product_qty > 1) {
            GlobalStor.global.product_qty--;
            MainServ.setProductPriceTOTAL(ProductStor.product);
          }
        }

        function setValueQty(newValue) {
          if (GlobalStor.global.product_qty === 0) {
            GlobalStor.global.product_qty = newValue;
          } else {
            GlobalStor.global.product_qty += '' + newValue;
          }
          MainServ.setProductPriceTOTAL(ProductStor.product);
        }

        function deleteLastNumber() {
          let tmp = "";
          tmp = angular.copy(GlobalStor.global.product_qty);
          if (tmp.length > 1) {
            tmp = tmp.slice(0, tmp.length - 1);
          } else {
            tmp = 0;
          }
          if (tmp === "") {
            GlobalStor.global.product_qty = 0;
          } else {
            GlobalStor.global.product_qty = tmp;
          }
          MainServ.setProductPriceTOTAL(ProductStor.product);
        }

        function closeSizeCaclulator() {
          GlobalStor.global.enterCount = 0;
          if (GlobalStor.global.product_qty === 0) {
            GlobalStor.global.product_qty = 1;
          }
          GlobalStor.global.isSizeCalculator = 0;
          MainServ.setProductPriceTOTAL(ProductStor.product);
        }

        /**========== FINISH ==========*/

        thisFactory.publicObj = {
          designSaved: designSaved,
          box: box,
          toggleDoorConfig: toggleDoorConfig,
          closeDoorConfig: closeDoorConfig,
          saveDoorConfig: saveDoorConfig,
          addProdQty: addProdQty,
          subtractProdQty: subtractProdQty,
          closeSizeCaclulator: closeSizeCaclulator,
          deleteLastNumber: deleteLastNumber,
          setValueQty: setValueQty,
          getPrice: getPrice,
        };

        return thisFactory.publicObj;


      });
})();
