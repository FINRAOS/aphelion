# Local Setup

## Prerequisites
Must be able to run application with a role that is able to assume ```ASSUMED_ROLE_NAME```
with proper permissions to create report.


Since trusted advisor must be told to refresh its values, the script
limits-refresh.py must be run some time in advance of the limits collection.
Generally, 1 hour before hand is a safe value, but your mileage may vary.

Aphelion expect to find AWS credentials through the normal client/SDK
discovery mechanisms (instance profile, .aws/credentials file, ENV variables, 
etc), and the principal linked to those credentials must be able to assume a
role in each target account. Those target role names must be identical in each
target account. That target role must have permissions necessary to list or
describe the resources that are being inspected, as well as issue a TA refresh
and get a TA report.

## Configure
Aphelion requires the following properties to be set in order to run.

### Environment Variables
| Name                      | Description                                                                                                                           | Example                                                    |
|---------------------------|---------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------|
| ASSUMED_ROLE_NAME         | The name of the role to assume to inspect an account. This needs to be the same across all target accounts                            | assumed_role_name                                          |
| ASSUMED_ROLE_SESSION_NAME | Role session name to pass when assuming the role                                                                                      | 1234567891011, 1234567891012, 1234567891013, 1234567891014 |
| ACCOUNT_ID_LIST           | Comma separated list of account IDs to interrogate. Will accept with or without leading and/or trailing spaces                        | limit_dashboard                                            |
| REGIONS                   | Regions of interest. TA limits not in this list will be dropped, and non TA limit checks will only be performed in the regions listed | us-east-1, us-east-2                                       |
| REPORT_FILE_NAME          | Name of the CSV file to create with the results                                                                                       | limits.csv                                                 |
| CRON_REFRESH              | Cron schedule to run limits-refresh.  Must run about an hour before CRON_LIMITS                                                       | 0 2 * * *                                                  |
| CRON_LIMITS               | Cron schedule to run limits report.                                                                                                   | 0 3 * * *                                                  |
| AWS_DEFAULT_REGION        | AWS Default Region                                                                                                                    | us-east-1                                                  |

### Docker Compose Example

```YAML
version: '2'
services:
  aphelion-service:
    image: finraos/aphelion-service:latest
    environment:
      - ASSUMED_ROLE_NAME=Assumed_Role_Name
      - ACCOUNT_ID_LIST=123456789101, 123456789102, 123456789103
      - ASSUMED_ROLE_SESSION_NAME=aphelion_role
      - REGIONS=us-east-1, us-east-2, us-west-1
      - REPORT_FILE_NAME=limits.csv
      - CRON_REFRESH=* * * * *
      - CRON_LIMITS=* * * * *
      - AWS_DEFAULT_REGION=us-east-1
    volumes:
       - /Users/$USER/.aws:/root/.aws
  dashboard-service:
    image: finraos/aphelion-dashboard-service
  web:
    image: finraos/aphelion-web
    ports:
      - 443:8443
    restart: always
    links:
     - dashboard-service
     - aphelion-service
```

!!! warning "AWS Credentials"
    To run locally you might need to mount your ./AWS folder to limit-service
    ```YAML
    volumes:
      - /Users/$USER/.aws:/root/.aws
    ```

## RUN
1. Start service
    ```
    docker-compose -f local.yml up
    ```
2. Navigate to URL
    ```
    https://localhost
    ```