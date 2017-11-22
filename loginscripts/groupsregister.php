<?php
    $dbcon=mysqli_connect("localhost","root","");
    mysqli_select_db($dbcon,"travelepic");
    extract($_POST);
    session_start();
    $group_name=$_POST['name'];
    $group_password=$_POST['password'];
    $regex = '/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/';

    if($group_name=='')
    {
        echo"<script>alert('Please enter the group name')</script>";
        echo "<script>window.open('../group-register.html','_self')</script>";
        exit();
    }
    if($group_password=='')
    {
        echo"<script>alert('Please enter the password')</script>";
        echo "<script>window.open('../group-register.html','_self')</script>";
        exit();
    }

    $insert_group="insert into travel_group(groupname,grouppassword) VALUES ('$group_name','$group_password')";
    
    if(mysqli_query($dbcon,$insert_group)){
	    //no session variable groupid here so write query to get it
    	$sqlgroupid="select groupid from travel_group where groupname='$group_name' AND grouppassword='$group_password'";
    	$res1=mysqli_query($dbcon,$sqlgroupid);
    	$row = mysqli_fetch_array($res1);
    	$grpid = $row['groupid'];
		$sql1="select * from group_admin where userid=".$_SESSION['userid']." AND groupid='$grpid'";
		$result1=mysqli_query($dbcon,$sql1);
		if(mysqli_num_rows($result1)>0){
			//$sql2="update group_admin set userid=".$_SESSION['userid']." where ";
			$sql3="update group_admin set groupid='$grpid' where userid=".$_SESSION['userid']."";
			//mysqli_query($dbcon,$sql2);
			mysqli_query($dbcon,$sql3);
		}
		else {
			$sql2="Insert into group_admin values(".$_SESSION['userid'].",'$grpid')";
			mysqli_query($dbcon,$sql2);
		}
        echo "<script>window.open('../group-login.html','_self')</script>";
    }
    else
    {
        echo"<script>alert('Registration failed, group already exists')</script>";
        echo "<script>window.open('../group-register.html','_self')</script>";
    }
?>
