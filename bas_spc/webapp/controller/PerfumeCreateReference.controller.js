sap.ui.define([
    "com/emami/spc/controller/BaseController",
    "sap/ui/core/BusyIndicator",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "../utility/formatter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, BusyIndicator, MessageBox, Filter, FilterOperator, formatter) {
        "use strict";

        return BaseController.extend("com.emami.spc.controller.PerfumeCreateReference", {
            formatter: formatter,

            onInit: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("RoutePRMCreateReference").attachPatternMatched(this._onObjectMatched, this);
            },

            _onObjectMatched: function (oEvent) {

                var Matnr = oEvent.getParameter("arguments").Matnr;
                var Versn = oEvent.getParameter("arguments").Versn;
                var UserType = oEvent.getParameter("arguments").User;

                this.fnSetUserType(UserType);
                this.fnSetRMEditablePRM(UserType); 

                var oJsonCentralModel = this.getView().getModel("jsonCentralModel");
                oJsonCentralModel.setProperty("/PerfumeMaterial/Data/Versn", Versn);
                oJsonCentralModel.setProperty("/PerfumeMaterial/Data/NextReview", '');
                oJsonCentralModel.setProperty("/PerfumeMaterial/Data/EffctDate", '');

                let aRevisonLog = oJsonCentralModel.getProperty("/PerfumeMaterial/Data/PRMRevisionLog/results");
                aRevisonLog.push({
                    "Matnr": Matnr,
                    "Versn": "",
                    "Revlg": "",
                    "Revdt": null
                });

                oJsonCentralModel.setProperty("/PerfumeMaterial/Data/PRMRevisionLog/results", aRevisonLog);

                this.fnRMSearchHelp();

            },
            onPressCreateBtn: function () {
                var oJsonCentralModel = this.getView().getModel("jsonCentralModel");
                var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;

                let Data1 = { ...oJsonCentralModel.oData.PerfumeMaterial.Data };
                let aRevisonLog = [...Data1.PRMRevisionLog.results];
                // let check = false;
                if (aRevisonLog) {
                    aRevisonLog.forEach(item => {
                        delete item.Editable;
                    });
                }

                var TempData = JSON.parse(oJsonCentralModel.getJSON());
                var Data = TempData.PerfumeMaterial.Data;

                var PerpDate = null;
                var EffctDate = null;
                var NextReview = null;
                var Createdon = null;
                var Reviewon = null;
                var Aproveon = null;

                if (Data.PerpDate) {
                    var aTemp = Data.PerpDate.split("T");
                    PerpDate = new Date(aTemp[0]);
                    if (oJsonCentralModel.getProperty("/PerfumeMaterial/PRMDateChange/PerpDate")) {
                        PerpDate.setDate(PerpDate.getDate() + 1);
                    }
                }
                if (Data.EffctDate) {
                    var aTemp = Data.EffctDate.split("T");
                    EffctDate = new Date(aTemp[0]);
                    if (oJsonCentralModel.getProperty("/PerfumeMaterial/PRMDateChange/EffctDate")) {
                        EffctDate.setDate(EffctDate.getDate() + 1);
                    }
                }
                if (Data.NextReview) {
                    var aTemp = Data.NextReview.split("T");
                    NextReview = new Date(aTemp[0]);
                    if (oJsonCentralModel.getProperty("/PerfumeMaterial/PRMDateChange/NextReview")) {
                        NextReview.setDate(NextReview.getDate() + 1);
                    }
                }

                if (Data.Createdon) {
                    var aTemp = Data.Createdon.split("T");
                    Createdon = new Date(aTemp[0]);
                    // Createdon.setDate(Createdon.getDate() + 1);
                }

                if (Data.Reviewon) {
                    var aTemp = Data.Reviewon.split("T");
                    Reviewon = new Date(aTemp[0]);
                    // Reviewon.setDate(Reviewon.getDate() + 1);
                }

                if (Data.Aproveon) {
                    var aTemp = Data.Aproveon.split("T");
                    Aproveon = new Date(aTemp[0]);
                    // Aproveon.setDate(Aproveon.getDate() + 1);
                }

                var payload = Data;
                payload.Action = '2';

                payload.PerpDate = PerpDate;
                payload.EffctDate = EffctDate;
                payload.NextReview = NextReview;
                payload.Createdon = Createdon;
                payload.Reviewon = Reviewon;
                payload.Aproveon = Aproveon;

                var versionLogic = (item) => {
                    item.Versn = payload.Versn;
                    return item;
                };

                payload.PspecificationItemSet = Data.PspecificationItemSet.results;
                payload.PRMApprovedVendor = Data.PRMApprovedVendor.results;

                if (payload.PspecificationItemSet.length > 0) {
                    var aTemp = payload.PspecificationItemSet.map(versionLogic);
                    payload.PspecificationItemSet = aTemp;
                }


                let DataRevisonLog = JSON.parse(JSON.stringify(aRevisonLog));
                if (DataRevisonLog) {
                    let fnRevisonDateLogic = (item) => {
                        if (item.Revdt) {
                            let Revdt = null;
                            var aTemp = item.Revdt.split("T");
                            Revdt = new Date(aTemp[0]);
                            if (item?.CheckChangeRevisionDate) {
                                Revdt.setDate(Revdt.getDate() + 1);
                            }
                            item.Revdt = Revdt;
                        }
                        return item;
                    };
                    DataRevisonLog = DataRevisonLog.map(fnRevisonDateLogic);
                }

                payload.PRMRevisionLog = DataRevisonLog;

                let fnRemoveLogic = (item) => {
                    if (item?.CheckChangeRevisionDate) {
                        delete item.CheckChangeRevisionDate;
                    }
                    return item;
                };
                payload.PRMRevisionLog = payload.PRMRevisionLog.map(fnRemoveLogic);

                // payload.RevisionLog = aRevisonLog;

                var that = this;
                var oModel = this.getView().getModel();
                BusyIndicator.show();
                oModel.create("/PerfumeSet", payload,
                    {
                        success: function (oSucess) {
                            BusyIndicator.hide();
                            MessageBox.success(
                                "Perfume Specification Created Successfully", {
                                styleClass: bCompact ? "sapUiSizeCompact" : "",
                                onClose: function () {
                                    that.onPressHome();
                                }
                            }
                            );
                        },
                        error: function (oError) {
                            BusyIndicator.hide();
                        }
                    });

            },
            onDeleteSpecification: function (oEvent) {


                var sPath = oEvent.getSource().getParent().oBindingContexts.jsonCentralModel.sPath;
                var Clicked = this.getView().getModel("jsonCentralModel").getProperty(sPath);
                var oModel = this.getView().getModel("jsonCentralModel");
                var Data = oModel.getProperty("/PerfumeMaterial/Data/PspecificationItemSet/results");

                var NewData = Data.filter(item => item.Lineitm != Clicked.Lineitm);
                oModel.setProperty("/PerfumeMaterial/Data/PspecificationItemSet/results", NewData);
                oModel.refresh();
            },

            onAddSpecificationItem: function () {
                var oModel = this.getView().getModel("jsonCentralModel");
                var Data = oModel.getProperty("/PerfumeMaterial/Data/PspecificationItemSet/results");

                var Matnr = oModel.getProperty("/PerfumeMaterial/Data/Matnr");

                var length = Data.length;

                var ItemNumber;
                if (length > 0) {
                    ItemNumber = Number(Data[length - 1].Lineitm) + 1
                    ItemNumber = ItemNumber.toString();
                } else {
                    ItemNumber = "1";
                }

                Data.push({
                    "Matnr": Matnr,
                    "Versn": "",
                    "Lineitm": ItemNumber
                });

                oModel.setProperty("/PerfumeMaterial/Data/PspecificationItemSet/results", Data);
                oModel.refresh();

            }
        });
    });
