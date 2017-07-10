(function() {

  "use strict";

  angular
      .module('d4d', ['ngMaterial', 'ui.router', 'firebase', 'ngMap'])
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
      
        .state('signup', {
            url: '/signup',
            templateUrl: 'components/signup/signup.tpl.html',
            controller: 'signupController as vm'
        })
      
        .state('profile', {
            url: '/profile',
            templateUrl: 'components/profile/profile.tpl.html',
            controller: 'profileController as vm'
        })
      
        .state('managingjobs', {
            url: '/managingjobs/:user_id',
            controller: function($stateParams){
                $stateParams.user_id
            },
            templateUrl: 'components/managingjobs/managingjobs.tpl.html',
            controller: 'managingController as vm'
        })
      
        .state('home', {
            url: '/home',
            templateUrl: 'components/home/home.tpl.html',
            controller: 'homeController as vm'
        })
      
        .state('createjob', {
            url: '/managingjobs/:user_id/createjob',
            controller: function($stateParams){
                $stateParams.user_id
            },
            templateUrl: 'components/createjob/createjob.tpl.html',
            controller: 'createjobController as vm'
        })
      
       .state('viewjob', {
            url: '/managingjobs/:user_id/viewjob/:job_id/:tab_number/:category_id',
            controller: function($stateParams){
                $stateParams.job_id,
                $stateParams.tab_number,
                $stateParams.user_id,
                $stateParams.category_id
            },
            templateUrl: 'components/viewjob/viewjob.tpl.html',
            controller: 'viewjobController as vm'
        })
      
        .state('editjob', {
            url: '/managingjobs/:user_id/editjob/:job_id',
            controller: function($stateParams){
                $stateParams.job_id,
                $stateParams.user_id
            },
            templateUrl: 'components/editjob/editjob.tpl.html',
            controller: 'editjobController as vm'
        })
      
        .state('imageuploading', {
            url: '/imageuploading',
            templateUrl: 'components/imageuploading/template.html',
            controller: 'ImageUpload as vm'
        })
      
        .state('forgotpassword', {
            url: '/forgotpassword',
            templateUrl: 'components/forgotpassword/forgotpassword.tpl.html',
            controller: 'forgotpasswordController as vm'
        });
      
        /*.state('navbar', {
            url: '/navbar',
            templateUrl: 'components/navigationbar/navbar.tpl.html',
            controller: 'navbarController as vm'
        });*/
      
    });
})();