//https://github.com/firebase/angularfire/issues/768

(function() {

    "use strict";
    
    angular.module('d4d')
        .controller('authController', ['$state', '$mdToast', '$firebaseAuth', '$firebase', function($state, $mdToast, $firebaseAuth, $firebase) {
        
        var vm = this;
        var config = {
          apiKey: "AIzaSyAfh1IU93CQfo9nyJqnxxcZ0R7z3Uve3nE",
          authDomain: "dronemap-b66a3.firebaseapp.com",
          databaseURL: "https://dronemap-b66a3.firebaseio.com"
        };
        firebase.initializeApp(config);

        var rootRef = firebase.auth();
        //var firebaseREF = new Firebase('https://dronemap-883ec.firebaseio.com');
        var d4dLogin = $firebaseAuth(rootRef);
                
        function showToast(message) {
            $mdToast.show(
                $mdToast.simple()
                .content(message)
                .hideDelay(3000)
            );
        }
        //console.log("authController");
        
        function login(username, password) {    
            firebase.auth().signInWithEmailAndPassword(username, password).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // [START_EXCLUDE]
                if (errorCode === 'auth/wrong-password') {
                    alert('Wrong password.');
                } else {
                    alert(errorMessage);
                }
                console.log(error);
            });
        }   
    }]);
})();