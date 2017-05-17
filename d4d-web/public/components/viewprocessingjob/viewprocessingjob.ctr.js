(function () {

    "use strict";
    
    angular
        .module('d4d')
        .controller('viewprocessingjobController', function (auth, $state, $mdToast, $stateParams) {
        
        var vm = this;
        
        vm.job_id = $stateParams.job_id;
        vm.capturing_area = "";
        vm.request_type = "";
        vm.capturing_date = "";
        vm.showToast = showToast;
        vm.confirmRequest = confirmRequest;
        vm.loadingData = loadingData;
        
        console.log("viewprocessingjobController");
        vm.loadingData(vm.job_id);
        
        function loadingData(job_id) {
            vm.capturing_area = "Colombo";
            vm.request_type = "Dengue Monitoring";
            vm.capturing_date = "06/03/2017";
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
        
    });

})();