(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('HistoryModule')
    .factory('InfoBoxServ',

  function(
    $location,
    $filter,
    $q,
    GlobalStor,
    ProfileServ,
    GlassesServ,
    HardwareServ
  ) {
    /*jshint validthis:true */
    var thisFactory = this;


    /**============ METHODS ================*/

    function autoShowInfoBox(ids) {
      var tempObj = {};
      var itemArr = [];
      if(ids === 3) {
        var id = 311891,
          itemArr = GlobalStor.global.glasses;
      }
      if(ids === 4) {
        var id = 275,
          itemArr = GlobalStor.global.hardwares;
      }
      if(ids === 2) {
        var id = 345,
          itemArr = GlobalStor.global.profiles;
      }
      if(itemArr.length > 0) {
        for(var i=0; i<itemArr.length; i+=1) {
          for(var y=0; y<itemArr[i].length; y+=1) {
            if(itemArr[i][y].id === id && itemArr[i][y].img.length > 5) {
              tempObj = itemArr[i][y];
              break
            }
          }
        }
      }
      if(!$.isEmptyObject(tempObj)) {
        GlobalStor.global.infoTitle = tempObj.name;
        GlobalStor.global.infoImg =  tempObj.img;
        GlobalStor.global.infoLink = tempObj.link;
        GlobalStor.global.infoDescrip = tempObj.description;
        GlobalStor.global.isInfoBox = id;
      }
    }
    function isApply() {
      if(GlobalStor.global.activePanel === 2) {
        ProfileServ.checkForAddElem();
      }
      if(GlobalStor.global.activePanel === 3) {
        var id = 311891;
        var name =  'cтекло'
        GlassesServ.selectGlass(id, name);
      }
      if(GlobalStor.global.activePanel === 4) {
        var id = 275;
        HardwareServ.selectHardware(id);
      }
      GlobalStor.global.isInfoBox = 0;
      GlobalStor.global.infoTitle = '';
      GlobalStor.global.infoImg =  '';
      GlobalStor.global.infoLink = '';
      GlobalStor.global.infoDescrip = '';
    }
    /**========== FINISH ==========*/

    thisFactory.publicObj = {
    isApply: isApply,
    autoShowInfoBox: autoShowInfoBox
    };

    return thisFactory.publicObj;



  });
})();
