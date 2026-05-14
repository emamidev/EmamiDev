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

        return BaseController.extend("com.emami.spc.controller.RMCreate", {
            formatter: formatter,

            onInit: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("RouteRMCreate").attachPatternMatched(this._onObjectMatched, this);
            },

            _onObjectMatched: function (oEvent) {
                var Matnr = oEvent.getParameter("arguments").Matnr;
                let RefMatnr = oEvent.getParameter("arguments").RefMatnr;
                let RefVersn = oEvent.getParameter("arguments").RefVersn;

                if (RefMatnr === undefined) {
                    RefMatnr = "";
                }

                if (RefVersn === undefined) {
                    RefVersn = "";
                }

                // var Maktx = oEvent.getParameter("arguments").Maktx;

                this.fnRefreshModel();
                this.fnSetAppTitle("RM");

                var that = this;
                var oModel = this.getView().getModel();

                var url = "/RawMaterialSet(Matnr='" + Matnr + "',Versn='',Action='1',RefMatnr='" + RefMatnr + "',RefVersn='" + RefVersn + "')";

                var expand = "SpecificationItem,ApprovedVendors,RevisionLog";

                BusyIndicator.show();

                oModel.read(url,
                    {
                        urlParameters: {
                            "$expand": expand
                        },
                        success: function (oSucess) {

                            var LocalData = oSucess;

                            var fnLogic = (item) => {
                                item.Matnr = Matnr;
                                item.Versn = "";
                                return item;
                            };

                            if (LocalData.SpecificationItem.results) {
                                LocalData.SpecificationItem.results = LocalData.SpecificationItem.results.map(fnLogic);
                            }

                            if (LocalData.RevisionLog.results) {
                                LocalData.RevisionLog.results = LocalData.RevisionLog.results.map(fnLogic);
                            }

                            //Adding one extra Log
                            LocalData.RevisionLog.results.push({
                                "Matnr": Matnr,
                                "Versn": "",
                                "Revlg": "",
                                "Revdt": null
                            });

                            var oJsonCentralModel = that.getView().getModel("jsonCentralModel");
                            oJsonCentralModel.setProperty("/RawMaterial/Data", LocalData);
                            oJsonCentralModel.setProperty("/RawMaterial/Data/Matnr", Matnr);

                            BusyIndicator.hide();
                        },
                        error: function (oError) {
                            BusyIndicator.hide();
                        }
                    });

                this.fnRMSearchHelp();
            },

            onPressCreateBtn: function () {
                var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
                var oJsonCentralModel = this.getView().getModel("jsonCentralModel");

                let Data1 = { ...oJsonCentralModel.oData.RawMaterial.Data };
                // let aRevisonLog = [...Data1.RevisionLog.results];
                // let check = false;
                // if (aRevisonLog) {
                //     aRevisonLog.forEach(item => {
                //         if (!item['Versn'] || !item['Revlg'] || !item['Revdt']) {
                //             check = true;
                //         }
                //     });
                // }

                // if (check) {
                //     MessageBox.error(
                //         "Revison log required field missing.", {
                //         styleClass: bCompact ? "sapUiSizeCompact" : ""
                //     }
                //     );
                //     return;
                // }

                var TempData = JSON.parse(oJsonCentralModel.getJSON());
                var Data = TempData.RawMaterial.Data;

                var PerpDate = null;
                var EffctDate = null;
                var NextReview = null;

                var Createdon = null;
                var Reviewon = null;
                var Aproveon = null;

                if (Data.PerpDate) {
                    var aTemp = Data.PerpDate.split("T");
                    PerpDate = new Date(aTemp[0]);
                    if (oJsonCentralModel.getProperty("/RawMaterial/RMDateChange/PerpDate")) {
                        PerpDate.setDate(PerpDate.getDate() + 1);
                    }
                }
                if (Data.EffctDate) {
                    var aTemp = Data.EffctDate.split("T");
                    EffctDate = new Date(aTemp[0]);
                    if (oJsonCentralModel.getProperty("/RawMaterial/RMDateChange/EffctDate")) {
                        EffctDate.setDate(EffctDate.getDate() + 1);
                    }
                }
                if (Data.NextReview) {
                    var aTemp = Data.NextReview.split("T");
                    NextReview = new Date(aTemp[0]);
                    if (oJsonCentralModel.getProperty("/RawMaterial/RMDateChange/NextReview")) {
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
                payload.Action = '1';
                payload.PerpDate = PerpDate;
                payload.EffctDate = EffctDate;
                payload.NextReview = NextReview;

                payload.Createdon = Createdon;
                payload.Reviewon = Reviewon;
                payload.Aproveon = Aproveon;

                payload.SpecificationItem = Data.SpecificationItem.results;
                payload.ApprovedVendors = Data.ApprovedVendors.results;

                let DataRevisonLog = JSON.parse(JSON.stringify(Data1.RevisionLog.results));
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

                payload.RevisionLog = DataRevisonLog;

                let fnRemoveLogic = (item) => {
                    if (item?.CheckChangeRevisionDate) {
                        delete item.CheckChangeRevisionDate;
                    }
                    return item;
                };
                payload.RevisionLog = payload.RevisionLog.map(fnRemoveLogic);

                var that = this;
                var oModel = this.getView().getModel();
                BusyIndicator.show();

                oModel.create("/RawMaterialSet", payload,
                    {
                        success: function (oSucess) {
                            BusyIndicator.hide();
                            MessageBox.success(
                                "Raw Material Specification Created Successfully", {
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

            fnRefreshModel: function () {
                this.getView().getModel("jsonCentralModel").setProperty("/RawMaterial/Data", {});
                this.getView().getModel("jsonCentralModel").setProperty("/RawMaterial/Editable/All", true);

                let oModel = this.getView().getModel("jsonCentralModel");
                oModel.setProperty("/RawMaterial/RMDateChange/EffctDate", false);
                oModel.setProperty("/RawMaterial/RMDateChange/PerpDate", false);
                oModel.setProperty("/RawMaterial/RMDateChange/NextReview", false);


            }
        });
    });
