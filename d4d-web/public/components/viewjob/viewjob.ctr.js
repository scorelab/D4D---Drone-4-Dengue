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
        
        console.log("viewjobController");
        vm.loadingData(vm.job_id, vm.tab_number);
        
        function loadingData(job_id, tab_number) {
            
            if(tab_number == "1") {
                vm.capturing_area = "Colombo";
                vm.request_type = "Dengue Monitoring";
                vm.capturing_date = "06/03/2017";
            } else if(tab_number == "2") {
                console.log(tab_number);
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
            console.log(singleImage);
            vm.showToast("Saved");
        }
        
        function cancel(singleImage) {
            console.log(singleImage);
            vm.showToast("Cancelled");
        }
        
        function confirmImages() {
            vm.showToast("Confirmed");
        }
        
    });

})();