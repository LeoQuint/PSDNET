
var psdnetApp = angular.module('psdnetApp', 
    [   'ngRoute', 
        'psdnetAppControllers', 
        'psdnetApp.directives.form', 
        'psdnetApp.directives.forum',
        'psdnetApp.directives.post',
        'psdnetApp.directives.psdnetChat',
        'angular-timeline'
    ]);

psdnetApp.config(function($routeProvider) {
    $routeProvider
    //Main routes
        // route for the home page
        .when('/', {
            
            templateUrl : 'views/home.html',
            controller  : 'homeController'
        })

        // route for the about page
        .when('/about', {
            templateUrl : 'views/About/about.html',
            controller  : 'aboutController'
        })
            .when('/a3Pillars', {
            templateUrl : 'views/About/3pillars.html',
            controller  : '3pillarsController'
            })
            .when('/aContact', {
            templateUrl : 'views/About/contact.html',
            controller  : 'contactController'
            })
        
         //route to the featured content page
        .when('/featured', {
            templateUrl : 'views/Featured/featured.html',
            controller  : 'featuredController'
        })

         //route to the mentorship page
        .when('/mentorships', {
            templateUrl : 'views/Mentorship/mentorships.html',
            controller  : 'contactController'
        })
            .when('/mSignup', {
            templateUrl : 'views/Mentorship/signup.html',
            controller  : 'signupController'
            })
            .when('/mEvaluation', {
            templateUrl : 'views/Mentorship/evaluation.html',
            controller  : 'contactController'
            })
            .when('/mTraining', {
            templateUrl : 'views/Mentorship/training.html',
            controller  : 'contactController'
            })
            .when('/mTimeline', {
            templateUrl : 'views/Mentorship/timeline.html',
            controller  : 'timelineController'
            })
   
         //route to the Education page
        .when('/education', {
            templateUrl : 'views/Education/education.html',
            controller  : 'contactController'
        })
            .when('/eNews', {
                templateUrl : 'views/Education/news.html',
                controller  : 'contactController'
            })
            .when('/ePodcast', {
                templateUrl : 'views/Education/podcasts.html',
                controller  : 'contactController'
            })
            .when('/eWebinar', {
                templateUrl : 'views/Education/webinars.html',
                controller  : 'contactController'
            })

        //route to the community page
        .when('/community', {
                templateUrl : 'views/Community/community.html',
                controller  : 'contactController'
        })
            .when('/cForum', {
                templateUrl : 'views/Community/forum.html',
                controller  : 'forumController'
            })

        //route to the login page
        .when('/login', {
            templateUrl : 'views/login.html',
            controller  : 'loginController'
        })
       

        //route for profile
        .when('/profile', {
            templateUrl : 'views/Dashboard/profile.html',
            controller  : 'profileController'
        })

        //route for profile
        .when('/contentManager', {
            templateUrl : 'views/ContentManager/contentManager.html',
            controller  : 'contentController'
        })

       
        .otherwise({
            redirectTo: '/'
        });
});

