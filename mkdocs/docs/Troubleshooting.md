# Troubleshooting

## Troubleshooting
Not displaying any data can be caused by several different reasons.  In order to to find the root cause you can login
to the limit-service instance and look for the log located at:
```
/var/log/cron.log
```

### AWS credentials are not properly getting passed to Aphelion
- If application is running locally you might need to mount volume.  
- If application is deployed to AWS, Task might not be configured to access AWS credential information.  
- Task might not be able to AWS calls.

### Invalid AWS credentials are getting passed to Aphelion
- Provided Credentials are not allowing Aphelion to assume role 

### Role does not have proper permissions to assume role
- If deployed locally, user might not have permissions to assume role on 1 or more accounts.
- If deployed on AWS, Task might not be running under role that is able to assume role 

### ASSUME_ROLE is missing permissions to generate report
- ASSUME_ROLE might be missing a permission to generate report on 1 or more accounts

### Environment Variables are not being set or are configured improperly
- Aphelion is missing 1 or more Environment Variables
