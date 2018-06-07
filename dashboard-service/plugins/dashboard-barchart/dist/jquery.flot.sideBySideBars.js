/*
 * Side-by-Side Barchart plugin for Flot
 * Created by: Vince Commero
 * 
 * Adds functionality to Flot bar charts for side-by-side grouping of bars
 * as an alternative to stacking.
 * 
 * Usage: specify the "sideBySide" parameter in the "bars" option parameter for each serie
 *      bars: {
 *          <other params>,
 *          sideBySide: {
 *              order: null, // or number/string
 *               groupMargin: 0.2, // or number/string ranging from 0 to 1 inclusive (Set this the same for all series)
 *               margin: 0.01 // or number/string (set individually for each bar)
 *          }
 *      }
 */

(function($) {

    var options = {
        series: {
            stackable: null,
            bars: {
                sideBySide: {
                    order: null, 
                    groupMargin: 0.2, 
                    margin: 0.01 
                }
            }
        }
    };

    function init(plot) {

        var arrangedSeries;
        var pixelToXAxisUnitScale = 1;
        var isHorizontal;
        var totalgroupWidth;
        var groupBarsWidth;
        var groupMarginsWidth;

        function arrangeBars(plot, serie, datapoints) {
            var shiftedPoints = null;
            
            // Return if serie doesn't need to be processed for side-by-side bar charts
            if (serie.bars == null || !serie.bars.show || !serie.stackable || serie.bars.sideBySide == null || serie.bars.sideBySide.order == null) {
                return shiftedPoints;
            }

            isHorizontal = serie.bars.horizontal ? true : false;

            arrangedSeries = getAllArrangedBarSeries(plot.getData());
            groupWidth = getGroupWidth(arrangedSeries);

            // Scale bars
            var barScaleFactor = Math.min((1 - groupMarginsWidth) / groupBarsWidth, 1.0);
            plot.getData().forEach(function(s) {
                s.bars.barWidth *= barScaleFactor;
            });

            // Compute x-axis shift
            var position = getOrderPosition(serie);
            var xShift = isHorizontal ? 0.5 : -0.5;
            for (let i=0; i<=position; i++) {
                if (i === 0) {
                    xShift += serie.bars.sideBySide.groupMargin * (isHorizontal ? -1 : 1);
                } else {
                    xShift += (arrangedSeries[i-1].bars.sideBySide.margin + (arrangedSeries[i-1].bars.barWidth / 2.0) + arrangedSeries[i].bars.sideBySide.margin) * (isHorizontal ? -1 : 1);
                }
                xShift += (arrangedSeries[i].bars.barWidth / 2.0) * (isHorizontal ? -1 : 1);
            }

            // Shift datapoints
            shiftedPoints = shiftPoints(datapoints, serie, xShift);
            datapoints.points = shiftedPoints;


            
            return shiftedPoints;
        }



        function getAllArrangedBarSeries(series) {
            var returnedSeries = [];
            for (let i=0; i<series.length; i++) {
                if (series[i].bars != null &&
                    series[i].bars.sideBySide != null && 
                    series[i].bars.sideBySide.order != null && 
                    series[i].bars.show) {
                        returnedSeries.push(series[i]);
                }
            }
            return returnedSeries;
        }

        function getGroupWidth(series) {
            var barsWidth = 0,
                marginsWidth = 0;

            for (let i=0; i<series.length; i++) {
                barsWidth += series[i].bars.barWidth || 0;
                marginsWidth += (series[i].bars.sideBySide.margin || 0) * ((i === 0 || i === series.length-1) ? 1 : 2);
            }

            marginsWidth += 2 * (series[0].bars.sideBySide.groupMargin || 0);

            groupBarsWidth = barsWidth;
            groupMarginsWidth = marginsWidth;
            totalgroupWidth = barsWidth + marginsWidth;

            return totalgroupWidth;
        }

        function getOrderPosition(series) {
            for (let i=0; i<arrangedSeries.length; i++) {
                if (series === arrangedSeries[i]) return i;
            }
            return 0;
        }

        function shiftPoints(datapoints, serie, dx) {
            var ps = datapoints.pointsize,
                points = datapoints.points;
            for (let i = isHorizontal ? 1 : 0; i < points.length; i += ps) {
                points[i] += dx;
            }
            return points;
        }


        // Add arrangeBars function to processDatapoints hook array
        plot.hooks.processDatapoints.push(arrangeBars);
    }

    var plugin = {
        init: init,
        options: options,
        name: 'sideBySideBars',
        version: '0.1'
    };
    for (let i=0; i<$.plot.plugins.length; i++) {
        if ($.plot.plugins[i].name === plugin.name) $.plot.plugins.splice(i, 1);
    }
    $.plot.plugins.push(plugin);

})(jQuery);