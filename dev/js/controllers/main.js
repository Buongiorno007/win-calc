(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .controller('MainCtrl', mainPageCtrl);

  function mainPageCtrl(localDB, MainServ, SVGServ, GlobalStor, ProductStor, UserStor) {

    var thisCtrl = this;
    thisCtrl.G = GlobalStor;
    thisCtrl.P = ProductStor;
    thisCtrl.U = UserStor;

    //------- set current Page
    GlobalStor.global.currOpenPage = 'main';
    //------- close Report
    GlobalStor.global.isReport = 0;

//    localDB.cleanLocalDB({localDB.tablesLocalDB.order_addelements.tableName: 1});
    //=============== FIRST START =========//

    if(GlobalStor.global.startProgramm) {
//      GlobalStor.global.isLoader = 1;
//      console.log('START main CTRL!!!!!!');
      console.log('START Time!!!!!!', new Date(), new Date().getMilliseconds());
      //playSound('menu');

      /** save first User entrance */
      MainServ.saveUserEntry();
      /** create order date */
      MainServ.createOrderData();
      /** set Curr Discounts */
      MainServ.setCurrDiscounts();
      /** download All Currencies */
      MainServ.downloadAllCurrencies();
      /** download All Profiles */
      MainServ.downloadAllElemAsGroup(localDB.tablesLocalDB.profile_system_folders.tableName, localDB.tablesLocalDB.profile_systems.tableName, GlobalStor.global.profilesType, GlobalStor.global.profiles).then(function(data) {
        if(data) {
//          console.log('PROFILES ALL ++++++',GlobalStor.global.profilesType, GlobalStor.global.profiles);
          /** download All Glasses */
          MainServ.downloadAllGlasses().then(function(data) {
            if(data) {
              /** sorting glasses as to Type */
              MainServ.sortingGlasses();
//              console.log('GLASSES All +++++', GlobalStor.global.glassesAll);
              /** download All Hardwares */
              MainServ.downloadAllElemAsGroup(localDB.tablesLocalDB.window_hardware_folders.tableName, localDB.tablesLocalDB.window_hardware_groups.tableName, GlobalStor.global.hardwareTypes, GlobalStor.global.hardwares).then(function(data){
                if(data) {
//                  console.log('HARDWARE ALL ++++++', GlobalStor.global.hardwareTypes, GlobalStor.global.hardwares);
                  /** set Templates */
                  MainServ.prepareTemplates(ProductStor.product.construction_type).then(function() {
                    GlobalStor.global.showRoomSelectorDialog = 1;
                    /** download All AddElements */
                    MainServ.downloadAllAddElem().then(function() {
                      MainServ.sortingAllAddElem();
                    });
                    /** download All Lamination */
                    MainServ.downloadAllLamination().then(function(lamins) {
//                      console.log('LAMINATION++++', lamins);
                      if(lamins.length) {
                        GlobalStor.global.laminationsIn = angular.copy(lamins);
                        GlobalStor.global.laminationsOut = angular.copy(lamins);
                      }
                    });

                    /** download Cart Menu Data */
                    MainServ.downloadCartMenuData();
                    console.log('FINISH!!!!!!', new Date(), new Date().getMilliseconds());
                  });

                }
              });

            }
          });
        }

      });

    }


    //================ EDIT PRODUCT =================
    if (GlobalStor.global.productEditNumber) {
      console.log('EDIT!!!!');
      console.log('product = ', ProductStor.product);
      SVGServ.createSVGTemplate(ProductStor.product.template_source, ProductStor.product.profileDepths).then(function(data) {
        ProductStor.product.template = data;
      });
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