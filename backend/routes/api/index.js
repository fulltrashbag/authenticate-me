const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spots.js');
const reviewsRouter = require('./reviews.js');
const bookingsRouter = require('./bookings.js');
const { restoreUser } = require('../../utils/auth.js');
const { SpotImage, Spot, User, Review, ReviewImage } = require('../../db/models')

router.use(restoreUser);

router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/spots', spotsRouter);
router.use('/reviews', reviewsRouter);
router.use('/bookings', bookingsRouter);

//!ONE-OFF SPOT-IMAGES
router.delete('/spot-images/:imageid', async (req, res, next) => {
  const { user } = req;
  const imageId = req.params.imageid

  if (isNaN(imageId)) {
    res.status(404);
    return res.json({
      message: "Spot Image couldn't be found"
    })
  }

  const imageToDelete = await SpotImage.findByPk(imageId)

  if (!imageToDelete) {
    res.status(404);
    return res.json({ message: "Spot Image couldn't be found" })
  }

  const imageSpotId = imageToDelete.spotId
  const spotForImage = await Spot.findByPk(imageSpotId)

  if (user.id !== spotForImage.ownerId) {
    res.status(403);
    return res.json({ message: "Forbidden" })
  }


  await imageToDelete.destroy();
  res.status(200);
  res.json({ message: "Successfully deleted" })

})

//!ONE-OFF REVIEW-IMAGES
router.delete('/review-images/:imageid', async (req, res, next) => {
  const { user } = req;
  const imageId = req.params.imageid;

  if (isNaN(imageId)) {
    res.status(404);
    return res.json({
      message: "Review Image couldn't be found"
    })
  }

  const imageToDelete = await ReviewImage.findByPk(imageId);

  if (!imageToDelete) {
    res.status(404);
    return res.json({ message: "Review Image couldn't be found" })
  };
  const imageReviewId = imageToDelete.reviewId;

  const reviewForImage = await Review.findByPk(imageReviewId);


  if (user.id !== reviewForImage.userId) {
    res.status(403);
    return res.json({ message: "Forbidden" })
  };


  await imageToDelete.destroy();
  res.status(200);
  res.json({ message: "Successfully deleted" });

})


// !API Test Route
router.post('/test', function (req, res) {
  res.json({ requestBody: req.body });
});

module.exports = router

//* Middleware Tests
// router.get('/set-token-cookie', async (_req, res) => {
//   const user = await User.findOne({
//     where: {
//       username: 'Demo-lition'
//     }
//   });
//   setTokenCookie(res, user);
//   return res.json({ user: user });
// });

// router.get('/restore-user',
//   (req, res) => {
//     return res.json(req.user);
//   }
// );

// router.get('/require-auth',
//   requireAuth,
//   (req, res) => {
//     return res.json(req.user);
//   }
// );
