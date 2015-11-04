sap.ui.controller("io.cordova.hellocordova.view.Main", {

	onPressProfileTile: function() {
		this.getOwnerComponent().getRouter().navTo("profile");
	}
});
