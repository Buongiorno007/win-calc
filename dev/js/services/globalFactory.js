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
