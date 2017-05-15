(function () {

    "use strict";
    
    angular
        .module('d4d')
        .controller('profileController', function (auth, $state, $mdToast) {
        
        var vm = this;
        
        //vm.selecting = selecting;
        vm.showToast = showToast;
        vm.saveSelectedValue = saveSelectedValue;
        vm.selectedValue = "";
        vm.profileList = ["PHI", "Doctor", "Other"];
        
        function showToast(message) {
            $mdToast.show(
                $mdToast.simple()
                .content(message)
                .hideDelay(3000)
            );
        }
        
        console.log("profileController");
        
        function saveSelectedValue(selectValue) {
            console.log(selectValue);
            vm.showToast("Updated the Profile");
        }
        
    });

})();