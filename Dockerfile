FROM node:slim
WORKDIR /InvServer
COPY . /InvServer
RUN npm install
EXPOSE 3000:3000
CMD [ "npm", "run", "start", "production"]