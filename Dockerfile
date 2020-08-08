FROM node:11.15

COPY ["package.json", "package-lock.json", "/usr/src/"]

WORKDIR /usr/src

RUN npm install

COPY [".", "/usr/src/"]

ENV MONGO_URL=mongodb://petshop-oliver-mongo/cafe
ENV NODE_ENV=prod

EXPOSE 3000

CMD ["npm", "start"]