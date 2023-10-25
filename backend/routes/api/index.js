const router = require('express').Router()

// !API Test Route
router.post('/test', function(req, res) {
  res.json({ requestBody: req.body });
});

module.exports = router
