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

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.google.common.base.CharMatcher;
import org.finra.aphelion.services.model.*;
import org.finra.aphelion.services.model.checkbox.Checkbox;
import org.finra.aphelion.services.model.map.BarChart;
import org.finra.aphelion.services.model.map.Data;
import org.finra.aphelion.services.model.timeseries.TimeSeriesPoint;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.experimental.theories.DataPoint;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import java.io.*;
import java.util.*;
import java.util.concurrent.atomic.AtomicReference;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class AphelionServiceTest {

    @InjectMocks
    AphelionService aphelionService;

    @Mock
    CsvService csvService;

    @Before
    public void setUp() throws Exception {

        byte[] response = ("\"AccountID\",\"Region\",\"Service\",\"Limit\",\"Used\",\"Max\",\"% Usage\",\"Alert\"\n" +
                "\"132256839153\",\"-\",\"IAM\",\"Groups\",\"38\",\"300\",\"12%\",\"\"\n" +
                "\"232256839153\",\"us-east-1\",\"IAM\",\"Server certificates\",\"170\",\"273\",\"62%\",\"\"\n" +
                "\"332256839153\",\"us-east-2\",\"IAM\",\"Users\",\"70\",\"5000\",\"1%\",\"\"")
                .getBytes();

        InputStream is = null;

        is = new ByteArrayInputStream(response);
        BufferedReader bfReader = new BufferedReader(new InputStreamReader(is));
        String temp = null;

        when(csvService.getCsv(any())).thenReturn(bfReader);
    }

    @Test
    public void getDataPoints() throws Exception {

        List<Datapoint> datapoints = aphelionService.getDataPoints("test");

        Assert.assertEquals(3, datapoints.size());
        Assert.assertEquals("132256839153", datapoints.get(0).getAccountId());
    }

    @Test
    public void filterDatapointsNoFilter() throws Exception {
        QueryParameter queryParameter = new QueryParameter();
        queryParameter.setSource("test");
        queryParameter.setAccountName(new AtomicReference("ALL"));

        List<Datapoint> datapoints = aphelionService.filterDataPoints(queryParameter);

        Assert.assertEquals(3, datapoints.size());
        Assert.assertEquals("232256839153", datapoints.get(0).getAccountId());
    }

    @Test
    public void filterDatapointsRegion() throws Exception {
        QueryParameter queryParameter = new QueryParameter();
        queryParameter.setSource("test");
        queryParameter.setRegion(new AtomicReference("us-east-1"));


        List<Datapoint> datapoints = aphelionService.filterDataPoints(queryParameter);

        Assert.assertEquals(1, datapoints.size());
        Assert.assertEquals("us-east-1", datapoints.get(0).getRegion());
    }

    @Test
    public void filterDatapointsAccountName() throws Exception {
        QueryParameter queryParameter = new QueryParameter();
        queryParameter.setSource("test");
        queryParameter.setAccountName(new AtomicReference("132256839153"));


        List<Datapoint> datapoints = aphelionService.filterDataPoints(queryParameter);

        Assert.assertEquals(1, datapoints.size());
        Assert.assertEquals("132256839153", datapoints.get(0).getAccountId());
        Assert.assertEquals("-", datapoints.get(0).getRegion());
    }

    @Test
    public void getCsvFile() throws Exception {
    }

    @Test
    public void getDatapointsTable() throws Exception {
        List<Map<String, Object>> list = new ArrayList<>();
        Map<String, Object> row = new HashMap<>();
        row.put("Account Name", null);
        row.put("Account ID", "232256839153");
        row.put("Region", "us-east-1");
        row.put("Limit", "Server certificates");
        row.put("Service", "IAM");
        row.put("Used", "170");
        row.put("Max", "273");
        row.put("Usage", Integer.parseInt("62"));
        list.add(row);

        Table results = aphelionService.getDatapointsTable(null);

        Assert.assertEquals(3, results.getItems());

        Assert.assertTrue( results.getColumns().contains(new Column("Account Name", "Account Name")));
        Assert.assertTrue( results.getColumns().contains(new Column("Account ID", "Account ID")));
        Assert.assertTrue( results.getColumns().contains(new Column("Usage", "Usage")));
        Assert.assertTrue( results.getColumns().contains(new Column("Used", "Used")));
        Assert.assertTrue( results.getColumns().contains(new Column("Region", "Region")));
        Assert.assertTrue( results.getColumns().contains(new Column("Service", "Service")));
        Assert.assertTrue( results.getColumns().contains(new Column("Limit", "Limit")));

        Assert.assertEquals(results.getRows().get(0), row);
    }

    @Test
    public void getDatapointsMetadata() throws Exception {
        Metadata metadata = aphelionService.getDatapointsMetadata();

        Assert.assertFalse(metadata.getRawData());
        Assert.assertNull(metadata.getRawDataAlias());
        Assert.assertTrue(metadata.getParameters().contains(new Parameter("rowsPerPage")));
        Assert.assertTrue(metadata.getParameters().contains(new Parameter("columns")));
        Assert.assertTrue(metadata.getParameters().contains(new Parameter("key")));
        Assert.assertTrue(metadata.getParameters().contains(new Parameter("sorting")));
        Assert.assertTrue(metadata.getParameters().contains(new Parameter("page")));
        Assert.assertTrue(metadata.getParameters().contains(new Parameter("accountName")));
        Assert.assertEquals("drilldown", metadata.getDataSpecType());
    }

    @Test
    public void getDatapointsTimeSeriesGetTotal() throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        ArrayNode arrayNode = mapper.createArrayNode();
        ObjectNode objectNode1 = mapper.createObjectNode();
        ObjectNode objectNode2 = mapper.createObjectNode();
        objectNode1.put("parameters", objectNode2);
        objectNode2.put("key", "total");

        List<TimeSeriesPoint> result= aphelionService.getDatapointsTimeSeriesSampledata(objectNode1);

        Assert.assertEquals(3, result.get(0).getDatapoints().get(0).get(0));
        Assert.assertEquals("ALL", result.get(0).getTarget());
    }

    @Test
    public void getDatapointsTimeSeriesGetHeathy() throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        ArrayNode arrayNode = mapper.createArrayNode();
        ObjectNode objectNode1 = mapper.createObjectNode();
        ObjectNode objectNode2 = mapper.createObjectNode();
        objectNode1.put("parameters", objectNode2);
        objectNode2.put("key", "lt=70");

        List<TimeSeriesPoint> result= aphelionService.getDatapointsTimeSeriesSampledata(objectNode1);

        Assert.assertEquals(3L, result.get(0).getDatapoints().get(0).get(0));
        Assert.assertEquals("ALL", result.get(0).getTarget());
    }

    @Test
    public void getDatapointsTimeSeriesExceeding() throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        ArrayNode arrayNode = mapper.createArrayNode();
        ObjectNode objectNode1 = mapper.createObjectNode();
        ObjectNode objectNode2 = mapper.createObjectNode();
        objectNode1.put("parameters", objectNode2);
        objectNode2.put("key", "gt=60");

        List<TimeSeriesPoint> result= aphelionService.getDatapointsTimeSeriesSampledata(objectNode1);

        Assert.assertEquals(1L, result.get(0).getDatapoints().get(0).get(0));
        Assert.assertEquals("ALL", result.get(0).getTarget());
    }

    @Test
    public void getDatapointsTimeSeriesWarning() throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        ArrayNode arrayNode = mapper.createArrayNode();
        ObjectNode objectNode1 = mapper.createObjectNode();
        ObjectNode objectNode2 = mapper.createObjectNode();
        objectNode1.put("parameters", objectNode2);
        objectNode2.put("key", "gt=10&lt=60");

        List<TimeSeriesPoint> result= aphelionService.getDatapointsTimeSeriesSampledata(objectNode1);

        Assert.assertEquals(1L, result.get(0).getDatapoints().get(0).get(0));
        Assert.assertEquals("ALL", result.get(0).getTarget());
    }

    @Test
    public void getDataPointsTimeSeriesMetadata() throws Exception {
        Metadata metadata = aphelionService.getDataPointsTimeSeriesMetadata();

        Assert.assertFalse(metadata.getRawData());
        Assert.assertNull(metadata.getRawDataAlias());
        Assert.assertTrue(metadata.getParameters().contains(new Parameter("rowsPerPage")));
        Assert.assertTrue(metadata.getParameters().contains(new Parameter("columns")));
        Assert.assertTrue(metadata.getParameters().contains(new Parameter("key")));
        Assert.assertTrue(metadata.getParameters().contains(new Parameter("sorting")));
        Assert.assertTrue(metadata.getParameters().contains(new Parameter("page")));
        Assert.assertTrue(metadata.getParameters().contains(new Parameter("accountName")));
        Assert.assertEquals("timeseries", metadata.getDataSpecType());
    }

    @Test
    public void getBarchartMetadata() throws Exception {
        Metadata metadata = aphelionService.getBarchartMetadata();

        Assert.assertFalse(metadata.getRawData());
        Assert.assertEquals(null, metadata.getRawDataAlias());
        Assert.assertTrue(metadata.getParameters().contains(new Parameter("rowsPerPage")));
        Assert.assertTrue(metadata.getParameters().contains(new Parameter("columns")));
        Assert.assertTrue(metadata.getParameters().contains(new Parameter("key")));
        Assert.assertTrue(metadata.getParameters().contains(new Parameter("sorting")));
        Assert.assertTrue(metadata.getParameters().contains(new Parameter("page")));
        Assert.assertTrue(metadata.getParameters().contains(new Parameter("accountName")));
        Assert.assertEquals("map", metadata.getDataSpecType());
    }

    @Test
    public void getBarchart() throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode parameters = mapper.createObjectNode();
        parameters.put("accountName", "__all");

        Data point = new Data();
        point.setName("IAM:Server certificates");
        point.setData(Arrays.asList(Arrays.asList(0, 62)));

        BarChart results = aphelionService.getBarchart(null);

        Assert.assertNull(results.getMapping());
        Assert.assertEquals(point, results.getSeries().get(0));
    }

    @Test
    public void getAllAccounts() throws Exception {
        List<Checkbox> results = aphelionService.getAllAccounts();

        Checkbox checkbox = new Checkbox("132256839153");

        Assert.assertEquals(checkbox, results.get(0));
        Assert.assertEquals(3, results.size());
    }

    @Test
    public void getAllRegions() throws Exception {
        List<Checkbox> results = aphelionService.getAllRegions();

        String region = "-";

        Assert.assertEquals(region, results.get(0).getName());
        Assert.assertEquals(3, results.size());
    }

    @Test
    public void getAllSourceFiles(){
        List<String> sourceFiles  = Arrays.asList("2018-07-16T18:03:08-limits.csv", "2018-07-15T18:03:08-limits.csv", "2018-07-14T18:03:08-limits.csv");
        when(csvService.getAllCsvFileNames()).thenReturn(sourceFiles);

        List<Checkbox> results = aphelionService.getAllSourceFiles();

        Assert.assertEquals(3, results.size());
        Assert.assertEquals("2018-07-16T18:03:08-limits.csv", results.get(0).getName());
        Assert.assertEquals("2018-07-14T18:03:08-limits.csv", results.get(2).getName());
    }

    @Test
    public void getAllSourceFilesMetadata(){
        List<String> sourceFiles  = Arrays.asList("2018-07-16T18:03:08-limits.csv", "2018-07-15T18:03:08-limits.csv", "2018-07-14T18:03:08-limits.csv");
        when(csvService.getAllCsvFileNames()).thenReturn(sourceFiles);

        Metadata results = aphelionService.getAllSourceFilesMetadata();

        Assert.assertEquals(3, results.getParameters().size());
        Assert.assertEquals("2018-07-16T18:03:08-limits.csv", results.getParameters().get(0).getName());
        Assert.assertEquals(false, results.getRawData());
        Assert.assertEquals("checkbox", results.getDataSpecType());
    }

    @Test
    public void getAllRegionsMetadata(){
        Metadata results = aphelionService.getAllRegionsMetadata();

        Assert.assertEquals(3, results.getParameters().size());
        Assert.assertEquals("-", results.getParameters().get(0).getName());
        Assert.assertEquals("us-east-1", results.getParameters().get(1).getName());
        Assert.assertEquals("us-east-2", results.getParameters().get(2).getName());
        Assert.assertEquals(false, results.getRawData());
        Assert.assertEquals("checkbox", results.getDataSpecType());
    }

    @Test
    public void getAllAccountsMetadata(){
        Metadata results = aphelionService.getAllAccountsMetadata();

        Assert.assertEquals(3, results.getParameters().size());
        Assert.assertEquals("132256839153", results.getParameters().get(0).getName());
        Assert.assertEquals("232256839153", results.getParameters().get(1).getName());
        Assert.assertEquals("332256839153", results.getParameters().get(2).getName());
        Assert.assertEquals(false, results.getRawData());
        Assert.assertEquals("checkbox", results.getDataSpecType());
    }

    @Test
    public void sortAccountIdAscending(){
        List<Datapoint> datapoints = Arrays.asList(new Datapoint(), new Datapoint() ,new Datapoint());
        datapoints.get(0).setAccountId("132256839153");
        datapoints.get(1).setAccountId("332256839153");
        datapoints.get(2).setAccountId("232256839153");

        QueryParameter queryParameter = new QueryParameter();
        AtomicReference<String> sorting = new AtomicReference<>("ascending");
        AtomicReference<String> column = new AtomicReference<>("Account ID");
        queryParameter.setSorting(sorting);
        queryParameter.setColumn(column);

        aphelionService.sortDataPoints(datapoints, queryParameter);

        Assert.assertEquals("132256839153", datapoints.get(0).getAccountId());
        Assert.assertEquals("232256839153", datapoints.get(1).getAccountId());
        Assert.assertEquals("332256839153", datapoints.get(2).getAccountId());
    }

    @Test
    public void sortAccountIdDescending(){
        List<Datapoint> datapoints = Arrays.asList(new Datapoint(), new Datapoint() ,new Datapoint());
        datapoints.get(0).setAccountId("132256839153");
        datapoints.get(1).setAccountId("332256839153");
        datapoints.get(2).setAccountId("232256839153");

        QueryParameter queryParameter = new QueryParameter();
        AtomicReference<String> sorting = new AtomicReference<>("descending");
        AtomicReference<String> column = new AtomicReference<>("Account ID");
        queryParameter.setSorting(sorting);
        queryParameter.setColumn(column);

        aphelionService.sortDataPoints(datapoints, queryParameter);

        Assert.assertEquals("332256839153", datapoints.get(0).getAccountId());
        Assert.assertEquals("232256839153", datapoints.get(1).getAccountId());
        Assert.assertEquals("132256839153", datapoints.get(2).getAccountId());
    }

    @Test
    public void sortLimitAscending(){
        List<Datapoint> datapoints = Arrays.asList(new Datapoint(), new Datapoint(), new Datapoint(), new Datapoint());
        datapoints.get(0).setLimit("Max On-Demand Instances");
        datapoints.get(1).setLimit("Active load balancers");
        datapoints.get(2).setLimit("VPCs");
        datapoints.get(3).setLimit("Stacks");

        QueryParameter queryParameter = new QueryParameter();
        AtomicReference<String> sorting = new AtomicReference<>("ascending");
        AtomicReference<String> column = new AtomicReference<>("Limit");
        queryParameter.setSorting(sorting);
        queryParameter.setColumn(column);

        aphelionService.sortDataPoints(datapoints, queryParameter);

        Assert.assertEquals("Active load balancers", datapoints.get(0).getLimit());
        Assert.assertEquals("Max On-Demand Instances", datapoints.get(1).getLimit());
        Assert.assertEquals("VPCs", datapoints.get(3).getLimit());
    }

    @Test
    public void sortLimitDescending(){
        List<Datapoint> datapoints = Arrays.asList(new Datapoint(), new Datapoint(), new Datapoint(), new Datapoint());
        datapoints.get(0).setLimit("Max On-Demand Instances");
        datapoints.get(1).setLimit("Active load balancers");
        datapoints.get(2).setLimit("VPCs");
        datapoints.get(3).setLimit("Stacks");

        QueryParameter queryParameter = new QueryParameter();
        AtomicReference<String> sorting = new AtomicReference<>("descending");
        AtomicReference<String> column = new AtomicReference<>("Limit");
        queryParameter.setSorting(sorting);
        queryParameter.setColumn(column);

        aphelionService.sortDataPoints(datapoints, queryParameter);

        Assert.assertEquals("Active load balancers", datapoints.get(3).getLimit());
        Assert.assertEquals("Max On-Demand Instances", datapoints.get(2).getLimit());
        Assert.assertEquals("VPCs", datapoints.get(0).getLimit());
    }

    @Test
    public void sortServiceAscending(){
        List<Datapoint> datapoints = Arrays.asList(new Datapoint(), new Datapoint(), new Datapoint(), new Datapoint());
        datapoints.get(0).setService("EC2");
        datapoints.get(1).setService("RDS");
        datapoints.get(2).setService("CloudFormation");
        datapoints.get(3).setService("IAM");

        QueryParameter queryParameter = new QueryParameter();
        AtomicReference<String> sorting = new AtomicReference<>("ascending");
        AtomicReference<String> column = new AtomicReference<>("Service");
        queryParameter.setSorting(sorting);
        queryParameter.setColumn(column);

        aphelionService.sortDataPoints(datapoints, queryParameter);

        Assert.assertEquals("CloudFormation", datapoints.get(0).getService());
        Assert.assertEquals("EC2", datapoints.get(1).getService());
        Assert.assertEquals("RDS", datapoints.get(3).getService());
    }

    @Test
    public void sortServiceDescending(){
        List<Datapoint> datapoints = Arrays.asList(new Datapoint(), new Datapoint(), new Datapoint(), new Datapoint());
        datapoints.get(0).setService("EC2");
        datapoints.get(1).setService("RDS");
        datapoints.get(2).setService("CloudFormation");
        datapoints.get(3).setService("IAM");

        QueryParameter queryParameter = new QueryParameter();
        AtomicReference<String> sorting = new AtomicReference<>("descending");
        AtomicReference<String> column = new AtomicReference<>("Service");
        queryParameter.setSorting(sorting);
        queryParameter.setColumn(column);

        aphelionService.sortDataPoints(datapoints, queryParameter);

        Assert.assertEquals("CloudFormation", datapoints.get(3).getService());
        Assert.assertEquals("EC2", datapoints.get(2).getService());
        Assert.assertEquals("RDS", datapoints.get(0).getService());
    }

    @Test
    public void sortUsedAscending(){
        List<Datapoint> datapoints = Arrays.asList(new Datapoint(), new Datapoint(), new Datapoint(), new Datapoint());
        datapoints.get(0).setUsed("2");
        datapoints.get(1).setUsed("136");
        datapoints.get(2).setUsed("126");
        datapoints.get(3).setUsed("23");

        QueryParameter queryParameter = new QueryParameter();
        AtomicReference<String> sorting = new AtomicReference<>("ascending");
        AtomicReference<String> column = new AtomicReference<>("Used");
        queryParameter.setSorting(sorting);
        queryParameter.setColumn(column);

        aphelionService.sortDataPoints(datapoints, queryParameter);

        Assert.assertEquals("2", datapoints.get(0).getUsed());
        Assert.assertEquals("23", datapoints.get(1).getUsed());
        Assert.assertEquals("136", datapoints.get(3).getUsed());
    }

    @Test
    public void sortUsedDescending(){
        List<Datapoint> datapoints = Arrays.asList(new Datapoint(), new Datapoint(), new Datapoint(), new Datapoint());
        datapoints.get(0).setUsed("2");
        datapoints.get(1).setUsed("136");
        datapoints.get(2).setUsed("126");
        datapoints.get(3).setUsed("23");

        QueryParameter queryParameter = new QueryParameter();
        AtomicReference<String> sorting = new AtomicReference<>("descending");
        AtomicReference<String> column = new AtomicReference<>("Used");
        queryParameter.setSorting(sorting);
        queryParameter.setColumn(column);

        aphelionService.sortDataPoints(datapoints, queryParameter);

        Assert.assertEquals("2", datapoints.get(3).getUsed());
        Assert.assertEquals("23", datapoints.get(2).getUsed());
        Assert.assertEquals("136", datapoints.get(0).getUsed());
    }

    @Test
    public void sortMaxAscending(){
        List<Datapoint> datapoints = Arrays.asList(new Datapoint(), new Datapoint(), new Datapoint(), new Datapoint());
        datapoints.get(0).setMax("2");
        datapoints.get(1).setMax("136");
        datapoints.get(2).setMax("126");
        datapoints.get(3).setMax("23");

        QueryParameter queryParameter = new QueryParameter();
        AtomicReference<String> sorting = new AtomicReference<>("ascending");
        AtomicReference<String> column = new AtomicReference<>("Max");
        queryParameter.setSorting(sorting);
        queryParameter.setColumn(column);

        aphelionService.sortDataPoints(datapoints, queryParameter);

        Assert.assertEquals("2", datapoints.get(0).getMax());
        Assert.assertEquals("23", datapoints.get(1).getMax());
        Assert.assertEquals("136", datapoints.get(3).getMax());
    }

    @Test
    public void sortMaxDescending(){
        List<Datapoint> datapoints = Arrays.asList(new Datapoint(), new Datapoint(), new Datapoint(), new Datapoint());
        datapoints.get(0).setMax("2");
        datapoints.get(1).setMax("136");
        datapoints.get(2).setMax("126");
        datapoints.get(3).setMax("23");

        QueryParameter queryParameter = new QueryParameter();
        AtomicReference<String> sorting = new AtomicReference<>("descending");
        AtomicReference<String> column = new AtomicReference<>("Max");
        queryParameter.setSorting(sorting);
        queryParameter.setColumn(column);

        aphelionService.sortDataPoints(datapoints, queryParameter);

        Assert.assertEquals("2", datapoints.get(3).getMax());
        Assert.assertEquals("23", datapoints.get(2).getMax());
        Assert.assertEquals("136", datapoints.get(0).getMax());
    }

    @Test
    public void sortUsageAscending(){
        List<Datapoint> datapoints = Arrays.asList(new Datapoint(), new Datapoint(), new Datapoint(), new Datapoint());
        datapoints.get(0).setUsage("2");
        datapoints.get(1).setUsage("136");
        datapoints.get(2).setUsage("126");
        datapoints.get(3).setUsage("23");

        QueryParameter queryParameter = new QueryParameter();
        AtomicReference<String> sorting = new AtomicReference<>("ascending");
        AtomicReference<String> column = new AtomicReference<>("Usage");
        queryParameter.setSorting(sorting);
        queryParameter.setColumn(column);

        aphelionService.sortDataPoints(datapoints, queryParameter);

        Assert.assertEquals("2", datapoints.get(0).getUsage());
        Assert.assertEquals("23", datapoints.get(1).getUsage());
        Assert.assertEquals("136", datapoints.get(3).getUsage());
    }

    @Test
    public void sortUsageDescending(){
        List<Datapoint> datapoints = Arrays.asList(new Datapoint(), new Datapoint(), new Datapoint(), new Datapoint());
        datapoints.get(0).setUsage("2");
        datapoints.get(1).setUsage("136");
        datapoints.get(2).setUsage("126");
        datapoints.get(3).setUsage("23");

        QueryParameter queryParameter = new QueryParameter();
        AtomicReference<String> sorting = new AtomicReference<>("descending");
        AtomicReference<String> column = new AtomicReference<>("Usage");
        queryParameter.setSorting(sorting);
        queryParameter.setColumn(column);

        aphelionService.sortDataPoints(datapoints, queryParameter);

        Assert.assertEquals("2", datapoints.get(3).getUsage());
        Assert.assertEquals("23", datapoints.get(2).getUsage());
        Assert.assertEquals("136", datapoints.get(0).getUsage());
    }

    @Test
    public void getTotal(){

        aphelionService.getDatapointsTimeSeriesSampledata(null);

    }
}