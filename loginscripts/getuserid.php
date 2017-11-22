<?php
//has session var userid should get user of same group
	ob_start();
	session_start();
	// extract($_GET);
	$dbcon=mysqli_connect("localhost","root","","travelepic");
	$ass_array=array();
	$sql="select userid from user_group where groupid=".$_SESSION['groupid']."";
	$res=mysqli_query($dbcon, $sql);
	$num=mysqli_num_rows($res);
	//if 1 = only one member else many
	if($num>1)
	{
		//$row = mysqli_fetch_array($res);
		while ($row = mysqli_fetch_array($res, MYSQLI_ASSOC)) 
		{
			if($_SESSION['userid'] !== $row['userid'])//if not the requested user
			{
				$sql1="select location from location_details where userid=".$row['userid']."";
				$sql2="select username from user where userid=".$row['userid']."";
				$res1 = mysqli_query($dbcon, $sql1);
				$row1 = mysqli_fetch_array($res1);
				$res2 = mysqli_query($dbcon, $sql2);
				$row2 = mysqli_fetch_array($res2);
				$row_array['username'] = $row2['username'];
				$row_array['location'] = $row1['location'];
				array_push($ass_array,$row_array);
			}	
		}	
	}
	else{
		
	}
	/*
	{
		'username'=>username_for_given_userid
		'location'=>location_of_user
	}
	*/
	echo json_encode($ass_array);
	ob_flush();
	flush();
?>
