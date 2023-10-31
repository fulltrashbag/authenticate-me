'use strict';

const { Booking } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
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
    await Booking.bulkCreate([
      { spotId: 1,
        userId: 1,
        startDate: "2023-01-01",
        endDate: "2023-12-29"
      },
      { spotId: 1,
        userId: 3,
        startDate: "2023-12-30",
        endDate: "2023-12-31"
      },
      { spotId: 2,
        userId: 1,
        startDate: "2022-02-19",
        endDate: "2022-02-25"
      },
      { spotId: 2,
        userId: 2,
        startDate: "2024-03-09",
        endDate: "2024-03-29"
      },
      { spotId: 3,
        userId: 2,
        startDate: "2021-01-01",
        endDate: "2021-01-29"
      },
      { spotId: 3,
        userId: 3,
        startDate: "2023-01-01",
        endDate: "2023-12-29"
      },
      { spotId: 4,
        userId: 2,
        startDate: "2023-01-01",
        endDate: "2023-12-29"
      },
      { spotId: 4,
        userId: 3,
        startDate: "2023-12-30",
        endDate: "2023-12-31"
      },
      { spotId: 5,
        userId: 1,
        startDate: "2023-01-01",
        endDate: "2023-12-29"
      },
      { spotId: 5,
        userId: 3,
        startDate: "2023-12-30",
        endDate: "2023-12-31"
      },
      { spotId: 6,
        userId: 2,
        startDate: "2021-01-01",
        endDate: "2021-02-02"
      },
      { spotId: 6,
        userId: 3,
        startDate: "2023-01-01",
        endDate: "2023-12-29"
      },
    ], options)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "Bookings";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: {
        [Op.in] : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
      }
    }, {});
  }
};
