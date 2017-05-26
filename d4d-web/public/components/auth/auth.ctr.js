//https://github.com/firebase/angularfire/issues/768

//test@gmail.com
//test1234
(function() {

    "use strict";
    
    angular.module('d4d')
        .controller('authController', ['$state', '$mdToast', '$firebaseAuth', '$firebase', function($state, $mdToast, $firebaseAuth, $firebase) {
        
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
        //var firebaseREF = new Firebase('https://dronemap-883ec.firebaseio.com');
        var d4dLogin = $firebaseAuth(rootRef);
                
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
            if(validateEmail(vm,username)){
                if(firebase.auth().signInWithEmailAndPassword(vm.username, vm.password)){
                    //logged-in
                    //remove sign-in button
                    //add sign-out button
                }else{
                    //return login details invalid error to front-end
                }
            }else{
                //return email invalid error to front-end
            }      
        }
        
        //pls add this to general js file, then we can call it from anywhere
        function validateEmail(email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }
    }]);
})();
