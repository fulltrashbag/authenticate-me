const express = require('express');
const { Op } = require('sequelize')
const bcrypt = require('bcryptjs');

const { restoreUser, requireAuth } = require('../../utils/auth')
const { User, Spot, SpotImage, Review, ReviewImage, Booking } = require('../../db/models');

const { check } = require('express-validator')
const { handleValidationErrors } = require('../../utils/validation')

const router = express.Router();

//!GETS
router.get('/current', requireAuth, async (req, res, next) => {
  const { user } = req;

  const mySpots = await Spot.findAll({
    where: {
      ownerId: user.id
    }
  })

  for (let spot of mySpots) {
    //*ADD PREVIEWIMAGE
    const previewImage = await SpotImage.findOne({
      where: {
        spotId: spot.id,
        preview: true
      }
    })

    if (previewImage) {
      spot.dataValues.previewImage = previewImage.url
    } else {
      spot.dataValues.previewImage = "This preview image may have been removed"
    }
    //*FIND AVGRATING
    const reviews = await Review.count({
      where: {
        spotId: spot.id
      }
    })

    const stars = await Review.sum('stars', {
      where: {
        spotId: spot.id
      }
    })

    if (!reviews) {
      spot.dataValues.avgRating = "This spot has not been rated yet"
    } else {
      let avgRating = (stars / reviews).toFixed(1);
      spot.dataValues.avgRating = avgRating
    }
  }
  res.json({ Spots: mySpots })
})

router.get('/:spotid/reviews', async (req, res, next) => {
  const spotId = req.params.spotid;

  const spotToPullReviews = await Spot.findOne({
    where: {
      id: spotId
    }
  })

  const reviews = await Review.findAll({
    where: {
      spotId: spotToPullReviews.id
    },
    include: {
      model: User,
      attributes: ['id', 'firstName', 'lastName']
    }
  })

  for (review of reviews) {
    const reviewImages = await ReviewImage.findAll({
      where: {
        reviewId: review.id
      },
      attributes: ['id', 'url']
    })
    review.dataValues.ReviewImages = reviewImages;
  }

  res.json({ Reviews: reviews })

})

router.get('/:spotid/bookings', requireAuth, async (req, res, next) => {
  const spotId = req.params.spotid;
  const { user } = req;

  //*Check if spot exists
  const spotExists = await Spot.findOne({
    where: {
      id: spotId
    }
  })

  if (!spotExists) {
    res.status(404);
    return res.json({ message: "Spot couldn't be found" })
  }

  //* non-owner of spot?
  if (user.id !== spotExists.ownerId) {
    const bookings = await Booking.findAll({
      where: {
        spotId: spotId
      },
      attributes: ['spotId', 'startDate', 'endDate']
    })
    return res.json(bookings)
  }

  if (user.id == spotExists.ownerId) {
    const bookings = await Booking.findAll({
      where: {
        spotId: spotId
      },
      include: {
        model: User,
        attributes: ['id', 'firstName', 'lastName']
      }
    })
    return res.json(bookings)
  }

})

router.get('/:spotid', async (req, res, next) => {
  const spotId = req.params.spotid;

  const spot = await Spot.findByPk(spotId)

  if (!spot) {
    res.status(404);
    res.json({ message: "Spot couldn't be found" })
  }

  //*ADD PICS
  const images = await SpotImage.findAll({
    where: {
      spotId: spotId
    },
    attributes: ['id', 'url', 'preview']
  })

  spot.dataValues.SpotImages = images

  //*FIND AVGRATING
  const reviews = await Review.count({
    where: {
      spotId: spot.id
    }
  })

  const stars = await Review.sum('stars', {
    where: {
      spotId: spot.id
    }
  })

  let avgRating = (stars / reviews).toFixed(1)
  spot.dataValues.avgRating = avgRating

  res.json(spot)
})

router.get('/', async (req, res, next) => {

  const allSpots = await Spot.findAll();

  for (spot of allSpots) {
    //* GET PICS
    const previewImage = await SpotImage.findOne({
      where: {
        spotId: spot.id,
        preview: true
      }
    })

    if (previewImage) {
      spot.dataValues.previewImage = previewImage.url
    } else {
      spot.dataValues.previewImage = "This preview image may have been removed"
    }

    //*FIND AVGRATING
    const reviews = await Review.count({
      where: {
        spotId: spot.id
      }
    })

    const stars = await Review.sum('stars', {
      where: {
        spotId: spot.id
      }
    })

    if (!reviews) {
      spot.dataValues.avgRating = "This spot has not been rated yet"
    } else {
      let avgRating = (stars / reviews).toFixed(1);
      spot.dataValues.avgRating = avgRating
    }

  }

  res.json(allSpots)
})

//!POSTS
router.post('/:spotid/bookings', requireAuth, async (req, res, next) => {
  const { user } = req;
  const spotId = req.params.spotid;
  const { startDate, endDate } = req.body;

  const formattedStartDate = new Date(startDate).getTime();
  const formattedEndDate = new Date(endDate).getTime();

  const spotToBook = await Spot.findByPk(spotId);

  //*if query returns null from params
  if (!spotToBook) {
    res.status(404);
    return res.json({
      message: "Spot couldn't be found"
    })
  }

  //* if you're trying to book your own spot
  if (user.id === spotToBook.ownerId) {
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

  //*find current bookings to compare request against
  const currentBookings = await Booking.findAll({
    where: {
      spotId: spotId
    }
  })

  //* to collect errors re: booking conflicts
  let errors = {}

  //*loop through current bookings
  for (booking of currentBookings) {
    const existingBookingStart = new Date(booking.startDate).getTime();
    const existingBookingEnd = new Date(booking.endDate).getTime();

    //* new start date is in between existing booking
    if (existingBookingStart <= formattedStartDate <= existingBookingEnd) {
      errors.startDate = "Start date conflicts with an existing booking"
    }

    //* new end date is in between existing booking
    if (existingBookingStart <= formattedEndDate <= existingBookingEnd) {
      errors.endDate = "End date conflicts with an existing booking"
    }

    //* new booking encapsulates existing booking
    if (existingBookingStart > formattedStartDate && existingBookingEnd < formattedEndDate) {
      errors.startDate = "Start date conflicts with an existing booking";
      errors.endDate = "End date conflicts with an existing booking";
    }

    //* Did we get any errors? spread them into the way the docs say
    if (Object.keys(errors).length) { //!empty object still truthy, check length of keys collected
      res.status(403);
      return res.json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: { ...errors }
      })
    }

    const validBooking = await spotToBook.createBooking({
      userId: user.id,
      startDate,
      endDate
    })

    res.json(validBooking)

  }
})

router.post('/:spotid/images', (req, res, next) => {

})

router.post('/:spotid/reviews', (req, res, next) => {

})

router.post('/', (req, res, next) => {

})

//!PUT
router.put('/:spotid', (req, res, next) => {

})

//!DELETE
router.delete('/:spotid', async (req, res, next) => {
  const spotId = req.params.spotid;
  const { user } = req

  const spotToDelete = await Spot.findByPk(spotId)

  if (spotToDelete.ownerId !== user.id) {
    res.status = 403;
    return res.json({ message: "Forbidden" })
  }



})


module.exports = router
