(function () {

    "use strict";
    
    angular
        .module('d4d')
        .controller('editjobController', ['$state', '$mdToast', '$firebaseAuth', '$firebase', '$firebaseObject', 'sharedUsernameServices', 'sharedUseridServices', 'sharedUserCategoryServices', 'NgMap', '$stateParams', function($state, $mdToast, $firebaseAuth, $firebase, $firebaseObject, $sharedUsernameServices, $sharedUseridServices, $sharedUserCategoryServices, NgMap, $stateParams)  {
        
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

            vm.capturing_area = "";
            vm.selectedValue = "";
            vm.capturing_start_date = "";
            vm.capturing_end_date = ""
            vm.showToast = showToast;
            vm.saveSelectedValue = saveSelectedValue;
            vm.sendData = sendData;
            vm.getPolygonCoords = getPolygonCoords;
            vm.gotoManageJob = gotoManageJob;
            vm.triggerPage = triggerPage;
            vm.map;
            vm.latitudeArray = [];
            vm.longitudeArray = [];
            vm.requestingTypeList = [{id:0,name:"Dengue Monitoring"},{id:1,name:"Other"}];

            vm.user_id = $stateParams.user_id;
            vm.job_id = $stateParams.job_id;
            
            vm.user_email = "";
            vm.getCategory = "";
                
            var ref = firebase.database().ref("users/" + vm.user_id);
            ref.once("value")
              .then(function(snapshot) {
                vm.user_email = snapshot.child("username").val();
                vm.getCategory = snapshot.child("profile").val();
                vm.triggerPage();
            });
            
            vm.bounds = {};
            
            // Styling & Controls
            vm.rectangle = new google.maps.Rectangle({});
            
            var ref_job = firebase.database().ref("jobs/processingjobs/" + vm.job_id);
            ref_job.once("value")
              .then(function(snapshot) {
                vm.requesting_value = snapshot.child("requesting_type").val();
                var start_date = snapshot.child("capturing_start_date").val(); 
                vm.capturing_start_date = (new Date(start_date));
                var end_date = snapshot.child("capturing_end_date").val();  
                vm.capturing_end_date = (new Date(end_date));
                vm.requester = snapshot.child("requester").val(); 
                vm.latitude = snapshot.child("latitude").val();
                vm.longitude = snapshot.child("logitude").val();

                vm.bounds = {
                  north: vm.latitude[0],
                  south: vm.latitude[1],
                  east: vm.longitude[0],
                  west: vm.longitude[1]
                };

                vm.rectangle = new google.maps.Rectangle({
                    bounds: vm.bounds,
                    editable: true,
                    draggable: true
                });

                NgMap.getMap().then(function(map) {
                    vm.rectangle.setMap(map);
                    vm.map = map;
                });

            });

            function getPolygonCoords() {
                vm.latitudeArray = [];
                vm.longitudeArray = [];
                
                var ne = (vm.rectangle).getBounds().getNorthEast();
                var sw = (vm.rectangle).getBounds().getSouthWest();
                
                vm.latitudeArray.push(ne.lat());
                vm.latitudeArray.push(sw.lat());
                vm.longitudeArray.push(ne.lng());
                vm.longitudeArray.push(sw.lng());
            }

            NgMap.getMap().then(function(map) {
                vm.rectangle.setMap(map);
                vm.map = map;
            });


            function showToast(message) {
                $mdToast.show(
                    $mdToast.simple()
                    .content(message)
                    .hideDelay(3000)
                );
            }

            console.log("editjobController");

            function saveSelectedValue(selectValue) {
                console.log(selectValue);
            }

            function sendData(selectedValue, capturing_start_date, capturing_end_date) {
                vm.requesting_value = selectedValue;
                vm.capturing_start_date = capturing_start_date;
                vm.capturing_end_date = capturing_end_date;

                if(vm.selectedValue != null && vm.capturing_start_date != null && vm.capturing_end_date != null) {
                    vm.getPolygonCoords();

                    /*Get the highest job id in processing jobs*/
                    /*var processingJobsData = firebase.database().ref('jobs/processingjobs');
                    var processingNumArray = [];

                    processingJobsData.on('value', function(snapshot) {
                        snapshot.forEach(function(childSnapshot) {
                            processingNumArray.push(parseInt((childSnapshot.key).substr(1)));
                        });
                    });

                    var maxProcessingNum = Math.max.apply(null, processingNumArray);*/

                    /*Get the highest job id in analysing jobs*/
                    /*var analysingJobsData = firebase.database().ref('jobs/analysingjobs');
                    var analysingNumArray = [];

                    analysingJobsData.on('value', function(snapshot) {
                        snapshot.forEach(function(childSnapshot) {
                            analysingNumArray.push(parseInt((childSnapshot.key).substr(1)));
                        });
                    });

                    var maxAnalysingNum = Math.max.apply(null, analysingNumArray);*/

                    /*Get the highest job id in completed jobs*/
                    /*var completedJobsData = firebase.database().ref('jobs/completedjobs');
                    var completedNumArray = [];

                    completedJobsData.on('value', function(snapshot) {
                        snapshot.forEach(function(childSnapshot) {
                            completedNumArray.push(parseInt((childSnapshot.key).substr(1)));
                        });
                    });

                    var maxCompletedNum = Math.max.apply(null, completedNumArray);*/

                    /*Get the highest num from all three arrays to make the next ID*/
                    /*var oneBeforeNextIDNum = Math.max(maxCompletedNum, maxProcessingNum, maxAnalysingNum);

                    var currentIDNum = (oneBeforeNextIDNum + 1).toString();

                    if(currentIDNum.length == 1) {
                        currentIDNum = "00" + currentIDNum;
                    } else if(currentIDNum.length == 2) {
                        currentIDNum = "0" + currentIDNum;
                    } else if(currentIDNum.length == 3) {
                        currentIDNum = currentIDNum;
                    }*/

                    /*Get a proper date format for start date*/
                    var day = capturing_start_date.getDate();
                    var month = capturing_start_date.getMonth() + 1;
                    var year = capturing_start_date.getFullYear();
                    var sendingDate = [month, day, year].join('/');
                    
                    /*Get a proper date format for end date*/
                    var day_end = capturing_end_date.getDate();
                    var month_end = capturing_end_date.getMonth() + 1;
                    var year_end = capturing_end_date.getFullYear();
                    var endingDate = [month_end, day_end, year_end].join('/');
                    
                    if(capturing_start_date.getTime()<capturing_end_date.getTime() || capturing_start_date.getTime()==capturing_end_date.getTime()) {
                        firebase.database().ref('jobs/processingjobs/' + vm.job_id).set({
                            "capturing_start_date": sendingDate,
                            "capturing_end_date": endingDate,
                            "jobid": vm.job_id,
                            "requesting_type": selectedValue,
                            "latitude": vm.latitudeArray,
                            "logitude": vm.longitudeArray,
                            "requester": vm.user_email
                        });

                        vm.gotoManageJob();
                        
                    } else {
                        vm.showToast("Enter valid dates");
                    }
                    
                    
                } else {
                    vm.showToast("Fill all fields");
                }            
            }
            
            function gotoManageJob() {
                var siteURL = (window.location.href).replace("/editjob", "");
                var siteURL2 = siteURL.replace("/" + vm.job_id, "");
                
                window.location = siteURL2;
                
                location.reload();
            }
            
            function triggerPage() {
                vm.showToast("Landed");
            }
        }]);

})();