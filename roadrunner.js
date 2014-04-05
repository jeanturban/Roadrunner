var elevator;
var map;
var infowindow = new google.maps.InfoWindow();
var area = new google.maps.LatLng(63.3333333, -150.5);
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var elevations = [];

function initialize() {
  var mapOptions = {
    zoom: 8,
    mapTypeId: 'terrain'
  }
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  // Create an ElevationService
  elevator = new google.maps.ElevationService();

  //direction services
  directionsDisplay = new google.maps.DirectionsRenderer();
  directionsDisplay.setMap(map);

  // Add a listener for the click event and call getElevation on that location
  google.maps.event.addListener(map, 'click', getElevation);
  google.maps.event.addListener(map, 'click', function(event){
        var marker_position = event.latLng;   
        marker = new google.maps.Marker({
                map: map,
                draggable: false
            }); 
       marker.setPosition(marker_position);
});
 // Try HTML5 geolocation
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);


      map.setCenter(pos);
    }, function() {
      handleNoGeolocation(true);
    });
  } else {
    // Browser doesn't support Geolocation
    handleNoGeolocation(false);
  }

}


function handleNoGeolocation(errorFlag) {
  if (errorFlag) {
    var content = 'Error: The Geolocation service failed.';
  } else {
    var content = 'Error: Your browser doesn\'t support geolocation.';
  }

  var options = {
    map: map,
    position: new google.maps.LatLng(60, 105),
    content: content
  };

  var infowindow = new google.maps.InfoWindow(options);
  map.setCenter(options.position);
}

function calcRoute() {
  var start = document.getElementById('start').value;
  var end = document.getElementById('end').value;
  var request = {
      origin:start,
      destination:end,
      travelMode: google.maps.TravelMode.DRIVING
  };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    }
  });
}

function getElevation(event) {

  var locations = [];

  // Retrieve the clicked location and push it on the array
  var clickedLocation = event.latLng;
  locations.push(clickedLocation);

  // Create a LocationElevationRequest object using the array's one value
  var positionalRequest = {
    'locations': locations
  }

  // Initiate the location request
  elevator.getElevationForLocations(positionalRequest, function(results, status) {
    if (status == google.maps.ElevationStatus.OK) {

      // Retrieve the first result
      if (results[0]) {
        elevations.push(results[0].elevation);
        console.log(elevations);
      } else {
        alert('No results found');
      }
    } else {
      alert('Elevation service failed due to: ' + status);
    }
  });
}

google.maps.event.addDomListener(window, 'load', initialize);
