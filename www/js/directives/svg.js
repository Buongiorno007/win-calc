
// directives/svg.js

(function(){
  'use strict';
    /**
     * @ngInject
     */
  angular
    .module('BauVoiceApp')
    .directive('svgTemplate', svgTemplateDir);

  function svgTemplateDir(GlobalStor, ProductStor) {

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

//          var svg = buildTemplateSVG(scope.template, scope.templateWidth, scope.templateHeight);
//          if(scope.typeConstruction === 'edit') {
//            elem.css({opacity: 0, visibility: 'hidden'});
//          }
//          elem.html(svg);
//          if(scope.typeConstruction === 'edit') {
//            //if(window.panZoom) {
//            //  window.panZoom.destroy();
//            //  delete window.panZoom;
//            //}
//            startPinch();
//            setTimeout(function(){
//              elem.css({opacity: 1, visibility: 'visible'});
//            }, 100);
//
//          }
        });


        function buildSVG(template, widthSVG, heightSVG) {

          var mainSVG, mainGroup;

          mainSVG = d3.select('#mainSVG').append('svg')
            .attr({
              'width': widthSVG,
              'height': heightSVG,
              'id': 'mainSVG'
            });

          mainGroup = mainSVG.append("g")
            .attr({
              'id': 'main_group',
              'transform': 'translate(200, 20) scale(0.22)'
            });

          console.log('++++++ template +++++++', template.objects);
          //========
          var partsQty = template.objects.length,
              i = 0;
          for(; i < partsQty; i++) {
            if(template.objects[i].type === 'skylight' && template.objects[i].level > 0) {

              var blockItem = mainGroup.selectAll('path.block_item')
                .data(template.objects[i].parts).enter()
                .append('path')
                .attr({
                  'blockId': template.objects[i].id,
                  //'class': function(d) { return d.type; },
                  'class': 'frame',
                  'd': function(d) { return d.path; }
                });


            }
          }



        }

  /*
        scope.$watch('doorConfig', function () {
          var svg = buildTemplateSVG(scope.template, scope.templateWidth, scope.templateHeight);
          if(scope.typeConstruction === 'edit') {
            elem.css({opacity: 0, visibility: 'hidden'});
          }
          elem.html(svg);
          if(scope.typeConstruction === 'edit') {
            //if(window.panZoom) {
            //  window.panZoom.destroy();
            //  delete window.panZoom;
            //}
            startPinch();
            setTimeout(function(){
              elem.css({opacity: 1, visibility: 'visible'});
            }, 100);

          }
        });
  */
        function buildTemplateSVG(template, canvasWidth, canvasHeight) {
          //console.log('template ======', template);
          var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"),
              draw = SVG(svg).size(canvasWidth, canvasHeight),
              sizeClass = 'size-box',
              sizeEditClass = 'size-box-edited',
              elementsSVG = {
                frames: [],
                glasses: [],
                imposts: [],
                sashes: [],
                beads: [],
                dimensionsH: [],
                dimensionsV: [],
                openDirections: []
              }, //coefScaleW = 0.75,
              //coefScaleH = 0.5,
              coefScaleW = 0.6, coefScaleH = 0.35, overallDimH = 0, overallDimV = 0, edgeTop = 0, edgeLeft = 0, //overallDimH = 2000,
              //overallDimV = 2000,
              //edgeTop = 300,
              //edgeLeft = 250,
              //coefScrollW = 0.55,
              //sizeBoxWidth = 250,
              //sizeBoxHeight = 120,
              //sizeBoxRadius = 35,

              dimLineHeight = 150, dimMarginBottom = -20, dimEdger = 50,

              sizeBoxWidth = 160, sizeBoxHeight = 70, sizeBoxRadius = 20, sizeBoxMarginBottom = 50;

          console.log('++++++template++++++', template);

          if(template && !$.isEmptyObject(template)) {

            var templatePartQty = template.objects.length, i = 0;
            //------- Create elements of construction
            for (; i < templatePartQty; i++) {
              var path = '', openSashLine = '';

              switch (template.objects[i].type) {
                case 'frame':
                  //console.log('scope.parent.global.isConstructDoor =', scope.$parent.global.isConstructDoor);
                  if (GlobalStor.global.constructionType === 4 && ProductStor.product.doorShapeId > 0) {
                    //console.log('doorConfig =', scope.$parent.global.product.doorShapeId);
                    switch (template.objects[i].id) {
                      //----- without doorstep
                      case 'frame1':
                        path += template.objects[i].parts[0].fromPoint.x + ' ' + template.objects[i].parts[0].fromPoint.y + ' ' + template.objects[i].parts[0].toPoint.x + ' ' + template.objects[i].parts[0].toPoint.y + ' ';
                        path += template.objects[i].parts[1].toPoint.x + ' ' + template.objects[i].parts[1].toPoint.y + ' ' + template.objects[i].parts[1].fromPoint.x + ' ' + template.objects[i].parts[1].fromPoint.y + ' ';
                        path += template.objects[i].parts[0].fromPoint.x + ' ' + template.objects[i].parts[0].fromPoint.y + ' ';
                        break;
                      case 'frame2':
                        path += template.objects[i].parts[0].fromPoint.x + ' ' + template.objects[i].parts[0].fromPoint.y + ' ' + template.objects[i].parts[0].toPoint.x + ' ' + template.objects[i].parts[0].toPoint.y + ' ';
                        path += template.objects[i].parts[1].toPoint.x + ' ' + template.objects[i].parts[0].toPoint.y + ' ' + template.objects[i].parts[1].fromPoint.x + ' ' + template.objects[i].parts[1].fromPoint.y + ' ';
                        path += template.objects[i].parts[0].fromPoint.x + ' ' + template.objects[i].parts[0].fromPoint.y + ' ';
                        break;
                      case 'frame3':
                        if (ProductStor.product.doorShapeId === 2) {
                          //----- inside Al doorstep
                          path += template.objects[i].parts[1].fromPoint.x + ' ' + template.objects[i].parts[0].fromPoint.y + ' ' + template.objects[i].parts[1].toPoint.x + ' ' + template.objects[i].parts[0].toPoint.y + ' ';
                          path += template.objects[i].parts[1].toPoint.x + ' ' + (+template.objects[i].parts[0].toPoint.y - 35) + ' ' + template.objects[i].parts[1].fromPoint.x + ' ' + (+template.objects[i].parts[0].fromPoint.y - 35) + ' ';
                          path += template.objects[i].parts[1].fromPoint.x + ' ' + template.objects[i].parts[0].fromPoint.y + ' ';
                        } else if (ProductStor.product.doorShapeId === 3) {
                          //----- outside Al doorstep
                          path += template.objects[i].parts[0].fromPoint.x + ' ' + template.objects[i].parts[0].fromPoint.y + ' ' + template.objects[i].parts[0].toPoint.x + ' ' + template.objects[i].parts[0].toPoint.y + ' ';
                          path += template.objects[i].parts[0].toPoint.x + ' ' + (+template.objects[i].parts[0].toPoint.y + 20) + ' ' + template.objects[i].parts[0].fromPoint.x + ' ' + (+template.objects[i].parts[0].fromPoint.y + 20) + ' ';
                          path += template.objects[i].parts[0].fromPoint.x + ' ' + template.objects[i].parts[0].fromPoint.y + ' ';
                        }
                        break;
                      case 'frame4':
                        path += template.objects[i].parts[0].fromPoint.x + ' ' + template.objects[i].parts[0].fromPoint.y + ' ' + template.objects[i].parts[0].toPoint.x + ' ' + template.objects[i].parts[0].toPoint.y + ' ';
                        path += template.objects[i].parts[1].toPoint.x + ' ' + template.objects[i].parts[1].toPoint.y + ' ' + template.objects[i].parts[1].fromPoint.x + ' ' + template.objects[i].parts[0].fromPoint.y + ' ';
                        path += template.objects[i].parts[0].fromPoint.x + ' ' + template.objects[i].parts[0].fromPoint.y + ' ';
                        break;
                    }

                  } else {
                    path += template.objects[i].parts[0].fromPoint.x + ' ' + template.objects[i].parts[0].fromPoint.y + ' ' + template.objects[i].parts[0].toPoint.x + ' ' + template.objects[i].parts[0].toPoint.y + ' ';
                    path += template.objects[i].parts[1].toPoint.x + ' ' + template.objects[i].parts[1].toPoint.y + ' ' + template.objects[i].parts[1].fromPoint.x + ' ' + template.objects[i].parts[1].fromPoint.y + ' ';
                    path += template.objects[i].parts[0].fromPoint.x + ' ' + template.objects[i].parts[0].fromPoint.y + ' ';
                  }
                  if (path !== '') {
                    elementsSVG.frames.push(path);
                  }
                  break;

                case 'impost':
                  path += template.objects[i].parts[0].fromPoint.x + ' ' + template.objects[i].parts[0].fromPoint.y + ' ' + template.objects[i].parts[0].toPoint.x + ' ' + template.objects[i].parts[0].toPoint.y + ' ';
                  path += template.objects[i].parts[1].fromPoint.x + ' ' + template.objects[i].parts[1].fromPoint.y + ' ' + template.objects[i].parts[1].toPoint.x + ' ' + template.objects[i].parts[1].toPoint.y + ' ';
                  path += template.objects[i].parts[0].fromPoint.x + ' ' + template.objects[i].parts[0].fromPoint.y + ' ';
                  elementsSVG.imposts.push(path);
                  break;

                case 'sash':
                  path += template.objects[i].parts[0].fromPoint.x + ' ' + template.objects[i].parts[0].fromPoint.y + ' ' + template.objects[i].parts[0].toPoint.x + ' ' + template.objects[i].parts[0].toPoint.y + ' ';
                  path += template.objects[i].parts[1].toPoint.x + ' ' + template.objects[i].parts[1].toPoint.y + ' ' + template.objects[i].parts[1].fromPoint.x + ' ' + template.objects[i].parts[1].fromPoint.y + ' ';
                  path += template.objects[i].parts[0].fromPoint.x + ' ' + template.objects[i].parts[0].fromPoint.y + ' ';
                  elementsSVG.sashes.push(path);

                  //---- open directions lines
                  if (template.objects[i].openType.length > 0) {
                    var middleX = template.objects[i].openType[1].fromPoint.x + ((template.objects[i].openType[1].lengthVal / 2) * (template.objects[i].openType[1].toPoint.x - template.objects[i].openType[1].fromPoint.x) / template.objects[i].openType[1].lengthVal);
                    var middleY = template.objects[i].openType[1].fromPoint.y + ((template.objects[i].openType[1].lengthVal / 2) * (template.objects[i].openType[1].toPoint.y - template.objects[i].openType[1].fromPoint.y) / template.objects[i].openType[1].lengthVal);

                    openSashLine += template.objects[i].openType[0].fromPoint.x + ' ' + template.objects[i].openType[0].fromPoint.y + ' ' + middleX + ' ' + middleY + ' ';
                    openSashLine += template.objects[i].openType[0].toPoint.x + ' ' + template.objects[i].openType[0].toPoint.y + ' ';

                    elementsSVG.openDirections.push(openSashLine);
                  }
                  break;

                case 'bead_box':
                  path += template.objects[i].parts[0].fromPoint.x + ' ' + template.objects[i].parts[0].fromPoint.y + ' ' + template.objects[i].parts[0].toPoint.x + ' ' + template.objects[i].parts[0].toPoint.y + ' ';
                  path += template.objects[i].parts[1].toPoint.x + ' ' + template.objects[i].parts[1].toPoint.y + ' ' + template.objects[i].parts[1].fromPoint.x + ' ' + template.objects[i].parts[1].fromPoint.y + ' ';
                  path += template.objects[i].parts[0].fromPoint.x + ' ' + template.objects[i].parts[0].fromPoint.y + ' ';
                  elementsSVG.beads.push(path);
                  break;

                case 'glass_paсkage':
                  var glass = {path: ''};
                  for (var p = 0; p < template.objects[i].parts.length; p++) {
                    glass.path += template.objects[i].parts[p].fromPoint.x + ' ' + template.objects[i].parts[p].fromPoint.y + ' ' + template.objects[i].parts[p].toPoint.x + ' ' + template.objects[i].parts[p].toPoint.y + ' ';
                  }
                  glass.id = template.objects[i].id;
                  elementsSVG.glasses.push(glass);
                  break;

              }
            }


            //------- Create dimentions

            for (var d = 0; d < template.dimentions.length; d++) {
              var dim = {};
              switch (template.dimentions[d].type) {
                case 'hor':
                  var dimLineY = template.dimentions[d].level * dimLineHeight, newEdgeTop = dimLineY * 2;
                  dim.lines = [];

                  dim.lines[0] = template.dimentions[d].from + ' ' + dimMarginBottom + ' ' + template.dimentions[d].from + ' ' + -(dimLineY + dimEdger);
                  dim.lines[1] = template.dimentions[d].from + ' ' + (-dimLineY) + ' ' + template.dimentions[d].to + ' ' + (-dimLineY);
                  dim.lines[2] = template.dimentions[d].to + ' ' + dimMarginBottom + ' ' + template.dimentions[d].to + ' ' + -(dimLineY + dimEdger);

                  dim.lengthVal = template.dimentions[d].to - template.dimentions[d].from;
                  dim.textX = +template.dimentions[d].from + (dim.lengthVal / 2);
                  dim.textY = -(dimLineY + sizeBoxMarginBottom);
                  dim.type = template.dimentions[d].type;
                  dim.start = template.dimentions[d].from;
                  dim.end = template.dimentions[d].to;
                  dim.min = template.dimentions[d].minDim;
                  dim.max = template.dimentions[d].maxDim;
                  if (template.dimentions[d].id) {
                    dim.id = template.dimentions[d].id;
                  }
                  elementsSVG.dimensionsH.push(dim);

                  if (newEdgeTop > edgeTop) {
                    edgeTop = newEdgeTop;
                  }
                  if (overallDimH < dim.end) {
                    overallDimH = dim.end;
                  }
                  break;
                case 'vert':
                  var dimLineX = template.dimentions[d].level * dimLineHeight, newEdgeLeft = dimLineX * 2;
                  dim.lines = [];

                  dim.lines[0] = dimMarginBottom + ' ' + template.dimentions[d].from + ' ' + -(dimLineX + dimEdger) + ' ' + template.dimentions[d].from;
                  dim.lines[1] = (-dimLineX) + ' ' + template.dimentions[d].from + ' ' + (-dimLineX) + ' ' + template.dimentions[d].to;
                  dim.lines[2] = dimMarginBottom + ' ' + template.dimentions[d].to + ' ' + -(dimLineX + dimEdger) + ' ' + template.dimentions[d].to;

                  dim.lengthVal = template.dimentions[d].to - template.dimentions[d].from;
                  dim.textX = -(dimLineX + sizeBoxMarginBottom);
                  dim.textY = +template.dimentions[d].from + (dim.lengthVal / 2);
                  dim.type = template.dimentions[d].type;
                  dim.start = template.dimentions[d].from;
                  dim.end = template.dimentions[d].to;
                  dim.min = template.dimentions[d].minDim;
                  dim.max = template.dimentions[d].maxDim;
                  if (template.dimentions[d].id) {
                    dim.id = template.dimentions[d].id;
                  }
                  elementsSVG.dimensionsV.push(dim);

                  if (newEdgeLeft > edgeLeft) {
                    edgeLeft = newEdgeLeft;
                  }
                  if (overallDimV < dim.end) {
                    overallDimV = dim.end;
                  }
                  break;
              }

            }
          }

          //------- Drawing elements SVG of construction

          draw = SVG(svg).size(canvasWidth, canvasHeight);
          var mainGroup = draw.group().attr('class', 'svg-pan-zoom_viewport');
          for(var prop in elementsSVG) {
            if (!elementsSVG.hasOwnProperty(prop)) {
              continue;
            }
            var group = mainGroup.group();
            for (var elem = 0; elem < elementsSVG[prop].length; elem++) {
              switch (prop) {
                case 'frames':
                  if(scope.typeConstruction === 'icon') {
                    if(elem === 2 && ProductStor.product.doorShapeId === 2 || elem === 2 && ProductStor.product.doorShapeId === 3) {
                      group.path('M' + elementsSVG[prop][elem] + 'z').attr('class', 'frame-icon doorstep');
                    } else {
                      group.path('M' + elementsSVG[prop][elem] + 'z').attr('class', 'frame-icon');
                    }
                  } else {
                    if(elem === 2 && ProductStor.product.doorShapeId === 2 || elem === 2 && ProductStor.product.doorShapeId === 3) {
                      group.path('M' + elementsSVG[prop][elem] + 'z').attr('class', 'frame doorstep');
                    } else {
                      group.path('M' + elementsSVG[prop][elem] + 'z').attr('class', 'frame');
                    }
                  }
                  break;
                case 'imposts':
                  if(scope.typeConstruction === 'icon') {
                    group.path('M' + elementsSVG[prop][elem] + 'z').attr('class', 'impost-icon');
                  } else {
                    group.path('M' + elementsSVG[prop][elem] + 'z').attr('class', 'impost');
                  }
                  break;
                case 'sashes':
                  if(scope.typeConstruction === 'icon') {
                    group.path('M' + elementsSVG[prop][elem] + 'z').attr('class', 'sash-icon');
                  } else {
                    group.path('M' + elementsSVG[prop][elem] + 'z').attr('class', 'sash');
                  }
                  break;
                case 'beads':
                  if(scope.typeConstruction === 'icon') {
                    group.path('M' + elementsSVG[prop][elem] + 'z').attr('class', 'bead-icon');
                  } else {
                    group.path('M' + elementsSVG[prop][elem] + 'z').attr('class', 'bead');
                  }
                  break;
                case 'glasses':
                  group.path('M' + elementsSVG[prop][elem].path + 'z').attr('class', 'glass').attr('element-id', elementsSVG[prop][elem].id);
                  break;
                case 'openDirections':
                  group.path('M' + elementsSVG[prop][elem] + 'z').attr('class', 'open-direction');
                  break;


                case 'dimensionsH':
                case 'dimensionsV':

                  if(scope.typeConstruction !== 'icon') {
                    //---- draw dimension lines
                    for(var l = 0; l < elementsSVG[prop][elem].lines.length; l++) {
                      if(l === 1) {
                        var line = group.path('M' + elementsSVG[prop][elem].lines[l] + 'z').attr('class', 'size-line');
                        line.marker('start', 30, 30, function(add) {
                          add.path('M 0,0 L -4,-2 0,-4 z').attr('class', 'size-line');
                          add.ref(-5, -2);
                          add.viewbox(-5, -5, 4, 5);
                        });
                        line.marker('mid', 30, 30, function(add) {
                          add.path('M 0,0 L 4,2 0,4 z').attr('class', 'size-line');
                          add.ref(5, 2);
                          add.viewbox(1, -1, 4, 5);
                          if(prop === 'dimensionsV') {
                            add.attr('orient', 90);
                          } else {
                            add.attr('orient', 0);
                          }
                        });

                      } else {
                        group.path('M' + elementsSVG[prop][elem].lines[l] + 'z').attr('class', 'size-line');
                      }
                    }

                    //----- draw dimension size box if construction is editible
                    var groupTxt = group.group().attr('class', sizeClass);

                    if(scope.typeConstruction === 'edit') {
                      var sizeRect = groupTxt.rect(sizeBoxWidth, sizeBoxHeight);
                      sizeRect.attr('class', 'size-rect');

                      var sizeText = groupTxt.text(' ' + elementsSVG[prop][elem].lengthVal + ' ').dx(elementsSVG[prop][elem].textX).dy(elementsSVG[prop][elem].textY);
                      sizeText.attr({
                        'from-point': elementsSVG[prop][elem].start,
                        'to-point': elementsSVG[prop][elem].end,
                        'size-type': elementsSVG[prop][elem].type,
                        'min-val': elementsSVG[prop][elem].min,
                        'max-val': elementsSVG[prop][elem].max
                      });
                      if(elementsSVG[prop][elem].id) {
                        sizeText.attr('id', elementsSVG[prop][elem].id);
                      }

                      if(prop === 'dimensionsH') {
                        sizeRect.cx(elementsSVG[prop][elem].textX).cy(elementsSVG[prop][elem].textY + 5);
                        //sizeText.attr('class', 'size-value-edit');
                      } else if(prop === 'dimensionsV') {
                        sizeRect.cx(elementsSVG[prop][elem].textX).cy(elementsSVG[prop][elem].textY + 5);
                        //sizeRect.cx(elementsSVG[prop][elem].textX - 50).cy(elementsSVG[prop][elem].textY + 5);
                        //sizeText.attr('class', 'size-value-edit-vertical');
                      }
                      sizeText.attr('class', 'size-value-edit');
                      sizeRect.radius(sizeBoxRadius);


                    } else {
                      //----- draw dimension size text
                      var sizeText = groupTxt.text(' ' + elementsSVG[prop][elem].lengthVal + ' ').dx(elementsSVG[prop][elem].textX).dy(elementsSVG[prop][elem].textY);
                      sizeText.attr({
                        'from-point': elementsSVG[prop][elem].start,
                        'to-point': elementsSVG[prop][elem].end,
                        'size-type': elementsSVG[prop][elem].type,
                        'min-val': elementsSVG[prop][elem].min,
                        'max-val': elementsSVG[prop][elem].max
                      });
                      if(elementsSVG[prop][elem].id) {
                        sizeText.attr('id', elementsSVG[prop][elem].id);
                      }

                      sizeText.attr('class', 'size-value');
                    }



                  }
                  break;
              }
            }
          }

          if(scope.typeConstruction === 'icon') {
            draw.viewbox(0, 0, overallDimH, (overallDimV + 20));
          } else  if(scope.typeConstruction === 'bigIcon'){
            draw.viewbox(-edgeLeft, -edgeTop, (overallDimH + edgeLeft), (overallDimV + edgeTop + 20));
          } else if(scope.typeConstruction === 'edit') {
            draw.attr({width: '100%', height: '100%'});
            draw.viewbox(-edgeLeft, -edgeTop, (overallDimH + edgeLeft), (overallDimV + edgeTop));
            draw.attr('id', 'svg-construction');
          }
          return svg;
        }



        //--------- PAN AND PINCH SVG

        var eventsHandler = {
          haltEventListeners: ['touchstart', 'touchend', 'touchmove', 'touchleave', 'touchcancel'],
          init: function(options) {
            var instance = options.instance,
                initialScale = 1,
                pannedX = 0,
                pannedY = 0;

            // Init Hammer
            // Listen only for pointer and touch events
            this.hammer = Hammer(options.svgElement, {
              inputClass: Hammer.SUPPORT_POINTER_EVENTS ? Hammer.PointerEventInput : Hammer.TouchInput
            });

            // Enable pinch
            this.hammer.get('pinch').set({enable: true});

            // Handle double tap
            this.hammer.on('doubletap', function(ev){
              //console.log('ev.type = ', ev.type);
              instance.zoomIn();
            });

            // Handle pan
            this.hammer.on('pan panstart panend', function(ev){
              // On pan start reset panned variables
              //console.log('ev.type = ', ev.type);
              if (ev.type === 'panstart') {
                pannedX = 0;
                pannedY = 0;
              }

              // Pan only the difference
              if (ev.type === 'pan' || ev.type === 'panend') {
                //console.log('p');
                instance.panBy({x: ev.deltaX - pannedX, y: ev.deltaY - pannedY});
                pannedX = ev.deltaX;
                pannedY = ev.deltaY;
              }
            });

            // Handle pinch
            this.hammer.on('pinch pinchstart pinchend', function(ev){
              //console.log('ev.type = ', ev.type);
              // On pinch start remember initial zoom
              if (ev.type === 'pinchstart') {
                initialScale = instance.getZoom();
                instance.zoom(initialScale * ev.scale);
              }

              // On pinch zoom
              if (ev.type === 'pinch' || ev.type === 'pinchend') {
                instance.zoom(initialScale * ev.scale);
              }
            });

            // Prevent moving the page on some devices when panning over SVG
            options.svgElement.addEventListener('touchmove', function(e){ e.preventDefault(); });
          },//--- init

          destroy: function(){
            this.hammer.destroy();
          }
        };

        var beforePan = function(oldPan, newPan){
          var stopHorizontal = false,
              stopVertical = false,
              gutterWidth = 200,
              gutterHeight = 200,
              // Computed variables
              sizes = this.getSizes(),
              leftLimit = -((sizes.viewBox.x + sizes.viewBox.width) * sizes.realZoom) + gutterWidth,
              rightLimit = sizes.width - gutterWidth - (sizes.viewBox.x * sizes.realZoom),
              topLimit = -((sizes.viewBox.y + sizes.viewBox.height) * sizes.realZoom) + gutterHeight,
              bottomLimit = sizes.height - gutterHeight - (sizes.viewBox.y * sizes.realZoom),
              customPan = {};

          customPan.x = Math.max(leftLimit, Math.min(rightLimit, newPan.x));
          customPan.y = Math.max(topLimit, Math.min(bottomLimit, newPan.y));
          return customPan;
        };


        function startPinch() {
          var svgElement = document.getElementById('svg-construction');
          //console.log('svgElement', svgElement);
          // Expose to window namespace for testing purposes
          window.panZoom = svgPanZoom(svgElement, {
            zoomEnabled: true,
            controlIconsEnabled: false,
            zoomScaleSensitivity: 0.1,
            fit: 1,
            center: 1,
            refreshRate: 'auto',
            beforePan: beforePan,
            customEventsHandler: eventsHandler
          });
        }

      }
    };



  }
})();
