"use strict";

BauVoiceApp.factory('localStorage', function () {
  return {
    svgTemplateThumbWidth: 120,
    svgTemplateThumbHeight: 120,
    svgTemplateWidth: 1500,
    svgTemplateHeight: 1000,
    currentDate: new Date(),

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

    isCreatedNewProject: true,
    productEditNumber: 0,

    showNavMenu: true,
    isConfigMenu: false,
    showPanels: {},
    isTemplatePanel: false,
    isProfilePanel: false,
    isGlassPanel: false,
    isHardwarePanel: false,
    isLaminationPanel: false,
    isAddElementsPanel: false,
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
    totalAddElementsPrice: 0,
    //currency: '',

    orderPrice: 0,
    showMasterDialog: false,
    showOrderDialog: false,
    showCreditDialog: false,
    fullOrderType: 'complete',
    draftOrderType: 'draft',

    doorConstructionPage: false,
    showRoomSelectorDialog: false,
    isRoomsDialog: false,
    currentRoomId: 4,
//------ DB table names
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
    ordersTableBD: 'orders'

  }
});
