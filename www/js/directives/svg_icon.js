
// directives/svg_icon.js

(function(){
  'use strict';
    /**
     * @ngInject
     */
  angular
    .module('BauVoiceApp')
    .directive('svgTemplateIcon', svgTemplateIcon);

  function svgTemplateIcon(SVGServ) {

    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      scope: {
        template: '=',
        templateWidth: '=',
        templateHeight: '='
      },
      link: function (scope, elem, attrs) {

        scope.$watch('template', function () {
          buildSVG(scope.template, scope.templateWidth, scope.templateHeight);
        });


        function buildSVG(template, widthSVG, heightSVG) {
          var mainSVG, mainGroup, padding = 1, points, dimMaxMin, scale, blocksQty;
          if(template && !$.isEmptyObject(template)) {

            var container = document.createElement('div');
            mainSVG = d3.select(container).append('svg').attr({
              'width': widthSVG,
              'height': heightSVG,
              'class': 'tamlateIconSVG'
            });
            points = SVGServ.collectAllPointsOut(template.details);
            dimMaxMin = getMaxMinCoord(points);
            scale = SVGServ.setTemplateScale(dimMaxMin, widthSVG, heightSVG, padding);

            mainGroup = mainSVG.append("g").attr({
              'id': 'main_group',
              'transform': 'translate(0,0) scale('+ scale.x +','+ scale.y +')'
            });

            blocksQty = template.details.length;

            for (var i = 0; i < blocksQty; i++) {
              if (template.details[i].level > 0) {
                mainGroup.selectAll('path.' + template.details[i].id).data(template.details[i].parts).enter().append('path').attr({
                    'blockId': template.details[i].id,
                    'class': function (d) {
                      return (d.type === 'glass') ? 'glass-icon' : 'frame-icon'
                    },
                    'item-type': function (d) {
                      return d.type;
                    },
                    'item-dir': function (d) {
                      return d.dir;
                    },
                    'd': function (d) {
                      return d.path;
                    }
                  });

              }
            }
            elem.html(container);
          }
        }


      }
    }

  }
})();
