'use strict';

const express = require('express');
const controller = require('./user.controller');
const config = require('../../../config/environment');
const auth = require('../../../auth/auth.service');
const router = express.Router();

/*
* new user sign-up
*/
router.post('/', controller.create);

/*
* user authenticated area
*/
// get own profile information
router.get('/profile', auth.isAuthenticated(), controller.me);

// update profile
router.put('/', auth.isAuthenticated(), controller.updateMyProfile);
router.put('/updatePassword', auth.isAuthenticated(), controller.changeMyPassword);

/*
* user manager, admin area
*/
// create a new user
router.post('/register', auth.hasRole('manager'), controller.registerUser);

// get the list of users
router.get('/', auth.hasRole('manager'), controller.index);

// get the profile information of particular user
router.get('/profile/:id', auth.hasRole('manager'), controller.show);

// update the information of user
router.put('/:id', auth.hasRole('manager'), controller.updateUser);
router.put('/updatePassword/:id', auth.hasRole('manager'), controller.changePassword);

// delete a user
router.delete('/:id', auth.hasRole('manager'), controller.destroy);

module.exports = router;
