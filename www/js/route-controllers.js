
var routeControllers = angular.module('routeControllers', [])

.controller('RoutesCtrl', function($scope, $http, $state, $localstorage, $ionicPopup) {
	
	$scope.data = {}
	
	$scope.showIntro = function() {
		var welcomePopup = $ionicPopup.show({
			template: '<div class="welcome_popup_div">Interested to have a bit different look to your surroundings? With Our Way you are able to do this via routes that excite your imagination. You can even create your own routes and share them with others! Have fun!!</div>',
			title: 'Welcome!',
			cssClass: 'welcome_popup',
			//subTitle: 'Please use normal things',
			scope: $scope,
			buttons: [
				{ text: '<span class="welcome_popup_button_text">OK</span>',
				type: 'button-positive'
				}
			]
		});

		// welcomePopup.then(function(res) {
			// //console.log('shown');
		// });
	}
	
	var isFirstStart = $localstorage.get("isFirstStart");
	console.log(isFirstStart);
	if (isFirstStart != "false") {
		$scope.showIntro();
		$localstorage.set("isFirstStart", false);
	}
	
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
		//console.log("State changed: ", toParams);
		//console.log("State changed: ", fromState);
		//console.log("State changed: ", fromParams);
		
		if (fromParams.routeID != "1") {
		
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
				GPSTrace: [],
				quantitativeQuestions : [
					{
					question: "I paid more attention to my environment than usually during the walk",
					value: 0
					},
					{
					question: "Instructions were interesting",
					value: 0
					},
					{
					question: "I liked performing the tasks (taking pictures, creating text) during the walk",
					value: 0
					},
					{
					question: "I liked using the app",
					value: 0
					}
				],
				qualitativeQuestions: [
					{
					question: "Did the walk provide any useful ideas?",
					answer: "",
					placeholder: "Ideas to share ..."
					},
					{
					question: "Other feedback or suggestions?",
					answer: "",
					placeholder: "Thoughts, suggestions, ..."
					}
				],
				finished: false,
				name: routeName
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
      template: 'Retrieving...<br><ion-spinner class="spinner-energized" icon="ripple"></ion-spinner><br><button class="button button-dark" ng-click="cancel()">Cancel</button>',
	  scope: $scope
    });
	
	$scope.cancel = function() {
		$ionicLoading.hide();
	}
	
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

.controller('RouteDetailCtrl', function($scope, $http, $state, $stateParams, $ionicHistory, Camera, $localstorage, $cordovaGeolocation) {
	
	$scope.savedRoutes = $localstorage.getObject("savedRoutes");
	
	$scope.routeID = $stateParams.routeID;
	$scope.routeStep = Number($stateParams.step);
	
	$scope.quantitativeQuestions = [];
	
	$scope.qualitativeQuestions = [];
	
	$scope.suggestions = "";
	
	$scope.lastPhotoURI = "";
	$scope.word = "";
	
	$scope.quantitativeQuestionOptions = {
		from: 0,
		to: 4,
		step: 1,
		scale: [0, '|', 1, '|' , 2, '|' , 3, '|' , 4]
	}
	
	var downloadedRoutes = $localstorage.getObject("downloadedRoutes");
	
	var savedRoutes = $scope.savedRoutes.array;
	
	var savedRouteIndex = null;
	
	for (var i = 0; i < savedRoutes.length; i++) {
		if (savedRoutes[i].routeID == $scope.routeID) {
			savedRouteIndex = i;
			break;
		}
	}
		
	if ($scope.routeStep == savedRoutes[savedRouteIndex].savedTasks.length) { // the route step is seen first time by the user
		
		var savedTask = {
			routeStep: $scope.routeStep,
			photoURL: "",
			word: ""
		}
		savedRoutes[savedRouteIndex].savedTasks.push(savedTask);
		$localstorage.setObject("savedRoutes", $scope.savedRoutes);
		$scope.quantitativeQuestions = savedRoutes[savedRouteIndex].quantitativeQuestions;
		$scope.qualitativeQuestions = savedRoutes[savedRouteIndex].qualitativeQuestions;
	}
	else {
		$scope.lastPhotoURI = savedRoutes[savedRouteIndex].savedTasks[$scope.routeStep].photoURL;
		//console.log(savedRoutes[savedRouteIndex].savedTasks[$scope.routeStep].word);
		$scope.word = savedRoutes[savedRouteIndex].savedTasks[$scope.routeStep].word;
		$scope.quantitativeQuestions = savedRoutes[savedRouteIndex].quantitativeQuestions;
		$scope.qualitativeQuestions = savedRoutes[savedRouteIndex].qualitativeQuestions;
	}
	
	for (var i = 0; i < downloadedRoutes.array.length; i++) {
		if (downloadedRoutes.array[i]._id == $scope.routeID) {

			$scope.steps = downloadedRoutes.array[i].tasks;
			
			$scope.name = downloadedRoutes.array[i].name;
			
			if ($stateParams.step == 0) {
				$scope.title = "Our Way - " + downloadedRoutes.array[i].name;
			}
			else if ($stateParams.step <= downloadedRoutes.array[i].tasks.length) {
				$scope.title = downloadedRoutes.array[i].name + " - Step " + $stateParams.step;
			}
			else { // Finished
				$scope.title = downloadedRoutes.array[i].name + " - Finished";
				savedRoutes[savedRouteIndex].finished = true;
				$localstorage.setObject("savedRoutes", $scope.savedRoutes);
			}
			
			break;
		}
	}
	
	//
	// GeoLocation related code
	//
	function onWatchSuccess(position) {
		var latitude = position.coords.latitude;
		var longitude = position.coords.longitude;

		console.log("Latitude : " + latitude + " Longitude: " + longitude);
		
		savedRoutes[savedRouteIndex].GPSTrace.push({
			lat: latitude,
			lng: longitude,
			routeStep: $scope.routeStep
		});
		
		//$localstorage.setObject("savedRoutes", $scope.savedRoutes);
	}
	function onWatchError(err) {
		if (err.code == 1) {
			console.log("Error: Access is denied!");
		}
		else if ( err.code == 2) {
			console.log("Error: Position is unavailable!");
		}
	}
	
	var watchID = undefined;
	//var watch = null;
	if (!savedRoutes[savedRouteIndex].finished) {
		var watchOptions = {timeout : 10000, enableHighAccuracy: true};
		watchID = navigator.geolocation.watchPosition(onWatchSuccess, onWatchError, watchOptions);
		//var watch = $cordovaGeolocation.watchPosition(watchOptions);
		// watch.promise.then(
			// null,
			// locationErrorHandler,
			// onWatchSuccess
		// );
	}
	
	$scope.nextStep = function() {
		if (!savedRoutes[savedRouteIndex].finished && $scope.steps.length == $scope.routeStep) {
			navigator.geolocation.clearWatch(watchID);
			//$cordovaGeolocation.clearWatch(watch.watchID);
		}
		$localstorage.setObject("savedRoutes", $scope.savedRoutes);
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
		//$state.go("tab.social");
	}
	
	$scope.wordChange = function(word) {
		var savedTask = loadCurrentSavedTask();
		savedTask.word = word;
		//console.log(savedTask.word);
		$localstorage.setObject("savedRoutes", $scope.savedRoutes);
	}
	
	$scope.quantitativeQuestionChange = function(index, value) {
		//console.log(index);
		//console.log(value);
		$scope.quantitativeQuestions[index].value = value;
		savedRoutes[savedRouteIndex].quantitativeQuestions[index].value = value;
		$localstorage.setObject("savedRoutes", $scope.savedRoutes);
	}
	
	$scope.qualitativeQuestionChange = function(index, answer) {
		console.log(answer);
		$scope.qualitativeQuestions[index].answer = answer;
		savedRoutes[savedRouteIndex].qualitativeQuestions[index].answer = answer;
		$localstorage.setObject("savedRoutes", $scope.savedRoutes);
	}
	
	// $scope.routeSatisfactionChange = function(routeSatisfaction) {
		// savedRoutes[savedRouteIndex].routeSatisfaction = routeSatisfaction;
		// $localstorage.setObject("savedRoutes", $scope.savedRoutes);
	// }
	// $scope.appSatisfactionChange = function(appSatisfaction) {
		// savedRoutes[savedRouteIndex].appSatisfaction = appSatisfaction;
		// $localstorage.setObject("savedRoutes", $scope.savedRoutes);
	// }
	// $scope.uxSatisfactionChange = function(uxSatisfaction) {
		// savedRoutes[savedRouteIndex].uxSatisfaction = uxSatisfaction;
		// $localstorage.setObject("savedRoutes", $scope.savedRoutes);
	// }
	// $scope.suggestionsChange = function(suggestions) {
		// //console.log("suggestionsChange");
		// savedRoutes[savedRouteIndex].suggestions = suggestions;
		// $localstorage.setObject("savedRoutes", $scope.savedRoutes);
	// }
	
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
		return savedRoutes[savedRouteIndex].savedTasks[$scope.routeStep];
	}
});
