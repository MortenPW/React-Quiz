# Using node 11.0.0 creates a horrible bug where the system freezes after a short while
FROM node:11
RUN mkdir -p /quizbiz
WORKDIR /quizbiz
COPY package.json /quizbiz/package.json
RUN npm install
COPY . /quizbiz
EXPOSE 8080 27017
CMD [ "npm", "start" ]