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

        return BaseController.extend("com.emami.spc.controller.PerfumeCreate", {
            formatter: formatter,

            onInit: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("RoutePRMCreate").attachPatternMatched(this._onObjectMatched, this);
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
                this.fnSetAppTitle("Perfume");

                var that = this;
                var oModel = this.getView().getModel();

                var url = "/PerfumeSet(Matnr='" + Matnr + "',Versn='',Action='1',RefMatnr='" + RefMatnr + "',RefVersn='" + RefVersn + "')";

                var expand = "PRMSpecificationItem,PRMApprovedVendor,PRMRevisionLog,PspecificationItemSet";

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

                            if (LocalData.PspecificationItemSet.results) { 
                                LocalData.PspecificationItemSet.results = LocalData.PspecificationItemSet.results.map(fnLogic);
                            }

                            if (LocalData.PRMRevisionLog.results) {
                                LocalData.PRMRevisionLog.results = LocalData.PRMRevisionLog.results.map(fnLogic);
                            }

                            //Adding one extra Log   commented by anjani
                            // LocalData.PRMRevisionLog.results.push({
                            //     "Matnr": Matnr,
                            //     "Versn": "", 
                            //     "Revlg": "",
                            //     "Revdt": null
                            // });

                            var oJsonCentralModel = that.getView().getModel("jsonCentralModel");
                            oJsonCentralModel.setProperty("/PerfumeMaterial/Data", LocalData);
                            oJsonCentralModel.setProperty("/PerfumeMaterial/Data/Matnr", Matnr);
                            oJsonCentralModel.setProperty("/PerfumeMaterial/Data/NextReview", '');
                            oJsonCentralModel.setProperty("/PerfumeMaterial/Data/EffctDate", '');

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

                let Data1 = { ...oJsonCentralModel.oData.PerfumeMaterial.Data };
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
                }

                if (Data.Reviewon) {
                    var aTemp = Data.Reviewon.split("T");
                    Reviewon = new Date(aTemp[0]);
                }

                if (Data.Aproveon) {
                    var aTemp = Data.Aproveon.split("T");
                    Aproveon = new Date(aTemp[0]);
                }

                var payload = Data;
                payload.Action = '1';
                payload.PerpDate = PerpDate;
                payload.EffctDate = EffctDate;
                payload.NextReview = NextReview;

                payload.Createdon = Createdon; 
                payload.Reviewon = Reviewon;
                payload.Aproveon = Aproveon;

                payload.PspecificationItemSet = Data.PspecificationItemSet.results;
                payload.PRMApprovedVendor = Data.PRMApprovedVendor.results;

                let DataRevisonLog = JSON.parse(JSON.stringify(Data1.PRMRevisionLog.results));
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

            fnRefreshModel: function () {
                this.getView().getModel("jsonCentralModel").setProperty("/PerfumeMaterial/Data", {});
                this.getView().getModel("jsonCentralModel").setProperty("/PerfumeMaterial/Editable/All", true);

                let oModel = this.getView().getModel("jsonCentralModel");
                oModel.setProperty("/PerfumeMaterial/PRMDateChange/EffctDate", false);
                oModel.setProperty("/PerfumeMaterial/PRMDateChange/PerpDate", false);
                oModel.setProperty("/PerfumeMaterial/PRMDateChange/NextReview", false);


            }
        });
    });
