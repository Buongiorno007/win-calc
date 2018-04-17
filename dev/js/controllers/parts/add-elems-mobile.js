(function () {
    "use strict";
    /**@ngInject*/
    angular
        .module("MainModule")
        .controller("MobileAddElementsCtrl", function ($filter,
                                                       $timeout,
                                                       $scope,
                                                       globalConstants,
                                                       GeneralServ,
                                                       MainServ,
                                                       loginServ,
                                                       AddElementsServ,
                                                       AddElementMenuServ,
                                                       DesignServ,
                                                       GlobalStor,
                                                       UserStor,
                                                       AuxStor,
                                                       ProductStor) {
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

            thisCtrl.COUNT = $filter('translate')('common_words.COUNT');
            thisCtrl.WIDTH_LABEL = $filter('translate')('add_elements.WIDTH_LABEL');
            thisCtrl.LENGTH_LABEL = $filter('translate')('add_elements.LENGTH_LABEL');
            thisCtrl.QTY_LABEL = $filter('translate')('add_elements.QTY_LABEL');
            thisCtrl.ADD = $filter('translate')('add_elements.ADD');
            thisCtrl.DELETE = $filter('translate')('add_elements.DELETE');
            thisCtrl.PRICE = $filter('translate')('add_elements.PRICE');
            thisCtrl.MM = $filter('translate')('mainpage.MM');

            thisCtrl.configaddElementDATA = GeneralServ.addElementDATA;
            thisCtrl.edit = 0;
            thisCtrl.ChoosenAddElemGroup = -1;
            thisCtrl.confirmAddElem = 0;
            thisCtrl.SelectedElement = '';
            thisCtrl.addElementsList = '';
            thisCtrl.lastParent = null;

            thisCtrl.AddElementsMobile = [];

            GlobalStor.global.addElementsAll.forEach((item, index) => {
                if (index === 0) {
                    if (item.elementsList[0]) {
                        item.elementsList[0] = filterMoscitos(item.elementsList[0]);
                    }
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
                input.forEach((item, index) => {
                    if (item.profile_id === ProductStor.product.profile.id) {
                        output.push(item);
                    }
                });
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
                if (thisCtrl.ChoosenAddElemGroup) {
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