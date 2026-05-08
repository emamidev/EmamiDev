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
	var oi18n = "",
		oUtilsI18n = "";
	var Device = sap.ui.Device;

	return sap.ui.controller("com.arteriatech.ss.soinvcreate.cp.zsssoinvcreate0cp.controller.SOListCustom", {
		//    onInit: function () {
		//        this.onInitialHookUps();
		//    },
		//    onInitialHookUps: function () {
		//        gSOListView = this.getView();
		//        oPPCCommon.initMsgMangerObjects();
		//        this._oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(gSOListView));
		//        oi18n = this._oComponent.getModel("i18n").getResourceBundle();
		//        oUtilsI18n = this._oComponent.getModel("ppcutili18n").getResourceBundle();
		//        this._oRouter = this.getRouter();
		//        if (this.onInitialHookUps_Exit) {
		//            this.onInitialHookUps_Exit();
		//        }
		//    },
		//    onStockCheck: function () {
		//        var that = this;
		//        if (gListView.getModel("SOItems")) {
		//            var oSOItems = gListView.getModel("SOItems").getProperty("/");
		//            var selectedItems = [];
		//            var count = 0;
		//            for (var i = 0; i < oSOItems.length; i++) {
		//                if (oSOItems[i].Selected) {
		//                    selectedItems.push(oSOItems[i]);
		//                    count++;
		//                }
		//            }
		//            if (count > 0) {
		//                this.getStockCheckItems(selectedItems, function () {
		//                    var oItems = that.getView().getModel("StockChecks").getProperty("/");
		//                    if (oItems.length > 0) {
		//                        that.getStockCheckDialog();
		//                    } else {
		//                        sap.ca.ui.message.showMessageToast("No Data found");
		//                    }
		//                });
		//            } else {
		//                sap.ca.ui.message.showMessageToast("Please select Sales Order");
		//            }
		//        }
		//    },
		//    getStockCheckDialog: function () {
		//        var that = this;
		//        var oView = gListView;
		//        jQuery.sap.require("com.arteriatech.ss.soinvcreate.cp.view.StockCheck");
		//        this.Content = new com.arteriatech.ss.soinvcreate.cp.view.StockCheck({
		//            columnLayout: "4",
		//            formAdjustment: "BlockColumns"
		//        });
		//        var oStkCheckDialog = new sap.m.Dialog({
		//            title: oi18n.getText("SOList.Dialog.Title.StockCheck"),
		//            type: "Message",
		//            state: "Success",
		//            draggable: true,
		//            icon: "sap-icon://check-availability",
		//            contentWidth: "60%",
		//            content: [this.Content],
		//            endButton: new sap.m.Button({
		//                icon: "sap-icon://accept",
		//                text: "OK",
		//                press: function () {
		//                    oStkCheckDialog.close();
		//                }
		//            }),
		//            afterClose: function () {
		//                oStkCheckDialog.destroy();
		//            }
		//        });
		//        var oModel = oView.getModel("SSGW_SLS");
		//        oStkCheckDialog.setModel(oModel, "SSGW_SLS");
		//        var oStockChkItems = this.getView().getModel("StockChecks").getProperty("/");
		//        var oStckCheckModel = new sap.ui.model.json.JSONModel();
		//        oStckCheckModel.setData(oStockChkItems);
		//        oStkCheckDialog.setModel(oStckCheckModel, "StockChecks");
		//        var oLocalData = oView.getModel("LocalViewSetting").getProperty("/");
		//        var oLocalModel = new sap.ui.model.json.JSONModel(oLocalData);
		//        oStkCheckDialog.setModel(oLocalModel, "LocalViewSetting");
		//        oStkCheckDialog.attachBrowserEvent("keydown", function (oEvt) {
		//            if (oEvt.keyCode === 27) {
		//                oEvt.stopPropagation();
		//                oEvt.preventDefault();
		//            }
		//        });
		//        oStkCheckDialog.open();
		//        if (this.getStockCheckDialog_Exit) {
		//            this.getStockCheckDialog_Exit();
		//        }
		//    },
		//    getStockCheckItems: function (SOItems, callback) {
		//        var that = this;
		//        this.getView().setBusy(true);
		//        var oModel = this.getView().getModel("SSGW_SLS");
		//        oModel.attachRequestSent(function () {
		//        });
		//        oModel.attachRequestCompleted(function () {
		//        });
		//        oModel.setHeaders({ "x-arteria-loginid": this.getCurrentUsers("SSSOToInvoices", "read") });
		//        oModel.read("/SSSOToInvoices", {
		//            filters: that.prepareItemsODataFilter(SOItems, "X"),
		//            success: function (oData) {
		//                that.setItemsData(oData);
		//                that.getView().setBusy(false);
		//                if (callback) {
		//                    callback();
		//                }
		//            },
		//            error: function (error) {
		//                that.getView().setBusy(false);
		//                oPPCCommon.dialogErrorMessage(error, oUtilsI18n.getText("common.Dialog.Error.ServiceError.Header"));
		//            }
		//        });
		//    },
		setItemsData: function (oData) {
			oData = oPPCCommon.formatItemsOData({ oData: oData });
			if (!this.getView().getModel("StockChecks")) {
				var oItemsModel = new sap.ui.model.json.JSONModel();
				oItemsModel.setData([]);
				this.getView().setModel(oItemsModel, "StockChecks");
			}
			if (oData.length > 0) {
				// var oItemsModel = new sap.ui.model.json.JSONModel();
				// oItemsModel.setData(oData);
				// oItemsModel.setSizeLimit(oData.length);
				// this.getView().setModel(oItemsModel, "StockChecks");
				this.getView().getModel("StockChecks").setData(oData);
				gListView.getModel("LocalViewSetting").setProperty("/StockChecksCount", oData.length);
			} else {
				if (this.getView().getModel("StockChecks")) {
					this.getView().getModel("StockChecks").setProperty("/", []);
					gListView.getModel("LocalViewSetting").setProperty("/StockChecksCount", 0);
				}
			}
		},
		//    displayStkChkMessage: function (msg) {
		//        var dialog1 = new sap.m.Dialog({
		//            title: "StcokCheck",
		//            type: "Message",
		//            state: "Success",
		//            icon: "sap-icon://message-warning",
		//            content: new sap.m.Text({ text: msg }),
		//            beginButton: new sap.m.Button({
		//                text: "OK",
		//                press: function () {
		//                    dialog1.close();
		//                }
		//            }),
		//            afterClose: function () {
		//                dialog1.destroy();
		//            }
		//        });
		//        dialog1.open();
		//        if (this.confirmDialog_exist) {
		//            this.confirmDialog_exist();
		//        }
		//    },
		//    displaySuccessMessage: function (msg) {
		//        var that = this;
		//        var messageType = this.getMessageType();
		//        var dialog = new sap.m.Dialog({
		//            title: messageType,
		//            type: "Message",
		//            state: "Success",
		//            icon: "sap-icon://message-success",
		//            content: new sap.m.Text({ text: msg }),
		//            beginButton: new sap.m.Button({
		//                text: "OK",
		//                press: function () {
		//                    gListView.getModel("LocalViewSetting").setProperty("/CashDiscPercVisible", false);
		//                    gListView.getModel("LocalViewSetting").setProperty("/CashDiscPerc", 0);
		//                    that.getSalesOrders();
		//                    dialog.close();
		//                }
		//            }),
		//            afterClose: function () {
		//                dialog.destroy();
		//            }
		//        });
		//        dialog.open();
		//        if (this.confirmDialog_exist) {
		//            this.confirmDialog_exist();
		//        }
		//    },
		//    getSalesOrders: function () {
		//        var oView = gListView;
		//        var that = this;
		//        var SOItemsListModel = this._oComponent.getModel("SSGW_SLS");
		//        oView.setBusy(true);
		//        this.getCurrentUsers("SSSOs", "read", function (LoginID) {
		//            SOItemsListModel.attachRequestSent(function () {
		//                oPPCCommon.setTableBusy(oView, ["UISOTable"], true);
		//            });
		//            SOItemsListModel.attachRequestCompleted(function () {
		//                oPPCCommon.setTableBusy(oView, ["UISOTable"], false);
		//            });
		//            SOItemsListModel.read("/SSSOs", {
		//                filters: that.prepareODataFilter(),
		//                success: function (oData) {
		//                    oData = oPPCCommon.formatItemsOData({ oData: oData });
		//                    if (oData.length > 0) {
		//                        if (oData.length > 0) {
		//                            for (var i = 0; i < oData.length; i++) {
		//                                oData[i].OrderNo = parseFloat(oData[i].OrderNo);
		//                            }
		//                            oView.getModel("LocalViewSetting").setProperty("/footerBtnVisible", true);
		//                            that.setSOItemsData(oData);
		//                        }
		//                    } else {
		//                        that.setNodataFound();
		//                    }
		//                    oView.setBusy(false);
		//                },
		//                error: function (error) {
		//                    that.setNodataFound();
		//                    oPPCCommon.dialogErrorMessage(error, oUtilsI18n.getText("common.Dialog.Error.ServiceError.Header"));
		//                    oView.setBusy(false);
		//                }
		//            });
		//        });
		//        if (this.getSalesOrders_Exit) {
		//            this.getSalesOrders_Exit();
		//        }
		//    },
		//    prepareODataFilter: function () {
		//        var oView = gListView;
		//        var SPGUID = oPPCCommon.getKeysFromTokens(oView, "multiInputSPNo");
		//        var CPGUID = oPPCCommon.getKeysFromTokens(oView, "multiInputCPNo");
		//        var sBeatGuid = oPPCCommon.getKeysFromTokens(oView, "FDescription");
		//        var SOItemsFilters = new Array();
		//        var SSSO = oPPCCommon.getKeysFromTokens(oView, "inputOrderNo");
		//        if (this.sCustomerInpuType === "DD") {
		//            SOItemsFilters = oPPCCommon.setODataModelReadFilter(oView, "", SOItemsFilters, "FromCPGUID", sap.ui.model.FilterOperator.EQ, [oView.byId("customer").getSelectedKey()], false, false, false);
		//        } else if (this.sCustomerInpuType === "VH") {
		//            SOItemsFilters = oPPCCommon.setODataModelReadFilter(oView, "inputCustomerNo", SOItemsFilters, "FromCPGUID", "", "", true, true, false);
		//        }
		//        SOItemsFilters = oPPCCommon.setODataModelReadFilter("", "", SOItemsFilters, "FromCPTypId", sap.ui.model.FilterOperator.EQ, [this.getSelectedCustomerType(this.getSelectedCustomerCode())], false, false, false);
		//        SOItemsFilters = oPPCCommon.setODataModelReadFilter(oView, "multiInputSPNo", SOItemsFilters, "SPGUID", sap.ui.model.FilterOperator.EQ, SPGUID.split(";"), true, false, false);
		//        SOItemsFilters = oPPCCommon.setODataModelReadFilter(oView, "multiInputCPNo", SOItemsFilters, "SoldToCPGUID", sap.ui.model.FilterOperator.EQ, CPGUID.split(";"), true, false, false);
		//        SOItemsFilters = oPPCCommon.setODataModelReadFilter(oView, "FDescription", SOItemsFilters, "BeatGuid", sap.ui.model.FilterOperator.EQ, sBeatGuid.split(";"), true, false, false);
		//        SOItemsFilters = oPPCCommon.setODataModelReadFilter(oView, "", SOItemsFilters, "SSSOGuid", sap.ui.model.FilterOperator.EQ, SSSO.split(";"), true, false, false);
		//        SOItemsFilters = oPPCCommon.setODataModelReadFilter(oView, "inputOrderType", SOItemsFilters, "OrderType", sap.ui.model.FilterOperator.EQ, oView.byId("inputOrderType").getSelectedKeys(), true, false, false);
		//        SOItemsFilters = oPPCCommon.setODataModelReadFilter(oView, "", SOItemsFilters, "OrderDate", sap.ui.model.FilterOperator.BT, [
		//            gFromDate,
		//            gToDate
		//        ], false, false, false);
		//        SOItemsFilters = oPPCCommon.setODataModelReadFilter(oView, "inputStatus", SOItemsFilters, "Status", sap.ui.model.FilterOperator.EQ, ["000001"], true, false, false);
		//        SOItemsFilters = oPPCCommon.setODataModelReadFilter(oView, "inputMaterial", SOItemsFilters, "MaterialNo", "", "", true, true, false);
		//        SOItemsFilters = oPPCCommon.setODataModelReadFilter(oView, "", SOItemsFilters, "LoginID", sap.ui.model.FilterOperator.EQ, [this.getCurrentUsers("SSSOs", "read")], false, false, false);
		//        if (this.prepareODataFilter_Exit) {
		//            SOItemsFilters = this.prepareODataFilter_Exit(SOItemsFilters);
		//        }
		//        return SOItemsFilters;
		//    },
		setSOItemsData: function (oData) {
			oData = oPPCCommon.formatItemsOData({ oData: oData });
			var that = this;
			var oView = gListView;
			for (var i = 0; i < oData.length; i++) {
				oData[i].GrossAmt = parseFloat(oData[i].GrossAmt);
				oData[i].TAX = parseFloat(oData[i].TAX);
				oData[i].NetPrice = parseFloat(oData[i].NetPrice);
				oData[i].Selected = false;
			}
			if (oView.getModel("SOItems")) {
				var oSOItemsModel = oView.getModel("SOItems");
				oSOItemsModel.setData(oData);
				oSOItemsModel.setSizeLimit(oData.length);
				that.setSOTableTitle(oData.length);
			}
			gSOListView.byId("bulkInvoice").setEnabled(true);
		},
		setNodataFound: function () {
			var oView = gListView;
			gSOListView.byId("bulkInvoice").setEnabled(true);
			oi18n = this._oComponent.getModel("i18n").getResourceBundle();
			oUtilsI18n = this._oComponent.getModel("ppcutili18n").getResourceBundle();
			if (oView.getModel("SOItems") !== undefined) {
				oView.getModel("SOItems").setProperty("/", {});
			}
			oView.byId("SOTable").setNoDataText(oUtilsI18n.getText("common.NoResultsFound"));
			oView.byId("UISOTable").setNoData(oUtilsI18n.getText("common.NoResultsFound"));
			this.setSOTableTitle(0);
		},
		//    setSOTableTitle: function (dataCount) {
		//        var oView = gListView;
		//        oView.getModel("LocalViewSetting").setProperty("/SOItemsCount", dataCount);
		//        if (dataCount > 0) {
		//            oView.byId("SOTableTitle").setText(oi18n.getText("List.Table.SO.header", [dataCount]));
		//            oView.byId("UISOTableTitle").setText(oi18n.getText("List.Table.SO.header", [dataCount]));
		//        } else {
		//            oView.byId("SOTableTitle").setText(oi18n.getText("List.Table.SO.tableHeader"));
		//            oView.byId("UISOTableTitle").setText(oi18n.getText("List.Table.SO.tableHeader"));
		//        }
		//    },
		//    getMessageType: function () {
		//        var msgsCount = sap.ui.getCore().getMessageManager().getMessageModel().getData().length;
		//        var messageType = "Information";
		//        if (msgsCount > 0) {
		//            var aMessageObjects = sap.ui.getCore().getMessageManager().getMessageModel().getData();
		//            for (var i = 0; i < msgsCount; i++) {
		//                var messageModel = aMessageObjects[i];
		//                if (messageModel.code === "/ARTEC/SS/176") {
		//                    messageType = "Success";
		//                    break;
		//                } else {
		//                    messageType = messageModel.type;
		//                    break;
		//                }
		//            }
		//        }
		//        if (this.getMessageType_exist) {
		//            messageType = this.getMessageType_exist();
		//        }
		//        return messageType;
		//    },
		//    getSelectedCustomerType: function (CPGUID) {
		//        var oView = gListView;
		//        var CustomerType = "";
		//        if (oView.getModel("Customers")) {
		//            var aCustData = oView.getModel("Customers").getProperty("/");
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
		//    getSelectedCustomerCode: function () {
		//        var oView = gListView;
		//        var CustomerCode = "";
		//        if (oView.byId("customer").getVisible()) {
		//            CustomerCode = oView.byId("customer").getSelectedKey();
		//        } else if (oView.byId("inputCustomerF4").getVisible()) {
		//            CustomerCode = oPPCCommon.getKeysFromTokens(oView, "inputCustomerF4");
		//        }
		//        return CustomerCode;
		//    },
		//    prepareItemsODataFilter: function (SOItems, sStockCheck) {
		//        var aFilters = new Array();
		//        var sLogInID = this.getCurrentUsers("SSSOToInvoices", "read");
		//        for (var i = 0; i < SOItems.length; i++) {
		//            aFilters.push(new sap.ui.model.Filter("SSSOGUID", sap.ui.model.FilterOperator.EQ, SOItems[i].SSSOGuid));
		//        }
		//        aFilters.push(new sap.ui.model.Filter("LoginID", sap.ui.model.FilterOperator.EQ, sLogInID));
		//        aFilters.push(new sap.ui.model.Filter("StockCheck", sap.ui.model.FilterOperator.EQ, sStockCheck));
		//        if (sStockCheck === "") {
		//            var oValue = gListView.getModel("LocalViewSetting").getProperty("/CashDiscPerc");
		//            aFilters.push(new sap.ui.model.Filter("CashDiscPerc", sap.ui.model.FilterOperator.EQ, oValue));
		//        }
		//        if (this.prepareItemsODataFilter_Exit) {
		//            this.prepareItemsODataFilter_Exit();
		//        }
		//        return aFilters;
		//    },
		// onCreateInvoice: function () {
		//     oPPCCommon.removeAllMsgs();
		//     var oView = gListView;
		//     var oValue = oView.getModel("LocalViewSetting").getProperty("/CashDiscPerc");
		//     oView.oController.validateCahDisc(oValue);
		//     if (oPPCCommon.doErrMessageExist()) {

		//         if (oView.getModel("SOItems")) {
		//             var oSOItems = oView.getModel("SOItems").getProperty("/");
		//             var selSOItems = [];
		//             var count = 0;
		//             for (var i = 0; i < oSOItems.length; i++) {
		//                 if (oSOItems[i].Selected) {
		//                     selSOItems.push(oSOItems[i]);
		//                     count++;
		//                 }
		//             }
		//             if (count > 0) {
		//                 this.confirmDialog(selSOItems);
		//             } else {
		//                 sap.ca.ui.message.showMessageToast("Please select atlease one Sales Order");
		//             }
		//         }
		//     }
		//     if (this.onCreateInvoice_Exit) {
		//         this.onCreateInvoice_Exit();
		//     }
		// },
		//    confirmDialog: function (SOItems) {
		//        var that = this;
		//        var dialog = new sap.m.Dialog({
		//            title: oi18n.getText("SOList.Dialog.Title.Confirm"),
		//            type: "Message",
		//            state: "Warning",
		//            icon: "sap-icon://message-warning",
		//            content: new sap.m.Text({ text: oi18n.getText("SOList.Dialog.Title.ConfirmCreate") }),
		//            beginButton: new sap.m.Button({
		//                text: "Yes",
		//                press: function () {
		//                    that.Create(SOItems);
		//                    dialog.close();
		//                }
		//            }),
		//            endButton: new sap.m.Button({
		//                text: "No",
		//                press: function () {
		//                    dialog.close();
		//                }
		//            }),
		//            afterClose: function () {
		//                dialog.destroy();
		//            }
		//        });
		//        dialog.open();
		//        if (this.confirmDialog_exist) {
		//            this.confirmDialog_exist();
		//        }
		//    },
		Create: function (SOItems) {
			var that = this;
			oUtilsI18n = this._oComponent.getModel("ppcutili18n").getResourceBundle();
			this.getView().setBusy(true);
			gSOListView.byId("bulkInvoice").setEnabled(false);
			var oModel = this.getView().getModel("SSGW_SLS");
			oModel.attachRequestSent(function () {
			});
			oModel.attachRequestCompleted(function () {
			});
			oModel.setHeaders({ "x-arteria-loginid": this.getCurrentUsers("SSSOToInvoices", "read") });
			oModel.read("/SSSOToInvoices", {
				filters: that.prepareItemsODataFilter(SOItems, ""),
				success: function (oData) {
					var msg = oPPCCommon.getMsgsFromMsgMgr();
					that.displaySuccessMessage(msg);
					that.getView().setBusy(false);
				},
				error: function (error) {
					that.getView().setBusy(false);
					oPPCCommon.dialogErrorMessage(error, oUtilsI18n.getText("common.Dialog.Error.ServiceError.Header"));
					gListView.getModel("LocalViewSetting").setProperty("/CashDiscPercVisible", false);
					gListView.getModel("LocalViewSetting").setProperty("/CashDiscPerc", 0);
					that.getSalesOrders();
				}
			});
			if (this.Create_exist) {
				this.Create_exist();
			}
		},
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
		//    }


		onPressBulkBilling: function () {

			var that = this;
			var OTable = gListView.byId('UISOTable')

			if (gListView.getModel("SOItems")) {
				var oSOItems = gListView.getModel("SOItems").getProperty("/");
				var selectedItems = [];
				var count = 0;
				for (var i = 0; i < oSOItems.length; i++) {
					if (oSOItems[i].Selected) {
						selectedItems.push({
							"Order": oSOItems[i].OrderNo.toString(),
							"Invoice": "",
							"Type": "",
							"Message": []
						});
						count++;
					}
				}
			}

			if (!selectedItems) {
				sap.m.MessageBox.error(
					"Select atleast one sale order to create invoice."
				);
				return;
			}

			let payload = {
				"Action": "B",
				"SoDetails": selectedItems
			};


			const bulkBillingModel = this.getView().getModel("bulkBillingService");

			var that = this;

			sap.ui.core.BusyIndicator.show();
			bulkBillingModel.create("/BulkInvoiceSet", payload, {
				success: function (oSucess) {
					sap.ui.core.BusyIndicator.hide();
					that.getView().getModel("jsonBulkInvoiceDetailsModel").setData(null);
					that.getView().getModel("jsonBulkInvoiceDetailsModel").setData(oSucess.SoDetails.results);

					if (!that.BulkInvoiceDetails) {
						that.BulkInvoiceDetails = sap.ui.xmlfragment("com.arteriatech.ss.soinvcreate.cp.zsssoinvcreate0cp.view.fragments.BulkInvoiceDetails", that);
						that.getView().addDependent(that.BulkInvoiceDetails);
					}
					that.BulkInvoiceDetails.open();

				},
				error: function (oError) {
					sap.ui.core.BusyIndicator.hide();
					sap.m.MessageBox.error(
						"Something Went Wrong"
					);
				}
			});
		},
		onPressSimulation: function () {

			var that = this;
			var OTable = gListView.byId('UISOTable')

			if (gListView.getModel("SOItems")) {
				var oSOItems = gListView.getModel("SOItems").getProperty("/");
				var selectedItems = [];
				var count = 0;
				for (var i = 0; i < oSOItems.length; i++) {
					if (oSOItems[i].Selected) {
						selectedItems.push({
							"Order": oSOItems[i].OrderNo.toString(),
							"Invoice": "",
							"Type": "",
							"Message": []
						});
						count++;
					}
				}
			}

			if (!selectedItems) {
				sap.m.MessageBox.error(
					"Select atleast one sale order to proceed."
				);
				return;
			}

			let payload = {
				"Action": "S",
				"SoDetails": selectedItems
			};


			const bulkBillingModel = this.getView().getModel("bulkBillingService");

			var that = this;

			sap.ui.core.BusyIndicator.show();
			bulkBillingModel.create("/BulkInvoiceSet", payload, {
				success: function (oSucess) {
					sap.ui.core.BusyIndicator.hide();
					that.getView().getModel("jsonBulkInvoiceDetailsModel").setData(null);
					that.getView().getModel("jsonBulkInvoiceDetailsModel").setData(oSucess.SoDetails.results);

					if (!that.BulkInvoiceSimulation) {
						that.BulkInvoiceSimulation = sap.ui.xmlfragment("com.arteriatech.ss.soinvcreate.cp.zsssoinvcreate0cp.view.fragments.BulkInvoiceSimulation", that);
						that.getView().addDependent(that.BulkInvoiceSimulation);
					}
					that.BulkInvoiceSimulation.open();

				},
				error: function (oError) {
					sap.ui.core.BusyIndicator.hide();
					sap.m.MessageBox.error(
						"Something Went Wrong"
					);
				}
			});
		},
		onSearchBulkInvoiceDetails: function (oEvent) {
			const sValue = oEvent.getParameter("value");
			let oFilter = new sap.ui.model.Filter({
				filters: [
					new sap.ui.model.Filter("Order", sap.ui.model.FilterOperator.Contains, sValue),
					new sap.ui.model.Filter("Invoice", sap.ui.model.FilterOperator.Contains, sValue),
					new sap.ui.model.Filter("Type", sap.ui.model.FilterOperator.Contains, sValue),
				],
				and: false
			});
			let oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},
		onPressLineItem: function (oEvent) {

			let Order = oEvent.getSource().oBindingContexts.jsonBulkInvoiceDetailsModel.getObject().Order;
			if (!Order) {
				return;
			}
			let Type = oEvent.getSource().oBindingContexts.jsonBulkInvoiceDetailsModel.getObject().Type;
			if (!Type) {
				return;
			}

			var oJsonBulkInvoiceDetailsModel = this.getView().getModel("jsonBulkInvoiceDetailsModel");
			const { oData } = oJsonBulkInvoiceDetailsModel;
			const copiedArray = [...oData];
			const result = copiedArray.filter((item) => item.Order == Order);

			if (!result) {
				return;
			}

			var finalData = result[0].Message.results;
			if (!finalData) {
				return;
			}

			var oJsonMessageDetailsModel = this.getView().getModel("jsonMessageDetailsModel");
			oJsonMessageDetailsModel.setData(null);
			oJsonMessageDetailsModel.setData(finalData);
			oJsonMessageDetailsModel.refresh();

			var that = this;

			if (!that.MessageDetails) {
				that.MessageDetails = sap.ui.xmlfragment("com.arteriatech.ss.soinvcreate.cp.zsssoinvcreate0cp.view.fragments.MessageDetails", that);
				that.getView().addDependent(that.MessageDetails);
			}
			that.MessageDetails.open();


		},
		onConfirmBulkInvoiceDetails: function (oEvent) {
			let Order = oEvent.getParameter("selectedItem").getCells()[0].getText();
			if (!Order) {
				return;
			}
			let Type = oEvent.getParameter("selectedItem").getCells()[2].getText();
			if (!Type) {
				return;
			}

			var oJsonBulkInvoiceDetailsModel = this.getView().getModel("jsonBulkInvoiceDetailsModel");
			const { oData } = oJsonBulkInvoiceDetailsModel;
			const copiedArray = [...oData];
			const result = copiedArray.filter((item) => item.Order == Order);

			if (!result) {
				return;
			}

			var finalData = result[0].Message.results;
			if (!finalData) {
				return;
			}

			var oJsonMessageDetailsModel = this.getView().getModel("jsonMessageDetailsModel");
			oJsonMessageDetailsModel.setData(null);
			oJsonMessageDetailsModel.setData(finalData);
			oJsonMessageDetailsModel.refresh();

			var that = this;

			if (!that.MessageDetails) {
				that.MessageDetails = sap.ui.xmlfragment("com.arteriatech.ss.soinvcreate.cp.zsssoinvcreate0cp.view.fragments.MessageDetails", that);
				that.getView().addDependent(that.MessageDetails);
			}
			that.MessageDetails.open();
		},
		onSearchMessageDetails: function (oEvent) {
			const sValue = oEvent.getParameter("value");
			let oFilter = new sap.ui.model.Filter({
				filters: [
					new sap.ui.model.Filter("Type", sap.ui.model.FilterOperator.Contains, sValue),
					new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.Contains, sValue),
					new sap.ui.model.Filter("Number", sap.ui.model.FilterOperator.Contains, sValue),
					new sap.ui.model.Filter("Message", sap.ui.model.FilterOperator.Contains, sValue),
				],
				and: false
			});
			let oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},
		onCloseBulkInvoiceDetailsDialog: function () {
			var that = this;
			that.BulkInvoiceDetails.close();
			that.BulkInvoiceDetails.destroy();
			that.BulkInvoiceDetails = null;
			location.reload();
		},
		onCloseBulkInvoiceSimulationDialog : function(){
			var that = this;
			that.BulkInvoiceSimulation.close();
			that.BulkInvoiceSimulation.destroy();
			that.BulkInvoiceSimulation = null;
		}
	});
});