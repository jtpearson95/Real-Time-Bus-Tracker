        let map;
        async function initMap() {
            const { Map } = await google.maps.importLibrary("maps");
            map = new Map(document.getElementById("map"), {
                center: { lat: 42.365554, lng: -71.104081 },
                zoom: 14,
                mapTypeId: 'satellite',
            });

        }
        initMap();
        
        let locations = [];
        let markers = [];
        async function run() {
            //pulls bus data every 10 seconds
            locations = await getBusLocations();
            console.log(new Date());
            console.log(locations);
            //loop to add to markers 
            //compare whats in markers to localmarkers
            let localMarkers = [];
            for (let i = 0; i < locations.length; i++) {
                const element = locations[i].id;
                if (element) {
                    localMarkers.push({ id: locations[i].id, lat: locations[i].attributes.latitude, lng: locations[i].attributes.longitude});
                }
            }
            console.log(localMarkers);

            placeMarkers(localMarkers);
            setTimeout(run, 10000);
        }

        function addMarker(position, id) {
            const marker = new google.maps.Marker({
                position,
                map,
                title: id
            });
            markers.push(marker);
        }
        function placeMarkers(mArray) {
            //erase markers on map
            deleteMarkers();

            //place marakers on map
            mArray.forEach(element => {
                addMarker({ lat: element.lat, lng: element.lng }, element.id)
            })
        };

        // Sets the map on all markers in the array.
        function setMapOnAll(map) {
            for (let i = 0; i < markers.length; i++) {
                markers[i].setMap(map);
            }
        }

        // Removes the markers from the map, but keeps them in the array.
        function hideMarkers() {
            setMapOnAll(null);
        }

        // Shows any markers currently in the array.
        function showMarkers() {
            setMapOnAll(map);
        }

        // Deletes all markers in the array by removing references to them.
        function deleteMarkers() {
            hideMarkers();
            markers = [];
        }

        // Request bus data from MBTA url
        async function getBusLocations() {
            const url =
                "https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip";
            const response = await fetch(url);
            const json = await response.json();
            return json.data;
        }
        run();