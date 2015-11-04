/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["jquery.sap.global","./TransformationMatrix","./DvlException"],function(q,T,D){"use strict";sap.ui.getCore().initLibrary({name:"sap.ui.vk",dependencies:["sap.ui.core","sap.ui.unified","sap.ui.vbm"],types:["sap.ui.vk.ContentResourceSourceCategory","sap.ui.vk.TransformationMatrix"],interfaces:[],controls:["sap.ui.vk.NativeViewport","sap.ui.vk.Overlay","sap.ui.vk.Viewer","sap.ui.vk.Viewport","sap.ui.vk.SceneTree"],elements:["sap.ui.vk.OverlayArea"],noLibraryCSS:false,version:"1.32.3"});sap.ui.vk.GraphicsCoreApi={LegacyDvl:"LegacyDvl"};sap.ui.vk.ContentResourceSourceCategory={"3D":"3D","2D":"2D"};sap.ui.vk.ContentResourceSourceTypeToCategoryMap={"vds":sap.ui.vk.ContentResourceSourceCategory["3D"],"png":sap.ui.vk.ContentResourceSourceCategory["2D"],"jpg":sap.ui.vk.ContentResourceSourceCategory["2D"],"gif":sap.ui.vk.ContentResourceSourceCategory["2D"]};sap.ui.vk.dvl={checkResult:function(r){if(r<0){throw new D(r,sap.ve.dvl.DVLRESULT.getDescription?sap.ve.dvl.DVLRESULT.getDescription(r):"");}return r;},getPointer:function(p){if(p.indexOf("errorcode")===0){var c=parseInt(p.substr(15),16)-0x100;throw new D(c,sap.ve.dvl.DVLRESULT.getDescription?sap.ve.dvl.DVLRESULT.getDescription(c):"");}return p;},getJSONObject:function(o){if(q.type(o)==="number"){throw new D(o,sap.ve.dvl.DVLRESULT.getDescription?sap.ve.dvl.DVLRESULT.getDescription(o):"");}return o;}};return sap.ui.vk;});
