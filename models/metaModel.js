const { Model, DataTypes } = require("sequelize");

class MetaModel extends Model {
  getMeta(key) {
    const meta = this.meta;
    return meta[key];
  }

  setMeta(key, value) {
    const meta = this.meta;
    meta[key] = value;
    this.meta = meta;
    return this.save();
  }

  hasMeta(key) {
    const meta = this.meta;
    if (meta[key] !== undefined) return true;
    return false;
  }
  static init(fields, config) {
    fields.meta = {
      type: DataTypes.TEXT,
      defaultValue: "{}",
      get() {
        return JSON.parse(this.getDataValue("meta"));
      },
      set(v) {
        if (typeof v === "object" && v !== null) {
          this.setDataValue("meta", JSON.stringify(v));
        } else {
          try {
            const o = JSON.parse(v);
            if (typeof o === "object" && o !== null)
              this.setDataValue("meta", JSON.stringify(o));
            else this.setDataValue("meta", "{}");
          } catch (error) {
            this.setDataValue("meta", "{}");
          }
        }
      },
    };
    // config.defaultScope = { attributes: { exclude: ["meta"] } };
    return super.init(fields, config);
  }
}
module.exports = MetaModel;
