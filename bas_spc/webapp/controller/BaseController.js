sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/BusyIndicator",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
  ],
  function (Controller, BusyIndicator, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("com.emami.spc.controller.BaseController", {


      onPressHome: function () {
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("RouteHome");
      },

      fnSetAppTitle: function (MaterialType) {

        var oJsonCentralModel = this.getView().getModel("jsonCentralModel");

        if (MaterialType !== null) {
          switch (MaterialType) {
            case "PM":
              oJsonCentralModel.setProperty("/AppTitle", "Packaging Material Specification");
              break;
            case "FG":
              oJsonCentralModel.setProperty("/AppTitle", "Finished Goods Material Specification");
              break;
            case "RM":
              oJsonCentralModel.setProperty("/AppTitle", "Raw Material Specification");
              break;
            case "Perfume":
              oJsonCentralModel.setProperty("/AppTitle", "Perfume Material Specification");
              break;
          }
        } else {
          oJsonCentralModel.setProperty("/AppTitle", "Material Specification");
        }
      },

      fnCreateBtnVisibility: function (UserType) {
        var oJsonCentralModel = this.getView().getModel("jsonCentralModel");

        switch (UserType) {
          case 'I':
            oJsonCentralModel.setProperty("/Home/VisibleCreateBtn", true);
            break;
          case 'R':
            oJsonCentralModel.setProperty("/Home/VisibleCreateBtn", false);
            break;
          case 'A':
            oJsonCentralModel.setProperty("/Home/VisibleCreateBtn", false);
            break;
        }
      },

      fnSetUserType: function (UserType) {
        var oJsonCentralModel = this.getView().getModel("jsonCentralModel");
        oJsonCentralModel.setProperty("/UserType", UserType);
      },

      fnSetPMEditable: function (UserType) {
        var oJsonCentralModel = this.getView().getModel("jsonCentralModel");

        switch (UserType) {
          case 'I':
            // oJsonCentralModel.setProperty("/PackagingMaterialEditable/All", true);
            oJsonCentralModel.setProperty("/PackagingMaterial/Editable/All", true);
            break;
          case 'R':
          case 'A':
            // oJsonCentralModel.setProperty("/PackagingMaterialEditable/All", false);
            oJsonCentralModel.setProperty("/PackagingMaterial/Editable/All", false);
        }
      },
      fnSetRMEditable: function (UserType) {
        var oJsonCentralModel = this.getView().getModel("jsonCentralModel");

        switch (UserType) {
          case 'I':
            oJsonCentralModel.setProperty("/RawMaterial/Editable/All", true);
            break;
          case 'R':
          case 'A':
            oJsonCentralModel.setProperty("/RawMaterial/Editable/All", false);
        }
      },
      fnSetRMEditablePRM: function (UserType) {
        var oJsonCentralModel = this.getView().getModel("jsonCentralModel");

        switch (UserType) {
          case 'I':
            oJsonCentralModel.setProperty("/PerfumeMaterial/Editable/All", true);
            break;
          case 'R':
          case 'A':
            oJsonCentralModel.setProperty("/PerfumeMaterial/Editable/All", false);
        }
      },

      fnSetPMBtnVisibility: function (UserType) {
        var oJsonCentralModel = this.getView().getModel("jsonCentralModel");

        switch (UserType) {
          case 'I':
            oJsonCentralModel.setProperty("/PackagingMaterial/Visible/SaveBtn", true);
            oJsonCentralModel.setProperty("/PackagingMaterial/Visible/AcceptBtn", false);
            oJsonCentralModel.setProperty("/PackagingMaterial/Visible/RejectBtn", false);
            break;
          case 'R':
          case 'A':
            oJsonCentralModel.setProperty("/PackagingMaterial/Visible/SaveBtn", false);
            oJsonCentralModel.setProperty("/PackagingMaterial/Visible/CreateReferenceBtn", false);
            oJsonCentralModel.setProperty("/PackagingMaterial/Visible/AcceptBtn", true);
            oJsonCentralModel.setProperty("/PackagingMaterial/Visible/RejectBtn", true);
        }
      },
      fnSetRMBtnVisibility: function (UserType) {
        var oJsonCentralModel = this.getView().getModel("jsonCentralModel");

        switch (UserType) {
          case 'I':
            oJsonCentralModel.setProperty("/RawMaterial/Visible/SaveBtn", true);
            oJsonCentralModel.setProperty("/RawMaterial/Visible/AcceptBtn", false);
            oJsonCentralModel.setProperty("/RawMaterial/Visible/RejectBtn", false);
            break;
          case 'R':
          case 'A':
            oJsonCentralModel.setProperty("/RawMaterial/Visible/SaveBtn", false);
            oJsonCentralModel.setProperty("/RawMaterial/Visible/CreateReferenceBtn", false);
            oJsonCentralModel.setProperty("/RawMaterial/Visible/AcceptBtn", true);
            oJsonCentralModel.setProperty("/RawMaterial/Visible/RejectBtn", true);
        }
      },
      fnSetRMBtnVisibilityPRM: function (UserType) {
        var oJsonCentralModel = this.getView().getModel("jsonCentralModel");

        switch (UserType) {
          case 'I':
            oJsonCentralModel.setProperty("/PerfumeMaterial/Visible/SaveBtn", true);
            oJsonCentralModel.setProperty("/PerfumeMaterial/Visible/AcceptBtn", false);
            oJsonCentralModel.setProperty("/PerfumeMaterial/Visible/RejectBtn", false);
            break;
          case 'R':
          case 'A':
            oJsonCentralModel.setProperty("/PerfumeMaterial/Visible/SaveBtn", false);
            oJsonCentralModel.setProperty("/PerfumeMaterial/Visible/CreateReferenceBtn", false);
            oJsonCentralModel.setProperty("/PerfumeMaterial/Visible/AcceptBtn", true);
            oJsonCentralModel.setProperty("/PerfumeMaterial/Visible/RejectBtn", true);
        }
      },

      onDeleteRevision: function (oEvent) {
        var sPath = oEvent.getSource().getParent().oBindingContexts.jsonCentralModel.sPath;
        var Clicked = this.getView().getModel("jsonCentralModel").getProperty(sPath);
        var oModel = this.getView().getModel("jsonCentralModel");
        var Data = oModel.getProperty("/RawMaterial/Data/RevisionLog/results");
        var parts = sPath.split("-")
        var lastValue = parts[parts.length - 1]
        var numericValue = lastValue.replace(/\D/g, '');
        var index = numericValue
        Data.splice(index, 1);
        oModel.setProperty("/RawMaterial/Data/RevisionLog/results", Data);
        oModel.refresh();
      },
      onDeleteRevisionPRM: function (oEvent) {
        var sPath = oEvent.getSource().getParent().oBindingContexts.jsonCentralModel.sPath;
        var Clicked = this.getView().getModel("jsonCentralModel").getProperty(sPath);
        var oModel = this.getView().getModel("jsonCentralModel");
        var Data = oModel.getProperty("/PerfumeMaterial/Data/PRMRevisionLog/results");
        var parts = sPath.split("-")
        var lastValue = parts[parts.length - 1]
        var numericValue = lastValue.replace(/\D/g, '');
        var index = numericValue
        Data.splice(index, 1);
        oModel.setProperty("/PerfumeMaterial/Data/PRMRevisionLog/results", Data);
        oModel.refresh();
      },

      onAddRevisionItem: function () {
        var oModel = this.getView().getModel("jsonCentralModel");
        var Data = oModel.getProperty("/RawMaterial/Data/RevisionLog/results");
        var Matnr = oModel.getProperty("/RawMaterial/Data/Matnr");
        Data.push({
          "Matnr": Matnr,
          "Versn": "",
          "Revlg": "",
          "Revdt": null
        });

        oModel.setProperty("/RawMaterial/Data/RevisionLog/results", Data);
        oModel.refresh();
      },
      onAddRevisionItemPRM: function () {
        var oModel = this.getView().getModel("jsonCentralModel");
        var Data = oModel.getProperty("/PerfumeMaterial/Data/PRMRevisionLog/results");
        var Matnr = oModel.getProperty("/PerfumeMaterial/Data/Matnr");
        Data.push({
          "Matnr": Matnr,
          "Versn": "",
          "Revlg": "",
          "Revdt": null
        });

        oModel.setProperty("/PerfumeMaterial/Data/PRMRevisionLog/results", Data);
        oModel.refresh();
      },
      onDeleteApproved: function (oEvent) {
        var sPath = oEvent.getSource().getParent().oBindingContexts.jsonCentralModel.sPath;
        var Clicked = this.getView().getModel("jsonCentralModel").getProperty(sPath);
        var oModel = this.getView().getModel("jsonCentralModel");
        var Data = oModel.getProperty("/RawMaterial/Data/ApprovedVendors/results");
        var parts = sPath.split("-")
        var lastValue = parts[parts.length - 1]
        var numericValue = lastValue.replace(/\D/g, '');
        var index = numericValue
        Data.splice(index, 1);
        oModel.setProperty("/RawMaterial/Data/ApprovedVendors/results", Data);
        oModel.refresh();
      },
      onDeleteApprovedPRM: function (oEvent) {
        var sPath = oEvent.getSource().getParent().oBindingContexts.jsonCentralModel.sPath;
        var Clicked = this.getView().getModel("jsonCentralModel").getProperty(sPath);
        var oModel = this.getView().getModel("jsonCentralModel");
        var Data = oModel.getProperty("/PerfumeMaterial/Data/PRMApprovedVendor/results");
        var parts = sPath.split("-")
        var lastValue = parts[parts.length - 1]
        var numericValue = lastValue.replace(/\D/g, '');
        var index = numericValue
        Data.splice(index, 1);
        oModel.setProperty("/PerfumeMaterial/Data/PRMApprovedVendor/results", Data);
        oModel.refresh();
      },
      onAddApprovedItem: function () {
        var oModel = this.getView().getModel("jsonCentralModel");
        var Data = oModel.getProperty("/RawMaterial/Data/ApprovedVendors/results");
        var length = Data.length;

        var ItemNumber;
        if (length > 0) {
          ItemNumber = Number(Data[length - 1].Posnr) + 1
          ItemNumber = ItemNumber.toString();
        } else {
          ItemNumber = "1";
        }
        Data.push({
          "Posnr": ItemNumber,
          "Approvedmfd": "",
          "Siteplant": "",
          "Tradename": "",
          "Packsize": ""
        });

        oModel.setProperty("/RawMaterial/Data/ApprovedVendors/results", Data);
        oModel.refresh();
      },
      onAddApprovedItemPRM: function () {
        var oModel = this.getView().getModel("jsonCentralModel");
        var Data = oModel.getProperty("/PerfumeMaterial/Data/PRMApprovedVendor/results");
        var length = Data.length;

        var ItemNumber;
        if (length > 0) {
          ItemNumber = Number(Data[length - 1].Posnr) + 1
          ItemNumber = ItemNumber.toString();
        } else {
          ItemNumber = "1";
        }
        Data.push({
          "Posnr": ItemNumber,
          "Approvedmfd": "",
          "Siteplant": "",
          "Tradename": "",
          "Packsize": ""
        });

        oModel.setProperty("/PerfumeMaterial/Data/PRMApprovedVendors/results", Data);
        oModel.refresh();
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
      onDeleteSpecificationPRM: function (oEvent) {

        var sPath = oEvent.getSource().getParent().oBindingContexts.jsonCentralModel.sPath;
        var Clicked = this.getView().getModel("jsonCentralModel").getProperty(sPath);
        var oModel = this.getView().getModel("jsonCentralModel");
        var Data = oModel.getProperty("/PerfumeMaterial/Data/PspecificationItemSet/results");

        var NewData = Data.filter(item => item.Lineitm != Clicked.Lineitm);
        oModel.setProperty("/PerfumeMaterial/Data/PspecificationItemSet/results", NewData);
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

      },

      onAddSpecificationItemPR: function () {
        var oModel = this.getView().getModel("jsonCentralModel");
        var Data = oModel.getProperty("/PerfumeMaterial/Data/PspecificationItemSet/results");

        var Matnr = oModel.getProperty("/PerfumeMaterial/Data/Matnr");

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

        oModel.setProperty("/PerfumeMaterial/Data/PspecificationItemSet/results", Data);
        oModel.refresh();

      },

      onChangeOperator: function (oEvent) {
        let key = oEvent.mParameters.selectedItem.mProperties.key;
        // oEvent.getSource().setSelectedKey(key);
        let sPath = oEvent.oSource.mBindingInfos.selectedKey.binding.oContext.sPath;

        let oModel = this.getView().getModel("jsonCentralModel");
        let Data = oModel.getProperty(sPath);
        Data.Operator = key;
        oModel.setProperty(sPath, Data);
        oModel.refresh();
      },

      onTestsValueHelpReq: function (oEvent) {

        var sPath = oEvent.getSource().getParent().oBindingContexts.jsonCentralModel.sPath;
        var oModel = this.getView().getModel("jsonCentralModel");
        oModel.setProperty("/RawMaterial/SelectedTestPath", sPath);
        var that = this;

        if (!that.TestListDialog) {
          that.TestListDialog = sap.ui.xmlfragment("com.emami.spc.view.fragments.TestListDialog", that);
          that.getView().addDependent(that.TestListDialog);
        }
        that.TestListDialog.open();
      },
      onTestsValueHelpReqPM: function (oEvent) {

        var sPath = oEvent.getSource().getParent().oBindingContexts.jsonCentralModel.sPath;
        var oModel = this.getView().getModel("jsonCentralModel");
        oModel.setProperty("/PerfumeMaterial/SelectedTestPath", sPath);
        var that = this;

        if (!that.TestListDialog) {
          that.TestListDialog = sap.ui.xmlfragment("com.emami.spc.view.fragments.TestListDialog", that);
          that.getView().addDependent(that.TestListDialog);
        }
        that.TestListDialog.open();
      },

      onUomValueHelpReq: function (oEvent) {

        var sPath = oEvent.getSource().getParent().oBindingContexts.jsonCentralModel.sPath;
        var oModel = this.getView().getModel("jsonCentralModel");
        oModel.setProperty("/RawMaterial/SelectedTestPath", sPath);
        var that = this;

        if (!that.UomListDialog) {
          that.UomListDialog = sap.ui.xmlfragment("com.emami.spc.view.fragments.UomListDialog", that);
          that.getView().addDependent(that.UomListDialog);
        }
        that.UomListDialog.open();

      },
      onUomValueHelpReqPRM: function (oEvent) {

        var sPath = oEvent.getSource().getParent().oBindingContexts.jsonCentralModel.sPath;
        var oModel = this.getView().getModel("jsonCentralModel");
        oModel.setProperty("/PerfumeMaterial/SelectedTestPath", sPath);
        var that = this;

        if (!that.UomListDialog) {
          that.PRMUomListDialog = sap.ui.xmlfragment("com.emami.spc.view.fragments.PRMUomListDialog", that);
          that.getView().addDependent(that.PRMUomListDialog);
        }
        that.PRMUomListDialog.open();

      },
      onUomValueHelpReqPM: function (oEvent) {

        var sPath = oEvent.getSource().getParent().oBindingContexts.jsonCentralModel.sPath;
        var oModel = this.getView().getModel("jsonCentralModel");
        oModel.setProperty("/PackagingMaterial/SelectedUnitPath", sPath);
        var that = this;

        if (!that.PMUomListDialog) {
          that.PMUomListDialog = sap.ui.xmlfragment("com.emami.spc.view.fragments.PMUomListDialog", that);
          that.getView().addDependent(that.PMUomListDialog);
        }
        that.PMUomListDialog.open();

      },
      onSearchTestListDialog: function (oEvent) {

        var sValue = oEvent.getParameter("value");

        var oFilter = new sap.ui.model.Filter({
          filters: [
            new Filter("Mkmnr", sap.ui.model.FilterOperator.Contains, sValue),
            new Filter("Tests", sap.ui.model.FilterOperator.Contains, sValue),
            new Filter("AtpReference", sap.ui.model.FilterOperator.Contains, sValue),
            new Filter("Quantitative", sap.ui.model.FilterOperator.Contains, sValue),
            new Filter("Qualitative", sap.ui.model.FilterOperator.Contains, sValue)
          ],
          and: false
        });
        var oBinding = oEvent.getSource().getBinding("items");
        oBinding.filter([oFilter]);
      },

      onSearchUomListDialog: function (oEvent) {
        var sValue = oEvent.getParameter("value");

        var oFilter = new sap.ui.model.Filter({
          filters: [
            new Filter("Msehi", sap.ui.model.FilterOperator.Contains, sValue),
            new Filter("Msehl", sap.ui.model.FilterOperator.Contains, sValue)
          ],
          and: false
        });
        var oBinding = oEvent.getSource().getBinding("items");
        oBinding.filter([oFilter]);
      },
      onSearchUomListDialogPRM: function (oEvent) {
        var sValue = oEvent.getParameter("value");

        var oFilter = new sap.ui.model.Filter({
          filters: [
            new Filter("Msehi", sap.ui.model.FilterOperator.Contains, sValue),
            new Filter("Msehl", sap.ui.model.FilterOperator.Contains, sValue)
          ],
          and: false
        });
        var oBinding = oEvent.getSource().getBinding("items");
        oBinding.filter([oFilter]);
      },
      onSearchUomListDialogPM: function (oEvent) {
        var sValue = oEvent.getParameter("value");

        var oFilter = new sap.ui.model.Filter({
          filters: [
            new Filter("Msehi", sap.ui.model.FilterOperator.Contains, sValue),
            new Filter("Msehl", sap.ui.model.FilterOperator.Contains, sValue)
          ],
          and: false
        });
        var oBinding = oEvent.getSource().getBinding("items");
        oBinding.filter([oFilter]);
      },
      onPressTestLineItem: function (oEvent) {

        var Quantitative = oEvent.getParameter("selectedItem").getCells()[0].getText();
        var Qualitative = oEvent.getParameter("selectedItem").getCells()[1].getText();
        var Tests = oEvent.getParameter("selectedItem").getCells()[2].getText();
        var AtpReference = oEvent.getParameter("selectedItem").getCells()[3].getText();
        var Mic = oEvent.getParameter("selectedItem").getCells()[4].getText();

        var oModel = this.getView().getModel("jsonCentralModel");
        var sPath = oModel.getProperty("/RawMaterial/SelectedTestPath");

        var sPathPM = oModel.getProperty("/PerfumeMaterial/SelectedTestPath");
        if (sPathPM) {
          var Clicked = oModel.getProperty(sPathPM);
          var Data = oModel.getProperty("/PerfumeMaterial/Data/PspecificationItemSet/results");
          var fnLogic = (item) => {
            if (item.Lineitm == Clicked.Lineitm) {
              item.Quantitative = Quantitative;
              item.Qualitative = Qualitative;
              item.Tests = Tests;
              item.AtpReference = AtpReference;
              item.Mkmnr = Mic;
            }
            return item;
          };
          if (Data) {
            Data = Data.map(fnLogic);
          }
          oModel.setProperty("/PerfumeMaterial/Data/PspecificationItemSet/results", Data);
          oModel.setProperty("/PerfumeMaterial/SelectedTestPath", "");
          oModel.refresh();
        } else {
          var Clicked = oModel.getProperty(sPath);
          var Data = oModel.getProperty("/RawMaterial/Data/SpecificationItem/results");
          var fnLogic = (item) => {
            if (item.Lineitm == Clicked.Lineitm) {
              item.Quantitative = Quantitative;
              item.Qualitative = Qualitative;
              item.Tests = Tests;
              item.AtpReference = AtpReference;
              item.Mkmnr = Mic;
            }
            return item;
          };
          if (Data) {
            Data = Data.map(fnLogic);
          }
          oModel.setProperty("/RawMaterial/Data/SpecificationItem/results", Data);
          oModel.setProperty("/RawMaterial/SelectedTestPath", "");
          oModel.refresh();
        }

        // var Clicked = oModel.getProperty(sPath);
        // var Data = oModel.getProperty("/RawMaterial/Data/SpecificationItem/results");
        // var fnLogic = (item) => {
        //   if (item.Lineitm == Clicked.Lineitm) {
        //     item.Quantitative = Quantitative;
        //     item.Qualitative = Qualitative;
        //     item.Tests = Tests;
        //     item.AtpReference = AtpReference;
        //     item.Mkmnr = Mic;
        //   }
        //   return item;
        // };
        // if (Data) {
        //   Data = Data.map(fnLogic);
        // }
        // oModel.setProperty("/RawMaterial/Data/SpecificationItem/results", Data);
        // oModel.refresh();


      },

      onPressUomLineItem: function (oEvent) {
        var Msehi = oEvent.getParameter("selectedItem").getCells()[0].getText();

        var oModel = this.getView().getModel("jsonCentralModel");
        var sPath = oModel.getProperty("/RawMaterial/SelectedTestPath");

        var Clicked = oModel.getProperty(sPath);

        let low = Clicked.Lowvalue;
        let high = Clicked.Uppervalue;
        let Text = "";
        let operator = Clicked.Operator;
        if (low) {
          Text = `${low}`;
        }
        if (high) {
          Text = `${high}`;
        }
        if (low && high) {
          Text = `${low} To ${high}`;
        }
        if (operator) {
          Text = `${operator} ${Text}`;
        }

        var Data = oModel.getProperty("/RawMaterial/Data/SpecificationItem/results");

        var fnLogic = (item) => {
          if (item.Lineitm == Clicked.Lineitm) {
            item.Uom = Msehi;
            item.Specification = Text;
          }
          return item;
        };

        if (Data) {
          Data = Data.map(fnLogic);
        }

        oModel.setProperty("/RawMaterial/Data/SpecificationItem/results", Data);
        oModel.refresh();
      },
      onPressUomLineItemPRM: function (oEvent) {
        var Msehi = oEvent.getParameter("selectedItem").getCells()[0].getText();
        var oModel = this.getView().getModel("jsonCentralModel");
        var sPath = oModel.getProperty("/PerfumeMaterial/SelectedTestPath");

        var Clicked = oModel.getProperty(sPath);

        let low = Clicked.Lowvalue;
        let high = Clicked.Uppervalue;
        let Text = "";
        let operator = Clicked.Operator;
        if (low) {
          Text = `${low}`;
        }
        if (high) {
          Text = `${high}`;
        }
        if (low && high) {
          Text = `${low} To ${high}`;
        }
        if (operator) {
          Text = `${operator} ${Text}`;
        }

        var Data = oModel.getProperty("/PerfumeMaterial/Data/PspecificationItemSet/results");

        var fnLogic = (item) => {
          if (item.Lineitm == Clicked.Lineitm) {
            item.Uom = Msehi;
            item.Specification = Text;
          }
          return item;
        };

        if (Data) {
          Data = Data.map(fnLogic);
        }

        oModel.setProperty("/PerfumeMaterial/Data/PspecificationItemSet/results", Data);
        oModel.refresh();
      },
      onPressUomLineItemPM: function (oEvent) {
        var Msehi = oEvent.getParameter("selectedItem").getCells()[0].getText();

        var oModel = this.getView().getModel("jsonCentralModel");
        var sPath = oModel.getProperty("/PackagingMaterial/SelectedUnitPath");
        var Clicked = oModel.getProperty(sPath);
        Clicked.Meins = Msehi;
        oModel.setProperty(sPath, Clicked);
        oModel.refresh();
      },

      onUOMLineitemChange: function (oEvent) {

        var sPath = oEvent.oSource.oParent.oBindingContexts.jsonCentralModel.sPath;
        var oModel = this.getView().getModel("jsonCentralModel");
        let low = oModel.getProperty(sPath + "/Lowvalue");
        let high = oModel.getProperty(sPath + "/Uppervalue");
        let Text = "";
        let operator = oModel.getProperty(sPath + "/Operator");

        if (low) {
          Text = `${low}`;
        }
        if (high) {
          Text = `${high}`;
        }
        if (low && high) {
          Text = `${low} To ${high}`;
        }
        if (operator) {
          Text = `${operator} ${Text}`;
        }
        oModel.setProperty(sPath + "/Specification", Text);
        oModel.refresh();
      },
      fnRMSearchHelp: function () {
        var that = this;
        var oModel = this.getView().getModel();

        oModel.read("/RMTestListSet",
          {
            success: function (oSuccess) {

              var oJsonTestListModel = that.getView().getModel("jsonTestListModel");
              oJsonTestListModel.setData(oSuccess.results);
            },
            error: function (oError) {
            }
          });

        oModel.read("/RMUOMSet",
          {
            success: function (oSuccess) {

              var oJsonUomListModel = that.getView().getModel("jsonUomListModel");
              oJsonUomListModel.setData(oSuccess.results);
            },
            error: function (oError) {
            }
          });
      },

      fnPMSearchHelp: function () {
        var that = this;
        var oModel = this.getView().getModel();
        oModel.read("/RMUOMSet",
          {
            success: function (oSuccess) {

              var oJsonUomListModel = that.getView().getModel("jsonUomListModel");
              oJsonUomListModel.setData(oSuccess.results);
            },
            error: function (oError) {
            }
          });
      },

      fnGetReviewerApproverList: function (Mtart, Matnr) {
        let afilters = [];
        afilters.push(new Filter("Mtart", FilterOperator.EQ, Mtart));
        afilters.push(new Filter("Matnr", FilterOperator.EQ, Matnr));
        let that = this;
        let oModel = this.getView().getModel();
        oModel.read("/ReviewerApproverListSet",
          {
            filters: afilters,
            success: function (oSucess) {

              if (oSucess.results) {
                let aApprover = [];
                let aReviewer = [];
                oSucess.results.forEach((item) => {
                  if (item.Type == "R") {
                    aReviewer.push(item);
                  } else if (item.Type == "A") {
                    aApprover.push(item);
                  }
                });

                let oApproverJsonModel = new sap.ui.model.json.JSONModel();
                oApproverJsonModel.setData(aApprover);
                that.getView().setModel(oApproverJsonModel, "ApproverJsonModel");

                let oReviewerJsonModel = new sap.ui.model.json.JSONModel();
                oReviewerJsonModel.setData(aReviewer);
                that.getView().setModel(oReviewerJsonModel, "ReviewerJsonModel");
              }
            },
            error: function (oError) {
              MessageBox.error(
                "Internal server error occurred", {
                styleClass: bCompact ? "sapUiSizeCompact" : ""
              }
              );
            }
          });
      },

      onDeletePMRegulatoryIntegrity: function (oEvent) {

        var sPath = oEvent.getSource().getParent().oBindingContexts.jsonCentralModel.sPath;
        var Clicked = this.getView().getModel("jsonCentralModel").getProperty(sPath);
        var oModel = this.getView().getModel("jsonCentralModel");
        var Data = oModel.getProperty("/PackagingMaterial/Data/RegulatoryIntegrity/results");

        var NewData = Data.filter(item => item.Reqmnt != Clicked.Reqmnt);
        oModel.setProperty("/PackagingMaterial/Data/RegulatoryIntegrity/results", NewData);
        oModel.refresh();
      },

      onDeletePMPrintingParameters: function (oEvent) {

        var sPath = oEvent.getSource().getParent().oBindingContexts.jsonCentralModel.sPath;
        var Clicked = this.getView().getModel("jsonCentralModel").getProperty(sPath);
        var oModel = this.getView().getModel("jsonCentralModel");
        var Data = oModel.getProperty("/PackagingMaterial/Data/PrintingParameters/results");

        var NewData = Data.filter(item => item.Reqmnt != Clicked.Reqmnt);
        oModel.setProperty("/PackagingMaterial/Data/PrintingParameters/results", NewData);
        oModel.refresh();
      },

      onDeletePMAppearance: function (oEvent) {

        var sPath = oEvent.getSource().getParent().oBindingContexts.jsonCentralModel.sPath;
        var Clicked = this.getView().getModel("jsonCentralModel").getProperty(sPath);
        var oModel = this.getView().getModel("jsonCentralModel");
        var Data = oModel.getProperty("/PackagingMaterial/Data/Appearance/results");

        var NewData = Data.filter(item => item.Reqmnt != Clicked.Reqmnt);
        oModel.setProperty("/PackagingMaterial/Data/Appearance/results", NewData);
        oModel.refresh();
      },

      onDeletePMMeasurementDim: function (oEvent) {

        var sPath = oEvent.getSource().getParent().oBindingContexts.jsonCentralModel.sPath;
        var Clicked = this.getView().getModel("jsonCentralModel").getProperty(sPath);
        var oModel = this.getView().getModel("jsonCentralModel");
        var Data = oModel.getProperty("/PackagingMaterial/Data/Measurement/results");

        var NewData = Data.filter(item => item.Reqmnt != Clicked.Reqmnt);
        oModel.setProperty("/PackagingMaterial/Data/Measurement/results", NewData);
        oModel.refresh();
      },

      onDeletePMPerformance: function (oEvent) {

        var sPath = oEvent.getSource().getParent().oBindingContexts.jsonCentralModel.sPath;
        var Clicked = this.getView().getModel("jsonCentralModel").getProperty(sPath);
        var oModel = this.getView().getModel("jsonCentralModel");
        var Data = oModel.getProperty("/PackagingMaterial/Data/Performance/results");

        var NewData = Data.filter(item => item.Reqmnt != Clicked.Reqmnt);
        oModel.setProperty("/PackagingMaterial/Data/Performance/results", NewData);
        oModel.refresh();
      },

      onDeletePMDevelopmental: function (oEvent) {

        var sPath = oEvent.getSource().getParent().oBindingContexts.jsonCentralModel.sPath;
        var Clicked = this.getView().getModel("jsonCentralModel").getProperty(sPath);
        var oModel = this.getView().getModel("jsonCentralModel");
        var Data = oModel.getProperty("/PackagingMaterial/Data/Developmental/results");

        var NewData = Data.filter(item => item.Reqmnt != Clicked.Reqmnt);
        oModel.setProperty("/PackagingMaterial/Data/Developmental/results", NewData);
        oModel.refresh();
      },

      onDeletePMSustainabilitySafety: function (oEvent) {

        var sPath = oEvent.getSource().getParent().oBindingContexts.jsonCentralModel.sPath;
        var Clicked = this.getView().getModel("jsonCentralModel").getProperty(sPath);
        var oModel = this.getView().getModel("jsonCentralModel");
        var Data = oModel.getProperty("/PackagingMaterial/Data/SustainabilitySafety/results");

        var NewData = Data.filter(item => item.Reqmnt != Clicked.Reqmnt);
        oModel.setProperty("/PackagingMaterial/Data/SustainabilitySafety/results", NewData);
        oModel.refresh();
      },

      fnPMMicDorpDown: function () {

        return new Promise((resolve, reject) => {
          let that = this;
          let oModel = this.getView().getModel();

          oModel.read("/PMMicDorpDownSet",
            {
              success: function (oSuccess) {
                let oJsonPMMicDorpDownModel = that.getView().getModel("jsonPMMicDorpDownModel");
                oJsonPMMicDorpDownModel.setData(oSuccess.results);
                resolve("Success"); // Resolve the promise
              },
              error: function (oError) {
                reject("Error");
              }
            });
        });
      },

      onTargetValueHelpReq: function (oEvent) {
        let sPath = oEvent.getSource().getParent().oBindingContexts.jsonCentralModel.sPath;
        let oModel = this.getView().getModel("jsonCentralModel");
        oModel.setProperty("/PackagingMaterial/SelectedTargetPath", sPath);
        let Clicked = oModel.getProperty(sPath);

        if (Clicked.Mkmnr) {
          let oJsonPMMicDorpDownModel = this.getView().getModel("jsonPMMicDorpDownModel");
          const { oData } = oJsonPMMicDorpDownModel;
          const copiedArray = [...oData];
          const result = copiedArray.filter((item) => item.Mkmnr == Clicked.Mkmnr);
          if (result.length > 0) {
            let that = this;
            let oJsonPMMicDorpDownLocalModel = this.getView().getModel("jsonPMMicDorpDownLocalModel");
            oJsonPMMicDorpDownLocalModel.setData(null);
            oJsonPMMicDorpDownLocalModel.setData(result);
            if (!that.PMTargetListDialog) {
              that.PMTargetListDialog = sap.ui.xmlfragment("com.emami.spc.view.fragments.PMTargetListDialog", that);
              that.getView().addDependent(that.PMTargetListDialog);
            }
            that.PMTargetListDialog.open();
          } else {
            return;
          }
        }
      },

      onPressPMTargetListDialogLineItem: function (oEvent) {
        const Target = oEvent.getParameter("selectedItem").getCells()[0].getText();
        let oModel = this.getView().getModel("jsonCentralModel");
        let sPath = oModel.getProperty("/PackagingMaterial/SelectedTargetPath");
        let Clicked = oModel.getProperty(sPath);
        oModel.setProperty(`${sPath}/Target`, Target);
        oModel.refresh();
      },

      fnOpenTaskListMessageDialog: function () {
        var that = this;
        if (!that.TaskListMessageDialog) {
          that.TaskListMessageDialog = sap.ui.xmlfragment("com.emami.spc.view.fragments.TaskListMessageDialog", that);
          that.getView().addDependent(that.TaskListMessageDialog);
        }
        that.TaskListMessageDialog.open();
      },

      onSuperSeedValueHelpReq: function () {
        var that = this;
        if (!that.SuperSeedDialog) {
          that.SuperSeedDialog = sap.ui.xmlfragment("com.emami.spc.view.fragments.SuperSeedDialog", that);
          that.getView().addDependent(that.SuperSeedDialog);
        }
        that.SuperSeedDialog.open();
      },

      onSearchSuperSeedDialog: function (oEvent) {
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

      onConfirmSuperSeedDialog: function (oEvent) {
        let Matnr = oEvent.getParameter("selectedItem").getCells()[0].getText();
        let Maktx = oEvent.getParameter("selectedItem").getCells()[1].getText();

        var oJsonCentralModel = this.getView().getModel("jsonCentralModel");
        oJsonCentralModel.setProperty("/PackagingMaterial/Data/Supcode", Matnr);
        oJsonCentralModel.refresh();
      },

      fnLoadPMRefMaterialData: function () {
        var that = this;
        var oModel = this.getView().getModel();
        oModel.read("/PMRefMaterialDropdown", {
          success: function (oSuccess) {
            var oJsonRefMaterialDropdownModel = that.getView().getModel("jsonRefMaterialDropdownModel");
            oJsonRefMaterialDropdownModel.setData(oSuccess.results);
          },

          error: function (oError) {
            BusyIndicator.hide();
          }
        });
      },
      onChangeRMEffctDate: function (oEvent) {

        let oModel = this.getView().getModel("jsonCentralModel");
        oModel.setProperty("/RawMaterial/RMDateChange/EffctDate", true);
      },
      onChangePRMEffctDate: function (oEvent) {

        let oModel = this.getView().getModel("jsonCentralModel");
        oModel.setProperty("/PerfumeMaterial/PRMDateChange/EffctDate", true);
      },
      onChangeRMPerpDate: function (oEvent) {

        let oModel = this.getView().getModel("jsonCentralModel");
        oModel.setProperty("/RawMaterial/RMDateChange/PerpDate", true);
      },
      onChangePRMPerpDate: function (oEvent) {
        let oModel = this.getView().getModel("jsonCentralModel");
        oModel.setProperty("/PerfumeMaterial/PRMDateChange/PerpDate", true);
      },
      onChangeRMNextReview: function (oEvent) {

        let oModel = this.getView().getModel("jsonCentralModel");
        oModel.setProperty("/RawMaterial/RMDateChange/NextReview", true);
      },
      onChangePRMNextReview: function (oEvent) {

        let oModel = this.getView().getModel("jsonCentralModel");
        oModel.setProperty("/PerfumeMaterial/PRMDateChange/NextReview", true);
      },

      onChangeRMRevisionDate: function (oEvent) {
        let sPath = oEvent.getSource().oPropagatedProperties.oBindingContexts.jsonCentralModel.sPath;
        sPath = sPath + '/CheckChangeRevisionDate'
        let oModel = this.getView().getModel("jsonCentralModel");
        oModel.setProperty(sPath, true);
      },

      onChangePMIssueDate: function (oEvent) {

        let oModel = this.getView().getModel("jsonCentralModel");
        oModel.setProperty("/PackagingMaterial/PMDateChange/IssueDate", true);
      },
      onChangePMEffctDate: function (oEvent) {

        let oModel = this.getView().getModel("jsonCentralModel");
        oModel.setProperty("/PackagingMaterial/PMDateChange/EffctDate", true);
      },

      onAddPMRegulatoryIntegrity: function () {
        var oModel = this.getView().getModel("jsonCentralModel");
        var Data = oModel.getProperty("/PackagingMaterial/Data/RegulatoryIntegrity/results");
        var Matnr = oModel.getProperty("/PackagingMaterial/Data/Matnr");
        var Versn = oModel.getProperty("/PackagingMaterial/Data/Versn");

        Data.push({
          "Matnr": Matnr,
          "Versn": Versn,
          "IsNew": "X",
        });
        oModel.setProperty("/PackagingMaterial/Data/Actvt", "1");
        oModel.setProperty("/PackagingMaterial/Data/RegulatoryIntegrity/results", Data);
        oModel.refresh();

        var oTable = this.byId("regulatory");

        setTimeout(function () {
          oTable.setFirstVisibleRow(
            oTable.getBinding("rows").getLength() - 1
          );
        }, 150);

      },

      onAddPMPrintingParameters: function () {

        var oModel = this.getView().getModel("jsonCentralModel");
        var Data = oModel.getProperty("/PackagingMaterial/Data/PrintingParameters/results");
        var Matnr = oModel.getProperty("/PackagingMaterial/Data/Matnr");
        var Versn = oModel.getProperty("/PackagingMaterial/Data/Versn");

        Data.push({
          "Matnr": Matnr,
          "Versn": Versn,
          "IsNew": "X",
        }); 
        oModel.setProperty("/PackagingMaterial/Data/Actvt", "2");
        oModel.setProperty("/PackagingMaterial/Data/PrintingParameters/results", Data);
        oModel.refresh();

        var oTable = this.byId("printing");

        setTimeout(function () {
          oTable.setFirstVisibleRow(
            oTable.getBinding("rows").getLength() - 1
          );
        }, 150);

      },

      onAddPMAppearance: function () {

        var oModel = this.getView().getModel("jsonCentralModel");
        var Data = oModel.getProperty("/PackagingMaterial/Data/Appearance/results");
        var Matnr = oModel.getProperty("/PackagingMaterial/Data/Matnr");
        var Versn = oModel.getProperty("/PackagingMaterial/Data/Versn");

        Data.push({
          "Matnr": Matnr,
          "Versn": Versn,
          "IsNew": "X",
        });
        oModel.setProperty("/PackagingMaterial/Data/Actvt", "3");
        oModel.setProperty("/PackagingMaterial/Data/Appearance/results", Data);
        oModel.refresh();

        var oTable = this.byId("Appearance");

        setTimeout(function () {
          oTable.setFirstVisibleRow(
            oTable.getBinding("rows").getLength() - 1
          );
        }, 150);
      },

      onAddPMMeasurementDim: function () {
        var oModel = this.getView().getModel("jsonCentralModel");
        var Data = oModel.getProperty("/PackagingMaterial/Data/Measurement/results");
        var Matnr = oModel.getProperty("/PackagingMaterial/Data/Matnr");
        var Versn = oModel.getProperty("/PackagingMaterial/Data/Versn");

        Data.push({
          "Matnr": Matnr,
          "Versn": Versn,
          "IsNew": "X",
        });
        oModel.setProperty("/PackagingMaterial/Data/Actvt", "4");
        oModel.setProperty("/PackagingMaterial/Data/Measurement/results", Data);
        oModel.refresh();

        var oTable = this.byId("Measurement");

        setTimeout(function () {
          oTable.setFirstVisibleRow(
            oTable.getBinding("rows").getLength() - 1
          );
        }, 150);
      },

      onAddPMPerformance: function () {
        var oModel = this.getView().getModel("jsonCentralModel");
        var Data = oModel.getProperty("/PackagingMaterial/Data/Performance/results");
        var Matnr = oModel.getProperty("/PackagingMaterial/Data/Matnr");
        var Versn = oModel.getProperty("/PackagingMaterial/Data/Versn");

        Data.push({
          "Matnr": Matnr,
          "Versn": Versn,
          "IsNew": "X",
        });
        oModel.setProperty("/PackagingMaterial/Data/Actvt", "5");
        oModel.setProperty("/PackagingMaterial/Data/Performance/results", Data);
        oModel.refresh();

        var oTable = this.byId("Performance");

        setTimeout(function () {
          oTable.setFirstVisibleRow(
            oTable.getBinding("rows").getLength() - 1
          );
        }, 150);
      },

      onAddPMDevelopmental: function () {
        var oModel = this.getView().getModel("jsonCentralModel");
        var Data = oModel.getProperty("/PackagingMaterial/Data/Developmental/results");
        var Matnr = oModel.getProperty("/PackagingMaterial/Data/Matnr");
        var Versn = oModel.getProperty("/PackagingMaterial/Data/Versn");

        Data.push({
          "Matnr": Matnr,
          "Versn": Versn,
          "IsNew": "X",
        });
        oModel.setProperty("/PackagingMaterial/Data/Actvt", "6");
        oModel.setProperty("/PackagingMaterial/Data/Developmental/results", Data);
        oModel.refresh();

        var oTable = this.byId("Developmental");

        setTimeout(function () {
          oTable.setFirstVisibleRow(
            oTable.getBinding("rows").getLength() - 1
          );
        }, 150);
      },

      onAddPMSustainabilitySafety: function () {
        var oModel = this.getView().getModel("jsonCentralModel");
        var Data = oModel.getProperty("/PackagingMaterial/Data/SustainabilitySafety/results");
        var Matnr = oModel.getProperty("/PackagingMaterial/Data/Matnr");
        var Versn = oModel.getProperty("/PackagingMaterial/Data/Versn");

        Data.push({
          "Matnr": Matnr,
          "Versn": Versn,
          "IsNew": "X",
        });
        oModel.setProperty("/PackagingMaterial/Data/Actvt", "7");
        oModel.setProperty("/PackagingMaterial/Data/SustainabilitySafety/results", Data);
        oModel.refresh();

        var oTable = this.byId("SustainabilitySafety");

        setTimeout(function () {
          oTable.setFirstVisibleRow(
            oTable.getBinding("rows").getLength() - 1
          ); 
        }, 150);
      },

      onReqmntValueHelp: function (oEvent) {
        this._oReqmntRowCtx = oEvent.getSource().getBindingContext("jsonCentralModel");
        var oModel = this.getView().getModel();
        var oJsonCentralModel = this.getView().getModel("jsonCentralModel");
        var Matnr = oJsonCentralModel.getProperty("/PackagingMaterial/Data/Matnr");
        var Actvt = oJsonCentralModel.getProperty("/PackagingMaterial/Data/Actvt");
        BusyIndicator.show();
        let afilters = [];

        if (Actvt == 7) {
          Actvt = 8;
        }
        afilters.push(new Filter("Matnr", FilterOperator.EQ, Matnr));
        afilters.push(new Filter("Actvt", FilterOperator.EQ, Actvt));
        oModel.read("/RequirementSet", {
          filters: afilters,
          success: function (oSuccess) {

            var oJson = new sap.ui.model.json.JSONModel(oSuccess.results);

            var oTable = new sap.m.Table({
              mode: "SingleSelectMaster",

              itemPress: function (oEvt) {

                var oItem = oEvt.getParameter("listItem");
                var oSelected = oItem.getBindingContext().getObject();

                // row user originally clicked
                var oRowCtx = this._oReqmntRowCtx;

                var sPath = oRowCtx.getPath();
                var oModel = oRowCtx.getModel();

                // Fill values 
                oModel.setProperty(sPath + "/Reqmnt", oSelected.Kurztext);
                oModel.setProperty(sPath + "/Tstmth", oSelected.Pmethode);
                oModel.setProperty(sPath + "/Quantitative", oSelected.Quantitative);
                oModel.setProperty(sPath + "/Qualitative", oSelected.Qualitative);
                oModel.setProperty(sPath + "/Meins", oSelected.Meins);
                oModel.setProperty(sPath + "/Lsl", oSelected.Lsl);
                oModel.setProperty(sPath + "/Usl", oSelected.Usl);
                oModel.setProperty(sPath + "/Target", oSelected.sollwert);
                oModel.setProperty(sPath + "/Mkmnr", oSelected.Mkmnr);
                oModel.setProperty(sPath + "/Relcri", oSelected.Dummy40);
                // oModel.setProperty(sPath + "/Zaehler", oSelected.Zaehler);
                oModel.setProperty(sPath + "/Accdef", oSelected.Accdef);
                oModel.setProperty(sPath + "/Partcoa", oSelected.Partcoa);
                oModel.setProperty(sPath + "/Remarks", oSelected.Remarks);
                oModel.setProperty(sPath + "/Planttst", oSelected.Planttst);
                oModel.setProperty(sPath + "/Actvt", oSelected.Actvt);
                oModel.setProperty(sPath + "/Lineitm", oSelected.Lineitm);
                oModel.setProperty(sPath + "/Mandatory", oSelected.Mandatory);

                this._oReqmntDialog.close();

              }.bind(this),

              columns: [
                new sap.m.Column({
                  header: new sap.m.Label({ text: "Requirement" })
                }),
                new sap.m.Column({
                  header: new sap.m.Label({ text: "Code" })
                })
              ],

              items: {
                path: "/",
                template: new sap.m.ColumnListItem({
                  type: "Active",
                  cells: [
                    new sap.m.Text({ text: "{Kurztext}" }),
                    new sap.m.Text({ text: "{Mkmnr}" })
                  ]
                })
              }
            });

            oTable.setModel(oJson);

            this._oReqmntDialog = new sap.m.Dialog({
              title: "Select Requirement",
              contentWidth: "40%",
              contentHeight: "50%",
              content: [oTable],
              endButton: new sap.m.Button({
                text: "Cancel",
                press: function () {
                  this._oReqmntDialog.close();
                }.bind(this)
              })
            });

            this._oReqmntDialog.open();

            BusyIndicator.hide();
          }.bind(this),

          error: function (oError) {
            BusyIndicator.hide();
          }
        });

      }

    });
  }
);
