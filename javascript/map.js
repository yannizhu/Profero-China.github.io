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
    function addMarker( latitude, longitude, label, colour ){
        var marker = new google.maps.Marker({
            map: map,
            position: new google.maps.LatLng(latitude,longitude),
            title: (label || "")
        });
        marker.setIcon(colour);
        return(marker);
    }


    if(usLocationMarker) return; //firefox hack
    //add our office location on the map
    usLocationMarker = addMarker(
        39.917815,
        116.453311,
        "Us!",
        "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
    );

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
            var directionsDisplay = new google.maps.DirectionsRenderer();
            directionsDisplay.setMap(map);
            directionsService.route(request, function(response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                }
            });
        });
    }

});