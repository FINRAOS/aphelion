FROM nginx

RUN apt-get update
RUN apt-get install openssl

ADD index.html /usr/share/nginx/html
ADD nginx.conf /etc/nginx/nginx.conf

RUN mkdir -p /etc/pki/tls/private
RUN mkdir -p /etc/pki/tls/certs

ADD selfsign.sh /tmp/selfsign.sh
RUN chmod a+rx /tmp/selfsign.sh
RUN /tmp/selfsign.sh

