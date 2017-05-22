//https://github.com/firebase/angularfire/issues/768

(function() {

    "use strict";
    
    angular.module('d4d')
        .controller('authController', ['$state', '$mdToast', '$firebaseAuth', '$firebase', function($state, $mdToast, $firebaseAuth, $firebase) {
        
        var vm = this;
            
        vm.validateEmail = validateEmail;
        vm.login = login;
        vm.showToast = showToast;
            
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
            if(vm.validateEmail(username)) {
               firebase.auth().signInWithEmailAndPassword(username, password).catch(function(error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    // [START_EXCLUDE]
                    if (errorCode === 'auth/wrong-password') {
                        vm.showToast("Wrong password");
                    } else {
                        vm.showToast(errorMessage);
                    }
                    console.log(error);
                });
            } else {
                vm.showToast("Invalid Email");
            }
            
        }   
            
        function validateEmail(email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }
    }]);
})();