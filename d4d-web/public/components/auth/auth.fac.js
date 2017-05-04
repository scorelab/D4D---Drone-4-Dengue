(function() {
    
    "use strict";
    
    angular
        .module('d4d')
        .factory('auth', function($firebaseAuth) {
        
        return {
            ref: $firebaseAuth(),
            user: $firebaseAuth().$getAuth()
        }
    });
})();