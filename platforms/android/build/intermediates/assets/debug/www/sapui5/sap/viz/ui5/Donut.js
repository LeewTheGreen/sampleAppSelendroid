/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2015 SAP SE. All rights reserved
 */
sap.ui.define(['sap/viz/library','./core/BaseChart'],function(l,B){"use strict";var D=B.extend("sap.viz.ui5.Donut",{metadata:{library:"sap.viz",aggregations:{general:{type:"sap.viz.ui5.types.RootContainer",multiple:false},title:{type:"sap.viz.ui5.types.Title",multiple:false},legendGroup:{type:"sap.viz.ui5.types.Legend",multiple:false},legend:{type:"sap.viz.ui5.types.legend.Common",multiple:false},xyContainer:{type:"sap.viz.ui5.types.XYContainer",multiple:false},plotArea:{type:"sap.viz.ui5.types.Pie",multiple:false},dataLabel:{type:"sap.viz.ui5.types.Datalabel",multiple:false},interaction:{type:"sap.viz.ui5.types.controller.Interaction",multiple:false},toolTip:{type:"sap.viz.ui5.types.Tooltip",multiple:false},dataTransform:{type:"sap.viz.ui5.types.Datatransform",multiple:false}},events:{selectData:{},deselectData:{},showTooltip:{deprecated:true},hideTooltip:{deprecated:true},initialized:{}},vizChartType:"viz/donut"}});return D;});
