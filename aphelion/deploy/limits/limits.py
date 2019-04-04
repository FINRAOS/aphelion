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

#load environment configurations and get values we need
role_name = os.environ.get('ASSUMED_ROLE_NAME', None)
role_session_name = os.environ.get('ASSUMED_ROLE_SESSION_NAME', None)
account_list = [x.strip() for x in os.environ.get('ACCOUNT_ID_LIST').split(',')]
regions = [x.strip() for x in os.environ.get('REGIONS').split(',')]
report_filename = os.environ.get('REPORT_FILE_NAME')
now = datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%S-")

#do some "formatting" of the limits collected by TA, as well as drop limits with no usage
def ta_limit_to_dict(limit):
    #extract values into dictionary
    limit_dict = {'region':limit[0], 'service':limit[1], 'limit':limit[2], 'max':limit[3], 'used':limit[4]}
    #omit entries for regions we're not interested in
    if limit_dict['region'] not in regions + ['-']:
        return None
    #ignore unused resources
    if limit_dict['used'] in [ '0', 0, None]:
        return None
    return limit_dict

report_out = []

for account_id in account_list:
    #account_name = account['name']
    #account_id = account['account_id']
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

        #start the check from trusted advisor. remember that the check needs to be refreshed, so that should have been run at least an hour before hand
        # this is only run once per account since TA is global.
        support = sess.client('support')
        ta_resp = support.describe_trusted_advisor_check_result(checkId = 'eW7HH0l7J9', language='en')
        #walk the list of TA resources, and add them to the master list if valid
        if 'flaggedResources' in ta_resp['result']:
            for limit in ta_resp['result']['flaggedResources']:
                limit_dict = ta_limit_to_dict(limit['metadata'])
                if limit_dict != None:
                    all_limits.append(limit_dict)
        account_out['limits'] = all_limits
        report_out.append(account_out)

        headers = ['AccountID','Region','Service','Limit','Used','Max','% Usage']
        csvfile = open('/opt/staging/limits/' + now + report_filename, 'w')
        csvwriter = csv.writer(csvfile, quoting=csv.QUOTE_ALL)

        csvwriter.writerow(headers)
        for account in report_out:
            for limit in sorted(account['limits'], key=lambda x: str(x['region']) + str(x['service']) + str(x['limit'])):
                csvwriter.writerow([account['id'],limit['region'], limit['service'], limit['limit'], limit['used'], limit['max'],
                                    str(int(float(limit['used'])/float(limit['max'])*100)) + '%'])
    except Exception:
        print("Unexpected error:", sys.exc_info()[0])
        csvfile = open('/opt/staging/limits/' + now + report_filename, 'w')
        csvwriter = csv.writer(csvfile, quoting=csv.QUOTE_ALL)
        csvwriter.writerow(["ERROR", traceback.format_exc()])
        raise