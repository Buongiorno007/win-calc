(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('HistoryModule')
    .factory('ProfileServ',

  function(
    $location,
    $filter,
    $q,
    GlobalStor,
    ProductStor,
    OrderStor,
    MainServ,
    SVGServ,
    DesignServ,
    GeneralServ,
    DesignStor,
    AnalyticsServ,
    UserStor,
    localDB,
    GlassesServ
  ) {
    /*jshint validthis:true */
    var thisFactory = this;
    /**============ METHODS ================*/
    function getGlassSimData() {
      var deferred = $q.defer();
      localDB.selectLocalDB(
        "glass_similarities", {
  
        }).then(function(result) {
          GlobalStor.global.glassSimilarities = angular.copy(result);
          deferred.resolve(result);
        });
      return deferred.promise;
    }
    
    function selectProfile(newId) {
      GlobalStor.global.isChangedTemplate = 1;
      GlobalStor.global.continued = 0;
      profileForAlert(newId);
      var productTEMP;
      if(ProductStor.product.profile.id !== newId) {

        /** save previous Product */
        productTEMP = angular.copy(ProductStor.product);

        /** check new Profile */
        MainServ.setCurrentProfile(ProductStor.product, newId).then(function () {
          //------- set current template for product
          MainServ.saveTemplateInProduct(ProductStor.product.template_id).then(function() {

            /** Extra Glass finding */
            MainServ.checkGlassSizes(ProductStor.product.template);

            /** Extra Sash finding */
            if (GlobalStor.global.isSashesInTemplate) {
              /** check sizes of all hardware in sashes */
              MainServ.checkHardwareSizes(ProductStor.product.template);
            }

            /** return previous Product */
            ProductStor.product = angular.copy(productTEMP);

            if(DesignStor.design.extraGlass.length) {
              /** there are incorrect glasses
               * expose Alert */
              DesignStor.design.isGlassExtra = 1;
            } else {

              if(DesignStor.design.extraHardware.length){
                /** there are incorrect sashes
                 * expose Alert */
                DesignStor.design.isHardwareExtra = 1;
              } else {
                /** set default white lamination */
                MainServ.setCurrLamination(ProductStor.product);
                /** set new Profile */
                MainServ.setCurrentProfile(ProductStor.product, newId).then(function () {
                  MainServ.parseTemplate().then(function () {
                    /** change lamination groups as of new profile */
                    MainServ.laminatFiltering();
                    /** send analytics data to Server*/
                  });
                });
              }
            }
          });
        });
      }
    }
    function profileForAlert(newId) {
      var id = 0;
      id = newId;
      GlobalStor.global.dataProfiles = [];
     var deferred = $q.defer();
       localDB.selectLocalDB(
         "elements_profile_systems", {
          'profile_system_id': newId
        }).then(function(result) {
          GlobalStor.global.dataProfiles = angular.copy(result);
          deferred.resolve(result);
        });
      return deferred.promise;
    }
    function alert() {
      var  deferred = $q.defer();
      GlobalStor.global.nameAddElem = [];
      var name = '';
      var product = 0;
      var tr = '';
        for(var u=0; u<ProductStor.product.chosenAddElements.length; u+=1) {
          for(var f=0; f<ProductStor.product.chosenAddElements[u].length; f+=1) {
          var obj = {
            name : '',
            product : 0,
            tr: ''
          };
            for (var y = 0; y<GlobalStor.global.dataProfiles.length; y+=1) {
              if (ProductStor.product.chosenAddElements[u][f].parent_element_id === GlobalStor.global.dataProfiles[y].element_id) {
                obj.tr = ProductStor.product.chosenAddElements[u][f].name;
              } else {
                obj.name = ProductStor.product.chosenAddElements[u][f].name;
              }    
            }
              GlobalStor.global.nameAddElem.push(obj)
          }
        }
        for (var d=0; d<GlobalStor.global.nameAddElem.length; d+=1) {
          if(GlobalStor.global.nameAddElem[d].name === GlobalStor.global.nameAddElem[d].tr) {
            delete GlobalStor.global.nameAddElem[d].name;
          }
        }
        for (var d=0; d<GlobalStor.global.nameAddElem.length; d+=1) {
          if(GlobalStor.global.nameAddElem[d].name !== undefined && GlobalStor.global.continued === 0) {
            GlobalStor.global.dangerAlert = 1;
          }
        }
        return deferred.promise;
    }

   
    function checkForAddElem(newId) {
      const lastChoosenProfileId = ProductStor.product.profile.id;
      const lastChoosenGlass = ProductStor.product.glass[0].id;
      getGlassSimData()
      var  deferred = $q.defer();
      profileForAlert(newId).then(function() {
        alert();
        // .then(function() {});
        if(GlobalStor.global.dangerAlert < 1 || GlobalStor.global.continued === 1) {
          selectProfile(newId);
        }
      });
      setTimeout(() => {
        if(GlobalStor.global.glasses.length) {
          GlobalStor.global.glasses = GlobalStor.global.glasses.map((item) => {
            return item.map((elem) => {
              elem.apprPrice = GlassesServ.selectGlass(elem.id, elem.sku, elem.glass_color, elem)
              return elem;
            })
          });
        }
        for (let glassSim of GlobalStor.global.glassSimilarities) {
          if (glassSim.profile_system_id === lastChoosenProfileId && glassSim.element_id === lastChoosenGlass) {
            for (let element of GlobalStor.global.glassSimilarities) {
              if (element.profile_system_id === newId && element.similarity_id === glassSim.similarity_id) {
                const similarObj = GlobalStor.global.glasses[0].filter((el) => el.id === element.element_id && el);
                GlassesServ.selectGlass(similarObj[0].id, similarObj[0].sku, similarObj[0].glass_color, similarObj[0]);
              }
            }
          }
        }
      }, 1);
      //Sorry about that, but to calculate correct price for glass with ranges I need to call this function
      setTimeout(() => {
        MainServ.setProductPriceTOTAL(ProductStor.product)
      }, 1);
    }

    function closeButton(id) {
      if (($location.path() === "/light" || $location.path() === "/mobile") && !ProductStor.product.is_addelem_only) {
        SVGServ.createSVGTemplate(DesignStor.design.templateSourceTEMP, ProductStor.product.profileDepths).then(function (result) {
          DesignStor.design.templateTEMP = angular.copy(result);
        });
        ProductStor.product.template_source = DesignStor.design.templateSourceTEMP;
        ProductStor.product.template = DesignStor.design.templateTEMP;
        if (DesignStor.design.activeSubMenuItem > 0) {
          DesignStor.design.activeSubMenuItem = 0;
          GlobalStor.global.goLeft = false;
          GlobalStor.global.showTemplates = false;
          GlobalStor.global.activePanel = 0;
          $(document).ready(function() {
            $(".temp-fig-rehau").removeClass("active")
          })
        }
       
      }

      GlobalStor.global.configMenuTips++;
      //тут тоже может быть
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

      GlobalStor.global.isServiceCalculator = 0;
      GlobalStor.global.typeMenu = 5555;
      GlobalStor.global.typeMenuID = 5555;
      GlobalStor.global.servicesPriceIndex = -1;

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
            if ($location.path() !== '/mobile') {
              if ($location.path() !== '/light') {
                $location.path("/design")
                GlobalStor.global.currOpenPage = 'design';
              } else {
                $(".config-menu").hide();
                $(".right-side").width("100%");
                $(".main-content").width("100%");
              }
            }
            GlobalStor.global.templateTEMP = angular.copy(ProductStor.product);
            DesignServ.setDoorConfigDefault(ProductStor.product).then(function (result) {
              if ($location.path() !== '/mobile') {
                DesignStor.design.steps.isDoorConfig = 1;
              } else {
                DesignStor.design.isDoorConfigMobile = 1;
                DesignStor.design.showMobileStep = 0;
              }
            })
          }
        } if (id === 8) {
          let someArray = []
          GlobalStor.global.templatesImgs.forEach(template => {
            someArray.push(template.src)
          })
        } else {
          // GlobalStor.global.activePanel = (GlobalStor.global.activePanel === id) ? 0 : id;
          if (GlobalStor.global.activePanel === id) {
            GlobalStor.global.activePanel = 0;
            GlobalStor.global.isServiceCalculator = 0;
            if (($location.path() === '/light' || $location.path() === "/mobile") && !ProductStor.product.is_addelem_only) {
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
    //------ clicking
    alert: alert;
    checkForAddElem: checkForAddElem;
    profileForAlert: profileForAlert;
    selectProfile: selectProfile;
    showInfoBox: MainServ.showInfoBox;
    closeButton: closeButton;

    thisFactory.publicObj = {
    alert:alert,
    checkForAddElem: checkForAddElem,
    profileForAlert: profileForAlert,
    selectProfile: selectProfile,
    closeButton: closeButton,
    };

    return thisFactory.publicObj;



  });
})();
