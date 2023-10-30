'use strict';

const { Spot } = require('../models')

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
    options.validate = "true"
    await Spot.bulkCreate([
      { ownerId: 2,
        address: "8456 N Ranchfarm Path",
        city : "Rural",
        state: "South Dakota",
        country: "USA",
        lat: 43.9695,
        lng: -99.9018,
        name: "Wide Open Farm-Land",
        description: "A pastoral old West ranch in beautiful Rural, SD. A great place to write to your husband-at-war, practice stoicism or succumb to homoerotic tension.",
        price: 8
      },
      { ownerId: 3,
        address: "85 Corporate Office Ln",
        city : "Los Angeles",
        state: "California",
        country: "USA",
        lat: 34.0549,
        lng: -118.2426,
        name: "Darkened Parking Structure",
        description: "A humid, dimly lit garage attached to a corporate office building by one door and one door only, and to the outside by no doors. What was that sound?",
        price: 8500
      },
      { ownerId: 1,
        address: "8500 Wildcat Way",
        city : "Hometown",
        state: "Ohio",
        country: "USA",
        lat: 40.4173,
        lng: -82.9071,
        name: "American High School",
        description: "Your high school back in your hometown, probably Ohio. Classes will be in session for the duration of your stay; get asked to prom, or tear up a pop quiz in defiance of conformity.",
        price: 1999
      },
      { ownerId: 1,
        address: "8500 Broadway",
        city : "New York",
        state: "New York",
        country: "USA",
        lat: 40.7909,
        lng: -73.974,
        name: "Where Dreams Come True",
        description: "It's always been your dream to make it in the Big Apple! You've just gotta make it here - just GOTTA, you say! If you can, you can make it anywhere!",
        price: 9999
      },
      { ownerId: 2,
        address: "7 Concord Way",
        city : "Lexington",
        state: "Massachusetts",
        country: "USA",
        lat: 49.3399,
        lng: -0.5986,
        name: "The Trenches",
        description: "We're in the thick of it now. Your platoon is nearly wiped out; enjoy the luxury of one-man-armying the Revolution to victory in this classic wartime foxhole.",
        price: 1775
      },
      { ownerId: 1,
        address: "Infinity",
        city : "Everything",
        state: "Everywhere",
        country: "All At Once",
        lat: 0,
        lng: 0,
        name: "The Void",
        description: "Observe all; how it must contain nothing if nothing exists, which it must, for everything exists. Allow this collapsing paradox to give your body and mind a dreadful comfort.",
        price: 100101
      },
    ], options)
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ["Wide Open Farm-Land",
      "Darkened Parking Structure",
      "American High School",
      "Where Dreams Come True",
      "The Trenches",
      "The Void"] }
    }, {});
  }
};
