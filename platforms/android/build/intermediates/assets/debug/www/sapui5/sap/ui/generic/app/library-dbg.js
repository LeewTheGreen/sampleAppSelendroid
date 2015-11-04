/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

/**
 * Initialization Code and shared classes of library sap.ui.generic.app.
 */
sap.ui.define(['jquery.sap.global', 'sap/ui/core/library'],
	function(jQuery, library1) {
	"use strict";


	/**
	 * SAPUI5 library with ...
	 *
	 * @namespace
	 * @name sap.ui.generic.app
	 * @public
	 */
	
	// delegate further initialization of this library to the Core
	sap.ui.getCore().initLibrary({
		name : "sap.ui.generic.app",
		version: "1.32.4",
		dependencies : ["sap.ui.core"],
		types: [],
		interfaces: [],
		controls: [],
		elements: [],
		noLibraryCSS: true
	});
	
	sap.ui.lazyRequire("sap.ui.generic.app.AppComponent", "new extend getMetadata");
	
	return sap.ui.generic.app;

}, /* bExport= */ false);
