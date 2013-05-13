$("document").ready(function(){

    var mapContainer = $(".map-container");

    //create new map, centred on beijing office coordinates
    var map = new google.maps.Map(mapContainer[0],{
        zoom: 15,
        disableDefaultUI:true,
        disableDoubleClickZoom:true,
        draggable:false,
        keyboardShortcuts:false,
        scrollwheel:false,
        center: new google.maps.LatLng(39.917774,116.453311),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    //keep the map centred on beijing office location
    //even when the page is resized
    var center;
    function calculateCenter() {
        center = map.getCenter();
    }

    google.maps.event.addDomListener(map, 'idle', function() {
        calculateCenter();
    });

    google.maps.event.addDomListener(window, 'resize', function() {
        map.setCenter(center);
    });

    //function to add map marker
    function addMarker( position, label, icon){
        var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: (label || "")
        });
        marker.setIcon(icon);
        return(marker);
    }

    //if the user has geolocation enabled and they provide authorisation
    //then show a route on the map from them to us
    if (navigator.geolocation) {
        var youLocationMarker, usLocationMarker = null;
        navigator.geolocation.getCurrentPosition(function(pos) {
            if (youLocationMarker || usLocationMarker){
                return;
            }
            /*
            youLocationMarker = addMarker(
                pos.coords.latitude,
                pos.coords.longitude,
                "You!",
                "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
            );
            */
            var request = {
                origin: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                destination: new google.maps.LatLng(39.917815, 116.453311),
                travelMode: google.maps.DirectionsTravelMode.DRIVING
            };
            var directionsService = new google.maps.DirectionsService();
            var directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});
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
                    addMarker(leg.start_location, "", "images/map-icon-shadow.png");
                    addMarker(leg.start_location, "you", "images/map-icon-you.png");
                    addMarker(leg.end_location, "", "images/map-icon-shadow.png");
                    addMarker(leg.end_location, "us", "images/map-icon.png");
                }
            });
        }, function(error) {
            console.log(error);
            //if there is an error gettinger user's location,
            //or if they decline permission, show our location on the map
            if(usLocationMarker) return; //firefox hack
            usLocationMarker = addMarker(
                39.917815,
                116.453311,
                "Us!",
                "images/map-icon.png"
            );
            shadow = addMarker(
                39.917815,
                116.453311,
                "",
                "images/map-icon-shadow.png"
            );
        });
    }

});