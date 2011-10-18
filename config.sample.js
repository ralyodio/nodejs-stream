var config = {};

config.port = 8080;
config.address = '127.0.0.7';
config.twitter_username = process.env.TWITTER_USERNAME || 'my_username';
config.twitter_password = process.env.TWITTER_PASSWORD || 'my_password';

module.exports = config;
