(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('AddElementsListCtrl',

  function(
    $filter,
    globalConstants,
    GeneralServ,
    AddElementsServ,
    AddElementMenuServ,
    GlobalStor,
    ProductStor,
    UserStor,
    AuxStor
  ) {
    /*jshint validthis:true */
    var thisCtrl = this;
    thisCtrl.G = GlobalStor;
    thisCtrl.P = ProductStor;
    thisCtrl.U = UserStor;
    thisCtrl.A = AuxStor;


    thisCtrl.config = {
      addElementDATA: GeneralServ.addElementDATA,
      DELAY_START: globalConstants.STEP,
      DELAY_SHOW_ELEMENTS_MENU: globalConstants.STEP * 6,
      filteredGroups: [],
      typing: 'on'
    };

    //------- translate
    thisCtrl.NAME_LABEL = $filter('translate')('add_elements.NAME_LABEL');
    thisCtrl.QTY_LABEL = $filter('translate')('add_elements.QTY_LABEL');
    thisCtrl.WIDTH_LABEL = $filter('translate')('add_elements.WIDTH_LABEL');
    thisCtrl.HEIGHT_LABEL = $filter('translate')('add_elements.HEIGHT_LABEL');
    thisCtrl.TOTAL_PRICE_TXT = $filter('translate')('add_elements.TOTAL_PRICE_TXT');
    thisCtrl.SCHEME_VIEW = $filter('translate')('add_elements.SCHEME_VIEW');

    //------ clicking
    thisCtrl.selectAddElement = AddElementsServ.selectAddElement;
    thisCtrl.initAddElementTools = AddElementsServ.initAddElementTools;
    thisCtrl.deleteAddElement = AddElementMenuServ.deleteAddElement;
    thisCtrl.deleteAllAddElements = AddElementMenuServ.deleteAllAddElements;
    thisCtrl.closeAddElementListView = AddElementsServ.closeAddElementListView;
    thisCtrl.pressCulculator = AddElementMenuServ.pressCulculator;

  });
})();
