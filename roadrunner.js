var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var elevator;
var map;
var infowindow = new google.maps.InfoWindow();

var elevations = [];
var coordslat = [];
var coordslng = [];

function initialize() {
  directionsDisplay = new google.maps.DirectionsRenderer();
  var mapOptions = {
    zoom: 8,
    mapTypeId: 'terrain'
  }
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  // Create an ElevationService
  elevator = new google.maps.ElevationService();

  // Add a listener for the click event and call getElevation on that location
  google.maps.event.addListener(map, 'click', getElevation);
  google.maps.event.addListener(map, 'click', function(event){
        var marker_position = event.latLng;   
        marker = new google.maps.Marker({
                map: map,
                draggable: false
            }); 
       marker.setPosition(marker_position);
       coordslat.push(marker_position.lat());
       coordslng.push(marker_position.lng());
       console.log(coordslat);
       console.log(coordslng);
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
  
 directionsDisplay.setMap(map);

}

function calcRoute() {
  var start = new google.maps.LatLng(coordslat[0], coordslng[0]);
  var end = new google.maps.LatLng(coordslat[1], coordslng[1]);
  var request = {
      origin:start,
      destination:end,
      provideRouteAlternatives:true,
      travelMode: google.maps.TravelMode.WALKING
  };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
        for (var i = 0, len = response.routes.length; i < len; i++) {
            new google.maps.DirectionsRenderer({
                map: map,
                directions: response,
                routeIndex: i
            });
        }
    } else {
        $("#error").append("Unable to retrieve your route<br />");
    }
  });
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
console.log(elevations);
console.log(coordslng);
console.log(coordslat);