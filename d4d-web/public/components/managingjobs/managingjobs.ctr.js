(function () {

    "use strict";
    
    angular
        .module('d4d')
        .controller('managingController', ['$state', '$mdToast', '$firebaseAuth', '$firebase', '$firebaseObject', 'sharedUsernameServices', 'sharedUseridServices', function ($state, $mdToast, $firebaseAuth, $firebase, $firebaseObject, $sharedUsernameServices, $sharedUseridServices) {
        
            var vm = this;
        
            vm.logout = logout;
            vm.loadJobs = loadJobs;
            vm.loadJobs();
        
            vm.processingJobsArray = [];
            vm.analysingJobsArray = [];
            vm.completedJobsArray = [];
            
            vm.gettingName = $sharedUsernameServices.getUsername();
            vm.gettingID = $sharedUseridServices.getUserid();

            console.log('managingController');

            function loadJobs() {
                var userId = vm.gettingID;
                //var userId = firebase.auth().currentUser.uid;

                var processingJobsData = firebase.database().ref('jobs/processingjobs');
                processingJobsData.on('value', function(snapshot) {
                    snapshot.forEach(function(childSnapshot) {
                        vm.processingJobsArray.push(childSnapshot.val());
                    });
                });
                
                var analysingJobsData = firebase.database().ref('jobs/analysingjobs');
                analysingJobsData.on('value', function(snapshot) {
                    snapshot.forEach(function(childSnapshot) {
                        vm.analysingJobsArray.push(childSnapshot.val());
                    });
                });
                     
                var completedJobsData = firebase.database().ref('jobs/completedjobs');
                completedJobsData.on('value', function(snapshot) {
                    snapshot.forEach(function(childSnapshot) {
                        vm.completedJobsArray.push(childSnapshot.val());
                    });
                });

            }

            function logout() {
                firebase.auth().signOut();
            }

    }]);

})();