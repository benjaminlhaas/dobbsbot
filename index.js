var readline = require('readline');

var AWS = require('aws-sdk');
//AWS.config.update({region: 'us-east-1'});
var s3 = new AWS.S3();

var s3_params = require("./s3_params");
var params = {Bucket: s3_params.bucket, Key: s3_params.key};

var rl = readline.createInterface({
    input: s3.getObject(params).createReadStream()
});

var output = "";
var firstLine = true;
var lineToTweet = "";

rl.on('line', function(line) {
	if (firstLine == true) {

	    firstLine = false;

		var Twitter = require('twitter');
		var credentials = require("./credentials");
		var client = new Twitter(credentials);

		client.post('statuses/update', {status: line}, function (error, tweet, response) {
			if (error != null) {
				console.log(error);
			}
		});

	}
	else
		output += line + '\n';
})
.on('close', function() {
	output += lineToTweet;
	//console.log(output);

	var params_new = {Bucket: s3_params.bucket, Key: s3_params.key, Body: output, ContentType: 'text/plain'};

	s3.upload(params_new, function(err, data) {
		if (err) {
			console.log(err);
			//context.fail("There was an error.");
		} 
		else {
			console.log(data.ETag);
			//context.succeed(data.ContentType);
		}
	});
});


// exports.handler = function (event, context) {
// 	sendTweet(context.succeed, context.fail)
// };
