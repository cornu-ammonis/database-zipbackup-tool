FROM node:boron
RUN mkdir -p /app
RUN mkdir /app/backups
WORKDIR /app
COPY project.json /app
RUN npm install
COPY main.js /app

