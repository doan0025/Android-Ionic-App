angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngTouch', 'ngCordova', 'ngStorage'])

.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })

    .state('app.tasks', {
        url: '/tasks',
        views: {
            'menuContent': {
                templateUrl: 'templates/tasks.html',
                controller: 'TaskCtrl'
            }
        }
    })

    .state('app.complete', {
        url: '/complete',
            views: {
                'menuContent': {
                    templateUrl: 'templates/complete.html',
                    controller: 'CompleteCtrl'
                }
            }
        })
    
    .state('app.incomplete', {
        url: '/incomplete',
        views: {
            'menuContent': {
                templateUrl: 'templates/incomplete.html',
                controller: 'IncompleteCtrl'
            }
        }
    })
     .state('app.about', {
         url: '/about',
         views: {
             'menuContent': {
                 templateUrl: 'templates/about.html',
                 controller: 'About'
             }
         }
     })

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/tasks');
});