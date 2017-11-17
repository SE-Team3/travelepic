<?php
    $dbcon=mysqli_connect("localhost","root","");
    mysqli_select_db($dbcon,"travelepic");
    extract($_POST);
    session_start();
    $group_id=$_POST['id'];
    $group_password=$_POST['password'];

  //   $regex = '/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/';

  //   if($groupd_id=='')
  //   {
  //       echo"<script>alert('Please enter the group name')</script>";
  //       echo "<script>window.open('../group-register.html','_self')</script>";
  //       exit();
  //   }
  //   if($group_password=='')
  //   {
  //       echo"<script>alert('Please enter the password')</script>";
  //       echo "<script>window.open('../group-register.html','_self')</script>";
  //       exit();
  //   }

  //   $insert_group="insert into travel_group(groupname,grouppassword) VALUES ('$groupd_id','$group_password')";
  //   echo $insert_group;
    
  //   if(mysqli_query($dbcon,$insert_group)){
		// $sql1="select * from group_admin where userid=".$_SESSION['userid']." AND groupid=".$_SESSION['groupid']."";
		// $result1=mysqli_query($dbcon,$sql1);
		// if(mysqli_num_rows($result1)>0){
		// 	$sql2="update group_admin set userid=".$_SESSION['userid']."";
		// 	$sql3="update group_admin set groupid=".$_SESSION['groupid']."";
		// 	mysqli_query($dbcon,$sql2);
		// 	mysqli_query($dbcon,$sql3);
		// }
		// else {
		// 	$sql2="Insert into group_admin values(".$_SESSION['userid'].",".$_SESSION['groupid'].")";
		// 	mysqli_query($dbcon,$sql2);
		// }
  //       echo "<script>window.open('../group-login.html','_self')</script>";
  //   }
  //   else
  //   {
  //       echo"<script>alert('Registration failed, group already exists')</script>";
  //       echo "<script>window.open('../group-register.html','_self')</script>";
  //   }
?>
