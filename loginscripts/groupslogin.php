<?php

    $dbcon=mysqli_connect("localhost","root","");
    mysqli_select_db($dbcon,"travelepic");
	session_start();
    extract($_POST);
    $group_groupname=$_POST['name'];
    $group_password=$_POST['password'];

    if($group_password=='')
    {
        echo"<script>alert('Please enter the group password')</script>";
        echo "<script>window.open('../group-login.html','_self')</script>";
        exit();
    }

    $checksql="select * from travel_group where groupname='$group_groupname' and grouppassword='$group_password'"; 
    $result=mysqli_query($dbcon,$checksql);
    $num=mysqli_num_rows($result);
	$res=mysqli_fetch_assoc($result);
    if($num==1){
		$_SESSION['groupid']=$res['groupid'];
		$sql1="Insert into user_group values(".$_SESSION['userid'].",".$_SESSION['groupid'].")";
		$res=mysqli_query($dbcon,$sql1);
        // echo"<script>alert('GROUP LOGIN SUCCESSFULL,Loading Group chat page')</script>";
        echo "<script>window.open('../tripindex.html','_self')</script>";
    }
    else
    {
        echo"<script>alert('Login unsuccessfull,please try again ".$group_groupname."')</script>";
        echo "<script>window.open('../group-login.html','_self')</script>";
    }
?>
