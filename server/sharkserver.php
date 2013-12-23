<?php
require 'server_config.php';

class DataProvider{
    	private $sharktable_name;
    	private $seatable_name;
		private $newstable_name;
		private $carouseltable_name;
	
	private $db;

    public function getAllSharks()
    {
        $getAllSharksQuery = "SELECT * FROM $this->sharktable_name";
		
        $sharks = array();
        if($result = $this->db->query($getAllSharksQuery))
        {
            while($row = $result->fetch_assoc() )
            {
                $sharks[] = $row;
            }
			
            $result->close();
        }
        $this->db->close();

        return '{"Sharks":'.json_encode($sharks).'}';

    }
	
	public function getAllSeas()
    {

        $getAllSeasQuery = "SELECT * FROM  $this->seatable_name";
		
        $seas = array();
        if($result = $this->db->query($getAllSeasQuery))
        {
            while($row = $result->fetch_assoc() )
            {
                $seas[] = $row;
            }
			
            $result->close();
        }
        $this->db->close();

        return '{"Seas":'.json_encode($seas).'}';
    }


    public function getSharksBySea($seaId)
    {
        $getSharkQuery = "SELECT * FROM $this->sharktable_name WHERE seas LIKE '%,$seaId,%'";

        $sharks = array();

        if($result = $this->db->query($getSharkQuery))
        {

            while($row = $result->fetch_assoc() )
            {
                $sharks[] = $row;
            }

            $result->close();
        }				

        $this->db->close();
		
		return '{"Sharks":'.json_encode($sharks).'}';
    }
	
	
	public function getNews()
    {
        $getNewsQuery = "SELECT ID, post_date, post_title,post_content   FROM $this->newstable_name WHERE post_status = 'publish' ORDER BY post_date DESC LIMIT 3";

		$news = array();
        if($result = $this->db->query($getNewsQuery))
        {
            while($row = $result->fetch_assoc() )
            {
                $news[] = $row;
            }
			
            $result->close();
        }
        $this->db->close();

        return '{"News":'.json_encode($news).'}';
    }
	
	
	
	public function getSharkCarousel($id)
    {
        $getSharkQuery = "SELECT carouselImages FROM $this->sharktable_name WHERE sharkId = '$id'";
		$shark = null;
        if($result = $this->db->query($getSharkQuery))
        {
            while($row = $result->fetch_assoc() )
            {
                $shark = $row;
            }			
            $result->close();
        }
		
		$imageIds= explode(',',$shark['carouselImages']);
		
		$images = array();
		
		foreach($imageIds as $imageId)
		{
			$getImageQuery = "SELECT * FROM $this->carouseltable_name WHERE imageId='$imageId'";
			if($result = $this->db->query($getImageQuery))
			{
				while($row = $result->fetch_assoc() )
				{
					$images[] = $row;
				}
				
				$result->close();
			}
		}
		
        $this->db->close();

        return '{"Images":'.json_encode($images).'}';
    }
	
	
	public function getSeaKml($seaID)
    {
        $getAllSeasQuery = "SELECT * FROM  $this->seatable_name WHERE seaId = '$seaID'";
		
        $seas = array();
        if($result = $this->db->query($getAllSeasQuery))
        {
            while($row = $result->fetch_assoc() )
            {
                $seas[] = $row;
            }
			
            $result->close();
        }
        $this->db->close();

		$xml = "<?xml version='1.0' encoding='UTF-8'?>
		<kml xmlns='http://www.opengis.net/kml/2.1'>".
		"	
			<refreshMode>onExpire</refreshMode>
			<Style id='redpolygon'>
				<LineStyle>
					<color>371400F0</color>
					<width>4</width>
				</LineStyle>
				<PolyStyle>
					<color>371400F0</color>
					<fill>1</fill>
					<outline>1</outline>
				</PolyStyle>
			</Style>	
			<Placemark>
				<styleUrl>#redpolygon</styleUrl>
				<Polygon>
					<outerBoundaryIs>
						<LinearRing>
							<tessellate>0</tessellate>
							<coordinates>".$seas[0]['coordinates']."</coordinates>
						</LinearRing>
					</outerBoundaryIs>
				</Polygon>
			</Placemark>			
		"
		."</kml>";
		
        return $xml;
    }
	
	public function getInfo()
    {
    	echo file_get_contents(dirname(__FILE__).'/info.html');

	}
	

    function __construct($databaseInfo,$tableNames)
    {
	    	$this->db = new mysqli($databaseInfo['host'], $databaseInfo['username'], $databaseInfo['password']);
			$this->db->select_db($databaseInfo['database']);

	    	$this->sharktable_name = $tableNames['shark'];
    		$this->seatable_name = $tableNames['sea'];
			$this->newstable_name = $tableNames['news'];
			$this->carouseltable_name = $tableNames['carousel'];
	}
}

$dataProvider = new DataProvider($_databaseInfo, $_tableNames);

//Get request type check for testing;
$requestType;
$id;


if(isset($_GET['requestType']))
{
	$requestType=$_GET['requestType'];
}
else if(isset($_POST['requestType']))
{
	$requestType=$_POST['requestType'];
}
else
{
	echo "No requestype given as parameter";
}

if(isset($_GET['id']))
{
	$id = $_GET['id'];
}
else if(isset($_POST['id']))
{
	$id = $_POST['id'];
}
else
{
	$id = 0;
}

if($requestType=="getallsharks")
{	
	echo($dataProvider->getAllSharks());
}
else if($requestType=="getallseas")
{
	echo($dataProvider->getAllSeas());
}
else if($requestType=="getseakml")
{
	header('Content-type: application/vnd.google-earth.kml+xml');
	echo($dataProvider->getSeaKml($_GET['id']));
}
else if($requestType=="getsharksbysea")
{
	echo($dataProvider->getSharksBySea($id));
}
else if($requestType=="getnews")
{
	echo($dataProvider->getNews());
}
else if($requestType=="getcarousel")
{
	echo($dataProvider->getSharkCarousel($id));
}
else if($requestType=="getinfo")
{
	$dataProvider->getInfo();
}


?>