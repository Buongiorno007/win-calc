
// services/localStorage.js

"use strict";

BauVoiceApp.factory('localStorage', function () {
  return {
    doFirstTime: true,
    svgTemplateThumbWidth: 70,
    svgTemplateThumbHeight: 70,
    svgTemplateIconWidth: 500,
    svgTemplateIconHeight: 450,
    svgTemplateWidth: 1500,
    svgTemplateHeight: 1000,
    currentDate: new Date(),
    //-------- defined default profile index
    templateIndex: 0,
    profileIndex: 0,
    isConstructWind: true,
    isConstructWindDoor: false,
    isConstructBalcony: false,
    isConstructDoor: false,
    isFindPriceProcess: false,
    isAddElementsONLY: false,

    templatesWindList: [],
    templatesWindThumbList: [],
    templatesWindDoorList: [],
    templatesWindDoorThumbList: [],
    templatesBalconyList: [],
    templatesBalconyThumbList: [],
    templatesDoorList: [],
    templatesDoorThumbList: [],

    userInfo: {},
    product: {},
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
    heatTransferTotal: 0,
    airCirculationTotal: 0,

    isCreatedNewProject: true,
    productEditNumber: false,

    showNavMenu: true,
    isConfigMenu: false,
    showPanels: {},
    isTemplatePanel: false,
    isProfilePanel: false,
    isGlassPanel: false,
    isHardwarePanel: false,
    isLaminationPanel: false,
    isAddElementsPanel: false,

    constructionPriceTOTAL: 0,
    hardwarePriceTOTAL: 0,
    laminationPriceTOTAL: 0,
    addElementsPriceTOTAL: 0,
    orderPrice: 0,

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


    showMasterDialog: false,
    showOrderDialog: false,
    showCreditDialog: false,
    fullOrderType: 'complete',
    draftOrderType: 'draft',

    showRoomSelectorDialog: false,
    isRoomsDialog: false,
    isOpenSettingsPage: false,
    isReturnFromConstructionPage: false,
    isVoiceHelper: false,
//------ WebSQL DB table names
    //--- Local
    productsTableBD: 'products',
    componentsTableBD: 'construction_parts',
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

