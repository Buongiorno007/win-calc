(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('AddElementsCtrl',

  function(
    $filter,
    $timeout,
    globalConstants,
    GeneralServ,
    AddElementsServ,
    AddElementMenuServ,
    DesignServ,
    GlobalStor,
    AuxStor,
    ProductStor
  ) {
    /*jshint validthis:true */
    var thisCtrl = this;
    thisCtrl.constants = globalConstants;
    thisCtrl.G = GlobalStor;
    thisCtrl.P = ProductStor;
    thisCtrl.A = AuxStor;

    thisCtrl.config = {
      DELAY_START: globalConstants.STEP,
      addElementDATA: GeneralServ.addElementDATA,
      DELAY_SHOW_INSIDESLOPETOP: globalConstants.STEP * 20,
      DELAY_SHOW_INSIDESLOPERIGHT: globalConstants.STEP * 22,
      DELAY_SHOW_INSIDESLOPELEFT: globalConstants.STEP * 21,
      DELAY_SHOW_FORCECONNECT: globalConstants.STEP * 30,
      DELAY_SHOW_BALCONCONNECT: globalConstants.STEP * 35,
      DELAY_SHOW_BUTTON: globalConstants.STEP * 40,
      DELAY_SHOW_ELEMENTS_MENU: globalConstants.STEP * 12,
      colorFilter: 5555,
      typing: 'on'
    };
    thisCtrl.configaddElementDATA = GeneralServ.addElementDATA;
    //------- translate
    thisCtrl.INSIDES = $filter('translate')('add_elements.INSIDES');
    thisCtrl.OUTSIDES = $filter('translate')('add_elements.OUTSIDES');
    thisCtrl.COMPONENTS = $filter('translate')('add_elements.COMPONENTS');
    thisCtrl.OTHERS = $filter('translate')('add_elements.OTHERS');
    thisCtrl.OTHER = $filter('translate')('add_elements.OTHER');
    thisCtrl.ALL = $filter('translate')('add_elements.ALL');
    thisCtrl.CHOOSE = $filter('translate')('add_elements.CHOOSE');
    thisCtrl.QTY_LABEL = $filter('translate')('add_elements.QTY_LABEL');
    thisCtrl.WIDTH_LABEL = $filter('translate')('add_elements.WIDTH_LABEL');
    thisCtrl.HEIGHT_LABEL = $filter('translate')('add_elements.HEIGHT_LABEL');
    thisCtrl.OTHER_ELEMENTS1 = $filter('translate')('add_elements.OTHER_ELEMENTS1');
    thisCtrl.OTHER_ELEMENTS2 = $filter('translate')('add_elements.OTHER_ELEMENTS2');
    thisCtrl.LIST_VIEW = $filter('translate')('add_elements.LIST_VIEW');


    /**============ METHODS ================*/
    // Show Window Scheme Dialog
    function showWindowScheme() {
      filterAddElem();
      //playSound('fly');
      AuxStor.aux.isWindowSchemeDialog = true;
      DesignServ.showAllDimension(globalConstants.SVG_ID_ICON);
    }

    function closeWindowScheme() {
      //playSound('fly');
      AuxStor.aux.isWindowSchemeDialog = false;
    }

    function click(id){
      GlobalStor.global.typeMenu = 0;
      GlobalStor.global.typeMenuID = id;
      $timeout(function(id){
        GlobalStor.global.typeMenu = GlobalStor.global.typeMenuID;
        thisCtrl.config.colorFilter = GlobalStor.global.typeMenuID;
        if (GlobalStor.global.typeMenu === 5555) {
          $('.aux-handle').css({
          'left': 14.375 +'rem',
           'top': 82.625 +'rem'
          });
        } else {
          $('.aux-handle').css({
           'left': 34.375 +'rem',
           'top': 65.625 +'rem'
          });
        }
      },100);
    }

    /**========== FINISH ==========*/

    //------ clicking
    thisCtrl.click = click;
    thisCtrl.selectAddElement = AddElementsServ.selectAddElement;
    thisCtrl.initAddElementTools = AddElementsServ.initAddElementTools;
    thisCtrl.pressCulculator = AddElementMenuServ.pressCulculator;
    thisCtrl.openAddElementListView = AddElementsServ.openAddElementListView;
    thisCtrl.showWindowScheme = showWindowScheme;
    thisCtrl.closeWindowScheme = closeWindowScheme;

  });
})();
