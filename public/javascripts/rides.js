function simulateLoading() {
    var button = document.getElementById('ride');

    // Store the original content of the button
    var originalContent = button.innerHTML;

    // Set the button content to the loading icon
    button.innerHTML = '<div class="loader" style="text-align: center"></div>';

    // Simulate an asynchronous operation (e.g., an API call) with setTimeout
    setTimeout(function () {
        // Restore the original content after the operation is complete
        button.innerHTML = originalContent;
    }, 2000); // Adjust the time based on your scenario
}

function initMap() {
    var routes = [];
    var location = { lat: 45.5019, lng: -73.5674 };
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: location,
    });

    var directionsRenderer = new google.maps.DirectionsRenderer();
    var directionsService = new google.maps.DirectionsService();

    // Creates initial map
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

        // Gets location values from user input
        var start = document.getElementById('start').value;
        var end = document.getElementById('end').value;

        geocodeAddress(start, (startLocation) => {
            geocodeAddress(end, (endLocation) => {
                const startLat = startLocation.lat;
                const startLng = startLocation.lng;
                const endLat = endLocation.lat;
                const endLng = endLocation.lng;

                const midpointvectorLat = (endLat + startLat) / 2;
                const midpointvectorLng = (endLng + startLng) / 2;

                var waypoint1Lat =
                    midpointvectorLat + 0.1 * (endLat - startLat);
                var waypoint1Lng =
                    midpointvectorLng - 0.1 * (endLng - startLng);
                var waypoint2Lat =
                    midpointvectorLat - 0.1 * (endLat - startLat);
                var waypoint2Lng =
                    midpointvectorLng + 0.1 * (endLng - startLng);

                console.log(waypoint1Lat);
                console.log(waypoint1Lng);
                console.log(waypoint1Lat);
                console.log(waypoint1Lng);

                var waypoint1 = { lat: waypoint1Lat, lng: waypoint1Lng };
                var waypoint2 = { lat: waypoint2Lat, lng: waypoint2Lng };

                var safestElement = document.getElementById('safest');
                var leastTrafficElement =
                    document.getElementById('least-traffic');

                var waypoints = [
                    { location: waypoint1, stopover: true },
                    { location: waypoint2, stopover: true },
                ];

                // Heat map points added
                const heatmapData = [
                    {
                        lat: midpointvectorLat,
                        lng: midpointvectorLng,
                        intensity: 3,
                    },

                    // { lat: waypoint1.lat, lng: waypoint1.lng, intensity: 3 },
                    // { lat: waypoint2.lat, lng: waypoint2.lng, intensity: 3 },
                ];

                var heatmap = new google.maps.visualization.HeatmapLayer({
                    data: heatmapData.map(function (point) {
                        return new google.maps.LatLng(point.lat, point.lng);
                    }),
                    map: map,
                });

                var results = [];
                var legses = [];
                function drawRoute(start, waypoint, end, button) {
                    var request = {
                        origin: start,
                        destination: end,
                        travelMode: 'BICYCLING',
                        optimizeWaypoints: true,
                    };

                    if (waypoint) {
                        request.waypoints = [waypoint];
                    }

                    directionsService.route(request, function (result, status) {
                        if (status === 'OK') {
                            results.push(result);
                            let bareLegs = [];
                            for (leg of result.routes[0].legs) {
                                const bareLeg = { steps: [] };
                                for (step of leg.steps) {
                                    const points = step.polyline.points;
                                    bareLeg.steps.push(points);
                                }
                                bareLegs.push(bareLeg);
                            }
                            legses.push(bareLegs);
                            if (results.length === 3) {
                                console.log(legses);
                                // document
                                //     .querySelectorAll('.route')
                                //     .forEach(function (button) {
                                //         button.addEventListener(
                                //             'click',
                                //             (event) => {
                                //                 directionsRenderer.setDirections(
                                //                     results[
                                //                         parseInt(
                                //                             event.target.id
                                //                         )
                                //                     ]
                                //                 );
                                //             }
                                //         );
                                //     });
                                fetch('/rides', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(legses),
                                })
                                    .then((response) =>
                                        response.ok
                                            ? response.json()
                                            : Promise.reject(
                                                  `HTTP error! Status: ${response.status}`
                                              )
                                    )
                                    .then((data) => {
                                        console.log('Success:', data);
                                        const rankings = data;
                                        console.log(rankings);
                                        document.querySelector("#safest").addEventListener(
                                            'click',
                                            (event) => {
                                                directionsRenderer.setDirections(
                                                    results[
                                                        parseInt(
                                                           rankings["safest"]
                                                        
                                                        )
                                                    ]
                                                );
                                            })
                                            
                                        document.querySelector("#least-traffic").addEventListener(
                                            'click',
                                            (event) => {
                                                directionsRenderer.setDirections(
                                                    results[
                                                        parseInt(
                                                           rankings["leastTraffic"]
                                                            
                                                        )
                                                    ]
                                                );
                                            })
                                                     
                                        // @here for using response
                                    })
                                    .catch((error) =>
                                        console.error('Error:', error)
                                    );
                            }
                        } else {
                            console.log('Error: ', status);
                        }
                    });
                }

                // var results = [];
                drawRoute(start, null, end, null);
                drawRoute(start, waypoints[0], end, "safest");
                drawRoute(start, waypoints[1], end, "least-traffic");

                //
                // { fastest: 1, safest: 2, least-traffic: 0 }
            });
        });
    });

    const routeButtons = document.querySelectorAll('.route');
    var active = null;
    routeButtons.forEach(function (button) {
        button.addEventListener('click', function (click) {
            if (active) {
                active.classList.remove('active');
            }
            click.target.classList.add('active');
            active = click.target;
        });
    });
}
