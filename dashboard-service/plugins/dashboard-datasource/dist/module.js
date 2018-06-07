'use strict';

System.register(['./datasource', './query_ctrl'], function (_export, _context) {
    "use strict";

    var DefaultDatasource, DefaultDatasourceQueryCtrl, DefaultConfigCtrl, DefaultQueryOptionsCtrl;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [function (_datasource) {
            DefaultDatasource = _datasource.DefaultDatasource;
        }, function (_query_ctrl) {
            DefaultDatasourceQueryCtrl = _query_ctrl.DefaultDatasourceQueryCtrl;
        }],
        execute: function () {
            _export('ConfigCtrl', DefaultConfigCtrl = function DefaultConfigCtrl() {
                _classCallCheck(this, DefaultConfigCtrl);
            });

            DefaultConfigCtrl.templateUrl = 'partials/config.html';

            _export('QueryOptionsCtrl', DefaultQueryOptionsCtrl = function DefaultQueryOptionsCtrl() {
                _classCallCheck(this, DefaultQueryOptionsCtrl);
            });

            DefaultQueryOptionsCtrl.templateUrl = 'partials/query.options.html';

            _export('Datasource', DefaultDatasource);

            _export('QueryCtrl', DefaultDatasourceQueryCtrl);

            _export('ConfigCtrl', DefaultConfigCtrl);

            _export('QueryOptionsCtrl', DefaultQueryOptionsCtrl);
        }
    };
});
//# sourceMappingURL=module.js.map
