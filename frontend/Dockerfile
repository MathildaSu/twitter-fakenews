# Dockerfile

# pull the official docker image
FROM node:16

# set work directory
WORKDIR /frontend

# install serve
RUN npm install -g serve

# install the dependencies
COPY yarn.lock ./
RUN yarn

# copy the project
COPY . ./

# build the project
RUN yarn build
