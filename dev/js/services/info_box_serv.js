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
    globalConstants,
    localDB
  ) {
    /*jshint validthis:true */
    var thisFactory = this;

    /**============ METHODS ================*/

    function autoShow(ids) {
      GlobalStor.global.isPush = [];
      localDB.selectLocalDB(
        localDB.tablesLocalDB.lists.tableName,
        {'is_push': 1},
        'id, name, list_group_id, glass_type, name'
      ).then(function (result) {
        GlobalStor.global.isPush = angular.copy(result)
        GlobalStor.global.setTimeout = 0;
        if(GlobalStor.global.activePanel !== 0 && ids === GlobalStor.global.activePanel) {
          (GlobalStor.global.inform!==1) ? GlobalStor.global.showApply = 1 : GlobalStor.global.showApply = 0;
          infoBox(ids)
        }
      });
    }

    function infoBox(ids) {
      var isPush = GlobalStor.global.isPush;
      var profiles = GlobalStor.global.profiles; 
      var hardwares = GlobalStor.global.hardwares;
      var qtyCheck = GlobalStor.global.inform,
          tempObj = {},
          itemArr = [];

      if(ids === 3 && qtyCheck !== 1) {
        for(var x=0; x<isPush.length; x+=1) {
          if(isPush[x].list_group_id === 6) {
            var id = isPush[x].id;
            var type = isPush[x].glass_type;
            var name = isPush[x].name;
            break
          }
        }
        GlobalStor.global.infoBoxglassName = name;
        GlobalStor.global.infoBoxglassType = type;
        GlobalStor.global.infoBoxglasses = id;
        itemArr = GlobalStor.global.glasses;
      }
      if(ids === 4 && qtyCheck !== 1 && GlobalStor.global.checkSashInTemplate > 0) {
        for(var y=0; y<hardwares.length; y+=1) {
          for(var w=0; w<hardwares[y].length; w+=1) {
            if(hardwares[y][w].is_push === 1) {
              var id = hardwares[y][w].id;
              GlobalStor.global.infoBoxhardwares = hardwares[y][w].id;
            }
          }
        }
        itemArr = GlobalStor.global.hardwares;
      }
      if(ids === 2 && qtyCheck !== 1) {
        for(var y=0; y<profiles.length; y+=1) {
          for(var w=0; w<profiles[y].length; w+=1) {
            if(profiles[y][w].is_push === 1) {
              var id = profiles[y][w].id;
              GlobalStor.global.infoBoxprofiles = profiles[y][w].id;
            }
          }
        }
          itemArr = GlobalStor.global.profiles;
      }
      if(ids === 6 && qtyCheck !== 1) {
        itemArr = [];
        function sort(a,b) {
          return Math.random()-0,5;
        }
        isPush.sort(sort);
        for(var x=0; x<isPush.length; x+=1) {
          if(isPush[x].list_group_id !== 6) {
            var id = isPush[x].id;
            GlobalStor.global.infoBoxaddElem = isPush[x];
            break
          }
        }
        for(var i = 0; i<GlobalStor.global.addElementsAll.length; i+=1) {
          for(var d = 0; d<GlobalStor.global.addElementsAll[i].elementsList.length; d+=1) {
            itemArr.push(GlobalStor.global.addElementsAll[i].elementsList[d])
          }
        }
      }
      if(itemArr.length > 0) {
        for(var i=0; i<itemArr.length; i+=1) {
          for(var y=0; y<itemArr[i].length; y+=1) {
            if(itemArr[i][y].id === id /*&& itemArr[i][y].img.length > 5*/) {
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
        var id = GlobalStor.global.infoBoxprofiles;
        ProfileServ.checkForAddElem(id);
        GlobalStor.global.inform.push(GlobalStor.global.activePanel)
      }
      if(GlobalStor.global.activePanel === 3) {
        var id = GlobalStor.global.infoBoxglasses;
        var name = GlobalStor.global.infoBoxglassName;
        GlassesServ.selectGlass(id, name, GlobalStor.global.infoBoxglassType);
        GlobalStor.global.inform.push( GlobalStor.global.activePanel)
      }
      if(GlobalStor.global.activePanel === 4) {
        var id = GlobalStor.global.infoBoxhardwares;
        HardwareServ.selectHardware(id);
        GlobalStor.global.inform.push( GlobalStor.global.activePanel)
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
      var addElem = GlobalStor.global.infoBoxaddElem;
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
      AuxStor.aux.isFocusedAddElement = fan;
      AuxStor.aux.showAddElementsMenu = globalConstants.activeClass;
      //AuxStor.aux.isTabFrame = true;
      AddElementsServ.selectAddElem(typeId, elementId, undefined)
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
