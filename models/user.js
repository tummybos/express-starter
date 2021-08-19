const { DataTypes, Op } = require("sequelize");
const MetaModel = require("./metaModel");
const Role = require("./role");
const { sequelize } = require("../lib/db");
const config = require("../config");
const bcrypt = require("bcrypt");

class User extends MetaModel {
  static hashPassword(password) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
  validPassword(password) {
    return new Promise((resolve, reject) => {
      bcrypt
        .compare(password, this.password)
        .then((result) => resolve(result))
        .catch((err) => reject(err));
    });
  }
  profile() {
    const { id, username, email } = this;
    return {
      id,
      username,
      email,
    };
  }
  can(permission) {
    if (this.Role) {
      return this.Role.permissions.includes(permission);
    }
    return false;
  }
  static load(username) {
    return this.findOne({
      where: { [Op.or]: [{ username: username }, { email: username }] },
    });
  }
  usernameExists(username = this.username) {
    return this.count({ where: { username } }).then((count) => {
      if (count != 0) {
        return false;
      }
      return true;
    });
  }
  emailExists(email = this.email) {
    return this.count({ where: { email } }).then((count) => {
      if (count != 0) {
        return false;
      }
      return true;
    });
  }
  credentialsExists(username = this.username, email = this.email) {
    return this.count({
      where: { [Op.or]: [{ username: username }, { email: email }] },
    }).then((count) => {
      if (count != 0) {
        return false;
      }
      return true;
    });
  }
}
User.init(
  {
    // Model attributes are defined here
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
      // get() {
      //   return "xxx";
      // },
      async set(val) {
        if (!this.password) this.setDataValue("password", val);
      },
    },
    role_id: {
      type: DataTypes.INTEGER,
    },
    reg_ip: {
      type: DataTypes.STRING(64),
    },
    last_ip: {
      type: DataTypes.STRING(64),
    },
    active: {
      type: DataTypes.TINYINT(1),
      defaultValue: 0,
    },
    blocked: {
      type: DataTypes.TINYINT(1),
      defaultValue: 0,
    },
    blocked_memo: {
      type: DataTypes.STRING(255),
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    underscored: true,
    modelName: "User", // We need to choose the model name
    tableName: `${config.dbPrefix}users`,
    scopes: {
      withRole: {
        include: Role,
      },
    },
  }
);

Role.hasMany(User);
User.belongsTo(Role);
module.exports = User;
