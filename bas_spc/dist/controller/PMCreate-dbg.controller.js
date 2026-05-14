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

        return BaseController.extend("com.emami.spc.controller.PMCreate", {
            formatter: formatter,
            onInit: function () {

                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("RoutePMCreate").attachPatternMatched(this._onObjectMatched, this);

            },

            _onObjectMatched: async function (oEvent) {
                const Matnr = oEvent.getParameter("arguments").Matnr;
                let RefMatnr = oEvent.getParameter("arguments").RefMatnr;
                let RefVersn = oEvent.getParameter("arguments").RefVersn;

                if (RefMatnr === undefined) {
                    RefMatnr = "";
                }

                if (RefVersn === undefined) {
                    RefVersn = "";
                }
                // var Maktx = oEvent.getParameter("arguments").Maktx;

                var UserType = 'I';
                this.fnSetPMEditable(UserType);
                this.fnSetAppTitle("PM");
                this.fnLoadPMRefMaterialData();
                this.fnPMSearchHelp();
                this.fnRefreshModel();
                try {
                    const MicDorpDownFlag = await this.fnPMMicDorpDown();
                    let that = this;
                    let oModel = this.getView().getModel();

                    let url = "/SpecificationSet(Matnr='" + Matnr + "',Versn='',Action='1',RefMatnr='" + RefMatnr + "',RefVersn='" + RefVersn + "')";

                    // var expand = "Carton,Material,TopSideColorDetails,BackSideColorDetails,Lamination," +
                    //              "DetailsofWindow,SpecialSurface,InstructionOfVarnish,Purchase," + 
                    //              "RegulatoryIntegrity,PrintingParameters,Appearance,Measurement," +
                    //              "Performance,Developmental,Delivery,SustainabilitySafety"


                    let expand = "RegulatoryIntegrity,PrintingParameters,Appearance,Measurement," +
                        "Performance,Developmental,SustainabilitySafety";

                    BusyIndicator.show();
                    oModel.read(url,
                        {

                            urlParameters: {
                                "$expand": expand
                            },
                            success: function (oSucess) {
                                let LocalData = oSucess;

                                // Carton
                                // LocalData.Carton = {
                                //     "Matnr": Matnr,
                                //     "Versn": "",
                                //     "Typecar": "",
                                //     "Tuflwd": "",
                                //     "Guflwd": ""
                                // };

                                //Material
                                // LocalData.Material = {
                                //     "Matnr": Matnr,
                                //     "Versn": "",
                                //     "Matdet": "",
                                //     "Gsmdet": "",
                                //     "Greybrd": "",
                                //     "Grade": ""
                                // };

                                //Top Side Color Details
                                // LocalData.TopSideColorDetails = {
                                //     "Matnr": Matnr,
                                //     "Versn": "",
                                //     "Cmyk": "",
                                //     "Goldsil": "",
                                //     "Speclcol": ""
                                // };

                                //Back Side Color Details
                                // LocalData.BackSideColorDetails = {
                                //     "Matnr": Matnr,
                                //     "Versn": "",
                                //     "Color": "",
                                //     "Polye": "",
                                //     "Grade": ""
                                // };

                                //Lamination
                                // LocalData.Lamination = {
                                //     "Matnr": Matnr,
                                //     "Versn": "",
                                //     "Lamin": "",
                                //     "Gsm": "",
                                //     "Mtlsd": "",
                                //     "Petpvc": ""
                                // };

                                //Details Of Window
                                // LocalData.DetailsofWindow = {
                                //     "Matnr": Matnr,
                                //     "Versn": "",
                                //     "Detwn": "",
                                //     "Gsm": "",
                                //     "Petpvc": ""
                                // };

                                //Special Surface Finish/Varnish/Decoration
                                // LocalData.SpecialSurface = {
                                //     "Matnr": Matnr,
                                //     "Versn": "",
                                //     "Noprmr": "",
                                //     "Topverns": "",
                                //     "Grdven": "",
                                //     "Noembos": "",
                                //     "Foilstam": "",
                                //     "Foilgrade": "",
                                //     "Nosrcpn": "",
                                //     "Lensefoil": "",
                                //     "Printon": ""
                                // };

                                //Instruction Of Varnish At Batch Coding Area
                                // LocalData.InstructionOfVarnish = {
                                //     "Matnr": Matnr,
                                //     "Versn": "",
                                //     "Vernish": ""
                                // };


                                //Purchase
                                // LocalData.Purchase = {
                                //     "Matnr": Matnr,
                                //     "Versn": "",
                                //     "Meins": "",
                                //     "Printproc": "",
                                //     "Recostr": "",
                                //     "Shelflife": ""
                                // };

                                var fnLogic = (item) => {
                                    item.Matnr = Matnr;
                                    item.Versn = "";
                                    return item;
                                };

                                if (LocalData.RegulatoryIntegrity.results) {
                                    LocalData.RegulatoryIntegrity.results = LocalData.RegulatoryIntegrity.results.map(fnLogic);
                                }

                                if (LocalData.PrintingParameters.results) {
                                    LocalData.PrintingParameters.results = LocalData.PrintingParameters.results.map(fnLogic);
                                }

                                if (LocalData.Appearance.results) {
                                    LocalData.Appearance.results = LocalData.Appearance.results.map(fnLogic);
                                }

                                if (LocalData.Measurement.results) {
                                    LocalData.Measurement.results = LocalData.Measurement.results.map(fnLogic);
                                }

                                if (LocalData.Performance.results) {
                                    LocalData.Performance.results = LocalData.Performance.results.map(fnLogic);
                                }

                                if (LocalData.Developmental.results) {
                                    LocalData.Developmental.results = LocalData.Developmental.results.map(fnLogic);
                                }

                                // if (LocalData.Delivery.results) {
                                //     LocalData.Delivery.results = LocalData.Delivery.results.map(fnLogic);
                                // }

                                if (LocalData.SustainabilitySafety.results) {
                                    LocalData.SustainabilitySafety.results = LocalData.SustainabilitySafety.results.map(fnLogic);
                                }

                                if (!LocalData.SpecialInstr) {
                                    LocalData.SpecialInstr = "1. Refer approved KLD/drawing and artwork along with Component specification for commerical production.\n2. Any change in process/specification should be informed to Emami by supplier before production and MUST take written approval from Emami.\n3. Each supply lot should accompany COA with actual data of the lot.\n4. Shade Card-  For shade card availability at Plant before comercial supply & shade revision, refer existing SOP.\n5. Packing Guidelines: SPCs are to be collated flat & bundled with paper band. Such bundles are to be placed in suitable corrugated box with inner poly wrap to ensure it received in un damaged condition at our end. Box to be closed properly to avoid dust. Each box to be marked with Name of Manufacturer, Lot No., Mfg date,  Material description & quantity."
                                }

                                var oJsonCentralModel = that.getView().getModel("jsonCentralModel");
                                oJsonCentralModel.setProperty("/PackagingMaterial/Data", LocalData);
                                oJsonCentralModel.setProperty("/PackagingMaterial/Data/Matnr", Matnr);
                                // oJsonCentralModel.setProperty("/PackagingMaterial/Data/Maktx", Maktx);
                                BusyIndicator.hide();
                            },
                            error: function (oError) {
                                BusyIndicator.hide();
                            }
                        });

                } catch (error) {

                }

            },
            fnRefreshModel: function () {
                let oModel = this.getView().getModel("jsonCentralModel");
                oModel.setProperty("/PackagingMaterial/PMDateChange/IssueDate", false);
                oModel.setProperty("/PackagingMaterial/PMDateChange/EffctDate", false);
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
                payload.Action = '1';
                payload.IssueDate = IssueDate;
                payload.EffctDate = EffctDate;

                payload.Createdon = Createdon;
                payload.Reviewon = Reviewon;
                payload.Aproveon = Aproveon;

                // payload.RegulatoryIntegrity = Data.RegulatoryIntegrity.results;
                // payload.PrintingParameters = Data.PrintingParameters.results;
                // payload.Appearance = Data.Appearance.results;
                // payload.Measurement = Data.Measurement.results;
                // payload.Performance = Data.Performance.results;
                // payload.Developmental = Data.Developmental.results;
                // payload.SustainabilitySafety = Data.SustainabilitySafety.results;


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
