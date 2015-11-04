(function() {
    "use strict";

    document.addEventListener("deviceready", onDeviceReady, false);
    document.addEventListener("backbutton", onBackKeyDown, false);

    function onDeviceReady(){
		    loadUI5Models();
		    initializeUi5();
	  };

    function onBackKeyDown(e) {
    	var app = sap.ui.getCore().byId("idContainerView").byId("testMobileApp");
			app.back();
    };

    function initializeUi5(){
    	sap.ui.getCore().isPreview = false;	// Set the preview property

		  sap.ui.getCore().attachInit(function () {
				var app = new sap.ui.core.ComponentContainer("testComponentContainer", {
					height: "100%",
					name: "io.cordova.hellocordova"
				});
				app.placeAt("content");
			});
    };

    function loadUI5Models(){
		// set device model
        var deviceModel = new sap.ui.model.json.JSONModel({
            isTouch : sap.ui.Device.support.touch,
            isNoTouch : !sap.ui.Device.support.touch,
            isPhone : sap.ui.Device.system.phone,
            isNoPhone : !sap.ui.Device.system.phone,
            listMode : sap.ui.Device.system.phone ? "None" : "SingleSelectMaster",
            listItemType : sap.ui.Device.system.phone ? "Active" : "Inactive"
        });
        deviceModel.setDefaultBindingMode("OneWay");
        sap.ui.getCore().setModel(deviceModel, "device");
    };

})();
