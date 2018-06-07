#!/bin/bash

if [ -z "${CRON_REFRESH}" ] || [ -z "${CRON_LIMITS}" ]; then
  echo "Using default Cron schedule"
else
cat > /etc/cron.d/limits-cron << EOF
$CRON_REFRESH root . /bin/env.sh; /usr/bin/python3 /opt/staging/limits-refresh.py >> /var/log/cron.log 2>&1
$CRON_LIMITS root . /bin/env.sh; /usr/bin/python3 /opt/staging/limits.py >> /var/log/cron.log 2>&1

EOF
fi

printenv | sed 's/^/export /; s/=/="/; s/$/"/;' > /bin/env.sh

/usr/sbin/crond

/usr/bin/python3 /opt/staging/limits.py >> /var/log/cron.log 2>&1

JARFILE=$(ls /opt/staging | grep .jar)
java -jar $JAVA_OPTS -Dserver.port=8080 /opt/staging/${JARFILE}
