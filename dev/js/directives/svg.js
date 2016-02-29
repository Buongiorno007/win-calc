/* globals d3 */
(function(){
  'use strict';
    /**@ngInject*/
  angular
    .module('BauVoiceApp')
    .directive('svgTemplate',

<<<<<<< HEAD
  function svgTemplateDir(globalConstants, GeneralServ, ProductStor, SVGServ, DesignServ) {
=======
  function(
    globalConstants,
    GeneralServ,
    ProductStor,
    SVGServ,
    DesignServ
  ) {
>>>>>>> 221ce689c2bdefe907a83a1e0f88b55fdd61c84d

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
                if(dir) {
                  className = (dim.level) ? 'dim_blockY' : 'dim_block dim_hidden';
                } else {
                  className = (dim.level) ? 'dim_blockX' : 'dim_block dim_hidden';
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


        function buildSVG(template, widthSVG, heightSVG) {
          if(template && !$.isEmptyObject(template)) {
            var container = document.createElement('div'),
                lineCreator = d3.svg.line()
                  .x(function(d) { return d.x; })
                  .y(function(d) { return d.y; })
                  .interpolate("linear"),
                padding = 0.7,
                position = {x: 0, y: 0},
                mainSVG, mainGroup, elementsGroup, dimGroup, points, dimMaxMin, scale, blocksQty, i, corners;

            if(scope.typeConstruction === globalConstants.SVG_CLASS_ICON){
              padding = 1;
            } else if(scope.typeConstruction === globalConstants.SVG_ID_EDIT) {
              padding = 0.6;
            } else if(scope.typeConstruction === 'MainEdit') {
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
<<<<<<< HEAD

      
            if(scope.typeConstruction === 'MainEdit') {
             scale = SVGServ.setTemplateScaleMAIN(dimMaxMin, widthSVG, heightSVG, padding);
            } else {
             scale = SVGServ.setTemplateScale(dimMaxMin, widthSVG, heightSVG, padding); 
            }


            if(scope.typeConstruction !== 'icon') {
              if (scope.typeConstruction === 'MainEdit') {
              position = SVGServ.setTemplatePositionMAIN(dimMaxMin, widthSVG, heightSVG, scale);
            } else {
=======
            scale = SVGServ.setTemplateScale(dimMaxMin, widthSVG, heightSVG, padding);
            if(scope.typeConstruction !== globalConstants.SVG_CLASS_ICON) {
>>>>>>> 221ce689c2bdefe907a83a1e0f88b55fdd61c84d
              position = SVGServ.setTemplatePosition(dimMaxMin, widthSVG, heightSVG, scale);
            }
            }
            mainGroup = mainSVG.append("g").attr({
              'id': 'main_group',
              'transform': 'translate(' + position.x + ', ' + position.y + ') scale('+ scale +','+ scale +')'
            });

<<<<<<< HEAD

        //===================zoom=====================//


            if (scope.typeConstruction === 'edit' ) {
=======
            if (scope.typeConstruction === globalConstants.SVG_ID_EDIT) {
>>>>>>> 221ce689c2bdefe907a83a1e0f88b55fdd61c84d
              mainSVG.call(d3.behavior.zoom()
                .translate([position.x, position.y])
                .scale(scale)
                .scaleExtent([0, 8])
                .on("zoom", zooming));
            } 

        //===================zoom end=====================//

           
            /** Defs */
            if(scope.typeConstruction !== 'icon') {
              var defs = mainGroup.append("defs"),
                  pathHandle = "M4.5,0C2.015,0,0,2.015,0,4.5v6c0,1.56,0.795,2.933,2,3.74V7.5C2,6.119,3.119,5,4.5,5S7,6.119,7,7.5v6.74c1.205-0.807,2-2.18,2-3.74v-6C9,2.015,6.985,0,4.5,0z"+
                    "M7,26.5C7,27.881,5.881,29,4.5,29l0,0C3.119,29,2,27.881,2,26.5v-19C2,6.119,3.119,5,4.5,5l0,0C5.881,5,7,6.119,7,7.5V26.5z";
              /** dimension */
              //----- horizontal marker arrow
              setMarker(defs, 'dimHorL', '-5, -5, 1, 8', -5, -2, 0, 50, 50, 'M 0,0 L -4,-2 L0,-4 z', 'size-line');
              setMarker(defs, 'dimHorR', '-5, -5, 1, 8', -5, -2, 180, 50, 50, 'M 0,0 L -4,-2 L0,-4 z', 'size-line');
              //------- vertical marker arrow
              setMarker(defs, 'dimVertL', '4.2, -1, 8, 9', 5, 2, 90, 100, 60, 'M 0,0 L 4,2 L0,4 z', 'size-line');
              setMarker(defs, 'dimVertR', '4.2, -1, 8, 9', 5, 2, 270, 100, 60, 'M 0,0 L 4,2 L0,4 z', 'size-line');

              setMarker(defs, 'dimArrow', '4.2, -1, 8, 9', 5, 2, 'auto', 100, 60, 'M 0,0 L 4,2 L0,4 z', 'size-line');

              /** handle */
              setMarker(defs, 'handleR', '0 -1 9 32', 4, 23, 90, 29, 49, pathHandle, 'handle-mark');
              setMarker(defs, 'handleL', '0 -1 9 32', 5, 23, 270, 29, 49, pathHandle, 'handle-mark');
              setMarker(defs, 'handleU', '0 -1 9 32', -10, 10, 270, 29, 49, pathHandle, 'handle-mark');
              setMarker(defs, 'handleD', '0 -1 9 32', 20, 10, 270, 29, 49, pathHandle, 'handle-mark');

              /** lamination */
      
                defs.append('pattern')
                  .attr('id', 'laminat')
                  .attr('patternUnits', 'userSpaceOnUse')
                  .attr('width', 600)
                  .attr('height', 400)
                  .append("image")
                  .attr("xlink:href", "img/lamination/"+ProductStor.product.lamination.img_in_id+".jpg")
                  .attr('width', 600)
                  .attr('height', 400);

              /** background */
              if(scope.typeConstruction ==='MainEdit') {
                if(ProductStor.product.construction_type == 1 || ProductStor.product.construction_type == 3) {
                defs.append('pattern')
                  .attr('id', 'background')
                  .attr('patternUnits', 'userSpaceOnUse')
                  .attr('width', 2520*1.2)
                  .attr('height', 1680*1.2)
                  .append("image")
                  .attr("xlink:href", "img/room/fon.gif")
                  .attr('width', 2520*1.2)
                  .attr('height', 1680*1.2);
                }
              
                if(ProductStor.product.construction_type == 4) {
                  defs.append('pattern')
                  .attr('id', 'background')
                  .attr('patternUnits', 'userSpaceOnUse')
                  .attr('width', 2520*1.2)
                  .attr('height', 1680*1.2)
                  .append("image")
                  .attr("xlink:href", "img/room/33.gif")
                  .attr('width', 2520*1.2)
                  .attr('height', 1680*1.2);
                }
              } else {
                   defs.append('pattern')
                  .attr('id', 'background')
                  .attr('patternUnits', 'userSpaceOnUse')
                  .attr('width', 2520*1.2)
                  .attr('height', 1680*1.2)
                  .attr('fill','#94DEEE')
                  .attr('width', 2520*2)
                  .attr('height', 1680*2);
                }
            }

<<<<<<< HEAD
            var blockQty = template.details.length,
                fullPath = '', 
                noVievNullPath = '',    //без  Viev = 0
                fpTop = '',             //верх точки
                fpDgLR ='',             //диагональ с лево на право
                fpDgRL ='',             //диагональ с право на лево
                fpBottom = '',          //низ точки
                heightWmd = '',         //Высота окна
                widthWmd = '',          //Ширина окна
                wind = '',              //Выход на болкон
                door = '';              //Выход на болкон
                while(--blockQty > 0) {
                  if (template.details[blockQty].level === 1) {
                    var pointsOutQty =  template.details[blockQty].pointsOut.length;
                    while(--pointsOutQty > -1) {
                    
                      if(template.details[blockQty].pointsOut[pointsOutQty].view !== 0) {
                          noVievNullPath += (template.details[blockQty].pointsOut[pointsOutQty].x); 
                      if(!pointsOutQty) {
                          noVievNullPath += ' '+(template.details[blockQty].pointsOut[pointsOutQty].y);
                      } else {
                          noVievNullPath += ' '+(template.details[blockQty].pointsOut[pointsOutQty].y) +',';
                        }
                      }
                      
                      if ((template.details[blockQty].pointsOut[pointsOutQty].id ==='fp1') || (template.details[blockQty].pointsOut[pointsOutQty].id ==='fp3')) {
                          fpDgLR += (template.details[blockQty].pointsOut[pointsOutQty].x);                        
                      if(!pointsOutQty) {
                          fpDgLR += ' '+((template.details[blockQty].pointsOut[pointsOutQty].y));
                      } else {
                          fpDgLR += ' '+((template.details[blockQty].pointsOut[pointsOutQty].y)) +',';
                        }
                      }

                      if ((template.details[blockQty].pointsOut[pointsOutQty].id ==='fp2') || (template.details[blockQty].pointsOut[pointsOutQty].id ==='fp4')) {
                          fpDgRL += (template.details[blockQty].pointsOut[pointsOutQty].x);                        
                      if(!pointsOutQty) {
                          fpDgRL += ' '+((template.details[blockQty].pointsOut[pointsOutQty].y));
                      } else {
                          fpDgRL += ' '+((template.details[blockQty].pointsOut[pointsOutQty].y)) +',';
                        }
                      }

                      if ((template.details[blockQty].pointsOut[pointsOutQty].id ==='fp1') || (template.details[blockQty].pointsOut[pointsOutQty].id ==='fp2') || (template.details[blockQty].pointsOut[pointsOutQty].id ==='fp3') || (template.details[blockQty].pointsOut[pointsOutQty].id ==='fp4')) {
                          wind += (template.details[blockQty].pointsOut[pointsOutQty].x);                        
                      if(!pointsOutQty) {
                          wind += ' '+(template.details[blockQty].pointsOut[pointsOutQty].y);
                      } else {
                          wind += ' '+(template.details[blockQty].pointsOut[pointsOutQty].y) +',';
                        }
                      }

                      if ((template.details[blockQty].pointsOut[pointsOutQty].id ==='fp5') || (template.details[blockQty].pointsOut[pointsOutQty].id ==='fp6') || (template.details[blockQty].pointsOut[pointsOutQty].id ==='fp7') || (template.details[blockQty].pointsOut[pointsOutQty].id ==='fp8')) {
                          door += (template.details[blockQty].pointsOut[pointsOutQty].x);                        
                      if(!pointsOutQty) {
                          door += ' '+(template.details[blockQty].pointsOut[pointsOutQty].y);
                      } else {
                          door += ' '+(template.details[blockQty].pointsOut[pointsOutQty].y) +',';
                        }
                      }

                      if (template.details[blockQty].pointsOut[pointsOutQty]) {
                          fullPath += (template.details[blockQty].pointsOut[pointsOutQty].x); 
                      if(!pointsOutQty) {
                          fullPath += ' '+((template.details[blockQty].pointsOut[pointsOutQty].y));
                      } else {
                          fullPath += ' '+((template.details[blockQty].pointsOut[pointsOutQty].y)) +',';
                        }                                          
                      }

                      if (template.details[blockQty].pointsOut[pointsOutQty].id ==='fp3') {                        
                        if(!pointsOutQty) {
                          heightWmd += ' '+(template.details[blockQty].pointsOut[pointsOutQty].y);
                        } else {
                          heightWmd += ' '+(template.details[blockQty].pointsOut[pointsOutQty].y) +',';
                        }
                      }

                      if (template.details[blockQty].pointsOut[pointsOutQty].id ==='fp3') {                        
                        widthWmd += (template.details[blockQty].pointsOut[pointsOutQty].x);
                      }

                      if (template.details[blockQty].pointsOut[pointsOutQty].id === 'fp2') {
                          fpTop += (template.details[blockQty].pointsOut[pointsOutQty].x)/2;
                      } 
                      if (template.details[blockQty].pointsOut[pointsOutQty].id === 'fp3' || template.details[blockQty].pointsOut[pointsOutQty].id === 'fp4') {
                          fpBottom += (template.details[blockQty].pointsOut[pointsOutQty].x); 
                      if (!pointsOutQty) {
                          fpBottom += ' '+(template.details[blockQty].pointsOut[pointsOutQty].y);
                      } else {
                          fpBottom += ' '+(template.details[blockQty].pointsOut[pointsOutQty].y) +',';
                        }
                      }
                    }
                  }
                }

               

          //============================elements room==========================//

                  if(scope.typeConstruction ==='MainEdit') {
                    if(ProductStor.product.construction_type == 1 || ProductStor.product.construction_type == 3) {
                      var lchHeight = (((0.18*heightWmd)-252)+520),
                          lchWidth = (((0.18*widthWmd)-234)+520),
                          heightDisplay = 768,
                          topWindowsill = '',
                          block15Height = '',
                          windowsill2 = '',
                          block15Top = '';


                        if (ProductStor.product.template_height < 1648) {
                          topWindowsill = '' + 456,
                          block15Height = '' + 90,
                          windowsill2 = 100,
                          block15Top = '' + 720;
                        }
                        if (1648 < ProductStor.product.template_height) {
                          topWindowsill = '' + 526,
                          block15Height = '' + 90,
                          windowsill2 = 60,
                          block15Top =  '' + 720;
                        }
                        if (1848 < ProductStor.product.template_height) {
                          topWindowsill = '' + 576,
                          block15Height = '' + 90,
                          windowsill2 = (0),
                          block15Top = '' + 720;
                        }
                        if (2148 < ProductStor.product.template_height) {
                          topWindowsill = '' + 646,
                          block15Height = '' + 90,
                          windowsill2 = (-30),
                          block15Top =  '' + 720;
                        }

                          if (widthWmd > 900 && heightWmd < 1648) {
                            d3.select('.coeff-room-block5').style('left' , (109+(0.48*(fpTop-700*0.32))/2) + 'px');
                          } else { 
                              d3.select('.coeff-room-block5').style('left' , 10000 + 'px');
                            }
                              d3.select('.coeff-room-block15').style({
                                'width' : (90+(0.48*fpTop)) + 'px',
                                'height' : block15Height + 'px',
                                'top' : block15Top + 'px',
                              }),                      
                              d3.select('.coeff-room-block11').style('left' , (10000) + 'px'),
                              d3.select('.coeff-room-block16').style('left' , 9 + 'px'),
                              d3.select('.coeff-room-block8').style('left' , (10000) + 'px'),                                         
                              d3.select('.coeff-room-block7').style('opacity' , 0),
                              d3.select('.coeff-room-block9').style('opacity' , 1),                      
                              d3.select('.coeff-room-block23').style('left' , (10000) + 'px'),
                              d3.select('.coeff-room-block10').style('opacity' , 0),
                              d3.select('.shadow-main').style(),
                              d3.select('.coeff-room-block17').style({
                                'width' : (0.4*(fpTop*2+350)) + 'px',
                                'height' : 41 + 'px',
                                'left' : 215 + 'px',
                                'top' : topWindowsill + 'px',
                              }),
                              d3.select('.coeff-room-block22').style({
                                  'width' : lchWidth + 'px',
                                  'height' : lchHeight + 'px',
                                  'left' : (-80) + 'px',
                                  'top' : (heightDisplay - lchHeight-windowsill2) + 'px',
                              });     
                    } 

                    if(ProductStor.product.construction_type == 4) { 
                      var lchHeight = (((0.18*heightWmd)-252)+520),
                          lchWidth = (((0.18*widthWmd)-234)+420),
                          heightDisplay = 768;
                            d3.select('.coeff-room-block23').style({
                              'width' : (1000*0.5+(0.7*(widthWmd-700))) + 'px',
                              'top' : 665 + 'px',
                              'left' : 100 -(2.5*(0.1*widthWmd-70)) + 'px',
                            }),
                            d3.select('.coeff-room-block15').style({
                              'top': (10000) + 'px',
                            }), 
                            d3.select('.coeff-room-block17').style({
                              'width' : 0 + 'px',
                              'height' : 0 + 'px',
                              'left' : 0 + 'px',
                            }),   
                            d3.select('.coeff-room-block22').style({
                              'width' : lchWidth + 'px',
                              'height' : lchHeight + 'px',
                              'left' : (60) + 'px',
                              'top' : (heightDisplay - lchHeight + 30) + 'px',
                          });   
                            d3.select('.coeff-room-block11').style('left' , ((0.23*fpTop*2)+278) + 'px'),
                            d3.select('.coeff-room-block8').style('left' , ((0.23*fpTop*2)+275) + 'px'),                      
                            d3.select('.coeff-room-block5').style('left' , 5000 + 'px'), 
                            d3.select('.coeff-room-block10').style('opacity' , 1),                   
                            d3.select('.coeff-room-block7').style('opacity' , 1),
                            d3.select('.coeff-room-block16').style('left' , 5000 + 'px'),                      
                            d3.select('.coeff-room-block9').style('opacity' , 0);
                    }

                  // if(ProductStor.product.construction_type == 2) { 
                  //     d3.select('.coeff-room-block15').style({
                  //       'width': (100+(0.48*fpTop)) + 'px',
                  //     }), 
                  //     d3.select('.coeff-room-block17').style({
                  //       'width' : 0 + 'px',
                  //       'height' : 0 + 'px',
                  //       'left' : 10000 + 'px',
                  //     }), 
                  //     d3.select('.coeff-room-block11').style('opacity' , 0),
                  //     d3.select('.coeff-room-block8').style('opacity' , 0),                      
                  //     d3.select('.coeff-room-block5').style('left' , 5000 + 'px'), 
                  //     d3.select('.coeff-room-block10').style('opacity' , 0),                   
                  //     d3.select('.coeff-room-block7').style('opacity' , 0),                      
                  //     d3.select('.coeff-room-block9').style('opacity' , 0);
                  //     }       
                  }

          //============================soffits================================//

                  if(scope.typeConstruction ==='MainEdit') {
                    if(ProductStor.product.construction_type == 1 || ProductStor.product.construction_type == 3){
                      if(1 < ProductStor.product.template_height < 30000) {
                       var positionX1 = position.x-160,
                           positionY1 = 18,
                           positionX2 = position.x-340,
                           positionY2 = -100;
                      } 

                      mainGroup.append('g').append("polygon")
                      .attr({
                        'id' : 'clipPolygonWindow1',
                        'fill' : '#FFFAFA',
                        'points' : noVievNullPath,
                        'transform': 'translate(' + (positionX1) + ', ' + (positionY1) + ') scale('+ (scale*4.4) +','+ (scale*4.4) +')'
                      });

                      mainGroup.append('g').append("polygon")            
                      .attr({
                        'id' : 'clipPolygonWindow2',
                        'fill' : '#FFFAFA',
                        'points' : noVievNullPath,
                        'transform': 'translate(' + (positionX2) + ', ' + (positionY1) + ') scale('+ (scale*4.4) +','+ (scale*4.4) +')'
                      });    
                    
                      mainGroup.append('g').append("polygon")
                      .attr({
                        'id' : 'clipPolygonWindow3',
                        'fill' : '#FFFAFA',
                        'points' : noVievNullPath,
                        'transform': 'translate(' + (positionX1) + ', ' + (positionY2) + ') scale('+ (scale*4.4) +','+ (scale*4.4) +')'
                      });

                      mainGroup.append('g').append("polygon")            
                      .attr({
                        'id' : 'clipPolygonWindow4',
                        'fill' : '#FFFAFA',
                        'points' : noVievNullPath,
                        'transform': 'translate(' + (positionX2) + ', ' + (positionY2) + ') scale('+ (scale*4.4) +','+ (scale*4.4) +')'
                      });
                    }

                    if(ProductStor.product.construction_type == 4) {
                    
                      mainGroup.append('g').append("polygon")
                      .attr({
                        'id' : 'clipPolygonDoor3',
                        'fill' : '#FFFAFA',
                        'points' : noVievNullPath,
                        'transform': 'translate(' + (position.x-215) + ', ' + (-80) + ') scale('+ (scale*4.4) +','+ (scale*4.4) +')'
                      });

                      mainGroup.append('g').append("polygon")            
                      .attr({
                        'id' : 'clipPolygonDoor4',
                        'fill' : '#FFFAFA',
                        'points' : noVievNullPath,
                        'transform': 'translate(' + (position.x-333) + ', ' + (-80) + ') scale('+ (scale*4.4) +','+ (scale*4.4) +')'
                      });
                    }
                    if(ProductStor.product.construction_type == 2) {  
                      mainGroup.append('g').append("polygon")
                      .attr({
                        'id' : 'clipPolygonWindow1',
                        'fill' : '#FFFAFA',
                        'points' : wind,
                        'transform': 'translate(' + (position.x-100) + ', ' + (85) + ') scale('+ (scale*4.4) +','+ (scale*4.4) +')'
                      });

                      mainGroup.append('g').append("polygon")            
                      .attr({
                        'id' : 'clipPolygonWindow2',
                        'fill' : '#FFFAFA',
                        'points' : wind,
                        'transform': 'translate(' + (position.x-300) + ', ' + (85) + ') scale('+ (scale*4.4) +','+ (scale*4.4) +')'
                      });    
                    
                      mainGroup.append('g').append("polygon")
                      .attr({
                        'id' : 'clipPolygonWindow3',
                        'fill' : '#FFFAFA',
                        'points' : wind,
                        'transform': 'translate(' + (position.x-160) + ', ' + (-100) + ') scale('+ (scale*4.4) +','+ (scale*4.4) +')'
                      });

                      mainGroup.append('g').append("polygon")            
                      .attr({
                        'id' : 'clipPolygonWindow4',
                        'fill' : '#FFFAFA',
                        'points' : wind,
                        'transform': 'translate(' + (position.x-300) + ', ' + (-100) + ') scale('+ (scale*4.4) +','+ (scale*4.4) +')'
                      });    
                    
                      mainGroup.append('g').append("polygon")
                      .attr({
                        'id' : 'clipPolygondoor3',
                        'fill' : '#FFFAFA',
                        'points' : door,
                        'transform': 'translate(' + (position.x-160) + ', ' + (-100) + ') scale('+ (scale*4.4) +','+ (scale*4.4) +')'
                      });

                      mainGroup.append('g').append("polygon")            
                      .attr({
                        'id' : 'clipPolygondoor4',
                        'fill' : '#FFFAFA',
                        'points' : door,
                        'transform': 'translate(' + (position.x-300) + ', ' + (-100) + ') scale('+ (scale*4.4) +','+ (scale*4.4) +')'
                      });
                    }
                  }
                  
=======
            /** Defs */
            if(scope.typeConstruction !== globalConstants.SVG_CLASS_ICON) {
              var defs = mainGroup.append("defs"),
                  pathHandle = "M4.5,0C2.015,0,0,2.015,0,4.5v6c0,1.56,0.795,2.933,2,3.74V7.5C2,6.119,"+
                    "3.119,5,4.5,5S7,6.119,7,7.5v6.74c1.205-0.807,2-2.18,2-3.74v-6C9,2.015,6.985,0,4.5,0z"+
                    "M7,26.5C7,27.881,5.881,29,4.5,29l0,0C3.119,29,2,27.881,2,26.5v-19C2,"+
                    "6.119,3.119,5,4.5,5l0,0C5.881,5,7,6.119,7,7.5V26.5z";
              /** dimension */
              //----- horizontal marker arrow
              setMarker(defs, 'dimHorL', '-5, -5, 1, 8', -5, -2, 0, 50, 50, 'M 0,0 L -4,-2 L0,-4 z', 'size-line');
              setMarker(defs, 'dimHorR', '-5, -5, 1, 8', -5, -2, 180, 50, 50, 'M 0,0 L -4,-2 L0,-4 z', 'size-line');
              //------- vertical marker arrow
              setMarker(defs, 'dimVertL', '4.2, -1, 8, 9', 5, 2, 90, 100, 60, 'M 0,0 L 4,2 L0,4 z', 'size-line');
              setMarker(defs, 'dimVertR', '4.2, -1, 8, 9', 5, 2, 270, 100, 60, 'M 0,0 L 4,2 L0,4 z', 'size-line');

              setMarker(defs, 'dimArrow', '4.2, -1, 8, 9', 5, 2, 'auto', 100, 60, 'M 0,0 L 4,2 L0,4 z', 'size-line');

              /** handle */
              setMarker(defs, 'handleR', '0 -1 9 32', 4, 23, 90, 29, 49, pathHandle, 'handle-mark');
              setMarker(defs, 'handleL', '0 -1 9 32', 5, 23, 270, 29, 49, pathHandle, 'handle-mark');
              setMarker(defs, 'handleU', '0 -1 9 32', -10, 10, 270, 29, 49, pathHandle, 'handle-mark');
              setMarker(defs, 'handleD', '0 -1 9 32', 20, 10, 270, 29, 49, pathHandle, 'handle-mark');

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
              }
            }
>>>>>>> 221ce689c2bdefe907a83a1e0f88b55fdd61c84d

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
<<<<<<< HEAD
                    if(ProductStor.product.lamination.img_in_id > 1) {
                      return (d.type !== 'glass') ? 'url(#laminat)' : '';
                    } else {
                      if (scope.typeConstruction ==='MainEdit') {
                         return '#DCDCDC';
                      } else {
                      return '#FFFFFF';
                        }
                      }
=======
                    var fillName;
                    if(ProductStor.product.lamination.img_in_id > 1) {
                      fillName = (d.type !== 'glass') ? 'url(#laminat)' : '';
                    } else {
                      fillName = '#f9f9f9';
                    }
                    return fillName;
>>>>>>> 221ce689c2bdefe907a83a1e0f88b55fdd61c84d
                  }
                });


              if(scope.typeConstruction !== globalConstants.SVG_CLASS_ICON) {
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
                        var dirQty = template.details[i].sashOpenDir.length,
                            handle;
                        if(template.details[i].handlePos) {
                          if (dirQty === 1) {
                            if (template.details[i].handlePos === 2) {
                              handle = 'url(#handleR)';
                            } else if (template.details[i].handlePos === 1) {
                              handle = 'url(#handleU)';
                            } else if (template.details[i].handlePos === 4) {
                              handle = 'url(#handleL)';
                            } else if (template.details[i].handlePos === 3) {
                              handle = 'url(#handleD)';
                            }
                          } else if (dirQty === 2) {
                            if (d.points[1].fi < 45 || d.points[1].fi > 315) {
                              handle = 'url(#handleR)';
                            } else if (d.points[1].fi > 135 && d.points[1].fi < 225) {
                              handle = 'url(#handleL)';
                            }
                          }
                          return handle;
                        }
                      }
                    });
                }


                //---- corner markers
<<<<<<< HEAD
                if(scope.typeConstruction === 'edit' || scope.typeConstruction === 'MainEdit') {
=======
                if(scope.typeConstruction === globalConstants.SVG_ID_EDIT) {
>>>>>>> 221ce689c2bdefe907a83a1e0f88b55fdd61c84d
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

<<<<<<< HEAD

            if(scope.typeConstruction !== 'icon') {
              //--------- dimension
              var dimXQty = template.dimension.dimX.length,
                  dimYQty = template.dimension.dimY.length,
                  dimQQty = template.dimension.dimQ.length;
              for (var dx = 0; dx < dimXQty; dx++) {
=======
            if(scope.typeConstruction !== globalConstants.SVG_CLASS_ICON) {
              //--------- dimension
              var dimXQty = template.dimension.dimX.length,
                  dimYQty = template.dimension.dimY.length,
                  dimQQty = template.dimension.dimQ.length,
                  dx, dy, dq;
              for (dx = 0; dx < dimXQty; dx+=1) {
>>>>>>> 221ce689c2bdefe907a83a1e0f88b55fdd61c84d
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
            console.log('//---Events------ set clicking to all elements--------------//')
            //--------- set clicking to all elements
            if (scope.typeConstruction === globalConstants.SVG_ID_EDIT) {
              DesignServ.initAllImposts();
              DesignServ.initAllGlass();
              DesignServ.initAllArcs();
              DesignServ.initAllDimension();
            }
          }
        }


<<<<<<< HEAD
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
          if (scope.typeConstruction !== 'MainEdit') {
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

          if(scope.typeConstruction === 'edit' || scope.typeConstruction === 'MainEdit') {
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
=======
>>>>>>> 221ce689c2bdefe907a83a1e0f88b55fdd61c84d

        scope.$watch('template', function () {
          buildSVG(scope.template, scope.templateWidth, scope.templateHeight);
        });

      }
    };

  });
})();