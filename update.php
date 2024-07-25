<?php
include 'connect.php';
$id=$_GET['updateid'];
$sql="select * from `students` where id=$id";
$result=mysqli_query($con,$sql);
$row=mysqli_fetch_assoc($result);
$id = $row['id'];
$name = $row['name'];
$mother = $row['mother'];
$father = $row['father'];
$address = $row['address'];
$mobile = $row['mobile'];
$email = $row['email'];
$college = $row['college'];
$city = $row['city'];
$degree = $row['degree'];
$branch = $row['branch'];
$semester = $row['semester'];
$fee = $row['fee'];
$bank = $row['bank'];
$dd = $row['dd'];
$date = $row['date'];
$ref = $row['ref'];

if(isset($_POST['submit'])){
$id = $row['id'];
$name = $row['name'];
$mother = $row['mother'];
$father = $row['father'];
$address = $row['address'];
$mobile = $row['mobile'];
$email = $row['email'];
$college = $row['college'];
$city = $row['city'];
$degree = $row['degree'];
$branch = $row['branch'];
$semester = $row['semester'];
$fee = $row['fee'];
$bank = $row['bank'];
$dd = $row['dd'];
$date = $row['date'];
$ref = $row['ref'];

    $sql="update `students` set id='$id',name='$name',mother='$mother',father='$father',address='$address',mobile='$mobile',email='$email',
    college='$college',city='$city',degree='$degree',branch='$branch',semester='$semester',
    fee='$fee',bank='$bank',dd='$dd',date='$date',ref='$ref' where id='$id'";  
    $result=mysqli_query($con,$sql);
    if($result){
       //echo "data updated succesfully";
       header('location:display.php'); 
    }
    else{
        die(mysqli_error($con));
    }
}
?>

<!doctype html>
<html lang="en">

<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css">

    <title>Details Updation</title>
</head>

<body>
    <div class="container my-5">
    <h1>Details Updation</h1>
        <form method="post">
            <div class="form-group">
                <label>Name</label>
                <input type="text" class="form-control" name="name" value=<?php echo $name;?> >
            </div>
            <div class="form-group">
                <label>Mother</label>
                <input type="text" class="form-control" name="mother" value=<?php echo $mother;?> >
            </div>
            <div class="form-group">
                <label>Father</label>
                <input type="text" class="form-control" name="father" value=<?php echo $father;?> >
            </div>
            <div class="form-group">
                <label>Address</label>
                <input type="text" class="form-control" name="address" value=<?php echo $address;?> >
            </div>
            <div class="form-group">
                <label>Mobile</label>
                <input type="text" class="form-control" name="mobile" value=<?php echo $mobile;?> >
            </div>
            <div class="form-group">
                <label>E-mail</label>
                <input type="text" class="form-control" name="email" value=<?php echo $email;?> >
            </div>
            <div class="form-group">
                <label>College</label>
                <input type="text" class="form-control" name="college" value=<?php echo $college;?> >
            </div>
            <div class="form-group">
                <label>City</label>
                <input type="text" class="form-control" name="city" value=<?php echo $city;?> >
            </div>
            <div class="form-group">
                <label>Degree</label>
                <input type="text" class="form-control" name="degree" value=<?php echo $degree;?> >
            </div>
            <div class="form-group">
                <label>Branch</label>
                <input type="text" class="form-control" name="branch" value=<?php echo $branch;?> >
            </div>
            <div class="form-group">
                <label>Semester</label>
                <input type="text" class="form-control" name="semester" value=<?php echo $semester;?> >
            </div>
            <div class="form-group">
                <label>id</label>
                <input type="text" class="form-control"  name="id" value=<?php echo $id;?>>
            </div>
            <div class="form-group">
                <label>Fee</label>
                <input type="text" class="form-control" name="fee" value=<?php echo $fee;?> >
            </div>
            <div class="form-group">
                <label>Bank</label>
                <input type="text" class="form-control" name="bank" value=<?php echo $bank;?> >
            </div>
            <div class="form-group">
                <label>DD</label>
                <input type="text" class="form-control" name="dd" value=<?php echo $dd;?> >
            </div>
            <div class="form-group">
                <label>Date</label>
                <input type="date" class="form-control" name="date" value=<?php echo $date;?> >
            </div>
            <div class="form-group">
                <label>Reference</label>
                <input type="text" class="form-control" name="ref" value=<?php echo $ref;?> >
            </div>

            <button type="submit" class="btn btn-primary" name="submit" >Update</button>
        </form>
    </div>
</body>

</html>