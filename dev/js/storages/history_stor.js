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

    thisFactory.publicObj = {
      historySource: {
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
        timeBox: [
        {
            name:'за неделю',
            namb: 1
        },
        {
            name:'за месяц',
            namb: 2
        },
        {
            name:'за  год',
            namb: 3
        }
        ],
        resTimeBox: {
            name:'за неделю',
            namb: 1
        },
        listName: [],
        listNameGlass: [],
        listNameHardware: [],
        listNameProfiles: [],
        firstClick: []

      },
      setDefaultHistory: setDefaultHistory
    };

    thisFactory.publicObj.history = setDefaultHistory();

    return thisFactory.publicObj;

  });
})();
