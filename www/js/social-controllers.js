
var socialControllers = angular.module('socialControllers', [])

.controller('SocialCtrl', function($scope, $localstorage, $state, Route, RouteResult, $q, ImageUploadService, $ionicPopup) {
	
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
						GPSTrace: finishedRoutes[i].GPSTrace,
						savedTasks: finishedRoutes[i].savedTasks,
						tasks: downloadedRoutes.array[j].tasks,
						quantitativeQuestions: finishedRoutes[i].quantitativeQuestions,
						qualitativeQuestions: finishedRoutes[i].qualitativeQuestions,
						shared: finishedRoutes[i].shared
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
						GPSTrace: finishedRoutes[i].GPSTrace,
						savedTasks: finishedRoutes[i].savedTasks,
						tasks: downloadedRoutes.array[j].tasks,
						quantitativeQuestions: finishedRoutes[i].quantitativeQuestions,
						qualitativeQuestions: finishedRoutes[i].qualitativeQuestions,
						shared: finishedRoutes[i].shared
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
	
		var confirmPopup = $ionicPopup.confirm({
			title: 'Share Route',
			template: 'The route with visited locations, photos you have taken, and with the written words as well as the user feedback will become publically visible in the website. Are you sure?'
		});

		confirmPopup.then(function(res) {
			if(res) { // Ok pressed
	
				var routeResult = {
					routeID: route.id,
					name: route.name,
					theme: route.theme,
					GPSTrace: route.GPSTrace,
					quantitativeQuestions: route.quantitativeQuestions,
					qualitativeQuestions: route.qualitativeQuestions
				};
				
				function saveExperienceToServer(array) {
					routeResult.savedTasks = array;
					
					var newRouteResult = new RouteResult(routeResult);
					var response = newRouteResult.$save(function (data) {
						console.log(data);
						
						var savedRoutes = $localstorage.getObject("savedRoutes");
				
						for (var i = 0; i < savedRoutes.array.length; i++) {
							if (savedRoutes.array[i].routeID == route.id) {
								savedRoutes.array[i].shared = true;
								$localstorage.setObject("savedRoutes", savedRoutes);
								break;
							}
						}
						
						for (var i = 0; i < $scope.routes.length; i++) {
							if ($scope.routes[i].id == route.id) {
								$scope.routes[i].shared = true;
								break;
							}
						}
					});
				}
				
				function uploadImage(task) {
					
					var deferred = $q.defer();
					
					ImageUploadService.uploadImage(task.photoURL).then(function(result) {
						console.log(result);
						if (result && result.secure_url) {
							task.photoURL = result.secure_url;
						}
						deferred.resolve(result);	
					});
					
					return deferred;
				}
			
				var savedTasks = route.savedTasks.slice(1, route.savedTasks.length-1); // there is an "extra" step in the beginning and end of the savedTasks
				for (var i = 0; i < route.tasks.length; i++) {
					savedTasks[i].instructions = route.tasks[i].instructions;
					savedTasks[i].type = route.tasks[i].type;
					savedTasks[i].routeStep = route.tasks[i].routeStep;
				}
			
				var defer = $q.defer();
				var promises = [];
			
				angular.forEach(savedTasks, function(task) {
					if (task.photoURL != "") {
						promises.push(uploadImage(task).promise);
					}
				});
				
				$q.all(promises).then(function (results) {
					console.log(results);
					saveExperienceToServer(savedTasks);
				});
			}
	   });
	}
	
	$scope.shareRoute = function(route) {
		
		var confirmPopup = $ionicPopup.confirm({
			title: 'Share Route',
			template: 'The route will become searchable in the other users Our way applications as well as in the website. Are you sure?'
		});

		confirmPopup.then(function(res) {
			if(res) { // Ok pressed
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
	   });
	}
});

