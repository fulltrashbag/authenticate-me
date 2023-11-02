const express = require('express');
const { Op } = require('sequelize')
const bcrypt = require('bcryptjs');

const { restoreUser, requireAuth } = require('../../utils/auth')
const { User, Spot, SpotImage, Review } = require('../../db/models');

const { check } = require('express-validator')
const {handleValidationErrors} = require('../../utils/validation')

const router = express.Router();

//!GETS
router.get('/current', requireAuth, async (req, res, next) => {
  const {user} = req;

  const mySpots = await Spot.findAll({
    where: {
      ownerId: user.id
    }
  })

  for (let spot of mySpots) {
    const previewImage = await SpotImage.findOne({
      where: {
        spotId: spot.id,
        preview: true
      }
    })
      // console.log(previewImage)
      spot.dataValues.previewImage = previewImage.url
  }

  res.json({Spots: mySpots})
})

router.get('/:spotid/reviews', (req, res, next) => {

})

router.get('/:spotid/bookings', (req, res, next) => {

})

router.get('/:spotid', (req, res, next) => {

})

router.get('/', (req, res, next) => {
  const allSpots = Spot.findAll()
})

//!POSTS
router.post('/:spotid/bookings', (req, res, next) => {

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
  const {user} = req

  const spotToDelete = await Spot.findByPk(spotId)

  if (spotToDelete.ownerId !== user.id) {
    res.status = 403;
    res.json({ message: "Forbidden"})
  }
})


module.exports = router
