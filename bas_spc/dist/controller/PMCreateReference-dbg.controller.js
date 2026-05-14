sap.ui.define([
    "com/emami/spc/controller/BaseController",
    "sap/ui/core/BusyIndicator",
    "sap/m/MessageBox",
    "../utility/formatter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, BusyIndicator, MessageBox, formatter) {
        "use strict";

        return BaseController.extend("com.emami.spc.controller.PMCreateReference", {
            formatter: formatter,

            onInit: function () {

                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("RoutePMCreateReference").attachPatternMatched(this._onObjectMatched, this);

            },

            _onObjectMatched: function (oEvent) {

                var Matnr = oEvent.getParameter("arguments").Matnr;
                var Versn = oEvent.getParameter("arguments").Versn;
                var UserType = oEvent.getParameter("arguments").User;

                this.fnSetUserType(UserType);
                this.fnSetPMEditable(UserType);
                this.fnSetAppTitle("PM");
                this.fnLoadPMRefMaterialData();
                this.fnPMSearchHelp();

                var oJsonCentralModel = this.getView().getModel("jsonCentralModel");
                oJsonCentralModel.setProperty("/PackagingMaterial/Data/Versn", Versn);

            },
            onPressCreateBtn: function () {
                var oJsonCentralModel = this.getView().getModel("jsonCentralModel");

                var TempData = JSON.parse(oJsonCentralModel.getJSON());
                var Data = TempData.PackagingMaterial.Data;

                var IssueDate = null;
                var EffctDate = null;

                var Createdon = null;
                var Reviewon = null;
                var Aproveon = null;

                if (Data.IssueDate) {
                    var aTemp = Data.IssueDate.split("T");
                    IssueDate = new Date(aTemp[0]);
                    if (oJsonCentralModel.getProperty("/PackagingMaterial/PMDateChange/IssueDate")) {
                        IssueDate.setDate(IssueDate.getDate() + 1);
                    }
                }
                if (Data.EffctDate) {
                    var aTemp = Data.EffctDate.split("T");
                    EffctDate = new Date(aTemp[0]);
                    if (oJsonCentralModel.getProperty("/PackagingMaterial/PMDateChange/EffctDate")) {
                        EffctDate.setDate(EffctDate.getDate() + 1);
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
                payload.IssueDate = IssueDate;
                payload.EffctDate = EffctDate;

                payload.Createdon = Createdon;
                payload.Reviewon = Reviewon;
                payload.Aproveon = Aproveon;


                // Validation

                let Error = false;

                const logic1 = (item) => {
                    // if (item.Tstmth == "" || item.Meins == "" || item.Lsl == "" || item.Target == "" || item.Usl == "" || item.Relcri == "" || item.Accdef == "0.00" || item.Partcoa == "" || item.Planttst == "" || item.Remarks == "") {
                    //     item.Flag = "Error"
                    //     Error = true;
                    // } else {
                    //     delete item.Flag;
                    // }
                    delete item.Flag;
                    return item;
                };

                if (Data.RegulatoryIntegrity.results) {
                    Data.RegulatoryIntegrity.results = Data.RegulatoryIntegrity.results.map(logic1);
                    if (Error) {
                        oJsonCentralModel.setProperty("/PackagingMaterial/Data/RegulatoryIntegrity/results", Data.RegulatoryIntegrity.results);
                        oJsonCentralModel.refresh();
                    } else {
                        payload.RegulatoryIntegrity = Data.RegulatoryIntegrity.results;
                    }
                }


                if (Data.PrintingParameters.results) {
                    Data.PrintingParameters.results = Data.PrintingParameters.results.map(logic1);
                    if (Error) {
                        oJsonCentralModel.setProperty("/PackagingMaterial/Data/PrintingParameters/results", Data.PrintingParameters.results);
                        oJsonCentralModel.refresh();
                    } else {
                        payload.PrintingParameters = Data.PrintingParameters.results;
                    }
                }

                if (Data.Appearance.results) {
                    Data.Appearance.results = Data.Appearance.results.map(logic1);
                    if (Error) {
                        oJsonCentralModel.setProperty("/PackagingMaterial/Data/Appearance/results", Data.Appearance.results);
                        oJsonCentralModel.refresh();
                    } else {
                        payload.Appearance = Data.Appearance.results;
                    }
                }

                if (Data.Measurement.results) {
                    Data.Measurement.results = Data.Measurement.results.map(logic1);
                    if (Error) {
                        oJsonCentralModel.setProperty("/PackagingMaterial/Data/Measurement/results", Data.Measurement.results);
                        oJsonCentralModel.refresh();
                    } else {
                        payload.Measurement = Data.Measurement.results;
                    }
                }

                if (Data.Performance.results) {
                    Data.Performance.results = Data.Performance.results.map(logic1);
                    if (Error) {
                        oJsonCentralModel.setProperty("/PackagingMaterial/Data/Performance/results", Data.Performance.results);
                        oJsonCentralModel.refresh();
                    } else {
                        payload.Performance = Data.Performance.results;
                    }
                }

                if (Data.Developmental.results) {
                    Data.Developmental.results = Data.Developmental.results.map(logic1);
                    if (Error) {
                        oJsonCentralModel.setProperty("/PackagingMaterial/Data/Developmental/results", Data.Developmental.results);
                        oJsonCentralModel.refresh();
                    } else {
                        payload.Developmental = Data.Developmental.results;
                    }
                }

                if (Data.SustainabilitySafety.results) {
                    Data.SustainabilitySafety.results = Data.SustainabilitySafety.results.map(logic1);
                    if (Error) {
                        oJsonCentralModel.setProperty("/PackagingMaterial/Data/SustainabilitySafety/results", Data.SustainabilitySafety.results);
                        oJsonCentralModel.refresh();
                    } else {
                        payload.SustainabilitySafety = Data.SustainabilitySafety.results;
                    }
                }

                var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
                // if (Error) {
                //     MessageBox.error(
                //         "Please fill mandatory fields", {
                //         styleClass: bCompact ? "sapUiSizeCompact" : ""
                //     }
                //     );
                //     return;
                // }

                // Version Logic 
                var versionLogic = (item) => {
                    item.Versn = payload.Versn;
                    return item;
                };

                // payload.RegulatoryIntegrity = Data.RegulatoryIntegrity.results;

                if (payload.RegulatoryIntegrity.length > 0) {
                    var aTempVersion = payload.RegulatoryIntegrity.map(versionLogic);
                    payload.RegulatoryIntegrity = aTempVersion;
                }

                // payload.PrintingParameters = Data.PrintingParameters.results;

                if (payload.PrintingParameters.length > 0) {
                    var aTempVersion = payload.PrintingParameters.map(versionLogic);
                    payload.PrintingParameters = aTempVersion;
                }

                // payload.Appearance = Data.Appearance.results;

                if (payload.Appearance.length > 0) {
                    var aTempVersion = payload.Appearance.map(versionLogic);
                    payload.Appearance = aTempVersion;
                }

                // payload.Measurement = Data.Measurement.results;

                if (payload.Measurement.length > 0) {
                    var aTempVersion = payload.Measurement.map(versionLogic);
                    payload.Measurement = aTempVersion;
                }

                // payload.Performance = Data.Performance.results;

                if (payload.Performance.length > 0) {
                    var aTempVersion = payload.Performance.map(versionLogic);
                    payload.Performance = aTempVersion;
                }

                // payload.Developmental = Data.Developmental.results;

                if (payload.Developmental.length > 0) {
                    var aTempVersion = payload.Developmental.map(versionLogic);
                    payload.Developmental = aTempVersion;
                }

                // payload.Delivery = Data.Delivery.results;

                // if(payload.Delivery.length > 0){
                //     var aTemp = payload.Delivery.map(versionLogic);
                //     payload.Delivery = aTemp;
                // }

                // payload.SustainabilitySafety = Data.SustainabilitySafety.results;

                if (payload.SustainabilitySafety.length > 0) {
                    var aTempVersion = payload.SustainabilitySafety.map(versionLogic);
                    payload.SustainabilitySafety = aTempVersion;
                }

                var that = this;
                var oModel = this.getView().getModel();
                BusyIndicator.show();
                oModel.create("/SpecificationSet", payload,
                    {
                        success: function (oSucess) {
                            BusyIndicator.hide();
                            MessageBox.success(
                                "Specification Created Successfully", {
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

            }


        });
    });
