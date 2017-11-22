<?php
	ob_start();
	session_start();
	
	extract($_GET);

	$dbcon=mysqli_connect("localhost","root","");
    mysqli_select_db($dbcon,"travelepic");
	
	$location=$lat.":".$lon;

	$sql="select * from location_details where userid=".$_SESSION['userid']."";
	$res=mysqli_query($dbcon, $sql);
	$num=mysqli_num_rows($res);
	if($num==1){
		$sql2="update location_details set location='$location' where userid=".$_SESSION['userid']."";
		mysqli_query($dbcon, $sql2);
	}
	else
	{
		$userloc="insert into location_details(userid, location) VALUES('".$_SESSION['userid']."','$location')";
   		mysqli_query($dbcon,$userloc);
	}
	ob_flush();
	flush();
?>
