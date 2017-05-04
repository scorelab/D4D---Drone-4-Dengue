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
            url: '/auth',
            templateUrl: 'components/auth/auth.tpl.html',
            controller: 'authController as vm'
        });
      
  });
})();