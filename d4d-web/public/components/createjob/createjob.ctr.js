(function () {

    "use strict";
    
    angular
        .module('d4d')
        .controller('createjobController', ['$state', '$mdToast', '$firebaseAuth', '$firebase', '$firebaseObject', 'sharedUsernameServices', 'sharedUseridServices', 'sharedUserCategoryServices', 'NgMap', '$stateParams', function($state, $mdToast, $firebaseAuth, $firebase, $firebaseObject, $sharedUsernameServices, $sharedUseridServices, $sharedUserCategoryServices, NgMap, $stateParams)  {
        
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
            
            vm.user_email = "";
            vm.getCategory = "";
                
            var ref = firebase.database().ref("users/" + vm.user_id);
            ref.once("value")
              .then(function(snapshot) {
                vm.user_email = snapshot.child("username").val();
                vm.getCategory = snapshot.child("profile").val();
                vm.triggerPage();
            });
            
            vm.gettingName = $sharedUsernameServices.getUsername();
            vm.gettingID = $sharedUseridServices.getUserid();
            //vm.getCategory = $sharedUserCategoryServices.getUserCategory();

            vm.triangleCoords = [
                new google.maps.LatLng(7.0873, 80.0144),
                new google.maps.LatLng(6.8018, 79.9227),
                new google.maps.LatLng(6.0535, 80.2210),     
                new google.maps.LatLng(7.2906, 80.6337)              
            ];

            // Default rectangle
            vm.bounds = {
              north: 7.0873,
              south: 6.8018,
              east: 80.0144,
              west: 79.9227
            };
            
            // Styling & Controls
            vm.rectangle = new google.maps.Rectangle({
                bounds: vm.bounds,
                editable: true,
                draggable: true
            });
            /*vm.myPolygon = new google.maps.Polygon({
                paths: vm.triangleCoords,
                draggable: true, // turn off if it gets annoying
                editable: true,
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35
            });*/

            function getPolygonCoords() {
                //var len = vm.rectangle.getPath().getLength();
                vm.latitudeArray = [];
                vm.longitudeArray = [];
                
                var ne = (vm.rectangle).getBounds().getNorthEast();
                var sw = (vm.rectangle).getBounds().getSouthWest();
                
                vm.latitudeArray.push(ne.lat());
                vm.latitudeArray.push(sw.lat());
                vm.longitudeArray.push(ne.lng());
                vm.longitudeArray.push(sw.lng());

                /*for (var i = 0; i < len; i++) {
                    var tempString = vm.rectangle.getPath().getAt(i).toUrlValue(5);
                    var tempArray = tempString.split(",");
                    vm.latitudeArray.push(tempArray[0]);
                    vm.longitudeArray.push(tempArray[1]);
                }*/
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

            console.log("createjobController");

            function saveSelectedValue(selectValue) {
                console.log(selectValue);
            }

            function sendData(selectedValue, capturing_start_date, capturing_end_date) {
                vm.selectedValue = selectedValue;
                vm.capturing_start_date = capturing_start_date;
                vm.capturing_end_date = capturing_end_date;

                if(vm.selectedValue != null && vm.capturing_start_date != null && vm.capturing_end_date != null) {
                    vm.getPolygonCoords();

                    /*Get the highest job id in processing jobs*/
                    var processingJobsData = firebase.database().ref('jobs/processingjobs');
                    var processingNumArray = [];

                    processingJobsData.on('value', function(snapshot) {
                        snapshot.forEach(function(childSnapshot) {
                            processingNumArray.push(parseInt((childSnapshot.key).substr(1)));
                        });
                    });

                    var maxProcessingNum = Math.max.apply(null, processingNumArray);

                    /*Get the highest job id in analysing jobs*/
                    var analysingJobsData = firebase.database().ref('jobs/analysingjobs');
                    var analysingNumArray = [];

                    analysingJobsData.on('value', function(snapshot) {
                        snapshot.forEach(function(childSnapshot) {
                            analysingNumArray.push(parseInt((childSnapshot.key).substr(1)));
                        });
                    });

                    var maxAnalysingNum = Math.max.apply(null, analysingNumArray);

                    /*Get the highest job id in completed jobs*/
                    var completedJobsData = firebase.database().ref('jobs/completedjobs');
                    var completedNumArray = [];

                    completedJobsData.on('value', function(snapshot) {
                        snapshot.forEach(function(childSnapshot) {
                            completedNumArray.push(parseInt((childSnapshot.key).substr(1)));
                        });
                    });

                    var maxCompletedNum = Math.max.apply(null, completedNumArray);

                    /*Get the highest num from all three arrays to make the next ID*/
                    var oneBeforeNextIDNum = Math.max(maxCompletedNum, maxProcessingNum, maxAnalysingNum);

                    var currentIDNum = (oneBeforeNextIDNum + 1).toString();

                    if(currentIDNum.length == 1) {
                        currentIDNum = "00" + currentIDNum;
                    } else if(currentIDNum.length == 2) {
                        currentIDNum = "0" + currentIDNum;
                    } else if(currentIDNum.length == 3) {
                        currentIDNum = currentIDNum;
                    }

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
                        firebase.database().ref('jobs/processingjobs/p' + currentIDNum).set({
                            "capturing_start_date": sendingDate,
                            "capturing_end_date": endingDate,
                            "jobid": "p" + currentIDNum,
                            "requesting_type": selectedValue,
                            "latitude": vm.latitudeArray,
                            "logitude": vm.longitudeArray,
                            "requester": vm.user_email
                        });

                        var siteURL = (window.location.href).replace("/createjob", "");
                        window.location = siteURL; 
                        location.reload();
                    } else {
                        vm.showToast("Enter valid dates");
                    }
                    
                    
                } else {
                    vm.showToast("Fill all fields");
                }            
            }
            
            function gotoManageJob() {
                var siteURL = (window.location.href).replace("/createjob", "");
                
                window.location = siteURL;
                
                location.reload();
            }
            
            function triggerPage() {
                vm.showToast("Loading");
            }
        }]);

})();