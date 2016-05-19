(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .factory('AddElementMenuServ',

  function(
    $q,
    $timeout,
    GlobalStor,
    OrderStor,
    ProductStor,
    CartStor,
    AuxStor,
    DesignStor,
    UserStor,
    localDB,
    GeneralServ,
    loginServ,
    MainServ,
    SVGServ,
    DesignServ,
    AnalyticsServ,
    CartServ,
    CartMenuServ
  ) {
    /*jshint validthis:true */
    var thisFactory = this;





    /**============ METHODS ================*/


    function desactiveAddElementParameters() {
      AuxStor.aux.auxParameter = 0;
      GlobalStor.global.isQtyCalculator = 0;
      GlobalStor.global.isSizeCalculator = 0;
      GlobalStor.global.isWidthCalculator = 0;
    }


    function setAddElementsTotalPrice(currProduct) {
      var elemTypeQty = currProduct.chosenAddElements.length,
          elemQty;
      currProduct.addelem_price = 0;
      currProduct.addelemPriceDis = 0;
      while(--elemTypeQty > -1) {
        elemQty = currProduct.chosenAddElements[elemTypeQty].length;
        if (elemQty > 0) {
          while(--elemQty > -1) {
            currProduct.addelem_price += (currProduct.chosenAddElements[elemTypeQty][elemQty].element_qty * currProduct.chosenAddElements[elemTypeQty][elemQty].element_price);

          }
        }
      }
      currProduct.addelem_price = GeneralServ.roundingValue(currProduct.addelem_price);
      currProduct.addelemPriceDis = GeneralServ.setPriceDis(
        currProduct.addelem_price, OrderStor.order.discount_addelem
      );
      $timeout(function() {
        if(GlobalStor.global.currOpenPage !== 'history') {
          MainServ.setProductPriceTOTAL(currProduct);
        }
      }, 50);
    }



    /** =========== Qty Calculator ========== */

    //--------- Change Qty parameter
    function setValueQty(newValue) {
      var elementIndex = AuxStor.aux.currentAddElementId,
          index = (AuxStor.aux.auxParameter.split('-')[0] - 1);
      if(ProductStor.product.chosenAddElements[index][elementIndex].element_qty < 2 && newValue < 0) {
        return false;
      } else if(ProductStor.product.chosenAddElements[index][elementIndex].element_qty < 6 && newValue == -5) {
        return false;
      } else {
        if(AuxStor.aux.tempSize.length) {
          ProductStor.product.chosenAddElements[index][elementIndex].element_qty =  parseInt(AuxStor.aux.tempSize.join(''), 10) + newValue;
          AuxStor.aux.tempSize.length = 0;
        } else {
          ProductStor.product.chosenAddElements[index][elementIndex].element_qty += newValue;
        }
      }
    }


    //--------- Close Qty Calculator
    function closeQtyCaclulator() {
      //------- close caclulators
      desactiveAddElementParameters();
      //------ clean tempSize
      AuxStor.aux.tempSize.length = 0;
      //--------- Set Total Product Price
      setAddElementsTotalPrice(ProductStor.product);
    }




    /** ============= SIze Calculator ============= */


    function calcAddElemPrice(typeIndex, elementIndex, addElementsList) {
      var item = addElementsList[typeIndex][elementIndex], objXAddElementPrice;
      /** Grid */
      if(item.list_group_id === 20) {

        objXAddElementPrice = {
          currencyId: UserStor.userInfo.currencyId,
          element: item
        };
        //-------- get current add element price
        return localDB.calculationGridPrice(objXAddElementPrice).then(function (results) {
          if (results) {
            item.element_price = angular.copy(GeneralServ.roundingValue(
              GeneralServ.addMarginToPrice(results.priceTotal, GlobalStor.global.margins.margin)
            ));
            item.elementPriceDis = angular.copy(GeneralServ.roundingValue(
              GeneralServ.setPriceDis(item.element_price, OrderStor.order.discount_addelem)
            ));
            AuxStor.aux.currAddElementPrice = angular.copy(item.elementPriceDis);
          }
          return results;
        });

      } else {
        objXAddElementPrice = {
          currencyId: UserStor.userInfo.currencyId,
          elementId: item.id,
          elementWidth: (item.element_width/1000),
          elementHeight: (item.element_height/1000)
        };
        return localDB.getAdditionalPrice(objXAddElementPrice).then(function (results) {
          if (results) {
            item.element_price = GeneralServ.roundingValue(
              GeneralServ.addMarginToPrice(results.priceTotal, GlobalStor.global.margins.margin)
            );
            item.elementPriceDis = GeneralServ.roundingValue(
              GeneralServ.setPriceDis(
                item.element_price, OrderStor.order.discount_addelem
              )
            );
            AuxStor.aux.currAddElementPrice = angular.copy(item.elementPriceDis);
          }
          return results;
        });
      }
    }


    //------- Close Size Calculator
    function closeSizeCaclulator() {
      var elementIndex = AuxStor.aux.currentAddElementId,
          index = (AuxStor.aux.auxParameter.split('-')[0] - 1);
      AuxStor.aux.tempSize.length = 0;
      desactiveAddElementParameters();
      //-------- recalculate add element price
      calcAddElemPrice(index, elementIndex, ProductStor.product.chosenAddElements).then(function() {
        setAddElementsTotalPrice(ProductStor.product);
      });
    }


    function changeElementSize(){
      var newElementSize = '',
          elementIndex = AuxStor.aux.currentAddElementId,
          index = (AuxStor.aux.auxParameter.split('-')[0] - 1);

      newElementSize = parseInt(AuxStor.aux.tempSize.join(''), 10);
      if(GlobalStor.global.isQtyCalculator) {
        ProductStor.product.chosenAddElements[index][elementIndex].element_qty = newElementSize;
      } else if(GlobalStor.global.isSizeCalculator) {
        if(GlobalStor.global.isWidthCalculator) {
          ProductStor.product.chosenAddElements[index][elementIndex].element_width = newElementSize;
        } else {
          ProductStor.product.chosenAddElements[index][elementIndex].element_height = newElementSize;
        }
      }

    }


    //------- Change Size parameter
    function setValueSize(newValue) {
      var sizeLength = AuxStor.aux.tempSize.length;
      //---- clean tempSize if indicate only one 0
      if(sizeLength === 4 || (sizeLength === 1 && !AuxStor.aux.tempSize[0])) {
        AuxStor.aux.tempSize.length = 0;
      }
      if (newValue === '0') {
        if (sizeLength && AuxStor.aux.tempSize[0]) {
          AuxStor.aux.tempSize.push(newValue);
          changeElementSize();
        }
      } else if(newValue === '00') {
        if (sizeLength && AuxStor.aux.tempSize[0]) {
          if (sizeLength < 3) {
            AuxStor.aux.tempSize.push(0, 0);
          } else if (sizeLength === 3) {
            AuxStor.aux.tempSize.push(0);
          }
          changeElementSize();
        }
      } else {
        AuxStor.aux.tempSize.push(newValue);
        changeElementSize();
      }

    }



    //------- Delete last number
    function deleteLastNumber() {
      AuxStor.aux.tempSize.pop();
      if(AuxStor.aux.tempSize.length < 1) {
        AuxStor.aux.tempSize.push(0);
      }
      changeElementSize();
    }



    function pressCulculator(keyEvent) {
      //console.log('PRESS KEY====', keyEvent.which);
      var newValue;
      //------ Enter
      if (keyEvent.which === 13) {
        if (GlobalStor.global.isQtyCalculator) {
          closeQtyCaclulator();
        } else if (GlobalStor.global.isSizeCalculator) {
          closeSizeCaclulator();
        }
      } else if(keyEvent.which === 8) {
        //-------- Backspace
        deleteLastNumber();
      } else {
        //-------- Numbers
        switch(keyEvent.which) {
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
        if(newValue !== undefined) {
          setValueSize(newValue);
        }
      }
    }





    function finishCalculators() {
      //if(AuxStor.aux.tempSize.length) {
      //changeElementSize();
      if(GlobalStor.global.isSizeCalculator) {
        closeSizeCaclulator();
      } else if(GlobalStor.global.isQtyCalculator) {
        closeQtyCaclulator();
      }
      //}
      AuxStor.aux.currentAddElementId = 0;
    }




    //-------- Close AddElements Menu
    function closeAddElementsMenu() {
      if(GlobalStor.global.isQtyCalculator || GlobalStor.global.isSizeCalculator) {
        /** calc Price previous parameter and close caclulators */
        finishCalculators();
      }
      AuxStor.aux.isFocusedAddElement = 0;
      AuxStor.aux.isTabFrame = 0;
      AuxStor.aux.isGridSelectorDialog = 0;
      AuxStor.aux.selectedGrid = 0;
      AuxStor.aux.showAddElementsMenu = 0;
      AuxStor.aux.isAddElement = 0;
      //playSound('swip');
    }







    /** =========== GRID ========== */


    function deleteOldGridInList(blockIndex) {
      var chosenGridsQty;
      if(ProductStor.product.template_source.details[blockIndex].gridId) {
        chosenGridsQty = ProductStor.product.chosenAddElements[0].length;
        while(--chosenGridsQty > -1) {
          if(ProductStor.product.chosenAddElements[0][chosenGridsQty].block_id === ProductStor.product.template_source.details[blockIndex].id) {
            if (ProductStor.product.chosenAddElements[0][chosenGridsQty].element_qty === 1) {
              ProductStor.product.chosenAddElements[0].splice(chosenGridsQty, 1);
            } else if (ProductStor.product.chosenAddElements[0][chosenGridsQty].element_qty > 1) {
              ProductStor.product.chosenAddElements[0][chosenGridsQty].element_qty -= 1;
            }
          }
        }
      }
    }



    function setCurrGridToBlock(blockId, blockIndex, gridIndex) {
      var sizeGridX = ProductStor.product.template.details[blockIndex].pointsLight.map(function(item) {
            return item.x;
          }),
          sizeGridY = ProductStor.product.template.details[blockIndex].pointsLight.map(function(item) {
            return item.y;
          }),
          gridTemp;
      //------- insert grid in block
      ProductStor.product.template_source.details[blockIndex].gridId = AuxStor.aux.addElementsList[gridIndex[0]][gridIndex[1]].id;
      ProductStor.product.template_source.details[blockIndex].gridTxt = AuxStor.aux.addElementsList[gridIndex[0]][gridIndex[1]].name;
      //-------- add sizes in grid object
      gridTemp = angular.copy(AuxStor.aux.addElementsList[gridIndex[0]][gridIndex[1]]);
      gridTemp.element_width = Math.round(d3.max(sizeGridX) - d3.min(sizeGridX));
      gridTemp.element_height = Math.round(d3.max(sizeGridY) - d3.min(sizeGridY));
      gridTemp.block_id = blockId;
      return gridTemp;
    }


    function collectGridsAsBlock(blockId, gridIndex) {
      var blocksQty = ProductStor.product.template_source.details.length,
          gridElements = [];
      while(--blocksQty > 0) {
        if(blockId) {
          /** set grid to template block by its Id */
          if(ProductStor.product.template_source.details[blocksQty].id === blockId) {
            /** check block to old grid
             * delete in product.choosenAddElements if exist
             * */
            deleteOldGridInList(blocksQty);
            gridElements.push(setCurrGridToBlock(blockId, blocksQty, gridIndex));
            break;
          }
        } else {
          /** set grid to all template blocks */
          if(ProductStor.product.template_source.details[blocksQty].blockType === 'sash') {
            deleteOldGridInList(blocksQty);
            gridElements.push(setCurrGridToBlock(
              ProductStor.product.template_source.details[blocksQty].id, blocksQty, gridIndex
            ));
          }
        }
      }
      return gridElements;
    }



    function changeSVGTemplateAsNewGrid () {
      SVGServ.createSVGTemplate(ProductStor.product.template_source, ProductStor.product.profileDepths)
        .then(function(result) {
          ProductStor.product.template = angular.copy(result);
          //------ save analytics data
          //TODO ?? AnalyticsServ.saveAnalyticDB(
          // UserStor.userInfo.id, OrderStor.order.id, ProductStor.product.template_id, newId, 2);
        });
    }




    function closeGridSelectorDialog() {
      DesignServ.removeGlassEventsInSVG();
      DesignStor.design.selectedGlass.length = 0;
      AuxStor.aux.selectedGrid = 0;
      AuxStor.aux.isGridSelectorDialog = !AuxStor.aux.isGridSelectorDialog;
    }



    //--------- when we select new addElement, function checks
    // is there this addElements in order to increase only elementQty
    function checkExistedSelectAddElement(elementsArr, currElement) {
      var elementsQty = elementsArr.length, isExist = 0;
      while(--elementsQty > -1){
        if(elementsArr[elementsQty].id === currElement.id) {
          /** if element has width and height */
          if(currElement.element_width && currElement.element_height) {
            if(elementsArr[elementsQty].element_width === currElement.element_width) {
              if(elementsArr[elementsQty].element_height === currElement.element_height) {
                isExist+=1;
              }
            }
          }
          /** if element has only width */
          if(currElement.element_width && !currElement.element_height) {
            if(elementsArr[elementsQty].element_width === currElement.element_width) {
              isExist+=1;
            }
          }
          /** if element has only qty */
          if(!currElement.element_width && !currElement.element_height) {
            isExist+=1;
          }

          /** increase quantity if exist */
          if(isExist) {
            elementsArr[elementsQty].element_qty += 1;
            break;
          }
        }

      }
      return isExist;
    }


    function pushSelectedAddElement(currProduct, currElement) {
      var index = (AuxStor.aux.isFocusedAddElement - 1),
          existedElement;
      existedElement = checkExistedSelectAddElement(currProduct.chosenAddElements[index], currElement);
      if(!existedElement) {
        var newElementSource = {
              element_type: index,
              element_width: 0,
              element_height: 0,
              block_id: 0
            },
            newElement = angular.extend(newElementSource, currElement);
        currProduct.chosenAddElements[index].push(newElement);
        //---- open TABFrame when second element selected
        if(currProduct.chosenAddElements[index].length === 2) {
          AuxStor.aux.isTabFrame = 1;
        }
      }
    }



    function insertGrids(grids) {
      loginServ.getGridPrice(grids).then(function(data) {
        var dataQty = data.length;
        AuxStor.aux.currAddElementPrice = 0;
        if(dataQty) {
          while(--dataQty > -1) {
            pushSelectedAddElement(ProductStor.product, data[dataQty]);
            AuxStor.aux.currAddElementPrice += data[dataQty].elementPriceDis;
          }
          AuxStor.aux.currAddElementPrice = GeneralServ.roundingValue(AuxStor.aux.currAddElementPrice);
          //------ show element price
          AuxStor.aux.isAddElement = AuxStor.aux.selectedGrid[0]+'-'+AuxStor.aux.selectedGrid[1];
          //------ Set Total Product Price
          setAddElementsTotalPrice(ProductStor.product);
          //------ change SVG
          changeSVGTemplateAsNewGrid();
          //------ close Grid Dialog
          closeGridSelectorDialog();
        }
      });
    }



    /** set Selected Grids */
    function confirmGrid() {
      if(DesignStor.design.selectedGlass.length) {
        var grids = DesignStor.design.selectedGlass.map(function(item) {
          var blockId = item.attributes.block_id.nodeValue;
          //------- collect grids relative to blocks
          return collectGridsAsBlock(blockId, AuxStor.aux.selectedGrid)[0];
        });
        insertGrids(grids);
      }
    }



    /** set Grids for all Sashes */
    function setGridToAll() {
      var grids = collectGridsAsBlock(0, AuxStor.aux.selectedGrid);
      insertGrids(grids);
    }





    function deleteGridsInTemplate(blockID) {
      var blocksQty = ProductStor.product.template_source.details.length;
      while(--blocksQty > 0) {
        if(blockID) {
          if(ProductStor.product.template_source.details[blocksQty].id === blockID) {
            if(ProductStor.product.template_source.details[blocksQty].gridId) {
              delete ProductStor.product.template_source.details[blocksQty].gridId;
              delete ProductStor.product.template_source.details[blocksQty].gridTxt;
              break;
            }
          }
        } else {
          if(ProductStor.product.template_source.details[blocksQty].gridId) {
            delete ProductStor.product.template_source.details[blocksQty].gridId;
            delete ProductStor.product.template_source.details[blocksQty].gridTxt;
          }
        }
      }
      changeSVGTemplateAsNewGrid();
    }






    function getAddElementPrice(typeIndex, elementIndex) {
      var deferred = $q.defer();
      AuxStor.aux.isAddElement = typeIndex+'-'+elementIndex;
      calcAddElemPrice(typeIndex, elementIndex, AuxStor.aux.addElementsList).then(function() {
        deferred.resolve(angular.copy(AuxStor.aux.addElementsList[typeIndex][elementIndex]));
      });
      return deferred.promise;
    }




    /**--------- Select AddElement ------------*/

    function chooseAddElement(typeIndex, elementIndex) {
      if(GlobalStor.global.isQtyCalculator || GlobalStor.global.isSizeCalculator) {
        /** calc Price previous parameter and close caclulators */
        finishCalculators();
      }
      AuxStor.aux.currAddElementPrice = 0;
      if (typeIndex === undefined && elementIndex === undefined) {
        /**------- if all grids deleting --------*/
        if(AuxStor.aux.isFocusedAddElement === 1) {
          deleteGridsInTemplate();
        }
        var index = (AuxStor.aux.isFocusedAddElement - 1);
        AuxStor.aux.isAddElement = 0;
        //-------- clean all elements in selected Type
        ProductStor.product.chosenAddElements[index].length = 0;

        //-------- Set Total Product Price
        setAddElementsTotalPrice(ProductStor.product);

      } else {
        getAddElementPrice(typeIndex, elementIndex).then(function (addElem) {
          pushSelectedAddElement(ProductStor.product, addElem);
          //Set Total Product Price
          setAddElementsTotalPrice(ProductStor.product);

          //------ save analytics data
          //TODO ??? AnalyticsServ.saveAnalyticDB(
          // UserStor.userInfo.id, OrderStor.order.id, ProductStor.product.profile.id, addElem.id, typeIndex);
        });
      }
    }



    /** --------- Select AddElement List --------------*/

    function chooseAddElementList(typeIndex, elementIndex) {
      var productsQty, p;
      /** in main page */
      if(GlobalStor.global.currOpenPage === 'main') {

        /** if grid,  show grid selector dialog */
        if(AuxStor.aux.isFocusedAddElement === 1) {
          if(ProductStor.product.is_addelem_only) {
            /** without window */
            pushSelectedAddElement(ProductStor.product, AuxStor.aux.addElementsList[typeIndex][elementIndex]);
            //---------- Set Total Product Price
            setAddElementsTotalPrice(ProductStor.product);
          } else {
            //------- show Grid Selector Dialog
            AuxStor.aux.selectedGrid = [typeIndex, elementIndex];
            AuxStor.aux.isGridSelectorDialog = 1;
            DesignServ.initAllGlassXGrid();
          }
        } else {
          pushSelectedAddElement(ProductStor.product, AuxStor.aux.addElementsList[typeIndex][elementIndex]);
          //---------- Set Total Product Price
          setAddElementsTotalPrice(ProductStor.product);
        }

      } else if(GlobalStor.global.currOpenPage === 'cart') {
        /** in cart page */
        productsQty = CartStor.cart.selectedProducts.length;
        for(p = 0; p < productsQty; p+=1) {
          if(CartStor.cart.selectedProducts[p].length) {
            pushSelectedAddElement(OrderStor.order.products[p], AuxStor.aux.addElementsList[typeIndex][elementIndex]);
            //Set Total Product Price
            CartServ.calculateAddElemsProductsPrice(1);
            CartMenuServ.joinAllAddElements();
            CartServ.collectAllAddElems();
            CartServ.getAddElemsPriceTotal();
            //------ change order Price
            CartMenuServ.calculateOrderPrice();
          }
        }
      }
      //----- hide element price in menu
      AuxStor.aux.currAddElementPrice = 0;
      //------ save analytics data
      //TODO ??? AnalyticsServ.saveAnalyticDB(
      // UserStor.userInfo.id, OrderStor.order.id, ProductStor.product.profile.id,
      // AuxStor.aux.addElementsList[typeIndex][elementIndex].id, typeIndex);
      AuxStor.aux.isAddElement = 0;
    }



    /** --------- Select AddElement from Search Box --------------*/

    function addingElemFilt(groupId, typeId, elementId) {
      calcAddElemPrice(typeId, elementId, AuxStor.aux.addElementsList).then(function() {
        var index = (groupId - 1),
            currElement = angular.copy(AuxStor.aux.addElementsList[typeId][elementId]),
            existedElement;

        existedElement = checkExistedSelectAddElement(ProductStor.product.chosenAddElements[index], currElement);
        if(!existedElement) {
          var newElementSource = {
                element_type: index,
                element_width: 0,
                element_height: 0,
                block_id: 0
              },
              newElement = angular.extend(newElementSource, currElement);

          ProductStor.product.chosenAddElements[index].push(newElement);
        }
        setAddElementsTotalPrice(ProductStor.product);
      });
    }


    function takeAddElemFilt(groupId, typeId, elementId, clickEvent) {
      clickEvent.stopPropagation();
      closeAddElementsMenu();

      AuxStor.aux.addElementsList = angular.copy(GlobalStor.global.addElementsAll[groupId-1].elementsList);

      /** if grid,  show grid selector dialog */
      if(groupId === 1) {
        if(ProductStor.product.is_addelem_only) {
          /** without window */
          addingElemFilt(groupId, typeId, elementId);
        } else {
          AuxStor.aux.isFocusedAddElement = groupId;
          //------- show Grid Selector Dialog
          AuxStor.aux.selectedGrid = [typeId, elementId];
          AuxStor.aux.isGridSelectorDialog = 1;
          DesignServ.initAllGlassXGrid();
        }
      } else {
        addingElemFilt(groupId, typeId, elementId);
      }

    }




    /**-------- Delete AddElement from global object ---------*/

    function deleteAddElement(typeId, elementId) {
      if(GlobalStor.global.isQtyCalculator || GlobalStor.global.isSizeCalculator) {
        /** calc Price previous parameter and close caclulators */
        finishCalculators();
      }
      /**------- if grid delete --------*/
      if(AuxStor.aux.isFocusedAddElement === 1) {
        deleteGridsInTemplate(ProductStor.product.chosenAddElements[typeId][elementId].block_id);
      }
      ProductStor.product.chosenAddElements[typeId].splice(elementId, 1);
      //------ Set Total Product Price
      setAddElementsTotalPrice(ProductStor.product);
    }




    /**--------- Delete All List of selected AddElements -------------*/

    function deleteAllAddElements() {
      var elementsQty = ProductStor.product.chosenAddElements.length, i;
      for(i = 0; i < elementsQty; i+=1) {
        /**------- check grids -----*/
        if(!i) {
          if(ProductStor.product.chosenAddElements[i].length) {
            deleteGridsInTemplate();
          }
        }
        ProductStor.product.chosenAddElements[i].length = 0;
      }
      ProductStor.product.addelem_price = 0;
      ProductStor.product.addelemPriceDis = 0;
      //------ Set Total Product Price
      setAddElementsTotalPrice(ProductStor.product);
      //------ close AddElements Menu
      closeAddElementsMenu();
    }










    /**========== FINISH ==========*/


    thisFactory.publicObj = {
      closeAddElementsMenu: closeAddElementsMenu,
      chooseAddElement: chooseAddElement,
      setAddElementsTotalPrice:setAddElementsTotalPrice,
      chooseAddElementList: chooseAddElementList,
      getAddElementPrice: getAddElementPrice,
      deleteAddElement: deleteAddElement,
      deleteAllAddElements: deleteAllAddElements,
      finishCalculators: finishCalculators,
      takeAddElemFilt: takeAddElemFilt,
      //---- grid
      confirmGrid: confirmGrid,
      setGridToAll: setGridToAll,
      closeGridSelectorDialog: closeGridSelectorDialog,
      //---- calculators:
      pressCulculator: pressCulculator,
      setValueQty: setValueQty,
      closeQtyCaclulator: closeQtyCaclulator,
      setValueSize: setValueSize,
      deleteLastNumber: deleteLastNumber,
      changeElementSize: changeElementSize,
      closeSizeCaclulator: closeSizeCaclulator
    };

    return thisFactory.publicObj;

  });
})();
