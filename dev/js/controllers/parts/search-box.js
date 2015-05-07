(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .controller('searchCtrl', searchCtrl);

  function searchCtrl($filter, GlobalStor, AuxStor, HistoryStor, AddElementsServ, AddElementMenuServ) {

    var thisCtrl = this;
    thisCtrl.global = GlobalStor.global;


    //------ clicking
    //----------- for AddElements List View
    if(GlobalStor.global.currOpenPage === 'main') {
      thisCtrl.placeholder = $filter('translate')('add_elements.INPUT_ADD_ELEMENT');
      thisCtrl.checkChanges = checkChanges;
      thisCtrl.cancelSearching = cancelSearching;
      thisCtrl.deleteSearchChart = deleteSearchChart;
    } else if(GlobalStor.global.currOpenPage === 'history'){
      //----------- for History Page
      thisCtrl.placeholder = $filter('translate')('history.SEARCH_PLACEHOLDER');
      thisCtrl.checkChanges = checkChangesHistory;
      thisCtrl.cancelSearching = cancelSearchingHistory;
      thisCtrl.deleteSearchChart = deleteSearchChartHistory;
    }


    //============ methods ================//

    //----------- Searching Block in AddElements List View

    function checkChanges() {
      if(thisCtrl.searchingWord !== '') {
        if(thisCtrl.searchingWord.length === 1) {
          AuxStor.aux.addElementGroups = AddElementsServ.createAddElementGroups();
        }
        AuxStor.aux.showAddElementGroups = true;
        AuxStor.aux.searchingWord = thisCtrl.searchingWord;
      }
    }

    //------- Delete searching word
    function cancelSearching() {
      thisCtrl.searchingWord = '';
      AuxStor.aux.addElementGroups.length = 0;
      AuxStor.aux.showAddElementGroups = false;
      AuxStor.aux.searchingWord = thisCtrl.searchingWord;
      AddElementMenuServ.closeAddElementsMenu();
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


    //========== History Page ===========//

    function checkChangesHistory() {
      if(thisCtrl.searchingWord !== '') {
        HistoryStor.history.searchingWord = thisCtrl.searchingWord;
      }
    }
    //-------- Delete searching word
    function cancelSearchingHistory() {
      thisCtrl.searchingWord = '';
      HistoryStor.history.isOrderSearch = false;
    }

    //-------- Delete last chart searching word
    function deleteSearchChartHistory() {
      thisCtrl.searchingWord = thisCtrl.searchingWord.slice(0,-1);
    }


  }
})();