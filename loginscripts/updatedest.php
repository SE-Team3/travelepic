<?php
	ob_start();
	session_start();

	extract($_GET);
	$dbcon=mysqli_connect("localhost","root","");
    
    mysqli_select_db($dbcon,"travelepic");

	$sql="select * from travel_details where groupid=".$_SESSION['groupid'];
	$result=mysqli_query($dbcon,$sql);

	if(mysqli_num_rows($result)>0){
		$sql1="Update travel_details set location='".$lat.":".$lon."', destinationname='".$dest."' where groupid=".$_SESSION['groupid'];
		$result1=mysqli_query($dbcon,$sql1);
	}
	else {
		$pos=$lat.":".$lon;
		$sql1="Insert into travel_details values (".$_SESSION['groupid'].",'$pos','$dest')";
		$result1=mysqli_query($dbcon,$sql1);
	}
	ob_flush();
	flush();
?>