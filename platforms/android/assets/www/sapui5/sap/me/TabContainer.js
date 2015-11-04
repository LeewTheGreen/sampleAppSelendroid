/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(['jquery.sap.global','./library','sap/ui/core/Control','sap/ui/core/IconPool','sap/ui/core/theming/Parameters'],function(q,l,C,I,P){"use strict";var T=C.extend("sap.me.TabContainer",{metadata:{deprecated:true,library:"sap.me",properties:{selectedTab:{type:"int",group:"Data",defaultValue:null},badgeInfo:{type:"int",group:"Data",defaultValue:null},badgeNotes:{type:"int",group:"Data",defaultValue:null},badgeAttachments:{type:"int",group:"Data",defaultValue:null},badgePeople:{type:"int",group:"Data",defaultValue:null},expandable:{type:"boolean",group:"Misc",defaultValue:true},expanded:{type:"boolean",group:"Misc",defaultValue:true},visible:{type:"boolean",group:"Misc",defaultValue:true}},aggregations:{tabs:{type:"sap.ui.core.Icon",multiple:true,singularName:"tab",visibility:"hidden"},contentInfo:{type:"sap.ui.core.Control",multiple:false},contentAttachments:{type:"sap.ui.core.Control",multiple:false},contentNotes:{type:"sap.ui.core.Control",multiple:false},contentPeople:{type:"sap.ui.core.Control",multiple:false},badges:{type:"sap.ui.core.Control",multiple:true,singularName:"badge",visibility:"hidden"}},events:{select:{allowPreventDefault:true},expand:{},collapse:{}}}});T.prototype.init=function(){this.addAggregation("tabs",this._createButton("Info"));this.addAggregation("tabs",this._createButton("Notes"));this.addAggregation("tabs",this._createButton("Attachments"));this.addAggregation("tabs",this._createButton("People"));I.insertFontFaceStyle();this._bFirstRendering=true;};T.prototype.setBadgeInfo=function(v){this._setBadgeLabelByName("badgeInfo",v);};T.prototype.setBadgeAttachments=function(v){this._setBadgeLabelByName("badgeAttachments",v);};T.prototype.setBadgeNotes=function(v){this._setBadgeLabelByName("badgeNotes",v);};T.prototype.setBadgePeople=function(v){this._setBadgeLabelByName("badgePeople",v);};T.prototype.onBeforeRendering=function(){if(this.getSelectedTab()==undefined){this.setProperty("selectedTab",0,true);}};T.prototype._setBadgeLabelByName=function(n,v){var a=sap.ui.getCore().byId(this.getId()+"-"+n);a.setText(v);this.setProperty(n,v);a.toggleStyleClass("sapUIMeTabContainerHiddenBadges",(v==0));};T.prototype._placeElements=function(){var $=this.$("arrow");var b=this.getAggregation("tabs")[this.getSelectedTab()];if(b&&(b.$().outerWidth()>8)){var L=parseFloat(b.$()[0].offsetLeft)+parseFloat(b.$().outerWidth()/2)-parseFloat($.width()/2);$.css("left",L+"px");}};T.prototype.onAfterRendering=function(){this.setProperty("expanded",true,true);if(this._bFirstRendering){this._bFirstRendering=false;setTimeout(q.proxy(this._placeElements,this),300);}else{this._placeElements();}};T.prototype.onThemeChanged=function(){this._placeElements();};T.prototype.onTransitionEnded=function(){var $=this.$("container");if(this.getExpanded()){this.$("arrow").show();$.css("display","block");this.$().find(".sapUIMeTabContainerContent").removeClass("sapUIMeTabContainerContentClosed");}else{$.css("display","none");this.$().find(".sapUIMeTabContainerContent").addClass("sapUIMeTabContainerContentClosed");}};T.prototype.toggleExpandCollapse=function(){var e=!this.getExpanded();var $=this.$("container");var a=this.$("arrow");if(e){this.$().find(".sapUIMeTabContainerButtons").children().filter(":eq("+this.getSelectedTab()+")").addClass("sapUIMeTabContainerTabSelected");$.slideDown('400',q.proxy(this.onTransitionEnded,this));this.fireExpand();}else{a.hide();this.$().find(".sapUIMeTabContainerTabSelected").removeClass("sapUIMeTabContainerTabSelected");$.slideUp('400',q.proxy(this.onTransitionEnded,this));this.fireCollapse();}this.setProperty("expanded",e,true);};T.prototype.onButtonTap=function(e){var b=e.getSource();var i=this.indexOfAggregation("tabs",b);if(i==this.getSelectedTab()&&this.getExpandable()){this.toggleExpandCollapse();}else{this.setProperty("expanded",true,true);var B=b.getId();var c=this._getContentForBtn(B);if(c){if(this.fireSelect()){this.setSelectedTab(i);}}}};T.prototype._getContentForBtn=function(b){var i=this.getId()+"-";var c=b.substr(b.indexOf(i)+i.length);return this.getAggregation(c);};T.prototype._getBagdeForBtn=function(b){var i=this.getId()+"-content";var a=b.substr(b.indexOf(i)+i.length);a.charAt(0).toUpperCase();a="badge"+a;return this.getProperty(a);};T.prototype._getScrollContainer=function(c){return new sap.m.ScrollContainer({content:c});};T.prototype._createButton=function(i){var s=P.get("sapMeTabIcon"+i);var u=I.getIconURI(s);var c=P.get("sapMeTabColor"+i);var b=new sap.ui.core.Icon(this.getId()+'-content'+i,{src:u,backgroundColor:c,activeColor:P.get("sapUiIconInverted")});b.addStyleClass("sapUIMeTabContainerBtn");b.addStyleClass("sapUIMeTabContainerBtn"+i);b.attachPress(this.onButtonTap,this);var L=new sap.m.Label(this.getId()+'-badge'+i,{textAlign:"Center"});L.addStyleClass("sapUIMeTabContainerBadge");L.addStyleClass("sapUIMeTabContainerBadge"+i);this.addAggregation("badges",L);return b;};return T;},true);
