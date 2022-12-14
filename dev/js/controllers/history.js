(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('HistoryModule')
    .controller('HistoryCtrl',

  function(
    $filter,
    $location,
    GlobalStor,
    UserStor,
    HistoryStor,
    HistoryServ,
    CartServ,
    MainServ,
    PrintServ,
    globalConstants
  ) {
    /*jshint validthis:true */
    var thisCtrl = this;
    thisCtrl.G = GlobalStor;
    thisCtrl.H = HistoryStor;
    thisCtrl.U = UserStor;
    thisCtrl.constants = globalConstants;

    //------- translate
    thisCtrl.FROM = $filter('translate')('history.FROM');
    thisCtrl.UNTIL = $filter('translate')('history.UNTIL');
    thisCtrl.DATE_RANGE = $filter('translate')('history.DATE_RANGE');
    thisCtrl.ALL_TIME = $filter('translate')('history.ALL_TIME');
    thisCtrl.SORTING = $filter('translate')('history.SORTING');
    thisCtrl.NEWEST_FIRST = $filter('translate')('history.NEWEST_FIRST');
    thisCtrl.NEWEST_LAST = $filter('translate')('history.NEWEST_LAST');
    thisCtrl.SORT_BY_TYPE = $filter('translate')('history.SORT_BY_TYPE');
    thisCtrl.SORT_SHOW = $filter('translate')('history.SORT_SHOW');
    thisCtrl.ALL = $filter('translate')('common_words.ALL');
    thisCtrl.SORT_SHOW_ACTIVE = $filter('translate')('history.SORT_SHOW_ACTIVE');
    thisCtrl.SORT_SHOW_WAIT = $filter('translate')('history.SORT_SHOW_WAIT');
    thisCtrl.SORT_SHOW_DONE = $filter('translate')('history.SORT_SHOW_DONE');
    thisCtrl.INCLUDED = $filter('translate')('history.INCLUDED');
    thisCtrl.DELIVERY = $filter('translate')('cart.DELIVERY');
    thisCtrl.AND = $filter('translate')('common_words.AND');
    thisCtrl.ASSEMBLING = $filter('translate')('cart.ASSEMBLING');
    thisCtrl.CLIENT = $filter('translate')('history.CLIENT');
    thisCtrl.PHONE = $filter('translate')('history.PHONE');
    thisCtrl.ADDRESS = $filter('translate')('history.ADDRESS');
    thisCtrl.PAYMENTS = $filter('translate')('history.PAYMENTS');
    thisCtrl.WAIT_MASTER = $filter('translate')('history.WAIT_MASTER');
    thisCtrl.ALLPRODUCTS = $filter('translate')('history.ALLPRODUCTS');
    thisCtrl.ON = $filter('translate')('history.ON');
    thisCtrl.CHANGE = $filter('translate')('common_words.CHANGE');
    thisCtrl.SEND_ORDER_TITLE = $filter('translate')('common_words.SEND_ORDER_TITLE');
    thisCtrl.BUTTON_C = $filter('translate')('common_words.BUTTON_C');
    thisCtrl.PRINT = $filter('translate')('common_words.PRINT');
    thisCtrl.BY_YOUR_REQUEST = $filter('translate')('history.BY_YOUR_REQUEST');
    thisCtrl.NOT_FIND = $filter('translate')('history.NOT_FIND');
    thisCtrl.DRAFT_VIEW = $filter('translate')('history.DRAFT_VIEW');
    thisCtrl.DRAFT = $filter('translate')('history.DRAFT');
    thisCtrl.DOWNLOAD_ORDERS = $filter('translate')('history.DOWNLOAD_ORDERS');
    thisCtrl.DURING_THE_WEEK = $filter('translate')('history.DURING_THE_WEEK')
    thisCtrl.PER_MOUNTH = $filter('translate')('history.PER_MOUNTH')
    thisCtrl.IN_A_YEAR = $filter('translate')('history.IN_A_YEAR')
    thisCtrl.HISTORY_VIEW = $filter('translate')('history.HISTORY_VIEW');
    thisCtrl.ORDER_DONE = $filter('translate')('history.ORDER_DONE')
    thisCtrl.ORDER_ERROR = $filter('translate')('history.ORDER_ERROR');
    thisCtrl.SYNCHRONIZE_ORDERS = $filter('translate')('history.SYNCHRONIZE_ORDERS');
    thisCtrl.DELETE = $filter('translate')('add_elements.DELETE');
    thisCtrl.time = [
      {
        name:$filter('translate')('history.DURING_THE_WEEK'),
        namb: 1
      },
      {
        name:$filter('translate')('history.PER_MOUNTH'),
        namb: 2
      },
      {
        name:$filter('translate')('history.IN_A_YEAR'),
        namb: 3
      }
    ];
    
    $('.period-of-time').on('change', ()=>{
      if ($location.path() === "/mobile") {
        HistoryServ.reqResult();
      }
    });
    //------- set current Page
    if ($location.path() !== "/mobile") {
      //------- set current Page
      GlobalStor.global.currOpenPage = 'history';
    }
    
    thisCtrl.OrderActions = -1;
    
    function showOrderActions(index) {
      if (thisCtrl.OrderActions === index) {
        thisCtrl.OrderActions = -1;
      } else {
        thisCtrl.OrderActions = index;
      }
    }

    //----- variables for drafts sorting
    thisCtrl.createdDate = 'created';

    HistoryServ.downloadOrders();
    //------ clicking
    thisCtrl.showOrderActions = showOrderActions;


    thisCtrl.reqResult = HistoryServ.reqResult;
    thisCtrl.toCurrentCalculation = HistoryServ.toCurrentCalculation;
    thisCtrl.sendOrderToFactory = HistoryServ.sendOrderToFactory;
    thisCtrl.makeOrderCopy = HistoryServ.makeOrderCopy;
    thisCtrl.clickDeleteOrder = HistoryServ.clickDeleteOrder;
    thisCtrl.editOrder = HistoryServ.editOrder;
    thisCtrl.orderPrint = HistoryServ.orderPrint;
    thisCtrl.viewSwitching = HistoryServ.viewSwitching;
    thisCtrl.orderSearching = HistoryServ.orderSearching;
    thisCtrl.orderDateSelecting = HistoryServ.orderDateSelecting;
    thisCtrl.openCalendarScroll = HistoryServ.openCalendarScroll;
    thisCtrl.orderSorting = HistoryServ.orderSorting;
    thisCtrl.sortingInit = HistoryServ.sortingInit;
    thisCtrl.testFunc = HistoryServ.testFunc;
    thisCtrl.synchronizeOrders = HistoryServ.synchronizeOrders;
    thisCtrl.closeDeviceReport = HistoryServ.closeDeviceReport;

    if ($location.path() !== "/mobile") {
      $("#main-frame").removeClass("main-frame-mobView");
      $("#app-container").removeClass("app-container-mobView");
      $(window).load(function () {
        MainServ.resize();
      });
      window.onresize = function () {
        MainServ.resize();
      };
    }
  
  });
})();
