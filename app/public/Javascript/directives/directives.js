//testing directive
//used to segment that single page app in more details. Can also add 
//events and listeners.
angular.module('psdnetApp.directives.form', [])
	.directive('testingCard', function(){
		return {
			restrict: 'E',
			templateUrl: "views/About/contact.html",
			link: function(scope, element, attrs){
				//console.log(arguments);
				element.on("click", function(){
					console.log(scope.profile);
				});
			},
			controller: function($scope){
				
			}
		};
	});
//Directive used to post to the database.
angular.module('psdnetApp.directives.forum', [])
	.directive('forumPost', function(){
		return {
			restrict: 'E',
			link: function(scope, element, attrs){
				//console.log(arguments);
				element.on("click", function(){
					//Calls the post function on the forum controller. 
					//May consider moving the function here.
					scope.Post();
					
				});
			},
			controller: function($scope){
				
			}
		};
	});
//Custom element that diplays a single post.
angular.module('psdnetApp.directives.post', [])
.directive('post', function(){
	return {
		restrict: 'E',
		templateUrl: "views/Community/aPost.html",
		link: function(scope, element, attrs){
			
		},
		controller: function($scope){
			
		}
	};
});
//Custom element that displays the chat window.
angular.module('psdnetApp.directives.psdnetChat', [])
.directive('psdnetChat', function(){
	return {
		restrict: 'E',
		controller : "chatController",
		templateUrl: "views/Mentorship/chat.html",
		link: function(scope, element, attrs){
			
		}
	};
});
