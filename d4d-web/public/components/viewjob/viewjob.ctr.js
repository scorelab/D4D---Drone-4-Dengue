(function () {

    "use strict";
    
    angular
        .module('d4d')
        .controller('viewjobController', ['$state', '$mdToast', '$firebaseAuth', '$firebase', '$firebaseObject', 'sharedUsernameServices', 'sharedUseridServices', 'sharedUserCategoryServices', '$stateParams', '$firebaseArray', 'NgMap', function($state, $mdToast, $firebaseAuth, $firebase, $firebaseObject, $sharedUsernameServices, $sharedUseridServices, $sharedUserCategoryServices, $stateParams, $firebaseArray, NgMap) {
        
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
            
            vm.user_email = "";
            vm.getCategory = "";
                
            var ref = firebase.database().ref("users/" + vm.user_id);
            ref.once("value")
              .then(function(snapshot) {
                vm.user_email = snapshot.child("username").val();
                vm.getCategory = snapshot.child("profile").val();
                //vm.triggerPage();
            });
            
            /*Creating Jobs*/
            vm.capturing_area = "";
            vm.requesting_type = "";
            vm.capturing_start_date = "";
            vm.capturing_end_date = "";
            vm.requester = "";
            vm.latitude = [];
            vm.longitude = [];
            vm.requesting_value = 0;
            vm.north = 0;
            vm.south = 0;
            vm.east = 0;
            vm.west = 0;
            
            vm.bounds = {};
            
            vm.rectangle = new google.maps.Rectangle({});
            
            NgMap.getMap().then(function(map) {
                vm.rectangle.setMap(map);
                vm.map = map;
            });
            
            /*Set of Functions*/
            vm.imageList = [];
            vm.showToast = showToast;
            vm.confirmRequest = confirmRequest;
            vm.loadingData = loadingData;
            vm.confirm = confirm;
            vm.triggerPage = triggerPage;
            vm.gotoManageJob = gotoManageJob;
            vm.imageUpload = imageUpload;
            vm.binEncode = binEncode;
            vm.deleteImage = deleteImage;
            vm.completeAnalysing = completeAnalysing;

            console.log("viewjobController");
            vm.loadingData(vm.job_id, vm.tab_number);
            
            /*Service Parameters*/
            vm.gettingName = $sharedUsernameServices.getUsername();
            vm.gettingID = $sharedUseridServices.getUserid();
            //vm.getCategory = $sharedUserCategoryServices.getUserCategory();
            
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
                         
                        vm.capturing_start_date = snapshot.child("capturing_start_date").val(); 
                        vm.capturing_end_date = snapshot.child("capturing_end_date").val(); 
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
                            editable: false,
                            draggable: false
                        });
                        
                        NgMap.getMap().then(function(map) {
                            vm.rectangle.setMap(map);
                            vm.map = map;
                        });
                        
                    });
                    
                    vm.triggerPage();
                    
                } else if(tab_number == "002") {
                    var setOfImages = firebase.database().ref('images/'+vm.job_id.replace("a", ""));
                    setOfImages.on('value', function(snapshot) {
                        snapshot.forEach(function(childSnapshot) {
                            vm.imageList.push(childSnapshot.val());
                        });
                    });
                    
                    /*Get data related to given Job ID*/
                    var ref = firebase.database().ref("jobs/analysingjobs/" + vm.job_id);
                    ref.once("value")
                      .then(function(snapshot) {
                        vm.requesting_value = snapshot.child("requesting_type").val();
                        if(vm.requesting_value == "0") {
                            vm.requesting_type = "Dengue Monitoring";
                        } else if(vm.requesting_value == "1") {
                            vm.requesting_type = "Other";
                        }
                         
                        vm.capturing_start_date = snapshot.child("capturing_start_date").val(); 
                        vm.capturing_end_date = snapshot.child("capturing_end_date").val(); 
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
                            editable: false,
                            draggable: false
                        });
                        
                        NgMap.getMap().then(function(map) {
                            vm.rectangle.setMap(map);
                            vm.map = map;
                        });
                    });
                    
                    vm.triggerPage();
                
                } else if(tab_number == "003") {
                    var setOfImages = firebase.database().ref('images/'+vm.job_id.replace("c", ""));
                    setOfImages.on('value', function(snapshot) {
                        snapshot.forEach(function(childSnapshot) {
                            vm.imageList.push(childSnapshot.val());
                        });
                    });
                    
                    /*Get data related to given Job ID*/
                    var ref = firebase.database().ref("jobs/completedjobs/" + vm.job_id);
                    ref.once("value")
                      .then(function(snapshot) {
                        vm.requesting_value = snapshot.child("requesting_type").val();
                        if(vm.requesting_value == "0") {
                            vm.requesting_type = "Dengue Monitoring";
                        } else if(vm.requesting_value == "1") {
                            vm.requesting_type = "Other";
                        }
                         
                        vm.capturing_start_date = snapshot.child("capturing_start_date").val(); 
                        vm.capturing_end_date = snapshot.child("capturing_end_date").val(); 
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
                            editable: false,
                            draggable: false
                        });
                        
                        NgMap.getMap().then(function(map) {
                            vm.rectangle.setMap(map);
                            vm.map = map;
                        });
                        
                    });
                    
                    vm.triggerPage();
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
                    "capturing_start_date": vm.capturing_start_date,
                    "capturing_end_date": vm.capturing_end_date,
                    "jobid": "a" + vm.job_id.replace("p", ""),
                    "requesting_type": vm.requesting_value,
                    "latitude": vm.latitude,
                    "logitude": vm.longitude,
                    "requester": vm.user_email
                }, function(error) {
                    if(error) {
                        console.log("Did not confirm");
                        console.log(error);
                    } else {
                        firebase.database().ref('jobs/processingjobs/' + vm.job_id).remove(function(error) {
                            if(error) {
                                console.log("Did not save to analyse job database");
                                console.log(error);
                            } else {
                                vm.gotoManageJob(); 
                            }
                        });
                    }
                });
            }

            function confirm(image) {
                var imageRef = firebase.database().ref('images/' + vm.job_id.substr(1) + "/" + (image.name).replace(".jpg", ""));
                
                imageRef.update({ "confirmed" : 1 }, function(error) {
                    if (error) {
                        console.log("Data could not be saved." + error);
                    } else {
                        location.reload();                     
                    }
                });
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
                            "name": metadata.name,
                            "confirmed": 0
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
            
            function deleteImage(imageData) {
                firebase.database().ref('images/' + (imageData.fullPath).replace(".jpg", "")).remove(
                    function(error) {
                        if(error) {
                            console.log("Problem Occured " + error);
                        } else {
                            var imagesRef = storageRef.child(vm.job_id.substr(1)+"/" + imageData.name);
                            
                            imagesRef.delete().then(function() {
                                location.reload();                                
                            }).catch(function(error) {
                                console.log("Problem Occured");
                                console.log(error);
                            });
                        }
                    }
                );                
            }
            
            function completeAnalysing() {
                firebase.database().ref('jobs/completedjobs/c' + vm.job_id.replace("a", "")).set({
                    "capturing_start_date": vm.capturing_start_date,
                    "capturing_end_date": vm.capturing_end_date,
                    "jobid": "c" + vm.job_id.replace("a", ""),
                    "requesting_type": vm.requesting_value,
                    "latitude": vm.latitude,
                    "logitude": vm.longitude,
                    "requester": vm.user_email
                }, function(error) {
                    if(error) {
                        console.log("Did not save to complete job database");
                        console.log(error);
                    } else {
                        firebase.database().ref('jobs/analysingjobs/' + vm.job_id).remove(function(error) {
                            if(error) {
                                console.log("Did not save to analyse job database");
                                console.log(error);
                            } else {
                                vm.gotoManageJob(); 
                            }
                        });
                    }
                });
            }
        
    }]);

})();