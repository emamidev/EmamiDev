sap.ui.define([
    "com/emami/spc/controller/BaseController",
    "sap/ui/core/BusyIndicator",
    "sap/m/MessageBox",
    "../utility/formatter",
    'sap/m/Dialog',
    'sap/m/TextArea',
    'sap/m/ButtonType',
    'sap/m/Label',
    'sap/m/MessageToast',
    'sap/m/Button'

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, BusyIndicator, MessageBox, formatter, Dialog, TextArea, ButtonType, Label, MessageToast, Button) {
        "use strict";

        return BaseController.extend("com.emami.spc.controller.PMEditDisplay", {
            formatter: formatter,
            onInit: function () {

                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("RoutePMEditDisplay").attachPatternMatched(this._onObjectMatched, this);

            },

            _onObjectMatched: async function (oEvent) {

                var Matnr = oEvent.getParameter("arguments").Matnr;
                var Versn = oEvent.getParameter("arguments").Versn;
                var UserType = oEvent.getParameter("arguments").User;
                var Mode = oEvent.getParameter("arguments").Mode;

                this.fnRefreshModel();

                this.fnSetUserType(UserType);
                this.fnSetAppTitle("PM");
                this.fnSetPMEditable(UserType);
                this.fnSetPMBtnVisibility(UserType);
                this.fnLoadPMRefMaterialData();
                this.fnPMSearchHelp();

                try {
                    const MicDorpDownFlag = await this.fnPMMicDorpDown();
                    let that = this;
                    let oModel = this.getView().getModel();

                    let url = "/SpecificationSet(Matnr='"
                        + Matnr + "',Versn='" + Versn + "',Action='3',RefMatnr='',RefVersn='')";

                    // var expand = "Carton,Material,TopSideColorDetails,BackSideColorDetails,Lamination," +
                    //     "DetailsofWindow,SpecialSurface,InstructionOfVarnish,Purchase," +
                    //     "RegulatoryIntegrity,PrintingParameters,Appearance,Measurement," +
                    //     "Performance,Developmental,Delivery,SustainabilitySafety";

                    let expand = "RegulatoryIntegrity,PrintingParameters,Appearance,Measurement," +
                        "Performance,Developmental,SustainabilitySafety";

                    BusyIndicator.show();
                    oModel.read(url,
                        {

                            urlParameters: {
                                "$expand": expand
                            },
                            success: function (oSucess) {
                                let oJsonCentralModel = that.getView().getModel("jsonCentralModel");

                                let LocalData = oSucess;

                                if (!LocalData.SpecialInstr) {
                                    LocalData.SpecialInstr = "1. Refer approved KLD/drawing and artwork along with Component specification for commerical production.\n2. Any change in process/specification should be informed to Emami by supplier before production and MUST take written approval from Emami.\n3. Each supply lot should accompany COA with actual data of the lot.\n4. Shade Card-  For shade card availability at Plant before comercial supply & shade revision, refer existing SOP.\n5. Packing Guidelines: SPCs are to be collated flat & bundled with paper band. Such bundles are to be placed in suitable corrugated box with inner poly wrap to ensure it received in un damaged condition at our end. Box to be closed properly to avoid dust. Each box to be marked with Name of Manufacturer, Lot No., Mfg date,  Material description & quantity."
                                }


                                oJsonCentralModel.setProperty("/PackagingMaterial/Data", LocalData);

                                oJsonCentralModel.setProperty("/PackagingMaterial/Visible/CreateReferenceBtn", false);
                                oJsonCentralModel.setProperty("/PackagingMaterial/Visible/PrintBtn", false);
                                oJsonCentralModel.setProperty("/PackagingMaterial/Visible/CreateTaskListBtn", false);

                                if (LocalData.WfInit == 'I') {
                                    oJsonCentralModel.setProperty("/PackagingMaterial/Visible/InitiateBtn", false);
                                    oJsonCentralModel.setProperty("/PackagingMaterial/Visible/DeleteBtn", false);
                                    oJsonCentralModel.setProperty("/PackagingMaterial/Visible/SaveBtn", false);
                                    oJsonCentralModel.setProperty("/PackagingMaterial/Editable/All", false);

                                } else {
                                    oJsonCentralModel.setProperty("/PackagingMaterial/Visible/InitiateBtn", true);
                                    oJsonCentralModel.setProperty("/PackagingMaterial/Visible/DeleteBtn", true);
                                    oJsonCentralModel.setProperty("/PackagingMaterial/Visible/SaveBtn", true);
                                    oJsonCentralModel.setProperty("/PackagingMaterial/Editable/All", true);
                                }
 
                                if (UserType == 'A' || UserType == 'R') {
                                    oJsonCentralModel.setProperty("/PackagingMaterial/Visible/InitiateBtn", false);
                                    oJsonCentralModel.setProperty("/PackagingMaterial/Visible/DeleteBtn", false);
                                    oJsonCentralModel.setProperty("/PackagingMaterial/Visible/SaveBtn", false);
                                    oJsonCentralModel.setProperty("/PackagingMaterial/Editable/All", false);
                                }

                                oJsonCentralModel.setProperty("/PackagingMaterial/Visible/BarVisible", true);

                                if (Mode) {
                                    oJsonCentralModel.setProperty("/PackagingMaterial/Visible/InitiateBtn", false);
                                    oJsonCentralModel.setProperty("/PackagingMaterial/Visible/DeleteBtn", false);
                                    oJsonCentralModel.setProperty("/PackagingMaterial/Visible/SaveBtn", false);
                                    oJsonCentralModel.setProperty("/PackagingMaterial/Editable/All", false);
                                    // oJsonCentralModel.setProperty("/PackagingMaterial/Editable/Versn", false);
                                    oJsonCentralModel.setProperty("/PackagingMaterial/Visible/AcceptBtn", false);
                                    oJsonCentralModel.setProperty("/PackagingMaterial/Visible/RejectBtn", false);
                                    oJsonCentralModel.setProperty("/PackagingMaterial/Visible/PrintBtn", false);
                                    oJsonCentralModel.setProperty("/PackagingMaterial/Visible/CreateTaskListBtn", false);
                                    oJsonCentralModel.setProperty("/PackagingMaterial/Visible/CreateReferenceBtn", false);
                                    oJsonCentralModel.setProperty("/PackagingMaterial/Visible/BarVisible", false);
                                }


                                //On full approved case - Show only Print Btn in Specific List Screen
                                if (LocalData.WfInit == 'A') {
                                    oJsonCentralModel.setProperty("/PackagingMaterial/Visible/PrintBtn", true);
                                    oJsonCentralModel.setProperty("/PackagingMaterial/Visible/BarVisible", true);
                                    oJsonCentralModel.setProperty("/PackagingMaterial/Visible/CreateTaskListBtn", true);
                                }

                                // Initator & Fully Approved Case - Show Create Reference Btn to Initator
                                if (UserType == 'I' && LocalData.WfInit == 'A') {
                                    oJsonCentralModel.setProperty("/PackagingMaterial/Visible/CreateReferenceBtn", true);
                                }

                                if (LocalData.Completed == 'X') {
                                    oJsonCentralModel.setProperty("/PackagingMaterial/Visible/CreateTaskListBtn", false);
                                }

                                BusyIndicator.hide();
                            },
                            error: function (oError) {
                                BusyIndicator.hide();
                            }
                        });

                } catch (error) {

                }
                this.fnGetReviewerApproverList("PM", Matnr);

            },
            fnRefreshModel: function () {
                this.getView().getModel("jsonCentralModel").setProperty("/PackagingMaterial/Data", {});

                let oModel = this.getView().getModel("jsonCentralModel");
                oModel.setProperty("/PackagingMaterial/PMDateChange/IssueDate", false);
                oModel.setProperty("/PackagingMaterial/PMDateChange/EffctDate", false);
            },
            onPressCreateReference: function () {

                var oJsonCentralModel = this.getView().getModel("jsonCentralModel");
                var Matnr = oJsonCentralModel.getProperty("/PackagingMaterial/Data/Matnr");
                var Versn = oJsonCentralModel.getProperty("/PackagingMaterial/Data/Versn");
                var IncreaesedVersion = Number(Versn) + 1;
                IncreaesedVersion = IncreaesedVersion + "";

                var UserType = oJsonCentralModel.getProperty("/UserType");

                if (UserType) {

                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("RoutePMCreateReference", {
                        Matnr: Matnr,
                        Versn: IncreaesedVersion,
                        User: UserType
                    });
                }
            }, 
            onPressSave: function () {

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
                payload.Action = '3';
                payload.IssueDate = IssueDate;
                payload.EffctDate = EffctDate;

                payload.Createdon = Createdon;
                payload.Reviewon = Reviewon;
                payload.Aproveon = Aproveon;

                const fnDeleteFlag = (item) => {
                    delete item.Flag;
                    return item;
                };


                payload.RegulatoryIntegrity = Data.RegulatoryIntegrity.results;
                if (payload.RegulatoryIntegrity) {
                    payload.RegulatoryIntegrity = payload.RegulatoryIntegrity.map(fnDeleteFlag);
                }

                payload.PrintingParameters = Data.PrintingParameters.results;
                if (payload.PrintingParameters) {
                    payload.PrintingParameters = payload.PrintingParameters.map(fnDeleteFlag);
                }

                payload.Appearance = Data.Appearance.results;
                if (payload.Appearance) {
                    payload.Appearance = payload.Appearance.map(fnDeleteFlag);
                }

                payload.Measurement = Data.Measurement.results;
                if (payload.Measurement) {
                    payload.Measurement = payload.Measurement.map(fnDeleteFlag);
                }

                payload.Performance = Data.Performance.results;
                if (payload.Performance) {
                    payload.Performance = payload.Performance.map(fnDeleteFlag);
                }

                payload.Developmental = Data.Developmental.results;
                if (payload.Developmental) {
                    payload.Developmental = payload.Developmental.map(fnDeleteFlag);
                }

                payload.SustainabilitySafety = Data.SustainabilitySafety.results;
                if (payload.SustainabilitySafety) {
                    payload.SustainabilitySafety = payload.SustainabilitySafety.map(fnDeleteFlag);
                }


                var that = this;
                var oModel = this.getView().getModel();
                var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
                BusyIndicator.show();
                oModel.create("/SpecificationSet", payload,
                    {
                        success: function (oSucess) {
                            BusyIndicator.hide();
                            MessageBox.success(
                                "Specification Saved Successfully", {
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

            onPressInitiateApproval: function () {

                let Error = false;

                const logic1 = (item) => {
                    // || item.Accdef == "0.00" || item.Partcoa == "" || item.Planttst == "" || item.Remarks == ""
                    if (item.Tstmth == "" || item.Meins == "" || item.Lsl == "" || item.Target == "" || item.Usl == "" || item.Relcri == "") {
                        item.Flag = "Error"
                        Error = true;
                    } else {
                        delete item.Flag;
                    }
                    return item;
                };

                var oJsonCentralModel = this.getView().getModel("jsonCentralModel");

                var TempData = JSON.parse(oJsonCentralModel.getJSON());
                var Data = TempData.PackagingMaterial.Data;

                if (Data.RegulatoryIntegrity.results) {
                    Data.RegulatoryIntegrity.results = Data.RegulatoryIntegrity.results.map(logic1);
                    // if (Error) {
                    oJsonCentralModel.setProperty("/PackagingMaterial/Data/RegulatoryIntegrity/results", Data.RegulatoryIntegrity.results);
                    oJsonCentralModel.refresh();
                    // }
                }


                if (Data.PrintingParameters.results) {
                    Data.PrintingParameters.results = Data.PrintingParameters.results.map(logic1);
                    // if (Error) {
                    oJsonCentralModel.setProperty("/PackagingMaterial/Data/PrintingParameters/results", Data.PrintingParameters.results);
                    oJsonCentralModel.refresh();
                    // }
                }

                if (Data.Appearance.results) {
                    Data.Appearance.results = Data.Appearance.results.map(logic1);
                    // if (Error) {
                    oJsonCentralModel.setProperty("/PackagingMaterial/Data/Appearance/results", Data.Appearance.results);
                    oJsonCentralModel.refresh();
                    // }
                }

                if (Data.Measurement.results) {
                    Data.Measurement.results = Data.Measurement.results.map(logic1);
                    // if (Error) {
                    oJsonCentralModel.setProperty("/PackagingMaterial/Data/Measurement/results", Data.Measurement.results);
                    oJsonCentralModel.refresh();
                    // }
                }

                if (Data.Performance.results) {
                    Data.Performance.results = Data.Performance.results.map(logic1);
                    // if (Error) {
                    oJsonCentralModel.setProperty("/PackagingMaterial/Data/Performance/results", Data.Performance.results);
                    oJsonCentralModel.refresh();
                    // }
                }

                if (Data.Developmental.results) {
                    Data.Developmental.results = Data.Developmental.results.map(logic1);
                    // if (Error) {
                    oJsonCentralModel.setProperty("/PackagingMaterial/Data/Developmental/results", Data.Developmental.results);
                    oJsonCentralModel.refresh();
                    // }
                }

                if (Data.SustainabilitySafety.results) {
                    Data.SustainabilitySafety.results = Data.SustainabilitySafety.results.map(logic1);
                    // if (Error) {
                    oJsonCentralModel.setProperty("/PackagingMaterial/Data/SustainabilitySafety/results", Data.SustainabilitySafety.results);
                    oJsonCentralModel.refresh();
                    // }
                }

                oJsonCentralModel.refresh();

                var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
                if (Error) {
                    MessageBox.error(
                        "Please fill mandatory fields", {
                        styleClass: bCompact ? "sapUiSizeCompact" : ""
                    }
                    );
                    return;
                }

                var that = this;
                if (!that.InitApprovalRemarksDialog) {
                    that.InitApprovalRemarksDialog = sap.ui.xmlfragment("com.emami.spc.view.fragments.InitApprovalRemarksDialog", that);
                    that.getView().addDependent(that.InitApprovalRemarksDialog);
                }

                that.InitApprovalRemarksDialog.open();
            },

            onCancelInitApprovalRemarksDialog: function () {
                var that = this;
                that.InitApprovalRemarksDialog.close();
                that.InitApprovalRemarksDialog.destroy();
                that.InitApprovalRemarksDialog = null;
            },

            onConfirmInitApprovalRemarksDialog: function () {

                let ReviewerKey = sap.ui.getCore().byId("idReviewerDialog").getSelectedKey();
                if (!ReviewerKey) {
                    sap.m.MessageBox.error("Reviewer should not be blank.");
                    return;
                }
                let ApproverKey = sap.ui.getCore().byId("idApproverDialog").getSelectedKey();
                if (!ApproverKey) {
                    sap.m.MessageBox.error("Approver should not be blank.");
                    return;
                }
                let Remarks = sap.ui.getCore().byId("idInitRemarks").getValue();
                if (!Remarks) {
                    sap.m.MessageBox.error("Remarks should not be blank.");
                    return;
                }

                let ApproverJsonModel = this.getView().getModel("ApproverJsonModel");
                let ApproverJsonModelData = ApproverJsonModel.oData
                const ApproverUser = ApproverJsonModelData.find(item => item.Uname === ApproverKey);

                let ReviewerJsonModel = this.getView().getModel("ReviewerJsonModel");
                let ReviewerJsonModelData = ReviewerJsonModel.oData
                const ReviewerUser = ReviewerJsonModelData.find(item => item.Uname === ReviewerKey);

                let payload = {
                    Approver: ApproverUser.Name,
                    ApproverU: ApproverKey,
                    Reviewer: ReviewerUser.Name,
                    ReviewerU: ReviewerKey,
                    Remarks
                }

                this.fnInitiateApproval(payload)

                let that = this;
                that.InitApprovalRemarksDialog.close();
                that.InitApprovalRemarksDialog.destroy();
                that.InitApprovalRemarksDialog = null;

            },

            fnInitiateApproval: function ({ Approver, ApproverU, Reviewer, ReviewerU, Remarks }) {

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
                payload.Action = '4';
                payload.IssueDate = IssueDate;
                payload.EffctDate = EffctDate;

                payload.Createdon = Createdon;
                payload.Reviewon = Reviewon;
                payload.Aproveon = Aproveon;

                // let Error = false;

                // const logic1 = (item) => {
                //     if (item.Tstmth == "" || item.Meins == "" || item.Lsl == "" || item.Target == "" || item.Usl == "" || item.Relcri == "" || item.Accdef == "0.00" || item.Partcoa == "" || item.Planttst == "" || item.Remarks == "") {
                //         item.Flag = "Error"
                //         Error = true;
                //     } else {
                //         delete item.Flag;
                //     }
                //     return item;
                // };

                // if (Data.RegulatoryIntegrity.results) {
                //     Data.RegulatoryIntegrity.results = Data.RegulatoryIntegrity.results.map(logic1);
                //     if (Error) {
                //         oJsonCentralModel.setProperty("/PackagingMaterial/Data/RegulatoryIntegrity/results", Data.RegulatoryIntegrity.results);
                //         oJsonCentralModel.refresh();
                //     } else {
                payload.RegulatoryIntegrity = Data.RegulatoryIntegrity.results;
                //     }
                // }


                // if (Data.PrintingParameters.results) {
                //     Data.PrintingParameters.results = Data.PrintingParameters.results.map(logic1);
                //     if (Error) {
                //         oJsonCentralModel.setProperty("/PackagingMaterial/Data/PrintingParameters/results", Data.PrintingParameters.results);
                //         oJsonCentralModel.refresh();
                //     } else {
                payload.PrintingParameters = Data.PrintingParameters.results;
                //     }
                // }

                // if (Data.Appearance.results) {
                //     Data.Appearance.results = Data.Appearance.results.map(logic1);
                //     if (Error) {
                //         oJsonCentralModel.setProperty("/PackagingMaterial/Data/Appearance/results", Data.Appearance.results);
                //         oJsonCentralModel.refresh();
                //     } else {
                payload.Appearance = Data.Appearance.results;
                //     }
                // }

                // if (Data.Measurement.results) {
                //     Data.Measurement.results = Data.Measurement.results.map(logic1);
                //     if (Error) {
                //         oJsonCentralModel.setProperty("/PackagingMaterial/Data/Measurement/results", Data.Measurement.results);
                //         oJsonCentralModel.refresh();
                //     } else {
                payload.Measurement = Data.Measurement.results;
                //     }
                // }

                // if (Data.Performance.results) {
                //     Data.Performance.results = Data.Performance.results.map(logic1);
                //     if (Error) {
                //         oJsonCentralModel.setProperty("/PackagingMaterial/Data/Performance/results", Data.Performance.results);
                //         oJsonCentralModel.refresh();
                //     } else {
                payload.Performance = Data.Performance.results;
                //     }
                // }

                // if (Data.Developmental.results) {
                //     Data.Developmental.results = Data.Developmental.results.map(logic1);
                //     if (Error) {
                //         oJsonCentralModel.setProperty("/PackagingMaterial/Data/Developmental/results", Data.Developmental.results);
                //         oJsonCentralModel.refresh();
                //     } else {
                payload.Developmental = Data.Developmental.results;
                //     }
                // }

                // if (Data.SustainabilitySafety.results) {
                //     Data.SustainabilitySafety.results = Data.SustainabilitySafety.results.map(logic1);
                //     if (Error) {
                //         oJsonCentralModel.setProperty("/PackagingMaterial/Data/SustainabilitySafety/results", Data.SustainabilitySafety.results);
                //         oJsonCentralModel.refresh();
                //     } else {
                payload.SustainabilitySafety = Data.SustainabilitySafety.results;
                //     }
                // }

                // var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
                // if (Error) {
                //     MessageBox.error(
                //         "Please fill mandatory fields", {
                //         styleClass: bCompact ? "sapUiSizeCompact" : ""
                //     }
                //     );
                //     return;
                // }

                //Remarks
                payload.Comments = Remarks;
                payload.Approver = Approver;
                payload.ApproverU = ApproverU;
                payload.Reviewer = Reviewer;
                payload.ReviewerU = ReviewerU;

                var that = this;
                var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
                var oModel = this.getView().getModel();
                BusyIndicator.show();
                oModel.create("/SpecificationSet", payload,
                    {
                        success: function (oSucess) {
                            BusyIndicator.hide();
                            MessageBox.success(
                                "Approval Initiate Successfully", {
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
            onPressPrint: function () {
                var that = this;
                var oModel = this.getView().getModel();

                var oJsonCentralModel = that.getView().getModel("jsonCentralModel");
                var Matnr = oJsonCentralModel.getProperty("/PackagingMaterial/Data/Matnr");
                var Versn = oJsonCentralModel.getProperty("/PackagingMaterial/Data/Versn");

                var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
                BusyIndicator.show();

                // oModel.read("/AdobeFormSet(Matnr='" + Matnr + "',Versn='" + Versn + "',Type='RM',Action='" + Action + "')",

                let Action = "";
                oModel.read("/AdobeFormSet(Matnr='" + Matnr + "',Versn='" + Versn + "',Type='PM',Action='" + Action + "')",
                    {
                        success: function (oSucess) {

                            BusyIndicator.hide();

                            // var test1 = atob(oSucess.Value);
                            var test2 = atob(oSucess.Value);

                            var byteNumbers = new Array(test2.length);
                            for (var i = 0; i < test2.length; i++) { 
                                byteNumbers[i] = test2.charCodeAt(i);
                            }

                            var byteArray = new Uint8Array(byteNumbers); 
                            var blob = new Blob([byteArray], {
                                type: 'application/pdf'
                            });

                            var url = URL.createObjectURL(blob);
                            window.open(url, '_blank');

                        },
                        error: function (oError) {
                            BusyIndicator.hide();
                        }
                    });
            },

            onPressAccept: function () {
                var that = this;
                var dialog = new Dialog({
                    title: 'Remarks',
                    type: 'Message',
                    contentWidth: '50%',
                    contentHeight: '40%',
                    content: [
                        new Label({ text: 'Please provide remarks', labelFor: 'submitDialogTextarea' }),
                        new TextArea('submitDialogTextarea', {
                            liveChange: function (oEvent) {
                                var sText = oEvent.getParameter('value');
                                var parent = oEvent.getSource().getParent();

                                parent.getBeginButton().setEnabled(sText.length > 0);
                            },
                            width: '100%',
                            height: '10rem',
                            placeholder: 'required'
                        })
                    ],
                    beginButton: new Button({
                        type: ButtonType.Emphasized,
                        text: 'Submit',
                        enabled: false,
                        press: function () {
                            var sText = sap.ui.getCore().byId('submitDialogTextarea').getValue();
                            // MessageToast.show('Note is: ' + sText);
                            that.fnAccept(sText);
                            dialog.close();
                        }
                    }),
                    endButton: new Button({
                        text: 'Cancel',
                        press: function () {
                            dialog.close();
                        }
                    }),
                    afterClose: function () {
                        dialog.destroy();
                    }
                });

                dialog.open();
            },

            fnAccept: function (remarks) {

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
                payload.Action = '6';
                payload.IssueDate = IssueDate;
                payload.EffctDate = EffctDate;

                payload.Createdon = Createdon;
                payload.Reviewon = Reviewon;
                payload.Aproveon = Aproveon;

                payload.RegulatoryIntegrity = Data.RegulatoryIntegrity.results;
                payload.PrintingParameters = Data.PrintingParameters.results;
                payload.Appearance = Data.Appearance.results;
                payload.Measurement = Data.Measurement.results;
                payload.Performance = Data.Performance.results;
                payload.Developmental = Data.Developmental.results;
                payload.SustainabilitySafety = Data.SustainabilitySafety.results;

                //Remarks
                payload.Comments = remarks;

                var that = this;
                var oModel = this.getView().getModel();
                var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
                BusyIndicator.show();
                oModel.create("/SpecificationSet", payload,
                    {
                        success: function (oSucess) {
                            BusyIndicator.hide();
                            MessageBox.success(
                                "Approved Successfully", {
                                styleClass: bCompact ? "sapUiSizeCompact" : "",
                                onClose: function () {
                                    // that.onPressHome();
                                    that.fnGoToPMList();
                                }
                            }
                            );
                        },
                        error: function (oError) {
                            BusyIndicator.hide();
                        }
                    });
            },
            fnGoToPMList: function () {

                var oJsonCentralModel = this.getView().getModel("jsonCentralModel");
                var UserType = oJsonCentralModel.getProperty("/UserType");

                if (UserType == 'I' || UserType == 'A' || UserType == 'R') {
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("RoutePMList", {
                        MaterialType: 'PM',
                        User: UserType
                    });
                }
            },

            onPressReject: function () {
                var that = this;
                var dialog = new Dialog({
                    title: 'Remarks',
                    type: 'Message',
                    contentWidth: '50%',
                    contentHeight: '40%',
                    content: [
                        new Label({ text: 'Please provide remarks', labelFor: 'rejectDialogTextarea' }),
                        new TextArea('rejectDialogTextarea', {
                            liveChange: function (oEvent) {
                                var sText = oEvent.getParameter('value');
                                var parent = oEvent.getSource().getParent();

                                parent.getBeginButton().setEnabled(sText.length > 0);
                            },
                            width: '100%',
                            height: '10rem',
                            placeholder: 'required'
                        })
                    ],
                    beginButton: new Button({
                        type: ButtonType.Emphasized,
                        text: 'Submit',
                        enabled: false,
                        press: function () {
                            var sText = sap.ui.getCore().byId('rejectDialogTextarea').getValue();
                            // MessageToast.show('Note is: ' + sText);
                            that.fnReject(sText);
                            dialog.close();
                        }
                    }),
                    endButton: new Button({
                        text: 'Cancel',
                        press: function () {
                            dialog.close();
                        }
                    }),
                    afterClose: function () {
                        dialog.destroy();
                    }
                });

                dialog.open();
            },
            fnReject: function (remarks) {

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
                payload.Action = '7';
                payload.IssueDate = IssueDate;
                payload.EffctDate = EffctDate;

                payload.Createdon = Createdon;
                payload.Reviewon = Reviewon;
                payload.Aproveon = Aproveon;

                payload.RegulatoryIntegrity = Data.RegulatoryIntegrity.results;
                payload.PrintingParameters = Data.PrintingParameters.results;
                payload.Appearance = Data.Appearance.results;
                payload.Measurement = Data.Measurement.results;
                payload.Performance = Data.Performance.results;
                payload.Developmental = Data.Developmental.results;
                payload.SustainabilitySafety = Data.SustainabilitySafety.results;

                //Remarks
                payload.Comments = remarks;

                var that = this;
                var oModel = this.getView().getModel();
                var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
                BusyIndicator.show();
                oModel.create("/SpecificationSet", payload,
                    {
                        success: function (oSucess) {
                            BusyIndicator.hide();
                            MessageBox.success(
                                "Rejected Successfully", {
                                styleClass: bCompact ? "sapUiSizeCompact" : "",
                                onClose: function () {
                                    // that.onPressHome();
                                    that.fnGoToPMList();
                                }
                            }
                            );
                        },
                        error: function (oError) {
                            BusyIndicator.hide();
                        }
                    });
            },

            onPressCreateTaskList: function () {
                const oJsonCentralModel = this.getView().getModel("jsonCentralModel");
                const TempData = JSON.parse(oJsonCentralModel.getJSON());
                const Data = TempData.PackagingMaterial.Data;

                let that = this;
                const oModel = this.getView().getModel();
                const bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;

                const payload = {
                    "Matnr": Data.Matnr,
                    "Versn": Data.Versn,
                    "Action": "P",
                    "Message": []
                }
                BusyIndicator.show();
                oModel.create("/TaskListSet", payload,
                    {
                        success: function (oSucess) {
                            BusyIndicator.hide();
                            var oJsonTaskListMessageModel = that.getView().getModel("jsonTaskListMessageModel");
                            oJsonTaskListMessageModel.setData(null);
                            oJsonTaskListMessageModel.setData(oSucess.Message.results);
                            oJsonTaskListMessageModel.refresh();
                            that.fnOpenTaskListMessageDialog();
                        },
                        error: function (oError) {
                            BusyIndicator.hide();
                        }
                    });
            }


        });
    });
