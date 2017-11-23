marker=null;
MAX_POS_UPDATE_MARGIN=1.5
dest_timeout=null

//Initializes map, directions renderer and API along with predictive fetching destinations
function initMap()
{
  //Creates map and centers it at given coords, sets zoom at city level
  map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 20.5937, lng: 78.9629},
      zoom: 10
  });

  username="";
  xhruser=new XMLHttpRequest();

  xhruser.onreadystatechange=function(){
    if(this.readyState==4 && this.status==200)
    {
      username=this.response;
    }
  }

  xhruser.open("GET", "loginscripts/getusername.php", true);
  xhruser.send();
  
  //Connects to Google's DirectionsAPI
  directionsService = new google.maps.DirectionsService;
  //Object relating to rendering directions onto Google Maps
  directionsDisplay = new google.maps.DirectionsRenderer;

  //Dont change existing initial and destination markers
  directionsDisplay.setOptions( { suppressMarkers: true } );
  
  pos=null;

  //GeoLocation obtained only over https as of current web standard
  if (navigator.geolocation) {

    navigator.geolocation.getCurrentPosition(function(position) {
      //global user position shared across script files
      pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
      };
      //*************global marker**************//
      marker = new google.maps.Marker({
        icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
        map: map,
        animation: google.maps.Animation.DROP,
        position: pos,
        title: username
      });

      //Centers map to user location
      map.setCenter(pos); 

      //get Nearby locations
      getNearbyPlaces();

    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  }
  else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
    
    //Bind direction rendering API to google maps
    directionsDisplay.setMap(map);

    var geocoder = new google.maps.Geocoder();
    
    //Fetch coordinates of destination & display route
    $('#submit').click(function(){
      locationAddress(geocoder, map);
      calculateAndDisplayRoute(directionsService, directionsDisplay,pos);
    });

    //Check destination update by group admin
    dest_timeout=setTimeout(getDestination, 1000);

    //Dynamically predictively fetch most probable places as admin enters destination
    enablePlaceSearchAPI();
}


function enablePlaceSearchAPI()
{
    var input = document.getElementById('destination');
 
    var searchBox = new google.maps.places.SearchBox(input);

    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
      if(dest_timeout)
        clearTimeout(dest_timeout);

      var places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }

      // Clear out the old markers, if any
      markers.forEach(function(markert) {
        markert.setMap(null);
      });

      markers = [];

      // For each place, get the icon, name and location.
      // Create bonds to reduce place search radius
      var bounds = new google.maps.LatLngBounds();

      places.forEach(function(place) {
        if (!place.geometry) {
          // console.log("Returned place contains no geometry");
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

        //Change bounds so that places nearby to the fetched places are also included
        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });

	  getAllUserLocation();
	  UpdatePosDb();
}

//Marks other users of the group with blue markers
function getAllUserLocation()
{
	xhr1=new XMLHttpRequest();

	xhr1.onreadystatechange=function(){
			if(this.readyState==4 && this.status==200)
			{
				res=JSON.parse(this.response);
				var markers=[];
				for(i=0; i<res.length; i++)
				{	
					 var st=res[i].location.split(":");
					var postn={
						 lat:parseFloat(st[0]),
						 lng:parseFloat(st[1])
						 };
					markers[i] = new google.maps.Marker({
						icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
						map: map,
						position: postn,
            title: res[i].username
					});
					map.setCenter(postn);
				}
				
			}
		}
	xhr1.open("GET", "loginscripts/getuserid.php", true);
	xhr1.send();
}


//Sync user's current location with the backend Database
function UpdatePosDb()
{
	if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      pos1 = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
		  };
				
  		if(pos1){
        //Update nearby places only if user location is changed beyond 1.5km
        $.getScript('js/utils.js', function()
        {
          if(getDistanceFromLatLonInKm(pos,pos1)>MAX_POS_UPDATE_MARGIN)
            getNearbyPlaces();
        });

  			pos=pos1;
  			obj=new google.maps.LatLng(pos.lat,pos.lng)
        if(marker)
  			 marker.setPosition(obj);
  		}
  			
      map.setCenter(pos1);
  		url = "travelepic/../loginscripts/updatedb.php?lat="+parseFloat(position.coords.latitude)+"&lon="+parseFloat(position.coords.longitude);

      xhr=new XMLHttpRequest();
      xhr.onreadystatechange=function() {
            if (this.readyState == 4 && this.status == 200) 
            {
              setTimeout(UpdatePosDb, 5000);
            }
      };

  		xhr.open("GET", url, true);
  		xhr.send();

  	});
	}
	else {
		handleLocationError(false, infoWindow, map.getCenter());
	}
}

//Updates destination for non-admin users
function getDestination(){
  var xhr1=new XMLHttpRequest();
  xhr1.onreadystatechange=function()
  {
    if(this.readyState==4 && this.status==200)
    {
      if(this.responseText !== "Error Retrieving destination"){
        dest1=this.responseText;
        dest=$('#destination').val();

        //Update destination and recalculate directions if its changed
        if(dest1!=dest)
        {
          $('#destination').val(dest1);
          $('#submit').click();
        }
      } 
      dest_timeout=setTimeout(getDestination, 5000);
    }
  };

  xhr1.open('GET','loginscripts/getdest.php',true);
  xhr1.send();
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) 
{
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                                                'Error: The Geolocation service failed.' :
                                                'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

//Encodes place address to coordinates (lat,lng)
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

//API Request to directionsAPI to calculate path and render on map
//Only group admin is allowed
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

	if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          pos1 = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
				  };
        				
        	var dest=document.getElementById('destination').value;
        	xhr2=new XMLHttpRequest();
        	xhr2.open("GET","travelepic/../loginscripts/updatedest.php?lat="+parseFloat(position.coords.latitude)+"&lon="+parseFloat(position.coords.longitude)+"&dest="+dest,true);
        	xhr2.send(); 
      	});
	}
	
}
