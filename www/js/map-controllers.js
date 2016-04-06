
var mapControllers = angular.module('mapControllers', [])

.controller('MapCtrl', function($scope, $cordovaGeolocation, $localstorage, leafletData) {
	
	// var map = L.map('map').setView([51.505, -0.09], 13);

	// L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		// attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	// }).addTo(map);
	
	var tilesDict = {
		amsterdam: {
			name: 'Amsterdam',
			type: 'xyz',
			url: 'data/maps/amsterdam/EPSG_900913_{z}/{x}_{y}.jpeg', 
			options: {
				tms: true,
				maxNativeZoom: 16,
				attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
			}
		},	
		openstreetmap: {
			url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
			options: {
				attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			}
		}
	};
	
	$scope.map = {
          defaults: {
            zoomControlPosition: 'bottomleft'
          },
          markers : {},
          events: {
            map: {
              enable: ['context'],
              logic: 'emit'
            }
          }
        };
	
	angular.extend($scope, {
			tiles: tilesDict.openstreetmap
	});
	
	$scope.goTo = function() {
		$scope.map.center  = {
			  lat : 61.5,
			  lng : 23.766667,
			  zoom : 12
			};
	}
	
	$scope.goTo();
	
	$scope.goToAmsterdam  = function() {
		
		$scope.tiles = tilesDict.amsterdam;
		
		$scope.map.center  = {
			  lat : 52.3707,
			  lng : 4.9004,
			  zoom : 13
			};
			
		//$scope.locate();
	}
	
	$scope.showOnlineMap = function() {
		$scope.tiles = tilesDict.openstreetmap;
		$scope.locate();
	}
	
	 $scope.locate = function(){

        $cordovaGeolocation
          .getCurrentPosition()
          .then(function (position) {
            $scope.map.center.lat  = position.coords.latitude;
            $scope.map.center.lng = position.coords.longitude;
            $scope.map.center.zoom = 15;

            $scope.map.markers.now = {
              lat:position.coords.latitude,
              lng:position.coords.longitude,
              message: "You Are Here",
              focus: true,
              draggable: false
            };

          }, function(err) {
            // error
            console.log("Location error!");
            console.log(err);
          });

      };
  
	//
	// Show saved routes GPS traces on the map
	//
	var routeColors = [ "#FF0000",
		"#0000FF",
		"#FFFF00",
		"#FF00FF",
		"#00FFFF",
		"#F0F0F0",
		"#0F0F0F",
		"#F0F000",
		"#F000F0",
		"#FFF0F0",
		"#F0FFFF",
		"#F0FF00",
		"#FF00FF"
	];
	
	var routeLines = [];
	
	$scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
        //console.log('CTRL - $ionicView.beforeEnter', viewInfo, state);

		leafletData.getMap().then(function(map) {
			for (var i = 0; i < routeLines.length; i++) {
				map.removeLayer(routeLines[i]);
			}
		
			var savedRoutes = $localstorage.getObject("savedRoutes").array;
			  
			if (savedRoutes != undefined) {
				for (var i = 0; i < savedRoutes.length; i++) {
					if (savedRoutes[i].GPSTrace.length > 0) {
						var routeColor = routeColors[i % routeColors.length];
						var latLngs = [];
						for (var j = 0; j < savedRoutes[i].GPSTrace.length; j++) {
							latLngs.push(L.latLng(savedRoutes[i].GPSTrace[j].lat, savedRoutes[i].GPSTrace[j].lng));
						}
						var name = savedRoutes[i].name;
						var routeLine = L.polyline(latLngs, {color: routeColor});
						routeLine.bindPopup('Route: ' + name + '', {
							offset: new L.Point(0, 0)
						});
						routeLine.addTo(map);
						// var popup = L.popup()
							// .setLatLng(latLngs[Math.floor(latLngs.length / 2)])
							// .setContent('<p>' + name + '</p>');
							// popup.offset = new L.Point(0, -20);
							// popup.openOn(map);
						routeLine.openPopup(latLngs[Math.floor(latLngs.length / 2)]);
						routeLines.push(routeLine);
					}
				}
			}
		});
	});
	
});
