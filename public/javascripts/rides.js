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

    directionsRenderer.setMap(map);

    document.getElementById('ride').addEventListener('click', async () => {
        // start

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

        function drawRoute(start, end) {
            var request = {
                origin: start,
                destination: end,
                travelMode: 'BICYCLING',
            };

            directionsService.route(request, function (result, status) {
                if (status == 'OK') {
                    routes.push(result);
                    // stop loader
                    directionsRenderer.setDirections(result);
                } else {
                    console.log('Error: ', status);
                }
            });
        }

        //get coordinates from input using geocoder for node express

        // var start = document.getElementById('start').value;
        // var end = document.getElementById('end').value;
        // var start = '1535 rue St Jacques, Montreal, Canada';  // from textbox
        // var end = '2125 rue Crescent, Montreal, Canada';  // from textbox
        drawRoute(start, end);
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
