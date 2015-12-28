FROM node:argon

# Create wuming directory
RUN mkdir /wuming
WORKDIR /wuming

# Install app dependencies
COPY . /wuming
#RUN npm install

EXPOSE 80
CMD [ "npm", "start" ]