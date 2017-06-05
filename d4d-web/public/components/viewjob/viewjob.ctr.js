(function () {

    "use strict";
    
    angular
        .module('d4d')
        .controller('viewjobController', ['$state', '$mdToast', '$firebaseAuth', '$firebase', '$firebaseObject', 'sharedUsernameServices', 'sharedUseridServices', 'sharedUserCategoryServices', '$stateParams', function($state, $mdToast, $firebaseAuth, $firebase, $firebaseObject, $sharedUsernameServices, $sharedUseridServices, $sharedUserCategoryServices, $stateParams) {
        
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

            vm.job_id = $stateParams.job_id;
            vm.tab_number = $stateParams.tab_number;
            
            vm.capturing_area = "";
            vm.requesting_type = "";
            vm.capturing_date = "";
            vm.requester = "";
            
            vm.imageList = [];
            vm.showToast = showToast;
            vm.confirmRequest = confirmRequest;
            vm.loadingData = loadingData;
            vm.save = save;
            vm.cancel = cancel;
            vm.confirmImages = confirmImages;
            vm.triggerPage = triggerPage;
            vm.gotoManageJob = gotoManageJob;
           // vm.uploadImage = uploadImage;

            console.log("viewjobController");
            vm.loadingData(vm.job_id, vm.tab_number);
            
            vm.user_id = $stateParams.user_id;
            vm.category_id = $stateParams.category_id;
            
            vm.gettingName = $sharedUsernameServices.getUsername();
            vm.gettingID = $sharedUseridServices.getUserid();
            vm.getCategory = $sharedUserCategoryServices.getUserCategory();

            function loadingData(job_id, tab_number) {

                if(tab_number == "001") {
                    
                    /*Get data related to given Job ID*/
                    var ref = firebase.database().ref("jobs/processingjobs/" + vm.job_id);
                    ref.once("value")
                      .then(function(snapshot) {
                        if(snapshot.child("requesting_type").val() == "0") {
                            vm.requesting_type = "Dengue Monitoring";
                        } else if(snapshot.child("requesting_type").val() == "1") {
                            vm.requesting_type = "Other";
                        }
                         
                        vm.capturing_date = snapshot.child("capturing_date").val(); 
                        vm.requester = snapshot.child("requester").val(); 
                        vm.capturing_area = "Colombo";
                        
                        vm.triggerPage();
                    });
                    
                } else if(tab_number == "002") {
                    vm.imageList = [
                        {
                            "imageName": "Image 1",
                            "imageLink": "../public/images/1.jpg"
                        },
                        {
                            "imageName": "Image 2",
                            "imageLink": "../public/images/2.jpg"
                        },
                        {
                            "imageName": "Image 3",
                            "imageLink": "../public/images/3.jpg"
                        }
                    ];
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

            function confirmRequest(job_id, capturing_area, request_type, capturing_date) {
                vm.job_id = job_id;
                vm.capturing_area = capturing_area;
                vm.request_type = request_type;
                vm.capturing_date = capturing_date;

                vm.showToast("Success"); 
            }

            function save(singleImage) {
                vm.showToast("Saved");
            }

            function cancel(singleImage) {
                vm.showToast("Cancelled");
            }

            function confirmImages() {
                vm.showToast("Confirmed");
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
            
            /*function uploadImage () {
                upload({
                  url: '/upload',
                  method: 'POST',
                  data: {
                    anint: 123,
                    aBlob: Blob([1,2,3]), // Only works in newer browsers
                    aFile: $scope.myFile, // a jqLite type="file" element, upload() will extract all the files from the input and put them into the FormData object before sending.
                  }
                }).then(
                  function (response) {
                    console.log(response.data); // will output whatever you choose to return from the server on a successful upload
                  },
                  function (response) {
                      console.error(response); //  Will return if status code is above 200 and lower than 300, same as $http
                  }
                );
            }*/
        
    }]);

})();