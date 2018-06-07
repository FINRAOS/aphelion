#!/usr/bin/python3
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

#########################
#
# This script is used to initiate a refresh of trusted advisor. Should be
# executed some time prior to running the full limits report to ensure that
# there is up to date data from Trusted Advisor
#

import get_role_session
import os

#load environment configurations and get values we need
role_name = os.environ.get('ASSUMED_ROLE_NAME', None)
role_session_name = os.environ.get('ASSUMED_ROLE_SESSION_NAME', None)
account_list = [x.strip() for x in os.environ.get('ACCOUNT_ID_LIST').split(',')]
    
#for each account in the config file....
for account_id in account_list:
    #get an assumed role for the target account
    sess = get_role_session.get_role_session(account_id, role_name, role_session_name)
    support = sess.client('support')
    support.refresh_trusted_advisor_check(checkId = 'eW7HH0l7J9')

