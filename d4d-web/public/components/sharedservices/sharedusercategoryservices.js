angular.module('d4d')
.service('sharedUserCategoryServices', function () {   
    
    var category = "";

    return {
        setUserCategory: function(value) {
            category = value;
        },
        getUserCategory: function () {
            return category;
        }
    };
    
});