"use strict";

BauVoiceApp.factory('globalData', function () {
  return {
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
    isAddElement: false,
    isAddElementListView: false,
    totalAddElementsPrice: 0,
    currency: '₴',
    cartPrice: '0',
    showMasterDialog: false,
    showOrderDialog: false,
    showCreditDialog: false,
    doorConstructionPage: false,
    showRoomSelectorDialog: false,
    isRoomsDialog: false,
    currentRoomId: 4
  }
});