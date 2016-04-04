
var routeControllers = angular.module('routeControllers', [])

.controller('RoutesCtrl', function($scope, $http, $state, $localstorage) {
	
	$scope.routes = [];
	$scope.finishedRoutes = [];
	
	$http.get('data/default_routes.json').success(function(data) {
		var downloadedRoutes = $localstorage.getObject("downloadedRoutes");
	
		//
		// Add default routes to downloaded routes if not there yet
		//
		if (Object.keys(downloadedRoutes).length === 0 && JSON.stringify(downloadedRoutes) === JSON.stringify({})) {
			downloadedRoutes.array = [];
			downloadedRoutes.array.push.apply(downloadedRoutes.array, data);
			$localstorage.setObject("downloadedRoutes", downloadedRoutes);
		}
		
		var savedRoutes = $localstorage.getObject("savedRoutes");
		
		if (Object.keys(savedRoutes).length === 0 && JSON.stringify(savedRoutes) === JSON.stringify({})) {
			$scope.routes = downloadedRoutes.array;
		}
		else {
			var unfinishedRoutes = [];
			for (var i = 0; i < downloadedRoutes.array.length; i++) {
				var foundFinished = false;
				for (var j = 0; j < savedRoutes.array.length; j++) {
					if (downloadedRoutes.array[i]._id == savedRoutes.array[j].routeID) {
						if (savedRoutes.array[j].finished == true) {
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
			$scope.routes = unfinishedRoutes;
		}
	});
	
	//
	// Make the route that the user has downloaded visible in the route list
	//
	$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {

		//console.log("State changed: ", toState);
		
		var downloadedRoutes = $localstorage.getObject("downloadedRoutes");
		var savedRoutes = $localstorage.getObject("savedRoutes");
		
		if (Object.keys(savedRoutes).length === 0 && JSON.stringify(savedRoutes) === JSON.stringify({})) {
			$scope.routes = downloadedRoutes.array;
		}
		else {
			var finishedRoutes = [];
			var unfinishedRoutes = [];
			for (var i = 0; i < downloadedRoutes.array.length; i++) {
				var foundFinished = false;
				for (var j = 0; j < savedRoutes.array.length; j++) {
					if (downloadedRoutes.array[i]._id == savedRoutes.array[j].routeID) {
						if (savedRoutes.array[j].finished == true) {
							foundFinished = true;
							finishedRoutes.push(downloadedRoutes.array[i]);
						}
						break;
					}
				}
				if (!foundFinished) {
					unfinishedRoutes.push(downloadedRoutes.array[i]);
				}
			}
			
			
			$scope.finishedRoutes = finishedRoutes;
			$scope.routes = unfinishedRoutes;
		}
	});

	$scope.startRoute = function(routeID, routeName) {
		
		var savedRoutes = $localstorage.getObject("savedRoutes");
		//console.log(savedRoutes);
		if (Object.keys(savedRoutes).length === 0 && JSON.stringify(savedRoutes) === JSON.stringify({})) {
			console.log("no saved routes");
			savedRoutes.array = [];
		}
		
		var foundSavedRoute = false;
		var step = 0;
		
		for (var i = 0; i < savedRoutes.array.length; i++) {
			if (savedRoutes.array[i].routeID == routeID) {
				//step = savedRoutes.array[i].savedTasks.length - 1;
				foundSavedRoute = true;
				break;
			}
		}
		
		if (!foundSavedRoute) {
			var savedRoute = {
				routeID: routeID,
				savedTasks: [],
				GPSTrace: {},
				routeSatisfaction: 50,
				finished: false
			};
			
			savedRoutes.array.push(savedRoute);
			$localstorage.setObject("savedRoutes", savedRoutes);
		}
		
		$state.go("tab.route-detail", {routeID: routeID, step: step});
	}
	
	$scope.findRoutes = function() {
		$state.go("tab.route-find");
	}
	
	$scope.createRoute = function() {
		$state.go("tab.route-create");
	}
})

.controller('RouteCreateCtrl', function($scope, $state, $localstorage, $ionicHistory, $ionicPopup, Route) {
	$scope.title = "Create Route";
	
	$scope.route = {
		theme: "Architecture and urban design",
		name: "",
		_id: null,
		privateToUser: true,
		created: Date.now(),
		tasks: [{
			type: "move",
			routeStep: 1,
			instructions: ""
		}]
	}
	
	$scope.addTask = function() {
		$scope.route.tasks.push({
			type: "move",
			routeStep: $scope.route.tasks.length + 1,
			instructions: ""
		})
	}
	
	$scope.deleteTask = function(index) {
		console.log(index);
		$scope.route.tasks.splice(index, 1);
		
		for (var i = 0; i < $scope.route.tasks.length; i++) {
			$scope.route.tasks[i].routeStep = i + 1;
		}
	}
	
	$scope.showDeleteConfirm = function(index) {
	   var confirmPopup = $ionicPopup.confirm({
		 title: 'Delete the task',
		 template: 'Are you sure?'
	   });

	   confirmPopup.then(function(res) {
		 if(res) {
		   $scope.deleteTask(index);
		 } else {
		   // nothing to do
		 }
	   });
	}
	
	$scope.moveTaskUp = function(index) {
		$scope.route.tasks.splice(index-1, 0, $scope.route.tasks.splice(index, 1)[0]);
		
		for (var i = 0; i < $scope.route.tasks.length; i++) {
			$scope.route.tasks[i].routeStep = i + 1;
		}
	}
	
	$scope.moveTaskDown = function(index) {
			$scope.route.tasks.splice(index+1, 0, $scope.route.tasks.splice(index, 1)[0]);
			
		for (var i = 0; i < $scope.route.tasks.length; i++) {
			$scope.route.tasks[i].routeStep = i + 1;
		}
	}
	
	$scope.saveRoute = function() {
		var downloadedRoutes = $localstorage.getObject("downloadedRoutes");
		$scope.route._id = new Date().toISOString();
		downloadedRoutes.array.push($scope.route);
		$localstorage.setObject("downloadedRoutes", downloadedRoutes);
		
		$scope.route = {
			theme: "Architecture and urban design",
			name: "",
			_id: null,
			privateToUser: true,
			created: Date.now(),
			tasks: [{
				type: "move",
				routeStep: 1,
				instructions: ""
			}]
		}
		
		$ionicHistory.nextViewOptions({
			historyRoot: true
		});
		$state.go("tab.routes");
	}
	
	$scope.shareRoute = function() {
		// If route not yet in downloadedRoutes then add before uploading to server (needed for id update)
		
		var downloadedRoutes = $localstorage.getObject("downloadedRoutes");
				
		var found = false;
		
		for (var i = 0; i < downloadedRoutes.array.length; i++) {
			if (downloadedRoutes.array[i]._id == $scope.route._id) {
				found = true;
				break;
			}
		}
		if (!found) {
			$scope.saveRoute();
		}
		
		// Update the route in the downloadedRoutes and in savedRoutes (if there) with the route.id returned by the server and update privaToUser to undefined
		var newRoute = new Route($scope.route);
		newRoute._id = undefined;
		newRoute.privateToUser = undefined;
		var response = newRoute.$save(function (data) {
			console.log(data);
				
			var downloadedRoutes = $localstorage.getObject("downloadedRoutes");
				
			for (var i = 0; i < downloadedRoutes.array.length; i++) {
				if (downloadedRoutes.array[i]._id == $scope.route._id) {
					downloadedRoutes.array[i]._id = data._id;
					downloadedRoutes.array[i].privateToUser = undefined;
					break;
				}	
			}
			
			$localstorage.setObject("downloadedRoutes", downloadedRoutes);
			
			var savedRoutes = $localstorage.getObject("savedRoutes");
		
			if (Object.keys(savedRoutes).length === 0 && JSON.stringify(savedRoutes) === JSON.stringify({})) {
				// Nothing to do
			}
			else {
				for (var i = 0; i < savedRoutes.array.length; i++) {
					if (savedRoutes.array[i].routeID == $scope.route._id) {
						savedRoutes.array[i].routeID = data._id;
						break;
					}
				}
				
				$localstorage.setObject("savedRoutes", savedRoutes);
			}
			
			$scope.route._id = data._id;
		});
	}
})

.controller('RouteFindCtrl', function($scope, $http, $state, $stateParams, $localstorage, $ionicLoading, Route) {
	$scope.title = "Find Routes";
	
	$scope.orderProp = 'name';
	
	$scope.downloadedRoutes = $localstorage.getObject("downloadedRoutes");
	
	$ionicLoading.show({
      template: 'Retrieving...<br><ion-spinner class="spinner-energized" icon="ripple"></ion-spinner>'
    });
	
	$scope.availableRoutes = Route.query(function() {
		
		$ionicLoading.hide();
		
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

.controller('RouteDetailCtrl', function($scope, $http, $state, $stateParams, $ionicHistory, Camera, $localstorage) {
	
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
				//console.log(savedRoutes[i].savedTasks[$scope.routeStep].word);
				$scope.word = savedRoutes[i].savedTasks[$scope.routeStep].word;
				if (savedRoutes[i].routeSatisfaction > 0) {
					$scope.routeSatisfaction = savedRoutes[i].routeSatisfaction;
				}
			}
			
			break;
		}
	}
	
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
		
				for (var i = 0; i < $scope.savedRoutes.array.length; i++) {
					if ($scope.savedRoutes.array[i].routeID == $scope.routeID) {
						$scope.savedRoutes.array[i].finished = true;
						$localstorage.setObject("savedRoutes", $scope.savedRoutes);
						break;
					}
				}
			}
			
			break;
		}
	}
	
	$scope.nextStep = function() {
		var step = $scope.routeStep + 1;
		$state.go("tab.route-detail", {routeID: $scope.routeID, step: step});
	}
	
	$scope.shareExperience = function() {
		$state.go("tab.social-detail", {routeID: $scope.routeID});
	}
	
	$scope.finishRoute = function() {
		$ionicHistory.nextViewOptions({
			historyRoot: true
		});
		$state.go("tab.routes");
	}
	
	$scope.wordChange = function(word) {
		var savedTask = loadCurrentSavedTask();
		savedTask.word = word;
		//console.log(savedTask.word);
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
		  saveToPhotoAlbum: true
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
});
