(function(){
  'use strict';
    /**
     * @ngInject
     */
  angular
    .module('BauVoiceApp')
    .directive('svgTemplateIcon', svgTemplateIcon);

  function svgTemplateIcon(SVGServ, DesignServ) {

    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      scope: {
        template: '=',
        templateWidth: '=',
        templateHeight: '='
      },
      template: '<div class="iconSVG"></div>',
      link: function (scope, elem, attrs) {

        scope.$watch('template', function () {
          buildSVG(scope.template, scope.templateWidth, scope.templateHeight);
        });


        function buildSVG(template, widthSVG, heightSVG) {
          var mainSVG, mainGroup, padding = 1;
          if(template && !$.isEmptyObject(template)) {
            d3.select('.tamlateIconSVG').remove();

            mainSVG = d3.select('.iconSVG').append('svg').attr({
              'width': widthSVG,
              'height': heightSVG,
              'class': 'tamlateIconSVG'
              //            'viewBox': "0 0 800 800",
              //            'preserveAspectRatio': "xMidYMid meet"
            });
            var scale = setTemplateScale(template, widthSVG, heightSVG, padding);
            var position = SVGServ.setTemplatePosition(template, widthSVG, heightSVG, scale);

            mainGroup = mainSVG.append("g").attr({
              'id': 'main_group',
              'transform': 'translate(0,0) scale(' + scale + ')'
//              'transform': 'translate(' + position.x + ', ' + position.y + ') scale(' + scale + ')'
            });

            //          console.log('++++++ template +++++++', mainGroup);
            //========
            var blocksQty = template.details.skylights.length;

            for (var i = 0; i < blocksQty; i++) {
              if (template.details.skylights[i].level > 0) {
                mainGroup.selectAll('path.' + template.details.skylights[i].id).data(template.details.skylights[i].parts).enter().append('path').attr({
                    'blockId': template.details.skylights[i].id,
                    //'class': function(d) { return d.type; },
                    'class': function (d) {
                      return (d.type === 'glass') ? 'glass' : 'frame-icon'
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

            //--------- set clicking to all imposts
            DesignServ.initAllImposts();
            console.log('buildSVG done!!!!!!!!!', new Date(), new Date().getMilliseconds());
          }
        }

        function setTemplateScale(template, width, height, padding) {
          var dim = getMaxMinCoord(template.details.points),
              windowW = width,
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
          scale = (scale * padding) + del/16;
          //          console.log('scale = ', scale);
          return scale;
        }


      }
    }

  }
})();