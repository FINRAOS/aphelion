#!/bin/bash
openssl req -x509 -nodes -days 365 \
    -subj  "/CN=localhost" \
    -newkey rsa:2048 \
    -keyout "/etc/pki/tls/private/selfsigned.key" \
    -out "/etc/pki/tls/certs/selfsigned.crt"