jQuery.sap.declare("io.cordova.hellocordova.Component");

sap.ui.core.UIComponent.extend("io.cordova.hellocordova.Component", {
	metadata: {
		name: "test",
		version: "1.0.0-SNAPSHOT",
		dependencies: {
			libs: ["sap.m", "sap.ui.core", "sap.ui.layout"],
			components: []
		},
		config: {
			serviceConfig: {
				name: "testSvc",
				serviceUrl: ""
			}
		},
		routing: {
			config: {
				viewType: "XML",
				viewPath: "io.cordova.hellocordova.view",
				targetControl: "testMobileApp",
				targetAggregation: "pages",
				clearTarget: false
			},
			routes: [{
				name: "main",
				view: "Main",
				pattern: ""
			}, {
				name: "profile",
				view: "Profile",
				pattern: "/profile"
			}]
		}
	},

	getRouter: function(){
		var oRouter = sap.ui.core.UIComponent.prototype.getRouter.apply(this, arguments);
		var component = this;

		return {
			router: oRouter,
			defaultConfig: oRouter._oConfig,
			navTo: function (n, p, r) {
				var oApp = sap.ui.getCore().byId("idContainerView").byId("testMobileApp");

				var routeConfig = {};
				$.extend(routeConfig, this.defaultConfig, this.router.getRoute(n)._oConfig);

				if (oApp.getPage(routeConfig.name) === null){
					oApp.addPage(this._getView(routeConfig, component));
				}
				oApp.to(routeConfig.name);
			},

			_getView: function (oInfo, oOwner){
				var oView = sap.ui.view({
					id: oInfo.name,
					viewName: "io.cordova.hellocordova.view."+oInfo.view,
					type: oInfo.viewType
				});

				oView._sOwnerId = oOwner.getId();

				return oView;
			},

			initialize: function (){
				this.router.initialize();
			}
		};
	},

	createContent : function() {

		var oViewData = {
			component : this
		};
		return sap.ui.view({
			id: "idContainerView",
			viewName : "io.cordova.hellocordova.App",
			type : sap.ui.core.mvc.ViewType.XML,
			viewData : oViewData
		});
	},

	init: function (){
		sap.ui.core.UIComponent.prototype.init.apply(this, arguments);

		// Create and set the domain model to the component
		// TODO

		this.getRouter().initialize();
	}
});
