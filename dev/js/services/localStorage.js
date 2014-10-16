"use strict";

BauVoiceApp.factory('localStorage', function () {
  return {
    constructThumb: '',
    constructionSize: {
      width: '',
      height: ''
    },
    profileName: '',
    glassName: '',
    hardwareName: '',
    lamination: {
      outer: '',
      inner: ''
    },
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
    productPrice: 0,

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
    currency: '₴',
    //cartPrice: '0',
    orderPrice: 0,
    showMasterDialog: false,
    showOrderDialog: false,
    showCreditDialog: false,
    doorConstructionPage: false,
    showRoomSelectorDialog: false,
    isRoomsDialog: false,
    currentRoomId: 4,

    orderTableBD: 'order',
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
    othersTableBD: 'other_elements'

  }
});
