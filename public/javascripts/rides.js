
function initMap() {
    // console.log("library loaded")
    var location = {lat: 45.5019, lng: -73.5674};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: location
    });

    var directionsRenderer = new google.maps.DirectionsRenderer();
    var directionsService = new google.maps.DirectionsService();

    directionsRenderer.setMap(map);


    function drawRoute(start, end) {
        var request = {
            origin: start,
            destination: end,
            travelMode: 'BICYCLING' 
        };

        directionsService.route(request, function(result, status) {
            if (status == 'OK') {
                directionsRenderer.setDirections(result);
            } else {
                console.log('Error: ', status);
            }
        });

    }

        var start = 'Quebec City, Canada';
        var end = 'Montreal, Canada';
        drawRoute(start, end);

}





