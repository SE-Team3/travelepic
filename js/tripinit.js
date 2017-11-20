marker=null;

function initMap()
{
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 20.5937, lng: 78.9629},
        zoom: 10
    });
//alert(document.cookie);
    directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer;
    pos=null;
//////***********************
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
//**********************global marker*************************
             marker = new google.maps.Marker({
                icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
                map: map,
                animation: google.maps.Animation.DROP,
                position: pos
            });
            map.setCenter(pos);
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    }
	else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
    
    directionsDisplay.setMap(map);
	
	//////****************************************

    var geocoder = new google.maps.Geocoder();
    
    document.getElementById('submit').addEventListener('click', function() {
        locationAddress(geocoder, map);
        calculateAndDisplayRoute(directionsService, directionsDisplay,pos);
    });
    enablePlaceSearchAPI();
}


function enablePlaceSearchAPI()
{
    var input = document.getElementById('destination');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
      var places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }

      // Clear out the old markers.
      markers.forEach(function(markert) {
        markert.setMap(null); //////////*********************************marker or markers????????????????
      });
      markers = [];

      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
      places.forEach(function(place) {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }
        var icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };

        // Create a marker for each place.
        markers.push(new google.maps.Marker({
          map: map,
          icon: icon,
          title: place.name,
          position: place.geometry.location
        }));

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
       });
	   ////*********
	   //alert("hello");
	   getAllUserLocation();
	   UpdatePosDb();
}

function getAllUserLocation()
{
	//alert("hello");
	xhr1=new XMLHttpRequest();
	xhr1.onreadystatechange=function(){
			if(this.readyState==4 && this.status==200)
			{
				res=JSON.parse(this.response);
				var markers=[];
				for(i=0; i<res.length; i++)
				{	
          console.log(res[i]);
					 var st=res[i].location.split(":");
					 //alert(st[1]);
					var postn={
						 lat:parseFloat(st[0]),
						 lng:parseFloat(st[1])
						 };
					 markers[i] = new google.maps.Marker({
						icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
						map: map,
						position: postn
					});
					map.setCenter(postn);
				}
				
			}
		}
	xhr1.open("GET", "loginscripts/getuserid.php", true);
	xhr1.send();
}

function UpdatePosDb()
{
	xhr=new XMLHttpRequest();
	xhr.onreadystatechange=function() {
				if (this.readyState == 4 && this.status == 200) 
				{
					setTimeout(UpdatePosDb, 5000);
				}
		};
	if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            pos1 = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
				  };
				
				if(pos1){
				pos=pos1;
				obj=new google.maps.LatLng(pos.lat,pos.lng)
				marker.setPosition(obj);
				}
			
            map.setCenter(pos1);
			 url = "travelepic/../loginscripts/updatedb.php?lat="+parseFloat(position.coords.latitude)+"&lon="+parseFloat(position.coords.longitude);
			 xhr.open("GET", url, true);
			 xhr.send();
				  /////UPDATE MARKER *********************
				//  marker.setMap(null);
				 // marker.setPosition(pos1);	  
				 
				  //alert("hello");  
			});
		}
		else {
				handleLocationError(false, infoWindow, map.getCenter());
			 }
	
	
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) 
{
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                                                'Error: The Geolocation service failed.' :
                                                'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

function locationAddress(geocoder, resultsMap) {
    var address = document.getElementById('destination').value;
    
    geocoder.geocode({'address': address}, function(results, status) {
        if (status === 'OK') {
            resultsMap.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: resultsMap,
                animation: google.maps.Animation.DROP,
                position: results[0].geometry.location
            });
        } 
        else
        {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

function calculateAndDisplayRoute(directionsService,directionsDisplay,pos)
{
    directionsService.route({
            origin: pos,
            destination: document.getElementById('destination').value,
            travelMode: 'DRIVING'
        }, 
        function(response, status) {
            if (status === 'OK') {
                directionsDisplay.setDirections(response);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        }
    );
	//alert(pos);
	
	if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            pos1 = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
				  };
				
	var dest=document.getElementById('destination').value;
	xhr2=new XMLHttpRequest();
	xhr.open("GET","travelepic/../loginscripts/updatedest.php?lat="+parseFloat(position.coords.latitude)+"&lon="+parseFloat(position.coords.longitude)+"&dest="+dest,true);
	xhr.send(); 
			});
		}
	
    if(marker) 
		marker.setMap(null);
}
