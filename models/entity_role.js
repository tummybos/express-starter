const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../lib/db");
const config = require("../config");
const User = require("./user");
const Role = require("./role");

class EntityRole extends Model {}
EntityRole.init(
  {
    // Model attributes are defined here
    role_id: {
      type: DataTypes.INTEGER,
    },
    entity: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    entity_id: {
      type: DataTypes.INTEGER,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
    active: {
      type: DataTypes.TINYINT(1),
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    underscored: true,
    modelName: "EntityRole", // We need to choose the model name
    tableName: `${config.dbPrefix}entity_roles`,
  }
);

User.hasMany(EntityRole);
EntityRole.belongsTo(User);

Role.hasMany(EntityRole);
EntityRole.belongsTo(Role);
module.exports = EntityRole;
