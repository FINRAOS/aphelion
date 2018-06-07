"use strict";

var _BasePanelTab = require("../BasePanelTab.js");

var _q = require("q");

var _q2 = _interopRequireDefault(_q);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Base Panel Tab Tests', function () {
    var ctx = {};

    beforeEach(function () {

        ctx.$q = _q2.default;
        ctx.scope = {
            ctrl: {
                addQuery: function addQuery(object) {},
                refresh: function refresh() {},
                dashboard: {},
                panel: {
                    sources: {
                        namespace: ['aliasOne']
                    }
                }
            }

        };
        ctx.scope.ctrl.dashboard.getNextQueryLetter = function (panel) {
            return 'A';
        };

        ctx.datasourceSrv = {};
        ctx.dataservice = {};
        ctx.datasourceSrv.get = function () {
            return ctx.$q.when({
                getSources: function getSources(dataspec) {
                    return ctx.$q.when({
                        namespace: ['aliasOne', 'aliasTwo']
                    });
                }
            });
        };
        ctx.bst = new _BasePanelTab.BasePanelTabCtrl(ctx.scope, ctx.datasourceSrv);
    });

    it('Panel Ctrl addQuery should be called when addQuery on Panel Tab is executed', function (done) {
        var spy = _sinon2.default.spy(ctx.bst.panelCtrl, "addQuery");
        ctx.bst.addQuery();
        expect(spy.calledOnce);
        done();
    });

    it('Panel Ctrl refresh should be called when refreshPanel on Panel Tab is executed', function (done) {
        var spy = _sinon2.default.spy(ctx.bst.panelCtrl, "refresh");
        ctx.bst.refreshPanel();
        expect(spy.calledOnce);
        done();
    });

    it('Metadata is refreshed when aliases are not currently available', function (done) {
        var spy = _sinon2.default.spy(ctx.bst, "refreshMetadata");
        ctx.bst.getAliases('namespace');
        expect(spy.calledOnce);
        done();
    });

    it('Alias is properly returned for a give namespace', function (done) {
        var aliases = ctx.bst.getAliases('namespace');
        expect(aliases).to.have.length(1);
        expect(aliases[0]).to.equal('aliasOne');
        done();
    });
});
//# sourceMappingURL=BasePanelTabSpecCtrl.js.map
