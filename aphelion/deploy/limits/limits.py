#!/usr/bin/python
#
# Copyright (c) 2018. Aphelion Contributors
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

import csv
import get_role_session
import datetime
import os
import sys
import traceback
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders

#load environment configurations and get values we need
role_name = os.environ.get('ASSUMED_ROLE_NAME', None)
role_session_name = os.environ.get('ASSUMED_ROLE_SESSION_NAME', None)
account_list = [x.strip() for x in os.environ.get('ACCOUNT_ID_LIST').split(',')]
regions = [x.strip() for x in os.environ.get('REGIONS').split(',')]
report_filename = os.environ.get('REPORT_FILE_NAME')
now = datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%S-")

#mail settings
sender = os.environ.get('MAIL_SENDER', None)
message = os.environ.get('MAIL_MESSAGE', None)
subject = os.environ.get('MAIL_SUBJECT', None)
mailhost = os.environ.get('MAIL_HOST', None)
port = os.environ.get('MAIL_PORT', None)
receivers = [x.strip() for x in os.environ.get('MAIL_RECEIVERS').split(',')]
reporting_limit = os.environ.get('MAIL_REPORTING_LIMIT', None)

def send_mail_attachment(message, attachment):
    msg = MIMEMultipart()
    # Create headers
    msg['Subject'] = subject
    msg['From'] = sender
    msg['To'] = ";".join(receivers)
    part = MIMEBase('application', "octet-stream")
    # Attach attachment
    part.set_payload(open(attachment, "rb").read())
    encoders.encode_base64(part)
    part.add_header('Content-Disposition', 'attachment', filename=attachment.split('/')[-1])
    msg.attach(part)
    msg.attach(MIMEText(message, 'plain'))
    # Send it off
    smtpObj = smtplib.SMTP(mailhost, port)
    smtpObj.sendmail(sender, receivers, msg.as_string())
    print("Successfully sent email")

def send_mail(message):
    msg = MIMEMultipart()
    # Create headers
    msg['Subject'] = subject
    msg['From'] = sender
    msg['To'] = ";".join(receivers)
    # Attach message
    msg.attach(MIMEText(message, 'plain'))
    # Send it off
    smtpObj = smtplib.SMTP(mailhost, port)
    smtpObj.sendmail(sender, receivers, msg.as_string())
    print("Successfully sent email")

#do some "formatting" of the limits collected by TA, as well as drop limits with no usage
def ta_limit_to_dict(limit):
    limit_dict = {'region': limit[0],
                  'service': limit[1],
                  'limit': limit[2],
                  'max': limit[3],
                  'used': limit[4]}

    if limit_dict['region'] not in regions + ['-']:
        return None
    if limit_dict['service'] == 'EC2' and limit_dict['limit'].startswith('On-Demand instances -'):
        limit_dict['used'] = 0
        type_lookup = '%s %s' % (limit_dict['region'], limit_dict['limit'].split(' ')[3])
    if limit_dict['used'] == None:
        limit_dict['used'] = 0
    return limit_dict

report_out = []

for account_id in account_list:
    account_out = {'id': account_id}
    all_limits = []
    #get boto3 session for the account
    try:
        sess = get_role_session.get_role_session(account_id, role_name, role_session_name)
        #instance_types = defaultdict(int)

        for region in regions:
            #get total EC2 instances since TA does not check TOTAL on-demand instances, only by instance type
            total_instances = 0
            ec2 = sess.resource('ec2', region_name=region)
            for instance in ec2.instances.page_size(count=100):
                if instance.instance_lifecycle != 'spot':
                    #instance_types["%s %s" % (region,instance.instance_type)] += 1
                    total_instances += 1
            #and check that coutn against the configured limit from EC2
            ec2c = sess.client('ec2', region_name=region)
            attributes = ec2c.describe_account_attributes(AttributeNames=['max-instances'])
            all_limits.append({'region':region, 'service':'EC2', 'limit':'Max On-Demand Instances', 'max':attributes['AccountAttributes'][0]['AttributeValues'][0]['AttributeValue'], 'used':total_instances})

            #inspect DMS resources and limits
            dms = sess.client('dms', region_name=region)
            dms_limits = dms.describe_account_attributes()
            for dms_limit in dms_limits['AccountQuotas']:
                all_limits.append({'region':region, 'service':'DMS', 'limit':dms_limit['AccountQuotaName'], 'max':dms_limit['Max'], 'used':dms_limit['Used']})

        # start the check from trusted advisor. remember that the check needs to be refreshed, so that should have been run at least an hour before hand
        # this is only run once per account since TA is global.
        support = sess.client('support')
        for check in support.describe_trusted_advisor_checks(language='en')['checks']:
            if check['category'] == 'service_limits':
                print("checking %s - %s" % (check['id'], check['name']))
                try:
                    ta_resp = support.describe_trusted_advisor_check_result(checkId = check['id'], language='en')
                    if 'flaggedResources' in ta_resp['result']:
                        for limit in ta_resp['result']['flaggedResources']:
                            limit_dict = ta_limit_to_dict(limit['metadata'])
                            if limit_dict != None:
                                all_limits.append(limit_dict)
                except:
                    print("problem getting TA check for %s - %s" % (account_id, region))


        account_out['limits'] = all_limits
        report_out.append(account_out)

        headers = ['AccountID','Region','Service','Limit','Used','Max','% Usage']
        csvfilelocation = '/opt/staging/limits/' + now + report_filename
        csvfile = open(csvfilelocation, 'w')
        csvwriter = csv.writer(csvfile, quoting=csv.QUOTE_ALL)

        is_exceeding_limit = None

        csvwriter.writerow(headers)
        for account in report_out:
            for limit in sorted(account['limits'], key=lambda x: str(x['region']) + str(x['service']) + str(x['limit'])):
                limit_percent = int(float(limit['used'])/float(limit['max'])*100)

                try:
                    if reporting_limit is not None and limit_percent >= int(reporting_limit):
                        is_exceeding_limit = True
                except ValueError:
                    print("Could not convert data to an integer.", sys.exc_info()[0])


                csvwriter.writerow([account['id'],limit['region'], limit['service'], limit['limit'], limit['used'], limit['max'],
                                    str(limit_percent) + '%'])

        if is_exceeding_limit:
            send_mail_attachment(message, csvfilelocation)

    except Exception:
        print("Unexpected error:", sys.exc_info()[0])
        csvfile = open('/opt/staging/limits/' + now + report_filename, 'w')
        csvwriter = csv.writer(csvfile, quoting=csv.QUOTE_ALL)
        csvwriter.writerow(["ERROR", traceback.format_exc()])
        raise