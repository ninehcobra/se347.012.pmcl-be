'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Product.belongsTo(models.User, { foreignKey: 'sellerId' })
            Product.hasMany(models.Auction, { foreignKey: 'productId' });

            Product.hasMany(models.Favorite, { foreignKey: 'productId' });
        }
    }
    Product.init({
        name: DataTypes.STRING,
        descriptionHTML: DataTypes.TEXT('long'),
        descriptionMarkdown: DataTypes.TEXT('long'),
        startPrice: DataTypes.STRING,
        currentPrice: DataTypes.STRING,
        jumpPrice: DataTypes.STRING,
        startTime: DataTypes.DATE,
        endTime: DataTypes.DATE,
        sellerId: DataTypes.INTEGER,
        categoryId: DataTypes.INTEGER,
        images: DataTypes.JSON,
        isPublished: DataTypes.BOOLEAN,
        isCompleted: DataTypes.BOOLEAN,
        isPay: DataTypes.BOOLEAN
    }, {
        sequelize,
        modelName: 'Product',
    });
    return Product;
};