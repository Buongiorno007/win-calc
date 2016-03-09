(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('BauVoiceApp')
    .filter('locationFilter',

  function($filter) {

    return function(items, searchWord) {
      var itemsQty = items.length,
          searchWTemp,
          filtered = [];
          //regexp = new RegExp('^'+searchWord+'\\.*','i');

      if(searchWord && (searchWord.length > 2)) {
        //------- slower!!!!
        //while(--itemsQty > -1) {
        //  if(regexp.test(items[itemsQty].fullLocation)) {
        //    filtered.push(items[itemsQty]);
        //  }
        //}
        searchWTemp = searchWord.toLowerCase();
        while(--itemsQty > -1) {
          if(items[itemsQty].fullLocation.toLowerCase().indexOf(searchWTemp) === 0) {
            filtered.push(items[itemsQty]);
          }
        }
      }
      filtered = $filter('orderBy')(filtered, 'cityName', false);
      return filtered;
    };

  });
})();
