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
        isEmptyResult: false,
        //--- Tools
        isOrderSearch: false,
        isOrderDate: false,
        isOrderSort: false,

        searchingWord: '',

        //===== Draft
        isDraftView: false,
        drafts: [],
        isEmptyResultDraft: false,
        //--- Tools
        isOrderDateDraft: false,
        isOrderSortDraft: false,





        isStartDate: false,
        isSortType: 'last',
        isFinishDate: false,
        isAllPeriod: true,
        startDate: '',
        finishDate: '',
        isCurrentOrdersHide: false,
        isWaitOrdersHide: false,
        isDoneOrdersHide: false,



        isStartDateDraft: false,
        isFinishDateDraft: false,
        isAllPeriodDraft: true,
        startDateDraft: '',
        finishDateDraft: '',

        isOrderExisted: false
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
