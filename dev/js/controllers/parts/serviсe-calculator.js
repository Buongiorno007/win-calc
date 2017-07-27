(function() {
  "use strict";
  var Glob;
  /**@ngInject*/
  angular
    .module("MainModule")
    .controller("ServiсeCalclulatorCtrl", function(
      GlobalStor,
      ProductStor,

      MainServ) {
      /*jshint validthis:true */
      var thisCtrl = this;
      thisCtrl.G = GlobalStor;

      var CalculatorViewModel = function(GlobalStor) {
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
            if (!this.calculatorDisplay()) {
              this.calculatorDisplay($("#calculatorDisplay").val());
            }
            this.calculatorHistory(this.calculatorDisplay());
            number = "";
            this.calculatorDisplay(((eval(this.calculatorDisplay()).toFixed(2)).toString()));
          } catch (err) {
            console.log("somethings went wrong", err);
          }
        }
      }
      ko.applyBindings(new CalculatorViewModel(GlobalStor));

      $('#calculatorDisplay').keyup(function() {
        this.value = this.value.replace(/[^0-9\-\+\*\/\.]/g, '');
      });

      $('#calculatorDisplay').keypress(function(e) {
        if (e.which == 13) {
          $('#equallyClick').click();
          // GlobalStor.global.isServiceCalculator = 0;
          return false; //<---- Add this line
        }
      });
      function calculateServicePrice(){
        return GlobalStor.global.servisesPrice.reduce((a, b) => a + b, 0);
      }

      function evaluate() {
        GlobalStor.global.servisesPrice[GlobalStor.global.servisesPriceIndex] = parseInt($('#calculatorDisplay').val());

        ProductStor.product.service_price = calculateServicePrice();

        MainServ.setProductPriceTOTAL(ProductStor.product);
      }

      thisCtrl.evaluate = evaluate;
    });
})();
