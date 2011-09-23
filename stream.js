var http = require('http'),
		url = require("url"),
		path = require("path"),  
		sys = require("sys"),
		spawn = require("child_process").spawn,
		jsonline = require('json-line-protocol').JsonLineProtocol,
		cfg = require('./config'),
		fs = require("fs");

http.createServer(function (req, res) {
	var uri = url.parse(req.url).pathname;  
	console.log("Requested uri: " + uri);

	if ( uri == '/stream' ) {
		var jsonTwitter = new jsonline();
		var username = cfg.twitter_username,
				password = cfg.twitter_password;
		var options = {
			host: 'stream.twitter.com',
			port: 80,
			//path: '/1/statuses/filter.json?locations=-122.75,36.8,-121.75,37.8&track=baseball',
			path: '/1/statuses/filter.json?locations=-122.75,36.8,-121.75,37.8',
			headers: {
				'Authorization': 'Basic ' + new Buffer(username + ':' + password).toString('base64')
			}
		};

		res.writeHead(200, {'Content-Type': 'text/event-stream'});
		http.get(options, function(resp){
			resp.on('data', function(chunk){
				jsonTwitter.feed(chunk);
			});
		}).on("error", function(e){
			console.log("Got error: " + e.message);
		});

		jsonTwitter.on('value', function (value) {
			res.write("event: twitter\n");
			res.write("data: "+JSON.stringify(value)+"\n\n");
		});

		var jsonDigg = new jsonline();
		var options = {
			host: 'services.digg.com',
			port: 80,
			path: '/2.0/stream'
		};

		res.writeHead(200, {'Content-Type': 'text/event-stream'});
		http.get(options, function(resp){
			resp.on('data', function(chunk){
				res.write("event: digg\n");
				res.write("data: "+chunk.toString()+"\n\n");
			});
		}).on("error", function(e){
			console.log("Got error: " + e.message);
		});

		var jsonMeetup = new jsonline();
		var options = {
			host: 'stream.meetup.com',
			port: 80,
			//path: '/2/open_events'
			path: '/2/rsvps'
		};

		res.writeHead(200, {'Content-Type': 'text/event-stream'});
		http.get(options, function(resp){
			resp.on('data', function(chunk){
				res.write("event: meetup\n");
				res.write("data: "+chunk.toString()+"\n\n");
			});
		}).on("error", function(e){
			console.log("Got error: " + e.message);
		});

		var jsonMeetupEvents = new jsonline();
		var options = {
			host: 'stream.meetup.com',
			port: 80,
			path: '/2/open_events'
		};

		res.writeHead(200, {'Content-Type': 'text/event-stream'});
		http.get(options, function(resp){
			resp.on('data', function(chunk){
				res.write("event: meetup_events\n");
				res.write("data: "+chunk.toString()+"\n\n");
			});
		}).on("error", function(e){
			console.log("Got error: " + e.message);
		});
	} else {
		if ( uri == '/' ) uri = '/index.htm';
		var filename = path.join(process.cwd(), uri);  
		console.log(filename);

    path.exists(filename, function(exists) {
			if(!exists) {  
				res.writeHead(404, {"Content-Type": "text/plain"});  
				res.write("404 Not Found\n");  
				res.end();  
				return;  
			}  

			fs.readFile(filename, "binary", function(err, file) {
				if(err) {
					res.writeHead(500, {"Content-Type": "text/plain"});
					res.write(err + "\n");
					res.end();
					return;
				}

				res.writeHead(200);
				res.write(file, "binary");
				res.end();
			});
    });
	}
}).listen(cfg.port, cfg.address);

console.log('Server running at http://'+cfg.address+':'+cfg.port+'/');
