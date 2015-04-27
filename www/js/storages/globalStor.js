
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
        startProgramm: true, // for START
        constructionType: 1, // 1 - window; 2 - windowDoor; 3 - balcony; 4 - door

        //------ navigation
        isNavMenu: true,
        isConfigMenu: false,
        activePanel: 0,

        isCreatedNewProject: true,
        isCreatedNewProduct: true,
        isOrderFinished: false,
        isOpenedCartPage: false,
        isOpenedHistoryPage: false,
        isReturnFromDiffPage: false,

        productEditNumber: 0,
        orderEditNumber: 0,



        //------- Templates
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



        orders: [],

//        objXFormedPriceSource: {
//          cityId: '',
//          profileId: '',
//          glassId: '',
//          framesSize: [],
//          sashsSize: [],
//          beadsSize: [],
//          impostsSize: [],
//          shtulpsSize: [],
//          sashesBlock: [],
//          glassSizes: [],
//          glassSquares: [],
//          frameSillSize: 0
//        },

        objXAddElementPriceSource: {
          cityId: 0,
          elementId: 0,
          elementLength: 0
        },



        isAddElement: false,
        isAddElementListView: false,
        isConstructSizeCalculator: false,
        isTabFrame: false,

        showRoomSelectorDialog: false,
        isRoomsDialog: false,
        isOpenSettingsPage: false,
        isChangedTemplate: false,
        isVoiceHelper: false,
        voiceHelperLanguage: '',
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

