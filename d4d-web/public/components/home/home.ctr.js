(function () {

    "use strict";
    
    angular
        .module('d4d')
        .controller('homeController', function (auth, $state, $mdToast) {
        
        var vm = this;
        
        vm.currentNavItem = 'page1';
        vm.gotoThePage = gotoThePage;
        
        function gotoThePage(pageName) {
            
        }
        
        console.log("homeController");
    
    });

})();