<?php
ob_start();
	session_start();
	extract($_GET);
	//extract($_COOKIE);
	$dbcon=mysqli_connect("localhost","root","");
    mysqli_select_db($dbcon,"travelepic");

    $sql="select * from group_admin where userid=".$_SESSION['userid']." AND groupid=".$_SESSION['groupid'];
    $result=mysqli_query($dbcon, $sql);
    $nrows=mysqli_num_rows($result);
    $_SESSION['admin']="no";
    if($nrows>0){
    	$_SESSION['admin']="yes";
    }
    echo json_encode($_SESSION);
?>
