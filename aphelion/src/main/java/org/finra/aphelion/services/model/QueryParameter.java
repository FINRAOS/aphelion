package org.finra.aphelion.services.model;

import com.fasterxml.jackson.databind.JsonNode;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.atomic.AtomicReference;

public class QueryParameter {
    private JsonNode parameters;
    private String source;
    private String key;
    private String range;
    private Integer rowsPerPage;
    private Integer pageNumber;
    private AtomicReference accountName = new AtomicReference();
    private AtomicReference region =  new AtomicReference();
    private AtomicReference column = new AtomicReference();
    private AtomicReference sorting =  new AtomicReference();
    private AtomicReference rangeTimeStamp = new AtomicReference();

    public QueryParameter(){

    }

    public QueryParameter(JsonNode parameters) {
        this.parameters = parameters;
    }

    public JsonNode getParameters() {
        return parameters;
    }

    public void setParameters(JsonNode parameters) {
        this.parameters = parameters;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getRange() {
        return range;
    }

    public void setRange(String range) {
        this.range = range;
    }

    public Integer getRowsPerPage() {
        return rowsPerPage;
    }

    public void setRowsPerPage(Integer rowsPerPage) {
        this.rowsPerPage = rowsPerPage;
    }

    public Integer getPageNumber() {
        return pageNumber;
    }

    public void setPageNumber(Integer pageNumber) {
        this.pageNumber = pageNumber;
    }

    public String getAccountName() {
        return accountName.toString();
    }

    public void setAccountName(AtomicReference accountName) {
        this.accountName = accountName;
    }

    public String getRegion() {
        return region.toString();
    }

    public void setRegion(AtomicReference region) {
        this.region = region;
    }

    public String getColumn() {
        return column.toString();
    }

    public void setColumn(AtomicReference column) {
        this.column = column;
    }

    public String getSorting() {
        return sorting.toString();
    }

    public void setSorting(AtomicReference sorting) {
        this.sorting = sorting;
    }

    public AtomicReference getRangeTimeStamp() {
        return rangeTimeStamp;
    }

    public void setRangeTimeStamp(AtomicReference rangeTimeStamp) {
        this.rangeTimeStamp = rangeTimeStamp;
    }

    public QueryParameter invoke() {

        try {
            source = parameters.get("parameters").get("source").asText("latest");
        } catch (Exception e) {
            source = "latest";
        }

        try {
            rowsPerPage = parameters.get("parameters").get("rowsPerPage").asInt();
        } catch (Exception e) {
            rowsPerPage = 10;
        }

        try {
            pageNumber = parameters.get("parameters").get("page").asInt();
        } catch (Exception e) {
            pageNumber = 1;
        }

        try {
            accountName.set(parameters.get("parameters").get("accountName").asText("ALL"));
        } catch (Exception e) {
            accountName.set("ALL");
        }

        try {
            region.set(parameters.get("parameters").get("region").asText("-"));
        } catch (Exception e) {
            region.set("-");
        }

        try {
            column.set(parameters.get("parameters").get("columnTitle").asText("none"));
        } catch (Exception e) {
            column.set("none");
        }

        try {
            sorting.set(parameters.get("parameters").get("sorting").asText("none"));
        } catch (Exception e) {
            sorting.set("none");
        }

        try {
            range = (parameters.get("range").get("to").asText("1"));
            rangeTimeStamp.set(formatToUnixTime(range));
        }catch (Exception e) {
            range = "1";
        }

        try {
            key = parameters.get("parameters").get("key").asText("null");
        } catch (Exception e) {
            key = "null";
        }
        return this;
    }

    private Long formatToUnixTime(String date)
    {
        /*
            2016-10-18T13:16:33.733Z
        */
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        return LocalDateTime.parse(date, formatter).toInstant(ZoneOffset.UTC).toEpochMilli();
    }
}