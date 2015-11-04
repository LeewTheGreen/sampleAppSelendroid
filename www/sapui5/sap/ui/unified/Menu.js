/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/Control','sap/ui/core/Popup','./MenuItemBase','./library','jquery.sap.script'],function(q,C,P,M,l){"use strict";var a=C.extend("sap.ui.unified.Menu",{metadata:{library:"sap.ui.unified",properties:{enabled:{type:"boolean",group:"Behavior",defaultValue:true},ariaDescription:{type:"string",group:"Accessibility",defaultValue:null},maxVisibleItems:{type:"int",group:"Behavior",defaultValue:0},pageSize:{type:"int",group:"Behavior",defaultValue:5}},defaultAggregation:"items",aggregations:{items:{type:"sap.ui.unified.MenuItemBase",multiple:true,singularName:"item"}},associations:{ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}},events:{itemSelect:{parameters:{item:{type:"sap.ui.unified.MenuItemBase"}}}}}});(function(w){a.prototype.bCozySupported=true;a.prototype.init=function(){var t=this;this.bOpen=false;this.oOpenedSubMenu=null;this.oHoveredItem=null;this.oPopup=null;this.fAnyEventHandlerProxy=q.proxy(function(e){var r=this.getRootMenu();if(r!=this||!this.bOpen||!this.getDomRef()||(e.type!="mousedown"&&e.type!="touchstart")){return;}r.handleOuterEvent(this.getId(),e);},this);this.fOrientationChangeHandler=function(){t.close();};this.bUseTopStyle=false;};a.prototype.exit=function(){if(this.oPopup){this.oPopup.detachClosed(this._menuClosed,this);this.oPopup.destroy();delete this.oPopup;}q.sap.unbindAnyEvent(this.fAnyEventHandlerProxy);if(this._bOrientationChangeBound){q(w).unbind("orientationchange",this.fOrientationChangeHandler);this._bOrientationChangeBound=false;}this._resetDelayedRerenderItems();};a.prototype.invalidate=function(o){if(o instanceof M&&this.getDomRef()){this._delayedRerenderItems();}else{C.prototype.invalidate.apply(this,arguments);}};a.prototype.onBeforeRendering=function(){this._resetDelayedRerenderItems();};a.prototype.onAfterRendering=function(){var I=this.getItems();for(var i=0;i<I.length;i++){if(I[i].onAfterRendering&&I[i].getDomRef()){I[i].onAfterRendering();}}if(this.oHoveredItem){this.oHoveredItem.hover(true,this);}b(this);};a.prototype.onThemeChanged=function(){if(this.getDomRef()&&this.getPopup().getOpenState()===sap.ui.core.OpenState.OPEN){b(this);this.getPopup()._applyPosition(this.getPopup()._oLastPosition);}};a.prototype.setPageSize=function(S){return this.setProperty("pageSize",S,true);};a.prototype.addItem=function(i){this.addAggregation("items",i,!!this.getDomRef());this._delayedRerenderItems();return this;};a.prototype.insertItem=function(i,e){this.insertAggregation("items",i,e,!!this.getDomRef());this._delayedRerenderItems();return this;};a.prototype.removeItem=function(i){this.removeAggregation("items",i,!!this.getDomRef());this._delayedRerenderItems();return this;};a.prototype.removeAllItems=function(){var r=this.removeAllAggregation("items",!!this.getDomRef());this._delayedRerenderItems();return r;};a.prototype.destroyItems=function(){this.destroyAggregation("items",!!this.getDomRef());this._delayedRerenderItems();return this;};a.prototype._delayedRerenderItems=function(){if(!this.getDomRef()){return;}this._resetDelayedRerenderItems();this._itemRerenderTimer=q.sap.delayedCall(0,this,function(){var D=this.getDomRef();if(D){var r=sap.ui.getCore().createRenderManager();sap.ui.unified.MenuRenderer.renderItems(r,this);r.flush(D);r.destroy();this.onAfterRendering();this.getPopup()._applyPosition(this.getPopup()._oLastPosition);}});};a.prototype._resetDelayedRerenderItems=function(){if(this._itemRerenderTimer){q.sap.clearDelayedCall(this._itemRerenderTimer);delete this._itemRerenderTimer;}};a.prototype.open=function(W,o,m,e,f,g,h){if(this.bOpen){return;}s(this,true);this.oOpenerRef=o;this.bIgnoreOpenerDOMRef=false;this.getPopup().open(0,m,e,f,g||"0 0",h||"_sapUiCommonsMenuFlip _sapUiCommonsMenuFlip",true);this.bOpen=true;var D=this.getDomRef();q(D).attr("tabIndex",0).focus();if(W){this.setHoveredItem(this.getNextSelectableItem(-1));}q.sap.bindAnyEvent(this.fAnyEventHandlerProxy);if(sap.ui.Device.support.orientation&&this.getRootMenu()===this){q(w).bind("orientationchange",this.fOrientationChangeHandler);this._bOrientationChangeBound=true;}};a.prototype.close=function(){if(!this.bOpen||a._dbg){return;}s(this,false);delete this._bFixed;q.sap.unbindAnyEvent(this.fAnyEventHandlerProxy);if(this._bOrientationChangeBound){q(w).unbind("orientationchange",this.fOrientationChangeHandler);this._bOrientationChangeBound=false;}this.bOpen=false;this.closeSubmenu();this.setHoveredItem();q(this.getDomRef()).attr("tabIndex",-1);this.getPopup().close(0);this._resetDelayedRerenderItems();this.$().remove();this.bOutput=false;if(this.isSubMenu()){this.getParent().getParent().oOpenedSubMenu=null;}};a.prototype._menuClosed=function(){if(this.oOpenerRef){if(!this.bIgnoreOpenerDOMRef){try{this.oOpenerRef.focus();}catch(e){q.sap.log.warning("Menu.close cannot restore the focus on opener "+this.oOpenerRef+", "+e);}}this.oOpenerRef=undefined;}};a.prototype.onclick=function(e){this.selectItem(this.getItemByDomRef(e.target),false,!!(e.metaKey||e.ctrlKey));e.preventDefault();e.stopPropagation();};a.prototype.onsapnext=function(e){if(e.keyCode!=q.sap.KeyCodes.ARROW_DOWN){if(this.oHoveredItem&&this.oHoveredItem.getSubmenu()&&this.checkEnabled(this.oHoveredItem)){this.openSubmenu(this.oHoveredItem,true);}return;}var i=this.oHoveredItem?this.indexOfAggregation("items",this.oHoveredItem):-1;this.setHoveredItem(this.getNextSelectableItem(i));e.preventDefault();e.stopPropagation();};a.prototype.onsapprevious=function(e){if(e.keyCode!=q.sap.KeyCodes.ARROW_UP){if(this.isSubMenu()){this.close();}e.preventDefault();e.stopPropagation();return;}var i=this.oHoveredItem?this.indexOfAggregation("items",this.oHoveredItem):-1;this.setHoveredItem(this.getPreviousSelectableItem(i));e.preventDefault();e.stopPropagation();};a.prototype.onsaphome=function(e){this.setHoveredItem(this.getNextSelectableItem(-1));e.preventDefault();e.stopPropagation();};a.prototype.onsapend=function(e){this.setHoveredItem(this.getPreviousSelectableItem(this.getItems().length));e.preventDefault();e.stopPropagation();};a.prototype.onsappagedown=function(e){if(this.getPageSize()<1){this.onsapend(e);return;}var i=this.oHoveredItem?this.indexOfAggregation("items",this.oHoveredItem):-1;i+=this.getPageSize();if(i>=this.getItems().length){this.onsapend(e);return;}this.setHoveredItem(this.getNextSelectableItem(i-1));e.preventDefault();e.stopPropagation();};a.prototype.onsappageup=function(e){if(this.getPageSize()<1){this.onsaphome(e);return;}var i=this.oHoveredItem?this.indexOfAggregation("items",this.oHoveredItem):-1;i-=this.getPageSize();if(i<0){this.onsaphome(e);return;}this.setHoveredItem(this.getPreviousSelectableItem(i+1));e.preventDefault();e.stopPropagation();};a.prototype.onsapselect=function(e){this._sapSelectOnKeyDown=true;e.preventDefault();e.stopPropagation();};a.prototype.onkeyup=function(e){if(!this._sapSelectOnKeyDown){return;}else{this._sapSelectOnKeyDown=false;}if(!q.sap.PseudoEvents.sapselect.fnCheck(e)){return;}this.selectItem(this.oHoveredItem,true,false);e.preventDefault();e.stopPropagation();};a.prototype.onsapbackspace=function(e){if(q(e.target).prop("tagName")!="INPUT"){e.preventDefault();}};a.prototype.onsapbackspacemodifiers=a.prototype.onsapbackspace;a.prototype.onsapescape=function(e){this.close();e.preventDefault();e.stopPropagation();};a.prototype.onsaptabnext=a.prototype.onsapescape;a.prototype.onsaptabprevious=a.prototype.onsapescape;a.prototype.onmouseover=function(e){if(!sap.ui.Device.system.desktop){return;}var i=this.getItemByDomRef(e.target);if(!this.bOpen||!i||i==this.oHoveredItem){return;}if(this.oOpenedSubMenu&&q.sap.containsOrEquals(this.oOpenedSubMenu.getDomRef(),e.target)){return;}this.setHoveredItem(i);this.closeSubmenu(true);if(q.sap.checkMouseEnterOrLeave(e,this.getDomRef())){this.getDomRef().focus();}if(this.checkEnabled(i)){this.openSubmenu(i,false,true);}};a.prototype.onmouseout=function(e){if(!sap.ui.Device.system.desktop){return;}if(q.sap.checkMouseEnterOrLeave(e,this.getDomRef())){if(!this.oOpenedSubMenu||!this.oOpenedSubMenu.getParent()===this.oHoveredItem){this.setHoveredItem(null);}}};a.prototype.onsapfocusleave=function(e){if(this.oOpenedSubMenu||!this.bOpen){return;}this.getRootMenu().handleOuterEvent(this.getId(),e);};a.prototype.handleOuterEvent=function(m,e){var i=false,t=this.getPopup().touchEnabled;if(e.type=="mousedown"||e.type=="touchstart"){if(t&&(e.isMarked("delayedMouseEvent")||e.isMarked("cancelAutoClose"))){return;}var f=this;while(f&&!i){if(q.sap.containsOrEquals(f.getDomRef(),e.target)){i=true;}f=f.oOpenedSubMenu;}}else if(e.type=="sapfocusleave"){if(t){return;}if(e.relatedControlId){var f=this;while(f&&!i){if((f.oOpenedSubMenu&&f.oOpenedSubMenu.getId()==e.relatedControlId)||q.sap.containsOrEquals(f.getDomRef(),q.sap.byId(e.relatedControlId).get(0))){i=true;}f=f.oOpenedSubMenu;}}}if(!i){this.bIgnoreOpenerDOMRef=true;this.close();}};a.prototype.getItemByDomRef=function(D){var I=this.getItems(),L=I.length;for(var i=0;i<L;i++){var o=I[i],e=o.getDomRef();if(q.sap.containsOrEquals(e,D)){return o;}}return null;};a.prototype.selectItem=function(i,W,e){if(!i||!(i instanceof M&&this.checkEnabled(i))){return;}var S=i.getSubmenu();if(!S){this.getRootMenu().close();}else{if(!sap.ui.Device.system.desktop&&this.oOpenedSubMenu===S){this.closeSubmenu();}else{this.openSubmenu(i,W);}}i.fireSelect({item:i,ctrlKey:e});this.getRootMenu().fireItemSelect({item:i});};a.prototype.isSubMenu=function(){return this.getParent()&&this.getParent().getParent&&this.getParent().getParent()instanceof a;};a.prototype.getRootMenu=function(){var t=this;while(t.isSubMenu()){t=t.getParent().getParent();}return t;};a.prototype.getMenuLevel=function(){var L=1;var t=this;while(t.isSubMenu()){t=t.getParent().getParent();L++;}return L;};a.prototype.getPopup=function(){if(!this.oPopup){this.oPopup=new P(this,false,true,false);this.oPopup.setDurations(0,0);this.oPopup.attachClosed(this._menuClosed,this);}return this.oPopup;};a.prototype.setHoveredItem=function(i){if(this.oHoveredItem){this.oHoveredItem.hover(false,this);}if(!i){this.oHoveredItem=null;q(this.getDomRef()).removeAttr("aria-activedescendant");return;}this.oHoveredItem=i;i.hover(true,this);this._setActiveDescendant(this.oHoveredItem);this.scrollToItem(this.oHoveredItem);};a.prototype._setActiveDescendant=function(i){if(sap.ui.getCore().getConfiguration().getAccessibility()&&i){var t=this;t.$().removeAttr("aria-activedescendant");setTimeout(function(){if(t.oHoveredItem===i){t.$().attr("aria-activedescendant",t.oHoveredItem.getId());}},10);}};a.prototype.openSubmenu=function(i,W,e){var S=i.getSubmenu();if(!S){return;}if(this.oOpenedSubMenu&&this.oOpenedSubMenu!==S){this.closeSubmenu();}if(this.oOpenedSubMenu){this.oOpenedSubMenu._bFixed=(e&&this.oOpenedSubMenu._bFixed)||(!e&&!this.oOpenedSubMenu._bFixed);this.oOpenedSubMenu._bringToFront();}else{this.oOpenedSubMenu=S;var f=P.Dock;S.open(W,this,f.BeginTop,f.EndTop,i,"0 0");}};a.prototype.closeSubmenu=function(i,I){if(this.oOpenedSubMenu){if(i&&this.oOpenedSubMenu._bFixed){return;}if(I){this.oOpenedSubMenu.bIgnoreOpenerDOMRef=true;}this.oOpenedSubMenu.close();this.oOpenedSubMenu=null;}};a.prototype.scrollToItem=function(i){var m=this.getDomRef(),I=i?i.getDomRef():null;if(!I||!m){return;}var e=m.scrollTop,f=I.offsetTop,g=q(m).height(),h=q(I).height();if(e>f){m.scrollTop=f;}else if((f+h)>(e+g)){m.scrollTop=Math.ceil(f+h-g);}};a.prototype._bringToFront=function(){q.sap.byId(this.getPopup().getId()).mousedown();};a.prototype.checkEnabled=function(i){return i&&i.getEnabled()&&this.getEnabled();};a.prototype.getNextSelectableItem=function(I){var o=null;var e=this.getItems();for(var i=I+1;i<e.length;i++){if(e[i].getVisible()&&this.checkEnabled(e[i])){o=e[i];break;}}if(!o){for(var i=0;i<=I;i++){if(e[i].getVisible()&&this.checkEnabled(e[i])){o=e[i];break;}}}return o;};a.prototype.getPreviousSelectableItem=function(I){var o=null;var e=this.getItems();for(var i=I-1;i>=0;i--){if(e[i].getVisible()&&this.checkEnabled(e[i])){o=e[i];break;}}if(!o){for(var i=e.length-1;i>=I;i--){if(e[i].getVisible()&&this.checkEnabled(e[i])){o=e[i];break;}}}return o;};a.prototype.setRootMenuTopStyle=function(u){this.getRootMenu().bUseTopStyle=u;a.rerenderMenu(this.getRootMenu());};a.rerenderMenu=function(m){var I=m.getItems();for(var i=0;i<I.length;i++){var S=I[i].getSubmenu();if(S){a.rerenderMenu(S);}}m.invalidate();m.rerender();};a.prototype.focus=function(){if(this.bOpen){C.prototype.focus.apply(this,arguments);this._setActiveDescendant(this.oHoveredItem);}};a.prototype.isCozy=function(){if(!this.bCozySupported){return false;}if(this.hasStyleClass("sapUiSizeCozy")){return true;}if(c(this.oOpenerRef)){return true;}if(c(this.getParent())){return true;}return false;};function c(r){if(!r){return false;}r=r.$?r.$():q(r);return r.closest(".sapUiSizeCompact,.sapUiSizeCondensed,.sapUiSizeCozy").hasClass("sapUiSizeCozy");}function s(m,o){var p=m.getParent();if(p&&p instanceof M){p.onSubmenuToggle(o);}}function b(m){var e=m.getMaxVisibleItems(),f=document.documentElement.clientHeight-10,$=m.$();if(e>0){var I=m.getItems();for(var i=0;i<I.length;i++){if(I[i].getDomRef()){f=Math.min(f,I[i].$().outerHeight(true)*e);break;}}}if($.outerHeight(true)>f){$.css("max-height",f+"px").toggleClass("sapUiMnuScroll",true);}else{$.css("max-height","").toggleClass("sapUiMnuScroll",false);}}
/*!
	 * The following code is taken from
	 * jQuery UI 1.10.3 - 2013-11-18
	 * jquery.ui.position.js
	 *
	 * http://jqueryui.com
	 * Copyright 2013 jQuery Foundation and other contributors; Licensed MIT
	 */
function _(e){var f=q(w);e.within={element:f,isWindow:true,offset:f.offset()||{left:0,top:0},scrollLeft:f.scrollLeft(),scrollTop:f.scrollTop(),width:f.width(),height:f.height()};e.collisionPosition={marginLeft:0,marginTop:0};return e;}var d={fit:{left:function(p,e){var f=e.within,g=f.isWindow?f.scrollLeft:f.offset.left,o=f.width,h=p.left-e.collisionPosition.marginLeft,i=g-h,j=h+e.collisionWidth-o-g,n;if(e.collisionWidth>o){if(i>0&&j<=0){n=p.left+i+e.collisionWidth-o-g;p.left+=i-n;}else if(j>0&&i<=0){p.left=g;}else{if(i>j){p.left=g+o-e.collisionWidth;}else{p.left=g;}}}else if(i>0){p.left+=i;}else if(j>0){p.left-=j;}else{p.left=Math.max(p.left-h,p.left);}},top:function(p,e){var f=e.within,g=f.isWindow?f.scrollTop:f.offset.top,o=e.within.height,h=p.top-e.collisionPosition.marginTop,i=g-h,j=h+e.collisionHeight-o-g,n;if(e.collisionHeight>o){if(i>0&&j<=0){n=p.top+i+e.collisionHeight-o-g;p.top+=i-n;}else if(j>0&&i<=0){p.top=g;}else{if(i>j){p.top=g+o-e.collisionHeight;}else{p.top=g;}}}else if(i>0){p.top+=i;}else if(j>0){p.top-=j;}else{p.top=Math.max(p.top-h,p.top);}}},flip:{left:function(p,e){var f=e.within,g=f.offset.left+f.scrollLeft,o=f.width,h=f.isWindow?f.scrollLeft:f.offset.left,i=p.left-e.collisionPosition.marginLeft,j=i-h,k=i+e.collisionWidth-o-h,m=e.my[0]==="left"?-e.elemWidth:e.my[0]==="right"?e.elemWidth:0,n=e.at[0]==="left"?e.targetWidth:e.at[0]==="right"?-e.targetWidth:0,r=-2*e.offset[0],t,u;if(j<0){t=p.left+m+n+r+e.collisionWidth-o-g;if(t<0||t<Math.abs(j)){p.left+=m+n+r;}}else if(k>0){u=p.left-e.collisionPosition.marginLeft+m+n+r-h;if(u>0||Math.abs(u)<k){p.left+=m+n+r;}}},top:function(p,e){var f=e.within,g=f.offset.top+f.scrollTop,o=f.height,h=f.isWindow?f.scrollTop:f.offset.top,i=p.top-e.collisionPosition.marginTop,j=i-h,k=i+e.collisionHeight-o-h,t=e.my[1]==="top",m=t?-e.elemHeight:e.my[1]==="bottom"?e.elemHeight:0,n=e.at[1]==="top"?e.targetHeight:e.at[1]==="bottom"?-e.targetHeight:0,r=-2*e.offset[1],u,v;if(j<0){v=p.top+m+n+r+e.collisionHeight-o-g;if((p.top+m+n+r)>j&&(v<0||v<Math.abs(j))){p.top+=m+n+r;}}else if(k>0){u=p.top-e.collisionPosition.marginTop+m+n+r-h;if((p.top+m+n+r)>k&&(u>0||Math.abs(u)<k)){p.top+=m+n+r;}}}},flipfit:{left:function(){d.flip.left.apply(this,arguments);d.fit.left.apply(this,arguments);},top:function(){d.flip.top.apply(this,arguments);d.fit.top.apply(this,arguments);}}};q.ui.position._sapUiCommonsMenuFlip={left:function(p,e){if(q.ui.position.flipfit){q.ui.position.flipfit.left.apply(this,arguments);return;}e=_(e);d.flipfit.left.apply(this,arguments);},top:function(p,e){if(q.ui.position.flipfit){q.ui.position.flipfit.top.apply(this,arguments);return;}e=_(e);d.flipfit.top.apply(this,arguments);}};})(window);return a;},true);
