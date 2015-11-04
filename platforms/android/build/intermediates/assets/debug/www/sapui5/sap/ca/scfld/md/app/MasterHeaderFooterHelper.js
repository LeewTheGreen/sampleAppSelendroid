/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("sap.ca.scfld.md.app.MasterHeaderFooterHelper");sap.ui.base.Object.extend("sap.ca.scfld.md.app.MasterHeaderFooterHelper",{constructor:function(a){this.oApplicationImplementation=a;this.oCommonHeaderFooterHelper=new sap.ca.scfld.md.app.CommonHeaderFooterHelper(a,{});},defineMasterHeaderFooter:function(c,a){this.defineMasterHeaderFooterInner(c,a);},defineMasterHeaderFooterInner:function(c,a){var o=c.getHeaderFooterOptions();this.setHeaderFooter(c,o,a);},setHeaderFooter:function(c,o,a,k){if(!o){return;}var p=this.oCommonHeaderFooterHelper.startBuild(c,o,{bEditState:false,bIsSearching:false,bAllDisabled:a},k);this.defineHeader(c,p);this.defineFooter(c,p);this.oApplicationImplementation.oCurController.MasterCtrl=c;this.oApplicationImplementation.oCurController.FullCtrl=null;this.oCommonHeaderFooterHelper.endBuild(c);},defineHeader:function(c,p){var C=p.getCustomHeader();if(!C){C=new sap.m.Bar();p.setCustomHeader(C);}this.defineMasterSubHeader(c,p);var a=-1;if(!c.isBackendSearch()){if(c._oControlStore.oMasterSearchField){var f=c._oControlStore.oMasterSearchField.getValue();if(f){a=c.applySearchPattern(f);c.evaluateClientSearchResult(a,c.getList(),c._emptyList);}}}if(a<0){if(c._oMasterListBinding){a=c._oMasterListBinding.getLength();}else{var l=c.getList();var I=l.getItems();a=0;for(var i=0;i<I.length;i++){if(!(I[i]instanceof sap.m.GroupHeaderListItem)){a++;}}}}this.defineMasterTitle(c,C,a);this.oCommonHeaderFooterHelper.setBackButton(c,C,true);this.defineEditButton(c,C);},defineFooter:function(c,p){this.defineSettingsButton(c);this.defineFooterRight(c);},defineMasterSubHeader:function(c,p){if(c._oControlStore.oMasterSearchField||c._oControlStore.oMasterPullToRefresh){return;}var s=new sap.m.Bar();p.setSubHeader(s);var i=sap.ui.Device.support.touch;this.createMasterSearchField(c,s,i);if(i&&!c._oControlStore.bAllDisabled){this.createMasterPullToRefresh(c,p);}},createMasterSearchField:function(c,s,i){c._oControlStore.oMasterSearchField=new sap.m.SearchField({id:this.oCommonHeaderFooterHelper.createId(c,"scfld_SEARCH")});c._oControlStore.oMasterSearchField.setEnabled(!c._oControlStore.bAllDisabled);if(!i){c._oControlStore.oMasterSearchField.setShowRefreshButton(true);c._oControlStore.oMasterSearchField.setRefreshButtonTooltip(this.oApplicationImplementation.UilibI18nModel.getResourceBundle().getText("REFRESH"));}c._oControlStore.oMasterSearchField.setShowRefreshButton(!i);c._oControlStore.oMasterSearchField.setSelectOnFocus(false);c._oControlStore.sMasterSearchText=null;c._oControlStore.oMasterSearchField.attachSearch(jQuery.proxy(function(e){this.handleMasterSearch(c,e);},this));if(c.isLiveSearch()){var _=c;c._oControlStore.oMasterSearchField.attachLiveChange(jQuery.proxy(function(){_._applyClientSideSearch();_._oControlStore.sMasterSearchText=_._oControlStore.oMasterSearchField.getValue();},this));}if(c._oHeaderFooterOptions.sI18NSearchFieldPlaceholder){var b=this.oApplicationImplementation.AppI18nModel.getResourceBundle();var p=b.getText(c._oHeaderFooterOptions.sI18NSearchFieldPlaceholder);}else{var b=this.oApplicationImplementation.UilibI18nModel.getResourceBundle();var p=b.getText("MASTER_PLACEHOLDER_SEARCHFIELD");}c._oControlStore.oMasterSearchField.setPlaceholder(p);s.addContentMiddle(c._oControlStore.oMasterSearchField);},createMasterPullToRefresh:function(c,p){c._oControlStore.oMasterPullToRefresh=new sap.m.PullToRefresh();c._oControlStore.oMasterPullToRefresh.attachRefresh(jQuery.proxy(function(){this.handleMasterPullToRefresh(c);},this));p.insertContent(c._oControlStore.oMasterPullToRefresh,0);},handleMasterSearch:function(c,e){var b=c.isBackendSearch();var i=e.getParameter("refreshButtonPressed");if(!i){c._oControlStore.sMasterSearchText=c._oControlStore.oMasterSearchField.getValue();}if(i||b){this.refreshList(c,i);}if(!b&&!c.isLiveSearch()){c._applyClientSideSearch();c._oControlStore.sMasterSearchText=c._oControlStore.oMasterSearchField.getValue();}},handleMasterPullToRefresh:function(c){this.refreshList(c,true);},refreshList:function(c,I){var b=c.isBackendSearch();I=I&&(c._oControlStore.sMasterSearchText!=null||c._oMasterListBinding!=null);c._oControlStore.bIsSearching=!I;if(I){var t=c._oControlStore.sMasterSearchText;if(t===null){t="";}c._oControlStore.oMasterSearchField.setValue(t);this.oApplicationImplementation.bManualMasterRefresh=true;}else{var t=c._oControlStore.oMasterSearchField.getValue();}var l=c.getList();this.oApplicationImplementation.aKeyValues=null;if(this.oApplicationImplementation.aMasterKeys){var a=l.getItems();for(var i=0;i<a.length;i++){var L=a[i];if(L.getSelected()){this.oApplicationImplementation.aKeyValues=[];var o=L.getBindingContext(c.sModelName);for(var j=0;j<this.oApplicationImplementation.aMasterKeys.length;j++){this.oApplicationImplementation.aKeyValues.push(o.getProperty(this.oApplicationImplementation.aMasterKeys[j]));}i=a.length;}}}if(c._oHeaderFooterOptions.onRefresh){var r=jQuery.proxy(function(){this.oApplicationImplementation.onMasterRefreshed(c);if(c._oControlStore.oMasterPullToRefresh){c._oControlStore.oMasterPullToRefresh.hide();}},this);var d=c._oHeaderFooterOptions.onRefresh(t,r);if(d==0){this.aKeyValues=null;c._oControlStore.bIsSearching=false;if(c._oControlStore.oMasterPullToRefresh){c._oControlStore.oMasterPullToRefresh.hide();}}if(d<=0){if(d<0){this.setMasterListVisible(c);}return;}}var B=c._oMasterListBinding;var e=!B;if(B){B.attachChange(c._onMasterListLoaded,c);var R=jQuery.proxy(function(){if(c._oControlStore.oMasterPullToRefresh){c._oControlStore.oMasterPullToRefresh.hide();}if(b){c._oControlStore.sMasterSearchText=t;c._oControlStore.oMasterSearchField.setValue(c._oControlStore.sMasterSearchText);}B.detachDataReceived(R);},this);var f=jQuery.proxy(function(){e=true;B.detachDataRequested(f);},this);B.attachDataRequested(f);B.attachDataReceived(R);}if(b&&!I){var s=c.applyBackendSearchPattern(t,B);if(s){B.detachDataRequested(f);B.detachDataReceived(R);return;}if(B&&B!=c._oMasterListBinding){B.detachDataRequested(f);B.detachDataReceived(R);c._oControlStore.sMasterSearchText=t;this.setMasterListVisible(c);return;}}if((b||I)&&(!e&&c._oMasterListBinding)){c._oMasterListBinding.refresh();}this.setMasterListVisible(c);},setMasterListVisible:function(c){if(c._emptyList&&!c._emptyList.hasStyleClass("hiddenList")){c._emptyList.addStyleClass("hiddenList");c.getList().removeStyleClass("hiddenList");}},defineMasterTitle:function(c,C,i){var t;if(!c._oHeaderFooterOptions.sI18NMasterTitle){return;}if(!c._oControlStore.oMasterTitle){if(this.oCommonHeaderFooterHelper.isUsingStableIds()){t=c._oHeaderFooterOptions.sMasterTitleId;t=this.oCommonHeaderFooterHelper.createId(c,t);}c._oControlStore.oMasterTitle=new sap.m.Label(t);C.addContentMiddle(c._oControlStore.oMasterTitle);}this.setMasterTitle(c,i);},setMasterTitle:function(c,C){if(!c._oControlStore.oMasterTitle){return;}var b=this.oApplicationImplementation.AppI18nModel.getResourceBundle();var t=b.getText(c._oHeaderFooterOptions.sI18NMasterTitle,[C]);c._oControlStore.oMasterTitle.setText(t);},defineEditButton:function(c,C){var i;if(c._oHeaderFooterOptions.onEditPress||c._oHeaderFooterOptions.oEditBtn){if(!c._oControlStore.oEditBtn){var i=c._oHeaderFooterOptions.oEditBtn&&this.oCommonHeaderFooterHelper.createId(c,c._oHeaderFooterOptions.oEditBtn.sId);if(!i){i=this.oCommonHeaderFooterHelper.createId(c,"scfld_EDIT");}c._oControlStore.oEditBtn=new sap.m.Button({id:i});C.addContentRight(c._oControlStore.oEditBtn);c._oControlStore.oEditBtn.attachPress(jQuery.proxy(function(){if(c._oControlStore.bEditState){c._oControlStore.oEditBtn.setIcon("sap-icon://multi-select");c._oControlStore.oEditBtn.setTooltip(this.oApplicationImplementation.UilibI18nModel.getResourceBundle().getText("MULTI_SELECT"));}else{c._oControlStore.oEditBtn.setIcon("sap-icon://sys-cancel");c._oControlStore.oEditBtn.setTooltip(this.oApplicationImplementation.UilibI18nModel.getResourceBundle().getText("CANCEL"));}c._oControlStore.bEditState=!c._oControlStore.bEditState;(c._oHeaderFooterOptions.onEditPress||c._oHeaderFooterOptions.oEditBtn.onBtnPressed)(c._oControlStore.bEditState);},this));}if(c._oControlStore.bEditState){c._oControlStore.oEditBtn.setIcon("sap-icon://sys-cancel");c._oControlStore.oEditBtn.setTooltip(this.oApplicationImplementation.UilibI18nModel.getResourceBundle().getText("CANCEL"));}else{c._oControlStore.oEditBtn.setIcon("sap-icon://multi-select");c._oControlStore.oEditBtn.setTooltip(this.oApplicationImplementation.UilibI18nModel.getResourceBundle().getText("MULTI_SELECT"));}c._oControlStore.oEditBtn.setVisible(true);c._oControlStore.oEditBtn.setEnabled(!(!(c._oHeaderFooterOptions.onEditPress||!c._oHeaderFooterOptions.oEditBtn.bDisabled)||c._oControlStore.bAllDisabled));if(c._oHeaderFooterOptions.oEditBtn&&c._oHeaderFooterOptions.oEditBtn.sId){c._oControlStore.oButtonListHelper.mButtons[c._oHeaderFooterOptions.oEditBtn.sId]=c._oControlStore.oEditBtn;}}else if(c._oControlStore.oEditBtn){c._oControlStore.oEditBtn.setVisible(false);}},defineSettingsButton:function(c){this.oCommonHeaderFooterHelper.createSettingsButton(c);},defineFooterRight:function(c){var f=this.getFooterRightCount(c);if(c._oHeaderFooterOptions.buttonList){for(var i=0;i<c._oHeaderFooterOptions.buttonList.length;i++){var b={};jQuery.extend(b,c._oHeaderFooterOptions.buttonList[i]);delete b.sIcon;if(this.oCommonHeaderFooterHelper.isUsingStableIds()){this.oCommonHeaderFooterHelper.addIds(b,c._oHeaderFooterOptions.buttonList[i].sId,c,undefined);}c._oControlStore.oButtonListHelper.ensureButton(b,"b",f);}}this.oCommonHeaderFooterHelper.getGenericButtons(f,c,c._oControlStore.oButtonListHelper);if(c._oHeaderFooterOptions.onAddPress||c._oHeaderFooterOptions.oAddOptions){this.addAddButton(c);}},getFooterRightCount:function(c){var s=1;var m=2;var l=s;var g=this.oCommonHeaderFooterHelper.getGenericCount(c);var a=this.oCommonHeaderFooterHelper.getActionsCount(c,true);if(this.oApplicationImplementation.bIsPhone&&sap.ui.Device.orientation.landscape){if(a===1&&g<4){return a+g;}l=m;}if(a===0){return 3;}if(a===l&&g===1){return l+1;}return l;},addAddButton:function(c){if(c._oHeaderFooterOptions.onAddPress){var b={onBtnPressed:c._oHeaderFooterOptions.onAddPress,sTooltip:this.oApplicationImplementation.UilibI18nModel.getResourceBundle().getText("ADD")};}else{var b={};jQuery.extend(b,c._oHeaderFooterOptions.oAddOptions);delete b.sBtnText;delete b.sI18nBtnTxt;}if(this.oCommonHeaderFooterHelper.isUsingStableIds()){this.oCommonHeaderFooterHelper.addIds(b,c._oHeaderFooterOptions.oAddOptions?c._oHeaderFooterOptions.oAddOptions.sId:undefined,c,"scfld_ADD");}b.sIcon="sap-icon://add";c._oControlStore.oButtonListHelper.ensureButton(b,"b");}});