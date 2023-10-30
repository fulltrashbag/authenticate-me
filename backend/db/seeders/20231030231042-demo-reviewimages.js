'use strict';

const { ReviewImage } = require('../models')

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
    await ReviewImage.bulkCreate([
      { reviewId: 1,
        url: "https://i0.wp.com/www.oswegonian.com/wp-content/uploads/2018/03/Movieclips-Trailer-Vault.png"
      },
      { reviewId: 2,
        url: "https://pbs.twimg.com/media/DteDlhiXQAAHchN.jpg"
      },
      { reviewId: 3,
        url: "https://variety.com/wp-content/uploads/2021/01/high-school-musical.jpg"
      },
      { reviewId: 4,
        url: "https://www.filmlinc.org/wp-content/uploads/2015/07/FunnyGirl_601-1600x900-c-default.jpg"
      },
      { reviewId: 5,
        url: "https://clan.akamai.steamstatic.com/images/25880686/173a9525bb38894164ce926182feafe6e2a7f11e.jpg"
      },
      { reviewId: 6,
        url: "https://pbs.twimg.com/profile_images/1585280653628788742/5_g57YAo_400x400.jpg"
      }
    ], options)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "ReviewImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: {
        [Op.in] : [1, 2, 3, 4, 5, 6]
      }
    }, {});
  }
};
