sap.ui.define([
	"com/arteriatech/ss/soinvcreate/cp/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"com/arteriatech/ppc/utils/js/Common",
	"com/arteriatech/ss/utils/js/Common",
	"com/arteriatech/ss/utils/js/CommonValueHelp",
	"com/arteriatech/ss/utils/js/UserMapping",
	"sap/m/BusyDialog"
], function (BaseController, JSONModel, History, oPPCCommon, oSSCommon, oSSCommonValueHelp, oSSUserMapping, BusyDialog) {
	"use strict";
	var aCustomerData = [];
	var oi18n = "",
		oUtilsI18n = "";
	var Device = sap.ui.Device;
	var spGuid = [];
	var cpGuid = [];
	var sssoGuid = [];
	return sap.ui.controller("com.arteriatech.ss.soinvcreate.cp.zsssoinvcreate0cp.controller.ListCustom", {
		//    onInit: function () {
		//        this.onInitialHookUps();
		//    },
		//    onInitialHookUps: function () {
		//        gListView = this.getView();
		//        oPPCCommon.initMsgMangerObjects();
		//        this._oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(gListView));
		//        oi18n = this._oComponent.getModel("i18n").getResourceBundle();
		//        oUtilsI18n = this._oComponent.getModel("ppcutili18n").getResourceBundle();
		//        this._oRouter = this.getRouter();
		//        this._oRouter.attachRouteMatched(this.onRouteMatched, this);
		//        this.setValuehelpPropety();
		//        if (this.onInitialHookUps_Exit) {
		//            this.onInitialHookUps_Exit();
		//        }
		//    },
		//    setMatModel: function () {
		//        var oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(gListView));
		//        var sCustomer = this.getSelectedCustomerCode();
		//        var sCPTypeID = this.getSelectedCustomerType(sCustomer);
		//        var aMatF4Filter = new Array();
		//        aMatF4Filter = oPPCCommon.setODataModelReadFilter("", "", aMatF4Filter, "LoginID", "", [oSSCommon.getCurrentLoggedUser({
		//                sServiceName: "CPStockItems",
		//                sRequestType: "read"
		//            })], false, false, false);
		//        aMatF4Filter = oSSCommonValueHelp.setODataModelReadFilter(gListView, "", aMatF4Filter, "CPGUID", "", [this.getView().getModel("LocalViewSetting").getProperty("/gCPGUID")], false, false, false);
		//        aMatF4Filter = oSSCommonValueHelp.setODataModelReadFilter(gListView, "", aMatF4Filter, "CPTypeID", "", [this.getView().getModel("LocalViewSetting").getProperty("/gCPTypeID")], false, false, false);
		//        aMatF4Filter = oSSCommonValueHelp.setODataModelReadFilter(gListView, "", aMatF4Filter, "StockOwner", "", [this.getView().getModel("LocalViewSetting").getProperty("/gCPTypeID")], false, false, false);
		//        var SSGW_MMModel = oComponent.getModel("SSGW_MM");
		//        SSGW_MMModel.attachRequestSent(function () {
		//        });
		//        SSGW_MMModel.attachRequestCompleted(function () {
		//        });
		//        SSGW_MMModel.read("/CPStockItems", {
		//            filters: aMatF4Filter,
		//            urlParameters: { "$select": "MaterialNo,MaterialDesc,UOM,CPStockItemGUID,UnrestrictedQty" },
		//            success: function (oData) {
		//                var MatModel = new sap.ui.model.json.JSONModel();
		//                MatModel.setData(oData.results);
		//                oComponent.setModel(MatModel, "MaterialSuggestorModel");
		//            },
		//            error: function (error) {
		//            }
		//        });
		//    },
		//    handleMaterialSuggest: function (oEvent) {
		//        oPPCCommon.handleSuggest({
		//            oEvent: oEvent,
		//            aProperties: [
		//                "MaterialNo",
		//                "MaterialDesc"
		//            ],
		//            sBinding: "suggestionItems"
		//        });
		//    },
		//    suggestionItemSelectedMat: function (oEvent) {
		//        oPPCCommon.suggestionItemSelected({
		//            oEvent: oEvent,
		//            thisController: this,
		//            sModelName: "MaterialSuggestorModel",
		//            sKey: "MaterialNo",
		//            sDescription: "MaterialDesc"
		//        }, function (key, desc) {
		//        });
		//        this.getView().byId("inputMaterial").setValueState("None");
		//        this.getView().byId("inputMaterial").setValueStateText("");
		//    },
		//    onChangeMaterial: function (oEvent) {
		//        var that = this;
		//        oPPCCommon.suggestionOnChange({
		//            oEvent: oEvent,
		//            thisController: this,
		//            sModelName: "MaterialSuggestorModel",
		//            sKey: "MaterialNo",
		//            sDescription: "MaterialDesc"
		//        }, function (enteredVal, bFound, key, desc) {
		//            if (enteredVal !== "") {
		//                if (!bFound) {
		//                    var msg = oi18n.getText("List.Filterbar.MultiInput.matNoError", [that.getView().byId("Material").getLabel()]);
		//                    oPPCCommon.displayMsg_MsgBox(that.getView(), msg, "error");
		//                }
		//            }
		//        });
		//    },
		getDateDDValues: function () {
			var sDateRange = oSSCommon.getProductFeatureValue({
				Types: "DTRNGCHK"
			});
			this.SODateDifference = "0";
			this.PreviousSelectedKeySODate = this.SODateDifference;
			var oneMonthBackDate = oPPCCommon.getCurrentDate();
			oneMonthBackDate.setDate(oneMonthBackDate.getDate() + parseInt(this.SODateDifference));
			this.SODate = {
				FromDate: oneMonthBackDate,
				ToDate: oPPCCommon.getCurrentDate()
			};
			if (this.getView().getModel("SODateViewSetting")) {
				this.getModel("SODateViewSetting").setProperty("/", {});
			}
			var oDataDate = [{
				DateKey: "",
				DateDesc: "Any"
			}, {
				DateKey: "0",
				DateDesc: "Today"
			}, {
				DateKey: "-1",
				DateDesc: "Today and Yesterday"
			}, {
				DateKey: "-7",
				DateDesc: "Last Seven Days"
			}, {
				DateKey: "-30",
				DateDesc: "Last One Month"
			}, {
				DateKey: "MS",
				DateDesc: "Manual Selection"
			}];
			oPPCCommon.getDateDropDownValue(oDataDate, this, "inputSODate", "SODateViewSetting", this.SODateDifference);
		},
		//    onRouteMatched: function (oEvent) {
		//        if (oEvent.getParameter("name") !== "solist" && oEvent.getParameter("name") !== "searchsolist" && oEvent.getParameter("name") !== "solistapp") {
		//            return;
		//        }
		//        var that = this;
		//        var selectedCustomer = "";
		//        var oDataModel = this._oComponent.getModel("PUGW");
		//        gListView.setBusy(true);
		//        var oHistory = sap.ui.core.routing.History.getInstance();
		//        if (oHistory.getDirection() !== "Backwards") {
		//            this.onReset();
		//            this.setDefaultSettings();
		//            this.getDateDDValues();
		//            if (oEvent.getParameter("name") === "searchsolist") {
		//                this.contextPath = oEvent.getParameter("arguments").contextPath;
		//                oSSCommon.setODataModel(oDataModel);
		//                oSSCommon.getCustomerInputType(function (customerInputType) {
		//                    that.sCustomerInpuType = customerInputType;
		//                    that.getParametersFromContext(that.contextPath);
		//                });
		//            } else {
		//                oSSCommon.setODataModel(oDataModel);
		//                oSSCommon.getCustomerInputType(function (customerInputType) {
		//                    that.sCustomerInpuType = customerInputType;
		//                    that.getCustomers(selectedCustomer, function () {
		//                        gListView.setBusy(false);
		//                        that.getView().byId("SOItemsFilterBar").setBusy(false);
		//                    });
		//                });
		//            }
		//        } else if (oEvent.getParameter("name") === "solist" || oEvent.getParameter("name") === "solistapp") {
		//            this.onReset();
		//            this.getCustomers(selectedCustomer);
		//            this.setListType(oEvent.getParameter("config")["pattern"].split("/")[0]);
		//            this.setDefaultSettings();
		//            this.getDateDDValues();
		//            selectedCustomer = "";
		//            oSSCommon.setODataModel(oDataModel);
		//            oSSCommon.getCustomerInputType(function (customerInputType) {
		//                that.sCustomerInpuType = customerInputType;
		//                that.getCustomers(selectedCustomer, function () {
		//                    that.getView().byId("SOItemsFilterBar").setBusy(false);
		//                    gListView.setBusy(false);
		//                });
		//            });
		//        } else {
		//            this.getView().byId("SOItemsFilterBar").setBusy(false);
		//            if (that.getView().getModel("LocalViewSettingDtl") && that.getView().getModel("LocalViewSettingDtl").setProperty("/UpdateList")) {
		//                this.getView().byId("SOItemsFilterBar").setBusy(true);
		//                this.contextPath = oEvent.getParameter("arguments").contextPath;
		//                var customer = oPPCCommon.getPropertyValueFromContextPath(that.contextPath, "CustomerNo");
		//                oSSCommon.setODataModel(oDataModel);
		//                oSSCommon.getCustomerInputType(function (customerInputType) {
		//                    that.sCustomerInpuType = customerInputType;
		//                    that.getParametersFromContext(that.contextPath);
		//                    that.getView().byId("SOItemsFilterBar").setBusy(false);
		//                    gListView.setBusy(false);
		//                });
		//            }
		//        }
		//    },
		//    onSODateSelectionChanged: function (oEvent) {
		//        var that = this;
		//        var oDateSelect = oEvent.getSource();
		//        var sSelectedKey = oEvent.getParameter("selectedItem").getKey();
		//        oPPCCommon.openManualDateSelectionDialog(this, sSelectedKey, oDateSelect, this.PreviousSelectedKeySODate, "SODateViewSetting", oi18n, "inputSODate", function (date) {
		//            that.SODate.FromDate = date.fromDate;
		//            that.SODate.ToDate = date.toDate;
		//        });
		//        this.PreviousSelectedKeySODate = oEvent.getParameter("selectedItem").getKey();
		//        if (oEvent.getParameter("selectedItem").getKey() !== "MS") {
		//            this.PreviousSelectedKeySODate = oEvent.getParameter("selectedItem").getKey();
		//        }
		//    },
		getParametersFromContext: function (contextPath) {
			var that = this;
			this.iTotalValueHelps = 8;
			var customer = oPPCCommon.getPropertyValueFromContextPath(that.contextPath, "CustomerNo");
			var sONo = oPPCCommon.getPropertyValueFromContextPath(that.contextPath, "OrderNo");
			var orderType = oPPCCommon.getPropertyValueFromContextPath(that.contextPath, "OrderType");
			var sSPNo = oPPCCommon.getPropertyValueFromContextPath(that.contextPath, "SPNo");
			var material = oPPCCommon.getPropertyValueFromContextPath(that.contextPath, "Material");
			var sOrderMaterialGrp = oPPCCommon.getPropertyValueFromContextPath(that.contextPath, "OrderMatGrp");
			var sCPNo = oPPCCommon.getPropertyValueFromContextPath(that.contextPath, "CPNo");
			var dSODate = oPPCCommon.getPropertyValueFromContextPath(that.contextPath, "OrderDate");
			var sStatus = oPPCCommon.getPropertyValueFromContextPath(that.contextPath, "Status");
			var sApprovalStatus = oPPCCommon.getPropertyValueFromContextPath(that.contextPath, "ApprovalStatus");
			var sRouteGUID = oPPCCommon.getPropertyValueFromContextPath(that.contextPath, "Description");
			var sChannelID = oPPCCommon.getPropertyValueFromContextPath(that.contextPath, "ChannelID");
			if (orderType) {
				this.getView().byId("inputOrderType").setSelectedKeys(orderType.split(";"));
			}
			if (sStatus) {
				this.getView().byId("inputStatus").setSelectedKeys(sStatus.split(";"));
			}
			if (sApprovalStatus) {
				this.getView().byId("inputApprovalStatus").setSelectedKeys(sApprovalStatus.split(";"));
			}
			if (this.sCustomerInpuType === "VH") {
				this.iTotalValueHelps++;
				if (customer !== "") {
					var sCustomerFilters = new Array();
					sCustomerFilters = oPPCCommon.setODataModelReadFilter(this.getView(), "inputCustomerNo", sCustomerFilters, "CustomerNo", sap.ui.model
						.FilterOperator.EQ, customer.split(";"), true, false, false);
					var oModelData = this._oComponent.getModel("SFGW_MST");
					oSSCommon.createTokens(oModelData, "Customers", sCustomerFilters, "CustomerNo", "Name", this.getView().byId("inputCustomerNo"),
						function () {
							that.callService();
						});
				} else {
					that.callService();
				}
			} else {
				that.getCustomers(customer, "", true);
			}
			if (material !== "") {
				var sMaterialFilters = [];
				sMaterialFilters = oPPCCommon.setODataModelReadFilter(this.getView(), "inputMaterial", sMaterialFilters, "MaterialNo", sap.ui.model
					.FilterOperator.EQ, material.split(";"), true, false, false);
				sMaterialFilters = oPPCCommon.setODataModelReadFilter(this.getView(), "", sMaterialFilters, "StockOwner", sap.ui.model.FilterOperator
					.EQ, ["01"], "", false, false, false);
				sMaterialFilters = oPPCCommon.setODataModelReadFilter(this.getView(), "customer", sMaterialFilters, "CPGUID", sap.ui.model.FilterOperator
					.EQ, [this.getView().byId("customer").getSelectedKey()], false, false, false);
				var oModelData = this._oComponent.getModel("SSGW_MM");
				oSSCommon.createTokens(oModelData, "CPStockItems", sMaterialFilters, "MaterialNo", "MaterialDesc", this.getView().byId(
					"inputMaterial"), function () {
					that.callService();
				});
			} else {
				that.callService();
			}
			if (sOrderMaterialGrp !== "") {
				var sOrderMaterialGrpFilters = [];
				sOrderMaterialGrpFilters = oPPCCommon.setODataModelReadFilter(this.getView(), "inputOrderMaterial", sOrderMaterialGrpFilters,
					"OrderMaterialGroupID", sap.ui.model.FilterOperator.EQ, sOrderMaterialGrp.split(";"), true, false, false);
				var oModelData = this._oComponent.getModel("SFGW_MST");
				oSSCommon.createTokens(oModelData, "OrderMaterialGroups", sOrderMaterialGrpFilters, "OrderMaterialGroupID",
					"OrderMaterialGroupDesc", this.getView().byId("inputOrderMaterial"),
					function () {
						that.callService();
					});
			} else {
				that.callService();
			}
			if (sONo !== "") {
				var sSONoFilters = [];
				sSONoFilters = oPPCCommon.setODataModelReadFilter(this.getView(), "inputOrderNo", sSONoFilters, "SSSOGuid", sap.ui.model.FilterOperator
					.EQ, sONo.split(";"), true, false, false);
				var oModelData = this._oComponent.getModel("SSGW_SLS");
				oSSCommon.createTokens(oModelData, "SSSOs", sSONoFilters, "SSSOGuid", "OrderNo", this.getView().byId("inputOrderNo"), function (
					oTokens) {
					if (oTokens.length > 0) {
						that.SOTokenInput.removeAllTokens();
						for (var i = 0; i < oTokens.length; i++) {
							var oToken = new sap.m.Token({
								key: oTokens[i].SSSOGuid,
								text: oTokens[i].OrderNo + " (" + oTokens[i].OrderNo + ")"
							});
							sssoGuid.splice(i, sssoGuid.length);
							sssoGuid.push(oTokens[i].SPGUID);
							that.SOTokenInput.addToken(oToken);
						}
						that.callService();
					}
					that.callService();
				}, "SSSOGuid");
			} else {
				that.callService();
			}
			if (sCPNo !== "") {
				var sCPNoFilters = new Array();
				sCPNoFilters = oPPCCommon.setODataModelReadFilter(this.getView(), "multiInputCPNo", sCPNoFilters, "CPGUID", sap.ui.model.FilterOperator
					.EQ, sCPNo.split(";"), true, false, false);
				var oCPNoModelData = this._oComponent.getModel("SSGW_MST");
				oSSCommon.createTokens(oCPNoModelData, "ChannelPartners", sCPNoFilters, "CPGUID", "Name", this.getView().byId("multiInputCPNo"),
					function (oTokens) {
						if (oTokens.length > 0) {
							that.CPTokenInput.removeAllTokens();
							for (var i = 0; i < oTokens.length; i++) {
								var oToken = new sap.m.Token({
									key: oTokens[i].CPGUID,
									text: oTokens[i].Name + " (" + oTokens[i].CPNo + ")"
								});
								cpGuid.splice(i, cpGuid.length);
								cpGuid.push(oTokens[i].CPGUID);
								that.CPTokenInput.addToken(oToken);
							}
							that.callService();
						}
						that.callService();
					}, "PD", "CPGUID");
			} else {
				that.callService();
			}
			if (sSPNo !== "") {
				var sSPNoFilters = new Array();
				sSPNoFilters = oPPCCommon.setODataModelReadFilter(this.getView(), "multiInputSPNo", sSPNoFilters, "SPGUID", sap.ui.model.FilterOperator
					.EQ, sSPNo.split(";"), true, false, false);
				var oSPNoModelData = this._oComponent.getModel("SSGW_MST");
				oSSCommon.createTokens(oSPNoModelData, "SalesPersons", sSPNoFilters, "SPGUID", "SPNo", this.getView().byId("multiInputSPNo"),
					function (oTokens) {
						if (oTokens.length > 0) {
							that.SPTokenInput.removeAllTokens();
							for (var i = 0; i < oTokens.length; i++) {
								var oToken = new sap.m.Token({
									key: oTokens[i].SPGUID,
									text: oTokens[i].FirstName + " (" + oTokens[i].SPNo + ")"
								});
								spGuid.splice(i, spGuid.length);
								spGuid.push(oTokens[i].SPGUID);
								that.SPTokenInput.addToken(oToken);
							}
							that.callService();
						}
						that.callService();
					}, "PD", "SPGUID");
			} else {
				that.callService();
			}
			if (sRouteGUID !== "") {
				var RouteFilters = new Array();
				RouteFilters = oPPCCommon.setODataModelReadFilter(this.getView(), "FDescription", RouteFilters, "RouteSchGUID", sap.ui.model.FilterOperator
					.EQ, sRouteGUID.split(";"), true, false, false);
				var oDescriptionModelData = this._oComponent.getModel("SFGW_SP");
				oSSCommon.createTokens(oDescriptionModelData, "RouteSchedules", RouteFilters, "RouteSchGUID", "RoutId", this.getView().byId(
					"FDescription"), function (aData) {
					var aTokens = [];
					for (var i = 0; i < aData.length; i++) {
						var oRouteToken = new sap.m.Token({
							key: aData[i].RouteSchGUID,
							text: aData[i].Description + "(" + aData[i].RoutId + ")"
						});
						aTokens.push(oRouteToken);
					}
					that.getView().byId("FDescription").setTokens(aTokens);
					that.callService();
				}, "PD", "RouteSchGUID");
			} else {
				that.callService();
			}
			that.getView().byId("inputSODate").setSelectedKey(dSODate);
			if (dSODate !== "") {
				var SODateFrom = oPPCCommon.getPropertyValueFromContextPath(that.contextPath, "SOFromDate");
				var SODateTo = oPPCCommon.getPropertyValueFromContextPath(that.contextPath, "SOToDate");
				this.SODate = {
					FromDate: new Date(SODateFrom),
					ToDate: new Date(SODateTo)
				};
				that.callService();
				if (dSODate === "SD") {
					oSSCommon.setMaunalSelectedDate(this, SODateFrom, SODateTo, "SODateViewSetting", "inputSODate", dSODate, oi18n);
				}
			} else {
				this.SODate = {
					FromDate: null,
					ToDate: null
				};
				that.callService();
			}
		},
		setDefaultSettings: function () {
			var oViewSettingModel = new sap.ui.model.json.JSONModel();
			this.viewSettingData = {
				CustomerDD: false,
				CustomerVH: false,
				SOItemsCount: 0,
				DateFormat: oSSCommon.getDateFormat(),
				messageLength: 0,
				footerBtnVisible: false,
				StockChecksCount: 0,
				CashDiscPerc: 0,
				CashDiscPercVisible: false,
				CashDiscValueState: "None",
				CashDiscValueStateText: "",
				createInvoiceButton: true
			};
			oViewSettingModel.setData(this.viewSettingData);
			this.getView().setModel(oViewSettingModel, "LocalViewSetting");
			this.setSOTableTitle(0);
			this.setCustomerInputVisibility();
		},
		//    setDefaultSettings: function () {
		//        var oViewSettingModel = new sap.ui.model.json.JSONModel();
		//        this.viewSettingData = {
		//            CustomerDD: false,
		//            CustomerVH: false,
		//            SOItemsCount: 0,
		//            DateFormat: oSSCommon.getDateFormat(),
		//            messageLength: 0,
		//            footerBtnVisible: false,
		//            StockChecksCount: 0,
		//            CashDiscPerc: 0,
		//            CashDiscPercVisible: false,
		//            CashDiscValueState: "None",
		//            CashDiscValueStateText: ""
		//        };
		//        oViewSettingModel.setData(this.viewSettingData);
		//        this.getView().setModel(oViewSettingModel, "LocalViewSetting");
		//        this.setSOTableTitle(0);
		//        this.setCustomerInputVisibility();
		//    },
		//    setCustomerInputVisibility: function () {
		//        if (this.sCustomerInpuType === "DD") {
		//            this.getView().getModel("LocalViewSetting").setProperty("/CustomerDD", true);
		//        } else if (this.sCustomerInpuType === "VH") {
		//            this.getView().getModel("LocalViewSetting").setProperty("/CustomerVH", true);
		//        }
		//    },
		//    callService: function () {
		//        this.iTotalValueHelps--;
		//        if (this.iTotalValueHelps === 0) {
		//            this.getView().byId("SOItemsFilterBar").setBusy(false);
		//            this.getSalesOrders();
		//        }
		//    },
		onSearch: function (oEvent) {
			var oView = this.getView();
			this.validateSOItemsMandatory();
			if (oPPCCommon.doErrMessageExist()) {
				gListView.setBusy(true);
				var contextPath = this.prepareContext();
				if (this.contextPath !== undefined && this.contextPath === contextPath) {
					this.getSalesOrders();
				} else {
					this._oRouter.navTo("searchsolist", {
						contextPath: contextPath
					}, false);
				}
			} else {
				var message = oPPCCommon.getMsgsFromMsgMgr();
				oPPCCommon.displayMsg_MsgBox(this.getView(), message, "error");
			}
		},
		//    validateSOItemsMandatory: function (messageArea) {
		//        oPPCCommon.removeAllMsgs();
		//        if (this.getView().byId("inputSODate").getSelectedKey() === "" && this.getView().byId("inputOrderNo").getTokens().length === 0) {
		//            this.byId("inputOrderNo").setValueState(sap.ui.core.ValueState.Error);
		//            var msg = oi18n.getText("List.FilterBar.Validation.dateOrderNumber", [
		//                this.getView().byId("OrderNo").getLabel(),
		//                this.getView().byId("fiOrderDate").getLabel()
		//            ]);
		//            this.byId("inputOrderNo").setValueStateText(msg);
		//            var msgObj = oPPCCommon.addMsg_MsgMgr(msg, "error", "FG_SONumberAndSODate");
		//        } else {
		//            if (this.byId("inputOrderNo").getValue() === "") {
		//                this.byId("inputOrderNo").setValueState(sap.ui.core.ValueState.None);
		//            }
		//        }
		//    },
		//    tokenChangeOrderNo: function (oEvent) {
		//        var that = this;
		//        if (oEvent.getParameters().type === "removed") {
		//            if (that.getView().byId("inputOrderNo").getTokens().length === 0) {
		//                var oneMonthBackDate = oPPCCommon.getCurrentDate();
		//                oneMonthBackDate.setDate(oneMonthBackDate.getDate() - 30);
		//                that.SODate = {
		//                    FromDate: oneMonthBackDate,
		//                    ToDate: oPPCCommon.getCurrentDate()
		//                };
		//                that.getView().byId("inputSODate").setSelectedKey("-30");
		//                this.SSSOGuid = "";
		//            }
		//        }
		//    },
		//    prepareContext: function () {
		//        var customerNo = this.getSelectedCustomerCode();
		//        var sSPNo = oPPCCommon.getKeysFromTokens(this.getView(), "multiInputSPNo");
		//        var sOrderNo = oPPCCommon.getKeysFromTokens(this.getView(), "inputOrderNo");
		//        var sOrderType = oPPCCommon.getKeysFromMultiCombo(this.getView(), "inputOrderType");
		//        var sCPNo = oPPCCommon.getKeysFromTokens(this.getView(), "multiInputCPNo");
		//        var aMaterial = oPPCCommon.getKeysFromTokens(this.getView(), "inputMaterial");
		//        var orderMaterialGrp = oPPCCommon.getKeysFromTokens(this.getView(), "inputOrderMaterial");
		//        var orderDate = this.getView().byId("inputSODate").getSelectedKey();
		//        var sStatus = oPPCCommon.getKeysFromMultiCombo(this.getView(), "inputStatus");
		//        var sApprovalStatus = oPPCCommon.getKeysFromMultiCombo(this.getView(), "inputApprovalStatus");
		//        var sRoute = oPPCCommon.getKeysFromTokens(this.getView(), "FDescription");
		//        var contextPath = "(CustomerNo=" + customerNo + ",SPNo=" + sSPNo + ",OrderNo=" + sOrderNo + ",OrderType=" + sOrderType + ",CPNo=" + sCPNo + ",Material=" + aMaterial + ",Description=" + sRoute + ",OrderMatGrp=" + orderMaterialGrp + ",OrderDate=" + orderDate + ",SOFromDate=" + this.SODate.FromDate + ",SOToDate=" + this.SODate.ToDate + ",Status=" + sStatus + ",ApprovalStatus=" + sApprovalStatus + ")";
		//        if (this.prepareContext_Exit) {
		//            contextPath = this.prepareContext_Exit(contextPath);
		//        }
		//        return contextPath;
		//    },
		//    getCurrentUsers: function (sServiceName, sRequestType, callBack) {
		//        if (callBack) {
		//            oSSCommon.getCurrentLoggedUser({
		//                sServiceName: sServiceName,
		//                sRequestType: sRequestType
		//            }, function (LoginID) {
		//                callBack(LoginID);
		//            });
		//        } else {
		//            var sLoginID = oSSCommon.getCurrentLoggedUser({
		//                sServiceName: sServiceName,
		//                sRequestType: sRequestType
		//            });
		//            return sLoginID;
		//        }
		//    },
		//    getSalesOrders: function () {
		//        var oView = this.getView();
		//        var that = this;
		//        var SOItemsListModel = this._oComponent.getModel("SSGW_SLS");
		//        this.getCurrentUsers("SSSOs", "read", function (LoginID) {
		//            SOItemsListModel.attachRequestSent(function () {
		//                oPPCCommon.setTableBusy(oView, ["UISOTable"], true);
		//            });
		//            SOItemsListModel.attachRequestCompleted(function () {
		//                oPPCCommon.setTableBusy(oView, ["UISOTable"], false);
		//            });
		//            SOItemsListModel.read("/SSSOs", {
		//                filters: that.prepareSOItemsODataFilter(),
		//                success: function (oData) {
		//                    oData = oPPCCommon.formatItemsOData({ oData: oData });
		//                    if (oData.length > 0) {
		//                        if (oData.length > 0) {
		//                            for (var i = 0; i < oData.length; i++) {
		//                                oData[i].OrderNo = parseFloat(oData[i].OrderNo);
		//                            }
		//                            that.getView().getModel("LocalViewSetting").setProperty("/footerBtnVisible", true);
		//                            that.setSOItemsData(oData);
		//                            that.applyUITableGrouping(1);
		//                            if (that.sCustomerInpuType === "DD") {
		//                                that.applyTableGrouping("CustomerNo", "CustomerName", "Customer");
		//                            } else if (that.sCustomerInpuType === "VH") {
		//                                if (that.getView().byId("inputCustomerNo").getTokens().length === 0) {
		//                                    that.applyTableGrouping("CustomerNo", "CustomerName", "Customer");
		//                                }
		//                            }
		//                        }
		//                    } else {
		//                        that.setNodataFound();
		//                    }
		//                    gListView.setBusy(false);
		//                },
		//                error: function (error) {
		//                    that.setNodataFound();
		//                    oPPCCommon.dialogErrorMessage(error, oUtilsI18n.getText("common.Dialog.Error.ServiceError.Header"));
		//                    gListView.setBusy(false);
		//                }
		//            });
		//        });
		//        if (this.getSalesOrders_Exit) {
		//            this.getSalesOrders_Exit();
		//        }
		//    },
		//    applyUITableGrouping: function (iPosition) {
		//        var oColumn = this.getView().byId("UISOTable").getColumns()[1];
		//        var sOrder = "Descending";
		//        this.getView().byId("UISOTable").sort(oColumn, sOrder, false);
		//        if (this.applyUITableGrouping_Exit) {
		//            this.applyUITableGrouping_Exit(iPosition);
		//        }
		//    },
		prepareSOItemsODataFilter: function () {
			var that = this;

			var SPGUID = oPPCCommon.getPropertyValueFromContextPath(that.contextPath, "SPNo");
			var CPGUID = oPPCCommon.getKeysFromTokens(this.getView(), "multiInputCPNo");
			var sBeatGuid = oPPCCommon.getKeysFromTokens(this.getView(), "FDescription");
			var SOItemsFilters = new Array();
			var SSSO = oPPCCommon.getKeysFromTokens(this.getView(), "inputOrderNo");
			if (this.sCustomerInpuType === "DD") {
				SOItemsFilters = oPPCCommon.setODataModelReadFilter(this.getView(), "", SOItemsFilters, "FromCPGUID", sap.ui.model.FilterOperator.EQ, [
					this.getView().byId("customer").getSelectedKey()
				], false, false, false);
			} else if (this.sCustomerInpuType === "VH") {
				SOItemsFilters = oPPCCommon.setODataModelReadFilter(this.getView(), "inputCustomerNo", SOItemsFilters, "FromCPGUID", "", "", true,
					true, false);
			}
			SOItemsFilters = oPPCCommon.setODataModelReadFilter("", "", SOItemsFilters, "FromCPTypId", sap.ui.model.FilterOperator.EQ, [this.getSelectedCustomerType(
				this.getSelectedCustomerCode())], false, false, false);
			//Lakshmi 21-06-2021
			SOItemsFilters = oPPCCommon.setODataModelReadFilter("", "", SOItemsFilters, "CreatedBy2", sap.ui.model.FilterOperator.EQ, [
				this.getView().byId("inputBillForm").getSelectedKey()
			], false, false, false);

			// SOItemsFilters = oPPCCommon.setODataModelReadFilter(this.getView(), "multiInputSPNo", SOItemsFilters, "Status", sap.ui.model.FilterOperator.EQ, ["000001"], true, false, false);
			// SOItemsFilters = oPPCCommon.setODataModelReadFilter(this.getView(), "multiInputSPNo", SOItemsFilters, "Status", sap.ui.model.FilterOperator.EQ, ["000002"], true, false, false);
			//      SOItemsFilters = oPPCCommon.setODataModelReadFilter(this.getView(), "inputStatus", SOItemsFilters, "Status", sap.ui.model.FilterOperator
			// .EQ, this.getView().byId("inputStatus").getSelectedKeys(), true, false, false);

			if (this.getView().byId("inputStatus").getSelectedKeys().length > 0) {
				SOItemsFilters = oPPCCommon.setODataModelReadFilter(this.getView(), "inputStatus", SOItemsFilters, "Status", sap.ui.model.FilterOperator
					.EQ, this.getView().byId("inputStatus").getSelectedKeys(), true, false, false);
			} else {
				SOItemsFilters = oPPCCommon.setODataModelReadFilter(this.getView(), "inputStatus", SOItemsFilters, "Status", sap.ui.model.FilterOperator
					.NE, ["000003"], true, false, false);
			}

			SOItemsFilters = oPPCCommon.setODataModelReadFilter(this.getView(), "multiInputSPNo", SOItemsFilters, "SPGUID", sap.ui.model.FilterOperator
				.EQ, SPGUID.toUpperCase().split(";"), true, false, false);
			SOItemsFilters = oPPCCommon.setODataModelReadFilter(this.getView(), "multiInputCPNo", SOItemsFilters, "SoldToCPGUID", sap.ui.model.FilterOperator
				.EQ, CPGUID.split(";"), true, false, false);
			SOItemsFilters = oPPCCommon.setODataModelReadFilter(this.getView(), "FDescription", SOItemsFilters, "BeatGuid", sap.ui.model.FilterOperator
				.EQ, sBeatGuid.split(";"), true, false, false);
			SOItemsFilters = oPPCCommon.setODataModelReadFilter(this.getView(), "", SOItemsFilters, "SSSOGuid", sap.ui.model.FilterOperator.EQ,
				SSSO.split(";"), true, false, false);
			SOItemsFilters = oPPCCommon.setODataModelReadFilter(this.getView(), "inputOrderType", SOItemsFilters, "OrderType", sap.ui.model.FilterOperator
				.EQ, this.getView().byId("inputOrderType").getSelectedKeys(), true, false, false);
			SOItemsFilters = oPPCCommon.setODataModelReadFilter(this.getView(), "", SOItemsFilters, "OrderDate", sap.ui.model.FilterOperator.BT, [
				this.SODate.FromDate,
				this.SODate.ToDate
			], false, false, false);
			gFromDate = this.SODate.FromDate;
			gToDate = this.SODate.ToDate;
			SOItemsFilters = oPPCCommon.setODataModelReadFilter(this.getView(), "inputMaterial", SOItemsFilters, "MaterialNo", "", "", true,
				true, false);
			SOItemsFilters = oPPCCommon.setODataModelReadFilter(this.getView(), "", SOItemsFilters, "LoginID", sap.ui.model.FilterOperator.EQ, [
				this.getCurrentUsers("SSSOs", "read")
			], false, false, false);
			if (this.prepareSOItemsODataFilter_Exit) {
				SOItemsFilters = this.prepareSOItemsODataFilter_Exit(SOItemsFilters);
			}
			return SOItemsFilters;
		},
		//    setSOItemsData: function (oData) {
		//        oData = oPPCCommon.formatItemsOData({ oData: oData });
		//        var that = this;
		//        var oView = this.getView();
		//        for (var i = 0; i < oData.length; i++) {
		//            oData[i].GrossAmt = parseFloat(oData[i].GrossAmt);
		//            oData[i].TAX = parseFloat(oData[i].TAX);
		//            oData[i].NetPrice = parseFloat(oData[i].NetPrice);
		//            oData[i].Selected = false;
		//        }
		//        var oSOItemsModel = new sap.ui.model.json.JSONModel();
		//        oSOItemsModel.setData(oData);
		//        oSOItemsModel.setSizeLimit(oData.length);
		//        oView.setModel(oSOItemsModel, "SOItems");
		//        if (this.getListType() === "SOList") {
		//            if (oData.length > 0) {
		//                that.setSOTableTitle(oData.length);
		//            }
		//        } else {
		//            if (oData.length <= 0) {
		//                oView.byId("SOTable").setNoDataText(oUtilsI18n.getText("common.NoResultsFound"));
		//            }
		//            that.setSOTableTitle(oData.length);
		//        }
		//    },
		selectAll: function (oEvent) {
			var src = oEvent.getSource();
			if (this.getView().getModel("SOItems")) {
				var oItems = this.getView().getModel("SOItems").getProperty("/");
				var count = 0;
				for (var i = 0; i < oItems.length; i++) {
					if (src.getSelected()) {
						count++;
						oItems[i].Selected = true;
						if (!this.getView().getModel("LocalViewSetting").getProperty("/CashDiscPercVisible")) {
							this.getView().getModel("LocalViewSetting").setProperty("/CashDiscPercVisible", true);
						}
						if (count > 1) {
							this.getView().getModel("LocalViewSetting").setProperty("/createInvoiceButton", false);
						}
					} else {
						oItems[i].Selected = false;
						this.getView().getModel("LocalViewSetting").setProperty("/CashDiscPercVisible", false);
						this.getView().getModel("LocalViewSetting").setProperty("/createInvoiceButton", true);
					}
				}
				this.getView().getModel("SOItems").setProperty("/", oItems);
			}
		},
		//    onCahDiscChange: function (oEvent) {
		//        oPPCCommon.removeAllMsgs();
		//        var oValue = oEvent.getSource().getValue();
		//        this.validateCahDisc(oValue);
		//    },
		//    validateCahDisc: function (oValue) {
		//        var msg = "";
		//        var isValid = true;
		//        this.getView().getModel("LocalViewSetting").setProperty("/CashDiscValueState", "None");
		//        this.getView().getModel("LocalViewSetting").setProperty("/CashDiscValueStateText", "");
		//        if (parseFloat(oValue) === "" || parseFloat(oValue) === undefined || parseFloat(oValue) === null || isNaN(parseFloat(oValue)) === true) {
		//            msg = oi18n.getText("SOList.Message.CashDiscEmpty");
		//            oPPCCommon.addMsg_MsgMgr(msg, "error", "");
		//            this.getView().getModel("LocalViewSetting").setProperty("/CashDiscPerc", 0);
		//            this.getView().getModel("LocalViewSetting").setProperty("/CashDiscValueState", "Error");
		//            this.getView().getModel("LocalViewSetting").setProperty("/CashDiscValueStateText", msg);
		//            isValid = false;
		//        } else if (parseFloat(oValue) < 0) {
		//            msg = oi18n.getText("SOList.Message.CashDiscWithNegative");
		//            oPPCCommon.addMsg_MsgMgr(msg, "error", "");
		//            this.getView().getModel("LocalViewSetting").setProperty("/CashDiscValueState", "Error");
		//            this.getView().getModel("LocalViewSetting").setProperty("/CashDiscValueStateText", msg);
		//            isValid = false;
		//        } else if (parseFloat(oValue) > 100) {
		//            msg = oi18n.getText("SOList.Message.CashDiscWithMore");
		//            oPPCCommon.addMsg_MsgMgr(msg, "error", "");
		//            this.getView().getModel("LocalViewSetting").setProperty("/CashDiscValueState", "Error");
		//            this.getView().getModel("LocalViewSetting").setProperty("/CashDiscValueStateText", msg);
		//            isValid = false;
		//        }
		//        if (!isValid) {
		//            var message = oPPCCommon.getMsgsFromMsgMgr();
		//            oPPCCommon.displayMsg_MsgBox(this.getView(), message, "error");
		//        }
		//    },
		onSelect: function (oEvent) {
			this.getView().getModel("LocalViewSetting").setProperty("/CashDiscPercVisible", false);
			var path = oEvent.getSource().getBindingContext("SOItems").getPath();
			var idx = parseInt(path.substring(path.lastIndexOf("/") + 1));
			if (this.getView().getModel("SOItems")) {
				var count = 0;
				var oItems = this.getView().getModel("SOItems").getProperty("/");
				for (var i = 0; i < oItems.length; i++) {
					if (oItems[i].Selected) {
						count++;
						if (!this.getView().getModel("LocalViewSetting").getProperty("/CashDiscPercVisible")) {
							this.getView().getModel("LocalViewSetting").setProperty("/CashDiscPercVisible", true);
						}
					} else {
						this.getView().getModel("LocalViewSetting").setProperty("/CashDiscPercVisible", false);
					}
					if (count > 1) {
						// oItems[i].createInvoiceButton = false;
						this.getView().getModel("LocalViewSetting").setProperty("/createInvoiceButton", false);
					} else {
						this.getView().getModel("LocalViewSetting").setProperty("/createInvoiceButton", true);
						// oItems[i].createInvoiceButton = true;
					}
				}

			}
		},
		//    calculateAmt: function (Item) {
		//        var sQty = Item.Quantity;
		//        var unitPrice = Item.UnitPrice;
		//        var grossAmt = parseFloat(sQty) * parseFloat(unitPrice);
		//        var sTax = Item.TaxAmt;
		//        var sSecTrDiscPercentage = Item.SecTrDisc;
		//        var SecTrDiscAmt = parseFloat(grossAmt) * parseFloat(sSecTrDiscPercentage) / 100;
		//        var netAmt = grossAmt - SecTrDiscAmt + parseFloat(sTax);
		//        Item.GrossAmt = grossAmt;
		//        Item.NetAmt = netAmt;
		//        return Item;
		//    },
		//    setSOTableTitle: function (dataCount) {
		//        this.getView().getModel("LocalViewSetting").setProperty("/SOItemsCount", dataCount);
		//        if (dataCount > 0) {
		//            this.getView().byId("SOTableTitle").setText(oi18n.getText("List.Table.SO.header", [dataCount]));
		//            this.getView().byId("UISOTableTitle").setText(oi18n.getText("List.Table.SO.header", [dataCount]));
		//        } else {
		//            this.getView().byId("SOTableTitle").setText(oi18n.getText("List.Table.SO.tableHeader"));
		//            this.getView().byId("UISOTableTitle").setText(oi18n.getText("List.Table.SO.tableHeader"));
		//        }
		//    },
		//    setNodataFound: function () {
		//        var oView = this.getView();
		//        if (oView.getModel("SOItems") !== undefined) {
		//            oView.getModel("SOItems").setProperty("/", {});
		//        }
		//        oView.byId("SOTable").setNoDataText(oUtilsI18n.getText("common.NoResultsFound"));
		//        oView.byId("UISOTable").setNoData(oUtilsI18n.getText("common.NoResultsFound"));
		//        this.setSOTableTitle(0);
		//    },
		//    applyTableGrouping: function (sPropertyKey, sPropertyText, sPropertyLabel) {
		//        oPPCCommon.setGroupInTable(this.getView(), "SOTable", sPropertyKey, true, sPropertyLabel, sPropertyText);
		//    },
		//    getCustomers: function (customer, callBack, callService) {
		//        var that = this;
		//        that.setCustomerInputVisibility();
		//        if (this.sCustomerInpuType !== "VH") {
		//            var oCustomerModel = this._oComponent.getModel("SFGW_MST");
		//            oSSUserMapping.getCustomers(oCustomerModel, "000002", "2", BusyDialog, this.getView(), function (aCustomerData) {
		//                var oDDModel = new sap.ui.model.json.JSONModel();
		//                for (var i = 0; i < aCustomerData.length; i++) {
		//                    if (aCustomerData[i].CPTypeID === "02") {
		//                        aCustomerData[i].FormattedCustomerNo = aCustomerData[i].CPGUID;
		//                    } else {
		//                        aCustomerData[i].FormattedCustomerNo = aCustomerData[i].CustomerNo;
		//                    }
		//                }
		//                oDDModel.setData(aCustomerData);
		//                gListView.setModel(oDDModel, "Customers");
		//                that.getView().getModel("LocalViewSetting").setProperty("/gCPTypeID", aCustomerData[0].CPTypeID);
		//                that.getView().getModel("LocalViewSetting").setProperty("/gCPGUID", aCustomerData[0].CPGUID);
		//                that.getView().getModel("LocalViewSetting").setProperty("/gCPNo", aCustomerData[0].CustomerNo);
		//                that.getView().getModel("LocalViewSetting").setProperty("/gCPName", aCustomerData[0].Name);
		//                if (that.sCustomerInpuType === "DD") {
		//                    that.getView().byId("customer").setSelectedKey(customer);
		//                } else if (that.sCustomerInpuType === "MC") {
		//                    if (aCustomerData.length > 1) {
		//                        aCustomerData.splice(0, 1);
		//                    }
		//                    that.getView().byId("customerMultiCombo").setSelectedKeys(customer.split(";"));
		//                }
		//                that.getCustomerName();
		//                that.setCustomerColumnVisibility();
		//                that.setDropdowns(customer);
		//                if (callBack) {
		//                    callBack();
		//                }
		//                if (callService) {
		//                    that.callService();
		//                }
		//            });
		//        } else {
		//            if (callBack) {
		//                callBack();
		//            }
		//            if (callService) {
		//                that.callService();
		//            }
		//        }
		//    },
		//    getSelectedCustomerName: function () {
		//        this.getView().byId("customer").setTooltip(this.getCustomerName());
		//    },
		//    getCustomerName: function () {
		//        if (this.getView().byId("customer").getSelectedItem().getText().split("-").length > 1) {
		//            this.getView().getModel("LocalViewSetting").setProperty("/CustomerColumnVisibleInF4", false);
		//            return this.getView().byId("customer").getSelectedItem().getText().split("-")[1].trim();
		//        } else {
		//            this.getView().getModel("LocalViewSetting").setProperty("/CustomerColumnVisibleInF4", true);
		//            return this.getView().byId("customer").getSelectedItem().getText().split("-")[0].trim();
		//        }
		//    },
		//    setCustomerColumnVisibility: function () {
		//        if (this.getView().byId("customer").getSelectedItem().getText().split("-").length > 1) {
		//            this.getView().getModel("LocalViewSetting").setProperty("/CustomerColumnVisibleInResult", false);
		//        } else {
		//            this.getView().getModel("LocalViewSetting").setProperty("/CustomerColumnVisibleInResult", true);
		//        }
		//    },
		//    getSelectedCustomerCode: function () {
		//        var CustomerCode = "";
		//        var oView = gListView;
		//        if (oView.byId("customer").getVisible()) {
		//            CustomerCode = oView.byId("customer").getSelectedKey();
		//        } else if (oView.byId("inputCustomerF4").getVisible()) {
		//            CustomerCode = oPPCCommon.getKeysFromTokens(oView, "inputCustomerF4");
		//        }
		//        return CustomerCode;
		//    },
		//    getSelectedCustomerType: function (CPGUID) {
		//        var CustomerType = "";
		//        if (this.getView().getModel("Customers")) {
		//            var aCustData = this.getView().getModel("Customers").getProperty("/");
		//            if (CPGUID) {
		//                for (var i = 0; i < aCustData.length; i++) {
		//                    if (CPGUID === aCustData[i].CPGUID) {
		//                        CustomerType = aCustData[i].CPTypeID;
		//                    }
		//                }
		//            }
		//        }
		//        return CustomerType;
		//    },
		//    getAllSelectedCustomerName: function () {
		//        var customerName = "";
		//        if (gListView.byId("customer").getVisible()) {
		//            customerName = this.getCustomerName();
		//        } else if (gListView.byId("inputCustomerNo").getVisible()) {
		//            customerName = oPPCCommon.getTextFromTokens(this.getView(), "inputCustomerNo");
		//        }
		//        if (customerName === "") {
		//            customerName = "(All)";
		//        }
		//        return customerName;
		//    },
		//    onReset: function () {
		//        var aValueHelpIDs = [
		//            "inputOrderNo",
		//            "multiInputSPNo",
		//            "multiInputCPNo",
		//            "inputMaterial",
		//            "inputOrderMaterial"
		//        ];
		//        this.clearTokens(aValueHelpIDs);
		//        this.getView().byId("inputOrderType").setSelectedKeys([]);
		//        this.getView().byId("inputStatus").setSelectedKeys([]);
		//        this.getView().byId("inputApprovalStatus").setSelectedKeys([]);
		//        if (this.getView().getModel("SOItems") !== undefined) {
		//            this.getView().getModel("SOItems").setProperty("/", {});
		//            this.resetUITable();
		//        }
		//        if (this.onReset_Exit) {
		//            this.onReset_Exit();
		//        }
		//    },
		//    clearTokens: function (mParameters) {
		//        for (var i = 0; i < mParameters.length; i++) {
		//            this.getView().byId(mParameters[i]).removeAllTokens();
		//        }
		//    },
		//    resetUITable: function () {
		//        oPPCCommon.clearUITable(this.getView(), "UISOTable", "SOItems");
		//        if (this.resetUITable_Exit) {
		//            this.resetUITable_Exit();
		//        }
		//    },
		//    setListType: function (ListType) {
		//        this.ListType = ListType;
		//    },
		//    getListType: function () {
		//        if (this.ListType !== null && this.ListType !== undefined && this.ListType.trim() === "SOList") {
		//            return "SOList";
		//        } else {
		//            return "";
		//        }
		//    },
		//    getSODetails: function (oEvent) {
		//        var path = "";
		//        var oModelContext = oEvent.getSource().getBindingContext("SOItems");
		//        if (oPPCCommon.isMultiOrigin(oModelContext)) {
		//            var SAPMultiOriginPropertyName = oPPCCommon.getSAPMultiOriginPropertyName();
		//            path = "SSSOs(SSSOGuid=guid'" + oModelContext.getProperty("SSSOGuid") + "'," + SAPMultiOriginPropertyName + "='" + oModelContext.getProperty(SAPMultiOriginPropertyName) + "')";
		//        } else {
		//            path = "SSSOs(SSSOGuid=guid'" + oModelContext.getProperty("SSSOGuid") + "')";
		//        }
		//        this._oRouter.navTo("sodetail", { contextPath: path }, false);
		//    },
		createInvoice: function (oEvent) {
			var selectedContext = oEvent.getSource().getBindingContext("SOItems");
			var selectedObject = selectedContext.getObject();
			if (selectedObject.Status === "000001" || selectedObject.Status === "000002") {
				var path = "";
				path = "SSInvoiceCrt/(DmsDivision='" + selectedObject.DmsDivision + "',SoldToID='" + selectedObject.SoldToId + "',SoldToCPGUID='" +
					selectedObject.SoldToCPGUID + "',OrderNo='" +
					selectedObject.OrderNo + "')";
				// path = "SSSOs(SSSOGuid=guid'" + SSSOGuid + "')";

				// var sTargetName = oSSCommon.getProductFeatureValue({
				// 	Types: "WASSINCRCP"
				// });
				// var sSourceName = oSSCommon.getProductFeatureValue({
				// 	Types: "WASSSO"
				// });
				oPPCCommon.crossAppNavigation("zsssoinvcrt_cp", "zssinvcrt0cp", "Display", "zsssoinvcrt_cp", "zssinvcrt0cp", "/" + path);
			} else {
				sap.m.MessageToast.show("Invoice of only open status can be created");
			}
		},
		//    toSOItemDetail: function (oEvent) {
		//        var path = "";
		//        var oModelContext = oEvent.getSource().getBindingContext("SOItems");
		//        if (oPPCCommon.isMultiOrigin(oModelContext)) {
		//            var SAPMultiOriginPropertyName = oPPCCommon.getSAPMultiOriginPropertyName();
		//            path = "SOItemDetails(SONo='" + oModelContext.getProperty("SONo") + "',ItemNo='" + oModelContext.getProperty("ItemNo") + "'," + SAPMultiOriginPropertyName + "='" + oModelContext.getProperty(SAPMultiOriginPropertyName) + "')";
		//        } else {
		//            path = "SOItemDetails(SONo='" + oModelContext.getProperty("SONo") + "',ItemNo='" + oModelContext.getProperty("ItemNo") + "')";
		//        }
		//        this._oRouter.navTo("soitemdetail", { contextPath: path }, false);
		//    },
		setDropdowns: function () {

			// this.setChannelDD();
			this.setStatusDD();
			this.setOrderTypeDD();
			this.ApprovalStatus();

			//Setting Suggestor Model..............................................
			this.setSalesPersonModel();
			this.setChannelPartnerModel();
			this.setMatModel();
			this.RouteNameModel();
			this.getBillFromData();

			if (this.setDropdowns_Exit) {
				this.setDropdowns_Exit();
			}
		},
		//Lakshmi 21-06-2021
		getBillFromData: function () {
			var that = this;

			var oModelData = this._oComponent.getModel("PCGW");
			var oOrderTypeFilter = new Array();
			oOrderTypeFilter = oPPCCommon.setODataModelReadFilter(that.getView(), "", oOrderTypeFilter, "Typeset", sap.ui.model.FilterOperator
				.EQ, [
					"ZBILL"
				], false, false, false);
			oSSCommon.getDropdown(oModelData, "ConfigTypesetTypes", oOrderTypeFilter, "Types", "TypesName", BusyDialog, that.getView(),
				"BillFormDD", "Select",
				function (oData) {
					var that = this;
				});
		},
		onChangeBillForm: function (oEvent) {
			var that = this;
		},
		//    setOrderTypeDD: function () {
		//        var that = this;
		//        var oModelData = this._oComponent.getModel("PCGW");
		//        var oStatusFilter = new Array();
		//        oStatusFilter = oPPCCommon.setODataModelReadFilter("", "", oStatusFilter, "LoginID", "", [oSSCommon.getCurrentLoggedUser({
		//                sServiceName: "ValueHelps",
		//                sRequestType: "read"
		//            })], false, false, false);
		//        oStatusFilter = oPPCCommon.setODataModelReadFilter(this.getView(), "", oStatusFilter, "ModelID", sap.ui.model.FilterOperator.EQ, ["SSGW_SLS"], true, false, false);
		//        oStatusFilter = oPPCCommon.setODataModelReadFilter(this.getView(), "", oStatusFilter, "EntityType", sap.ui.model.FilterOperator.EQ, ["SSSO"], false, false, false);
		//        oStatusFilter = oPPCCommon.setODataModelReadFilter(this.getView(), "", oStatusFilter, "PropName", sap.ui.model.FilterOperator.EQ, ["OrderType"], false, false, false);
		//        oSSCommon.getDropdown(oModelData, "ValueHelps", oStatusFilter, "ID", "Description", BusyDialog, this.getView(), "OrderTypeDD", "", function () {
		//            if (that.contextPath) {
		//                var sDmsdivision = oPPCCommon.getPropertyValueFromContextPath(that.contextPath, "FRouteTypid");
		//                if (sDmsdivision) {
		//                    that.getView().byId("FRouteTypid").setSelectedKeys(sDmsdivision.split(";"));
		//                }
		//            }
		//        });
		//    },
		setStatusDD: function () {
			var that = this;
			var oModelData = this._oComponent.getModel("PCGW");
			var oStatusFilter = new Array();
			oStatusFilter = oPPCCommon.setODataModelReadFilter("", "", oStatusFilter, "LoginID", "", [oSSCommon.getCurrentLoggedUser({
				sServiceName: "ValueHelps",
				sRequestType: "read"
			})], false, false, false);
			oStatusFilter = oPPCCommon.setODataModelReadFilter(this.getView(), "", oStatusFilter, "ModelID", sap.ui.model.FilterOperator.EQ, [
				"SSGW_SLS"
			], true, false, false);
			oStatusFilter = oPPCCommon.setODataModelReadFilter(this.getView(), "", oStatusFilter, "EntityType", sap.ui.model.FilterOperator.EQ, [
				"SSSO"
			], false, false, false);
			oStatusFilter = oPPCCommon.setODataModelReadFilter(this.getView(), "", oStatusFilter, "PropName", sap.ui.model.FilterOperator.EQ, [
				"Status"
			], false, false, false);
			oSSCommon.getDropdown(oModelData, "ValueHelps", oStatusFilter, "ID", "Description", BusyDialog, this.getView(), "StatusDD", "",
				function () {
					if (that.contextPath) {
						var sDmsdivision = oPPCCommon.getPropertyValueFromContextPath(that.contextPath, "FApprovalStatus");
						if (sDmsdivision) {
							that.getView().byId("FApprovalStatus").setSelectedKeys(sDmsdivision.split(";"));
						}
					} else {
						that.getView().byId("inputStatus").setSelectedKeys(["000001"]);
					}
				});
			if (this.ApprovalStatusDD_Exit) {
				this.ApprovalStatusDD_Exit();
			}
		},
		//    ApprovalStatus: function () {
		//        var that = this;
		//        var oModelData = this._oComponent.getModel("PCGW");
		//        var oStatusFilter = new Array();
		//        oStatusFilter = oPPCCommon.setODataModelReadFilter("", "", oStatusFilter, "LoginID", "", [oSSCommon.getCurrentLoggedUser({
		//                sServiceName: "ValueHelps",
		//                sRequestType: "read"
		//            })], false, false, false);
		//        oStatusFilter = oPPCCommon.setODataModelReadFilter(this.getView(), "", oStatusFilter, "ModelID", sap.ui.model.FilterOperator.EQ, ["SSGW_SLS"], true, false, false);
		//        oStatusFilter = oPPCCommon.setODataModelReadFilter(this.getView(), "", oStatusFilter, "EntityType", sap.ui.model.FilterOperator.EQ, ["SSSO"], false, false, false);
		//        oStatusFilter = oPPCCommon.setODataModelReadFilter(this.getView(), "", oStatusFilter, "PropName", sap.ui.model.FilterOperator.EQ, ["ApprovalStatus"], false, false, false);
		//        oSSCommon.getDropdown(oModelData, "ValueHelps", oStatusFilter, "ID", "Description", BusyDialog, this.getView(), "ApprovalStatusDD", "", function () {
		//            if (that.contextPath) {
		//                var sDmsdivision = oPPCCommon.getPropertyValueFromContextPath(that.contextPath, "FApprovalStatus");
		//                if (sDmsdivision) {
		//                    that.getView().byId("FApprovalStatus").setSelectedKeys(sDmsdivision.split(";"));
		//                }
		//            }
		//        });
		//        if (this.ApprovalStatusDD_Exit) {
		//            this.ApprovalStatusDD_Exit();
		//        }
		//    },
		//    RouteNameModel: function () {
		//        var that = this;
		//        var SFGW_SP_MSTModel = this._oComponent.getModel("SFGW_SP");
		//        SFGW_SP_MSTModel.attachRequestSent(function () {
		//        });
		//        SFGW_SP_MSTModel.attachRequestCompleted(function () {
		//        });
		//        var aRouteF4Filter = new Array();
		//        aRouteF4Filter = oPPCCommon.setODataModelReadFilter("", "", aRouteF4Filter, "LoginID", "", [that.getCurrentUsers("RouteSchedules", "read")], false, false, false);
		//        SFGW_SP_MSTModel.read("/RouteSchedules", {
		//            filters: aRouteF4Filter,
		//            urlParameters: { "$select": "RoutId,RouteSchGUID,Description" },
		//            success: function (oData) {
		//                oData = oPPCCommon.formatItemsOData({ oData: oData });
		//                var RouteNameModel = new sap.ui.model.json.JSONModel();
		//                RouteNameModel.setData(oData);
		//                that._oComponent.setModel(RouteNameModel, "RouteNameSuggestorModel");
		//            },
		//            error: function (error) {
		//            }
		//        });
		//        if (this.RouteNameModel_Exit) {
		//            this.RouteNameModel_Exit();
		//        }
		//    },
		//    RouteNameF4: function () {
		//        var that = this;
		//        var validState = true;
		//        if (validState) {
		//            oSSCommonValueHelp.RouteF4({
		//                oController: that,
		//                oi18n: oi18n,
		//                oUtilsI18n: oUtilsI18n,
		//                modelID: "SFGW_SP",
		//                entityType: "RouteSchedule",
		//                propName: "Description",
		//                title: oi18n.getText("Route.Name.ValueHelp.Header"),
		//                controlID: "FDescription",
		//                tokenInput: that.RouteTokenInput,
		//                aKeys: that.aRouteKeys,
		//                sCustomerCode: this.getSelectedCustomerCode(),
		//                sCustomerGUID: this.getView().getModel("LocalViewSetting").getProperty("/gCPGUID"),
		//                sCustomerName: this.getAllSelectedCustomerName(),
		//                idLabel: oi18n.getText("Route.Name.Header.Title"),
		//                defaultVisible: false,
		//                bMultiSelect: false
		//            }, function (tokens) {
		//                that.setRouteF4Callback(tokens[0].getCustomData()[0].getValue());
		//                for (var i = 0; i < tokens.length; i++) {
		//                    var sDescription = tokens[i].getCustomData()[0].mProperties.value.Description;
		//                    var sRoutId = tokens[i].getCustomData()[0].mProperties.value.RoutId;
		//                    tokens[i].mProperties.text = sDescription + " (" + sRoutId + ")";
		//                    tokens[i].setTooltip(sDescription + " (" + sRoutId + ")");
		//                }
		//            });
		//        } else {
		//            errorPopUp(messageArea);
		//        }
		//        if (this.RouteNameF4_Exit) {
		//            this.RouteNameF4_Exit();
		//        }
		//    },
		//    setRouteF4Callback: function (tokens) {
		//        this.getView().byId("FDescription").setValueState(sap.ui.core.ValueState.None);
		//        this.getView().byId("FDescription").setValueStateText("");
		//        oPPCCommon.removeMsgsInMsgMgrByMsgCode("FDescription");
		//        var spGuid = tokens.Description;
		//        this.getView().getModel("LocalViewSetting").setProperty("/Description", spGuid);
		//        if (this.setRouteF4Callback_Exit) {
		//            this.setRouteF4Callback_Exit(tokens);
		//        }
		//    },
		onChangeRouteName: function (oEvent) {
			var that = this;
			that.suggestionOnChangeRouteName({
				oEvent: oEvent,
				thisController: this,
				sModelName: "RouteNameSuggestorModel",
				sKey: "RoutId",
				sDescription: "Description",
				sGUID: "RouteSchGUID"
			}, function (enteredVal, bFound, key, desc) {
				if (enteredVal !== "") {
					if (!bFound) {
						var msg = oi18n.getText("List.Filterbar.MultiInput.SpNoError", [this.getView().byId("LDescription").getLabel()]);
						oPPCCommon.displayMsg_MsgBox(that.getView(), msg, "error");
					}
				}
			});
			if (this.onChangeRouteName_Exit) {
				this.onChangeRouteName_Exit(oEvent);
			}
		},
		suggestionOnChangeRouteName: function (mParemeters, callBack) {
			mParemeters.oEvent.getSource().setValueState("None");
			mParemeters.oEvent.getSource().setValueStateText("");
			var key = "",
				desc = "",
				jData = {};
			var enteredVal = mParemeters.oEvent.getSource().getValue();
			var oData = mParemeters.thisController.getView().getModel(mParemeters.sModelName).getProperty("/");
			var bFound = false;
			if (enteredVal !== "") {
				for (var i = 0; i < oData.length; i++) {
					if (oData[i][mParemeters.sKey] === enteredVal || oData[i][mParemeters.sDescription] === enteredVal) {
						jData = oData[i];
						key = oData[i][mParemeters.sKey];
						desc = oData[i][mParemeters.sDescription];
						mParemeters.oEvent.getSource().removeAllTokens();
						var tokens = new sap.m.Token({
							key: oData[i][mParemeters.sGUID],
							text: oData[i][mParemeters.sDescription] + " (" + oData[i][mParemeters.sKey] + ")"
						});
						mParemeters.oEvent.getSource().addToken(tokens);
						mParemeters.oEvent.getSource().setValue("");
						bFound = true;
						break;
					}
				}
				if (!bFound) {
					mParemeters.oEvent.getSource().setValueState("Error");
					mParemeters.oEvent.getSource().setValueStateText("Please enter valid Beat Code");
				}
			}
			if (callBack) {
				callBack(enteredVal, bFound, key, desc, jData);
			}
		},
		//    handleRouteNameSuggest: function (oEvent) {
		//        oPPCCommon.handleSuggest({
		//            oEvent: oEvent,
		//            aProperties: [
		//                "RouteSchGUID",
		//                "RoutId",
		//                "Description"
		//            ],
		//            sBinding: "suggestionItems"
		//        });
		//        if (this.handleRouteNameSuggest_Exit) {
		//            this.handleRouteNameSuggest_Exit(oEvent);
		//        }
		//    },
		//    suggestionItemSelectedRoute: function (oEvent) {
		//        oPPCCommon.suggestionItemSelected({
		//            oEvent: oEvent,
		//            thisController: this,
		//            sModelName: "RouteNameSuggestorModel",
		//            sGUID: "RouteSchGUID",
		//            sKey: "RoutId",
		//            sDescription: "Description"
		//        }, function (key, desc, jData) {
		//            var RouteSchGUID = jData.RouteSchGUID;
		//            var Text = jData.Description;
		//        });
		//        this.getView().byId("FDescription").setValueState("None");
		//        this.getView().byId("FDescription").setValueStateText("");
		//        if (this.suggestionItemSelected_Exit) {
		//            this.suggestionItemSelected_Exit(oEvent);
		//        }
		//    },
		//    getSalesPerson: function (aData, callBack) {
		//        var that = this;
		//        var SSGW_MST_MSTModel = this._oComponent.getModel("SSGW_MST");
		//        var aSPF4Filter = new Array();
		//        var RouteList = aData;
		//        if (RouteList !== undefined) {
		//            for (var i = 0; i < RouteList.length; i++) {
		//                aSPF4Filter = oPPCCommon.setODataModelReadFilter("", "", aSPF4Filter, "SPGUID", "", [RouteList[i].SalesPersonID], false, false, false);
		//            }
		//        }
		//        SSGW_MST_MSTModel.setHeaders({
		//            "x-arteria-loginID": oSSCommon.getCurrentLoggedUser({
		//                sServiceName: "RouteSchedules",
		//                sRequestType: "read"
		//            })
		//        });
		//        SSGW_MST_MSTModel.read("/SalesPersons", {
		//            filters: aSPF4Filter,
		//            urlParameters: { "$select": "SPNo,FirstName,SPGUID" },
		//            success: function (oData) {
		//                oData = oPPCCommon.formatItemsOData({ oData: oData });
		//                var SPModel = new sap.ui.model.json.JSONModel();
		//                SPModel.setData(oData);
		//                for (var i = 0; i < aData.length; i++) {
		//                    for (var j = 0; j < oData.length; j++) {
		//                        if (aData[i].SalesPersonID === oData[j].SPGUID) {
		//                            aData[i].SPNo = oData[j].SPNo;
		//                            aData[i].FirstName = oData[j].FirstName;
		//                            aData[i].SPGUID = oData[j].SPGUID;
		//                        }
		//                    }
		//                }
		//                if (callBack) {
		//                    callBack(aData);
		//                }
		//            },
		//            error: function (error) {
		//                if (callBack) {
		//                    callBack(aData);
		//                }
		//            }
		//        });
		//        if (this.getSalesPerson_Exit) {
		//            this.getSalesPerson_Exit();
		//        }
		//    },
		//    formatPropertyForSorting: function (mParameters) {
		//        mParameters.oData = oPPCCommon.formatItemsOData({ oData: mParameters.oData });
		//        for (var i = 0; i < mParameters.Properties.length; i++) {
		//            for (var j = 0; j < mParameters.oData.length; j++) {
		//                if (mParameters.oData[j][mParameters.Properties[i]] && !isNaN(mParameters.oData[j][mParameters.Properties[i]])) {
		//                    mParameters.oData[j].CustomRoutId = parseFloat(mParameters.oData[j][mParameters.Properties[i]]);
		//                } else {
		//                    mParameters.oData[j].CustomRoutId = mParameters.oData[j][mParameters.Properties[i]];
		//                }
		//            }
		//        }
		//        return mParameters.oData;
		//    },
		//    MaterialF4: function () {
		//        var customer = this.getView().byId("customer").getSelectedKey();
		//        var validState = true;
		//        var messageArea = this.getView().byId("MessageAreaId");
		//        var s = gListView.getModel("Customers").getProperty("/0/FormattedCustomerNo");
		//        messageArea.setText("");
		//        if (validState) {
		//            oSSCommonValueHelp.cpStockF4({
		//                oController: this,
		//                oi18n: oi18n,
		//                oUtilsI18n: oUtilsI18n,
		//                sCustomer: this.getSelectedCustomerCode(),
		//                sCpParentName: this.getAllSelectedCustomerName(),
		//                sCPTypeID: this.getView().getModel("LocalViewSetting").getProperty("/gCPTypeID"),
		//                sCPGUID: this.getView().getModel("LocalViewSetting").getProperty("/gCPGUID")
		//            });
		//        } else {
		//            errorPopUp(messageArea);
		//        }
		//    },
		//    OrderNoF4: function () {
		//        var that = this;
		//        var oView = this.getView();
		//        var validState = true;
		//        var messageArea = this.getView().byId("MessageAreaId");
		//        var s = gListView.getModel("Customers").getProperty("/0/FormattedCustomerNo");
		//        messageArea.setText("");
		//        if (validState) {
		//            this.SecondarySalesSONoF4({
		//                oController: this,
		//                oi18n: oi18n,
		//                controlID: "inputOrderNo",
		//                oUtilsI18n: oUtilsI18n,
		//                sCustomerCode: this.getSelectedCustomerCode(),
		//                sCustomerName: that.getAllSelectedCustomerName(),
		//                sCPTypeID: that.getView().getModel("LocalViewSetting").getProperty("/gCPTypeID"),
		//                sCustomerGUID: that.getView().getModel("LocalViewSetting").getProperty("/gCPGUID")
		//            }, function (tokens) {
		//                that.getView().byId("inputOrderNo").setValue("");
		//                that.getView().byId("inputSODate").setSelectedKey("");
		//                that.SODate.FromDate = null;
		//                that.SODate.ToDate = null;
		//            });
		//        } else {
		//            errorPopUp(messageArea);
		//        }
		//    },
		//    setOrderNumF4Callback: function (tokens) {
		//        this.getView().byId("inputOrderNo").setValueState(sap.ui.core.ValueState.None);
		//        this.getView().byId("inputOrderNo").setValueStateText("");
		//        oPPCCommon.removeMsgsInMsgMgrByMsgCode("inputOrderNo");
		//        this.SSSOGuid = tokens.SSSOGuid;
		//        if (this.setOrderNumF4Callback_Exit) {
		//            this.setOrderNumF4Callback_Exit(tokens);
		//        }
		//    },
		//    SecondarySalesSONoF4: function (mParameters, requestCompleted) {
		//        if (mParameters.controlID === undefined || mParameters.controlID === null) {
		//            mParameters.controlID = "inputSONo";
		//        }
		//        if (mParameters.bMultiSelect === undefined || mParameters.bMultiSelect === null) {
		//            mParameters.bMultiSelect = true;
		//        }
		//        var oValueHelpDialog = new sap.ui.comp.valuehelpdialog.ValueHelpDialog({
		//            basicSearchText: mParameters.oController.SOTokenInput.getValue(),
		//            title: mParameters.oi18n.getText("List.ValueHelp.SONo.header"),
		//            supportMultiselect: mParameters.bMultiSelect,
		//            supportRanges: false,
		//            supportRangesOnly: false,
		//            key: mParameters.oController.aSOKeys[0],
		//            descriptionKey: mParameters.oController.aSOKeys[1],
		//            stretch: sap.ui.Device.system.phone,
		//            ok: function (oControlEvent) {
		//                var oTokens = oControlEvent.getParameter("tokens");
		//                for (var i = 0; i < oTokens.length; i++) {
		//                    var sOrderNo = oTokens[i].getCustomData()[0].getValue().OrderNo;
		//                    oTokens[i].mProperties.text = sOrderNo + "(" + sOrderNo + ")";
		//                }
		//                mParameters.oController.SOTokenInput.setTokens(oTokens);
		//                mParameters.oController.getView().byId(mParameters.controlID).setValueState(sap.ui.core.ValueState.None);
		//                mParameters.oController.getView().byId(mParameters.controlID).setValueStateText("");
		//                if (requestCompleted) {
		//                    requestCompleted(mParameters.oController.SOTokenInput.getTokens());
		//                }
		//                oValueHelpDialog.close();
		//            },
		//            cancel: function (oControlEvent) {
		//                oValueHelpDialog.close();
		//            },
		//            afterClose: function () {
		//                oValueHelpDialog.destroy();
		//            }
		//        });
		//        if (oValueHelpDialog.getTable().bindRows) {
		//            if (mParameters.showSelectedItemPanel === undefined || mParameters.showSelectedItemPanel) {
		//                oPPCCommon.setVHSelectedItemAreaVisibility({ oValueHelpDialog: oValueHelpDialog });
		//            }
		//        }
		//        this.setSONoF4Columns(oValueHelpDialog, mParameters);
		//        this.setSONoF4FilterBar(oValueHelpDialog, mParameters);
		//        if (sap.ui.Device.support.touch === false) {
		//            oValueHelpDialog.addStyleClass("sapUiSizeCompact");
		//        }
		//        oValueHelpDialog.open();
		//        if (mParameters.oController.SOTokenInput) {
		//            oValueHelpDialog.setTokens(mParameters.oController.SOTokenInput.getTokens());
		//        }
		//    },
		//    setSONoF4Columns: function (oValueHelpDialog, mParameters) {
		//        var sCustomerLabel = oPPCCommon.getLableFromMetadata({
		//            oDataModel: mParameters.oController.getView().getModel("SSGW_SLS"),
		//            sEntityType: "SSSOItem",
		//            sPropertyName: "FromCPNo",
		//            oUtilsI18n: mParameters.oUtilsI18n
		//        });
		//        var sSoNoLabel = oPPCCommon.getLableFromMetadata({
		//            oDataModel: mParameters.oController.getView().getModel("SSGW_SLS"),
		//            sEntityType: "SSSOItem",
		//            sPropertyName: "OrderNo",
		//            oUtilsI18n: mParameters.oUtilsI18n
		//        });
		//        var sOrderTypeLabel = oPPCCommon.getLableFromMetadata({
		//            oDataModel: mParameters.oController.getView().getModel("SSGW_SLS"),
		//            sEntityType: "SSSOItem",
		//            sPropertyName: "OrderType",
		//            oUtilsI18n: mParameters.oUtilsI18n
		//        });
		//        var sOrderDateLabel = oPPCCommon.getLableFromMetadata({
		//            oDataModel: mParameters.oController.getView().getModel("SSGW_SLS"),
		//            sEntityType: "SSSOItem",
		//            sPropertyName: "OrderDate",
		//            oUtilsI18n: mParameters.oUtilsI18n
		//        });
		//        if (oValueHelpDialog.getTable().bindItems) {
		//            var oColModel = new sap.ui.model.json.JSONModel();
		//            oColModel.setData({
		//                cols: [
		//                    {
		//                        label: sSoNoLabel,
		//                        template: "OrderNo"
		//                    },
		//                    {
		//                        label: sOrderTypeLabel,
		//                        template: "FormattedOrderType"
		//                    },
		//                    {
		//                        label: sOrderDateLabel,
		//                        template: "FormattedOrderDate",
		//                        demandPopin: true
		//                    },
		//                    {
		//                        label: sCustomerLabel,
		//                        template: "FormattedCPName",
		//                        demandPopin: true
		//                    }
		//                ]
		//            });
		//            oValueHelpDialog.getTable().setModel(oColModel, "columns");
		//            if (!mParameters.bIsCustomerDD) {
		//                if (mParameters.sCustomerCode === "") {
		//                    oValueHelpDialog.getTable().getColumns()[3].setVisible(true);
		//                } else {
		//                    oValueHelpDialog.getTable().getColumns()[3].setVisible(false);
		//                }
		//            }
		//        } else {
		//            oValueHelpDialog.getTable().addColumn(new sap.ui.table.Column({
		//                label: new com.arteriatech.ppc.utils.control.TableHeaderText({ text: sCustomerLabel }),
		//                template: new sap.m.Text({ text: "{FromCPName} ({FromCPNo})" }),
		//                sortProperty: "FromCPNo",
		//                filterProperty: "FromCPNo"
		//            }));
		//            if (!mParameters.bIsCustomerDD) {
		//                if (mParameters.sCustomerCode === "") {
		//                    oValueHelpDialog.getTable().getColumns()[0].setVisible(true);
		//                } else {
		//                    oValueHelpDialog.getTable().getColumns()[0].setVisible(false);
		//                }
		//            }
		//            oValueHelpDialog.getTable().addColumn(new sap.ui.table.Column({
		//                label: new com.arteriatech.ppc.utils.control.TableHeaderText({ text: sSoNoLabel }),
		//                template: new sap.m.Text({ text: "{OrderNo}" }),
		//                sortProperty: "OrderNo",
		//                filterProperty: "OrderNo",
		//                filterType: "sap.ui.model.type.Float"
		//            }));
		//            oValueHelpDialog.getTable().addColumn(new sap.ui.table.Column({
		//                label: new com.arteriatech.ppc.utils.control.TableHeaderText({ text: sOrderTypeLabel }),
		//                template: new sap.m.Text({ text: "{OrderTypeDesc} ({OrderType})" }),
		//                sortProperty: "OrderTypeDesc",
		//                filterProperty: "OrderTypeDesc"
		//            }));
		//            oValueHelpDialog.getTable().addColumn(new sap.ui.table.Column({
		//                label: new com.arteriatech.ppc.utils.control.TableHeaderText({ text: sOrderDateLabel }),
		//                template: new sap.m.Text({ text: "{path:'OrderDate' , formatter: 'com.arteriatech.ss.utils.js.Common.getFormattedDate' }" }),
		//                sortProperty: "OrderDate",
		//                filterProperty: "OrderDate"
		//            }));
		//            oValueHelpDialog.getTable().setNoData(mParameters.oUtilsI18n.getText("common.NoItemSelected"));
		//        }
		//    },
		//    setSONoF4FilterBar: function (oValueHelpDialog, mParameters) {
		//        var sCustomerLabel = oPPCCommon.getLableFromMetadata({
		//            oDataModel: mParameters.oController.getView().getModel("SSGW_SLS"),
		//            sEntityType: "SSSOItem",
		//            sPropertyName: "FromCPNo",
		//            oUtilsI18n: mParameters.oUtilsI18n
		//        });
		//        var sSoNoLabel = oPPCCommon.getLableFromMetadata({
		//            oDataModel: mParameters.oController.getView().getModel("SSGW_SLS"),
		//            sEntityType: "SSSOItem",
		//            sPropertyName: "OrderNo",
		//            oUtilsI18n: mParameters.oUtilsI18n
		//        });
		//        var sOrderTypeLabel = oPPCCommon.getLableFromMetadata({
		//            oDataModel: mParameters.oController.getView().getModel("SSGW_SLS"),
		//            sEntityType: "SSSOItem",
		//            sPropertyName: "OrderType",
		//            oUtilsI18n: mParameters.oUtilsI18n
		//        });
		//        var sOrderDateLabel = oPPCCommon.getLableFromMetadata({
		//            oDataModel: mParameters.oController.getView().getModel("SSGW_SLS"),
		//            sEntityType: "SSSOItem",
		//            sPropertyName: "OrderDate",
		//            oUtilsI18n: mParameters.oUtilsI18n
		//        });
		//        var busyDialog = new sap.m.BusyDialog();
		//        var oTokenInputValue = "";
		//        if (mParameters.oController.SOTokenInput) {
		//            oTokenInputValue = mParameters.oController.SOTokenInput.getValue();
		//        }
		//        var code = new sap.m.Input({
		//            value: oTokenInputValue,
		//            maxLength: oPPCCommon.getMaxLengthFromMetadata({
		//                oDataModel: mParameters.oController.getView().getModel("SSGW_SLS"),
		//                sEntityType: "SSSOItem",
		//                sPropertyName: "OrderNo",
		//                oUtilsI18n: mParameters.oUtilsI18n
		//            })
		//        });
		//        var OrderDate = new sap.m.DateRangeSelection({
		//            delimiter: "-",
		//            displayFormat: oSSCommon.getDateFormat()
		//        });
		//        var oOrderTypeItemTemplate = new sap.ui.core.Item({
		//            key: "{Key}",
		//            text: "{Key}{Seperator}{Text}",
		//            tooltip: "{Key}{Seperator}{Text}"
		//        });
		//        var OrderType = new sap.m.MultiComboBox({
		//            items: {
		//                path: "/",
		//                template: oOrderTypeItemTemplate
		//            }
		//        });
		//        OrderType.setModel(mParameters.oController.getView().getModel("OrderTypeDD"));
		//        var customerValue = new sap.m.Text({ text: mParameters.sCustomerName });
		//        var sCPParentText = "";
		//        if (mParameters.sCustomerCode) {
		//            var aCPParentName = mParameters.sCustomerName.split("(");
		//            if (aCPParentName.length > 1) {
		//                sCPParentText = mParameters.sCustomerName;
		//            } else {
		//                if (mParameters.sCustomerCode.length > 16) {
		//                    sCPParentText = mParameters.sCustomerName;
		//                } else {
		//                    sCPParentText = mParameters.sCustomerName + " (" + mParameters.sCustomerCode + ")";
		//                }
		//            }
		//        } else {
		//            sCPParentText = mParameters.sCPParentName;
		//        }
		//        var CPParentValue = new sap.m.Text({ text: sCPParentText });
		//        if (mParameters.bIsCustomerDD) {
		//            customerValue = new sap.m.Select({
		//                change: function (oEvent) {
		//                    if (oEvent.getSource().getSelectedKey() === "") {
		//                        oValueHelpDialog.getTable().getColumns()[0].setVisible(true);
		//                    } else {
		//                        oValueHelpDialog.getTable().getColumns()[0].setVisible(false);
		//                    }
		//                }
		//            });
		//            var CustomerItem = new sap.ui.core.ListItem({
		//                key: "{FromCPNo}",
		//                text: "{FromCPNo}{Seperator}{Name}"
		//            });
		//            var CustomerModel = new sap.ui.model.json.JSONModel();
		//            var oPartnerModel = mParameters.oController._oComponent.getModel("SSGW_SLS");
		//            oSSUserMapping.getCustomers(oPartnerModel, "000002", "2", busyDialog, mParameters.oController.getView(), function (partnerData) {
		//                if (partnerData.length > 0) {
		//                    CustomerModel.setData(partnerData);
		//                    customerValue.setModel(CustomerModel);
		//                    customerValue.bindAggregation("items", "/", CustomerItem);
		//                    if (partnerData.length != 1) {
		//                        customerValue.setSelectedKey("");
		//                    }
		//                }
		//            });
		//        }
		//        oValueHelpDialog.setFilterBar(new sap.ui.comp.filterbar.FilterBar({
		//            advancedMode: true,
		//            filterGroupItems: [
		//                new sap.ui.comp.filterbar.FilterGroupItem({
		//                    groupTitle: mParameters.oi18n.getText("List.ValueHelp.SONo.GroupTitle"),
		//                    groupName: "gn1",
		//                    name: "n1",
		//                    label: sSoNoLabel,
		//                    control: code
		//                }),
		//                new sap.ui.comp.filterbar.FilterGroupItem({
		//                    groupTitle: mParameters.oi18n.getText("List.ValueHelp.SONo.GroupTitle"),
		//                    groupName: "gn1",
		//                    name: "n4",
		//                    label: sOrderTypeLabel,
		//                    control: OrderType
		//                }),
		//                new sap.ui.comp.filterbar.FilterGroupItem({
		//                    groupTitle: mParameters.oi18n.getText("List.ValueHelp.SONo.GroupTitle"),
		//                    groupName: "gn1",
		//                    name: "n2",
		//                    label: sOrderDateLabel,
		//                    control: OrderDate
		//                }),
		//                new sap.ui.comp.filterbar.FilterGroupItem({
		//                    groupTitle: "Default",
		//                    groupName: "gn2",
		//                    name: "n5",
		//                    label: sCustomerLabel,
		//                    control: CPParentValue
		//                })
		//            ],
		//            search: function (oEvent) {
		//                var codeValue = code.getValue();
		//                var aSONumberF4FilterArray = new Array();
		//                var FromDate = oPPCCommon.addHoursAndMinutesToDate({ dDate: OrderDate.getDateValue() });
		//                var ToDate = oPPCCommon.addHoursAndMinutesToDate({ dDate: OrderDate.getSecondDateValue() });
		//                aSONumberF4FilterArray = oPPCCommon.setODataModelReadFilter("", "", aSONumberF4FilterArray, "LoginID", "", [oSSCommon.getCurrentLoggedUser({
		//                        sServiceName: "SSSOs",
		//                        sRequestType: "read"
		//                    })], false, false, false);
		//                var customers = "";
		//                if (mParameters.bIsCustomerDD) {
		//                    customers = customerValue.getSelectedKey();
		//                } else {
		//                    customers = mParameters.sCustomerCode;
		//                }
		//                aSONumberF4FilterArray = oPPCCommon.setODataModelReadFilter(mParameters.oController.getView(), "", aSONumberF4FilterArray, "FromCPGUID", sap.ui.model.FilterOperator.EQ, [mParameters.sCustomerGUID], false, false, false);
		//                if (mParameters.sCPTypeID) {
		//                    aSONumberF4FilterArray = com.arteriatech.ss.utils.js.CommonValueHelp.setODataModelReadFilter(mParameters.oController.getView(), "", aSONumberF4FilterArray, "FromCPTypId", sap.ui.model.FilterOperator.EQ, [mParameters.sCPTypeID], true, false, false);
		//                } else {
		//                    aSONumberF4FilterArray = com.arteriatech.ss.utils.js.CommonValueHelp.setODataModelReadFilter(mParameters.oController.getView(), "", aSONumberF4FilterArray, "FromCPTypId", sap.ui.model.FilterOperator.EQ, ["01"], true, false, false);
		//                }
		//                aSONumberF4FilterArray = oPPCCommon.setODataModelReadFilter(mParameters.oController.getView(), "", aSONumberF4FilterArray, "OrderNo", "", [codeValue], false, false, false);
		//                aSONumberF4FilterArray = oPPCCommon.setODataModelReadFilter(mParameters.oController.getView(), "", aSONumberF4FilterArray, "OrderDate", sap.ui.model.FilterOperator.BT, [
		//                    FromDate,
		//                    ToDate
		//                ], false, false, false);
		//                aSONumberF4FilterArray = oPPCCommon.setODataModelReadFilter(mParameters.oController.getView(), "", aSONumberF4FilterArray, "OrderType", sap.ui.model.FilterOperator.EQ, OrderType.getSelectedKeys(), true, false, false);
		//                var SFGW_SLSModel = mParameters.oController._oComponent.getModel("SSGW_SLS");
		//                SFGW_SLSModel.attachRequestSent(function () {
		//                    busyDialog.open();
		//                });
		//                SFGW_SLSModel.attachRequestCompleted(function () {
		//                    busyDialog.close();
		//                    if (FromDate != null) {
		//                        FromDate.setDate(FromDate.getDate() - 1);
		//                    }
		//                    if (ToDate != null) {
		//                        ToDate.setDate(ToDate.getDate() - 1);
		//                    }
		//                });
		//                SFGW_SLSModel.setHeaders({ "x-arteria-loginid": oSSCommon.getCurrentUsers("SSSOs", "read") });
		//                SFGW_SLSModel.read("/SSSOs", {
		//                    filters: aSONumberF4FilterArray,
		//                    urlParameters: { "$select": "OrderNo,OrderDate,OrderType,OrderTypeDesc,FromCPNo,FromCPName,SSSOGuid" },
		//                    success: function (oData) {
		//                        for (var i = 0; i < oData.results.length; i++) {
		//                            oData.results[i].OrderNo = parseFloat(oData.results[i].OrderNo);
		//                            oData.results[i].FormattedOrderType = oData.results[i].OrderTypeDesc + " (" + oData.results[i].OrderType + ")";
		//                            oData.results[i].FormattedCPName = oData.results[i].FromCPName + " (" + oData.results[i].FromCPNo + ")";
		//                            oData.results[i].FormattedOrderDate = oSSCommon.getFormattedDate(oData.results[i].OrderDate);
		//                        }
		//                        var SOsModel = new sap.ui.model.json.JSONModel();
		//                        if (oValueHelpDialog.getTable().bindRows) {
		//                            oValueHelpDialog.getTable().clearSelection();
		//                            SOsModel.setData(oData.results);
		//                            oValueHelpDialog.getTable().setModel(SOsModel);
		//                            oValueHelpDialog.getTable().bindRows("/");
		//                            if (oData.results.length === 0) {
		//                                oValueHelpDialog.getTable().setNoData(mParameters.oUtilsI18n.getText("common.NoResultsFound"));
		//                            }
		//                        } else {
		//                            oValueHelpDialog.getTable().getColumns()[2].setPopinDisplay("Inline");
		//                            var oRowsModel = new sap.ui.model.json.JSONModel();
		//                            oRowsModel.setData(oData.results);
		//                            oValueHelpDialog.getTable().setModel(oRowsModel);
		//                            if (oValueHelpDialog.getTable().bindItems) {
		//                                var oTable = oValueHelpDialog.getTable();
		//                                oTable.bindAggregation("items", "/", function () {
		//                                    var aCols = oTable.getModel("columns").getData().cols;
		//                                    return new sap.m.ColumnListItem({
		//                                        cells: aCols.map(function (column) {
		//                                            var colname = column.template;
		//                                            return new sap.m.Text({
		//                                                text: "{" + colname + "}",
		//                                                wrapping: true
		//                                            });
		//                                        })
		//                                    });
		//                                });
		//                            }
		//                            if (oData.results.length === 0) {
		//                                oValueHelpDialog.getTable().setNoDataText(mParameters.oUtilsI18n.getText("common.NoResultsFound"));
		//                            }
		//                        }
		//                        oValueHelpDialog.update();
		//                    },
		//                    error: function (error) {
		//                        oValueHelpDialog.getTable().clearSelection();
		//                        if (oValueHelpDialog.getTable().getModel() != undefined)
		//                            oValueHelpDialog.getTable().getModel().setProperty("/", {});
		//                        oValueHelpDialog.getTable().setNoData(mParameters.oUtilsI18n.getText("common.NoResultsFound"));
		//                        com.arteriatech.ss.utils.js.CommonValueHelp.dialogErrorMessage(error, "No Data Found");
		//                    }
		//                });
		//            },
		//            reset: function () {
		//            }
		//        }));
		//    },
		//    OrderMaterialF4: function () {
		//        var customer = this.getView().byId("customer").getSelectedKey();
		//        var validState = true;
		//        var messageArea = this.getView().byId("MessageAreaId");
		//        messageArea.setText("");
		//        if (validState) {
		//            this.OrderMaterialGrpF4({
		//                oController: this,
		//                oi18n: oi18n,
		//                oUtilsI18n: oUtilsI18n,
		//                sCustomer: this.getSelectedCustomerCode(),
		//                sCpParentName: this.getAllSelectedCustomerName()
		//            });
		//        } else {
		//            errorPopUp(messageArea);
		//        }
		//    },
		//    OrderMaterialGrpF4: function (mParameters, requestCompleted) {
		//        if (mParameters.controlID === undefined || mParameters.controlID === null) {
		//            mParameters.controlID = "inputOrderMaterial";
		//        }
		//        if (mParameters.bMultiSelect === undefined || mParameters.bMultiSelect === null) {
		//            mParameters.bMultiSelect = true;
		//        }
		//        var oTokenMaterialInput = "";
		//        if (mParameters.oController.OrderMaterialTokenInput) {
		//            oTokenMaterialInput = mParameters.oController.OrderMaterialTokenInput.getValue();
		//        }
		//        var oValueHelpDialog = new sap.ui.comp.valuehelpdialog.ValueHelpDialog({
		//            basicSearchText: oTokenMaterialInput,
		//            title: oi18n.getText("List.ValueHelp.OrderMaterial.header"),
		//            supportMultiselect: mParameters.bMultiSelect,
		//            supportRanges: false,
		//            supportRangesOnly: false,
		//            key: mParameters.oController.aOrderMaterialKeys[0],
		//            descriptionKey: mParameters.oController.aOrderMaterialKeys[1],
		//            stretch: sap.ui.Device.system.phone,
		//            ok: function (oControlEvent) {
		//                if (mParameters.oController.OrderMaterialTokenInput) {
		//                    mParameters.oController.OrderMaterialTokenInput.setTokens(oControlEvent.getParameter("tokens"));
		//                    mParameters.oController.getView().byId(mParameters.controlID).setValueState(sap.ui.core.ValueState.None);
		//                    mParameters.oController.getView().byId(mParameters.controlID).setValueStateText("");
		//                }
		//                if (requestCompleted) {
		//                    requestCompleted(oControlEvent.getParameter("tokens"));
		//                }
		//                oValueHelpDialog.close();
		//            },
		//            cancel: function (oControlEvent) {
		//                oValueHelpDialog.close();
		//            },
		//            afterClose: function () {
		//                oValueHelpDialog.destroy();
		//            }
		//        });
		//        this.setCPStockF4Columns(oValueHelpDialog, mParameters);
		//        this.setCPStockF4FilterBar(oValueHelpDialog, mParameters);
		//        if (sap.ui.Device.support.touch === false) {
		//            oValueHelpDialog.addStyleClass("sapUiSizeCompact");
		//        }
		//        oValueHelpDialog.open();
		//        if (mParameters.oController.OrderMaterialTokenInput) {
		//            oValueHelpDialog.setTokens(mParameters.oController.OrderMaterialTokenInput.getTokens());
		//        }
		//        if (this.utilMaterialF4_Exit) {
		//            this.utilMaterialF4_Exit();
		//        }
		//    },
		//    setCPStockF4Columns: function (oValueHelpDialog, mParameters) {
		//        var sOrderMaterialGrpLabel = oPPCCommon.getLableFromMetadata({
		//            oDataModel: mParameters.oController.getView().getModel("SFGW_MST"),
		//            sEntityType: "OrderMaterialGroup",
		//            sPropertyName: "OrderMaterialGroupID",
		//            oUtilsI18n: mParameters.oUtilsI18n
		//        });
		//        var sOrderMaterialGrpDescLabel = oPPCCommon.getLableFromMetadata({
		//            oDataModel: mParameters.oController.getView().getModel("SFGW_MST"),
		//            sEntityType: "OrderMaterialGroup",
		//            sPropertyName: "OrderMaterialGroupDesc",
		//            oUtilsI18n: mParameters.oUtilsI18n
		//        });
		//        oValueHelpDialog.getTable().addColumn(new sap.ui.table.Column({
		//            label: new com.arteriatech.ppc.utils.control.TableHeaderText({ text: sOrderMaterialGrpLabel }),
		//            template: new sap.m.Text({ text: "{OrderMaterialGroupID}" }),
		//            sortProperty: "OrderMaterialGroupID",
		//            filterProperty: "OrderMaterialGroupID"
		//        }));
		//        oValueHelpDialog.getTable().addColumn(new sap.ui.table.Column({
		//            label: new com.arteriatech.ppc.utils.control.TableHeaderText({ text: sOrderMaterialGrpDescLabel }),
		//            template: new sap.m.Text({ text: "{OrderMaterialGroupDesc}" }),
		//            sortProperty: "OrderMaterialGroupDesc",
		//            filterProperty: "OrderMaterialGroupDesc"
		//        }));
		//        oValueHelpDialog.getTable().setNoData(mParameters.oUtilsI18n.getText("common.NoItemSelected"));
		//        if (this.setMaterialF4Columns_Exit) {
		//            this.setMaterialF4Columns_Exit();
		//        }
		//    },
		//    setCPStockF4FilterBar: function (oValueHelpDialog, mParameters) {
		//        var sOrderMaterialGrpLabel = oPPCCommon.getLableFromMetadata({
		//            oDataModel: mParameters.oController.getView().getModel("SFGW_MST"),
		//            sEntityType: "OrderMaterialGroup",
		//            sPropertyName: "OrderMaterialGroupID",
		//            oUtilsI18n: mParameters.oUtilsI18n
		//        });
		//        var busyDialog = new sap.m.BusyDialog();
		//        var oTokenInputValue = "";
		//        if (mParameters.oController.CPTokenInput) {
		//            oTokenInputValue = mParameters.oController.CPTokenInput.getValue();
		//        }
		//        var code = new sap.m.Input({
		//            value: oTokenInputValue,
		//            maxLength: oPPCCommon.getMaxLengthFromMetadata({
		//                oDataModel: mParameters.oController.getView().getModel("SFGW_MST"),
		//                sEntityType: "OrderMaterialGroup",
		//                sPropertyName: "OrderMaterialGroupID",
		//                oUtilsI18n: mParameters.oUtilsI18n
		//            })
		//        });
		//        var desc = new sap.m.Input({});
		//        oValueHelpDialog.setFilterBar(new sap.ui.comp.filterbar.FilterBar({
		//            advancedMode: true,
		//            filterGroupItems: [new sap.ui.comp.filterbar.FilterGroupItem({
		//                    groupTitle: "Material",
		//                    groupName: "gn1",
		//                    name: "n1",
		//                    label: sOrderMaterialGrpLabel,
		//                    control: code
		//                })],
		//            search: function (oEvent) {
		//                var codeValue = code.getValue();
		//                var descValue = desc.getValue();
		//                var sLoginID = oSSCommon.getCurrentUsers("OrderMaterialGroups", "read");
		//                var aMaterialF4Filter = new Array();
		//                aMaterialF4Filter = oPPCCommon.setODataModelReadFilter("", "", aMaterialF4Filter, "LoginID", "", [sLoginID], false, false, false);
		//                aMaterialF4Filter = com.arteriatech.ss.utils.js.CommonValueHelp.setODataModelReadFilter(mParameters.oController.getView(), "", aMaterialF4Filter, "OrderMaterialGroupID", "", [codeValue], false, false, false);
		//                var SSGW_MMModel = mParameters.oController._oComponent.getModel("SFGW_MST");
		//                SSGW_MMModel.attachRequestSent(function () {
		//                    busyDialog.open();
		//                });
		//                SSGW_MMModel.attachRequestCompleted(function () {
		//                    busyDialog.close();
		//                });
		//                SSGW_MMModel.setHeaders({ "x-arteria-loginid": sLoginID });
		//                SSGW_MMModel.read("/OrderMaterialGroups", {
		//                    filters: aMaterialF4Filter,
		//                    success: function (oData) {
		//                        if (oData.results.length > 0) {
		//                            for (var i = 0; i < oData.results.length; i++) {
		//                                oData.results[i].OrderMatGrp = oData.results[i].OrderMaterialGroupID;
		//                                oData.results[i].OrderMatGrpDesc = oData.results[i].OrderMaterialGroupDesc;
		//                            }
		//                            oValueHelpDialog.getTable().clearSelection();
		//                            var MaterialsModel = new sap.ui.model.json.JSONModel();
		//                            MaterialsModel.setData(oData.results);
		//                            oValueHelpDialog.getTable().setModel(MaterialsModel);
		//                            oValueHelpDialog.getTable().bindRows("/");
		//                            oValueHelpDialog.update();
		//                        } else {
		//                            if (oValueHelpDialog.getTable().getModel() != undefined)
		//                                oValueHelpDialog.getTable().getModel().setProperty("/", {});
		//                            oValueHelpDialog.getTable().setNoData(mParameters.oUtilsI18n.getText("common.NoResultsFound"));
		//                        }
		//                    },
		//                    error: function (error) {
		//                        oValueHelpDialog.getTable().clearSelection();
		//                        if (oValueHelpDialog.getTable().getModel() != undefined)
		//                            oValueHelpDialog.getTable().getModel().setProperty("/", {});
		//                        oValueHelpDialog.getTable().setNoData(mParameters.oUtilsI18n.getText("common.NoResultsFound"));
		//                        com.arteriatech.ss.utils.js.CommonValueHelp.dialogErrorMessage(error, "No Data Found");
		//                    }
		//                });
		//            },
		//            reset: function () {
		//            }
		//        }));
		//        if (this.setCPMaterialF4FilterBar_Exit) {
		//            this.setCPMaterialF4FilterBar_Exit();
		//        }
		//    },
		//    validateCustomer: function (messageArea) {
		//        var validState = true;
		//        return validState;
		//    },
		//    resetControlState: function (controls) {
		//        for (var i = 0; i < controls.length; i++) {
		//            this.getView().byId(controls[i]).setValueState(sap.ui.core.ValueState.None);
		//            this.getView().byId(controls[i]).setValueStateText("");
		//        }
		//    },
		//    setValuehelpPropety: function () {
		//        var that = this;
		//        this._oComponent.AppContext = new Object();
		//        this.CustomerTokenInput = this.getView().byId("inputCustomerNo");
		//        this.aCustomerKeys = [
		//            "CustomerNo",
		//            "Name"
		//        ];
		//        this.CustomerTokenInput.addValidator(function (args) {
		//            var oDataModel = that._oComponent.getModel("SFGW_MST");
		//            args.text = args.text.toUpperCase();
		//            var F4Filters = new Array();
		//            var fCustomerNo = new sap.ui.model.Filter("CustomerNo", sap.ui.model.FilterOperator.EQ, args.text);
		//            F4Filters.push(fCustomerNo);
		//            oSSCommon.getTokenForInput(args, oDataModel, "Customers", F4Filters, "CustomerNo", "Name", that.CustomerTokenInput, that.getView().byId("CustomerNo").getLabel());
		//        });
		//        this.CPTokenInput = this.getView().byId("multiInputCPNo");
		//        this.aCPKeys = [
		//            "CPGUID",
		//            "CPNo"
		//        ];
		//        this.SPTokenInput = this.getView().byId("multiInputSPNo");
		//        this.aSPKeys = [
		//            "SPGUID",
		//            "SPNo"
		//        ];
		//        this.SOTokenInput = this.getView().byId("inputOrderNo");
		//        this.aSOKeys = [
		//            "SSSOGuid",
		//            "OrderNo"
		//        ];
		//        this.SOTokenInput.addValidator(function (args) {
		//            var oDataModel = that._oComponent.getModel("SSGW_SLS");
		//            args.text = args.text.toUpperCase();
		//            var F4Filters = new Array();
		//            var fOrderNo = new sap.ui.model.Filter("OrderNo", sap.ui.model.FilterOperator.EQ, args.text);
		//            F4Filters.push(fOrderNo);
		//            oSSCommon.createTokens(oDataModel, "SSSOs", F4Filters, "OrderNo", "OrderNo", that.getView().byId("inputOrderNo"), function (oTokens) {
		//                if (oTokens.length > 0) {
		//                    that.SOTokenInput.removeAllTokens();
		//                    for (var i = 0; i < oTokens.length; i++) {
		//                        var oToken = new sap.m.Token({
		//                            key: oTokens[i].SSSOGuid,
		//                            text: oTokens[i].OrderNo + " (" + oTokens[i].OrderNo + ")"
		//                        });
		//                        sssoGuid.splice(i, sssoGuid.length);
		//                        sssoGuid.push(oTokens[i].SPGUID);
		//                        that.getView().byId("inputOrderNo").setValue("");
		//                        that.getView().byId("inputSODate").setSelectedKey("");
		//                        that.SOTokenInput.addToken(oToken);
		//                    }
		//                    that.callService();
		//                }
		//                that.callService();
		//            }, "SSSOGuid");
		//        });
		//        this.MaterialTokenInput = this.getView().byId("inputMaterial");
		//        this.aMaterialKeys = [
		//            "MaterialNo",
		//            "MaterialDesc"
		//        ];
		//        this.OrderMaterialTokenInput = this.getView().byId("inputOrderMaterial");
		//        this.aOrderMaterialKeys = [
		//            "OrderMatGrp",
		//            "OrderMatGrpDesc"
		//        ];
		//        this.RouteTokenInput = this.getView().byId("FDescription");
		//        this.aRouteKeys = [
		//            "RouteSchGUID",
		//            "RouteId"
		//        ];
		//    },
		//    CustomerF4: function () {
		//        oSSCommonValueHelp.CustomerF4({
		//            oController: this,
		//            oi18n: oi18n,
		//            oUtilsI18n: oUtilsI18n
		//        });
		//    },
		//    SPNoF4: function () {
		//        var that = this;
		//        var s = gListView.getModel("Customers").getProperty("/0/FormattedCustomerNo");
		//        oSSCommonValueHelp.SalesPersonF4({
		//            oController: that,
		//            oi18n: oi18n,
		//            oUtilsI18n: oUtilsI18n,
		//            controlID: "multiInputSPNo",
		//            tokenInput: this.SPTokenInput,
		//            firstNameLabel: oi18n.getText("List.ValueHelp.SalesPerson.firstName"),
		//            lastNameLabel: oi18n.getText("List.ValueHelp.SalesPerson.lastName"),
		//            parentlabel: oi18n.getText("List.ValueHelp.SalesPerson.CPNumber"),
		//            sCustomerCode: this.getSelectedCustomerCode(),
		//            sCustomerName: that.getAllSelectedCustomerName(),
		//            bCustomerDD: false,
		//            bSPGUIDKey: true,
		//            bApprovedNTRequired: false
		//        }, function (tokens) {
		//            for (var i = 0; i < tokens.length; i++) {
		//                var sFirstName = tokens[i].getCustomData()[0].mProperties.value.FirstName;
		//                var sSPNo = tokens[i].getCustomData()[0].mProperties.value.SPNo;
		//                tokens[i].mProperties.text = sFirstName + " (" + sSPNo + ")";
		//                tokens[i].setTooltip(sFirstName + " (" + sSPNo + ")");
		//            }
		//        });
		//    },
		//    setSalesPersonModel: function () {
		//        var that = this;
		//        var SSGW_MST_MSTModel = this._oComponent.getModel("SSGW_MST");
		//        SSGW_MST_MSTModel.attachRequestSent(function () {
		//        });
		//        SSGW_MST_MSTModel.attachRequestCompleted(function () {
		//        });
		//        var aSPF4Filter = new Array();
		//        aSPF4Filter = oPPCCommon.setODataModelReadFilter("", "", aSPF4Filter, "LoginID", "", [that.getCurrentUsers("SalesPersons", "read")], false, false, false);
		//        aSPF4Filter = oPPCCommon.setODataModelReadFilter("", "", aSPF4Filter, "CPGUID", "", [this.getSelectedCustomerCode()], false, false, false);
		//        SSGW_MST_MSTModel.read("/SalesPersons", {
		//            filters: aSPF4Filter,
		//            urlParameters: { "$select": "SPNo,FirstName,SPGUID" },
		//            success: function (oData) {
		//                oData = oPPCCommon.formatItemsOData({ oData: oData });
		//                var SalesPersonModel = new sap.ui.model.json.JSONModel();
		//                SalesPersonModel.setData(oData);
		//                that._oComponent.setModel(SalesPersonModel, "SalesPersonSuggestorModel");
		//            },
		//            error: function (error) {
		//            }
		//        });
		//    },
		//    handleSalesPersonSuggest: function (oEvent) {
		//        oPPCCommon.handleSuggest({
		//            oEvent: oEvent,
		//            aProperties: [
		//                "SPGUID",
		//                "SPNo",
		//                "FirstName"
		//            ],
		//            sBinding: "suggestionItems"
		//        });
		//    },
		//    suggestionItemSelectedSP: function (oEvent) {
		//        var that = this;
		//        oPPCCommon.suggestionItemSelected({
		//            oEvent: oEvent,
		//            thisController: this,
		//            sModelName: "SalesPersonSuggestorModel",
		//            sGUID: "SPGUID",
		//            sKey: "SPNo",
		//            sDescription: "FirstName"
		//        }, function (key, desc, jData) {
		//            var SPGUID = jData.SPGUID;
		//            that.getView().getModel("LocalViewSetting").setProperty("/SPGUID", SPGUID);
		//        });
		//        this.getView().byId("multiInputSPNo").setValueState("None");
		//        this.getView().byId("multiInputSPNo").setValueStateText("");
		//    },
		onChangeSPF4: function (oEvent) {
			var that = this;
			that.suggestionOnChangeSPF4({
				oEvent: oEvent,
				thisController: this,
				sModelName: "SalesPersonSuggestorModel",
				sKey: "SPNo",
				sDescription: "FirstName",
				sGUID: "SPGUID"
			}, function (enteredVal, bFound, key, desc) {
				if (enteredVal !== "") {}
			});
		},
		suggestionOnChangeSPF4: function (mParemeters, callBack) {
			mParemeters.oEvent.getSource().setValueState("None");
			mParemeters.oEvent.getSource().setValueStateText("");
			var key = "",
				desc = "",
				jData = {};
			var enteredVal = mParemeters.oEvent.getSource().getValue();
			var oData = mParemeters.thisController.getView().getModel(mParemeters.sModelName).getProperty("/");
			var bFound = false;
			if (enteredVal !== "") {
				for (var i = 0; i < oData.length; i++) {
					if (oData[i][mParemeters.sKey] === enteredVal || oData[i][mParemeters.sDescription] === enteredVal) {
						jData = oData[i];
						key = oData[i][mParemeters.sKey];
						desc = oData[i][mParemeters.sDescription];
						mParemeters.oEvent.getSource().removeAllTokens();
						var tokens = new sap.m.Token({
							key: oData[i][mParemeters.sGUID],
							text: oData[i][mParemeters.sDescription] + " (" + oData[i][mParemeters.sKey] + ")"
						});
						mParemeters.oEvent.getSource().addToken(tokens);
						mParemeters.oEvent.getSource().setValue("");
						bFound = true;
						break;
					}
				}
				if (!bFound) {
					mParemeters.oEvent.getSource().setValueState("Error");
					mParemeters.oEvent.getSource().setValueStateText("Please enter valid MR Code");
				}
			}
			if (callBack) {
				callBack(enteredVal, bFound, key, desc, jData);
			}
		},
		//    setChannelPartnerModel: function () {
		//        var that = this;
		//        var SSGW_MST_MSTModel = this._oComponent.getModel("SSGW_MST");
		//        SSGW_MST_MSTModel.attachRequestSent(function () {
		//        });
		//        SSGW_MST_MSTModel.attachRequestCompleted(function () {
		//        });
		//        var aCPF4Filter = new Array();
		//        aCPF4Filter = oPPCCommon.setODataModelReadFilter("", "", aCPF4Filter, "LoginID", "", [that.getCurrentUsers("ChannelPartners", "read")], false, false, false);
		//        aCPF4Filter = oPPCCommon.setODataModelReadFilter("", "", aCPF4Filter, "ParentID", "", [that.getView().getModel("LocalViewSetting").getProperty("/gCPGUID")], false, false, false);
		//        SSGW_MST_MSTModel.read("/ChannelPartners", {
		//            filters: aCPF4Filter,
		//            urlParameters: { "$select": "CPNo,Name,CPGUID" },
		//            success: function (oData) {
		//                var ChannelPartnerModel = new sap.ui.model.json.JSONModel();
		//                ChannelPartnerModel.setData(oData.results);
		//                that._oComponent.setModel(ChannelPartnerModel, "ChannelPartnerSuggestorModel");
		//            },
		//            error: function (error) {
		//            }
		//        });
		//    },
		//    CPNoF4: function () {
		//        var that = this;
		//        var s = gListView.getModel("Customers").getProperty("/0/FormattedCustomerNo");
		//        oSSCommonValueHelp.ChannelPartenerF4({
		//            oController: this,
		//            controlID: "multiInputCPNo",
		//            oi18n: oi18n,
		//            oUtilsI18n: oUtilsI18n,
		//            bMultiSelect: true,
		//            bCPGUIDKey: true,
		//            sCPParentCode: this.getSelectedCustomerCode(),
		//            sCPParentName: this.getAllSelectedCustomerName(),
		//            sCPParentGUID: that.getView().getModel("LocalViewSetting").getProperty("/gCPGUID"),
		//            bCPType: false,
		//            bApprovedNTRequired: false
		//        }, function (oTokenEvent) {
		//            var gCPGUID = oTokenEvent[0].getCustomData()[0].getValue().CPGUID;
		//            that.getView().getModel("LocalViewSetting").setProperty("/CPGUID", gCPGUID);
		//        });
		//    },
		onChangeCPF4: function (oEvent) {
			var that = this;
			that.suggestionOnChangeCPF4({
				oEvent: oEvent,
				thisController: this,
				sModelName: "ChannelPartnerSuggestorModel",
				sKey: "CPNo",
				sDescription: "Name",
				sGUID: "CPGUID"
			}, function (enteredVal, bFound, key, desc) {
				if (enteredVal !== "") {
					if (!bFound) {
						var msg = oi18n.getText("List.Filterbar.MultiInput.CpNoError", [that.getView().byId("feCPNo").getLabel()]);
						oPPCCommon.displayMsg_MsgBox(that.getView(), msg, "error");
					}
				}
				if (oEvent.getSource().getTokens().length === 0 || oEvent.getSource().getValue() === "") {
					that.getView().getModel("LocalViewSetting").setProperty("/CPGUID", "");
				}
				that.getView().getModel("SOs").setProperty("/SPNo", key);
				that.getView().getModel("SOs").setProperty("/SPName", desc);
			});
		},
		suggestionOnChangeCPF4: function (mParemeters, callBack) {
			mParemeters.oEvent.getSource().setValueState("None");
			mParemeters.oEvent.getSource().setValueStateText("");
			var key = "",
				desc = "",
				jData = {};
			var enteredVal = mParemeters.oEvent.getSource().getValue();
			var oData = mParemeters.thisController.getView().getModel(mParemeters.sModelName).getProperty("/");
			var bFound = false;
			if (enteredVal !== "") {
				for (var i = 0; i < oData.length; i++) {
					if (oData[i][mParemeters.sKey] === enteredVal || oData[i][mParemeters.sDescription] === enteredVal) {
						jData = oData[i];
						key = oData[i][mParemeters.sKey];
						desc = oData[i][mParemeters.sDescription];
						mParemeters.oEvent.getSource().removeAllTokens();
						var tokens = new sap.m.Token({
							key: oData[i][mParemeters.sGUID],
							text: oData[i][mParemeters.sDescription] + " (" + oData[i][mParemeters.sKey] + ")"
						});
						mParemeters.oEvent.getSource().addToken(tokens);
						mParemeters.oEvent.getSource().setValue("");
						bFound = true;
						break;
					}
				}
				if (!bFound) {
					mParemeters.oEvent.getSource().setValueState("Error");
					mParemeters.oEvent.getSource().setValueStateText("Please enter valid Retailer");
				}
			}
			if (callBack) {
				callBack(enteredVal, bFound, key, desc, jData);
			}
		},
		//    handleChannelPartnerSuggest: function (oEvent) {
		//        oPPCCommon.handleSuggest({
		//            oEvent: oEvent,
		//            aProperties: [
		//                "CPGUID",
		//                "CPNo",
		//                "Name"
		//            ],
		//            sBinding: "suggestionItems"
		//        });
		//    },
		//    suggestionItemSelected: function (oEvent) {
		//        oPPCCommon.suggestionItemSelected({
		//            oEvent: oEvent,
		//            thisController: this,
		//            sModelName: "ChannelPartnerSuggestorModel",
		//            sGUID: "CPGUID",
		//            sKey: "CPNo",
		//            sDescription: "Name"
		//        }, function (key, desc) {
		//        });
		//        this.getView().byId("multiInputCPNo").setValueState("None");
		//        this.getView().byId("multiInputCPNo").setValueStateText("");
		//    },
		//    formatValue: function (val) {
		//        var res = val;
		//        if (res !== undefined && res.length > 0) {
		//            res = "(" + res + ")";
		//        }
		//        return res;
		//    },
		//    sorterFilterSO: function () {
		//    },
		//    sortAndFilterTableSO: function (oEvent) {
		//    },
		//    exportToExcelSalesOrder: function (oEvent) {
		//        var table1 = this.getView().byId("SOTable");
		//        var items;
		//        items = table1.getItems();
		//        if (items.length > 0) {
		//            if (Device.system.desktop) {
		//                oPPCCommon.copyAndApplySortingFilteringFromUITable({
		//                    thisController: this,
		//                    mTable: this.getView().byId("SOTable"),
		//                    uiTable: this.getView().byId("UISOTable")
		//                });
		//            }
		//        }
		//        var table = this.getView().byId("SOTable");
		//        var oModel = this.getView().getModel("SOItems");
		//        oPPCCommon.exportToExcel(table, oModel, {
		//            bExportAll: false,
		//            oController: this,
		//            bLabelFromMetadata: true,
		//            sModel: "SSGW_SLS",
		//            sEntityType: "SSSO",
		//            oUtilsI18n: oUtilsI18n
		//        });
		//    }
	});
});