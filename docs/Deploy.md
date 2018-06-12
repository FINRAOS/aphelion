# Deploy to AWS

## Overview
Aphelion is distributed as Docker images.  We recommend deploying Aphelion as Docker containers on AWS ECS cluster.
Following is our recommended approach.

## Prerequisites
- ECS cluster
- ALB
- Task definition                                        

### Task Definition
You can create Task definition from the Docker Compose file by using ECS CLI.  You can refer to the documentation at:

- https://docs.aws.amazon.com/AmazonECS/latest/developerguide/cmd-ecs-cli-compose.html

### Docker Compose Example

```YAML
version: '2'
services:
  aphelion-service:
    image: finraos/aphelion-service
    environment:
       - ASSUMED_ROLE_NAME=assumed_role_name
       - ACCOUNT_ID_LIST=123456789101, 123456789102, 123456789103, 123456789104
       - ASSUMED_ROLE_SESSION_NAME=limit_dashboard
       - REGIONS=us-east-1, us-east-2
       - AWS_DEFAULT_REGION=us-east-1
       - REPORT_FILE_NAME=limits.csv
       - CRON_REFRESH=* * * * *
       - CRON_LIMITS=* * * * *
  dashboard-service:
    image: finraos/aphelion-dashboard-service
  web:
    image: finraos/aphelion-web
    ports:
       - 8443
    restart: always
    links:
       - dashboard-service
       - aphelion-service
```

!!! tip 
    You can AWS log configuration properties to the docker-compose file


## Process
1. Create ECS cluster

2. Create ALB

3. Create Task Definition registered to ECS cluster

4. Deploy Task Definition