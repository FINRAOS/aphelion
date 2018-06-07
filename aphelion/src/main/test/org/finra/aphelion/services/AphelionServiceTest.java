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
import org.finra.aphelion.services.model.*;
import org.finra.aphelion.services.model.checkbox.Checkbox;
import org.finra.aphelion.services.model.map.BarChart;
import org.finra.aphelion.services.model.map.Data;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import java.io.*;
import java.util.*;

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
                "\"132256839153\",\"-\",\"IAM\",\"Server certificates\",\"170\",\"273\",\"62%\",\"\"\n" +
                "\"132256839153\",\"-\",\"IAM\",\"Users\",\"70\",\"5000\",\"1%\",\"\"")
                .getBytes();

        InputStream is = null;

            is = new ByteArrayInputStream(response);
            BufferedReader bfReader = new BufferedReader(new InputStreamReader(is));
            String temp = null;

        when(csvService.getCsv()).thenReturn(bfReader);
        when(csvService.getLatestCSVFileName()).thenReturn("test.csv");
    }

    @Test
    public void getDataPoints() throws Exception {

        List<Datapoint> datapoints = aphelionService.getDataPoints();

        Assert.assertEquals(3, datapoints.size());
        Assert.assertEquals("132256839153", datapoints.get(0).getAccountId());
    }

    @Test
    public void getCsvFile() throws Exception {
    }

    @Test
    public void getDatapointsTable() throws Exception {
        List<Map<String, Object>> list = new ArrayList<>();
        Map<String, Object> row = new HashMap<>();
        row.put("Account Name", null);
        row.put("Account ID", "132256839153");
        row.put("Region", "-");
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
    public void getDatapointsTimeSeriesSampledata() throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        ArrayNode arrayNode = mapper.createArrayNode();
        ObjectNode objectNode1 = mapper.createObjectNode();
        objectNode1.put("parameters", "test");

        System.out.println(aphelionService.getDatapointsTimeSeriesSampledata(objectNode1));
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
        Assert.assertEquals(1, results.size());
    }

    @Test
    public void getAllRegions() throws Exception {
        List<Checkbox> results = aphelionService.getAllRegions();

        String region = "-";

        Assert.assertEquals(region, results.get(0).getName());
        Assert.assertEquals(1, results.size());
    }
}