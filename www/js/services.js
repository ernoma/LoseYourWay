var loseYourWayServices = angular.module('loseYourWayServices', [])

/*loseYourWayServices.factory('Route', ['$resource', function($resource) {
	return $resource('/data/:routeID.json', {}, {
      query: {method:'GET', params:{routeID:'route'}, isArray:true}
    });
}]);*/

loseYourWayServices.factory('Camera', ['$q', function($q) {

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
}]);

loseYourWayServices.factory('$localstorage', ['$window', function($window) {
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