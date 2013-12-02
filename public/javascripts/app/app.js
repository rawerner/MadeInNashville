/* global document, sendAjaxRequest */

$(document).ready(initialize);

var map;
//var markerClusterer;
var markers = [];
var tribecaMapStyle = [
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      { hue: "#ffffff" },
      { lightness: 100 }
    ]

  },
  {
    featureType: "road",
    elementType: "labels",
    stylers: [
      { visibility: "on" },
      { lightness: 6 },
      { hue: "#fff700" }
    ]
  },
  {
    featureType: "water",
    stylers: [
      { hue: "#89cff0" }
    ]
  },
  {
    featureType: "transit.line",
    stylers: [
      { visibility: "off" }
    ]
  }
];
var orgs;

function initialize(){
  $(document).foundation();
  initMap(36.1297, -86.7933, 12);
  $("#addCompany").on("click", clickAddCompany);
  $("#registerform").on("submit", clickRegister);
  $("#filtersMenu li button").on("click", filterOrgs);
  $("#backbtn").on("click", htmlHideFilters);
  $("#filtersList ul").on("click",".listItem ", openOrg);

  createMarkers();
  htmlMakeList(orgs);
  htmlHideFilters();

  function initMap(lat, lng, zoom){
    var mapOptions = {center: new google.maps.LatLng(lat, lng),
      zoom: zoom,
      minZoom: 12,
      maxZoom: 20,
      panControl: false,
      zoomControl: true,
      zoomControlOptions: {
        style: google.maps.ZoomControlStyle.SMALL
      },
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      overviewMapControl: false,
      styles: tribecaMapStyle,
      mapTypeId: google.maps.MapTypeId.ROADMAP};

    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
  }

}


///---------------------------------------------------------///
///---------------------------------------------------------///


function addMarker(org){
  var icon = iconSelector(org.type);
  var latLng = new google.maps.LatLng(org.lat, org.lng);
  var marker = new google.maps.Marker({map:map, position: latLng, title: org.name, icon:icon});

  marker.setMap(map);
  google.maps.event.addListener(marker, "click", function() {
    //infowindow.open(map,marker);
    showProfile(this);
    // constructInfoWindow(orgs[i], marker);
  });

}

function createMarkers(){
  console.log(orgs);
  for (var i = 0; i < orgs.length; i++) {
    var latLng = new google.maps.LatLng(orgs[i].lat, orgs[i].lng);
    var orgType = orgs[i].type;
    var icon = iconSelector(orgType);

    var marker = new google.maps.Marker({map:map, position: latLng, title: orgs[i].name, icon:icon});

    google.maps.event.addListener(marker, "click", function() {
      //constructInfoWindow(orgs[i], marker);
      showProfile(this);
    });

    markers.push(marker);
  }
  //var markerClusterer = new MarkerClusterer(map, markers);
}


function createFilteredMarkers(filtered){
  clearMarkers();
  $( ".listItem" ).remove();

  for (var i = 0; i < filtered.length; i++) {
    var latLng = new google.maps.LatLng(filtered[i].lat, filtered[i].lng);
    var icon;
    var orgType = filtered[i].type;
    icon = iconSelector(orgType);

    var marker = new google.maps.Marker({map:map, position: latLng, title: filtered[i].name, icon:icon});

    google.maps.event.addListener(marker, "click", function() {
      //constructInfoWindow(orgs[i], marker);
      showProfile(this);
    });

    markers.push(marker);
  }
  //var markerClusterer = new MarkerClusterer(map, markers);
}

function openOrg(){
  var openorg = this.childNodes[1].innerText;
  openorg = openorg.slice(0, openorg.length-1);
  var temp = {};
  temp.title = openorg;
  showProfile(temp);
}

function clickAddCompany(){
  $("#registerform").toggleClass("hidden");
  htmlHideFilters();
}

function clickRegister(e){
  var url = "/orgs";
  var name = $("input[name='name']").val();
  var website = $("input[name='website']").val();
  var street = $("input[name='streetAddress']").val();
  var city = $("select[name='city']").val();
  var address = street + ", " + city + ", TN";
  var type = $("select[name='type']").val();
  var isHiring = $("#isHiring").is(":checked");
  var hiringUrl = $("input[name='hiringUrl']").val();
  var whyNashville = $("input[name='whyNashville']").val();
  var email = $("input[name='email']").val();
  console.log(isHiring);
  geocodeAddress(address, function(lat, lng){
    var data = {name:name, website: website, street:street, city:city, lat:lat, lng:lng, type:type, isHiring:isHiring, hiringUrl:hiringUrl, whyNashville:whyNashville, email:email};
    console.log(data);
    sendAjaxRequest(url, data, "post", null, e, function(data){
        addMarker(data);
        htmlHideForm();
      });
  });
  return false;
}


///---------------------------------------------------------///
///---------------------------------------------------------///
function showProfile(that){
  console.log(that);
  var Org = _.find(orgs, function(o){return o.name === that.title;});
  $("#profile p.infowebsite > a").remove();
  $("#profile p.infohiring > a").remove();

  htmlHideFilters();
  if($("#profile").hasClass("hidden")){
    htmlHideProfile();
  }

  $("#profile p.infoname").text(Org.name);
  $("#profile p.infoaddress").text(Org.street + ", " + Org.city);
  $("#profile p.infowebsite").append("<a href='http://'" + Org.website + "' target='_blank'>http://" + Org.website + "</a>");

  // if(Org.whyNashville){
  //   $("#profile p.infowhynashville").text(Org.whyNashville);
  // }

  if(Org.isHiring){
    $("#profile p.infohiring").append("<a href='http://'" + Org.url + "' target='_blank'>Check out our jobs!</a>");
  }else{
    $("p.infohiring").css("background-color", "transparent");
  }

}

// function constructInfoWindow(marker){
//   var contentString = '<div class="markerWindow"><a href="http://'+ org.website +'">'+ org.name+'</a></div>';
//   var infowindow = new google.maps.InfoWindow({
//     content: contentString
//   });
//   marker.setMap(map);
//   google.maps.event.addListener(marker, "click", function() {
//     infowindow.open(map,marker);
//   });

// if (mark.infowindow) {
//             mark.infowindow.close();
//         }

//         mark.infowindow = new google.maps.InfoWindow({
//             content: contentString[marker.indexOf(this)]
//         });

//         mark.infowindow.open(map,mark);

// }

function htmlHideForm(){
  $("form#registerform input").val("");
  $("input[name='name']").focus();
  $("#registerform").toggleClass("hidden");

}

function htmlMakeList(filtered){
  for(var i = 0; i < filtered.length; i++){
    var orgType = filtered[i].type;
    var icon = iconSelector(orgType);
    var hire;
    if(filtered[i].isHiring === true){
      console.log(filtered[i].isHiring);
      hire = "<div class='infohiring'><a href='http://" + filtered[i].url + "' target='_blank'>Check out our jobs!</a></div>";
    } else {
      hire = "<div class='infohiring'><a href='http://" + filtered[i].url + "' target='_blank'>Not hiring yet, but soon!</a></div>";

      //$("div.hire").hide();
    }

    var li = "<li class='listItem'><div class='iconpic'><img src='" + icon + "'></div><div class='named'><h5><a href='#'>" + filtered[i].name + "</a></h5></div><div><p class='infoaddress2'>" + filtered[i].street + "</p></div><div class='hire'>" + hire + "</div></li>";
    var $li = $(li);
    $("#filtersList ul").append($li);


  }
}

function htmlHideFilters(){
  $("#filtersMenu").toggleClass("hidden");
  $("#filtersList").toggleClass("hidden");

}

function htmlHideProfile(){
  $("#profile").toggleClass("hidden");
  $("#nashgraphic").toggleClass("hidden");
}

// function addFilters(){
//   // $("#profile").toggleClass("hidden");
//   // $("#nashgraphic").toggleClass("hidden");
//   htmlHideFilters();
// }


///---------------------------------------------------------///
///---------------------------------------------------------///

function filterOrgs(){
  var filtered;

  var myfilter = $(this).data("type");
  switch(myfilter){
    case "all":
      filtered = orgs;
      break;
    case "isHiring":
      filtered = _.filter(orgs, function(o){return o.isHiring;});
      break;
    default:
      filtered = _.filter(orgs, function(o){return o.type === myfilter;});
  }

  console.log(filtered);
  createFilteredMarkers(filtered);
  htmlMakeList(filtered);
}

function iconSelector(orgType){
  var image;
  switch(orgType){
    case "company":
      image = "../images/company.png";
      break;
    case "investor":
      image = "../images/investor.png";
      break;
    case "cospaceIncubators":
      image = "../images/colab.png";
      break;
    case "meetup-space":
      image = "../images/meetup.png";
      break;
    default:
      image = "../images/hiring.png";
  }

  return image;
}

function geocodeAddress(address, finishedFn){
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({address:address}, function(results, status){
    var latLong = results[0].geometry.location;
    finishedFn(latLong.lat(), latLong.lng());
  });
}

function clearMarkers() {
  for (var i = 0; i < markers.length; i++ ) {
    markers[i].setMap(null);
  }
  markers.length = 0;
}

