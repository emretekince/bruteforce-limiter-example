var Limiter = require('../rateLimiter');

var Redis = require('ioredis');
var redis = new Redis();

var express = require('express');
var bodyParser = require('body-parser')
var app = express();

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

app.post('/login', function (req, res) {
	var email = req.body.email;  
	var limit = new Limiter({ id: email, db: redis, max : 5, duration: 3600000 });
	limit.get(function(err, limit) {
		if (err) throw err;

		console.log(limit)

		if(limit.remaining > 0)
			res.send('For '+email+' Remaining attemps: ' + limit.remaining);
		else
			res.send('Your limit is finished, now you have to wait 1 hour!');
	});
	
});

app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});
