FROM node:latest
RUN mkdir -p /usr/src/cryptoquiz
WORKDIR /usr/src/cryptoquiz
COPY package.json /usr/src/cryptoquiz/
RUN npm install
COPY . /usr/src/cryptoquiz
EXPOSE 3000
CMD [ "npm", "start" ]
