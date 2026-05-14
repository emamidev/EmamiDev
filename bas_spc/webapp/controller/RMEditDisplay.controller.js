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
    'sap/m/Button',
    'sap/m/DialogType',
    "sap/ui/core/Element",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, BusyIndicator, MessageBox, formatter, Dialog, TextArea, ButtonType, Label, MessageToast, Button, DialogType, Element, Filter, FilterOperator) {
        "use strict";

        return BaseController.extend("com.emami.spc.controller.RMEditDisplay", {
            formatter: formatter,
            onInit: function () {

                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("RouteRMEditDisplay").attachPatternMatched(this._onObjectMatched, this);

            },

            _onObjectMatched: function (oEvent) {

                var Matnr = oEvent.getParameter("arguments").Matnr;
                var Versn = oEvent.getParameter("arguments").Versn;
                var UserType = oEvent.getParameter("arguments").User;
                var Mode = oEvent.getParameter("arguments").Mode;

                this.fnRefreshModel();

                this.fnSetUserType(UserType);
                this.fnSetAppTitle("RM");
                this.fnSetRMEditable(UserType);
                this.fnSetRMBtnVisibility(UserType);

                var url = "/RawMaterialSet(Matnr='"
                    + Matnr + "',Versn='" + Versn + "',Action='3',RefMatnr='',RefVersn='')";

                var expand = "SpecificationItem,ApprovedVendors,RevisionLog";


                var that = this;
                var oModel = this.getView().getModel();
                var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
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

                            var fnRevisonLogLogic = (item) => {
                                item.Matnr = Matnr;
                                return item;
                            };

                            if (LocalData.RevisionLog.results) {
                                LocalData.RevisionLog.results = LocalData.RevisionLog.results.map(fnRevisonLogLogic);
                            }

                            var oJsonCentralModel = that.getView().getModel("jsonCentralModel");
                            oJsonCentralModel.setProperty("/RawMaterial/Data", LocalData);
                            oJsonCentralModel.setProperty("/RawMaterial/Data/Matnr", Matnr);


                            oJsonCentralModel.setProperty("/RawMaterial/Visible/CreateReferenceBtn", false);
                            oJsonCentralModel.setProperty("/RawMaterial/Visible/PrintBtn", false);
                            oJsonCentralModel.setProperty("/RawMaterial/Visible/CreateTaskListBtn", false);

                            if (LocalData.WfInit == 'I') {
                                oJsonCentralModel.setProperty("/RawMaterial/Visible/InitiateBtn", false);
                                oJsonCentralModel.setProperty("/RawMaterial/Visible/SaveBtn", false);
                                oJsonCentralModel.setProperty("/RawMaterial/Editable/All", false);

                                if (LocalData.RevisionLog.results) {
                                    LocalData.RevisionLog.results = LocalData.RevisionLog.results.map((item) => {
                                        item.Editable = false;
                                        return item;
                                    });
                                }

                            } else {
                                oJsonCentralModel.setProperty("/RawMaterial/Visible/InitiateBtn", true);
                                oJsonCentralModel.setProperty("/RawMaterial/Visible/SaveBtn", true);
                                oJsonCentralModel.setProperty("/RawMaterial/Editable/All", true);

                                if (LocalData.RevisionLog.results) {
                                    LocalData.RevisionLog.results = LocalData.RevisionLog.results.map((item) => {

                                        // if (item.Versn == Versn || item.Versn == '') {
                                        //     item.Editable = true;
                                        // } else {
                                        //     item.Editable = false;
                                        // }
                                        item.Editable = true;
                                        return item;
                                    });
                                }
                            }

                            if (UserType == 'A' || UserType == 'R') {
                                oJsonCentralModel.setProperty("/RawMaterial/Visible/InitiateBtn", false);
                                oJsonCentralModel.setProperty("/RawMaterial/Visible/SaveBtn", false);
                                oJsonCentralModel.setProperty("/RawMaterial/Editable/All", false);

                                LocalData.RevisionLog.results = LocalData.RevisionLog.results.map((item) => {
                                    item.Editable = false;
                                    return item;
                                });
                            }

                            oJsonCentralModel.setProperty("/RawMaterial/Visible/BarVisible", true);

                            if (Mode) {
                                oJsonCentralModel.setProperty("/RawMaterial/Visible/InitiateBtn", false);
                                oJsonCentralModel.setProperty("/RawMaterial/Visible/SaveBtn", false);
                                oJsonCentralModel.setProperty("/RawMaterial/Editable/All", false);
                                // oJsonCentralModel.setProperty("/RawMaterial/Editable/Versn", false);
                                oJsonCentralModel.setProperty("/RawMaterial/Visible/AcceptBtn", false);
                                oJsonCentralModel.setProperty("/RawMaterial/Visible/RejectBtn", false);
                                oJsonCentralModel.setProperty("/RawMaterial/Visible/PrintBtn", false);
                                oJsonCentralModel.setProperty("/RawMaterial/Visible/CreateTaskListBtn", false);
                                oJsonCentralModel.setProperty("/RawMaterial/Visible/CreateReferenceBtn", false);
                                oJsonCentralModel.setProperty("/RawMaterial/Visible/BarVisible", false);

                                LocalData.RevisionLog.results = LocalData.RevisionLog.results.map((item) => {
                                    item.Editable = false;
                                    return item;
                                });
                            }

                            //On full approved case - Show only Print Btn in Specific List Screen
                            if (LocalData.WfInit == 'A') {
                                oJsonCentralModel.setProperty("/RawMaterial/Visible/PrintBtn", true);
                                oJsonCentralModel.setProperty("/RawMaterial/Visible/BarVisible", true);
                                oJsonCentralModel.setProperty("/RawMaterial/Visible/CreateTaskListBtn", true);
                            }

                            // Initator & Fully Approved Case - Show Create Reference Btn to Initator
                            if (UserType == 'I' && LocalData.WfInit == 'A') {
                                oJsonCentralModel.setProperty("/RawMaterial/Visible/CreateReferenceBtn", true);
                            }

                            if (LocalData.Completed == 'X') {
                                oJsonCentralModel.setProperty("/RawMaterial/Visible/CreateTaskListBtn", false);
                            }

                            BusyIndicator.hide();
                        },
                        error: function (oError) {
                            BusyIndicator.hide();
                            MessageBox.error(
                                "Internal server error occurred", {
                                styleClass: bCompact ? "sapUiSizeCompact" : ""
                            }
                            );
                        }
                    });

                if (!Mode) {
                    this.fnRMSearchHelp();
                }

                this.fnGetReviewerApproverList("RM", "");
            },

            fnRefreshModel: function () {
                this.getView().getModel("jsonCentralModel").setProperty("/RawMaterial/Data", {});
                this.getView().getModel("jsonCentralModel").setProperty("/RawMaterial/Editable/All", false);

                let oModel = this.getView().getModel("jsonCentralModel");
                oModel.setProperty("/RawMaterial/RMDateChange/EffctDate", false);
                oModel.setProperty("/RawMaterial/RMDateChange/PerpDate", false);
                oModel.setProperty("/RawMaterial/RMDateChange/NextReview", false);
            },

            onPressCreateReference: function () {
                var oJsonCentralModel = this.getView().getModel("jsonCentralModel");
                var Matnr = oJsonCentralModel.getProperty("/RawMaterial/Data/Matnr");
                var Versn = oJsonCentralModel.getProperty("/RawMaterial/Data/Versn");
                var IncreaesedVersion = Number(Versn) + 1;
                IncreaesedVersion = IncreaesedVersion + "";

                var oJsonCentralModel = this.getView().getModel("jsonCentralModel");
                var UserType = oJsonCentralModel.getProperty("/UserType");

                if (UserType) {

                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("RouteRMCreateReference", {
                        Matnr: Matnr,
                        Versn: IncreaesedVersion,
                        User: UserType
                    });
                }
            },

            fnSave: function () {

                var that = this;
                var dialog = new Dialog({
                    title: 'Remarks',
                    type: 'Message',
                    contentWidth: '50%',
                    contentHeight: '40%',
                    content: [
                        new Label({ text: 'Please provide remarks', labelFor: 'saveDialogTextarea' }),
                        new TextArea('saveDialogTextarea', {
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
                            var sText = sap.ui.getCore().byId('saveDialogTextarea').getValue();
                            // MessageToast.show('Note is: ' + sText);
                            that.fnSave(sText);
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

            onPressSave: function () {
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
                payload.Action = '3';
                payload.PerpDate = PerpDate;
                payload.EffctDate = EffctDate;
                payload.NextReview = NextReview;
                payload.Createdon = Createdon;
                payload.Reviewon = Reviewon;
                payload.Aproveon = Aproveon;

                payload.SpecificationItem = Data.SpecificationItem.results;
                payload.ApprovedVendors = Data.ApprovedVendors.results;

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
                                "Raw Material Specification Saved Successfully", {
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

            onPressDelete: function () {
                var that = this;

                sap.m.MessageBox.confirm("Do you really want to delete?", {
                  title: "Confirm Deletion",
                  actions: [sap.m.MessageBox.Action.DELETE, sap.m.MessageBox.Action.CANCEL],
                  emphasizedAction: sap.m.MessageBox.Action.DELETE,
                  onClose: function (sAction) {
                    if (sAction === sap.m.MessageBox.Action.DELETE) {
                      that.onDelete();
                    }
                  }
                });
            },

            onDelete: function () {
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
                payload.Action = 'D';
                payload.PerpDate = PerpDate;
                payload.EffctDate = EffctDate;
                payload.NextReview = NextReview;
                payload.Createdon = Createdon;
                payload.Reviewon = Reviewon;
                payload.Aproveon = Aproveon;

                payload.SpecificationItem = Data.SpecificationItem.results;
                payload.ApprovedVendors = Data.ApprovedVendors.results;

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
                                "Raw Material Specification Deleted Successfully", {
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

            onPressInitiateApproval1: function () {
                var that = this;
                var dialog = new Dialog({
                    title: 'Remarks',
                    type: 'Message',
                    contentWidth: '50%',
                    contentHeight: '40%',
                    content: [
                        new Label({ text: 'Reviewer:', labelFor: 'idSelectReviewer' }),
                        new sap.m.Select('idSelectReviewer', {
                            forceSelection: false,
                            width: "15rem",
                            items: {
                                path: 'TestModel>/',
                                template: new sap.ui.core.Item({
                                    key: "{TestModel>User}", // Bind key to id
                                    text: "{TestModel>User}" // Bind text to name
                                })
                            }
                        }),
                        new Label({ text: 'Approver:', labelFor: 'idSelectApprover' }),
                        new sap.m.Select('idSelectApprover', {
                            forceSelection: false,
                            width: "15rem"
                        }),

                        new TextArea('initDialogTextarea', {
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
                            var sText = sap.ui.getCore().byId('initDialogTextarea').getValue();
                            // MessageToast.show('Note is: ' + sText);
                            that.fnInitiateApproval(sText);
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
            onPressInitiateApproval: function () {

                var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
                var oJsonCentralModel = this.getView().getModel("jsonCentralModel");

                let Data1 = { ...oJsonCentralModel.oData.RawMaterial.Data };
                let aRevisonLog = [...Data1.RevisionLog.results];
                let check = false;
                if (aRevisonLog) {
                    aRevisonLog.forEach(item => {
                        // delete item.Editable;
                        if (!item['Versn'] || !item['Revlg'] || !item['Revdt']) {
                            check = true;
                        }
                    });
                }

                if (check) {
                    MessageBox.error(
                        "Revison log required field missing.", {
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

            onCancelInitApprovalRemarksDialog: function () {
                var that = this;
                that.InitApprovalRemarksDialog.close();
                that.InitApprovalRemarksDialog.destroy();
                that.InitApprovalRemarksDialog = null;
            },
            fnInitiateApproval: function ({ Approver, ApproverU, Reviewer, ReviewerU, Remarks }) {

                var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
                var oJsonCentralModel = this.getView().getModel("jsonCentralModel");

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
                payload.Action = '4';  // To Initiate Approval
                payload.PerpDate = PerpDate;
                payload.EffctDate = EffctDate;
                payload.NextReview = NextReview;
                payload.Createdon = Createdon;
                payload.Reviewon = Reviewon;
                payload.Aproveon = Aproveon;

                //Remarks
                payload.Comments = Remarks;
                payload.Approver = Approver;
                payload.ApproverU = ApproverU;
                payload.Reviewer = Reviewer;
                payload.ReviewerU = ReviewerU;

                payload.SpecificationItem = Data.SpecificationItem.results;
                payload.ApprovedVendors = Data.ApprovedVendors.results;

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
                                "Approval Initiate Successfully", {
                                styleClass: bCompact ? "sapUiSizeCompact" : "",
                                onClose: function () {
                                    // location.reload();
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
                var dialog = new Dialog({
                    title: 'Confirm',
                    type: 'Message',
                    content: [
                        new sap.m.RadioButton('idRadioBtnVendor1', {
                            groupName: 'GroupA',
                            text: 'With Vendor',
                            selected: true
                        }),
                        new sap.m.RadioButton('idRadioBtnVendor2', {
                            groupName: 'GroupA',
                            text: 'Without Vendor'
                        })
                    ],
                    beginButton: new Button({
                        type: ButtonType.Emphasized,
                        text: 'Confirm',
                        enabled: true,
                        press: function () {
                            let WithVendor = sap.ui.getCore().byId('idRadioBtnVendor1').getSelected();
                            var WithoutVendor = sap.ui.getCore().byId('idRadioBtnVendor2').getSelected();

                            if (WithVendor) {
                                that.fnPrint("WithVendor");
                            } else {
                                that.fnPrint("WithoutVendor");
                            }
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
            fnPrint: function (sText) {

                let Action;

                if (sText == "WithVendor") {
                    Action = "V";
                } else {
                    Action = "W";
                }
                var that = this;
                var oModel = this.getView().getModel();

                var oJsonCentralModel = that.getView().getModel("jsonCentralModel");
                var Matnr = oJsonCentralModel.getProperty("/RawMaterial/Data/Matnr");
                var Versn = oJsonCentralModel.getProperty("/RawMaterial/Data/Versn");
                BusyIndicator.show();
                oModel.read("/AdobeFormSet(Matnr='" + Matnr + "',Versn='" + Versn + "',Type='RM',Action='" + Action + "')",
                    {
                        success: function (oSucess) {

                            BusyIndicator.hide();

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
                        new Label({ text: 'Please provide remarks', labelFor: 'acceptDialogTextarea' }),
                        new TextArea('acceptDialogTextarea', {
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
                            var sText = sap.ui.getCore().byId('acceptDialogTextarea').getValue();
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

                var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
                var oJsonCentralModel = this.getView().getModel("jsonCentralModel");

                let Data1 = { ...oJsonCentralModel.oData.RawMaterial.Data };
                let aRevisonLog = [...Data1.RevisionLog.results];
                let check = false;
                if (aRevisonLog) {
                    aRevisonLog.forEach(item => {
                        delete item.Editable;
                        if (!item['Versn'] || !item['Revlg'] || !item['Revdt']) {
                            check = true;
                        }
                    });
                }

                if (check) {
                    MessageBox.error(
                        "Revison log required field missing.", {
                        styleClass: bCompact ? "sapUiSizeCompact" : ""
                    }
                    );
                    return;
                }

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
                payload.Action = '6';  // To Accept
                payload.PerpDate = PerpDate;
                payload.EffctDate = EffctDate;
                payload.NextReview = NextReview;
                payload.Createdon = Createdon;
                payload.Reviewon = Reviewon;
                payload.Aproveon = Aproveon;

                //Remarks
                payload.Comments = remarks;

                payload.SpecificationItem = Data.SpecificationItem.results;
                payload.ApprovedVendors = Data.ApprovedVendors.results;

                payload.RevisionLog = aRevisonLog;

                var that = this;
                var oModel = this.getView().getModel();

                BusyIndicator.show();
                oModel.create("/RawMaterialSet", payload,
                    {
                        success: function (oSucess) {
                            BusyIndicator.hide();
                            MessageBox.success(
                                "Approved Successfully", {
                                styleClass: bCompact ? "sapUiSizeCompact" : "",
                                onClose: function () {
                                    // location.reload()
                                    // that.onPressHome();
                                    that.fnGoToRMList();
                                }
                            }
                            );
                        },
                        error: function (oError) {
                            BusyIndicator.hide();
                        }
                    });
            },

            fnGoToRMList: function () {

                var oJsonCentralModel = this.getView().getModel("jsonCentralModel");
                var UserType = oJsonCentralModel.getProperty("/UserType");



                if (UserType == 'I' || UserType == 'A' || UserType == 'R') {
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("RouteRMList", {
                        MaterialType: 'RM',
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
                var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;

                let Data1 = { ...oJsonCentralModel.oData.RawMaterial.Data };
                let aRevisonLog = [...Data1.RevisionLog.results];
                let check = false;
                if (aRevisonLog) {
                    aRevisonLog.forEach(item => {
                        delete item.Editable;
                        if (!item['Versn'] || !item['Revlg'] || !item['Revdt']) {
                            check = true;
                        }
                    });
                }

                if (check) {
                    MessageBox.error(
                        "Revison log required field missing.", {
                        styleClass: bCompact ? "sapUiSizeCompact" : ""
                    }
                    );
                    return;
                }

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
                payload.Action = '7';  // To Reject
                payload.PerpDate = PerpDate;
                payload.EffctDate = EffctDate;
                payload.NextReview = NextReview;
                payload.Createdon = Createdon;
                payload.Reviewon = Reviewon;
                payload.Aproveon = Aproveon;


                //Remarks
                payload.Comments = remarks;

                payload.SpecificationItem = Data.SpecificationItem.results;
                payload.ApprovedVendors = Data.ApprovedVendors.results;

                payload.RevisionLog = aRevisonLog;

                var that = this;
                var oModel = this.getView().getModel();

                BusyIndicator.show();
                oModel.create("/RawMaterialSet", payload,
                    {
                        success: function (oSucess) {
                            BusyIndicator.hide();
                            MessageBox.success(
                                "Rejected Successfully", {
                                styleClass: bCompact ? "sapUiSizeCompact" : "",
                                onClose: function () {
                                    // location.reload()
                                    // that.onPressHome();
                                    that.fnGoToRMList();
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
                var oJsonCentralModel = this.getView().getModel("jsonCentralModel");
                const TempData = JSON.parse(oJsonCentralModel.getJSON());
                const Data = TempData.RawMaterial.Data;

                let that = this;
                const oModel = this.getView().getModel();
                const bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;

                const payload = {
                    "Matnr": Data.Matnr,
                    "Versn": Data.Versn,
                    "Action": "R",
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
