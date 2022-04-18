var visitPlace = {};
var visitDate = [];
var dateSelect = document.getElementById("date-list");

function readSingleFile(e) {
  var file = e.target.files[0];
  if (!file) {
    return;
  }
  var reader = new FileReader();
  reader.onload = function(e) {
    var contents = e.target.result;
	parser(contents);
  };
  reader.readAsText(file);
}

function parser(contents){
	var result = JSON.parse(contents);
	let show = "";
	for(var i = 0, place; i<result.timelineObjects.length; i++){
		if(result.timelineObjects[i].activitySegment)
			continue;
		place = result.timelineObjects[i];
		visitPlace[(result.timelineObjects[i].placeVisit.duration.startTimestamp).substr(0,10)] = place;
		visitDate.push((result.timelineObjects[i].placeVisit.duration.startTimestamp).substr(0,10));
	}
	var inner ="";
	for(var i = 0; i<visitDate.length; i++){
		inner=inner + '<option value=i>' + visitDate[i] + '</option>';
	}
	dateSelect.innerHTML=inner;
	/*use code to rewrite XML file:
		<select id="date-list">
			<option value="0">xxx</option>
			...
		</select>
	*/
	changeDate(dateSelect);
	
}
	
function displayContents(contents) {
  var element = document.getElementById('file-content');
  element.textContent = contents;
}

function changeDate(sel){
	var localHistroy = [];
	var coordinate = {
		lat: visitPlace[sel.options[sel.selectedIndex].text].placeVisit.location.latitudeE7/10000000,
		lng: visitPlace[sel.options[sel.selectedIndex].text].placeVisit.location.longitudeE7/10000000};
	localHistroy.push(coordinate);
	for(var i =0; i<visitPlace[sel.options[sel.selectedIndex].text].placeVisit.otherCandidateLocations.length;i++){
		coordinate = {
		lat: visitPlace[sel.options[sel.selectedIndex].text].placeVisit.otherCandidateLocations[i].latitudeE7/10000000,
		lng: visitPlace[sel.options[sel.selectedIndex].text].placeVisit.otherCandidateLocations[i].longitudeE7/10000000};
		localHistroy.push(coordinate);
	}
	 var mapOptions = {
          center: { lat: localHistroy[0].lat, lng: localHistroy[0].lng},
          zoom: 16
        };
        var map = new google.maps.Map(
            document.getElementById('map-canvas'),
            mapOptions);
		var lineCoordinates = localHistroy;
		var linePath = new google.maps.Polyline({
			path: lineCoordinates,
			geodesic: true,
			strokeColor: '#008000'
		});
		var timeline = [];
		if((localHistroy[0].lat < 25.0 && localHistroy[0].lat > 24.9) && (localHistroy[0].lng < 121.3 && localHistroy[0].lng > 121.2)){//桃園
			//displayContents(sel.options[sel.selectedIndex].text);
			if(sel.options[sel.selectedIndex].text == "2022-02-18"){
				timeline = [
					{lat:25.05507390439579, lng:121.36908853878401},
					{lat:25.051431525052205, lng:121.29483112698759},
					{lat:25.008899220085397, lng:121.3023267288354},
					{lat:24.965045349654353, lng:121.2376137865062},
					{lat:24.953329164841183, lng:121.2293416576708},
					{lat:24.960252652533338, lng:121.2209035288354}
				];
			}
		}else if((localHistroy[0].lat < 25.1 && localHistroy[0].lat > 25.0) && (localHistroy[0].lng < 121.6 && localHistroy[0].lng > 121.5)){//臺北
			if(sel.options[sel.selectedIndex].text == "2022-02-27"){
				timeline = [
					{lat:25.014478723525166, lng:121.5350184865062},
					{lat:25.043717164458325, lng:121.5072162288354},
					{lat:25.016322319802693, lng:121.5308872865062},
					{lat:25.052170008342543, lng:121.54288068650621}
				];
			}else if(sel.options[sel.selectedIndex].text == "2022-04-02"){
				timeline = [
					{lat:25.059012338683637, lng:121.51373778650621},
					{lat:25.068111796877723, lng:121.51588134232918}
				];
			}
		}
		for(var i = 0; i< localHistroy.length; i++){
			var marker = new google.maps.Marker({
				position: { lat: localHistroy[i].lat, lng: localHistroy[i].lng},
				map: map,
				label: "" +(i+1)
			});
		}
		for(var i = 0; i< timeline.length; i++){
			var marker = new google.maps.Marker({
				position: { lat: timeline[i].lat, lng: timeline[i].lng},
				map: map,
				label: "" +(i+1)
			});
		}
		var covidPath = new google.maps.Polyline({
			path: timeline,
			geodesic: true,
			strokeColor: '#FF0000'
		});
		linePath.setMap(map);
		covidPath.setMap(map);
		
}


document.getElementById('file-input')
  .addEventListener('change', readSingleFile, false);
  
  