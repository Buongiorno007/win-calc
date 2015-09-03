
// controllers/main.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .controller('MainCtrl', mainPageCtrl);

  function mainPageCtrl(localDB, MainServ, GlobalStor, ProductStor, UserStor) {

    var thisCtrl = this;
    thisCtrl.G = GlobalStor;
    thisCtrl.P = ProductStor;
    thisCtrl.U = UserStor;

    //------- set current Page
    GlobalStor.global.currOpenPage = 'main';

/*
    window.onbeforeunload = function (){
      console.log('REFRESH');
      return "REFRESH!!!!!";
    };
*/

    //console.log('USER:',thisCtrl.U.userInfo);

    //=============== FIRST START =========//

    if(GlobalStor.global.startProgramm) {
//      GlobalStor.global.isLoader = 1;
//      console.log('START main CTRL!!!!!!');
//      console.log('START Time!!!!!!', new Date(), new Date().getMilliseconds());
      //playSound('menu');

      //------- save first User entrance
      MainServ.saveUserEntry();
      //------- create order date
      MainServ.createOrderData();
      //------- set Curr Discounts
      MainServ.setCurrDiscounts();
      //----------- Profiles
      MainServ.downloadAllProfiles().then(function(data) {
        if(data) {
          console.log('PROFILES ALL ++++++', GlobalStor.global.profiles);
          //---------- Glasses
          MainServ.downloadAllGlasses().then(function(data) {
            if(data) {
              //--------- sorting glasses as to Type
              MainServ.sortingGlasses();
              console.log('GLASSES All +++++', GlobalStor.global.glassesAll);
              //-------- Hardwares
              MainServ.downloadAllHardwares().then(function(data){
                if(data) {
                  //--------- sorting hardware as to Type
                  MainServ.sortingHardware();
                  console.log('HARDWARE ALL ++++++', GlobalStor.global.hardwareTypes, GlobalStor.global.hardwares);
                  //--------- set Templates
                  MainServ.prepareTemplates(ProductStor.product.construction_type).then(function() {

                    //-------- Lamination
                    MainServ.downloadAllLamination().then(function(lamins) {
                      console.log('LAMINATION++++', lamins);
                      if(lamins.length) {
                        GlobalStor.global.laminationsIn = angular.copy(lamins);
                        GlobalStor.global.laminationsOut = angular.copy(lamins);
                      }
                    });
                    //-------- checking AddElements
                    MainServ.isAddElemExist();
                  });

                }
              });

            }
          });
        }

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
