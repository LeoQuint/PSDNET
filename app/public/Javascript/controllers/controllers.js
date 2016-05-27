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
        $scope.userProfile = response.data.userProfile.member;
        console.log('user information retrieved');
        return true;
    }, function errorCallback(response){
        $scope.message = "Please log in to access the forum.";

        console.log('Error on forumController callback function!');
        return false;
    });


    //need to add a signed in check prior.
    $http.get('/forum/getPosts').then(function (responsePosts){
                //currently retrieves every posts.
               $scope.posts = responsePosts.data.topics;
               console.log(responsePosts.data.topics);
    });




    $scope.newPost =  {
        postID: '',
        userType: '',
        username: '',
        userEmail: '',
        date: '',
        subject: '',
        message: '',
        upVotes: 0,
        downVotes: 0,
        replies: []
    };

    $scope.Post = function()
    {
        //Attach profile elements to the post.
        $scope.newPost.userType = $scope.userProfile.memberStatus;
        $scope.newPost.username = $scope.userProfile.firstName + ' ' + $scope.userProfile.lastName;
        $scope.newPost.userEmail = $scope.userProfile.email;
        $scope.newPost.date = Date.now();
        //Post data taken from the forum's form.
        $http.post('/forum/newPost', $scope.newPost);
        console.log("TESTING POSTING NEWPOST");
        console.log($scope.newPost);

        location.reload();
    };

});

psdnetAppControllers.controller('signupController', function($scope, $http){
  
        $scope.ontarioColleges = [
        'Algonquin College',
        'Cambrian College',
        'Canadore College' ,
        'Centennial College' ,
        'Collège Boréal' ,
        'Conestoga College' ,
        'Confederation College',
        'Durham College' ,
        'Fanshawe College',
        'Fleming College' ,
        'George Brown College',
        'Georgian College' ,
        'Humber College' ,
        'La Cité collégiale' ,
        'Lambton College',
        'Loyalist College',
        'Mohawk College',
        'Niagara College' ,
        'Northern College' ,
        'St. Clair College' ,
        'St. Lawrence College' ,
        'Sault College',
        'Seneca College', 
        'Sheridan College' ];
        $scope.ontarioUniversities = [
        'Algoma University',
        'Brock University',
        'Carleton University',
        'University of Guelph',
        'Lakehead University',
        'Laurentian University',
        'McMaster University',
        'Nipissing University',
        'OCAD University',
        'University of Ottawa',
        'Queen’s University',
        'Royal Military College of Canada',
        'Ryerson University',
        'University of Toronto',
        'Trent University',
        'University of Ontario Institute of Technology',
        'University of Waterloo',   
        'Western University',  
        'Wilfrid Laurier University',
        'University of Windsor',
        'York University'
        ];

     
    
});

psdnetAppControllers.controller('profileController',  function($scope, $http) {
   
    $http.get('/getProfil').then(function(response){
    
        $scope.userProfile = response.data;
      
    });


});