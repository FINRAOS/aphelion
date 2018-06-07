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


import javax.validation.constraints.NotNull;
import java.util.Comparator;

public class Datapoint implements Comparator<Datapoint>{
    public String accountId;
    public String accountName;
    public String region;
    public String service;
    public String limit;
    public String used;
    public String max;
    public String usage;
    public String alert;

    public Datapoint(String accountName, String accountId, String region, String service, String limit, String used, String max, String usage, String alert) {
        this.accountName = accountName;
        this.accountId = accountId;
        this.region = region;
        this.service = service;
        this.limit = limit;
        this.used = used;
        this.max = max;
        this.usage = usage;
        this.alert = alert;
    }

    public Datapoint() {
    }

    public String getAccountId() {
        return accountId;
    }

    public void setAccountId(String accountId) {
        this.accountId = accountId;
    }

    public String getAccountName() {
        return accountName;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getAlert() {
        return alert;
    }

    public String getService() {
        return service;
    }

    public void setService(String service) {
        this.service = service;
    }

    public String getLimit() {
        return limit;
    }

    public void setLimit(String limit) {
        this.limit = limit;
    }

    public String getUsed() {
        return used;
    }

    public Integer getIntegerUsed(){
        return Integer.parseInt(this.getUsed());
    }

    public void setUsed(String used) {
        this.used = used;
    }

    public String getMax() {
        return max;
    }

    public Integer getIntegerMax(){
        return Integer.parseInt(this.getMax());
    }

    public void setMax(String max) {
        this.max = max;
    }

    public String getUsage() {
        return usage;
    }

    public void setUsage(String usage) {
        this.usage = usage;
    }

    public String isAlert() {
        return alert;
    }

    public void setAlert(String alert) {
        this.alert = alert;
    }

    @Override
    public int compare(Datapoint o1, Datapoint o2) {
        return o1.compareTo(o2);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Datapoint datapoint = (Datapoint) o;

        if (!accountId.equals(datapoint.accountId)) return false;
        if (!accountName.equals(datapoint.accountName)) return false;
        if (region != null ? !region.equals(datapoint.region) : datapoint.region != null) return false;
        if (!service.equals(datapoint.service)) return false;
        if (!limit.equals(datapoint.limit)) return false;
        if (!used.equals(datapoint.used)) return false;
        if (!max.equals(datapoint.max)) return false;
        if (!usage.equals(datapoint.usage)) return false;
        return alert != null ? alert.equals(datapoint.alert) : datapoint.alert == null;
    }

    @Override
    public int hashCode() {
        int result = accountId.hashCode();
        result = 31 * result + accountName.hashCode();
        result = 31 * result + (region != null ? region.hashCode() : 0);
        result = 31 * result + service.hashCode();
        result = 31 * result + limit.hashCode();
        result = 31 * result + used.hashCode();
        result = 31 * result + max.hashCode();
        result = 31 * result + usage.hashCode();
        result = 31 * result + (alert != null ? alert.hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return "Datapoint{" +
                "accountId='" + accountId + '\'' +
                ", accountName='" + accountName + '\'' +
                ", region='" + region + '\'' +
                ", service='" + service + '\'' +
                ", limit='" + limit + '\'' +
                ", used='" + used + '\'' +
                ", max='" + max + '\'' +
                ", usage='" + usage + '\'' +
                ", alert='" + alert + '\'' +
                '}';
    }

    public int compareTo(@NotNull Datapoint o) {
        if (Integer.parseInt(o.getUsage()) == Integer.parseInt(this.getUsage()))
            return 0;
        else if (Integer.parseInt(o.getUsage()) > Integer.parseInt(this.getUsage()))
           return -1;
        else if (Integer.parseInt(o.getUsage()) < Integer.parseInt(this.getUsage()))
            return 1;

        return 0;
    }
}