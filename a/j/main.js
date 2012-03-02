var log = function(){
	var w = window;
	return {
		add: function(m) { w.console && w.console.log(m) },
		js: function() { w.console && w.console.profile() },  
		jsEnd: function() { w.console && w.console.profileEnd() },
		prof: function(code) {
			if ( w.console ) {
				console.profile();
				try { code() } catch(err) { };
				console.profileEnd();
			}
		}
	}
}();

var stream = function(){
	var source = new EventSource('stream');

	source.addEventListener('twitter', function(e) {
		var data = JSON.parse(e.data),
				htm = [];
		htm.push( '<li class="twitter" style="display: none;">' );
		htm.push( '<div class="profile">' );
			htm.push( '<img src="'+data.user.profile_image_url+'" />' );
			htm.push( '<a href="#">'+ data.user.screen_name + '</a>' );
		htm.push( '</div>' );
		htm.push( '<div class="text">'+data.text+'</div>' );
		htm.push( '</li>' );

		$("#results").prepend( htm.join("") );
		$("#results li:first-child").fadeIn();
		log.add(data);
	}, false);

	source.addEventListener('digg', function(e) {
		var data,
				htm = [];

		try {
			data = JSON.parse(e.data);
		} catch (err) {
			log.add(err);
			return;
		}

		log.add(data);
		htm.push( '<li class="digg" style="display: none;">' );
		htm.push( '<div class="profile">' );
			htm.push( '<img src="'+data.user.icon+'" />' );
			htm.push( '<a href="#">'+ data.user.name + '</a>' );
		htm.push( '</div>' );
		htm.push( '<div class="text">'+data.item.description+'</div>' );
		htm.push( '</li>' );

		$("#results").prepend( htm.join("") );
		$("#results li:first-child").fadeIn();
	}, false);

	source.addEventListener('meetup', function(e) {
		var data,
				htm = [];

		try {
			data = JSON.parse(e.data);
		} catch (err) {
			log.add(err);
			return;
		}

		log.add(data);

		var open_events = function(){
			htm.push( '<li class="meetup" style="display: none;">' );
			htm.push( '<div class="profile">' );
				if ( data.photo_url )	htm.push( '<img src="'+data.photo_url+'" />' );
				htm.push( '<a href="'+data.event_url+'">'+ data.group.name + '</a>' );
			htm.push( '</div>' );
			htm.push( '<div class="text">'+data.name+'</div>' );
			htm.push( '</li>' );

			return htm.join("");
		};

		var rsvps = function(){
			htm.push( '<li class="meetup" style="display: none;">' );
			htm.push( '<div class="profile">' );
				htm.push( '<a href="'+data.event.event_url+'">'+ data.member.member_name + '</a> ' + data.response );
			htm.push( '</div>' );
			htm.push( '<div class="text">'+data.event.event_name+'</div>' );
			htm.push( '</li>' );
		
			return htm.join("");
		};

		$("#results").prepend( rsvps() );
		$("#results li:first-child").fadeIn();
	}, false);

	source.addEventListener('open', function(e) {
		log.add("opened");
	}, false);

	source.addEventListener('error', function(e) {
		log.add(e);
		if (e.eventPhase == EventSource.CLOSED) {
			log.add("closed");
		}
	}, false);
};

$(function(){
	if (!!window.EventSource) {
		stream();
	} else {
		// Result to xhr polling :(
	}
});
