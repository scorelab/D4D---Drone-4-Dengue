(function () {

    "use strict";
    
    angular
        .module('d4d')
        .controller('signinController', function (auth, $state, $mdToast) {
        
        var vm = this;
        
        vm.signin = signin;
        vm.showToast = showToast;
        vm.validateEmail = validateEmail;
        vm.username = "";
        vm.password = "";
        vm.email = "";
        vm.siteURL = "";
        
        console.log("signinController");
        
        function showToast(message) {
            $mdToast.show(
                $mdToast.simple()
                .content(message)
                .hideDelay(3000)
            );
        }
        
        function signin(username, password, email) {
            vm.username = username;
            vm.password = password;
            vm.email = email;
            
            if(vm.username != null && vm.password != null && vm.email != null) {
                if(vm.validateEmail(vm.email)) {
                    vm.siteURL = (window.location.href).replace("signin", "profile");
                    window.location = vm.siteURL;

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
    });

})();