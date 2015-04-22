
// services/main_Serv.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .factory('MainServ', navFactory);

  function navFactory($q, $filter, globalDB, GlobalStor, UserStor, ProductStor, OrderStor, optionsServ) {

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
      saveTemplateInProduct: saveTemplateInProduct
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
                      profileQty = tempProf.length;

                  //---- set countryName for each profile & adding absented elements
                  for (var j = 0; j < profileQty; j++) {
                    angular.extend(tempProf[j], profilesSource[j]);
                    for (var st = 0; st < countries.length; st++) {
                      if (tempProf[j].country == countries[st].id) {
                        tempProf[j].country = countries[st].name;
                      }
                    }
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
      ProductStor.product.profileId = GlobalStor.global.profiles[ProductStor.product.profileTypeIndex][ProductStor.product.profileIndex].id;
      ProductStor.product.profileName = GlobalStor.global.profiles[ProductStor.product.profileTypeIndex][ProductStor.product.profileIndex].name;
      ProductStor.product.profileHeatCoeff = GlobalStor.global.profiles[ProductStor.product.profileTypeIndex][ProductStor.product.profileIndex].heatCoeff;
      ProductStor.product.profileAirCoeff = GlobalStor.global.profiles[ProductStor.product.profileTypeIndex][ProductStor.product.profileIndex].airCoeff;
      console.log('product', ProductStor.product);
    }


    function downloadProfileSize(elementId) {
      var resultObj = {};
      globalDB.selectDBGlobal(globalDB.listsTableDBGlobal, {'id': elementId}).then(function(result) {
        if (result) {
          resultObj.id = result[0].id;
          resultObj.a = result[0].a;
          resultObj.b = result[0].b;
          resultObj.c = result[0].c;
          resultObj.d = result[0].d;
        }
      });
      return resultObj;
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
          console.log('end+++++++',GlobalStor.global);
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
      var templatesQty = GlobalStor.global.templatesSource.length;
      // парсинг шаблона, расчет размеров
      GlobalStor.global.templateDepths = {
        frameDepth: GlobalStor.global.profiles[profileTypeIndex][profileIndex].frameSizes,
        sashDepth: GlobalStor.global.profiles[profileTypeIndex][profileIndex].sashSizes,
        impostDepth: GlobalStor.global.profiles[profileTypeIndex][profileIndex].impostSizes,
        shtulpDepth: GlobalStor.global.profiles[profileTypeIndex][profileIndex].shtulpSizes
      };

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

//      $scope.global.createObjXFormedPrice($scope.global.product.templateDefault, profileIndex, profileId, $scope.global.product.glassId, $scope.global.product.hardwareId);
    }


    function saveTemplateInProduct(templateIndex) {
      ProductStor.product.templateSource = angular.copy(GlobalStor.global.templatesSource[templateIndex]);
      ProductStor.product.template = angular.copy(GlobalStor.global.templates[templateIndex]);
      ProductStor.product.templateIcon = angular.copy(GlobalStor.global.templatesIcon[templateIndex]);
    }


  }
})();

