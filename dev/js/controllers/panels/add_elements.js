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
                                                 MainServ) {
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

            /**========== FINISH ==========*/
            function confirmAddElemDialog(typeId, elementId, clickEvent, addElementsList, element) {
                // AuxStor.aux.isFocusedAddElement = 0;
                AddElementsServ.selectAddElem(typeId, elementId, clickEvent, addElementsList, element);
                if (thisCtrl.ChoosenAddElemGroup || ProductStor.product.is_addelem_only) {
                    thisCtrl.confirmAddElem = 1;
                }
                thisCtrl.SelectedElement = ProductStor.product.chosenAddElements[GlobalStor.global.OpenSubFolder].length;
                thisCtrl.addElementsList = addElementsList[0];
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
