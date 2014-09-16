"use strict";

BauVoiceApp.factory('globalData', function () {
  return {
    showNavMenu: true,
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
