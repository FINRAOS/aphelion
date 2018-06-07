FROM grafana/grafana:5.1.0

USER grafana

ARG GF_INSTALL_PLUGINS=""

ENV GF_SECURITY_ADMIN_USER admin
ENV GF_SECURITY_ADMIN_PASSWORD admin
ENV GF_SECURITY_SECRET_KEY grafana
ENV GF_USERS_ALLOW_SIGN_UP "false"
ENV GF_USERS_ALLOW_ORG_CREATE "false"
ENV GF_AUTH_ANONYMOUS_ENABLED "true"
ENV GF_AUTH_DISABLE_LOGIN_FORM "false"

ADD plugins /var/lib/grafana/plugins
ADD provisioning /etc/grafana/provisioning

RUN if [ ! -z "${GF_INSTALL_PLUGINS}" ]; then \
    OLDIFS=$IFS; \
        IFS=','; \
    for plugin in ${GF_INSTALL_PLUGINS}; do \
        IFS=$OLDIFS; \
        grafana-cli --pluginsDir "$GF_PATHS_PLUGINS" plugins install ${plugin}; \
    done; \
fi