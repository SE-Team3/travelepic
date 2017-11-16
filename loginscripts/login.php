<?php
    $dbcon=mysqli_connect("localhost","root","","travelepic");
    session_start();
    extract($_POST);
    $user_email=$_POST['email'];
    $user_password=$_POST['password'];
    $regex = '/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/';

    if($user_email=='')
    {
        echo"<script>alert('Please enter the email id')</script>";
        echo "<script>window.open('../form-register.html','_self')</script>";
        exit();
    }
    if (!preg_match($regex, $email))
    {
        echo"<script>alert('Please enter the valid email')</script>";
        echo "<script>window.open('../form-register.html','_self')</script>";
        exit();
    }
    if($user_password=='')
    {
        echo"<script>alert('Please enter the password')</script>";
        echo "<script>window.open('../form-register.html','_self')</script>";
        exit();
    }

    $checksql="select * from user WHERE email='$user_email' AND password='$user_password'"; 
    $result=mysqli_query($dbcon,$checksql);
    $num=mysqli_num_rows($result);
    if($num==1){
        echo "<script>window.open('../group-login.html','_self')</script>";
    }
    else
    {
        echo"<script>alert('Login unsuccessfull,please try again')</script>";
        echo "<script>window.open('../form-login.html','_self')</script>";
    }
?>