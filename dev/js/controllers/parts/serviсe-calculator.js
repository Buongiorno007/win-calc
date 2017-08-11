(function() {
  "use strict";
  /**@ngInject*/
  angular
    .module("MainModule")
    .controller("ServiсeCalclulatorCtrl", function(
      GlobalStor,
      ProductStor,
      CartStor,

      GeneralServ,
      MainServ) {
      /*jshint validthis:true */
      var thisCtrl = this;
      thisCtrl.G = GlobalStor;
      var CalculatorViewModel = function() {
        this.calculatorDisplay = ko.observable("");
        this.calculatorHistory = ko.observable("");
        var number = "";
        this.updateCalculatorDisplay = function(value) {
          number += value;
          if (value === "+" || value === "/" || value === "*" || value === "-") {
            number = "";
          }
          var temp = this.calculatorDisplay();
          if (!((number.indexOf(".") !== number.lastIndexOf(".")) && value === ".")) {
            if (!(!temp.length && (value === "+" || value === "/" || value === "*" || value === "-" || value === "."))) {
              if (!(((temp.substr(temp.length - 1) === "*") || (temp.substr(temp.length - 1) === "/") || (temp.substr(temp.length - 1) === "-") || (temp.substr(temp.length - 1) === "+")) &&
                  (value === "0" || value === "+" || value === "/" || value === "*" || value === "-" || value === "."))) {
                this.calculatorDisplay(this.calculatorDisplay() + value);
              }
            }
          }
        };

        this.clearDisplay = function() {
          this.calculatorDisplay("");
          this.calculatorHistory("");
          number = "";
          $("#close").val("");
        };

        this.backspace = function() {
          if (this.calculatorDisplay().length) {
            this.calculatorDisplay(this.calculatorDisplay().substring(0, this.calculatorDisplay().length - 1));
          }
        };

        this.evaluateDisplay = function() {
          try {
            this.calculatorDisplay($("#calculatorDisplay").val().toString());
            this.calculatorHistory(this.calculatorDisplay());
            number = "";
            this.calculatorDisplay(((eval(this.calculatorDisplay()).toFixed(2)).toString()));
          } catch (err) {
            this.calculatorDisplay(0);
            console.log("somethings went wrong", err);
          }
        }
      };
      ko.applyBindings(new CalculatorViewModel());

      $('#calculatorDisplay').keyup(function() {
        this.value = this.value.replace(/[^0-9\-\+\*\/\.]/g, '');
      });

      $('#calculatorDisplay').keypress(function(e) {
        if (e.which === 13) {
          document.getElementById('equallyClick').click();
          // $('#equallyClick').click();
          return false; //<---- Add this line
        }
      });
      function calculateServicePrice(){
        return ProductStor.product.services_price_arr.reduce(function(a,b){return(a+b)});
        // return ProductStor.product.services_price_arr.reduce((a, b) => a + b, 0);
      }

      function evaluate() {
        ProductStor.product.services_price_arr[GlobalStor.global.servicesPriceIndex] = parseFloat($('#calculatorDisplay').val());
        ProductStor.product.service_price = calculateServicePrice();

        ProductStor.product.service_price_dis = GeneralServ.setPriceDis(
          ProductStor.product.service_price,
          CartStor.cart.discount_service
        );
        GlobalStor.global.isChangedTemplate = 1;
        // document.getElementsByClassName('service-input')[GlobalStor.global.servicesPriceIndex].innerHTML = $('#calculatorDisplay').val();
        MainServ.setProductPriceTOTAL(ProductStor.product);
        $('#calculatorDisplay').focus();
      }
      thisCtrl.evaluate = evaluate;
    });
})();
