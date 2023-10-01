
const dbConfig = require("../config/dbConfig");             //DB Parameter for DB connection imported from Config/dbConfig
const { Sequelize, DataTypes } = require("sequelize");     

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {            //ORM (Object Relational Mapping) - Sequelize new instance 
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

sequelize
  .authenticate()                   //authenticate() method is used to connect with the database
  .then(() => {
    console.log("CONNECTED!!");
  })
  .catch((err) => {
    console.log("Error" + err);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//importing model files
db.kkproducts = require("./AddProductModel.js")(sequelize, DataTypes);      //Create Database Table referred as model
db.kkfarmers = require("./farmerModel.js")(sequelize,DataTypes)
db.kkcustomers = require("./customerModel.js")(sequelize,DataTypes)

db.sequelize.sync({ force: false }).then(() => {                        //Database sync. if force value is true, them all table value will be flushed
    console.log("yes re-sync done");          
});

//relationship 1-M 
db.kkfarmers.hasMany(db.kkproducts)
db.kkproducts.belongsTo(db.kkfarmers)

module.exports = db;