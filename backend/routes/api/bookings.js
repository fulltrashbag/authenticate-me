const express = require('express');
const { Op } = require('sequelize')
const bcrypt = require('bcryptjs');

const { restoreUser } = require('../../utils/auth')
const { User } = require('../../db/models');

const { check } = require('express-validator')
const {handleValidationErrors} = require('../../utils/validation')

const router = express.Router();

router.get('/current', (req, res, next) => {

})

router.put('/:bookingid', (req, res, next) => {

})

router.delete('/:bookingid', (req, res, next) => {

})

module.exports = router
