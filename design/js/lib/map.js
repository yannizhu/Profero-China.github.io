(function() {
	var ProferoMap = {

		el: {
			mapContainer: 	$(".map-container")
		},

		settings: {
			styles: 	 	[{
								"stylers": [
									{ "saturation": -100 },
									{ "gamma": 1 },
									{ "lightness": 1 }
								]
							}],
			latitude: 		39.917774,
			longitude: 		116.453311,
		},

		init: function() {

			this.initialiseMap();

		},

		initialiseMap: function() {

			var el = this.el,
				settings = this.settings;

			var map = new google.maps.Map(el.mapContainer[0],{
				zoom: 					15,
				disableDefaultUI: 		true,
				disableDoubleClickZoom: true,
				draggable:				false,
				keyboardShortcuts:		false,
				scrollwheel:			false,
				center:					new google.maps.LatLng(settings.latitude,settings.longitude),
				mapTypeId:				google.maps.MapTypeId.ROADMAP,
				styles:					settings.styles
			});

			google.maps.event.addDomListener(map, 'idle', function(){ProferoMap.resizeMap(map)});

			google.maps.event.addDomListener(window, 'resize', function(){ProferoMap.resizeMap(map)});

			//if geolocation is supported and permission given
			//show route, else just show location marker

			if (navigator.geolocation) {

				navigator.geolocation.getCurrentPosition(function(pos) {
					ProferoMap.showRoute(map, pos);
				}, function(error) {
					if (error.code == error.PERMISSION_DENIED)
						ProferoMap.showLocation(map);
				});

			} else {
				this.showLocation(map);
			}

		},

		calculateCenter: function(map) {
			map.getCenter();
		},

		resizeMap: function(map) {

			var el = this.el,
				settings = this.settings;

			x = map.getZoom();
			c = map.getCenter();
			google.maps.event.trigger(map, 'resize');
			map.setZoom(x);
			if(el.mapContainer.width()<500)
				map.setCenter(new google.maps.LatLng(settings.latitude, settings.longitude));
			else
				map.setCenter(c);
		},

		addMarker: function(map, position, label, icon) {
			var marker = new google.maps.Marker({
				map: 		map,
				position: 	position,
				title: 		(label || "")
			});
			marker.setIcon(icon);
			return(marker);
		},

		showRoute: function(map, pos) {

			var settings = this.settings,
				youLocationMarker, 
				usLocationMarker = null;

			//Firefox hack
			if (youLocationMarker || usLocationMarker){
				return;
			}

			var request = {
				origin: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
				destination: new google.maps.LatLng(settings.latitude, settings.longitude),
				travelMode: google.maps.DirectionsTravelMode.DRIVING
			},
				directionsService = new google.maps.DirectionsService(),
				directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});
		
			directionsDisplay.setMap(map);
			directionsService.route(request, function(response, status) {
				if (status == google.maps.DirectionsStatus.OK) {
					directionsDisplay.setDirections(response);
				}
			});

			directionsService.route(request, function(response, status) {
				if (status == google.maps.DirectionsStatus.OK) {
					directionsDisplay.setDirections(response);
					var leg = response.routes[0].legs[0];
					ProferoMap.addMarker(map, leg.start_location, "", "images/map-icon-shadow.png");
					ProferoMap.addMarker(map, leg.start_location, "you", "images/map-icon-you.png");
					ProferoMap.addMarker(map, leg.end_location, "", "images/map-icon-shadow.png");
					ProferoMap.addMarker(map, leg.end_location, "us", "images/map-icon.png");
				}
			});

		},

		showLocation: function(map) {

			var settings = this.settings,
				usLocationMarker = null;

			//Firefox hack
			if (usLocationMarker){
				return;
			}

			usLocationMarker = addMarker(
				map,
				settings.latitude,
				settings.longitude,
				"Us!",
				"images/map-icon.png"
			);
			shadow = addMarker(
				map,
				settings.latitude,
				settings.longitude,
				"",
				"images/map-icon-shadow.png"
			);

		}

	}
	ProferoMap.init();
})();