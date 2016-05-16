//Contains all the controllers for the app.
var psdnetAppControllers = angular.module('psdnetAppControllers', ['angular-carousel']);


psdnetAppControllers.controller('homeController', ['$scope', function($scope) {
    //for testing. Images should come from the DB.
    var randomImages = [];
    var img1 = new Image();
    img1.src = "../../../Assets/Images/1.jpg";
    img1.id = '1';
    var img2 = new Image();
    img2.src = "../../../Assets/Images/2.jpg";
    img2.id = '2';
    var img3 = new Image();
    img3.src = "../../Assets/Images/3.jpg";
    img3.id = '3';
    var img4 = new Image();
    img4.src = "../../Assets/Images/4.jpg";
    img4.id = '4';
    randomImages[0] = img1;
    randomImages[1] = img2;
    randomImages[2] = img3;
    randomImages[3] = img4;
    
    $scope.Images = randomImages;
    $scope.message = 'this is the main controller';

}] );

psdnetAppControllers.controller('aboutController', function($scope) {
    $scope.message = 'this is the about controller.';
    $scope.template = 'aboutTemp';
});

psdnetAppControllers.controller('contactController', function($scope) {
    $scope.message = 'this is the contact controller.';
   
});

psdnetAppControllers.controller('loginController', function($scope) {
    $scope.message = 'this is the login controller.';
});

psdnetAppControllers.controller('forumController', function($scope, $http) {

    $http.get('/getTest').then(function successCallback(response){
        
        $scope.userProfile = response.data;
    }, function errorCallback(response){
        console.log('Error on forumController callback function!');
    });

});

psdnetAppControllers.controller('profileController',  function($scope, $http) {
   
    $http.get('/getProfil').then(function(response){
    
        $scope.userProfile = response.data;
      
    });


});