/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["jquery.sap.global","./library","sap/ui/core/Control","sap/ui/core/ResizeHandler","./Loco","./ViewportHandler","sap/ui/core/Popup","sap/ui/core/IconPool"],function(q,l,C,R,L,V,P,I){"use strict";var S=C.extend("sap.ui.vk.StepNavigation",{metadata:{library:"sap.ui.vk",properties:{settings:"sap.ui.core.object",width:{type:"sap.ui.core.CSSSize",defaultValue:"100%"},height:{type:"sap.ui.core.CSSSize",defaultValue:"100%"},showThumbnails:{type:"boolean",group:"Appearance",defaultValue:true},showToolbar:{type:"boolean",group:"Appearance",defaultValue:true},showStepInfo:{type:"boolean",group:"Appearance",defaultValue:false}},publicMethods:["setGraphicsCore","setScene","playStep","pauseStep","playAllSteps","getStep","getNextStep","getPreviousStep","getProceduresAndSteps","refresh","clear"],associations:{},aggregations:{procedureItemTemplate:{type:"sap.ui.core.Item",multiple:false},stepInfoPopup:{type:"sap.ui.core.Control",multiple:false},layout:{type:"sap.m.Panel",multiple:false}},events:{"resize":{parameters:{oldSize:"object",size:"object"}},"stepChanged":{parameters:{clientId:"object",type:"object",stepId:"object"}}}},setGraphicsCore:function(g){if(g!=this._graphicsCore){this._graphicsCore=g;}this.instanceSettings={};this.oDvl=this._graphicsCore.getApi(sap.ui.vk.GraphicsCoreApi.LegacyDvl);this.oDvl.Client.OnStepEvent=function(c,t,s){var o=this.getSettings();this.instanceSettings.currentStepId=s;switch(t){case DvlEnums.DVLSTEPEVENT.DVLSTEPEVENT_FINISHED:o.currentStepFinished=true;o.currentStepPaused=false;o.playAllActive=false;o.isPlaying=false;this._togglePlayPause(true);break;case DvlEnums.DVLSTEPEVENT.DVLSTEPEVENT_SWITCHED:case DvlEnums.DVLSTEPEVENT.DVLSTEPEVENT_STARTED:o.currentStepId=s;o.currentStepFinished=false;this._highlightStep(s);if(o.currentStepPaused){this.pauseStep();}break;}this.fireStepChanged({clientId:c,type:t,stepId:s});}.bind(this);return this;},hasGraphicsCore:function(){if(this._graphicsCore){return true;}return false;},setScene:function(s){this._scene=s;if(this["_getStepThumbnails"]){if(!this._graphicsCore){this.setGraphicsCore(this._scene.getGraphicsCore());}delete this._procedures;var p=this.getProcedureList();var o=this.getSettings();o.reset();p.unbindItems();p.setSelectedItem(p.getFirstItem());if(o.stepInfo.stepMessagePopup){if(!o.stepInfo.stepMessagePopup.isOpen()){o.stepInfo.stepMessagePopup.close();}o.stepInfo.stepMessagePopup.destroy();o.stepInfo.stepMessagePopup=null;this.getShowStepInfoButton().setText(this.oResourceBundle.getText("STEP_NAV_STEPDESCRIPTIONHEADING"));}var d=this._getStepThumbnails();this.oModel.setData(d);sap.ui.getCore().setModel(this.oModel);this._togglePlayPause(true);this._refreshControl();}this.refresh();},init:function(){if(C.prototype.init){C.prototype.init(this);}if(this.getSettings()==undefined){this.setSettings(new this._settings());}this.oResourceBundle=sap.ui.getCore().getLibraryResourceBundle("sap.ui.vk.i18n");this._graphicsCore=null;this.oModel=new sap.ui.model.json.JSONModel();this._layout=new sap.m.Panel({expandable:false});this._layoutToolbar=new sap.m.Toolbar({design:sap.m.ToolbarDesign.Solid});this._layout.addContent(new sap.m.ScrollContainer(this.getId()+"-scroller",{width:"100%",horizontal:true,vertical:false,focusable:true}));this.setAggregation("layout",this._layout);this.playPreviousButton=new sap.m.Button(this.getId()+"-playPreviousButton",{type:sap.m.ButtonType.Transparent,icon:"sap-icon://slim-arrow-left",tooltip:this.oResourceBundle.getText("STEP_NAV_PREVIOUSSTEPBUTTON"),visible:true,press:function(e){var s=this.getSettings();var p=this.getPreviousStep(s.currentProcedureIndex);if(p){s.currentStepPaused=false;this.playStep(p.id,true,s.playAllActive);this._togglePlayPause(false);}}.bind(this)});this.playNextButton=new sap.m.Button(this.getId()+"-playNextButton",{type:sap.m.ButtonType.Transparent,icon:"sap-icon://slim-arrow-right",tooltip:this.oResourceBundle.getText("STEP_NAV_NEXTSTEPBUTTON"),visible:true,press:function(e){var s=this.getSettings();var n=this.getNextStep(s.currentProcedureIndex);if(n){s.currentStepPaused=false;this.playStep(n.id,true,s.playAllActive);this._togglePlayPause(false);}}.bind(this)});this.playOptionButton=new sap.m.Button(this.getId()+"-playOptionButton",{type:sap.m.ButtonType.Transparent,icon:"sap-icon://media-play",tooltip:this.oResourceBundle.getText("STEP_NAV_PLAYBUTTON_PLAY"),visible:true,press:function(e){var k=this.getPlayMenuButton().getSelectedKey();var s=this.getSettings();var f=null;switch(k){case"0":if(!s.currentStepId){f=this.getNextStep(s.currentProcedureIndex);if(f){s.currentStepId=f.id;}else{return;}}s.playAllActive=false;this.playStep(s.currentStepId,!s.currentStepPaused,s.playAllActive);s.isPlaying=true;s.currentStepPaused=false;this._togglePlayPause(false);break;case"1":s.playAllActive=true;s.currentStepPaused=false;this.playAllSteps(s.currentProcedureId);s.isPlaying=true;this._togglePlayPause(false);break;case"2":if(!s.currentStepId){f=this.getNextStep(s.currentProcedureIndex);if(f){s.currentStepId=f.id;}else{return;}}s.playAllActive=true;var p=!s.currentStepPaused;s.currentStepPaused=false;this.playStep(s.currentStepId,p,s.playAllActive);s.isPlaying=true;this._togglePlayPause(false);break;default:break;}}.bind(this)});this.procedureList=new sap.m.Select(this.getId()+"-procedureList",{tooltip:this.oResourceBundle.getText("STEP_NAV_PROCEDURESLISTHEADING"),selectedKey:"0",type:sap.m.SelectType.Default,enabled:true,width:"30%",autoAdjustWidth:true,change:function(c){var p=this.getProcedureList();var s=this.getSettings();s.currentProcedureIndex=0;s.currentProcedureId=this.instanceSettings.currentProcedureId=p.getSelectedKey();s.currentStepId=this.instanceSettings.currentStepId=null;for(var i=0;i<this.oModel.oData.procedures.length;i++){if(this.oModel.oData.procedures[i].id==s.currentProcedureId){s.currentProcedureIndex=i;s.currentProcedure=this.oModel.oData.procedures[i];break;}}if(s.stepInfo.stepMessagePopup){if(!s.stepInfo.stepMessagePopup.isOpen()){s.stepInfo.stepMessagePopup.close();}s.stepInfo.stepMessagePopup.destroy();s.stepInfo.stepMessagePopup=null;}this._refreshItems();}.bind(this)});this.procedureList.addStyleClass("sapVizKitStepNavigationProcedureList");this.setAggregation("procedureItemTemplate",(new sap.ui.core.ListItem().bindProperty("text","name").bindProperty("key","id").bindProperty("tooltip","name")));this.playMenuButton=(new sap.m.Select(this.getId()+"-playMenuButtonIcon",{selectedKey:"0",type:sap.m.SelectType.Default,tooltip:this.oResourceBundle.getText("STEP_NAV_PLAYMENU_PLAYOPTIONS"),enabled:true,autoAdjustWidth:false,items:[new sap.ui.core.ListItem({key:"0",icon:"sap-icon://media-play",text:this.oResourceBundle.getText("STEP_NAV_PLAYMENU_PLAY"),tooltip:this.oResourceBundle.getText("STEP_NAV_PLAYMENU_PLAY")}),new sap.ui.core.ListItem({key:"1",icon:"sap-icon://media-play",text:this.oResourceBundle.getText("STEP_NAV_PLAYMENU_PLAYALL"),tooltip:this.oResourceBundle.getText("STEP_NAV_PLAYMENU_PLAYALL")}),new sap.ui.core.ListItem({key:"2",icon:"sap-icon://media-play",text:this.oResourceBundle.getText("STEP_NAV_PLAYMENU_PLAYALLREMAINING"),tooltip:this.oResourceBundle.getText("STEP_NAV_PLAYMENU_PLAYALLREMAINING")})]}));this.playMenuButton.addStyleClass("sapVizKitStepNavigationPlayOptionsSelect");this.pauseButton=new sap.m.Button(this.getId()+"-pauseButton",{type:sap.m.ButtonType.Transparent,icon:"sap-icon://media-pause",visible:false,tooltip:this.oResourceBundle.getText("STEP_NAV_PLAYMENU_PAUSE"),press:function(e){var s=this.getSettings();this.pauseStep();s.currentStepPaused=true;s.isPlaying=false;this._togglePlayPause(true);}.bind(this)});this.showStepInfoButton=new sap.m.ToggleButton(this.getId()+"-showStepInfoButton",{icon:"sap-icon://hide",type:sap.m.ButtonType.Transparent,pressed:false,text:this.oResourceBundle.getText("STEP_NAV_STEPDESCRIPTIONHEADING"),tooltip:this.oResourceBundle.getText("STEP_NAV_STEPDESCRIPTIONHEADING"),press:function(e){var t=e.getSource();if(t.getPressed()){this.setShowStepInfo(true);t.setIcon("sap-icon://show");t.setTooltip(this.oResourceBundle.getText("STEP_NAV_SHOWSTEPDESCRIPTIONBUTTON"));}else{this.setShowStepInfo(false);t.setIcon("sap-icon://hide");t.setTooltip(this.oResourceBundle.getText("STEP_NAV_HIDESTEPDESCRIPTIONBUTTON"));}}.bind(this)});this._layoutToolbar.addContent(this.playPreviousButton);this._layoutToolbar.addContent(this.playOptionButton);this._layoutToolbar.addContent(this.pauseButton);this._layoutToolbar.addContent(this.playMenuButton);this._layoutToolbar.addContent(this.procedureList);this._layoutToolbar.addContent(this.showStepInfoButton);this._layoutToolbar.addContent(new sap.m.ToolbarSpacer());this._layoutToolbar.addContent(this.playNextButton);this._layout.setHeaderToolbar(this._layoutToolbar);},getScroller:function(){var i=this.getId()+"-scroller";var c=sap.ui.getCore().byId(i);var a=this.getLayout();return a.getContent()[a.indexOfContent(c)];},getProcedureList:function(){var i=this.getId()+"-procedureList";var h=this.getLayout().getHeaderToolbar();var c=sap.ui.getCore().byId(i);return h.getContent()[h.indexOfContent(c)];},getPlayMenuButton:function(){var i=this.getId()+"-playMenuButtonIcon";var h=this.getLayout().getHeaderToolbar();var c=sap.ui.getCore().byId(i);return h.getContent()[h.indexOfContent(c)];},getPlayOptionButton:function(){var i=this.getId()+"-playOptionButton";var h=this.getLayout().getHeaderToolbar();var c=sap.ui.getCore().byId(i);return h.getContent()[h.indexOfContent(c)];},getPauseButton:function(){var i=this.getId()+"-pauseButton";var h=this.getLayout().getHeaderToolbar();var c=sap.ui.getCore().byId(i);return h.getContent()[h.indexOfContent(c)];},getPlayNextButton:function(){var i=this.getId()+"-playNextButton";var h=this.getLayout().getHeaderToolbar();var c=sap.ui.getCore().byId(i);return h.getContent()[h.indexOfContent(c)];},getPlayPreviousButton:function(){var i=this.getId()+"-playPreviousButton";var h=this.getLayout().getHeaderToolbar();var c=sap.ui.getCore().byId(i);return h.getContent()[h.indexOfContent(c)];},getShowStepInfoButton:function(){var i=this.getId()+"-showStepInfoButton";var h=this.getLayout().getHeaderToolbar();var c=sap.ui.getCore().byId(i);return h.getContent()[h.indexOfContent(c)];},exit:function(){if(this._resizeListenerId){R.deregister(this._resizeListenerId);this._resizeListenerId=null;}if(C.prototype.exit){C.prototype.exit.apply(this);}},_settings:function(){return{enabled:false,toggle:{addCss:function(k,p,o,a){if(!this.targets[k]){this.targets[k]={"type":"css","property":p,"onValue":o,"offValue":a};}},addMethod:function(t,m,o,a,u){var k=t.getId();if(!this.targets[k]){this.targets[k]={"type":"method","target":t,"method":m,"onValue":o,"offValue":a,"useJQuery":u};}},targets:{}},currentProcedureIndex:0,currentProcedureId:"",currentProcedure:null,currentStepId:null,currentStep:null,currentStepPaused:false,isPlaying:false,currentStepFinished:true,playAllActive:false,showToolbar:true,showThumbnails:true,portfolioMode:false,reset:function(){this.currentStep=null;this.currentProcedure=null;this.currentProcedureIndex=0;this.currentProcedureId="";this.currentStepId=null;this.currentStepPaused=false;this.currentStepFinished=true;this.playAllActive=false;this.portfolioMode=false;},stepInfo:{lastTop:null,lastLeft:null,stepMessagePopup:null,openPopup:function(p,a,t){if(!this.stepMessagePopup){this.stepMessagePopup=new sap.m.ResponsivePopover({placement:"Top",showCloseButton:true,verticalScrolling:true,contentHeight:"10%",contentWidth:"30%"});this.stepMessagePopup.addStyleClass("sapVizKitStepNavigationPopoverStepInfo");}this.stepMessagePopup.setTitle(p);this.stepMessagePopup.removeAllContent();this.stepMessagePopup.addContent(a);this.stepMessagePopup.openBy(t);}}};},refresh:function(s){q.sap.log.info("StepNavigation refresh() called.");if(this.getVisible()&&(this["_getStepThumbnails"]&&this._scene!=null)){var p=this.getProcedureList();var o=this.getSettings();o.reset();p.setSelectedItem(p.getFirstItem());var d=this._getStepThumbnails();if(o.stepInfo.stepMessagePopup){if(!o.stepInfo.stepMessagePopup.isOpen()){o.stepInfo.stepMessagePopup.close();}o.stepInfo.stepMessagePopup.destroy();o.stepInfo.stepMessagePopup=null;}this.oModel.setData(d);sap.ui.getCore().setModel(this.oModel);this._togglePlayPause(true);this._refreshControl();}else{if(this.getVisible()){this._refreshControl();}}return true;},clear:function(){q.sap.log.info("StepNavigation clear() called.");return true;},onBeforeRendering:function(){if(this._resizeListenerId){R.deregister(this._resizeListenerId);this._resizeListenerId=null;}if(this.getShowToolbar()){var p=this.getProcedureList();p.setModel(this.oModel);var o=this.getProcedureItemTemplate();p.bindItems("/procedures",o);}},onAfterRendering:function(){if(this._canvas){var d=this.getDomRef();d.appendChild(this._canvas);this._resizeListenerId=R.register(this,this._handleResize.bind(this));this._bestFit();this.fireResize({size:{width:d.clientWidth,height:d.clientHeight}});}var s=this.getSettings();this._togglePlayPause(!s.isPlaying);if(s.currentStepId){this._highlightStep(s.currentStepId);}},_handleResize:function(e){this.fireResize({oldSize:e.oldSize,size:e.size});this._update();},_reset:function(){this._x=0;this._y=0;this._s=1.0;this._r=0;},_update:function(){var x=this._x-(this._imageW-this._canvas.clientWidth)/2;var y=this._y-(this._imageH-this._canvas.clientHeight)/2;var t="matrix("+this._s+",0,0,"+this._s+","+x+","+y+")";this._img.style.transform=t;this._img.style.webkitTransform=t;this._img.style.msTransform=t;this._img.style.MozTransform=t;this._img.style.OTransform=t;},_bestFit:function(){this._reset();var s=this._canvas.clientWidth/this._img.width;var a=this._canvas.clientHeight/this._img.height;this._s=s<a?s:a;if(this._s==0){this._s=1.0;}this._x=0;this._y=0;this._update();},_togglePlayPause:function(p){this.togglePlayPauseActive=true;if(this.getSettings().showToolbar){if(p){this.getPauseButton().setVisible(false);this.getPlayOptionButton().setVisible(true);}else{this.getPauseButton().setVisible(true);this.getPlayOptionButton().setVisible(false);}}},_refreshControl:function(){var p=this.getProcedureList();var o=this.getProcedureItemTemplate();var s=this.getScroller();var a=this.getSettings();if(a.stepInfo.stepMessagePopup){if(!a.stepInfo.stepMessagePopup.isOpen()){a.stepInfo.stepMessagePopup.close();}a.stepInfo.stepMessagePopup.destroy();a.stepInfo.stepMessagePopup=null;this.getShowStepInfoButton().setText(this.oResourceBundle.getText("STEP_NAV_STEPDESCRIPTIONHEADING"));}p.unbindItems();if(this.oModel.oData.procedures.length>0){var f=this.oModel.oData.procedures[0];if(this.getShowToolbar()){p.bindItems("/procedures",o);p.selectedKey=f.id;p.enabled=true;}this._refreshItems();}else{if(this.getShowToolbar()){p.bindItems("/procedures",o);p.enabled=false;}if(this.getShowThumbnails()){s.destroyContent();}}},_refreshItems:function(){var t=this;var s=[];var p=this.getProcedureList();var o=t.getSettings();var a=t.getScroller();var b=new sap.m.HBox();if(t.getShowThumbnails()){a.removeAllContent();}if(!o.currentProcedure){o.currentProcedure=t.oModel.oData.procedures[o.currentProcedureIndex];p.setSelectedItem(p.getFirstItem());}if(o.currentProcedureId!=''||t.oModel.oData.procedures.length>0){if(t.getShowThumbnails()){s=t.oModel.oData.procedures[o.currentProcedureIndex].steps;var c=function(e){o.currentStepPaused=false;var f=sap.ui.getCore().byId(e.getSource().getId());t.playStep(f.getCustomData()[0].getValue("stepId"));o.playAllActive=false;t._togglePlayPause(false);};for(var i=0;i<s.length;i++){var d=new sap.m.Image({alt:s[i].name,src:"data:image/"+s[i].thumbnailType+";base64,"+s[i].thumbnailData,densityAware:false,tooltip:s[i].name,press:c.bind(t)});d.data("stepId",s[i].id);d.addCustomData(new sap.ui.core.CustomData({key:"stepId",value:s[i].id}));d.addStyleClass("sapVizKitStepNavigationStepItem");b.addItem(d);}a.addContent(b);}}},_highlightStep:function(s){var t=this;if(t.getVisible()){var o=t.getScroller();var a=t.getSettings();var b=t.getStep(0,a.currentProcedureIndex,s);if(!a.currentProcedure){a.currentProcedure=t.oModel.oData.procedures[t.oSettings.currentProcedureIndex];}var c=b.name;var d=new sap.m.VBox({items:[new sap.m.Text({text:b.description})]});d.addStyleClass("sapVizKitStepNavigationPopoverContent");var e=t.getShowStepInfoButton();if(t.getShowStepInfo()){a.stepInfo.openPopup(c,d,e);}else if(a.stepInfo.stepMessagePopup&&a.stepInfo.stepMessagePopup.isOpen()){a.stepInfo.stepMessagePopup.close();}if(t.getShowThumbnails()){var T=o.getContent()[0].getItems();for(var i=0;i<T.length;i++){if(T[i].getCustomData()[0].getValue("stepId")==s){T[i].addStyleClass("selected");T[i].$()[0].scrollIntoView();}else{T[i].removeStyleClass("selected");}}}}},getProceduresAndSteps:function(){return this._getStepThumbnails();},_getStepThumbnails:function(){var t=this;var p=t._retrieveProcedures();if(p.sceneId!=null){var a;var e;var i;var s;for(var b in p.procedures){var o=p.procedures[b];for(var c in o.steps){s=o.steps[c];a=t.oDvl.Scene.RetrieveThumbnail(p.sceneId,s.id);e=a.substring(a.length-2);var d=a.substring(0,3);if(d=="iVB"){i="png";}else if(d!="eff"&&d!="err"){i="jpg";}else if(d=="eff"||d=="err"){i=null;a=null;}if(/,$/.test(e)||/,,$/.test(e)){a=a.substring(0,a.length-4);e=a.substring(a.length-2);}p.procedures[b].steps[c].thumbnailData=a;p.procedures[b].steps[c].thumbnailType=i;}}for(var f in p.portfolios){var g=p.portfolios[f];for(var h in g.steps){s=g.steps[h];a=t.oDvl.Scene.RetrieveThumbnail(p.sceneId,s.id);e=a.substring(a.length-2);var d=a.substring(0,3);if(d=="iVB"){i="png";}else if(d!="eff"){i="jpg";}else if(d=="eff"){i=null;}p.portfolios[f].steps[h].thumbnailData=a;p.portfolios[f].steps[h].thumbnailType=i;}}p.hasThumbnails=true;}t._procedures=p;return p;},_retrieveProcedures:function(a){var t=this;var p={};if(!t._procedures){p={sceneId:null,hasThumbnails:false,"procedures":[],"portfolios":[]};}else{p=t._procedures;}if(t._scene&&(p.sceneId!=(a||t._scene._dvlSceneId))){var s=a||t._scene._dvlSceneId;if(s!=null){var b=t.oDvl.Scene.RetrieveProcedures(s);if(b!=null){p.hasThumbnails=false;p.sceneId=t._scene._dvlSceneId;p.procedures=b.procedures;p.portfolios=b.portfolios;}else{p={sceneId:null,hasThumbnails:false,"procedures":[],"portfolios":[]};}}}return p;},getStep:function(r,a,s){var t=this;var b=t.oDvl.Settings.LastLoadedSceneId;if(b!=null){a=a!=null?a:0;var c=s?s:t.instanceSettings.currentStepId;var d=null;var p=t._retrieveProcedures(b);var e=p.procedures[a];if(e&&e.steps.length>0){d=e.steps[0];}if(c!=""){for(var f=0;f<e.steps.length;f++){var _=e.steps[f];if(_.id==c){var x=f+r;if(x<e.steps.length&&x>=0){d=e.steps[x];}else{d=null;}break;}}}}return d;},pauseStep:function(){var t=this;var s=t.oDvl.Settings.LastLoadedSceneId;if(s!=null){t.oDvl.Scene.PauseCurrentStep(s);}},_stepCount:function(a){var t=this;var s=t.oDvl.Settings.LastLoadedSceneId;var b=0;if(s!=null){var p=t._retrieveProcedures(s);for(var c=0;c<p.procedures.length;c++){if(p.procedures[c].id==a){b=p.procedures[c].steps.length;break;}else if(a==null){b+=p.procedures[c].steps.length;}}}return b;},getPreviousStep:function(p){var t=this;return t.getStep(-1,p);},getNextStep:function(p){var t=this;return t.getStep(1,p);},playStep:function(a,f,c){var t=this;var s=t.oDvl.Settings.LastLoadedSceneId;if(s!=null){t.instanceSettings.currentStepId=a;t.oDvl.Scene.ActivateStep(s,a,f!=null?f:true,c!=null?c:false);}},playAllSteps:function(p){var t=this;var a=t.oDvl.Settings.LastLoadedSceneId;if(a!=null){var b=t._retrieveProcedures(a);var c=0;if(p!=null&&b.procedures.length>1){for(var i=0;i<b.procedures.length;i++){if(b.procedures[i].id==p){c=i;break;}}}if(b.procedures.length>0){var s=b.procedures[c].steps[0];if(s){t.instanceSettings.currentStepId=s.id;t.oDvl.Scene.ActivateStep(a,s.id,true,true);}}}}});return S;});