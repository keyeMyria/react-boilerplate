'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/tracker-dev',
    options: { useMongoClient: true }
  },

  seedDB: true
};
