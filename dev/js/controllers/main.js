(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .controller('MainCtrl', mainPageCtrl);

  function mainPageCtrl(globalDB, MainServ, optionsServ, GlobalStor, ProductStor, UserStor) {

    var thisCtrl = this;
    thisCtrl.G = GlobalStor;
    thisCtrl.P = ProductStor;
    thisCtrl.U = UserStor;

    //------- set current Page
    GlobalStor.global.currOpenPage = 'main';


    //console.log('USER:',thisCtrl.U.userInfo);

    //=============== FIRST START =========//

    if(GlobalStor.global.startProgramm) {
      console.log('START main CTRL!!!!!!');
      console.log('START Time!!!!!!', new Date(), new Date().getMilliseconds());
      //playSound('menu');

      //------- first User entrance send to Server
      globalDB.exportUserEntrance(UserStor.userInfo.phone, UserStor.userInfo.device_code); //TODO сохранять локально в юзер поле entrance
      //------- create order date
      MainServ.createOrderData();
      //------- set Curr Discounts
      MainServ.setCurrDiscounts();
      //----------- set all profiles for GlobalStor
      MainServ.downloadAllProfiles().then(function() {
console.log('PROFILES ALL =====', GlobalStor.global.profiles);
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
            MainServ.prepareTemplates(ProductStor.product.constructionType).then(function() {
              MainServ.isAddElemExist();
            });

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