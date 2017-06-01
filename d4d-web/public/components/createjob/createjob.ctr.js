(function () {

    "use strict";
    
    angular
        .module('d4d')
        .controller('createjobController', ['$state', '$mdToast', '$firebaseAuth', '$firebase', '$firebaseObject', 'sharedUsernameServices', 'sharedUseridServices', 'sharedUserCategoryServices', 'NgMap', function($state, $mdToast, $firebaseAuth, $firebase, $firebaseObject, $sharedUsernameServices, $sharedUseridServices, $sharedUserCategoryServices, NgMap)  {
        
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
            vm.capturing_date = "";
            vm.showToast = showToast;
            vm.saveSelectedValue = saveSelectedValue;
            vm.sendData = sendData;
            vm.getPolygonCoords = getPolygonCoords;
            vm.map;
            vm.latitudeArray = [];
            vm.longitudeArray = [];
            vm.requestingTypeList = [{id:0,name:"Dengue Monitoring"},{id:1,name:"Other"}];

            vm.gettingName = $sharedUsernameServices.getUsername();
            vm.gettingID = $sharedUseridServices.getUserid();
            vm.getCategory = $sharedUserCategoryServices.getUserCategory();

            vm.showback = false;

            vm.triangleCoords = [
                new google.maps.LatLng(7.0873, 80.0144),
                new google.maps.LatLng(6.8018, 79.9227),
                new google.maps.LatLng(6.0535, 80.2210),     
                new google.maps.LatLng(7.2906, 80.6337)              
            ];

            // Styling & Controls
            vm.myPolygon = new google.maps.Polygon({
                paths: vm.triangleCoords,
                draggable: true, // turn off if it gets annoying
                editable: true,
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35
            });

            function getPolygonCoords() {
                var len = vm.myPolygon.getPath().getLength();
                vm.latitudeArray = [];
                vm.longitudeArray = [];

                for (var i = 0; i < len; i++) {
                    var tempString = vm.myPolygon.getPath().getAt(i).toUrlValue(5);
                    var tempArray = tempString.split(",");
                    vm.latitudeArray.push(tempArray[0]);
                    vm.longitudeArray.push(tempArray[1]);
                }
            }

            NgMap.getMap().then(function(map) {
                vm.myPolygon.setMap(map);
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

            function sendData(selectedValue, capturing_date) {
                vm.selectedValue = selectedValue;
                vm.capturing_date = capturing_date;

                if(vm.selectedValue != null && vm.capturing_date != null) {
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

                    /*Get a proper date format*/
                    var day = capturing_date.getDate();
                    var month = capturing_date.getMonth() + 1;
                    var year = capturing_date.getFullYear();
                    var sendingDate = [month, day, year].join('/');
                    
                    firebase.database().ref('jobs/processingjobs/p' + currentIDNum).set({
                        "capturing_date": sendingDate,
                        "jobid": "p" + currentIDNum,
                        "requesting_type": selectedValue,
                        "latitude": vm.latitudeArray,
                        "logitude": vm.longitudeArray,
                        "requester": vm.gettingName
                    });

                    vm.showback = true; 
                } else {
                    vm.showToast("Fill all fields");
                }            
            }
        }]);

})();