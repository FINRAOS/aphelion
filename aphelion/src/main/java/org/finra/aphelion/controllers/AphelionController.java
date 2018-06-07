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

package org.finra.aphelion.controllers;


import com.fasterxml.jackson.databind.JsonNode;
import org.finra.aphelion.services.CsvService;
import org.finra.aphelion.services.AphelionService;
import org.finra.aphelion.services.model.Datapoint;
import org.finra.aphelion.services.model.Metadata;
import org.finra.aphelion.services.model.Table;
import org.finra.aphelion.services.model.checkbox.Checkbox;
import org.finra.aphelion.services.model.map.BarChart;
import org.springframework.core.io.FileSystemResource;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import javax.servlet.http.HttpServletResponse;
import java.util.List;


/**
 * Basic controller used to handle requests using
 * a simple service.
 */
@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
class AphelionController {

    @Inject
    private AphelionService aphelionService;

    @Inject
    private CsvService csvService;

    @RequestMapping("/*")
    public void defaultResponse(HttpServletResponse response) throws Exception {
        response.sendRedirect("/");
    }

    @GetMapping("/datapoints")
    @ResponseBody
    public List<Datapoint> getDataPoints() {
        return aphelionService.getDataPoints();
    }

    @GetMapping("/datapoints/health")
    @ResponseBody
    public String getDataPointsHealth() {
        return "200";
    }

    @PostMapping("/datapoints/query")
    @ResponseBody
    public Table getDataPointsQuery(@RequestBody JsonNode parameters) {
        return aphelionService.getDatapointsTable(parameters);
    }

    @GetMapping("/datapoints/sampledata")
    @ResponseBody
    public Table getDatapointsSampleData() {
        return aphelionService.getDatapointsTable(null);
    }

    @RequestMapping(value = "/datapoints/metadata", method = RequestMethod.GET)
    @ResponseBody
    public Metadata testProviderMetadata() {
        return aphelionService.getDatapointsMetadata();
    }

    @GetMapping("/datapoints/timeseries/sampledata")
    @ResponseBody
    public List getTimeSeriesSampleData(@RequestBody JsonNode range) {
        return aphelionService.getDatapointsTimeSeriesSampledata(null);
    }

    @PostMapping("/datapoints/timeseries/query")
    @ResponseBody
    public List getTimeSeriesQuery(@RequestBody JsonNode parameters) {
        return aphelionService.getDatapointsTimeSeriesSampledata(parameters);
    }

    @GetMapping("/datapoints/timeseries/health")
    @ResponseBody
    public String getTimeSeriesHealth() {
        return "200";
    }

    @GetMapping("/datapoints/timeseries/metadata")
    @ResponseBody
    public Metadata getTimeSeriesMetadata() {
        return aphelionService.getDataPointsTimeSeriesMetadata();
    }

    @GetMapping("/datapoints/accounts/health")
    @ResponseBody
    public String getAccountsHealth() {
        return "200";
    }

    @GetMapping("/datapoints/accounts/{key}/metadata/**")
    @ResponseBody
    public Metadata getAccountsMetadata() {
        return aphelionService.getAllAccountsMetadata();
    }

    @GetMapping("/datapoints/accounts/sampledata")
    @ResponseBody
    public List<Checkbox> getAccountsSampleData() {
        return aphelionService.getAllAccounts();
    }

    @PostMapping("/datapoints/accounts/{key}/query/**")
    @ResponseBody
    public List<Checkbox> getAccountsQuery() {
        return aphelionService.getAllAccounts();
    }

    @GetMapping("/datapoints/regions/{key}/metadata/**")
    @ResponseBody
    public Metadata getRegionsMetadata() {
        return aphelionService.getAllRegionsMetadata();
    }

    @GetMapping("/datapoints/regions/sampledata")
    @ResponseBody
    public List<Checkbox> getRegions() {
        return aphelionService.getAllRegions();
    }

    @PostMapping("/datapoints/regions/{key}/query/**")
    @ResponseBody
    public List<Checkbox> getRegionsQuery() {
        return aphelionService.getAllRegions();
    }

    @GetMapping("/datapoints/barchart/health")
    @ResponseBody
    public String getBarchartHealth() {
        return "200";
    }

    @GetMapping("/datapoints/barchart/metadata")
    @ResponseBody
    public Metadata getBarChartMetadata() {
        return aphelionService.getBarchartMetadata();
    }

    @GetMapping("/datapoints/barchart/sampledata")
    @ResponseBody
    public BarChart getBarChartSampleData() {
        return aphelionService.getBarchart(null);
    }

    @PostMapping("/datapoints/barchart/query")
    @ResponseBody
    public BarChart getBarChartQuery(@RequestBody JsonNode parameters) {
        return aphelionService.getBarchart(parameters);
    }

    @GetMapping(value = "/datapoints/csv", produces = "text/csv")
    public FileSystemResource getCsv(HttpServletResponse response){
        FileSystemResource csv = new FileSystemResource(csvService.getLatestCSVFileName());
        response.setHeader("Content-Disposition", "attachment; filename="+csv.getFilename());
        return csv;
    }
}
