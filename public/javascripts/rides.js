function initMap() {
    var routes = [];
    var location = { lat: 45.5019, lng: -73.5674 };
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: location,
    });

    var directionsRenderer = new google.maps.DirectionsRenderer();
    var directionsService = new google.maps.DirectionsService();

    directionsRenderer.setMap(map);

    document.getElementById('ride').addEventListener('click', async () => {
        function geocodeAddress(address, callback) {
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ address: address }, (results, status) => {
                if (status === 'OK') {
                    const location = results[0].geometry.location;
                    const latLng = { lat: location.lat(), lng: location.lng() };
                    callback({
                        address,
                        lat: location.lat(),
                        lng: location.lng(),
                    });
                } else {
                    console.log('error');
                }
            });
        }

        var start = document.getElementById('start').value;
        var end = document.getElementById('end').value;

        // const waypoint1Lat = midpointLat + c1Lat;
        // const waypoint1Lng = midpointLat + c1Lng;

        // const waypoint2Lat = midpointLat + c2Lat;
        // const waypoint2Lng = midpointLat + c2Lng;

        // const waypoint1 = {lat: waypoint1Lat, lng: waypoint1Lng };
        // const waypoint2 = {lat: waypoint2Lat, lng: waypoint2Lng };

        geocodeAddress(start, (startLocation) => {
            geocodeAddress(end, (endLocation) => {
                const startLat = startLocation.lat;
                const startLng = startLocation.lng;
                const endLat = endLocation.lat;
                const endLng = endLocation.lng;

                const midpointvectorLat = (endLat - startLat) / 2;
                const midpointvectorLng = (endLng - startLng) / 2;

                const midpointLat = startLat + midpointvectorLat;
                const midpointLng = startLng + midpointvectorLng;

                const c1Lat = midpointLat - midpointvectorLat;
                const c1Lng = midpointLng + midpointvectorLng;
                const c2Lat = midpointLat + midpointvectorLat;
                const c2Lng = midpointLng - midpointvectorLng;
                
                // document.getElementById('waypoint1').value;

                
            directionsService.route(
                {
                origin: start,
                destination: end,
                travelMode: 'DRIVING',
                },
                (response, status) => {
                if (status === 'OK') {
                    directionsRenderer.setDirections(response);
                } else {
                    console.log('Error: ', status);
                  }
                }
            );
            });
        });
        
        function drawRoute(start, end, waypoints) {
            var request = {
                origin: start,
                destination: end,
                waypoints: waypoints.map(waypoints => {
                    return {
                        location: waypoint1,
                        stopover: true
                    };
                }),
                travelMode: 'BICYCLING',
            };

            directionsService.route(request, function (result, status) {
                if (status == 'OK') {
                    routes.push(result);
                    directionsRenderer.setDirections(result);
                } else {
                    console.log('Error: ', status);
                }
            });
        }

        drawRoute(start, end);
    });
}
