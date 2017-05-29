angular.module('d4d')
.service('sharedUsernameServices', function () {   
    
    var username = "";

    return {
        setUsername: function(value) {
            username = value;
        },
        getUsername: function () {
            return username;
        }
    };
    
});