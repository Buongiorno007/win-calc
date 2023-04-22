(function () {
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('UserInfoCtrl',

      function (globalConstants, GlobalStor, UserStor, $location, localDB, GeneralServ, DesignServ) {
        /*jshint validthis:true */
        var thisCtrl = this;
        thisCtrl.G = GlobalStor;
        thisCtrl.U = UserStor;
        let global = localStorage.getItem("GlobalStor");
        if (global) {
          var loadDate = new Date(Date.parse(JSON.parse(LZString.decompressFromUTF16(global)).loadDate));
          thisCtrl.loadDate = loadDate.getDate() + "." + loadDate.getMonth() + "." + loadDate.getFullYear();
        }
        thisCtrl.loadDate = GlobalStor.global.loadDate;
        thisCtrl.config = {
          DELAY_SHOW_USER_INFO: 40 * globalConstants.STEP,
          typing: 'on',
          checked: false
        };


        /**============ METHODS ================*/

        function swipeMainPage() {
          if ($location.path() === "/light") {
            GlobalStor.global.currOpenPage = "light";
            GlobalStor.global.isLightVersion = 1;
              DesignServ.closeSizeCaclulator();
          }
          else {
            GlobalStor.global.isLightVersion = 0;
          }
          GlobalStor.global.isNavMenu = !GlobalStor.global.isNavMenu;
          GlobalStor.global.isConfigMenu = !GlobalStor.global.isConfigMenu;
          //playSound('swip');
        }

        function swipeLeft() {
          if (GlobalStor.global.isNavMenu) {
            GlobalStor.global.isNavMenu = 0;
            GlobalStor.global.isConfigMenu = 1;
            //playSound('swip');
          }
        }

        function swipeRight() {
          if (!GlobalStor.global.isNavMenu) {
            GlobalStor.global.isNavMenu = 1;
            GlobalStor.global.isConfigMenu = 0;
            //playSound('swip');
          }
        }

        function update() {
          localStorage.clear();
          localDB.db.clear().then(function () {
            // Run this code once the database has been entirely deleted.
            console.log('Database is now empty.');
          }).catch(function (err) {
            // This code runs if there were any errors
            console.log(err);
          });
          // $location.path("/");
          location.reload();

        }

        function getAlert() {
          GeneralServ.confirmAlert(
            "Действительно обновить?",
            "",
            update
          );

        }

        /**========== FINISH ==========*/

        //------ clicking
        thisCtrl.swipeMainPage = swipeMainPage;
        thisCtrl.swipeLeft = swipeLeft;
        thisCtrl.swipeRight = swipeRight;
        thisCtrl.getAlert = getAlert;

      });
})();