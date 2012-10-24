/*
	javascript ruler for google maps V3

	by Giulio Pons. http://www.barattalo.it
	this function uses the label class from Marc Ridley Blog
	angepasst

*/
function addruler() {
	//removeruler();
	var map_ne, map_center, map_mess_position_beginn, lat_map_mess_position_beginn, lng_map_mess_position_beginn, map_mess_position_ende, lng_map_mess_position_ende;
	map_center = map.getCenter();
	map_ne = map.getBounds().getNorthEast();
	map_sw = map.getBounds().getSouthWest();
	lat_map_mess_position_beginn = map_sw.lat() + ((map_ne.lat()-map_center.lat())/8);
	lng_map_mess_position_beginn = map_sw.lng() + ((map_center.lng()-map_sw.lng())/8);
	lng_map_mess_position_ende = map_sw.lng() + (((map_center.lng()-map_sw.lng())/8)*2);
	map_mess_position_beginn = new google.maps.LatLng(lat_map_mess_position_beginn, lng_map_mess_position_beginn);
	map_mess_position_ende = new google.maps.LatLng(lat_map_mess_position_beginn, lng_map_mess_position_ende);
	ruler1 = new google.maps.Marker({
		//position: map.getCenter(),
		position: map_mess_position_beginn,
		map: map,
		title: 'Beginn Messung',
		draggable: true
	});

	ruler2 = new google.maps.Marker({
		//position: map.getCenter(),
		position: map_mess_position_ende,
		map: map,
		title: 'Ende Messung',
		draggable: true
	});
	ruler1label = new Label({ map: map });
	ruler2label = new Label({ map: map });
	ruler1label.bindTo('position', ruler1, 'position');
	ruler2label.bindTo('position', ruler2, 'position');

	rulerpoly = new google.maps.Polyline({
		path: [ruler1.position, ruler2.position],
		strokeColor: '#FFFF00',
		strokeOpacity: .7,
		strokeWeight: 7
	});

	rulerpoly.setMap(map);

	ruler1label.set('text', distance(ruler1.getPosition().lat(), ruler1.getPosition().lng(), ruler2.getPosition().lat(), ruler2.getPosition().lng()));
	ruler2label.set('text', distance(ruler1.getPosition().lat(), ruler1.getPosition().lng(), ruler2.getPosition().lat(), ruler2.getPosition().lng()));

	google.maps.event.addListener(ruler1, 'drag', function() {
		rulerpoly.setPath([ruler1.getPosition(), ruler2.getPosition()]);
		ruler1label.set('text', distance(ruler1.getPosition().lat(), ruler1.getPosition().lng(), ruler2.getPosition().lat(), ruler2.getPosition().lng()));
		ruler2label.set('text', distance(ruler1.getPosition().lat(), ruler1.getPosition().lng(), ruler2.getPosition().lat(), ruler2.getPosition().lng()));
	});

	google.maps.event.addListener(ruler2, 'drag', function() {
		rulerpoly.setPath([ruler1.getPosition(), ruler2.getPosition()]);
		ruler1label.set('text', distance(ruler1.getPosition().lat(), ruler1.getPosition().lng(), ruler2.getPosition().lat(), ruler2.getPosition().lng()));
		ruler2label.set('text', distance(ruler1.getPosition().lat(), ruler1.getPosition().lng(), ruler2.getPosition().lat(), ruler2.getPosition().lng()));
	});
}

function removeruler() {
	google.maps.event.clearListeners(ruler1, 'drag');
	ruler1.setMap(null);
	google.maps.event.clearListeners(ruler2, 'drag');
	ruler2.setMap(null);
	ruler1label.setMap(null);
	ruler2label.setMap(null);
	rulerpoly.setMap(null);
}


function distance(lat1,lon1,lat2,lon2) {
	var R = 6371; // km (change this constant to get miles)
	var dLat = (lat2-lat1) * Math.PI / 180;
	var dLon = (lon2-lon1) * Math.PI / 180; 
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
		Math.cos(lat1 * Math.PI / 180 ) * Math.cos(lat2 * Math.PI / 180 ) * 
		Math.sin(dLon/2) * Math.sin(dLon/2); 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c;
	if (d>10) return Math.round(d)+"km";
	else if (d<=10) return Math.round(d*1000)+"m";
	return d;
}

// Define the overlay, derived from google.maps.OverlayView
function Label(opt_options) {
	// Initialization
	this.setValues(opt_options);

	// Label specific
	var span = this.span_ = document.createElement('span');
	span.style.cssText = 'position: relative; left: 0%; top: -8px; ' +
			  'white-space: nowrap; border: 0px; font-family:arial; font-weight:bold;' +
			  'padding: 2px; background-color: #ddd; '+
				'opacity: .75; '+
				'filter: alpha(opacity=75); '+
				'-ms-filter: "alpha(opacity=75)"; '+
				'-khtml-opacity: .75; '+
				'-moz-opacity: .75;';

	var div = this.div_ = document.createElement('div');
	div.appendChild(span);
	div.style.cssText = 'position: absolute; display: none';
};
Label.prototype = new google.maps.OverlayView;

// Implement onAdd
Label.prototype.onAdd = function() {
	var pane = this.getPanes().overlayLayer;
	pane.appendChild(this.div_);

	
	// Ensures the label is redrawn if the text or position is changed.
	var me = this;
	this.listeners_ = [
		google.maps.event.addListener(this, 'position_changed',
		function() { me.draw(); }),
		google.maps.event.addListener(this, 'text_changed',
		function() { me.draw(); })
	];
	
};

// Implement onRemove
Label.prototype.onRemove = function() { this.div_.parentNode.removeChild(this.div_ );
	// Label is removed from the map, stop updating its position/text.
	for (var i = 0, I = this.listeners_.length; i < I; ++i) {
		google.maps.event.removeListener(this.listeners_[i]);
	}
};

// Implement draw
Label.prototype.draw = function() {
	var projection = this.getProjection();
	var position = projection.fromLatLngToDivPixel(this.get('position'));

	var div = this.div_;
	div.style.left = position.x + 'px';
	div.style.top = position.y + 'px';
	div.style.display = 'block';

	this.span_.innerHTML = this.get('text').toString();
};