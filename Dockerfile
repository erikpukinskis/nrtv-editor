FROM debian:wheezy

RUN apt-get install curl
RUN curl -sL https://deb.nodesource.com/setup | bash -
RUN apt-get install -y nodejs

COPY editor.js /src
COPY package.json /src
COPY start.js /src

RUN cd /src
RUN npm isntall

EXPOSE 3118

CMD ["node", "/src/start.js"]