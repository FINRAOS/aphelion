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

public class Parameter {
    private String field;
    private String name;
    private String type;

    public Parameter(String field){
        this(field, field, "string");
    }

    public Parameter(String field, String name, String type){
        this.field=field;
        this.name=name;
        this.type=type;
    }

    public void setField(String field){
        this.field=field;
    }

    public void setName(String name){
        this.name=name;
    }

    public void setType(String type){
        this.type=type;
    }

    public String getField(){
        return field;
    }

    public String getType(){
        return type;
    }

    public String getName(){
        return name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Parameter parameter = (Parameter) o;

        if (!field.equals(parameter.field)) return false;
        if (!name.equals(parameter.name)) return false;
        return type.equals(parameter.type);
    }

    @Override
    public int hashCode() {
        int result = field.hashCode();
        result = 31 * result + name.hashCode();
        result = 31 * result + type.hashCode();
        return result;
    }

    @Override
    public String toString() {
        return "Parameter{" +
                "field='" + field + '\'' +
                ", name='" + name + '\'' +
                ", type='" + type + '\'' +
                '}';
    }
}