/*
 * Copyright (c) 2018. Aphelion Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.finra.aphelion.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import org.finra.aphelion.services.model.*;
import org.finra.aphelion.services.model.checkbox.Checkbox;
import org.finra.aphelion.services.model.map.BarChart;
import org.finra.aphelion.services.model.map.Data;
import org.finra.aphelion.services.model.timeseries.TimeSeriesPoint;
import org.finra.aphelion.services.model.timeseries.Timeseries;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.inject.Inject;

import java.io.BufferedReader;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * Limit Service used to convert csv file to graph json
 */
@Service
public class AphelionService {

    @Inject
    protected CsvService csvService;

    private static final Logger logger = LoggerFactory.getLogger(AphelionService.class);
    /*
     * Cache for storing datapoints. Alleviates excessive calls to CsvService.
     */
    private final LoadingCache<String, List<Datapoint>> datapoints = CacheBuilder.newBuilder()
            .maximumSize(1)
            .concurrencyLevel(10)
            .refreshAfterWrite(1, TimeUnit.MINUTES)
            .build(new CacheLoader<String, List<Datapoint>>() {
                @Override
                public List<Datapoint> load(String source)  {
                    return loadDataPoints(source);
                }
            });


    public List<Datapoint> getDataPoints(String source) {
        return datapoints.getUnchecked(source);
    }

    private List<Datapoint> loadDataPoints(String source) {
        logger.info("Loaded datapoints " + source);

        Pattern pattern = Pattern.compile(",");

        BufferedReader in = csvService.getCsv(source);

        if(in == null)
            throw new NullPointerException("CSV file not found. CSV file might have not been created yet. Try running limits.py again or check: /var/log/cron.log");

        List<Datapoint> datapoints = in
                .lines()
                .skip(1)
                .map(line -> {
                    String[] x = pattern.split(line);
                    try {
                        return new Datapoint(
                                null,
                                x[0].substring(1, x[0].length() - 1),
                                x[1].substring(1, x[1].length() - 1),
                                x[2].substring(1, x[2].length() - 1),
                                x[3].substring(1, x[3].length() - 1),
                                x[4].substring(1, x[4].length() - 1),
                                x[5].substring(1, x[5].length() - 1),
                                x[6].substring(1, x[6].length() - 2),
                                "false");
                    } catch (Exception e) {
                        e.printStackTrace();
                        return new Datapoint();
                    }
                })
                .collect(Collectors.toList());

        return datapoints;
    }

    protected void sortDataPoints(List<Datapoint> datapoints, QueryParameter queryParameter) {
        switch(queryParameter.getColumn()) {
            case "Account ID":
                Collections.sort(datapoints, Comparator.comparing(Datapoint::getAccountId));
                if(queryParameter.getSorting().equals("descending"))
                    Collections.reverse(datapoints);
                break;
            case "Service":
                Collections.sort(datapoints, Comparator.comparing(Datapoint::getService));
                if(queryParameter.getSorting().equals("descending"))
                    Collections.reverse(datapoints);
                break;
            case "Limit":
                Collections.sort(datapoints, Comparator.comparing(Datapoint::getLimit));
                if(queryParameter.getSorting().equals("descending"))
                    Collections.reverse(datapoints);
                break;
            case "Used":
                datapoints.sort(Comparator.comparing(Datapoint::getIntegerUsed));
                if(queryParameter.getSorting().equals("descending"))
                    Collections.reverse(datapoints);
                break;
            case "Max":
                datapoints.sort(Comparator.comparing(Datapoint::getIntegerMax));
                if(queryParameter.getSorting().equals("descending"))
                    Collections.reverse(datapoints);
                break;
            case "Usage":
                Collections.sort(datapoints, Comparator.comparingDouble(d -> Double.parseDouble(d.getUsage())));
                if(queryParameter.getSorting().equals("descending"))
                    Collections.reverse(datapoints);
                break;
            default:
                break;
        }
    }

    protected List<Datapoint> filterDataPoints(QueryParameter queryParameter) {

        List<Datapoint> datapoints = getDataPoints(queryParameter.getSource())
                .stream()
                .sorted((a, b) -> b.compareTo(a))
                .collect(Collectors.toList());


        if (!queryParameter.getAccountName().toString().equals("null") && (!queryParameter.getAccountName().equals("ALL") && !queryParameter.getAccountName().toString().equals("$__all"))) {
            datapoints = datapoints
                    .stream()
                    .filter(x -> x.getAccountId().equals(queryParameter.getAccountName()))
                    .collect(Collectors.toList());
        }


        if (!queryParameter.getRegion().toString().equals("null") && (!queryParameter.getRegion().equals("-") && !queryParameter.getRegion().equals("$__all"))) {
            datapoints = datapoints
                    .stream()
                    .filter(x -> x.getRegion().equals(queryParameter.getRegion()))
                    .collect(Collectors.toList());
        }

        return datapoints;
    }

    public Table getDatapointsTable(JsonNode parameters) {

        Integer totalNumberOfItems;
        Table table = new Table();
        List<Map<String, Object>> list = new ArrayList<>();
        List<Datapoint> datapoints;

        QueryParameter queryParameters = new QueryParameter(parameters).invoke();

        datapoints = filterDataPoints(queryParameters);

        if (!queryParameters.getSorting().equals("none") && !queryParameters.getColumn().equals("none")) {
            sortDataPoints(datapoints, queryParameters);
        }

        totalNumberOfItems = datapoints.size();

        if (queryParameters.getRowsPerPage() == 0)
            queryParameters.setRowsPerPage(totalNumberOfItems);

        if (queryParameters.getPageNumber() == 0)
            queryParameters.setPageNumber(1);

        List<String> columnHeaders = new ArrayList<>();
        columnHeaders.add("Account Name");
        columnHeaders.add("Account ID");
        columnHeaders.add("Region");
        columnHeaders.add("Service");
        columnHeaders.add("Limit");
        columnHeaders.add("Used");
        columnHeaders.add("Max");
        columnHeaders.add("Usage");

        List<Column> columns = new ArrayList<>();

        for (String columnHeader : columnHeaders) {
            columns.add(new Column(columnHeader, columnHeader));
        }

        table.setColumns(columns);

        for (Datapoint datapoint : datapoints) {
            Map<String, Object> row = new HashMap<>();
            row.put(columnHeaders.get(0), datapoint.getAccountName());
            row.put(columnHeaders.get(1), datapoint.getAccountId());
            row.put(columnHeaders.get(2), datapoint.getRegion());
            row.put(columnHeaders.get(3), datapoint.getService());
            row.put(columnHeaders.get(4), datapoint.getLimit());
            row.put(columnHeaders.get(5), datapoint.getUsed());
            row.put(columnHeaders.get(6), datapoint.getMax());
            try {
                row.put(columnHeaders.get(7), Integer.parseInt(datapoint.getUsage()));
            } catch (Exception e) {
            }
            list.add(row);
        }
        int startItem = (queryParameters.getPageNumber() == 1) ? 0 : ((queryParameters.getPageNumber() - 1) * queryParameters.getRowsPerPage());
        int endItem = (startItem + queryParameters.getRowsPerPage() > totalNumberOfItems) ? totalNumberOfItems : startItem + queryParameters.getRowsPerPage();

        table.setRows(list.subList(startItem, endItem));
        table.setItems(totalNumberOfItems);

        return table;
    }

    public Metadata getDatapointsMetadata() {

        List<String> tags = new ArrayList<>();
        tags.add("rowsPerPage");
        tags.add("items");
        tags.add("columns");
        tags.add("key");
        tags.add("sorting");
        tags.add("page");
        tags.add("accountName");
        tags.add("selected");
        List<Parameter> options = new ArrayList<>();
        for (String tag : tags) {
            options.add(new Parameter(tag));
        }

        return new Metadata().withParameters(options, "drilldown");
    }

    public List getDatapointsTimeSeriesSampledata(JsonNode parameters) {

        List<Datapoint> datapoints;
        Timeseries timeseries = new Timeseries();
        QueryParameter queryParameter = new QueryParameter(parameters).invoke();

        datapoints = filterDataPoints(queryParameter);

        if (queryParameter.getKey().equals("total")) {
            Integer total = datapoints.size();
            TimeSeriesPoint point = new TimeSeriesPoint();
            point.setTarget(queryParameter.getAccountName());
            point.setDatapoints(Arrays.asList(Arrays.asList(total, 1)));
            timeseries.setResults(Arrays.asList(point));
        } else if (queryParameter.getKey().contains("gt") && queryParameter.getKey().contains("lt")) {
            AtomicInteger lessThanValue = new AtomicInteger(0);
            AtomicInteger greaterThanValue = new AtomicInteger(0);
            String[] splitValues = queryParameter.getKey().split("&");
            for(String split : splitValues){
                try {
                    if(split.contains("lt")) {
                        lessThanValue.getAndSet(Integer.parseInt(split.split("=")[1]));
                    } else if (split.contains("gt")) {
                        greaterThanValue.getAndSet(Integer.parseInt(split.split("=")[1]));
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

            Long total = datapoints.stream()
                    .filter(x -> (Integer.parseInt(x.getUsage()) < lessThanValue.get()) &&
                            (Integer.parseInt(x.getUsage()) > greaterThanValue.get()))
                    .count();

            TimeSeriesPoint point = new TimeSeriesPoint();
            point.setTarget(queryParameter.getAccountName());
            point.setDatapoints(Arrays.asList(Arrays.asList(total, 1)));
            timeseries.setResults(Arrays.asList(point));
        } else if (queryParameter.getKey().contains("gt")) {
            AtomicInteger value = new AtomicInteger(0);
            try {
                value.getAndSet(Integer.parseInt(queryParameter.getKey().split("=")[1]));
            } catch (Exception e) {
                e.printStackTrace();
            }

            Long total = datapoints.stream()
                    .filter(x -> Integer.parseInt(x.getUsage()) > value.get())
                    .count();

            TimeSeriesPoint point = new TimeSeriesPoint();
            point.setTarget(queryParameter.getAccountName());
            point.setDatapoints(Arrays.asList(Arrays.asList(total, 1)));
            timeseries.setResults(Arrays.asList(point));
        } else if (queryParameter.getKey().contains("lt")) {
            AtomicInteger value = new AtomicInteger(0);
            try {
                value.getAndSet(Integer.parseInt(queryParameter.getKey().split("=")[1]));
            } catch (Exception e) {
                e.printStackTrace();
            }

            Long total = datapoints.stream()
                    .filter(x -> Integer.parseInt(x.getUsage()) < value.get())
                    .count();

            TimeSeriesPoint point = new TimeSeriesPoint();
            point.setTarget(queryParameter.getAccountName());
            point.setDatapoints(Arrays.asList(Arrays.asList(total, 1)));
            timeseries.setResults(Arrays.asList(point));
        } else {
            timeseries.setResults(datapoints
                    .stream()
                    .map(x -> {
                        TimeSeriesPoint point = new TimeSeriesPoint();
                        point.setTarget(x.getService() + " " + x.getLimit());
                        point.setDatapoints(Arrays.asList(Arrays.asList(Integer.parseInt(x.usage), queryParameter.getRangeTimeStamp())));
                        return point;
                    }).collect(Collectors.toList()));
        }

        timeseries.setSnapshot(true);

        return timeseries.getResults();
    }

    public Metadata getDataPointsTimeSeriesMetadata() {
        List<String> tags = new ArrayList<>();
        tags.add("rowsPerPage");
        tags.add("items");
        tags.add("columns");
        tags.add("key");
        tags.add("sorting");
        tags.add("page");
        tags.add("accountName");
        List<Parameter> options = new ArrayList<>();
        for (String tag : tags) {
            options.add(new Parameter(tag));
        }

        return new Metadata().withParameters(options, "timeseries");
    }

    public Metadata getBarchartMetadata() {
        List<String> tags = new ArrayList<>();
        tags.add("rowsPerPage");
        tags.add("items");
        tags.add("columns");
        tags.add("key");
        tags.add("sorting");
        tags.add("page");
        tags.add("accountName");
        tags.add("selected");
        List<Parameter> options = new ArrayList<>();
        for (String tag : tags) {
            options.add(new Parameter(tag));
        }

        return new Metadata(options, "map", false, null);
    }

    public BarChart getBarchart(JsonNode parameters) {
        BarChart barChart = new BarChart();
        List<Datapoint> datapoints;
        AtomicInteger index = new AtomicInteger();
        QueryParameter queryParameters = new QueryParameter(parameters).invoke();

        datapoints = filterDataPoints(queryParameters);

        barChart.setSeries(datapoints
                .stream()
                .filter(d -> !d.getUsage().equals("0"))
                .map(y -> {
                    Data point = new Data();
                    point.setName(y.getService() + ":" + y.getLimit());
                    point.setData(Arrays.asList(Arrays.asList(index.getAndIncrement(), Integer.parseInt(y.usage))));
                    return point;
                }).collect(Collectors.toList()));

        return barChart;
    }

    public Metadata getAllAccountsMetadata() {
        List<String> accounts =  getDataPoints("latest")
                .stream()
                .map(x -> x.getAccountId())
                .distinct()
                .collect(Collectors.toList());

        List<Parameter> options = new ArrayList<>();
        for (String tag : accounts) {
            options.add(new Parameter(tag));
        }

        return new Metadata().withParameters(options, "checkbox");
    }

    public List<Checkbox> getAllAccounts() {
        List<String> accounts = getDataPoints("latest")
                .stream()
                .map(x -> x.getAccountId())
                .distinct()
                .sorted()
                .collect(Collectors.toList());

        List<Checkbox> results = new ArrayList<>();
        for (String account : accounts) {
            results.add(new Checkbox(account));
        }

        return results;
    }

    public Metadata getAllRegionsMetadata() {
        List<String> regions = getDataPoints("latest")
                .stream()
                .map(x -> x.getRegion())
                .distinct()
                .collect(Collectors.toList());

        List<Parameter> options = new ArrayList<>();
        for (String tag : regions) {
            options.add(new Parameter(tag));
        }

        return new Metadata().withParameters(options, "checkbox");
    }

    public List<Checkbox> getAllRegions() {
        List<String> regions  = getDataPoints("latest")
                .stream()
                .map(x -> x.getRegion())
                .distinct()
                .collect(Collectors.toList());

        List<Checkbox> results = new ArrayList<>();
        for (String region : regions) {
            results.add(new Checkbox(region));
        }

        return results;
    }

    public Metadata getAllSourceFilesMetadata() {
        List<String> sourceFiles  = csvService.getAllCsvFileNames();

        List<Parameter> options = new ArrayList<>();
        for (String file : sourceFiles) {
            options.add(new Parameter(file));
        }

        return new Metadata().withParameters(options, "checkbox");
    }

    public List<Checkbox> getAllSourceFiles() {
        List<String> sourceFiles  = csvService.getAllCsvFileNames();

        List<Checkbox> results = new ArrayList<>();
        for (String file : sourceFiles) {
            results.add(new Checkbox(file));
        }

        return results;
    }
}