"use strict";

System.register(["lodash", "app/core/utils/kbn", "./query-tab.css!"], function (_export, _context) {
    "use strict";

    var _, kbn, _createClass, vm, BasePanelTabCtrl;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function queryTabDirective() {
        'use strict';

        return {
            restrict: 'E',
            scope: true,
            template: ('./partials/query_tab.html', '\n<div class="query-editor-rows gf-form-group">\n    <div ng-repeat="target in ctrl.panel.targets" ng-class="{\'gf-form-disabled\': target.hide}">\n        <rebuild-on-change property="ctrl.panel.datasource || target.datasource" show-null="true">\n          <plugin-component type="query-ctrl">\n          </plugin-component>\n        </rebuild-on-change>\n    </div>\n\n    <div class="gf-form-query">\n        <div class="gf-form gf-form-query-letter-cell">\n            <label class="gf-form-label">\n            <span class="gf-form-query-letter-cell-carret">\n                <i class="fa fa-caret-down"></i>\n            </span>\n                <span class="gf-form-query-letter-cell-letter">{{ctrl.panelCtrl.nextRefId}}</span>\n            </label>\n            <button class="btn btn-secondary gf-form-btn" ng-click="ctrl.addQuery()" ng-hide="ctrl.current.meta.mixed">\n                Add Query\n            </button>\n        </div>\n    </div>\n\n    <!-- <query&#45;troubleshooter panel&#45;ctrl="ctrl.panelCtrl"></query&#45;troubleshooter> -->\n\n    <rebuild-on-change property="ctrl.panel.datasource" show-null="true">\n      <plugin-component type="query-options-ctrl">\n      </plugin-component>\n    </rebuild-on-change>\n</div>\n' + ''),
            controller: BasePanelTabCtrl
        };
    }

    _export("queryTabDirective", queryTabDirective);

    return {
        setters: [function (_lodash) {
            _ = _lodash.default;
        }, function (_appCoreUtilsKbn) {
            kbn = _appCoreUtilsKbn.default;
        }, function (_queryTabCss) {}],
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

            vm = void 0;

            _export("BasePanelTabCtrl", BasePanelTabCtrl = function () {
                function BasePanelTabCtrl($scope, datasourceSrv) {
                    _classCallCheck(this, BasePanelTabCtrl);

                    this.panelCtrl = $scope.ctrl;
                    $scope.ctrl = this;

                    this.panel = this.panelCtrl.panel;
                    this.dashboard = this.panelCtrl.dashboard;
                    this.datasourceSrv = datasourceSrv;
                    vm = this;
                    this.refreshMetadata();
                    this.panelCtrl.nextRefId = this.dashboard.getNextQueryLetter(this.panel);

                    if (this.panel.alias) {
                        this.updateMetadata(this.panel.alias);
                    }
                }

                _createClass(BasePanelTabCtrl, [{
                    key: "refreshMetadata",
                    value: function refreshMetadata() {
                        this.datasourceSrv.get().then(function (dataservice) {
                            dataservice.getSources(vm.panel.dataspecType).then(function (sources) {
                                vm.panel.sources = sources;
                            });
                        });
                    }
                }, {
                    key: "addQuery",
                    value: function addQuery() {
                        this.panelCtrl.addQuery({ isNew: true });
                    }
                }, {
                    key: "refreshPanel",
                    value: function refreshPanel() {
                        this.panelCtrl.refresh();
                    }
                }, {
                    key: "removeAllQueries",
                    value: function removeAllQueries() {
                        this.panel.targets = [{}];
                        this.panel.scopedVars = [];
                    }
                }, {
                    key: "updateMetadata",
                    value: function updateMetadata(alias) {
                        vm.datasourceSrv.get().then(function (dataservice) {
                            dataservice.updateMetadata(alias);
                        });
                    }
                }, {
                    key: "refreshParamDropdown",
                    value: function refreshParamDropdown(alias) {
                        if (alias) {
                            this.updateMetadata(alias);
                        }
                        vm.datasourceSrv.get().then(function (dataservice) {
                            var metrics = dataservice.getMetrics();
                            vm.panel.dd = {};
                            vm.panel.dd.hasRawData = metrics.rawData;
                            vm.panel.dd.rawDataAlias = metrics.rawDataAlias;
                        });

                        this.removeAllQueries();
                    }
                }, {
                    key: "getAliases",
                    value: function getAliases(namespace) {
                        if (!vm.panel.sources) {
                            this.refreshMetadata();
                        }
                        return vm.panel.sources[namespace];
                    }
                }]);

                return BasePanelTabCtrl;
            }());

            _export("BasePanelTabCtrl", BasePanelTabCtrl);
        }
    };
});
//# sourceMappingURL=BasePanelTabCtrl.js.map
