(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .controller('ReportCtrl', reportCtrl);

  function reportCtrl($rootScope, $filter, localDB, GeneralServ, GlobalStor, ProductStor, UserStor) {

    var thisCtrl = this;
    thisCtrl.G = GlobalStor;
    thisCtrl.P = ProductStor;
    thisCtrl.U = UserStor;

    thisCtrl.config = {
      reportMenu: [],
      reportFilterId: undefined,
      reportPriceTotal: 0
    };

    //------ clicking

    //thisCtrl.showReport = showReport;
    thisCtrl.sortReport = sortReport;


    //============ methods ================//



    $('.main-content').off("keypress").keypress(function(event) {
      //      console.log(UserStor.userInfo.user_type);
      //console.log('RRRRRRRRR', event.keyCode);
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