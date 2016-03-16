
var socialControllers = angular.module('socialControllers', [])

.controller('SocialCtrl', function($scope, $localstorage) {
	// $scope.savedRoutes = $localstorage.getObject("savedRoutes");
	
	// var finishedRoutes = [];
		
	// if (Object.keys($scope.savedRoutes).length === 0 && JSON.stringify($scope.savedRoutes) === JSON.stringify({})) {
		// $scope.finishedRoutes = [];
	// }
	// else {
		// var savedRoutes = $scope.savedRoutes.array;
		
		// for (var i = 0; i < savedRoutes.length; i++) {
			// if (savedRoutes[i].finished == true) {
				// finishedRoutes.push(savedRoutes[i]);
			// }
		// }
		
		// $scope.finishedRoutes = finishedRoutes;
	// }
})
.controller('SocialDetailCtrl', function($scope, $stateParams, $cordovaSocialSharing, $localstorage) {
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
	}
});

