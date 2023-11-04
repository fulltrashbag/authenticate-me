const express = require('express');
const { Op } = require('sequelize')
const bcrypt = require('bcryptjs');

const { restoreUser, requireAuth } = require('../../utils/auth')
const { User, Review, ReviewImage, Spot, SpotImage } = require('../../db/models');


const { check } = require('express-validator')
const { handleValidationErrors } = require('../../utils/validation')

const router = express.Router();

router.get('/current', requireAuth, async (req, res, next) => {
  const { user } = req;

  //*Find all of my reviews, including requested resources
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
  //* Can't eager-load data from another table and alias as a
  //* column on another table... lazy load loop
  for (let review of myReviews) {
    //*get the image set to preview...
    const previewImage = await SpotImage.findOne({
      where: {
        spotId: review.spotId,
        preview: true
      }
    })
    review.Spot.dataValues.previewImage = previewImage.url
  }

  res.json({ Reviews: myReviews })
})

router.post('/:reviewid/images', requireAuth, async (req, res, next) => {
  const { user } = req;
  const { url } = req.body;
  const reviewId = req.params.reviewid;
  //* Did you put in a number?
  if (isNaN(reviewId)) {
    res.status(404);
    return res.json({
      message: "Spot couldn't be found"
    })
  }
  //* Let's  find it...
  const myReview = await Review.findByPk(reviewId)

  //check if review exists
  if (!myReview) {
    res.status(404);
    return res.json({ message: "Review couldn't be found" });
  }
  //check if it's yours
  if (myReview.userId !== user.id) {
    res.status(403);
    return res.json({ message: "Forbidden" })
  }
  //check against current # of images
  const currentImages = await ReviewImage.findAll({ where: { reviewId } })
  if (currentImages.length >= 10) {
    res.status(403);
    return res.json({ message: "Maximum number of images for this resource was reached" })
  }

  const myReviewImage = await myReview.createReviewImage({
    url
  })

  res.json({ id: myReviewImage.id, url: myReviewImage.url })

})

router.put('/:reviewid', requireAuth, async (req, res, next) => {
  const reviewId = req.params.reviewid;
  const { user } = req
  const { review, stars } = req.body

  //* Did you put in a number?
  if (isNaN(reviewId)) {
    res.status(404);
    return res.json({
      message: "Review couldn't be found"
    })
  }
  //*It's a number, let's find her
  const myReview = await Review.findByPk(reviewId);

  //* We didn't find one?
  if (!myReview) {
    res.status(404);
    return res.json({ message: "Review couldn't be found" });
  }

  // *is it actually mine?
  if (myReview.userId !== user.id) {
    res.status(403);
    return res.json({ message: "Forbidden" })
  }

  // *VALIDATION ERRORS - Refactor into a util eventually
  const errors = {}
  if (!review) errors.review = "Review text is required"
  if (!stars || stars < 1 || stars > 5) errors.stars = "Stars must be an integer from 1 to 5"
  if (Object.keys(errors).length) {
    return res.status(400).json({
      message: "Bad Request",
      errors: { ...errors }
    })
  }
  //*Set to new inputs...
  myReview.set({
    review: review,
    stars: stars
  });
  //*save and return!
  myReview.save()
  res.json(myReview)
})

router.delete('/:reviewid', requireAuth, async (req, res, next) => {
  const { user } = req;
  const reviewId = req.params.reviewid;

  const reviewToDelete = await Review.findByPk(reviewId)

  if (!reviewToDelete) {
    res.status(404);
    return res.json({ message: "Review couldn't be found" });
  }

  if (reviewToDelete.userId !== user.id) {
    res.status(403);
    return res.json({ message: "Forbidden" })
  }

  await reviewToDelete.destroy()

  res.json({ message: "Successfully deleted" })
})

module.exports = router
