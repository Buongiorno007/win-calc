/* globals d3 */
(function(){
  'use strict';
    /**@ngInject*/
  angular
    .module('BauVoiceApp')
    .directive('svgTemplate',

  function(
    $location,
    globalConstants,
    GeneralServ,
    ProductStor,
    SVGServ,
    DesignServ,
    PointsServ,
    GlobalStor
  ) {

    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      scope: {
        typeConstruction: '=',
        template: '=',
        templateWidth: '=',
        templateHeight: '='
      },
      link: function (scope, elem) {
        /**============ METHODS ================*/
 
        function zooming() {
          d3.select('#main_group')
            .attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
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
        function setSashFittings(param, data, block) {
          var dirQty = block.sashOpenDir.length,
              handle;
          if(block.handlePos) {
            if (dirQty === 1) {
              if (block.handlePos === 2) {
                handle = param ? 'url(#handleR)' : 'url(#hingeL)';
              } else if (block.handlePos === 1) {
                handle = param ? 'url(#handleU)' : 'url(#hingeD)';
              } else if (block.handlePos === 4) {
                handle = param ? 'url(#handleL)' : 'url(#hingeR)';
              } else if (block.handlePos === 3) {
                handle = param ? 'url(#handleD)' : 'url(#hingeU)';
              }
            } else if (dirQty === 2) {
              if (data.points[1].fi < 45 || data.points[1].fi > 315) {
                handle = param ? 'url(#handleR)' : 'url(#hingeL)';
              } else if (data.points[1].fi > 135 && data.points[1].fi < 225) {
                handle = param ? 'url(#handleL)' : 'url(#hingeR)';
              }
            }
            return handle;
          }
        }
        function createDimension(dir, dim, dimGroup, lineCreator) {
          if(scope.typeConstruction !== globalConstants.SVG_ID_MAIN) {
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
                x: dir ? dimMarginBottom : dim.from,
                y: dir ? dim.from : dimMarginBottom
              },
              pointL2 = {
                x: dir ? dimLineHeight : dim.from,
                y: dir ? dim.from : dimLineHeight
              },
              pointR1 = {
                x: dir ? dimMarginBottom : dim.to,
                y: dir ? dim.to : dimMarginBottom
              },
              pointR2 = {
                x: dir ? dimLineHeight : dim.to,
                y: dir ? dim.to : dimLineHeight
              },
              pointC1 = {
                x: dir ? dimLineHeight + dimEdger : dim.from,
                y: dir ? dim.from : dimLineHeight + dimEdger
              },
              pointC2 = {
                x: dir ? dimLineHeight + dimEdger : dim.to,
                y: dir ? dim.to : dimLineHeight + dimEdger
              };
          lineSideL.push(pointL1, pointL2);
          lineSideR.push(pointR1, pointR2);
          lineCenter.push(pointC1, pointC2);

          dimBlock = dimGroup.append('g')
            .attr({
              'class': function() {
                var className;
                if(scope.typeConstruction === globalConstants.SVG_ID_ICON) {
                  if(dir) {
                    className = (dim.level) ? 'dim_blockY dim_shiftY' : 'dim_block';
                  } else {
                    className = (dim.level) ? 'dim_blockX dim_shiftX' : 'dim_block';
                  }
                } else {
                  if(dir) {
                    className = (dim.level) ? 'dim_blockY' : 'dim_block dim_hidden';
                  } else {
                    className = (dim.level) ? 'dim_blockX' : 'dim_block dim_hidden';
                  }
                }
                return className;
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
              'marker-start': function() { return dir ? 'url(#dimVertR)' : 'url(#dimHorL)'; },
              'marker-end': function() { return dir ? 'url(#dimVertL)' : 'url(#dimHorR)'; }
            });

          sizeBox = dimBlock.append('g')
            .classed('size-box', true);

          if(scope.typeConstruction === 'tamlateSVG') {
            sizeBox.append('rect')
              .classed('size-rect', true)
              .attr({
                'x': function() {
                  return dir ? (dimLineHeight - sizeBoxWidth*0.8) : (dim.from + dim.to - sizeBoxWidth)/2;
                },
                'y': function() {
                  return dir ? (dim.from + dim.to - sizeBoxHeight)/2 : (dimLineHeight - sizeBoxHeight*0.8);
                },
                'rx': sizeBoxRadius,
                'ry': sizeBoxRadius
              });
          }


          sizeBox.append('text')
            .text(dim.text)
            .attr({
              'class': function() {
                return (scope.typeConstruction === globalConstants.SVG_ID_EDIT) ? 'size-txt-edit' : 'size-txt';
              },
              'x': function() {
                return dir ? (dimLineHeight - sizeBoxWidth*0.8) : (dim.from + dim.to - sizeBoxWidth)/2;
              },
              'y': function() {
                return dir ? (dim.from + dim.to - sizeBoxHeight)/2 : (dimLineHeight - sizeBoxHeight*0.8);
              },
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
              'axis': dim.axis,
              'level': dim.level
            });
          }
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

          if(scope.typeConstruction === globalConstants.SVG_ID_EDIT) {
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
        function backgroundSVG(heightT, widthT) {
          if(scope.typeConstruction === globalConstants.SVG_ID_MAIN) {
            GlobalStor.global.heightCheck = heightT;
            GlobalStor.global.widthCheck = widthT;
            GlobalStor.global.background = heightT/1680;
            if (ProductStor.product.construction_type === 1 || ProductStor.product.construction_type === 3) {
               GlobalStor.global.imgLink = "fon.png";              
            } else {
               GlobalStor.global.imgLink = "333.png";
            }
          }
        }
        function elementsRoom(heightT, widthT) {
          if(scope.typeConstruction === globalConstants.SVG_ID_MAIN) {
            var sunH = (((0.18*heightT)-252)+520),  /*height sun rays*/
                hD = 755;                           /*height display*/
            if(ProductStor.product.construction_type === 1) {
              var sunW = (((0.18*widthT)-234)+520), /*width sun rays*/
                  hsrof = 90,                       /*the height of the sun's rays on the floor*/
                  upLim = 720;                      /*upper limit 15 block*/
                  
              if (heightT < 1648) {
                var upl = 456,                      /*upper limit for window sill */
                    dnl = 100;                      /*upper limit for window sill */
              }
              if (1648 < heightT && heightT < 1848) {
                var upl = 526,
                    dnl = 60;
              }
              if (1848 <= heightT && heightT < 2148) {
                var upl = 576,
                    dnl = 0;
              }
              if (2148 <= heightT) {
                var upl = 637,
                    dnl = -30;
              }

              if (widthT > 900 && heightT < 1648) {
                $('.elem5').css('left' , (109+(0.48*((widthT/2)-700*0.32))/2) + 'px');
              } else {
                $('.elem5').css('left' , 5000 + 'px');
              }

              $('.elem15').css({
                'width' : ((0.48*(widthT/2))+30) + 'px',
                'height' : hsrof + 'px',
                'top' : upLim + 'px'
              });
              $('.elem11').css('left' , 5000 + 'px');
              $('.elem16').css('left' , 9 + 'px');
              $('.elem8').css('left' , 5000 + 'px');
              $('.elem7').css('opacity' , 0);
              $('.elem9').css('opacity' , 1);
              $('.elem23').css('left' , 5000 + 'px');
              $('.elem10').css('opacity' , 0);
              $('.elem17').css({
                'width' : (0.4*((widthT/2)*2+350)) + 'px',
                'height' : 41 + 'px',
                'left' : 215 + 'px',
                'top' : upl + 'px'
              });
              $('.elem18').css({
                  'width' : sunW + 'px',
                  'height' : sunH + 'px',
                  'left' : 3 + 'px',
                  'top' : (hD - sunH-dnl) + 'px'
              });
              $('.elem19').css({
                  'width' : sunW + 'px',
                  'height' : sunH + 'px',
                  'left' : 3 + 'px',
                  'top' : (hD - sunH-dnl) + 'px'
              });
              $('.elem20').css({
                  'width' : sunW + 'px',
                  'height' : sunH + 'px',
                  'left' : 3 + 'px',
                  'top' : (hD - sunH-dnl) + 'px'
              });
              $('.elem21').css({
                  'width' : sunW + 'px',
                  'height' : sunH + 'px',
                  'left' : 3 + 'px',
                  'top' : (hD - sunH-dnl) + 'px'
              });
            }

              if(ProductStor.product.construction_type === 4 || ProductStor.product.construction_type === 2) {
                var sunW = (((0.18*widthT)-234)+420);
                $('.elem23').css({
                  'width' : (1000*0.5+(0.7*(widthT-700))) + 'px',
                  'top' : 665 + 'px',
                  'left' : 100 -(2.5*(0.1*widthT-70)) + 'px'
                });
                $('.elem15').css({
                  'top': 5000 + 'px'
                });
                $('.elem17').css({
                  'width' : 0 + 'px',
                  'height' : 0 + 'px',
                  'left' : 0 + 'px'
                });
                $('.elem18').css({
                    'width' : sunW + 'px',
                    'height' : sunH + 'px',
                    'left' : 130 + 'px',
                    'top' : (hD - sunH + 30) + 'px'
                });
                $('.elem19').css({
                    'width' : sunW + 'px',
                    'height' : sunH + 'px',
                    'left' : 130 + 'px',
                    'top' : (hD - sunH + 30) + 'px'
                });
                $('.elem20').css({
                    'width' : sunW + 'px',
                    'height' : sunH + 'px',
                    'left' : 130 + 'px',
                    'top' : (hD - sunH + 30) + 'px'
                });
                $('.elem21').css({
                    'width' : sunW + 'px',
                    'height' : sunH + 'px',
                    'left' : 130 + 'px',
                    'top' : (hD - sunH + 50) + 'px'
                });

                $('.elem11').css('left' , (0.23*(0.991*widthT)+280) + 'px');
                $('.elem8').css('left' , (0.23*widthT+275) + 'px');
                $('.elem5').css('left' , 5000 + 'px');
                $('.elem10').css('opacity' , 1);
                $('.elem7').css('opacity' , 1);
                $('.elem16').css('left' , 5000 + 'px');
                $('.elem9').css('opacity' , 0);
              }
            }
        }
        function buildSVG(template, widthSVG, heightSVG) {
          if(template && !$.isEmptyObject(template)) {
            var container = document.createElement('div'),
                lineCreator = d3.svg.line()
                  .x(function(d) { return d.x; })
                  .y(function(d) { return d.y; })
                  .interpolate("linear"),
                padding = 0.7,
                position = {x: 0, y: 0},
                mainSVG, mainGroup, elementsGroup, dimGroup,
                points, dimMaxMin, scale, blocksQty, i, corners,
                pnt = PointsServ.templatePoints(template);
            if(scope.typeConstruction === globalConstants.SVG_CLASS_ICON){
              padding = 1;
            } else if(scope.typeConstruction === globalConstants.SVG_ID_EDIT) {
              padding = 0.6;
            } else if(scope.typeConstruction === globalConstants.SVG_ID_MAIN){
              padding = 0.6;
            }

            mainSVG = d3.select(container).append('svg').attr({
              'width': widthSVG,
              'height': heightSVG
            });

            if(scope.typeConstruction === globalConstants.SVG_CLASS_ICON) {
              mainSVG.attr('class', scope.typeConstruction);
            } else {
              mainSVG.attr('id', scope.typeConstruction);
            }

            points = SVGServ.collectAllPointsOut(template.details);
            dimMaxMin = GeneralServ.getMaxMinCoord(points);

            if(scope.typeConstruction === globalConstants.SVG_ID_MAIN) {
              scale = SVGServ.setTemplateScaleMAIN(padding);
            } else {
              scale = SVGServ.setTemplateScale(dimMaxMin, widthSVG, heightSVG, padding);
            }

            if(scope.typeConstruction !== globalConstants.SVG_CLASS_ICON) {
              if (scope.typeConstruction === globalConstants.SVG_ID_MAIN) {
                position = SVGServ.setTemplatePositionMAIN(dimMaxMin, heightSVG, scale);
              } else {
                position = SVGServ.setTemplatePosition(dimMaxMin, widthSVG, heightSVG, scale);
              }
            }

            mainGroup = mainSVG.append("g").attr({
              'id': 'main_group',
              'transform': 'translate(' + position.x + ', ' + position.y + ') scale('+ scale +','+ scale +')'
            });

            if (scope.typeConstruction === globalConstants.SVG_ID_EDIT) {
              mainSVG.call(d3.behavior.zoom()
                .translate([position.x, position.y])
                .scale(scale)
                .scaleExtent([0, 8])
                .on("zoom", zooming));
            }

            /** Defs */
            if(scope.typeConstruction !== globalConstants.SVG_CLASS_ICON) {
              var defs = mainGroup.append("defs"),
                  pathHandle = "M4.5,0C2.015,0,0,2.015,0,4.5v6c0,1.56,0.795,2.933,2,3.74V7.5C2,6.119,"+
                    "3.119,5,4.5,5S7,6.119,7,7.5v6.74c1.205-0.807,2-2.18,2-3.74v-6C9,2.015,6.985,0,4.5,0z"+
                    "M7,26.5C7,27.881,5.881,29,4.5,29l0,0C3.119,29,2,27.881,2,26.5v-19C2,"+
                    "6.119,3.119,5,4.5,5l0,0C5.881,5,7,6.119,7,7.5V26.5z",
                pathHinge = "M0,0L5,0L5,15L0,15z";
              /** dimension */
              //----- horizontal marker arrow
              setMarker(defs, 'dimHorL', '-5, -5, 1, 8', -5, -2, 0, 50, 50, 'M 0,0 L -4,-2 L0,-4 z', 'size-line');
              setMarker(defs, 'dimHorR', '-5, -5, 1, 8', -5, -2, 180, 50, 50, 'M 0,0 L -4,-2 L0,-4 z', 'size-line');
              //------- vertical marker arrow
              setMarker(defs, 'dimVertL', '4.2, -1, 8, 9', 5, 2, 90, 100, 60, 'M 0,0 L 4,2 L0,4 z', 'size-line');
              setMarker(defs, 'dimVertR', '4.2, -1, 8, 9', 5, 2, 270, 100, 60, 'M 0,0 L 4,2 L0,4 z', 'size-line');

              setMarker(defs, 'dimArrow', '4.2, -1, 8, 9', 5, 2, 'auto', 100, 60, 'M 0,0 L 4,2 L0,4 z', 'size-line');

              /** handle */
              setMarker(defs, 'handleR', '0 -1 9 32', -5, 5, 0, 29, 80, pathHandle, 'handle-mark');
              setMarker(defs, 'handleL', '0 -1 9 32', 14, 5, 0, 29, 80, pathHandle, 'handle-mark');
              setMarker(defs, 'handleU', '0 -1 9 32', -5.3, 5, 270, 29, 80, pathHandle, 'handle-mark');
              setMarker(defs, 'handleD', '0 -1 9 32', 14.3, 5, 270, 29, 80, pathHandle, 'handle-mark');

              /** hinge */
              setMarker(defs, 'hingeR', '-1 0 9 4', -17.5, 5, 0, 20, 80, pathHinge, 'hinge-mark');
              setMarker(defs, 'hingeL', '-1 0 9 4', 22.5, 5, 0, 20, 80, pathHinge, 'hinge-mark');
              setMarker(defs, 'hingeU', '-1 0 9 4', -17.3, 5, 270, 20, 80, pathHinge, 'hinge-mark');
              setMarker(defs, 'hingeD', '-1 0 9 4', 22.2, 5, 270, 20, 80, pathHinge, 'hinge-mark');

               /** Points */
              var noVvPath = pnt.noVvPath,
                  widthT = pnt.widthT,
                  heightT = pnt.heightT;

              /** background */
              if (GlobalStor.global.currOpenPage === 'main' && GlobalStor.global.activePanel === 0) {
                console.log('activePanel = 0')
                elementsRoom(heightT, widthT);
                backgroundSVG(heightT, widthT);
              } else if (heightT !== GlobalStor.global.heightCheck || widthT !== GlobalStor.global.widthCheck) {
                  backgroundSVG(heightT, widthT, defs);
                  elementsRoom(heightT, widthT);
              }

              /** lamination */
              if(ProductStor.product.lamination.img_in_id > 1) {
                defs.append('pattern')
                  .attr('id', 'laminat')
                  .attr('patternUnits', 'userSpaceOnUse')
                  .attr('width', 600)
                  .attr('height', 400)
                  .append("image")
                  .attr("xlink:href", "img/lamination/"+ProductStor.product.lamination.img_in_id+".jpg")
                  .attr('width', 600)
                  .attr('height', 400);

                defs.append('pattern')
                  .attr('id', 'laminat1')
                  .attr('patternUnits', 'userSpaceOnUse')
                  .attr('width', 150)
                  .attr('height', 100)
                  .append("image")
                  .attr("xlink:href", "img/lamination/"+ProductStor.product.lamination.img_in_id+".jpg")
                  .attr('width', 150)
                  .attr('height', 100);
              }
                defs.append('pattern')
                .attr('id', 'background')
                .attr('patternUnits', 'userSpaceOnUse')
                .attr('width', 2520*GlobalStor.global.background)
                .attr('height', 1680*GlobalStor.global.background)
                .append("image")
                .attr("xlink:href", "img/room/"+ GlobalStor.global.imgLink)
                .attr('width', 2520*GlobalStor.global.background)
                .attr('height', 1680*GlobalStor.global.background);
 
            }

          /** soffits */

            if(scope.typeConstruction === globalConstants.SVG_ID_MAIN) {
              console.log('откосы')
              var  scl = scale*4.4;
              if(ProductStor.product.construction_type === 1 || ProductStor.product.construction_type === 3) {
                var positionX1 = position.x-160,
                    positionY1 = 18,
                    positionX2 = position.x-340,
                    positionY2 = -100;
                mainGroup.append('g').append("polygon")
                .attr({
                  'id' : 'clipPolygonWindow1',
                  'fill' : '#FFFAFA',
                  'points' : noVvPath,
                  'transform': 'translate(' + positionX1 + ', ' + positionY1 + ') scale('+ (scl) +','+ (scl) +')'
                });


                mainGroup.append('g').append("polygon")
                .attr({
                  'id' : 'clipPolygonWindow2',
                  'fill' : '#FFFAFA',
                  'points' : noVvPath,
                  'transform': 'translate(' + positionX2 + ', ' + positionY1 + ') scale('+ (scl) +','+ (scl) +')'
                });

                mainGroup.append('g').append("polygon")
                .attr({
                  'id' : 'clipPolygonWindow3',
                  'fill' : '#FFFAFA',
                  'points' : noVvPath,
                  'transform': 'translate(' + positionX1 + ', ' + positionY2 + ') scale('+ (scl) +','+ (scl) +')'
                });

                mainGroup.append('g').append("polygon")
                .attr({
                  'id' : 'clipPolygonWindow4',
                  'fill' : '#FFFAFA',
                  'points' : noVvPath,
                  'transform': 'translate(' + positionX2 + ', ' + positionY2 + ') scale('+ (scl) +','+ (scl) +')'
                });
              } else {
                mainGroup.append('g').append("polygon")
                .attr({
                  'id' : 'clipPolygonDoor3',
                  'fill' : '#FFFAFA',
                  'points' : noVvPath,
                  'transform': 'translate(' + (position.x-215) + ', ' + (-80) + ') scale('+ (scl) +','+ (scl) +')'
                });

                mainGroup.append('g').append("polygon")
                .attr({
                  'id' : 'clipPolygonDoor4',
                  'fill' : '#FFFAFA',
                  'points' : noVvPath,
                  'transform': 'translate(' + (position.x-336) + ', ' + (-80) + ') scale('+ (scl) +','+ (scl) +')'
                });
              }
            }

            elementsGroup = mainGroup.append("g").attr({
              'id': 'elem_group'
            });
            dimGroup = mainGroup.append("g").attr({
              'id': 'dim_group'
            });

            blocksQty = template.details.length;
            for (i = 1; i < blocksQty; i+=1) {
              elementsGroup.selectAll('path.' + template.details[i].id)
                .data(template.details[i].parts)
                .enter().append('path')
                .attr({
                  'block_id': template.details[i].id,
                  'parent_id': template.details[i].parent,
                  //'class': function(d) { return d.type; },
                  'class': function (d) {
                    var className;
                    if(scope.typeConstruction === globalConstants.SVG_CLASS_ICON) {
                      className = (d.type === 'glass') ? 'glass-icon' : 'frame-icon';
                    } else {
                      if(d.doorstep) {
                        className = 'doorstep';
                      } else {
                        className = (d.type === 'glass') ? 'glass' : 'frame';
                      }
                    }
                    return className;
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
                  },
                  'fill': function(d) {
                    var fillName;
                    if (d.type === 'glass') {
                      if (scope.typeConstruction === globalConstants.SVG_ID_MAIN) {
                          fillName = 'url(#background)';
                      } else {
                          fillName = 'rgba(155, 204, 255, 0.20)';
                        }
                      } else {
                        if(ProductStor.product.lamination.img_in_id > 1) {
                            if ((d.type === 'frame') || (d.type === 'impost')) {
                            fillName = (d.type !== 'glass') ? 'url(#laminat)' : '';
                            } else {
                              fillName = (d.type !== 'glass') ? 'url(#laminat1)' : '';
                              }
                        } else if (scope.typeConstruction === globalConstants.SVG_ID_MAIN) {
                          fillName = '#DCDCDC';
                        } else {
                          fillName = '#f9f9f9';
                        }
                    }
                    return fillName;
                  }
                });


              if(scope.typeConstruction !== globalConstants.SVG_CLASS_ICON) {
                /** sash open direction */
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
                      //------- handler
                      'marker-mid': function(d) {
                        return setSashFittings(1, d, template.details[i]);
                      },
                      //------- hinges
                      'marker-start': function(d) {
                        return setSashFittings(0, d, template.details[i]);
                      },
                      'marker-end': function(d) {
                        return setSashFittings(0, d, template.details[i]);
                      }
                    });
                }


                //---- corner markers
                if(scope.typeConstruction === globalConstants.SVG_ID_EDIT) {
                  if (template.details[i].level === 1) {
                    //----- create array of frame points with corner = true
                    corners = template.details[i].pointsOut.filter(function (item) {
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
                if (scope.typeConstruction === 'tamlateGlassSVG') {
                  if(!template.details[i].children.length) {
                    elementsGroup.append('text')
                      .text(template.details[i].glassTxt)
                      .attr({
                        'block_id': template.details[i].id,
                        'class': 'glass-txt',
                        'x': template.details[i].center.x,
                        'y': template.details[i].center.y
                      });
                  }
                }

                /** type Grid names */
                if (scope.typeConstruction === 'tamlateGridSVG') {
                  if(!template.details[i].children.length && template.details[i].gridId) {
                    elementsGroup.append('text')
                      .text(template.details[i].gridTxt)
                      .attr({
                        'class': 'glass-txt',
                        'x': template.details[i].center.x,
                        'y': template.details[i].center.y
                      });
                  }
                }
              }
            }

            if(scope.typeConstruction !== globalConstants.SVG_CLASS_ICON ) {
              //--------- dimension
              var dimXQty = template.dimension.dimX.length,
                  dimYQty = template.dimension.dimY.length,
                  dimQQty = template.dimension.dimQ.length,
                  dx, dy, dq;
              for (dx = 0; dx < dimXQty; dx+=1) {
                createDimension(0, template.dimension.dimX[dx], dimGroup, lineCreator);
              }
              for (dy = 0; dy < dimYQty; dy+=1) {
                createDimension(1, template.dimension.dimY[dy], dimGroup, lineCreator);
              }
              for (dq = 0; dq < dimQQty; dq+=1) {
                createRadiusDimension(template.dimension.dimQ[dq], dimGroup, lineCreator);
              }
            }

            elem.html(container);

            //======= set Events on elements
            DesignServ.removeAllEventsInSVG();
            //--------- set clicking to all elements
            if (scope.typeConstruction === globalConstants.SVG_ID_EDIT) {
              DesignServ.initAllImposts();
              DesignServ.initAllGlass();
              DesignServ.initAllArcs();
              DesignServ.initAllDimension();
            }
          }
        }

        scope.$watch('template', function () {
          buildSVG(scope.template, scope.templateWidth, scope.templateHeight);
        });

      }
    };

  });
})();