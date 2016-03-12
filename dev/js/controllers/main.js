(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('MainCtrl',

    
  function(
    $location,
    $timeout,
    DesignServ,
    DesignStor,
    loginServ,
    MainServ,
    SVGServ,
    GlobalStor,
    ProductStor,
    UserStor,
    AuxStor,
    globalConstants
  ) {
    /*jshint validthis:true */
   var thisCtrl = this;

    thisCtrl.G = GlobalStor;
    thisCtrl.P = ProductStor;
    thisCtrl.U = UserStor;
    thisCtrl.A = AuxStor;
    thisCtrl.constants = globalConstants;
    thisCtrl.D = DesignStor;
    //------- set current Page
    GlobalStor.global.currOpenPage = 'main';
    //------- close Report
    GlobalStor.global.isReport = 0;

      thisCtrl.config = {
      //---- design menu
      isDesignError: 0,

      DELAY_SHOW_FIGURE_ITEM: 1000,
      typing: 'on'
    };


    /**============ METHODS ================*/

    //TODO delete
    function goToEditTemplate() {
      GlobalStor.global.activePanel = 0;
      DesignStor.design.isGlassExtra = 0;
      $location.path('/design');
    }




    /**=============== FIRST START =========*/

    if(GlobalStor.global.startProgramm) {
//      GlobalStor.global.isLoader = 1;
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
        /** start lamination filtering */
        MainServ.laminatFiltering();
        /** download all cities */
        if(GlobalStor.global.locations.cities.length === 1) {
          loginServ.downloadAllCities(1);
        }
        /** for SVG_MAIN */
        //--------- set templateTEMP from ProductStor
        DesignServ.setDefaultTemplate();

        //console.log('FINISH!!!!!!', new Date(), new Date().getMilliseconds());
      });
    }



    /**================ EDIT PRODUCT =================*/

    if (GlobalStor.global.productEditNumber) {
      console.log('EDIT!!!!');
      console.log('product = ', ProductStor.product);
      SVGServ.createSVGTemplate(ProductStor.product.template_source, ProductStor.product.profileDepths)
        .then(function(data) {
          ProductStor.product.template = data;
        });
    }



    //============ if Door Construction
    if(ProductStor.product.construction_type === 4) {
      DesignServ.setIndexDoorConfig();
    }







    /**========== FINISH ==========*/

    //------ clicking
    thisCtrl.goToEditTemplate = goToEditTemplate;
    thisCtrl.setDefaultConstruction = DesignServ.setDefaultConstruction;


  });
})();


//event.srcEvent.stopPropagation();
//event.preventDefault();
//$event.stopImmediatePropagation();