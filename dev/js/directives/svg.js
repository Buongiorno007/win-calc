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
//TODO          startPinch();
        });





        function buildSVG(template, widthSVG, heightSVG) {
          var mainSVG, mainGroup, elementsGroup, dimGroup, padding = 1, points, dimMaxMin, scale, position, blocksQty;
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
                    return (d.type === 'glass') ? 'glass' : 'frame'
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



              //----- sash open direction
              if (template.details[i].sashOpenDir) {
                elementsGroup.selectAll('path.sash_mark.' + template.details[i].id)
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
                elementsGroup.selectAll('circle.corner_mark.' + template.details[i].id)
                  .data(corners)
                  .enter().append('circle')
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

            //--------- dimension
            var defs = dimGroup.append("defs"),
                dimXQty = template.dimension.dimX.length,
                dimYQty = template.dimension.dimY.length,
                dimQQty = template.dimension.dimQ.length;

            //----- horizontal marker arrow
            setMarkerArrow(defs, 'dimHorL', '-5, -5, 1, 8', -5, -2, 0, 50, 50, 'M 0,0 L -4,-2 L0,-4 z');
            setMarkerArrow(defs, 'dimHorR', '-5, -5, 1, 8', -5, -2, 180, 50, 50, 'M 0,0 L -4,-2 L0,-4 z');
            //------- vertical marker arrow
            setMarkerArrow(defs, 'dimVertL', '4.2, -1, 8, 9', 5, 2, 90, 100, 60, 'M 0,0 L 4,2 L0,4 z');
            setMarkerArrow(defs, 'dimVertR', '4.2, -1, 8, 9', 5, 2, 270, 100, 60, 'M 0,0 L 4,2 L0,4 z');

            setMarkerArrow(defs, 'dimArrow', '4.2, -1, 8, 9', 5, 2, 'auto', 100, 60, 'M 0,0 L 4,2 L0,4 z');

//            console.log('SVG=========dim==', template.dimension);
            for(var dx = 0; dx < dimXQty; dx++) {
              createDimension(0, template.dimension.dimX[dx], dimGroup, lineCreator);
            }
            for(var dy = 0; dy < dimYQty; dy++) {
              createDimension(1, template.dimension.dimY[dy], dimGroup, lineCreator);
            }
            for(var dq = 0; dq < dimQQty; dq++) {
              createRadiusDimension(template.dimension.dimQ[dq], dimGroup, lineCreator);
            }

            DesignServ.removeAllEventsInSVG();
            //--------- set clicking to all elements
            if (scope.typeConstruction === 'edit') {
//              console.log('EDIT INIT IMPOST');
              DesignServ.initAllImposts();
              DesignServ.initAllGlass();
              DesignServ.initAllArcs();
              DesignServ.initAllDimension();
            } else {

            }

//            console.log('buildSVG done!!!!!!!!!', new Date(), new Date().getMilliseconds());
          }
        }




        function setMarkerArrow(defs, id, view, refX, refY, angel, w, h, path) {
          defs.append("marker")
            .classed('size-line', true)
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
              startPR = {
                x: dimQ.startX,
                y: dimQ.startY
              },
              endPR = {
                x: dimQ.midleX,
                y: dimQ.midleY
              },
              sizeBoxWidth = 160,
              sizeBoxHeight = 70,
              sizeBoxRadius = 20,
              dimBlock, sizeBox;

          radiusLine.push(endPR, startPR);

          dimBlock = dimGroup.append('g')
            .attr({
              'class': 'dim_block dim_hidden',
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
                'width': sizeBoxWidth,
                'height': sizeBoxHeight,
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










        //--------- PAN AND PINCH SVG

//        var eventsHandler = {
//          haltEventListeners: ['touchstart', 'touchend', 'touchmove', 'touchleave', 'touchcancel'],
//          init: function(options) {
//            var instance = options.instance,
//                initialScale = 1,
//                pannedX = 0,
//                pannedY = 0;
//
//            // Init Hammer
//            // Listen only for pointer and touch events
//            this.hammer = Hammer(options.svgElement, {
//              inputClass: Hammer.SUPPORT_POINTER_EVENTS ? Hammer.PointerEventInput : Hammer.TouchInput
//            });
//
//            // Enable pinch
//            this.hammer.get('pinch').set({enable: true});
//
//            // Handle double tap
//            this.hammer.on('doubletap', function(ev){
//              //console.log('ev.type = ', ev.type);
//              instance.zoomIn();
//            });
//
//            // Handle pan
//            this.hammer.on('pan panstart panend', function(ev){
//              // On pan start reset panned variables
//              //console.log('ev.type = ', ev.type);
//              if (ev.type === 'panstart') {
//                pannedX = 0;
//                pannedY = 0;
//              }
//
//              // Pan only the difference
//              if (ev.type === 'pan' || ev.type === 'panend') {
//                //console.log('p');
//                instance.panBy({x: ev.deltaX - pannedX, y: ev.deltaY - pannedY});
//                pannedX = ev.deltaX;
//                pannedY = ev.deltaY;
//              }
//            });
//
//            // Handle pinch
//            this.hammer.on('pinch pinchstart pinchend', function(ev){
//              //console.log('ev.type = ', ev.type);
//              // On pinch start remember initial zoom
//              if (ev.type === 'pinchstart') {
//                initialScale = instance.getZoom();
//                instance.zoom(initialScale * ev.scale);
//              }
//
//              // On pinch zoom
//              if (ev.type === 'pinch' || ev.type === 'pinchend') {
//                instance.zoom(initialScale * ev.scale);
//              }
//            });
//
//            // Prevent moving the page on some devices when panning over SVG
//            options.svgElement.addEventListener('touchmove', function(e){ e.preventDefault(); });
//          },//--- init
//
//          destroy: function(){
//            this.hammer.destroy();
//          }
//        };
//
//        var beforePan = function(oldPan, newPan){
//          var stopHorizontal = false,
//              stopVertical = false,
//              gutterWidth = 200,
//              gutterHeight = 200,
//              // Computed variables
//              sizes = this.getSizes(),
//              leftLimit = -((sizes.viewBox.x + sizes.viewBox.width) * sizes.realZoom) + gutterWidth,
//              rightLimit = sizes.width - gutterWidth - (sizes.viewBox.x * sizes.realZoom),
//              topLimit = -((sizes.viewBox.y + sizes.viewBox.height) * sizes.realZoom) + gutterHeight,
//              bottomLimit = sizes.height - gutterHeight - (sizes.viewBox.y * sizes.realZoom),
//              customPan = {};
//
//          customPan.x = Math.max(leftLimit, Math.min(rightLimit, newPan.x));
//          customPan.y = Math.max(topLimit, Math.min(bottomLimit, newPan.y));
//          return customPan;
//        };
//
//
//        function startPinch() {
//          var svgElement = document.getElementById('tamlateSVG');
//          //console.log('svgElement', svgElement);
//          // Expose to window namespace for testing purposes
//          window.panZoom = svgPanZoom(svgElement, {
//            zoomEnabled: true,
//            controlIconsEnabled: false,
//            zoomScaleSensitivity: 0.1,
//            fit: 1,
//            center: 1,
//            refreshRate: 'auto',
//            beforePan: beforePan,
//            customEventsHandler: eventsHandler
//          });
//        }



      }
    }

  }
})();