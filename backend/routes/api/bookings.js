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

router.put('/:bookingid', requireAuth, async (req, res, next) => {
  const bookingId = req.params.bookingid;
  const { user } = req;
  const { startDate, endDate } = req.body;

  if (isNaN(bookingId)) {
    res.status(404);
    return res.json({
      message: "Booking couldn't be found"
    })
  }

  const formattedStartDate = new Date(startDate).getTime();
  const formattedEndDate = new Date(endDate).getTime();

  const bookingToEdit = await Booking.findByPk(bookingId);

  //*if query returns null from params
  if (!bookingToEdit) {
    res.status(404);
    return res.json({
      message: "Booking couldn't be found"
    })
  }

  //* if you're trying to book your own spot
  if (user.id != bookingToEdit.userId) {
    res.status(403);
    return res.json({
      message: 'Forbidden'
    })
  }

  //* if requested end date is a paradox
  if (formattedEndDate <= formattedStartDate) {
    res.status(400);
    return res.json({
      message: "Bad Request",
      errors: {
        endDate: 'endDate cannot be on or before startDate'
      }
    })
  }

  const spotId = bookingToEdit.spotId;
  const spotWithBooking = await Spot.findByPk(spotId)
  const currentBookings = await Booking.findAll({
    where: {
      spotId: spotId
    }
  })

  let errors = {}

  //*loop through current bookings
  for (let booking of currentBookings) {
    const existingBookingStart = new Date(booking.startDate).getTime();
    const existingBookingEnd = new Date(booking.endDate).getTime();

    //* new start date is in between an existing booking
    if (existingBookingStart <= formattedStartDate && formattedStartDate <= existingBookingEnd) {
      console.log('meep')
      errors.startDate = "Start date conflicts with an existing booking"
    }

    //* new end date is in between an existing booking
    if (existingBookingStart <= formattedEndDate && formattedEndDate <= existingBookingEnd) {
      console.log('map')
      errors.endDate = "End date conflicts with an existing booking"
    }

    //* new booking encapsulates an existing booking
    if (existingBookingStart > formattedStartDate && existingBookingEnd < formattedEndDate) {
      console.log('moop')
      errors.startDate = "Start date conflicts with an existing booking";
      errors.endDate = "End date conflicts with an existing booking";
    }
  }

  if (Object.keys(errors).length) { //!empty object still truthy, check length of keys collected
    res.status(403);
    return res.json({
      message: "Sorry, this spot is already booked for the specified dates",
      errors: { ...errors }
    })
  }

  await bookingToEdit.set({
    startDate: startDate,
    endDate: endDate
  })

  bookingToEdit.save();
  res.json(bookingToEdit)
})

router.delete('/:bookingid', async (req, res, next) => {
  const bookingId = req.params.bookingid;
  const { user } = req;

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
