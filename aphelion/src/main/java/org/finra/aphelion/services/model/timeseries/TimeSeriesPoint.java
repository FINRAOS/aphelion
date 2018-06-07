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

package org.finra.aphelion.services.model.timeseries;

import java.util.List;

public class TimeSeriesPoint {
    private String target;
    private List<List<Object>> datapoints;

    public TimeSeriesPoint() {
    }

    public TimeSeriesPoint(String target, List<List<Object>> datapoints) {
        setTarget(target);
        this.datapoints = datapoints;
    }

    public String getTarget() {
        return target;
    }

    public void setTarget(String target) {
        this.target = target;
    }

    public List<List<Object>> getDatapoints() {
        return datapoints;
    }

    public void setDatapoints(List<List<Object>> datapoints) {
        this.datapoints = datapoints;
    }

    @Override
    public String toString() {
        return "TimeSeriesPoint{" +
                "target=" + target +
                ", datapoints=" + datapoints +
                '}';
    }
}
