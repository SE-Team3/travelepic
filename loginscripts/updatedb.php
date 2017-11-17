<?php
	ob_start();
	session_start();
	extract($_GET);
	//extract($_COOKIE);
	$dbcon=mysqli_connect("localhost","root","");
    mysqli_select_db($dbcon,"travelepic");
	$location=$lat.":".$lon;
	//$co=$_COOKIE['$cookie_name'];
	echo $_SESSION['userid'];
	  //echo"<script>alert('hi welcome')</script>";
	//echo "<script>alert('$co')</script>";
	$userloc="insert into location_details(userid, location) VALUES('".$_SESSION['userid']."','$location')";
    mysqli_query($dbcon,$userloc);
	ob_flush();
	flush();
?>
