'use strict';

System.register(['vendor/flot/jquery.flot.js', 'vendor/flot/jquery.flot.selection.js', 'vendor/flot/jquery.flot.time.js', 'vendor/flot/jquery.flot.stack.js', 'vendor/flot/jquery.flot.stackpercent.js', 'vendor/flot/jquery.flot.fillbelow.js', 'vendor/flot/jquery.flot.crosshair.js', 'vendor/flot/jquery.flot.dashes.js', './jquery.flot.axislabels', './jquery.flot.sideBySideBars', 'lodash', './BasePanelCtrl', 'app/core/utils/kbn', 'jquery', './legend'], function (_export, _context) {
  "use strict";

  var _, BasePanelCtrl, kbn, $, legend, _createClass, FinraBarChartCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  return {
    setters: [function (_vendorFlotJqueryFlotJs) {}, function (_vendorFlotJqueryFlotSelectionJs) {}, function (_vendorFlotJqueryFlotTimeJs) {}, function (_vendorFlotJqueryFlotStackJs) {}, function (_vendorFlotJqueryFlotStackpercentJs) {}, function (_vendorFlotJqueryFlotFillbelowJs) {}, function (_vendorFlotJqueryFlotCrosshairJs) {}, function (_vendorFlotJqueryFlotDashesJs) {}, function (_jqueryFlotAxislabels) {}, function (_jqueryFlotSideBySideBars) {}, function (_lodash) {
      _ = _lodash.default;
    }, function (_BasePanelCtrl2) {
      BasePanelCtrl = _BasePanelCtrl2.BasePanelCtrl;
    }, function (_appCoreUtilsKbn) {
      kbn = _appCoreUtilsKbn.default;
    }, function (_jquery) {
      $ = _jquery.default;
    }, function (_legend) {
      legend = _legend.default;
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

      _export('PanelCtrl', _export('FinraBarChartCtrl', FinraBarChartCtrl = function (_BasePanelCtrl) {
        _inherits(FinraBarChartCtrl, _BasePanelCtrl);

        function FinraBarChartCtrl($scope, $injector, $rootScope, $document, $compile) {
          _classCallCheck(this, FinraBarChartCtrl);

          var _this = _possibleConstructorReturn(this, (FinraBarChartCtrl.__proto__ || Object.getPrototypeOf(FinraBarChartCtrl)).call(this, $scope, $injector));

          _this.$rootScope = $rootScope;
          _this.$document = $document;
          _this.$compile = $compile;

          var panelDefaults = {
            legend: {
              show: true, // disable/enable legend
              values: true
            },
            tooltip: {
              showAllDetails: false
            },
            links: [],
            datasource: null,
            maxDataPoints: 3,
            interval: null,
            targets: [{}],
            cacheTimeout: null,
            nullPointMode: 'connected',
            legendTable: false,
            aliasColors: {},
            format: 'none',
            valueName: 'current',
            stack: false,
            yaxis: {
              min: null,
              max: null,
              label: null,
              show: true
            },
            xaxis: {
              min: null,
              max: null,
              show: true
            },
            decimals: 0,
            dataspecType: 'map'
          };

          $scope.$on("$destroy", function () {
            if ($("#drilldown").length !== 0) {
              $("#drilldown").remove();
            }
          });

          _.defaults(_this.panel, panelDefaults);
          _.defaults(_this.panel.legend, panelDefaults.legend);
          _.defaults(_this.panel.xaxis, panelDefaults.xaxis);
          _.defaults(_this.panel.yaxis, panelDefaults.yaxis);
          _.defaults(_this.panel.dd, panelDefaults.dd);

          _this.events.on('render', _this.onRender.bind(_this));
          _this.events.on('data-received', _this.onDataReceived.bind(_this));
          _this.events.on('data-error', _this.onDataError.bind(_this));
          _this.events.on('data-snapshot-load', _this.onDataReceived.bind(_this));
          _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
          return _this;
        }

        _createClass(FinraBarChartCtrl, [{
          key: 'onInitEditMode',
          value: function onInitEditMode() {
            this.addEditorTab('Options', 'public/plugins/finra-barchart/options.html');
            this.unitFormats = kbn.getUnitFormats();
          }
        }, {
          key: 'setUnitFormat',
          value: function setUnitFormat(subItem) {
            this.panel.format = subItem.value;
            this.render();
          }
        }, {
          key: 'onDataError',
          value: function onDataError() {
            console.info("Data Error");
            this.series = [];
            this.render();
          }
        }, {
          key: 'onRender',
          value: function onRender() {
            this.data = this.parseSeries(this.series);
          }
        }, {
          key: 'parseSeries',
          value: function parseSeries(series) {
            var _this2 = this;

            // var colors =  ['#d32f2f', '#C2185B', '#7B1FA2','#512DA8', '#303F9F', '#1976D2', '#0288D1', '#0097A7', '#00796B', '#388E3C', '#689F38', '#AFB42B', '#FBC02D', '#FFA000', '#F57C00', '#E64A19'];
            var colors =  ['#42A5F5', '#2196F3', '#1E88E5', '#1976D2', '#1565C0', '#0D47A1',
                '#0D47A1', '#1565C0', '#1976D2', '#1E88E5', '#2196F3', '#42A5F5'];
            return _.map(this.series, function (serie, i) {
              return {
                label: serie.label,
                data: serie.data,
                dataReverse: serie.dataReverse,
                // color: '#0288D1'
                color: colors[i % colors.length]
                // color: _this2.panel.aliasColors[serie.label] || _this2.$rootScope.colors[i]
              };
            });
          }
        }, {
          key: 'changeSeriesColor',
          value: function changeSeriesColor(series, color) {
            series.color = color;
            this.panel.aliasColors[series.label] = series.color;
            this.render();
          }
        }, {
          key: 'onDataReceived',
          value: function onDataReceived(dataList) {
            this.mapping = this.mappingHandler(dataList.mapping);
            this.series = this.dataHandler(dataList);
            this.data = this.parseSeries(this.series);
            this.stackable = this.stackedData(dataList);
            this.render();
          }
        }, {
          key: 'stackedData',
          value: function stackedData(data) {
            return data.mapping == null || data.mapping.length === 0 ? false : true;
          }
        }, {
          key: 'mappingHandler',
          value: function mappingHandler(mapping) {
            return _.map(mapping, function (mapping) {
              return [mapping.key, mapping.value];
            });
          }
        }, {
          key: 'dataHandler',
          value: function dataHandler(data) {
            var seriesData = [];
            _.each(data.series, function (curr, i) {
              seriesData.push({
                label: curr.name,
                data: curr.data,
                dataReverse: _.map(_.map(curr.data, _.clone), function (item) {
                  _.reverse(item);
                  return item;
                })
              });
            });

            return seriesData;
          }
        }, {
          key: 'formatValue',
          value: function formatValue(value) {
            var decimalInfo = this.getDecimalsForValue(value);
            var formatFunc = kbn.valueFormats[this.panel.format];
            if (formatFunc) {
              return formatFunc(value, decimalInfo.decimals, decimalInfo.scaledDecimals);
            }
            return value;
          }
        }, {
          key: 'tickGenerator',
          value: function tickGenerator(axis) {
            var ticks = [],
                start = axis.tickSize * Math.floor(axis.min / axis.tickSize),
                i = 0,
                v = Number.NaN,
                prev,
                datamaxBuffered = axis.direction == "y" ? Math.round(axis.datamax + axis.datamax * 0.05) : axis.datamax;

            do {
              prev = v;
              v = start + i * axis.tickSize;
              ticks.push(v);
              ++i;
            } while (v < axis.max && v != prev);

            // Snap max height to nearest viable tick mark if not manually set
            if (axis.options.customHeight < 1) {
              // Check if custom max height specified. Don't change it if so.
              for (var _i = 0; _i < ticks.length; _i++) {
                if (datamaxBuffered < ticks[_i]) {
                  axis.max = ticks[_i];
                  break;
                }
              }
            }
            return ticks;
          }
        }, {
          key: 'link',
          value: function link(scope, elem, attrs, ctrl) {
            var data, panel, mapping, stackable;
            var firstRender = 0;

            elem = elem.find('.barchart-panel');
            var $tooltip = $('<div id="tooltip">');
            ctrl.events.on('render', function () {
              render();
              ctrl.renderingCompleted();
            });

            function setElementHeight() {
              try {
                var height = ctrl.height || panel.height || ctrl.row.height;
                if (_.isString(height)) {
                  height = parseInt(height.replace('px', ''), 10);
                }

                height -= 5; // padding
                height -= panel.title ? 24 : 9; // subtract panel title bar

                elem.css('height', height + 'px');

                return true;
              } catch (e) {
                // IE throws errors sometimes
                return false;
              }
            }

            function processOffsetHook(plot, gridMargin) {
              var left = panel.yaxis;
              var right = panel.yaxis;
              if (left.show && left.label) {
                gridMargin.left = 20;
              }
              if (right.show && right.label) {
                gridMargin.right = 20;
              }
            }

            function addBarChart() {
              var width = elem.width();
              var height = elem.height();

              var size = Math.min(width, height);

              var plotCanvas = $('<div></div>');

              if (ctrl.panel.legendRight && firstRender < 2) {
                var plotCss = {
                  top: '10px',
                  margin: 'auto',
                  position: 'relative',
                  height: height - 20 + 'px',
                  width: width - 200 + 'px'
                };
                firstRender = firstRender + 1;
              } else {
                var plotCss = {
                  top: '10px',
                  margin: 'auto',
                  position: 'relative',
                  height: size - 20 + 'px'
                };
              }
              plotCanvas.css(plotCss);

              if (ctrl.panel.dd.hasRawData) {
                plotCanvas.bind("plotclick", function (event, pos, item) {
                  if ($("#drilldown").length !== 0) {
                    $("#drilldown").remove();
                  }
                  var $drilldown = $('<div id="drilldown">');
                  if (item) {
                    var newScope = scope.$new();
                    newScope.label = ctrl.panel.label;
                    newScope.title = ctrl.panel.title;
                    var seriesName = _.find(mapping, function (o) {
                      return o[0] === item.dataIndex + 1;
                    });
                    seriesName = seriesName ? seriesName[1] : null;
                    var body = ctrl.$compile("<div id='drilldownPane' finra-drilldown " + "title='" + ctrl.panel.title + "' " + "label='" + item.series.label + "' " + "series='" + seriesName + "' " + "endpoint='" + ctrl.panel.dd.rawDataAlias + "' " + "drilldown-config='ctrl.panel.dd' " + "datasource='ctrl.datasource'></div>")(scope);
                    $drilldown.html(body).appendTo(ctrl.$document[0].body);
                  }
                });
              }

              var $panelContainer = elem.parents('.panel-container');
              var backgroundColor = $panelContainer.css('background-color');

              elem.html(plotCanvas);

              var plotSeries = [];

              var barLabels = [];
              var barLabelsReverse = [];

              _.map(data, function (dataItem, i) {
                plotSeries.push({
                  label: dataItem.label,
                  data: panel.flip ? dataItem.dataReverse : dataItem.data,
                  clickable: true,
                  color: dataItem.color,
                  bars: {
                    show: true,
                    align: 'center',
                    fill: 1,
                    barWidth: 0.5,
                    zero: true,
                    lineWidth: 0,
                    horizontal: panel.flip,
                    sideBySide: {
                      order: !panel.stack ? i : null,
                      groupMargin: 0.125,
                      margin: 0.01
                    }
                  },
                  yaxis: {
                    tickColor: "#5E5E5E",
                    color: "#FFFFFF"
                  },
                  xaxis: {
                    tickColor: "#5E5E5E",
                    tickFormatter: function tickFormatter(v, axis) {
                      return $.formatNumber(v, { format: "#,###", locale: "us" });
                    },
                    color: "#FFFFFF"
                  }
                });

                barLabels.push([dataItem.data[0][0], dataItem.label]);
                barLabelsReverse.push([dataItem.dataReverse[0][0], dataItem.label]);
              });

              var options = {
                hooks: {
                  processOffset: [processOffsetHook]
                },
                legend: {
                  show: false
                },
                series: {
                  stackpercent: false,
                  stack: !panel.stack ? null : true,
                  stackable: stackable,
                  bars: { sideBySide: { groupMargin: 0 } }
                },
                xaxis: {
                  // min: panel.xaxis.min,
                  max: panel.flip ? panel.xaxis.max < 1 ? null : panel.xaxis.max : null,
                  customHeight: panel.xaxis.max >= 1 ? panel.xaxis.max : null,
                  show: panel.xaxis.show,
                  ticks: !panel.flip && panel.enableTicks ? mapping === undefined ? barLabels : mapping.length !== 0 ? mapping : barLabels : ctrl.tickGenerator,
                  tickFormatter: !panel.flip ? null : function (v, axis) {
                    return ctrl.formatValue(v);
                  }
                },
                yaxis: {
                  // min: panel.yaxis.min,
                  max: panel.flip ? null : panel.yaxis.max < 1 ? null : panel.yaxis.max,
                  customHeight: panel.yaxis.max >= 1 ? panel.yaxis.max : null,
                  show: panel.yaxis.show,
                  ticks: panel.flip && panel.enableTicks ? mapping === undefined ? barLabels : mapping.length !== 0 ? mapping : barLabels : ctrl.tickGenerator,
                  tickFormatter: !panel.flip ? function (v, axis) {
                    return ctrl.formatValue(v);
                  } : null
                },
                axisLabels: {
                  show: true
                },
                xaxes: [{
                  axisLabel: panel.xaxis.label,
                  axisLabelPadding: 20
                }],
                yaxes: [{
                  position: 'left',
                  axisLabel: panel.yaxis.label,
                  axisLabelPadding: 20
                }],

                shadowSize: 0,
                grid: {
                  minBorderMargin: 0,
                  markings: [],
                  backgroundColor: backgroundColor,
                  borderWidth: 0.25,
                  clickable: true,
                  hoverable: true,
                  color: '#c8c8c8',
                  margin: { left: 0, right: 0 }
                },
                selection: {
                  mode: "x",
                  color: '#666'
                }
              };

              $.plot(plotCanvas, plotSeries, options);
              plotCanvas.bind("plothover", function (event, pos, item) {
                if (!item) {
                  $tooltip.detach();
                  return;
                }

                var body, value;

                if (panel.flip) {
                  value = item.datapoint[0] - item.datapoint[2];
                } else {
                  value = item.datapoint[1] - item.datapoint[2];
                }

                var seriesName = _.find(mapping, function (o) {
                  return o[0] === item.dataIndex + 1;
                });
                seriesName = seriesName ? seriesName[1] : null;

                if (panel.tooltip.showAllDetails && stackable && panel.stack) {

                  body = '<div class="graph-tooltip" style="background-color: inherit">';
                  body += '<div class="graph-tooltip-list-item">';
                  body += '<div class="graph-tooltip-time">' + seriesName + '</div>';
                  body += '</div>';

                  var cumulative = 0;
                  var cumulativeCutoff = 0;
                  for (var i = data.length - 1; i >= 0; i--) {
                    var highlight = '';
                    var dataValue = data[i].data[item.dataIndex][1];
                    if (data[i].label === item.series.label) {
                      highlight = 'graph-tooltip-list-item--highlight';
                      cumulativeCutoff = i;
                    }
                    if (i <= cumulativeCutoff) cumulative += dataValue;

                    body += '<div class="graph-tooltip-list-item ' + highlight + '">';
                    body += data[i].label + ': ' + dataValue;
                    body += '</div>';
                  }

                  body += '<div class="graph-tooltip-list-item">';
                  body += 'Cumulative Total: ' + cumulative;
                  body += '</div>';

                  body += '</div>';
                } else {

                  body = '<div class="graph-tooltip" style="background-color: inherit">';
                  if (seriesName != null) {
                    body += '<div class="graph-tooltip-list-item">';
                    body += '<div class="graph-tooltip-time">';
                    body += seriesName;
                    body += '</div>';
                    body += '</div>';
                  }
                  body += '<div class="graph-tooltip-list-item--highlight">';
                  body += item.series.label + ': ' + value;
                  body += '</div>';
                  body += '</div>';
                }

                $tooltip.html(body).place_tt(pos.pageX + 20, pos.pageY);
              });
            }

            function render() {
              if (!ctrl.data) {
                return;
              }

              data = ctrl.data;
              panel = ctrl.panel;
              mapping = ctrl.mapping;
              stackable = ctrl.stackable;

              if (setElementHeight()) {
                addBarChart();
              }
            }
          }
        }]);

        return FinraBarChartCtrl;
      }(BasePanelCtrl)));

      _export('FinraBarChartCtrl', FinraBarChartCtrl);

      FinraBarChartCtrl.templateUrl = 'module.html';

      _export('PanelCtrl', FinraBarChartCtrl);
    }
  };
});
//# sourceMappingURL=module.js.map
