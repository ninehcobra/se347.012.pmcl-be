'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Product', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      descriptionHTML: {
        type: Sequelize.TEXT('long')
      },
      descriptionMarkdown: {
        type: Sequelize.TEXT('long')
      },
      startPrice: {
        type: Sequelize.STRING
      },
      currentPrice: {
        type: Sequelize.STRING
      },
      jumpPrice: {
        type: Sequelize.STRING
      },
      startTime: {
        type: Sequelize.DATE
      },
      endTime: {
        type: Sequelize.DATE
      },
      images: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      categoryId: {
        type: Sequelize.INTEGER
      },
      sellerId: {
        type: Sequelize.INTEGER
      },
      isPublished: {
        type: Sequelize.BOOLEAN
      }
      ,
      isPay: {
        type: Sequelize.BOOLEAN
      }
      ,
      isCompleted: { type: Sequelize.BOOLEAN },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Product');
  }
};