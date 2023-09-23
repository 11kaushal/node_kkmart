FROM node:18-alpine

#set Working directory
WORKDIR /kkmartapp

#copy and install all depencies
COPY package*.json .

RUN npm install -g nodemon && npm install

# copy source code
COPY . .               

#environment variable
ENV PORT = "3001"
ENV DB_NAME="kkmart"
ENV DB_HOST="database"             
ENV DB_USER="root"
ENV DB_PASSWORD="12345"             
ENV DB_PORT="3306"

#run application
CMD ["npm", "start"]
