sap.ui.define([], () => {
	"use strict";

	return {
		logo(sPath) {
			if (window.location.href.indexOf("localhost") > -1) {
				sPath = "../image/emami.png";
			} else {
				sPath = "image/emami.png";
			}
			return sPath;
		},

		materialLogo(sValue) { 
			var sPath = "";
			if (sValue == "perfume") {
				if (window.location.href.indexOf("localhost") > -1) {
					sPath = "../image/perfume-material-logo.png";
				} else {
					sPath = "image/perfume-material-logo.png";
				}
				return sPath;

			} else if (sValue == "PM") {

				if (window.location.href.indexOf("localhost") > -1) {
					sPath = "../image/packaging-material-logo.png";
				} else {
					sPath = "image/packaging-material-logo.png";
				}
				return sPath;

			} else if (sValue == "FG") {

				if (window.location.href.indexOf("localhost") > -1) {
					sPath = "../image/finished-goods-material-logo.png";
				} else {
					sPath = "image/finished-goods-material-logo.png";
				}
				return sPath;

			} else if (sValue == "RM") {

				if (window.location.href.indexOf("localhost") > -1) {
					sPath = "../image/raw-material-logo.png";
				} else {
					sPath = "image/raw-material-logo.png";
				}
				return sPath;

			} 

		},
		targetValueHelpVisibleFlag(sValue) {
			if (sValue) {
				let oJsonPMMicDorpDownModel = this.getView().getModel("jsonPMMicDorpDownModel");
				const { oData } = oJsonPMMicDorpDownModel;
				const copiedArray = [...oData];
				const result = copiedArray.find((item) => item.Mkmnr == sValue);
				if (result === undefined) {
					return false;
				} else {
					return true;
				}
			}
			return false;
		},
	};
});