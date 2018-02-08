'use strict';

const express = require('express');
const passport = require('passport');
const auth = require('../auth.service');
const router = express.Router();

router.post('/', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    const error = err || info;
    if (error) return res.status(401).json({
      status: 401,
      message: 'Unauthorized'
    });
    if (!user) return res.status(404).json({
      status: 404,
      message: 'User not found'
    });

    const token = auth.signToken(user._id, user.role);
    res.json({
    	access_token: token,
      	expires_in: 5*60*60
    });
  })(req, res, next)
});

module.exports = router;