const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../lib/db");
const config = require("../config");

class Entity extends Model {}
Entity.init(
  {
    // Model attributes are defined here
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    underscored: true,
    modelName: "Entity", // We need to choose the model name
    tableName: `${config.dbPrefix}entities`,
    timestamps: false,
  }
);

module.exports = Entity;
