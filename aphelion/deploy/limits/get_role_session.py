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
import boto3

def get_role_session(account_id, role_name, role_session_name):
    sts = boto3.client('sts')
    role = sts.assume_role(RoleArn='arn:aws:iam::%s:role/%s' % (account_id,role_name) , RoleSessionName=role_session_name)
    creds = {}
    creds['aws_access_key_id'] = role['Credentials']['AccessKeyId']
    creds['aws_secret_access_key'] = role['Credentials']['SecretAccessKey']
    creds['aws_session_token'] = role['Credentials']['SessionToken']
    sess =  boto3.Session(**creds)
    sess.credentials = creds
    return sess


