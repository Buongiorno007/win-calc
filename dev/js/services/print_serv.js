(function () {
  'use strict';
  /**@ngInject*/
  angular
    .module('CartModule')
    .factory('PrintServ',

      function ($location,
                $filter,
                GeneralServ,
                MainServ,
                CartMenuServ,
                GlobalStor,
                HistoryStor) {
        /*jshint validthis:true */
        var thisFactory = this;


        /**============ METHODS ================*/
        function getProducts(products, addEl) {
          HistoryStor.history.PrintProduct = products;
          HistoryStor.history.PrintAddEl = addEl;
          console.log(products, 'products=====');
          console.log(addEl, 'addEl=====');
          setTimeout(function () {
            var print = $('#print-conteiner').html();
            var prtContent = document.getElementById('print-conteiner');
            var prtCSS = '<link rel="stylesheet" href="/css/main.css" type="text/css" />';
            var WinPrint = window.open(this.href, '_blank');
            WinPrint.document.write('<div class="print-conteiner">');
            WinPrint.document.write(prtCSS);
            WinPrint.document.write(prtContent.innerHTML);
            WinPrint.document.write("<script> window.onload = function(){window.print();}</script>");
            WinPrint.document.write('</div>');
            WinPrint.document.close();
            WinPrint.focus();

          }, 1000);


          // var mywindow = open('_blank','newokno','width=700,height=700,status=1,menubar=1');
          // mywindow.document.open();
          // mywindow.document.write('<html><head><title>Создаём хтмл-документ');
          // mywindow.document.write('</title></head><body>');
          // mywindow.document.write(print);
          // mywindow.document.write('Это статичный текст');
          // mywindow.document.write('</body></html>');
          // mywindow.document.close();

          // setTimeout(function () {
          //   window.print();
          // }, 1000);
          //window.print();

        }

        /**========== FINISH ==========*/
        thisFactory.publicObj = {
          getProducts: getProducts,
        };

        return thisFactory.publicObj;


      });
})();
