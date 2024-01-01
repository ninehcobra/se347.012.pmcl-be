'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Auction extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Auction.belongsTo(models.Product, { foreignKey: 'productId' });
            Auction.hasMany(models.Bid, { foreignKey: 'auctionId' })
        }
    }
    Auction.init({
        productId: DataTypes.INTEGER,
        winnerId: DataTypes.INTEGER,
        bidCount: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Auction',
    });
    return Auction;
};