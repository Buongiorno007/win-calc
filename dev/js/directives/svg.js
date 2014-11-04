'use strict';

//BauVoiceApp.directive('svgTemplate', ['$compile', function($compile) {
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
      //$compile(temp)(scope);
      //$compile(elem.contents())(scope);

      scope.$watch(scope.template, function () {
        buildTemplateSVG(scope.template, scope.templateWidth, scope.templateHeight);
      });


      function buildTemplateSVG(template, canvasWidth, canvasHeight) {
        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"),
            draw = SVG(svg).size(canvasWidth, canvasHeight),
            sizeClass = 'size-box',
            sizeEditClass = 'size-box-edited';

        draw.viewbox(-300, -300, 2000, 2000);
        //draw.attr('preserveAspectRatio', "xMinYMin meet");
        var elementsSVG = {
          frames: [],
          glasses: [],
          imposts: [],
          sashes: [],
          dimensionsH: [],
          dimensionsV: []
        };

        for (var i = 0; i < template.objects.length; i++) {
          var path = '';
          switch(template.objects[i].type) {
            case 'frame':
              //for(var p = 0; p < template.objects[i].parts.length; p++) {
              path += template.objects[i].parts[0].fromPoint.x + ' ' + template.objects[i].parts[0].fromPoint.y + ' ' + template.objects[i].parts[0].toPoint.x + ' ' + template.objects[i].parts[0].toPoint.y + ' ';
              path += template.objects[i].parts[1].toPoint.x + ' ' + template.objects[i].parts[1].toPoint.y + ' ' + template.objects[i].parts[1].fromPoint.x + ' ' + template.objects[i].parts[1].fromPoint.y + ' ';
              path += template.objects[i].parts[0].fromPoint.x + ' ' + template.objects[i].parts[0].fromPoint.y + ' ';
              //}
              elementsSVG.frames.push(path);
              break;
            case 'glass_paсkage':
              for(var p = 0; p < template.objects[i].parts.length; p++) {
                path += template.objects[i].parts[p].fromPoint.x + ' ' + template.objects[i].parts[p].fromPoint.y + ' ' + template.objects[i].parts[p].toPoint.x + ' ' + template.objects[i].parts[p].toPoint.y + ' ';
              }
              elementsSVG.glasses.push(path);
              break;
            case 'dimensionsH':
              //for(var p = 0; p < template.objects[i].parts.length; p++) {
                var dim = {},
                    height = template.objects[i].height * template.objects[i].level;
                dim.lines = [];
                dim.lines[0] = template.objects[i].fromPoint.x  + ' ' +
                  template.objects[i].fromPoint.y  + ' ' +
                  template.objects[i].fromPoint.x  + ' ' +
                  (template.objects[i].fromPoint.y -  height);
                dim.lines[1] = template.objects[i].fromPoint.x  + ' ' +
                  (template.objects[i].fromPoint.y -  height / 2) + ' ' +
                  template.objects[i].toPoint.x   + ' ' +
                  (template.objects[i].fromPoint.y -  height / 2);
                dim.lines[2] = template.objects[i].toPoint.x   + ' ' +
                  (template.objects[i].toPoint.y -  height) + ' ' +
                  template.objects[i].toPoint.x   + ' ' +
                  template.objects[i].toPoint.y;

                dim.lengthVal =  template.objects[i].lengthVal;
                dim.textX = (template.objects[i].lengthVal / 2);
                dim.textY = (-height);
                dim.id = template.objects[i].id;
              //}
              elementsSVG.dimensionsH.push(dim);
              break;

            case 'dimensionsV':

              var dim = {},
                  height = template.objects[i].height * template.objects[i].level;
              dim.lines = [];
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

              dim.lengthVal =  template.objects[i].lengthVal;
              dim.textX = (-height);
              dim.textY = (template.objects[i].lengthVal / 2);
              dim.id = template.objects[i].id;
              elementsSVG.dimensionsV.push(dim);
              break;

          }
        }
        console.log(elementsSVG);
        for(var prop in elementsSVG) {
          if (!elementsSVG.hasOwnProperty(prop)) {
            continue;
          }
          var group = draw.group();
          for (var elem = 0; elem < elementsSVG[prop].length; elem++) {

            switch (prop) {
              case 'frames':
                group.path('M' + elementsSVG[prop][elem] + 'z').attr('class', 'frame');
                break;

              case 'glasses':
                group.path('M' + elementsSVG[prop][elem] + 'z').attr('class', 'glass');
                break;

              case 'dimensionsH':
              case 'dimensionsV':

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
                      }
                    });

                  } else {
                    group.path('M' + elementsSVG[prop][elem].lines[l] + 'z').attr('class', 'size-line');
                  }
                }

                // Create box
                var groupTxt = group.group().attr('class', sizeClass);
                if(scope.typeConstruction === 'edit') {
                  if(prop === 'dimensionsH') {
                    groupTxt.rect(250, 120).attr('class', 'size-rect').cx(elementsSVG[prop][elem].textX).cy(elementsSVG[prop][elem].textY - 10).radius(35);
                  } else if(prop === 'dimensionsV') {
                    groupTxt.rect(250, 120).attr('class', 'size-rect').cx(elementsSVG[prop][elem].textX - 90).cy(elementsSVG[prop][elem].textY - 10).radius(35);
                  }
                }

                // Create sizeText
                var dimension = groupTxt.text(' ' + elementsSVG[prop][elem].lengthVal + ' ').dx(elementsSVG[prop][elem].textX).dy(elementsSVG[prop][elem].textY);
                if(prop === 'dimensionsV') {
                  dimension.attr({class: 'size-value-vertical', id: elementsSVG[prop][elem].id});
                } else {
                  dimension.attr({class: 'size-value', id: elementsSVG[prop][elem].id});
                }

                // Click on size
                groupTxt.click(function() {
                  if(scope.typeConstruction === 'edit') {
                    if (this.hasClass(sizeEditClass)) {
                      deactiveSizeBox();
                      $('.size-calculator').removeClass('active');
                    } else {
                      if(!$('.size-calculator').hasClass('active')) {
                        deactiveSizeBox();
                        this.toggleClass(sizeClass);
                        this.toggleClass(sizeEditClass);
                        $('.size-calculator').addClass('active');
                      }
                    }
                  }
                });


                break;

            }
          }
        }

        function deactiveSizeBox() {
          $('g.size-box-edited').each(function () {
            this.instance.removeClass(sizeEditClass);
            this.instance.addClass(sizeClass);
          });
        }

        return svg;
      }
    }
  };
}]);