'use strict';
const {
  Model
} = require('sequelize');
const group = require('./group');
module.exports = (sequelize, DataTypes) => {
  class Province extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Province.hasMany(models.District)
    }
  }
  Province.init({
    name: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Province',
  });
  return Province;
};