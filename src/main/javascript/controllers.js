

 
  /**
 * controller for the menu page
 * @param $scope
 * @param $location url location
 * @constructor
 */
 function MenuCtrl($scope,$location) {
	
  $scope.selectedPage = 'Home';
  
  $scope.navigate = function (location) 
	{
        $location.path('/'+location);
    };
}

  /**
 * controller for the menu page
 * @param $scope
 * @param $location url location
 * @constructor
 */
 function MapCtrl($scope,$location) {
		var ctaLayer;

		$scope.setClosestSea = function(seas, lat, lng)
		{
			var closestSea;
			var i;
			var closestDistance;
			var originPoint = new google.maps.LatLng(lat, lng);
						
			//Loop through seas;
			for(i=0; i<seas.length; i++)
			{
				var currentSea = seas[i];										
				var coordinates = currentSea.coordinates.split(" ");											
				var j;
								
				for (j=0; j<coordinates.length; j++)
				{					
					var latLngSplitted = coordinates[j].split(",");
					var currentPoint = new google.maps.LatLng(latLngSplitted[1], latLngSplitted[0]);			
					var distance = google.maps.geometry.spherical.computeDistanceBetween(originPoint, currentPoint);
					
					if(closestDistance)
					{
						if(closestDistance > distance)
						{
							closestDistance = distance;
							closestSea = currentSea;							
						}
					}
					else
					{
						closestDistance = distance;
					}					
				}				

			}
			if(closestSea)
			{
				$scope.setSea(closestSea.id);
			}
			
			return closestSea;
			
		}
		
		$scope.setSea = function(id)
		{		
				if(ctaLayer)
				{
					ctaLayer.setMap(null);
				}
				ctaLayer = new google.maps.KmlLayer({
				url: 'http://sharkapp.pazion.net/server/sharkserver.php?requestType=getseakml&id='+id
				});
				ctaLayer.setMap($scope.myMap);		
		}
		
		$scope.setMultipleSeas=function(idArray)
		{
			var i;			
			for(i=0;i<idArray.length;i++)
			{
				var tmpCtaLayer = new google.maps.KmlLayer({
				url: 'http://sharkapp.pazion.net/server/sharkserver.php?requestType=getseakml&id='+idArray[i]
				});
				tmpCtaLayer.setMap($scope.myMap);		
			}			
		}
				
		
	   var ll = new google.maps.LatLng(55.153766, 5.273438);
		$scope.mapOptions = {
			center: ll,
			zoom: 11,
			scrollwheel: false,
			navigationControl: false,
			mapTypeControl: false,
			scaleControl: false,
			draggable: false,
			disableDoubleClickZoom: true,
			disableDefaultUI: true,
			mapTypeId: google.maps.MapTypeId.TERRAIN
		};
		
		
		var mapLoaded = false;
		
		$scope.onMapIdle = function() {				

		if(!mapLoaded)
		{		
				geocoder = new google.maps.Geocoder();
				mapLoaded = true;				
				mapScope=$scope;				
				updateCoreSemaphore();
				if(document.getElementById("placesearch"))
				{
					var input = document.getElementById("placesearch");
					autocomplete = new google.maps.places.Autocomplete(input);
					
					google.maps.event.addListener(autocomplete, 'place_changed', function() {
					
						var place = autocomplete.getPlace();
						
						var sea = mapScope.setClosestSea(seasScope.seas, place.geometry.location.lat(), place.geometry.location.lng());
						sharksScope.setSharksBySeaId(sea.id,sea.name);
					});
				}			
		}		
	};	
}
 
 
 /**
 * controller for the home page
 * @param $scope
 * @param $location url location
 * @constructor
 */
function HomePageCtrl($scope, $http, $location) {
	$('#backbutton').css('display', 'none');

	//every page using the google map should have this check.
	//determines if the google api has already been loaded previously.
	if(googleInitialized)
	{
		angular.bootstrap(document.getElementById("map"), ['app.ui-map']);
	}
	mapConstructor = initializeHomeMap;
	$scope.dataProvider = new DataProvider($http,$scope);
	


}

function SharksPageCtrl($scope,$http,$location) {
	$('#backbutton').css('display', 'none');
	
}

function NewsPageCtrl($scope,$http,$location) {
	$('#backbutton').css('display', 'none');
    $scope.dataProvider = new DataProvider($http,$scope);
    $scope.dataProvider.getNews();
}

function SharkDetailPageCtrl($scope,$http,$routeParams,$location) {

	$('#backbutton').css('display', 'block');
	if(googleInitialized)
	{
		angular.bootstrap(document.getElementById("map"), ['app.ui-map']);
	}
  $scope.dataProvider = new DataProvider($http,$scope);
  $scope.dataProvider.getShark($routeParams.id);
  $scope.carouselInterval = 5000;

  $(document).ready(function() {
 
  $scope.initializeMap=function()
  {
    var seas = $scope.shark.seas;
	seas = seas.substr(1, seas.length-2);
	sharkDetailSeaIdsArray = seas.split(',');
	updateCoreSemaphore();
	mapConstructor = initializeSharkDetailMap;
	updateCoreSemaphore();      
  }
 
  $scope.carousel = $("#carousel").owlCarousel({
 
      autoPlay: 3000, //Set AutoPlay to 3 seconds 
      items : 2,
      itemsDesktop : [1199,3],
      itemsMobile: [640,3],
      itemsDesktopSmall : [979,3]
  });
  
  $scope.addItemsToCarousel=function(slides)
  {
	for (var i = 0; i<slides.length;i++)
	{
		var content = "<div class='item'><a rel='gallery-1' class='swipebox' href='"+slides[i].image+"'><img src='"+slides[i].image+"' alt='Owl Image'></a></div>";
		$scope.carousel.data('owlCarousel').addItem(content,0);	
		
	}
	$(".swipebox").swipebox();
	

  }
  $scope.dataProvider.getCarouselImages($routeParams.id);
 
});
}

function SeaCtrl($scope, $http)
{
	$scope.dataProvider = new DataProvider($http,$scope);
	$scope.dataProvider.getAllSeas();
	
	$scope.sea;
	$scope.place = "";
	$scope.places;
		
	$scope.setSelectedSea=function(sea)
	{
		$scope.$apply(function()
		{
			$scope.sea = sea;
		});
	}
	
	$scope.seaChange=function()
	{		
		if(mapScope)
		{
			mapScope.setSea($scope.sea.id);
			sharksScope.setSharksBySeaId($scope.sea.id,$scope.sea.name);
		}
	}
	
	seasScope = $scope;
}


function SharksCtrl($scope,$http, $location) {
	$scope.search;	
    $scope.dataProvider = new DataProvider($http,$scope);
    $scope.dataProvider.getAllSharks();	
	$scope.sea;
	
	$scope.setSharksBySeaId= function(seaId,seaName)
	{
			$scope.sea = seaName;
			$scope.dataProvider.getAllSharksBySea(seaId);
	};
	
	$scope.getSharkById= function(sharkId)
	{
		var i;
		if($scope.sharks)
		{
			for(i=0; i< $scope.sharks.length; i++)
			{	
				if($scope.sharks[i].id==sharkId)
				{
					return $scope.sharks[i];
				}
			}
		}
	};
	
	$scope.navigate = function (location) 
	{
        $location.path('/'+location);
    };	
	
	sharksScope=$scope;  
}

function InfoPageCtrl($scope,$http) {
	$('#backbutton').css('display', 'none');
    $scope.dataProvider = new DataProvider($http,$scope);
    $scope.dataProvider.getInfoPage();	

}

