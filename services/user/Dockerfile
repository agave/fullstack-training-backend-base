FROM agavelab/nodejs:latest

COPY ./user/src /var/lib/app
COPY ./core /var/lib/core
COPY ./user/scripts /home/docker/

WORKDIR /var/lib/app

RUN chmod -R +x /home/docker/startup.* /var/lib/app/node_modules/* && yarn install

EXPOSE 80

ENTRYPOINT ["/home/docker/startup.sh"]
