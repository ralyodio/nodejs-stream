var config = {};

config.port = 8080;
config.address = '192.168.1.64';
config.twitter_username = process.env.TWITTER_USERNAME || 'my_username';
config.twitter_password = process.env.TWITTER_PASSWORD || 'my_password';

module.exports = config;
