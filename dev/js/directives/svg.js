(function(){
  'use strict';
    /**
     * @ngInject
     */
  angular
    .module('BauVoiceApp')
    .directive('svgTemplate', svgTemplateDir);

  function svgTemplateDir(DesignServ) {

    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      scope: {
        typeConstruction: '@',
        template: '=',
        templateWidth: '=',
        templateHeight: '='
      },
      template: '<div id="mainSVG"></div>',
      link: function (scope, elem, attrs) {

        scope.$watch('template', function () {
          buildSVG(scope.template, scope.templateWidth, scope.templateHeight);
        });


        function buildSVG(template, widthSVG, heightSVG) {
          var mainSVG, mainGroup, padding = 1;

          d3.select('#tamlateSVG').remove();

          if(scope.typeConstruction === 'edit') {
            widthSVG += '%';
            heightSVG += '%';
            padding = 0.6;
          }

          mainSVG = d3.select('#mainSVG').append('svg').attr({
            'width': widthSVG,
            'height': heightSVG,
            'id': 'tamlateSVG'
//            'viewBox': "0 0 800 800",
//            'preserveAspectRatio': "xMidYMid meet"
          });
          var scale = setTemplateScale(template, widthSVG, heightSVG, padding);
          var position = setTemplatePosition(template, widthSVG, heightSVG, scale);

          mainGroup = mainSVG.append("g").attr({
            'id': 'main_group',
            'transform': 'translate('+ position.x +', '+ position.y +') scale('+ scale +')'
          });

//          console.log('++++++ template +++++++', mainGroup);
          //========
          var blocksQty = template.details.skylights.length;

          for (var i = 0; i < blocksQty; i++) {
            if (template.details.skylights[i].level > 0) {
              mainGroup.selectAll('path.'+template.details.skylights[i].id)
                .data(template.details.skylights[i].parts).enter()
                .append('path')
                .attr({
                  'blockId': template.details.skylights[i].id,
                  //'class': function(d) { return d.type; },
                  'class': function (d) {
                    return (d.type === 'glass') ? 'glass' : 'frame'
                  },
                  'item-type': function(d) {
                    return d.type;
                  },
                  'item-dir': function(d) {
                    return d.dir;
                  },
                  'd': function (d) {
                    return d.path;
                  }
                });


              //----- sash open direction
              if(template.details.skylights[i].sashOpenDir) {
                var openSashMarks = mainGroup.selectAll('path.sash_mark.'+template.details.skylights[i].id)
                  .data(template.details.skylights[i].sashOpenDir).enter()
                  .append('path')
                  .classed('sash_mark', true)
                  .attr('d', function(d){return d.path;});
              }


              //---- corner markers
              if (template.details.skylights[i].level === 1) {
                //----- create array of frame points with corner = true
                var corners = template.details.skylights[i].pointsOut.filter(function (item) {
                  return item.corner > 0;
                });
                var cornerMarks = mainGroup.selectAll('circle.corner_mark.'+template.details.skylights[i].id)
                  .data(corners).enter()
                  .append('circle')
                  .attr({
                    'blockId': template.details.skylights[i].id,
                    'class': 'corner_mark',
                    'parent': function (d) {
                      return d.id;
                    },
                    'cx': function (d) {
                      return d.x;
                    },
                    'cy': function (d) {
                      return d.y;
                    },
                    'r': 0
                  });
              }


            }
          }

          //--------- set clicking to all imposts
          DesignServ.initAllImposts();
          console.log('buildSVG done!!!!!!!!!', new Date(), new Date().getMilliseconds());
        }




        function setTemplateScale(template, width, height, padding) {
          var dim = getMaxMinCoord(template.details.points),
              windowW = width,
              windowH = height,
              scale, del;

          if(width === '100%') {
            windowW = window.innerWidth;
            windowH = window.innerHeight;
          }

          var windowS = windowW * windowH,
              templateS = (dim.maxX - dim.minX) * (dim.maxY - dim.minY);

          if(windowS < templateS) {
            scale = windowS/templateS;
            del = (templateS - windowS)/templateS ;
          } else {
            scale = templateS/windowS;
            del = (windowS - templateS)/windowS ;
          }
          scale = (scale * padding) + del/10;
//          console.log('scale = ', scale);
          return scale;
        }


        function setTemplatePosition(template, width, height, scale) {
          var dim = getMaxMinCoord(template.details.points),
              windowW = width,
              windowH = height;

          if(width === '100%') {
            windowW = window.innerWidth;
            windowH = window.innerHeight;
          }

          var position = {
            x: (windowW - (dim.minX + dim.maxX)*scale)/2,
            y: (windowH - (dim.minY + dim.maxY)*scale)/2
          };

//          console.log('position = ', position);
          return position;
        }



      }
    }

  }
})();