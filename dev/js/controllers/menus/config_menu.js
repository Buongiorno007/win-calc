(function(){
  'use strict';

  /**
   * @ngInject
   */

  angular
    .module('MainModule')
    .controller('ConfigMenuCtrl', configMenuCtrl);

  function configMenuCtrl($rootScope, $document, $filter, globalConstants, localDB, GeneralServ, MainServ, AddElementsServ, GlobalStor, OrderStor, ProductStor, UserStor) {

    var thisCtrl = this;
    thisCtrl.constants = globalConstants;
    thisCtrl.G = GlobalStor;
    thisCtrl.O = OrderStor;
    thisCtrl.P = ProductStor;
    thisCtrl.U = UserStor;


    thisCtrl.config = {
      TOOLTIP: [
        '',
        $filter('translate')('mainpage.TEMPLATE_TIP'),
        $filter('translate')('mainpage.PROFILE_TIP'),
        $filter('translate')('mainpage.GLASS_TIP')
      ],
      reportMenu: [],
      reportFilterId: undefined,
      reportPriceTotal: 0,
      DELAY_START: globalConstants.STEP,
      DELAY_SHOW_CONFIG_LIST: 5 * globalConstants.STEP,
      DELAY_SHOW_FOOTER: 5 * globalConstants.STEP,
      DELAY_TYPE_ITEM_TITLE: 10 * globalConstants.STEP,
      DELAY_SHOW_U_COEFF: 20 * globalConstants.STEP,
      DELAY_GO_TO_CART: 2 * globalConstants.STEP,
      typing: 'on'
    };

    GlobalStor.global.isOpenedCartPage = 0;
    GlobalStor.global.isOpenedHistoryPage = 0;

    //------ clicking
    thisCtrl.selectConfigPanel = selectConfigPanel;
    thisCtrl.inputProductInOrder = saveProduct;
    thisCtrl.showNextTip = showNextTip;
    thisCtrl.showReport = showReport;
    thisCtrl.sortReport = sortReport;


    //============ methods ================//


    //------- Select menu item

    function selectConfigPanel(id) {
      GlobalStor.global.activePanel = (GlobalStor.global.activePanel === id) ? 0 : id;
      //---- hide rooms if opened
      GlobalStor.global.showRoomSelectorDialog = 0;
      //---- hide tips
      GlobalStor.global.configMenuTips = 0;
      //---- hide comment if opened
      GlobalStor.global.isShowCommentBlock = 0;
      //---- hide template type menu if opened
      GlobalStor.global.isTemplateTypeMenu = 0;
      GeneralServ.stopStartProg();
      MainServ.setDefaultAuxParam();
      AddElementsServ.desactiveAddElementParameters();
    }

    function saveProduct() {
      MainServ.inputProductInOrder().then(function() {
        //--------- moving to Cart when click on Cart button
        MainServ.goToCart();
      });
    }

    function showNextTip() {
      var tipQty = thisCtrl.config.TOOLTIP.length;
      ++GlobalStor.global.configMenuTips;
      if(GlobalStor.global.configMenuTips === tipQty) {
        GlobalStor.global.configMenuTips = 0;
        //------ open templates
        GlobalStor.global.activePanel = 1;
        //------ close rooms
        GlobalStor.global.showRoomSelectorDialog = 0;
      }
    }

    /** REPORT */

//    $document.off("keypress");
//    $document.bind("keypress", function(event) {
    $('.main-central-part').off("keypress");
    $('.main-central-part').keypress(function(event) {
//      console.log(UserStor.userInfo.user_type);
      console.log(event.keyCode);
      //------ show report only for Plands (5,7)
      if(UserStor.userInfo.user_type === 5 || UserStor.userInfo.user_type === 7) {
        //----- Button 'R'
        if(event.keyCode === 82 || event.keyCode === 114) {
          showReport();
        }
      }
    });


    function showReport() {
      GlobalStor.global.isReport = !GlobalStor.global.isReport;
      /** cuclulate Total Price of Report */
      culcReportPriceTotal();
      /** download report Menu */
      if(GlobalStor.global.isReport) {
        localDB.selectLocalDB(localDB.tablesLocalDB.elements_groups.tableName).then(function(result) {
          thisCtrl.config.reportMenu = result.filter(function(item) {
            return item.position > 0;
          });
          thisCtrl.config.reportMenu.push({
            id: 0,
            name: $filter('translate')('common_words.ALL')
          });
        });
      }
      $rootScope.$apply();
    }

    function sortReport(groupId) {
      /** cuclulate Total Price of group of Report */
      culcReportPriceTotal(groupId);
      if(groupId) {
        thisCtrl.config.reportFilterId = groupId;
      } else {
        thisCtrl.config.reportFilterId = undefined;
      }
    }

    function culcReportPriceTotal(group) {
      var currReportList = (group) ? ProductStor.product.report.filter(function(item) {
        return item.element_group_id === group;
      }) : angular.copy(ProductStor.product.report);

      if(currReportList.length) {
        thisCtrl.config.reportPriceTotal = GeneralServ.roundingNumbers(GeneralServ.rounding100(currReportList.reduce(function (sum, item) {
          return {priceReal: sum.priceReal + item.priceReal};
        }).priceReal), 3);
      } else {
        thisCtrl.config.reportPriceTotal = 0;
      }
    }

  }
})();