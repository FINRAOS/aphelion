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

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CsvService {

    @Value("${aphelion.file-location:/opt/staging/limits/}")
    private String fileLocation;

    private static final Logger logger = LoggerFactory.getLogger(CsvService.class);

    public String getLatestCSVFileName(String source){
        ArrayList<String> names = new ArrayList<>();
        try {
            File directory = new File(fileLocation);
            names.addAll(Arrays.asList(directory.list()));

            if(names.size() > 0) {
                logger.info(names.toString());
                if ((source != null || source.equals("latest")) && names.contains(source)) {
                    return fileLocation + source;
                } else {
                    String name = names.stream()
                            .sorted(Comparator.reverseOrder())
                            .collect(Collectors.toList())
                            .get(0);

                    return fileLocation + name;
                }
            }
        } catch (Exception e){
            logger.error("Error accessing files folder", e);

        }
        return fileLocation;
    }

    public List<String> getAllCsvFileNames(){
        ArrayList<String> names = new ArrayList<>();
        try {
            File directory = new File(fileLocation);
            names.addAll(Arrays.asList(directory.list()));

            if(names.size() > 0) {
                return names.stream()
                        .sorted(Comparator.reverseOrder())
                        .collect(Collectors.toList());
            }

        } catch (Exception e){
            e.printStackTrace();
        }
        return new ArrayList<>();
    }

    public BufferedReader getCsv(String source) {
        String latestCSVFileName = "latest";
        try {
            if(source.equals("latest")) {
                latestCSVFileName = this.getLatestCSVFileName("latest");
            } else if (this.getAllCsvFileNames().contains(source)){
                latestCSVFileName = fileLocation + source;
            }
            logger.info("Loading data from " + latestCSVFileName);
            return new BufferedReader(new FileReader(latestCSVFileName));
        } catch (Exception e){
            logger.error("Could not find csv file. ", e);
        }
        return new BufferedReader(null);
    }
}
