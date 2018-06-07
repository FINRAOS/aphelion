'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DefaultDatasourceQueryCtrl = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _sdk = require('app/plugins/sdk');

require('./css/query-editor.css!');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var vm = void 0;

var DefaultDatasourceQueryCtrl = exports.DefaultDatasourceQueryCtrl = function (_QueryCtrl) {
  _inherits(DefaultDatasourceQueryCtrl, _QueryCtrl);

  function DefaultDatasourceQueryCtrl($scope, $injector) {
    _classCallCheck(this, DefaultDatasourceQueryCtrl);

    var _this = _possibleConstructorReturn(this, (DefaultDatasourceQueryCtrl.__proto__ || Object.getPrototypeOf(DefaultDatasourceQueryCtrl)).call(this, $scope, $injector));

    vm = _this;
    vm.scope = $scope;
    return _this;
  }

  _createClass(DefaultDatasourceQueryCtrl, [{
    key: 'getOptions',
    value: function getOptions() {
      return vm.datasource.metadata;
    }
  }, {
    key: 'getOptions',
    value: function getOptions(url, uri) {
      return vm.datasource.metadata.parameters;
    }
  }, {
    key: 'getNamespaces',
    value: function getNamespaces() {
      return vm.datasource.getNamespaces();
    }
  }, {
    key: 'getAliases',
    value: function getAliases(namespaces, namespace) {
      return vm.datasource.getAliases(namespaces, namespace);
    }
  }, {
    key: 'updateMetadata',
    value: function updateMetadata(panel, url, uri) {
      if (url != null && uri != null) vm.datasource.updateMetadata(panel, url, uri);
    }
  }, {
    key: 'toggleEditorMode',
    value: function toggleEditorMode() {
      vm.target.rawQuery = !vm.target.rawQuery;
    }
  }, {
    key: 'onChangeInternal',
    value: function onChangeInternal() {
      this.panelCtrl.refresh();
    }
  }, {
    key: 'getParameters',
    value: function getParameters(target) {
      target.targets = vm.datasource.segments;
    }
  }, {
    key: 'addParameter',
    value: function addParameter(target, item) {
      if (target.targets == undefined) target.targets = [];

      target.targets.push(item);
    }
  }, {
    key: 'removeParameter',
    value: function removeParameter(target, parameter) {
      target.targets = target.targets.filter(function (item) {
        return item !== parameter;
      });
      this.onChangeInternal();
    }
  }]);

  return DefaultDatasourceQueryCtrl;
}(_sdk.QueryCtrl);

DefaultDatasourceQueryCtrl.templateUrl = 'partials/query.editor.html';
//# sourceMappingURL=query_ctrl.js.map
