var app = angular.module("FlashcardApp", ["ngRoute", "FlashcardServices", "FlashcardCtrls", "ngLettering", "smoothScroll"]);

app.config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {
	$routeProvider
	.when("/", {
		templateUrl: "app/views/flashcards.html",
		controller: "FlashcardCtrl"
	})
	.when("/flashcards/new", {
		templateUrl: "app/views/new.html",
		controller: "FlashcardNewCtrl"
	})
	.when("/flashcards/delete/:id", {
		templateUrl: "app/views/flashcards.html",
		controller: "FlashcardDeleteCtrl"
	})
	.when("/flashcards/update/:id", {
		templateUrl: "app/views/update.html",
		controller: "FlashcardUpdateCtrl"
	})
	.when("/login", {
		templateUrl: "app/views/userLogin.html",
		controller: "LoginCtrl"
	})
	.when("/signup", {
		templateUrl: "app/views/userLogin.html",
		controller: "SignupCtrl"
	})
	.otherwise({
		templateUrl: "app/views/404.html"
	});

	$locationProvider.html5Mode(true);
}])
.config(["$httpProvider", function($httpProvider) {
	$httpProvider.interceptors.push("AuthInterceptor");
}])
.run(["$rootScope", "Auth", function($rootScope, Auth) {
	$rootScope.isLoggedIn = function() {
		return Auth.isLoggedIn.apply(Auth);
	}
}]);