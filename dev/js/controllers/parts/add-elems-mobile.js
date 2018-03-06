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
            thisCtrl.MM = $filter('translate')('mainpage.MM');

            thisCtrl.configaddElementDATA = GeneralServ.addElementDATA;
            thisCtrl.OpenSubFolder = -1;
            thisCtrl.OpenItemFolder = -1;
            thisCtrl.confirmAddElem = 0;
            thisCtrl.SelectedElement = '';
            thisCtrl.addElementsList = '';


            function merge(item1, item2) {
                let result = [];
                item1.forEach((item, index) => {
                    item.subFolder = item2[index];
                    result.push(item);
                });
                return result;
            }

            thisCtrl.AddElementsMobile = [];
            GlobalStor.global.addElementsAll.forEach((item, index) => {
                if (index < 13) {
                    if (item.elementType && item.elementsList) {
                        let tmp;
                        tmp = GeneralServ.addElementDATA[index];
                        tmp.folder = merge(item.elementType, item.elementsList);
                        thisCtrl.AddElementsMobile.push(tmp);
                    }
                }
            });

            function OpenFolder(index, event) {
                thisCtrl.OpenItemFolder = -1;
                if (thisCtrl.OpenSubFolder === index) {
                    thisCtrl.OpenSubFolder = -1;
                } else {
                    thisCtrl.OpenSubFolder = index;
                    AuxStor.aux.isFocusedAddElement = index + 1;
                    setTimeout(() => {
                        $('.add-elements-mobile').animate({scrollTop: $(event.target).offset().top + $('.add-elements-mobile').scrollTop() - 100}, 'slow');
                    }, 250);
                }

            }

            function showItems(index) {
                if (thisCtrl.OpenItemFolder === index) {
                    thisCtrl.OpenItemFolder = -1;
                } else {
                    thisCtrl.OpenItemFolder = index;
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
                AddElementsServ.selectAddElem(typeId, elementId, clickEvent, addElementsList, element);
                thisCtrl.confirmAddElem = 1;
                thisCtrl.SelectedElement = ProductStor.product.chosenAddElements[thisCtrl.OpenSubFolder].length;
                thisCtrl.addElementsList = addElementsList[0];
            }

            function closeConfirmAddElem() {
                thisCtrl.confirmAddElem = 0;
            }

            function confirmAddElemDelete(typeId, elementId) {
                console.log(typeId);

                function deleteaddelem() {
                    AddElementMenuServ.deleteAddElement(typeId, elementId)
                }

                GeneralServ.confirmAlert(
                    $filter('translate')('common_words.DELETE_ORDER_TITLE'),
                    $filter('translate')('common_words.DELETE_ORDER_TXT'),
                    deleteaddelem
                );
            }
            function editEddElem(index) {
                thisCtrl.confirmAddElem = 1;
                thisCtrl.SelectedElement = index;
            }

            function cancelAddElem(typeId, elementId) {
                AddElementMenuServ.deleteAddElement(typeId, elementId);
                closeConfirmAddElem();
            }

            //------ clicking
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
