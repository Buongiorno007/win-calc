/* globals d3, startRecognition, parseStringToDimension, playTTS */
(function () {
  'use strict';
  /**@ngInject*/
  angular
    .module('DesignModule')
    .factory('DesignServ',

      function ($rootScope,
        $location,
        $timeout,
        $filter,
        $q,
        globalConstants,
        GeneralServ,
        localDB,
        loginServ,
        MainServ,
        AnalyticsServ,
        SVGServ,
        GlobalStor,
        DesignStor,
        OrderStor,
        ProductStor,
        AuxStor,
        UserStor) {
        /*jshint validthis:true */
        var thisFactory = this,
          clickEvent = (GlobalStor.global.isDevice) ? 'touchstart' : 'mousedown';
        var isIE = /*@cc_on!@*/ false || !!document.documentMode;
        var isEdge = !isIE && !!window.StyleMedia;

        /**============ METHODS ================*/


        function hideAllDimension() {
          d3.selectAll('#' + globalConstants.SVG_ID_EDIT + ' .dim_blockX').classed('dim_shiftX', false);
          d3.selectAll('#' + globalConstants.SVG_ID_EDIT + ' .dim_blockY').classed('dim_shiftY', false);
          d3.selectAll('#' + globalConstants.SVG_ID_EDIT + ' .dim_block').classed('dim_hidden', true);
        }


        function hideCornerMarks() {
          DesignStor.design.selectedCorner.length = 0;
          d3.selectAll('#' + globalConstants.SVG_ID_EDIT + ' .corner_mark')
            .transition()
            .duration(300)
            .ease("linear")
            .attr('r', 0);
        }

        function deselectAllImpost() {
          DesignStor.design.selectedImpost.length = 0;
          d3.selectAll('#' + globalConstants.SVG_ID_EDIT + ' [item_type=impost]').classed('frame-active', false);
        }


        function deselectAllArc() {
          DesignStor.design.selectedArc.length = 0;
          d3.selectAll('#' + globalConstants.SVG_ID_EDIT + ' .frame').classed('active_svg', false);
        }


        function deselectAllGlass() {
          DesignStor.design.selectedGlass.length = 0;
          GlobalStor.global.showAllGlass = 0;
          d3.selectAll('#' + globalConstants.SVG_ID_EDIT + ' .glass').classed('glass-active', false);
        }

        function deselectAllDimension() {
          d3.selectAll('#' + globalConstants.SVG_ID_EDIT + ' .size-rect').classed('active', false);
          d3.selectAll('#' + globalConstants.SVG_ID_EDIT + ' .size-txt-edit').classed('active', false);
          d3.selectAll('#' + globalConstants.SVG_ID_EDIT + ' .size-rect-rehau').classed('active', false);
          d3.selectAll('#' + globalConstants.SVG_ID_EDIT + ' .size-txt-edit-rehau').classed('active', false);
        }


        function hideSizeTools() {
          deselectAllDimension();
          GlobalStor.global.isSizeCalculator = 0;
          DesignStor.design.openVoiceHelper = 0;

        }


        function showErrorInBlock(blockID, svgSelector) {
          var idSVG = svgSelector || globalConstants.SVG_ID_EDIT,
            currGlass = d3.select('#' + idSVG + ' .glass[block_id=' + blockID + ']'),
            i = 1;
          currGlass.classed('error_glass', true);
          var interval = setInterval(function () {
            if (i === 11) {
              clearInterval(interval);
            }
            if (i % 2) {
              currGlass.classed('error_glass', false);
            } else {
              currGlass.classed('error_glass', true);
            }
            i += 1;
          }, 50);
        }


        function removeAllEventsInSVG() {
          //--------- delete click on imposts
          d3.selectAll('#' + globalConstants.SVG_ID_EDIT + ' [item_type=impost]')
            .each(function () {
              d3.select(this).on(clickEvent, null);
            });
          //--------- delete click on glasses
          d3.selectAll('#' + globalConstants.SVG_ID_EDIT + ' .glass')
            .each(function () {
              d3.select(this).on(clickEvent, null);
            });
          //--------- delete click on arcs
          d3.selectAll('#' + globalConstants.SVG_ID_EDIT + ' .frame')
            .each(function () {
              d3.select(this).on(clickEvent, null);
            });
          //--------- delete click on dimension
          d3.selectAll('#' + globalConstants.SVG_ID_EDIT + ' .size-box')
            .each(function () {
              d3.select(this).on(clickEvent, null);
            });
          //--------- delete event listener for keydown
          d3.select(window).on('keydown', null);
        }


        function removeGlassEventsInSVG() {
          //--------- delete click on glasses
          d3.selectAll('#' + globalConstants.SVG_ID_GLASS + ' .glass')
            .each(function () {
              d3.select(this).on(clickEvent, null)
                .classed('glass-active', false);
            });
          d3.selectAll('#' + globalConstants.SVG_ID_GRID + ' .glass')
            .each(function () {
              d3.select(this).on(clickEvent, null)
                .classed('glass-active', false);
            });
          //--------- delete event listener for keydown
          d3.select(window).on('keydown', null);
        }


        /**=============== CHANGE CONSTRUCTION SIZE ==============*/


        /**----------- Close Size Calculator -----------*/
        function cleanTempSize() {
          DesignStor.design.tempSize.length = 0;
          DesignStor.design.isMinSizeRestriction = 0;
          DesignStor.design.isMaxSizeRestriction = 0;
          DesignStor.design.isDimExtra = 0;
          DesignStor.design.isSquareExtra = 0;
        }


        function culcHeightQByRadiusCurve(lineLength, radius) {
          return GeneralServ.roundingValue((radius - Math.sqrt(Math.pow(radius, 2) - Math.pow(lineLength, 2) / 4)), 1);
        }


        /**-------- change point coordinates in templateSource --------*/
        function addNewSizeInTemplate(newLength) {
            var blocks = DesignStor.design.templateSourceTEMP.details,
            curDimType = DesignStor.design.oldSize.attributes[5].nodeValue,
            curBlockId = DesignStor.design.oldSize.attributes[6].nodeValue,
            dimId = DesignStor.design.oldSize.attributes[10].nodeValue,
            startSize = +DesignStor.design.oldSize.attributes[11].nodeValue,
            finishSize = +DesignStor.design.oldSize.attributes[12].nodeValue,
            axis = DesignStor.design.oldSize.attributes[13].nodeValue,
            level = +DesignStor.design.oldSize.attributes[14].nodeValue,
            newCoord = startSize + newLength,
            newCoordLast = finishSize - newLength,
            blocksQty = blocks.length,
            isLastDim = 0,
            overall = [],
            overallQty, newHeightQ, b, i, pointsQQty, pointsOutQty;
          if (isEdge) {
            axis = DesignStor.design.oldSize.attributes[7].nodeValue;
            dimId = DesignStor.design.oldSize.attributes[11].nodeValue;
            startSize = +DesignStor.design.oldSize.attributes[12].nodeValue;
            finishSize = +DesignStor.design.oldSize.attributes[13].nodeValue;
            curDimType = DesignStor.design.oldSize.attributes[5].nodeValue;
            curBlockId = DesignStor.design.oldSize.attributes[6].nodeValue;
            newCoord = startSize + newLength;
            newCoordLast = finishSize - newLength;
          }

          //---- save last step
          DesignStor.design.designSteps.push(angular.copy(DesignStor.design.templateSourceTEMP));

          //console.log('SIZE ````````newLength````````', newLength);
          //console.log('SIZE ````````oldSize````````', DesignStor.design.oldSize.attributes);

          if (curDimType === 'curve') {
            /** changing Radius */
            newHeightQ = culcHeightQByRadiusCurve(startSize, newLength);

            mainFor: for (b = 1; b < blocksQty; b += 1) {
              if (blocks[b].id === curBlockId) {
                //-------- search in PointsQ
                if (blocks[b].pointsQ) {
                  pointsQQty = blocks[b].pointsQ.length;
                  while (--pointsQQty > -1) {
                    if (blocks[b].pointsQ[pointsQQty].id === dimId) {
                      blocks[b].pointsQ[pointsQQty].heightQ = newHeightQ;
                      break mainFor;
                    }
                  }
                }
                //-------- search in Imposts
                if (blocks[b].impost) {
                  if (blocks[b].impost.impostAxis[2].id === dimId) {
                    blocks[b].impost.impostAxis[2].heightQ = newHeightQ;
                    break mainFor;
                  }
                }

              }
            }

          } else if (dimId.indexOf('qa') + 1) {
            /** changing Arc Height */

            for (b = 1; b < blocksQty; b += 1) {
              if (blocks[b].level === 1) {
                pointsQQty = blocks[b].pointsQ.length;
                if (pointsQQty) {
                  while (--pointsQQty > -1) {
                    if (blocks[b].pointsQ[pointsQQty].id === dimId) {
                      blocks[b].pointsQ[pointsQQty].heightQ = newLength;
                      //console.log('ARC height=====', blocks[b].pointsQ[pointsQQty]);
                    }
                  }
                }
              }
            }

          } else {
            /** changing Line dimension */
            //------- defined last dim for inside dimensions
            if (!level) {
              //------- collect overall dimensions
              for (b = 1; b < blocksQty; b += 1) {
                if (blocks[b].level === 1) {
                  overall.push(GeneralServ.getMaxMinCoord(blocks[b].pointsOut));
                }
              }
              //------- check current dimension with overall
              overallQty = overall.length;
              while (--overallQty > -1) {
                if (axis === 'x') {
                  if (overall[overallQty].maxX === finishSize) {
                    isLastDim = 1;
                  }
                } else if (axis === 'y') {
                  if (overall[overallQty].maxY === finishSize) {
                    isLastDim = 1;
                  }
                }
              }
            }

            for (b = 1; b < blocksQty; b += 1) {
              pointsOutQty = blocks[b].pointsOut.length;
              if (pointsOutQty) {
                while (--pointsOutQty > -1) {
                  //------ if not last dimension
                  if (!isLastDim) {

                    if (axis === 'x') {
                      if (blocks[b].pointsOut[pointsOutQty].x === finishSize) {
                        blocks[b].pointsOut[pointsOutQty].x = newCoord;
                      } else {
                        if (blocks[b].pointsOut[pointsOutQty].x !== startSize) {

                          if (blocks[b].pointsOut[pointsOutQty].id === "fp6" ||
                            blocks[b].pointsOut[pointsOutQty].id === "fp7" ||
                            blocks[b].pointsOut[pointsOutQty].id === "fp9" ||
                            blocks[b].pointsOut[pointsOutQty].id === "fp10" ||
                            blocks[b].pointsOut[pointsOutQty].id === "fp11" ||
                            blocks[b].pointsOut[pointsOutQty].id === "fp12"
                          ) {
                            blocks[b].pointsOut[pointsOutQty].x = blocks[b].pointsOut[pointsOutQty].x - (finishSize - newCoord);
                          }
                        }
                      }
                    } else if (axis === 'y') {
                      if (blocks[b].pointsOut[pointsOutQty].y === finishSize) {
                        blocks[b].pointsOut[pointsOutQty].y = newCoord;
                      }
                    }
                  }
                }
              }
              if (blocks[b].impost) {
                for (i = 0; i < 2; i += 1) {
                  //------ if last dimension
                  if (isLastDim) {
                    if (axis === 'x') {
                      if (blocks[b].impost.impostAxis[i].x === startSize) {
                        blocks[b].impost.impostAxis[i].x = newCoordLast;
                      }
                    } else if (axis === 'y') {
                      if (blocks[b].impost.impostAxis[i].y === startSize) {
                        blocks[b].impost.impostAxis[i].y = newCoordLast;
                      }
                    }
                  } else {
                    if (axis === 'x') {
                      if (blocks[b].impost.impostAxis[i].x === finishSize) {
                        blocks[b].impost.impostAxis[i].x = newCoord;
                      }
                    } else if (axis === 'y') {
                      if (blocks[b].impost.impostAxis[i].y === finishSize) {
                        blocks[b].impost.impostAxis[i].y = newCoord;
                      }
                    }
                  }
                }
              }
            }

          }
        }


        /**---------- add new size in parent block in order to recalculate overall square -----------*/
        function rebuildPointsOut(newLength) {
          var blocks = DesignStor.design.templateTEMP.details,
            blocksQty = blocks.length,
            startSize = +DesignStor.design.oldSize.attributes[11].nodeValue,
            oldSizeValue = +DesignStor.design.oldSize.attributes[12].nodeValue,
            axis = DesignStor.design.oldSize.attributes[13].nodeValue,
            newPointsOut, b, pointsOutQty, isRealBlock;

          for (b = 1; b < blocksQty; b += 1) {
            if (blocks[b].level === 1) {
              pointsOutQty = blocks[b].pointsOut.length;
              if (pointsOutQty) {
                isRealBlock = 0;
                isRealBlock = blocks[b].pointsOut.some(function (item) {
                  if (axis === 'x') {
                    return item.x === oldSizeValue;
                  } else if (axis === 'y') {
                    return item.y === oldSizeValue;
                  }
                });
                if (isRealBlock) {
                  newPointsOut = blocks[b].pointsOut;
                  while (--pointsOutQty > -1) {
                    if (axis === 'x') {
                      if (blocks[b].pointsOut[pointsOutQty].x === oldSizeValue) {
                        newPointsOut[pointsOutQty].x = startSize + newLength;
                      } else {
                        if (blocks[b].pointsOut[pointsOutQty].id === "fp6" || blocks[b].pointsOut[pointsOutQty].id === "fp7") {
                          newPointsOut[pointsOutQty].x = newPointsOut[pointsOutQty].x - (oldSizeValue - newLength);
                        }
                      }
                    } else if (axis === 'y') {
                      if (blocks[b].pointsOut[pointsOutQty].y === oldSizeValue) {
                        newPointsOut[pointsOutQty].y = startSize + newLength;
                      }
                    }
                  }
                }
              }
            }
          }
          return newPointsOut;
        }


        function checkSize(res, construction_type) {
          GlobalStor.global.timeoutFunc = 0;
          try {
            res = res.priceElements.sashesBlock;
            if (res.length > 0) {
              var heightT = [],
                widthT = [];
              if (ProductStor.product.construction_type === 4 || construction_type === 4) {
                widthT = (res[0].sizes) ? res[0].sizes[0] : 0;
                heightT = (res[0].sizes) ? res[0].sizes[1] : 0;
                size(res);
                return {
                  widthT: widthT,
                  heightT: heightT
                }
              }
            }
          } catch (e) {
            console.log(e.message);
          }
        }

        function size(res) {
          var intervalID = setInterval(function () {
            if (ProductStor.product.doorLock.width_min) {
              clearInterval(intervalID);
              var heightT = 0,
                widthT = 0;
              var product = ProductStor.product.doorLock;
              for (var x = 0; x < res.length; x += 1) {
                if (GlobalStor.global.checkDoors !== 1) {
                  widthT = GlobalStor.global.widthTEMP = res[x].sizes[0];
                  heightT = GlobalStor.global.heightTEMP = res[x].sizes[1];
                  GlobalStor.global.heightLim = '(' + product.width_min + ' - ' + product.width_max + ') x (' + product.height_min + ' - ' + product.height_max + ')';
                  if (heightT <= product.height_max && heightT >= product.height_min) {
                    if (widthT <= product.width_max && widthT >= product.width_min) { } else {
                      GlobalStor.global.checkDoors = 1;
                      break
                    }
                  } else {
                    GlobalStor.global.checkDoors = 1;
                    break
                  }
                }
              }
              GlobalStor.global.timeoutFunc = 1;
            }
          }, 50);
        }

        function closeSizeCaclulator(prom, save) {
          var deff = $q.defer();
          if (DesignStor.design.tempSize.length) {
            if (UserStor.userInfo.factory_id === 1966) {
              var newLength = parseFloat(DesignStor.design.tempSize.join(''), 10) / 0.0393701;
            } else {
              var newLength = parseInt(DesignStor.design.tempSize.join(''), 10);
            }
            var newPointsOut = rebuildPointsOut(newLength),
              currSquare = newPointsOut ? SVGServ.calcSquare(newPointsOut) : 0;
            /** Square limits checking */
            if (currSquare <= GlobalStor.global.maxSquareLimit) {
              /** Dimensions limits checking */
              if (newLength >= DesignStor.design.minSizeLimit && newLength <= DesignStor.design.maxSizeLimit) {
                addNewSizeInTemplate(newLength);
                //------ close size calculator and deactive size box in svg
                hideSizeTools();
                //----- change Template
                SVGServ.createSVGTemplate(DesignStor.design.templateSourceTEMP, ProductStor.product.profileDepths)
                  .then(function (result) {
                    DesignStor.design.templateTEMP = Object.assign(result);
                    ProductStor.product.template = Object.assign(result);
                    ProductStor.product.template_source = Object.assign(DesignStor.design.templateSourceTEMP);
                    DesignStor.design.resultSize = Object.assign(result);
                    GlobalStor.global.isChangedTemplate = 1;
                    setTimeout(function () {
                      rebuildSVGTemplate();
                      getSizeAlert();
                      MainServ.preparePrice(
                        ProductStor.product.template,
                        ProductStor.product.profile.id,
                        ProductStor.product.glass,
                        ProductStor.product.hardware.id,
                        ProductStor.product.lamination.lamination_in_id
                      ).then(function () {
                        //-------- template was changed
                        SVGServ.createSVGTemplate(ProductStor.product.template_source, ProductStor.product.profileDepths).then(function (result) {
                          ProductStor.product.template = angular.copy(result);
                          DesignStor.design.templateTEMP = angular.copy(result);
                        });
                      });
                    }, 250);
                    checkSize(result);
                    cleanTempSize();
                    deff.resolve(1);
                  });
              } else {
                //------ show error size
                if (newLength < DesignStor.design.minSizeLimit) {
                  if (GlobalStor.global.isVoiceHelper) {
                    playTTS($filter('translate')('construction.VOICE_SMALLEST_SIZE'), GlobalStor.global.voiceHelperLanguage);
                    //------- deactive size box in svg
                    //deselectAllDimension();
                    //-------- build new template
                    //rebuildSVGTemplate();
                  } else {
                    DesignStor.design.isMinSizeRestriction = 1;
                    DesignStor.design.isMaxSizeRestriction = 0;
                  }

                } else if (newLength >= DesignStor.design.maxSizeLimit) {
                  if (GlobalStor.global.isVoiceHelper) {
                    playTTS($filter('translate')('construction.VOICE_BIGGEST_SIZE'), GlobalStor.global.voiceHelperLanguage);
                    //------- deactive size box in svg
                    //deselectAllDimension();
                    //-------- build new template
                    //rebuildSVGTemplate();
                  } else {
                    DesignStor.design.isMinSizeRestriction = 0;
                    DesignStor.design.isMaxSizeRestriction = 1;
                  }

                  //-------- if extra overall dimention
                  if (newLength > GlobalStor.global.maxSizeLimit) {
                    DesignStor.design.isDimExtra = 1;
                  }
                }
                //------- back previous size
                d3.select(DesignStor.design.oldSize).text(DesignStor.design.prevSize);
                DesignStor.design.tempSize.length = 0;
                deff.resolve(1);
              }

            } else {
              DesignStor.design.isSquareExtra = 1;
              //------- back previous size
              d3.select(DesignStor.design.oldSize).text(DesignStor.design.prevSize);
              DesignStor.design.tempSize.length = 0;
              deff.resolve(1);
            }

          } else {
            //------ close size calculator and deselect All Dimension
            hideSizeTools();
            deff.resolve(1);
          }
          DesignStor.design.openVoiceHelper = 0;
          DesignStor.design.loudVoice = 0;
          DesignStor.design.quietVoice = 0;
          //console.log('FINISH CACL');
          if (prom) {
            return deff.promise;
          }
        }


        //------ Change size on SVG
        function changeSize() {
          var newSizeString = DesignStor.design.tempSize.join('');
          d3.select(DesignStor.design.oldSize).text(newSizeString);
          if (GlobalStor.global.isVoiceHelper) {
            closeSizeCaclulator();
          }
        }

        /**=============== Size Calculator ==============*/

        //-------- Get number from calculator
        function setValueSize(newValue) {
          // GlobalStor.global.activePanel = 0;
          var sizeLength = DesignStor.design.tempSize.length;
          //console.log('take new value = ', newValue);
          if (GlobalStor.global.isVoiceHelper) {
            var tempVal = parseInt(newValue, 10);
            //console.log('tempVal=====', tempVal);
            DesignStor.design.voiceTxt = '';
            DesignStor.design.openVoiceHelper = false;
            if ((tempVal > 0) && (tempVal < 10000)) {
              DesignStor.design.tempSize = ("" + tempVal).split('');
              //console.log('$scope.constructData.tempSize == ', $scope.constructData.tempSize);
              changeSize();
            }
            deselectAllDimension();
          } else {
            //---- clear array from 0 after delete all number in array
            if (sizeLength === 4 || (sizeLength === 1 && !DesignStor.design.tempSize[0])) {
              DesignStor.design.tempSize.length = 0;
            }
            if (newValue === '0') {
              if (sizeLength && DesignStor.design.tempSize[0]) {
                DesignStor.design.tempSize.push(newValue);
                changeSize();
              }
            } else if (newValue === '00') {
              if (sizeLength && DesignStor.design.tempSize[0]) {
                if (sizeLength < 3) {
                  DesignStor.design.tempSize.push(0, 0);
                } else if (sizeLength === 3) {
                  DesignStor.design.tempSize.push(0);
                }
                changeSize();
              }
            } else {
              DesignStor.design.tempSize.push(newValue);
              changeSize();
            }
          }
        }


        //------ Delete last number from calculator
        function deleteLastNumber() {
          DesignStor.design.tempSize.pop();
          if (DesignStor.design.tempSize.length < 1) {
            DesignStor.design.tempSize.push(0);
          }
          changeSize();
        }


        function pressCulculator(keyEvent) {
          var newValue;
          //--------- Enter
          if (keyEvent.which === 13) {
            closeSizeCaclulator();
            $rootScope.$apply();
          } else if (keyEvent.which === 8) {
            //-------- Backspace
            deleteLastNumber();
          } else {
            switch (keyEvent.which) {
              case 48:
              case 96:
                newValue = 0;
                break;
              case 49:
              case 97:
                newValue = 1;
                break;
              case 50:
              case 98:
                newValue = 2;
                break;
              case 51:
              case 99:
                newValue = 3;
                break;
              case 52:
              case 100:
                newValue = 4;
                break;
              case 53:
              case 101:
                newValue = 5;
                break;
              case 54:
              case 102:
                newValue = 6;
                break;
              case 55:
              case 103:
                newValue = 7;
                break;
              case 56:
              case 104:
                newValue = 8;
                break;
              case 57:
              case 105:
                newValue = 9;
                break;
            }
            if (newValue !== undefined) {
              setValueSize(newValue);
            }
          }
        }


        function doneRecognition(value) {
          //console.log("полученные данные", value);
          //console.log("тип полученных данных", typeof value);
          DesignStor.design.voiceTxt = value;
          $rootScope.$apply();
          $timeout(function () {
            var intValue = parseStringToDimension(value);
            //console.log("данные после парса", intValue);
            //console.log("тип полученных данных", typeof intValue);
            if (intValue === "NaN") {
              intValue = $filter('translate')('construction.VOICE_NOT_UNDERSTAND');
            }
            playTTS(intValue);
            setValueSize(intValue);
            $rootScope.$apply();
          }, 1000);
        }


        //---------- define voice force
        function recognitionProgress(value) {
          if (value > 100) {
            //console.log('value', value);
            DesignStor.design.loudVoice = true;
            DesignStor.design.quietVoice = false;

          } else {
            //console.log('value', value);
            DesignStor.design.loudVoice = false;
            DesignStor.design.quietVoice = true;
          }
          $rootScope.$apply();
        }


        //------- set click to all Dimensions
        function initAllDimension() {
          if (UserStor.userInfo.factory_id === 2) {
            d3.selectAll('#' + globalConstants.SVG_ID_EDIT + ' .size-box')
            .each(function () {
              var size = d3.select(this);
              size.on(clickEvent, function () {
                var sizeRect = size.select('.size-rect-rehau'),
                  isActive = sizeRect[0][0].attributes[0].nodeValue.indexOf('active') + 1;
                if (DesignStor.design.tempSize.length) {
                  /** save new Size when click another size */
                  closeSizeCaclulator();
                  cleanTempSize();
                } else {
                  if (isActive) {
                    hideSizeTools();
                  } else {
                    deselectAllDimension();
                    sizeRect.classed('active', true);
                    var dim = size.select('.size-txt-edit-rehau');
                    dim.classed('active', true);
                    DesignStor.design.oldSize = dim[0][0];
                    DesignStor.design.prevSize = dim[0][0].textContent;
                    // Internet Explorer 6-11

                    if (isEdge) {
                      DesignStor.design.minSizeLimit = +dim[0][0].attributes[9].nodeValue;
                      DesignStor.design.maxSizeLimit = +dim[0][0].attributes[10].nodeValue;
                    } else {
                      DesignStor.design.minSizeLimit = +dim[0][0].attributes[8].nodeValue;
                      DesignStor.design.maxSizeLimit = +dim[0][0].attributes[9].nodeValue;
                    }
                    //------- show caclulator or voice helper
                    if (GlobalStor.global.isVoiceHelper) {
                      DesignStor.design.openVoiceHelper = 1;
                      startRecognition(doneRecognition, recognitionProgress, GlobalStor.global.voiceHelperLanguage);
                    } else {
                      GlobalStor.global.isSizeCalculator = 1;
                      DesignStor.design.isMinSizeRestriction = 0;
                      DesignStor.design.isMaxSizeRestriction = 0;
                      DesignStor.design.isDimExtra = 0;
                      DesignStor.design.isSquareExtra = 0;
                    }
                  }
                  $rootScope.$apply();
                }
              });
            });

            /** switch on keyboard */
            d3.select(window)
              .on('keydown', function () {
                if (GlobalStor.global.isSizeCalculator) {
                  pressCulculator(d3.event);
                }
              });
          } else {
            d3.selectAll('#' + globalConstants.SVG_ID_EDIT + ' .size-box')
            .each(function () {
              var size = d3.select(this);
              size.on(clickEvent, function () {
                var sizeRect = size.select('.size-rect'),
                  isActive = sizeRect[0][0].attributes[0].nodeValue.indexOf('active') + 1;
                if (DesignStor.design.tempSize.length) {
                  /** save new Size when click another size */
                  closeSizeCaclulator();
                  cleanTempSize();
                } else {
                  if (isActive) {
                    hideSizeTools();
                  } else {
                    deselectAllDimension();
                    sizeRect.classed('active', true);
                    var dim = size.select('.size-txt-edit');
                    dim.classed('active', true);
                    DesignStor.design.oldSize = dim[0][0];
                    DesignStor.design.prevSize = dim[0][0].textContent;
                    // Internet Explorer 6-11

                    if (isEdge) {
                      DesignStor.design.minSizeLimit = +dim[0][0].attributes[9].nodeValue;
                      DesignStor.design.maxSizeLimit = +dim[0][0].attributes[10].nodeValue;
                    } else {
                      DesignStor.design.minSizeLimit = +dim[0][0].attributes[8].nodeValue;
                      DesignStor.design.maxSizeLimit = +dim[0][0].attributes[9].nodeValue;
                    }
                    //------- show caclulator or voice helper
                    if (GlobalStor.global.isVoiceHelper) {
                      DesignStor.design.openVoiceHelper = 1;
                      startRecognition(doneRecognition, recognitionProgress, GlobalStor.global.voiceHelperLanguage);
                    } else {
                      GlobalStor.global.isSizeCalculator = 1;
                      DesignStor.design.isMinSizeRestriction = 0;
                      DesignStor.design.isMaxSizeRestriction = 0;
                      DesignStor.design.isDimExtra = 0;
                      DesignStor.design.isSquareExtra = 0;
                    }
                  }
                  $rootScope.$apply();
                }
              });
            });

            /** switch on keyboard */
            d3.select(window)
              .on('keydown', function () {
                if (GlobalStor.global.isSizeCalculator) {
                  pressCulculator(d3.event);
                }
              });
          }
        }


        function updateGrids() {
          // var gridsOld = angular.copy(ProductStor.product.chosenAddElements[0]),
          var gridsOld = ProductStor.product.chosenAddElements[0],
            gridQty = gridsOld.length,
            blocks = ProductStor.product.template.details,
            blockQty = blocks.length,
            isChanged = 0,
            gridsNew = [],
            sizeGridX, sizeGridY, sizeTemp, gridTemp, g;
          var extended_mosq = angular.copy(GlobalStor.global.addElementsAll[0].elementsList[0]);
          gridsOld.forEach(function (oldMosq) {
            if (!oldMosq.cloth_id) {
              extended_mosq.forEach(function (entry) {
                if ((entry.name === oldMosq.name) && (entry.list_group_id === oldMosq.list_group_id) && (entry.id === oldMosq.id)) {
                  entry.elementPriceDis = angular.copy(oldMosq.elementPriceDis);
                  entry.element_price = angular.copy(oldMosq.element_price);
                  entry.element_height = angular.copy(oldMosq.element_height);
                  entry.element_width = angular.copy(oldMosq.element_width);
                  angular.extend(oldMosq, entry);
                  return;
                }
              });
            }
          });

          if (gridQty) {
            while (--blockQty > 0) {
              //------- if grid there is in this block
              if (blocks[blockQty].gridId) {
                for (g = 0; g < gridQty; g += 1) {
                  if ((blocks[blockQty].id === gridsOld[g].block_id) || (blocks[blockQty].id === "block_" + gridsOld[g].block_id)) {
                    gridTemp = gridsOld[g];
                    sizeTemp = {};
                    //------ defined inner block sizes
                    sizeGridX = _.map(blocks[blockQty].pointsLight, function (item) {
                      return item.x;
                    });
                    sizeGridY = _.map(blocks[blockQty].pointsLight, function (item) {
                      return item.y;
                    });
                    sizeTemp.width = Math.round(d3.max(sizeGridX) - d3.min(sizeGridX));
                    sizeTemp.height = Math.round(d3.max(sizeGridY) - d3.min(sizeGridY));
                    //----- if width or height are defferented - reculculate grid price
                    if (gridTemp.element_width !== sizeTemp.width || gridTemp.element_height !== sizeTemp.height) {
                      gridTemp.element_width = sizeTemp.width;
                      gridTemp.element_height = sizeTemp.height;
                      isChanged = 1;
                      gridsNew = gridTemp;
                    }

                    if (gridsNew.length) {
                      isChanged = 1;
                      ProductStor.product.chosenAddElements[0] = angular.copy(gridsNew);
                    }
                  }
                }
              } else {
                isChanged = 1;
                // ProductStor.product.chosenAddElements[0].splice(0, ProductStor.product.chosenAddElements[0].length);
              }
            }
            //------- rewrite grids lists
            if (gridsNew.length) {
              isChanged = 1;
              ProductStor.product.chosenAddElements[0] = angular.copy(gridsNew);
            }
          }
          return isChanged;
        }


        function setDefaultTemplate() {
          DesignStor.designSource.templateSourceTEMP = angular.copy(ProductStor.product.template_source);
          DesignStor.designSource.templateTEMP = angular.copy(ProductStor.product.template);
          DesignStor.design.templateSourceTEMP = angular.copy(ProductStor.product.template_source);
          DesignStor.design.templateTEMP = angular.copy(ProductStor.product.template);

        }


        //-------- Back to Template Panel
        function backtoTemplatePanel() {
          //------ cleaning DesignStor
          DesignStor.design = DesignStor.setDefaultDesign();
          //      delete DesignStor.design.templateSourceTEMP;
          //      delete DesignStor.design.templateTEMP;
          GlobalStor.global.activePanel = 0;
          GlobalStor.global.isNavMenu = 0;
          GlobalStor.global.isConfigMenu = 1;
          GlobalStor.global.isLoader = 0;
          clearTimeout(GlobalStor.global.hintTimer);
          DesignStor.design.showHint = -1;
          if ($location.path() !== "/light" && $location.path() !== "/mobile") {
            $location.path("/main");
            GlobalStor.global.currOpenPage = '/main';
          }
        }


        /**---------------- DOORs--------------*/

        /**---------- Show Door Configuration --------*/

        function toggleDoorConfig() {
          GlobalStor.global.checkDoors = 0;
          DesignStor.design.steps.isDoorConfig = 1;
          closeSizeCaclulator();
        }

        /**---------- Select door shape 1 --------*/

        function selectDoor(id, product, door_id) {
          var doorTypeQty = DesignStor.design.doorShapeData.length,
            d, isExist;
          var doorsLaminations = angular.copy(GlobalStor.global.doorsLaminations);
          var doorsGroups = angular.copy(GlobalStor.global.doorsGroups);

          var temp = [];
          var doorKitsT1 = GlobalStor.global.doorKitsT1;
          DesignStor.design.steps.selectedStep1 = 0;
          DesignStor.design.steps.selectedStep2 = 0;
          DesignStor.design.steps.selectedStep3 = 0;
          DesignStor.design.steps.selectedStep4 = 0;

          DesignStor.design.doorConfig.sashShapeIndex = '';
          DesignStor.design.doorConfig.handleShapeIndex = '';
          DesignStor.design.doorConfig.lockShapeIndex = '';

          DesignStor.design.doorShapeList.length = [];
          DesignStor.designSource.doorShapeList.length = [];

          for (var z = 0; z < doorsGroups.length; z += 1) {
            for (var i = 0; i < doorsLaminations.length; i += 1) {
              if (product.lamination.lamination_in_id === doorsLaminations[i].lamination_in_id &&
                product.lamination.lamination_out_id === doorsLaminations[i].lamination_out_id) {
                if (doorsGroups[z].id === doorsLaminations[i].group_id) {
                  doorsGroups[z].door_sill_list_id = doorsLaminations[i].door_sill_list_id
                  doorsGroups[z].rama_sill_list_id = doorsLaminations[i].rama_sill_list_id
                  doorsGroups[z].impost_list_id = doorsLaminations[i].impost_list_id
                  doorsGroups[z].rama_list_id = doorsLaminations[i].rama_list_id
                  doorsGroups[z].shtulp_list_id = doorsLaminations[i].shtulp_list_id
                  doorsGroups[z].stvorka_list_id = doorsLaminations[i].stvorka_list_id
                  doorsGroups[z].doorstep_type = 0;
                  doorsGroups[z].profileId = doorsGroups[z].profile_id /*|| 345   (вай?)*/;
                  DesignStor.design.doorsGroups.push(doorsGroups[z].id)
                  for (var x = 0; x < doorKitsT1.length; x += 1) {
                    if (doorsGroups[z].door_sill_list_id === doorKitsT1[x].id) {
                      doorsGroups[z].doorstep_type = doorKitsT1[x].doorstep_type;
                    }
                  }
                  temp.push(doorsGroups[z]);
                  break
                }
              }
            }
          }
          // if (GlobalStor.global.orderEditNumber === 0) {
          //     doorsGroups = angular.copy(temp);
          // }
          for (d = 0; d < doorTypeQty; d++) {
            var ch1 = DesignStor.design.sashShapeList = doorsGroups.filter(function (item) {
              return item.doorstep_type === 2;
            });

            var ch2 = DesignStor.design.sashShapeList = doorsGroups.filter(function (item) {
              return item.doorstep_type === 1;
            });

            isExist = 0;
            if (d === 2 && ch1.length) {
              isExist = 1;
            } else if (d === 3 && ch2.length) {
              isExist = 1;
            } else if (!d || d === 1) {
              isExist = 1;
            }
            if (isExist) {
              DesignStor.design.doorShapeList.push(DesignStor.design.doorShapeData[d]);
              DesignStor.designSource.doorShapeList.push(DesignStor.designSource.doorShapeData[d]);
            }
          }
          if (!DesignStor.design.steps.selectedStep2) {
            if (DesignStor.design.doorConfig.doorShapeIndex === id) {
              DesignStor.design.doorConfig.doorShapeIndex = '';
              DesignStor.design.steps.selectedStep1 = 0;

            } else {
              DesignStor.design.sashShapeList.length = 0;

              if (door_id !== undefined) {
                ProductStor.product.door_type_index = door_id;
                console.log(door_id)
              }
              switch (id) {
                case 0:
                case 1:
                  if (doorsGroups.length) {
                    DesignStor.design.sashShapeList = angular.copy(doorsGroups);
                  }
                  break;
                case 2:
                case 3:
                  if (doorsGroups.length) {
                    DesignStor.design.sashShapeList = doorsGroups.filter(function (item) {
                      let res = false;
                      try {
                        res = item.doorstep_type === DesignStor.design.doorShapeData[ProductStor.product.door_type_index].doorstep_type;
                      } catch (e) {
                        console.log('catch')
                        res = angular.copy(id)
                      }
                      return res
                    });
                    break;
                  }
              }
              DesignStor.design.doorConfig.doorShapeIndex = angular.copy(id);
              DesignStor.design.doorConfig.doorTypeIndex = angular.copy(DesignStor.design.doorShapeList[id].id);
              DesignStor.design.steps.selectedStep1 = 1;
              DesignStor.design.showMobileStep = 2;
              return DesignStor.design.sashShapeList[id];
            }
          }
        }

        /**---------- Select profile/sash shape 2 --------*/

        function selectSash(id, product) {
          var deferred = $q.defer();
          var ids = DesignStor.design.sashShapeList[id];
          var profileDepths = {
            frameDepth: null,
            frameStillDepth: null,
            sashDepth: null,
            impostDepth: null,
            shtulpDepth: null
          };
          DesignStor.design.steps.selectedStep2 = 0;
          DesignStor.design.steps.selectedStep3 = 0;
          DesignStor.design.steps.selectedStep4 = 0;

          DesignStor.design.doorConfig.handleShapeIndex = '';
          DesignStor.design.doorConfig.lockShapeIndex = '';

          DesignStor.design.doorConfig.glassDepProf = (ids.profile_id === product.profile.id);
          $q.all([
            MainServ.downloadProfileDepth(ids.rama_list_id),
            MainServ.downloadProfileDepth(ids.door_sill_list_id),
            MainServ.downloadProfileDepth(ids.stvorka_list_id),
            MainServ.downloadProfileDepth(ids.impost_list_id),
            MainServ.downloadProfileDepth(ids.shtulp_list_id)
          ]).then(function (result) {
            profileDepths.frameDepth = result[0];
            profileDepths.frameStillDepth = result[1];
            profileDepths.sashDepth = result[2];
            profileDepths.impostDepth = result[3];
            profileDepths.shtulpDepth = result[4];
            SVGServ.createSVGTemplate(DesignStor.design.templateSourceTEMP, profileDepths).then(function (result) {
              DesignStor.design.templateTEMP = angular.copy(result);
              DesignStor.designSource.templateTEMP = angular.copy(result);
              DesignStor.design.handleShapeList = [];
              if (!DesignStor.design.steps.selectedStep3) {
                if (DesignStor.design.doorConfig.sashShapeIndex === id) {
                  DesignStor.design.doorConfig.sashShapeIndex = '';
                  DesignStor.design.steps.selectedStep2 = 0;
                } else {
                  DesignStor.design.doorConfig.sashShapeIndex = id;
                  DesignStor.design.steps.selectedStep2 = 1;
                  DesignStor.design.showMobileStep = 3;

                }
              }
              localDB.selectLocalDB(
                localDB.tablesLocalDB.doors_groups_dependencies.tableName, {
                  'doors_group_id': DesignStor.design.sashShapeList[id].id
                }
              ).then(function (dependencies) {
                for (var x = 0; x <= dependencies.length; x += 1) {
                  if (x !== dependencies.length) {
                    depend(dependencies[x])
                  } else {
                    deferred.resolve(1);
                  }
                }
              });
            });
          });
          return deferred.promise;
        }


        function depend(item) {
          var newHandleArr;
          newHandleArr = GlobalStor.global.doorHandlers.filter(function (handle) {
            return handle.profIds.indexOf('hel' + item.hardware_group_id + 'lo') + 1;
          });
          DesignStor.design.handleShapeList = DesignStor.design.handleShapeList.concat(newHandleArr);
          var used = {};
          var filtered = DesignStor.design.handleShapeList.filter(function (obj) {
            return obj.id in used ? 0 : (used[obj.id] = 1);
          });
          DesignStor.design.handleShapeList = filtered;
        }

        function selectHandle(id, product) {
          (id) ? id = id : id = DesignStor.design.handleShapeList[0].id;
          var pnt = checkSize(DesignStor.design.templateTEMP, 4);
          var sashShapeIndex = DesignStor.design.doorConfig.sashShapeIndex;
          var array = [];
          DesignStor.design.steps.selectedStep4 = 0;

          DesignStor.design.doorConfig.lockShapeIndex = '';

          if (!DesignStor.design.steps.selectedStep4) {
            if (DesignStor.design.doorConfig.handleShapeIndex === id) {
              DesignStor.design.doorConfig.handleShapeIndex = '';
              DesignStor.design.steps.selectedStep3 = 0;
            } else {
              DesignStor.design.doorConfig.handleShapeIndex = id;
              DesignStor.design.steps.selectedStep3 = 1;
              DesignStor.design.showMobileStep = 4;

            }

            var lockArr = GlobalStor.global.doorLocks.filter(function (doorLocks) {
              return doorLocks.profIds.indexOf(DesignStor.design.sashShapeList[sashShapeIndex].id) + 1;
            });
            var newLockArr = lockArr.filter(function (doorLocks) {
              var temp = _.filter(_.compact(_.flatten(DesignStor.design.handleShapeList)), {
                id: id
              });
              return temp[0].profIds.indexOf('hel' + doorLocks.id + 'lo') + 1;
            });
            var template = DesignStor.design.templateTEMP.priceElements.shtulpsSize;
            for (var x = 0; x < newLockArr.length; x += 1) {
              if (pnt.heightT <= newLockArr[x].height_max) {
                if (pnt.heightT >= newLockArr[x].height_min) {
                  if (pnt.widthT <= newLockArr[x].width_max) {
                    if (pnt.widthT >= newLockArr[x].width_min) {
                      if (newLockArr[x].hardware_type_id === (template.length) + 1) {
                        array.push(newLockArr[x])
                      }
                    }
                  }
                }
              }
            }
            DesignStor.design.lockShapeList = angular.copy(array);
          }
        }

        /**---------- Select lock shape 4 --------*/

        function selectLock(id, product) {
          if (DesignStor.design.doorConfig.lockShapeIndex === id) {
            DesignStor.design.doorConfig.lockShapeIndex = '';
            DesignStor.design.steps.selectedStep4 = 0;
          } else {
            DesignStor.design.doorConfig.lockShapeIndex = id;
            DesignStor.design.steps.selectedStep4 = 1;
          }
        }

        /**---------- Close Door Configuration --------*/

        function closeDoorConfig() {
          if (DesignStor.design.steps.selectedStep3) {
            DesignStor.design.steps.selectedStep3 = 0;
            DesignStor.design.steps.selectedStep4 = 0;
            DesignStor.design.doorConfig.lockShapeIndex = '';
            DesignStor.design.doorConfig.handleShapeIndex = '';
            DesignStor.design.showMobileStep = 3;
          } else if (DesignStor.design.steps.selectedStep2) {
            DesignStor.design.steps.selectedStep2 = 0;
            DesignStor.design.doorConfig.sashShapeIndex = '';
            DesignStor.design.showMobileStep = 2;

          } else if (DesignStor.design.steps.selectedStep1) {
            DesignStor.design.steps.selectedStep1 = 0;
            DesignStor.design.doorConfig.doorShapeIndex = '';
            DesignStor.design.showMobileStep = 1;
          } else {
            //------ close door config
            DesignStor.design.steps.isDoorConfig = 0;
            DesignStor.design.isDoorConfigMobile = 0;
            //------ set Default indexes
            DesignStor.design.doorConfig = DesignStor.setDefaultDoor();
          }
        }

        /**---------- Save Door Configuration --------*/
        function checkGlassInTemplate(product) {
          var templateSource = DesignStor.design.templateSourceTEMP.details;
          var check = 0;
          for (var x = 0; x < templateSource.length; x += 1) {
            for (var y = 0; y < product.glass.length; y += 1) {
              if (_.isEqual({
                id: templateSource[x].glassId,
                name: templateSource[x].glassTxt
              }, {
                  id: product.glass[y].id,
                  name: product.glass[y].sku
                })) {
                check += 1;
              }
            }
          }
          if (check === 0) {
            DesignStor.design.doorConfig.glassDepProf = false;
          }
          if (product.construction_type === 4 && DesignStor.design.doorConfig.glassDepProf === true) {
            MainServ.setCurrentGlassInTemplate(DesignStor.design.templateSourceTEMP, ProductStor.product, 1);
          } else if (product.construction_type === 4 && DesignStor.design.doorConfig.glassDepProf === false) {
            MainServ.setCurrentGlassInTemplate(DesignStor.design.templateSourceTEMP, ProductStor.product);
          }
        }


        function saveDoorConfig(product) {

          (product) ? product = product : product = ProductStor.product;
          var deferred = $q.defer();
          if (GlobalStor.global.orderEditNumber === 0) {
            checkGlassInTemplate(product);
          }
          setNewDoorParamValue(product, DesignStor.design).then(function (res) {
            SVGServ.createSVGTemplate(DesignStor.design.templateSourceTEMP, product.profileDepths).then(function (result) {
              DesignStor.design.templateTEMP = angular.copy(result);
              MainServ.preparePrice(
                DesignStor.design.templateTEMP,
                product.profile.id,
                product.glass,
                product.hardware.id,
                product.lamination.lamination_in_id
              ).then(function () {
                SVGServ.createSVGTemplate(DesignStor.design.templateSourceTEMP, product.profileDepths).then(function (result) {
                  deferred.resolve(1);
                });
              });
            });
          });
          DesignStor.design.steps.isDoorConfig = 0;
          DesignStor.design.isDoorConfigMobile = 0;
          return deferred.promise;
        }

        function setDoorParamValue(product, source) {
          var w = 900,
            h = 2000;
          var k = product.door_lock_shape_id || 0;
          var widthTEMP, heightTEMP;
          var clipboard;
          var doorsItems = angular.copy(GlobalStor.global.doorsItems);
          (GlobalStor.global.widthTEMP > 0) ? widthTEMP = GlobalStor.global.widthTEMP : widthTEMP = w;
          (GlobalStor.global.heightTEMP > 0) ? heightTEMP = GlobalStor.global.heightTEMP : heightTEMP = h;

          function countHandle(source) {
            var count = source.templateTEMP.details.filter(function (item) {
              if (item.blockType == 'sash') {
                if (item.handlePos !== 0) {
                  return item;
                }
              }
            })
            return count;
          }
          source.lockShapeList[k].elem = [];
          product.door_group_id = source.sashShapeList[product.door_sash_shape_id].id;
          product.template_source.profile_window_id = source.sashShapeList[product.door_sash_shape_id].profileId;
          product.doorName = source.doorShapeList[product.door_shape_id].name;
          product.doorSashName = source.sashShapeList[product.door_sash_shape_id].name;
          var doorHandle = _.filter(_.compact(_.flatten(source.handleShapeList)), {
            id: product.door_handle_shape_id
          });
          product.doorHandle = doorHandle[0];
          product.doorLock = source.lockShapeList[k];
          product.doorHandle.count = countHandle(source).length;
          for (var e = 0; e < source.templateTEMP.details.length; e += 1) {
            if (source.templateTEMP.details[e].blockType == 'sash') {
              if (source.templateTEMP.details[e].handlePos !== 0) {
                if (source.templateTEMP.details[e].openDir[0] === 4) {
                  source.templateTEMP.details[e].openDir[0] = 3;
                }
                for (var x = 0; x < doorsItems.length; x += 1) {
                  if (source.lockShapeList[k].id === doorsItems[x].hardware_group_id) {
                    if ((source.templateTEMP.details[e].openDir[0] === doorsItems[x].direction_id) || doorsItems[x].direction_id === 1) {
                      if (doorsItems[x].hardware_color_id === product.lamination.id || doorsItems[x].hardware_color_id === 0) {
                        if (heightTEMP <= doorsItems[x].max_height || doorsItems[x].max_height === 0) {
                          if (heightTEMP >= doorsItems[x].min_height || doorsItems[x].min_height === 0) {
                            if (widthTEMP <= doorsItems[x].max_width || doorsItems[x].max_width === 0) {
                              if (widthTEMP >= doorsItems[x].min_width || doorsItems[x].min_width === 0) {
                                doorsItems[x].openDir = source.templateTEMP.details[e].openDir[0];
                                clipboard = angular.copy(doorsItems[x]);
                                source.lockShapeList[k].elem.push(clipboard);
                                // console.log("heightTEMP", heightTEMP);
                                // console.log("widthTEMP", widthTEMP);
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }

        function doorId(product, source) {
          var deferred = $q.defer();
          product.profile.name = source.sashShapeList[product.door_sash_shape_id].name;
          product.profile.short_name = '';
          product.profile.description = '';
          product.template_source.hardware_id = product.hardware.id;
          GlobalStor.global.type_door = source.doorsGroups[product.door_sash_shape_id];
          product.profile.rama_list_id = source.sashShapeList[product.door_sash_shape_id].rama_list_id;
          product.profile.id = source.sashShapeList[product.door_sash_shape_id].profile_id;
          product.profile.profileId = source.sashShapeList[product.door_sash_shape_id].profile_id;
          product.profile.rama_still_list_id =
            product.door_type_index === 0 ?
              source.sashShapeList[product.door_sash_shape_id].rama_sill_list_id :
              source.sashShapeList[product.door_sash_shape_id].door_sill_list_id;
          product.profile.stvorka_list_id = source.sashShapeList[product.door_sash_shape_id].stvorka_list_id;
          product.profile.impost_list_id = source.sashShapeList[product.door_sash_shape_id].impost_list_id;
          product.profile.shtulp_list_id = source.sashShapeList[product.door_sash_shape_id].shtulp_list_id;
          product.doorLock.stvorka_type = source.sashShapeList[product.door_sash_shape_id].list_type_id;
          $q.all([
            MainServ.downloadProfileDepth(product.profile.rama_list_id),
            MainServ.downloadProfileDepth(product.profile.rama_still_list_id),
            MainServ.downloadProfileDepth(product.profile.stvorka_list_id),
            MainServ.downloadProfileDepth(product.profile.impost_list_id),
            MainServ.downloadProfileDepth(product.profile.shtulp_list_id)
          ]).then(function (result) {
            product.profileDepths.frameDepth = result[0];
            product.profileDepths.frameStillDepth = result[1];
            product.profileDepths.sashDepth = result[2];
            product.profileDepths.impostDepth = result[3];
            product.profileDepths.shtulpDepth = result[4];
            AnalyticsServ.sendAnalyticsData(
              UserStor.userInfo.id,
              OrderStor.order.id,
              ProductStor.product.template_id,
              source.sashShapeList[product.door_sash_shape_id].id,
              5
            );
            deferred.resolve(1);
          });
          return deferred.promise;
        }

        function setNewDoorParamValue(product, source) {
          //------- save new door config
          var deferred = $q.defer();
          product.door_type_index = angular.copy(source.doorConfig.doorTypeIndex);
          product.door_shape_id = source.doorConfig.doorShapeIndex;
          product.door_sash_shape_id = source.doorConfig.sashShapeIndex;
          product.door_handle_shape_id = source.doorConfig.handleShapeIndex;
          product.door_lock_shape_id = source.doorConfig.lockShapeIndex;
          GlobalStor.global.type_door = source.doorConfig.doorShapeIndex;

          setDoorParamValue(product, source);

          doorId(product, source).then(function (res) {
            deferred.resolve(1);
          });

          return deferred.promise;
        }

        /** for start */
        function setDoorConfigDefault(product, editOrder) {
          var deferred = $q.defer();
          if (editOrder) {
            DesignStor.design.templateTEMP = angular.copy(product.template);
            DesignStor.design.templateSourceTEMP = angular.copy(product.template_source);
            rebuildSVGTemplate();
          }
          DesignStor.design.steps.selectedStep3 = 0;
          DesignStor.design.steps.selectedStep4 = 0;
          DesignStor.design.doorConfig.lockShapeIndex = '';
          DesignStor.design.doorConfig.handleShapeIndex = '';
          DesignStor.design.steps.selectedStep2 = 0;
          DesignStor.design.doorConfig.sashShapeIndex = '';
          DesignStor.design.steps.selectedStep1 = 0;
          DesignStor.design.doorConfig.doorShapeIndex = '';
          //------ close door config
          DesignStor.design.steps.isDoorConfig = 0;
          DesignStor.design.isDoorConfigMobile = 0;

          //------ set Default indexes

          DesignStor.design.doorConfig = DesignStor.setDefaultDoor();

          selectDoor(product.door_shape_id, product);
          selectSash(product.door_sash_shape_id, product).then(function (res) {
            selectHandle(product.door_handle_shape_id, product);
            selectLock(product.door_lock_shape_id, product);
            saveDoorConfig(product).then(function (res2) {
              SVGServ.createSVGTemplate(DesignStor.design.templateSourceTEMP, product.profileDepths).then(function (result) {
                SVGServ.createSVGTemplateIcon(DesignStor.design.templateSourceTEMP, product.profileDepths)
                  .then(function (result) {
                    ProductStor.product.templateIcon = angular.copy(result);
                  });
                DesignStor.design.templateTEMP = angular.copy(result);
                DesignStor.design.templateTEMP.details.forEach(function (entry, index) {
                  if (entry.impost) {
                    DesignStor.design.templateSourceTEMP.details[index].impost.impostAxis[1].x = entry.impost.impostAxis[0].x;
                    DesignStor.design.templateSourceTEMP.details[index].impost.impostAxis[0].x = entry.impost.impostAxis[1].x;
                    var tempProd = angular.copy(product);
                    tempProd.template_source = angular.copy(product.templateSourceTEMP);
                    tempProd.template = angular.copy(product.templateTEMP);
                    deferred.resolve(tempProd);
                  } else {
                    var tempProd = angular.copy(product);
                    tempProd.template_source = angular.copy(DesignStor.design.templateSourceTEMP);
                    tempProd.template = angular.copy(DesignStor.design.templateTEMP);
                    deferred.resolve(tempProd);
                  }
                });
              });
            });
          });
          return deferred.promise;
        }

        //------- set Default Construction
        function setDefaultConstruction() {
          //------- close calculator if is opened
          hideSizeTools();
          DesignStor.design = DesignStor.setDefaultDesign();
          setDefaultTemplate();
        }

        /**-------------- Edit Design --------------*/


        function isExistElementInSelected(newElem, selectedArr) {
          var exist = 1,
            newElemId = newElem.attributes.block_id.nodeValue,
            selectedQty = selectedArr.length;
          while (--selectedQty > -1) {
            if (selectedArr[selectedQty].attributes.block_id.nodeValue === newElemId) {
              selectedArr.splice(selectedQty, 1);
              exist = 0;
              break;
            }
          }
          //-------- if the element is new one
          if (exist) {
            selectedArr.push(newElem);
          }
          return exist;
        }


        //------ add to all imposts event on click
        function initAllImposts() {
          DesignStor.design.selectedImpost.length = 0;
          d3.selectAll('#' + globalConstants.SVG_ID_EDIT + ' [item_type=impost]')
            .each(function () {
              var impost = d3.select(this);
              impost.on(clickEvent, function () {
                if (DesignStor.design.tempSize.length) {
                  closeSizeCaclulator();
                  cleanTempSize();
                } else {
                  var isImpost = isExistElementInSelected(impost[0][0], DesignStor.design.selectedImpost);
                  if (isImpost) {
                    impost.classed('frame-active', true);
                    //------- active impost menu and submenu
                    DesignStor.design.activeMenuItem = 3;
                    DesignStor.design.isImpostDelete = 1;
                    DesignStor.design.activeSubMenuItem = 3;
                    hideCornerMarks();
                    deselectAllArc();
                    hideSizeTools();
                    $rootScope.$apply();
                  } else {
                    impost.classed('frame-active', false);
                    //----- if none imposts
                    if (!DesignStor.design.selectedImpost.length) {
                      //------- close impost menu and submenu
                      DesignStor.design.activeMenuItem = 0;
                      DesignStor.design.activeSubMenuItem = 0;
                      $rootScope.$apply();
                      DesignStor.design.isImpostDelete = 0;
                    }
                  }
                }
              });
            });
        }


        function showBlockDimensions(dim, svgID) {
          var dimQty = dim[0].length,
            isXDim = 0,
            isYDim = 0,
            axis;
          //------- checking what kind of dimension X or Y direction
          if (dimQty) {
            while (--dimQty > -1) {
              axis = dim[0][dimQty].attributes.axis;
              if (axis) {
                if (axis.nodeValue === 'x') {
                  isXDim = 1;
                } else if (axis.nodeValue === 'y') {
                  isYDim = 1;
                }
              }
            }
            //------- shifting overall dimensions is level0 is existed
            if (isXDim) {
              d3.selectAll('#' + svgID + ' .dim_blockX').classed('dim_shiftX', 1);
            }
            if (isYDim) {
              d3.selectAll('#' + svgID + ' .dim_blockY').classed('dim_shiftY', 1);
            }
            dim.classed('dim_hidden', 0);
          }
        }

        function showCurrentDimLevel(currDimId) {
          var dim = d3.selectAll('#' + globalConstants.SVG_ID_EDIT + ' .dim_block[block_id=' + currDimId + ']');
          showBlockDimensions(dim, globalConstants.SVG_ID_EDIT);
        }

        /**------- show all dimensions for Glass and Grid Selectors -------*/
        function showAllDimension(svgID) {
          var dim = d3.selectAll('#' + svgID + ' .dim_block');
          showBlockDimensions(dim, svgID);
        }

        //------- set click to all Glass for Dimensions
        function initAllGlass() {
          DesignStor.design.selectedGlass.length = 0;

          d3.selectAll('#' + globalConstants.SVG_ID_EDIT + ' .glass')
            .each(function () {
              var glass = d3.select(this);
              glass.on(clickEvent, function () {
                if (DesignStor.design.tempSize.length) {
                  closeSizeCaclulator();
                  cleanTempSize();
                } else {
                  if (GlobalStor.global.showAllGlass) {
                    deselectAllGlass();
                  }
                  //========= select glass
                  var isGlass = isExistElementInSelected(glass[0][0], DesignStor.design.selectedGlass),
                    blockID = glass[0][0].attributes.block_id.nodeValue;
                  if (isGlass) {
                    glass.classed('glass-active', true);
                    hideCornerMarks();
                    deselectAllImpost();
                    deselectAllArc();
                    hideSizeTools();

                    //------- show Dimensions
                    showCurrentDimLevel(blockID);

                    $rootScope.$apply();
                  } else {
                    glass.classed('glass-active', false);
                    //------- hide Dimensions of current Block
                    d3.selectAll('#' + globalConstants.SVG_ID_EDIT + ' .dim_block[block_id=' + blockID + ']')
                      .classed('dim_hidden', true);

                    if (!DesignStor.design.selectedGlass.length) {
                      //------- close glass menu and submenu
                      DesignStor.design.activeMenuItem = 0;
                      DesignStor.design.activeSubMenuItem = 0;
                      //---- shifting global dimension
                      hideAllDimension();
                      $rootScope.$apply();
                    }
                  }
                }
              });
            });
        }


        /**------- set click to all Glass for Glass selector ---------- */

        function initAllGlassXGlass() {
          DesignStor.design.selectedGlass.length = 0;
          d3.selectAll('#' + globalConstants.SVG_ID_GLASS + ' .glass')
            .each(function () {
              var glass = d3.select(this);
              glass.on(clickEvent, function () {
                //========= select glass
                var isGlass = isExistElementInSelected(glass[0][0], DesignStor.design.selectedGlass),
                  blockID = glass[0][0].attributes.block_id.nodeValue;
                if (isGlass) {
                  glass.classed('glass-active', true);
                  d3.select('.glass-txt[block_id=' + blockID + ']').text(GlobalStor.global.selectGlassName);
                  MainServ.setGlassToTemplateBlocks(
                    GlobalStor.global.selectGlassType,
                    ProductStor.product.template,
                    GlobalStor.global.selectGlassId,
                    GlobalStor.global.selectGlassName,
                    blockID
                  );
                } else {
                  glass.classed('glass-active', false);
                  d3.select('.glass-txt[block_id=' + blockID + ']').text(GlobalStor.global.prevGlassName);
                  MainServ.setGlassToTemplateBlocks(
                    GlobalStor.global.selectGlassType,
                    ProductStor.product.template,
                    GlobalStor.global.prevGlassId,
                    GlobalStor.global.prevGlassName,
                    blockID
                  );
                }
              });
            });
          /** show all dimensions */
          showAllDimension(globalConstants.SVG_ID_GLASS);
        }


        /**-------- close Glass Selector Dialog --------*/

        function closeGlassSelectorDialog(isEmpty) {
          if (isEmpty) {
            GlobalStor.global.selectGlassId = GlobalStor.global.prevGlassId;
            GlobalStor.global.selectGlassName = GlobalStor.global.prevGlassName;
            SVGServ.createSVGTemplate(ProductStor.product.template_source, ProductStor.product.profileDepths)
              .then(function (result) {
                ProductStor.product.template = angular.copy(result);
              });
          }
          removeGlassEventsInSVG();
          GlobalStor.global.showGlassSelectorDialog = 0;
        }


        /**------- set click to all Glass for Grid selector ---------- */
        function initAllGlassXGrid() {
          function test(blocks, blocksQty, parent) {
            if (parent || !parent === 'block_0') {
              var block = blocks.filter(function (item) {
                if (item.id === parent) {
                  return item;
                }
              });
              if (block[0].blockType === "sash") {
                test2(block[0].children, blocks);

                if (GlobalStor.global.sashTypeBlock.length > 0) {
                  var double = GlobalStor.global.sashTypeBlock.filter(function (sash) {
                    if (sash === block[0].id) {
                      return sash;
                    }
                  });
                  if (double.length > 0) {
                    GlobalStor.global.sashTypeBlock = GlobalStor.global.sashTypeBlock.filter(function (sash) {
                      if (!sash === double) {
                        return sash;
                      }
                    });
                  } else {
                    GlobalStor.global.sashTypeBlock[GlobalStor.global.sashTypeBlock.length] = block[0].id;
                  }
                } else {
                  GlobalStor.global.sashTypeBlock[GlobalStor.global.sashTypeBlock.length] = block[0].id;
                }
              } else {
                test(blocks, blocksQty, block[0].parent);
              }
            } else {
              //------ show error
              showErrorInBlock(GlobalStor.global.allGlass[0].attributes.block_id.nodeValue, globalConstants.SVG_ID_GRID);
            }
          }

          function test2(items, blocks) {
            var temp = [];
            if (items.length > 0) {
              GlobalStor.global.children = _.uniq(GlobalStor.global.children.concat(items));
              GlobalStor.global.childrenTEMP = angular.copy(GlobalStor.global.children);
              for (var j = 0; j < blocks.length; j += 1) {
                for (var x = 0; x < items.length; x += 1) {
                  if (items[x] === blocks[j].id) {
                    temp = _.union(temp, blocks[j].children);
                  }
                }
              }

              test2(temp, blocks);
            } else {
              test3();
            }
          }

          function test3() {
            var glasses = GlobalStor.global.allGlass.filter(function (gl) {
              for (var t = 0; t < GlobalStor.global.children.length; t += 1) {
                if (d3.select(gl)[0][0].attributes.block_id.nodeValue == GlobalStor.global.children[t]) {
                  (isExistElementInSelected(d3.select(gl)[0][0], DesignStor.design.selectedGlass)) ? d3.select(gl).classed('glass-active', true) : d3.select(gl).classed('glass-active', false);
                }
              }
            })
          }

          GlobalStor.global.sashTypeBlock = [];
          DesignStor.design.selectedGlass.length = 0;
          d3.selectAll('#' + globalConstants.SVG_ID_GRID + ' .glass')
            .each(function () {
              var glass = GlobalStor.global.mosGlassRes = d3.select(this);
              glass.on(clickEvent, function () {
                GlobalStor.global.parents = [];
                GlobalStor.global.children = [];
                var blocks = ProductStor.product.template.details,
                  blocksQty = blocks.length,
                  blockID = glass[0][0].attributes.block_id.nodeValue,
                  parentID = glass[0][0].attributes.parent_id.nodeValue,
                  items = $(this).siblings(),
                  isGlass, allGlass = [];
                allGlass.push(this);
                for (var x = 0; x < items.length; x += 1) {
                  if (items[x].__data__) {
                    if (items[x].__data__.type) {
                      if (items[x].__data__.type === 'glass') {
                        allGlass.push(items[x]);
                      }
                    }
                  }
                }
                GlobalStor.global.allGlass = allGlass;
                //-------- check glass per sash
                while (--blocksQty > 0) {
                  if (blocks[blocksQty].id === blockID) {
                    if (blocks[blocksQty].blockType === "sash") {
                      isGlass = isExistElementInSelected(glass[0][0], DesignStor.design.selectedGlass);
                      //========= select glass

                      if (isGlass) {

                        glass.classed('glass-active', true);
                      } else {
                        glass.classed('glass-active', false);
                      }
                    } else {
                      test(blocks, blocksQty, parentID)
                    }
                  }
                }

              });
            });
          /** show all dimensions */
          showAllDimension(globalConstants.SVG_ID_GRID);
        }


        function isExistArcInSelected(newElem, selectedArr) {
          var exist = 1,
            newElemId = newElem.attributes.item_id.nodeValue,
            selectedQty = selectedArr.length;
          while (--selectedQty > -1) {
            if (selectedArr[selectedQty].attributes.item_id.nodeValue === newElemId) {
              selectedArr.splice(selectedQty, 1);
              exist = 0;
              break;
            }
          }
          //-------- if the element is new one
          if (exist) {
            selectedArr.push(newElem);
          }
          return exist;
        }


        function initAllArcs() {
          var arcs = d3.selectAll('#' + globalConstants.SVG_ID_EDIT + ' .frame')[0].filter(function (item) {
            if (item.__data__.type === 'frame' || item.__data__.type === 'arc') {
              return true;
            }
          });
          if (arcs.length) {
            d3.selectAll(arcs).each(function () {
              var arc = d3.select(this);
              arc.on(clickEvent, function () {
                if (DesignStor.design.tempSize.length) {
                  closeSizeCaclulator();
                  cleanTempSize();
                } else {
                  var isArc = isExistArcInSelected(arc[0][0], DesignStor.design.selectedArc);
                  //console.log('add to ARC++++', DesignStor.design.selectedArc);
                  if (isArc) {
                    arc.classed('active_svg', true);
                    deselectAllGlass();
                    hideCornerMarks();
                    deselectAllImpost();
                    hideSizeTools();
                    $rootScope.$apply();
                  } else {
                    arc.classed('active_svg', false);
                    if (!DesignStor.design.selectedArc.length) {
                      //------- close glass menu and submenu
                      DesignStor.design.activeMenuItem = 0;
                      DesignStor.design.activeSubMenuItem = 0;
                      $rootScope.$apply();
                    }
                  }
                }
              });
            });
          }
        }


        /**++++++++++Edit Sash+++++++++*/

        function checkImpPointInCorner(linePoint, impPoint) {
          var noMatch = 1,
            limit = 40,
            xDiff = impPoint.x - linePoint.x,
            yDiff = impPoint.y - linePoint.y;

          if (xDiff > 0 && xDiff < limit) {
            if (yDiff > 0 && yDiff < limit) {
              noMatch = 0;
            }
          }
          return noMatch;
        }


        function createImpostPoint(coord, curBlockN, blockIndex, blocks, dimType, isShtulp) {
          var impPoint = {
            type: 'impost',
            id: 'ip' + curBlockN,
            x: Math.round(coord.x),
            y: Math.round(coord.y),
            dir: 'line',
            dimType: dimType
          };
          //---------- for SHTULP
          if (isShtulp) {
            impPoint.type = 'shtulp';
            impPoint.id = 'sht' + curBlockN;
          }
          //---- insert impostPoint in parent block
          if (!blocks[blockIndex].impost) {
            blocks[blockIndex].impost = {
              impostAxis: [],
              impostOut: [],
              impostIn: [],
              impostLight: []
            };
          }
          blocks[blockIndex].impost.impostAxis.push(impPoint);
        }


        function createChildBlock(blockN, blockIndex, blocks, isShtulp, sashParams) {
          var newBlock = {
            type: 'skylight',
            id: 'block_' + blockN,
            level: blocks[blockIndex].level + 1,
            blockType: 'frame',
            parent: blocks[blockIndex].id,
            children: [],
            pointsOut: [],
            pointsIn: [],
            pointsLight: [],
            parts: [],
            glassId: blocks[blockIndex].glassId,
            glassTxt: blocks[blockIndex].glassTxt,
            glass_type: blocks[blockIndex].glass_type,
            glass_color: blocks[blockIndex].glass_color
          };

          //---------- for SHTULP
          if (isShtulp) {
            newBlock.blockType = 'sash';
            angular.extend(newBlock, sashParams);
          }

          //---- add Id new block in parent block
          blocks[blockIndex].children.push(newBlock.id);
          //---- insert block in blocks
          blocks.push(newBlock);
        }


        function sliceExtraPoints(points) {
          var diff = 5,
            pQty = points.length;
          while (--pQty > -1) {
            var pQty2 = points.length;
            while (--pQty2 > -1) {
              var difX = Math.abs(points[pQty].x - points[pQty2].x),
                difY = Math.abs(points[pQty].y - points[pQty2].y);
              if (difX > 0 && difX < diff) {
                if (difY > 0 && difY < diff) {
                  points.splice(pQty, 1);
                  break;
                }
              }
            }
          }
        }


        function getLastBlockNumber(blocks) {
          var blocksQty = blocks.length,
            blockN = 0,
            tempN;
          while (--blocksQty > 0) {
            tempN = Number(blocks[blocksQty].id.replace(/\D+/g, ""));
            if (tempN > blockN) {
              blockN = tempN;
            }
          }
          return blockN;
        }


        function getImpostCrossPointInBlock(vector, lines) {
          var impPoints = [],
            linesQty = lines.length,
            l,
            coord, checkPoint, isCross, noExist,
            noInCorner1, noInCorner2;
          for (l = 0; l < linesQty; l += 1) {
            //console.log('~~~~~~~~~~~~lines[l]~~~~~~~~', lines[l]);
            coord = SVGServ.getCoordCrossPoint(vector, lines[l]);
            if (coord.x >= 0 && coord.y >= 0) {
              //------ checking is cross point inner of line
              checkPoint = SVGServ.checkLineOwnPoint(coord, lines[l].to, lines[l].from);
              //console.log('~~~~~~~~~~~~checkPoint~~~~~~~~', checkPoint);
              isCross = SVGServ.isInsidePointInLine(checkPoint);
              if (isCross) {
                //---- checking dublicats
                noExist = SVGServ.checkEqualPoints(coord, impPoints);
                if (noExist) {

                  //----------- avoid insert impost in corner
                  noInCorner1 = checkImpPointInCorner(lines[l].from, coord);
                  if (noInCorner1) {
                    noInCorner2 = checkImpPointInCorner(lines[l].to, coord);
                    if (noInCorner2) {
                      //console.log('IMp++++++++++line', lines[l]);
                      //console.log('~~~~~~~~~~~~coord~~~~~~~~', coord);
                      impPoints.push(coord);
                    }
                  }
                }
              }
            }
          }
          return impPoints;
        }


        function getRadiusMaxImpostCurv(position, impVector, linesIn, pointsInSours) {
          var crossPointsIn = getImpostCrossPointInBlock(impVector, linesIn);
          //      console.log('!!!!!!!!!!crossPointsIn!!!!!!!!!', crossPointsIn);
          if (crossPointsIn.length === 2) {
            var impLine = {
              from: crossPointsIn[0],
              to: crossPointsIn[1]
            },
              impRadius = GeneralServ.roundingValue(
                (Math.hypot((impLine.from.x - impLine.to.x), (impLine.from.y - impLine.to.y)) / 2),
                1
              ),
              pointsIn = angular.copy(pointsInSours),
              pointsQty = pointsIn.length,
              currPoints = [],
              currBlockCenter,
              distCenterToImpost,
              coordQ, posQ;

            SVGServ.setLineCoef(impLine);
            coordQ = SVGServ.setQPointCoord(position, impLine, impRadius);
            //------ if impost vert or hor
            if (!impLine.coefA && position === 1) {
              coordQ.y -= impRadius * 2;
            } else if (!impLine.coefB && position === 4) {
              coordQ.x -= impRadius * 2;
            }
            posQ = SVGServ.setPointLocationToLine(impLine.from, impLine.to, coordQ);
            while (--pointsQty > -1) {
              var posP = SVGServ.setPointLocationToLine(impLine.from, impLine.to, pointsIn[pointsQty]);
              if (posP > 0 && posQ > 0) {
                currPoints.push(pointsIn[pointsQty]);
              } else if (posP < 0 && posQ < 0) {
                currPoints.push(pointsIn[pointsQty]);
              }
            }
            currPoints.push(impLine.from, impLine.to);
            //        console.log('!!!!!!!!!!currPoints!!!!!!!!!', currPoints);
            currBlockCenter = SVGServ.centerBlock(currPoints);
            //        console.log('!!!!!!!!!!currBlockCenter!!!!!!!!!', currBlockCenter);
            distCenterToImpost = GeneralServ.roundingValue((Math.abs((impLine.coefA * currBlockCenter.x + impLine.coefB * currBlockCenter.y + impLine.coefC) / Math.hypot(impLine.coefA, impLine.coefB))), 1);
            //      console.log('IMP -------------',impRadius, distCenterToImpost);
            if (impRadius < distCenterToImpost) {
              return impRadius / 2;
            } else {
              return distCenterToImpost / 2;
            }
          }
        }


        function createImpostQPoint(dist, position, curBlockN, blockIndex, blocks) {
          var impQPoint = {
            blockId: blocks[blockIndex].id,
            dir: 'curv',
            id: 'qi' + curBlockN,
            heightQ: dist,
            positionQ: position
          };
          blocks[blockIndex].impost.impostAxis.push(impQPoint);
        }


        /**----------- create SHTULP -----------*/

        function createShtulp(blockID, sashesParams) {
          var blocks = DesignStor.design.templateTEMP.details,
            blocksQty = blocks.length,
            blocksSource = DesignStor.design.templateSourceTEMP.details,
            angel = 90,
            dimType = 0,
            currBlockInd, curBlockN,
            lastBlockN,
            impVector,
            crossPoints;

          //---- save last step
          DesignStor.design.designSteps.push(angular.copy(DesignStor.design.templateSourceTEMP));


          //------- find lines as to current block
          while (--blocksQty > 0) {
            if (blocks[blocksQty].id === blockID) {
              currBlockInd = +blocksQty;
              curBlockN = Number(blocks[blocksQty].id.replace(/\D+/g, ""));
            }
          }
          lastBlockN = getLastBlockNumber(blocksSource);
          impVector = SVGServ.cteateLineByAngel(blocks[currBlockInd].center, angel);
          crossPoints = getImpostCrossPointInBlock(impVector, blocks[currBlockInd].linesOut);

          if (crossPoints.length > 2) {
            sliceExtraPoints(crossPoints);
          }

          var impPointsQty = crossPoints.length;
          if (impPointsQty === 2) {
            while (--impPointsQty > -1) {
              createImpostPoint(crossPoints[impPointsQty], curBlockN, currBlockInd, blocksSource, dimType, 1);
              createChildBlock(lastBlockN += 1, currBlockInd, blocksSource, 1, sashesParams[impPointsQty]);
            }
            //----- change Template
            rebuildSVGTemplate();
          } else {
            //------ show error
            showErrorInBlock(blockID);
          }
        }


        function createSash(type, glassObj) {
          var glass = glassObj.__data__,
            blockID = glassObj.attributes.block_id.nodeValue,
            parentID = glassObj.attributes.parent_id.nodeValue,
            blocks = DesignStor.design.templateSourceTEMP.details,
            blocksQty = blocks.length,
            minGlassSize = d3.min(glass.sizes),
            sashesParams, b;

          function permit(parentID, blocks) {
            var defer = $q.defer();

            function subPermit(parent, blocks) {
              if (parent) {
                if (parent !== 'block_0') {
                  var block = blocks.filter(function (item) {
                    if (item.id === parent) {
                      return item;
                    }
                  });
                  if (block[0].blockType !== "sash") {
                    subPermit(block[0].parent, blocks);
                  } else {
                    defer.resolve('error');
                  }
                } else {
                  defer.resolve('good');
                }
              } else {
                defer.resolve('good');
              }
            }

            subPermit(parentID, blocks);
            return defer.promise;
          }

          permit(parentID, blocks).then(function (result) {
            (result === 'good' || ProductStor.product.construction_type !== 4) ? doSash(type, glassObj) : showErrorInBlock(blockID);
          });

          function doSash(type, glassObj) {
            /**---- shtulps ---*/
            if (type === 8 || type === 9) {
              if (minGlassSize >= globalConstants.minSizeLimitStulp) {

                if (type === 8) {
                  sashesParams = [{
                    openDir: [4],
                    handlePos: 0,
                    sashType: 4
                  },
                  {
                    openDir: (ProductStor.product.construction_type === 4) ? [2] : [1, 2],
                    handlePos: 2,
                    sashType: (ProductStor.product.construction_type === 4) ? 2 : 17
                  }
                  ];
                } else if (type === 9) {
                  sashesParams = [{
                    openDir: (ProductStor.product.construction_type === 4) ? [4] : [1, 4],
                    handlePos: 4,
                    sashType: (ProductStor.product.construction_type === 4) ? 2 : 17
                  },
                  {
                    openDir: [2],
                    handlePos: 0,
                    sashType: 4
                  }
                  ];
                }

                createShtulp(blockID, sashesParams);

              } else {
                //------ show error
                showErrorInBlock(blockID);
              }

            } else {

              if (minGlassSize >= globalConstants.minSizeLimit || glass.square >= globalConstants.squareLimit) {

                //---- save last step
                DesignStor.design.designSteps.push(angular.copy(DesignStor.design.templateSourceTEMP));

                for (b = 1; b < blocksQty; b += 1) {
                  if (blocks[b].id === blockID) {
                    var tmp_gridId = 0;
                    var tmp_gridTxt = "";
                    ProductStor.product.template_source.details.forEach(function (entry) {
                      if (entry.id === blockID) {
                        //console.log(entry);
                        tmp_gridId = entry.gridId;
                        tmp_gridTxt = entry.gridTxt;
                      }
                    });
                    blocks[b].blockType = 'sash';
                    blocks[b].gridId = tmp_gridId;
                    blocks[b].gridTxt = tmp_gridTxt

                    switch (type) {
                      //----- 'left'
                      case 2:
                        blocks[b].openDir = [4];
                        blocks[b].handlePos = 4;
                        blocks[b].sashType = 2;
                        break;
                      //----- 'right'
                      case 3:
                        blocks[b].openDir = [2];
                        blocks[b].handlePos = 2;
                        blocks[b].sashType = 2;
                        break;
                      //----- 'up'
                      case 4:
                        blocks[b].openDir = [1];
                        blocks[b].handlePos = 1;
                        blocks[b].sashType = 7;
                        break;
                      //------ 'down'
                      case 5:
                        blocks[b].openDir = [3];
                        blocks[b].handlePos = 3;
                        blocks[b].sashType = 7;
                        break;
                      //------ 'up', 'right'
                      case 6:
                        blocks[b].openDir = [1, 2];
                        blocks[b].handlePos = 2;
                        blocks[b].sashType = 6;
                        break;
                      //------ 'up', 'left'
                      case 7:
                        blocks[b].openDir = [1, 4];
                        blocks[b].handlePos = 4;
                        blocks[b].sashType = 6;
                        break;
                    }
                    //----- change Template
                    rebuildSVGTemplate();
                  }
                }
              } else {
                //------ show error
                showErrorInBlock(blockID);
              }
              //console.log(ProductStor.product.report)
            }
          }
        }


        function checkShtulp(parentId, blocks, blocksQty) {
          var isShtulp = 0;
          while (--blocksQty > 0) {
            if (blocks[blocksQty].id === parentId) {
              if (blocks[blocksQty].impost) {
                if (blocks[blocksQty].impost.impostAxis[0].type === 'shtulp') {
                  isShtulp = blocksQty;
                }
              }
            }
          }
          return isShtulp;
        }


        function removeSashPropInBlock(block) {
          block.blockType = 'frame';
          delete block.openDir;
          delete block.handlePos;
          delete block.sashType;
          delete block.gridId;
          delete block.gridTxt;
        }


        function removeAllChildrenBlock(blockID, blocks) {
          var blocksQty = blocks.length,
            childQty;
          while (--blocksQty > 0) {
            if (blocks[blocksQty].id === blockID) {
              childQty = blocks[blocksQty].children.length;
              if (childQty) {
                removeAllChildrenBlock(blocks[blocksQty].children[0], blocks);
                removeAllChildrenBlock(blocks[blocksQty].children[1], blocks);
                blocks.splice(blocksQty, 1);
              } else {
                blocks.splice(blocksQty, 1);
              }
              break;
            }
          }

        }


        function deleteSash(glassObj) {
          var blockID = glassObj.attributes.block_id.nodeValue,
            blocks = DesignStor.design.templateSourceTEMP.details,
            blocksQty = blocks.length,
            isShtulp = 0,
            b;

          //---- save last step
          DesignStor.design.designSteps.push(angular.copy(DesignStor.design.templateSourceTEMP));

          for (b = 1; b < blocksQty; b += 1) {
            if (blocks[b].id === blockID) {
              //console.log('delete sash-----', blocks[b]);

              //------- checking existing SHTULP
              isShtulp = checkShtulp(blocks[b].parent, blocks, blocksQty);
              if (isShtulp) {
                //----- delete children blocks and impost points
                removeAllChildrenBlock(blocks[isShtulp].children[0], blocks);
                removeAllChildrenBlock(blocks[isShtulp].children[1], blocks);
                blocks[isShtulp].children.length = 0;
                delete blocks[isShtulp].impost;

              } else {
                removeSashPropInBlock(blocks[b]);
              }
              break;
            }
          }
          //----- change Template
          rebuildSVGTemplate();
        }


        //------ delete sash if block sizes are small (add/remove arc)
        function checkSashesBySizeBlock(template) {
          var blocksSource = DesignStor.design.templateSourceTEMP.details,
            blocksQty = template.details.length,
            isSashDelet = 0,
            partsQty, minGlassSize;
          while (--blocksQty > 0) {
            if (template.details[blocksQty].level && template.details[blocksQty].blockType === 'sash') {
              partsQty = template.details[blocksQty].parts.length;
              while (--partsQty > -1) {
                if (template.details[blocksQty].parts[partsQty].type === 'glass') {
                  minGlassSize = d3.min(template.details[blocksQty].parts[partsQty].sizes);
                              //  console.log('GLASS SIZES', minGlassSize);
                  if (minGlassSize <= globalConstants.minSizeLimit && minGlassSize <= globalConstants.minSizeLimit) {
                    //------ delete sash
                    removeSashPropInBlock(blocksSource[blocksQty]);
                    isSashDelet = 1;
                  }
                }
              }
            }
          }
          return isSashDelet;
        }


        /**++++++++++Edit Corners++++++++*/


        function createCornerPoint(pointN, cornerN, line, blockIndex, blocks) {
          var dictance = 200,
            cornerPoint = {
              type: 'corner',
              id: 'c' + cornerN + '-' + pointN,
              dir: 'line'
            };
          if (pointN === 1) {
            cornerPoint.x = (line.from.x * (line.size - dictance) + line.to.x * dictance) / line.size;
            cornerPoint.y = (line.from.y * (line.size - dictance) + line.to.y * dictance) / line.size;
          } else if (pointN === 2) {
            cornerPoint.x = (line.from.x * dictance + line.to.x * (line.size - dictance)) / line.size;
            cornerPoint.y = (line.from.y * dictance + line.to.y * (line.size - dictance)) / line.size;
          }
          blocks[blockIndex].pointsOut.push(cornerPoint);
        }


        function startCreateCornerPoint(cornerID, cornerN, lines, blockIndex, blocks) {
          var linesQty = lines.length,
            l;
          for (l = 0; l < linesQty; l += 1) {
            if (lines[l].from.id === cornerID) {
              createCornerPoint(1, cornerN, lines[l], blockIndex, blocks);
            } else if (lines[l].to.id === cornerID) {
              createCornerPoint(2, cornerN, lines[l], blockIndex, blocks);
            }
          }
          //----- hide this point
          var pointsOutQty = blocks[blockIndex].pointsOut.length;
          while (--pointsOutQty > -1) {
            if (blocks[blockIndex].pointsOut[pointsOutQty].id === cornerID) {
              blocks[blockIndex].pointsOut[pointsOutQty].view = 0;
            }
          }
        }


        function removePoint(criterions, blockId, blocks) {
          var blockQty = blocks.length,
            pointsQty, critQty;
          while (--blockQty > 0) {
            if (blocks[blockQty].id === blockId) {
              pointsQty = blocks[blockQty].pointsOut.length;
              while (--pointsQty > -1) {
                critQty = criterions.length;
                while (--critQty > -1) {
                  if (blocks[blockQty].pointsOut[pointsQty].id === criterions[critQty]) {
                    blocks[blockQty].pointsOut.splice(pointsQty, 1);
                    break;
                  }
                }
              }
            }
          }
        }


        function createCurveQPoint(typeQ, idQ, line, position, blockIndex, blocks) {
          var pointQ = {
            type: typeQ,
            blockId: blocks[blockIndex].id,
            id: idQ,
            heightQ: line.size / 4,
            fromPId: line.from.id,
            toPId: line.to.id,
            positionQ: position
          };
          //---- insert impostPoint in parent block
          if (!blocks[blockIndex].pointsQ) {
            blocks[blockIndex].pointsQ = [];
          }
          blocks[blockIndex].pointsQ.push(pointQ);
        }


        function createQCPoint(cornerN, blocksInd, blocks) {
          var pointOutQty = blocks[blocksInd].pointsOut.length,
            currLine = {};
          while (--pointOutQty > -1) {
            if (blocks[blocksInd].pointsOut[pointOutQty].type === 'corner') {
              if (blocks[blocksInd].pointsOut[pointOutQty].id === 'c' + cornerN + '-2') {
                currLine.from = blocks[blocksInd].pointsOut[pointOutQty];
              }
              if (blocks[blocksInd].pointsOut[pointOutQty].id === 'c' + cornerN + '-1') {
                currLine.to = blocks[blocksInd].pointsOut[pointOutQty];
              }
            }
          }
          SVGServ.setLineCoef(currLine);
          currLine.size = GeneralServ.roundingValue(
            (Math.hypot((currLine.to.x - currLine.from.x), (currLine.to.y - currLine.from.y))),
            1
          );
          createCurveQPoint('corner', 'qc' + cornerN, currLine, cornerN, blocksInd, blocks);
        }


        function removePointQ(criterion, blockId, blocks) {
          var blockQty = blocks.length,
            qQty;
          while (--blockQty > 0) {
            if (blocks[blockQty].id === blockId) {
              if (blocks[blockQty].pointsQ) {
                qQty = blocks[blockQty].pointsQ.length;
                while (--qQty > -1) {
                  if (blocks[blockQty].pointsQ[qQty].id === criterion) {
                    blocks[blockQty].pointsQ.splice(qQty, 1);
                    break;
                  }
                }
              }
            }
          }
        }


        function setCornerPoints(cornerObj) {
          var cornerID = cornerObj.__data__.id,
            cornerN = Number(cornerID.replace(/\D+/g, "")),
            blockID = cornerObj.attributes.block_id.nodeValue,
            blocksSource = DesignStor.design.templateSourceTEMP.details,
            blocks = DesignStor.design.templateTEMP.details,
            blocksQty = blocks.length;

          //---- save last step
          DesignStor.design.designSteps.push(angular.copy(DesignStor.design.templateSourceTEMP));

          while (--blocksQty > 0) {
            if (blocks[blocksQty].id === blockID) {
              //---- set simple corner
              if (cornerObj.__data__.view) {
                startCreateCornerPoint(cornerID, cornerN, blocks[blocksQty].linesOut, blocksQty, blocksSource);

                //----- change curve corner to simple
              } else {
                //---- delete qc point in blocks
                removePointQ('qc' + cornerN, blockID, blocksSource);
              }
            }
          }
          //----- change Template
          rebuildSVGTemplate();
        }


        function setCurvCornerPoints(cornerObj) {
          var cornerID = cornerObj.__data__.id,
            cornerN = Number(cornerID.replace(/\D+/g, "")),
            blockID = cornerObj.attributes.block_id.nodeValue,
            blocksSource = DesignStor.design.templateSourceTEMP.details,
            blocks = DesignStor.design.templateTEMP.details,
            blocksQty = blocks.length,
            linesQty, l;

          //---- save last step
          DesignStor.design.designSteps.push(angular.copy(DesignStor.design.templateSourceTEMP));

          while (--blocksQty > 0) {
            if (blocks[blocksQty].id === blockID) {
              //----- set curve corner
              if (cornerObj.__data__.view) {
                startCreateCornerPoint(cornerID, cornerN, blocks[blocksQty].linesOut, blocksQty, blocksSource);
                createQCPoint(cornerN, blocksQty, blocksSource);
                //----- change simple corner to corve
              } else {
                linesQty = blocks[blocksQty].linesOut.length;
                for (l = 0; l < linesQty; l += 1) {
                  if (blocks[blocksQty].linesOut[l].from.id === 'c' + cornerN + '-2' && blocks[blocksQty].linesOut[l].to.id === 'c' + cornerN + '-1') {
                    createCurveQPoint(
                      'corner', 'qc' + cornerN, blocks[blocksQty].linesOut[l], cornerN, blocksQty, blocksSource
                    );
                  }
                }
              }
            }
          }
          //----- change Template
          rebuildSVGTemplate();
        }


        function deleteCornerPoints(cornerObj) {
          var cornerID = cornerObj.__data__.id,
            cornerN = Number(cornerID.replace(/\D+/g, "")),
            blockID = cornerObj.attributes.block_id.nodeValue,
            blocksSource = DesignStor.design.templateSourceTEMP.details,
            blocksSourceQty = blocksSource.length,
            pointsOutQty;

          //---- save last step
          DesignStor.design.designSteps.push(angular.copy(DesignStor.design.templateSourceTEMP));

          //------- delete corner point in block
          removePoint(['c' + cornerN + '-1', 'c' + cornerN + '-2'], blockID, blocksSource);

          //------- delete Q point in block
          removePointQ('qc' + cornerN, blockID, blocksSource);

          while (--blocksSourceQty > 0) {
            if (blocksSource[blocksSourceQty].id === blockID) {
              pointsOutQty = blocksSource[blocksSourceQty].pointsOut.length;
              while (--pointsOutQty > -1) {
                if (blocksSource[blocksSourceQty].pointsOut[pointsOutQty].id === cornerID) {
                  blocksSource[blocksSourceQty].pointsOut[pointsOutQty].view = 1;
                }
              }
            }
          }

          //----- change Template
          rebuildSVGTemplate();
        }


        /**++++++++++Edit Arc++++++++*/


        function shiftingCoordPoints(dir, param, points, pointsQty, shift) {
          while (--pointsQty > -1) {
            if (param) {
              if (dir) {
                points[pointsQty].x += shift;
              } else {
                points[pointsQty].x -= shift;
              }
            } else {
              if (dir) {
                points[pointsQty].y += shift;
              } else {
                points[pointsQty].y -= shift;
              }
            }
          }
        }


        function shiftingAllPoints(dir, param, shift, blocks) {
          var blocksQty = blocks.length,
            impostAxisQty;
          while (--blocksQty > 0) {
            if (blocks[blocksQty].level) {
              //------ pointsOut
              if (blocks[blocksQty].pointsOut.length) {
                shiftingCoordPoints(dir, param, blocks[blocksQty].pointsOut, blocks[blocksQty].pointsOut.length, shift);
              }
              //------ pointsIn
              if (blocks[blocksQty].pointsIn.length) {
                shiftingCoordPoints(dir, param, blocks[blocksQty].pointsIn, blocks[blocksQty].pointsIn.length, shift);
              }
              //------ impostAxis
              if (blocks[blocksQty].impost) {
                impostAxisQty = blocks[blocksQty].impost.impostAxis.length;
                if (impostAxisQty) {
                  shiftingCoordPoints(dir, param, blocks[blocksQty].impost.impostAxis, impostAxisQty, shift);
                }
              }
            }
          }
        }


        function rebuildLinesOut(arc, blockIndex, blocks) {
          var currLine,
            center = SVGServ.centerBlock(blocks[blockIndex].pointsOut),
            pointsOut = SVGServ.sortingPoints(blocks[blockIndex].pointsOut, center),
            linesOut = SVGServ.setLines(pointsOut),
            linesQty = linesOut.length;
          while (--linesQty > -1) {
            if (linesOut[linesQty].from.id === arc[0].id && linesOut[linesQty].to.id === arc[1].id) {
              currLine = linesOut[linesQty];
            }
          }
          return currLine;
        }


        function createArc(arcObj) {
          var defer = $q.defer();
          if (!$.isEmptyObject(arcObj)) {

            var arc = arcObj.__data__;
            //        console.log('+++++++++++++ARC+++++++++++++++++++++');
            //------ make changes only if element is frame, don't touch arc
            if (arc.type === 'frame') {
              var arcN = Number(arc.points[0].id.replace(/\D+/g, "")),
                blockID = arcObj.attributes.block_id.nodeValue,
                blocks = angular.copy(DesignStor.design.templateTEMP.details),
                blocksQty = blocks.length,
                blocksSource = DesignStor.design.templateSourceTEMP.details,
                currBlockIndex, currLine, position, b, linesQty;

              //---- save last step
              DesignStor.design.designSteps.push(angular.copy(DesignStor.design.templateSourceTEMP));

              //------- find line and block in order to insert Q point
              for (b = 1; b < blocksQty; b += 1) {
                if (blocks[b].id === blockID) {
                  linesQty = blocks[b].linesOut.length;
                  while (--linesQty > -1) {
                    if (blocks[b].linesOut[linesQty].from.id === arc.points[0].id && blocks[b].linesOut[linesQty].to.id === arc.points[1].id) {
                      currBlockIndex = b;
                      currLine = blocks[b].linesOut[linesQty];
                    }
                  }
                }
              }
              //------ up
              if (arc.points[0].fi < 180 && arc.points[1].fi < 180) {
                position = 1;
                //------ right
              } else if (arc.points[0].fi < 90 && arc.points[1].fi > 270) {
                position = 2;
                //------ down
              } else if (arc.points[0].fi > 180 && arc.points[1].fi > 180) {
                position = 3;
                //------ left
              } else if (arc.points[0].fi < 270 && arc.points[1].fi > 90) {
                position = 4;
              }
              var coordQ = SVGServ.setQPointCoord(position, currLine, currLine.size / 2);
              if (position === 1) {
                shiftingAllPoints(1, 0, coordQ.y, blocks);
                shiftingAllPoints(1, 0, coordQ.y, blocksSource);
                coordQ.y = 0;
              } else if (position === 4) {
                shiftingAllPoints(1, 1, coordQ.x, blocks);
                shiftingAllPoints(1, 1, coordQ.x, blocksSource);
                coordQ.x = 0;
              }
              //------- rebuild linesOut after shifting of points
              if (!coordQ.y || !coordQ.x) {
                currLine = rebuildLinesOut(arc.points, currBlockIndex, blocksSource);
              }
              createCurveQPoint('arc', 'qa' + arcN, currLine, position, currBlockIndex, blocksSource);

              //------ change templateTEMP
              SVGServ.createSVGTemplate(DesignStor.design.templateSourceTEMP, ProductStor.product.profileDepths)
                .then(function (result) {
                  //------ delete sash if block sizes are small
                  var wasSashDelet = checkSashesBySizeBlock(result);
                  if (wasSashDelet) {
                    SVGServ.createSVGTemplate(DesignStor.design.templateSourceTEMP, ProductStor.product.profileDepths)
                      .then(function (result) {
                        DesignStor.design.templateTEMP = angular.copy(result);
                        defer.resolve('done');
                      });
                  } else {
                    DesignStor.design.templateTEMP = angular.copy(result);
                    defer.resolve('done');
                  }

                });

            } else {
              defer.resolve('done');
            }
          }
          return defer.promise;
        }


        function deleteArc(arcObj) {
          var defer = $q.defer();
          if (!$.isEmptyObject(arcObj)) {
            var arc = arcObj.__data__;
            //console.log('DELET ARC+++++++',arc);
            if (arc.type === 'arc') {
              var arcID = arc.points[1].id,
                blockID = arcObj.attributes.block_id.nodeValue,
                blocksSource = DesignStor.design.templateSourceTEMP.details;

              //---- save last step
              DesignStor.design.designSteps.push(angular.copy(DesignStor.design.templateSourceTEMP));

              //------- delete Q point in block (pointsQ)
              removePointQ(arcID, blockID, blocksSource);

              //------ unshifting
              if (!arc.points[1].x) {
                shiftingAllPoints(0, 1, arc.points[0].x, blocksSource);
              } else if (!arc.points[1].y) {
                shiftingAllPoints(0, 0, arc.points[0].y, blocksSource);
              }

              //------ change templateTEMP
              SVGServ.createSVGTemplate(DesignStor.design.templateSourceTEMP, ProductStor.product.profileDepths)
                .then(function (result) {
                  //------ delete sash if block sizes are small
                  var wasSashDelet = checkSashesBySizeBlock(result);
                  if (wasSashDelet) {
                    SVGServ.createSVGTemplate(DesignStor.design.templateSourceTEMP, ProductStor.product.profileDepths)
                      .then(function (result) {
                        DesignStor.design.templateTEMP = angular.copy(result);
                        defer.resolve('done');
                      });
                  } else {
                    DesignStor.design.templateTEMP = angular.copy(result);
                    defer.resolve('done');
                  }

                });

            } else {
              defer.resolve('done');
            }
          }
          return defer.promise;
        }


        function workingWithAllArcs(param) {
          var firstArc = DesignStor.design.selectedArc.shift(),
            arcId = firstArc.attributes.item_id.nodeValue,
            currElem = d3.select('#' + globalConstants.SVG_ID_EDIT + ' [item_id=' + arcId + ']');
          if (currElem[0].length) {
            if (param) {
              createArc(currElem[0][0]).then(function () {
                if (DesignStor.design.selectedArc.length) {
                  $timeout(function () {
                    workingWithAllArcs(param);
                  }, 1);
                }
              });
            } else {
              deleteArc(currElem[0][0]).then(function () {
                if (DesignStor.design.selectedArc.length) {
                  $timeout(function () {
                    workingWithAllArcs(param);
                  }, 1);
                }
              });
            }
          }
        }


        /**++++++++++Edit Imposts++++++++*/




        function createImpost(impType, glassObj) {
          var glass = glassObj.__data__,
            blockID = glassObj.attributes.block_id.nodeValue,
            minGlassSize = d3.min(glass.sizes),
            blocks = DesignStor.design.templateTEMP.details,
            blocksQty = blocks.length,
            blocksSource = DesignStor.design.templateSourceTEMP.details,
            angel, dimType = 0,
            isImpCurv = 0,
            positionQ, currBlockInd,
            curBlockN, lastBlockN, impVector, crossPoints, b;


          if (minGlassSize >= globalConstants.minSizeLimit && glass.square >= globalConstants.squareLimit) {
            //      if(glass.square >= globalConstants.squareLimit) {

            //---- save last step
            DesignStor.design.designSteps.push(angular.copy(DesignStor.design.templateSourceTEMP));

            //-------- dimType x = 0, y = 1

            switch (impType) {
              //----- vertical
              case 2:
                angel = 90;
                break;
              //----- horisontal
              case 3:
                angel = 180;
                dimType = 1;
                break;
              //----- inclined right
              case 4:
                angel = 170;
                dimType = 1;
                break;
              case 5:
                angel = 190;
                dimType = 1;
                break;
              //----- inclined left
              case 6:
                angel = 80;
                break;
              case 7:
                angel = 100;
                break;

              //----- curve vertical
              case 8:
                angel = 90;
                isImpCurv = 1;
                positionQ = 2; //---right
                break;
              case 9:
                angel = 90;
                isImpCurv = 1;
                positionQ = 4; //---left
                break;
              //----- curve horisontal
              case 10:
                angel = 180;
                dimType = 1;
                isImpCurv = 1;
                positionQ = 1; //--- up
                break;
              case 11:
                angel = 180;
                dimType = 1;
                isImpCurv = 1;
                positionQ = 3; //--- down
                break;
              //----- inclined right curve
              case 12:
                angel = 100;
                isImpCurv = 1;
                positionQ = 1; //---- left-up
                break;
              case 13:
                angel = 100;
                isImpCurv = 1;
                positionQ = 3; //---- right-down
                break;
              //----- inclined left curve
              case 14:
                angel = 10;
                dimType = 1;
                isImpCurv = 1;
                positionQ = 4; //----- left-down
                break;
              case 15:
                angel = 10;
                dimType = 1;
                isImpCurv = 1;
                positionQ = 2; //----- right-up
                break;
            }
            //------- find lines as to current block
            for (b = 1; b < blocksQty; b += 1) {
              if (blocks[b].id === blockID) {
                currBlockInd = b;
                curBlockN = Number(blocks[b].id.replace(/\D+/g, ""));
              }
            }
            lastBlockN = getLastBlockNumber(blocksSource);
            impVector = SVGServ.cteateLineByAngel(blocks[currBlockInd].center, angel);
            //        console.log('~~~~~~~~~~~~impVector~~~~~~~~', impVector);
            crossPoints = getImpostCrossPointInBlock(impVector, blocks[currBlockInd].linesOut);

            if (crossPoints.length > 2) {
              sliceExtraPoints(crossPoints);
            }

            var impPointsQty = crossPoints.length;
            if (impPointsQty === 2) {

              while (--impPointsQty > -1) {
                //            createImpostPoint(crossPoints[impPointsQty], curBlockN, currBlockInd, blocksSource, impPointsQty);
                createImpostPoint(crossPoints[impPointsQty], curBlockN, currBlockInd, blocksSource, dimType);
                createChildBlock(++lastBlockN, currBlockInd, blocksSource);
              }
              //------- if impost is curve
              if (isImpCurv) {
                var distMax = getRadiusMaxImpostCurv(
                  positionQ, impVector, blocks[currBlockInd].linesIn, blocks[currBlockInd].pointsIn
                );
                createImpostQPoint(distMax, positionQ, curBlockN, currBlockInd, blocksSource);
              }

              //----- change Template
              rebuildSVGTemplate();
            } else {
              //------ show error
              showErrorInBlock(blockID);
              //TODO reload again createImpost(impType, glassObj) with angel changed+10 degree
            }

          } else {
            //------ show error
            showErrorInBlock(blockID);
          }
        }


        function deleteImpost(impObj) {
          var blockID = impObj.attributes.block_id.nodeValue,
            blocksSource = DesignStor.design.templateSourceTEMP.details,
            blocksQty = blocksSource.length;

          //---- save last step
          DesignStor.design.designSteps.push(angular.copy(DesignStor.design.templateSourceTEMP));

          //----- delete children blocks and impost points
          while (--blocksQty > 0) {
            if (blocksSource[blocksQty].id === blockID) {
              removeAllChildrenBlock(blocksSource[blocksQty].children[0], blocksSource);
              removeAllChildrenBlock(blocksSource[blocksQty].children[1], blocksSource);
              blocksSource[blocksQty].children.length = 0;
              delete blocksSource[blocksQty].impost;
              break;
            }
          }

          //----- change Template
          rebuildSVGTemplate();
        }


        /**++++++++++Create Mirror++++++++*/



        function setNewCoordPointsAsMirror(maxX, points) {
          var pointsQty = points.length;
          while (--pointsQty > -1) {
            //        if(points[pointsQty].type !== 'frame') {
            if (points[pointsQty].x === 0) {
              points[pointsQty].x = maxX;
            } else if (points[pointsQty].x === maxX) {
              points[pointsQty].x = 0;
            } else {
              points[pointsQty].x = maxX - points[pointsQty].x;
            }
            //        }
          }
        }


        function setOppositDirRadiusAsMirror(pointsQ) {
          if (pointsQ.positionQ === 4) {
            pointsQ.positionQ = 2;
          } else if (pointsQ.positionQ === 2) {
            pointsQ.positionQ = 4;
          }
        }


        function setOppositDirRadiusInclinedAsMirror(pointsQ) {
          if (pointsQ.positionQ === 4) {
            pointsQ.positionQ = 3;
          } else if (pointsQ.positionQ === 2) {
            pointsQ.positionQ = 1;
          } else if (pointsQ.positionQ === 1) {
            pointsQ.positionQ = 2;
          } else if (pointsQ.positionQ === 3) {
            pointsQ.positionQ = 4;
          }
        }


        function changeChildrenIdChildren(indexBlock, blocksQty, blocks) {
          var childQty = blocks[indexBlock].children.length,
            lastChildId, b;
          if (childQty) {
            //------- change Id place of children
            lastChildId = blocks[indexBlock].children.pop();
            blocks[indexBlock].children.unshift(lastChildId);
            for (b = 1; b < blocksQty; b += 1) {
              if (blocks[b].id === blocks[indexBlock].children[0] || blocks[b].id === blocks[indexBlock].children[1]) {
                //----- change children
                changeChildrenIdChildren(b, blocksQty, blocks);
              }
            }
          }

        }


        function changeCoordPointsAsMirror(maxX, blocks, blocksQty) {
          var pqQty, b;
          for (b = 1; b < blocksQty; b += 1) {
            if (blocks[b].level && blocks[b].pointsQ) {
              pqQty = blocks[b].pointsQ.length;
              if (pqQty) {
                while (--pqQty > -1) {
                  if (blocks[b].pointsQ[pqQty].id.indexOf('qa') + 1) {
                    setOppositDirRadiusAsMirror(blocks[b].pointsQ[pqQty]);
                  } else if (blocks[b].pointsQ[pqQty].id.indexOf('qc') + 1) {
                    setOppositDirRadiusInclinedAsMirror(blocks[b].pointsQ[pqQty]);
                  }
                }
              }
            }
            if (blocks[b].impost) {
              setNewCoordPointsAsMirror(maxX, blocks[b].impost.impostAxis);
              //------- if impost curve - change Q
              if (blocks[b].impost.impostAxis[2]) {
                var tempLine = {
                  from: blocks[b].impost.impostAxis[0],
                  to: blocks[b].impost.impostAxis[1]
                };
                SVGServ.setLineCoef(tempLine);
                //--------- if horizontal or vertical
                if (!tempLine.coefA || !tempLine.coefB) {
                  setOppositDirRadiusAsMirror(blocks[b].impost.impostAxis[2]);
                } else {
                  setOppositDirRadiusInclinedAsMirror(blocks[b].impost.impostAxis[2]);
                }
              }
            }
            if (blocks[b].pointsOut.length) {
              setNewCoordPointsAsMirror(maxX, blocks[b].pointsOut);
            }
            if (blocks[b].pointsIn.length) {
              setNewCoordPointsAsMirror(maxX, blocks[b].pointsIn);
            }

          }
        }


        function initMirror() {
          var blocks = DesignStor.design.templateSourceTEMP.details,
            blocksQty = blocks.length,
            points = SVGServ.collectAllPointsOut(DesignStor.design.templateTEMP.details),
            maxX = d3.max(points, function (d) {
              return d.x;
            }),
            b;

          //---- save last step
          DesignStor.design.designSteps.push(angular.copy(DesignStor.design.templateSourceTEMP));

          changeCoordPointsAsMirror(maxX, blocks, blocksQty);

          for (b = 1; b < blocksQty; b += 1) {
            if (blocks[b].level === 1) {
              changeChildrenIdChildren(b, blocksQty, blocks);
            }
          }
          //      console.log('mirror blocks_________', blocks);
          rebuildSVGTemplate();
          $timeout(function () {
            DesignStor.design.activeMenuItem = 0;
          }, 500);
        }


        /**++++++++++Set Position by Axises++++++++*/



        function isPointInsideBlock(pointsOut, pointX, pointY) {
          var newP = {
            x: pointX,
            y: pointY
          },
            isInside = 0,
            tempInside = 0,
            pointsOutQty = pointsOut.length,
            p;
          for (p = 0; p < pointsOutQty; p += 1) {
            if (pointsOut[p + 1]) {
              tempInside = SVGServ.setPointLocationToLine(pointsOut[p], pointsOut[p + 1], newP);
            } else {
              tempInside = SVGServ.setPointLocationToLine(pointsOut[p], pointsOut[0], newP);
            }
            if (tempInside > 0) {
              isInside = tempInside;
              break;
            }
          }
          return isInside;
        }

        function rebuildSVGTemplate() {
          SVGServ.createSVGTemplate(DesignStor.design.templateSourceTEMP, ProductStor.product.profileDepths)
            .then(function (result) {
              DesignStor.design.templateTEMP = angular.copy(result);
              DesignStor.design.templateTEMP.details.forEach(function (entry, index) {
                if (entry.impost) {
                  DesignStor.design.templateSourceTEMP.details[index].impost.impostAxis[1].x = entry.impost.impostAxis[0].x;
                  DesignStor.design.templateSourceTEMP.details[index].impost.impostAxis[0].x = entry.impost.impostAxis[1].x;
                }
              });

            });
        }


        function positionAxises() {
          var blocksSource = DesignStor.design.templateSourceTEMP.details,
            blocksQty = blocksSource.length,
            blocks = DesignStor.design.templateTEMP.details,
            parentBlocs = [],
            parentBlocsQty,
            impostInd = [],
            parentSizeMin, parentSizeMax, tempImpost,
            step, impostIndSort, impostIndQty, newX,
            isInside1, isInside2,
            b, p, i;

          //---- save last step
          DesignStor.design.designSteps.push(angular.copy(DesignStor.design.templateSourceTEMP));

          //----- find dimensions of block Level 1
          for (b = 1; b < blocksQty; b += 1) {
            if (blocksSource[b].level === 1) {
              parentBlocs.push(blocksSource[b].pointsOut.map(function (point) {
                return point.x;
              }));
            }
          }
          //console.info('impost parent----', parentBlocs);
          //----- find vertical imosts
          parentBlocsQty = parentBlocs.length;
          for (p = 0; p < parentBlocsQty; p += 1) {
            impostInd = [];
            parentSizeMin = d3.min(parentBlocs[p]);
            parentSizeMax = d3.max(parentBlocs[p]);

            //console.log('max/min', parentSizeMin, parentSizeMax);
            for (b = 1; b < blocksQty; b += 1) {
              if (blocksSource[b].impost) {
                if (blocksSource[b].impost.impostAxis) {
                  //----- if impost vertical
                  if (blocksSource[b].impost.impostAxis[0].x === blocksSource[b].impost.impostAxis[1].x) {
                    //----- if impost belong to parent Block
                    if (blocksSource[b].impost.impostAxis[0].x > parentSizeMin && blocksSource[b].impost.impostAxis[0].x < parentSizeMax) {
                      tempImpost = {
                        ind: b,
                        x: blocksSource[b].impost.impostAxis[0].x
                      };
                      impostInd.push(tempImpost);
                      //console.info('impost', blocksSource[b].impost.impostAxis, tempImpost);
                    }
                  }
                }
              }
            }
            //----- set new step
            step = Math.round(parentSizeMax / (impostInd.length + 1));
            impostIndSort = impostInd.sort(SVGServ.sortByX);
            impostIndQty = impostIndSort.length;

            for (i = 0; i < impostIndQty; i += 1) {
              //-------- insert back imposts X
              if (!i) {
                newX = (parentSizeMin + step);
              } else {
                newX = (impostIndSort[i - 1].x + step);
              }
              //console.warn('final----', newX);
              //--------- checking is new impost Position inside of block
              isInside1 = isPointInsideBlock(
                blocks[impostIndSort[i].ind].pointsOut, newX, blocksSource[impostIndSort[i].ind].impost.impostAxis[0].y
              );
              isInside2 = isPointInsideBlock(
                blocks[impostIndSort[i].ind].pointsOut, newX, blocksSource[impostIndSort[i].ind].impost.impostAxis[1].y
              );
              //----- if inside
              if (!isInside1 && !isInside2) {
                impostIndSort[i].x = newX;
                blocksSource[impostIndSort[i].ind].impost.impostAxis[0].x = newX;
                blocksSource[impostIndSort[i].ind].impost.impostAxis[1].x = newX;
              }

            }
          }
          rebuildSVGTemplate();

        }


        /**++++++++++Set Position by Glass Width++++++++*/


        function prepareBlockXPosition(currBlock, selectedBlocks) {
          var selectedBlock = {
            imps: []
          },
            impostPoints = currBlock.pointsOut.filter(function (point) {
              return point.type === 'impost' || point.type === 'shtulp';
            }),
            impostPointsQty = impostPoints.length,
            isParall, isCouple, isExist, impsQty, glassXArr,
            i, j;

          for (i = 0; i < impostPointsQty; i += 1) {
            isParall = 0;
            isCouple = 0;
            for (j = 0; j < impostPointsQty; j += 1) {
              if (i !== j) {
                if (impostPoints[j].id === impostPoints[i].id) {
                  isCouple = 1;
                  if (impostPoints[j].x === impostPoints[i].x) {
                    isParall = 1;
                  }
                }
              }
            }
            //------ if only one point of impost, deselect this block
            if (isCouple) {
              if (isParall) {
                isExist = 1;
                impsQty = selectedBlock.imps.length;
                //------ seek dublicate
                while (--impsQty > -1) {
                  if (selectedBlock.imps[impsQty].id === impostPoints[i].id) {
                    isExist = 0;
                  }
                }
                if (isExist) {
                  selectedBlock.imps.push(impostPoints[i]);
                }
              }
            } else {
              break;
            }
          }

          if (selectedBlock.imps.length) {
            glassXArr = _.map(currBlock.glassPoints, function (item) {
              return item.x;
            });
            selectedBlock.minX = d3.min(glassXArr);
            selectedBlock.maxX = d3.max(glassXArr);
            selectedBlock.width = (selectedBlock.maxX - selectedBlock.minX);
            selectedBlocks.push(selectedBlock);
          }
        }


        function positionGlasses() {
          var blocks = DesignStor.design.templateTEMP.details,
            blocksQty = blocks.length,
            blocksSource = DesignStor.design.templateSourceTEMP.details,
            selectedGlassQty = DesignStor.design.selectedGlass.length,
            blockID,
            selectedBlocks = [],
            selectedBlocksQty,
            glassWidthAvg,
            impQty1, impQty2, isImpClone,
            impsSBQty, impsSBQty2,
            step, isAprove,
            impostN, blockN,
            g, b, imp1, imp2, sb, isb, sb2, isb2, p;

          //---- save last step
          DesignStor.design.designSteps.push(angular.copy(DesignStor.design.templateSourceTEMP));

          //------- if is exist selected glasses
          if (selectedGlassQty) {
            for (g = 0; g < selectedGlassQty; g += 1) {
              blockID = DesignStor.design.selectedGlass[g].attributes.block_id.nodeValue;
              //----- find this block among all blocks
              for (b = 1; b < blocksQty; b += 1) {
                if (blocks[b].id === blockID) {
                  prepareBlockXPosition(blocks[b], selectedBlocks);
                }
              }
            }
          } else {
            //-------- working with all glass
            //----- collect blocks with parallele imposts
            for (b = 1; b < blocksQty; b += 1) {
              //----- take block only with glass
              if (!blocks[b].children.length && blocks[b].glassPoints) {
                prepareBlockXPosition(blocks[b], selectedBlocks);
              }
            }
          }


          selectedBlocksQty = selectedBlocks.length;
          //------ common glass width for each selectedBlocks
          //glassWidthAvg = GeneralServ.rounding100(selectedBlocks.reduce(function(summ, item) {
          glassWidthAvg = GeneralServ.roundingValue(selectedBlocks.reduce(function (summ, item) {
            return {
              width: (summ.width + item.width)
            };
          }).width / selectedBlocksQty);

          //console.info(selectedBlocks, glassWidthAvg);


          //---- find common impost if 2 selectedBlocks
          if (selectedBlocksQty === 2) {
            //console.info('when 2 glass----');
            impQty1 = selectedBlocks[0].imps.length;
            impQty2 = selectedBlocks[1].imps.length;
            isImpClone = 0;
            circle1: for (imp1 = 0; imp1 < impQty1; imp1 += 1) {
              for (imp2 = 0; imp2 < impQty2; imp2 += 1) {
                if (selectedBlocks[1].imps[imp2].id === selectedBlocks[0].imps[imp1].id) {
                  isImpClone = selectedBlocks[1].imps[imp2].id;
                  break circle1;
                }
              }
            }
          }

          for (sb = 0; sb < selectedBlocksQty; sb += 1) {
            impsSBQty = selectedBlocks[sb].imps.length;
            step = Math.round(glassWidthAvg - selectedBlocks[sb].width);
            //console.info('step----', selectedBlocks[sb]);
            //console.info('step----', glassWidthAvg+' - '+selectedBlocks[sb].width, step);
            for (isb = 0; isb < impsSBQty; isb += 1) {
              if (!selectedBlocks[sb].imps[isb].isChanged) {
                isAprove = 0;
                if (selectedBlocksQty === 2) {
                  if (selectedBlocks[sb].imps[isb].id === isImpClone) {
                    isAprove = 1;
                  }
                } else {
                  isAprove = 1;
                }
                if (isAprove) {
                  if (selectedBlocks[sb].imps[isb].x < selectedBlocks[sb].maxX) {
                    //----- if impost is left, it shoud be decrece if glass is bigger
                    step *= -1;
                  }
                  selectedBlocks[sb].imps[isb].x += step;
                  //console.info('impst----', selectedBlocks[sb].imps[isb].x);
                  //------- set mark in equals impost other blocks
                  for (sb2 = 0; sb2 < selectedBlocksQty; sb2 += 1) {
                    if (isb !== sb2) {
                      impsSBQty2 = selectedBlocks[sb2].imps.length;
                      for (isb2 = 0; isb2 < impsSBQty2; isb2 += 1) {
                        if (sb !== sb2 && selectedBlocks[sb2].imps[isb2].id === selectedBlocks[sb].imps[isb].id) {
                          selectedBlocks[sb2].imps[isb2].isChanged = 1;
                          selectedBlocks[sb2].width -= step;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          //console.warn('FINISH----', selectedBlocks);
          //------- change imposts X in blockSource
          for (sb = 0; sb < selectedBlocksQty; sb += 1) {
            impsSBQty = selectedBlocks[sb].imps.length;
            for (isb = 0; isb < impsSBQty; isb += 1) {
              if (!selectedBlocks[sb].imps[isb].isChanged) {
                impostN = Number(selectedBlocks[sb].imps[isb].id.replace(/\D+/g, ""));
                for (p = 1; p < blocksQty; p += 1) {
                  blockN = Number(blocksSource[p].id.replace(/\D+/g, ""));
                  if (blockN === impostN) {
                    if (blocksSource[p].impost) {
                      blocksSource[p].impost.impostAxis[0].x = +selectedBlocks[sb].imps[isb].x;
                      blocksSource[p].impost.impostAxis[1].x = +selectedBlocks[sb].imps[isb].x;
                    }
                  }
                }

              }
            }
          }
          rebuildSVGTemplate();
        }

        function stepBack() {
          GlobalStor.global.checkDoors = 0;
          var lastIndex = DesignStor.design.designSteps.length - 1;
          DesignStor.design.templateSourceTEMP = angular.copy(DesignStor.design.designSteps[lastIndex]);
          rebuildSVGTemplate();
          DesignStor.design.designSteps.pop();
          cleanTempSize();
          hideSizeTools();
        }


        /**------- Save and Close Construction Page ----------*/
        function saveSizeCheck() {
          if (ProductStor.product.construction_type === 4) {
            DesignStor.design.steps.selectedStep3 = 0;
            DesignStor.design.steps.selectedStep4 = 0;
            DesignStor.design.doorConfig.lockShapeIndex = '';
            DesignStor.design.doorConfig.handleShapeIndex = '';
            DesignStor.design.steps.selectedStep2 = 0;
            DesignStor.design.doorConfig.sashShapeIndex = '';
            DesignStor.design.steps.selectedStep1 = 0;
            DesignStor.design.doorConfig.doorShapeIndex = '';
            //------ close door config
            DesignStor.design.steps.isDoorConfig = 0;
            //------ set Default indexes
            DesignStor.design.doorConfig = DesignStor.setDefaultDoor();

            selectDoor(ProductStor.product.door_shape_id, ProductStor.product);
            selectSash(ProductStor.product.door_sash_shape_id, ProductStor.product).then(function (res) {
              selectHandle(ProductStor.product.door_handle_shape_id, ProductStor.product);
              selectLock(ProductStor.product.door_lock_shape_id, ProductStor.product);
              saveDoorConfig(ProductStor.product).then(function (res2) {
                rebuildSVGTemplate();
                checkSize(DesignStor.design.templateTEMP);
              });
            });


            var intervalID = setInterval(function () {
              if (GlobalStor.global.timeoutFunc === 1) {
                clearInterval(intervalID);
                designSaved();
              }
            }, 50);
          } else {
            ProductStor.product.doorLock = {};
            designSaved();
          }

        }

        function getSizeAlert() {
          if (GlobalStor.global.checkDoors === 0) {
            var isSashesInTemplate;
            closeSizeCaclulator(1).then(function () {
              /** check sizes of all glass */
              MainServ.checkGlassSizes(DesignStor.design.templateTEMP);
              if (DesignStor.design.extraGlass.length) {
                /** expose Alert */
                GlobalStor.global.isLoader = 0;
                DesignStor.design.isGlassExtra = 1;
              } else {
                /** if sash was added/removed in template */
                isSashesInTemplate = MainServ.checkSashInTemplate(DesignStor.design.templateSourceTEMP);
                if (isSashesInTemplate) {
                  /** set first hardware if sash were not existed before */
                  if ((!GlobalStor.global.isSashesInTemplate || !ProductStor.product.hardware.id) && ProductStor.product.construction_type !== 4) {
                    GlobalStor.global.isSashesInTemplate = 1;
                    ProductStor.product.hardware = GlobalStor.global.hardwares[0][0];
                  }
                  /** check sizes of all hardware in sashes */
                  MainServ.checkHardwareSizes(DesignStor.design.templateTEMP);

                } else {
                  /** sashes were removed */
                  ProductStor.product.hardware = {};
                  ProductStor.product.hardware.id = 0;
                  GlobalStor.global.isSashesInTemplate = 0;
                  //------ clean Extra Hardware
                  DesignStor.design.extraHardware.length = 0;
                }

                if (DesignStor.design.extraHardware.length) {
                  /** expose Alert */
                  GlobalStor.global.isLoader = 0;
                  DesignStor.design.isHardwareExtra = 1;
                }
              }
            });
          }
        }

        function designSaved() {
          if (GlobalStor.global.checkDoors === 0) {
            var doorConfig = DesignStor.design.doorConfig,
              isSashesInTemplate;
            GlobalStor.global.isLoader = 1;
            closeSizeCaclulator(1).then(function () {
              /** check sizes of all glass */
              MainServ.checkGlassSizes(DesignStor.design.templateTEMP);
              if (DesignStor.design.extraGlass.length) {
                /** expose Alert */
                GlobalStor.global.isLoader = 0;
                DesignStor.design.isGlassExtra = 1;
              } else {
                /** if sash was added/removed in template */
                isSashesInTemplate = MainServ.checkSashInTemplate(DesignStor.design.templateSourceTEMP);
                if (isSashesInTemplate) {
                  /** set first hardware if sash were not existed before */
                  if ((!GlobalStor.global.isSashesInTemplate || !ProductStor.product.hardware.id) && ProductStor.product.construction_type !== 4) {
                    GlobalStor.global.isSashesInTemplate = 1;
                    ProductStor.product.hardware = GlobalStor.global.hardwares[0][0];
                  }
                  /** check sizes of all hardware in sashes */
                  MainServ.checkHardwareSizes(DesignStor.design.templateTEMP);

                } else {
                  /** sashes were removed */
                  ProductStor.product.hardware = {};
                  ProductStor.product.hardware.id = 0;
                  GlobalStor.global.isSashesInTemplate = 0;
                  //------ clean Extra Hardware
                  DesignStor.design.extraHardware.length = 0;
                }

                if (DesignStor.design.extraHardware.length) {
                  /** expose Alert */
                  GlobalStor.global.isLoader = 0;
                  DesignStor.design.isHardwareExtra = 1;
                } else {
                  /** save new template in product ***** */
                  ProductStor.product.template_source = angular.copy(DesignStor.design.templateSourceTEMP);
                  ProductStor.product.template = angular.copy(DesignStor.design.templateTEMP);

                  /** rebuild glasses */
                  MainServ.setGlassfilter();
                  if (ProductStor.product.construction_type !== 4) {
                    MainServ.setCurrentGlass(ProductStor.product, 1);
                    MainServ.setCurrentProfile(ProductStor.product, ProductStor.product.profile.id).then(function () {
                      next();
                    });
                  } else {
                    next();
                  }

                  //noinspection JSAnnotator
                  function next() {
                    /** create template icon */
                    SVGServ.createSVGTemplateIcon(DesignStor.design.templateSourceTEMP, ProductStor.product.profileDepths)
                      .then(function (result) {
                        ProductStor.product.templateIcon = angular.copy(result);
                      });
                    /** save new template in templates Array */
                    GlobalStor.global.templatesSource[ProductStor.product.templateIndex] = angular.copy(
                      ProductStor.product.template_source
                    );
                    /** check grids */
                    // console.log(ProductStor.product);
                    var isChanged = updateGrids();
                    if (isChanged) {
                      //------ get new grids price
                      var sumMosq = 0;
                      var sumMosqDis = 0;
                      ProductStor.product.chosenAddElements[0].forEach(function (entry) {
                        sumMosq += entry.element_price;
                        sumMosqDis += entry.elementPriceDis;
                      });

                      ProductStor.product.addelem_price -= sumMosq;
                      ProductStor.product.addelemPriceDis -= sumMosqDis;

                      loginServ.getGridPrice(ProductStor.product.chosenAddElements[0]).then(function () {
                        sumMosq = 0;
                        sumMosqDis = 0;
                        ProductStor.product.chosenAddElements[0].forEach(function (entry) {
                          sumMosq += entry.element_price;
                          sumMosqDis += entry.elementPriceDis;
                        });
                        ProductStor.product.addelem_price += sumMosq;
                        ProductStor.product.addelemPriceDis += sumMosqDis;
                      });


                    }
                    SVGServ.createSVGTemplate(ProductStor.product.template_source, ProductStor.product.profileDepths).then(function (result) {
                      ProductStor.product.template = angular.copy(result);
                      /** refresh price of new template */
                      MainServ.preparePrice(
                        ProductStor.product.template,
                        ProductStor.product.profile.id,
                        ProductStor.product.glass,
                        ProductStor.product.hardware.id,
                        ProductStor.product.lamination.lamination_in_id
                      ).then(function () {
                        //-------- template was changed
                        SVGServ.createSVGTemplate(ProductStor.product.template_source, ProductStor.product.profileDepths).then(function (result) {
                          ProductStor.product.template = angular.copy(result);
                          DesignStor.design.templateTEMP = angular.copy(result);
                          GlobalStor.global.isChangedTemplate = 1;
                          backtoTemplatePanel();
                        });
                      });
                    });
                  }
                }
              }
            });
          }
          // console.log("ProductStor.product", ProductStor.product);
        }


        //--------- Cancel and Close Construction Page
        function designCancel() {
          //------- close calculator if is opened
          ProductStor.product = angular.copy(GlobalStor.global.templateTEMP)
          hideSizeTools();
          //------ go to Main Page
          backtoTemplatePanel();
        }


        /**========== FINISH ==========*/


        thisFactory.publicObj = {
          setDefaultTemplate: setDefaultTemplate,
          designSaved: designSaved,
          designCancel: designCancel,
          checkSize: checkSize,
          setDefaultConstruction: setDefaultConstruction,

          initAllImposts: initAllImposts,
          initAllGlass: initAllGlass,
          initAllGlassXGlass: initAllGlassXGlass,
          initAllGlassXGrid: initAllGlassXGrid,
          initAllArcs: initAllArcs,
          initAllDimension: initAllDimension,
          showAllDimension: showAllDimension,
          hideCornerMarks: hideCornerMarks,
          deselectAllImpost: deselectAllImpost,
          deselectAllArc: deselectAllArc,
          deselectAllGlass: deselectAllGlass,
          rebuildSVGTemplate: rebuildSVGTemplate,
          deselectAllDimension: deselectAllDimension,

          //------- edit sash
          createSash: createSash,
          deleteSash: deleteSash,
          //------- edit corners
          setCornerPoints: setCornerPoints,
          setCurvCornerPoints: setCurvCornerPoints,
          deleteCornerPoints: deleteCornerPoints,
          //-------- edit arc
          createArc: createArc,
          deleteArc: deleteArc,
          workingWithAllArcs: workingWithAllArcs,
          //-------- edit impost
          createImpost: createImpost,
          deleteImpost: deleteImpost,
          //-------- mirror
          initMirror: initMirror,
          positionAxises: positionAxises,
          positionGlasses: positionGlasses,
          removeAllEventsInSVG: removeAllEventsInSVG,
          removeGlassEventsInSVG: removeGlassEventsInSVG,
          closeGlassSelectorDialog: closeGlassSelectorDialog,

          //---- change sizes
          setValueSize: setValueSize,
          deleteLastNumber: deleteLastNumber,
          closeSizeCaclulator: closeSizeCaclulator,
          hideSizeTools: hideSizeTools,

          stepBack: stepBack,
          //---- door
          setNewDoorParamValue: setNewDoorParamValue,
          setDoorConfigDefault: setDoorConfigDefault,
          saveSizeCheck: saveSizeCheck,


          toggleDoorConfig: toggleDoorConfig,
          selectDoor: selectDoor,
          selectSash: selectSash,
          selectHandle: selectHandle,
          selectLock: selectLock,
          closeDoorConfig: closeDoorConfig,
          saveDoorConfig: saveDoorConfig,
          checkGlassInTemplate: checkGlassInTemplate,

          updateGrids: updateGrids
        };

        return thisFactory.publicObj;

      });
})();