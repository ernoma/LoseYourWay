// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

var loseYourWayApp = angular.module('starter', ['ionic', 'leaflet-directive', 'ngCordova', 'loseYourWayControllers', 'loseYourWayServices'])

.config(function($compileProvider){
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
})

loseYourWayApp.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

loseYourWayApp.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.routes', {
    url: '/routes',
    views: {
      'tab-routes': {
        templateUrl: 'templates/tab-routes.html',
        controller: 'RoutesCtrl'
      }
    }
  })
  .state('tab.route-detail', {
      url: '/routes/:routeID/:step',
      views: {
        'tab-routes': {
          templateUrl: 'templates/route-detail.html',
          controller: 'RouteDetailCtrl'
        }
      }
    })
	.state('tab.route-find', {
      url: '/routes/find',
      views: {
        'tab-routes': {
          templateUrl: 'templates/route-find.html',
          controller: 'RouteFindCtrl'
        }
      }
    })
  /*.state('tab.route-step' {
	url: '/routes/:routeID/:step,
	views: {
        'tab-routes': {
          templateUrl: 'templates/route-step.html',
          controller: 'RouteDetailCtrl'
        }
      }
	}
  )*/

  .state('tab.map', {
      url: '/map',
      views: {
        'tab-map': {
          templateUrl: 'templates/tab-map.html',
          controller: 'MapCtrl'
        }
      }
    })
  
  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/routes');

});
