"use strict";

var _BasePanelCtrl = require("../BasePanelCtrl.js");

var _q = require("q");

var _q2 = _interopRequireDefault(_q);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Base Panel Controller Tests', function () {
    var ctx = {};

    beforeEach(function () {
        ctx.$q = _q2.default;
        ctx.scope = {};
        ctx.timeSrv = {};
        ctx.templateSrv = {};
        ctx.templateSrv.variables = [];

        ctx.datasourceSrv = {};
        ctx.dataservice = {};
        ctx.injector = {
            get: function get(key) {
                if (key === 'datasourceSrv') {
                    return ctx.datasourceSrv;
                } else if (key === 'timeSrv') {
                    return ctx.timeSrv;
                } else if (key === 'templateSrv') {
                    return ctx.templateSrv;
                } else if (key === '$q') {
                    return ctx.$q;
                }
            },
            has: function has(key) {
                return true;
            }
        };

        ctx.bsc = new _BasePanelCtrl.BasePanelCtrl(ctx.scope, ctx.injector);
    });

    it('Adding a query pushes to target for later use in query', function (done) {
        var spy = _sinon2.default.spy(ctx.bsc.panel.targets, "push");
        ctx.bsc.addQuery({ target: { field: 'a', val: 'val' } });
        expect(ctx.bsc.panel.targets[1].target.field).to.equal('a');
        expect(ctx.bsc.panel.targets[1].target.val).to.equal('val');
        done();
    });

    it('Removing a query pushes to target for later use in query', function (done) {
        var spy = _sinon2.default.spy(ctx.bsc, "refresh");
        ctx.bsc.addQuery({ target: { field: 'a', val: 'val' } });
        ctx.bsc.removeQuery({ target: { field: 'a', val: 'val' } });
        expect(ctx.bsc.panel.targets[0]).to.an('object').that.is.empty;
        _sinon2.default.assert.calledOnce(spy);
        done();
    });

    it('Issueing a query to the datasource passes the correct params', function (done) {
        var datasource = {
            query: function query(options) {
                expect(options.alias).to.equal('testAlias');
                expect(options.namespace.name).to.equal('testNamespace');
                done();
            }
        };

        ctx.bsc.issueQueries(datasource);
    });

    it('If no data is received, as in the data field is missing, the result will be treated as empty', function (done) {
        var spy = _sinon2.default.spy(ctx.bsc.events, "emit");
        ctx.bsc.handleQueryResult({});
        _sinon2.default.assert.calledWith(spy, 'data-received', []);

        _sinon2.default.assert.calledOnce(spy);
        done();
    });

    it('Issueing a query to the datasource should include the global variables', function (done) {
        var datasource = {
            query: function query(options) {
                expect(options.alias).to.equal('testAlias');
                expect(options.namespace.name).to.equal('testNamespace');
                //4 due to the built-in interval variables
                expect(Object.keys(options.scopedVars)).to.have.length(4);
                expect(options.scopedVars["Test Name"].value).to.equal("testValue");
                expect(options.scopedVars["Test Name"].text).to.equal("Test Label");
                expect(options.scopedVars["Second Name"].value).to.equal("Different Value");
                expect(options.scopedVars["Second Name"].text).to.equal("Different Label");

                //the built-ins
                expect(options.scopedVars).to.have.property("__interval");
                expect(options.scopedVars).to.have.property("__interval_ms");

                done();
            }
        };

        ctx.templateSrv.variables = [{
            name: "Test Name",
            current: {
                value: "testValue",
                text: "Test Label"
            }
        }, {
            name: "Second Name",
            current: {
                value: "Different Value",
                text: "Different Label"
            }
        }];

        ctx.bsc.issueQueries(datasource);
    });
});
//# sourceMappingURL=BasePanelCtrlSpec.js.map
