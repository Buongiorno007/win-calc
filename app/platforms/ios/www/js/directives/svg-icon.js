
// directives/svg-icon.js

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
            scale = setTemplateScale(dimMaxMin, widthSVG, heightSVG, padding);

            mainGroup = mainSVG.append("g").attr({
              'id': 'main_group',
              'transform': 'translate(0,0) scale(' + scale + ')'
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
            console.log('buildSVG done!!!!!!!!!', new Date(), new Date().getMilliseconds());
          }
        }

        function setTemplateScale(dim, width, height, padding) {
          var windowW = width,
              windowH = height,
              scale, del;


          var windowS = windowW * windowH,
              templateS = (dim.maxX - dim.minX) * (dim.maxY - dim.minY);

          if(windowS < templateS) {
            scale = windowS/templateS;
            del = (templateS - windowS)/templateS ;
          } else {
            scale = templateS/windowS;
            del = (windowS - templateS)/windowS ;
          }
          scale = (scale * padding) + del/20;
          //          console.log('scale = ', scale);
          return scale;
        }


      }
    }

  }
})();
