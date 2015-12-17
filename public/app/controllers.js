angular.module("FlashcardCtrls", ['FlashcardServices'])
.controller("FlashcardCtrl", ['$scope', '$interval', '$modal', '$log', 'Flashcard', function($scope, $interval, $modal, $log, Flashcard) {
	$scope.flashcards = [];
	$scope.selectedIdx = null;
	$scope.timer = null;
	$scope.filteredArray = [];


	Flashcard.query(function success(data) {
		var shuffleData = shuffle(data);	
			$scope.flashcards = shuffleData;
			$scope.myOptions = removeDuplicates($scope.flashcards, "category");
	}, function error(data) {
		console.log(data);
	});

	var removeDuplicates = function (arr, key) {
		var unique = [],
        blocked = [];
    
    unique.push(arr[0]);
    blocked.push(arr[0][key]);
    
    for (var i = 1; i < arr.length; i++) {
        if (blocked.indexOf(arr[i][key]) <= -1) {
            unique.push(arr[i]);
            blocked.push(arr[i][key]);
        }
    }  
    return unique; 
	}

	// -> Fisher–Yates shuffle algorithm
	function shuffle(arr) {
		var m = arr.length, t, i;
		// While there remain elements to shuffle…
		while (m) {
			// Pick a remaining element…
			i = Math.floor(Math.random() * m--);
			// And swap it with the current element.
			t = arr[m];
			arr[m] = arr[i];
			arr[i] = t;
		}
		return arr;
	}

	function start() {
		$scope.timer = $interval(function () {
			$scope.selectedIdx = $scope.selectedIdx === null ? 0 : $scope.selectedIdx+1;
				if($scope.selectedIdx === $scope.flashcards.length) {
					$scope.selectedIdx = 0;
				}
		}, 1000);
	}
	start();

	 $scope.showUpdate = function(idx) {
	 	var selectedFlashcard = $scope.flashcards[idx];

		var modalInstance = $modal.open({
			templateUrl: "app/views/update.html",
			controller: "FlashcardUpdateCtrl",
			controllerAs: "ctrl",
			size: "md",
			resolve: {
				item: function() {
					return $scope.flashcards[idx];
				},
				index: function() {
					return idx;
				}
			}
		});

		modalInstance.result.then(
			function(selectedItem) {
				console.log(selectedItem);

				var updatedFlashcard = Flashcard.get({id: selectedFlashcard._id},function(){
					$scope.flashcards[idx] = updatedFlashcard;
				});
		}, function() {
			$log.info('Modal dismissed at: ' + new Date());
			console.log("doesn't work");
		});
	}

//dropdown menu 
  $scope.status = {
    isopen: false
  };

  $scope.toggleDropdown = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.status.isopen = !$scope.status.isopen;
  };

}])
.controller('FlashcardNewCtrl', [
	'$scope',
	'$route',
	'Flashcard',
	function($scope, $route, Flashcard) {
		$scope.createFlashcard = function() {
			
			var params = {
				front: $scope.front,
				back: $scope.back,
				image: $scope.image,
				category: $scope.category
			}
			console.log(params);
			var newFlashcard = new Flashcard(params);
			newFlashcard.$save();
			$route.reload();
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
	'$modalInstance',
	'Flashcard',
	"item",
	function($scope, $modalInstance, Flashcard, item) {			

		$scope.item = item;

		$scope.putFlashcard = function () {
			var params = {
				front: $scope.front,
				back: $scope.back,
				image: $scope.image,
				category: $scope.category
			} 
			console.log(params);
			Flashcard.update({id: $scope.item._id}, params);
			$modalInstance.close();
		}

		$scope.cancel = function() {
			$modalInstance.dismiss();
		}			
}])
.controller("NavCtrl", ['$scope', '$window', 'Auth', function($scope, $window, Auth) {
	$scope.logout = function() {
		Auth.removeToken();
		$window.location.reload();
	};
}])
.controller("LoginCtrl", [
	'$scope',
	'$http',
	'$location',
	'$window',
	'Auth',
	function($scope, $http, $location, $window, Auth) {
		$scope.user = {
			email: "",
			password: ""
		};
		$scope.actionName = "Login";
		$scope.userAction = function() {
			$http.post("/api/auth", $scope.user).then(function success(res) {
				if(res.data.token) {	
					Auth.saveToken(res.data.token);
					$location.path("/");
				} else {
					console.log('Auth failed');
					$window.location.reload();
				}
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

