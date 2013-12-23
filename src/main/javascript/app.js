//Storng the mapscope global for inter app communication
var mapScope;
var seasScope;
var placeScope;

var googleApiKey= "AIzaSyA11Sz9SAzFcpgZvH_IkNvN4uLOwqBQHFQ";

var sharkDetailSeaIdsArray;
var layersStorage = new Array();

var sharksScope;
var googleInitialized = false;
var coreSemaphore=0;

var serverUrl = "http://sharkapp.pazion.net/server/"
var serverRESTFileName = "sharkserver.php";
var imagesFolderName = "sharkimages";

var mapConstructor = initializeHomeMap;

function initialize() {
	 angular.bootstrap(document.getElementById("map"), ['app.ui-map']);
	 googleInitialized = true;
	 
	 $("#backbutton").on( "click", function() {
		previousPage();
		});
		}

function initializeHomeMap()
{
	if (navigator.geolocation) 
	{
		var options = {
		enableHighAccuracy: true,
		timeout: 10000,
		};
		
		navigator.geolocation.getCurrentPosition(
		function(position)
		{
			
			var selectedSea = mapScope.setClosestSea(seasScope.seas, position.coords.latitude, position.coords.longitude);
			sharksScope.setSharksBySeaId(selectedSea.id,selectedSea.name);
		}
		,
		function error(msg) 
		{
			var selectedSea = mapScope.setClosestSea(seasScope.seas, -24.066528, 132.714844);

			sharksScope.setSharksBySeaId(selectedSea.id,selectedSea.name);
		}
		,
		options);
		} 
		else 
		{
			alert('geolocation not supported');
		}
		coreSemaphore=0;
}

function initializeSharkDetailMap()
{
	mapScope.setMultipleSeas(sharkDetailSeaIdsArray);
	coreSemaphore=0;
}


function updateCoreSemaphore()
{
	
	coreSemaphore = coreSemaphore + 1;
	if(coreSemaphore == 3)
	{
		mapConstructor();
	}
}

function previousPage()
{
  window.history.back();
}


/**
 * angular module: sets the controller for each page
 */
var angularModule = angular.module('shark', ['ui.bootstrap']);
    angularModule.config(['$routeProvider', function($routeProvider) {
        $routeProvider.
            when('/home', {templateUrl: 'src/templates/home.html', controller: HomePageCtrl}).
			when('/sharks', {templateUrl: 'src/templates/sharks.html', controller: SharksPageCtrl}).
			when('/news', {templateUrl: 'src/templates/news.html', controller: NewsPageCtrl}).
			when('/info', {templateUrl: 'src/templates/info.html', controller: InfoPageCtrl}).
			when('/detail/:id', {templateUrl: 'src/templates/sharkdetail.html', controller: SharkDetailPageCtrl}).
            otherwise({redirectTo: '/home'});
    }]);
    angularModule.config(['$httpProvider', function($httpProvider) {
		$httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common["X-Requested-With"];
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = "http://maps.googleapis.com/maps/api/js?key="+googleApiKey+"&sensor=false&callback=initialize&libraries=geometry,places";
		document.body.appendChild(script);
    }]);
	
	
	
var myAppModule = angular.module('app.ui-map', ['ui.map']);  


