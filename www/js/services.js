var loseYourWayServices = angular.module('loseYourWayServices', [])
.factory('Route', function($resource) {
  return $resource('http://loseyourway.herokuapp.com/routes/:id');
  //return $resource('http://192.168.1.85:3000/routes/:id');
})
.factory('RouteResult', function($resource) {
	//return $resource('http://loseyourway.herokuapp.com/results/:id');
	return $resource('http://192.168.1.85:3000/routeresults/:id');
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

/*loseYourWayServices.factory('Route', ['$resource', function($resource) {
	return $resource('/data/:routeID.json', {}, {
      query: {method:'GET', params:{routeID:'route'}, isArray:true}
    });
}]);*/