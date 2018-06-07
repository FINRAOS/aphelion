"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BasePanelTabCtrl = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.queryTabDirective = queryTabDirective;

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _kbn = require("app/core/utils/kbn");

var _kbn2 = _interopRequireDefault(_kbn);

require("./query-tab.css!");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var vm = void 0;

var BasePanelTabCtrl = exports.BasePanelTabCtrl = function () {
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
}();

function queryTabDirective() {
    'use strict';

    return {
        restrict: 'E',
        scope: true,
        templateUrl: './partials/query_tab.html',
        controller: BasePanelTabCtrl
    };
}
//# sourceMappingURL=BasePanelTabCtrl.js.map
