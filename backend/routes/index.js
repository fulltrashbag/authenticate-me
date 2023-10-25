const express = require('express');
const router = express.Router();

// !TEST ROUTE
// router.get('/hello/world', (req, res) => {
//   res.cookie('XSRF-TOKEN', req.csrfToken());
//   res.send('Hello World!')
// });

// *Dev CSRF token reset
router.get("/api/csrf/restore", (req, res) => {
  const csrfToken = req.csrfToken();
  res.cookie("XSRF-TOKEN", csrfToken);
  res.status(200).json({
    'XSRF-Token': csrfToken
  });
});

module.exports = router;
