'use strict';

const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const TimeSchema = new Schema({
  userId: {type: String}, 
  date: {type: Date, default: Date.now},
  distance: {type: Number, default: 0},
  minutes: {type: Number, min:0, max:1440, default: 0},
  active: Boolean
});

/**
 * Validations
 */
const isExisting = (value) => {
  return value && value.length;
};

TimeSchema
  .path('date')
  .validate((date) => {
    return isExisting(date);
  }, 'time entry can not be saved without name.');


TimeSchema
  .path('distance')
  .validate((distance) => {
    return isExisting(distance);
  }, 'time entry can not be saved without the distance.');

TimeSchema
  .path('minutes')
  .validate((minutes) => {
    return isExisting(minutes);
  }, 'time entry can not be saved without minutes.');

module.exports = mongoose.model('Time', TimeSchema);
