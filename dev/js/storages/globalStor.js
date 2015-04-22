(function(){
  'use strict';
    /**
     * @ngInject
     */
  angular
    .module('BauVoiceApp')
    .factory('GlobalStor', globalStorageFactory);

  function globalStorageFactory($filter) {

    var thisFactory = this;

    thisFactory.publicObj = {

      svgTemplateIconWidth: 70,
      svgTemplateIconHeight: 70,
      svgTemplateIconBigWidth: 500,
      svgTemplateIconBigHeight: 450,
      svgTemplateWidth: 800,
      svgTemplateHeight: 700,
      productionDays: 15,

      addElementsGroupClass: [
        'aux_color_connect', 'aux_color_big', 'aux_color_middle', 'aux_color_slope', 'aux_color_middle', 'aux_color_slope', 'aux_color_connect', 'aux_color_small', 'aux_color_big', 'aux_color_middle', 'aux_color_small'
      ],

      //------------ Languages
      languages: [
        {label: 'ua', name: 'Українська'},
        {label: 'ru', name: 'Русский'},
        {label: 'en', name: 'English'},
        {label: 'de', name: 'Deutsch'},
        {label: 'ro', name: 'Român'}
      ],

      globalSource: {

        constructionType: 'windows',

//        isConstructWind: true,
//        isConstructWindDoor: false,
//        isConstructBalcony: false,
//        isConstructDoor: false,
        //---- чтобы не создавался черновик при запуске проги
        startProgramm: true,
        isCreatedNewProject: true,
        isCreatedNewProduct: true,
        isOrderFinished: false,
        isOpenedCartPage: false,
        isOpenedHistoryPage: false,
        isReturnFromDiffPage: false,
        isFindPriceProcess: false,

        productEditNumber: '',
        orderEditNumber: false,


        //------- Templates


//        templatesWindSTORE: [],
//        templatesWindDoorSTORE: [],
//        templatesBalconySTORE: [],
//        templatesDoorSTORE: [],
//        templatesWindListSTORE: [],
//        templatesWindIconListSTORE: [],
//        templatesWindDoorListSTORE: [],
//        templatesWindDoorIconListSTORE: [],
//        templatesBalconyListSTORE: [],
//        templatesBalconyIconListSTORE: [],
//        templatesDoorListSTORE: [],
//        templatesDoorIconListSTORE: [],
//
//        templatesWindSource: [],
//        templatesWindDoorSource: [],
//        templatesBalconySource: [],
//        templatesDoorSource: [],
//        templatesWindList: [],
//        templatesWindDoorList: [],
//        templatesBalconyList: [],
//        templatesDoorList: [],
//        templatesWindIconList: [],
//        templatesWindDoorIconList: [],
//        templatesBalconyIconList: [],
//        templatesDoorIconList: [],

        templateDepths: {},
        templateLabel: '',
        templatesSource: [],
        templates: [],
        templatesIcon: [],
        templatesSourceSTORE: [],
        templatesSTORE: [],
        templatesIconSTORE: [],



        //------ Profiles
        profiles: [],
        profilesType: [],
//        allProfileFrameSizes: [],
//        allProfileFrameStillSizes: [],
//        allProfileSashSizes: [],
//        allProfileImpostSizes: [],
//        allProfileShtulpSizes: [],

        //------- Glasses
        glasses: [],
        glassTypes: [],

        //------ Hardwares
        hardwares: [],
        hardwareTypes: [],

        //------ Lamination
        laminationsWhite: $filter('translate')('mainpage.CONFIGMENU_NOT_LAMINATION'),



        orders: [],

        objXFormedPriceSource: {
          cityId: '',
          profileId: '',
          glassId: '',
          framesSize: [],
          sashsSize: [],
          beadsSize: [],
          impostsSize: [],
          shtulpsSize: [],
          sashesBlock: [],
          glassSizes: [],
          glassSquares: [],
          frameSillSize: 0
        },

        objXAddElementPriceSource: {
          cityId: 0,
          elementId: 0,
          elementLength: 0
        },

        //------ config-pannels tools
        showNavMenu: true,
        isConfigMenu: false,
        showPanels: {},
        isTemplatePanel: false,
        isProfilePanel: false,
        isGlassPanel: false,
        isHardwarePanel: false,
        isLaminationPanel: false,
        isAddElementsPanel: false,



        isAddElement: false,
        isAddElementListView: false,
        isConstructSizeCalculator: false,
        isTabFrame: false,

        showRoomSelectorDialog: false,
        isRoomsDialog: false,
        isOpenSettingsPage: false,
        isChangedTemplate: false,
        isVoiceHelper: false,
        isShowCommentBlock: false,
        showMasterDialog: false,
        showOrderDialog: false,
        showCreditDialog: false

      },

      setDefaultGlobal: setDefaultGlobal
    };

    thisFactory.publicObj.global = setDefaultGlobal();

    return thisFactory.publicObj;


    //============ methods ================//

    function setDefaultGlobal() {
      var publicObj = angular.copy(thisFactory.publicObj.globalSource);
      return publicObj;
    }


  }
})();
