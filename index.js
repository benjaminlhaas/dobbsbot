var readline = require('readline');
var AWS = require('aws-sdk');
var s3_params = require("s3_params");

function sendTweet() {
	// Get file from S3 and feed it into the ReadLine interface
	var s3 = new AWS.S3();
	var params = {Bucket: s3_params.bucket, Key: s3_params.key};

	var rl = readline.createInterface({
	    input: s3.getObject(params).createReadStream()
	});

	var output = "";
	var firstLine = true;
	var lineToTweet = "";

	// ReadLine interface receives "line" event each time a line is read, and "close" event when the file is closed
	rl.on('line', function(line) {

		// If we're reading the first line of the file, tweet and remember it. Otherwise append it to output
		if (firstLine == true) {

		    firstLine = false;

		    lineToTweet = line;

			var Twitter = require('twitter');
			var credentials = require("credentials");
			var client = new Twitter(credentials);

			client.post('statuses/update', {status: lineToTweet}, function (error, tweet, response) {
				if (error != null) {
					console.log(error);
				}
			});

		}
		else
			output += line + '\n';
	})
	.on('close', function() {

		// Move the first line to the end of the file (so this can repeat infinitely) and upload to S3
		output += lineToTweet;

		var params_new = {Bucket: s3_params.bucket, Key: s3_params.key, Body: output, ContentType: 'text/plain'};

		s3.upload(params_new, function(err, data) {
			if (err) {
				console.log(err);
			} 
			else {
				console.log(data.ETag);
			}
		});
	});
}

// Set up the exports.handler for AWS Lambda
exports.handler = function (event, context) {
	sendTweet(context.succeed, context.fail)
};
