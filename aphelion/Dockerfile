FROM amazonlinux:latest

ENV JAVA_OPTS="-XX:+UnlockExperimentalVMOptions -XX:+UseCGroupMemoryLimitForHeap  -XX:MaxRAMFraction=1 -XshowSettings:vm "

RUN yum install -y epel-release
RUN yum install -y --nogpgcheck java-1.8.0-openjdk.x86_64
RUN yum -y install python34-pip
RUN yum -y install cronie
RUN python3 -m pip install boto3
RUN python3 -m pip install awscli

RUN mkdir -p /opt/staging/limits
RUN mkdir -p /etc/cron.d

ADD deploy/limits/limits-cron /etc/cron.d/limits-cron
ADD target/*.jar /opt/staging
ADD deploy/startup.sh /opt/staging
ADD deploy/limits /opt/staging

RUN chmod 0644 /etc/cron.d/limits-cron
RUN touch /var/log/cron.log
RUN chmod 775 /opt/staging/startup.sh
RUN chmod -R 775 /opt/staging
RUN chmod -R 777 /opt/staging/limits
RUN mv /opt/staging/2000-01-01T00:00:00-placeholder.csv /opt/staging/limits/

ENTRYPOINT ["/bin/bash", "/opt/staging/startup.sh" ]