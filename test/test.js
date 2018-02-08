var should = require('chai').should(),
	expect = require('chai').expect,
	supertest = require('supertest'),
	moment = require('moment'),
	api = supertest('http://localhost:9000/api/v1');

var config = {
	admin_email: "admin@tracker.com",
	admin_password: "password"
};

var fakeuser_token, fakeentry_id, fakeuser_id, admin_token;

describe('API functional testing', function () {
	describe('Sign up - /api/v1/users/', function () {
		it('registering new fake user, should return 200', function (done) {
			api.post('/users/')
				.set('Accept', 'application/x-www-form-urlencoded')
				.send({
					email: 'fakeuser@gmail.com',
					password: 'tracker',
					name: 'fakeuser',
				})
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function (err, res) {
					if (err) {
						done(err);
					} else {
						expect(res.body.access_token).to.not.equal(null);
						done();
					}
				});
		});

		it('registering fake user with duplicate, should return 422 (validation error)', function (done) {
			api.post('/users/')
				.set('Accept', 'application/x-www-form-urlencoded')
				.send({
					email: 'fakeuser@gmail.com',
					password: 'tracker',
					name: 'fakeuser',
				})
				.expect('Content-Type', /json/)
				.expect(422)
				.end(done);
		});
	});

	describe('Login - /api/v1/authenticate', function () {
		it('login as a fake user with wrong credentials, should return 401 (Unauthorized)', function (done) {
			api.post('/authenticate')
				.set('Accept', 'application/x-www-form-urlencoded')
				.send({
					email: 'fakeuser@gmail.com',
					password: 'wrongpassword'
				})
				.expect('Content-Type', /json/)
				.expect(401)
				.end(done);
		});

		it('login as a fake user, should return token', function (done) {
			api.post('/authenticate')
				.set('Accept', 'application/x-www-form-urlencoded')
				.send({
					email: 'fakeuser@gmail.com',
					password: 'tracker'
				})
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function (err, res) {
					if (err) {
						done(err);
					} else {
						expect(res.body.access_token).to.not.equal(null);
						fakeuser_token = res.body.access_token;

						done();
					}
				});
		});
	});

	describe('Get profile - /api/v1/users/profile', function () {
		it('no token, should return 401', function (done) {
			api.get('/users/profile')
				.set('Accept', 'application/json')
				.expect(401)
				.end(done);
		});

		it('token provided, should return 200', function (done) {
			api.get('/users/profile')
				.expect('Content-Type', /json/)
				.set('Accept', 'application/json')
				.set('Authorization', 'Bearer ' + fakeuser_token)
				.expect(200)
				.end(function (err, res) {
					if (err) {
						done(err);
					} else {
						expect(res.body.name).to.equal("fakeuser");
						expect(res.body.email).to.equal("fakeuser@gmail.com");
						expect(res.body.role).to.equal("user");
						fakeuser_id = res.body._id;
						done();

					}
				});
		});
	});

	describe('Update profile - /api/users/', function () {
		it('profile update, should return 200', function (done) {
			api.put('/users/')
				.send({
					name: 'new_fakeuser'
				})
				.set('Accept', 'application/json')
				.set('Authorization', 'Bearer ' + fakeuser_token)
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function (err, res) {
					if (err) {
						done(err);
					} else {
						expect(res.body.name).to.equal("new_fakeuser");
						expect(res.body.email).to.equal("fakeuser@gmail.com");
						expect(res.body.role).to.equal("user");

						done();
					}
				});
		});
	});

	describe('Change password - /api/v1/users/updatePassword', function () {
		it('change password, should return 200', function (done) {
			api.put('/users/updatePassword')
				.send({
					oldPassword: 'tracker',
					newPassword: 'newpassword'
				})
				.set('Accept', 'application/json')
				.set('Authorization', 'Bearer ' + fakeuser_token)
				.expect(200)
				.end(done);
		});
	});

	describe('List of times - /api/v1/times/', function () {
		it('get the list of times tracked, should return 200', function (done) {
			api.get('/times/')
				.set('Accept', 'application/json')
				.set('Authorization', 'Bearer ' + fakeuser_token)
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res) {
					if (err) {
						done(err);
					} else {
						expect(res.body.metadata).to.not.equal(null)
						expect(res.body.results).to.not.equal(null);

						done();
					}
				});
		});
	});

	describe('Add time - /api/v1/times/', function () {
		it('add new time, should return 200', function (done) {
			api.post('/times/')
				.set('Accept', 'application/json')
				.set('Authorization', 'Bearer ' + fakeuser_token)
				.set('Accept', 'application/x-www-form-urlencoded')
				.send({
					date: "2017-10-18",
					distance: 20,
					minutes: 100
				})
				.expect('Content-Type', /json/)
				.expect(201)
				.end(function (err, res) {
					if (err) {
						done(err);
					} else {
					//	expect(moment(res.body.date).format('YYYY-MM-DD')).to.equal("2017-10-18");
						expect(res.body.distance).to.equal(20);
						expect(res.body.minutes).to.equal(100);

						fakeentry_id = res.body._id;

						done();
					}
				});
		});
	});

	describe('Update timezone - /api/v1/times/:id', function () {
		it('update time, should return 200', function (done) {
			api.put("/times/" + fakeentry_id)
				.send({
					distance: 25
				})
				.set('Authorization', 'Bearer ' + fakeuser_token)
				.set('Accept', 'application/x-www-form-urlencoded')
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function (err, res) {
					if (err) {
						done(err);
					} else {
						expect(res.body.distance).to.equal(25);
						fakeentry_id = res.body._id;

						done();
					}
				});
		});
	});

	describe('Remove time - /api/v1/times/:id', function () {
		it('delete time, should return 204', function (done) {
			api.delete("/times/" + fakeentry_id)
				.set('Accept', 'application/json')
				.set('Authorization', 'Bearer ' + fakeuser_token)
				.expect(204)
				.end(done);
		});
	});

	describe('Login - /api/v1/authenticate', function () {
		it('login as an admin, should return token', function (done) {
			api.post('/authenticate')
				.set('Accept', 'application/x-www-form-urlencoded')
				.send({
					email: config.admin_email,
					password: config.admin_password
				})
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function (err, res) {
					if (err) {
						done(err);
					} else {
						expect(res.body.access_token).to.not.equal(null);
						admin_token = res.body.access_token;

						done();
					}
				});
		});
	});

	describe('List of users - /api/v1/users/', function () {
		it('get the list of users, should return 200', function (done) {
			api.get('/users/')
				.set('Accept', 'application/json')
				.set('Authorization', 'Bearer ' + admin_token)
				.expect('Content-Type', /json/)
				.expect(200)
				.end(done);
		});
	});

	describe('Delete users - /api/v1/users/:id', function () {
		it('delete the fake user, should return 204', function (done) {
			api.delete('/users/' + fakeuser_id)
				.set('Accept', 'application/json')
				.set('Authorization', 'Bearer ' + admin_token)
				.expect(204)
				.end(done);
		});
	});
});