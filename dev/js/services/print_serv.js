(function () {  'use strict';  /**@ngInject*/  angular    .module('CartModule')    .factory('PrintServ',      function ($location,                $filter,                GeneralServ,                MainServ,                CartMenuServ,                GlobalStor,                HistoryStor) {        /*jshint validthis:true */        var thisFactory = this;        /**============ METHODS ================*/        function getProducts(products, addEl) {          console.log("isDevice",isDevice);          console.log("GlobalStor.global.isDevice",GlobalStor.global.isDevice);          HistoryStor.history.PrintProduct = products;          HistoryStor.history.PrintAddEl = addEl;          setTimeout(function () {            if (GlobalStor.global.isDevice) {              window.print();            } else {              var print = $('#print-conteiner').html();              var prtContent = document.getElementById('print-conteiner');              var prtCSS = '<link rel="stylesheet" href="/css/main.css" type="text/css" />';              var WinPrint = window.open(this.href, '_blank');              WinPrint.document.write('<div class="print-conteiner">');              WinPrint.document.write(prtCSS);              WinPrint.document.write(prtContent.innerHTML);              WinPrint.document.write("<script> window.onload = function(){window.print();}</script>");              WinPrint.document.write('</div>');              WinPrint.document.close();              WinPrint.focus();            }          }, 800);        }        /**========== FINISH ==========*/        thisFactory.publicObj = {          getProducts: getProducts,        };        return thisFactory.publicObj;      });})();