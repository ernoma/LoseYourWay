
var mapControllers = angular.module('mapControllers', [])

.controller('MapCtrl', function($scope, $cordovaGeolocation) {
	
	// var map = L.map('map').setView([51.505, -0.09], 13);

	// L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		// attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	// }).addTo(map);
	
	$scope.map = {
          defaults: {
            tileLayer: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            maxZoom: 18,
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
	
	$scope.goTo = function() {
		$scope.map.center  = {
			  lat : 61.5,
			  lng : 23.766667,
			  zoom : 12
			};
	}
	
	$scope.goTo();
	
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
