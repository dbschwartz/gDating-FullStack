var config = {};

config.mongoURI = {
  test: 'mongodb://localhost/gdating-db-testing',
  development: 'mongodb://localhost/gdating-db',
  production: process.env.MONGODB_URI
};

module.exports = config;