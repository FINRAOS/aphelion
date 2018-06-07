'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PanelCtrl = undefined;

var _prunk = require('prunk');

var _prunk2 = _interopRequireDefault(_prunk);

var _jsdom = require('jsdom');

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Mock Grafana modules that are not available outside of the core project
// Required for loading module.js
var PanelCtrl = exports.PanelCtrl = function PanelCtrl($scope, $injector) {
    _classCallCheck(this, PanelCtrl);

    this.panel = { source: 'testNamespace', alias: 'testAlias' };
    this.events = {
        on: function on(key, callback) {},
        emit: function emit(key, values) {}
    };
    this.dashboard = {
        getNextQueryLetter: function getNextQueryLetter(panel) {}
    };
    this.refresh = function () {};
};

_prunk2.default.mock('./query-tab.css!', 'no css');
_prunk2.default.mock('./drilldown.css!', 'no css');
_prunk2.default.mock('./jquery-ui-dist/jquery-ui.css!', 'no css');
_prunk2.default.mock('./jquery-ui-dist/jquery-ui.theme.css!', 'no css');
_prunk2.default.mock('./drilldown', {});
_prunk2.default.mock('./jquery-ui-dist/jquery-ui', {});
_prunk2.default.mock('app/plugins/sdk', {
    PanelCtrl: PanelCtrl
});

_prunk2.default.mock('angular', {
    module: function module(name) {
        return {
            directive: function directive(name, object) {}
        };
    }
});
_prunk2.default.mock('jquery', {});
_prunk2.default.mock('jquery.flot', {});
_prunk2.default.mock('./jquery.flot.axislabels', {});

_prunk2.default.mock('./legend', {});

_prunk2.default.mock('app/core/utils/kbn', {
    calculateInterval: function calculateInterval(range, resolution, override) {
        return {
            interval: 1,
            intervalMs: 2
        };
    }
});

// Setup jsdom
// Required for loading angularjs
global.document = (0, _jsdom.jsdom)('<html><head><script></script></head><body></body></html>');
global.window = global.document.parentWindow;

// Setup Chai
_chai2.default.should();
global.assert = _chai2.default.assert;
global.expect = _chai2.default.expect;
//# sourceMappingURL=test-main.js.map
