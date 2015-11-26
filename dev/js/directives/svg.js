(function(){
  'use strict';
    /**
     * @ngInject
     */
  angular
    .module('BauVoiceApp')
    .directive('svgTemplate', svgTemplateDir);

  function svgTemplateDir(GeneralServ, SVGServ, DesignServ) {

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
      link: function (scope, elem, attrs) {

        scope.$watch('template', function () {
          buildSVG(scope.template, scope.templateWidth, scope.templateHeight);
        });



        function buildSVG(template, widthSVG, heightSVG) {
          if(template && !$.isEmptyObject(template)) {
            var container = document.createElement('div'),
                lineCreator = d3.svg.line()
                  .x(function(d) { return d.x; })
                  .y(function(d) { return d.y; })
                  .interpolate("linear"),
                padding = 0.7,
                position = {x: 0, y: 0},
                mainSVG, mainGroup, elementsGroup, dimGroup, points, dimMaxMin, scale, blocksQty;

            if(scope.typeConstruction === 'icon'){
              padding = 1;
            } else if(scope.typeConstruction === 'edit') {
              padding = 0.63;
            }

            mainSVG = d3.select(container).append('svg').attr({
              'width': widthSVG,
              'height': heightSVG
            });

            if(scope.typeConstruction === 'icon') {
              mainSVG.attr('class', 'tamlateIconSVG');
            } else {
              mainSVG.attr('id', 'tamlateSVG');
            }

            points = SVGServ.collectAllPointsOut(template.details);
            dimMaxMin = GeneralServ.getMaxMinCoord(points);
            scale = SVGServ.setTemplateScale(dimMaxMin, widthSVG, heightSVG, padding);
            if(scope.typeConstruction !== 'icon') {
              position = SVGServ.setTemplatePosition(dimMaxMin, widthSVG, heightSVG, scale);
            }

            mainGroup = mainSVG.append("g").attr({
              'id': 'main_group',
              'transform': 'translate(' + position.x + ', ' + position.y + ') scale('+ scale +','+ scale +')'
            });

            if (scope.typeConstruction === 'edit') {
              mainSVG.call(d3.behavior.zoom()
                .translate([position.x, position.y])
                .scale(scale)
                .scaleExtent([0, 8])
                .on("zoom", zooming));
            }

            elementsGroup = mainGroup.append("g").attr({
              'id': 'elem_group'
            });
            dimGroup = mainGroup.append("g").attr({
              'id': 'dim_group'
            });


            //          console.log('++++++ template +++++++', mainGroup);
            blocksQty = template.details.length;
            for (var i = 1; i < blocksQty; i++) {

              elementsGroup.selectAll('path.' + template.details[i].id)
                .data(template.details[i].parts)
                .enter().append('path')
                .attr({
                  'block_id': template.details[i].id,
                  'parent_id': template.details[i].parent,
                  //'class': function(d) { return d.type; },
                  'class': function (d) {
                    if(scope.typeConstruction === 'icon') {
                      return (d.type === 'glass') ? 'glass-icon' : 'frame-icon';
                    } else {
                      return (d.type === 'glass') ? 'glass' : 'frame';
                    }
                  },
                  'item_type': function (d) {
                    return d.type;
                  },
                  'item_dir': function (d) {
                    return d.dir;
                  },
                  'item_id': function(d) {
                    return d.points[0].id;
                  },
                  'd': function (d) {
                    return d.path;
                  }
                });


              if(scope.typeConstruction !== 'icon') {
                //----- sash open direction
                if (template.details[i].sashOpenDir) {
                  elementsGroup.selectAll('path.sash_mark.' + template.details[i].id)
                    .data(template.details[i].sashOpenDir)
                    .enter()
                    .append('path')
                    .classed('sash_mark', true)
                    .attr({
                      'd': function (d) {
                            return lineCreator(d.points);
                          },
                      'marker-mid': function(d) {
                        var dirQty = template.details[i].sashOpenDir.length;
                        if(dirQty === 1) {
                          if(d.points[1].fi < 45 || d.points[1].fi > 315) {
                            return 'url(#handleR)';
                          } else if (d.points[1].fi > 45 && d.points[1].fi < 135) {
                            return 'url(#handleU)';
                          } else if(d.points[1].fi > 135 && d.points[1].fi < 225) {
                            return 'url(#handleL)';
                          } else if (d.points[1].fi > 225 && d.points[1].fi < 315) {
                            return 'url(#handleD)';
                          }
                        } else if(dirQty === 2) {
                          if(d.points[1].fi < 45 || d.points[1].fi > 315) {
                            return 'url(#handleR)';
                          } else if(d.points[1].fi > 135 && d.points[1].fi < 225) {
                            return 'url(#handleL)';
                          }
                        }
                      }
                    });
                }


                //---- corner markers
                if(scope.typeConstruction === 'edit') {
                  if (template.details[i].level === 1) {
                    //----- create array of frame points with corner = true
                    var corners = template.details[i].pointsOut.filter(function (item) {
                      return item.corner > 0;
                    });
                    elementsGroup.selectAll('circle.corner_mark.' + template.details[i].id)
                      .data(corners)
                      .enter()
                      .append('circle')
                      .attr({
                        'block_id': template.details[i].id,
                        'class': 'corner_mark',
                        'parent_id': function (d) {
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

                /** type Glass names */
                if (scope.typeConstruction === 'setGlass') {
                  if(!template.details[i].children.length) {
                    elementsGroup.append('text')
                      .text(template.details[i].glassTxt)
                      .attr({
                        'class': 'glass-txt',
                        'x': template.details[i].center.x,
                        'y': template.details[i].center.y
                      });
                  }
                }
              }

            }

            if(scope.typeConstruction !== 'icon') {
              //--------- dimension
              var defs = dimGroup.append("defs"),
                  dimXQty = template.dimension.dimX.length,
                  dimYQty = template.dimension.dimY.length,
                  dimQQty = template.dimension.dimQ.length,
                  pathHandle = "M4.5,0C2.015,0,0,2.015,0,4.5v6c0,1.56,0.795,2.933,2,3.74V7.5C2,6.119,3.119,5,4.5,5S7,6.119,7,7.5v6.74c1.205-0.807,2-2.18,2-3.74v-6C9,2.015,6.985,0,4.5,0z"+
  "M7,26.5C7,27.881,5.881,29,4.5,29l0,0C3.119,29,2,27.881,2,26.5v-19C2,6.119,3.119,5,4.5,5l0,0C5.881,5,7,6.119,7,7.5V26.5z";

              //----- horizontal marker arrow
              setMarker(defs, 'dimHorL', '-5, -5, 1, 8', -5, -2, 0, 50, 50, 'M 0,0 L -4,-2 L0,-4 z', 'size-line');
              setMarker(defs, 'dimHorR', '-5, -5, 1, 8', -5, -2, 180, 50, 50, 'M 0,0 L -4,-2 L0,-4 z', 'size-line');
              //------- vertical marker arrow
              setMarker(defs, 'dimVertL', '4.2, -1, 8, 9', 5, 2, 90, 100, 60, 'M 0,0 L 4,2 L0,4 z', 'size-line');
              setMarker(defs, 'dimVertR', '4.2, -1, 8, 9', 5, 2, 270, 100, 60, 'M 0,0 L 4,2 L0,4 z', 'size-line');

              setMarker(defs, 'dimArrow', '4.2, -1, 8, 9', 5, 2, 'auto', 100, 60, 'M 0,0 L 4,2 L0,4 z', 'size-line');

              //------- marker handle
              setMarker(defs, 'handleR', '0 -1 9 32', 4, 23, 90, 29, 49, pathHandle, 'handle-mark');
              setMarker(defs, 'handleL', '0 -1 9 32', 5, 23, 270, 29, 49, pathHandle, 'handle-mark');
              setMarker(defs, 'handleU', '0 -1 9 32', -10, 10, 270, 29, 49, pathHandle, 'handle-mark');
              setMarker(defs, 'handleD', '0 -1 9 32', 20, 10, 270, 29, 49, pathHandle, 'handle-mark');

              //            console.log('SVG=========dim==', template.dimension);
              for (var dx = 0; dx < dimXQty; dx++) {
                createDimension(0, template.dimension.dimX[dx], dimGroup, lineCreator);
              }
              for (var dy = 0; dy < dimYQty; dy++) {
                createDimension(1, template.dimension.dimY[dy], dimGroup, lineCreator);
              }
              for (var dq = 0; dq < dimQQty; dq++) {
                createRadiusDimension(template.dimension.dimQ[dq], dimGroup, lineCreator);
              }

            }
            elem.html(container);

            //======= set Events on elements
            DesignServ.removeAllEventsInSVG();
            //--------- set clicking to all elements
            if (scope.typeConstruction === 'edit') {
              DesignServ.initAllImposts();
              DesignServ.initAllGlass();
              DesignServ.initAllArcs();
              DesignServ.initAllDimension();
            }
          }
        }


        function zooming() {
          d3.select('#main_group').attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        }


        function setMarker(defs, id, view, refX, refY, angel, w, h, path, classMarker) {
          defs.append("marker")
            .classed(classMarker, true)
            .attr({
              'id': id,
              'viewBox': view,
              'refX': refX,
              'refY': refY,
              'markerWidth': w,
              'markerHeight': h,
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
          lineSideL.push(pointL1, pointL2);
          lineSideR.push(pointR1, pointR2);
          lineCenter.push(pointC1, pointC2);

          dimBlock = dimGroup.append('g')
           .attr({
             'class': function() {
               if(dir) {
                 return (dim.level) ? 'dim_blockY' : 'dim_block dim_hidden';
               } else {
                 return (dim.level) ? 'dim_blockX' : 'dim_block dim_hidden';
               }
             },
             'block_id': dim.blockId,
             'axis': dim.axis
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
             'marker-start': function() { return (dir) ? 'url(#dimVertR)' : 'url(#dimHorL)'; },
             'marker-end': function() { return (dir) ? 'url(#dimVertL)' : 'url(#dimHorR)'; }
           });

          sizeBox = dimBlock.append('g')
           .classed('size-box', true);

          if(scope.typeConstruction === 'edit') {
            sizeBox.append('rect')
             .classed('size-rect', true)
             .attr({
               'x': function() { return (dir) ? (dimLineHeight - sizeBoxWidth*0.8) : (dim.from + dim.to - sizeBoxWidth)/2; },
               'y': function() { return (dir) ? (dim.from + dim.to - sizeBoxHeight)/2 : (dimLineHeight - sizeBoxHeight*0.8); },
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
             'type': 'line',
             'block_id': dim.blockId,
             'size_val': dim.text,
             'min_val': dim.minLimit,
             'max_val': dim.maxLimit,
             'dim_id': dim.dimId,
             'from_point': dim.from,
             'to_point': dim.to,
             'axis': dim.axis
           });

        }


        function createRadiusDimension(dimQ, dimGroup, lineCreator) {

          var radiusLine = [],
              sizeBoxRadius = 20,
              startPR = {
                x: dimQ.startX,
                y: dimQ.startY
              },
              endPR = {
                x: dimQ.midleX,
                y: dimQ.midleY
              },
              dimBlock, sizeBox;

          radiusLine.push(endPR, startPR);

          dimBlock = dimGroup.append('g')
            .attr({
              'class': 'dim_block_radius',
              'block_id': dimQ.blockId
            });

          dimBlock.append('path')
            .classed('size-line', true)
            .attr({
              'd': lineCreator(radiusLine),
              'style': 'stroke: #000;',
              'marker-end': 'url(#dimArrow)'
            });

          sizeBox = dimBlock.append('g')
            .classed('size-box', true);

          if(scope.typeConstruction === 'edit') {
            sizeBox.append('rect')
              .classed('size-rect', true)
              .attr({
                'x': dimQ.midleX,
                'y': dimQ.midleY,
                'rx': sizeBoxRadius,
                'ry': sizeBoxRadius
              });
          }


          sizeBox.append('text')
            .text(dimQ.radius)
            .attr({
              'class': 'size-txt-edit',
              'x': dimQ.midleX,
              'y': dimQ.midleY,
              'dx': 80,
              'dy': 40,
              'type': 'curve',
              'block_id': dimQ.blockId,
              'size_val': dimQ.radius,
              'min_val': dimQ.radiusMax,
              'max_val': dimQ.radiusMin,
              'dim_id': dimQ.id,
              'chord': dimQ.lengthChord
            });

        }

      }
    };

  }
})();