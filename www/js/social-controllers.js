
var socialControllers = angular.module('socialControllers', [])

.controller('SocialCtrl', function($scope, $cordovaSocialSharing, $localstorage, $ionicModal) {
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

