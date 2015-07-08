
// directives/svg.js

(function(){
  'use strict';
    /**
     * @ngInject
     */
  angular
    .module('BauVoiceApp')
    .directive('svgTemplate', svgTemplateDir);

  function svgTemplateDir(SVGServ, DesignServ) {

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
          var mainSVG, mainGroup, padding = 1, points, dimMaxMin, scale, position, blocksQty;
          if(template && !$.isEmptyObject(template)) {
            d3.select('#tamlateSVG').remove();

            if (scope.typeConstruction === 'edit') {
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
            points = SVGServ.collectAllPointsOut(template.details);
            dimMaxMin = getMaxMinCoord(points);
            scale = SVGServ.setTemplateScale(dimMaxMin, widthSVG, heightSVG, padding);
            position = SVGServ.setTemplatePosition(dimMaxMin, widthSVG, heightSVG, scale);

            mainGroup = mainSVG.append("g").attr({
              'id': 'main_group',
              'transform': 'translate(' + position.x + ', ' + position.y + ') scale(' + scale + ')'
            });

            //          console.log('++++++ template +++++++', mainGroup);
            //========
            blocksQty = template.details.length;

            for (var i = 0; i < blocksQty; i++) {
              if (template.details[i].level > 0) {
                mainGroup.selectAll('path.' + template.details[i].id).data(template.details[i].parts).enter().append('path').attr({
                    'blockId': template.details[i].id,
                    //'class': function(d) { return d.type; },
                    'class': function (d) {
                      return (d.type === 'glass') ? 'glass' : 'frame'
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


                //----- sash open direction
                if (template.details[i].sashOpenDir) {
                  var openSashMarks = mainGroup.selectAll('path.sash_mark.' + template.details[i].id).data(template.details[i].sashOpenDir).enter().append('path').classed('sash_mark', true).attr('d', function (d) {
                      return d.path;
                    });
                }


                //---- corner markers
                if (template.details[i].level === 1) {
                  //----- create array of frame points with corner = true
                  var corners = template.details[i].pointsOut.filter(function (item) {
                    return item.corner > 0;
                  });
                  var cornerMarks = mainGroup.selectAll('circle.corner_mark.' + template.details[i].id).data(corners).enter().append('circle').attr({
                      'blockId': template.details[i].id,
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
            if (scope.typeConstruction === 'edit') {
              DesignServ.initAllImposts();
            }

            console.log('buildSVG done!!!!!!!!!', new Date(), new Date().getMilliseconds());
          }
        }


      }
    }

  }
})();
