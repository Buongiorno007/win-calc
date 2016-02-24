(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('HistoryModule')
    .controller('HistoryCtrl',

  function(
    GlobalStor,
    UserStor,
    HistoryStor,
    HistoryServ
  ) {
    /*jshint validthis:true */
    var thisCtrl = this;
    thisCtrl.G = GlobalStor;
    thisCtrl.H = HistoryStor;
    thisCtrl.U = UserStor;


    //------- set current Page
    GlobalStor.global.currOpenPage = 'history';

    //----- variables for drafts sorting
    thisCtrl.createdDate = 'created';

    HistoryServ.downloadOrders();


    //------ clicking
    thisCtrl.toCurrentCalculation = HistoryServ.toCurrentCalculation;
    thisCtrl.sendOrderToFactory = HistoryServ.sendOrderToFactory;
    thisCtrl.makeOrderCopy = HistoryServ.makeOrderCopy;
    thisCtrl.clickDeleteOrder = HistoryServ.clickDeleteOrder;
    thisCtrl.editOrder = HistoryServ.editOrder;
    thisCtrl.viewSwitching = HistoryServ.viewSwitching;

    thisCtrl.orderSearching = HistoryServ.orderSearching;
    thisCtrl.orderDateSelecting = HistoryServ.orderDateSelecting;
    thisCtrl.openCalendarScroll = HistoryServ.openCalendarScroll;
    thisCtrl.orderSorting = HistoryServ.orderSorting;
    thisCtrl.sortingInit = HistoryServ.sortingInit;


  });
})();