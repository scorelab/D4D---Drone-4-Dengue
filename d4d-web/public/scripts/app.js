(function() {

  "use strict";

  angular
      .module('d4d', ['ngMaterial', 'ui.router', 'firebase'])
      .config(function($mdThemingProvider, $stateProvider, $urlRouterProvider) {
      
      $mdThemingProvider.theme('default')
        .primaryPalette('blue')
        .accentPalette('light-blue');
      
      $urlRouterProvider.otherwise('/');
      
      $stateProvider
        .state('auth', {
            url: '/',
            templateUrl: 'components/auth/auth.tpl.html',
            controller: 'authController as vm'
        })
      
        .state('signin', {
            url: '/signin',
            templateUrl: 'components/signin/signin.tpl.html',
            controller: 'signinController as vm'
        })
      
        .state('profile', {
            url: '/profile',
            templateUrl: 'components/profile/profile.tpl.html',
            controller: 'profileController as vm'
        })
      
        .state('managingjobs', {
            url: '/managingjobs',
            templateUrl: 'components/managingjobs/managingjobs.tpl.html',
            controller: 'managingController as vm'
        })
      
        .state('home', {
            url: '/home',
            templateUrl: 'components/home/home.tpl.html',
            controller: 'homeController as vm'
        })
      
        .state('createjob', {
            url: '/managingjobs/createjob',
            templateUrl: 'components/createjob/createjob.tpl.html',
            controller: 'createjobController as vm'
        })
      
       .state('viewjob', {
            url: '/managingjobs/viewjob/:job_id',
            controller: function($stateParams){
                $stateParams.job_id
            },
            templateUrl: 'components/viewjob/viewjob.tpl.html',
            controller: 'viewjobController as vm'
        });
      
    });
})();