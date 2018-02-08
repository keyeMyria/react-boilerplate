'use strict';

const express = require('express');
const controller = require('./time.controller');
const auth = require('../../../auth/auth.service');
const router = express.Router();

/*
* user-authenticated area
*/

// get the list of time entries
router.get('/', auth.isAuthenticated(), controller.index);

// get the particular time entry
router.get('/:id', auth.isAuthenticated(), controller.show);

// create a new time entry
router.post('/', auth.isAuthenticated(), controller.create);

// update a time entry
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);

// delete a time entry
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

module.exports = router;
