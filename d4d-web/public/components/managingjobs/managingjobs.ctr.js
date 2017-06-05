(function () {

    "use strict";
    
    angular
        .module('d4d')
        .controller('managingController', ['$state', '$mdToast', '$firebaseAuth', '$firebase', '$firebaseObject', 'sharedUsernameServices', 'sharedUseridServices', 'sharedUserCategoryServices', '$stateParams', function ($state, $mdToast, $firebaseAuth, $firebase, $firebaseObject, $sharedUsernameServices, $sharedUseridServices, $sharedUserCategoryServices, $stateParams) {
        
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
        
            vm.logout = logout;
            vm.loadJobs = loadJobs;
            vm.gotoCreateJob = gotoCreateJob;
            vm.loadJobs();
        
            vm.processingJobsArray = [];
            vm.analysingJobsArray = [];
            vm.completedJobsArray = [];
            
            vm.user_id = $stateParams.user_id;
            
            vm.gettingName = $sharedUsernameServices.getUsername();
            vm.gettingID = $sharedUseridServices.getUserid();
            vm.getCategory = $sharedUserCategoryServices.getUserCategory();

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

            function gotoCreateJob() {
                var siteURL = (window.location.href).concat("/createjob");
                window.location = siteURL;
            }
            
            function logout() {
                firebase.auth().signOut();
            }

    }]);

})();