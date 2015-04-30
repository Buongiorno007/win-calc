
// controllers/parts/search-box.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .controller('searchCtrl', searchCtrl);

  function searchCtrl(GlobalStor, AuxStor) {

    var thisCtrl = this;
    thisCtrl.global = GlobalStor.global;



    //------ clicking
    thisCtrl.cancelSearching = cancelSearching;
    thisCtrl.deleteSearchChart = deleteSearchChart;
    thisCtrl.checkChanges = checkChanges;

    if(GlobalStor.global.currOpenPage === 'main') {
//      thisCtrl.setValueSize = AddElementMenuServ.setValueSize;
//      thisCtrl.deleteLastNumber = AddElementMenuServ.deleteLastNumber;
//      thisCtrl.closeSizeCaclulator = AddElementMenuServ.closeSizeCaclulator;
    } else {
//      thisCtrl.isConstructionPage = true;
    }


    //============ methods ================//

    function checkChanges() {
      if(thisCtrl.searchingWord !== '') {
        AuxStor.aux.showAddElementGroups = true;
        AuxStor.aux.searchingWord = thisCtrl.searchingWord;
      }
    }

    //------- Delete searching word
    function cancelSearching() {
      thisCtrl.searchingWord = '';
      AuxStor.aux.showAddElementGroups = false;
      AuxStor.aux.searchingWord = thisCtrl.searchingWord;
    }

    //-------- Delete last chart searching word
    function deleteSearchChart() {
      thisCtrl.searchingWord = thisCtrl.searchingWord.slice(0,-1);
      AuxStor.aux.searchingWord = thisCtrl.searchingWord;
      if(thisCtrl.searchingWord === '') {
        AuxStor.aux.showAddElementGroups = false;
      }
    }



  }
})();
