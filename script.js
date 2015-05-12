$(document).ready(function() {
	$.ajax({
		url: "http://localhost:8080/list",
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
		url: "http://localhost:8080/list/" + e.target.id,
		type: "GET",
		success: function(data) {
			data = JSON.parse(data);
			list_item_ids = data.items;
			document.getElementById("list_id").setAttribute("name", e.target.id);
		}
	});
	$.ajax({
		url: "http://localhost:8080/item",
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
		url: "http://localhost:8080/list",
		type: "POST",
		data: "name=" + temp,
		success: function(result) {
			result = JSON.parse(result);
			$("#info").append("<p class='store'><a id=" + result.key + " href=#mylist>" + result.name + "</a></p>"); 
			$("#new_list").val("");
			e.preventDefault();
			$.mobile.changePage("#mylist", {transition: "slide"});
		}
	});
	
});

$(document).on("submit", "#submit_item", function(e) {
	item_name = $("#new_name").val();
	item_quantity = $("#new_quantity").val();
	list_id = document.getElementById("list_id").getAttribute("name");

	$.ajax({
		url: "http://localhost:8080/item",
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
			alert(typeof item_id);
			
			$.ajax({
				url: "http://localhost:8080/list/" + list_id + "/item/" + item_id,
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
		url: "http://localhost:8080/list/" + e.target.id,
		type: "DELETE",
		success: function(result) {
			$("#" + e.target.id).remove();
			e.preventDefault();
		}
	});

});
$(document).on("swiperight", ".item", function(e) {
	$.ajax({
		url: "http://localhost:8080/item/" + e.target.id,
		type: "DELETE",
		success: function(result) {
			$("#" + e.target.id).remove();
			e.preventDefault();
			$.mobile.changePage("#mylist", {transition: "pop"});
		}
	});

});
