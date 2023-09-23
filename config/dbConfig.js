////DB connection config parameter fetched from .env file////
module.exports = {
  HOST: process.env.DB_HOST,      //value from .env
  USER: process.env.DB_USER,      //value from .env
  PASSWORD: process.env.DB_PASSWORD,  //value from .env
  DB: process.env.DB_NAME,          //value from .env
  port: process.env.DB_PORT,        //value from .env
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};