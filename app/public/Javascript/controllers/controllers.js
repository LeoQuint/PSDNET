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

psdnetAppControllers.controller('homeController', function($scope, $http) {
    GetMessages('/contentManager/retrieveMessages/home', "home", $http, $scope);
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

});
psdnetAppControllers.controller('aboutController', function($scope, $http) {
    GetMessages('/contentManager/retrieveMessages/about', "about", $http, $scope);
});
psdnetAppControllers.controller('chatController', function($scope, $interval, $http){
   GetMessages('/contentManager/retrieveMessages/chat', "chat", $http, $scope);
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
psdnetAppControllers.controller('communityController', function($scope, $http){
    GetMessages('/contentManager/retrieveMessages/community', "community", $http, $scope);
});
psdnetAppControllers.controller('contactController', function($scope, $http){
    GetMessages('/contentManager/retrieveMessages/contact', "contact", $http, $scope);
});
psdnetAppControllers.controller('3pillarsController', function($scope, $http){
    GetMessages('/contentManager/retrieveMessages/3pillars', "pillars", $http, $scope);
});
psdnetAppControllers.controller('mentorshipsController', function($scope, $http){
    GetMessages('/contentManager/retrieveMessages/mentorships', "mentorships", $http, $scope);
});
psdnetAppControllers.controller('evaluationController', function($scope, $http){
    GetMessages('/contentManager/retrieveMessages/evaluation', "evaluation", $http, $scope);
});
psdnetAppControllers.controller('trainingController', function($scope, $http){
    GetMessages('/contentManager/retrieveMessages/training', "training", $http, $scope);
});
psdnetAppControllers.controller('loginController', function($scope, $http, previousLoc) {
    GetMessages('/contentManager/retrieveMessages/login', "login", $http, $scope);
});
psdnetAppControllers.controller('educationController', function($scope, $http){
    GetMessages('/contentManager/retrieveMessages/education', "education", $http, $scope);
});
psdnetAppControllers.controller('newsController', function($scope, $http){
    GetMessages('/contentManager/retrieveMessages/news', "news", $http, $scope);
});
psdnetAppControllers.controller('podcastController', function($scope, $http){
    GetMessages('/contentManager/retrieveMessages/podcasts', "podcasts", $http, $scope);
});
psdnetAppControllers.controller('webinarController', function($scope, $http){
    GetMessages('/contentManager/retrieveMessages/webinars', "webinars", $http, $scope);
});
psdnetAppControllers.controller('featuredController', function($scope, $http){
    GetMessages('/contentManager/retrieveMessages/featured', "featured", $http, $scope);
});
psdnetAppControllers.controller('signupController', function($scope, $http){
        GetMessages('/contentManager/retrieveMessages/signup', "signup", $http, $scope);
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
    GetMessages('/contentManager/retrieveMessages/profile', "profile", $http, $scope);
    var isLogged = false;
    $scope.showInfo = isLogged;
    $scope.isAdmin = false;

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
                    if($scope.userProfile.member.memberStatus === 'admin')
                    {
                        $scope.$parent.isAdmin = true;
                    }
                }
                
            }

    });

});
psdnetAppControllers.controller('forumController', function($scope, $http, previousLoc, $location) {
    GetMessages('/contentManager/retrieveMessages/forum', "forum", $http, $scope);
   
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



psdnetAppControllers.controller('contentController', function($scope, $http) {
    GetMessages('/contentManager/retrieveMessages', "", $http, $scope);
    $scope.updateMessageResult = '';
    $scope.hasSelectedAPage = false;
    $scope.CurrentlyEditing = null;

    $scope.messagePile = { messages : {}};

    $scope.pages = [{"name": 'about'},{"name": 'chat'},{"name":  'community'}, {"name": 'contact'},
                    {"name": 'education'}, {"name": 'evaluation'}, {"name": 'featured'}, {"name": 'home'},
                    {"name": 'mentorships'}, {"name": 'news'}, {"name": 'pillars'}, {"name": 'podcasts'},
                    {"name": 'profile'}, {"name": 'signup'}, {"name": 'timeline'}, {"name": 'training'},
                    {"name": 'webinars'}];

    $scope.UpdateMessages = function(){
        console.log('Updating messages...');
        $http.post('/contentManager/UpdateMessages').then(function successCallback(response){
            $scope.updateMessageResult = response.data;   
        }, function errorCallback(response){
            $scope.updateMessageResult = response.data;
        });;
    };


    $scope.SelectPage = function(selected){
        $scope.CurrentlyEditing = selected;
        if(selected != ''){
            $scope.hasSelectedAPage = true;
        }
    };

   

    $scope.SaveChanges = function(){

        
        $http.post('/contentManager/UpdateMessages', $scope.messagePile).then(function successCallback(response){
            $scope.updateMessageResult = response.data;   
        }, function errorCallback(response){
            $scope.updateMessageResult = response.data;
        });;
        
    };


   
});


psdnetAppControllers.controller('navbarController', function($scope){
    //

});
//Parent Controller to all
psdnetAppControllers.controller('mainController', function($scope){
    $scope.isAdmin = false;
   
});

//retrieves the message object for its pages.
//Path is the route from route.js, index is the page's name in the pages object, http and scope are provide by the controller.
function GetMessages(path, index, http, scope){
    http.get(path)
       .then(function(res){
            if(index != '')
            {
                scope.messages = res.data[0].pages[index];  
            }
            else
            {
                scope.messagePile = res.data[0].pages;
            }
                
    });
    
};
//This is the old function inside each controller.
/*$http.get('/contentManager/retrieveMessages/3pillars')
       .then(function(res){
          $scope.messages = res.data[0].pages.pillars;        
        });*/
