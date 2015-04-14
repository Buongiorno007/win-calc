(function(){
  'use strict';

  angular
    .module('BauVoiceApp')
    .factory('GlobalStorage', globalStorageFactory);

  globalStorageFactory.$inject = [];

  function globalStorageFactory() {

    return {
      svgTemplateIconWidth: 70,
      svgTemplateIconHeight: 70,
      svgTemplateIconBigWidth: 500,
      svgTemplateIconBigHeight: 450,
      svgTemplateWidth: 800,
      svgTemplateHeight: 700,
      currentDate: new Date(),
      productionDays: 15,
      currency: '',

      isConstructWind: true,
      isConstructWindDoor: false,
      isConstructBalcony: false,
      isConstructDoor: false,
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
      templatesWindSTORE: [],
      templatesWindDoorSTORE: [],
      templatesBalconySTORE: [],
      templatesDoorSTORE: [],
      templatesWindListSTORE: [],
      templatesWindIconListSTORE: [],
      templatesWindDoorListSTORE: [],
      templatesWindDoorIconListSTORE: [],
      templatesBalconyListSTORE: [],
      templatesBalconyIconListSTORE: [],
      templatesDoorListSTORE: [],
      templatesDoorIconListSTORE: [],

      templatesWindSource: [],
      templatesWindDoorSource: [],
      templatesBalconySource: [],
      templatesDoorSource: [],
      templatesWindList: [],
      templatesWindDoorList: [],
      templatesBalconyList: [],
      templatesDoorList: [],
      templatesWindIconList: [],
      templatesWindDoorIconList: [],
      templatesBalconyIconList: [],
      templatesDoorIconList: [],
      templateDepths: {},

      templatesSource: [],
      templates: [],
      templatesIcons: [],
      templateLabel: '',

      //------ Profiles
      profiles: [],
      profilesType: [],
      allProfileFrameSizes: [],
      allProfileFrameStillSizes: [],
      allProfileSashSizes: [],
      allProfileImpostSizes: [],
      allProfileShtulpSizes: [],

      //------- Glasses
      glasses: [],
      glassTypes: [],

      //------ Hardwares
      hardwares: [],
      hardwareTypes: [],

      //------ Lamination
      laminationsWhite: '',
      laminationsIn: [],
      laminationsOut: [],

      userInfo: {
        city_id: 0,
        cityName: '',
        regionName: '',
        countryName: '',
        fullLocation: '',
        climaticZone: 0,
        heatTransfer: 0,
        langLabel: '',
        langName: ''
      },



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

      //constructionPriceTOTAL: 0,
      //hardwarePriceTOTAL: 0,
      //laminationPriceTOTAL: 0,
      //addElementsPriceTOTAL: 0,
      //orderPrice: 0,

      addElementsGroupClass: [
        'aux_color_connect',
        'aux_color_big',
        'aux_color_middle',
        'aux_color_slope',
        'aux_color_middle',
        'aux_color_slope',
        'aux_color_connect',
        'aux_color_small',
        'aux_color_big',
        'aux_color_middle',
        'aux_color_small'
      ],
      isAddElement: false,
      isAddElementListView: false,
      isConstructSizeCalculator: false,
      isTabFrame: false,

      showRoomSelectorDialog: false,
      isRoomsDialog: false,
      isOpenSettingsPage: false,
      isChangedTemplate: false,
      isVoiceHelper: false,
      voiceHelperLanguage: 'ru_ru',
      isShowCommentBlock: false,


    //------ WebSQL DB table names

      //---- Global
      usersTableDBGlobal: 'users',
      citiesTableDBGlobal: 'cities',
      regionsTableDBGlobal: 'regions',
      countriesTableDBGlobal: 'countries',
      listsTableDBGlobal: 'lists',
      elementsTableDBGlobal: 'elements',
      beadsTableDBGlobal: 'beed_profile_systems',

      visorDBId: 21,
      gridDBId: 20,
      spillwayDBId: 9,
      windowsillDBId: 8,

      //------------ Languages
      languages: [
        {label: 'ua', name: 'Українська'},
        {label: 'ru', name: 'Русский'},
        {label: 'en', name: 'English'},
        {label: 'de', name: 'Deutsch'},
        {label: 'ro', name: 'Român'}
      ]


    }


  }
})();
