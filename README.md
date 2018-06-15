<img src="/img/logo.png" alt="drawing" width="400px"/>

## What is Aphelion?
Aphelion is a dashboard to visualize AWS services usage limits for your AWS accounts

[![Aphelion dashboard](docs/images/dashboard.png)](docs/images/dashboard.png)

## Overview
Aphelion is used to collect AWS limits across multiple accounts. It uses
a combination of Trusted Advisor (TA) as well as direct resource APIs to collect
limits for most of the AWS resources where the limit is either in TA, or
the particular service exposes the current limit values via API calls.

## Features
- View dashboard with limits and usage for all of your AWS accounts
- Filter dashboard display by Account number
- Filter dashboard display by Region
- Highlight services that are reaching max limit
- Download CSV report

## Documentation
- [Overview](docs/index.md)
- [AWS IAM Role Setup](docs/AWS-Setup.md)
- [Local Setup](docs/Local-Setup.md)
- [Deploy](docs/Deploy.md)
- [Troubleshooting](docs/Troubleshooting.md)
