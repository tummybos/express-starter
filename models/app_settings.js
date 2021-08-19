const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../lib/db");
const config = require("../config");

class AppSettings extends Model {
  static getSettings(key) {
    return new Promise((resolve, reject) => {
      this.findOne({ where: { setting_key: key } })
        .then((settings) => {
          if (settings !== null) resolve(settings.setting_value);
          else resolve("");
        })
        .catch((err) => reject(err));
    });
  }
  static hasSettings(key) {
    return new Promise((resolve, reject) => {
      this.findOne({ where: { setting_key: key } })
        .then((settings) => {
          if (settings !== null) resolve(true);
          else resolve(false);
        })
        .catch((err) => reject(err));
    });
  }
  static saveSettings(key, value) {
    return new Promise((resolve, reject) => {
      this.findOrCreate({
        where: { setting_key: key },
        defaults: { setting_value: value },
      })
        .then(() => resolve(true))
        .catch((err) => reject(err));
    });
  }
}
AppSettings.init(
  {
    // Model attributes are defined here
    setting_key: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    setting_value: {
      type: DataTypes.STRING(255),
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    underscored: true,
    modelName: "AppSettings", // We need to choose the model name
    tableName: `${config.dbPrefix}app_settings`,
    timestamps: false,
  }
);
module.exports = AppSettings;
