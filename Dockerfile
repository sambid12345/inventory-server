FROM node:slim
WORKDIR /InvServer
COPY . /InvServer
RUN npm install
ENV NODE_ENV production
EXPOSE 3000:3000
CMD [ "npm", "run", "start"]