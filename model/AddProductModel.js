//Create Table in 'myproduct' database and its Column //


module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define("myproduct", {       //kkproduct as table name and its columns
      productname: {
        type: DataTypes.STRING,
        allowNull: false,                               //Value could not be null
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    });
    return Product;
  };