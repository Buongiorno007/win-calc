(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .controller('AddElemGroupMenuCtrl', addElemGroupCtrl);

  function addElemGroupCtrl($filter, globalConstants, GlobalStor, AuxStor, HistoryStor, AddElementsServ, AddElementMenuServ) {

    var thisCtrl = this;
    thisCtrl.G = GlobalStor;
    thisCtrl.A = AuxStor;

    createAddElementGroups();


    //------ clicking
    //----------- for AddElements List View
    if(GlobalStor.global.currOpenPage === 'main' || GlobalStor.global.currOpenPage === 'cart') {
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



    //----------- create AddElement Groups for Searching

    function createAddElementGroups() {
      var groupNames = [
            $filter('translate')('add_elements.GRIDS'),
            $filter('translate')('add_elements.VISORS'),
            $filter('translate')('add_elements.SPILLWAYS'),
            $filter('translate')('add_elements.OUTSIDE'),
            $filter('translate')('add_elements.INSIDE'),
            $filter('translate')('add_elements.LOUVERS'),
            $filter('translate')('add_elements.CONNECTORS'),
            $filter('translate')('add_elements.FAN'),
            $filter('translate')('add_elements.WINDOWSILLS'),
            $filter('translate')('add_elements.HANDLELS'),
            $filter('translate')('add_elements.OTHERS')
          ],
          groupNamesQty = groupNames.length,
          g = 0;

      for(; g < groupNamesQty; g++){
        if(GlobalStor.global.addElementsAll[g].elementsList) {
          var groupTempObj = {};
          groupTempObj.groupId = (g+1);
          groupTempObj.groupName = groupNames[g];
          groupTempObj.groupClass = globalConstants.addElementsGroupClass[g];
          AuxStor.aux.addElementGroups.push(groupTempObj);
        }
      }

    }



    //----------- Searching Block in AddElements List View

    function checkChanges() {
      if(thisCtrl.searchingWord !== '') {
        if(thisCtrl.searchingWord.length === 1) {
          AuxStor.aux.addElementGroups = AddElementsServ.createAddElementGroups();
        }
        AuxStor.aux.showAddElementGroups = 1;
        AuxStor.aux.searchingWord = thisCtrl.searchingWord;
      }
    }

    //------- Delete searching word
    function cancelSearching() {
      thisCtrl.searchingWord = '';
      AuxStor.aux.addElementGroups.length = 0;
      AuxStor.aux.showAddElementGroups = 0;
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
      HistoryStor.history.searchingWord = '';
      HistoryStor.history.isOrderSearch = 0;
    }

    //-------- Delete last chart searching word
    function deleteSearchChartHistory() {
      thisCtrl.searchingWord = thisCtrl.searchingWord.slice(0,-1);
      HistoryStor.history.searchingWord = thisCtrl.searchingWord;
    }


  }
})();