const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../lib/db");
const config = require("../config");
const User = require("./user");

class AuthToken extends Model {}
AuthToken.init(
  {
    // Model attributes are defined here
    user_id: {
      type: DataTypes.INTEGER,
    },
    selector: {
      type: DataTypes.STRING(12),
    },
    token: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    underscored: true,
    modelName: "AuthToken", // We need to choose the model name
    tableName: `${config.dbPrefix}auth_tokens`,
  }
);

User.hasMany(AuthToken);
AuthToken.belongsTo(User);

module.exports = AuthToken;
