//Contains all the controllers and services for the app.
var psdnetAppControllers = angular.module('psdnetAppControllers', ['angular-carousel']);


///SERVICES##SERVICES##SERVICES##SERVICES##SERVICES##SERVICES##SERVICES##SERVICES##SERVICES##///

//Provides data on the previous location.
//Used so we can redirect the user to the approriate page after login.
//I.E. if user came from the forum we want to redirect back to forum.
psdnetAppControllers.service('previousLoc', function() {
    this.Set = function (x) 
    {
        this.value = x;
    }
    this.Get = function()
    {
        return this.value;
    }

});

///SERVICES##SERVICES##SERVICES##SERVICES##SERVICES##SERVICES##SERVICES##SERVICES##SERVICES##///

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

psdnetAppControllers.controller('aboutController', function($scope, $http) {
    
    $http.get('/Resources/Data/msg_3Pillars.json')
       .then(function(res){
          $scope.messages = res.data;        
        });

    $scope.message = 'this is the about controller.';
    $scope.template = 'aboutTemp';
});

psdnetAppControllers.controller('contactController', function($scope) {
    $scope.message = 'this is the contact controller.';
   
});

psdnetAppControllers.controller('loginController', function($scope, previousLoc) {
    
    $scope.message = 'this is the login controller.';
});

psdnetAppControllers.controller('forumController', function($scope, $http, previousLoc, $location) {

   
    $scope.isLogged = false;
    $http.get('/forum/login').then(function successCallback(response){
        //retieves user info.
        $scope.userProfile = response.data.userProfile.member;
       

        //retrieves posts from DB
        $http.get('/forum/getPosts').then(function (responsePosts){
                //currently retrieves every posts.
                $scope.posts = responsePosts.data.topics;
        });
        //set logged status.
        $scope.isLogged = true;
        return true;
    }, function errorCallback(response){
        $scope.message = "Please log in to access the forum.";
        console.log('Error on forumController callback function!');
        $scope.isLogged = false;
        return false;
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

        location.reload();
    };

    $scope.Login = function()
    {
        previousLoc.Set('loginForum');
        $location.path('/login');
    }
    $scope.Signup = function()
    {
        $location.path('/mSignup');
    }

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

psdnetAppControllers.controller('profileController',  function($scope, $http, previousLoc, $location) {
    
    var isLogged = false;
    $scope.showInfo = isLogged;

    $http.get('/getProfil').then(function(response){
            if(response.data == false)
            {
                isLogged = false;
                $scope.showInfo = isLogged;
            }
            else
            {
                isLogged = true;
                $scope.showInfo = isLogged;
                if(previousLoc.Get() == 'loginForum')
                {
                    $location.path('/cForum');
                }
                else
                {
                    previousLoc.Set('');
                    $scope.userProfile = response.data;
                    $scope.timelineEvents = $scope.userProfile.member.timeline;

                }
                
            }
            
      
    });


    $scope.events = [{
        badgeClass: 'info',
        badgeIconClass: 'glyphicon-check',
        title: 'First heading',
        content: 'Some awesome content.'
    }, {
        badgeClass: 'warning',
        badgeIconClass: 'glyphicon-credit-card',
        title: 'Second heading',
        content: 'More awesome content.'
    }];


    


});

psdnetAppControllers.controller('chatController', function($scope, $interval, $http){
    console.log("chat controller active.");

    //Send a request to check for new messages at intervals. Currently set to 2 secs.
    var UpdateChat = function () {

      update = $interval(function() {
       console.log('Updating...');

       $http.get('/chat/Update').then(function(response){
    
           
           if(response.data.status === 'new')
           {
                console.log('new message incoming!');
                console.log(response.data.message);
           }
      
        });

      }, 2000);
    };

    //UpdateChat();


});

