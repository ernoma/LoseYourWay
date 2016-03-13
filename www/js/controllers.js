
var loseYourWayControllers = angular.module('loseYourWayControllers', [])

loseYourWayControllers.controller('RoutesCtrl', function($scope, $http) {
	$http.get('data/themes.json').success(function(data) {
		$scope.themes = data;
	});
})

loseYourWayControllers.controller('RouteDetailCtrl', function($scope, $http, $state, $stateParams, $ionicHistory, Camera) {
	
	$scope.routeID = $stateParams.routeID;
	$scope.routeStep = Number($stateParams.step);
	
	$scope.routeSatisfaction = 50;
	
	$scope.lastPhotoURI = "";
	
	$scope.finishRoute = function() {
		$ionicHistory.nextViewOptions({
			historyRoot: true
		});
		$state.go("tab.routes");

	}
	
	$scope.takePicture = function() {
		Camera.getPicture({
		  quality: 75,
		  targetWidth: 320,
		  targetHeight: 320,
		  correctOrientation: true,
		  saveToPhotoAlbum: false
		}).then(function(imageURI) {
			console.log(imageURI);
			$scope.lastPhoto = imageURI;
			$scope.lastPhotoURI = imageURI;
		}, function(err) {
			console.err(err);
		});
	}
	
	return $http.get('data/' + $stateParams.routeID + '.json').success(function(data) {
		$scope.steps = data.steps;
		
		if ($stateParams.step == 0) {
			$scope.title = "Lose Your Way - Imagine";
		}
		else if ($stateParams.step <= data.steps.length) {
			$scope.title = "Imagine - Step " + $stateParams.step;
		}
		else { // Finished
			$scope.title = "Imagine - Finished";
		}
		
	});

})

loseYourWayControllers.controller('MapCtrl', function($scope, $cordovaGeolocation) {
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

})


loseYourWayControllers.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

loseYourWayControllers.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

loseYourWayControllers.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});

