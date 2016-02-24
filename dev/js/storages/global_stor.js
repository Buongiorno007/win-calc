(function(){
  'use strict';
    /**@ngInject*/
  angular
    .module('BauVoiceApp')
    .factory('GlobalStor',


  function() {
    /*jshint validthis:true */
    var thisFactory = this;


    function setDefaultGlobal() {
      return angular.copy(thisFactory.publicObj.globalSource);
    }

    thisFactory.publicObj = {

      globalSource: {
        isDevice: 0,
        isLoader: 0,
        startProgramm: 1, // for START
        //------ navigation
        isNavMenu: 1,
        isConfigMenu: 0,
        activePanel: 0,
        configMenuTips: 0,

        isCreatedNewProject: 1,
        isCreatedNewProduct: 1,
        productEditNumber: 0,
        orderEditNumber: 0,

        prevOpenPage: '',
        currOpenPage: 'main',

        isChangedTemplate: 0,
        isVoiceHelper: 0,
        voiceHelperLanguage: '',
        showGlassSelectorDialog: 0,
        isShowCommentBlock: 0,
        isTemplateTypeMenu: 0,

        //------ Rooms background
        showRoomSelectorDialog: 0,
        rooms: [],

        //------- Templates
        templateLabel: '',
        templatesSource: [],
        templatesSourceSTORE: [],
        //TODO templateIcons: [],
        isSashesInTemplate: 0,

        //------ Profiles
        profiles: [],
        profilesType: [],

        //------- Glasses
        glassesAll: [],
        glassTypes: [],
        glasses: [],
        selectLastGlassId: 0,

        //------ Hardwares
        hardwares: [],
        hardwareTypes: [],

        //------ Lamination
        laminats: [],
        laminatCouples: [],
        lamGroupFiltered: [],

        //------ Add Elements
        addElementsAll: [],
        tempAddElements: [],

        //------ Cart
        supplyData: [],
        assemblingData: [],
        instalmentsData: [],

        //------ Info
        isInfoBox: 0,
        infoTitle: '',
        infoImg: '',
        infoLink: '',
        infoDescrip: '',

        //---- report
        isReport: 0,

        currencies: [],
        locations: {
          countries: [],
          regions: [],
          cities: []
        },
        margins: {},
        deliveryCoeff: {},

        //----- Alert
        isAlert: 0,
        alertTitle: '',
        alertDescr: '',
        confirmAction: 0,

        //---- Calculators
        isQtyCalculator: 0,
        isSizeCalculator: 0,
        isWidthCalculator: 0,
        maxSizeLimit: 3200,
        maxSquareLimit: 6
      },

      setDefaultGlobal: setDefaultGlobal
    };

    thisFactory.publicObj.global = setDefaultGlobal();

    return thisFactory.publicObj;

  });
})();
