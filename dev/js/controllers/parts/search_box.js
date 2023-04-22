(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('searchCtrl',

  function(
    $filter,
    GlobalStor,
    AuxStor,
    HistoryStor,
    AddElementsServ,
    AddElementMenuServ
  ) {
    /*jshint validthis:true */
    var thisCtrl = this;
    thisCtrl.G = GlobalStor;

    //------- translate
    thisCtrl.CANCEL = $filter('translate')('add_elements.CANCEL');

    /**============ METHODS ================*/

    /**--------- AddElements List View ----------*/

    //------- Delete searching word
    function cancelSearching() {
      thisCtrl.searchingWord = '';
      AuxStor.aux.addElementGroups.length = 0;
      AuxStor.aux.searchingWord = thisCtrl.searchingWord;
      AddElementMenuServ.closeAddElementsMenu();
    }

    //----------- Searching Block in AddElements List View
    function checkChanges() {
      if(thisCtrl.searchingWord !== '') {
        AuxStor.aux.searchingWord = thisCtrl.searchingWord;
        if(AuxStor.aux.searchingWord.length > 3) {
          AddElementsServ.createAddElementGroups();
        }
      } else {
        cancelSearching();
      }
    }

    //-------- Delete last chart searching word
    function deleteSearchChart() {
      thisCtrl.searchingWord = thisCtrl.searchingWord.slice(0,-1);
      if(thisCtrl.searchingWord === '') {
        cancelSearching();
      } else {
        AuxStor.aux.searchingWord = thisCtrl.searchingWord;
      }
    }


    /**----------- History Page -------------*/

    function checkChangesHistory() {
      if(thisCtrl.searchingWord !== '') {
        HistoryStor.history.searchingWord = thisCtrl.searchingWord;
      }
    }
    //-------- Delete searching word
    function cancelSearchingHistory() {
      thisCtrl.searchingWord = '';
      HistoryStor.history.searchingWord = '';
      HistoryStor.history.isOrderSearch = 0;
    }

    //-------- Delete last chart searching word
    function deleteSearchChartHistory() {
      thisCtrl.searchingWord = thisCtrl.searchingWord.slice(0,-1);
      HistoryStor.history.searchingWord = thisCtrl.searchingWord;
    }


    /**========== FINISH ==========*/

    //------ clicking
    //----------- for AddElements List View
    if(GlobalStor.global.currOpenPage === 'main' || GlobalStor.global.currOpenPage === 'cart' || GlobalStor.global.currOpenPage === 'light') {
      thisCtrl.placeholder = $filter('translate')('add_elements.INPUT_ADD_ELEMENT');
      thisCtrl.checkChanges = checkChanges;
      thisCtrl.cancelSearching = cancelSearching;
      thisCtrl.deleteSearchChart = deleteSearchChart;
    } else if(GlobalStor.global.currOpenPage === 'history' || GlobalStor.global.currOpenPage === 'mobile'){
      //----------- for History Page
      thisCtrl.placeholder = $filter('translate')('history.SEARCH_PLACEHOLDER');
      thisCtrl.checkChanges = checkChangesHistory;
      thisCtrl.cancelSearching = cancelSearchingHistory;
      thisCtrl.deleteSearchChart = deleteSearchChartHistory;
    }


  });
})();