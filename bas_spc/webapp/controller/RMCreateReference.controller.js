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

        return BaseController.extend("com.emami.spc.controller.RMCreateReference", {
            formatter: formatter,

            onInit: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("RouteRMCreateReference").attachPatternMatched(this._onObjectMatched, this);
            },

            _onObjectMatched: function (oEvent) {

                var Matnr = oEvent.getParameter("arguments").Matnr;
                var Versn = oEvent.getParameter("arguments").Versn;
                var UserType = oEvent.getParameter("arguments").User;

                this.fnSetUserType(UserType);
                this.fnSetRMEditable(UserType);

                var oJsonCentralModel = this.getView().getModel("jsonCentralModel");
                oJsonCentralModel.setProperty("/RawMaterial/Data/Versn", Versn);

                let aRevisonLog = oJsonCentralModel.getProperty("/RawMaterial/Data/RevisionLog/results");
                aRevisonLog.push({
                    "Matnr": Matnr,
                    "Versn": "",
                    "Revlg": "",
                    "Revdt": null
                });

                oJsonCentralModel.setProperty("/RawMaterial/Data/RevisionLog/results", aRevisonLog);

                this.fnRMSearchHelp();

            },
            onPressCreateBtn: function () {
                var oJsonCentralModel = this.getView().getModel("jsonCentralModel");
                var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;

                let Data1 = { ...oJsonCentralModel.oData.RawMaterial.Data };
                let aRevisonLog = [...Data1.RevisionLog.results];
                // let check = false;
                if (aRevisonLog) {
                    aRevisonLog.forEach(item => {
                        delete item.Editable;
                        // if (!item['Versn'] || !item['Revlg'] || !item['Revdt']) {
                        //     check = true;
                        // }
                    });
                }
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

                payload.SpecificationItem = Data.SpecificationItem.results;
                payload.ApprovedVendors = Data.ApprovedVendors.results;

                if (payload.SpecificationItem.length > 0) {
                    var aTemp = payload.SpecificationItem.map(versionLogic);
                    payload.SpecificationItem = aTemp;
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

                payload.RevisionLog = DataRevisonLog;

                let fnRemoveLogic = (item) => {
                    if (item?.CheckChangeRevisionDate) {
                        delete item.CheckChangeRevisionDate;
                    }
                    return item;
                };
                payload.RevisionLog = payload.RevisionLog.map(fnRemoveLogic);

                // payload.RevisionLog = aRevisonLog;

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
            onDeleteSpecification: function (oEvent) {


                var sPath = oEvent.getSource().getParent().oBindingContexts.jsonCentralModel.sPath;
                var Clicked = this.getView().getModel("jsonCentralModel").getProperty(sPath);
                var oModel = this.getView().getModel("jsonCentralModel");
                var Data = oModel.getProperty("/RawMaterial/Data/SpecificationItem/results");

                var NewData = Data.filter(item => item.Lineitm != Clicked.Lineitm);
                oModel.setProperty("/RawMaterial/Data/SpecificationItem/results", NewData);
                oModel.refresh();
            },

            onAddSpecificationItem: function () {
                var oModel = this.getView().getModel("jsonCentralModel");
                var Data = oModel.getProperty("/RawMaterial/Data/SpecificationItem/results");

                var Matnr = oModel.getProperty("/RawMaterial/Data/Matnr");

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

                oModel.setProperty("/RawMaterial/Data/SpecificationItem/results", Data);
                oModel.refresh();

            }
        });
    });
