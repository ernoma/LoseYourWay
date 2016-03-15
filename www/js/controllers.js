
var loseYourWayControllers = angular.module('loseYourWayControllers', [])

loseYourWayControllers.controller('RoutesCtrl', function($scope, $http, $state, $localstorage) {

	// $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {

		// console.log("State changed: ", toState);
		
		// var downloadedRoutes = $localstorage.getObject("downloadedRoutes");
		// $scope.savedRoutes = $localstorage.getObject("savedRoutes");
		
		// if (Object.keys(downloadedRoutes).length === 0 && JSON.stringify(downloadedRoutes) === JSON.stringify({})) {
			// downloadedRoutes.array = [];
			// $scope.downloadedRoutes = downloadedRoutes.array;
		// }
		// else {
			// if (Object.keys($scope.savedRoutes).length === 0 && JSON.stringify($scope.savedRoutes) === JSON.stringify({})) {
				// $scope.downloadedRoutes = downloadedRoutes.array;
			// }
			// else {
				// var savedRoutes = $scope.savedRoutes.array;
				// var unfinishedRoutes = [];
				// for (var i = 0; i < downloadedRoutes.array.length; i++) {
					// var foundFinished = false;
					// for (var j = 0; j < savedRoutes.length; j++) {
						// if (downloadedRoutes.array[i]._id == savedRoutes[j].routeID) {
							// if (savedRoutes[j].finished == true) {
								// foundFinished = true;
								// if ($scope.finishedRoutes != undefined) {
									// $scope.finishedRoutes.push(downloadedRoutes.array[i]);
								// }
							// }
							// break;
						// }
					// }
					// if (!foundFinished) {
						// unfinishedRoutes.push(downloadedRoutes.array[i]);
					// }
				// }
				
				// $scope.downloadedRoutes = unfinishedRoutes;
			// }
		// }
	// });

	$scope.savedRoutes = $localstorage.getObject("savedRoutes");
	//console.log($scope.savedRoutes);

	$http.get('data/default_routes.json').success(function(data) {
		//console.log(data);
		//console.log($scope.savedRoutes);
		var savedRoutes = $scope.savedRoutes.array;
		
		var unfinishedRoutes = [];
		var finishedRoutes = [];
		
		if (Object.keys($scope.savedRoutes).length === 0 && JSON.stringify($scope.savedRoutes) === JSON.stringify({})) {
			$scope.routes = data;
			$scope.finishedRoutes = [];
		}
		else {
			for (var i = 0; i < data.length; i++) {
				var foundFinished = false;
				for (var j = 0; j < savedRoutes.length; j++) {
					if (data[i]._id == savedRoutes[j].routeID) {
						if (savedRoutes[j].finished == true) {
							foundFinished = true;
							finishedRoutes.push(data[i]);
						}
						break;
					}
				}
				if (!foundFinished) {
					unfinishedRoutes.push(data[i]);
				}
			}
			
			$scope.routes = unfinishedRoutes;
			$scope.finishedRoutes = finishedRoutes;
		}
		
		//$scope.routes = data;
		
		var downloadedRoutes = $localstorage.getObject("downloadedRoutes");
	
		if (Object.keys(downloadedRoutes).length === 0 && JSON.stringify(downloadedRoutes) === JSON.stringify({})) {
			downloadedRoutes.array = [];
			$scope.downloadedRoutes = downloadedRoutes.array;
		}
		else {
			if (Object.keys($scope.savedRoutes).length === 0 && JSON.stringify($scope.savedRoutes) === JSON.stringify({})) {
				$scope.downloadedRoutes = downloadedRoutes.array;
			}
			else {
				var savedRoutes = $scope.savedRoutes.array;
				var unfinishedRoutes = [];
				for (var i = 0; i < downloadedRoutes.array.length; i++) {
					var foundFinished = false;
					for (var j = 0; j < savedRoutes.length; j++) {
						if (downloadedRoutes.array[i]._id == savedRoutes[j].routeID) {
							if (savedRoutes[j].finished == true) {
								foundFinished = true;
								$scope.finishedRoutes.push(downloadedRoutes.array[i]);
							}
							break;
						}
					}
					if (!foundFinished) {
						unfinishedRoutes.push(downloadedRoutes.array[i]);
					}
				}
				
				$scope.downloadedRoutes = unfinishedRoutes;
			}
		}
	});
	
	
	$scope.startRoute = function(routeID, routeName) {
		
		console.log($scope.savedRoutes);
		if (Object.keys($scope.savedRoutes).length === 0 && JSON.stringify($scope.savedRoutes) === JSON.stringify({})) {
			console.log("no saved routes");
			$scope.savedRoutes.array = [];
		}
		var savedRoutes = $scope.savedRoutes.array;
		
		var foundSavedRoute = false;
		var step = 0;
		
		for (var i = 0; i < savedRoutes.length; i++) {
			if (savedRoutes[i].routeID == routeID) {
				//step = savedRoutes[i].savedTasks.length - 1;
				foundSavedRoute = true;
				break;
			}
		}
		
		if (!foundSavedRoute) {
			var savedRoute = {
				routeID: routeID,
				savedTasks: [],
				GPSTrace: {},
				routeSatisfaction: -1,
				finished: false
			};
			
			savedRoutes.push(savedRoute);
			$localstorage.setObject("savedRoutes", $scope.savedRoutes);
		}
		
		$state.go("tab.route-detail", {routeID: routeID, step: step});
	}
})

loseYourWayControllers.controller('RouteFindCtrl', function($scope, $http, $state, $stateParams, $localstorage, Route) {
	$scope.title = "Find Routes";
	
	$scope.orderProp = 'name';
	
	$scope.downloadedRoutes = $localstorage.getObject("downloadedRoutes");
	
	$scope.availableRoutes = Route.query(function() {
		var tempRoutes = [];
	
		if (Object.keys($scope.downloadedRoutes).length === 0 && JSON.stringify($scope.downloadedRoutes) === JSON.stringify({})) {
			console.log("no downloaded routes");
			$scope.downloadedRoutes.array = [];
		}
		var downloadedRoutes = $scope.downloadedRoutes.array;
		for (var i = 0; i < $scope.availableRoutes.length; i++) {
			var found = false;
			for (var j = 0; j < downloadedRoutes.length; j++) {
				if ($scope.availableRoutes[i]._id == downloadedRoutes[j]._id) {
					found = true;
					break;
				}
			}
			
			if (!found) {
				tempRoutes.push($scope.availableRoutes[i]);
			}
		}
		
		$scope.routes = tempRoutes;
	});
	
	//$http.get('data/dummyroutes.json').success(function(data) {
	//	$scope.routes = data;
	//});
	
	$scope.download = function(route) {
		$scope.downloadedRoutes.array.push(route);
		$localstorage.setObject("downloadedRoutes", $scope.downloadedRoutes);
		
		var tempRoutes = [];
		var downloadedRoutes = $scope.downloadedRoutes.array;
		for (var i = 0; i < $scope.availableRoutes.length; i++) {
			var found = false;
			for (var j = 0; j < downloadedRoutes.length; j++) {
				if ($scope.availableRoutes[i]._id == downloadedRoutes[j]._id) {
					found = true;
					break;
				}
			}
			
			if (!found) {
				tempRoutes.push($scope.availableRoutes[i]);
			}
		}
		
		$scope.routes = tempRoutes;
	}
})

loseYourWayControllers.controller('RouteDetailCtrl', function($scope, $http, $state, $stateParams, $ionicHistory, Camera, $localstorage) {
	
	$scope.savedRoutes = $localstorage.getObject("savedRoutes");
	
	$scope.routeID = $stateParams.routeID;
	$scope.routeStep = Number($stateParams.step);
	
	$scope.routeSatisfaction = 50;
	
	$scope.lastPhotoURI = "";
	
	$scope.word = "";
	
	var savedRoutes = $scope.savedRoutes.array;
	
	for (var i = 0; i < savedRoutes.length; i++) {
		if (savedRoutes[i].routeID == $scope.routeID) {
				
			if ($scope.routeStep == savedRoutes[i].savedTasks.length) { // the route step is seen first time by the user
				
				var savedTask = {
					routeStep: $scope.routeStep,
					photoURL: "",
					word: ""
				}
				savedRoutes[i].savedTasks.push(savedTask);
				$localstorage.setObject("savedRoutes", $scope.savedRoutes);
			}
			else {
				$scope.lastPhotoURI = savedRoutes[i].savedTasks[$scope.routeStep].photoURL;
				console.log(savedRoutes[i].savedTasks[$scope.routeStep].word);
				$scope.word = savedRoutes[i].savedTasks[$scope.routeStep].word;
				if (savedRoutes[i].routeSatisfaction > 0) {
					$scope.routeSatisfaction = savedRoutes[i].routeSatisfaction;
				}
			}
			
			break;
		}
	}
	
	$scope.nextStep = function() {

		var step = $scope.routeStep + 1;
		$state.go("tab.route-detail", {routeID: $scope.routeID, step: step});
	}
	
	$scope.finishRoute = function() {
		var savedRoutes = $scope.savedRoutes.array;
		for (var i = 0; i < savedRoutes.length; i++) {
			if (savedRoutes[i].routeID == $scope.routeID) {
				savedRoutes[i].finished = true;
				$localstorage.setObject("savedRoutes", $scope.savedRoutes);
				break;
			}
		}
		
		$ionicHistory.nextViewOptions({
			historyRoot: true
		});
		$state.go("tab.routes");

	}
	
	$scope.wordChange = function(word) {
		var savedTask = loadCurrentSavedTask();
		savedTask.word = word;
		console.log(savedTask.word);
		$localstorage.setObject("savedRoutes", $scope.savedRoutes);
	}
	
	$scope.routeSatisfactionChange = function(routeSatisfaction) {
		var savedRoutes = $scope.savedRoutes.array;
		for (var i = 0; i < savedRoutes.length; i++) {
			if (savedRoutes[i].routeID == $scope.routeID) {
				savedRoutes[i].routeSatisfaction = routeSatisfaction;
				$localstorage.setObject("savedRoutes", $scope.savedRoutes);
				break;
			}
		}
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
			$scope.lastPhotoURI = imageURI;
			var savedTask = loadCurrentSavedTask();
			savedTask.photoURL = imageURI;
			$localstorage.setObject("savedRoutes", $scope.savedRoutes);
			
		}, function(err) {
			console.err(err);
		});
	}
	
	var loadCurrentSavedTask = function() {
		var savedRoutes = $scope.savedRoutes.array;
		
		for (var i = 0; i < savedRoutes.length; i++) {
			if (savedRoutes[i].routeID == $scope.routeID) {
				return savedRoutes[i].savedTasks[$scope.routeStep];
			}
		}
	}
	
	$http.get('data/default_routes.json').success(function(routes) {
		
		var found = false;
		
		for (var i = 0; i < routes.length; i++) {
			
			if (routes[i]._id == $scope.routeID) {
		
				$scope.steps = routes[i].tasks;
				
				$scope.name = routes[i].name;
				
				if ($stateParams.step == 0) {
					$scope.title = "Lose Your Way - " + routes[i].name;
				}
				else if ($stateParams.step <= routes[i].tasks.length) {
					$scope.title = routes[i].name + " - Step " + $stateParams.step;
				}
				else { // Finished
					$scope.title = routes[i].name + " - Finished";
				}
				
				found = true;
				
				break;
			}
		}
		
		if (!found) {
			var downloadedRoutes = $localstorage.getObject("downloadedRoutes");
			
			for (var i = 0; i < downloadedRoutes.array.length; i++) {
				if (downloadedRoutes.array[i]._id == $scope.routeID) {
		
					$scope.steps = downloadedRoutes.array[i].tasks;
					
					$scope.name = downloadedRoutes.array[i].name;
					
					if ($stateParams.step == 0) {
						$scope.title = "Lose Your Way - " + downloadedRoutes.array[i].name;
					}
					else if ($stateParams.step <= downloadedRoutes.array[i].tasks.length) {
						$scope.title = downloadedRoutes.array[i].name + " - Step " + $stateParams.step;
					}
					else { // Finished
						$scope.title = downloadedRoutes.array[i].name + " - Finished";
					}
					
					found = true;
					
					break;
				}
			}
		}
	});
})

loseYourWayControllers.controller('MapCtrl', function($scope, $cordovaGeolocation) {
	
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

loseYourWayControllers.controller('SocialCtrl', function($scope, $cordovaSocialSharing, $localstorage, $ionicModal) {
	$scope.settings = {
		enableFriends: true
	};
	
	$ionicModal.fromTemplateUrl('my-modal.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal;
	});
	$scope.openModal = function() {
		$scope.modal.show();
	};
	$scope.closeModal = function() {
		$scope.modal.hide();
	};
	//Cleanup the modal when we're done with it!
	$scope.$on('$destroy', function() {
		$scope.modal.remove();
	});
	// Execute action on hide modal
	$scope.$on('modal.hidden', function() {
		// Execute action
	});
	// Execute action on remove modal
	$scope.$on('modal.removed', function() {
		// Execute action
	});

	$scope.shareAnywhere = function() {
		console.log($cordovaSocialSharing);
        $cordovaSocialSharing.share("This is your message", "This is your subject", "www/imagefile.png", "https://www.thepolyglotdeveloper.com");
    }
 
    $scope.shareViaTwitter = function(message, image, link) {
        $cordovaSocialSharing.canShareVia("twitter", message, image, link).then(function(result) {
            $cordovaSocialSharing.shareViaTwitter(message, image, link);
        }, function(error) {
            alert("Cannot share on Twitter");
        });
    }
	
	$scope.savedRoutes = $localstorage.getObject("savedRoutes");
	
	var finishedRoutes = [];
		
	if (Object.keys($scope.savedRoutes).length === 0 && JSON.stringify($scope.savedRoutes) === JSON.stringify({})) {
		$scope.finishedRoutes = [];
	}
	else {
		var savedRoutes = $scope.savedRoutes.array;
		
		for (var i = 0; i < savedRoutes.length; i++) {
			if (savedRoutes[i].finished == true) {
				finishedRoutes.push(savedRoutes[i]);
			}
		}
		
		$scope.finishedRoutes = finishedRoutes;
	}
});

