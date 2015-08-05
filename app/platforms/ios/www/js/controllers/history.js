
// controllers/history.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('HistoryModule')
    .controller('HistoryCtrl', historyCtrl);

  function historyCtrl(GlobalStor, UserStor, HistoryStor, HistoryServ, GeneralServ, $location) {


    var thisCtrl = this;
    thisCtrl.G = GlobalStor;
    thisCtrl.H = HistoryStor;
    thisCtrl.U = UserStor;

    thisCtrl. toCurrentCalculation = toCurrentCalculation;


    //------- set current Page
    GlobalStor.global.currOpenPage = 'history';

    //----- variables for drafts sorting
    thisCtrl.createdDate = 'created';

    HistoryServ.downloadOrders();


    //------ clicking
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

    //============ methods ================//

    //------ go to current calculations
    function toCurrentCalculation () {
      GeneralServ.setPreviosPage();
      $location.path('/main');
    }


  }
})();
