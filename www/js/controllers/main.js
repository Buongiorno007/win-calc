
// controllers/main.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .controller('MainCtrl', mainPageCtrl);

  function mainPageCtrl(GlobalStor, ProductStor, MainServ, optionsServ) {


    //=============== FIRST START =========//

    if(GlobalStor.global.startProgramm && GlobalStor.global.isCreatedNewProject && GlobalStor.global.isCreatedNewProduct) {
      console.log('START main CTRL!!!!!!');
      console.log('START Time!!!!!!', new Date());
      //playSound('menu');

      //------- create order date
      MainServ.createOrderData();

      //----------- set all profiles for GlobalStor
      MainServ.downloadAllProfiles().then(function() {
        //--------- set default profile in ProductStor
        MainServ.setDefaultProfile();

      }).then(function() {
        //----------- set all sizes (a, b, c, d) for each profiles in GlobalStor
        var profileTypeQty = GlobalStor.global.profiles.length,
            t, p;

        for(t = 0; t < profileTypeQty; t++) {
          var profileQty = GlobalStor.global.profiles[t].length;
          for (p = 0; p < profileQty; p++) {
            GlobalStor.global.profiles[t][p].frameSizes = MainServ.downloadProfileSize(GlobalStor.global.profiles[t][p].rama_list_id);
            GlobalStor.global.profiles[t][p].frameStillSizes = MainServ.downloadProfileSize(GlobalStor.global.profiles[t][p].rama_still_list_id);
            GlobalStor.global.profiles[t][p].sashSizes = MainServ.downloadProfileSize(GlobalStor.global.profiles[t][p].stvorka_list_id);
            GlobalStor.global.profiles[t][p].impostSizes = MainServ.downloadProfileSize(GlobalStor.global.profiles[t][p].impost_list_id);
            GlobalStor.global.profiles[t][p].shtulpSizes = MainServ.downloadProfileSize(GlobalStor.global.profiles[t][p].shtulp_list_id);
          }
        }

      }).then(function(){

        //----------- set all glasses for GlobalStor
        optionsServ.getAllGlass(function (results) {
          if (results.status) {
            GlobalStor.global.glassTypes = angular.copy(results.data.glassTypes);
            GlobalStor.global.glasses = angular.copy(results.data.glasses);

            //----- set default glass in ProductStor
            ProductStor.product.glassId = GlobalStor.global.glasses[ProductStor.product.glassIndex][ProductStor.product.glassIndex].glassId;
            ProductStor.product.glassName = GlobalStor.global.glasses[ProductStor.product.glassIndex][ProductStor.product.glassIndex].glassName;
            ProductStor.product.glassHeatCoeff = GlobalStor.global.glasses[ProductStor.product.glassIndex][ProductStor.product.glassIndex].heatCoeff;
            ProductStor.product.glassAirCoeff = GlobalStor.global.glasses[ProductStor.product.glassIndex][ProductStor.product.glassIndex].airCoeff;

            //--------- set Templates
            MainServ.prepareTemplates(GlobalStor.global.constructionType);

          } else {
            console.log(results);
          }
        });



        //----------- set all hardware for GlobalStor
        optionsServ.getAllHardware(function (results) {
          if (results.status) {
            GlobalStor.global.hardwareTypes = angular.copy(results.data.hardwaresTypes);
            GlobalStor.global.hardwares = angular.copy(results.data.hardwares);

            //----- set default hardware in ProductStor
            ProductStor.product.hardwareId = GlobalStor.global.hardwares[ProductStor.product.hardwareIndex][ProductStor.product.hardwareIndex].hardwareId;
            ProductStor.product.hardwareName = GlobalStor.global.hardwares[ProductStor.product.hardwareIndex][ProductStor.product.hardwareIndex].hardwareName;
            ProductStor.product.hardwareHeatCoeff = GlobalStor.global.hardwares[ProductStor.product.hardwareIndex][ProductStor.product.hardwareIndex].heatCoeff;
            ProductStor.product.hardwareAirCoeff = GlobalStor.global.hardwares[ProductStor.product.hardwareIndex][ProductStor.product.hardwareIndex].airCoeff;

          } else {
            console.log(results);
          }
        });

        //        MainServ.downloadAllHardwares();




      });



    }

  }
})();

