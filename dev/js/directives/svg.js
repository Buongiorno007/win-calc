'use strict';

BauVoiceApp.directive('svgTemplate', [ function() {

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
      var svg = buildTemplateSVG(scope.template, scope.templateWidth, scope.templateHeight);
      elem.html(svg);

      scope.$watch('template', function () {
        var svg = buildTemplateSVG(scope.template, scope.templateWidth, scope.templateHeight);
        elem.html(svg);
      });

      function buildTemplateSVG(template, canvasWidth, canvasHeight) {
        //console.log(template);
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
            },
            //coefScaleW = 0.75,
            //coefScaleH = 0.5,
            coefScaleW = 0.6,
            coefScaleH = 0.35,
            overallDimH = 2000,
            overallDimV = 2000,
            edgeTop = 300,
            edgeLeft = 250,
            coefScrollW = 0.55,
            //sizeBoxWidth = 250,
            //sizeBoxHeight = 120,
            //sizeBoxRadius = 35,

            sizeBoxWidth = 160,
            sizeBoxHeight = 70,
            sizeBoxRadius = 20;



        //------- Create elements of construction
        for (var i = 0; i < template.objects.length; i++) {
          var path = '',
              openSashLine = '';

          switch(template.objects[i].type) {
            case 'frame':
              //for(var p = 0; p < template.objects[i].parts.length; p++) {
              path += template.objects[i].parts[0].fromPoint.x + ' ' + template.objects[i].parts[0].fromPoint.y + ' ' + template.objects[i].parts[0].toPoint.x + ' ' + template.objects[i].parts[0].toPoint.y + ' ';
              path += template.objects[i].parts[1].toPoint.x + ' ' + template.objects[i].parts[1].toPoint.y + ' ' + template.objects[i].parts[1].fromPoint.x + ' ' + template.objects[i].parts[1].fromPoint.y + ' ';
              path += template.objects[i].parts[0].fromPoint.x + ' ' + template.objects[i].parts[0].fromPoint.y + ' ';
              //}
              elementsSVG.frames.push(path);
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
              if(template.objects[i].openType.length > 0) {
                var middleX = template.objects[i].openType[1].fromPoint.x + ((template.objects[i].openType[1].lengthVal/2) * (template.objects[i].openType[1].toPoint.x - template.objects[i].openType[1].fromPoint.x) / template.objects[i].openType[1].lengthVal);
                var middleY = template.objects[i].openType[1].fromPoint.y + ((template.objects[i].openType[1].lengthVal/2) * (template.objects[i].openType[1].toPoint.y - template.objects[i].openType[1].fromPoint.y) / template.objects[i].openType[1].lengthVal);

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
              for(var p = 0; p < template.objects[i].parts.length; p++) {
                glass.path += template.objects[i].parts[p].fromPoint.x + ' ' + template.objects[i].parts[p].fromPoint.y + ' ' + template.objects[i].parts[p].toPoint.x + ' ' + template.objects[i].parts[p].toPoint.y + ' ';
              }
              glass.id = template.objects[i].id;
              elementsSVG.glasses.push(glass);
              break;

            case 'dimensionsH':
              var dim = {},
                  height = template.objects[i].height * template.objects[i].level,
                  heightSizeLine = height;
                  dim.lines = [];

              if(template.objects[i].side === 'top') {
                if(+template.objects[i].level > 1) {
                  heightSizeLine = template.objects[i].height * template.objects[i].level/1.5;
                  edgeTop = heightSizeLine * 2;
                }

                dim.lines[0] = template.objects[i].fromPoint.x  + ' ' +
                  template.objects[i].fromPoint.y  + ' ' +
                  template.objects[i].fromPoint.x  + ' ' +
                  (template.objects[i].fromPoint.y -  heightSizeLine);
                dim.lines[1] = template.objects[i].fromPoint.x  + ' ' +
                  (template.objects[i].fromPoint.y -  height / 2) + ' ' +
                  template.objects[i].toPoint.x   + ' ' +
                  (template.objects[i].fromPoint.y -  height / 2);
                dim.lines[2] = template.objects[i].toPoint.x   + ' ' +
                  (template.objects[i].toPoint.y -  heightSizeLine) + ' ' +
                  template.objects[i].toPoint.x   + ' ' +
                  template.objects[i].toPoint.y;

                dim.textY = (-heightSizeLine);

              } else if(template.objects[i].side === 'bottom') {
                dim.lines[0] = template.objects[i].fromPoint.x  + ' ' +
                  template.objects[i].fromPoint.y  + ' ' +
                  template.objects[i].fromPoint.x  + ' ' +
                  (+template.objects[i].fromPoint.y +  height);
                dim.lines[1] = template.objects[i].fromPoint.x  + ' ' +
                  (+template.objects[i].fromPoint.y +  height / 2) + ' ' +
                  template.objects[i].toPoint.x   + ' ' +
                  (+template.objects[i].fromPoint.y +  height / 2);
                dim.lines[2] = template.objects[i].toPoint.x   + ' ' +
                  (+template.objects[i].toPoint.y +  height) + ' ' +
                  template.objects[i].toPoint.x   + ' ' +
                  template.objects[i].toPoint.y;

                dim.textY = (+template.objects[i].toPoint.y + height * 1.5);
              }

              dim.lengthVal =  template.objects[i].lengthVal;
              dim.textX = + template.objects[i].fromPoint.x + (template.objects[i].lengthVal / 2);
              dim.id = template.objects[i].id;
              dim.sizeType = template.objects[i].type;
              if(template.objects[i].limits) {
                dim.limits = template.objects[i].limits;
              }
              elementsSVG.dimensionsH.push(dim);

              //-------- scale svg
              if (template.objects[i].id === 'overallDimH') {
                if(scope.typeConstruction !== 'icon' && scope.typeConstruction !== 'bigIcon') {
                  canvasWidth = template.objects[i].lengthVal + edgeLeft;
                  overallDimH = canvasWidth / coefScaleW;
                }
              }
              break;

            case 'dimensionsV':
              var dim = {},
                  height = template.objects[i].height * template.objects[i].level;
                  dim.lines = [];

              if(template.objects[i].side === 'right') {
                dim.lines[0] = template.objects[i].fromPoint.x  + ' ' +
                  template.objects[i].fromPoint.y  + ' ' +
                  (+template.objects[i].fromPoint.x +  height) + ' ' +
                  template.objects[i].fromPoint.y;
                dim.lines[1] = (+template.objects[i].fromPoint.x +  height / 2) + ' ' +
                  template.objects[i].fromPoint.y + ' ' +
                  (+template.objects[i].toPoint.x  +  height / 2) + ' ' +
                  template.objects[i].toPoint.y;
                dim.lines[2] = template.objects[i].toPoint.x  + ' ' +
                  template.objects[i].toPoint.y + ' ' +
                  (+template.objects[i].toPoint.x +  height) + ' ' +
                  template.objects[i].toPoint.y;

                dim.textX = (+template.objects[i].toPoint.x + height * 2);
              } else if(template.objects[i].side === 'left') {
                dim.lines[0] = template.objects[i].fromPoint.x  + ' ' +
                  template.objects[i].fromPoint.y  + ' ' +
                  (template.objects[i].fromPoint.x -  height) + ' ' +
                  template.objects[i].fromPoint.y;
                dim.lines[1] = (template.objects[i].fromPoint.x -  height / 2) + ' ' +
                  template.objects[i].fromPoint.y + ' ' +
                  (template.objects[i].toPoint.x  -  height / 2) + ' ' +
                  template.objects[i].toPoint.y;
                dim.lines[2] = template.objects[i].toPoint.x  + ' ' +
                  template.objects[i].toPoint.y + ' ' +
                  (template.objects[i].toPoint.x -  height) + ' ' +
                  template.objects[i].toPoint.y;

                dim.textX = (-height);
                if(+template.objects[i].level > 1) {
                  edgeLeft = height * 2;
                  //console.log('edgeLeft = '+edgeLeft);
                }

              }

              dim.lengthVal =  template.objects[i].lengthVal;
              dim.textY = (template.objects[i].lengthVal / 2);
              dim.id = template.objects[i].id;
              dim.sizeType = template.objects[i].type;
              if(template.objects[i].limits) {
                dim.limits = template.objects[i].limits;
              }
              elementsSVG.dimensionsV.push(dim);

              //-------- scale svg
              if (template.objects[i].id === 'overallDimV') {
                if(scope.typeConstruction !== 'icon' && scope.typeConstruction !== 'bigIcon') {
                  canvasHeight = template.objects[i].lengthVal + edgeTop;
                  overallDimV = canvasHeight / coefScaleH;
                  //canvasHeight += edgeTop;
                }
              }

              break;
          }
        }
        //console.log(elementsSVG);

        //------- Drawing elements SVG of construction

        draw = SVG(svg).size(canvasWidth, canvasHeight);
        //draw.viewbox(-300, -300, 2000, 2000);
        for(var prop in elementsSVG) {
          if (!elementsSVG.hasOwnProperty(prop)) {
            continue;
          }
          var group = draw.group();
          for (var elem = 0; elem < elementsSVG[prop].length; elem++) {
            switch (prop) {
              case 'frames':
                if(scope.typeConstruction === 'icon') {
                  group.path('M' + elementsSVG[prop][elem] + 'z').attr('class', 'frame-icon');
                } else {
                  group.path('M' + elementsSVG[prop][elem] + 'z').attr('class', 'frame');
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
                /*if(scope.typeConstruction === 'edit') {
                  group.path('M' + elementsSVG[prop][elem] + 'z').attr('class', 'glass-active');
                } else {*/
                  group.path('M' + elementsSVG[prop][elem].path + 'z').attr('class', 'glass').attr('element-id', elementsSVG[prop][elem].id);
                //}
                break;
              case 'openDirections':
                group.path('M' + elementsSVG[prop][elem] + 'z').attr('class', 'open-direction');
                break;


              case 'dimensionsH':
              case 'dimensionsV':

                if(scope.typeConstruction === 'icon') {
                  if (prop === 'dimensionsV') {
                    if (elementsSVG[prop][elem].id === 'overallDimV') {
                      overallDimV = elementsSVG[prop][elem].lengthVal;
                    }
                  } else {
                    if (elementsSVG[prop][elem].id === 'overallDimH') {
                      overallDimH = elementsSVG[prop][elem].lengthVal;
                    }
                  }
                  edgeTop = edgeLeft = 0;
                } else {

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

                  //----- draw dimension size box if construction is aditible
                  var groupTxt = group.group().attr('class', sizeClass);
                  if(scope.typeConstruction === 'edit') {
                    if(prop === 'dimensionsH') {
                      groupTxt.rect(sizeBoxWidth, sizeBoxHeight).attr('class', 'size-rect').cx(elementsSVG[prop][elem].textX).cy(elementsSVG[prop][elem].textY + 5).radius(sizeBoxRadius);
                    } else if(prop === 'dimensionsV') {
                      groupTxt.rect(sizeBoxWidth, sizeBoxHeight).attr('class', 'size-rect').cx(elementsSVG[prop][elem].textX - 50).cy(elementsSVG[prop][elem].textY + 5).radius(sizeBoxRadius);
                    }
                  }

                  //----- draw dimension size text
                  var sizeText = groupTxt.text(' ' + elementsSVG[prop][elem].lengthVal + ' ').dx(elementsSVG[prop][elem].textX).dy(elementsSVG[prop][elem].textY);
                  /*
                   if(prop === 'dimensionsV') {
                   sizeText.attr({id: elementsSVG[prop][elem].id});
                   } else {
                   sizeText.attr({id: elementsSVG[prop][elem].id});
                   }
                   */
                  sizeText.attr({id: elementsSVG[prop][elem].id});
                  sizeText.attr({limits: elementsSVG[prop][elem].limits});
                  sizeText.attr({type: elementsSVG[prop][elem].sizeType});

                  if(scope.typeConstruction === 'edit') { //----- if construction is aditible
                    if(prop === 'dimensionsV') {
                      sizeText.attr('class', 'size-value-edit-vertical');
                    } else {
                      sizeText.attr('class', 'size-value-edit');
                    }
                  } else {
                    if(prop === 'dimensionsV') {
                      sizeText.attr('class', 'size-value-vertical');
                    } else {
                      sizeText.attr('class', 'size-value');
                    }
                  }

                  // Click on size
                  groupTxt.click(function() {
                    if(scope.typeConstruction === 'edit' && !scope.$parent.global.isConstructSizeCalculator) {
                      deactiveSizeBox(sizeEditClass, sizeClass);
                      this.toggleClass(sizeClass);
                      this.toggleClass(sizeEditClass);
                    }
                  });
                }

                if(scope.typeConstruction === 'bigIcon') {
                  if (prop === 'dimensionsV') {
                    if (elementsSVG[prop][elem].id === 'overallDimV') {
                      overallDimV = elementsSVG[prop][elem].lengthVal + edgeTop;
                    }
                  } else {
                    if (elementsSVG[prop][elem].id === 'overallDimH') {
                      overallDimH = elementsSVG[prop][elem].lengthVal + edgeLeft;
                    }
                  }
                }


                break;
            }
          }
        }

        var divW = $('.construction-scrollbox').width();
          //var mid = ((canvasWidth - edgeLeft*2)/2 - divW/2);
        var mid = ((canvasWidth)/2 - divW/2) * coefScrollW;
        //console.log('edgeLeft = ' + edgeLeft);
        //console.log('overallDimH = ' + overallDimH);
        //console.log('divW = ' + divW);
        //console.log('canvasWidth =' + canvasWidth);
        //console.log('mid = ' + mid);
          $('.construction-scrollbox').scrollLeft( mid );

          //console.log($('.construction-scrollbox').scrollLeft());


        draw.viewbox(-edgeLeft, -edgeTop, overallDimH, overallDimV);
        return svg;
      }
    }
  };
}]);