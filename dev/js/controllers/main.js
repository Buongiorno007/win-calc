(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .controller('MainCtrl', mainPageCtrl);

  function mainPageCtrl(MainServ, SVGServ, GlobalStor, ProductStor, UserStor) {

    var thisCtrl = this;
    thisCtrl.G = GlobalStor;
    thisCtrl.P = ProductStor;
    thisCtrl.U = UserStor;

    //------- set current Page
    GlobalStor.global.currOpenPage = 'main';
    //------- close Report
    GlobalStor.global.isReport = 0;

    //=============== FIRST START =========//

    if(GlobalStor.global.startProgramm) {
//      GlobalStor.global.isLoader = 1;
//      console.log('START main CTRL!!!!!!');
      console.log('START!!!!!!', new Date(), new Date().getMilliseconds());
      //playSound('menu');

      /** save first User entrance */
      MainServ.saveUserEntry();
      /** create order date */
      MainServ.createOrderData();
      /** set Curr Discounts */
      MainServ.setCurrDiscounts();

      /** set Templates */
      MainServ.prepareTemplates(ProductStor.product.construction_type).then(function() {
        MainServ.prepareMainPage();
        console.log('FINISH!!!!!!', new Date(), new Date().getMilliseconds());
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