//https://github.com/firebase/angularfire/issues/768

//test@gmail.com
//test1234
(function() {

    "use strict";
    
    angular.module('d4d')
        .controller('authController', ['$state', '$mdToast', '$firebaseAuth', '$firebase', '$firebaseObject', 'sharedUsernameServices', 'sharedUseridServices', 'sharedUserCategoryServices', function($state, $mdToast, $firebaseAuth, $firebase, $firebaseObject, $sharedUsernameServices, $sharedUseridServices, $sharedUserCategoryServices) {
        
        var vm = this;
            
        vm.validateEmail = validateEmail;
        vm.login = login;
        vm.showToast = showToast;
        vm.username = "";
        vm.password = "";
            
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
        
        // Get a reference to the database service
        var database = firebase.database().ref("users");
            
        function showToast(message) {
            $mdToast.show(
                $mdToast.simple()
                .content(message)
                .hideDelay(3000)
            );
        }
            
        function login(username, password){
            vm.username = username;
            vm.password = password;
            
            if(vm.username != null || vm.password !=null) {
                if(validateEmail(vm.username)){
                    if(firebase.auth().signInWithEmailAndPassword(vm.username, vm.password)){
                        $sharedUsernameServices.setUsername(d4dLogin.$getAuth().email);
                        
                        $sharedUseridServices.setUsername(d4dLogin.$getAuth().uid);
                        
                        var processingJobsData = firebase.database().ref('users/'+ d4dLogin.$getAuth().uid);
                        processingJobsData.on('value', function(snapshot) {
                            snapshot.forEach(function(childSnapshot) {
                                if(childSnapshot.key == 'profile') {
                                    $sharedUserCategoryServices.setUserCategory(childSnapshot.val());
                                    var siteURL = (window.location.href).concat("managingjobs/" + d4dLogin.$getAuth().email);
                                    window.location = siteURL;
                                }
                            });
                        });                        
                        
                    }else{
                        vm.showToast("An error occured");
                    }
                } else {
                    vm.showToast("Enter a valid email address");
                }  
            } else {
                vm.showToast("Fill all fields");
            }
                
        }
        
        //pls add this to general js file, then we can call it from anywhere
        function validateEmail(email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }
    }]);
})();
