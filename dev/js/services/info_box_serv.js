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

    function autoShow(ids) {
      GlobalStor.global.setTimeout = 0;
      if(GlobalStor.global.activePanel !== 0 && ids === GlobalStor.global.activePanel) {
        infoBox(ids)
      }
    }
    function infoBox(ids) {
      var qtyCheck = GlobalStor.global.inform,
          tempObj = {},
          itemArr = [],
          k = ids;

      // for(var i=0; i<qtyCheck.length; i+=1) {
      //   if(ids === qtyCheck[i]) {
      //     k = 0;
      //   }
      // }

      if(ids === 3 && k === 3) {
        var id = 311898,
          itemArr = GlobalStor.global.glasses;
          console.log(GlobalStor.global.glasses, GlobalStor.global.glasses)
      }
      if(ids === 4 && k === 4 && GlobalStor.global.checkSashInTemplate > 0) {
        var id = 281,
          itemArr = GlobalStor.global.hardwares;
      }
      if(ids === 2 && k === 2) {
        var id = 520,
          itemArr = GlobalStor.global.profiles;
      }
      if(ids === 6 && k === 6) {
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
        var id = 520;
        ProfileServ.checkForAddElem(id);
        GlobalStor.global.inform.push( GlobalStor.global.activePanel)
      }
      if(GlobalStor.global.activePanel === 3) {
        var id = 311898;
        var name =  '4M-16-4'
        GlassesServ.selectGlass(id, name);
        GlobalStor.global.inform.push( GlobalStor.global.activePanel)
      }
      if(GlobalStor.global.activePanel === 4) {
        var id = 281;
        HardwareServ.selectHardware(id);
        GlobalStor.global.inform.push( GlobalStor.global.activePanel)
      }
      if(GlobalStor.global.activePanel === 6) {
        addElemSelected();
        GlobalStor.global.inform.push( GlobalStor.global.activePanel)
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
    infoBox: infoBox,
    autoShow: autoShow,
    addElemSelected: addElemSelected
    };

    return thisFactory.publicObj;



  });
})();
