$(document).ready(function() {
	$.ajax({
		url: "http://intense-sled-94005.appspot.com/list",
		type: "GET",
		success: function(result) {
			result = JSON.parse(result);
			var copy = result.names;
			for(var i = 0; i < result.names.length; i++) {
				$("#info").append("<p class='store'><a id=" + result.keys[i] + " href=#mylist name=" + copy[i].replace(/ /g, "%") + ">" + result.names[i] + "</a></p>"); 
			};
		}
	});
});

$(document).on("tap", ".store", function(e) {
	var list_item_ids = '';
	var formatted_name = e.target.name.replace(/%/g, " ");
        $("#list_header").append("<h1 id=title class='ui-title' role='heading' aria-level='1'>" + formatted_name + "</h1>");

	$.ajax({
		url: "http://intense-sled-94005.appspot.com/list/" + e.target.id,
		type: "GET",
		success: function(data) {
			data = JSON.parse(data);
			list_item_ids = data.items;
			document.getElementById("list_id").setAttribute("name", e.target.id);
		}
	});
	$.ajax({
		url: "http://intense-sled-94005.appspot.com/item",
		type: "GET",
		success: function(data) {
			data = JSON.parse(data);
			for(var i = 0; i < data.names.length; i++) {
				for(var j = 0; j < list_item_ids.length; j++) {
					if(data.keys[i] == list_item_ids[j]) {
						$("#item_info").append("<p class='item' id=" + data.keys[i] + ">" + data.names[i] + ", " + data.quantities[i] + "</p>");	
					};	
				};
			};
		}
	});
});

$(document).on("tap", "#back", function() {
	$("#item_info").empty();
	$("#title").remove();
});

$(document).on("submit", "#submit_list", function(e) {
	list_name = $("#new_list").val();
	var temp = list_name;
	$.ajax({
		url: "http://intense-sled-94005.appspot.com/list",
		type: "POST",
		data: "name=" + temp,
		success: function(result) {
			result = JSON.parse(result);
			$("#info").append("<p class='store'><a id=" + result.key + " href=#mylist>" + result.name + "</a></p>"); 
			$("#new_list").val("");
			e.preventDefault();
			location.reload();
		}
	});
	
});

$(document).on("submit", "#submit_item", function(e) {
	item_name = $("#new_name").val();
	item_quantity = $("#new_quantity").val();
	list_id = document.getElementById("list_id").getAttribute("name");

	$.ajax({
		url: "http://intense-sled-94005.appspot.com/item",
		type: "POST",
		data: "name=" + item_name + "&quantity=" + item_quantity,
		success: function(result) {
			result = JSON.parse(result);
			$("#item_info").append("<p class='item' id=" + result.key + " href=#mylist>" + result.name + ", " + result.quantity + "</p>"); 
			$("#new_name").val("");
			$("#new_quantity").val("1");
			document.getElementById("item_id").setAttribute("name", result.key);
			e.preventDefault();
			
			$.mobile.changePage("#mylist", {transition: "pop"});
			item_id = document.getElementById("item_id").getAttribute("name");
			
			$.ajax({
				url: "http://intense-sled-94005.appspot.com/list/" + list_id + "/item/" + item_id,
				type: "PUT",
				success: function(result) {
					e.preventDefault();
					$.mobile.changePage("#mylist", {transition: "pop"});
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
 * Google Maps documentation: http://code.google.com/apis/maps/documentation/javascript/basics.html
 * Geolocation documentation: http://dev.w3.org/geo/api/spec-source.html
 */
$( document ).on( "pageshow", "#map-page", function() {
    var defaultLatLng = new google.maps.LatLng(34.0983425, -118.3267434);  // Default to Hollywood, CA when no geolocation support
    if ( navigator.geolocation) {
	function success(pos) {
            // Location found, show map with these coordinates
            drawMap(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
	}
        function fail(error) {
            drawMap(defaultLatLng);  // Failed to find location, show default map
        }
        // Find the users current position.  Cache the location for 5 minutes, timeout after 6 seconds
        navigator.geolocation.getCurrentPosition(success, fail, {maximumAge: 500000, enableHighAccuracy:true, timeout: 6000});
    } else {
        drawMap(defaultLatLng);  // No geolocation support, show default map
    }
    function drawMap(latlng) {
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
    }
});
