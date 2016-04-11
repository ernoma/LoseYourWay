(function() {
  /**
   * @ngInject
   */
  function ius($q, $ionicLoading, $cordovaFile) {
    var service = {};
    service.uploadImage = uploadImage;
    return service;
    function uploadImage(imageURI) {
      var deferred = $q.defer();
      var fileSize;
      var percentage;
      // Find out how big the original file is
      window.resolveLocalFileSystemURL(imageURI, function(fileEntry) {
        fileEntry.file(function(fileObj) {
          fileSize = fileObj.size;
          // Display a loading indicator reporting the start of the upload
          $ionicLoading.show({template : 'Uploading Picture : ' + 0 + '%'});
          // Trigger the upload
          uploadFile();
        });
      });
      function uploadFile() {
        // Add the Cloudinary "upload preset" name to the headers
        var uploadOptions = {
          params : { 'upload_preset': "ckpnun3d"}
        };
        $cordovaFile
          // Your Cloudinary URL will go here
          .uploadFile("https://api.cloudinary.com/v1_1/djuhhyhgt/image/upload", imageURI, uploadOptions)
          
          .then(function(result) {
            // Let the user know the upload is completed
            $ionicLoading.show({template : 'Upload Completed', duration: 1000});
            // Result has a "response" property that is escaped
            // FYI: The result will also have URLs for any new images generated with 
            // eager transformations
            var response = JSON.parse(decodeURIComponent(result.response));
            deferred.resolve(response);
          }, function(err) {
            // Uh oh!
            $ionicLoading.show({template : 'Upload Failed', duration: 3000});
            deferred.reject(err);
          }, function (progress) {
            // The upload plugin gives you information about how much data has been transferred 
            // on some interval.  Use this with the original file size to show a progress indicator.
            percentage = Math.floor(progress.loaded / fileSize * 100);
            $ionicLoading.show({template : 'Uploading Picture : ' + percentage + '%'});
          });
      }
      return deferred.promise;
    }
  }

	angular.module('loseYourWayServices', [])

	.factory('ImageUploadService', ius)

	.factory('Route', function($resource) {
	  return $resource('http://loseyourway.herokuapp.com/routes/:id');
	  //return $resource('http://192.168.1.85:3000/routes/:id');
	})
	.factory('RouteResult', function($resource) {
		return $resource('http://loseyourway.herokuapp.com/routeresults/:id');
		//return $resource('http://192.168.1.85:3000/routeresults/:id');
	})
	.factory('Camera', ['$q', function($q) {

	  return {
		getPicture: function(options) {
		  var q = $q.defer();

		  navigator.camera.getPicture(function(result) {
			// Do any magic you need
			q.resolve(result);
		  }, function(err) {
			q.reject(err);
		  }, options);

		  return q.promise;
		}
	  }
	}])
	.factory('$localstorage', ['$window', function($window) {
	  return {
		set: function(key, value) {
		  $window.localStorage[key] = value;
		},
		get: function(key, defaultValue) {
		  return $window.localStorage[key] || defaultValue;
		},
		setObject: function(key, value) {
		  $window.localStorage[key] = JSON.stringify(value);
		},
		getObject: function(key) {
		  return JSON.parse($window.localStorage[key] || '{}');
		}
	  }
	}]);

})();