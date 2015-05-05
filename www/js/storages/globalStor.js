
// storages/globalStor.js

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

      globalSource: {
        startProgramm: true, // for START
        //------ navigation
        isNavMenu: true,
        isConfigMenu: false,
        activePanel: 0,

        isCreatedNewProject: true,
        isCreatedNewProduct: true,
        productEditNumber: 0,
        orderEditNumber: 0,

        prevOpenPage: '',
        currOpenPage: 'main',

//        isOrderFinished: false,
//        isOpenedCartPage: false,
//        isOpenedHistoryPage: false,
//        isReturnFromDiffPage: false,
//        isOpenSettingsPage: false,

        isChangedTemplate: false,
        isVoiceHelper: false,
        voiceHelperLanguage: '',
        showRoomSelectorDialog: false,
        isShowCommentBlock: false,

        //---- Calculators
        isQtyCalculator: false,
        isSizeCalculator: false,
        isWidthCalculator: false,
        isColorSelector: false,

        isMinSizeRestriction: 0,
        isMaxSizeRestriction: 0,
        minSizeLimit: 0,
        maxSizeLimit: 0,
        //isConstructSizeCalculator: false, // for size caclulator in construction page
        //isRoomsDialog: false,


        showMasterDialog: false,
        showOrderDialog: false,
        showCreditDialog: false,


        //------- Templates
        //templateDepths: {},
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
        profileDepths: {
          frameDepth: {},
          frameStillDepth: {},
          sashDepth: {},
          impostDepth: {},
          shtulpDepth: {}
        },


        //------- Glasses
        glasses: [],
        glassTypes: [],

        //------ Hardwares
        hardwares: [],
        hardwareTypes: [],

        //------ Lamination
        laminationsWhite: $filter('translate')('mainpage.CONFIGMENU_NOT_LAMINATION'),

        orders: []

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

