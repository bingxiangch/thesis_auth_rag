# pull official base image
FROM node:latest

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH
# add app
COPY . ./
# install app dependencies
COPY package.json ./
COPY package-lock.json ./
# ==== BUILD =====
# Build the app
RUN npm install
ENV NODE_ENV production
# Expose port 3000
EXPOSE 3000
# Start app
CMD [ "npm", "start"]

