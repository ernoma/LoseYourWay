
var mapControllers = angular.module('mapControllers', [])

.controller('MapCtrl', function($scope, $cordovaGeolocation) {
	
	// var map = L.map('map').setView([51.505, -0.09], 13);

	// L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		// attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	// }).addTo(map);
	
	var tilesDict = {
		amsterdam: {
			name: 'Amsterdam',
			type: 'xyz',
			url: '/data/maps/amsterdam/EPSG_900913_{z}/{x}_{y}.jpeg', 
			options: {
				tms: true,
				maxNativeZoom: 17,
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

});
