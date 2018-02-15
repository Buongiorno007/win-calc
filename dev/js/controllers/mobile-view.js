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
                                        UserStor,
                                        OrderStor,
                                        GlobalStor,
                                        ProductStor) {
      var thisCtrl = this;
      GlobalStor.global.MobileTabActive = 0;

      thisCtrl.G = GlobalStor;
      thisCtrl.P = ProductStor;
      thisCtrl.U = UserStor;
      thisCtrl.O = OrderStor;

      thisCtrl.KARKAS = $filter("translate")("mainpage.KARKAS");
      thisCtrl.KONFIG = $filter("translate")("mainpage.KONFIG");
      thisCtrl.CART = $filter("translate")("mainpage.CART");
      thisCtrl.ROOM_SELECTION = $filter("translate")("mainpage.ROOM_SELECTION");
      thisCtrl.HEATCOEF_VAL = $filter('translate')('mainpage.HEATCOEF_VAL');
      thisCtrl.LETTER_M = $filter('translate')('common_words.LETTER_M');

      window.addEventListener('load', function() {
          var maybePreventPullToRefresh = false;
          var lastTouchY = 0;
          var touchstartHandler = function(e) {
              if (e.touches.length != 1) return;
              lastTouchY = e.touches[0].clientY;
              // Pull-to-refresh will only trigger if the scroll begins when the
              // document's Y offset is zero.
              maybePreventPullToRefresh =
                  window.pageYOffset == 0;
          }

          var touchmoveHandler = function(e) {
              var touchY = e.touches[0].clientY;
              var touchYDelta = touchY - lastTouchY;
              lastTouchY = touchY;

              if (maybePreventPullToRefresh) {
                  // To suppress pull-to-refresh it is sufficient to preventDefault the
                  // first overscrolling touchmove.
                  maybePreventPullToRefresh = false;
                  if (touchYDelta > 0) {
                      e.preventDefault();
                      return;
                  }
              }
          }

          document.addEventListener('touchstart', touchstartHandler, false);
          document.addEventListener('touchmove', touchmoveHandler, false);      });



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
        if (GlobalStor.global.MobileTabActive === newTab) {
          GlobalStor.global.MobileTabActive = 0;
        } else {
          GlobalStor.global.MobileTabActive = newTab;
        }
      };

      function isSet(tabNum) {
        return GlobalStor.global.MobileTabActive === tabNum;
      };
      $("#main-frame").addClass("main-frame-mobView");
      $("#app-container").addClass("app-container-mobView");
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
