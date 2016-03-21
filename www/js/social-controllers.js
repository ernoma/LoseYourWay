
var socialControllers = angular.module('socialControllers', [])

.controller('SocialCtrl', function($scope, $localstorage, $state, Route) {
	
	var savedRoutes = $localstorage.getObject("savedRoutes");
	
	var finishedRoutes = [];
		
	if (Object.keys(savedRoutes).length === 0 && JSON.stringify(savedRoutes) === JSON.stringify({})) {
		// nothing to do
	}
	else {
		for (var i = 0; i < savedRoutes.array.length; i++) {
			if (savedRoutes.array[i].finished == true) {
				finishedRoutes.push(savedRoutes.array[i]);
			}
		}
	}
	
	//console.log(finishedRoutes);
	
	var downloadedRoutes = $localstorage.getObject("downloadedRoutes");
	
	//console.log(downloadedRoutes);
	
	$scope.routes = [];
	
	$scope.privateRoutes = [];
	for (var j = 0; j < downloadedRoutes.array.length; j++) {
		for (var i = 0; i < finishedRoutes.length; i++) {
			if (downloadedRoutes.array[j]._id == finishedRoutes[i].routeID) {
				$scope.routes.push({
					id: finishedRoutes[i].routeID,
					name: downloadedRoutes.array[j].name,
					theme: downloadedRoutes.array[j].theme,
					satisfaction: finishedRoutes[i].routeSatisfaction
				});
			}
		}
		if (downloadedRoutes.array[j].privateToUser != undefined && downloadedRoutes.array[j].privateToUser == true) {
			$scope.privateRoutes.push(downloadedRoutes.array[j]);
		}
	}
	
	//console.log($scope.routes);
	
	
	//
	// Make sure the route list is updated
	//
	$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
		var savedRoutes = $localstorage.getObject("savedRoutes");
	
		var finishedRoutes = [];
			
		if (Object.keys(savedRoutes).length === 0 && JSON.stringify(savedRoutes) === JSON.stringify({})) {
			// nothing to do
		}
		else {
			for (var i = 0; i < savedRoutes.array.length; i++) {
				if (savedRoutes.array[i].finished == true) {
					finishedRoutes.push(savedRoutes.array[i]);
				}
			}
		}
		
		//console.log(finishedRoutes);
		
		var downloadedRoutes = $localstorage.getObject("downloadedRoutes");
		
		var routes = [];
		
		//console.log(downloadedRoutes);
		$scope.privateRoutes = [];
		for (var j = 0; j < downloadedRoutes.array.length; j++) {
			for (var i = 0; i < finishedRoutes.length; i++) {
				if (downloadedRoutes.array[j]._id == finishedRoutes[i].routeID) {
					routes.push({
						id: finishedRoutes[i].routeID,
						name: downloadedRoutes.array[j].name,
						theme: downloadedRoutes.array[j].theme,
						satisfaction: finishedRoutes[i].routeSatisfaction
					});
				}
			}
			if (downloadedRoutes.array[j].privateToUser != undefined && downloadedRoutes.array[j].privateToUser == true) {
				$scope.privateRoutes.push(downloadedRoutes.array[j]);
			}
		}
	
		$scope.routes = routes;
	});
	
	
	$scope.shareExperience = function(route) {
		$state.go("tab.social-detail", {routeID: route.id});
	}
	
	$scope.shareRoute = function(route) {
		// Update the route in the downloadedRoutes and in savedRoutes (if there) with the route.id returned by the server and update privaToUser to undefined
		var newRoute = new Route(route);
		newRoute._id = undefined;
		newRoute.privateToUser = undefined;
		var response = newRoute.$save(function (data) {
			console.log(data);
				
			var downloadedRoutes = $localstorage.getObject("downloadedRoutes");
				
			for (var i = 0; i < downloadedRoutes.array.length; i++) {
				if (downloadedRoutes.array[i]._id == route._id) {
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
					if (savedRoutes.array[i].routeID == route._id) {
						savedRoutes.array[i].routeID = data._id;
						break;
					}
				}
				
				$localstorage.setObject("savedRoutes", savedRoutes);
			}
			
			for (var i = 0; i < $scope.privateRoutes.length; i++) {
				if ($scope.privateRoutes[i]._id == route._id) {
					$scope.privateRoutes.splice(i, 1);
					break;
				}
			}
		});
	}
})
.controller('SocialDetailCtrl', function($scope, $state, $stateParams, $ionicHistory, $cordovaSocialSharing, $localstorage) {
	$scope.routeID = $stateParams.routeID;
	
	var savedRoutes = $localstorage.getObject("savedRoutes").array;
	
	for (var i = 0; i < savedRoutes.length; i++) {
		if (savedRoutes[i].routeID == $scope.routeID) {
			$scope.savedRoute = savedRoutes[i];
			break;
		}
	}
	
	var downloadedRoutes = $localstorage.getObject("downloadedRoutes");
	
	for (var i = 0; i < downloadedRoutes.array.length; i++) {
		if (downloadedRoutes.array[i]._id == $scope.routeID) {
			$scope.route = downloadedRoutes.array[i];
			$scope.title = "Share Postcard - Route: " + $scope.route.name;
			break;
		}
	}
	
	$scope.sharables = [];
	
	// For testing purposes
	$scope.sharables.push({
		photo: "http://res.cloudinary.com/demo/image/upload/sample.png",
		instructions: "If you were a graffiti, where would you be painted?",
		include: true
	});
	$scope.sharables.push({
		photo: "http://res.cloudinary.com/demo/image/upload/w_150,h_150,c_fill,r_20/sample.png",
		instructions: "Walk around until you find a gateway to other dimension.",
		include: true
	});
	$scope.sharables.push({
		photo: "http://res.cloudinary.com/demo/image/upload/e_sepia/a_10/sample.jpg",
		instructions: "Let your nose lead you until you see something flying. Take a scenery photograph.",
		include: true
	});
	
	// for (var i = 0; i < $scope.savedRoute.savedTasks.length; i++) {
		// if ($scope.savedRoute.savedTasks[i].photoURL != "") {
			// $scope.sharables.push({
				// photo: $scope.savedRoute.savedTasks[i].photoURL,
				// instructions: $scope.route.tasks[i].instructions,
				// include: true	
			// });
		// }
	// }
	
	//
	// In future choose theme & preview and then will upload to server and return web address... and after that sharing dialog is opened
	//
	$scope.createPostcard = function() {
		$cordovaSocialSharing.share("Check out the experience!", "Lose Your Way Postcard", null, "https://loseyourway.herokuapp.com/sample");
		
		$ionicHistory.nextViewOptions({
			historyRoot: true
		});
		$state.go("tab.social");
	}
	
	$scope.cancel = function() {
		$ionicHistory.nextViewOptions({
			historyRoot: true
		});
		$state.go("tab.social");
	}
});

