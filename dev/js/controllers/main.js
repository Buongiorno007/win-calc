(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .controller('MainCtrl', mainPageCtrl);

  function mainPageCtrl(loginServ, MainServ, SVGServ, GlobalStor, ProductStor, UserStor, AuxStor) {

    var thisCtrl = this;
    thisCtrl.G = GlobalStor;
    thisCtrl.P = ProductStor;
    thisCtrl.U = UserStor;
    thisCtrl.A = AuxStor;

    //------- set current Page
    GlobalStor.global.currOpenPage = 'main';
    //------- close Report
    GlobalStor.global.isReport = 0;

    //=============== FIRST START =========//

    if(GlobalStor.global.startProgramm) {
//      GlobalStor.global.isLoader = 1;
//      console.log('START main CTRL!!!!!!');
//      console.log('START!!!!!!', new Date(), new Date().getMilliseconds());
      //playSound('menu');

      /** save first User entrance */
      MainServ.saveUserEntry();
      /** create order date */
      MainServ.createOrderData();
      /** set Curr Discounts */
      MainServ.setCurrDiscounts();

      /** set first Template */
      MainServ.setCurrTemplate();
      /** set Templates */
      MainServ.prepareTemplates(ProductStor.product.construction_type).then(function() {
        MainServ.prepareMainPage();
        /** download all cities */
        if(GlobalStor.global.locations.cities.length === 1) {
          loginServ.downloadAllCities(1);
        }
        //console.log('FINISH!!!!!!', new Date(), new Date().getMilliseconds());
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