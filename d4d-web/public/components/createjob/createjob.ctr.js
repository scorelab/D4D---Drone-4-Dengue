(function () {

    "use strict";
    
    angular
        .module('d4d')
        .controller('createjobController', function (auth, $state, $mdToast) {
        
        var vm = this;
        
        vm.capturing_area = "";
        vm.selectedValue = "";
        vm.capturing_date = "";
        vm.showToast = showToast;
        vm.saveSelectedValue = saveSelectedValue;
        vm.sendData = sendData;
        
        vm.requestingTypeList = ["Dengue Monitoring", "Occation", "Other"];
        
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
        
        function sendData(capturing_area, selectedValue, capturing_date) {
            vm.capturing_area = capturing_area;
            vm.selectedValue = selectedValue;
            vm.capturing_date = capturing_date;
            
            if(vm.capturing_area != null && vm.selectedValue != null && vm.capturing_date != null) {
                vm.showToast("Send the request");  
            } else {
                vm.showToast("Fill all fields");
            }
        }
    });

})();