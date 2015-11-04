/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/support/Plugin','sap/ui/core/util/serializer/ViewSerializer','sap/ui/thirdparty/jszip','sap/ui/core/Element','sap/ui/core/ElementMetadata','sap/ui/core/UIArea','sap/ui/core/mvc/View','sap/ui/core/mvc/Controller'],function(q,P,V,J,E,a,U,b){"use strict";var $=q;var C=P.extend("sap.ui.core.support.plugins.ControlTree",{constructor:function(s){P.apply(this,["sapUiSupportControlTree","Control Tree",s]);this._oStub=s;if(this.isToolPlugin()){this._aEventIds=["sapUiSupportSelectorSelect",this.getId()+"ReceiveControlTree",this.getId()+"ReceiveControlTreeExport",this.getId()+"ReceiveControlTreeExportError",this.getId()+"TriggerRequestProperties",this.getId()+"ReceiveProperties",this.getId()+"ReceiveBindingInfos",this.getId()+"ReceiveMethods",this.getId()+"ReceivePropertiesMethods"];this._breakpointId="sapUiSupportBreakpoint";this._tab={properties:"Properties",bindinginfos:"BindingInfos",breakpoints:"Breakpoints",exports:"Export"};this._currentTab=this._tab.properties;}else{this._aEventIds=[this.getId()+"RequestControlTree",this.getId()+"RequestControlTreeSerialize",this.getId()+"RequestProperties",this.getId()+"RequestBindingInfos",this.getId()+"ChangeProperty",this.getId()+"RefreshBinding"];var t=this;sap.ui.getCore().registerPlugin({startPlugin:function(o){t.oCore=o;},stopPlugin:function(){t.oCore=undefined;}});}}});C.prototype.init=function(s){P.prototype.init.apply(this,arguments);if(this.isToolPlugin()){c.call(this,s);}else{d.call(this,s);}};function c(s){$(document).on("click","li img.sapUiControlTreeIcon",$.proxy(this._onIconClick,this)).on("click","li.sapUiControlTreeElement div",$.proxy(this._onNodeClick,this)).on("click","li.sapUiControlTreeLink div",$.proxy(this._onControlTreeLinkClick,this)).on("click","#sapUiSupportControlTabProperties",$.proxy(this._onPropertiesTab,this)).on("click","#sapUiSupportControlTabBindingInfos",$.proxy(this._onBindingInfosTab,this)).on("click","#sapUiSupportControlTabBreakpoints",$.proxy(this._onMethodsTab,this)).on("click","#sapUiSupportControlTabExport",$.proxy(this._onExportTab,this)).on("change","[data-sap-ui-name]",$.proxy(this._onPropertyChange,this)).on("change","[data-sap-ui-method]",$.proxy(this._onPropertyBreakpointChange,this)).on("keyup",'.sapUiSupportControlMethods input[type="text"]',$.proxy(this._autoComplete,this)).on("blur",'.sapUiSupportControlMethods input[type="text"]',$.proxy(this._updateSelectOptions,this)).on("change",'.sapUiSupportControlMethods select',$.proxy(this._selectOptionsChanged,this)).on("click",'#sapUiSupportControlAddBreakPoint',$.proxy(this._onAddBreakpointClicked,this)).on("click",'#sapUiSupportControlExportToXml',$.proxy(this._onExportToXmlClicked,this)).on("click",'#sapUiSupportControlExportToHtml',$.proxy(this._onExportToHtmlClicked,this)).on("click",'#sapUiSupportControlActiveBreakpoints img.remove-breakpoint',$.proxy(this._onRemoveBreakpointClicked,this)).on("click",'#sapUiSupportControlPropertiesArea a.control-tree',$.proxy(this._onNavToControl,this)).on("click",'#sapUiSupportControlPropertiesArea img.sapUiSupportRefreshBinding',$.proxy(this._onRefreshBinding,this));this.renderContentAreas();}C.prototype.exit=function(s){P.prototype.exit.apply(this,arguments);if(this.isToolPlugin()){$(document).off('click','li img.sapUiControlTreeIcon').off('click','li div').off("click","li.sapUiControlTreeLink").off("click","#sapUiSupportControlTabProperties").off("click","#sapUiSupportControlTabBindings").off("click","#sapUiSupportControlTabBreakpoints").off("click","#sapUiSupportControlTabExport").off('change','[data-sap-ui-name]').off('change','[data-sap-ui-method]').off('keyup','.sapUiSupportControlMethods input[type="text"]').off('blur','.sapUiSupportControlMethods select').off('change','.sapUiSupportControlMethods select').off('click','#sapUiSupportControlAddBreakPoint').off('click','#sapUiSupportControlExportToXml').off('click','#sapUiSupportControlExportToHtml').off('click','#sapUiSupportControlActiveBreakpoints img.remove-breakpoint').off('click','#sapUiSupportControlPropertiesArea a.control-tree').off('click','#sapUiSupportControlPropertiesArea img.sapUiSupportRefreshBinding');}};C.prototype.renderContentAreas=function(){var r=sap.ui.getCore().createRenderManager();r.write('<div id="sapUiSupportControlTreeArea"><ul class="sapUiSupportControlTreeList"></ul></div>');r.write('<div id="sapUiSupportControlTabs" style="visibility:hidden">');r.write('<button id="sapUiSupportControlTabProperties" class="sapUiSupportBtn">Properties</button>');r.write('<button id="sapUiSupportControlTabBindingInfos" class="sapUiSupportBtn">Binding Infos</button>');r.write('<button id="sapUiSupportControlTabBreakpoints" class="sapUiSupportBtn">Breakpoints</button>');r.write('<button id="sapUiSupportControlTabExport" class="sapUiSupportBtn">Export</button>');r.write('</div>');r.write('<div id="sapUiSupportControlPropertiesArea"></div>');r.flush(this.$().get(0));r.destroy();};C.prototype.renderControlTree=function(e){var r=sap.ui.getCore().createRenderManager();function f(i,m){var h=m.aggregation.length>0||m.association.length>0;r.write("<li id=\"sap-debug-controltree-"+q.sap.escapeHTML(m.id||"")+"\" class=\"sapUiControlTreeElement\">");var I=h?"minus":"space";r.write("<img class=\"sapUiControlTreeIcon\" style=\"height: 12px; width: 12px;\" src=\"../../debug/images/"+I+".gif\" />");var p=m.library.replace(/\./g,"/")+"/images/controls/"+m.type+".gif";if(m.isAssociation){r.write("<img title=\"Association\" class=\"sapUiControlTreeIcon\" style=\"height: 12px; width: 12px;\" src=\"../../debug/images/link.gif\" />");}r.write("<img class=\"sapUiControlPicture\" style=\"height: 16px; width: 16px;\" src=\"../../../../../test-resources/"+p+"\" />");var s=m.type.lastIndexOf(".")>0?m.type.substring(m.type.lastIndexOf(".")+1):m.type;r.write('<div>');r.write('<span class="name"');r.writeAttributeEscaped("title",m.type);r.write('>');r.writeEscaped(""+s);r.write(' - ');r.writeEscaped(""+m.id);r.write('</span><span class="sapUiSupportControlTreeBreakpointCount" title="Number of active breakpoints / methods" style="display:none;"></span>');r.write('</div>');if(m.aggregation.length>0){r.write("<ul>");$.each(m.aggregation,f);r.write("</ul>");}if(m.association.length>0){r.write("<ul>");$.each(m.association,function(i,v){if(v.isAssociationLink){var t=v.type.lastIndexOf(".")>0?v.type.substring(v.type.lastIndexOf(".")+1):v.type;r.write("<li data-sap-ui-controlid=\""+q.sap.escapeHTML(v.id||"")+"\" class=\"sapUiControlTreeLink\">");r.write("<img class=\"sapUiControlTreeIcon\" style=\"height: 12px; width: 12px;\" align=\"middle\" src=\"../../debug/images/space.gif\" />");r.write("<img class=\"sapUiControlTreeIcon\" style=\"height: 12px; width: 12px;\" align=\"middle\" src=\"../../debug/images/link.gif\" />");r.write("<div><span title=\"Association '"+q.sap.escapeHTML(v.name||"")+"' to '"+q.sap.escapeHTML(v.id||"")+"' with type '"+q.sap.escapeHTML(v.type||"")+"'\">"+q.sap.escapeHTML(t||"")+" - "+q.sap.escapeHTML(v.id||"")+" ("+q.sap.escapeHTML(v.name||"")+")</span></div>");r.write("</li>");}else{f(0,v);}});r.write("</ul>");}r.write("</li>");}$.each(e,f);r.flush(this.$().find("#sapUiSupportControlTreeArea > ul.sapUiSupportControlTreeList").get(0));r.destroy();};C.prototype.renderPropertiesTab=function(e,s){var r=sap.ui.getCore().createRenderManager();r.write('<ul class="sapUiSupportControlTreeList" data-sap-ui-controlid="'+q.sap.escapeHTML(s||"")+'">');$.each(e,function(i,v){r.write("<li>");r.write("<span><label class='sapUiSupportLabel'>BaseType:</label> <code>"+q.sap.escapeHTML(v.control||"")+"</code></span>");if(v.properties.length>0||v.aggregations.length>0){r.write('<div class="get" title="Activate debugger for get-method">G</div><div class="set" title="Activate debugger for set-method">S</div>');r.write("<div class=\"sapUiSupportControlProperties\"><table><colgroup><col width=\"50%\"/><col width=\"50%\"/></colgroup>");$.each(v.properties,function(i,p){r.write("<tr><td>");r.write("<label class='sapUiSupportLabel'>"+q.sap.escapeHTML(p.name||"")+((p.isBound)?'<img title="Value is bound (see Binding Infos)" src="../../debug/images/link.gif" style="vertical-align:middle;margin-left:3px">':"")+"</label>");r.write("</td><td>");if(p.type==="boolean"){r.write("<input type='checkbox' ");r.write("data-sap-ui-name='"+q.sap.escapeHTML(p.name||"")+"' ");if(p.value==true){r.write("checked='checked'");}r.write("/>");}else if(p.enumValues){r.write("<div><select ");r.write("data-sap-ui-name='"+q.sap.escapeHTML(p.name||"")+"'>");$.each(p.enumValues,function(k,f){r.write("<option");if(k===p.value){r.write(" selected");}r.write(">");r.writeEscaped(""+k);r.write("</option>");});r.write("</select></div>");}else{r.write("<div><input type='text' ");r.write("data-sap-ui-name='"+q.sap.escapeHTML(p.name||"")+"' ");if(p.value){r.write("value='");r.writeEscaped(""+p.value);r.write("'");}r.write("/></div>");}r.write("</td>");r.write('<td><input type="checkbox" data-sap-ui-method="'+q.sap.escapeHTML(p._sGetter||"")+'" title="Activate debugger for '+q.sap.escapeHTML(p._sGetter||"")+'"');if(p.bp_sGetter){r.write("checked='checked'");}r.write('/></td>');r.write('<td><input type="checkbox" data-sap-ui-method="'+q.sap.escapeHTML(p._sMutator||"")+'" title="Activate debugger for '+q.sap.escapeHTML(p._sMutator||"")+'"');if(p.bp_sMutator){r.write("checked='checked'");}r.write('/></td>');r.write("</tr>");});$.each(v.aggregations,function(i,A){r.write("<tr><td>");r.write("<label class='sapUiSupportLabel'>"+q.sap.escapeHTML(A.name||"")+"</label>");r.write("</td><td>");r.write($.sap.encodeHTML(""+A.value));r.write("</td>");r.write('<td><input type="checkbox" data-sap-ui-method="'+q.sap.escapeHTML(A._sGetter||"")+'" title="Activate debugger for '+q.sap.escapeHTML(A._sGetter||"")+'"');if(A.bp_sGetter){r.write("checked='checked'");}r.write('/></td>');r.write('<td><input type="checkbox" data-sap-ui-method="'+q.sap.escapeHTML(A._sMutator||"")+'" title="Activate debugger for '+q.sap.escapeHTML(A._sMutator||"")+'"');if(A.bp_sMutator){r.write("checked='checked'");}r.write('/></td>');r.write("</tr>");});r.write("</table></div>");}r.write("</li>");});r.write("</ul>");r.flush(this.$().find("#sapUiSupportControlPropertiesArea").get(0));r.destroy();this.$().find("#sapUiSupportControlTabs").css("visibility","");this.selectTab(this._tab.properties);};C.prototype.renderBindingsTab=function(B,s){var r=sap.ui.getCore().createRenderManager();if(B.contexts.length>0){r.write('<h2 style="padding-left:5px">Contexts</h2>');r.write('<ul class="sapUiSupportControlTreeList" data-sap-ui-controlid="'+q.sap.escapeHTML(s||"")+'">');$.each(B.contexts,function(i,o){r.write('<li>');r.write('<span><label class="sapUiSupportLabel">Model Name: '+q.sap.escapeHTML(o.modelName||"")+'</label></span>');r.write('<div class="sapUiSupportControlProperties">');r.write('<table><colgroup><col width="15%"><col width="35%"><col width="50%"></colgroup>');r.write('<tbody>');r.write('<tr><td colspan="2">');r.write('<label class="sapUiSupportLabel">Path</label>');r.write('</td><td>');r.write('<div><span');if(o.invalidPath){r.write(' style="color:red"');}r.write('>');r.writeEscaped(""+o.path);if(o.invalidPath){r.write(' (invalid)');}r.write('</span></div>');r.write('</td></tr>');if(o.location){r.write('<tr><td colspan="2">');r.write('<label class="sapUiSupportLabel">Inherited from</label>');r.write('</td><td>');r.write('<div><a class="control-tree sapUiSupportLink" title="'+q.sap.escapeHTML(o.location.name||"")+'" data-sap-ui-control-id="'+q.sap.escapeHTML(o.location.id||"")+'" href="javascript:void(0);">');r.writeEscaped(""+o.location.name.substring(o.location.name.lastIndexOf(".")+1));r.write(' ('+q.sap.escapeHTML(o.location.id||"")+')</a></div>');r.write('</td></tr>');}r.write('</tbody></table></div></li>');});r.write('</ul>');}if(B.bindings.length>0){r.write('<h2 style="padding-left:5px">Bindings</h2>');r.write('<ul class="sapUiSupportControlTreeList" data-sap-ui-controlid="'+q.sap.escapeHTML(s||"")+'">');$.each(B.bindings,function(i,o){r.write('<li data-sap-ui-binding-name="'+q.sap.escapeHTML(o.name||"")+'">');r.write('<span>');r.write('<label class="sapUiSupportLabel" style="vertical-align: middle">'+q.sap.escapeHTML(o.name||"")+'</label>');r.write('<img class="sapUiSupportRefreshBinding" title="Refresh Binding" '+'src="../../debug/images/refresh.gif" style="cursor:pointer;margin-left:5px;vertical-align:middle">');r.write('</span>');$.each(o.bindings,function(e,f){r.write('<div class="sapUiSupportControlProperties">');r.write('<table><colgroup><col width="15%"><col width="35%"><col width="50%"></colgroup>');r.write('<tbody>');r.write('<tr><td colspan="2">');r.write('<label class="sapUiSupportLabel">Path</label>');r.write('</td><td>');r.write('<div><span');if(f.invalidPath){r.write(' style="color:red"');}r.write('>');r.writeEscaped(""+f.path);if(f.invalidPath){r.write(' (invalid)');}r.write('</span></div>');r.write('</td></tr>');r.write('<tr><td colspan="2">');r.write('<label class="sapUiSupportLabel">Absolute Path</label>');r.write('</td><td>');if(typeof f.absolutePath!=='undefined'){r.write('<div>'+q.sap.escapeHTML(f.absolutePath||"")+'</div>');}else{r.write('<div>No binding</div>');}r.write('</td></tr>');r.write('<tr><td colspan="2">');r.write('<label class="sapUiSupportLabel">Relative</label>');r.write('</td><td>');if(typeof f.isRelative!=='undefined'){r.write('<div>'+q.sap.escapeHTML(f.isRelative||"")+'</div>');}else{r.write('<div>No binding</div>');}r.write('</td></tr>');r.write('<tr><td colspan="2">');r.write('<label class="sapUiSupportLabel">Binding Type</label>');r.write('</td><td>');if(!o.type){r.write('<div>No binding</div>');}else{r.write('<div');r.writeAttributeEscaped("title",o.type);r.write('>');r.writeEscaped(""+o.type.substring(o.type.lastIndexOf(".")+1));r.write('</div>');}r.write('</td></tr>');if(f.mode){r.write('<tr><td colspan="2">');r.write('<label class="sapUiSupportLabel">Binding Mode</label>');r.write('</td><td>');r.write('<div>');r.writeEscaped(""+f.mode);r.write('</div></td></tr>');}r.write('<tr><td>');r.write('<label class="sapUiSupportLabel">Model</label>');r.write('</td><td>');r.write('<label class="sapUiSupportLabel">Name</label>');r.write('</td><td>');if(f.model&&f.model.name){r.write('<div>');r.writeEscaped(""+f.model.name);r.write('</div>');}else{r.write('<div>No binding</div>');}r.write('</td></tr>');r.write('<tr><td>');r.write('</td><td>');r.write('<label class="sapUiSupportLabel">Type</label>');r.write('</td><td>');if(f.model&&f.model.type){r.write('<div><span ');r.writeAttributeEscaped("title",o.model.type);r.write('>');r.writeEscaped(""+f.model.type.substring(f.model.type.lastIndexOf(".")+1));r.write('</span></div>');}else{r.write('<div><span>No binding</span></div>');}r.write('</td></tr>');r.write('<tr><td>');r.write('</td><td>');r.write('<label class="sapUiSupportLabel">Default Binding Mode</label>');r.write('</td><td>');if(f.model&&f.model.bindingMode){r.write('<div><span>');r.writeEscaped(""+f.model.bindingMode);r.write('</span></div>');}else{r.write('<div><span>No binding</span></div>');}r.write('</td></tr>');r.write('<tr><td>');r.write('</td><td>');r.write('<label class="sapUiSupportLabel">Location</label>');r.write('</td><td>');if(f.model&&f.model.location&&f.model.location.type){if(f.model.location.type==='control'){r.write('<div><a class="control-tree sapUiSupportLink" title="'+q.sap.escapeHTML(f.model.location.name||"")+'" data-sap-ui-control-id="'+q.sap.escapeHTML(f.model.location.id||"")+'" href="javascript:void(0);">'+q.sap.escapeHTML(f.model.location.name.substring(f.model.location.name.lastIndexOf(".")+1)||"")+' ('+q.sap.escapeHTML(f.model.location.id||"")+')</a></div>');}else{r.write('<div><span title="sap.ui.getCore()">Core</span></div>');}}else{r.write('<div><span>No binding</span></div>');}r.write('</td></tr>');r.write('</tbody></table></div>');});r.write('</li>');});r.write('</ul>');}r.flush(this.$().find("#sapUiSupportControlPropertiesArea").get(0));r.destroy();};C.prototype.renderBreakpointsTab=function(m,s){var r=sap.ui.getCore().createRenderManager();r.write('<div class="sapUiSupportControlMethods" data-sap-ui-controlid="'+q.sap.escapeHTML(s||"")+'">');r.write('<select id="sapUiSupportControlMethodsSelect" class="sapUiSupportAutocomplete"><option></option>');$.each(m,function(i,v){if(!v.active){r.write('<option>');r.writeEscaped(""+v.name);r.write('</option>');}});r.write('</select>');r.write('<input class="sapUiSupportControlBreakpointInput sapUiSupportAutocomplete" type="text"/>');r.write('<button id="sapUiSupportControlAddBreakPoint" class="sapUiSupportBtn">Add breakpoint</button>');r.write('<hr class="no-border"/><ul id="sapUiSupportControlActiveBreakpoints" class="sapUiSupportList sapUiSupportBreakpointList">');$.each(m,function(i,v){if(!v.active){return;}r.write('<li><span>'+q.sap.escapeHTML(v.name||"")+'</span>'+'<img class="remove-breakpoint" style="cursor:pointer;margin-left:5px" '+'src="../../debug/images/delete.gif"></li>');});r.write('</ul></div>');r.flush(this.$().find("#sapUiSupportControlPropertiesArea").get(0));r.destroy();this.selectTab(this._tab.breakpoints);this.$().find('.sapUiSupportControlBreakpointInput').focus();};C.prototype.renderExportTab=function(){var r=sap.ui.getCore().createRenderManager();r.write('<button id="sapUiSupportControlExportToXml" class="sapUiSupportBtn">Export To XML</button>');r.write('<br><br>');r.write('<button id="sapUiSupportControlExportToHtml" class="sapUiSupportBtn">Export To HTML</button>');r.flush(this.$().find("#sapUiSupportControlPropertiesArea").get(0));r.destroy();this.selectTab(this._tab.exports);};C.prototype.requestProperties=function(s){this._oStub.sendEvent(this._breakpointId+"RequestInstanceMethods",{controlId:s,callback:this.getId()+"ReceivePropertiesMethods"});};C.prototype.updateBreakpointCount=function(s,B){var e=$("#sap-debug-controltree-"+s+" > div span.sapUiSupportControlTreeBreakpointCount");if(B.active>0){e.text(B.active+" / "+B.all).show();}else{e.text("").hide();}};C.prototype.onsapUiSupportControlTreeTriggerRequestProperties=function(e){this.requestProperties(e.getParameter("controlId"));};C.prototype.onsapUiSupportControlTreeReceivePropertiesMethods=function(e){var s=e.getParameter("controlId");this._oStub.sendEvent(this.getId()+"RequestProperties",{id:s,breakpointMethods:e.getParameter("methods")});this.updateBreakpointCount(s,JSON.parse(e.getParameter("breakpointCount")));};C.prototype.onsapUiSupportControlTreeReceiveControlTree=function(e){this.renderControlTree(JSON.parse(e.getParameter("controlTree")));};C.prototype.onsapUiSupportControlTreeReceiveControlTreeExportError=function(e){var s=e.getParameter("errorMessage");this._drawAlert(s);};C.prototype._drawAlert=function(e){alert("ERROR: The selected element cannot not be exported.\nPlease choose an other one.\n\nReason:\n"+e);};C.prototype.onsapUiSupportControlTreeReceiveControlTreeExport=function(e){var z;var v=JSON.parse(e.getParameter("serializedViews"));var t=e.getParameter("sType");if(!$.isEmptyObject(v)){z=new J();for(var o in v){var f=v[o];z.file(o.replace(/\./g,'/')+".view."+t.toLowerCase(),f);}}if(z){var g=z.generate({base64:true});var r=window.atob(g);var u=new Uint8Array(r.length);for(var i=0;i<u.length;++i){u[i]=r.charCodeAt(i);}var h=new Blob([u],{type:'application/zip'});var j=document.createEvent("HTMLEvents");j.initEvent("click");$("<a>",{download:t.toUpperCase()+"Export.zip",href:window.URL.createObjectURL(h)}).get(0).dispatchEvent(j);}};C.prototype.onsapUiSupportSelectorSelect=function(e){this.selectControl(e.getParameter("id"));};C.prototype.onsapUiSupportControlTreeReceiveProperties=function(e){this.renderPropertiesTab(JSON.parse(e.getParameter("properties")),e.getParameter("id"));};C.prototype.onsapUiSupportControlTreeReceiveBindingInfos=function(e){this.renderBindingsTab(JSON.parse(e.getParameter("bindinginfos")),e.getParameter("id"));};C.prototype.onsapUiSupportControlTreeReceiveMethods=function(e){var s=e.getParameter("controlId");this.renderBreakpointsTab(JSON.parse(e.getParameter("methods")),s);this.updateBreakpointCount(s,JSON.parse(e.getParameter("breakpointCount")));};C.prototype._onNodeClick=function(e){var f=$(e.target);var g=f.closest("li");if(g.hasClass("sapUiControlTreeElement")){$(".sapUiControlTreeElement > div").removeClass("sapUiSupportControlTreeSelected");g.children("div").addClass("sapUiSupportControlTreeSelected");this._oStub.sendEvent("sapUiSupportSelectorHighlight",{id:g.attr("id").substring("sap-debug-controltree-".length)});var i=g.attr("id").substring("sap-debug-controltree-".length);if(f.hasClass("sapUiSupportControlTreeBreakpointCount")){this._currentTab=this._tab.breakpoints;}this.onAfterControlSelected(i);}e.stopPropagation();};C.prototype._onIconClick=function(e){var f=$(e.target);if(f.parent().attr("data-sap-ui-collapsed")){f.attr("src",f.attr("src").replace("plus","minus")).parent().removeAttr("data-sap-ui-collapsed");f.siblings("ul").show();}else{f.attr("src",f.attr("src").replace("minus","plus")).parent().attr("data-sap-ui-collapsed","true");f.siblings("ul").hide();}if(e.stopPropagation){e.stopPropagation();}};C.prototype._onControlTreeLinkClick=function(e){this.selectControl($(e.target).closest("li").attr("data-sap-ui-controlid"));};C.prototype._onPropertiesTab=function(e){if(this.selectTab(this._tab.properties)){this.requestProperties(this.getSelectedControlId());}};C.prototype._onBindingInfosTab=function(e){if(this.selectTab(this._tab.bindinginfos)){this._oStub.sendEvent(this.getId()+"RequestBindingInfos",{id:this.getSelectedControlId()});}};C.prototype._onMethodsTab=function(e){if(this.selectTab(this._tab.breakpoints)){this._oStub.sendEvent(this._breakpointId+"RequestInstanceMethods",{controlId:this.getSelectedControlId(),callback:this.getId()+"ReceiveMethods"});}};C.prototype._onExportTab=function(e){if(this.selectTab(this._tab.exports)){this.renderExportTab();}};C.prototype._autoComplete=function(e){if(e.keyCode==q.sap.KeyCodes.ENTER){this._updateSelectOptions(e);this._onAddBreakpointClicked();}if(e.keyCode>=q.sap.KeyCodes.ARROW_LEFT&&e.keyCode<=q.sap.KeyCodes.ARROW_DOWN){return;}var f=$(e.target),g=f.prev("select"),I=f.val();if(I==""){return;}var o=g.find("option").map(function(){return $(this).val();}).get();var O;for(var i=0;i<o.length;i++){O=o[i];if(O.toUpperCase().indexOf(I.toUpperCase())==0){var h=f.cursorPos();if(e.keyCode==q.sap.KeyCodes.BACKSPACE){h--;}f.val(O);f.selectText(h,O.length);break;}}return;};C.prototype._updateSelectOptions=function(e){var s=e.target;if(s.tagName=="INPUT"){var v=s.value;s=s.previousSibling;var o=s.options;for(var i=0;i<o.length;i++){var t=o[i].value||o[i].text;if(t.toUpperCase()==v.toUpperCase()){s.selectedIndex=i;break;}}}var f=s.selectedIndex;var g=s.options[f].value||s.options[f].text;if(s.nextSibling&&s.nextSibling.tagName=="INPUT"){s.nextSibling.value=g;}};C.prototype._onAddBreakpointClicked=function(e){var f=this.$().find("#sapUiSupportControlMethodsSelect");this._oStub.sendEvent(this._breakpointId+"ChangeInstanceBreakpoint",{controlId:f.closest("[data-sap-ui-controlid]").attr("data-sap-ui-controlid"),methodName:f.val(),active:true,callback:this.getId()+"ReceiveMethods"});};C.prototype._onExportToXmlClicked=function(e){this._startSerializing("XML");};C.prototype._onExportToHtmlClicked=function(e){this._startSerializing("HTML");};C.prototype._startSerializing=function(t){var s=this.getSelectedControlId();if(s){this._oStub.sendEvent(this.getId()+"RequestControlTreeSerialize",{controlID:s,sType:t});}else{this._drawAlert("Nothing to export. Please select an item in the control tree.");}};C.prototype._onRemoveBreakpointClicked=function(e){var f=$(e.target);this._oStub.sendEvent(this._breakpointId+"ChangeInstanceBreakpoint",{controlId:f.closest("[data-sap-ui-controlid]").attr("data-sap-ui-controlid"),methodName:f.siblings('span').text(),active:false,callback:this.getId()+"ReceiveMethods"});};C.prototype._selectOptionsChanged=function(e){var s=e.target;var i=s.nextSibling;i.value=s.options[s.selectedIndex].value;};C.prototype._onPropertyChange=function(e){var s=e.target;var f=$(s);var i=f.closest("[data-sap-ui-controlid]").attr("data-sap-ui-controlid");var v=f.val();if(f.attr("type")==="checkbox"){v=""+f.is(":checked");}this._oStub.sendEvent(this.getId()+"ChangeProperty",{id:i,name:f.attr("data-sap-ui-name"),value:v});};C.prototype._onPropertyBreakpointChange=function(e){var f=$(e.target);this._oStub.sendEvent(this._breakpointId+"ChangeInstanceBreakpoint",{controlId:f.closest("[data-sap-ui-controlid]").attr("data-sap-ui-controlid"),methodName:f.attr("data-sap-ui-method"),active:f.is(":checked"),callback:this.getId()+"TriggerRequestProperties"});};C.prototype._onNavToControl=function(e){var f=$(e.target);var i=f.attr("data-sap-ui-control-id");if(i!==this.getSelectedControlId()){this.selectControl(i);}};C.prototype._onRefreshBinding=function(e){var f=$(e.target);var i=f.closest("[data-sap-ui-controlid]").attr("data-sap-ui-controlid");var n=f.closest("[data-sap-ui-binding-name]").attr("data-sap-ui-binding-name");this._oStub.sendEvent(this.getId()+"RefreshBinding",{id:i,name:n});};C.prototype.selectTab=function(t){var e=this.$().find("#sapUiSupportControlTab"+t);if(e.hasClass("active")){return false;}this.$().find("#sapUiSupportControlTabs button").removeClass("active");e.addClass("active");this._currentTab=t;return true;};C.prototype.getSelectedControlId=function(){var e=this.$().find(".sapUiSupportControlTreeSelected");if(e.length===0){return undefined;}else{return e.parent().attr("id").substring("sap-debug-controltree-".length);}};C.prototype.selectControl=function(s){if(!s){return;}$(".sapUiControlTreeElement > div").removeClass("sapUiSupportControlTreeSelected");var t=this;$.sap.byId("sap-debug-controltree-"+s).parents("[data-sap-ui-collapsed]").each(function(i,v){t._onIconClick({target:$(v).find("img:first").get(0)});});var p=$.sap.byId("sap-debug-controltree-"+s).children("div").addClass("sapUiSupportControlTreeSelected").position();var S=this.$().find("#sapUiSupportControlTreeArea").scrollTop();this.$().find("#sapUiSupportControlTreeArea").scrollTop(S+p.top);this.onAfterControlSelected(s);};C.prototype.onAfterControlSelected=function(i){if(this._currentTab==this._tab.properties){this.requestProperties(i);}else if(this._currentTab==this._tab.breakpoints){this._oStub.sendEvent(this._breakpointId+"RequestInstanceMethods",{controlId:i,callback:this.getId()+"ReceiveMethods"});}else if(this._currentTab==this._tab.bindinginfos){this._oStub.sendEvent(this.getId()+"RequestBindingInfos",{id:this.getSelectedControlId()});}};function d(s){this.onsapUiSupportControlTreeRequestControlTree();}C.prototype.onsapUiSupportControlTreeRequestControlTree=function(e){this._oStub.sendEvent(this.getId()+"ReceiveControlTree",{controlTree:JSON.stringify(this.getControlTree())});};C.prototype.onsapUiSupportControlTreeRequestControlTreeSerialize=function(e){var o=this.oCore.byId(e.getParameter("controlID"));var t=e.getParameter("sType");var v;var m;sap.ui.controller(t+"ViewController",{});sap.ui.jsview(t+"ViewExported",{getControllerName:function(){return t+"ViewController";},createContent:function(k){}});sap.ui.controller(t+"ViewController",{});sap.ui.jsview(t+"ViewExported",{getControllerName:function(){return t+"ViewController";},createContent:function(k){}});try{if(o){var p=o.getParent();var f;f=p.indexOfContent(o);if(o instanceof b){v=new V(o,window,"sap.m");}else{var g=sap.ui.jsview(t+"ViewExported");g.addContent(o);v=new V(g,window,"sap.m");}m=(t&&t!=="XML")?v.serializeToHTML():v.serializeToXML();if(f){p.insertContent(o,f);}else{p.addContent(o);}}else{var u=this.oCore.getUIArea(e.getParameter("controlID"));var g=sap.ui.jsview(t+"ViewExported");var h=u.getContent();for(var i=0;i<h.length;i++){g.addContent(h[i]);}v=new V(g,window,"sap.m");m=(t&&t!=="XML")?v.serializeToHTML():v.serializeToXML();for(var i=0;i<h.length;i++){u.addContent(h[i]);}}if(v){this._oStub.sendEvent(this.getId()+"ReceiveControlTreeExport",{serializedViews:JSON.stringify(m),sType:t});}}catch(j){this._oStub.sendEvent(this.getId()+"ReceiveControlTreeExportError",{errorMessage:j.message});}};C.prototype.onsapUiSupportControlTreeRequestProperties=function(e){var f=JSON.parse(e.getParameter("breakpointMethods"));var g=this.getControlProperties(e.getParameter("id"),f);this._oStub.sendEvent(this.getId()+"ReceiveProperties",{id:e.getParameter("id"),properties:JSON.stringify(g)});};C.prototype.onsapUiSupportControlTreeChangeProperty=function(e){var i=e.getParameter("id");var o=this.oCore.byId(i);if(o){var n=e.getParameter("name");var v=e.getParameter("value");var p=o.getMetadata().getProperty(n);if(p&&p.type){var t=sap.ui.base.DataType.getType(p.type);if(t instanceof sap.ui.base.DataType){var f=t.parseValue(v);if(t.isValid(f)&&f!=="(null)"){o[p._sMutator](f);}}else if(t){if(t[v]){o[p._sMutator](v);}}}}};C.prototype.onsapUiSupportControlTreeRequestBindingInfos=function(e){var i=e.getParameter("id");this._oStub.sendEvent(this.getId()+"ReceiveBindingInfos",{id:i,bindinginfos:JSON.stringify(this.getControlBindingInfos(i))});};C.prototype.onsapUiSupportControlTreeRefreshBinding=function(e){var i=e.getParameter("id");var B=e.getParameter("name");this.refreshBinding(i,B);this._oStub.sendEvent(this.getId()+"ReceiveBindingInfos",{id:i,bindinginfos:JSON.stringify(this.getControlBindingInfos(i))});};C.prototype.getControlTree=function(){var o=this.oCore,e=[],A={};function s(g){var m={id:g.getId(),type:"",aggregation:[],association:[]};A[m.id]=m.id;if(g instanceof U){m.library="sap.ui.core";m.type="sap.ui.core.UIArea";$.each(g.getContent(),function(I,g){var t=s(g);m.aggregation.push(t);});}else{m.library=g.getMetadata().getLibraryName();m.type=g.getMetadata().getName();if(g.mAggregations){for(var h in g.mAggregations){var i=g.mAggregations[h];if(i){var j=$.isArray(i)?i:[i];$.each(j,function(I,v){if(v instanceof E){var t=s(v);m.aggregation.push(t);}});}}}if(g.mAssociations){var k=g.getMetadata().getAllAssociations();for(var l in g.mAssociations){var n=g.mAssociations[l];var p=(k[l])?k[l].type:null;if(n&&p){var r=$.isArray(n)?n:[n];$.each(r,function(I,v){m.association.push({id:v,type:p,name:l,isAssociationLink:true});});}}}}return m;}$.each(o.mUIAreas,function(i,u){var m=s(u);e.push(m);});function f(I,m){for(var i=0;i<m.association.length;i++){var g=m.association[i];if(!A[g.id]){var t=q.sap.getObject(g.type);if(!t){continue;}var S=t.getMetadata().getStereotype(),O=null;switch(S){case"element":case"control":O=o.byId(g.id);break;case"component":O=o.getComponent(g.id);break;case"template":O=o.getTemplate(g.id);break;default:break;}if(!O){continue;}m.association[i]=s(O);m.association[i].isAssociation=true;f(0,m.association[i]);}}$.each(m.aggregation,f);}$.each(e,f);return e;};C.prototype.getControlProperties=function(i,m){var p=/^((boolean|string|int|float)(\[\])?)$/;var e=[];var f=this.oCore.byId(i);if(!f&&this.oCore.getUIArea(i)){e.push({control:"sap.ui.core.UIArea",properties:[],aggregations:[]});}else if(f){var M=f.getMetadata();while(M instanceof a){var g={control:M.getName(),properties:[],aggregations:[]};var h=M.getProperties();$.each(h,function(k,j){var l={};$.each(j,function(n,v){if(n.substring(0,1)!=="_"||(n=='_sGetter'||n=='_sMutator')){l[n]=v;}if(n=='_sGetter'||n=='_sMutator'){l["bp"+n]=$.grep(m,function(o){return o.name===v&&o.active;}).length===1;}var t=sap.ui.base.DataType.getType(j.type);if(t&&!(t instanceof sap.ui.base.DataType)){l["enumValues"]=t;}});l.value=f.getProperty(k);l.isBound=!!f.mBindingInfos[k];g.properties.push(l);});var A=M.getAggregations();$.each(A,function(k,j){if(j.altTypes&&j.altTypes[0]&&p.test(j.altTypes[0])&&typeof(f.getAggregation(k))!=='object'){var l={};$.each(j,function(n,v){if(n.substring(0,1)!=="_"||(n=='_sGetter'||n=='_sMutator')){l[n]=v;}if(n=='_sGetter'||n=='_sMutator'){l["bp"+n]=$.grep(m,function(o){return o.name===v&&o.active;}).length===1;}});l.value=f.getAggregation(k);g.aggregations.push(l);}});e.push(g);M=M.getParent();}}return e;};C.prototype.getControlBindingInfos=function(i){var m={bindings:[],contexts:[]};var o=this.oCore.byId(i);if(!o){return m;}var B=o.mBindingInfos;var t=this;for(var e in B){if(B.hasOwnProperty(e)){var f=B[e];var g=[];var h,j=[];if($.isArray(f.parts)){h=f.parts;}else{h=[f];}if(f.binding instanceof sap.ui.model.CompositeBinding){j=f.binding.getBindings();}else if(f.binding instanceof sap.ui.model.Binding){j=[f.binding];}$.each(h,function(I,s){var D={};D.invalidPath=true;D.path=s.path;D.mode=s.mode;D.model={name:s.model};if(j.length>I&&j[I]){var u=j[I],M=u.getModel();var A;if(M){A=M.resolve(u.getPath(),u.getContext());if(M.getProperty(A)!=null){D.invalidPath=false;}}D.absolutePath=(typeof(A)==='undefined')?'Unresolvable':A;D.isRelative=u.isRelative();D.model=t.getBindingModelInfo(u,o);}g.push(D);});m.bindings.push({name:e,type:(f.binding)?f.binding.getMetadata().getName():undefined,bindings:g});}}function k(s,M){var u={modelName:(M==='undefined')?'none (default)':M,path:s.getPath()};if(!s.getObject()==null){u.invalidPath=true;}return u;}var l=o.oBindingContexts;for(var n in l){if(l.hasOwnProperty(n)){m.contexts.push(k(l[n],n));}}var l=o.oPropagatedProperties.oBindingContexts;for(var n in l){if(l.hasOwnProperty(n)&&!o.oBindingContexts[n]){var p=k(l[n],n);var r=o;do{if(r.oBindingContexts[n]==l[n]){p.location={id:r.getId(),name:r.getMetadata().getName()};break;}}while((r=r.getParent()));m.contexts.push(p);}}return m;};C.prototype.getBindingModelInfo=function(B,o){var m={};var e=B.getModel();function g(M){for(var s in M){if(M.hasOwnProperty(s)){if(M[s]===e){return s;}}}return null;}m.name=g(o.oModels)||g(o.oPropagatedProperties.oModels);if(m.name){var f=o;do{if(f.oModels[m.name]===e){m.location={type:'control',id:f.getId(),name:f.getMetadata().getName()};break;}}while((f=f.getParent()));if(!m.location){var h=null;if(m.name==='undefined'){h=this.oCore.getModel();}else{h=this.oCore.getModel(m.name);}if(h){m.location={type:'core'};}}}m.type=e.getMetadata().getName();m.bindingMode=e.getDefaultBindingMode();m.name=(m.name==='undefined')?'none (default)':m.name;return m;};C.prototype.refreshBinding=function(I,B){var o=this.oCore.byId(I);var m=o.mBindingInfos[B];if(!o||!m){return;}var e=m.binding;if(!e){return;}if(e instanceof sap.ui.model.CompositeBinding){var f=e.getBindings();for(var i=0;i<f.length;i++){f[i].refresh();}}else{e.refresh();}};return C;});
