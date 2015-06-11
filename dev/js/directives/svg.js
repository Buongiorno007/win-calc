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
          buildSVG(scope.template, scope.templateWidth, scope.templateHeight);
        });


        function buildSVG(template, widthSVG, heightSVG) {

          var mainSVG, mainGroup;

          d3.select('#tamlateSVG').remove();

          mainSVG = d3.select('#mainSVG').append('svg').attr({
            'width': widthSVG,
            'height': heightSVG,
            'id': 'tamlateSVG'
          });

          mainGroup = mainSVG.append("g").attr({
            'id': 'main_group',
            'transform': 'translate(200, 20) scale(0.22)'
          });

//          console.log('++++++ template +++++++', mainGroup);
          //========
          var blocksQty = template.details.skylights.length,
              i = 0;

          for (; i < blocksQty; i++) {
            if (template.details.skylights[i].level > 0) {

              var blockItem = mainGroup.selectAll('path')
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
                var openSashMarks = mainGroup.selectAll('path.sash_mark')
                  .data(template.details.skylights[i].sashOpenDir).enter()
                  .append('path')
                  .classed('sash_mark', true)
                  .attr('d', function(d){return d.path;});
              }



              if (template.details.skylights[i].level === 1) {
                //----- create array of frame points with corner = true
                var corners = template.details.skylights[i].pointsOut.filter(function (item) {
                  return item.corner > 0;
                });
                var cornerMarks = mainGroup.selectAll('circle.corner_mark')
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

        }


      }
    }

  }
})();