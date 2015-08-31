
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
        isLoader: 0,
        startProgramm: 1, // for START
        //------ navigation
        isNavMenu: 1,
        isConfigMenu: 0,
        activePanel: 0,

        isCreatedNewProject: 1,
        isCreatedNewProduct: 1,
        productEditNumber: 0,
        orderEditNumber: 0,

        prevOpenPage: '',
        currOpenPage: 'main',

        isChangedTemplate: 0,
        isVoiceHelper: 0,
        voiceHelperLanguage: '',
        showRoomSelectorDialog: 0,
        isShowCommentBlock: 0,

        //---- Calculators
        isQtyCalculator: 0,
        isSizeCalculator: 0,
        isWidthCalculator: 0,
        isColorSelector: 0,

        //------- Templates
        templateLabel: '',
        templatesSource: [],
//        templates: [],
//        templatesIcon: [],
        templatesSourceSTORE: [],
//        templatesSTORE: [],
//        templatesIconSTORE: [],

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
        glassesAll: [],
        glassTypes: [],
        glasses: [],

        //------ Hardwares
        hardwares: [],
        hardwareTypes: [],

        //------ Lamination
        laminationsWhite: $filter('translate')('mainpage.CONFIGMENU_NOT_LAMINATION'),
        laminationsIn: [],
        laminationsOut: [],

        //------ Add Elements
        isAddElemExist: []
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

