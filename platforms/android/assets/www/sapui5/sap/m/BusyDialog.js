/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./library','sap/ui/core/Control','sap/ui/core/Popup','sap/ui/core/theming/Parameters'],function(q,l,C,P,a){"use strict";var B=C.extend("sap.m.BusyDialog",{metadata:{library:"sap.m",properties:{text:{type:"string",group:"Appearance",defaultValue:null},title:{type:"string",group:"Appearance",defaultValue:null},customIcon:{type:"sap.ui.core.URI",group:"Appearance",defaultValue:null},customIconRotationSpeed:{type:"int",group:"Appearance",defaultValue:1000},customIconDensityAware:{type:"boolean",defaultValue:true},customIconWidth:{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:"30px"},customIconHeight:{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:"44px"},cancelButtonText:{type:"string",group:"Misc",defaultValue:null},showCancelButton:{type:"boolean",group:"Appearance",defaultValue:false}},aggregations:{_busyLabel:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"},_busyIndicator:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"},_toolbar:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"},_cancelButton:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"}},events:{close:{parameters:{cancelPressed:{type:"boolean"}}}}}});B.prototype.init=function(){var t=this;this._$window=q(window);this._busyIndicator=new sap.m.BusyIndicator(this.getId()+'-busyInd',{visible:false}).addStyleClass('sapMBsyInd');this.setAggregation("_busyIndicator",this._busyIndicator,true);this.iOldWinHeight=0;this._oPopup=new P();this._oPopup.setShadow(false);this._oPopup.setModal(true,'sapMDialogBLyInit');this._oPopup.setAnimations(this.openAnimation,this.closeAnimation);this._fOrientationChange=q.proxy(this._reposition,this);this._oPopup._applyPosition=function(p){t._setDimensions();P.prototype._applyPosition.call(this,p);};this._oPopup._showBlockLayer=function(){P.prototype._showBlockLayer.call(this);var b=q("#sap-ui-blocklayer-popup");b.toggleClass("sapMDialogBLyInit",true);};this._oPopup._hideBlockLayer=function(){var b=q("#sap-ui-blocklayer-popup");var $=q("#sap-ui-blocklayer-popup-bar");$.css({'visibility':'','display':'none'});b.toggleClass('sapMDialogBLyInit',false);b.css("top","");P.prototype._hideBlockLayer.call(this);};if(sap.ui.Device.system.desktop){var o=q.proxy(function(e){this.close(true);e.stopPropagation();},this);this._oPopup.onsapescape=o;}};B.prototype.openAnimation=function(r,R,o){o();};B.prototype.closeAnimation=function(r,R,c){c();};B.prototype.exit=function(){this._oPopup.close();this._oPopup.destroy();this._oPopup=null;this._$window.unbind("resize",this._fOrientationChange);};B.prototype.open=function(){q.sap.log.debug("sap.m.BusyDialog.open called at "+new Date().getTime());var p=this._oPopup;if(!p){q.sap.log.warning("Method 'open' is called after sap.m.BusyDialog with id '"+this.getId()+"' is destroyed");return this;}if(p.isOpen()){return this;}p.setContent(this);p.attachOpened(this._handleOpened,this);p.setPosition("center center","center center",document,"0 0","fit");p.setInitialFocusId(this.getShowCancelButton()?this._oButton.getId():this.getId());this._bOpenRequested=true;this._openNowIfPossibleAndRequested();return this;};B.prototype._openNowIfPossibleAndRequested=function(){if(!this._bOpenRequested){return;}if(!document.body||!sap.ui.getCore().isInitialized()){q.sap.delayedCall(50,this,"_openNowIfPossibleAndRequested");return;}this._bOpenRequested=false;this._oPopup.open();};B.prototype.close=function(f){this._bOpenRequested=false;var p=this._oPopup;if(!p){q.sap.log.warning("Method 'close' is called after sap.m.BusyDialog with id '"+this.getId()+"' is destroyed");return this;}var e=this._oPopup.getOpenState();if(!(e===sap.ui.core.OpenState.CLOSED||e===sap.ui.core.OpenState.CLOSING)){p.attachClosed(this._handleClosed,this);q.sap.log.debug("sap.m.BusyDialog.close called at "+new Date().getTime());p.close();this._busyIndicator.setVisible(false);this.fireClose({cancelPressed:!!f});}return this;};B.prototype.setText=function(t){this.setProperty("text",t,true);if(!this._oLabel){this._oLabel=new sap.m.Label(this.getId()+"-busyLabel",{}).addStyleClass("sapMBusyDialogLabel");this.setAggregation("_busyLabel",this._oLabel,true);}this._oLabel.setText(t);return this;};B.prototype.setCustomIcon=function(i){this.setProperty("customIcon",i,true);this._busyIndicator.setCustomIcon(i);return this;};B.prototype.setCustomIconRotationSpeed=function(s){this.setProperty("customIconRotationSpeed",s,true);this._busyIndicator.setCustomIconRotationSpeed(s);return this;};B.prototype.setCustomIconDensityAware=function(A){this.setProperty("customIconDensityAware",A,true);this._busyIndicator.setCustomIconDensityAware(A);return this;};B.prototype.setCustomIconWidth=function(w){this.setProperty("customIconWidth",w,true);this._busyIndicator.setCustomIconWidth(w);return this;};B.prototype.setCustomIconHeight=function(h){this.setProperty("customIconHeight",h,true);this._busyIndicator.setCustomIconHeight(h);return this;};B.prototype.setShowCancelButton=function(s){this.setProperty("showCancelButton",s,false);if(s){this._createCancelButton();}return this;};B.prototype.setCancelButtonText=function(t){this.setProperty("cancelButtonText",t,true);this._createCancelButton();this._oButton.setText(t);return this;};B.prototype._createCancelButton=function(){if(!this._oButton){var t=this;var b=(this.getCancelButtonText())?this.getCancelButtonText():sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("BUSYDIALOG_CANCELBUTTON_TEXT");this._oButton=new sap.m.Button(this.getId()+'busyCancelBtn',{text:b,type:sap.m.ButtonType.Transparent,press:function(){t.close(true);}}).addStyleClass("sapMDialogBtn");if(sap.ui.Device.system.phone){this._oButton.addStyleClass("sapMDialogBtnPhone");this.setAggregation("_cancelButton",this._oButton,true);}else{this._oButtonToolBar=new sap.m.Toolbar(this.getId()+"-toolbar",{content:[new sap.m.ToolbarSpacer(this.getId()+"-toolbarspacer"),this._oButton]}).addStyleClass("sapMTBNoBorders").addStyleClass("sapMBusyDialogFooter").applyTagAndContextClassFor("footer");this.setAggregation("_toolbar",this._oButtonToolBar,true);}}};B.prototype._reposition=function(){if(!this._oPopup){return;}var e=this._oPopup.getOpenState();if(!(e===sap.ui.core.OpenState.OPEN)){return;}this._oPopup._applyPosition(this._oPopup._oLastPosition);};B.prototype._handleOpened=function(){this._oPopup.detachOpened(this._handleOpened,this);this._busyIndicator.setVisible(true);this._$window.bind("resize",this._fOrientationChange);};B.prototype._handleClosed=function(){this._oPopup.detachClosed(this._handleClosed,this);this._$window.unbind("resize",this._fOrientationChange);};B.prototype._setDimensions=function(){var w=this._$window.height();var $=this.$();$.css({"left":"0px","top":"0px","max-height":this._$window.height()+"px"});if(w<=this.iOldWinHeight){if(!this.$().hasClass("sapMBsyDSmall")){this._checkSize(w);}}if(w>this.iOldWinHeight){if((this.$().hasClass("sapMBsyDSmall"))){this._checkSize(w);}}if(this.iOldWinHeight==0){this._checkSize(w);}this.iOldWinHeight=this._$window.height();};B.prototype._checkSize=function(w){if(w<this.$()[0].scrollHeight){this.$().toggleClass("sapMBsyDSmall",true);}else{this.$().toggleClass("sapMBsyDSmall",false);this.$().css("width","18.75em");}};return B;},true);