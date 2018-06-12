# AWS IAM role Setup

## Setting your AWS environment
Aphelion requires the application to assume role to a target IAM role with the same name across all accounts in order to
create limits report.  The source role that is used to deploy Aphelion must have proper permission to call 
`sts:assume-role` role on each target role.  Each target role must also have a trust relationship with the source role 
to allow itself to be assumed. For more information regarding AWS assume role, refer to: 
https://docs.aws.amazon.com/cli/latest/userguide/cli-roles.html 

### IAM Assume Role Permissions
The IAM role in each account must contain proper permissions to collect the data to generate the limits report.

### Example IAM permissions
```JSON
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "awsReadOnly12345678TEST",
      "Effect": "Allow",
      "Action": [
        "acm:DescribeCertificate",
        "acm:GetCertificate",
        "acm:ListCertificates",
        "acm:ListTagsForCertificate",
        "autoscaling:Describe*",
        "cloudformation:DescribeStacks",
        "cloudformation:DescribeStackEvents",
        "cloudformation:DescribeStackResource",
        "cloudformation:DescribeStackResources",
        "cloudformation:GetTemplate",
        "cloudformation:List*",
        "cloudfront:Get*",
        "cloudfront:List*",
        "cloudtrail:DescribeTrails",
        "cloudtrail:GetTrailStatus",
        "cloudwatch:Describe*",
        "cloudwatch:Get*",
        "cloudwatch:List*",
        "codedeploy:BatchGet*",
        "codedeploy:Get*",
        "codedeploy:List*",
        "directconnect:Describe*",
        "dynamodb:Query",
        "dynamodb:DescribeTable",
        "dynamodb:ListTables",
        "ec2:Describe*",
        "ec2messages:*",
        "elasticache:Describe*",
        "elasticbeanstalk:Describe*",
        "elasticbeanstalk:List*",
        "elasticloadbalancing:Describe*",
        "elasticmapreduce:Describe*",
        "elasticmapreduce:List*",
        "elastictranscoder:List*",
        "iam:GetAccountPasswordPolicy",
        "iam:GetAccountSummary",
        "iam:GetGroup",
        "iam:GetGroupPolicy",
        "iam:GetInstanceProfile",
        "iam:GetLoginProfile",
        "iam:GetRole",
        "iam:GetRolePolicy",
        "iam:GetUser",
        "iam:GetUserPolicy",
        "iam:ListAccountAliases",
        "iam:ListGroupPolicies",
        "iam:ListGroups",
        "iam:ListGroupsForUser",
        "iam:ListInstanceProfiles",
        "iam:ListInstanceProfilesForRole",
        "iam:ListMFADevices",
        "iam:ListRolePolicies",
        "iam:ListRoles",
        "iam:ListServerCertificates",
        "iam:ListUserPolicies",
        "iam:ListUsers",
        "iam:ListVirtualMFADevices",
        "iam:GetPolicy",
        "iam:GetPolicyVersion",
        "iam:ListPolicies",
        "iam:ListPolicyVersions",
        "iam:ListAttachedUserPolicies",
        "iam:ListAttachedRolePolicies",
        "lambda:Describe*",
        "lambda:List*",
        "opsworks:Describe*",
        "opsworks:Get*",
        "route53:Get*",
        "route53:List*",
        "rds:Describe*",
        "rds:ListTagsForResource",
        "redshift:Describe*",
        "redshift:ViewQueriesInConsole",
        "route53:Get*",
        "route53:List*",
        "s3:GetBucketAcl",
        "s3:GetBucketCORS",
        "s3:GetBucketLocation",
        "s3:GetBucketLogging",
        "s3:GetBucketNotification",
        "s3:GetBucketPolicy",
        "s3:GetBucketRequestPayment",
        "s3:GetBucketTagging",
        "s3:GetBucketVersioning",
        "s3:GetBucketWebsite",
        "s3:GetLifecycleConfiguration",
        "s3:List*",
        "sdb:GetAttributes",
        "sdb:List*",
        "ses:Get*",
        "ses:List*",
        "sns:Get*",
        "sns:List*",
        "sqs:GetQueueAttributes",
        "sqs:GetQueueUrl",
        "sqs:ListQueues",
        "ssm:Describe*",
        "ssm:Get*",
        "ssm:List*",
        "ssm:UpdateInstanceInformation",
        "storagegateway:List*",
        "storagegateway:Describe*",
        "support:*",
        "tag:get*",
        "trustedadvisor:Describe*"
      ],
      "Resource": [
        "*"
      ]
    }
  ]
}
``` 