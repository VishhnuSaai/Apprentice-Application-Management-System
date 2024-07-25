<?php
// Include the connect.php file
include('student.php');
?>
<html>
<head>
    <script src="rules.js"></script>
    <script src="yav.js"></script>
    <script src="cookies.js"></script>
    <link rel="stylesheet" type="text/css" href="styling2.css">
    <title>BDL Apprentice/Internship/Project work application form</title>
    <script src="yav-config.js"></script>
    <script src="cookies.js"></script>
    <script>
        function validate() {
            if (document.getElementById("photo").files.length == 0) {
                alert("You haven't selected your photo.");
                return false;
            }
            return true;
        }

        function validateFileExtension(fld) {
            if (!/(\.bmp|\.gif|\.jpg|\.jpeg)$/i.test(fld.value)) {
                alert("Invalid image file type.");
                fld.form.reset();
                fld.focus();
                return false;
            }
            return true;
        }
    </script>
</head>
<body onload="alert('PLEASE TAKE A PRINTOUT OF THE FORM BEFORE SUBMITTING')">
    <div class="header">
        <img src="logo.png" alt="Logo">
    </div>

    <script type="text/javascript">
function previewFile() {
    var preview = document.querySelector('#preview');
    var file = document.querySelector('input[type=file]').files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
        preview.src = reader.result;
    };
    if (file) {
        reader.readAsDataURL(file);
    } else {
        preview.src = "";
    }
}

    </script>

    <form id="report" action="mailer.php" enctype="multipart/form-data" method="post" onsubmit="return validate() && validateFileExtension(this.photo);">
    <form id="report" action="student.php" enctype="multipart/form-data" method="post" onsubmit="return validate() && validateFileExtension(this.photo);">
        <table width="70%" border="1">
            <tr>
                <th colspan="2"><span class="heads"><u><b>PERSONAL DETAILS:</b></u></span></th>
            </tr>
            <tr>
    <td><b>Your Photo:</b>
    <input type="file" id="photo" accept=".bmp, .gif, .jpg, .jpeg" onchange="previewFile();return validateFileExtension(this);"></td>
    <td><img src="" id="preview" class="preview" alt="Selected photo"></td>
</tr>

            <tr>
                <td><label for="Name"><b>Name of the Applicant:</b></label></td>
                <td><p id="a"><script>document.write(getCookie('name'));</script></p></td>
            </tr>
            <tr>
                <td><label for="mother details"><b>Mother's Name:</b></label>&nbsp; &nbsp;</td>
                <td><p id="b"><script>document.write(getCookie('mother'));</script> </p></td>
            </tr>
            <tr>
                <td><label for="father details"><b>Father's Name:</b></label>&nbsp; &nbsp;</td>
                <td><p id="c"><script>document.write(getCookie('father'));</script> </p></td>
            </tr>
            <tr>
                <td><label for="address"><b>Permanent Address of the Applicant:</b></label>&nbsp; &nbsp;</td>
                <td><p id="d"><script>document.write(getCookie('address'));</script> </p></td>
            </tr>
            <tr>
                <td><label for="mobile"><b>Mobile Number:</b></label>&nbsp; &nbsp;</td>
                <td><p id="e"><script>document.write(getCookie('mobile'));</script> </p></td>
            </tr>
            <tr>
                <td><label for="eml"><b>E-Mail ID:</b></label>&nbsp; &nbsp;</td>
                <td><p id="f"><script>document.write(getCookie('eml'));</script> </p></td>
            </tr>
        </table>
        <br><br>
        <table width="70%" border="1">
            <tr>
                <th colspan="2"><span class="heads"><u><b>COLLEGE DETAILS:</b></u></span></th>
            </tr>
            <tr>
                <td><label for="College"><b>College/University:</b></label>&nbsp;&nbsp;</td>
                <td><p id="g"><script>document.write(getCookie('college'));</script> </p></td>
            </tr>
            <tr>
                <td><label for="city"><b>City of the College/University:</b></label>&nbsp; &nbsp;</td>
                <td><p id="h"><script>document.write(getCookie('city'));</script> </p></td>
            </tr>
            <tr>
                <td><label for="degree"><b>Degree:</b></label>&nbsp; &nbsp;</td>
                <td><p id="i"><script>document.write(getCookie('degree'));</script> </p></td>
            </tr>
            <tr>
                <td><label for="branch"><b>Branch:</b></label>&nbsp; &nbsp;</td>
                <td><p id="j"><script>document.write(getCookie('branch'));</script> </p></td>
            </tr>
            <tr>
                <td><label for="semester"><b>Semester/Trimester:</b></label>&nbsp; &nbsp;</td>
                <td><p id="k"><script>document.write(getCookie('semester'));</script> </p></td>
            </tr>
            <tr>
                <td><label for="id"><b>College ID Number:</b></label>&nbsp; &nbsp;</td>
                <td><p id="l"><script>document.write(getCookie('id'));</script> </p><br></td>
            </tr>
        </table>
        <br><br>
        <table width="70%" border="1">
            <tr>
                <th colspan="2"><span class="heads"><u><b>BANK AND DD DETAILS:</b></u></span></th>
            </tr>
            <tr>
                <td><label for="fee"><b>Fee Amount:</b></label>&nbsp; &nbsp;</td>
                <td><p id="m"><script>document.write(getCookie('fee'));</script> </p></td>
            </tr>
            <tr>
                <td><label for="bank"><b>Bank Name:</b></label>&nbsp;&nbsp;</td>
                <td><p id="n"><script>document.write(getCookie('bank'));</script> </p></td>
            </tr>
            <tr>
                <td><label for="dd"><b>DD No.:</b></label>&nbsp; &nbsp;</td>
                <td><p id="o"><script>document.write(getCookie('dd'));</script> </p></td>
            </tr>
            <tr>
                <td><label for="date"><b>Dated:</b></label>&nbsp;&nbsp;</td>
                <td><p id="p"><script>document.write(getCookie('date'));</script> </td>
            </tr>
            <tr>
                <td><label for="ref"><b>Reference:</b></label>&nbsp; &nbsp;</td>
                <td><p id="q"><script>document.write(getCookie('ref'));</script> </td>
            </tr>
        </table>
        <br><br><br>
        <p><b><center>NOTE: Please take a moment to review the form before submitting it. Once submitted, you won't be able to make any changes.</center></p>
        <center>
            <input type="button" value="Print Form" onclick="validate(); window.print();">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <input type="button" value="Go back" onclick="location.href='reg.php';">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <input type="submit" value="Confirm?" id="submit">
        </center>
    </form>
</body>
</html>






