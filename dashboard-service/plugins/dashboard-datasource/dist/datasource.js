'use strict';

System.register(['lodash'], function (_export, _context) {
  "use strict";

  var _, _createClass, vm, DefaultDatasource;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_lodash) {
      _ = _lodash.default;
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

      vm = void 0;

      _export('DefaultDatasource', DefaultDatasource = function () {
        function DefaultDatasource(instanceSettings, $q, backendSrv, templateSrv, $http) {
          _classCallCheck(this, DefaultDatasource);

          this.type = instanceSettings.type;
          this.url = instanceSettings.url;
          this.name = instanceSettings.name;
          this.q = $q;
          this.backendSrv = backendSrv;
          this.templateSrv = templateSrv;
          this.headers = { 'Content-Type': 'application/json' };
          this.metadata = {};
          this.headers['Authorization'] = instanceSettings.basicAuth;
          this.withCredentials = instanceSettings.withCredentials;
          this.$http = $http;
          vm = this;
        }

        _createClass(DefaultDatasource, [{
          key: 'updateMetadata',
          value: function updateMetadata(panel, url, uri) {
            this.getMetadata(url, uri).then(function (response) {
              // vm.metadata = response.parameters;
              if (vm.metadata) {
                panel.dd = {};
                panel.dd.hasRawData = vm.metadata.rawData;
                panel.dd.rawDataAlias = vm.metadata.rawDataAlias;
              }
            });
          }
        }, {
          key: 'getMetrics',
          value: function getMetrics() {
            return vm.metadata;
          }
        }, {
          key: 'loadSources',
          value: function loadSources(panel) {
            if (!panel.sources && !panel.dataspecType) this.getSources('timeseries').then(function (result) {
              panel.sources = result;
            });
          }
        }, {
          key: 'getAliases',
          value: function getAliases(namespaces, namespace) {
            return namespaces[namespace];
          }
        }, {
          key: 'getMetadata',
          value: function getMetadata(url, uri) {
            return vm.$http({
              url: url + "/" + uri + "/metadata",
              method: 'GET'
            }).then(function (response) {
              if (response.status === 200) {
                return response.data;
              }
            }, function (error) {
              return null;
            });
          }
        }, {
          key: 'metricFindQuery',
          value: function metricFindQuery(alias) {
            return this.getMetadata(alias).then(this.mapMetrics);
          }
        }, {
          key: 'mapMetrics',
          value: function mapMetrics(result) {

            var metrics = [];

            if (result.parameters) {
              result.parameters.forEach(function (parameter) {
                metrics.push({ value: parameter.field, text: parameter.name });
              });
            }
            return metrics;
          }
        }, {
          key: 'getSources',
          value: function getSources(alias) {
            return null;
          }
        }, {
          key: 'query',
          value: function query(options) {
            if (!options.scopedVars) {
              options.scopedVars = {};
            }

            if (this.templateSrv.variables) {
              this.templateSrv.variables.forEach(function (variable) {
                if (variable.current && variable.current.value) {
                  options.scopedVars[variable.name] = {
                    text: variable.current.text,
                    value: variable.current.value
                  };
                }
              });
            }

            if (options.targets.length > 0 && !options.alias) {
              options.alias = options.targets[0].alias;
              options.namespace = options.targets[0].namespace;
            }

            var query = this.buildQueryParameters(options);

            query.targets = query.targets.filter(function (t) {
              return !t.hide;
            });
            if (!options.alias) {
              return this.q.when({ data: [] });
            }

            return this.doRequest({
              url: options.namespace + "/" + options.alias + '/query',
              data: query,
              method: 'POST'
            });
          }
        }, {
          key: 'testDatasource',
          value: function testDatasource() {
            return this.doRequest({
              url: this.url + '/api/providers/testRegistration',
              method: 'GET'
            }).then(function (response) {
              if (response.status === 200) {
                return { status: "success", message: "Data source is working", title: "Success" };
              }
            });
          }
        }, {
          key: 'getOrganization',
          value: function getOrganization() {
            return undefined;
          }
        }, {
          key: 'doRequest',
          value: function doRequest(options) {
            options.headers = this.headers;
            return this.backendSrv.datasourceRequest(options);
          }
        }, {
          key: 'buildQueryParameters',
          value: function buildQueryParameters(options) {

            options.parameters = {};

            options.parameters = _.filter(options.targets, function (target) {
              return target.field !== 'select metric';
            });

            if (options.targets.length > 0 && options.targets[0].targets !== undefined) options.parameters = _.filter(options.targets[0].targets, function (target) {
              return target.value !== undefined;
            });

            var targets = {};
            if (options.parameters.length > 0) options.parameters.forEach(function (parameter) {
              targets[parameter.field] = parameter.value;
            });

            if (options.scopedVars) {
              Object.keys(options.scopedVars).forEach(function (scopedVarKey) {
                var scopedVar = options.scopedVars[scopedVarKey];
                targets[scopedVarKey] = scopedVar.value;
              });
            }
            options.parameters = targets;

            return options;
          }
        }]);

        return DefaultDatasource;
      }());

      _export('DefaultDatasource', DefaultDatasource);
    }
  };
});
//# sourceMappingURL=datasource.js.map
