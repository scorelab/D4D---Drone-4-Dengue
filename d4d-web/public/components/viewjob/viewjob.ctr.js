(function () {

    "use strict";
    
    angular
        .module('d4d')
        .controller('viewjobController', ['$state', '$mdToast', '$firebaseAuth', '$firebase', '$firebaseObject', 'sharedUsernameServices', 'sharedUseridServices', 'sharedUserCategoryServices', '$stateParams', '$firebaseArray', function($state, $mdToast, $firebaseAuth, $firebase, $firebaseObject, $sharedUsernameServices, $sharedUseridServices, $sharedUserCategoryServices, $stateParams, $firebaseArray) {
        
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

            /*State Parameters*/
            vm.job_id = $stateParams.job_id;
            vm.tab_number = $stateParams.tab_number;
            vm.user_id = $stateParams.user_id;
            vm.category_id = $stateParams.category_id;
            
            /*Creating Jobs*/
            vm.capturing_area = "";
            vm.requesting_type = "";
            vm.capturing_date = "";
            vm.requester = "";
            vm.latitude = [];
            vm.longitude = [];
            vm.requesting_value = 0;
            
            /*Set of Functions*/
            vm.imageList = [];
            vm.showToast = showToast;
            vm.confirmRequest = confirmRequest;
            vm.loadingData = loadingData;
            vm.save = save;
            vm.cancel = cancel;
            vm.triggerPage = triggerPage;
            vm.gotoManageJob = gotoManageJob;
            vm.imageUpload = imageUpload;
            vm.binEncode = binEncode;

            console.log("viewjobController");
            vm.loadingData(vm.job_id, vm.tab_number);
            
            /*Service Parameters*/
            vm.gettingName = $sharedUsernameServices.getUsername();
            vm.gettingID = $sharedUseridServices.getUserid();
            vm.getCategory = $sharedUserCategoryServices.getUserCategory();
            
            /*Creating Storage Bucket for Uploading Images*/
            //var storage = firebase.storage();
            var storage = firebase.app().storage("gs://dronemap-b66a3.appspot.com/");
            // Create a storage reference from our storage service
            var storageRef = storage.ref();

            function loadingData(job_id, tab_number) {

                if(tab_number == "001") {
                    
                    /*Get data related to given Job ID*/
                    var ref = firebase.database().ref("jobs/processingjobs/" + vm.job_id);
                    ref.once("value")
                      .then(function(snapshot) {
                        vm.requesting_value = snapshot.child("requesting_type").val();
                        if(vm.requesting_value == "0") {
                            vm.requesting_type = "Dengue Monitoring";
                        } else if(vm.requesting_value == "1") {
                            vm.requesting_type = "Other";
                        }
                         
                        vm.capturing_date = snapshot.child("capturing_date").val(); 
                        vm.requester = snapshot.child("requester").val(); 
                        vm.latitude = snapshot.child("latitude").val();
                        vm.longitude = snapshot.child("logitude").val();
                        
                        vm.triggerPage();
                    });
                    
                } else if(tab_number == "002") {
                    var setOfImages = firebase.database().ref('images/'+vm.job_id.replace("a", ""));
                    setOfImages.on('value', function(snapshot) {
                        snapshot.forEach(function(childSnapshot) {
                            vm.imageList.push(childSnapshot.val());
                        });
                    });
                
                } else if(tab_number == "003") {
                    vm.capturing_area = "Colombo";
                    vm.request_type = "Dengue Monitoring";
                    vm.capturing_date = "06/03/2017";
                }   
            }


            function showToast(message) {
                $mdToast.show(
                    $mdToast.simple()
                    .content(message)
                    .hideDelay(3000)
                );
            }

            function confirmRequest() {
                firebase.database().ref('jobs/analysingjobs/a' + vm.job_id.replace("p", "")).set({
                    "capturing_date": vm.capturing_date,
                    "jobid": "a" + vm.job_id.replace("p", ""),
                    "requesting_type": vm.requesting_value,
                    "latitude": vm.latitude,
                    "logitude": vm.longitude,
                    "requester": vm.user_id
                });
                
                firebase.database().ref('jobs/processingjobs/' + vm.job_id).remove();

                vm.gotoManageJob(); 
            }

            function save(singleImage) {
                vm.showToast("Saved");
            }

            function cancel(singleImage) {
                vm.showToast("Cancelled");
            }
            
            function triggerPage() {
                vm.showToast("Landed");
            }

            function gotoManageJob() {
                var siteURL = (window.location.href).replace("/viewjob", "");
                var siteURL2 = siteURL.replace("/" + vm.job_id, "");
                var siteURL3 = siteURL2.replace("/" + vm.tab_number, "");
                var siteURL4 = siteURL3.replace("/" + vm.category_id, "");
                
                window.location = siteURL4;
                
                location.reload();
            }
            
            function imageUpload(image) {
                
                var binStr = atob((image.data).replace(/^data:image\/jpeg;base64,/, ""));
                var len = binStr.length;
                var arr = new Uint8Array(len);

                for (var i = 0; i < len; i++) {
                    arr[i] = binStr.charCodeAt(i);
                }
                
                // Create a child reference
                var imagesRef = storageRef.child(vm.job_id.substr(1)+"/"+image.filename);  //imagesRef now points to the uploading image
                var file = new File([arr], image.filename, {
                    type: "image/jpeg",
                });

                imagesRef.put(file).then(function(snapshot) {
                    // Get metadata properties
                    imagesRef.getMetadata().then(function(metadata) {
                        firebase.database().ref('images/' + vm.job_id.substr(1) + "/" + (image.filename).replace(".jpg", "")).set({
                            "url": metadata.downloadURLs[0],
                            "jobid": vm.job_id.substr(1),
                            "fullPath": metadata.fullPath,
                            "name": metadata.name
                        }, function(error) {
                            if (error) {
                                console.log("Data could not be saved." + error);
                            } else {
                                console.log("Data saved successfully.");
                                location.reload();
                            }
                            
                        });
                        
                    }).catch(function(error) {
                        console.log("Problem Occured!");
                        console.log(error);
                    });
                    
                });
            }
            
            function binEncode(data) {
                /*console.log(data);*/
                var binArray = []
                var datEncode = "";

                for (var i=0; i < data.length; i++) {
                    binArray.push(data[i].charCodeAt(0).toString(2)); 
                } 
                for (var j=0; j < binArray.length; j++) {
                    var pad = padding_left(binArray[j], '0', 8);
                    datEncode += pad + ' '; 
                }
                function padding_left(s, c, n) { if (! s || ! c || s.length >= n) {
                    return s;
                }
                var max = (n - s.length)/c.length;
                for (var i = 0; i < max; i++) {
                    s = c + s; } return s;
                }
                
                return binArray;
            }
        
    }]);

})();