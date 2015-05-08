(function(){
  'use strict';
    /**
     * @ngInject
     */
  angular
    .module('BauVoiceApp')
    .factory('HistoryStor', historyStorageFactory);

  function historyStorageFactory() {

    var thisFactory = this;

    thisFactory.publicObj = {
      historySource: {
        //===== Order
        orders: [],
        ordersSource: [],
        isEmptyResult: false,
        //--- Tools
        isOrderSearch: false,
        searchingWord: '',

        isOrderDate: false,
        startDate: '',
        finishDate: '',
        isStartDate: false,
        isFinishDate: false,
        isAllPeriod: true,

        isOrderSort: false,
        isSortType: 'last',
        isCurrentOrdersHide: false,
        isWaitOrdersHide: false,
        isDoneOrdersHide: false,


        //===== Draft
        isDraftView: false,
        drafts: [],
        draftsSource: [],
        isEmptyResultDraft: false,
        //--- Tools
        isOrderDateDraft: false,
        startDateDraft: '',
        finishDateDraft: '',
        isStartDateDraft: false,
        isFinishDateDraft: false,
        isAllPeriodDraft: true,

        isOrderSortDraft: false,
        isSortTypeDraft: 'last',
        reverseDraft: true
      },
      setDefaultHistory: setDefaultHistory
    };

    thisFactory.publicObj.history = setDefaultHistory();

    return thisFactory.publicObj;


    //============ methods ================//

    function setDefaultHistory() {
      var publicObj = angular.copy(thisFactory.publicObj.historySource);
      return publicObj;
    }

  }
})();
