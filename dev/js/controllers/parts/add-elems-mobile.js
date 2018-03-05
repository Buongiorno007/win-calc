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
            thisCtrl.configaddElementDATA = GeneralServ.addElementDATA;
            thisCtrl.OpenSubFolder = -1;
            thisCtrl.OpenItemFolder = -1;


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

            function OpenFolder(index) {
                thisCtrl.OpenItemFolder = -1;
                if (thisCtrl.OpenSubFolder === index) {
                    thisCtrl.OpenSubFolder = -1;
                } else {
                    thisCtrl.OpenSubFolder = index;
                    AuxStor.aux.isFocusedAddElement = index + 1;
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

            //------ clicking
            thisCtrl.showItems = showItems;
            thisCtrl.OpenFolder = OpenFolder;

            thisCtrl.deleteAddElement = AddElementMenuServ.deleteAddElement;
            thisCtrl.selectAddElement = AddElementsServ.selectAddElem;


        });
})();
