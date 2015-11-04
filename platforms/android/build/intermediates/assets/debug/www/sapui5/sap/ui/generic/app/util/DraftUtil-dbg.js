/*
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

sap.ui.define([	"jquery.sap.global" ], function(jQuery) { // EXC_JSHINT_002
	"use strict";

	/**
	 * Constructor for generic utility for draft instance handling.
	 * @author SAP SE
	 * @version 1.32.4
	 * @since 1.30.0
	 * @alias sap.ui.generic.app.util.DraftUtil
	 * @private
	 */
	var DraftUtil = function() { // EXC_JSLINT_021

	};
	
	/**
	 * Checks if the current entity is an active instance or not.
	 * 
	 * @param {object} oEntity The given entity 
	 * @returns {boolean} <code>true</code> if the given entity is active, <code>false</code> otherwise
	 * @public
	 */
	DraftUtil.prototype.isActiveEntity = function(oEntity) {
		return oEntity.IsActiveEntity;
	};
	
	/**
	 * Checks if the current entity has a corresponding draft entity.
	 * 
	 * @param {object} oEntity The given entity 
	 * @returns {boolean} <code>true</code> if the given entity has a corresponding draft entity, <code>false</code> otherwise
	 * @public
	 */
	DraftUtil.prototype.hasDraftEntity = function(oEntity) {
		return oEntity.HasDraftEntity;
	};
	
	/**
	 * Checks if the current entity has a corresponding active entity.
	 * 
	 * @param {object} oEntity The given entity
	 * @returns {boolean} <code>true</code> if the given entity a corresponding active entity, <code>false</code> otherwise 
	 * @public
	 */
	DraftUtil.prototype.hasActiveEntity = function(oEntity) {
		return oEntity.HasActiveEntity;
	};	

	/**
	 * Frees all resources claimed during the life-time of this instance.
	 * 
	 * @private
	 */
	DraftUtil.prototype.destroy = function() { // EXC_JSLINT_021
		
	};
	
	return DraftUtil;

}, /* bExport= */true);
