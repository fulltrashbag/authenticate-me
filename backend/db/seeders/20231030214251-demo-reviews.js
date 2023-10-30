'use strict';

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
    await Review.bulkCreate([
      { spotId: 1,
        userId: 1,
        review: "I yearned for a harkening back just like this'n for years. I still have your shirt, Jake Gyllenhaal.",
        stars: 5
      },
      { spotId: 2,
        userId: 1,
        review: "I was chased by 1-3 masked men through a seemingly endless maze of flickering lights and dripping pipes.",
        stars: 2
      },
      { spotId: 3,
        userId: 2,
        review: "I made the football team, got stood up by Jenny but ended up dating the Art Girl, and got a 4 on my AP English Lit test. I'm 34 years old.",
        stars: 4
      },
      { spotId: 4,
        userId: 2,
        review: "Could ya believe it? I really made it here! I been auditionin' as much as my small-town heart can bear, and I just know it'll pay off!",
        stars: 4
      },
      { spotId: 5,
        userId: 3,
        review: "Day 34. No end in sight - we're losing resources, ground, and lives. I can only hope to make it home to Jenny, whom I met at American High School.",
        stars: 1
      },
      { spotId: 6,
        userId: 3,
        review: "All is one is none is all. Look inward and be seen. No continental breakfast.",
        stars: 3
      },
    ])

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "Reviews";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: {
        [Op.in] : [1, 2, 3, 4, 5, 6]
      }
    }, {});
  }
};
