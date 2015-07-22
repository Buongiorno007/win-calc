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
          var mainSVG, mainGroup, dimGroup, padding = 1, points, dimMaxMin, scale, position, blocksQty;
          if(template && !$.isEmptyObject(template)) {

            d3.select('#tamlateSVG').remove();

            var lineCreator = d3.svg.line()
              .x(function(d) { return d.x; })
              .y(function(d) { return d.y; })
              .interpolate("linear");

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
            dimGroup = mainGroup.append("g").attr({
              'id': 'dim_group'
            });

            //          console.log('++++++ template +++++++', mainGroup);
            //========
            blocksQty = template.details.length;

            for (var i = 0; i < blocksQty; i++) {
              if (template.details[i].level) {
                mainGroup.selectAll('path.' + template.details[i].id)
                  .data(template.details[i].parts)
                  .enter().append('path')
                  .attr({
                    'blockId': template.details[i].id,
                    'parentId': template.details[i].parent,
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
                  var openSashMarks = mainGroup.selectAll('path.sash_mark.' + template.details[i].id)
                    .data(template.details[i].sashOpenDir)
                    .enter().append('path')
                    .classed('sash_mark', true)
                    .attr('d', function (d) {
                      return lineCreator(d.points);
                    });
                }


                //---- corner markers
                if (template.details[i].level === 1) {
                  //----- create array of frame points with corner = true
                  var corners = template.details[i].pointsOut.filter(function (item) {
                    return item.corner > 0;
                  });
                  var cornerMarks = mainGroup.selectAll('circle.corner_mark.' + template.details[i].id)
                    .data(corners)
                    .enter().append('circle')
                    .attr({
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

            //--------- dimension
            var defs = dimGroup.append("defs"),
                dimXQty = template.dimension.dimX.length,
                dimYQty = template.dimension.dimY.length;

            //----- horizontal marker arrow
            setMarkerArrow(defs, 'dimHorL', '-5, -5, 4, 5', -5, -2, 0, 'M 0,0 L -4,-2 L0,-4 z');
            setMarkerArrow(defs, 'dimHorR', '-5, -5, 4, 5', -5, -2, 180, 'M 0,0 L -4,-2 L0,-4 z');
            //------- vertical marker arrow
            setMarkerArrow(defs, 'dimVertL', '1, -1, 4, 5', 5, 2, 90, 'M 0,0 L 4,2 L0,4 z');
            setMarkerArrow(defs, 'dimVertR', '1, -1, 4, 5', 5, 2, 270, 'M 0,0 L 4,2 L0,4 z');

            console.log('SVG=========dimX==', template.dimension.dimX);
            console.log('SVG=========dimY==', template.dimension.dimY);
            for(var dx = 0; dx < dimXQty; dx++) {
              createDimension(0, template.dimension.dimX[dx], dimGroup, lineCreator);
            }
            for(var dy = 0; dy < dimYQty; dy++) {
              createDimension(1, template.dimension.dimY[dy], dimGroup, lineCreator);
            }



            //--------- set clicking to all imposts
            if (scope.typeConstruction === 'edit') {
              DesignServ.initAllImposts();
              DesignServ.initAllGlassXDimension();
              DesignServ.initAllDimension();
            }

            console.log('buildSVG done!!!!!!!!!', new Date(), new Date().getMilliseconds());
          }
        }




        function setMarkerArrow(defs, id, view, refX, refY, angel, path) {
          defs.append("marker")
            .classed('size-line', true)
            .attr({
              'id': id,
              'viewBox': view,
              'refX': refX,
              'refY': refY,
              'markerWidth': 30,
              'markerHeight': 30,
              'orient': angel
            })
            .append("path")
            .attr("d", path);
        }




        function createDimension(dir, dim, dimGroup, lineCreator) {
         var dimLineHeight = -150,
             dimEdger = 50,
             dimMarginBottom = -20,
             sizeBoxWidth = 160,
             sizeBoxHeight = 70,
             sizeBoxRadius = 20,

             lineSideL = [],
             lineSideR = [],
             lineCenter = [],
             dimBlock, sizeBox,
             pointL1 = {
                x: (dir) ? dimMarginBottom : dim.from,
                y: (dir) ? dim.from : dimMarginBottom
              },
              pointL2 = {
                x: (dir) ? dimLineHeight : dim.from,
                y: (dir) ? dim.from : dimLineHeight
              },
              pointR1 = {
                x: (dir) ? dimMarginBottom : dim.to,
                y: (dir) ? dim.to : dimMarginBottom
              },
              pointR2 = {
                x: (dir) ? dimLineHeight : dim.to,
                y: (dir) ? dim.to : dimLineHeight
              },
              pointC1 = {
                x: (dir) ? dimLineHeight + dimEdger : dim.from,
                y: (dir) ? dim.from : dimLineHeight + dimEdger
              },
              pointC2 = {
                x: (dir) ? dimLineHeight + dimEdger : dim.to,
                y: (dir) ? dim.to : dimLineHeight + dimEdger
              };

         lineSideL.push(pointL1);
         lineSideL.push(pointL2);
         lineSideR.push(pointR1);
         lineSideR.push(pointR2);
         lineCenter.push(pointC1);
         lineCenter.push(pointC2);

         dimBlock = dimGroup.append('g')
           .attr({
             'class': function() {
               if(dir) {
                 return (dim.level) ? 'dim_blockY' : 'dim_block dim_hidden';
               } else {
                 return (dim.level) ? 'dim_blockX' : 'dim_block dim_hidden';
               }
             },
             'block_id': dim.blockId
           });

         dimBlock.append('path')
           .classed('size-line', true)
           .attr('d', lineCreator(lineSideR));
         dimBlock.append('path')
           .classed('size-line', true)
           .attr('d', lineCreator(lineSideL));

         dimBlock.append('path')
           .classed('size-line', true)
           .attr({
             'd': lineCreator(lineCenter),
             'marker-start': function() { return (dir) ? 'url(#dimVertR)' : 'url(#dimHorL)' },
             'marker-end': function() { return (dir) ? 'url(#dimVertL)' : 'url(#dimHorR)' }
           });

          sizeBox = dimBlock.append('g')
           .classed('size-box', true);

         if(scope.typeConstruction === 'edit') {
           sizeBox.append('rect')
             .classed('size-rect', true)
             .attr({
               'width': sizeBoxWidth,
               'height': sizeBoxHeight,
               'x': function() { return (dir) ? (dimLineHeight - sizeBoxWidth*0.8) : (dim.from + dim.to - sizeBoxWidth)/2 },
               'y': function() { return (dir) ? (dim.from + dim.to - sizeBoxHeight)/2 : (dimLineHeight - sizeBoxHeight*0.8) },
               'rx': sizeBoxRadius,
               'ry': sizeBoxRadius
             });
         }


          sizeBox.append('text')
           .text(dim.text)
           .attr({
             'class': function() { return (scope.typeConstruction === 'edit') ? 'size-txt-edit' : 'size-txt'; },
             'x': function() { return (dir) ? (dimLineHeight - sizeBoxWidth*0.8) : (dim.from + dim.to - sizeBoxWidth)/2; },
             'y': function() { return (dir) ? (dim.from + dim.to - sizeBoxHeight)/2 : (dimLineHeight - sizeBoxHeight*0.8); },
             'dx': 80,
             'dy': 40,
             'block_id': dim.blockId,
             'from-point': dim.from,
             'to-point': dim.to,
             'size-val': dim.text,
             'min-val': dim.minLimit,
             'max-val': dim.maxLimit
           });

        }



      }
    }

  }
})();