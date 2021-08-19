const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../lib/db");
const config = require("../config");

class Role extends Model {}
Role.init(
  {
    // Model attributes are defined here
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    permissions: {
      type: DataTypes.TEXT,
      defaultValue: "[]",
      get() {
        return JSON.parse(this.getDataValue("permissions"));
      },
      set(v) {
        this.setDataValue(
          "permissions",
          Array.isArray(v) ? JSON.stringify(v) : JSON.stringify([v])
        );
      },
    },
    global: {
      type: DataTypes.TINYINT(1),
      defaultValue: 1,
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    underscored: true,
    modelName: "Role", // We need to choose the model name
    tableName: `${config.dbPrefix}roles`,
  }
);

module.exports = Role;
