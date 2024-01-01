'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Bid extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Bid.belongsTo(models.User, { foreignKey: 'userId' });
            Bid.belongsTo(models.Auction, { foreignKey: 'auctionId' });
        }
    }
    Bid.init({
        auctionId: DataTypes.INTEGER,
        userId: DataTypes.INTEGER,
        bidAmount: DataTypes.STRING,
        bidTime: DataTypes.DATE
    }, {
        sequelize,
        modelName: 'Bid',
    });
    return Bid;
};