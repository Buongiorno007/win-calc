
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
        constructionType: 1, // 1 - window; 2 - windowDoor; 3 - balcony; 4 - door

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

        //---- addElements Panel
        isQtyCalculator: false,
        isSizeCalculator: false,
        isWidthCalculator: false,
        isColorSelector: false,
//        isConstructSizeCalculator: false,



        showMasterDialog: false,
        showOrderDialog: false,
        showCreditDialog: false,




        //isRoomsDialog: false,


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

