(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('AddElemGroupMenuCtrl', addElemGroupCtrl);

  function addElemGroupCtrl(AddElementsServ, AuxStor) {
    /*jshint validthis:true */
    var thisCtrl = this;
    thisCtrl.A = AuxStor;

    //------ clicking
    thisCtrl.selectAddElement = AddElementsServ.selectAddElement;

  }
})();