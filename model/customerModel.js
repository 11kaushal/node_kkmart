module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("customers", {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull : false
      },
      password: {
        type: DataTypes.TEXT,
        allowNull:false
      },
      
    
    });
    return User;
  };
