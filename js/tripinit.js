marker=null;

function initMap()
{
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
  
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  directionsDisplay.setOptions( { suppressMarkers: true } );
  
  pos=null;
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
    
    //Bind directions API to google maps
    directionsDisplay.setMap(map);

    var geocoder = new google.maps.Geocoder();
    
    $('#submit').click(function(){
      locationAddress(geocoder, map);
      calculateAndDisplayRoute(directionsService, directionsDisplay,pos);
    });

    setTimeout(getDestination, 1000);

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
          // console.log(res[i]);
					 var st=res[i].location.split(":");
					 //alert(st[1]);
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
          if(getDistanceFromLatLonInKm(pos,pos1)>1.5)
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
    //Dont send xhr request and handle error gracefully
		handleLocationError(false, infoWindow, map.getCenter());
	}
}

function getDestination(){
  var xhr1=new XMLHttpRequest();
  xhr1.onreadystatechange=function()
  {
    if(this.readyState==4 && this.status==200)
    {
      if(this.responseText !== "Error Retrieving destination"){
        dest1=this.responseText;
        dest=$('#destination').val();

        if(dest1!=dest)
        {
          $('#destination').val(dest1);
          $('#submit').click();
        }
      } 
      setTimeout(getDestination, 5000);
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
        	xhr2.open("GET","travelepic/../loginscripts/updatedest.php?lat="+parseFloat(position.coords.latitude)+"&lon="+parseFloat(position.coords.longitude)+"&dest="+dest,true);
        	xhr2.send(); 
      	});
	}
	
}
