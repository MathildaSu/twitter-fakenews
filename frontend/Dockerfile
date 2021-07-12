# Dockerfile

# pull the official docker image
FROM node:16

# install serve
RUN npm install -g serve

# set work directory
WORKDIR /frontend

# install the dependencies
COPY package.json yarn.lock ./
RUN yarn

# copy the project
COPY . ./

# build the project
RUN yarn build
