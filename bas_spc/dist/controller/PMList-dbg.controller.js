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
 
        return BaseController.extend("com.emami.spc.controller.PMList", {
            formatter: formatter,
 
            onInit: function () { 
                // sap.m.MessageBox.error("https://emamiapp.emamigroup.com:8097/sap/bc/ui5_ui5/sap/ZMM_PAK_SPEC_MG/index.html");
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("RoutePMList").attachPatternMatched(this._onObjectMatched, this);
            },

            _onObjectMatched: function (oEvent) {

                var MaterialType = oEvent.getParameter("arguments").MaterialType;
                var UserType = oEvent.getParameter("arguments").User;

                var oModel1 = this.getView().getModel("jsonCentralModel");
                var oUserInfo = oModel1.getProperty("/UserInfo");

                var sActualRole = oUserInfo.Type;

                if (UserType !== sActualRole) {
                    sap.m.MessageBox.error("You Can't change you user");
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("RouteHome");
                }

                this.fnRefreshModel();

                this.fnSetAppTitle(MaterialType);
                this.fnCreateBtnVisibility(UserType);
                this.fnSetUserType(UserType);

                var that = this;
                var oModel = this.getView().getModel();
 
                BusyIndicator.show();
                var type = "'PM'"; `         `

                oModel.read("/MaterialDropdown?Type='" + type + "'", {
                    urlParameters: {
                        "Type": type
                    },
                    success: function (oSuccess) {

                        var oJsonMaterialDropdownModel = that.getView().getModel("jsonMaterialDropdownModel");
                        oJsonMaterialDropdownModel.setData(oSuccess.results);
                    },

                    error: function (oError) {
                        BusyIndicator.hide();
                    }
                });
                oModel.read("/PMRefMaterialDropdown", {
                    success: function (oSuccess) {
                        var oJsonRefMaterialDropdownModel = that.getView().getModel("jsonRefMaterialDropdownModel");
                        oJsonRefMaterialDropdownModel.setData(oSuccess.results);
                    },

                    error: function (oError) {
                        BusyIndicator.hide();
                    }
                });

                oModel.read("/PMPendingListSet", {
                    success: function (oSuccess) {
                        var oJsonPMPendingListModel = that.getView().getModel("jsonPMPendingListModel");
                        oJsonPMPendingListModel.setData(oSuccess.results);
                        BusyIndicator.hide();
                    },

                    error: function (oError) {
                        BusyIndicator.hide();
                    }
                });

            },

            fnRefreshModel: function () {
                this.getView().getModel("jsonCentralModel").setProperty("/Home/SelectedMaterialCode", "");
                this.getView().getModel("jsonCentralModel").setProperty("/Home/SelectedMaterialText", "");
                this.getView().getModel("jsonCentralModel").setProperty("/Home/EnableDisableCreate", false);
                // this.getView().getModel("jsonCentralModel").setProperty("/Home/FromDate", null);
                // this.getView().getModel("jsonCentralModel").setProperty("/Home/ToDate", null);

                // var oJsonMaterialListModel = this.getView().getModel("jsonMaterialListModel");
                // oJsonMaterialListModel.setData(null);
            },

            onMaterialListValueHelpReq: function () {

                var that = this;

                if (!that.MaterialListDialog) {
                    that.MaterialListDialog = sap.ui.xmlfragment("com.emami.spc.view.fragments.MaterialListDialog", that);
                    that.getView().addDependent(that.MaterialListDialog);
                }
                that.MaterialListDialog.open();

            },

            onSearchMaterialListDialog: function (oEvent) {
                var sValue = oEvent.getParameter("value");

                var oFilter = new sap.ui.model.Filter({
                    filters: [
                        new Filter("Matnr", sap.ui.model.FilterOperator.Contains, sValue),
                        new Filter("Maktx", sap.ui.model.FilterOperator.Contains, sValue),

                    ],
                    and: false
                });
                var oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([oFilter]);
            },

            onPressMaterialListDialogLineItem: function (oEvent) {
                var Matnr = oEvent.getParameter("selectedItem").getCells()[0].getText();
                var Maktx = oEvent.getParameter("selectedItem").getCells()[1].getText();

                this.getView().getModel("jsonCentralModel").setProperty("/Home/SelectedMaterialCode", Matnr);
                this.getView().getModel("jsonCentralModel").setProperty("/Home/SelectedMaterialText", Maktx);

                this.fnGetMaterialListSet(Matnr);

            },
            fnGetMaterialListSet: function (selected) {
                var that = this;
                var oModel = this.getView().getModel();
                var oJsonMaterialListModel = this.getView().getModel("jsonMaterialListModel");
                var oJsonCentralModel = this.getView().getModel("jsonCentralModel");

                // const FinalData = JSON.parse(JSON.stringify(oJsonCentralModel.oData));

                // let { FromDate, ToDate} = FinalData.Home;

                // if (FromDate) {
                //     var aTemp = FromDate.split("T");
                //     FromDate = new Date(aTemp[0]);
                //     FromDate.setDate(FromDate.getDate() + 1);
                // }

                // if (ToDate) {
                //     var aTemp = ToDate.split("T");
                //     ToDate = new Date(aTemp[0]);
                //     ToDate.setDate(ToDate.getDate() + 1);
                // }


                BusyIndicator.show();
                let afilters = [];
                afilters.push(new Filter("Matnr", FilterOperator.EQ, selected));
                // afilters.push(new Filter("FromDate", FilterOperator.EQ, FromDate));
                // afilters.push(new Filter("ToDate", FilterOperator.EQ, ToDate));

                oModel.read("/PMSpecificListSet", {
                    filters: afilters,
                    success: function (oSuccess) {
                        oJsonMaterialListModel.setData(oSuccess.results);
                        if (oSuccess.results.length == 0) {
                            oJsonCentralModel.setProperty("/Home/EnableDisableCreate", true);
                        } else {
                            oJsonCentralModel.setProperty("/Home/EnableDisableCreate", false);
                        }
                        BusyIndicator.hide();
                    },

                    error: function (oError) {
                        BusyIndicator.hide();
                    }
                });
            },

            onPressSearch: function () {
                var that = this;
                var oModel = this.getView().getModel();
                var oJsonMaterialListModel = this.getView().getModel("jsonMaterialListModel");
                var oJsonCentralModel = this.getView().getModel("jsonCentralModel");

                const FinalData = JSON.parse(JSON.stringify(oJsonCentralModel.oData));

                let { FromDate, ToDate } = FinalData.Home;

                if (FromDate) {
                    var aTemp = FromDate.split("T");
                    FromDate = new Date(aTemp[0]);
                    FromDate.setDate(FromDate.getDate() + 1);
                }

                if (ToDate) {
                    var aTemp = ToDate.split("T");
                    ToDate = new Date(aTemp[0]);
                    ToDate.setDate(ToDate.getDate() + 1);
                }


                BusyIndicator.show();
                let afilters = [];
                afilters.push(new Filter("FromDate", FilterOperator.EQ, FromDate));
                afilters.push(new Filter("ToDate", FilterOperator.EQ, ToDate));

                oModel.read("/PMSpecificListSet", {
                    filters: afilters,
                    success: function (oSuccess) {
                        oJsonMaterialListModel.setData(oSuccess.results);
                        // if (oSuccess.results.length == 0) {
                        //     oJsonCentralModel.setProperty("/Home/EnableDisableCreate", true);
                        // } else {
                        //     oJsonCentralModel.setProperty("/Home/EnableDisableCreate", false);
                        // }

                        oJsonCentralModel.setProperty("/Home/EnableDisableCreate", false);
                        BusyIndicator.hide();
                    },

                    error: function (oError) {
                        BusyIndicator.hide();
                    }
                });
            },

            onPressClear: function () {
                this.getView().getModel("jsonCentralModel").setProperty("/Home/SelectedMaterialCode", "");
                this.getView().getModel("jsonCentralModel").setProperty("/Home/SelectedMaterialText", "");
                this.getView().getModel("jsonCentralModel").setProperty("/Home/EnableDisableCreate", false);
                this.getView().getModel("jsonCentralModel").setProperty("/Home/FromDate", null);
                this.getView().getModel("jsonCentralModel").setProperty("/Home/ToDate", null);

                var oJsonMaterialListModel = this.getView().getModel("jsonMaterialListModel");
                oJsonMaterialListModel.setData(null);
            },
            onChangeMaterialListInput: function (oEvent) {

                var selected = oEvent.getParameter("newValue");

                var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;

                var oJsonCentralModel = this.getView().getModel("jsonCentralModel");
                var oJsonMaterialListModel = this.getView().getModel("jsonMaterialListModel");

                if (selected == "") {

                    oJsonCentralModel.setProperty("/Home/SelectedMaterialCode", "");
                    oJsonCentralModel.getProperty("/Home/SelectedMaterialText", "");
                    oJsonCentralModel.setProperty("/Home/EnableDisableCreate", false);
                    oJsonMaterialListModel.setData(null);
                    MessageBox.error(
                        "Material Code Is Blank", {
                        styleClass: bCompact ? "sapUiSizeCompact" : ""
                    }
                    );

                    return;
                } else {

                    var oJsonMaterialDropdownModel = this.getView().getModel("jsonMaterialDropdownModel");

                    var aList = oJsonMaterialDropdownModel.oData.filter((list) => {
                        if (list.Matnr == selected) {
                            return true;
                        } else {
                            return false;
                        }
                    });

                    if (aList.length != 1) {

                        oJsonCentralModel.setProperty("/Home/SelectedMaterialCode", "");
                        oJsonCentralModel.getProperty("/Home/SelectedMaterialText", "");
                        oJsonCentralModel.setProperty("/Home/EnableDisableCreate", false);
                        oJsonMaterialListModel.setData(null);

                        MessageBox.error(
                            "Please Enter Valid Material", {
                            styleClass: bCompact ? "sapUiSizeCompact" : ""
                        }
                        );
                        return;
                    } else {

                        oJsonCentralModel.setProperty("/Home/SelectedMaterialCode", selected);
                        oJsonCentralModel.getProperty("/Home/SelectedMaterialText", aList[0].Maktx);

                        this.fnGetMaterialListSet(selected);

                    }

                }
            },
            onPressPMSpecificListLineItem: function (oEvent) {
                var Clicked = this.getView().getModel("jsonMaterialListModel").getProperty(oEvent.getSource().getBindingContextPath());
                var Matnr = Clicked.Matnr;
                var Versn = Clicked.Versn;

                var oJsonCentralModel = this.getView().getModel("jsonCentralModel");
                var UserType = oJsonCentralModel.getProperty("/UserType");

                if (UserType) {
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("RoutePMEditDisplay", {
                        Matnr: Matnr,
                        Versn: Versn,
                        User: UserType,
                        Mode: 'Display'
                    });
                }
            },

            onPressPMPendingListLineItem: function (oEvent) {
                var Clicked = this.getView().getModel("jsonPMPendingListModel").getProperty(oEvent.getSource().getBindingContextPath());
                var Matnr = Clicked.Matnr;
                var Versn = Clicked.Versn;

                var oJsonCentralModel = this.getView().getModel("jsonCentralModel");
                var UserType = oJsonCentralModel.getProperty("/UserType");

                if (UserType) {
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("RoutePMEditDisplay", {
                        Matnr: Matnr,
                        Versn: Versn,
                        User: UserType
                    });
                }
            },

            onPressCreate: function () {

                let that = this;

                if (!that.PMRefMaterialDialog) {
                    that.PMRefMaterialDialog = sap.ui.xmlfragment("com.emami.spc.view.fragments.PMRefMaterialDialog", that);
                    that.getView().addDependent(that.PMRefMaterialDialog);
                }
                that.PMRefMaterialDialog.open();



                // var oJsonCentralModel = this.getView().getModel("jsonCentralModel");
                // var Matnr = oJsonCentralModel.getProperty("/Home/SelectedMaterialCode");
                // var Maktx = oJsonCentralModel.getProperty("/Home/SelectedMaterialText");
                // var UserType = oJsonCentralModel.getProperty("/UserType");



                // if (UserType) {
                //     var oRouter = this.getOwnerComponent().getRouter();
                //     oRouter.navTo("RoutePMCreate", {
                //         Matnr: Matnr,
                //         RefMatnr: ''
                //     });
                // }
            },

            onChangeRadioBtn: function (oEvent) {
                const selectedIndex = oEvent.mParameters.selectedIndex;
                const InputRefMatnr = sap.ui.getCore().byId("idInputRefMatnr");
                const InputPMRefVersn = sap.ui.getCore().byId("idInputPMRefVersn");
                if (selectedIndex == 1) {
                    InputRefMatnr.setEditable(true);
                } else {
                    InputRefMatnr.setEditable(false);
                    InputRefMatnr.setValue('');
                    InputPMRefVersn.setValue('');
                }
            },
            onConfirmPMRefMaterialDialog: function () {
                const RadioBtnGroup = sap.ui.getCore().byId("idRadioBtnGroup");
                const selectedIndex = RadioBtnGroup.mProperties.selectedIndex;
                let InputRefMatnr;
                let InputPMRefVersn;
                let RefMatnr;
                let RefVersn;

                let bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;

                if (selectedIndex == 1) {
                    InputRefMatnr = sap.ui.getCore().byId("idInputRefMatnr");
                    RefMatnr = InputRefMatnr.getValue()

                    if (!RefMatnr) {
                        MessageBox.error(
                            "Please Input Reference Material", {
                            styleClass: bCompact ? "sapUiSizeCompact" : ""
                        }
                        );
                        return;
                    }

                    InputPMRefVersn = sap.ui.getCore().byId("idInputPMRefVersn");
                    RefVersn = InputPMRefVersn.getValue()

                    if (!RefVersn) {
                        MessageBox.error(
                            "Please Input Reference Version", {
                            styleClass: bCompact ? "sapUiSizeCompact" : ""
                        }
                        );
                        return;
                    }
                }

                this.PMRefMaterialDialog.close();
                this.PMRefMaterialDialog.destroy();
                this.PMRefMaterialDialog = null;

                var oJsonCentralModel = this.getView().getModel("jsonCentralModel");
                var Matnr = oJsonCentralModel.getProperty("/Home/SelectedMaterialCode");
                var Maktx = oJsonCentralModel.getProperty("/Home/SelectedMaterialText");
                var oRouter = this.getOwnerComponent().getRouter();

                if (selectedIndex == 1) {
                    oRouter.navTo("RoutePMCreate", {
                        Matnr: Matnr,
                        RefMatnr: RefMatnr,
                        RefVersn: RefVersn
                    });

                } else {
                    oRouter.navTo("RoutePMCreate", {
                        Matnr: Matnr,
                        RefMatnr: '',
                        RefVersn: ''
                    });
                }
            },
            onCancelPMRefMaterialDialog: function () {
                this.PMRefMaterialDialog.close();
                this.PMRefMaterialDialog.destroy();
                this.PMRefMaterialDialog = null;
            },

            onRefMatnrValueHelpReq: function () {
                let that = this;

                if (!that.PMRefMaterialTableDialog) {
                    that.PMRefMaterialTableDialog = sap.ui.xmlfragment("com.emami.spc.view.fragments.PMRefMaterialTableDialog", that);
                    that.getView().addDependent(that.PMRefMaterialTableDialog);
                }
                that.PMRefMaterialTableDialog.open();
            },

            onConfirmPMRefMaterialTableDialog: function (oEvent) {
                let Matnr = oEvent.getParameter("selectedItem").getCells()[0].getText();
                let Versn = oEvent.getParameter("selectedItem").getCells()[1].getText();

                let InputRefMatnr = sap.ui.getCore().byId("idInputRefMatnr");
                InputRefMatnr.setValue(Matnr);

                let InputPMRefVersn = sap.ui.getCore().byId("idInputPMRefVersn");
                InputPMRefVersn.setValue(Versn);
            },

            onSearchPMRefMaterialTableDialog: function (oEvent) {
                var sValue = oEvent.getParameter("value");

                var oFilter = new sap.ui.model.Filter({
                    filters: [
                        new Filter("Matnr", sap.ui.model.FilterOperator.Contains, sValue),
                        new Filter("Versn", sap.ui.model.FilterOperator.Contains, Number(sValue)),
                        new Filter("Maktx", sap.ui.model.FilterOperator.Contains, sValue)
                    ],
                    and: false
                });
                var oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([oFilter]);
            }

        });
    });
