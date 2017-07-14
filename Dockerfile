FROM node:boron
RUN mkdir -p /app
RUN mkdir /app/backups
RUN mkdir /app/zips
WORKDIR /app
COPY package.json /app
RUN npm install
COPY main.js /app
COPY backupGenerator.js /app
COPY logger.js /app


