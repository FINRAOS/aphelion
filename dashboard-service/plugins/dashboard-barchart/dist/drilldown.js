'use strict';

System.register([], function (_export, _context) {
    "use strict";

    var _createClass, VM, DrilldownController;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function finraDrilldownDirective($compile) {
        return {
            controller: DrilldownController,
            controllerAs: 'ddCtrl',
            scope: {
                title: "@",
                series: '@',
                seriesx: '@',
                seriesy: '@',
                label: "@",
                drilldownConfig: "=",
                datasource: "=",
                endpoint: "@"
            },
            template: ('./partials/drilldown.html', '<div id="drilldownPanelContainer" class=\'panel-container\' style=\'position: fixed; bottom: 0; padding: 10px; width: 100%; height:50%; background: #1f1d1d; color: white;\'>\n\n    <div class="page-alert-list" style="float:right; position: sticky;">\n        <div  class="alert-warning alert" ng-if="ddCtrl.dashAlerts.list.length > 0" style="background: #eb7b18;">\n            <div class="alert-icon"><i class=""></i></div>\n            <div class="alert-body">\n                <div class="alert-title">Invalid data!</div>\n                <div class="alert-text" ng-repeat="alert in ddCtrl.dashAlerts.list">\n                    <span>{{alert.text}}</span><br>\n                </div>\n                <span style="font-size: smaller;">Contact {{ddCtrl.organizationContact}}</span>\n            </div>\n            <button type="button" class="alert-close" ng-click="ddCtrl.clearAlerts();">\n                <i class="fa fa-remove"></i>\n            </button>\n        </div>\n    </div>\n\n    <div id="drilldownPanelHeader" class="tabbed-view-header">\n        <h2 class="tabbed-view-title">{{title}} ({{label}})</h2>\n        <button class="tabbed-view-close-btn dd-close" ng-click="ddCtrl.exitDrillDown();">\n            <i class="fa fa-remove"></i>\n        </button>\n        <div class="tabbed-view-close-btn gf-form">\n            <span class="gf-form-label width-10">Rows Per Page</span>\n            <div class="gf-form-select-wrapper max-width-20">\n                <select class="gf-form-input" ng-init="drilldownConfig.rowsPerPage = drilldownConfig.rowsPerPage || 10" ng-model="drilldownConfig.rowsPerPage" ng-options="v for v in [10,25,50]" ng-change="ddCtrl.getData(0)"></select>\n            </div>\n        </div>\n    </div>\n\n    <div class="loading-container" ng-if="ddCtrl.loading">\n        <span class="panel-loading">\n            <i class="fa fa-spinner fa-spin"></i>\n        </span>\n    </div>\n    \n    <div ng-if="!ddCtrl.loading">\n        <div id="drilldownTablePanelContainer" class="table-panel-container">\n            <div class="datapoints-warning" ng-show="!ddCtrl.table.rows">\n                <span class="small" >\n                    No data to show. Nothing returned by data query\n                </span>\n            </div>\n            <div id="drilldownTable" class="table-panel-scroll" ng-show="ddCtrl.table.rows.length">\n                <table class="table-panel-table">\n                    <thead style=\'position: relative;\'>\n                    <tr>\n                        <th ng-repeat="col in ddCtrl.table.columns" ng-hide="col.hidden" >\n                            <div class="table-panel-table-header-inner pointer" ng-click="ddCtrl.toggleColumnSort(col, $index)" style="position: relative;">\n                                {{col.title}}\n                                <span class="table-panel-table-header-controls" ng-show="ddCtrl.getSortingFlag(col)">\n                                        <i class="fa fa-caret-down" ng-show="col.desc"></i>\n                                        <i class="fa fa-caret-up" ng-show="!col.desc"></i>\n                                </span>\n                            </div>\n                        </th>\n                    </tr>\n                    </thead>\n                    <tbody>\n                        <tr ng-repeat="row in ddCtrl.table.rows">\n                            <td ng-repeat="col in ddCtrl.table.columns" ng-hide="col.hidden">\n                                {{row[col.title]}}\n                            </td>\n                        </tr>\n                    </tbody>\n                </table>\n            </div>\n            <div id="drilldownTableFooter" class="table-panel-footer"></div>\n            <div id="drilldownCurrentlyViewing">\n                <h4>Viewing {{lowerBound}}-{{upperBound}} of {{ddCtrl.table.items}} total items </h4>\n            </div>\n        </div>\n    </div>\n</div>\n' + ''),
            link: function link(scope, elem, attrs, ctrl) {
                var container = elem.find("#drilldownPanelContainer");
                var table = $('#drilldownTable');
                var header = $('#drilldownTableHeader');
                var panelHeader = $('#drilldownPanelHeader');
                var footer = $('#drilldownTableFooter');
                var currentlyViewing = $('#drilldownCurrentlyViewing');

                var title = attrs.title;
                var label = attrs.label;
                var series = attrs.series;
                var seriesx = attrs.seriesx;
                var seriesy = attrs.seriesy;
                var drilldownConfig = attrs.drilldownConfig;
                var datasource = attrs.datasource;
                var endpoint = attrs.endpoint;

                var updateTableHeight = function updateTableHeight() {
                    table.css({ height: container.height() - panelHeader.height() - header.height() - footer.height() - currentlyViewing.height() });
                };

                updateTableHeight();

                container.resizable({
                    handles: "n",
                    resize: function resize(event, ui) {
                        $(this).css({ left: 0, top: '' });
                        updateTableHeight();
                    },
                    classes: {
                        "ui-resizable-n": "drilldown-n"
                    },
                    maxWidth: container.width(),
                    minHeight: 250,
                    maxHeight: 1000 //straighten out this logic.
                });

                var disableIf = function disableIf(logic) {
                    return "ng-disabled=" + logic;
                };

                var buildPaginationButton = function buildPaginationButton(logic, labelText, goToPage) {
                    return $('<li><a ng-click="ddCtrl.getData(' + goToPage + ')" class="table-panel-page-link pointer"' + disableIf(logic) + '> ' + labelText + ' </a></li>');
                };

                var appendPaginationControls = function appendPaginationControls(pageCount) {

                    // Calculate number of pages
                    pageCount = Math.ceil(ctrl.table.items / scope.drilldownConfig.rowsPerPage);
                    if (pageCount === 0) pageCount = 1;

                    ctrl.table.pages = pageCount;

                    var footerElem = elem.find('.table-panel-footer');
                    footerElem.empty();
                    scope.lowerBound = ctrl.pageIndex * scope.drilldownConfig.rowsPerPage + 1;
                    scope.upperBound = ctrl.pageIndex + 1 === ctrl.table.pages ? scope.lowerBound + ctrl.table.rows.length - 1 : scope.lowerBound + scope.drilldownConfig.rowsPerPage - 1;

                    var expectedItems = (ctrl.pageIndex + 1) * scope.drilldownConfig.rowsPerPage;
                    var receivedItems = scope.lowerBound + ctrl.table.rows.length - 1;
                    if (ctrl.pageIndex + 1 !== ctrl.table.pages && receivedItems !== expectedItems) {
                        var error = "Expecting " + scope.drilldownConfig.rowsPerPage + " rows per page but received " + ctrl.table.rows.length + " rows";
                        VM.dashAlerts.list.push({ "text": error });
                    }

                    if (ctrl.pageIndex + 1 === ctrl.table.pages && ctrl.pageIndex != 0 && receivedItems != ctrl.table.items) {
                        var _error = "Last Page expecting " + (ctrl.table.items - (scope.lowerBound - 1)) + " rows but received " + ctrl.table.items + " rows";
                        VM.dashAlerts.list.push({ "text": _error });
                    }

                    if (ctrl.pageIndex + 1 === ctrl.table.pages && ctrl.pageIndex == 0 && receivedItems != ctrl.table.items) {
                        var _error2 = "Expecting " + ctrl.table.items + " total items but received " + ctrl.table.rows.length + " items";
                        VM.dashAlerts.list.push({ "text": _error2 });
                    }

                    if (pageCount === 1) {
                        return;
                    }

                    var startPage = Math.max(ctrl.pageIndex - 3, 0);
                    var endPage = Math.min(pageCount, startPage + 9);
                    var paginationList = $('<ul></ul>');

                    //appending the go to first + the go back 10 pages handles
                    paginationList.append(buildPaginationButton(ctrl.pageIndex === 0, '<<', 0));
                    paginationList.append(buildPaginationButton(ctrl.pageIndex === 0, '<', ctrl.pageIndex - 1));

                    for (var i = startPage; i < endPage; i++) {
                        var activeClass = i === ctrl.pageIndex ? 'active' : '';
                        var disabled = i === ctrl.pageIndex ? 'ng-disabled="true"' : '';
                        var pageLinkElem = $('<li><a ng-click="ddCtrl.getData(' + i + ')" class="table-panel-page-link pointer ' + activeClass + '" ' + disabled + '>' + (i + 1) + '</a></li>');
                        paginationList.append(pageLinkElem);
                    }

                    //appending the skip 10 + the go to last page handles
                    if (ctrl.pageIndex < pageCount) paginationList.append(buildPaginationButton(ctrl.pageIndex === pageCount - 1, '>', ctrl.pageIndex + 1));else paginationList.append(buildPaginationButton(ctrl.pageIndex === pageCount - 1, '>', pageCount - 1));

                    paginationList.append(buildPaginationButton(ctrl.pageIndex === pageCount - 1, '>>', pageCount - 1));

                    footerElem.append(paginationList);

                    $compile(footerElem)(scope);
                    updateTableHeight();
                };

                //Re-generate the values everytime something about the table changes (generally a user clicking a new page)
                scope.$watch("table", function () {
                    if (ctrl.table) {
                        appendPaginationControls(ctrl.table.pages);
                    }
                });

                scope.$watch("opened", function (newVal, oldVal) {
                    if (!newVal) {
                        elem.html("");
                    }
                });
            }
        };
    }

    _export('finraDrilldownDirective', finraDrilldownDirective);

    return {
        setters: [],
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

            VM = void 0;

            DrilldownController = function () {
                function DrilldownController($scope, datasourceSrv) {
                    _classCallCheck(this, DrilldownController);

                    VM = this;
                    VM.$scope = $scope;

                    $scope.opened = true;
                    this.pageIndex = 0;
                    this.datasourceSrv = datasourceSrv;
                    this.sort = {};
                    this.loading = false;
                    this.getData(0);
                    this.dashAlerts = {};
                    this.dashAlerts.list = [];
                    this.organizationContact = "API admin";
                }

                _createClass(DrilldownController, [{
                    key: 'getData',
                    value: function getData(page) {

                        if (VM.$scope.drilldownConfig.rowsPerPage === undefined) VM.$scope.drilldownConfig.rowsPerPage = 10;

                        VM.loading = true;
                        VM.targets = {};
                        VM.targets = [{
                            field: "page",
                            value: page + 1
                        }, {
                            field: "rowsPerPage",
                            value: VM.$scope.drilldownConfig.rowsPerPage
                        }, {
                            field: "selected",
                            value: VM.$scope.label
                        }];

                        if (VM.$scope.series != "null") VM.targets.push({
                            field: "series",
                            value: VM.$scope.series
                        });

                        if (VM.$scope.seriesx != undefined) VM.targets.push({
                            field: "seriesX",
                            value: VM.$scope.seriesx
                        });

                        if (VM.$scope.seriesy != undefined) VM.targets.push({
                            field: "seriesY",
                            value: VM.$scope.seriesy
                        });

                        if (VM.$scope.sorting) VM.targets.push({
                            field: "sorting",
                            value: VM.$scope.sorting
                        });

                        if (VM.$scope.columnTitle) VM.targets.push({
                            field: "columnTitle",
                            value: VM.$scope.columnTitle
                        });

                        this.datasourceSrv.get().then(function (dataservice) {
                            dataservice.getOrganization().then(function (response) {
                                if (response !== undefined && response !== null && response.address !== null) VM.organizationContact = response.address.address1;
                            }, function (error) {
                                VM.organizationContact = response.name + " API admin";
                            });
                        });
                    }
                }, {
                    key: 'getSortingFlag',
                    value: function getSortingFlag(col) {
                        return col.sort;
                    }
                }, {
                    key: 'toggleColumnSort',
                    value: function toggleColumnSort(col, colIndex) {
                        // remove sort flag from current column
                        if (VM.table.columns[VM.sort.col]) {
                            VM.table.columns[VM.sort.col].sort = false;
                            col.sort = false;
                        }

                        if (VM.sort.col === colIndex) {
                            if (VM.sort.desc) {
                                VM.sort.desc = false;
                                col.desc = false;
                                col.sort = true;
                            } else {
                                VM.sort.col = null;
                                VM.sort.desc = null;
                            }
                        } else {
                            VM.sort.col = colIndex;
                            VM.sort.desc = true;
                            col.sort = true;
                            col.desc = true;
                        }

                        VM.$scope.sorting = "none";
                        if (col.sort) {
                            if (col.desc) {
                                VM.$scope.sorting = "descending";
                            } else {
                                VM.$scope.sorting = "ascending";
                            }
                        }

                        VM.$scope.columnTitle = col.title;

                        this.getData(VM.pageIndex);
                    }
                }, {
                    key: 'exitDrillDown',
                    value: function exitDrillDown() {
                        VM.$scope.opened = false;
                    }
                }, {
                    key: 'clearAlerts',
                    value: function clearAlerts() {
                        VM.dashAlerts.list = [];
                    }
                }]);

                return DrilldownController;
            }();
        }
    };
});
//# sourceMappingURL=drilldown.js.map
