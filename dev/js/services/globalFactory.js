"use strict";

BauVoiceApp.factory('globalData', function () {
  return {
    showNavMenu: true,
    showConfigMenu: false,
    showPanels: {},
    currency: '₴',
    cartPrice: '0',
    showMasterDialog: false,
    showOrderDialog: false,
    showCreditDialog: false,
    doorConstructionPage: false,
    showRoomSelectorDialog: false,
    currentRoomId: 4
  }
});
