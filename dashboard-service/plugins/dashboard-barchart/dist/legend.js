'use strict';

System.register(['angular', 'lodash', 'jquery', 'vendor/flot/jquery.flot.js', 'vendor/flot/jquery.flot.time.js'], function (_export, _context) {
  "use strict";

  var angular, _, $;

  return {
    setters: [function (_angular) {
      angular = _angular.default;
    }, function (_lodash) {
      _ = _lodash.default;
    }, function (_jquery) {
      $ = _jquery.default;
    }, function (_vendorFlotJqueryFlotJs) {}, function (_vendorFlotJqueryFlotTimeJs) {}],
    execute: function () {
      //import 'jquery.flot';
      //import 'jquery.flot.time';
      angular.module('grafana.directives').directive('finraBarchartLegend', function (popoverSrv, $timeout) {
        return {
          link: function link(scope, elem) {
            var $container = $('<section class="graph-legend"></section>');
            var firstRender = true;
            var ctrl = scope.ctrl;
            var panel = ctrl.panel;
            var data;
            var seriesList;
            var i;

            ctrl.events.on('render', function () {
              data = ctrl.data;
              if (data) {

                render();
              }
            });

            function getSeriesIndexForElement(el) {
              return el.parents('[data-series-index]').data('series-index');
            }

            function openColorSelector(e) {
              // if we clicked inside poup container ignore click
              if ($(e.target).parents('.popover').length) {
                return;
              }

              var el = $(e.currentTarget).find('.fa-minus');
              var index = getSeriesIndexForElement(el);
              var series = seriesList[index];
              $timeout(function () {
                popoverSrv.show({
                  element: el[0],
                  position: 'bottom center',
                  template: '<gf-color-picker></gf-color-picker>',
                  openOn: 'hover',
                  model: {
                    series: false,
                    toggleAxis: function toggleAxis() {
                      ctrl.toggleAxis(series);
                    },
                    colorSelected: function colorSelected(color) {
                      ctrl.changeSeriesColor(series, color);
                    }
                  }
                });
              });
            }

            function render() {
              if (firstRender) {
                $container.on('click', '.graph-legend-icon', openColorSelector);
                elem.append($container);
                firstRender = false;
              }

              seriesList = data;

              $container.empty();

              var tableLayout = panel.legendTable && panel.legend.values;

              $container.toggleClass('graph-legend-table', tableLayout);

              if (tableLayout) {

                var header = '<tr><th colspan="2" style="text-align:left"></th>';
                if (panel.legend.values) {
                  header += '<th class="pointer"></th>';
                }
                header += '</tr>';
                $container.append($(header));
              }

              for (i = 0; i < seriesList.length; i++) {
                var series = seriesList[i];
                // ignore empty series

                if (panel.legend.hideEmpty && series.allIsNull) {
                  continue;
                }

                var html = '<div class="graph-legend-series';
                html += '" data-series-index="' + i + '">';
                html += '<span class="graph-legend-icon no-pointer">';
                html += '<i class="fa fa-minus" style="color:' + series.color + '"></i>';
                html += '</span>';

                html += '<span class="graph-legend-alias no-pointer">';
                html += '<a class="no-pointer">' + series.label + '</a>';
                html += '</span>';

                html += '</div>';
                $container.append($(html));
              }
            }
          }
        };
      });
    }
  };
});
//# sourceMappingURL=legend.js.map
