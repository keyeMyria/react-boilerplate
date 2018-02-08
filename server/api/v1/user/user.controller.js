'use strict';

const User = require('./user.model');
const config = require('../../../config/environment');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const validationError = (res, err) => {
  return res.status(422).json({
    "status": 422,
    "message": err.message
  });
};

const handleError = (res, err) => {
  const response = {
    "status": 500,
    "message": err.message
  };

  return res.status(500).send(response);
}

const handle404 = () => {
  const response = {
    "status": 404,
    "message": "Sorry! Not found."
  };

  return res.status(404).send(response);
}

/**
 * user sign-up
 */
exports.create = (req, res) => {
  const newUser = new User(req.body);
  
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.save((err, user) => {
    if (err) return validationError(res, err);

    const token = jwt.sign({_id: user._id }, config.secrets.session, { expiresIn: 1*60*60 });
    res.json({
      access_token: token,
      expires_in: 1*60*60
    });
  });
};

/**
 * admin register user
 */
exports.registerUser = (req, res) => {

  const newUser = new User(req.body);
  
  newUser.provider = 'local';
  newUser.role = req.body.role;
  newUser.save((err, user) => {
    if (err) return validationError(res, err);

    const token = jwt.sign({_id: user._id }, config.secrets.session, { expiresIn: 1*60*60 });
    res.json({
      access_token: token,
      expires_in: 1*60*60
    });
  });
};

/**
 * Get list of users
 * restriction: 'manager', 'admin'
 */
exports.index = (req, res) => {
  User.find({}, '-salt -hashedPassword', (err, users) => {
    if(err) return handleError(req, res);

    const response = {
      "metadata": {
        "resultset": {
          "count": users.length,
          "offset": 0,
          "limit": 100
          }
      },
      "results": users
    }
    res.status(200).json(response);
  });
};

/**
 * Get a single user
 * restriction: 'manager', 'admin'
 */
exports.show = (req, res, next) => {
  const userId = req.params.id;

  User.findById(userId, (err, user) => {
    if (err) return next(err);
    if (!user) handle404();

    res.status(200).json(user.profile);
  });
};

/*
 * update a single user
 * restriction: 'manager', 'admin'
*/
exports.updateUser = (req, res) => {
  if (req.body._id) { delete req.body._id; }
  if (req.body.password) { delete req.body.password; }
  // if (req.user.role != "admin" && req.body.role && req.body.role == "admin") return res.sendStatus(403);

  User.findById(req.params.id, (err, user) => {
    if (err) return next(err);
    if (!user) return res.sendStatus(404);

    const updated = _.merge(user, req.body);
    updated.save((err) => {
      if (err) return validationError(res, err);
      
      return res.status(200).json(user);
    });
  });
};

/**
 * Change a single user's password
 * restriction: 'manager', 'admin'
 */
exports.changePassword = (req, res, next) => {
  const userId = req.params.id;
  const oldPass = String(req.body.oldPassword);
  const newPass = String(req.body.newPassword);

  User.findById(userId, (err, user) => {
    if(user.authenticate(oldPass)) {
      user.password = newPass;

      user.save((err) => {
        if (err) return validationError(res, err);
        res.sendStatus(200);
      });
    } else {
      res.status(403).json({
        "status": 403,
        "message": "Forbidden"
      });
    }
  });
};

/**
 * Deletes a user
 * restriction: 'manager', 'admin'
 */
exports.destroy = (req, res) => {
  User.findOne({ _id: req.params.id }, (err, user) => {
    if (err) return handleError(req, res);
    if (!user) return res.sendStatus(404);
    // if (req.user.role != "admin" && user.role == "admin") return res.sendStatus(403);

    user.remove(() => {
      return res.sendStatus(204);
    });
  });
};

/**
 * Get my info
 */
exports.me = (req, res, next) => {
  const userId = req.user._id;

  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', (err, user) => { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return handle404();
    
    res.status(200).json(user);
  });
};

/*
 * update a user
*/
exports.updateMyProfile = (req, res) => {
  const userId = req.user._id;
  if (req.body._id) { delete req.body._id; }
  if (req.body.password) { delete req.body.password; } // strip parameters of password
  if (req.body.role) { delete req.body.role; }

  User.findById(userId, (err, user) => {
    if (err) return next(err);
    if (!user) return handle404();

    const updated = _.merge(user, req.body);
    updated.save((err) => {
      if (err) return validationError(res, err);
      
      return res.status(200).json(user);
    });
  });
};

/**
 * Change a user's password
 */
exports.changeMyPassword = (req, res, next) => {
  const userId = req.user._id;
  const oldPass = String(req.body.oldPassword);
  const newPass = String(req.body.newPassword);

  User.findById(userId, (err, user) => {
    if(user.authenticate(oldPass)) {
      user.password = newPass;

      user.save((err) => {
        if (err) return validationError(res, err);
        res.sendStatus(200);
      });
    } else {
      res.status(403).json({
        "status": 403,
        "message": "Forbidden"
      });
    }
  });
};

/**
 * Authentication callback
 */
exports.authCallback = (req, res, next) => {
  res.redirect('/');
};
