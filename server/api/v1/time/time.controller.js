'use strict';

const _ = require('lodash');
const Time = require('./time.model');
const moment = require('moment');

const validationError = (res, err) => {
  const response = {
    "status": 422,
    "message": err.messsage
  };

  return res.status(422).json(response);
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

// Get list of times
exports.index = (req, res) => {
  let page = 0;
  let limit = 100;
  let dateFilter = {};
  let query = {};
  if (req.query.page) {
    page = parseInt(req.query.page);
  }
  if (req.query.limit) {
    limit = parseInt(req.query.limit);  
    if (limit == 0) {
      limit = 100;
    }
  }
  if (req.query.startDate) {
    const startDate = moment(req.query.startDate).toDate();
    Object.assign(dateFilter, {$gte: startDate});
  }
  if (req.query.endDate) {
    const endDate = moment(req.query.endDate).toDate();
    Object.assign(dateFilter, {$lte: endDate});
  }

  if (req.user.role == "admin"){
    if (!_.isEmpty(dateFilter)) {
      query = {
        date: dateFilter
      };
    } else {
      query = {};
    }
    Time.find(query)
    .skip(page * limit)
    .limit(limit)
    .exec((err, times) => {
      if(err) { return handleError(res, err); }

      const response = {
        "metadata": {
          "resultset": {
            "count": times.length,
            "offset": page * limit,
            "limit": limit
            }
        },
        "results": times
      }

      return res.status(200).json(response);
    });
  } else {
    if (!_.isEmpty(dateFilter)) {
      query = {
        userId: req.user.id,
        date: dateFilter
      };
    } else {
      query = {
        userId: req.user.id
      };
    }
    
    Time.find(query)
    .skip(page * limit)
    .limit(limit)
    .exec((err, times) => {
      
      if(err) { return handleError(res, err); }

      const response = {
        "metadata": {
          "resultset": {
            "count": times.length,
            "offset": page * limit,
            "limit": limit
          }
        },
        "results": times
      }

      return res.status(200).json(response);
    });
  }
};

// Get a single time
exports.show = (req, res) => {
  if (req.user.role == "admin")
  {
    Time.findById(req.params.id, (err, time) => {
      if(err) { return handleError(res, err); }
      if(!time) { return handle404(); }

      return res.json(time);
    });
  }
  else
  {
    Time.findOne({ userId: req.user.id, _id: req.params.id }, (err, time) => {
      if(err) { return handleError(res, err); }
      if(!time) { return handle404(); }

      return res.json(time);
    });
  }
};

// Creates a new time in the DB
exports.create = (req, res) => {
  var newNote = new Time(req.body);
  newNote.userId = req.user.id;
  if (!newNote.userId) return res.sendStatus({
    "status": 422,
    "message": "Invalid Request"
  });

  Time.create(newNote, (err, time) => {
    if (err) return validationError(res, err);
    
    return res.status(201).json(time);
  });
};

// Updates an existing time in the DB
exports.update = (req, res) => {
  if (req.body._id) { delete req.body._id; }

  if (req.user.role == "admin")
  {
    Time.findById(req.params.id, (err, time) => {
      if (err) return handleError(res, err);
      if(!time) return handle404();

      var updated = _.merge(time, req.body);
      updated.save((err) => {
        if (err) return handleError(res, err);
        return res.status(200).json(time);
      });
    });
  }
  else
  {
    Time.findOne({ userId: req.user.id, _id: req.params.id }, (err, time) => {
      if (err) return handleError(res, err);
      if(!time) return handle404();

      var updated = _.merge(time, req.body);
      updated.save((err) => {
        if (err) return handleError(res, err);
        return res.status(200).json(time);
      });
    });
  }
};

// Deletes a time from the DB
exports.destroy = (req, res) => {
  if (req.user.role == "admin")
  {
    Time.findById(req.params.id, (err, time) => {
      if(err) { return handleError(res, err); }
      if(!time) { return handle404(); }

      time.remove((err) => {
        if(err) { return handleError(res, err); }
        return res.sendStatus(204);
      });
    });
  }
  else
  {
    Time.findOne({ userId: req.user.id, _id: req.params.id }, (err, time) => {
      if (err) { return handleError(res, err); }
      if (!time) { return handle404(); }

      time.remove((err) => {
        if(err) { return handleError(res, err); }
        return res.sendStatus(204);
      });
    });
  }
};