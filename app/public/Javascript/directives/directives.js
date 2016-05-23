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