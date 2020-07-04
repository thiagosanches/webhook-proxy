FROM node:12.18.2-alpine3.9

RUN mkdir /opt/app && chown -R node:node /opt/app
WORKDIR /opt/app
COPY package*.json ./
USER node
RUN npm install

COPY --chown=node:node . .

EXPOSE 3000
ENTRYPOINT [ "node", "main.js" ]
