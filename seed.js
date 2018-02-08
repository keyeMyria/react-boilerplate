// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const mongoose = require('mongoose');
const config = require('./server/config/environment');
const User = require('./server/api/v1/user/user.model');
const Time = require('./server/api/v1/times/time.model');

const conn = mongoose.connect(config.mongo.uri, config.mongo.options, (err) => {
	mongoose.connection.db.dropDatabase();

	User.create(
	    {
		    name: 'admin',
		    email: 'admin@tracker.com',
		    role: 'admin',
		    password: 'password'
	    },
	    {
		    name: 'editor',
		    email: 'editor@tracker.com',
		    role: 'manager',
		    password: 'password'
	    },
	    {
		    name: 'tester',
		    email: 'tester@tracker.com',
		    password: 'password'
		},
		{
		    name: 'zhenyu',
		    email: 'zhenyu@tracker.com',
		    password: 'password'
		},	() => {
	  		console.log('Finished populating users.');

	  		User.findOne({email: 'tester@tracker.com'}, (err, usr) => {
				if (err) done(err);

				Time.create(
				    {
					    userId: usr._id,
						distance: 100,
						minutes: 30,
						active: true
				    },
				    {
					    userId: usr._id,
						distance: 130,
						minutes: 60,
						active: true
				    },
				    {
					    userId: usr._id,
						distance: 180,
						minutes: 10,
						active: true
				    },	() => {
				    	console.log('Finished populating notes.');
				    	process.exit();
				    }
				);
			})
		}
	);
});