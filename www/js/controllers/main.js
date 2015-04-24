
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

    var thisCtrl = this;
    thisCtrl.global = GlobalStor.global;
    thisCtrl.product = ProductStor.product;


    //=============== FIRST START =========//

    if(GlobalStor.global.startProgramm) {
      console.log('START main CTRL!!!!!!');
      console.log('START Time!!!!!!', new Date(), new Date().getMilliseconds());
      //playSound('menu');

      //------- create order date
      MainServ.createOrderData();

      //----------- set all profiles for GlobalStor
      MainServ.downloadAllProfiles().then(function() {

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

      });

    }




    //================ EDIT PRODUCT =================

    if (GlobalStor.global.productEditNumber !== '' && !GlobalStor.global.isCreatedNewProject && !GlobalStor.global.isCreatedNewProduct) {
      console.log('EDIT!!!!');
      console.log('product = ', ProductStor.product);
      //TODO templates!!!!!
    }





    //=============== CREATE NEW PROJECT =========//
    if(!GlobalStor.global.startProgramm && GlobalStor.global.isCreatedNewProject && GlobalStor.global.isCreatedNewProduct && !GlobalStor.global.isReturnFromDiffPage) {
      MainServ.createNewProject();
    }



    //=============== CREATE NEW PRODUCT =========//
    if (!GlobalStor.global.startProgramm && !GlobalStor.global.isCreatedNewProject && GlobalStor.global.isCreatedNewProduct && !GlobalStor.global.isReturnFromDiffPage) {
      MainServ.createNewProduct();
    }





  }
})();


//event.srcEvent.stopPropagation();
//event.preventDefault();
//$event.stopImmediatePropagation();

/*

 hm-pinch="pinch($event)" hm-rotate="rotate($event)"

 $scope.rotate = function(event) {
 $scope.rotation = event.gesture.rotation % 360;
 event.gesture.preventDefault();
 }
 $scope.pinch = function(event) {
 $scope.scaleFactor = event.gesture.scale;
 event.gesture.preventDefault();
 }

 */
