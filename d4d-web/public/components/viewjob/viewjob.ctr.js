(function () {

    "use strict";
    
    angular
        .module('d4d')
        .controller('viewjobController', function (auth, $state, $mdToast, $stateParams) {
        
        var vm = this;
        
        vm.job_id = $stateParams.job_id;
        vm.tab_number = $stateParams.tab_number;
        vm.capturing_area = "";
        vm.request_type = "";
        vm.capturing_date = "";
        vm.imageList = [];
        vm.showToast = showToast;
        vm.confirmRequest = confirmRequest;
        vm.loadingData = loadingData;
        vm.save = save;
        vm.cancel = cancel;
        vm.confirmImages = confirmImages;
       // vm.uploadImage = uploadImage;
        
        console.log("viewjobController");
        vm.loadingData(vm.job_id, vm.tab_number);
        
        function loadingData(job_id, tab_number) {
            
            if(tab_number == "1") {
                vm.capturing_area = "Colombo";
                vm.request_type = "Dengue Monitoring";
                vm.capturing_date = "06/03/2017";
            } else if(tab_number == "2") {
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
            } else if(tab_number == "3") {
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
        
    });

})();