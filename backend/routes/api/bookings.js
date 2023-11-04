const express = require('express');
const { Op } = require('sequelize')
const bcrypt = require('bcryptjs');

const { restoreUser, requireAuth } = require('../../utils/auth')
const { User, Booking, Spot, SpotImage } = require('../../db/models');

const { check } = require('express-validator')
const { handleValidationErrors } = require('../../utils/validation')

const router = express.Router();

router.get('/current', requireAuth, async (req, res, next) => {
  const { user } = req;
  const myBookings = await Booking.findAll({
    where: {
      userId: user.id
    },
    include: [
      {
        model: Spot,
        attributes: {
          exclude: ['description', 'createdAt', 'updatedAt'],

        }
      }
    ]
  })

  for (let booking of myBookings) {
    const previewImage = await SpotImage.findOne({
      where: {
        spotId: booking.spotId,
        preview: true
      }
    })
    booking.Spot.dataValues.previewImage = previewImage.url
  }

  res.json({ Bookings: myBookings });
})

router.put('/:bookingid', (req, res, next) => {
  const bookingId = req.params.bookingid;
  const {user} = req;
  const {startDate, endDate} = req.body;

})

router.delete('/:bookingid', async (req, res, next) => {
const bookingId = req.params.bookingid;
const {user} = req;

const bookingToDelete = await Booking.findByPk(bookingId);
const spotWithBooking = await Spot.findByPk(bookingToDelete.spotId)

if (bookingToDelete.userId != user.id && spotWithBooking.ownerId != user.id) {
  // console.log(bookingToDelete, user.id, spotWithBooking)
  res.status(403);
  return res.json({ message: "Forbidden" })
}

if (!bookingToDelete) {
  res.status(404);
  return res.json({ message: "Booking couldn't be found" });
}

//!Check if booking has already started
let bookingUnixDate = new Date(bookingToDelete.startDate).getTime()
if (bookingUnixDate < new Date().getTime()) {
  res.status(403);
  return res.json({
    message: "Bookings that have been started can't be deleted"
  })
}

await bookingToDelete.destroy();
res.json({
  message: "Successfully deleted"
})

})

module.exports = router
