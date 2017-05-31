(function () {

    "use strict";
    
    angular
        .module('d4d')
        .controller('profileController', ['$state', '$mdToast', '$firebaseAuth', '$firebase', '$firebaseObject', 'sharedUsernameServices', 'sharedUseridServices', function ($state, $mdToast, $firebaseAuth, $firebase, $firebaseObject, $sharedUsernameServices, $sharedUseridServices)  {
        
            var vm = this;

            vm.showToast = showToast;
            vm.saveSelectedValue = saveSelectedValue;
            vm.selectedValue = "";
            vm.profileList = [{id:0,name:"PHI"},{id:1,name:"Drone Pilot"}];
            
            vm.gettingName = $sharedUsernameServices.getUsername();
            vm.gettingID = $sharedUseridServices.getUserid();

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
                
                firebase.database().ref('users/' + vm.gettingID).set({
                    username: vm.gettingName,
                    profile: selectValue
                });
                
                var siteURL = (window.location.href).replace("profile", "");
                window.location = siteURL;
                location.reload();
            }
        
    }]);

})();