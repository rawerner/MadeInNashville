/* global document, sendAjaxRequest */

$(document).ready(initialize);

var map;

function initialize(){
  $(document).foundation();
  initMap(36.1297, -86.7933, 12);
  $('#addCompany').on('click', clickAddCompany);
  $('#registerform').on('submit', clickRegister);
  $('#filtersMenu li button').on('click', filter);
  createMarkers();

  function initMap(lat, lng, zoom){
    var mapOptions = {center: new google.maps.LatLng(lat, lng), zoom: zoom, mapTypeId: google.maps.MapTypeId.ROADMAP};
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  }
}


///---------------------------------------------------------///
///---------------------------------------------------------///


function createMarkers(){
  var markers = [];
  for (var i = 0; i < orgs.length; i++) {
    latLng = new google.maps.LatLng(orgs[i].lat, orgs[i].lng);
    var marker = new google.maps.Marker({map:map, position: latLng, title: orgs[i].name});
    markers.push(marker);
  }
  var markerCluster = new MarkerClusterer(map, markers);
}

function filter(){
  var filtered;

  var filter = $(this).data('type');
  switch(filter){
    case 'all':
      filtered = orgs;
      break;
    case 'isHiring':
      filtered = _.filter(orgs, function(o){return o.isHiring;});
     break;
    default:
      filtered = _.filter(orgs, function(o){return o.type === filter});
  }

  console.log(filtered.length);
}

function clickAddCompany(){
  $('#registerform').toggleClass('hidden');
  //$('input[name="name"]').focus();
}

function clickRegister(e){
  var url = '/orgs';
  var name = $('input[name="name"]').val();
  var website = $('input[name="website"]').val();
  var street = $('input[name="streetAddress"]').val();
  var city = $('select[name="city"]').val();
  var address = street + ', ' + city + ', TN';
  var type = $('select[name="type"]').val();
  var isHiring = $('#isHiring').is(':checked');
  var hiringUrl = $('input[name="hiringUrl"]').val();
  var whyNashville = $('input[name="whyNashville"]').val();
  var email = $('input[name="email"]').val();
  console.log(isHiring);
  geocodeAddress(address, function(lat, lng){
    var data = {name:name, website: website, street:street, city:city, lat:lat, lng:lng, type:type, isHiring:isHiring, hiringUrl:hiringUrl, whyNashville:whyNashville, email:email};
    console.log(data);
    sendAjaxRequest(url, data, 'post', null, e, function(data){
        htmlAddMarker(data);
        htmlHideForm();
      });
  });
  return false;
}

function geocodeAddress(address, finishedFn){
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({address:address}, function(results, status){
    var latLong = results[0].geometry.location;
    finishedFn(latLong.lat(), latLong.lng());
  });
}

///---------------------------------------------------------///
///---------------------------------------------------------///

function htmlAddMarker(org){
  var latLng = new google.maps.LatLng(org.lat, org.lng);
  var marker = new google.maps.Marker({map:map, position: latLng, title: org.name});
  var contentString = '<div class="markerWindow"><a href="http://google.com">Company A</a></div>';
  var infowindow = new google.maps.InfoWindow({
      content: contentString

    });
  marker.setMap(map);
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.open(map,marker);
  });

}

function htmlHideForm(){
  $('form#registerform input').val('');
  $('input[name="name"]').focus();
  $('#registerform').toggleClass('hidden');

}
