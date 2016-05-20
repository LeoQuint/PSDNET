//testing directive

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