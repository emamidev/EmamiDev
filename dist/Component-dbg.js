jQuery.sap.declare("com.arteriatech.ss.soinvcreate.cp.zsssoinvcreate0cp.Component");

// use the load function for getting the optimized preload file if present
sap.ui.component.load({
	name: "com.arteriatech.ss.soinvcreate.cp",
	// Use the below URL to run the extended application when SAP-delivered application is deployed on cloud
	// Remove the url parameter once your application is deployed to productive account
	// url: jQuery.sap.getModulePath("com.arteriatech.ss.soinvcreate.cp.zsssoinvcrt_cp") + "/parent"
	url: "/sap/bc/ui5_ui5/artec/sssoinvcrt_cp/dist"
		// we use a URL relative to our own component
		// extension application is deployed with customer namespace
});

this.com.arteriatech.ss.soinvcreate.cp.Component.extend("com.arteriatech.ss.soinvcreate.cp.zsssoinvcreate0cp.Component", {
	metadata: {
		manifest: "json"
	},
	init: function () {

		jQuery.sap.registerModulePath("com.arteriatech.ppc.utils", "/sap/bc/ui5_ui5/ARTEC/PPCUTIL/utils/");
		jQuery.sap.registerModulePath("com.arteriatech.ss.utils", "/sap/bc/ui5_ui5/ARTEC/SSUTIL/utils/");

		sap.ui.core.UIComponent.prototype.init.apply(this, arguments);

		var Device = sap.ui.Device;
		if (Device.system.tablet && Device.system.desktop) {
			Device.system.tablet = false;
		}
		var DeviceModel = new sap.ui.model.json.JSONModel(Device);
		DeviceModel.setDefaultBindingMode("OneWay");
		this.setModel(DeviceModel, "device");

		this.getRouter().initialize();
	}
});