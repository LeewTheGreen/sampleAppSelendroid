/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2015 SAP SE. All rights reserved
 */

// Provides control sap.viz.ui5.controls.VizFrame.
sap.ui.define([
        'sap/viz/library',
        './libs/sap-viz-vizframe/sap-viz-vizframe',
        './libs/sap-viz-vizservices/sap-viz-vizservices',
        'sap/viz/ui5/theming/Util',
        './ResponsiveLegend',
        './common/BaseControl',
        './common/feeds/AnalysisObject',
        './common/feeds/FeedItem',
        './common/helpers/VizControlsHelper',
        './common/helpers/VizFrameOptionsHelper',
        './common/helpers/DefaultPropertiesHelper',
        'sap/ui/Device'
    ], function(
            library,
            vizframe,
            vizservices,
            Util,
            ResponsiveLegend, 
            BaseControl, 
            AnalysisObject, 
            FeedItem, 
            VizControlsHelper,
            VizFrameOptionsHelper,
            DefaultPropertiesHelper,
            Device) {
    "use strict";

    var BindingService = sap.viz.vizservices.__internal__.BindingService;
    var PropertyService = sap.viz.vizservices.__internal__.PropertyService;
        
    /**
     * Constructor for a new ui5/controls/VizFrame.
     *
     * @param {string} [sId] id for the new control, generated automatically if no id is given 
     * @param {object} [mSettings] initial settings for the new control
     *
     * @class
     * VizFrame is a viz control that manages a visualization’s initialization, layout, feeding, customization and interactions.
     * <p>For more information on the available info chart types, see the following <a href="../../vizdocs/index.html" target="_blank">documentation</a>.</p>
     * @extends sap.viz.ui5.controls.common.BaseControl
     *
     * @constructor
     * @public
     * @since 1.22.0
     * @name sap.viz.ui5.controls.VizFrame
     * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
     */
    var VizFrame = BaseControl.extend("sap.viz.ui5.controls.VizFrame", /** @lends sap.viz.ui5.controls.VizFrame.prototype */ { metadata : {

        library : "sap.viz",
        properties : {

            /**
             * Type for viz frame. User can pass 'chartType' or 'info/chartType'. For example both 'bar' and 'info/bar' will create a info bar chart.
             * Supported chart type: column, dual_column, bar, dual_bar, stacked_bar, stacked_column, line, dual_line, combination, bullet, bubble, time_bubble, pie, donut,
             * timeseries_column, timeseries_line, timeseries_scatter, timeseries_bubble,
             * scatter, vertical_bullet, dual_stacked_bar, 100_stacked_bar, 100_dual_stacked_bar, dual_stacked_column, 100_stacked_column,
             * 100_dual_stacked_column, stacked_combination, horizontal_stacked_combination, dual_stacked_combination, dual_horizontal_stacked_combination, heatmap
             */
            vizType : {type : "string", group : "Misc", defaultValue : "column"},

            /**
             * Chart properties, refer to chart property doc for more details.
             */
            vizProperties : {type : "object", group : "Misc", defaultValue : null},

            /**
             * Chart scales, refer to chart property doc for more details.
             * @since 1.25
             */
            vizScales : {type : "object", group : "Misc", defaultValue : null},

            /**
             * Chart customizations property, aim to customize existing (build-in) charts
             * to meet specific LoB requirements.
             * Currently, supported chart type : column, dual_column, bar, dual_bar, stacked_column, stacked_bar, 100_stacked_bar, 100_stacked_column, 100_dual_stacked_bar, 100_dual_stacked_column, dual_stacked_bar, dual_stacked_column, line, horizontal_line, dual_line, dual_horizontal_line, combination, horizontal_combination, stacked_combination, horizontal_stacked_combination, dual_stacked_combination, dual_horizontal_stacked_combination, scatter, bubble.
             */
            vizCustomizations : {type : "object", group : "Misc", defaultValue : null},

            /**
             * Set chart's legend properties.
             */
            legendVisible : {type : "boolean", group : "Misc", defaultValue : true}
        },
        aggregations : {

            /**
             * Dataset for chart.
             */
            dataset : {type : "sap.viz.ui5.data.Dataset", multiple : false}, 

            /**
             * All feeds for chart.
             */
            feeds : {type : "sap.viz.ui5.controls.common.feeds.FeedItem", multiple : true, singularName : "feed"}
        },
        events : {

            /**
             * Event fires when the rendering ends.
             */
            renderComplete : {}, 

            /**
             * Event fires when certain data point(s) is(are) selected, data context of selected item(s) would be passed in.
             */
            selectData : {}, 

            /**
             * Event fires when certain data point(s) is(are) deselected, data context of deselected item(s) would be passed in
             */
            deselectData : {}
        }
    }});


    /**
     * Uid for viz frame. It supports other controls to connect to a viz instance.
     *
     * @name sap.viz.ui5.controls.VizFrame#getVizUid
     * @function
     * @type string
     * @public
     * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
     */

    /**
     * Get ResponsiveLegend Control. (For fiori application set only. It has been deprecated since 1.28.)
     *
     * @name sap.viz.ui5.controls.VizFrame#getResponsiveLegend
     * @function
     * @type void
     * @public
     * @deprecated Since version 1.28. 
     * This API has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
     * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
     */


    /**
     * Return current legend group visibility.
     *
     * @name sap.viz.ui5.controls.VizFrame#getLegendVisible
     * @function
     * @type boolean
     * @public
     * @since 1.28
     * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
     */


    /**
     * Will respect the setting for all available legends.
     *
     * @name sap.viz.ui5.controls.VizFrame#setLegendVisible
     * @function
     * @param {boolean} bLegendVisible
     *         Set legend visibility.
     * @type object
     * @public
     * @since 1.28
     * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
     */

    VizFrame.prototype.init = function() {
        sap.viz.ui5.controls.common.BaseControl.prototype.init.apply(this, arguments);

        this._wrapApi('setModel', function() {this._invalidateDataset = true;}.bind(this));
        this._wrapApi('setDataset', function() {this._invalidateDataset = true;}.bind(this));
        this._wrapApi('destroyDataset', function() {this._invalidateDataset = true;}.bind(this));
        
        this._wrapApi('addFeed', function() {this._invalidateFeeds = true;}.bind(this));
        this._wrapApi('removeFeed', function() {this._invalidateFeeds = true;}.bind(this));
        this._wrapApi('destroyFeeds', function() {this._invalidateFeeds = true;}.bind(this));

        this._vizFrame = null;
        this._currentTheme = null;
        this._connectPopover = null;

        this._clearVariables();
        this.data("sap-ui-fastnavgroup", "true", true/*Write into DOM*/);
    };

    VizFrame.prototype.applySettings = function() {
        sap.ui.core.Control.prototype.applySettings.apply(this, arguments);
    };

    VizFrame.prototype.exit = function() {
        sap.viz.ui5.controls.common.BaseControl.prototype.exit.apply(this, arguments);

        this._clearVariables();
    };

    VizFrame.prototype._clearVariables = function() {
        this._clearRequestedProperties();

        this._cachedDataset = null;
        this._connectPopover = null;
    };

    VizFrame.prototype._clearRequestedProperties = function() {
        this.setProperty('vizProperties', null);
        this.setProperty('vizScales', null);
        this.setProperty('vizCustomizations', null);
    };

    VizFrame.prototype.getVizUid = function() {
        return this.getId();
    };

    /**
     * Setter for property uiConfig. uiConfig could only set via settings parameter
     * of constructor.
     *
     * uiConfig from base type could config the instance. Supported uiConfig
     * keyword: applicationSet, showErrorMessage
     *
     * Example:
     *
     * <pre>
     * var vizFrame = new sap.viz.ui5.controls.VizFrame({
     *  'vizType' : 'bar',
     *  'uiConfig' : {
     *      'applicationSet' : 'fiori',
     *      'showErrorMessage' : true
     *  }
     * });
     * </pre>
     *
     * @param {object}
     *            oUiConfig
     * @returns {sap.viz.ui5.controls.VizFrame}
     * @public
     * @name sap.viz.ui5.controls.VizFrame#setUiConfig
     * @function
     */
    VizFrame.prototype.setUiConfig = function(oUiConfig) {
        sap.viz.ui5.controls.common.BaseControl.prototype.setUiConfig.apply(this, arguments);
    };

    /**
     * Setter for property vizType. vizType could only set via settings parameter in Constructor.
     * Do not set vizType at runtime.
     * 
     * vizType is a string of supported chart type or extension chart type.
     *  
     * Supported chart types: bubble, combination, column, bar, line, stacked_bar, stacked_column, bullet, vertical_bullet, timebubble. 
     * User can pass 'chartType' or 'info/chartType' for these supported chart types. 
     * 
     * Example:
     * <pre>
     * var vizFrame = new sap.viz.ui5.controls.VizFrame({
     *  'vizType' : 'bar'
     * });
     * </pre>
     * 
     * For extension chart type, user should load extension js file manually at first.
     * 
     * Example:
     * <pre>
     * var vizFrame = new sap.viz.ui5.controls.VizFrame({
     *  'vizType' : 'myextension'
     * });
     * </pre>
     * 
     * @param {string}
     *            sVizType
     * @returns {sap.viz.ui5.controls.VizFrame}
     * @public
     * @name sap.viz.ui5.controls.VizFrame#setVizType
     * @function
     */
    VizFrame.prototype.setVizType = function(sVizType) {
        var oldType = this._getCalculatedType();
    	if (sVizType !== this.getVizType()) {    		
    		this._invalidateVizType = true;
    	}
        this.setProperty('vizType', sVizType, true);
        if (this._vizFrame && !this._pendingRerendering) {
            this._switchFeeds(oldType, this._getCalculatedType());
        } else {
            this.invalidate();
        }
        return this;
    };


    VizFrame.prototype._switchFeeds = function (fromType, toType) {
        var lwFeeds = FeedItem.toLightWeightFmt(this.getFeeds());
        var newFeeds = sap.viz.vizservices.BVRService.switchFeeds(fromType, lwFeeds, toType).feedItems;
        var defMap = VizControlsHelper.getFeedDefsMap(toType);
        newFeeds.forEach(function (feed) {
            if (feed.id && defMap[feed.id]) {
                feed.type = defMap[feed.id].type;
            }
        });
        var newUi5Feeds = FeedItem.fromLightWeightFmt(newFeeds);
        this.vizUpdate({feeds : newUi5Feeds});
    };


    // override to add dataset invalidated flag
    VizFrame.prototype.invalidate = function(oOrigin) {
        if (oOrigin instanceof sap.viz.ui5.data.Dataset) {
            this._invalidateDataset = true;
        }
        sap.viz.ui5.controls.common.BaseControl.prototype.invalidate.call(this, oOrigin);
    };

    VizFrame.prototype.getVizProperties = function() {
        if (this._vizFrame) {
            return this._mergeProperties(this._mergeProperties({}, this._vizFrame.properties() || {}), this.getProperty('vizProperties') || {});
        } else {
            return this.getProperty('vizProperties');
        }
    };

    VizFrame.prototype.getVizScales = function() {
        if (this._vizFrame) {
            return jQuery.extend(this._vizFrame.scales() || [], this.getProperty('vizScales'));
        } else {
            return this.getProperty('vizScales');
        }
    };

    /**
     * Zoom the chart plot.
     *
     * Example:
     * <pre>
     *  var vizFrame = new sap.viz.ui5.controls.VizFrame(...);
     *  vizFrame.zoom({direction: "in"});
     * </pre>
     *
     * @param {object}
     *            contains a "direction" attribute with value "in" or "out" indicating zoom to enlarge or shrink respectively
     * @public
     * @name sap.viz.ui5.controls.VizFrame#zoom
     * @function
     */
    VizFrame.prototype.zoom = function(cfg) {
        if (this._vizFrame) {
            this._vizFrame.zoom({
                target: "plotArea",
                direction: cfg.direction
            });             
        }
   };

    /**
     * Properties for viz frame.
     *
     * Example:
     *
     * <pre>
     *  var vizFrame = new sap.viz.ui5.controls.VizFrame(...);
     *  var properties = {
     *      'legend' : { 'visible'; : true }
     * };
     * vizFrame.setVizProperties(properties);
     * </pre>
     *
     * @param {object}
     *            oVizProperties
     * @returns {sap.viz.ui5.controls.VizFrame}
     * @public
     * @name sap.viz.ui5.controls.VizFrame#setVizProperties
     * @function
     */
    VizFrame.prototype.setVizProperties = function(oVizProperties) {
        var options = sap.viz.api.serialization.migrate({
            'type' : this._getCalculatedType(),
            'properties' : oVizProperties
        });
        if (this._vizFrame && !this._pendingRerendering) {
            this._vizFrame.update(options);
        } else {
            // Use as a cache
            this.setProperty('vizProperties', this._mergeProperties(this.getProperty('vizProperties') || {}, options.properties || {}));
            this.setVizScales(options.scales);
            this.invalidate();
        }
        return this;
    };

    /**
     * Scales for viz frame. 
     *
     * Example:
     *
     * <pre>
     *  var vizFrame = new sap.viz.ui5.controls.VizFrame(...);
     *  var scales = [{
     *      'feed': 'color',
     *      'palette': ['#ff0000']
     * }];
     * vizFrame.setVizScales(scales);
     * </pre>
     *
     * @param {object}
     *            oVizScales
     * @returns {sap.viz.ui5.controls.VizFrame}
     * @public
     * @name sap.viz.ui5.controls.VizFrame#setVizScales
     * @function
     */
    VizFrame.prototype.setVizScales = function(oVizScales) {
        if (this._vizFrame && !this._pendingRerendering) {
            this._vizFrame.scales(oVizScales);
        } else {
            // Use as a cache
            this.setProperty('vizScales', jQuery.extend(this.getProperty('vizScales') || [], oVizScales || []));
            this.invalidate();
        }
        return this;
    };

    /**
     * @public
     */
    VizFrame.prototype.getLegendVisible = function(){
        return this.getVizProperties().legendGroup.computedVisibility;
    };

    /**
     * @public
     */
    VizFrame.prototype.setLegendVisible = function(visibility){
        this.setVizProperties({
            'legend': {
                'visible' : visibility
            },
            'sizeLegend': {
                'visible' : visibility
            }
        });
        
        return this;
    };

    /**
     * Selections for viz frame. Example:
     *
     * <pre>
     *  var vizFrame = new sap.viz.ui5.controls.VizFrame(...);
     *  var points = [{
     *      data : {
     *          "Country" : "China",
     *          "Year" : "2001",
     *          "Product" : "Car",
     *          "Profit" : 25
     *      }}, {
     *      data : {
     *          "Country" : "China",
     *          "Year" : "2001",
     *          "Product" : "Trunk",
     *          "Profit" : 34
     *      }}];
     *  var action = {
     *      clearSelection : true
     *  };
     * vizFrame.vizSelection(points, action);
     * </pre>
     *
     * @param {object[]}
     *            aPoints some data points of the chart
     * @param {object}
     *            oAction whether to clear previous selection, by default the
     *            selection will be incremental selection
     * @returns {sap.viz.ui5.controls.VizFrame}
     * @public
     * @name sap.viz.ui5.controls.VizFrame#vizSelection
     * @function
     */
    VizFrame.prototype.vizSelection = function(aPoints, oAction) {
        if (this._vizFrame) {
            try {
                var result = this._vizFrame.selection.apply(this._vizFrame, arguments);
                if (result === this._vizFrame) {
                    result = this;
                }
            } catch (e) {
                return null;
            }
            return result;
        } else {
            return null;
        }
    };

    /**
     * Update viz frame according to a JSON object, it can update css, properties,
     * feeds and data model. Example:
     *
     * <pre>
     * var vizFrame = new sap.viz.ui5.controls.VizFrame(...);
     * var data = {
     *     'path' : "/rawData"
     * };
     * var properties = {
     *     'legend' : {'visible' : true},
     * };
     * var scales = [{
     *      'feed': 'color',
     *      'palette': ['#ff0000']
     * }];
     * var customizations = {id:"sap.viz.custom",customOverlayProperties: {}};
     * var FeedItem = sap.viz.ui5.controls.common.feeds.FeedItem;
     * var feeds = [
     *     new FeedItem({'uid' : 'primaryValues',
     *                   'type' : 'Measure',
     *                   'values' []}),
     *     new FeedItem({'uid' : 'regionColor',
     *                   'type' : 'Dimension',
     *                   'values' []})];
     * vizFrame.vizUpdate({
     *               'data' : data,
     *               'properties' : properties,
     *               'scales' : scales,
     *               'customizations' : customizations,
     *               'feeds' : feeds
     *           });
     * </pre>
     *
     * @param {object}
     *            oOptions a JSON object contains combination of properties, feeds
     *            and data model.
     * @returns {sap.viz.ui5.controls.VizFrame}
     * @public
     * @name sap.viz.ui5.controls.VizFrame#vizUpdate
     * @function
     */
    VizFrame.prototype.vizUpdate = function(oOptions) {
        if (this._vizFrame) {
            if (oOptions.data || oOptions.feeds) {
                // Create requested cache when aggregation changed
                if (oOptions.properties) {
                    this.setVizProperties(oOptions.properties);
                }
                if (oOptions.scales) {
                    this.setVizSacles(oOptions.scales);
                }
                if (oOptions.customizations) {
                    this.setVizCustomizations(oOptions.customizations);
                }
                if (oOptions.data) {
                    this.setDataset(oOptions.data);
                }
                if (oOptions.feeds) {
                    this.destroyFeeds();
                    oOptions.feeds.forEach(function(feedItem) {
                        this.addFeed(feedItem);
                    }.bind(this));
                }
            } else {
                // Call _vizFrame.vizUpdate directly when aggregation not changed
                this._vizFrame.update(oOptions);
            }
        }
        
    };

    /**
    * Set chart customizations,could set via settings parameter of constructor or call the func directly
    * @function setVizCustomizations
    * @memberof VizFrame
    *
    * @supported chart types: column,dual_column,bar,dual_bar,stacked_column,stacked_bar,100_stacked_bar,100_stacked_column,100_dual_stacked_bar,100_dual_stacked_column,
    * dual_stacked_bar,dual_stacked_column,line,horizontal_line,dual_line,dual_horizontal_line,combination,horizontal_combination,stacked_combination,
    * horizontal_stacked_combination,dual_stacked_combination,dual_horizontal_stacked_combination,scatter,bubble.
    *
    * @param {Object} obj The object describe the customizations which contains 4 keys.
    *   id the customizations id
    *   [customOverlayProperties] {}
    *   [customRendererProperties] {id, [{ctx, properties}]}
    *   [customInteractionProperties] {id, {properties}}
    *
    * @example <caption>Sample Code:</caption>
    * VizFrame.vizCustomizations({id : "", customOverlayProperties: {}, customRendererProperties: {}, customInteractionProperties: {}});
    * @returns {sap.viz.ui5.controls.VizFrame}
    */
    VizFrame.prototype.setVizCustomizations = function(obj) {
        if(VizFrame._isCustomizationAPISupportedVizType(this._getCalculatedType())) {
            if (this._vizFrame && !this._pendingRerendering) {
                this._vizFrame.customizations(obj);
            } else {
                // Use as a cache
                this.setProperty('vizCustomizations', this._mergeProperties(this.getProperty('vizCustomizations') || {}, obj || {}));
            }
        }
        return this;
    };

    VizFrame.prototype.getVizCustomizations = function(){
        if (this._vizFrame) {
            return this._mergeProperties(this._mergeProperties({}, this._vizFrame.customizations() || {}), this.getProperty('vizCustomizations') || {});
        }else{
            return this.getProperty('vizCustomizations');
        } 
    };

    VizFrame._isCustomizationAPISupportedVizType = function(vizType) {
        // @formatter:off
        return jQuery.inArray(vizType,
                [ 'info/column', 'info/dual_column','info/bar', 'info/dual_bar', 'info/stacked_bar','info/stacked_column',
                  'info/100_stacked_bar','info/100_stacked_column','info/100_dual_stacked_bar','info/100_dual_stacked_column',
                  'info/dual_stacked_bar','info/dual_stacked_column','info/line','info/horizontal_line','info/dual_line',
                  'info/dual_horizontal_line','info/bubble', "info/scatter", 'info/combination','info/horizontal_combination',
                  'info/stacked_combination', 'info/horizontal_stacked_combination','info/dual_stacked_combination',
                  'info/dual_horizontal_stacked_combination']) !== -1;
        // @formatter:on
    };

    VizFrame.prototype.getResponsiveLegend = function(){
        if(this._vizFrame){
            return sap.viz.ui5.controls.ResponsiveLegend.createInstance(this._vizFrame.responsiveLegend());
        }
    };

    VizFrame.prototype._createVizFrame = function(options) {
        // sap.ui.core.RenderManager.preserveContent
        jQuery(this._app$).attr("data-sap-ui-preserve", true);

        // Container
        var cssPrefix = 'ui5-viz-controls';
        var vizFrame$ = jQuery(document.createElement('div'));
        vizFrame$.addClass(cssPrefix + '-viz-frame');
        vizFrame$.appendTo(this._app$);
        options.container = vizFrame$.get(0);
        
        //Description Layer
        this._descriptionLayer$ = jQuery(document.createElement('div'));
        this._descriptionLayer$.addClass(cssPrefix + "-viz-description");
        this._descriptionLayer$.appendTo(this._app$);

        var vizFrame = this._vizFrame = new sap.viz.vizframe.VizFrame(options, {
            'controls' : {
                'morpher' : {
                    'enabled' : false
                },
            }, 'throwError' : true
        });

        vizFrame.on('selectData', function(e) {
            this.fireEvent("selectData", e);
        }.bind(this));
        vizFrame.on('deselectData', function(e) {
            this.fireEvent("deselectData", e);
        }.bind(this));
        vizFrame.on('initialized', function(e) {
            this.fireEvent("renderComplete", e);
        }.bind(this));

        return vizFrame;
    };

    VizFrame.prototype._migrate = function(type, feeds) {
        feeds.forEach(function(feedItem) {
            var migrated = sap.viz.api.serialization.feedsIdToBindingId(type, feedItem.getUid());
            if (migrated) {
                feedItem.setProperty('uid', migrated, true);
            }
        });
        if (type === "info/bullet" || type === "info/vertical_bullet") {
            var hasActualBinding = false;
            feeds.forEach(function(feedItem) {
                hasActualBinding = hasActualBinding || feedItem.getUid() === 'actualValues'
            });
            if (!hasActualBinding) {
                feeds.forEach(function(feedItem) {
                    if (feedItem.getUid() === 'valueAxis') {
                        feedItem.setUid('actualValues');
                        if (feedItem.getValues().length > 1) {
                            feeds.push(new FeedItem({
                                'uid' : 'additionalValues',
                                'type' : 'Measure',
                                'values' : feedItem.getValues()[1]
                            }));
                            feedItem.setValues(feedItem.getValues()[0]);
                        }
                    }
                });
            }
        }
    };

    VizFrame.prototype._renderVizFrame = function() {
        var applicationSet = (this.getUiConfig() || {}).applicationSet;
                
        var type = this._getCalculatedType();
        var feeds = this.getFeeds();
        // Migrate
        this._migrate(type, feeds);

        var themeChanged = false, theme = sap.ui.getCore().getConfiguration().getTheme();
        if(this._currentTheme !== theme) {
            themeChanged = true;
        }
        if (!(this._invalidateFeeds || this._invalidateDataset || themeChanged)) {
            return;
        }

        var options = {
            'type' : type
        };
        // data
        if (this._invalidateDataset) {
            options.data = this._getVizDataset();
		    if (this.__pendingDataRequest) {
		    	return;
		    }
            this._invalidateDataset = false;
        }
        // feeds
        if (this._invalidateFeeds) {
            options.bindings = this._getVizBindings(type, feeds);
            this._invalidateFeeds = false;
        }
        // properties
        if (this.getProperty('vizProperties')) {
            options.properties = this.getProperty('vizProperties');
        }
        // scales
        if (this.getProperty('vizScales')) {
            options.scales = this.getProperty('vizScales');
        } 
        // customized properties
        if (this.getProperty('vizCustomizations')) {
            options.customizations = this.getProperty('vizCustomizations');
        }
        if (!this._vizFrame || this._invalidateVizType) {
            // Merge default properties
            var defaultProperties;
            if (applicationSet === 'fiori') {
                defaultProperties = DefaultPropertiesHelper.getFiori(PropertyService, type);
                // Specific default properties
                for (var key in defaultProperties) {
                    if (defaultProperties[key].gridline) {
                        defaultProperties[key].gridline.visible = true;
                    }
                }
                // Gerneral default properties
                this._mergeProperties(defaultProperties, VizFrameOptionsHelper.defaultFioriProperties());
            } else {
                defaultProperties = DefaultPropertiesHelper.get(PropertyService, type);
            }
            options.properties = this._mergeProperties(defaultProperties, options.properties || {});
        }
        
        if (this._invalidateVizType) {
        	this._invalidateVizType = false;
        }

        if (themeChanged) {
            options.properties = this._mergeProperties(sap.viz.ui5.theming.Util.readCSSParameters(type), options.properties || {});
            this._currentTheme = theme;
        }
        // Merge the theme properties and user setting properties;
        if (applicationSet === 'fiori') {
            options.properties = options.properties || {};
            VizFrameOptionsHelper.decorateFiori(options, feeds, !!this._vizFrame);

            var isMobile = Device.system.tablet || Device.system.phone;
            if(isMobile){
                if(options.properties.plotArea && options.properties.plotArea.scrollbar) {
                    options.properties.plotArea.scrollbar.spacing = 2;
                }
                if(options.properties.legend && options.properties.legend.scrollbar) {
                    options.properties.legend.scrollbar.spacing = 2;
                }
            }
        }


           
        if (options.properties) {
            options.properties = PropertyService.removeInvalid(type, options.properties);
        }
        
        if (options.type === "info/bullet" || options.type === "info/vertical_bullet") {
            VizFrameOptionsHelper.decorateBullet(options, feeds);
        }
        try {
            if (!this._vizFrame) {
                if (options.data) {
                    this._createVizFrame(options);
                    this._clearRequestedProperties();
                }
            } else {
                this._vizFrame.update(options);
                this._clearRequestedProperties();
            }
            if(this._connectPopover) {
                this._connectPopover();
            }
            this._updateDescription();
        } catch (err) {
            var showError = (this.getUiConfig() || {}).showErrorMessage !== false;
            if (showError) {
                this._updateDescription(err);
            }
            this.fireEvent('renderFail', {
                'id' : 'renderFail',
                'error' : err
            });
        }
    };

    VizFrame.prototype._getVizDataset = function() {
        var ds = this.getDataset();
        if (ds) {
            if (this._isExtension()) {
                var metadata = sap.viz.api.metadata.Viz.get(this._getCalculatedType());
                if (metadata && metadata.dataType === 'raw') {
                    return ds.getRawDataset();
                } else {
                    VizControlsHelper.updateAxis(ds.getDimensions(), this._getCalculatedType(), this.getFeeds());
                    return ds.getVIZCrossDataset();
                }
            } else {
                return ds.getVIZFlatDataset();
            }
        } else {
            return null;
        }
    };

    VizFrame.prototype._getVizBindings = function(type, feeds) {
        if (feeds && feeds.length) {
            var lwFeedItems = FeedItem.toLightWeightFmt(feeds);
            lwFeedItems = sap.viz.vizservices.BVRService.suggestFeeds(type, lwFeedItems,
                [{'id' : 'MND', 'type' : 'MND'}]).feedItems;
            if (this._isExtension()) {
                return BindingService.generateBindings(type, 
                    lwFeedItems, 'CrossTableDataset');
            } else {
                return BindingService.generateBindings(type, 
                    lwFeedItems, 'FlatTableDataset');
            }
        } else {
            return null;
        }
    };
    
    VizFrame.prototype._onConnectPopover = function(callback) {
        this._connectPopover = callback;
    };

    VizFrame.prototype._createChildren = function() {
        this._renderVizFrame();
    };

    VizFrame.prototype._updateChildren = function() {
        this._renderVizFrame();
    };

    VizFrame.prototype._validateSize = function(event) {
        if (!this._app$ || !this.$() || (event && event.size &&
            (event.size.height == 0 || event.size.width == 0))) {
            return;
        }

        var appSize = {
            'width' : this.$().width(),
            'height' : this.$().height()
        };

        if (this._vizFrame) {
            var size = this._vizFrame.size();
            if (!size || size.width !== appSize.width || size.height !== appSize.height) {
                this._vizFrame.size({
                    'width' : appSize.width,
                    'height' : appSize.height
                });
            }
        }
        
        this._updateDescriptionPosition();
    };
    
    VizFrame.prototype._getCalculatedType = function() {
        if (this._isExtension()) {
            return this.getVizType();
        } else {
            return this._getInfoType();
        }
    };

    VizFrame.prototype._isExtension = function() {
        return CORE_CHART_TYPES.indexOf(this._getInfoType()) === -1;
    };

    VizFrame.prototype._getInfoType = function() {
        var vizType = this.getVizType();
        if (vizType.indexOf("info/") === -1) {
            return 'info/' + vizType;
        } else {
            return vizType;
        }
    };
    // @formatter:off
    var CORE_CHART_TYPES = [ 'info/column', 'info/bar', 'info/stacked_bar',
      'info/stacked_column', 'info/line', 'info/combination',
      'info/bullet', 'info/bubble', 'info/time_bubble', 
      "info/pie", "info/donut", "info/scatter", "info/vertical_bullet", 
      "info/dual_stacked_bar", "info/100_stacked_bar", "info/100_dual_stacked_bar", 
      "info/dual_stacked_column", "info/100_stacked_column", "info/100_dual_stacked_column", 
      "info/stacked_combination", "info/horizontal_stacked_combination", "info/dual_stacked_combination", 
      "info/dual_horizontal_stacked_combination",
      "info/dual_bar", "info/dual_column", "info/dual_line",
      "info/timeseries_column", "info/timeseries_line", "info/timeseries_scatter", "info/timeseries_bubble", 
      "info/heatmap"];
    // @formatter:on
    
    VizFrame.prototype._mergeProperties = function(target, properties) {
        return PropertyService.mergeProperties(
            this._getCalculatedType(), target, properties);
    };

    VizFrame.prototype._wrapApi = function(name, afterCallback) {
        this[name] = function() {
            var ret = VizFrame.prototype[name].apply(this, arguments);
            afterCallback();
            return ret;
        }.bind(this);
    };

    VizFrame.prototype._pendingDataRequest = function(bPending) {
		this.__pendingDataRequest = !!bPending;
	};
    VizFrame.prototype._updateDescription = function (desc) {
        if (this._descriptionLayer$) {      
		    if (desc) {
		        this._descriptionLayer$.show();
		        this._descriptionLayer$.text(desc);
		        this._updateDescriptionPosition();
		    } else {
		        this._descriptionLayer$.hide();
		        this._descriptionLayer$.text("");
		    }
        }
    };
    
    VizFrame.prototype._updateDescriptionPosition = function () {
        var appSize = {
            'width' : this.$().width(),
            'height' : this.$().height()
        };
        if (this._descriptionLayer$) {
            this._descriptionLayer$.css({
                'width' : appSize.width + "px",
                'height' : appSize.height / 2 + 50 + "px",
                'top' : appSize.height / 2 - 50 + "px",
            });
        }
    }

    return VizFrame;
});
