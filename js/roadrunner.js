/*
Page scrolling and navbar implementation
*/

//jQuery to collapse the navbar on scroll
$(window).scroll(function() {
    if ($(".navbar").offset().top > 50) {
        $(".navbar-fixed-top").addClass("top-nav-collapse");
    } else {
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
    }
});

//page scrolling effect
$(function() {
    $('.page-scroll a').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});



/*
Map implemention
*/

//direction services
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();

//longitude-latitude array declaration
var coordslat = [];
var coordslng = [];

/*
Initializes the map
Centered at the geolocation or in some cases, given location
*/
var map;

function initialize() {
  var mapOptions = {
    zoom: 6
    mapTypeId: 'terrain'
  };
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  // Try HTML5 geolocation
  if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      var infowindow = new google.maps.InfoWindow({
        map: map,
        position: pos,
        content: 'Location found using HTML5.'
      });

      map.setCenter(pos);
    }, function() {
      handleNoGeolocation(true);
    });
  } else {
    // Browser doesn't support Geolocation
    handleNoGeolocation(false);
  }
    
    //placing markers on map
    
    google.maps.event.addListener(map, 'click', function(event){
        var marker_position = event.latLng;   
        marker = new google.maps.Marker({
                map: map,
                draggable: false
            }); 
        marker.setPosition(marker_position);

        //pushing latitudes and longitudes to respective array in start->end order
        coordslat.push(marker_position.lat());
        coordslng.push(marker_position.lng());

        //debugging purposes
        console.log(marker_position);

    });
       
    //directionsDisplay.setMap(map);
}


/* In case browser does not support geolocation */
function handleNoGeolocation(errorFlag) {
  if (errorFlag) {
    var content = 'Error: The Geolocation service failed.';
  } else {
    var content = 'Error: Your browser doesn\'t support geolocation.';
  }

  var options = {
    map: map,
    position: new google.maps.LatLng(33, -118),
    content: content
  };

  var infowindow = new google.maps.InfoWindow(options);
  map.setCenter(options.position);
}


/* Loads the map */
google.maps.event.addDomListener(window, 'load', initialize);


/* 
End initializing map 
*/

/* Calculates route */
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