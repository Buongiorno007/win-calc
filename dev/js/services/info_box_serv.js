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
    HardwareServ,
    AddElementsServ,
    ProductStor,
    AddElementMenuServ,
    AuxStor,
    globalConstants
  ) {
    /*jshint validthis:true */
    var thisFactory = this;


    /**============ METHODS ================*/

    function autoShowInfoBox(ids) {
      var tempObj = {};
      var itemArr = [];
      if(ids === 3 && GlobalStor.global.inform !==3) {
        var id = 311891,
          itemArr = GlobalStor.global.glasses;
      }
      if(ids === 4 && GlobalStor.global.inform !==4) {
        var id = 275,
          itemArr = GlobalStor.global.hardwares;
      }
      if(ids === 2 && GlobalStor.global.inform !==2) {
        var id = 345,
          itemArr = GlobalStor.global.profiles;
      }
      if(ids === 6 && GlobalStor.global.inform !==6) {
        var id = 297434,
        itemArr = [];
        for(var i = 0; i<GlobalStor.global.addElementsAll.length; i+=1) {
          for(var d = 0; d<GlobalStor.global.addElementsAll[i].elementsList.length; d+=1) {
            itemArr.push(GlobalStor.global.addElementsAll[i].elementsList[d])
          }
        }
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
      if(GlobalStor.global.activePanel === 6) {
        addElemSelected();
      }
      GlobalStor.global.isInfoBox = 0;
      GlobalStor.global.infoTitle = '';
      GlobalStor.global.infoImg =  '';
      GlobalStor.global.infoLink = '';
      GlobalStor.global.infoDescrip = '';
    }
    function addElemSelected () {
      var id = [20, 21, 9, 19, 26, 19, 12, 27, 8, 24, 18, 99, 9999, 999, 999, 9999];
      var addElem = objAdd;
      var fan = 0;
      var typeId;
      var elementId;
      for(var i=0; i<id.length; i+=1) {
        if(addElem.list_group_id === id[i]) {
          fan = i+1;
          break
        }
      }
      AddElementsServ.downloadAddElementsData(fan)
      for(var v=0; v<AuxStor.aux.addElementsList.length; v+=1) {
        for(var z=0; z<AuxStor.aux.addElementsList[v].length; z+=1) {
          if(addElem.id === AuxStor.aux.addElementsList[v][z].id) {
            typeId = v;
            elementId = z;
          }
        }
      }
      AuxStor.aux.isFocusedAddElement = elementId;
      AuxStor.aux.showAddElementsMenu = globalConstants.activeClass;
      //AuxStor.aux.isTabFrame = true;
      AddElementsServ.selectAddElem(typeId, elementId, undefined)
    }
    var objAdd = {
      a: 0,
      add_color_id: 1,
      addition_folder_id: 0,
      amendment_pruning: 0,
      b: 0,
      beed_lamination_id: 1,
      c: 0,
      cameras : 1,
      d: 0,
      description: "",
      doorstep_type: 1,
      element_height: 0,
      element_price: 0.38,
      element_qty: 1,
      element_width: 0,
      glass_image: 1,
      glass_type: 1,
      id: 297434,
      img: "http://api.windowscalculator.net/local_storage/set/6393ru4ki_veka_euroline.png",
      in_door: 0,
      link: "",
      list_group_id: 24,
      list_type_id: 23,
      modified: "2015-12-01T11:19:41.061Z",
      name: "Ручка окон.коричн.",
      parent_element_id: 392714,
      position: 0,
      waste: 0,
    }


    /**========== FINISH ==========*/

    thisFactory.publicObj = {
    isApply: isApply,
    autoShowInfoBox: autoShowInfoBox,
    addElemSelected: addElemSelected
    };

    return thisFactory.publicObj;



  });
})();
