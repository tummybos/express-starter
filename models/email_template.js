const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../lib/db");
const config = require("../config");

class EmailTemplate extends Model {}
EmailTemplate.init(
  {
    // Model attributes are defined here
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING(255),
    },
    message: {
      type: DataTypes.TEXT,
    },
    message_html: {
      type: DataTypes.TEXT,
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    underscored: true,
    modelName: "EmailTemplate", // We need to choose the model name
    tableName: `${config.dbPrefix}email_templates`,
    timestamps: false,
  }
);

module.exports = EmailTemplate;
