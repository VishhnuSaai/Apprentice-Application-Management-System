<?php
include 'connect.php';
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Display</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css"> 
    <link rel="stylesheet" href="styling3.css">
    <script type="text/javascript" src="https://unpkg.com/xlsx@0.15.1/dist/xlsx.full.min.js"></script>
</head>

<body>
    <div class="contatiner">
    <h1>Display of Applications</h1>
        <!-- &nbsp <button class="btn btn-primary my-5"><a href="user.php" class="text-light">add user</a></button> -->
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">name</th>
                    <th scope="col">mother</th>
                    <th scope="col">father</th>
                    <th scope="col">address</th>
                    <th scope="col">mobile</th>
                    <th scope="col">email</th>
                    <th scope="col">college</th>
                    <th scope="col">city</th>
                    <th scope="col">degree</th>
                    <th scope="col">branch</th>
                    <th scope="col">semester</th>
                    <th scope="col">id</th>
                    <th scope="col">fee</th>
                    <th scope="col">bank</th>
                    <th scope="col">dd</th>
                    <th scope="col">date</th>
                    <th scope="col">ref</th>
                    <th scope="col">operations</th>
                </tr>
            </thead>
            <tbody>
                <?php
                $query = "SELECT * FROM `students`";
                $result = mysqli_query($con, $query);
                if ($result) {
                    while ($row = mysqli_fetch_assoc($result)) {
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

                        echo '<tr>
                                <td>' . $name . '</td>
                                <td>' . $mother . '</td>
                                <td>' . $father . '</td>
                                <td>' . $address . '</td>
                                <td>' . $mobile . '</td>
                                <td>' . $email . '</td>
                                <td>' . $college . '</td>
                                <td>' . $city . '</td>
                                <td>' . $degree . '</td>
                                <td>' . $branch . '</td>
                                <td>' . $semester . '</td>
                                <td>' . $id . '</td>
                                <td>' . $fee . '</td>
                                <td>' . $bank . '</td>
                                <td>' . $dd . '</td>
                                <td>' . $date . '</td>
                                <td>' . $ref . '</td>
                                <td>
                                    <button class="btn btn-primary">
                                        <a href="update.php?updateid=' . $id . '" class="text-light">Update</a>
                                    </button>
                                    <button class="btn btn-danger">
                                        <a href="delete.php?deleteid=' . $id . '" class="text-light">Delete</a>
                                    </button>
                                </td>
                            </tr>';
                    }
                }
                ?>
            </tbody>
        </table>
    </div>
    </script>
</body>

</html>
