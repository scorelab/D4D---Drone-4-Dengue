angular.module('d4d')
.service('sharedUseridServices', function () {   
    
    var userid = "";

    return {
        getUserid: function () {
            return userid;
        },
        setUsername: function(value) {
            userid = value;
        }
    };
    
});