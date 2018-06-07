"use strict";

var _module = require("../module");

var _q = require("q");

var _q2 = _interopRequireDefault(_q);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('GenericDatasource', function () {
    var ctx = {};

    beforeEach(function () {
        ctx.$q = _q2.default;
        ctx.backendSrv = {};
        ctx.templateSrv = {};
        ctx.templateSrv.replace = function (data) {
            return data;
        };
        ctx.ds = new _module.Datasource({ url: 'https://testUrl' }, ctx.$q, ctx.backendSrv, ctx.templateSrv);
    });

    it('should return an empty array when no alias is set', function (done) {
        ctx.ds.query({ targets: [] }).then(function (result) {
            expect(result.data).to.have.length(0);
            done();
        });
    });

    it('should return the server results when a alias is set', function (done) {
        mockData([{
            target: 'X',
            datapoints: [1, 2, 3]
        }]);

        ctx.ds.query({ alias: "testNamespace", targets: [] }).then(function (result) {
            expect(result._request.data.alias).to.equal("testNamespace");
            var series = result.data[0];
            expect(series.target).to.equal('X');
            expect(series.datapoints).to.have.length(3);
            done();
        });
    });

    it('getSources should return a map of lists ', function (done) {

        mockData([{
            "firstNamespace": ['aliasOne', 'aliasTwo']
        }, {
            "secondNamespace": ['aliasThree']
        }]);
        ctx.ds.getSources("map").then(function (result) {
            var firstSource = result[0];
            expect(firstSource.firstNamespace[0]).to.equal('aliasOne');
            expect(firstSource.firstNamespace[1]).to.equal('aliasTwo');
            var secondSource = result[1];
            expect(secondSource.secondNamespace[0]).to.equal('aliasThree');

            done();
        });
    });

    it('query should send parameters that are mapped using field name to value ', function (done) {
        var validator = function validator(request) {
            expect(request.url).to.equal('https://testUrl/api/providers/query');
            expect(request.data.parameters.column_a).to.equal("testValue");
            expect(request.data.parameters.column_b).to.equal("anotherValue");
        };
        mockData({
            "series": [{
                "data": [[1, 249]],
                "name": "# of checks"
            }, {
                "data": [[1, 134], [2, 141]],
                "name": "# of distinct checks"
            }, {
                "data": [[1, 56]],
                "name": "# of attributes"
            }],
            "mapping": [{
                "key": 1,
                "value": "ATS"
            }, {
                "key": 2,
                "value": "BATS"
            }]
        }, validator);
        ctx.ds.query({ alias: 'testAlias', targets: [{ field: "column_a", value: "testValue" }, { field: "column_b", value: "anotherValue" }] }).then(function (result) {

            var series = result.data.series;
            expect(series).to.have.length(3);
            expect(series[0].name).to.equal('# of checks');
            expect(series[0].data[0][0]).to.equal(1);
            expect(series[0].data[0][1]).to.equal(249);

            var mapping = result.data.mapping;
            expect(mapping).to.have.length(2);
            expect(mapping[0].key).to.equal(1);
            expect(mapping[0].value).to.equal('ATS');
            expect(mapping[1].key).to.equal(2);
            expect(mapping[1].value).to.equal("BATS");

            done();
        });
    });

    it('getMetadata should perform a request using the alias ', function (done) {
        var validator = function validator(request) {
            expect(request.url).to.equal('https://testUrl/api/providers/getMetadata/?alias=test');
        };
        mockData({
            parameters: [{ "name": "Test Field", "field": "column_a" }, { "name": "Another Field", "field": "column_b" }]
        }, validator);
        ctx.ds.getMetadata("test").then(function (result) {
            var metadata = result.data;
            expect(metadata.parameters).to.have.length(2);
            expect(metadata.parameters[0].name).to.equal('Test Field');
            expect(metadata.parameters[0].field).to.equal('column_a');
            expect(metadata.parameters[1].name).to.equal('Another Field');
            expect(metadata.parameters[1].field).to.equal('column_b');

            done();
        });
    });

    it('updateMetadata should perform a request using the alias and store the data for parameters', function (done) {
        var validator = function validator(request) {
            expect(request.url).to.equal('https://testUrl/api/providers/getMetadata/?alias=anotherTestAlias');
        };
        mockData({
            parameters: [{ "name": "Test Field", "field": "column_a" }]
        }, validator);
        ctx.ds.updateMetadata(null, "anotherTestAlias");
        done();
    });

    it('metricFindQuery should map values to work with the global variable dropdown list', function (done) {
        var validator = function validator(request) {
            expect(request.url).to.equal('https://testUrl/api/providers/getMetadata/?alias=anotherTestAlias');
        };
        mockData({
            parameters: [{ "name": "Test Field", "field": "column_a", "type": "string" }, { "name": "Different Field", "field": "column_b", "type": "string" }]
        }, validator);
        ctx.ds.metricFindQuery("anotherTestAlias").then(function (result) {
            expect(result).to.have.length(2);
            expect(result[0].value).to.equal("column_a");
            expect(result[0].text).to.equal("Test Field");
            expect(result[1].value).to.equal("column_b");
            expect(result[1].text).to.equal("Different Field");
            done();
        });
    });

    it('metricFindQuery should work with empty parameters', function (done) {
        var validator = function validator(request) {
            expect(request.url).to.equal('https://testUrl/api/providers/getMetadata/?alias=anotherTestAlias');
        };
        mockData({
            parameters: []
        }, validator);
        ctx.ds.metricFindQuery("anotherTestAlias").then(function (result) {
            expect(result).to.have.length(0);
            done();
        });
    });

    function mockData(response, requestValidator) {
        ctx.backendSrv.datasourceRequest = function (request) {
            if (requestValidator) {
                requestValidator(request);
            }
            return ctx.$q.when({
                _request: request,
                data: response
            });
        };
    }
});
//# sourceMappingURL=datasource_spec.js.map
