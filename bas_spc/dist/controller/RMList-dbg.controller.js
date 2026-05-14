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

        return BaseController.extend("com.emami.spc.controller.RMList", {
            formatter: formatter,

            

            onInit: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("RouteRMList").attachPatternMatched(this._onObjectMatched, this);
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
                var type = "'RM'";

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

                oModel.read("/RMRefMaterialDropdown", {
                    success: function (oSuccess) {
                        var oJsonRMRefMaterialDropdownModel = that.getView().getModel("jsonRMRefMaterialDropdownModel");
                        oJsonRMRefMaterialDropdownModel.setData(oSuccess.results);
                    },

                    error: function (oError) {
                        BusyIndicator.hide();
                    }
                });

                oModel.read("/RMPendingListSet", {
                    success: function (oSuccess) {
                        var oJsonRMPendingListModel = that.getView().getModel("jsonRMPendingListModel");
                        oJsonRMPendingListModel.setData(oSuccess.results);
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

                // var oJsonRMSpecificListModel = this.getView().getModel("jsonRMSpecificListModel");
                // oJsonRMSpecificListModel.setData(null);
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

                this.fnGetRMSpecificListSet(Matnr);

            },
            fnGetRMSpecificListSet: function (selected) {
                var that = this;
                var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;

                var oModel = this.getView().getModel();
                var oJsonRMSpecificListModel = this.getView().getModel("jsonRMSpecificListModel");
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
                var afilters = [];
                afilters.push(new Filter("Matnr", FilterOperator.EQ, selected));
                // afilters.push(new Filter("FromDate", FilterOperator.EQ, FromDate));
                // afilters.push(new Filter("ToDate", FilterOperator.EQ, ToDate));

                oModel.read("/RMSpecificListSet", {
                    filters: afilters,
                    success: function (oSuccess) {
                        oJsonRMSpecificListModel.setData(oSuccess.results);
                        if (oSuccess.results.length == 0) {
                            oJsonCentralModel.setProperty("/Home/EnableDisableCreate", true);
                        } else {
                            oJsonCentralModel.setProperty("/Home/EnableDisableCreate", false);
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
            },
            onPressSearch: function () {
                var that = this;
                var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;

                var oModel = this.getView().getModel();
                var oJsonRMSpecificListModel = this.getView().getModel("jsonRMSpecificListModel");
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
                var afilters = [];
                afilters.push(new Filter("FromDate", FilterOperator.EQ, FromDate));
                afilters.push(new Filter("ToDate", FilterOperator.EQ, ToDate));

                oModel.read("/RMSpecificListSet", {
                    filters: afilters,
                    success: function (oSuccess) {
                        oJsonRMSpecificListModel.setData(oSuccess.results);
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
                        MessageBox.error(
                            "Internal server error occurred", {
                            styleClass: bCompact ? "sapUiSizeCompact" : ""
                        }
                        );
                    }
                });
            },
            onPressClear: function () {
                this.getView().getModel("jsonCentralModel").setProperty("/Home/SelectedMaterialCode", "");
                this.getView().getModel("jsonCentralModel").setProperty("/Home/SelectedMaterialText", "");
                this.getView().getModel("jsonCentralModel").setProperty("/Home/EnableDisableCreate", false);
                this.getView().getModel("jsonCentralModel").setProperty("/Home/FromDate", null);
                this.getView().getModel("jsonCentralModel").setProperty("/Home/ToDate", null);

                var oJsonRMSpecificListModel = this.getView().getModel("jsonRMSpecificListModel");
                oJsonRMSpecificListModel.setData(null);

            },
            onChangeMaterialListInput: function (oEvent) {

                var selected = oEvent.getParameter("newValue");

                var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;

                var oJsonCentralModel = this.getView().getModel("jsonCentralModel");
                var oJsonRMSpecificListModel = this.getView().getModel("jsonRMSpecificListModel");

                if (selected == "") {

                    oJsonCentralModel.setProperty("/Home/SelectedMaterialCode", "");
                    oJsonCentralModel.getProperty("/Home/SelectedMaterialText", "");
                    oJsonCentralModel.setProperty("/Home/EnableDisableCreate", false);
                    oJsonRMSpecificListModel.setData(null);
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
                        oJsonRMSpecificListModel.setData(null);

                        MessageBox.error(
                            "Please Enter Valid Material", {
                            styleClass: bCompact ? "sapUiSizeCompact" : ""
                        }
                        );
                        return;
                    } else {
                        oJsonCentralModel.setProperty("/Home/SelectedMaterialCode", selected);
                        oJsonCentralModel.setProperty("/Home/SelectedMaterialText", aList[0].Maktx);

                        this.fnGetRMSpecificListSet(selected);

                    }

                }
            },

            onPressCreate: function () {
                let that = this;

                if (!that.RMRefMaterialDialog) {
                    that.RMRefMaterialDialog = sap.ui.xmlfragment("com.emami.spc.view.fragments.RMRefMaterialDialog", that);
                    that.getView().addDependent(that.RMRefMaterialDialog);
                }
                that.RMRefMaterialDialog.open();
            },

            onPressCreateDuplicate: function () {

                var oJsonCentralModel = this.getView().getModel("jsonCentralModel");
                var Matnr = oJsonCentralModel.getProperty("/Home/SelectedMaterialCode");
                var Maktx = oJsonCentralModel.getProperty("/Home/SelectedMaterialText");
                var UserType = oJsonCentralModel.getProperty("/UserType");

                if (UserType) {

                    var oRouter = this.getOwnerComponent().getRouter();
                    // oRouter.navTo("RouteRMCreate", {
                    //     Matnr: Matnr,
                    //     Maktx: Maktx,
                    //     User: UserType
                    // });

                    oRouter.navTo("RouteRMCreate", {
                        Matnr: Matnr
                    });
                }
            },

            onPressLineItem: function (oEvent) {
                var Clicked = this.getView().getModel("jsonRMSpecificListModel").getProperty(oEvent.getSource().getBindingContextPath());
                var Matnr = Clicked.Matnr;
                var Versn = Clicked.Versn;

                var oJsonCentralModel = this.getView().getModel("jsonCentralModel");
                var UserType = oJsonCentralModel.getProperty("/UserType");

                if (UserType) {
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("RouteRMEditDisplay", {
                        Matnr: Matnr,
                        Versn: Versn,
                        User: UserType,
                        Mode: 'Display'
                    });
                }
            },

            onPressMaterialListLineItem: function (oEvent) {
                var Clicked = this.getView().getModel("jsonRMPendingListModel").getProperty(oEvent.getSource().getBindingContextPath());
                var Matnr = Clicked.Matnr;
                var Versn = Clicked.Versn;

                var oJsonCentralModel = this.getView().getModel("jsonCentralModel");
                var UserType = oJsonCentralModel.getProperty("/UserType");

                if (UserType) {
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("RouteRMEditDisplay", {
                        Matnr: Matnr,
                        Versn: Versn,
                        User: UserType
                    });
                }
            },
            onSearchRMRefMaterialTableDialog: function (oEvent) {
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
            },

            onConfirmRMRefMaterialTableDialog: function (oEvent) {
                let Matnr = oEvent.getParameter("selectedItem").getCells()[0].getText();
                let Versn = oEvent.getParameter("selectedItem").getCells()[1].getText();

                let InputRMRefMatnr = sap.ui.getCore().byId("idInputRMRefMatnr");
                InputRMRefMatnr.setValue(Matnr);

                let InputRMRefVersion = sap.ui.getCore().byId("idInputRMRefVersion");
                InputRMRefVersion.setValue(Versn);
            },

            onConfirmRMRefMaterialDialog: function () {
                const RadioBtnGroup = sap.ui.getCore().byId("idRMRadioBtnGroup");
                const selectedIndex = RadioBtnGroup.mProperties.selectedIndex;
                let InputRefMatnr;
                let InputRMRefVersion;
                let RefMatnr;
                let RefVersn;

                let bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;

                if (selectedIndex == 1) {
                    InputRefMatnr = sap.ui.getCore().byId("idInputRMRefMatnr");
                    RefMatnr = InputRefMatnr.getValue()

                    if (!RefMatnr) {
                        MessageBox.error(
                            "Please Input Reference Material", {
                            styleClass: bCompact ? "sapUiSizeCompact" : ""
                        }
                        );
                        return;
                    }

                    InputRMRefVersion = sap.ui.getCore().byId("idInputRMRefVersion");
                    RefVersn = InputRMRefVersion.getValue()

                    if (!RefVersn) {
                        MessageBox.error(
                            "Please Input Reference Version", {
                            styleClass: bCompact ? "sapUiSizeCompact" : ""
                        }
                        );
                        return;
                    }
                }

                this.RMRefMaterialDialog.close();
                this.RMRefMaterialDialog.destroy();
                this.RMRefMaterialDialog = null;

                var oJsonCentralModel = this.getView().getModel("jsonCentralModel");
                var Matnr = oJsonCentralModel.getProperty("/Home/SelectedMaterialCode");
                var Maktx = oJsonCentralModel.getProperty("/Home/SelectedMaterialText");
                var oRouter = this.getOwnerComponent().getRouter();

                if (selectedIndex == 1) {
                    oRouter.navTo("RouteRMCreate", {
                        Matnr: Matnr,
                        RefMatnr: RefMatnr,
                        RefVersn: RefVersn
                    });

                } else {
                    oRouter.navTo("RouteRMCreate", {
                        Matnr: Matnr,
                        RefMatnr: '',
                        RefVersn: '',
                    });
                }
            },
            onCancelRMRefMaterialDialog: function () {
                this.RMRefMaterialDialog.close();
                this.RMRefMaterialDialog.destroy();
                this.RMRefMaterialDialog = null;
            },
            onChangeRadioBtn: function (oEvent) {
                const selectedIndex = oEvent.mParameters.selectedIndex;
                const InputRMRefMatnr = sap.ui.getCore().byId("idInputRMRefMatnr");
                const InputRMRefVersion = sap.ui.getCore().byId("idInputRMRefVersion");
                if (selectedIndex == 1) {
                    InputRMRefMatnr.setEditable(true);
                } else {
                    InputRMRefMatnr.setEditable(false);
                    InputRMRefMatnr.setValue('');
                    InputRMRefVersion.setValue('');
                }
            },
            onRMRefMatnrValueHelpReq: function () {
                let that = this;

                if (!that.RMRefMaterialTableDialog) {
                    that.RMRefMaterialTableDialog = sap.ui.xmlfragment("com.emami.spc.view.fragments.RMRefMaterialTableDialog", that);
                    that.getView().addDependent(that.RMRefMaterialTableDialog);
                }
                that.RMRefMaterialTableDialog.open();
            }


        });
    });
