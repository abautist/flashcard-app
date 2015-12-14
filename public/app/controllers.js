angular.module("FlashcardCtrls", ['FlashcardServices'])
.controller("FlashcardCtrl", ['$scope', 'Flashcard', function($scope, Flashcard) {
	$scope.flashcards = [];

	Flashcard.query(function success(data) {
		$scope.flashcards = data;
		$scope.searchItems = data;
	}, function error(data) {
		console.log(data);
	});
}])
.controller('FlashcardNewCtrl', [
	'$scope',
	'$location',
	'Flashcard',
	function($scope, $location, Flashcard) {
		$scope.createFlashcard = function() {
			var params = {
				front: $scope.front,
				back: $scope.back,
				image: $scope.image,
				category: $scope.category
			}
			var newFlashcard = new Flashcard(params);
			newFlashcard.$save();
			$location.path("/");
		}
}])
.controller('FlashcardDeleteCtrl', [
	'$location',
	'$routeParams',
	'Flashcard',
	function($location, $routeParams, Flashcard) {
		Flashcard.remove({id:$routeParams.id}, function success(data) {
			$location.path("/");
		}, function error(data) {
			console.log(data);
		});
}])
.controller('FlashcardUpdateCtrl', [
	'$scope',
	'$location',
	'$routeParams',
	'Flashcard',
	function($scope, $location, $routeParams, Flashcard) {			
		$scope.putFlashcard = function () {
			var updatedFlashcard = Flashcard.get({ id: $routeParams.id });
			var params = {
				front: $scope.front,
				back: $scope.back,
				image: $scope.image,
				category: $scope.category
			} 
			Flashcard.update({id:$routeParams.id}, params);
			$location.path("/");
		}	
}])
.controller("NavCtrl", ['$scope', 'Auth', function($scope, Auth) {
	$scope.logout = function() {
		Auth.removeToken();
	};
}])
.controller("LoginCtrl", [
	'$scope',
	'$http',
	'$location',
	'Auth',
	function($scope, $http, $location, Auth) {
		$scope.user = {
			email: "",
			password: ""
		};
		$scope.actionName = "Login";
		$scope.userAction = function() {
			$http.post("/api/auth", $scope.user).then(function success(res) {
					Auth.saveToken(res.data.token);
					$location.path("/");
			}, function error(res) {
					console.log(res.data);
			});
		};
}])
.controller("SignupCtrl", [
	'$scope',
	'$http',
	'$location',
	'Auth',
	function($scope, $http, $location, Auth) {
		$scope.user = {
			email: "",
			password: ""
		};
		$scope.actionName = "Signup";
		$scope.userAction = function() {
			$http.post("/api/users", $scope.user).then(function success(res) {
				$http.post("/api/auth", $scope.user).then(function success(res) {
						Auth.saveToken(res.data.token);
						$location.path("/");
				}, function error(res) {
						console.log(res.data);
				});
			}, function error (res) {
						console.log(res.data);
			});
		}
}]);

