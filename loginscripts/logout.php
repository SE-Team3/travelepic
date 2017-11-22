<?php
 	$dbcon=mysqli_connect("localhost","root","","travelepic");
    session_start();

    $sql1="delete from group_admin where groupid=".$_SESSION['groupid']." AND userid=".$_SESSION['userid'];
    $sql2="delete from user_group where groupid=".$_SESSION['groupid'];
    $sql3="delete from travel_group where groupid=".$_SESSION['groupid'];
    $sql4="delete from travel_details where groupid=".$_SESSION['groupid'];    
    
    if($_SESSION['admin']=="no"){
    	mysqli_query($dbcon,$sql2);
    }
    else {
    	mysqli_query($dbcon,$sql1);
    	mysqli_query($dbcon,$sql2);
    	mysqli_query($dbcon,$sql3);
    	mysqli_query($dbcon,$sql4);
    }
    session_destroy();
    echo "<script>window.open('../form-login.html','_self')</script>";
?>