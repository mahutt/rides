function initMap() {
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
                // const start = startLocation.latLng;
                // const end = endLocation.latLng;
                // console.log(start);
                // console.log(end);

                // midvector = ((end - start)/2);
                // console.log(midvector);

                // midpoint = ((start) + midvector);
                // console.log(midpoint);

                // // extra1 = midpoint + ()

                const startLat = startLocation.lat;
                const startLng = startLocation.lng;
                const endLat = endLocation.lat;
                const endLng = endLocation.lng;
            
                console.log('start lat:', startLat);
                console.log('start lng:', startLng);
                console.log('end lat:', endLat);
                console.log('end lng:', endLng);

                const midpointvectorLat = (endLat - startLat)/2;
                console.log('midpointvectorLat:', midpointvectorLat);

                const midpointvectorLng = (endLng - startLng)/2;
                console.log('midpointvectorLng:', midpointvectorLng);

                const midpointLat = (startLat + midpointvectorLat);
                console.log('midpointLat:', midpointLat);

                const midpointLng = (startLng + midpointvectorLng);
                console.log('midpointLng:', midpointLng);

                const c1Lat = midpointLat - midpointvectorLat;
                const c1Lng = midpointLng + midpointvectorLng;
                const c2Lat = midpointLat + midpointvectorLat;
                const c2Lng = midpointLng - midpointvectorLng;
                console.log('c1Lat:', c1Lat);
                console.log('c1Lng:', c1Lng);
                console.log('c2Lat:', c2Lat);
                console.log('c2Lng:', c2Lng);

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
        }


        //get coordinates from input using geocoder for node express

        // var start = document.getElementById('start').value;
        // var end = document.getElementById('end').value;
        // var start = '1535 rue St Jacques, Montreal, Canada';  // from textbox
        // var end = '2125 rue Crescent, Montreal, Canada';  // from textbox
        drawRoute(start, end);
    });
}
