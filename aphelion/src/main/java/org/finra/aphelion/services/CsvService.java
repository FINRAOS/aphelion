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
import java.util.stream.Collectors;

@Service
public class CsvService {

    @Value("${aphelion.file-location:/opt/staging/limits/}")
    private String fileLocation;

    private static final Logger logger = LoggerFactory.getLogger(CsvService.class);

    public String getLatestCSVFileName(){
        ArrayList<String> names = new ArrayList<>();
        try {
            File directory = new File(fileLocation);
            names.addAll(Arrays.asList(directory.list()));

            if(names.size() > 0) {
                String name = names.stream()
                        .sorted(Comparator.reverseOrder())
                        .collect(Collectors.toList())
                        .get(0);

                return fileLocation + name;
            }

        } catch (Exception e){
            e.printStackTrace();
        }
        return fileLocation;
    }

    public BufferedReader getCsv() {
        try {
            String latestCSVFileName = this.getLatestCSVFileName();
            logger.info("Loading data from " + latestCSVFileName);
            return new BufferedReader(new FileReader(latestCSVFileName));
        } catch (Exception e){
            e.printStackTrace();
        }
        return new BufferedReader(null);
    }
}
