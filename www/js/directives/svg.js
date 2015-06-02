
// directives/svg.js

(function(){
  'use strict';
    /**
     * @ngInject
     */
  angular
    .module('BauVoiceApp')
    .directive('svgTemplate', svgTemplateDir);

  function svgTemplateDir(GlobalStor, ProductStor, DesignServ) {

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
          console.log('watch!!!!');
          buildSVG(scope.template, scope.templateWidth, scope.templateHeight);
        });


        function buildSVG(template, widthSVG, heightSVG) {

          var mainSVG, mainGroup;

          mainSVG = d3.select('#mainSVG').append('svg').attr({
            'width': widthSVG,
            'height': heightSVG,
            'id': 'tamlateSVG'
          });

          mainGroup = mainSVG.append("g").attr({
            'id': 'main_group',
            'transform': 'translate(200, 20) scale(0.22)'
          });

          console.log('++++++ template +++++++', template.details);
          //========
          var blocksQty = template.details.skylights.length,
              i = 0;

          for (; i < blocksQty; i++) {
            if (template.details.skylights[i].level > 0) {

              var blockItem = mainGroup.selectAll('path.block_item')
                .data(template.details.skylights[i].parts).enter()
                .append('path')
                .attr({
                  'blockId': template.details.skylights[i].id,
                  //'class': function(d) { return d.type; },
                  'class': function (d) {
                    return (d.type === 'glass') ? 'glass' : 'frame'
                  },
                  'd': function (d) {
                    return d.path;
                  }
                });

              if (template.details.skylights[i].level === 1) {
                //----- create array of frame points with corner = true
                var corners = template.details.skylights[i].pointsOut.filter(function (item) {
                  return item.corner > 0;
                });

                var cornerMarks = mainGroup.selectAll('circle.corner_mark')
                  .data(corners).enter()
                  .append('circle')
                  .attr({
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
                  }).on('click', function (d) {
                    //----- hide this cornerMark
                    d3.select(this)
                      .transition()
                      .duration(300)
                      .ease("linear")
                      .attr('r', 0)
                      .call(function () {
                        //------ create Corner Points
                        mainGroup.transition()
                          .duration(300)
                          .ease('linear')
                          .attr({
//                            'transform': 'translate(500, 250) scale(0)'
                            'transform': 'translate(200, 20) scale(0.22)'
                          });
                        DesignServ.setCornerPoints(d);
                      });
                  });
              }

            }
          }

        }


      }
    }

  }
})();
