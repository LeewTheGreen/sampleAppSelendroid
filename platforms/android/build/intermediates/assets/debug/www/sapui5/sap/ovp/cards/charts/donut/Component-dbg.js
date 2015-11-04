(function () {
	"use strict";
	/*global jQuery, sap */

	jQuery.sap.declare("sap.ovp.cards.charts.donut.Component");
	jQuery.sap.require("sap.ovp.cards.charts.generic.Component");
	sap.ovp.cards.charts.generic.Component.extend("sap.ovp.cards.charts.donut.Component", {
		// use inline declaration instead of component.json to save 1 round trip
		metadata: {
			properties: {
				"contentFragment": {
					"type": "string",
					"defaultValue": "sap.ovp.cards.charts.donut.DonutChart"
				},
				"headerExtensionFragment":{
					"type": "string",
					"defaultValue": "sap.ovp.cards.charts.AnalyticalHeader"
				}
			},

			version: "1.32.3",

			library: "sap.ovp",

			includes: [],

			dependencies: {
				libs: [ "sap.m" ],
				components: []
			},
			config: {},
			customizing: {
				"sap.ui.controllerExtensions": {
					"sap.ovp.cards.generic.Card": {
						controllerName: "sap.ovp.cards.charts.donut.DonutChart"
					}
				}
			}
		}
	});
})();
