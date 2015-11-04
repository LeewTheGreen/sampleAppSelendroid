/*
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2015 SAP SE. All rights reserved
 */
sap.ui.define(function(){"use strict";var M=function(){this.reset();};M.prototype.reset=function(o){this._oVIZFlatTable=null;this._aFlatContextLookup=null;};M.prototype.getVizDataset=function(b,d,m,a,i,c){if(!this._oVIZFlatTable&&sap.viz.__svg_support){this._createVIZFlatTable(b,d,m,c);}return this._oVIZFlatTable||null;};M.prototype.findContext=function(c){if(this._aFlatContextLookup&&typeof c==='object'&&c._context_row_number!==undefined){return this._aFlatContextLookup[c._context_row_number];}};M.prototype._createVIZFlatTable=function(b,d,m,a){var c=(!a||a.startIndex===undefined)?0:a.startIndex;var l;if(!a||a.length===undefined){if(b){l=b.getLength();}}else{l=a.length;}var C=b&&b.getContexts(c,l);var A=[],e=[],f={'metadata':{'fields':[],'context':'_context_row_number'},'data':[]},g=[];jQuery.each(d,function(i,o){A.push({def:o,vAdapter:o._getAdapter(),dAdapter:o._getDisplayValueAdapter()});var j=o.getDataType();f.metadata.fields.push({'id':o.getIdentity()||o.getName(),'name':o.getName()||o.getIdentity(),'semanticType':'Dimension','dataType':j});});jQuery.each(m,function(i,o){e.push({def:o,adapter:o._getAdapter()});var j={'id':o.getIdentity()||o.getName(),'name':o.getName()||o.getIdentity(),'semanticType':'Measure'};if(o.getFormat()){j.formatString=o.getFormat();}f.metadata.fields.push(j);});var n,C;if(b){n=l;C=b.getContexts(c,n);var h=sap.ui.require("sap/ui/model/analytics/AnalyticalBinding");if(h&&b instanceof h&&C.length>0&&n===0){n=b.getLength();C=b.getContexts(0,n);}}if(!C||C.length===0){this.reset();this._oVIZFlatTable=new sap.viz.api.data.FlatTableDataset(f);return;}jQuery.each(C,function(I,o){if(!f.data[I]){f.data[I]=[];}for(var i=0;i<A.length;i++){var v=A[i].vAdapter(o);if(v instanceof Date){v=v.getTime();}var V=A[i].dAdapter(o);f.data[I].push(V.enableDisplayValue?{v:v,d:V.value}:v);}for(var j=0;j<e.length;j++){var v=e[j].adapter(o);f.data[I].push(v);}g[I]=o;});this._aFlatContextLookup=g;this._oVIZFlatTable=new sap.viz.api.data.FlatTableDataset(f);};return M;},true);