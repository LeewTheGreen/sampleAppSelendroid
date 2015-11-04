/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["jquery.sap.global","./library","sap/ui/core/Control","sap/ui/table/TreeTable","sap/ui/table/Column","sap/ui/model/json/JSONModel","sap/m/Title","./CheckEye"],function(q,l,C,T,a,J,b,c){"use strict";var S=C.extend("sap.ui.vk.SceneTree",{metadata:{library:"sap.ui.vk",properties:{},events:{},associations:{},aggregations:{_tree:{type:"sap.ui.table.TreeTable",multiple:false,visibility:"visible"}}},setScene:function(s,v){this._scene=s;this._viewStateManager=v;if(this._viewStateManager){this._viewStateManager.attachSelectionChanged(null,this._nodeSelectionChanged.bind(this));this._viewStateManager.attachVisibilityChanged(null,this._nodeVisibilityChanged.bind(this));}this.refresh();},init:function(){if(C.prototype.init){C.prototype.init.apply(this);}this.oResourceBundle=sap.ui.getCore().getLibraryResourceBundle("sap.ui.vk.i18n");var _=new b({text:this.oResourceBundle.getText("SCENETREE_TITLE"),tooltip:this.oResourceBundle.getText("SCENETREE_TITLE")});_.onAfterRendering=function(){var $=this.$();$.addClass('sapUiVkTitle');};this._tree=new T({title:_,columns:[new a({label:this.oResourceBundle.getText("SCENETREE_NAME"),tooltip:this.oResourceBundle.getText("SCENETREE_NAME"),template:"name"}),new a({label:this.oResourceBundle.getText("SCENETREE_VISIBLE"),tooltip:this.oResourceBundle.getText("SCENETREE_VISIBLE"),template:new c().bindProperty("checked","visible"),width:"2.8em",resizable:false,hAlign:"Center"})],selectionMode:"Multi",selectionBehavior:"Row",visibleRowCountMode:"Auto",expandFirstLevel:false,collapseRecursive:true,enableSelectAll:false,rowHeight:32});this.setAggregation("_tree",this._tree,true);this._model=new J();this._tree.setModel(this._model);this._tree.bindRows({path:'/root'});this._tree.attachToggleOpenState(this._nodeOpenToggle.bind(this));this._tree.attachRowSelectionChange(this._nodeSelection.bind(this));this._tree.getBinding("rows").attachChange(this._dataChange.bind(this));this._viewStateManager=null;this._scene=null;this._syncing=false;this._selected={};this._toggled={};this._vsmSelected={};this._forwardTimer=0;this._reverseTimer=0;this._toExpand=null;this._vSyncing=false;this._lastChangeIsExpand=false;this._forwardVTimer=0;this._reverseVTimer=0;this._scrollTimer=0;},exit:function(){},onBeforeRendering:function(){this._tree.setVisible(true);},_pathToNode:function(p,d,t){p=p.substr(1);if(d==undefined){d=this._model.getData();}var n=d;var e=n;var f="";while(p.length>0){var g=p.indexOf('/');if(g>=0){f=p.substr(0,g);p=p.substr(g+1);}else{f=p;p="";}e=n;n=e[f];}if(t!=undefined){e[f]=t;}return n;},_indexToNodeId:function(i){var d=this._tree.getContextByIndex(i);if(d){var n=this._pathToNode(d.sPath,d.oModel.oData);return n.id;}else{return null;}},_deselectHidden:function(){var v=this._vsmSelected;var d=this._viewStateManager;var e=[];var u={};for(var i=0;;i++){var f=this._indexToNodeId(i);if(f==null){break;}if(v.hasOwnProperty(f)){u[f]=true;}}for(var k in v){if(v.hasOwnProperty(k)&&v[k]==true&&!u.hasOwnProperty(k)&&k!=""){e.push(k);v[k]=false;}}if(e.length>0){this._syncing=true;d.setSelectionState(e,false);this._syncing=false;}},_nodeSelection:function(e){if(this._tree.getBinding("rows")._aSelectedContexts!=undefined){return;}if(!this._syncing){if(this._forwardTimer>0){clearTimeout(this._forwardTimer);}var p=e.mParameters;var d=p.rowIndices;var f=this._tree.getSelectedIndices();if(d.length>=1&&f.length==1){if(d.indexOf(f[0])!=-1){this._deselectHidden();}}for(var i=0;i<d.length;i++){var g=d[i];if(this._toggled.hasOwnProperty(g)){this._toggled[g]=!this._toggled[g];}else{this._toggled[g]=true;}if(!this._selected.hasOwnProperty(g)){this._selected[g]=false;}}this._forwardTimer=setTimeout(this._resyncSelectionForward.bind(this),100);}},_nodeSelectionChanged:function(e){if(!this._syncing){if(this._reverseTimer>0){clearTimeout(this._reverseTimer);}var s=e.mParameters.selected;var d=e.mParameters.unselected;for(var i=0;i<d.length;i++){if(this._vsmSelected[d[i]]!=undefined){delete this._vsmSelected[d[i]];}}for(var i=0;i<s.length;i++){this._vsmSelected[s[i]]=true;}if(s.length==1){this._toExpand=s[0];}this._reverseTimer=setTimeout(this._resyncSelectionReverse.bind(this),100,true);}},_resyncSelectionForward:function(){this._forwardTimer=0;if(this._syncing){return false;}this._syncing=true;var v=this._viewStateManager;var d=this._vsmSelected;var s=this._selected;for(var i in s){if(s.hasOwnProperty(i)){var e=this._indexToNodeId(i);if(e==null||e==""){continue;}var f=s[i];if(this._toggled[i]){f=!f;}v.setSelectionState(e,f);s[i]=f;d[e]=f;}}this._toggled={};this._syncing=false;},_resyncSelectionReverse:function(s){this._reverseTimer=0;if(this._syncing){return;}if(this._toExpand){this._expandToNode(this._toExpand);this._toExpand=null;}this._syncing=true;var v=this._viewStateManager;var t=this._tree;var d=0;var e=-1;this._selected={};for(var i=0;;i++){var f=this._indexToNodeId(i);if(f==null||f==""){break;}var g=v.getSelectionState(f);if(g){this._selected[i]=true;d++;e=i;}if(g!=t.isIndexSelected(i)){if(g){t.addSelectionInterval(i,i);}else{t.removeSelectionInterval(i,i);}}}if(s&&d==1){if(this._scrollTimer>0){clearTimeout(this._scrollTimer);}this._scrollTimer=setTimeout(this._scrollToSelection.bind(this),300,e);}this._syncing=false;},_scrollToSelection:function(s){this._scrollTimer=0;var t=this._tree;var d=t._getScrollTop();var r=t.getRowHeight();var e=t._getScrollHeight();var n=e/r;while(d+n<=s||d>s){if(d+n<=s){t._scrollPageDown();}else{t._scrollPageUp();}var f=t._getScrollTop();if(f==d){break;}d=f;}},_expandToNode:function(n){if(n.constructor===Array){if(n.length>0){n=n[0];}else{return;}}var d=this._scene.getDefaultNodeHierarchy();var p=[];d.enumerateAncestors(n,function(j){p.push(j.getNodeId());});if(p.length<1){return;}var e=0;for(var i=0;e<p.length;i++){var f=this._indexToNodeId(i);if(f==null){break;}if(f==p[e]){if(!this._tree.isExpanded(i)){var g=this._tree.getContextByIndex(i);if(g){var h=this._pathToNode(g.sPath,g.oModel.oData);this._restoreChildren(h,g.sPath);}this._tree.expand(i);}e++;}}},_restoreChildren:function(n,p){var d=this._scene.getDefaultNodeHierarchy();var e=this._tree.getBinding("rows");var v=this._viewStateManager;var i=0;d.enumerateChildren(n.id,function(f){var g=f.getNodeId();var t={name:f.getName(),id:g,visible:v.getVisibilityState(g)};if(f.getHasChildren()){var h=p+'/'+i;if(e.mContextInfo&&e.mContextInfo[h]!=undefined&&e.mContextInfo[h].bExpanded){this._restoreChildren(t,h);}else{t[0]={};}}n[i]=t;i+=1;}.bind(this));},_restoreChildrenCollapsed:function(n,p){var d=this._scene.getDefaultNodeHierarchy();var e=this._tree.getBinding("rows");var v=this._viewStateManager;var i=0;d.enumerateChildren(n.id,function(f){var g=f.getNodeId();var t={name:f.getName(),id:g,visible:v.getVisibilityState(g)};if(f.getHasChildren()){t[0]={};var h=p+'/'+i;if(e.mContextInfo[h]!=undefined){e.mContextInfo[h].bExpanded=false;}}n[i]=t;i+=1;});},_nodeOpenToggle:function(e){if(this._reverseTimer>0){clearTimeout(this._reverseTimer);}var p=e.mParameters;var d=p.rowContext.oModel.oData;var f=p.rowContext.sPath;var n=this._pathToNode(f,d);if(p.expanded){this._restoreChildren(n,f);}else if(n[0]!=undefined){var g={name:n.name,id:n.id,visible:this._viewStateManager.getVisibilityState(n.id),0:{}};this._pathToNode(f,d,g);}this._lastChangeIsExpand=true;this._reverseTimer=setTimeout(this._resyncSelectionReverse.bind(this),100,false);},_dataChange:function(e){if(this._viewStateManager==null||this._scene==null||this._vSyncing){return;}if(this._lastChangeIsExpand){this._lastChangeIsExpand=false;return;}if(this._forwardVTimer>0){clearTimeout(this._forwardVTimer);}this._forwardVTimer=setTimeout(this._resyncVisibilityForward.bind(this),100);},_resyncVisibilityForward:function(){if(!this._vSyncing){this._vSyncing=true;this._forwardVTimer=0;this._setNodeVisibility_r(this._model.getData().root,this._viewStateManager);this._vSyncing=false;}},_setNodeVisibility_r:function(n,v){if(n.id!=null&&v.getVisibilityState(n.id)!=n.visible){v.setVisibilityState(n.id,n.visible);}for(var i=0;n[i]!=null;i++){this._setNodeVisibility_r(n[i],v);}},_nodeVisibilityChanged:function(e){if(!this._vSyncing){if(this._reverseVTimer>0){clearTimeout(this._reverseVTimer);}this._reverseVTimer=setTimeout(this._resyncVisibilityReverse.bind(this),100);}},_resyncVisibilityReverse:function(){if(!this._vSyncing){this._vSyncing=true;this._forwardVTimer=0;this._getNodeVisibility_r(this._model.getData().root,this._viewStateManager);this._tree.getBinding("rows").refresh();this._vSyncing=false;}},_getNodeVisibility_r:function(n,v){if(n.id!=null){n.visible=v.getVisibilityState(n.id);}for(var i=0;n[i]!=null;i++){this._getNodeVisibility_r(n[i],v);}},refresh:function(){if(this._scene==null){this._model.setData([]);return;}var n=this._scene.getDefaultNodeHierarchy();var v=this._viewStateManager;var d={root:{name:"root",visible:true,0:{}}};var i=0;n.enumerateChildren(null,function(p){var e=p.getNodeId();var t={name:p.getName(),id:e,visible:v.getVisibilityState(e)};if(p.getHasChildren()){t[0]={};}d.root[i]=t;i+=1;});this._model.setData(d);},onAfterRendering:function(){}});return S;},true);
