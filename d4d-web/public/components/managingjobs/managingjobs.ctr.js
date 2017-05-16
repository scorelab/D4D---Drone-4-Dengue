(function () {

    "use strict";
    
    angular
        .module('d4d')
        .controller('managingController', function (auth, $state, $mdToast) {
        
        var vm = this;
        
        vm.processingJobsArray = [
            {"Job_ID": "001",
            "Requester_ID": "J001",
            "Name": "Drone Pilot 1",
            "Area": "Colombo 1"
            },
            {"Job_ID": "002",
            "Requester_ID": "J002",
            "Name": "Drone Pilot 2",
            "Area": "Colombo 2"
            },
            {"Job_ID": "003",
            "Requester_ID": "J003",
            "Name": "Drone Pilot 3",
            "Area": "Colombo 3"
            },
            {"Job_ID": "004",
            "Requester_ID": "J004",
            "Name": "Drone Pilot 4",
            "Area": "Colombo 4"
            },
            {"Job_ID": "005",
            "Requester_ID": "J005",
            "Name": "Drone Pilot 5",
            "Area": "Colombo 5"
            },
            {"Job_ID": "006",
            "Requester_ID": "J006",
            "Name": "Drone Pilot 6",
            "Area": "Colombo 6"
            },
            {"Job_ID": "007",
            "Requester_ID": "J007",
            "Name": "Drone Pilot 7",
            "Area": "Colombo 7"
            }
        ];
        
        vm.analysingJobsArray = [
            {"Job_ID": "001",
            "Requester_ID": "J001",
            "Name": "Drone Pilot 1",
            "Area": "Colombo 1"
            },
            {"Job_ID": "002",
            "Requester_ID": "J002",
            "Name": "Drone Pilot 2",
            "Area": "Colombo 2"
            },
            {"Job_ID": "003",
            "Requester_ID": "J003",
            "Name": "Drone Pilot 3",
            "Area": "Colombo 3"
            },
            {"Job_ID": "004",
            "Requester_ID": "J004",
            "Name": "Drone Pilot 4",
            "Area": "Colombo 4"
            },
            {"Job_ID": "005",
            "Requester_ID": "J005",
            "Name": "Drone Pilot 5",
            "Area": "Colombo 5"
            },
            {"Job_ID": "006",
            "Requester_ID": "J006",
            "Name": "Drone Pilot 6",
            "Area": "Colombo 6"
            },
            {"Job_ID": "007",
            "Requester_ID": "J007",
            "Name": "Drone Pilot 7",
            "Area": "Colombo 7"
            }
        ];
        
        vm.completedJobsArray = [
            {"Job_ID": "001",
            "Requester_ID": "J001",
            "Name": "Drone Pilot 1",
            "Area": "Colombo 1"
            },
            {"Job_ID": "002",
            "Requester_ID": "J002",
            "Name": "Drone Pilot 2",
            "Area": "Colombo 2"
            },
            {"Job_ID": "003",
            "Requester_ID": "J003",
            "Name": "Drone Pilot 3",
            "Area": "Colombo 3"
            },
            {"Job_ID": "004",
            "Requester_ID": "J004",
            "Name": "Drone Pilot 4",
            "Area": "Colombo 4"
            },
            {"Job_ID": "005",
            "Requester_ID": "J005",
            "Name": "Drone Pilot 5",
            "Area": "Colombo 5"
            },
            {"Job_ID": "006",
            "Requester_ID": "J006",
            "Name": "Drone Pilot 6",
            "Area": "Colombo 6"
            },
            {"Job_ID": "007",
            "Requester_ID": "J007",
            "Name": "Drone Pilot 7",
            "Area": "Colombo 7"
            }
        ];
        
        console.log('managingController');
        
    });

})();