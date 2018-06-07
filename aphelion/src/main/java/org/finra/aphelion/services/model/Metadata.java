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

package org.finra.aphelion.services.model;

import java.util.List;

public class Metadata {
    private List<Parameter> parameters;
    private String dataSpecType;
    private boolean rawData;
    private String rawDataAlias;

    public List<Parameter> getParameters(){
        return parameters;
    }

    public Metadata() {
    }

    public Metadata(List<Parameter> parameters, String dataSpecType, boolean rawData, String rawDataAlias) {
        this.parameters = parameters;
        this.dataSpecType = dataSpecType;
        this.rawData = rawData;
        this.rawDataAlias = rawDataAlias;
    }

    public void setParameters(List<Parameter> parameters){
        this.parameters = parameters;
    }

    public Metadata withParameters(List<Parameter> parameters, String dataSpecType){
        this.parameters = parameters;
        this.dataSpecType = dataSpecType;
        return this;
    }

    public String getDataSpecType() {
        return dataSpecType;
    }

    public void setDataSpecType(String dataSpecType) {
        this.dataSpecType = dataSpecType;
    }


    public String getRawDataAlias() {
        return rawDataAlias;
    }

    public void setRawDataAlias(String rawDataAlias) {
        this.rawDataAlias = rawDataAlias;
    }

    public boolean getRawData() {
        return rawData;
    }

    public void setRawData(boolean rawData) {
        this.rawData = rawData;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Metadata metadata = (Metadata) o;

        if (rawData != metadata.rawData) return false;
        if (!parameters.equals(metadata.parameters)) return false;
        if (!dataSpecType.equals(metadata.dataSpecType)) return false;
        return rawDataAlias.equals(metadata.rawDataAlias);
    }

    @Override
    public int hashCode() {
        int result = parameters.hashCode();
        result = 31 * result + dataSpecType.hashCode();
        result = 31 * result + (rawData ? 1 : 0);
        result = 31 * result + rawDataAlias.hashCode();
        return result;
    }

    @Override
    public String toString() {
        return "Metadata{" +
                "parameters=" + parameters +
                ", dataSpecType='" + dataSpecType + '\'' +
                ", rawData=" + rawData +
                ", rawDataAlias='" + rawDataAlias + '\'' +
                '}';
    }
}