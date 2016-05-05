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
        getPCPower: 0,
        isDevice: 0,
        isLoader: 0,
        startProgramm: 1, // for START
        //------ navigation
        isNavMenu: 1,
        isConfigMenu: 0,
        activePanel: 0,
        configMenuTips: 0,
        //isTemplateItemMenu: 0,
        //isTemplateItemDesign: 1,

        isCreatedNewProject: 1,
        copyGlabalStorGlassesAll: [],
        
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
        isRoomElements: 0,

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
        selectGlassId: 0,
        selectGlassName: '',
        prevGlassId: 0,
        prevGlassName: '',

        //------ Hardwares
        hardwares: [],
        hardwareTypes: [],
        hardwareLimits: [],

        //------ Lamination
        laminats: [],
        laminatCouples: [],
        lamGroupFiltered: [],

        //------ Add Elements
        typeMenu: 55,
        addElementsAll: [],
        tempAddElements: [],

        //-------- Door
        noDoorExist: 0,
        doorKitsT1: [],
        doorKitsT2: [],
        doorHandlers: [],
        doorLocks: [],

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
        isBox: 0,
        isAlertHistory: 0,
        isEditBox: 0,
        confirmAction: 0,
        confirmInActivity: 0,

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
