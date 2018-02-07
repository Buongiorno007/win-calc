(function () {
  "use strict";
  /**@ngInject*/
  angular
    .module("MainModule")
    .controller("MobileCtrl", function ($filter,
                                        $timeout,
                                        SVGServ,
                                        MainServ,
                                        localDB,
                                        GlobalStor,
                                        ProductStor) {
      var thisCtrl = this;
      thisCtrl.tab = 0;

      thisCtrl.G = GlobalStor;
      thisCtrl.P = ProductStor;

      thisCtrl.KARKAS = $filter("translate")("mainpage.KARKAS");
      thisCtrl.KONFIG = $filter("translate")("mainpage.KONFIG");
      thisCtrl.CART = $filter("translate")("mainpage.CART");
      thisCtrl.ROOM_SELECTION = $filter("translate")("mainpage.ROOM_SELECTION");

      /**================ EDIT PRODUCT =================*/
      if (GlobalStor.global.productEditNumber && !ProductStor.product.is_addelem_only) {
        SVGServ.createSVGTemplate(ProductStor.product.template_source, ProductStor.product.profileDepths)
          .then(function (data) {
            ProductStor.product.template = data;
          });
      }
      localDB.getLocalStor().then((result) => {
        if (result)
          if (!ProductStor.product.is_addelem_only) {
            MainServ.profile();
            MainServ.doorProfile();
            MainServ.laminationDoor();
          }
      });

      function setTab(newTab) {
        GlobalStor.global.activePanel = 0;
        if (thisCtrl.tab === newTab) {
          thisCtrl.tab = 0;
        } else {
          thisCtrl.tab = newTab;
        }
      };

      function isSet(tabNum) {
        return thisCtrl.tab === tabNum;
      };
      let obj = $("#main-frame");
      obj.css({
        "transform": "scale(1)",
        "left": "0px",
        "top": "0px",
      });
      /**========== FINISH ==========*/

      //------ clicking
      thisCtrl.setTab = setTab;
      thisCtrl.isSet = isSet;
    });
})();
