(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('AddElemGroupMenuCtrl',

  function(
    AddElementsServ,
    AddElementMenuServ,
    DesignServ,
    GlobalStor,
    ProductStor,
    AuxStor
  ) {
    /*jshint validthis:true */
    var thisCtrl = this;
    thisCtrl.A = AuxStor;


    /**============ METHODS ================*/

    function takeAddElemMenu(groupId) {
      AuxStor.aux.isAddElement = 0;
      AddElementsServ.selectAddElement(groupId);
    }


    /**========== FINISH ==========*/
    //------ clicking
    thisCtrl.takeAddElemMenu = takeAddElemMenu;
    thisCtrl.takeAddElemFilt = AddElementMenuServ.takeAddElemFilt;

  });
})();
