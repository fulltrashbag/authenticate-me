const express = require('express');
const { Op } = require('sequelize')
const bcrypt = require('bcryptjs');

const { restoreUser, requireAuth } = require('../../utils/auth')
const { User, Review, ReviewImage, Spot, SpotImage } = require('../../db/models');


const { check } = require('express-validator')
const { handleValidationErrors } = require('../../utils/validation')

const router = express.Router();

router.get('/current', requireAuth, async (req, res, next) => {
  //!Adjust how date/time createdAt is displayed
  const { user } = req;
  const myReviews = await Review.findAll({
    where: {
      userId: user.id
    },
    include: [
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName']
      },
      {
        model: Spot,
        attributes: {
          exclude: ['description', 'createdAt', 'updatedAt'],
        }
      },
      {
        model: ReviewImage,
        attributes: ['id', 'url']
      },
    ]
  })

  for (let review of myReviews) {
    const previewImage = await SpotImage.findOne({
      where: { spotId: review.spotId }
    })
    review.Spot.dataValues.previewImage = previewImage.url
  }
  //!LAZY LOADED, N+1 == REFACTOR, COMMENT BELOW IS STARTER

  //   include: [
  //     { through: SpotImage,
  //       as: "previewImage",
  //       attributes: {
  //         include: ['url']
  //       }
  //     }
  //   ]
  // }
  res.json({ Reviews: myReviews })
})

router.post('/:reviewid/images', requireAuth, async (req, res, next) => {
  const { user } = req;
  const { url } = req.body;
  const reviewId = req.params.reviewid;

  const myReview = await Review.findByPk(reviewId)

  //check if review exists
  if (!myReview) {
    res.status(404);
    return res.json({message: "Review couldn't be found"});
  }
  //check if it's yours
  if (myReview.userId !== user.id) {
    res.status(403);
    return res.json({message: "Forbidden"})
  }
  //check against current # of images
  const currentImages = await ReviewImage.findAll({where: {reviewId}})
  if (currentImages.length >= 10) {
    res.status(403);
    return res.json({message: "Maximum number of images for this resource was reached"})
  }

  {const myReviewImage = await myReview.createReviewImage({
    url
  })

  res.json({ id: myReviewImage.id, url: myReviewImage.url })}
})

router.put('/:reviewid', (req, res, next) => {

})

router.delete('/:reviewid', (req, res, next) => {

})

module.exports = router
