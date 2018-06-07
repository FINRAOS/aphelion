"use strict";

System.register(["lodash", "./BasePanelCtrl", "./editor", "./column_options", "./renderer", "./transformers"], function (_export, _context) {
    "use strict";

    var _, BasePanelCtrl, tablePanelEditor, columnOptionsTab, TableRenderer, transformDataToTable, _createClass, FinraTableCtrl;

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
        }, function (_BasePanelCtrl2) {
            BasePanelCtrl = _BasePanelCtrl2.BasePanelCtrl;
        }, function (_editor) {
            tablePanelEditor = _editor.tablePanelEditor;
        }, function (_column_options) {
            columnOptionsTab = _column_options.columnOptionsTab;
        }, function (_renderer) {
            TableRenderer = _renderer.TableRenderer;
        }, function (_transformers) {
            transformDataToTable = _transformers.transformDataToTable;
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

            _export("PanelCtrl", _export("FinraTableCtrl", FinraTableCtrl = function (_BasePanelCtrl) {
                _inherits(FinraTableCtrl, _BasePanelCtrl);

                function FinraTableCtrl($scope, $injector, $rootScope, $document, $compile) {
                    _classCallCheck(this, FinraTableCtrl);

                    var _this = _possibleConstructorReturn(this, (FinraTableCtrl.__proto__ || Object.getPrototypeOf(FinraTableCtrl)).call(this, $scope, $injector));

                    _this.$rootScope = $rootScope;
                    _this.$document = $document;
                    _this.$compile = $compile;

                    var panelDefaults = {
                        targets: [{}],
                        pageSize: null,
                        pageIndex: 0,
                        showHeader: true,
                        styles: [{
                            type: 'date',
                            pattern: 'Time',
                            alias: 'Time',
                            dateFormat: 'YYYY-MM-DD HH:mm:ss'
                        }, {
                            unit: 'short',
                            type: 'number',
                            alias: '',
                            decimals: 2,
                            colors: ["rgba(245, 54, 54, 0.9)", "rgba(237, 129, 40, 0.89)", "rgba(50, 172, 45, 0.97)"],
                            colorMode: null,
                            pattern: '/.*/',
                            thresholds: []
                        }],
                        columns: [],
                        scroll: true,
                        fontSize: '100%',
                        sort: { col: null, desc: null },
                        dataspecType: 'drilldown'
                    };
                    _this.pageIndex = 0;
                    _.defaults(_this.panel, panelDefaults);
                    _.defaults(_this.panel.legend, panelDefaults.legend);
                    _.defaults(_this.panel.xaxis, panelDefaults.xaxis);
                    _.defaults(_this.panel.yaxis, panelDefaults.yaxis);

                    _this.events.on('data-received', _this.onDataReceived.bind(_this));
                    _this.events.on('data-error', _this.onDataError.bind(_this));
                    _this.events.on('data-snapshot-load', _this.onDataReceived.bind(_this));
                    _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
                    _this.dashAlerts = {};
                    _this.dashAlerts.list = [];
                    _this.organizationContact = "API admin";
                    return _this;
                }

                _createClass(FinraTableCtrl, [{
                    key: "onInitEditMode",
                    value: function onInitEditMode() {
                        this.addEditorTab('Options', tablePanelEditor, 2);
                        this.addEditorTab('Column Styles', columnOptionsTab, 3);
                    }
                }, {
                    key: "onDataError",
                    value: function onDataError() {
                        this.series = [];
                        this.render();
                    }
                }, {
                    key: "onDataReceived",
                    value: function onDataReceived(dataList) {
                        this.dataRaw = dataList;
                        this.refreshTable();
                    }
                }, {
                    key: "getPage",
                    value: function getPage(pageNumber) {
                        if (!this.panel.scopedVars) {
                            this.panel.scopedVars = [];
                        }
                        this.panel.scopedVars["page"] = {
                            text: "page",
                            value: pageNumber + 1
                        };
                        this.refreshTableData();
                    }
                }, {
                    key: "refreshTableData",
                    value: function refreshTableData() {
                        //This allows for the request to send along 
                        // page and rows per page without altering the targets 
                        // important since targets are the visible input fields
                        if (!this.panel.scopedVars) {
                            this.panel.scopedVars = [];
                        }

                        this.panel.scopedVars["rowsPerPage"] = {
                            text: "rowsPerPage",
                            value: this.panel.pageSize
                        };
                        if (!this.panel.scopedVars["page"]) {
                            this.panel.scopedVars["page"] = { text: "page" };
                        }
                        this.panel.scopedVars["page"] = {
                            value: this.panel.scopedVars["page"].value ? this.panel.scopedVars["page"].value : 1
                        };
                        this.refresh();
                    }
                }, {
                    key: "refreshTable",
                    value: function refreshTable() {
                        if (this.dataRaw && this.dataRaw.columns && this.dataRaw.rows) {
                            this.table = transformDataToTable(this.dataRaw, this.panel);
                            this.table.sort(this.panel.sort);
                            this.renderer = new TableRenderer(this.panel, this.table, this.dashboard.isTimezoneUtc(), this.$sanitize, this.templateSrv);
                        }
                        this.render(this.table);
                    }
                }, {
                    key: "toggleColumnSort",
                    value: function toggleColumnSort(col, colIndex) {
                        // remove sort flag from current column
                        if (this.table.columns[this.panel.sort.col]) {
                            this.table.columns[this.panel.sort.col].sort = false;
                            col.sort = false;
                        }

                        if (this.panel.sort.col === colIndex) {
                            if (!this.panel.sort.desc) {
                                this.panel.sort.col = colIndex;
                                this.panel.sort.desc = true;
                                col.desc = true;
                                col.sort = true;
                            } else {
                                this.panel.sort.col = null;
                                this.panel.sort.desc = null;
                                col.sort = false;
                                col.desc = false;
                            }
                        } else {
                            this.panel.sort.col = colIndex;
                            this.panel.sort.desc = false;
                            col.sort = true;
                            col.desc = false;
                        }

                        var sorting = "none";
                        if (col.sort) {
                            if (!col.desc) {
                                sorting = "ascending";
                            } else {
                                sorting = "descending";
                            }
                        }

                        if (!this.panel.scopedVars) {
                            this.panel.scopedVars = [];
                        }

                        this.panel.scopedVars["columnTitle"] = {
                            text: "columnTitle",
                            value: col.title
                        };

                        this.panel.scopedVars["sorting"] = {
                            text: "sorting",
                            value: sorting
                        };

                        this.refresh();
                    }
                }, {
                    key: "clearAlerts",
                    value: function clearAlerts() {
                        this.dashAlerts.list = [];
                    }
                }, {
                    key: "link",
                    value: function link(scope, elem, attrs, ctrl) {
                        var data;
                        var panel = ctrl.panel;
                        var pageCount = 0;

                        function getTableHeight() {
                            var panelHeight = ctrl.height;

                            if (pageCount > 1) {
                                panelHeight -= 26;
                            }

                            return panelHeight - 31 + 'px';
                        }

                        function appendTableRows(tbodyElem) {
                            ctrl.renderer.setTable(data);
                            tbodyElem.empty();
                            tbodyElem.html(ctrl.renderer.render(ctrl.pageIndex));
                        }

                        function switchPage(e) {
                            var el = $(e.currentTarget);
                            ctrl.pageIndex = parseInt(el.text(), 10) - 1;
                            renderPanel();
                        }

                        function appendPaginationControls(footerElem) {
                            footerElem.empty();
                            ctrl.clearAlerts();

                            if (!ctrl.panel.scopedVars || !ctrl.panel.scopedVars["page"]) {
                                ctrl.refreshTableData();
                            }

                            var pageSize = ctrl.panel.pageSize == undefined || ctrl.panel.pageSize < 1 ? ctrl.dataRaw.rows.length : ctrl.panel.pageSize;
                            pageCount = Math.ceil(ctrl.dataRaw.items / pageSize);

                            //check declared total item equals actual returned items
                            if (pageCount === 1 && ctrl.dataRaw.items !== ctrl.dataRaw.rows.length) {
                                var error = "Expecting a total of " + ctrl.dataRaw.items + " items but received " + ctrl.dataRaw.rows.length + " items";
                                ctrl.dashAlerts.list.push({ "text": error });
                            }

                            if (pageCount <= 1) {
                                return;
                            }

                            scope.lowerBound = ctrl.pageIndex * pageSize + 1;
                            scope.upperBound = ctrl.pageIndex + 1 === pageCount ? scope.lowerBound + pageSize - 1 : scope.lowerBound + pageSize - 1;
                            var expectedRows = (ctrl.pageIndex + 1) * pageSize;
                            var receivedRows = scope.lowerBound + ctrl.dataRaw.rows.length - 1;

                            //check rows per page are equal to actual rows returned
                            if (ctrl.panel.scopedVars.page.value !== pageCount && receivedRows !== expectedRows) {
                                var _error = "Expecting " + expectedRows + " rows per page but received " + receivedRows + " rows";
                                ctrl.dashAlerts.list.push({ "text": _error });
                            }

                            //calculate and check that last page does not contain more than required
                            if (ctrl.panel.scopedVars.page.value === pageCount && ctrl.dataRaw.items - (ctrl.panel.scopedVars.page.value - 1) * pageSize !== ctrl.dataRaw.rows.length) {
                                var _error2 = "Last page expecting " + (ctrl.dataRaw.items - (ctrl.panel.scopedVars.page.value - 1) * pageSize) + " rows but received " + ctrl.dataRaw.rows.length + " rows";
                                ctrl.dashAlerts.list.push({ "text": _error2 });
                            }

                            var startPage = Math.max(ctrl.panel.scopedVars.page.value - 3, 0);
                            var endPage = Math.min(pageCount, startPage + 9);
                            var paginationList = $('<ul></ul>');

                            var buildPaginationButton = function buildPaginationButton(logic, labelText, goToPage) {
                                if (goToPage >= endPage) {
                                    return $('<li><a ng-click="ctrl.getPage(' + (pageCount - 1) + ')" class="table-panel-page-link pointer "' + activeClass + '> ' + labelText + ' </a></li>');
                                } else {
                                    return $('<li><a ng-click="ctrl.getPage(' + goToPage + ')" class="table-panel-page-link pointer "' + activeClass + '> ' + labelText + ' </a></li>');
                                }
                            };

                            //appending the go to first + the go back 10 pages handles
                            paginationList.append(buildPaginationButton(ctrl.pageIndex === 0, '<<', 0));
                            paginationList.append(buildPaginationButton(ctrl.pageIndex === 0, '<', ctrl.panel.scopedVars.page.value - 2));

                            for (var i = startPage; i < endPage; i++) {
                                var activeClass = 'active';
                                var disabled = i === ctrl.pageIndex ? 'ng-disabled="true"' : '';
                                if (i !== ctrl.panel.scopedVars.page.value - 1) {
                                    var pageLinkElem = $('<li><a ng-click="ctrl.getPage(' + i + ')"  class="table-panel-page-link pointer ' + '">' + (i + 1) + '</a></li>');
                                } else {
                                    var pageLinkElem = $('<li><a ng-click="ctrl.getPage(' + i + ')"  class="table-panel-page-link pointer ' + activeClass + '">' + (i + 1) + '</a></li>');
                                }
                                paginationList.append(pageLinkElem);
                            }

                            //appending the skip 10 + the go to last page handles
                            paginationList.append(buildPaginationButton(ctrl.pageIndex === pageCount - 1, '>', ctrl.panel.scopedVars.page.value));
                            paginationList.append(buildPaginationButton(ctrl.pageIndex === pageCount - 1, '>>', pageCount - 1));

                            ctrl.$compile(footerElem.append(paginationList))(scope);
                        }

                        function renderPanel() {
                            var panelElem = elem.parents('.panel');
                            var rootElem = elem.find('.table-panel-scroll');
                            var tbodyElem = elem.find('tbody');
                            var footerElem = elem.find('.table-panel-footer');

                            elem.css({ 'font-size': panel.fontSize });
                            panelElem.addClass('table-panel-wrapper');

                            appendTableRows(tbodyElem);
                            appendPaginationControls(footerElem);

                            rootElem.css({ 'max-height': panel.scroll ? getTableHeight() : '' });
                        }

                        // hook up link tooltips
                        elem.tooltip({
                            selector: '[data-link-tooltip]'
                        });

                        elem.on('click', '.table-panel-page-link', switchPage);

                        var unbindDestroy = scope.$on('$destroy', function () {
                            elem.off('click', '.table-panel-page-link');
                            unbindDestroy();
                        });

                        ctrl.events.on('render', function (renderData) {
                            data = renderData || data;
                            if (data) {
                                renderPanel();
                            }
                            ctrl.renderingCompleted();
                        });
                    }
                }]);

                return FinraTableCtrl;
            }(BasePanelCtrl)));

            _export("FinraTableCtrl", FinraTableCtrl);

            FinraTableCtrl.templateUrl = 'module.html';

            _export("PanelCtrl", FinraTableCtrl);
        }
    };
});
//# sourceMappingURL=module.js.map
