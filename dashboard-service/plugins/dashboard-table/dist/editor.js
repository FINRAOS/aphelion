'use strict';

System.register(['lodash', 'jquery', 'moment', 'angular', 'app/core/utils/kbn'], function (_export, _context) {
  "use strict";

  var _, $, moment, angular, kbn, _createClass, TablePanelEditorCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  /** @ngInject */
  function tablePanelEditor($q, uiSegmentSrv) {
    'use strict';

    return {
      restrict: 'E',
      scope: true,
      templateUrl: 'public/plugins/finra-table/editor.html',
      controller: TablePanelEditorCtrl
    };
  }

  _export('tablePanelEditor', tablePanelEditor);

  return {
    setters: [function (_lodash) {
      _ = _lodash.default;
    }, function (_jquery) {
      $ = _jquery.default;
    }, function (_moment) {
      moment = _moment.default;
    }, function (_angular) {
      angular = _angular.default;
    }, function (_appCoreUtilsKbn) {
      kbn = _appCoreUtilsKbn.default;
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

      _export('TablePanelEditorCtrl', TablePanelEditorCtrl = function () {

        /** @ngInject */
        function TablePanelEditorCtrl($scope, $q, uiSegmentSrv) {
          _classCallCheck(this, TablePanelEditorCtrl);

          $scope.editor = this;
          this.panelCtrl = $scope.ctrl;
          this.panel = this.panelCtrl.panel;
          this.fontSizes = ['80%', '90%', '100%', '110%', '120%', '130%', '150%', '160%', '180%', '200%', '220%', '250%'];
          this.$q = $q;
          this.addColumnSegment = uiSegmentSrv.newPlusButton();
          this.uiSegmentSrv = uiSegmentSrv;
        }

        _createClass(TablePanelEditorCtrl, [{
          key: 'getColumnOptions',
          value: function getColumnOptions() {
            var _this = this;

            if (!this.panelCtrl.dataRaw) {
              return this.$q.when([]);
            }
            var columns = this.panelCtrl.dataRaw.columns;
            var segments = _.map(columns, function (c) {
              return _this.uiSegmentSrv.newSegment({ value: c.text });
            });
            return this.$q.when(segments);
          }
        }, {
          key: 'addColumn',
          value: function addColumn() {
            var columns = this.panelCtrl.dataRaw.columns;
            var column = _.find(columns, { text: this.addColumnSegment.value });

            if (column) {
              this.panel.columns.push(column);
              this.render();
            }

            var plusButton = this.uiSegmentSrv.newPlusButton();
            this.addColumnSegment.html = plusButton.html;
            this.addColumnSegment.value = plusButton.value;
          }
        }, {
          key: 'transformChanged',
          value: function transformChanged() {
            this.panel.columns = [];
            this.render();
          }
        }, {
          key: 'refresh',
          value: function refresh() {
            this.panelCtrl.refreshTableData();
          }
        }, {
          key: 'render',
          value: function render() {
            this.panelCtrl.refreshTable();
          }
        }, {
          key: 'removeColumn',
          value: function removeColumn(column) {
            this.panel.columns = _.without(this.panel.columns, column);
            this.panelCtrl.refreshTable();
          }
        }]);

        return TablePanelEditorCtrl;
      }());

      _export('TablePanelEditorCtrl', TablePanelEditorCtrl);
    }
  };
});
//# sourceMappingURL=editor.js.map
