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
                    callback({ address, lat: location.lat(), lng: location.lng() });
                } else {
                    console.log('error');
                }
            });
        }

        var start = document.getElementById('start').value;
        var end = document.getElementById('end').value;

        geocodeAddress(start, (startLocation) => {
            geocodeAddress(end, (endLocation) => {
                const startLat = startLocation.lat;
                const startLng = startLocation.lng;
                const endLat = endLocation.lat;
                const endLng = endLocation.lng;
                

                const midpointvectorLat = (endLat + startLat)/2;
                const midpointvectorLng = (endLng + startLng)/2;
                

                // const midpointLat = (startLat + midpointvectorLat);
                // const midpointLng = (startLng + midpointvectorLng);
                // console.log(midpointLat);
                // console.log(midpointLng);

                // var waypoint1Lat = (midpointvectorLat + 0.2*(midpointvectorLat));
                // var waypoint1Lng = (midpointvectorLng - 0.2*(midpointvectorLng));
                // var waypoint1Lat = (midpointvectorLat - 0.2*(midpointvectorLat));
                // var waypoint1Lng = (midpointvectorLng + 0.2*(midpointvectorLng));

                // document.getElementById('waypoint1').value;
                var waypoint1Lat = midpointvectorLat + (endLat - startLat);
                var waypoint1Lng = midpointvectorLng - (endLng - startLng);
                var waypoint2Lat = midpointvectorLat - (endLat - startLat);
                var waypoint2Lng = midpointvectorLng + (endLng - startLng);

                // var waypoint1Lat = (midpointvectorLat + (midpointvectorLat));
                // var waypoint1Lng = (midpointvectorLng - 0.2*(midpointvectorLng));
                // var waypoint1Lat = (midpointvectorLat - 0.2*(midpointvectorLat));
                // var waypoint1Lng = (midpointvectorLng + 0.2*(midpointvectorLng));


                console.log(waypoint1Lat);
                console.log(waypoint1Lng);
                console.log(waypoint1Lat);
                console.log(waypoint1Lng);

                var waypoint1 = { lat: waypoint1Lat, lng: waypoint1Lng};
                var waypoint2 = { lat: waypoint2Lat, lng: waypoint2Lng};

                var waypoints = [
                    { location: waypoint1, stopover: true }, 
                    { location: waypoint2, stopover: true }
                ];

                function drawRoute(start, end) {
                    var request = {
                        origin: start,
                        destination: end,
                        travelMode: 'BICYCLING',
                        waypoints: waypoints,
                    };
        
                    directionsService.route(request, function (result, status) {
                        if (status === 'OK') {
                            console.log(result);
                            routes.push(result);
                            directionsRenderer.setDirections(result);
                        } else {
                            console.log('Error: ', status);
                        }
                    });
                }
        
                drawRoute(start, end);
                

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
        
    });
}
