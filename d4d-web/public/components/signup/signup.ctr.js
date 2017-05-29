(function () {

    "use strict";
    
    angular
        .module('d4d')
        .controller('signupController', ['$state', '$mdToast', '$firebaseAuth', '$firebase', '$firebaseObject', 'sharedUsernameServices', 'sharedUseridServices', function($state, $mdToast, $firebaseAuth, $firebase, $firebaseObject, $sharedUsernameServices, $sharedUseridServices)  {
        
            var vm = this;

            vm.signup = signup;
            vm.showToast = showToast;
            vm.validateEmail = validateEmail;
            vm.password = "";
            vm.email = "";
            vm.siteURL = "";

            var config = {
                apiKey: "AIzaSyAfh1IU93CQfo9nyJqnxxcZ0R7z3Uve3nE",
                authDomain: "dronemap-b66a3.firebaseapp.com",
                databaseURL: "https://dronemap-b66a3.firebaseio.com",
                projectId: "dronemap-b66a3",
                storageBucket: "dronemap-b66a3.appspot.com",
                messagingSenderId: "610754060845"
            };

            if (!firebase.apps.length) {
                firebase.initializeApp(config);
            }
            
            var rootRef = firebase.auth();
            var d4dLogin = $firebaseAuth(rootRef);
            
            console.log("signupController");

            function showToast(message) {
                $mdToast.show(
                    $mdToast.simple()
                    .content(message)
                    .hideDelay(3000)
                );
            }

            function signup(password, email) {
                vm.password = password;
                vm.email = email;

                if(vm.password != null && vm.email != null) {
                    if(vm.validateEmail(vm.email)) {
                        firebase.auth().createUserWithEmailAndPassword(vm.email, vm.password)
                            .then(function(firebaseUser) {
                                console.log("User " + firebaseUser.uid + " created successfully!");
                                vm.siteURL = (window.location.href).replace("signup", "profile");
                                window.location = vm.siteURL;
                            
                                $sharedUsernameServices.setUsername(vm.email);
                                $sharedUseridServices.setUsername(firebaseUser.uid);
                            
                        }).catch(function(error) {
                            console.error("Error: ", error);
                        });
                        
                    } else {
                        vm.showToast("Invalid email address");
                    }   
                } else {
                    vm.showToast("Fill all fields");
                }
            }

            function validateEmail(email) {
                var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email);
            }
    }]);

})();