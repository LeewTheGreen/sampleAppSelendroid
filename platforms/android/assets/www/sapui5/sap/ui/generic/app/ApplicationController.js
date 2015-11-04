/*
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["jquery.sap.global","./transaction/BaseController","./transaction/TransactionController"],function(q,B,T){"use strict";var A=B.extend("sap.ui.generic.app.ApplicationController",{constructor:function(m,v){var t=this;B.apply(this,[m]);this._oView=v;this._initModel(m);v.attachValidateFieldGroup(function(e){var i,I;if(e.mParameters.fieldGroupIds&&e.mParameters.fieldGroupIds.length){i=e.mParameters.fieldGroupIds[0];I=t._oView.data(i);}if(I){setTimeout(function(){t._onFieldGroupLeft(i,I);});}});}});A.prototype._initModel=function(m){m.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);m.setRefreshAfterChange(false);m.setDeferredBatchGroups(["Changes"]);m.setChangeBatchGroups({"*":{batchGroupId:"Changes",changeSetId:"Changes",single:false}});m.setChangeBatchGroups({"*":{batchGroupId:"Sync",changeSetId:"Sync",single:false}});};A.prototype._onFieldGroupLeft=function(i,I){var c,s,n,C,t=this,p={batchGroupId:"Changes",changeSetId:"Changes",noShowSuccessToast:true,forceSubmit:true,noBlockUI:true,urlParameters:{}};C=this._oView.getControlsByFieldGroupId(i);this._setFieldGroupBusy(C,true);p.urlParameters.SideEffectsQualifier=I.name.replace("com.sap.vocabularies.Common.v1.SideEffects","");if(p.urlParameters.SideEffectsQualifier.indexOf("#")===0){p.urlParameters.SideEffectsQualifier=p.urlParameters.SideEffectsQualifier.replace("#","");}c=this._oModel.getContext(I.context);s=this._getSideEffect(I);n=function(){t._setFieldGroupBusy(C,false);};return this._executeSideEffects(s,c,p).then(n,n);};A.prototype._setFieldGroupBusy=function(c,b){var l,i,C;if(c){l=c.length;}for(i=0;i<l;i++){C=c[i];C.setBusy(b);}};A.prototype._executeSideEffects=function(s,c,p){this.getTransactionController().getDraftController().prepareDraft(c,p);this._setSelect(s,p);this._read(c.getPath(),p);return this.triggerSubmitChanges(p);};A.prototype._setSelect=function(s,p){var i,l=0,t,S="$select=";if(s.TargetProperties){l=s.TargetProperties.length;for(i=0;i<l;i++){if(i>0){S=S+",";}t=s.TargetProperties[i];S=S+t.PropertyPath;}}if(l>0){p.urlParameters=[S];}};A.prototype._getSideEffect=function(i){var m,s;m=this._oModel.getMetaModel();s=m.getODataEntitySet(i.originName);return s[i.name];};A.prototype.getTransactionController=function(){if(!this._oTransaction){this._oTransaction=new T(this._oModel,this._oQueue,{noBatchGroups:true});}return this._oTransaction;};A.prototype.destroy=function(){B.prototype.destroy.apply(this,[]);if(this._oTransaction){this._oTransaction.destroy();}this._oView=null;this._oModel=null;this._oTransaction=null;};return A;},true);