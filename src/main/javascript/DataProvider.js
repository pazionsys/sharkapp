/**
 * 
 * Author: Mick Soudant
 * Date: 18-10-13
 * Time: 10:03
 * 
 */
function DataProvider($http,$scope) {


	var serverRestUrl = serverUrl+serverRESTFileName;
	 
    this.getAllSharks = function() {		
        var params = $.param({requestType:"getallsharks"});
				
        var self = this;
		
        $http({
            url: serverRestUrl,
            method: "POST",
            data: params,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function (data) {
            self.handleGetAllSharksRequest(data.Sharks,$scope);
        });
    };
	
	this.getShark = function(sharkId) {		
        var params = $.param({requestType:"getshark",id:sharkId});
				
        var self = this;
		
        $http({
            url: serverRestUrl,
            method: "POST",
            data: params,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function (data) {
            self.handleGetSharkRequest(data.Shark,$scope);
        });
    };

	
	this.handleGetSharkRequest=function(sharkData,$scope) {
        if(sharkData) {
			var shark = new Shark(sharkData.sharkId, sharkData.name, serverUrl+"/"+imagesFolderName+"/"+sharkData.imageURL, sharkData.description);
			shark.setSeas(sharkData.seas);
			shark.setSize(sharkData.size);
			shark.setDiet(sharkData.diet);
			shark.setAge(sharkData.age);
			shark.setOtherNames(sharkData.otherNames);

			$scope.shark = shark;
			$scope.initializeMap();

        } else {
            // fout afvang indien data niet binnenkomt
        }
    };

    this.handleGetAllSharksRequest=function(sharkData,$scope) {
        if(sharkData) {
			var sharkList = [];
			for(var i = 0; i<sharkData.length;i++)
			{
				
				var currentShark = sharkData[i];
				sharkList[i] = new Shark(currentShark.sharkId, currentShark.name, serverUrl+"/"+imagesFolderName+"/"+currentShark.imageURL, currentShark.description);
				sharkList[i].setSeas(currentShark.seas);
				sharkList[i].setSize(currentShark.size);
				sharkList[i].setDiet(currentShark.diet);
				sharkList[i].setAge(currentShark.age);
				sharkList[i].setOtherNames(currentShark.otherNames);
			}
           $scope.sharks = sharkList;
		   
		   
        } else {
            // fout afvang indien data niet binnenkomt
        }
    };
	
	

    this.getAllSeas = function() {
        var params = $.param({requestType:"getallseas"});
				
        var self = this;
        $http({
            url: serverRestUrl,
            method: "POST",
            data: params,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function (data) {
            self.handleGetAllSeasRequest(data.Seas,$scope);
        });
    };


    this.handleGetAllSeasRequest=function(seaData,$scope) {
        if(seaData) {
			var seaList = [];
			for(var i = 0; i<seaData.length;i++)
			{
				var currentSea = seaData[i];
				seaList[i] = new Sea(currentSea.seaId, currentSea.name, currentSea.description,currentSea.coordinates);				
			}
			
			$scope.seas = seaList;
			//seas = seaList;
			updateCoreSemaphore();
   
        } else {
            // fout afvang indien data niet binnenkomt
        }
    };
	

    this.getNews = function() {
        var params = $.param({requestType:"getnews"});
				
        var self = this;
        $http({
            url: serverRestUrl,
            method: "POST",
            data: params,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function (data) {
            self.handleGetAllNewsRequest(data.News,$scope);
        });
    };


    this.handleGetAllNewsRequest=function(newsData,$scope) {
        if(newsData) {
			var newsList = [];
			for(var i = 0; i<newsData.length;i++)
			{
				var currentNewsItem = newsData[i];
				
				newsList[i] = new NewsItem(currentNewsItem.ID, currentNewsItem.post_date, currentNewsItem.post_title, strip(currentNewsItem.post_content).substr(0,100)+'...');				
			}
           $scope.news = newsList;
		   
		   
        } else {
            // fout afvang indien data niet binnenkomt
        }
    };
	
	
	
	this.getInfoPage= function() {
				
        var self = this;
        var params = $.param({requestType:"getinfo"});
        		
		var infoPageUrl = serverRestUrl; 
		//alert(infoPageUrl);
        $http({
            url: infoPageUrl,
            data: params,
            method: "POST",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function (data) {
            self.handleGetInfoPageRequest(data,$scope);
        });	
	};
	
	this.handleGetInfoPageRequest= function(infoData) {
	        if(infoData) {
			$scope.info = infoData;
		   		   
        } else {
            // fout afvang indien data niet binnenkomt
        }
	
	};
	
	
	function strip(html)
	{
	   var tmp = document.createElement("DIV");
	   tmp.innerHTML = html;
	   return tmp.textContent || tmp.innerText || "";
	}
	
    this.getAllSharksBySea = function(seaId) {
        var params = $.param({requestType:"getsharksbysea",id:seaId});
				
        var self = this;
        $http({
            url: serverRestUrl,
            method: "POST",
            data: params,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function (data) {
            self.handleGetAllSharksRequest(data.Sharks,$scope);
        });
    };
	
	this.getCarouselImages = function(sharkId) {
			var params = $.param({requestType:"getcarousel",id:sharkId});	
			var self = this;
			$http({
				url: serverRestUrl,
				method: "POST",
				data: params,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				}).success(function (data) {
				self.handleGetCarouselImagesRequest(data.Images,$scope);
			});
    };
	
	   this.handleGetCarouselImagesRequest=function(imagesData,$scope) {
        if(imagesData) {
			var imageList = [];
			for(var i = 0; i<imagesData.length;i++)
			{
				var currentImage = imagesData[i];
				imageList[i] = {image: serverUrl+imagesFolderName+"/"+currentImage.imageSrc, text: currentImage.imageText};
			}
			
			
			$scope.addItemsToCarousel(imageList);
		   
		   
        } else {
            // fout afvang indien data niet binnenkomt
        }
    };




}