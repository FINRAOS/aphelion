"use strict";

System.register(["lodash", "app/plugins/sdk", "app/core/utils/kbn", "jquery", "jquery.flot", "./jquery-ui-dist/jquery-ui", "./jquery-ui-dist/jquery-ui.css!", "./jquery-ui-dist/jquery-ui.theme.css!", "./BasePanelTabCtrl", "./drilldown", "./drilldown.css!", "angular"], function (_export, _context) {
    "use strict";

    var _, PanelCtrl, kbn, $, queryTabDirective, finraDrilldownDirective, angular, _createClass, BasePanelCtrl;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    return {
        setters: [function (_lodash) {
            _ = _lodash.default;
        }, function (_appPluginsSdk) {
            PanelCtrl = _appPluginsSdk.PanelCtrl;
        }, function (_appCoreUtilsKbn) {
            kbn = _appCoreUtilsKbn.default;
        }, function (_jquery) {
            $ = _jquery.default;
        }, function (_jqueryFlot) {}, function (_jqueryUiDistJqueryUi) {}, function (_jqueryUiDistJqueryUiCss) {}, function (_jqueryUiDistJqueryUiThemeCss) {}, function (_BasePanelTabCtrl) {
            queryTabDirective = _BasePanelTabCtrl.queryTabDirective;
        }, function (_drilldown) {
            finraDrilldownDirective = _drilldown.finraDrilldownDirective;
        }, function (_drilldownCss) {}, function (_angular) {
            angular = _angular.default;
        }],
        execute: function () {
            _createClass = function () {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;
                        if ("value" in descriptor) descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }

                return function (Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);
                    if (staticProps) defineProperties(Constructor, staticProps);
                    return Constructor;
                };
            }();

            _export("BasePanelCtrl", BasePanelCtrl = function (_PanelCtrl) {
                _inherits(BasePanelCtrl, _PanelCtrl);

                function BasePanelCtrl($scope, $injector) {
                    _classCallCheck(this, BasePanelCtrl);

                    var _this = _possibleConstructorReturn(this, (BasePanelCtrl.__proto__ || Object.getPrototypeOf(BasePanelCtrl)).call(this, $scope, $injector));

                    //This is to avoid extending controllers from re-adding drilldown,
                    //which will through errors because it has isolated scoop. This
                    //should definitely be revisited
                    if (!$injector.has('finraDrilldownDirective')) {
                        angular.module('grafana.directives').directive('finraDrilldown', finraDrilldownDirective);
                    }
                    _this.editorTabIndex = 1;
                    _this.$q = $injector.get('$q');
                    _this.datasourceSrv = $injector.get('datasourceSrv');
                    _this.timeSrv = $injector.get('timeSrv');
                    _this.templateSrv = $injector.get('templateSrv');
                    _this.scope = $scope;

                    if (!_this.panel.targets) {
                        _this.panel.targets = [{}];
                    }
                    if (!_this.panel.dd) {
                        _this.panel.dd = {};
                        _this.panel.dd.hasRawData = false;
                    }

                    _this.events.on('refresh', _this._onMetricsPanelRefresh.bind(_this));
                    _this.events.on('init-edit-mode', _this._onInitMetricsPanelEditMode.bind(_this));
                    return _this;
                }

                _createClass(BasePanelCtrl, [{
                    key: "_onInitMetricsPanelEditMode",
                    value: function _onInitMetricsPanelEditMode() {
                        this.addEditorTab('Query', queryTabDirective);
                    }
                }, {
                    key: "_setDataSouce",
                    value: function _setDataSouce(datasource) {
                        this.datasource = datasource;
                    }
                }, {
                    key: "_onMetricsPanelRefresh",
                    value: function _onMetricsPanelRefresh() {
                        var _this2 = this;

                        // ignore fetching data if another panel is in fullscreen
                        if (this.otherPanelInFullscreenMode()) {
                            return;
                        }

                        //Adding this to force a resize on the templates.
                        //without this, you would end up with the barchart graph staying
                        //the same while the panel shrunk after - editting, doing a query, then exiting fullscreen
                        this.data = [];
                        this.render();
                        // if we have snapshot data use that
                        if (this.panel.snapshotData) {
                            this.updateTimeRange();
                            var data = this.panel.snapshotData;
                            // backward compatability
                            if (!_.isArray(data)) {
                                data = data.data;
                            }

                            this.events.emit('data-snapshot-load', data);
                            return;
                        }

                        // // ignore if we have data stream
                        if (this.dataStream) {
                            return;
                        }

                        // clear loading/error state
                        delete this.error;
                        this.loading = true;

                        // load datasource service
                        this.datasourceSrv.get(this.panel.datasource).then(this.updateTimeRange.bind(this)).then(this.issueQueries.bind(this)).then(this.handleQueryResult.bind(this)).then(this._setDataSouce(this.panel.datasource)).catch(function (err) {
                            // if cancelled  keep loading set to true
                            if (err.cancelled) {
                                console.log('Panel request cancelled', err);
                                return;
                            }

                            _this2.loading = false;
                            _this2.error = err.message || "Request Error";
                            _this2.inspector = { error: err };

                            if (err.data) {
                                if (err.data.message) {
                                    _this2.error = err.data.message;
                                }
                                if (err.data.error) {
                                    _this2.error = err.data.error;
                                }
                            }

                            _this2.events.emit('data-error', err);
                            console.log('Panel data error:', err);
                        });
                    }
                }, {
                    key: "updateTimeRange",
                    value: function updateTimeRange(datasource) {
                        this.datasource = datasource || this.datasource;
                        this.range = this.timeSrv.timeRange();
                        this.rangeRaw = this.range.raw;

                        this.applyPanelTimeOverrides();

                        if (this.panel.maxDataPoints) {
                            this.resolution = this.panel.maxDataPoints;
                        } else {
                            this.resolution = Math.ceil($(window).width() * (this.panel.span / 12));
                        }

                        this.calculateInterval();

                        return this.datasource;
                    }
                }, {
                    key: "calculateInterval",
                    value: function calculateInterval() {
                        var intervalOverride = this.panel.interval;

                        // if no panel interval check datasource
                        if (intervalOverride) {
                            intervalOverride = this.templateSrv.replace(intervalOverride, this.panel.scopedVars);
                        } else if (this.datasource && this.datasource.interval) {
                            intervalOverride = this.datasource.interval;
                        }

                        var res = kbn.calculateInterval(this.range, this.resolution, intervalOverride);
                        this.interval = res.interval;
                        this.intervalMs = res.intervalMs;
                    }
                }, {
                    key: "applyPanelTimeOverrides",
                    value: function applyPanelTimeOverrides() {
                        this.timeInfo = '';

                        // check panel time overrrides
                        if (this.panel.timeFrom) {
                            var timeFromInterpolated = this.templateSrv.replace(this.panel.timeFrom, this.panel.scopedVars);
                            var timeFromInfo = rangeUtil.describeTextRange(timeFromInterpolated);
                            if (timeFromInfo.invalid) {
                                this.timeInfo = 'invalid time override';
                                return;
                            }

                            if (_.isString(this.rangeRaw.from)) {
                                var timeFromDate = dateMath.parse(timeFromInfo.from);
                                this.timeInfo = timeFromInfo.display;
                                this.rangeRaw.from = timeFromInfo.from;
                                this.rangeRaw.to = timeFromInfo.to;
                                this.range.from = timeFromDate;
                                this.range.to = dateMath.parse(timeFromInfo.to);
                            }
                        }

                        if (this.panel.timeShift) {
                            var timeShiftInterpolated = this.templateSrv.replace(this.panel.timeShift, this.panel.scopedVars);
                            var timeShiftInfo = rangeUtil.describeTextRange(timeShiftInterpolated);
                            if (timeShiftInfo.invalid) {
                                this.timeInfo = 'invalid timeshift';
                                return;
                            }

                            var timeShift = '-' + timeShiftInterpolated;
                            this.timeInfo += ' timeshift ' + timeShift;
                            this.range.from = dateMath.parseDateMath(timeShift, this.range.from, false);
                            this.range.to = dateMath.parseDateMath(timeShift, this.range.to, true);

                            this.rangeRaw = this.range;
                        }

                        if (this.panel.hideTimeOverride) {
                            this.timeInfo = '';
                        }
                    }
                }, {
                    key: "getDecimalsForValue",
                    value: function getDecimalsForValue(value) {
                        if (_.isNumber(this.panel.decimals)) {
                            return { decimals: this.panel.decimals, scaledDecimals: null };
                        }

                        var delta = value / 2;
                        var dec = -Math.floor(Math.log(delta) / Math.LN10);

                        var magn = Math.pow(10, -dec);
                        var norm = delta / magn; // norm is between 1.0 and 10.0
                        var size;

                        if (norm < 1.5) {
                            size = 1;
                        } else if (norm < 3) {
                            size = 2;
                            // special case for 2.5, requires an extra decimal
                            if (norm > 2.25) {
                                size = 2.5;
                                ++dec;
                            }
                        } else if (norm < 7.5) {
                            size = 5;
                        } else {
                            size = 10;
                        }

                        size *= magn;

                        // reduce starting decimals if not needed
                        if (Math.floor(value) === value) {
                            dec = 0;
                        }

                        var result = {};
                        result.decimals = Math.max(0, dec);
                        result.scaledDecimals = result.decimals - Math.floor(Math.log(size) / Math.LN10) + 2;

                        return result;
                    }
                }, {
                    key: "issueQueries",
                    value: function issueQueries(datasource) {
                        this.datasource = datasource;
                        // make shallow copy of scoped vars,
                        // and add built in variables interval and interval_ms
                        var namespace = this.panel.source ? this.panel.source : "";
                        var alias = this.panel.alias ? this.panel.alias : "";
                        var scopedVars = Object.assign({}, this.panel.scopedVars, {
                            "__interval": { text: this.interval, value: this.interval },
                            "__interval_ms": { text: this.intervalMs, value: this.intervalMs }
                        });

                        this.templateSrv.variables.forEach(function (variable) {
                            if (variable.current && variable.current.value) {
                                scopedVars[variable.name] = {
                                    text: variable.current.text,
                                    value: variable.current.value
                                };
                            }
                        });

                        var query = {
                            panelId: this.panel.id,
                            range: this.range,
                            rangeRaw: this.rangeRaw,
                            interval: this.interval,
                            intervalMs: this.intervalMs,
                            namespace: { "name": namespace },
                            alias: alias,
                            targets: this.panel.targets,
                            format: this.panel.renderer === 'png' ? 'png' : 'json',
                            maxDataPoints: this.resolution,
                            scopedVars: scopedVars,
                            cacheTimeout: this.panel.cacheTimeout
                        };
                        return datasource.query(query);
                    }
                }, {
                    key: "handleQueryResult",
                    value: function handleQueryResult(result) {
                        this.loading = false;

                        if (this.dashboard.snapshot) {
                            this.panel.snapshotData = result.data;
                        }

                        if (!result || !result.data) {
                            console.log('Data source query result invalid, missing data field:', result);
                            result = { data: [] };
                        }

                        this.events.emit('data-received', result.data);
                    }
                }, {
                    key: "addQuery",
                    value: function addQuery(target) {
                        target.refId = this.dashboard.getNextQueryLetter(this.panel);
                        this.panel.targets.push(target);
                        this.nextRefId = this.dashboard.getNextQueryLetter(this.panel);
                    }
                }, {
                    key: "removeQuery",
                    value: function removeQuery(target) {
                        var index = _.indexOf(this.panel.targets, target);
                        this.panel.targets.splice(index, 1);
                        this.nextRefId = this.dashboard.getNextQueryLetter(this.panel);
                        this.refresh();
                    }
                }]);

                return BasePanelCtrl;
            }(PanelCtrl));

            _export("BasePanelCtrl", BasePanelCtrl);
        }
    };
});
//# sourceMappingURL=BasePanelCtrl.js.map
