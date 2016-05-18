//testing directive

angular.module('psdnetApp.directives.form', [])
	.directive('testingCard', function(){
		return {
			restrict: 'E',
			templateUrl: "views/About/contact.html",
			link: function(scope, element, attrs){
				console.log(arguments);
				element.on("click", function(){
					alert('clicked');
				});
			},
			controller: function($scope){
				console.log($scope.ontarioColleges);
			}
		};
	});