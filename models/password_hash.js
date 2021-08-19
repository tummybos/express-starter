const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../lib/db");
const config = require("../config");
const User = require("./user");

class PasswordHash extends Model {}
PasswordHash.init(
  {
    // Model attributes are defined here
    user_id: {
      type: DataTypes.INTEGER,
    },
    hash: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    sms_code: {
      type: DataTypes.STRING(6),
    },
    sms_expiry_date: {
      type: DataTypes.DATE,
    },
    activated: {
      type: DataTypes.TINYINT(1),
      defaultValue: 0,
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    underscored: true,
    modelName: "PasswordHash", // We need to choose the model name
    tableName: `${config.dbPrefix}password_hash`,
  }
);

User.hasMany(PasswordHash);
PasswordHash.belongsTo(User);

module.exports = PasswordHash;
