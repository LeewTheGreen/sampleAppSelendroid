/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/Renderer','sap/ui/core/ValueStateSupport'],function(q,R,V){"use strict";var I={};I.render=function(r,c){var v=c.getValueState(),t=c.getTextDirection(),T=R.getTextAlign(c.getTextAlign(),t),a=sap.ui.getCore().getConfiguration().getAccessibility();r.write("<div");r.writeControlData(c);this.addOuterStyles(r,c);if(c.getWidth()){r.addStyle("width",c.getWidth());}r.writeStyles();r.addClass("sapMInputBase");this.addCursorClass(r,c);this.addOuterClasses(r,c);if(!c.getEnabled()){r.addClass("sapMInputBaseDisabled");}if(!c.getEditable()){r.addClass("sapMInputBaseReadonly");}if(v!==sap.ui.core.ValueState.None){this.addValueStateClasses(r,c);}r.writeClasses();this.writeOuterAttributes(r,c);var s=c.getTooltip_AsString();if(s){r.writeAttributeEscaped("title",s);}r.write(">");this.prependInnerContent(r,c);if(c.bShowLabelAsPlaceholder){r.write("<label");r.writeAttribute("id",c.getId()+"-placeholder");if(T){r.addStyle("text-align",T);}this.addPlaceholderClasses(r,c);this.addPlaceholderStyles(r,c);r.writeClasses();r.writeStyles();r.write(">");r.writeEscaped(c._getPlaceholder());r.write("</label>");}this.openInputTag(r,c);r.writeAttribute("id",c.getId()+"-inner");if(c.getName()){r.writeAttributeEscaped("name",c.getName());}if(!c.bShowLabelAsPlaceholder&&c._getPlaceholder()){r.writeAttributeEscaped("placeholder",c._getPlaceholder());}if(c.getMaxLength&&c.getMaxLength()>0){r.writeAttribute("maxlength",c.getMaxLength());}if(!c.getEnabled()){r.writeAttribute("disabled","disabled");r.addClass("sapMInputBaseDisabledInner");}else if(!c.getEditable()){r.writeAttribute("readonly","readonly");r.addClass("sapMInputBaseReadonlyInner");}if(t!=sap.ui.core.TextDirection.Inherit){r.writeAttribute("dir",t.toLowerCase());}this.writeInnerValue(r,c);if(a){this.writeAccessibilityState(r,c);}if(sap.ui.Device.browser.mozilla){if(s){r.writeAttributeEscaped("x-moz-errormessage",s);}else{r.writeAttribute("x-moz-errormessage"," ");}}this.writeInnerAttributes(r,c);r.addClass("sapMInputBaseInner");if(v!==sap.ui.core.ValueState.None){r.addClass("sapMInputBaseStateInner");r.addClass("sapMInputBase"+v+"Inner");}this.addInnerClasses(r,c);r.writeClasses();if(T){r.addStyle("text-align",T);}this.addInnerStyles(r,c);r.writeStyles();r.write(">");this.writeInnerContent(r,c);this.closeInputTag(r,c);if(a){this.renderAriaLabelledBy(r,c);this.renderAriaDescribedBy(r,c);}r.write("</div>");};I.getAriaRole=function(c){return"textbox";};I.getAriaLabelledBy=function(c){if(this.getLabelledByAnnouncement(c)){return c.getId()+"-labelledby";}};I.getLabelledByAnnouncement=function(c){return c._getPlaceholder()||"";};I.renderAriaLabelledBy=function(r,c){var a=this.getLabelledByAnnouncement(c);if(a){r.write("<label");r.writeAttribute("id",c.getId()+"-labelledby");r.writeAttribute("aria-hidden","true");r.addClass("sapUiInvisibleText");r.writeClasses();r.write(">");r.writeEscaped(a.trim());r.write("</label>");}};I.getAriaDescribedBy=function(c){if(this.getDescribedByAnnouncement(c)){return c.getId()+"-describedby";}};I.getDescribedByAnnouncement=function(c){return c.getTooltip_AsString()||"";};I.renderAriaDescribedBy=function(r,c){var a=this.getDescribedByAnnouncement(c);if(a){r.write("<span");r.writeAttribute("id",c.getId()+"-describedby");r.writeAttribute("aria-hidden","true");r.addClass("sapUiInvisibleText");r.writeClasses();r.write(">");r.writeEscaped(a.trim());r.write("</span>");}};I.getAccessibilityState=function(c){var a=this.getAriaLabelledBy(c),A=this.getAriaDescribedBy(c),m={role:this.getAriaRole(c)};if(c.getValueState()===sap.ui.core.ValueState.Error){m.invalid=true;}if(a){m.labelledby={value:a.trim(),append:true};}if(A){m.describedby={value:A.trim(),append:true};}return m;};I.writeAccessibilityState=function(r,c){r.writeAccessibilityState(c,this.getAccessibilityState(c));};I.openInputTag=function(r,c){r.write("<input");};I.writeInnerValue=function(r,c){r.writeAttributeEscaped("value",c.getValue());};I.addCursorClass=function(r,c){};I.addOuterStyles=function(r,c){};I.addOuterClasses=function(r,c){};I.writeOuterAttributes=function(r,c){};I.addInnerStyles=function(r,c){};I.addInnerClasses=function(r,c){};I.writeInnerAttributes=function(r,c){};I.prependInnerContent=function(r,c){};I.writeInnerContent=function(r,c){};I.closeInputTag=function(r,c){};I.addPlaceholderStyles=function(r,c){};I.addPlaceholderClasses=function(r,c){r.addClass("sapMInputBasePlaceholder");};I.addValueStateClasses=function(r,c){r.addClass("sapMInputBaseState");r.addClass("sapMInputBase"+c.getValueState());};return I;},true);
