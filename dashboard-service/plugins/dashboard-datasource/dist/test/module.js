'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.QueryOptionsCtrl = exports.ConfigCtrl = exports.QueryCtrl = exports.Datasource = undefined;

var _datasource = require('./datasource');

var _query_ctrl = require('./query_ctrl');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DefaultConfigCtrl = function DefaultConfigCtrl() {
    _classCallCheck(this, DefaultConfigCtrl);
};

DefaultConfigCtrl.templateUrl = 'partials/config.html';

var DefaultQueryOptionsCtrl = function DefaultQueryOptionsCtrl() {
    _classCallCheck(this, DefaultQueryOptionsCtrl);
};

DefaultQueryOptionsCtrl.templateUrl = 'partials/query.options.html';

exports.Datasource = _datasource.DefaultDatasource;
exports.QueryCtrl = _query_ctrl.DefaultDatasourceQueryCtrl;
exports.ConfigCtrl = DefaultConfigCtrl;
exports.QueryOptionsCtrl = DefaultQueryOptionsCtrl;
//# sourceMappingURL=module.js.map
