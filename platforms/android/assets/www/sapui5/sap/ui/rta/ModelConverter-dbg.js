/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2015 SAP SE. All rights reserved
 */

/*global Promise */// declare unusual global vars for JSLint/SAPUI5 validation

sap.ui.define([ 
	'jquery.sap.global', 
	'sap/ui/comp/odata/FieldSelectorModelConverter',
	'sap/ui/dt/ElementUtil'],
function(jQuery, FieldSelectorModelConverter, ElementUtil) {
	"use strict";

	/**
	 * Class for ModelConverter.
	 * 
	 * @class
	 * ModelConverter functionality to get a converted model from a given OData Model, which includes checks for already bound and visible properties on the UI as well as renamed labels for sap:label
	 *
	 * @author SAP SE
	 * @version 1.32.4
	 *
	 * @private
	 * @static
	 * @since 1.33
	 * @alias sap.ui.rta.ModelConverter
	 * @experimental Since 1.33. This class is experimental and provides only limited functionality. Also the API might be changed in future.
	 */
	var ModelConverter = {};

	ModelConverter.getConvertedModelWithBoundAndRenamedLabels = function(oControl, aEntityTypes) {
		var that = this;
		var oModel = oControl.getModel();
		return this._getModelConverter(oModel).then(function(oFieldSelectorModelConverter) {
			return that._getFieldModel(oControl, oFieldSelectorModelConverter, aEntityTypes);
		});
	};

	ModelConverter._getModelConverter = function(oModel) {
		var oMetaModel = oModel.getMetaModel();
		return oMetaModel.loaded().then(function() {
			return new FieldSelectorModelConverter(oModel);
		}, function(oReason) {
			jQuery.sap.log.error("MetadataModel could not be loaded", oReason);
		});
	};

	/**
	 * Generates the field model based on renamed labels, already bound and visible fields as well as complex types
	 * @param  {Array} aEntityTypes List of entity types
	 * @param  {sap.ui.core.Control} oControl Currently selected control
	 * @return {Array} List of Fields for the given entity type
	 * @private
	 */
	ModelConverter._getFieldModel = function(oControl, oFieldSelectorModelConverter, aEntityTypes) {
		var oConvertedModel = oFieldSelectorModelConverter.getConvertedModel(aEntityTypes);
		var oVisibleAndBoundFields = this._findVisibleAndBoundFieldsAndLabelNames(oControl);
		var mVisibleAndBoundFields = oVisibleAndBoundFields.visibleAndBoundFields;
		var mFieldsAndLabelNames = oVisibleAndBoundFields.fieldsAndLabelNames;
		var sEntityType;

		for (var z = 0; z < aEntityTypes.length; z++) {
			sEntityType = aEntityTypes[z];
			for (var i = 0; i < oConvertedModel[sEntityType].length; i++) {
				var complexTypePropertyName = oFieldSelectorModelConverter.getMetaDataAnalyzer()._getNameOfPropertyUsingComplexType(sEntityType, oConvertedModel[sEntityType][i].entityName);
				if (mVisibleAndBoundFields[oConvertedModel[sEntityType][i].name]) {
					oConvertedModel[sEntityType][i]["checked"] = true;
					oConvertedModel[sEntityType][i]["controlId"] = mVisibleAndBoundFields[oConvertedModel[sEntityType][i].name];
				}
				//Check for complexTypes
				if (complexTypePropertyName) {
					oConvertedModel[sEntityType][i]["isComplexType"] = true;
					oConvertedModel[sEntityType][i]["complexTypeName"] = complexTypePropertyName;

					if (mVisibleAndBoundFields[complexTypePropertyName + "/" + oConvertedModel[sEntityType][i].name]) {
						oConvertedModel[sEntityType][i]["checked"] = true;
						oConvertedModel[sEntityType][i]["controlId"] = mVisibleAndBoundFields[complexTypePropertyName + "/" + oConvertedModel[sEntityType][i].name];
					}
				}
				//Check for renamed labels
				if (mFieldsAndLabelNames[oConvertedModel[sEntityType][i].name] && mFieldsAndLabelNames[oConvertedModel[sEntityType][i].name] !== oConvertedModel[sEntityType][i]["sap:label"]) {
					oConvertedModel[sEntityType][i]["fieldLabel"] = mFieldsAndLabelNames[oConvertedModel[sEntityType][i].name];
				}
			}
		}
		return oConvertedModel[sEntityType];
	};

	/**
	 * Finds already bound and visible fields and saves the current label value
	 * @param  {sap.ui.core.Control} oControl Currently selected control
	 * @return {Object} visibleAndBoundFields: Lists of visible and bound fields, fieldsAndLabelNames: visible and LabelValue fields
	 * @private
	 */
	ModelConverter._findVisibleAndBoundFieldsAndLabelNames = function(oControl) {
		var mVisibleAndBoundFields = [];
		var mFieldsAndLabelNames = {};
		var aElements = ElementUtil.findAllPublicElements(oControl);
		var i = 0;
		if (oControl instanceof sap.m.ObjectHeader) {
			for (i = 0; i < aElements.length; i++) {
				var oObHeaderElement = aElements[i];

				if (oObHeaderElement instanceof sap.m.ObjectAttribute) {
					mVisibleAndBoundFields.push(oObHeaderElement.getBindingPath("text"));
				}
			}
		} else if ( oControl instanceof sap.ui.comp.smartform.SmartForm) {
			for (i = 0; i < aElements.length; i++) {
				var oFormElement = aElements[i];
				if (oFormElement.mBindingInfos) {
					for ( var oInfo in oFormElement.mBindingInfos) {
						var sPath = oFormElement.mBindingInfos[oInfo].parts[0].path ? oFormElement.mBindingInfos[oInfo].parts[0].path : "";
						sPath = sPath.split("/")[sPath.split("/").length - 1];
						var oParent = oFormElement.getParent();
						if (oParent) {
							if (sPath && oFormElement.getDomRef()) {
								mVisibleAndBoundFields[sPath] = oParent.getId();
								mFieldsAndLabelNames[sPath] = oParent.getLabelText();
							} else if (sPath) {
								var fTextAccessor = oParent.getLabelText;
								if (!fTextAccessor) {
									fTextAccessor = oParent.getLabel;
								}
								if (fTextAccessor) {
									mFieldsAndLabelNames[sPath] = fTextAccessor.call(oParent);
									mVisibleAndBoundFields[sPath] = oParent.getId();
								}
							}
						}
					}
				}

			}
		}

		return {
			visibleAndBoundFields : mVisibleAndBoundFields,
			fieldsAndLabelNames : mFieldsAndLabelNames
		};
	};

	return ModelConverter;

}, /* bExport= */true);