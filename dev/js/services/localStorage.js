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

    productSource: {
      orderId: 0,
      productId: 0,
      isAddElementsONLY: false,
      selectedRoomId: 4,

      templateIndex: 0,
      templateSource: {},
      templateDefault: {},
      templateIcon: {},
      templateWidth: 0,
      templateHeight: 0,
      beadId: 0,

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

      doorShapeId: 0,
      doorSashShapeId: 0,
      doorHandleShapeId: 0,
      doorLockShapeId: 0,

      heatTransferTOTAL: 0,
      airCirculationTOTAL: 0,

      templatePriceSELECT: 0,
      hardwarePriceSELECT: 0,
      laminationPriceSELECT: 0,
      addElementsPriceSELECT: 0,
      productPriceTOTAL: 0,
      comment: '',
      productQty: 1
    },

    orderSource: {
      orderId: 0,
      orderType: '',
      orderStyle: '',
      productsQty: 0,
      products: [],
      productsPriceTOTAL: 0,
      deliveryDate: '',
      newDeliveryDate: '',
      deliveryPrice: 0,
      isDatePriceLess: false,
      isDatePriceMore: false,
      selectedFloor: 'free',
      selectedFloorPrice: 0,
      selectedAssembling: 'free',
      selectedAssemblingPrice: 0,
      isInstalment: 'false',
      selectedInstalmentPeriod: 0,
      selectedInstalmentPercent: 0,
      isOldPrice: false,
      paymentFirst: 0,
      paymentMonthly: 0,
      paymentFirstPrimary: 0,
      paymentMonthlyPrimary: 0,
      orderPriceTOTAL: 0,
      orderPriceTOTALPrimary: 0,

      name: '',
      location: '',
      address: '',
      mail: '',
      phone: '',
      phone2: '',
      itn: 0,
      starttime: '',
      endtime: '',
      target: ''

    },

    productDefault: {},
    product: {},
    order: {},
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
    isShowCommentBlock: false,
    showMasterDialog: false,
    showOrderDialog: false,
    showCreditDialog: false,
    fullOrderType: 'complete',
    draftOrderType: 'draft',

//------ WebSQL DB table names
    //--- Local
    productsTableBD: 'products',
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
});
