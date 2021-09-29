// if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(function(position) {
//         var pos = {
//             lat: position.coords.latitude,
//             lng: position.coords.longitude
//         };
//         var marker = new google.maps.Marker({
//             position: pos,
//             map: map,
//             title: 'Your position'
//         });
//         map.setCenter(pos);
//     }, function() {
//         //handle location error (i.e. if user disallowed location access manually)
//     });
// } else {
//   window.alert("Greška");
// }

let map=null;
function initMap(){
    let location=new Object();
    navigator.geolocation.getCurrentPosition(function(pos){
        location.lat=pos.coords.latitude;
        location.long=pos.coords.longitude;
        map=new google.maps.Map(document.getElementById("map"),{
            center: {lat:location.lat, lng:location.long},
            zoom:15
        });
        getRestaurants(location);
    })
}

function getRestaurants(location)
{
    var split=new google.maps.LatLng(location.lat,location.long);
    var request={
        location:split,
        radius:500,
        types:["restaurant"]
    };
    service=new google.maps.places.PlacesService(map);
    service.nearbySearch(request,callback);
}

function callback(results,status)
{
    if(status==google.maps.places.PlacesServiceStatus.OK){
        for(var i=0;i<results.length;i++){
            var place=results[i];
            let content=`<h3>${place.name}</h3>
            <h4>${place.vicinity}</h4>
            Rating: ${place.rating}`;

            var marker=new google.maps.Marker({
                position:place.geometry.location,
                map:map,
                title:place.name
            });

            var infoWindow=new google.maps.InfoWindow({
                content:content
            });

            bindInfoWindow(marker,map,infoWindow,content);
            marker.setMap(map);
        }
    }
}

function bindInfoWindow(marker,map,infoWindow,html){
    marker.addListener("click",function(){
        infoWindow.setContent(html);
        infoWindow.open(map,this);
    })
}
