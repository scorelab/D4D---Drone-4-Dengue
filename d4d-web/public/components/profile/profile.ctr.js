(function () {

    "use strict";
    
    angular
        .module('d4d')
        .controller('profileController', ['$state', '$mdToast', '$firebaseAuth', '$firebase', '$firebaseObject', 'sharedUsernameServices', 'sharedUseridServices', function ($state, $mdToast, $firebaseAuth, $firebase, $firebaseObject, $sharedUsernameServices, $sharedUseridServices)  {
        
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
            
            var vm = this;

            vm.showToast = showToast;
            vm.saveSelectedValue = saveSelectedValue;
            vm.selectedValue = "";
            vm.profileList = [{id:"phi",name:"PHI"},{id:"pilot",name:"Drone Pilot"}];
            
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