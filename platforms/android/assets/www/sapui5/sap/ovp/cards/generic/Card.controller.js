(function(){"use strict";jQuery.sap.require("sap.ovp.cards.ActionUtils");var A=sap.ovp.cards.ActionUtils;sap.ui.controller("sap.ovp.cards.generic.Card",{onInit:function(){this.getView().byId("ovpCardHeader").attachBrowserEvent("click",this.onHeaderClick.bind(this));},onAfterRendering:function(){var f=this.getCardPropertiesModel().getProperty("/footerFragment");if(f){this._handleActionFooter();this._handleCountFooter();}},onHeaderClick:function(){this.doIntentBasedNavigation(this.getView().getBindingContext());},_handleActionFooter:function(f){var a=this.getView().byId("ovpActionFooter");if(a){var b=a.getContent();b=b.splice(1,b.length);var l=b[0].getLayoutData();l.setMoveToOverflow(false);l.setStayInOverflow(false);if(b.length===2){l=b[1].getLayoutData();l.setMoveToOverflow(false);l.setStayInOverflow(false);}}},_handleCountFooter:function(){var c=this.getView().byId("ovpCountFooter");if(c){var i=this.getCardItemsBinding();if(i){i.attachDataReceived(function(){var t=i.getLength();var C=i.getCurrentContexts().length;var a=sap.ui.getCore().getLibraryResourceBundle("sap.ovp").getText("Count_Footer",[C,t]);c.setText(a);});}}},getCardItemsBinding:function(){},onActionPress:function(e){var s=e.getSource(),c=this._getActionObject(s),a=s.getBindingContext();if(c.type.indexOf("DataFieldForIntentBasedNavigation")!==-1){this.doIntentBasedNavigation(a,c);}else{this.doAction(a,c);}},_getActionObject:function(s){var c=s.getCustomData();var C={};for(var i=0;i<c.length;i++){C[c[i].getKey()]=c[i].getValue();}return C;},doIntentBasedNavigation:function(c,i){var p,n,C,s,o=sap.ushell.Container.getService("CrossApplicationNavigation"),e=c?c.getObject():null;if(!i){i=this.getEntityIntents()[0];}if(o&&i){p=this._getEntityNavigationParameters(e);p.done(function(P){n={target:{semanticObject:i.semanticObject,action:i.action},params:P};C=o.hrefForExternal(n,this.getOwnerComponent(),true);C.done(function(I){s=o.isIntentSupported([I]);s.done(function(t){if(t[I].supported){o.toExternal(n,this.getOwnerComponent());}}.bind(this));}.bind(this));}.bind(this));}},doAction:function(c,a){this.actionData=A.getActionInfo(c,a,this.getEntityType());if(this.actionData.allParameters.length>0){this._loadParametersForm();}else{this._callFunction();}},getEntityIntents:function(a){var I=[];var e=this.getEntityType();if(!a){a='com.sap.vocabularies.UI.v1.Identification';}var r=e[a];for(var i=0;Array.isArray(r)&&i<r.length;i++){if(r[i].RecordType==="com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation"){I.push({semanticObject:r[i].SemanticObject.String,action:r[i].Action.String,label:r[i].Label.String});}}return I;},getModel:function(){return this.getView().getModel();},getMetaModel:function(){return this.getModel().getMetaModel();},getCardPropertiesModel:function(){return this.getView().getModel("ovpCardProperties");},getEntitySet:function(){if(!this.entitySet){var e=this.getCardPropertiesModel().getProperty("/entitySet");this.entitySet=this.getMetaModel().getODataEntitySet(e);}return this.entitySet;},getEntityType:function(){if(!this.entityType){this.entityType=this.getMetaModel().getODataEntityType(this.getEntitySet().entityType);}return this.entityType;},_saveAppState:function(g){var d=jQuery.Deferred();var a=sap.ushell.Container.getService("CrossApplicationNavigation").createEmptyAppState(this.getOwnerComponent());var s=a.getKey();var o={selectionVariant:g};a.setData(o);var S=a.save();S.done(function(){d.resolve(s);});return d.promise();},_getEntityNavigationParameters:function(e){var d=jQuery.Deferred();var r={};var E;var c=this.getOwnerComponent().getComponentData();var g=c?c.globalFilter:undefined;var s;if(e){E=this.getEntityType();var k;for(var i=0;E.property&&i<E.property.length;i++){k=E.property[i].name;if(e.hasOwnProperty(k)){if(typeof e[k]==="string"){r[k]=e[k];}else if(window.Array.isArray(e[k])&&e[k].length===1){r[k]=e[k][0];}}}}if(g){s=this._saveAppState(g.getFilterDataAsString());s.done(function(a){r["sap-xapp-state"]=a;d.resolve(r);});s.fail(function(){jQuery.sap.log.error("appStateKey is not saved for OVP Application");d.resolve(r);});}else{d.resolve(r);}return d.promise();},_loadParametersForm:function(){var p=new sap.ui.model.json.JSONModel();p.setData(this.actionData.parameterData);var t=this;var P=new sap.m.Dialog('ovpCardActionDialog',{title:this.actionData.sFunctionLabel,afterClose:function(){P.destroy();}}).addStyleClass("sapUiNoContentPadding");var a=new sap.m.Button({text:this.actionData.sFunctionLabel,press:function(e){var m=A.getParameters(e.getSource().getModel(),t.actionData.oFunctionImport);P.close();t._callFunction(m);}});var c=new sap.m.Button({text:"Cancel",press:function(){P.close();}});P.setBeginButton(a);P.setEndButton(c);var o=function(e){var m=A.mandatoryParamsMissing(e.getSource().getModel(),t.actionData.oFunctionImport);a.setEnabled(!m);};var f=A.buildParametersForm(this.actionData,o);P.addContent(f);P.setModel(p);P.open();},_callFunction:function(u){var p={batchGroupId:"Changes",changeSetId:"Changes",urlParameters:u,forceSubmit:true,context:this.actionData.oContext,functionImport:this.actionData.oFunctionImport};var t=this;var P=new Promise(function(r,a){var m=t.actionData.oContext.getModel();var f;f="/"+p.functionImport.name;m.callFunction(f,{method:p.functionImport.httpMethod,urlParameters:p.urlParameters,batchGroupId:p.batchGroupId,changeSetId:p.changeSetId,headers:p.headers,success:function(d,R){r(R);},error:function(R){a(R);}});});P.then(function(r){return sap.m.MessageToast.show(sap.ui.getCore().getLibraryResourceBundle("sap.ovp").getText("Toast_Action_Success"),{duration:1000});},function(e){return sap.m.MessageToast.show(sap.ui.getCore().getLibraryResourceBundle("sap.ovp").getText("Toast_Action_Error"),{duration:1000});});}});})();