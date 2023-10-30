'use strict';
const { SpotImage } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    options.validate = true;
    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: "https://d27p2a3djqwgnt.cloudfront.net/wp-content/uploads/2016/03/16132917/farm-scene.jpg",
        preview: true
      },
      {
        spotId: 2,
        url: "https://static.wikia.nocookie.net/nicos-nextbots/images/c/c4/ParkingLotOfEternalEmptiness.png/revision/latest?cb=20220728202500",
        preview: true
      },
      {
        spotId: 3,
        url: "https://www.excelhighschool.com/wp-content/uploads/2016/08/excel_about.jpg",
        preview: true
      },
      {
        spotId: 4,
        url: "https://cdn.britannica.com/95/143895-050-FA4BAC47/Billboards-Broadway-New-York-City-Times-Square.jpg",
        preview: true
      },
      {
        spotId: 5,
        url: "https://stayva.s3.amazonaws.com/2019/10/22/manassasbattlefieldpark.jpg",
        preview: true
      },
      {
        spotId: 6,
        url: "https://cdn.80.lv/api/upload/content/c1/images/63f4a62b58c7e/widen_1840x0.jpeg",
        preview: true
      }
    ], options)
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "SpotImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3, 4, 5, 6] }
    }, {});
  }
};
