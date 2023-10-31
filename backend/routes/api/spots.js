const express = require('express');
const { Op } = require('sequelize')
const bcrypt = require('bcryptjs');

const { restoreUser } = require('../../utils/auth')
const { User } = require('../../db/models');

const { check } = require('express-validator')
const {handleValidationErrors} = require('../../utils/validation')

const router = express.Router();

//!GETS
router.get('/current', (req, res, next) => {

})

router.get('/:spotid/reviews', (req, res, next) => {

})

router.get('/:spotid/bookings', (req, res, next) => {

})

router.get('/:spotid', (req, res, next) => {

})

router.get('/', (req, res, next) => {

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
router.delete('/:spotid', (req, res, next) => {

})


module.exports = router
