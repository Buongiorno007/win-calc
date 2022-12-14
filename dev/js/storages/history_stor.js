(function(){
  'use strict';
    /**@ngInject */
  angular
    .module('HistoryModule')
    .factory('HistoryStor',

  function() {
    /*jshint validthis:true */
    var thisFactory = this;

    function setDefaultHistory() {
      return angular.copy(thisFactory.publicObj.historySource);
    }
    function restoreHistory(data) {
      return angular.copy(JSON.parse(LZString.decompress(data)));
    }

    thisFactory.publicObj = {
      historySource: {
        historyID : -1,
        //===== Order
        orders: [],
        ordersSource: [],
        isEmptyResult: 0,
        errorСhecking: 0,
        //--- Tools
        isOrderSearch: 0,
        searchingWord: '',

        isOrderDate: 0,
        startDate: '',
        finishDate: '',
        isStartDate: 0,
        isFinishDate: 0,
        isAllPeriod: 1,
        isBox: 0,
        isArr: 0,
        addElem: [],

//        maxDeliveryDateOrder: 0,

        isOrderSort: 0,
        isSortType: 'last',
        isFilterType: undefined,

        //===== Draft
        isDraftView: 0,
        orderEditNumber: 0,
        drafts: [],
        draftsSource: [],
        isEmptyResultDraft: 0,
        //--- Tools
        isOrderDateDraft: 0,
        startDateDraft: '',
        finishDateDraft: '',
        isStartDateDraft: 0,
        isFinishDateDraft: 0,
        isAllPeriodDraft: 1,

        isOrderSortDraft: 0,
        isSortTypeDraft: 'last',
        reverseDraft: 1,

        dataProfiles: [],
        resTimeBox: {
            name:'history.DURING_THE_WEEK',
            namb: 1
        },
        listName: [],
        listNameGlass: [],
        listNameHardware: [],
        listNameProfiles: [],
        firstClick: [],
        PrintProduct :[],
        PrintAddEl :[],
        OrderPrintLength:0,
        OrderPrintSquare : 0,
        OrderPrintPerimeter : 0

      },
      setDefaultHistory: setDefaultHistory,
      restoreHistory: restoreHistory
    };
    // var data = localStorage.getItem("HistoryStor");
    // if (data){
    //   thisFactory.publicObj.history = restoreHistory(data);
    //   // console.log("HistoryStor restored");
    // } else {
    //   //console.log("HistoryStor created");
    // }
      thisFactory.publicObj.history = setDefaultHistory();


    return thisFactory.publicObj;

  });
})();
