"use strict";

BauVoiceApp.factory('localStorage', function () {
  return {
    svgTemplateIconWidth: 70,
    svgTemplateIconHeight: 70,
    svgTemplateIconBigWidth: 500,
    svgTemplateIconBigHeight: 450,
    svgTemplateWidth: 1500,
    svgTemplateHeight: 1000,
    currentDate: new Date(),
    productionDays: 15,

    isConstructWind: true,
    isConstructWindDoor: false,
    isConstructBalcony: false,
    isConstructDoor: false,
    //---- чтобы не создавался черновик при запуске проги
    startProgramm: true,
    isCreatedNewProject: true,
    isOpenedCartPage: false,
    isFindPriceProcess: false,

    productEditNumber: false,
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
      city_id: 0
    },

    productSource: {
      isAddElementsONLY: false,
      selectedRoomId: 4,

      templateIndex: 0,
      templateSource: {},
      templateDefault: {},
      templateIcon: {},
      templateWidth: 0,
      templateHeight: 0,

      profileTypeIndex: 0,
      profileIndex: 0,
      profileId: 0,
      profileName: '',
      profileHeatCoeff: 0,
      profileAirCoeff: 0,

      glassTypeIndex: 0,
      glassIndex: 0,
      glassId: 0,
      glassName: '',
      glassHeatCoeff: 0,
      glassAirCoeff: 0,

      hardwareTypeIndex: 0,
      hardwareIndex: 0,
      hardwareId: 0,
      hardwareName: '',
      hardwareHeatCoeff: 0,
      hardwareAirCoeff: 0,

      laminationOutIndex: 'white',
      laminationOutName: '',
      laminationOutPrice: 0,
      laminationInIndex: 'white',
      laminationInName: '',
      laminationInPrice: 0,

      chosenAddElements: {
        selectedGrids: [],
        selectedVisors: [],
        selectedSpillways: [],
        selectedOutsideSlope: [],
        selectedLouvers: [],
        selectedInsideSlope: [],
        selectedConnectors: [],
        selectedFans: [],
        selectedWindowSill: [],
        selectedHandles: [],
        selectedOthers: []
      },

      heatTransferTOTAL: 0,
      airCirculationTOTAL: 0,

      templatePriceSELECT: 0,
      hardwarePriceSELECT: 0,
      laminationPriceSELECT: 0,
      addElementsPriceSELECT: 0,
      productPriceTOTAL: 0
    },

    product: {},

    order: {
      orderId: 0,
      deliveryDate: '',
      products: [],
      orderPrice: 0
    },
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
      glassSizes: [],
      glassSquares: [],
      frameSillSize: 0
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
    //currency: '',

    showRoomSelectorDialog: false,
    isRoomsDialog: false,
    isOpenSettingsPage: false,
    isChangedTemplate: false,
    isVoiceHelper: false,
    showMasterDialog: false,
    showOrderDialog: false,
    showCreditDialog: false,
    fullOrderType: 'complete',
    draftOrderType: 'draft',

//------ WebSQL DB table names
    //--- Local
    productsTableBD: 'products',
    //componentsTableBD: 'construction_parts',
    gridsTableBD: 'grids',
    visorsTableBD: 'visors',
    spillwaysTableBD: 'spillways',
    outSlopesTableBD: 'outside_slopes',
    louversTableBD: 'louvers',
    inSlopesTableBD: 'inside_slopes',
    connectorsTableBD: 'connectors',
    fansTableBD: 'fans',
    windowSillsTableBD: 'windowsills',
    handlesTableBD: 'handles',
    othersTableBD: 'other_elements',
    ordersTableBD: 'orders',
    //---- Global
    usersTableDBGlobal: 'users',
    citiesTableDBGlobal: 'cities',
    regionsTableDBGlobal: 'regions',
    countriesTableDBGlobal: 'countries',
    listsTableDBGlobal: 'lists',

    visorDBId: 21,
    gridDBId: 20,
    spillwayDBId: 9,
    windowsillDBId: 8
  }
});
