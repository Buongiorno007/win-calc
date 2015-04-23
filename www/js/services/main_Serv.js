
// services/main_Serv.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .factory('MainServ', navFactory);

  function navFactory($q, $filter, globalDB, GeneralServ, GlobalStor, UserStor, ProductStor, OrderStor, optionsServ) {

    var thisFactory = this;

    //TODO move to GlobalDB
    var profilesSource = [
      {
        profileDescrip: '4 камеры',
        profileNoise: 4,
        heatCoeff: 3,
        airCoeff: 10
      },
      {
        profileDescrip: '4 камеры',
        profileNoise: 4,
        heatCoeff: 4,
        airCoeff: 11
      },
      {
        profileDescrip: '5 камер',
        profileNoise: 5,
        heatCoeff: 5,
        airCoeff: 9
      },
      {
        profileDescrip: '4 камеры',
        profileNoise: 4,
        heatCoeff: 2,
        airCoeff: 8
      },
      {
        profileDescrip: '3 камеры',
        profileNoise: 3,
        heatCoeff: 2,
        airCoeff: 8
      }
    ];

    thisFactory.publicObj = {
      createOrderData: createOrderData,
      downloadAllProfiles: downloadAllProfiles,
      setDefaultProfile: setDefaultProfile,
      downloadProfileSize: downloadProfileSize,
      //downloadAllHardwares: downloadAllHardwares,
      prepareTemplates: prepareTemplates,
      downloadAllTemplates: downloadAllTemplates,
      parseTemplate: parseTemplate,
      saveTemplateInProduct: saveTemplateInProduct,
      preparePrice: preparePrice
    };

    return thisFactory.publicObj;





    //============ methods ================//

    //------------- Create Order Id and Date
    function createOrderData() {
      var deliveryDate = new Date(),
          valuesDate,
          idDate;

      //----------- create order number for new project
      OrderStor.order.orderId = Math.floor((Math.random() * 100000));

      //------ set delivery day
      deliveryDate.setDate( deliveryDate.getDate() + GlobalStor.productionDays );
      valuesDate = [
        deliveryDate.getDate(),
        deliveryDate.getMonth() + 1
      ];
      for(idDate in valuesDate) {
        valuesDate[ idDate ] = valuesDate[ idDate ].toString().replace( /^([0-9])$/, '0$1' );
      }

      OrderStor.order.deliveryDate = valuesDate[ 0 ] + '.' + valuesDate[ 1 ] + '.' + deliveryDate.getFullYear();
      OrderStor.order.newDeliveryDate = OrderStor.order.deliveryDate;
    }



    //----------- get all profiles
    function downloadAllProfiles() {
      var deferred = $q.defer();
      globalDB.selectAllDBGlobal(globalDB.profileTypeTableDBGlobal).then(function (result) {
        if (result) {
          var resultQty = result.length,
              countries;
          GlobalStor.global.profilesType = angular.copy(result);

          //-------- get all Countries
          globalDB.selectAllDBGlobal(globalDB.countriesTableDBGlobal).then(function (result) {
            if (result) {
              countries = result;
            }
          }).then(function () {

            for (var i = 0; i < resultQty; i++) {
              globalDB.selectDBGlobal(globalDB.profileTableDBGlobal, {'profile_system_folder_id': result[i].id}).then(function (result) {
                if (result) {
                  var tempProf = angular.copy(result),
                      profileQty = tempProf.length,
                      j = 0;

                  //---- set countryName for each profile & adding absented elements
                  for (; j < profileQty; j++) {
                    angular.extend(tempProf[j], profilesSource[j]);
                    for (var st = 0; st < countries.length; st++) {
                      if (tempProf[j].country == countries[st].id) {
                        tempProf[j].country = countries[st].name;
                      }
                    }
//
                    //------- set Depthes
//                    tempProf[j].frameSizes = $q.all([
//                      downloadProfileSize(tempProf[j].rama_list_id)
//                    ]).then(function (results) {
//                      return results[0];
//
//                    });
//                    console.log('---------',  tempProf[j]);
//                    tempProf[j].frameSizes = downloadProfileSize(tempProf[j].rama_list_id).then(function(data){
//
//                      deferred.resolve('done!');
//                      return data;
//                    });

//                    downloadProfileSize(tempProf[j].rama_list_id).then(function(data){
//
//                    });
//                    tempProf[j].frameSizes = downloadProfileSize(tempProf[j].rama_list_id);
//                    tempProf[j].frameStillSizes = downloadProfileSize(tempProf[j].rama_still_list_id);
//                    tempProf[j].sashSizes = downloadProfileSize(tempProf[j].stvorka_list_id);
//                    tempProf[j].impostSizes = downloadProfileSize(tempProf[j].impost_list_id);
//                    tempProf[j].shtulpSizes = downloadProfileSize(tempProf[j].shtulp_list_id);


                    //console.log('********', JSON.stringify(tempProf[j]));
//                    globalDB.selectDBGlobal(globalDB.listsTableDBGlobal, {'id': tempProf[j].rama_list_id}).then(function(result) {
//
//                      var resultObj = {};
//                      if(result) {
//                        resultObj.id = result[0].id;
//                        resultObj.a = result[0].a;
//                        resultObj.b = result[0].b;
//                        resultObj.c = result[0].c;
//                        resultObj.d = result[0].d;
//                      }
//                      tempProf[j].frameSizes = resultObj;
//                    }).then(function() {
//
//                    }).then(function() {
//
//                    }).then(function(){
//                      tempProf[j].impostSizes = downloadProfileSize(tempProf[j].impost_list_id);
//                    }).then(function(){
//                      tempProf[j].shtulpSizes = downloadProfileSize(tempProf[j].shtulp_list_id);
//                      deferred.resolve('done!');
//                    });

                  }

                  GlobalStor.global.profiles.push(tempProf);
                  deferred.resolve('done!');
                }
              });
            }

          });
        }
      });
      return deferred.promise;
    }


    //-------- set default profile
    function setDefaultProfile() {
      var deferred = $q.defer();
      ProductStor.product.profileId = GlobalStor.global.profiles[ProductStor.product.profileTypeIndex][ProductStor.product.profileIndex].id;
      ProductStor.product.profileName = GlobalStor.global.profiles[ProductStor.product.profileTypeIndex][ProductStor.product.profileIndex].name;
      ProductStor.product.profileHeatCoeff = GlobalStor.global.profiles[ProductStor.product.profileTypeIndex][ProductStor.product.profileIndex].heatCoeff;
      ProductStor.product.profileAirCoeff = GlobalStor.global.profiles[ProductStor.product.profileTypeIndex][ProductStor.product.profileIndex].airCoeff;
      deferred.resolve('done');
      return deferred.promise;
      //console.log('product', ProductStor.product);
    }


    function downloadProfileSize(elementId) {
      var resultObj = {};
      return globalDB.selectDBGlobal(globalDB.listsTableDBGlobal, {'id': elementId}).then(function(result) {
        if (result) {
          resultObj.id = result[0].id;
          resultObj.a = result[0].a;
          resultObj.b = result[0].b;
          resultObj.c = result[0].c;
          resultObj.d = result[0].d;
        }
        return resultObj;
      });
    }


//    function downloadAllHardwares() {
//      globalDB.selectDBGlobal(globalDB.hardwareTypeTableDBGlobal, {'is_in_calculation': 1}).then(function (result) {
//        if(result) {
//          GlobalStor.global.hardwareTypes = angular.copy(results.data.hardwaresTypes);
//          GlobalStor.global.hardwares = angular.copy(results.data.hardwares);
//
//          //----- set default hardware in ProductStor
//          ProductStor.product.hardwareId = GlobalStor.global.hardwares[ProductStor.product.hardwareIndex][ProductStor.product.hardwareIndex].hardwareId;
//          ProductStor.product.hardwareName = GlobalStor.global.hardwares[ProductStor.product.hardwareIndex][ProductStor.product.hardwareIndex].hardwareName;
//          ProductStor.product.hardwareHeatCoeff = GlobalStor.global.hardwares[ProductStor.product.hardwareIndex][ProductStor.product.hardwareIndex].heatCoeff;
//          ProductStor.product.hardwareAirCoeff = GlobalStor.global.hardwares[ProductStor.product.hardwareIndex][ProductStor.product.hardwareIndex].airCoeff;
//        }
//      });
//    }


    function prepareTemplates(type) {

      downloadAllTemplates(type).then(function(data) {
        if(data) {
          GlobalStor.global.templatesSourceSTORE = angular.copy(data);
          GlobalStor.global.templatesSource = angular.copy(data);

          parseTemplate(ProductStor.product.profileTypeIndex, ProductStor.product.profileIndex);
        }
      });

    }



    //-------- get default json template
    function downloadAllTemplates(type) {
      var deferred = $q.defer();

      switch(type) {
        case 'windows':
          optionsServ.getTemplatesWindow(function (results) {
            if (results.status) {
              GlobalStor.global.templateLabel = $filter('translate')('panels.TEMPLATE_WINDOW');
              deferred.resolve(results.data.windows);
            } else {
              console.log(results);
            }
          });
          break;
        case 'windowDoor':
          optionsServ.getTemplatesWindowDoor(function (results) {
            if (results.status) {
              GlobalStor.global.templateLabel = $filter('translate')('panels.TEMPLATE_BALCONY_ENTER');
              deferred.resolve(results.data.windowDoor);
            } else {
              console.log(results);
            }
          });
          break;
        case 'balconies':
          optionsServ.getTemplatesBalcony(function (results) {
            if (results.status) {
              GlobalStor.global.templateLabel = $filter('translate')('panels.TEMPLATE_BALCONY');
              deferred.resolve(results.data.balconies);
            } else {
              console.log(results);
            }
          });
          break;
        case 'doors':
          optionsServ.getTemplatesDoor(function (results) {
            if (results.status) {
              GlobalStor.global.templateLabel = $filter('translate')('panels.TEMPLATE_DOOR');
              deferred.resolve(results.data.doors);
            } else {
              console.log(results);
            }
          });
          break;
      }

      return deferred.promise;
    }


    function parseTemplate(profileTypeIndex, profileIndex) {

      // парсинг шаблона, расчет размеров
      setTemplateDepths(profileTypeIndex, profileIndex).then(function() {
        var templatesQty = GlobalStor.global.templatesSource.length;
        for(var tem = 0; tem < templatesQty; tem++) {
          GlobalStor.global.templates.push( new Template(GlobalStor.global.templatesSource[tem], GlobalStor.global.templateDepths) );
          GlobalStor.global.templatesIcon.push( new TemplateIcon(GlobalStor.global.templatesSource[tem], GlobalStor.global.templateDepths) );
        }

        //-------- Save Template Arrays in Store
        if(GlobalStor.global.startProgramm) {
          GlobalStor.global.templatesSTORE = angular.copy(GlobalStor.global.templates);
          GlobalStor.global.templatesIconSTORE = angular.copy(GlobalStor.global.templatesIcon);
        }

        //------- set current template for product
        saveTemplateInProduct(ProductStor.product.templateIndex);

        preparePrice(ProductStor.product.template, profileTypeIndex, profileIndex, ProductStor.product.profileId, ProductStor.product.glassId, ProductStor.product.hardwareId);
      });

    }


    function setTemplateDepths(profileTypeIndex, profileIndex) {
      var deferred = $q.defer();
      GlobalStor.global.templateDepths = {
        frameDepth: GlobalStor.global.profiles[profileTypeIndex][profileIndex].frameSizes,
        frameStillDepth: GlobalStor.global.profiles[profileTypeIndex][profileIndex].frameStillSizes,
        sashDepth: GlobalStor.global.profiles[profileTypeIndex][profileIndex].sashSizes,
        impostDepth: GlobalStor.global.profiles[profileTypeIndex][profileIndex].impostSizes,
        shtulpDepth: GlobalStor.global.profiles[profileTypeIndex][profileIndex].shtulpSizes
      };
      console.log('=====', JSON.stringify(GlobalStor.global.profiles));
      console.log('!!!!!!!!!!', JSON.stringify(GlobalStor.global.profiles[profileTypeIndex][profileIndex].frameSizes));
      if(GlobalStor.global.templateDepths.frameDepth) {
        deferred.resolve('done');
      }
      return deferred.promise;
    }


    function saveTemplateInProduct(templateIndex) {
      ProductStor.product.templateSource = angular.copy(GlobalStor.global.templatesSource[templateIndex]);
      ProductStor.product.template = angular.copy(GlobalStor.global.templates[templateIndex]);
      ProductStor.product.templateIcon = angular.copy(GlobalStor.global.templatesIcon[templateIndex]);
    }



    //--------- create object to send in server for price calculation
    function preparePrice(template, profileTypeIndex, profileIndex, profileId, glassId, hardwareId) {
      setBeadId(profileId, glassId).then(function(beadId) {
        var objXFormedPrice = {
              cityId: UserStor.userInfo.city_id,
              currencyId: UserStor.userInfo.currencyId,
              profileId: profileId,
              glassId: glassId,
              hardwareId: hardwareId,
              hardwareColor: ProductStor.product.laminationInName,
              frameId: GlobalStor.global.templateDepths.frameDepth.id,
              frameSillId: GlobalStor.global.templateDepths.frameStillDepth.id,
              sashId: GlobalStor.global.templateDepths.sashDepth.id,
              impostId: GlobalStor.global.templateDepths.impostDepth.id,
              shtulpId: GlobalStor.global.templateDepths.shtulpDepth.id,
              beadId: beadId,

              framesSize: [],
              sashsSize: [],
              beadsSize: [],
              impostsSize: [],
              shtulpsSize: [],
              sashesBlock: [],
              glassSizes: [],
              glassSquares: [],
              frameSillSize: 0
            },
            templateElemQty = template.objects.length,
            item = 0;
console.log('!!!! template =====', template)
        for(; item < templateElemQty; item++) {
          if (template.objects[item].type) {
            switch (template.objects[item].type) {
              case 'frame_line':
                objXFormedPrice.framesSize.push(template.objects[item].lengthVal);
                if (template.objects[item].sill) {
                  objXFormedPrice.frameSillSize = template.objects[item].lengthVal;
                }
                break;
              case 'impost':
                objXFormedPrice.impostsSize.push(template.objects[item].parts[0].lengthVal);
                break;
              case 'sash':
                objXFormedPrice.sashsSize.push(template.objects[item].parts[0].lengthVal);
                break;
              case 'bead_line':
                objXFormedPrice.beadsSize.push(template.objects[item].lengthVal);
                break;
              case 'sash_block':
                var tempSashBlock = {},
                    tempSashBlockSize = [];
                for (var sash = 0; sash < template.objects[item].parts.length; sash++) {
                  tempSashBlockSize.push(template.objects[item].parts[sash].lengthVal);
                }
                tempSashBlock.sizes = tempSashBlockSize;
                tempSashBlock.openDir = template.objects[item].openDir;
                objXFormedPrice.sashesBlock.push(tempSashBlock);
                break;
              case 'glass_paсkage':
                var tempGlassSizes = [];
                for (var glass = 0; glass < template.objects[item].parts.length; glass++) {
                  tempGlassSizes.push(template.objects[item].parts[glass].lengthVal);
                }
                objXFormedPrice.glassSizes.push(tempGlassSizes);
                objXFormedPrice.glassSquares.push(template.objects[item].square);
                break;
              case 'dimensionsH':
                ProductStor.product.templateWidth = template.objects[item].lengthVal;
                break;
              case 'dimensionsV':
                ProductStor.product.templateHeight = template.objects[item].lengthVal;
                break;
            }
          }
        }
        console.log('objXFormedPrice+++++++', objXFormedPrice);
        console.log(JSON.stringify(objXFormedPrice));


        console.log('START PRICE Time!!!!!!', new Date());
        //--------- get product default price
        calculationPrice(objXFormedPrice);

        //------ calculate coeffs
        calculateCoeffs(objXFormedPrice);

      });

    }


    //------------ set Bead Id
    function setBeadId(profileId, glassId) {
      var deferred = $q.defer(),
          parentId, glassDepth;
      //------ define Bead Id for define template price
      globalDB.selectDBGlobal(globalDB.listsTableDBGlobal, {'id': glassId }).then(function(result) {
        if(result) {
          parentId = result[0].parent_element_id;
          //------ find glass depth
          globalDB.selectDBGlobal(globalDB.elementsTableDBGlobal, {'id': parentId }).then(function(result) {
            if(result) {
              glassDepth = result[0].glass_width;
              //------ find bead Id as to glass Depth and profile Id
              globalDB.selectDBGlobal(globalDB.beadsTableDBGlobal, {'profile_system_id': {"value": profileId, "union": 'AND'}, "glass_width": glassDepth}).then(function(result) {
                if(result) {
                  //ProductStor.product.beadId = result[0].list_id;
                  deferred.resolve(result[0].list_id);
                  //console.log($scope.global.product.beadId);
                } else {
                  console.log(result);
                }
              });
            } else {
              console.log(result);
            }
          });
        } else {
          console.log(result);
        }
      });
      return deferred.promise;
    }


    //---------- Price define
    function calculationPrice(obj) {
      globalDB.calculationPrice(obj, function (result) {
        if(result.status){
          console.log('price');
          console.log(result.data);


          ProductStor.product.templatePriceSELECT = GeneralServ.roundingNumbers(result.data.price);
          console.log('ProductStor.product.templatePriceSELECT', ProductStor.product.templatePriceSELECT);
          //setProductPriceTOTAL();

          console.log('FINISH PRICE Time!!!!!!', new Date());
          GlobalStor.global.isFindPriceProcess = false;
        } else {
          console.log(result);
        }
      });
    }


    //---------- Coeffs define
    function calculateCoeffs(objXFormedPrice) {
      var templateQty = ProductStor.product.template.objects.length,
          constructionSquareTotal,
          glassSquareTotal,
          prifileHeatCoeffTotal,
          glassHeatCoeffTotal,
          item;
      //------- total construction square define
      for (item = 0; item < templateQty; item++) {
        if(ProductStor.product.template.objects[item].type === "square") {
          constructionSquareTotal = ProductStor.product.template.objects[item].squares.reduce(function(a, b) {
            return a + b;
          });
        }
      }
      //-------- total glasses square define
      glassSquareTotal = objXFormedPrice.glassSquares.reduce(function(a, b) {
        return a + b;
      });
      //-------- coeffs define
      prifileHeatCoeffTotal = ProductStor.product.profileHeatCoeff * (constructionSquareTotal - glassSquareTotal);
      glassHeatCoeffTotal = ProductStor.product.glassHeatCoeff * glassSquareTotal;
      //-------- calculate Heat Coeff Total
      ProductStor.product.heatTransferTOTAL = GeneralServ.roundingNumbers( ((prifileHeatCoeffTotal + glassHeatCoeffTotal)/constructionSquareTotal) );

      //-------- calculate Air Coeff Total
      //ProductStor.product.airCirculationTOTAL = + ProductStor.product.profileAirCoeff + ProductStor.product.glassAirCoeff + ProductStor.product.hardwareAirCoeff;

    }


  }
})();

