(function () {
    "use strict";
    /**@ngInject*/
    angular
        .module("MainModule")
        .controller("AddElementsCtrl", function ($filter,
                                                 $timeout,
                                                 $scope,
                                                 globalConstants,
                                                 GeneralServ,
                                                 AddElementsServ,
                                                 AddElementMenuServ,
                                                 DesignServ,
                                                 GlobalStor,
                                                 UserStor,
                                                 AuxStor,
                                                 ProductStor,
                                                 MainServ,
                                                 OrderStor,
                                                 loginServ,
                                                 SVGServ,
                                                 DesignStor) {
            /*jshint validthis:true */
              /*jshint validthis:true */
            var thisCtrl = this;
            thisCtrl.constants = globalConstants;
            thisCtrl.G = GlobalStor;
            thisCtrl.P = ProductStor;
            thisCtrl.A = AuxStor;
            thisCtrl.U = UserStor;

            thisCtrl.config = {
                DELAY_START: globalConstants.STEP,
                addElementDATA: GeneralServ.addElementDATA,
                DELAY_SHOW_INSIDESLOPETOP: globalConstants.STEP * 20,
                DELAY_SHOW_INSIDESLOPERIGHT: globalConstants.STEP * 22,
                DELAY_SHOW_INSIDESLOPELEFT: globalConstants.STEP * 21,
                DELAY_SHOW_FORCECONNECT: globalConstants.STEP * 30,
                DELAY_SHOW_BALCONCONNECT: globalConstants.STEP * 35,
                DELAY_SHOW_BUTTON: globalConstants.STEP * 40,
                DELAY_SHOW_ELEMENTS_MENU: globalConstants.STEP * 12,
                colorFilter: 5555,
                typing: "on"
            };
            thisCtrl.configaddElementDATA = GeneralServ.addElementDATA;
            //------- translate
            thisCtrl.INSIDES = $filter("translate")("add_elements.INSIDES");
            thisCtrl.OUTSIDES = $filter("translate")("add_elements.OUTSIDES");
            thisCtrl.COMPONENTS = $filter("translate")("add_elements.COMPONENTS");
            thisCtrl.OTHERS = $filter("translate")("add_elements.OTHERS");
            thisCtrl.OTHER = $filter("translate")("add_elements.OTHER");
            thisCtrl.SERVICES = $filter("translate")("add_elements.SERVICES");
            thisCtrl.SERV1 = $filter("translate")("add_elements.SERV1");
            thisCtrl.SERV2 = $filter("translate")("add_elements.SERV2");
            thisCtrl.SERV3 = $filter("translate")("add_elements.SERV3");
            thisCtrl.SERV4 = $filter("translate")("add_elements.SERV4");
            thisCtrl.ALL = $filter("translate")("add_elements.ALL");
            thisCtrl.CHOOSE = $filter("translate")("add_elements.CHOOSE");
            thisCtrl.QTY_LABEL = $filter("translate")("add_elements.QTY_LABEL");
            thisCtrl.WIDTH_LABEL = $filter("translate")("add_elements.WIDTH_LABEL");
            thisCtrl.HEIGHT_LABEL = $filter("translate")("add_elements.HEIGHT_LABEL");
            thisCtrl.OTHER_ELEMENTS1 = $filter("translate")(
                "add_elements.OTHER_ELEMENTS1"
            );
            thisCtrl.OTHER_ELEMENTS2 = $filter("translate")(
                "add_elements.OTHER_ELEMENTS2"
            );
            thisCtrl.LIST_VIEW = $filter("translate")("add_elements.LIST_VIEW");
            thisCtrl.variable = 10;
            $scope.servisesPrice = [0, 0, 0, 0, 0];

            thisCtrl.openIndex = -1;
            
            //Logic and methods from add-elements-mobile file just to reproduce same behavior of screen
            thisCtrl.configaddElementDATA = GeneralServ.addElementDATA;
            thisCtrl.edit = 0;
            thisCtrl.ChoosenAddElemGroup = -1;
            thisCtrl.confirmAddElem = 0;
            thisCtrl.SelectedElement = '';
            thisCtrl.addElementsList = '';
            thisCtrl.lastParent = null;

            thisCtrl.AddElementsMobile = [];

            let addElementsAll = angular.copy(GlobalStor.global.addElementsAll);
            
            /**============ METHODS ================*/
            addElementsAll.forEach((item, index) => {
                if (index === 0) {
                    if (item.elementsList[0])
                        item.elementsList[0] = filterMoscitos(item.elementsList[0]);
                }
                if (GeneralServ.addElementDATA[index].id < 100 && !GeneralServ.addElementDATA[index].disable_mobile) {
                    if (item.elementType && item.elementsList) {
                        let tmp;
                        tmp = GeneralServ.addElementDATA[index];
                        tmp.folder = merge(angular.copy(item.elementType), angular.copy(item.elementsList));
                        thisCtrl.AddElementsMobile.push(tmp);
                    }
                }
            });
            function filterMoscitos(input) {
                let output = [];
                if (!ProductStor.product.is_addelem_only) {
                    output =  angular.copy(input.filter((item) => {
                        return (item.profile_id == ProductStor.product.profile.id);
                    }));
                }
                else {
                    output = angular.copy(input.filter(function(item) {
                        return !item.profile_id;
                    }));
                }
                return output;
            }
            function merge(elementType, elementsList) {
                let result = [];
                elementType.forEach((item, index) => {
                    item.subFolder = elementsList[index];
                    result.push(item);
                });
                return result;
            }
            function OpenFolder(index, event) {
                GlobalStor.global.OpenItemFolder = -1;
                if (GlobalStor.global.OpenSubFolder === index) {
                    GlobalStor.global.OpenSubFolder = -1;
                } else {
                    GlobalStor.global.OpenSubFolder = index;
                    thisCtrl.ChoosenAddElemGroup = index;
                    AuxStor.aux.isFocusedAddElement = index + 1;
                    setTimeout(() => {
                        $('.add-elements-mobile').animate({
                            scrollTop: $(event.target).offset().top + $('.add-elements-mobile').scrollTop() - 100
                        }, 'slow');
                    }, 250);
                    thisCtrl.lastParent = event;
                }

            }
            function showItems(index, event, img) {
                if (GlobalStor.global.OpenItemFolder === index) {
                    GlobalStor.global.OpenItemFolder = -1;
                } else {
                    GlobalStor.global.OpenItemFolder = index;
                    if (img) {
                        setTimeout(() => {
                            $('.add-elements-mobile').animate({
                                scrollTop: $(event.target).offset().top + $('.add-elements-mobile').scrollTop() - 150
                            }, 'slow');
                        }, 250);
                    } else {
                        setTimeout(() => {
                            $('.add-elements-mobile').animate({
                                scrollTop: $(event.target).offset().top + $('.add-elements-mobile').scrollTop() - 120
                            }, 'slow');
                        }, 250);
                    }
                }
            }
            setTimeout(() => {
                $(".folders").each((index, item) => {
                    if (index % 2 === 0) {
                        $(item).addClass('gray');
                    }
                });
            }, 100);

            function deleteGridsInTemplate(blockID) {
                var blocksQty = ProductStor.product.template_source.details.length;
                while (--blocksQty > 0) {
                    if (blockID) {
                        if (ProductStor.product.template_source.details[blocksQty].gridId) {
                            if (ProductStor.product.template_source.details[blocksQty].id === blockID) {
                                delete ProductStor.product.template_source.details[blocksQty].gridId;
                                delete ProductStor.product.template_source.details[blocksQty].gridTxt;
                                break;
                            }
                        }
                    } else {
                        if (ProductStor.product.template_source.details[blocksQty].gridId) {
                            delete ProductStor.product.template_source.details[blocksQty].gridId;
                            delete ProductStor.product.template_source.details[blocksQty].gridTxt;
                        }
                    }
                }
                changeSVGTemplateAsNewGrid();
            }

            function closeGridSelectorDialog() {
                DesignServ.removeGlassEventsInSVG();
                DesignStor.design.selectedGlass.length = 0;
                AuxStor.aux.selectedGrid = 0;
                AuxStor.aux.isGridSelectorDialog = !AuxStor.aux.isGridSelectorDialog;
            }

            function changeSVGTemplateAsNewGrid() {
                SVGServ.createSVGTemplate(ProductStor.product.template_source, ProductStor.product.profileDepths)
                    .then(function (result) {
                        ProductStor.product.template = angular.copy(result);
                        //------ save analytics data
                        //TODO ?? AnalyticsServ.saveAnalyticDB(
                        // UserStor.userInfo.id, OrderStor.order.id, ProductStor.product.template_id, newId, 2);
                    });
            }

            function pushSelectedAddElement(currProduct, currElement) {
                var index = (AuxStor.aux.isFocusedAddElement - 1),
                    existedElement;
                if (index !== 0) {
                    existedElement = checkExistedSelectAddElement(currProduct.chosenAddElements[index], currElement);
                }
                if (!existedElement || index == 0) {
                    var newElementSource = {
                            element_type: index,
                            element_width: 0,
                            element_height: 0,
                            block_id: 0
                        },
                        newElement = angular.extend(newElementSource, currElement);
                    currProduct.chosenAddElements[index].push(newElement);
                    //---- open TABFrame when second element selected
                    if (currProduct.chosenAddElements[index].length === 2) {
                        AuxStor.aux.isTabFrame = 1;
                    }
                }
            }

            function insertGrids(grids) {
                loginServ.getGridPrice(grids).then(function (data) {
                    var dataQty = data.length;
                    AuxStor.aux.currAddElementPrice = 0;
                    if (dataQty) {
                        while (--dataQty > -1) {
                            pushSelectedAddElement(ProductStor.product, data[dataQty]);
                            AuxStor.aux.currAddElementPrice += data[dataQty].elementPriceDis;
                        }
                        AuxStor.aux.currAddElementPrice = GeneralServ.roundingValue(AuxStor.aux.currAddElementPrice);
                        //------ show element price
                        AuxStor.aux.isAddElement = AuxStor.aux.selectedGrid[0] + '-' + AuxStor.aux.selectedGrid[1];
                        //------ Set Total Product Price
                        setAddElementsTotalPrice(ProductStor.product);
                        //------ change SVG
                        changeSVGTemplateAsNewGrid();
                        //------ close Grid Dialog
                        closeGridSelectorDialog();
                    }
                });
            }

            function setCurrGridToBlock(blockId, blockIndex, gridIndex) {
                var sizeGridX = _.map(ProductStor.product.template.details[blockIndex].pointsLight, function (item) {
                        return item.x;
                    }),
                    sizeGridY = _.map(ProductStor.product.template.details[blockIndex].pointsLight, function (item) {
                        return item.y;
                    }),
                    gridTemp;
                //------- insert grid in block
                ProductStor.product.template_source.details[blockIndex].gridId = AuxStor.aux.addElementsList[gridIndex[0]][gridIndex[1]].id;
                ProductStor.product.template_source.details[blockIndex].gridTxt = AuxStor.aux.addElementsList[gridIndex[0]][gridIndex[1]].name;

                ProductStor.product.template.details[blockIndex].gridId = AuxStor.aux.addElementsList[gridIndex[0]][gridIndex[1]].id;
                ProductStor.product.template.details[blockIndex].gridTxt = AuxStor.aux.addElementsList[gridIndex[0]][gridIndex[1]].name;
                //-------- add sizes in grid object
                gridTemp = angular.copy(AuxStor.aux.addElementsList[gridIndex[0]][gridIndex[1]]);
                gridTemp.element_width = Math.round(d3.max(sizeGridX) - d3.min(sizeGridX));
                gridTemp.element_height = Math.round(d3.max(sizeGridY) - d3.min(sizeGridY));
                gridTemp.block_id = blockId;
                return gridTemp;
            }

            function deleteOldGridInList(blockIndex) {
                var chosenGridsQty;
                if (ProductStor.product.template_source.details[blockIndex].gridId) {
                    chosenGridsQty = ProductStor.product.chosenAddElements[0].length;
                    while (--chosenGridsQty > -1) {
                        if (ProductStor.product.chosenAddElements[0][chosenGridsQty].block_id === ProductStor.product.template_source.details[blockIndex].id) {
                            if (ProductStor.product.chosenAddElements[0][chosenGridsQty].element_qty === 1) {
                                ProductStor.product.chosenAddElements[0].splice(chosenGridsQty, 1);
                            } else if (ProductStor.product.chosenAddElements[0][chosenGridsQty].element_qty > 1) {
                                ProductStor.product.chosenAddElements[0][chosenGridsQty].element_qty -= 1;
                            }
                        }
                    }
                }
            }


            function collectGridsAsBlock(blockId, gridIndex) {
                var blocksQty = ProductStor.product.template_source.details.length,
                    gridElements = [];
                while (--blocksQty > 0) {
                    if (blockId) {
                        /** set grid to template block by its Id */
                        if (ProductStor.product.template_source.details[blocksQty].id === blockId && ProductStor.product.template_source.details[blocksQty].blockType === 'sash') {
                            /** check block to old grid
                             * delete in product.choosenAddElements if exist
                             * */
                            deleteOldGridInList(blocksQty);
                            gridElements.push(setCurrGridToBlock(blockId, blocksQty, gridIndex));
                            break;
                        }
                    } else {
                        /** set grid to all template blocks */
                        if (ProductStor.product.template_source.details[blocksQty].blockType === 'sash') {
                            deleteOldGridInList(blocksQty);
                            gridElements.push(setCurrGridToBlock(
                                ProductStor.product.template_source.details[blocksQty].id, blocksQty, gridIndex
                            ));
                        }
                    }
                }
                return gridElements;
            }

            function setGridToAll() {
                var grids = collectGridsAsBlock(0, AuxStor.aux.selectedGrid);
                insertGrids(grids);
                GlobalStor.global.OpenSubFolder = -1;
                GlobalStor.global.OpenItemFolder = -1;
            }

            /**========== FINISH ==========*/
            function confirmAddElemDialog(typeId, elementId, clickEvent, addElementsList, element) {
                // AuxStor.aux.isFocusedAddElement = 0;
                AddElementsServ.selectAddElem(typeId, elementId, clickEvent, addElementsList, element);
                if (thisCtrl.ChoosenAddElemGroup || ProductStor.product.is_addelem_only) {
                    thisCtrl.confirmAddElem = 1;
                }
                thisCtrl.SelectedElement = ProductStor.product.chosenAddElements[GlobalStor.global.OpenSubFolder].length;
                thisCtrl.addElementsList = addElementsList[0];
                //We are not displaying glass selector block becouse we do not need it, just calling the function
                setGridToAll()
            }

            function closeConfirmAddElem() {
                thisCtrl.confirmAddElem = 0;
                thisCtrl.edit = 0;
                GlobalStor.global.isSizeCalculator = 0;
                GlobalStor.global.OpenSubFolder = -1;
                GlobalStor.global.OpenItemFolder = -1;
                setTimeout(() => {
                    $('.add-elements-mobile').animate({
                        scrollTop: $(thisCtrl.lastParent.target).offset().top + $('.add-elements-mobile').scrollTop() - 100
                    }, 'slow');
                }, 50);
            }

            function confirmAddElemDelete(typeId, elementId) {
                function deleteaddelem() {
                    AddElementMenuServ.deleteAddElement(typeId, elementId)
                }

                GeneralServ.confirmAlert(
                    $filter('translate')('common_words.DELETE_ELEM_TITLE'),
                    $filter('translate')('common_words.DELETE_ELEM_TXT'),
                    deleteaddelem
                );
            }

            function setAddElementsTotalPrice(currProduct) {
                var elemTypeQty = currProduct.chosenAddElements.length,
                    elemQty;
                currProduct.addelem_price = 0;
                currProduct.addelemPriceDis = 0;
                while (--elemTypeQty > -1) {
                    elemQty = currProduct.chosenAddElements[elemTypeQty].length;
                    if (elemQty > 0) {
                        while (--elemQty > -1) {
                            currProduct.addelem_price += (currProduct.chosenAddElements[elemTypeQty][elemQty].element_qty * currProduct.chosenAddElements[elemTypeQty][elemQty].element_price);

                        }
                    }
                }
                currProduct.addelem_price = GeneralServ.roundingValue(currProduct.addelem_price);
                currProduct.addelemPriceDis = GeneralServ.setPriceDis(
                    currProduct.addelem_price, OrderStor.order.discount_addelem
                );
                $timeout(function () {
                    if (GlobalStor.global.currOpenPage !== 'history') {
                        MainServ.setProductPriceTOTAL(currProduct);
                    }
                }, 50);
            }

            function deleteAddElement(typeId, elementId) {
                console.log('One')
                if (GlobalStor.global.isQtyCalculator || GlobalStor.global.isSizeCalculator) {
                    /** calc Price previous parameter and close caclulators */
                    finishCalculators();
                    console.log("Two inside if(GlobalStor.global.isQtyCalculator || GlobalStor.global.isSizeCalculator)")
                }
                /**------- if grid delete --------*/
                if (!typeId) {
                    deleteGridsInTemplate(ProductStor.product.chosenAddElements[typeId][elementId].block_id);
                    console.log("three inside if(ProductStor.product.chosenAddElements[typeId][elementId].block_id)")
                }
                ProductStor.product.chosenAddElements[typeId].splice(elementId, 1);
                //------ Set Total Product Price
                setAddElementsTotalPrice(ProductStor.product);
            }

            function editEddElem(AddElemGroup, index) {
                thisCtrl.edit = 1;
                thisCtrl.confirmAddElem = 1;
                thisCtrl.SelectedElement = index;
                thisCtrl.ChoosenAddElemGroup = AddElemGroup;
            }

            function cancelAddElem(typeId, elementId) {
                AddElementMenuServ.deleteAddElement(typeId, elementId);
                thisCtrl.confirmAddElem = 0;
                thisCtrl.edit = 0;
                GlobalStor.global.isSizeCalculator = 0;
                GlobalStor.global.OpenSubFolder = -1;
                GlobalStor.global.OpenItemFolder = -1;
                setTimeout(() => {
                    $('.add-elements-mobile').animate({
                        scrollTop: $(thisCtrl.lastParent.target).offset().top + $('.add-elements-mobile').scrollTop() - 100
                    }, 'slow');
                }, 50);
            }

            // Show Window Scheme Dialog
            function showWindowScheme() {
                filterAddElem();
                //playSound('fly');
                AuxStor.aux.isWindowSchemeDialog = true;
                DesignServ.showAllDimension(globalConstants.SVG_ID_ICON);
            }

            function closeWindowScheme() {
                //playSound('fly');
                AuxStor.aux.isWindowSchemeDialog = false;
            }

            function click(id) {
                GlobalStor.global.typeMenu = 0;
                GlobalStor.global.typeMenuID = id;
                $timeout(function (id) {
                    GlobalStor.global.typeMenu = GlobalStor.global.typeMenuID;
                    thisCtrl.config.colorFilter = GlobalStor.global.typeMenuID;
                    if (GlobalStor.global.typeMenu === 5555) {
                        $(".aux-handle").css({
                            left: 14.375 + "rem",
                            top: 82.625 + "rem"
                        });
                    } else {
                        $(".aux-handle").css({
                            left: 34.375 + "rem",
                            top: 65.625 + "rem"
                        });
                    }
                }, 100);
            }
            function openServiceCalculator(id) {
                GlobalStor.global.isServiceCalculator = 0;
                GlobalStor.global.servicesPriceIndex = id;
                GlobalStor.global.isServiceCalculator = 1;
                setTimeout(function () {
                    $('#calculatorDisplay').focus();
                }, 500);
            }


            /**========== FINISH ==========*/

            //------ clicking
            thisCtrl.click = click;
            thisCtrl.selectAddElement = AddElementsServ.selectAddElement;

            thisCtrl.initAddElementTools = AddElementsServ.initAddElementTools;

            thisCtrl.pressCulculator = AddElementMenuServ.pressCulculator;
            thisCtrl.openAddElementListView = AddElementsServ.openAddElementListView;
            thisCtrl.showWindowScheme = showWindowScheme;
            thisCtrl.closeWindowScheme = closeWindowScheme;
            thisCtrl.openServiceCalculator = openServiceCalculator;
            thisCtrl.deleteAddElement = deleteAddElement;
            thisCtrl.setAddElementsTotalPrice = setAddElementsTotalPrice;
            thisCtrl.setGridToAll = setGridToAll;
            //------ clicking
            thisCtrl.extendUrl = MainServ.extendUrl;
            thisCtrl.showItems = showItems;
            thisCtrl.OpenFolder = OpenFolder;
            thisCtrl.confirmAddElemDialog = confirmAddElemDialog;
            thisCtrl.confirmAddElemDelete = confirmAddElemDelete;
            thisCtrl.closeConfirmAddElem = closeConfirmAddElem;
            thisCtrl.editEddElem = editEddElem;
            thisCtrl.cancelAddElem = cancelAddElem;


            thisCtrl.showInfoBox = MainServ.showInfoBox;
            thisCtrl.selectAddElement = AddElementsServ.selectAddElem;
            thisCtrl.initAddElementTools = AddElementsServ.initAddElementTools;

            thisCtrl.pressCulculator = AddElementMenuServ.pressCulculator;
        });
})();
