(function() {

    "use strict";
    
    angular
        .module('d4d')
        .controller('authController', function(auth, $state, $mdToast) {
        
        var vm = this;
        
        vm.signin = signin;
        vm.username = "";
        vm.password = "";
        vm.login = login;
        vm.showToast = showToast;
        
        function signin(){
            
            vm.auth = null;
            vm.error = null;
            vm.user = null;
            
            auth.ref.$signInWithPopup("google").then(function(auth) {
                vm.auth = auth;
                vm.user = auth.user;
                console.log("Signed in as:", auth);
                showToast(vm.user.displayName+" Signed!!!")
                $state.go('/');
            }).catch(function(error) {
                vm.error = error;
                console.error("Authentication failed:", error);
            });
        }
        
        function showToast(message) {
            $mdToast.show(
                $mdToast.simple()
                .content(message)
                .hideDelay(3000)
            );
        }
        console.log("authController");
        
        function login(username, password) {
            vm.username = username;
            vm.password = password;
            
            if(vm.username == null && vm.password != null) {
                vm.showToast("Enter the username");
            } else if(vm.username != null && vm.password == null) {
                vm.showToast("Enter the password");
            } else if(vm.username == null && vm.password == null) {
                vm.showToast("Enter the username and the password");
            } else {
                vm.showToast("Success");
            }
        }
        
    });

})();