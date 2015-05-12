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

    //------- set current Page
    GlobalStor.global.currOpenPage = 'main';



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

            //--------- set Templates
            MainServ.prepareTemplates(ProductStor.product.constructionType);

          } else {
            console.log(results);
          }
        });

      });

    }


    //================ EDIT PRODUCT =================
    if (GlobalStor.global.productEditNumber > 0) {
      console.log('EDIT!!!!');
      console.log('product = ', ProductStor.product);
      //TODO templates!!!!!
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