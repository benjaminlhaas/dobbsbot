var Twitter = require('twitter');
var credentials = require("./credentials");
var client = new Twitter(credentials);

var sendTweet = function() {
	client.post('statuses/update', {status: 'test tweet ' + Math.random()}, function (error, tweet, response) {
		if (error != null) {
			console.log(error);
		}
	});
};

// client.get('statuses/show/', {id: '747855945355694084'}, function (error, data, response) {
// 	console.log(error);
// 	console.log(data);
// });

exports.handler = function (event, context) {
	sendTweet(context.succeed, context.fail)
};