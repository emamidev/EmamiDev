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

        return BaseController.extend("com.emami.spc.controller.Home", {
            formatter: formatter,

            onInit: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("RouteHome").attachPatternMatched(this._onObjectMatched, this);
            },

            _onObjectMatched: function (oEvent) {

                var MaterialType = null;
                this.fnSetAppTitle(MaterialType);

                var that = this;
                var oModel = this.getView().getModel();

                var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;

                this.fnRefreshModel();

                BusyIndicator.show();
                oModel.read("/UserInfoSet('')", {
                    success: function (oSuccess) {
                        var oJsonCentralModel = that.getView().getModel("jsonCentralModel");

                        if (oSuccess.Type == 'I' || oSuccess.Type == 'A' || oSuccess.Type == 'R') {
                            oJsonCentralModel.setProperty("/UserInfo", oSuccess);
                            BusyIndicator.hide();
                        }
                    },

                    error: function (oError) {
                        var error = JSON.parse(oError.responseText);
                        var message = error.error.message.value;
                        BusyIndicator.hide();

                        MessageBox.error(
                            message, {
                            styleClass: bCompact ? "sapUiSizeCompact" : ""
                        }
                        );

                    }
                });

            },

            fnRefreshModel: function () {
                this.getView().getModel("jsonCentralModel").setProperty("/UserInfo", {});
            },

            onPressPackagingMaterial: function () {

                // sap.m.MessageBox.error("Please close this to redirect......", {
                //     onClose: function () {
                //         window.open("https://emamiapp.emamigroup.com:8097/sap/bc/ui5_ui5/sap/ZMM_PAK_SPEC_MG/index.html", "_blank");
                //     }
                // });

                var oJsonCentralModel = this.getView().getModel("jsonCentralModel");
                var UserInfo = oJsonCentralModel.getProperty("/UserInfo");

                if(UserInfo.Type == 'I' || UserInfo.Type == 'A' || UserInfo.Type == 'R' ){
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("RoutePMList", {
                        MaterialType: 'PM',
                        User : UserInfo.Type
                    });
                }

            },
            onPressFinishedGoods: function () {

                var oJsonCentralModel = this.getView().getModel("jsonCentralModel");
                var UserInfo = oJsonCentralModel.getProperty("/UserInfo");

                return;

                if (UserInfo.Type == 'I' || UserInfo.Type == 'A' || UserInfo.Type == 'R') {
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("RouteRequestList", {
                        MaterialType: 'FG',
                        User: UserInfo.Type
                    });
                }
            },
            onPressRawMaterial: function () {

                // sap.m.MessageBox.error("Please close this to redirect......", {
                //     onClose: function () {
                //         window.open("https://emamiapp.emamigroup.com:8097/sap/bc/ui5_ui5/sap/ZMM_PAK_SPEC_MG/index.html", "_blank");
                //     }
                // });

                var oJsonCentralModel = this.getView().getModel("jsonCentralModel");
                var UserInfo = oJsonCentralModel.getProperty("/UserInfo");


                if (UserInfo.Type == 'I' || UserInfo.Type == 'A' || UserInfo.Type == 'R') {
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("RouteRMList", {
                        MaterialType: 'RM',
                        User: UserInfo.Type
                    });
                }

            },
            onPressPerfumeMaterial: function () {

                // sap.m.MessageBox.error("Please close this to redirect......", {
                //     onClose: function () {
                //         window.open("https://emamiapp.emamigroup.com:8097/sap/bc/ui5_ui5/sap/ZMM_PAK_SPEC_MG/index.html", "_blank");
                //     }
                // });

                var oJsonCentralModel = this.getView().getModel("jsonCentralModel");
                var UserInfo = oJsonCentralModel.getProperty("/UserInfo");

                if (UserInfo.Type == 'I' || UserInfo.Type == 'A' || UserInfo.Type == 'R') {
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("RoutePerfumeList", {
                        MaterialType: 'Perfume',
                        User: UserInfo.Type
                    });
                }

            }
        });
    });
