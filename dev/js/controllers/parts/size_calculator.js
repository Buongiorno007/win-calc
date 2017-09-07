(function() {
  "use strict";
  /**@ngInject*/
  angular
    .module("MainModule")
    .controller("sizeCalculatorCtrl", function(
      $filter,
      GlobalStor,
      DesignStor,
      UserStor,
      AddElementMenuServ,
      DesignServ,
      MainServ,
      EditAddElementCartServ
    ) {
      /*jshint validthis:true */
      var thisCtrl = this;
      thisCtrl.isDesignPage = false;
      thisCtrl.D = DesignStor;
      thisCtrl.U = UserStor;

      //------- translate
      thisCtrl.MIN = $filter("translate")("common_words.MIN");
      thisCtrl.MAX = $filter("translate")("common_words.MAX");

      //------ clicking
      //------ for Add Elements Panel
      if (GlobalStor.global.currOpenPage === "main") {
        thisCtrl.isDesignPage = true;
        thisCtrl.setValueSize = AddElementMenuServ.setValueSize;
        thisCtrl.deleteLastNumber = AddElementMenuServ.deleteLastNumber;
        thisCtrl.closeSizeCaclulator = AddElementMenuServ.closeSizeCaclulator;
        //------ for Design Page
      } else if (GlobalStor.global.currOpenPage === "cart") {
        thisCtrl.isDesignPage = true;
        thisCtrl.setValueSize = EditAddElementCartServ.setValueSize;
        thisCtrl.deleteLastNumber = EditAddElementCartServ.deleteLastNumber;
        thisCtrl.closeSizeCaclulator =
          EditAddElementCartServ.closeSizeCaclulator;
        //------ for Design Page
      } else {
        if (GlobalStor.global.activePanel === 6) {
          thisCtrl.isDesignPage = true;
          thisCtrl.setValueSize = AddElementMenuServ.setValueSize;
          thisCtrl.deleteLastNumber = AddElementMenuServ.deleteLastNumber;
          thisCtrl.closeSizeCaclulator = AddElementMenuServ.closeSizeCaclulator;
        } else {
          thisCtrl.isDesignPage = true;
          thisCtrl.setValueSize = DesignServ.setValueSize;
          thisCtrl.deleteLastNumber = DesignServ.deleteLastNumber;
          thisCtrl.closeSizeCaclulator = DesignServ.closeSizeCaclulator;
        }
      }
      // GlobalStor.global.activePanel = 0;

      thisCtrl.displayData = MainServ.displayData;
      thisCtrl.pressCulculator = AddElementMenuServ.pressCulculator;
    });
})();
