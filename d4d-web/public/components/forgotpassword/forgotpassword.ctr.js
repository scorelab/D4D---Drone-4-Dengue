(function () {

    "use strict";
    
    angular
        .module('d4d')
        .controller('forgotpasswordController', function (auth, $state, $mdToast) {
        
        var vm = this;
        
        vm.returnPassword = returnPassword;
        vm.showToast = showToast;
        vm.validateEmail = validateEmail;
        vm.email = "";
        vm.siteURL = "";
        
        console.log("forgotpasswordController");
        
        function showToast(message) {
            $mdToast.show(
                $mdToast.simple()
                .content(message)
                .hideDelay(3000)
            );
        }
        
        function returnPassword(email) {
            vm.email = email;
            
            if(vm.email != null) {
                if(vm.validateEmail(vm.email)) {
                    vm.siteURL = (window.location.href).replace("forgotpassword", "");
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