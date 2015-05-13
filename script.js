$(document).ready(function() {
	$.ajax({
		url: "http://intense-sled-94005.appspot.com/list",
		type: "GET",
		success: function(result) {
			result = JSON.parse(result);
			for(var i = 0; i < result.names.length; i++) {
				var encoded = encodeURIComponent(result.names[i]);
				$("#info").append("<li><a class='store' id=" + result.keys[i] + " name=" + encoded + " href='#mylist'>" + result.names[i] + "</a></li>"); 
			};
			$("#info").listview("refresh");
		}
	});
});

$(document).on("tap", ".store", function(e) {
	var list_item_ids = '';
	var decoded = decodeURIComponent(e.target.name);
    $("#list_header").append("<h1 id=title class='ui-title' role='heading' aria-level='1'>" + decoded + "</h1>");

	$.ajax({
		url: "http://intense-sled-94005.appspot.com/list/" + e.target.id,
		type: "GET",
		success: function(data) {
			data = JSON.parse(data);
			list_item_ids = data.items;
			document.getElementById("list_id").setAttribute("name", e.target.id);
			
			$.ajax({
				url: "http://intense-sled-94005.appspot.com/item",
				type: "GET",
				success: function(data) {
					data = JSON.parse(data);
					for(var i = 0; i < data.names.length; i++) {
						for(var j = 0; j < list_item_ids.length; j++) {
							if(data.keys[i] == list_item_ids[j]) {
								$("#item_info").append("<li class='item' id=" + data.keys[i] + ">" + data.names[i] + ", " + data.quantities[i] + "</li>");	
							};	
						};
					};
					$("#item_info").listview("refresh");
				}
			});
		}
	});
});

$(document).on("tap", "#back", function() {
	$("#item_info").empty();
	$("#title").remove();
});

$(document).on("submit", "#submit_list", function(e) {
	e.preventDefault();
	list_name = $("#new_list").val();
	encoded = encodeURIComponent(list_name);

	$.ajax({
		url: "http://intense-sled-94005.appspot.com/list",
		type: "POST",
		data: "name=" + encoded,
		success: function(result) {
			result = JSON.parse(result);
			$("#info").append("<li><a class='store' id=" + result.key + " href=#mylist>" + result.name + "</a></li>"); 
			$("#info").listview("refresh");
			$("#new_list").val("");
		}
	});
	
});

$(document).on("submit", "#submit_item", function(e) {
	e.preventDefault();
	item_name = $("#new_name").val();
	item_quantity = $("#new_quantity").val();
	list_id = document.getElementById("list_id").getAttribute("name");
	encoded = encodeURIComponent(item_name);

	$.ajax({
		url: "http://intense-sled-94005.appspot.com/item",
		type: "POST",
		data: "name=" + encoded + "&quantity=" + item_quantity,
		success: function(result) {
			result = JSON.parse(result);
			$("#item_info").append("<li class='item' id=" + result.key + " href=#mylist>" + result.name + ", " + result.quantity + "</li>"); 
			$("#item_info").listview("refresh");
			$("#new_name").val("");
			$("#new_quantity").val("1");
			document.getElementById("item_id").setAttribute("name", result.key);
			item_id = document.getElementById("item_id").getAttribute("name");	


			$.ajax({
				url: "http://intense-sled-94005.appspot.com/list/" + list_id + "/item/" + item_id,
				type: "PUT",
				success: function(result) {
					e.preventDefault();
				}
			});
		}
	});
});

$(document).on("swiperight", ".store", function(e) {
	$.ajax({
		url: "http://intense-sled-94005.appspot.com/list/" + e.target.id,
		type: "DELETE",
		success: function(result) {
			$("#" + e.target.id).remove();
			e.preventDefault();
		}
	});

});

$(document).on("swiperight", ".item", function(e) {
	$.ajax({
		url: "http://intense-sled-94005.appspot.com/item/" + e.target.id,
		type: "DELETE",
		success: function(result) {
			$("#" + e.target.id).remove();
			e.preventDefault();
			$.mobile.changePage("#mylist", {transition: "pop"});
		}
	});

});

/*
Note: adapted from tutorial code at:
	 http://demos.jquerymobile.com/1.4.0/map-geolocation/ 
	 https://developers.google.com/maps/documentation/javascript/examples/places-searchbox
*/
$( document ).on( "pageshow", "#map-page", function(e) {
    var defaultLatLng = new google.maps.LatLng(34.0983425, -118.3267434);  // Default to Hollywood, CA when no geolocation support
    if ( navigator.geolocation) {
	function success(pos) {
            // Location found, show map with these coordinates
			initialize(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
	}
        function fail(error) {
            initialize(defaultLatLng);  // Failed to find location, show default map
        }
        // Find the users current position.  Cache the location for 5 minutes, timeout after 6 seconds
        navigator.geolocation.getCurrentPosition(success, fail, {maximumAge: 500000, enableHighAccuracy:true, timeout: 6000});
    } else {
        initialize(defaultLatLng);  // No geolocation support, show default map
    }

	function initialize(latlng) {
		var myOptions = {
			zoom: 10,
			center: latlng,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		var map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);
		// Add an overlay to the map of current lat/lng
		var marker = new google.maps.Marker({
			position: latlng,
			map: map,
			title: "Greetings!"
		});

		var markers = [];
		var input = (document.getElementById('pac-input'));
		map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
		var searchBox = new google.maps.places.SearchBox(input);
	   
		google.maps.event.addListener(searchBox, 'places_changed', function() {
			var places = searchBox.getPlaces();

			if(places.length == 0) {
				return;
			}
			for(var i = 0, marker; marker = markers[i]; i++) {
				marker.setMap(null);
			}

			//get icon, place name, and location for each place
			markers = [];
			var bounds = new google.maps.LatLngBounds();
			for(var i = 0, place; place = places[i]; i++) {
				var image = 'http://maps.google.com/mapfiles/kml/paddle/grn-stars-lv.png';

				//create a marker for each place
				var marker = new google.maps.Marker({
					map: map,
					icon: image,
					title: place.name,
					animation: google.maps.Animation.DROP,
					position: place.geometry.location
				});
				markers.push(marker);
				bounds.extend(place.geometry.location);
			}
			map.fitBounds(bounds);
		});
		//Bias searchBox results toward nearby places
		google.maps.event.addListener(map, 'bounds_changed', function() {
			var bounds = map.getBounds();
			searchBox.setBounds(bounds);
		});	
	
	google.maps.event.addDomListener(window, 'load', initialize);
	}
});
